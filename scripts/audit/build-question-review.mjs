// Builds audit/question-review.csv: one row per question, merging the content metrics, the three solver
// panels, the adversarial review and the S1 claim findings into a verdict and defect codes.
// Usage: node scripts/audit/build-question-review.mjs <solver-dir> <answer-key.json>
//   solver-dir holds blind-answers.json, options-only-answers.json, blueprint-answers.json.
import fs from "fs";
import path from "path";
import { loadContent, plain, ABSOLUTE, ROOT } from "./lib.mjs";

const [solverDir, keyPath] = process.argv.slice(2);
if (!solverDir || !keyPath) { console.error("usage: build-question-review.mjs <solver-dir> <answer-key.json>"); process.exit(2); }
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
const load = f => Object.fromEntries(JSON.parse(fs.readFileSync(path.join(solverDir, f), "utf8")).map(a => [a.id, a]));
const blind = load("blind-answers.json"), opts = load("options-only-answers.json"), bp = load("blueprint-answers.json");

// Minimal CSV reader for the audit's own quoted CSV files.
function readCsv(file) {
  const text = fs.readFileSync(file, "utf8"), rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}
const adv = Object.fromEntries(readCsv(path.join(ROOT, "audit/work/adversarial-review.csv")).map(r => [r.id, r]));
const claims = readCsv(path.join(ROOT, "audit/claims-log.csv"));

const { questions: Q } = loadContent();
const esc = v => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const out = [["id", "ts", "scenario", "domain", "verdict", "defect_codes", "key_agreement", "length_rank", "len_ratio", "adversarial", "s1_claims", "fix_summary"]];
const tally = {};

for (const q of Q) {
  const lens = q.options.map(o => plain(o.t).length), ci = q.options.findIndex(o => o.ok);
  const maxD = Math.max(...lens.filter((_, i) => i !== ci)), rank = lens.filter(l => l > lens[ci]).length + 1;
  const k = key[q.id].letter, a = adv[q.id] || {};
  const codes = new Set(), fixes = [];
  const agree = ["blind", "blueprint", "options"].map((n, i) => `${n}:${[blind, bp, opts][i][q.id]?.answer === k ? "Y" : "N"}`).join(" ");

  if (rank === 1) codes.add("CUE-LEN");
  if (opts[q.id]?.answer === k && (opts[q.id].confidence ?? 0) >= 4) codes.add("CUE-PATTERN");
  if (q.options.some(o => !o.ok && ABSOLUTE.test(plain(o.t))) && !ABSOLUTE.test(plain(q.options[ci].t))) codes.add("CUE-ABS");
  if (a.verdict === "BROKEN") { codes.add("KEY"); fixes.push(`re-key or rewrite: ${a.fix}`); }
  if (a.verdict === "CONTESTABLE") codes.add("AMB");
  for (const s of [blind[q.id], bp[q.id]]) for (const f of s?.flags || []) {
    if (f === "ambiguous") codes.add("AMB");
    if (f === "too-close-to-official-sample") codes.add("SAMPLE-CLOSE");
    if (f === "exam-vs-today-gap") codes.add("TERM");
    if (f === "factually-dubious") codes.add("WHY");
  }
  if (a.why_issues && !/^(none|-|)$/i.test(a.why_issues.trim())) { codes.add("WHY"); fixes.push(`why: ${a.why_issues}`); }
  if (a.trap_issues && !/^(none|-|)$/i.test(a.trap_issues.trim())) { codes.add("TRAP"); fixes.push(`trap: ${a.trap_issues}`); }
  if (q.scenario == null) codes.add("STEM");
  const s1 = claims.filter(c => c.severity === "S1" && new RegExp(`\\b${q.id}\\b`).test(c.location)).map(c => c.claim_id);
  if (s1.length) codes.add("TERM");

  // Verdict: content defects force a rewrite; cue-only items keep stem and key but get new distractors (backlog Q1).
  let verdict;
  if (codes.has("KEY") || codes.has("SAMPLE-CLOSE") || (codes.has("AMB") && !codes.has("TERM"))) verdict = "REWRITE";
  else if (codes.has("CUE-PATTERN") || codes.has("CUE-LEN")) verdict = "REWRITE-DISTRACTORS";
  else if (codes.size) verdict = "EDIT-MINOR";
  else verdict = "KEEP";
  if (codes.has("SAMPLE-CLOSE")) fixes.unshift("test a different decision within the same task statement (too close to an official sample)");
  if (verdict === "REWRITE-DISTRACTORS") fixes.unshift("equally-expert distractors; rebalance lengths (solver-results.md standard)");
  if (codes.has("TERM")) fixes.push("add Real-world-today note; keep exam key");
  tally[verdict] = (tally[verdict] || 0) + 1;

  out.push([q.id, q.ts, q.scenario ?? "", "D" + q.ts[0], verdict, [...codes].sort().join(";"), agree, rank, (lens[ci] / maxD).toFixed(2), a.verdict || "", s1.join(";"), fixes.join(" | ")]);
}
fs.writeFileSync(path.join(ROOT, "audit/question-review.csv"), out.map(r => r.map(esc).join(",")).join("\n") + "\n");
console.log(`Wrote ${out.length - 1} rows to audit/question-review.csv`, JSON.stringify(tally));
