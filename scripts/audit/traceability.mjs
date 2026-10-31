// Re-rates the 240 blueprint bullets against the current question bank, by ID only (the guide text stays outside the repo).
// Sources of bullet -> question links:
//   audit/work/traceability-A1.csv, -A2.csv   Phase 1 coverage (question_ids column)
//   audit/work/solver-blueprint-answers.json  blueprint-only solver: governing bullets per original item
//   bl: [...] on questions                    bullet tags on items written since (e.g. multiple-response items)
// Questions added in later batches carry only a task-statement tag; they're reported per task statement as
// "unattributed", not guessed onto bullets.
// Usage: node scripts/audit/traceability.mjs [--ts 1.2,3.4] [--json]
import fs from "fs";
import path from "path";
import { ROOT, loadContent } from "./lib.mjs";

const W = path.join(ROOT, "audit/work");
const arg = k => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : null);
const tsFilter = arg("--ts") ? new Set(arg("--ts").split(",")) : null;

// Minimal RFC 4180 parser: quoted fields may contain commas, quotes ("") and newlines.
function parseCSV(text) {
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const [head, ...body] = rows.filter(r => r.length > 1);
  return body.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

const bullets = new Map();
for (const f of ["traceability-A1.csv", "traceability-A2.csv"]) {
  for (const r of parseCSV(fs.readFileSync(path.join(W, f), "utf8"))) {
    if (!/^\d\.\d-[KS]\d+$/.test(r.bullet_id)) continue;
    bullets.set(r.bullet_id, { id: r.bullet_id, ts: r.ts, taught: !!r.lesson_steps.trim(), was: r.rating, q: new Set(r.question_ids.split(";").map(s => s.trim()).filter(Boolean)) });
  }
}
const link = (b, id) => bullets.has(b) && bullets.get(b).q.add(id);
for (const a of JSON.parse(fs.readFileSync(path.join(W, "solver-blueprint-answers.json"), "utf8"))) for (const b of a.bullets || []) link(b, a.id);

const { questions } = loadContent();
const live = new Map(questions.map(q => [q.id, q]));
for (const q of questions) for (const b of q.bl || []) link(b, q.id);

// Rating: TESTED = at least one live question links to it; COVERED-NOT-TESTED = taught in a lesson, no live question; UNMAPPED = neither.
const out = [];
for (const b of [...bullets.values()].sort((x, y) => x.id.localeCompare(y.id, "en", { numeric: true }))) {
  if (tsFilter && !tsFilter.has(b.ts)) continue;
  const liveQ = [...b.q].filter(id => live.has(id)), gone = [...b.q].filter(id => !live.has(id));
  out.push({ ...b, liveQ, gone, rating: liveQ.length ? "TESTED" : b.taught ? "COVERED-NOT-TESTED" : "UNMAPPED" });
}
const linked = new Set(out.flatMap(b => b.liveQ));
const perTs = {};
for (const b of out) {
  const t = (perTs[b.ts] = perTs[b.ts] || { bullets: 0, tested: 0, untested: [], questions: 0, unattributed: 0 });
  t.bullets++; if (b.rating === "TESTED") t.tested++; else t.untested.push(b.id);
}
for (const q of questions) if (perTs[q.ts]) { perTs[q.ts].questions++; if (!linked.has(q.id)) perTs[q.ts].unattributed++; }
const tally = out.reduce((a, b) => ((a[b.rating] = (a[b.rating] || 0) + 1), a), {});
const wasTally = out.reduce((a, b) => ((a[b.was] = (a[b.was] || 0) + 1), a), {});

fs.writeFileSync(path.join(W, "traceability-rerate.csv"), "bullet_id,ts,was,rating,live_question_ids,removed_question_ids\n" + out.map(b => [b.id, b.ts, b.was, b.rating, b.liveQ.join(";"), b.gone.join(";")].join(",")).join("\n") + "\n");

if (process.argv.includes("--json")) console.log(JSON.stringify({ tally, wasTally, perTs, bullets: out.map(({ q, ...b }) => b) }, null, 2));
else {
  console.log(`Bullets re-rated: ${out.length}${tsFilter ? ` (task statements ${[...tsFilter].join(", ")})` : " of 240"}`);
  console.log(`Phase 1 ratings: ${JSON.stringify(wasTally)}`);
  console.log(`Now:             ${JSON.stringify(tally)}`);
  console.log(`Questions linked to at least one bullet: ${linked.size} of ${questions.length}; the rest are unattributed (task-statement tag only).`);
  console.log("Per task statement (tested/bullets · questions · unattributed · untested bullets):");
  for (const [ts, t] of Object.entries(perTs)) console.log(`  ${ts}  ${t.tested}/${t.bullets} · ${t.questions}q · ${t.unattributed} unattributed${t.untested.length ? ` · ${t.untested.join(" ")}` : ""}`);
  console.log("Wrote audit/work/traceability-rerate.csv");
}
