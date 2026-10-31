// Content audit: structural invariants (fail the run) and coverage/bias metrics (reported against targets).
// Usage: node scripts/audit/content-check.mjs [--json]
import { loadContent, domainOf, optionOrder, plain, ABSOLUTE } from "./lib.mjs";

const { blueprint: B, modules, questions: Q, cards, traps } = loadContent();
const json = process.argv.includes("--json");
const errors = [], warnings = [];
const count = (arr, key) => arr.reduce((a, x) => ((a[key(x)] = (a[key(x)] || 0) + 1), a), {});
const pct = (n, d) => (d ? Math.round((1000 * n) / d) / 10 : 0);

// ---------- Invariants ----------
const ids = new Set();
for (const q of Q) {
  if (ids.has(q.id)) errors.push(`duplicate id ${q.id}`);
  ids.add(q.id);
  if (!B.tasks[q.ts]) errors.push(`${q.id}: unknown task statement ${q.ts}`);
  const ok = q.options.filter(o => o.ok).length;
  if (q.type === "multi") {
    // Multiple response: 5 options, 2 or 3 keyed, all-or-nothing. The stem must say how many to pick.
    if (q.options.length !== 5) errors.push(`${q.id}: multi item with ${q.options.length} options (want 5)`);
    if (ok < 2 || ok > 3) errors.push(`${q.id}: multi item with ${ok} correct options (want 2 or 3)`);
    const word = { 2: "TWO", 3: "THREE" }[ok];
    if (!new RegExp(`Select ${word}\\b`).test(plain(q.stem))) errors.push(`${q.id}: multi stem must say "Select ${word}"`);
    if (q.family) errors.push(`${q.id}: multi items can't be in an option family`);
    if (q.holdout) errors.push(`${q.id}: multi items are practice only (the Readiness Check stays single-answer)`);
    if (q.scenario == null) errors.push(`${q.id}: multi item needs a scenario`);
  } else {
    if (q.type) errors.push(`${q.id}: unknown type ${q.type}`);
    if (q.options.length !== 4) errors.push(`${q.id}: ${q.options.length} options`);
    if (ok !== 1) errors.push(`${q.id}: ${ok} correct options`);
  }
  for (const b of q.bl || []) if (!/^[1-5]\.[1-7]-[KS]\d+$/.test(b) || !b.startsWith(q.ts + "-")) errors.push(`${q.id}: bad bullet id ${b}`);
  for (const o of q.options) {
    if (!o.why) errors.push(`${q.id}: option without explanation`);
    if (o.trap && !traps[o.trap]) errors.push(`${q.id}: unknown trap ${o.trap}`);
    // Allowed only for negated stems ("which is NOT real"), where the keyed option is itself the trap.
    if (o.trap && o.ok) (/<strong>not<\/strong>|\bnot\b/i.test(q.stem) ? warnings : errors).push(`${q.id}: correct option carries a trap tag`);
  }
}
for (const m of modules) for (const t of m.tasks) if (!B.tasks[t]) errors.push(`${m.id}: unknown task ${t}`);

// ---------- Option families ----------
// Members share all four option texts and key different options, so a solver that sees only the options
// can answer at most one member of each family correctly.
const fam = {};
for (const q of Q) if (q.family) (fam[q.family] = fam[q.family] || []).push(q);
const optSet = q => q.options.map(o => plain(o.t)).sort().join("\u0001");
for (const [f, qs] of Object.entries(fam)) {
  if (qs.length < 2) errors.push(`family ${f}: only ${qs.length} member`);
  if (new Set(qs.map(optSet)).size > 1) errors.push(`family ${f}: option texts differ between members`);
  const keys = qs.map(q => plain(q.options.find(o => o.ok)?.t ?? ""));
  if (new Set(keys).size !== keys.length) errors.push(`family ${f}: two members key the same option`);
  // Holdout families pair one Readiness Check question with practice twins; practice families have no holdout member.
  if (qs.filter(q => q.holdout).length > 1) errors.push(`family ${f}: more than one holdout member`);
  if (new Set(qs.map(q => q.ts)).size > 1) errors.push(`family ${f}: members test different task statements`);
}
const famQs = Object.values(fam).flat();

