// Scores an independent solver's answers against the answer key and lists disagreements for review.
// Usage: node scripts/audit/score-solver.mjs <answers.json> <answer-key.json> [--json]
// answers.json: [{ id, answer, confidence?, second?, flags?, note? }]; key: { id: { letter, ts, scenario } }
import fs from "fs";

const [answersPath, keyPath] = process.argv.slice(2).filter(a => !a.startsWith("--"));
if (!answersPath || !keyPath) { console.error("usage: score-solver.mjs <answers.json> <answer-key.json> [--json]"); process.exit(2); }
const answers = JSON.parse(fs.readFileSync(answersPath, "utf8"));
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));

const byDomain = {}, rows = [];
let right = 0;
for (const a of answers) {
  const k = key[a.id];
  if (!k) { console.error(`unknown id ${a.id}`); continue; }
  const ok = a.answer === k.letter;
  const d = "d" + k.ts[0];
  byDomain[d] = byDomain[d] || [0, 0];
  byDomain[d][1]++;
  if (ok) { right++; byDomain[d][0]++; }
  const flags = a.flags || [];
  // Worth a reviewer's look: a miss, a defensible second option that is the key, or any quality flag.
  if (!ok || (a.second && a.second !== a.answer) || flags.length)
    rows.push({ id: a.id, ts: k.ts, key: k.letter, answer: a.answer, second: a.second || "", confidence: a.confidence ?? "", flags: flags.join(";"), note: a.note || "", miss: !ok });
}
const missing = Object.keys(key).filter(id => !answers.some(a => a.id === id));
const report = {
  answered: answers.length, missing, accuracy: Math.round((1000 * right) / answers.length) / 10,
  byDomain: Object.fromEntries(Object.entries(byDomain).sort().map(([d, [r, n]]) => [d, `${r}/${n}`])),
  misses: rows.filter(r => r.miss).length,
  flagged: rows.filter(r => r.flags).length,
  review: rows.sort((a, b) => b.miss - a.miss || a.id.localeCompare(b.id))
};
if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`Answered ${report.answered}/${Object.keys(key).length} · accuracy ${report.accuracy}% · by domain ${JSON.stringify(report.byDomain)}`);
  console.log(`Disagreements with key: ${report.misses} · items with quality flags: ${report.flagged}`);
  for (const r of report.review) console.log(`  ${r.miss ? "MISS" : "flag"} ${r.id} (${r.ts}) key=${r.key} ans=${r.answer}${r.second ? ` alt=${r.second}` : ""} c=${r.confidence} ${r.flags} ${r.note}`);
}
