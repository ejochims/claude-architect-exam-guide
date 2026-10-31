// Heuristic "test-wise" solvers that never read the stem. If any beats ~35% (chance is 25%),
// the options themselves leak the answer.
// Usage: node scripts/audit/cue-baselines.mjs [--json]
import { loadContent, plain, ABSOLUTE } from "./lib.mjs";

const all = loadContent().questions;
// --ts 1 (or 1.4) limits the run to one domain or task statement, to gate a rewrite batch on its own.
const tsArg = process.argv.includes("--ts") ? process.argv[process.argv.indexOf("--ts") + 1] : null;
// --set holdout|practice gates the sequestered Readiness Check items separately from the practice bank.
const setArg = process.argv.includes("--set") ? process.argv[process.argv.indexOf("--set") + 1] : null;
const inSet = q => !setArg || (setArg === "holdout") === !!q.holdout;
const Q = all.filter(q => inSet(q) && (!tsArg || q.ts === tsArg || q.ts.startsWith(tsArg + ".")));
const HEDGE = /\b(first|then|before|specific|explicit|targeted|only the|instead|rather than|so that|e\.g\.|because)\b/gi;
const TECH = /<code>|[A-Za-z]+_[a-z_]+|--[a-z-]+|\.[a-z]+\b|`/g;

// Each solver scores options; the highest score wins (ties go to the first, as a test-taker would).
const solvers = {
  "pick-longest": o => plain(o.t).length,
  "pick-most-hedged": o => (plain(o.t).match(HEDGE) || []).length,
  "pick-least-absolute": o => (ABSOLUTE.test(plain(o.t)) ? 0 : 1),
  "pick-most-technical": o => (o.t.match(TECH) || []).length,
  "pick-most-clauses": o => (plain(o.t).match(/[,;:]/g) || []).length,
  // The cues an options-only solver reported using: concreteness, and an "enforce it in code" expert tone.
  "pick-most-concrete": o => (o.t.match(/<code>|\b[a-z]+_[a-z_]+\b|--?[a-z][a-z-]+|\b\d+\b|\.[a-z]{2,4}\b|"[^"]+"/g) || []).length + plain(o.t).split(/\s+/).length / 20,
  // Inverse cues catch over-correction: a rewrite that always makes the key shortest is just as guessable.
  "pick-shortest": o => -plain(o.t).length,
  "pick-least-concrete": o => -((o.t.match(/<code>|\b[a-z]+_[a-z_]+\b|--?[a-z][a-z-]+|\b\d+\b|\.[a-z]{2,4}\b|"[^"]+"/g) || []).length + plain(o.t).split(/\s+/).length / 20),
  "pick-enforce-in-code": o => (plain(o.t).match(/\b(hook|code|programmatic|deterministic|schema|validat\w*|structured|explicit|specific|gate|block|enforce\w*|custom_id|isError|before|instead)\b/gi) || []).length
};

// Multiple-response items: the solver picks its top k options (k = keys, stated in the stem).
// Credit is the chance a random tie-break yields exactly the keyed set. Chance for "choose 2 of 5" is 10%.
const QM = Q.filter(q => q.type === "multi");
const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; };
const multiCredit = (q, s) => {
  const k = q.options.filter(o => o.ok).length, cut = [...s].sort((x, y) => y - x)[k - 1];
  const above = s.map((v, i) => v > cut ? i : -1).filter(i => i >= 0), tied = s.map((v, i) => v === cut ? i : -1).filter(i => i >= 0);
  if (above.some(i => !q.options[i].ok)) return 0;
  const keyedTied = tied.filter(i => q.options[i].ok).length;
  return keyedTied === k - above.length ? 1 / binom(tied.length, k - above.length) : 0;
};
const results = {}, multiResults = {};
for (const [name, score] of Object.entries(solvers)) {
  let mr = 0;
  for (const q of QM) mr += multiCredit(q, q.options.map(score));
  multiResults[name] = { accuracy: QM.length ? Math.round((1000 * mr) / QM.length) / 10 : 0 };
}
const QS = Q.filter(q => q.type !== "multi");
for (const [name, score] of Object.entries(solvers)) {
  let right = 0;
  const hits = [];
  for (const q of QS) {
    const s = q.options.map(score);
    const best = Math.max(...s);
    // Split credit across ties so a non-discriminating heuristic scores ~25%.
    const tied = s.map((v, i) => (v === best ? i : -1)).filter(i => i >= 0);
    const credit = tied.some(i => q.options[i].ok) ? 1 / tied.length : 0;
    right += credit;
    if (credit === 1) hits.push(q.id);
  }
  results[name] = { accuracy: Math.round((1000 * right) / QS.length) / 10, uniqueHits: hits.length, hits };
}

if (process.argv.includes("--json")) console.log(JSON.stringify({ single: results, multi: multiResults }, null, 2));
else {
  console.log(`Stem-blind heuristic solvers over ${QS.length} single-answer questions (chance = 25%, target <= 35%)`);
  for (const [n, r] of Object.entries(results)) console.log(`  ${n.padEnd(22)} ${String(r.accuracy).padStart(5)}%  ${r.accuracy > 35 ? "FAIL" : "ok"}`);
  if (QM.length) {
    console.log(`Multiple-response items: ${QM.length} (top-k picks; chance = 10% for choose 2 of 5, target <= 25%)`);
    for (const [n, r] of Object.entries(multiResults)) console.log(`  ${n.padEnd(22)} ${String(r.accuracy).padStart(5)}%  ${r.accuracy > 25 ? "FAIL" : "ok"}`);
  }
}