// ---------- Coverage ----------
const perTask = Object.fromEntries(Object.keys(B.tasks).map(t => [t, 0]));
Q.forEach(q => perTask[q.ts]++);
const perDomain = count(Q, q => domainOf(q.ts));
const domainTarget = Object.fromEntries(B.domains.map(d => [d.id, d.weight]));
const perScenario = count(Q, q => q.scenario ?? "none");
const scenDomain = {};
for (const q of Q) { const s = q.scenario ?? "none"; (scenDomain[s] = scenDomain[s] || {})[domainOf(q.ts)] = (scenDomain[s]?.[domainOf(q.ts)] || 0) + 1; }
const tasksUntaught = Object.keys(B.tasks).filter(t => !modules.some(m => m.tasks.includes(t)));

// ---------- Answer cueing ----------
let longest = 0, strictlyLongest = 0, over125 = 0, over15 = 0, maxRatio = 0;
const lenRank = [0, 0, 0, 0];
let absOk = 0, absWrong = 0, tagged = 0, distractors = 0;
const origPos = [0, 0, 0, 0], shownPos = [0, 0, 0, 0];
const ratios = [];
// Length and position cues are single-answer statistics; multi items are reported by cue-baselines.mjs.
const QS = Q.filter(q => q.type !== "multi"), QM = Q.filter(q => q.type === "multi");
for (const q of QS) {
  const lens = q.options.map(o => plain(o.t).length);
  const ci = q.options.findIndex(o => o.ok);
  const c = lens[ci], maxD = Math.max(...lens.filter((_, i) => i !== ci));
  const r = c / maxD;
  ratios.push({ id: q.id, ratio: Math.round(r * 100) / 100 });
  maxRatio = Math.max(maxRatio, r);
  if (c >= maxD) longest++;
  if (c > maxD) strictlyLongest++;
  if (r > 1.25) over125++;
  if (r > 1.5) over15++;
  lenRank[lens.filter(l => l > c).length]++;
  q.options.forEach(o => {
    if (ABSOLUTE.test(plain(o.t))) o.ok ? absOk++ : absWrong++;
    if (!o.ok) { distractors++; if (o.trap) tagged++; }
  });
  origPos[ci]++;
  shownPos[optionOrder(q).indexOf(ci)]++;
}
const trapUse = count(Q.flatMap(q => q.options.filter(o => o.trap)), o => o.trap);

// ---------- Mock-exam feasibility (mirrors startMock in app/app.js) ----------
const scen = B.scenarios.map(s => s.n);
const draws = [];
for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) for (let c = b + 1; c < 6; c++) for (let d = c + 1; d < 6; d++) draws.push([scen[a], scen[b], scen[c], scen[d]]);
const mock = draws.map(draw => {
  const pool = Q.filter(q => !q.holdout && draw.includes(q.scenario));
  const short = B.domains.map(d => ({ d: d.id, need: Math.round(d.weight * 0.6), have: pool.filter(q => domainOf(q.ts) === d.id).length })).filter(x => x.have < x.need);
  // The mock borrows a short domain's items from other scenarios, so a draw fails only if the whole bank is short.
  const borrowed = short.reduce((a, x) => a + x.need - x.have, 0);
  const bankShort = B.domains.filter(d => Q.filter(q => !q.holdout && q.scenario && domainOf(q.ts) === d.id).length < Math.round(d.weight * 0.6)).map(d => d.id);
  return { draw: draw.join(","), pool: pool.length, poolCoveredBy60: pct(Math.min(60, pool.length), pool.length), short, borrowed, bankShort };
});

