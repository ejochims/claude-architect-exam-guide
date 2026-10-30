// Heuristic "test-wise" solvers that never read the stem. If any beats ~35% (chance is 25%),
// the options themselves leak the answer.
// Usage: node scripts/audit/cue-baselines.mjs [--json]
import { loadContent, plain, ABSOLUTE } from "./lib.mjs";

const { questions: Q } = loadContent();
const HEDGE = /\b(first|then|before|specific|explicit|targeted|only the|instead|rather than|so that|e\.g\.|because)\b/gi;
const TECH = /<code>|[A-Za-z]+_[a-z_]+|--[a-z-]+|\.[a-z]+\b|`/g;

// Each solver scores options; the highest score wins (ties go to the first, as a test-taker would).
const solvers = {
  "pick-longest": o => plain(o.t).length,
  "pick-most-hedged": o => (plain(o.t).match(HEDGE) || []).length,
  "pick-least-absolute": o => (ABSOLUTE.test(plain(o.t)) ? 0 : 1),
  "pick-most-technical": o => (o.t.match(TECH) || []).length,
  "pick-most-clauses": o => (plain(o.t).match(/[,;:]/g) || []).length
};

const results = {};
for (const [name, score] of Object.entries(solvers)) {
  let right = 0;
  const hits = [];
  for (const q of Q) {
    const s = q.options.map(score);
    const best = Math.max(...s);
    // Split credit across ties so a non-discriminating heuristic scores ~25%.
    const tied = s.map((v, i) => (v === best ? i : -1)).filter(i => i >= 0);
    const credit = tied.some(i => q.options[i].ok) ? 1 / tied.length : 0;
    right += credit;
    if (credit === 1) hits.push(q.id);
  }
  results[name] = { accuracy: Math.round((1000 * right) / Q.length) / 10, uniqueHits: hits.length, hits };
}

if (process.argv.includes("--json")) console.log(JSON.stringify(results, null, 2));
else {
  console.log(`Stem-blind heuristic solvers over ${Q.length} questions (chance = 25%, target <= 35%)`);
  for (const [n, r] of Object.entries(results)) console.log(`  ${n.padEnd(22)} ${String(r.accuracy).padStart(5)}%  ${r.accuracy > 35 ? "FAIL" : "ok"}`);
}