const report = {
  totals: { questions: Q.length, cards: cards.length, modules: modules.length, lessonQuestions: Q.filter(q => q.src !== "bank" && q.src !== "holdout").length, bankQuestions: Q.filter(q => q.src === "bank").length, holdoutQuestions: Q.filter(q => q.src === "holdout").length },
  multi: { n: QM.length, perDomain: count(QM, q => domainOf(q.ts)), ids: QM.map(q => q.id) },
  perTask, tasksBelow5: Object.entries(perTask).filter(([, n]) => n < 5).map(([t, n]) => `${t}:${n}`), tasksUntaught,
  perDomain: Object.fromEntries(Object.entries(perDomain).map(([d, n]) => [d, { n, pct: pct(n, Q.length), target: domainTarget[d] }])),
  perScenario, scenarioByDomain: scenDomain,
  cueing: {
    correctIsLongestOrTied: { n: longest, pct: pct(longest, QS.length), target: "<=30%" },
    correctStrictlyLongest: { n: strictlyLongest, pct: pct(strictlyLongest, QS.length) },
    correctLengthRank: { longest: lenRank[0], second: lenRank[1], third: lenRank[2], shortest: lenRank[3] },
    ratioOver125: over125, ratioOver15: over15, maxRatio: Math.round(maxRatio * 100) / 100,
    worstRatios: ratios.sort((a, b) => b.ratio - a.ratio).slice(0, 10),
    absoluteWording: { correctPct: pct(absOk, QS.length), distractorPct: pct(absWrong, distractors), target: "within 5 points" },
    authoredPosition: origPos, displayedPosition: shownPos
  },
  traps: { taggedDistractors: tagged, distractors, taggedPct: pct(tagged, distractors), use: trapUse },
  mock: { draws: mock.length, infeasible: mock.filter(m => m.bankShort.length).length, needBorrowing: mock.filter(m => m.borrowed).length, maxBorrowed: Math.max(...mock.map(m => m.borrowed)), unscenarioed: Q.filter(q => q.scenario == null).map(q => q.id), detail: mock },
  families: { n: Object.keys(fam).length, questions: famQs.length, holdoutInFamilies: famQs.filter(q => q.holdout).length, holdoutTotal: Q.filter(q => q.holdout).length, optionsOnlyCeiling: pct(Object.keys(fam).length, famQs.length) },
  negatedStems: Q.filter(q => /<strong>not<\/strong>|\bNOT\b|\bexcept\b/.test(q.stem)).map(q => q.id),
  cardsPerModule: count(cards, c => c.module),
  errors, warnings
};

if (json) console.log(JSON.stringify(report, null, 2));
else {
  const r = report, c = r.cueing;
  console.log(`Questions ${r.totals.questions} (lessons ${r.totals.lessonQuestions}, bank ${r.totals.bankQuestions}, holdout ${r.totals.holdoutQuestions}) · cards ${r.totals.cards} · modules ${r.totals.modules}`);
  console.log(`Per task statement: ${Object.entries(r.perTask).map(([t, n]) => `${t}=${n}`).join(" ")}`);
  console.log(`Task statements below 5 questions: ${r.tasksBelow5.length} (${r.tasksBelow5.join(", ")})`);
  console.log(`Per domain (actual% / target%): ${Object.entries(r.perDomain).sort().map(([d, v]) => `${d} ${v.n} (${v.pct}/${v.target})`).join(" · ")}`);
  console.log(`Per scenario: ${JSON.stringify(r.perScenario)}`);
  console.log(`Multiple-response items: ${r.multi.n} ${JSON.stringify(r.multi.perDomain)}`);
  console.log(`Correct option longest-or-tied (single-answer only): ${c.correctIsLongestOrTied.n}/${r.totals.questions - r.multi.n} (${c.correctIsLongestOrTied.pct}%), strictly longest ${c.correctStrictlyLongest.pct}% · length rank ${JSON.stringify(c.correctLengthRank)}`);
  console.log(`Correct/longest-distractor ratio: >1.25 in ${c.ratioOver125}, >1.5 in ${c.ratioOver15}, max ${c.maxRatio}`);
  console.log(`Absolute wording: correct ${c.absoluteWording.correctPct}% vs distractors ${c.absoluteWording.distractorPct}%`);
  console.log(`Correct position — authored ${JSON.stringify(c.authoredPosition)}, displayed ${JSON.stringify(c.displayedPosition)}`);
  console.log(`Trap tags on distractors: ${r.traps.taggedDistractors}/${r.traps.distractors} (${r.traps.taggedPct}%) ${JSON.stringify(r.traps.use)}`);
  console.log(`Mock draws that can't meet domain quotas: ${r.mock.infeasible}/${r.mock.draws} · draws that borrow from other scenarios: ${r.mock.needBorrowing}/${r.mock.draws} (max ${r.mock.maxBorrowed} of 60) · questions with no scenario: ${r.mock.unscenarioed.length}`);
  const F = r.families;
  console.log(`Option families: ${F.n} (${F.questions} questions) · holdout in families ${F.holdoutInFamilies}/${F.holdoutTotal} · options-only ceiling across family members ${F.optionsOnlyCeiling}%`);
  if (warnings.length) console.log(`Warnings: ${warnings.join("; ")}`);
  console.log(errors.length ? `\nINVARIANT FAILURES (${errors.length}):\n  ${errors.join("\n  ")}` : "\nInvariants: OK");
}
process.exit(errors.length ? 1 : 0);
