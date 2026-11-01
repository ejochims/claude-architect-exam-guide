// Headless end-to-end check of the study app: every lesson step and widget, drills, mock exam,
// Readiness Check, flashcards and reference pages, at desktop (light) and phone (dark) sizes.
// Fails on any page error, console error or horizontal overflow.
// Usage: node scripts/audit/browser-suite.mjs
import { createRequire } from "module";
import path from "path";
import { ROOT } from "./lib.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const URL = "file://" + path.join(ROOT, "app/index.html");
const problems = [];
let checks = 0;

async function run(viewport, colorScheme) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport, colorScheme });
  const tag = `${viewport.width}px ${colorScheme}`;
  page.on("pageerror", e => problems.push(`${tag} pageerror: ${e.message}`));
  page.on("console", m => { if (m.type() === "error") problems.push(`${tag} console: ${m.text()}`); });
  const visit = async hash => {
    await page.goto(URL + hash); await page.waitForTimeout(60); checks++;
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (over > 1) problems.push(`${tag} ${hash}: horizontal overflow ${over}px`);
  };

  // Every lesson step, plus a few interactions inside each widget.
  const mods = await (async () => { await page.goto(URL); return page.evaluate(() => window.MODULES.map(m => [m.id, window.LESSONS[m.id].steps.length])); })();
  for (const [id, n] of mods) for (let i = 1; i <= n; i++) {
    await visit(`#${id}-${i}`);
    const btns = page.locator("#app .widget button, #app [data-widget] button, #app .sorter button");
    const k = Math.min(await btns.count(), 4);
    for (let j = 0; j < k; j++) { try { await btns.nth(j).click({ timeout: 500 }); } catch (e) { /* hidden or disabled controls are fine */ } }
    const opt = page.locator("#app .q .opt").first();
    if (await opt.count()) await opt.click();
  }
  for (const h of ["#", "#plan", "#practice", "#blueprint", "#today", "#glossary", "#principles", "#exam-day", "#cards"]) await visit(h);
  // Principles: every entry renders, search narrows, rules-only hides the detail.
  await visit("#principles");
  const pn = await page.evaluate(() => [document.querySelectorAll(".pr-card").length, window.PRINCIPLES.length]);
  if (pn[0] !== pn[1]) problems.push(`${tag}: principles page shows ${pn[0]} of ${pn[1]}`);
  await page.locator("#pq").fill("escalat"); await page.waitForTimeout(40);
  const pf = await page.locator(".pr-card").count();
  if (!pf || pf >= pn[1]) problems.push(`${tag}: principles search didn't narrow (${pf})`);
  await page.locator("#pq").fill(""); await page.locator("#pc").check(); await page.waitForTimeout(40);
  if (await page.locator(".pr-why").first().isVisible()) problems.push(`${tag}: rules-only didn't hide explanations`);
  checks++;

  await studyChecks(page, tag, visit);

  // Each scenario drill: answer the first question and advance. A multiple-response item needs its full set, then "Check answer".
  const answerCard = async () => {
    const opts = page.locator(".q .opt"); await opts.first().click();
    if (await page.locator(".q .multi-bar").count()) { await opts.nth(1).click(); await page.locator(".q .multi-bar .btn").click(); }
  };
  for (let s = 1; s <= 6; s++) { await visit(`#drill-${s}`); await answerCard(); await page.locator("#dnext").click(); checks++; }
  await multiChecks(page, tag, visit);

  // Flashcards: flip and grade one card.
  await visit("#cards");
  const flip = page.locator("#app button").first(); if (await flip.count()) { await flip.click(); checks++; }

  // Mock exam: begin, answer a few, submit, view the result.
  await page.evaluate(() => localStorage.clear());
  await visit("#mock"); await page.locator("#begin").click();
  for (let i = 0; i < 3; i++) { await page.locator(".q .opt").nth(i).click(); await page.locator("#mnext").click(); }
  await page.locator("#msubmit").click(); await page.locator("#msubmit").click(); await page.waitForTimeout(100); checks++;
  if (!(await page.evaluate(() => location.hash === "#mock-result"))) problems.push(`${tag}: mock submit didn't reach the result page`);
  const mockIds = await page.evaluate(() => JSON.parse(localStorage.getItem("cca-study-progress-v1")).mocks[0].wrong.map(w => w[0]));
  if (mockIds.some(id => id.startsWith("h"))) problems.push(`${tag}: mock exam contains holdout items`);
  const mockTotal = await page.evaluate(() => JSON.parse(localStorage.getItem("cca-study-progress-v1")).mocks[0].total);
  if (mockTotal !== 60) problems.push(`${tag}: mock exam should have 60 questions, got ${mockTotal}`);

  // Readiness Check: begin, submit, confirm it's recorded once and covers every holdout item.
  await visit("#readiness"); await page.locator("#rbegin").click(); await page.waitForTimeout(80);
  const qids = await page.evaluate(() => JSON.parse(localStorage.getItem("cca-study-progress-v1")).mock.qids);
  if (qids.length !== 60 || !qids.every(id => id.startsWith("h"))) problems.push(`${tag}: readiness check should be the 60 holdout items, got ${qids.length}`);
  await page.locator(".q .opt").first().click();
  await page.locator("#msubmit").click(); await page.locator("#msubmit").click(); await page.waitForTimeout(100); checks++;
  const rec = await page.evaluate(() => JSON.parse(localStorage.getItem("cca-study-progress-v1")).readiness);
  if (!rec || rec.total !== 60) problems.push(`${tag}: readiness result not recorded`);
  await visit("#readiness");
  if (await page.locator("#rbegin").count()) problems.push(`${tag}: readiness check can be started a second time`);

  await browser.close();

  // Readiness ring: first attempts only, so retrying doesn't raise it. Fresh context, so no earlier answers.
  const b2 = await chromium.launch(), page2 = await b2.newPage({ viewport, colorScheme });
  page2.on("pageerror", e => problems.push(`${tag} pageerror: ${e.message}`));
  await page2.goto(URL + "#m01-5"); await page2.waitForTimeout(60);
  await rings(page2, tag);
  await b2.close();
}

// Multiple response (type "multi"): rendered with "Select k", Check answer enabled only at k picks,
// a wrong set scored wrong, the keyed set right, and the mock scoring all-or-nothing.
async function multiChecks(page, tag, visit) {
  const KEY = "cca-study-progress-v1";
  const items = await page.evaluate(() => window.BANK.filter(q => q.type === "multi").map(q => ({ id: q.id, s: q.scenario, keys: q.options.map((o, i) => o.ok ? i : -1).filter(i => i >= 0), other: q.options.map((o, i) => o.ok ? -1 : i).filter(i => i >= 0) })));
  if (!items.length) return;
  const m = items[0];
  // Preload every other scenario question as answered, so the multi item is the drill's first question.
  const preload = () => page.evaluate(({ id, s, KEY }) => {
    const all = [...Object.values(window.LESSONS).flatMap(l => l.steps.flatMap(st => st.questions || [])), ...window.BANK];
    const answers = {}; for (const q of all) if (q.scenario === s && q.id !== id && !q.holdout) answers[q.id] = { ok: true, choice: 0, at: 1 };
    localStorage.setItem(KEY, JSON.stringify({ v: 1, answers, first: { _seed: { ok: true, at: 1 } } }));
  }, { ...m, KEY });
  // Button positions for given option indices, matched by text (the display order is shuffled).
  const pos = idx => page.evaluate(({ id, idx }) => { const q = window.BANK.find(x => x.id === id); return [...document.querySelectorAll(".q .opt .opt-body")].map((b, p) => idx.some(i => b.innerHTML === q.options[i].t) ? p : -1).filter(p => p >= 0); }, { id: m.id, idx });
  for (const [pick, wantOk] of [[[m.keys[0], m.other[0]], false], [m.keys, true]]) {
    await preload(); await page.goto(URL + `#drill-${m.s}`); await page.reload(); await page.waitForTimeout(80); checks++;
    if (!(await page.locator(".q .multi-chip").count())) { problems.push(`${tag}: multi item ${m.id} not first in drill or missing its Select chip`); return; }
    const ps = await pos(pick), opts = page.locator(".q .opt"), check = page.locator(".q .multi-bar .btn");
    await opts.nth(ps[0]).click();
    if (!(await check.isDisabled())) problems.push(`${tag}: multi Check answer enabled before k picks`);
    await opts.nth(ps[1]).click(); await check.click();
    const got = await page.locator(`.q .q-res.${wantOk ? "ok" : "no"}`).count();
    const first = await page.evaluate(({ id, KEY }) => JSON.parse(localStorage.getItem(KEY)).first[id], { id: m.id, KEY });
    if (!got || !first || first.ok !== wantOk) problems.push(`${tag}: multi ${wantOk ? "keyed" : "wrong"} set not scored ${wantOk ? "right" : "wrong"}`);
  }
  // Mock scoring: one multi item with the keyed set, one with a partial set; expect 1 of 2.
  const [a, b] = [items[0], items[1] || items[0]];
  await page.evaluate(({ a, b, KEY }) => localStorage.setItem(KEY, JSON.stringify({ v: 1, mock: { startedAt: Date.now(), qids: [a.id, b.id], ans: { [a.id]: a.keys, [b.id]: [b.keys[0], b.other[0]] }, flags: {}, scen: [1, 2, 3, 4], cur: 0 } })), { a, b, KEY });
  await page.goto(URL + "#mock"); await page.reload(); await page.waitForTimeout(80); checks++;
  if (!(await page.locator(".q .multi-chip").count())) problems.push(`${tag}: multi chip missing in exam mode`);
  await page.locator("#msubmit").click(); await page.waitForTimeout(100);
  const r = await page.evaluate(KEY => JSON.parse(localStorage.getItem(KEY)).mocks[0], KEY);
  if (!r || r.correct !== 1 || !r.multi || r.multi[0] !== 1 || r.multi[1] !== 2) problems.push(`${tag}: mock multi scoring wrong: ${JSON.stringify(r && { correct: r.correct, multi: r.multi })}`);
  await page.evaluate(KEY => localStorage.removeItem(KEY), KEY);
}

// Study plan, exam-day playbook, misses drill with review links, and progress export/import.
async function studyChecks(page, tag, visit) {
  const KEY = "cca-study-progress-v1";
  await visit("#exam-day");
  if ((await page.locator(".ed-sec").count()) < 5) problems.push(`${tag}: exam-day playbook sections missing`);
  // A first-attempt miss lands in the misses drill; a wrong answer links to its module; a right answer clears it.
  const q = await page.evaluate(KEY => {
    const q = window.BANK.find(x => !x.holdout && x.type !== "multi");
    localStorage.setItem(KEY, JSON.stringify({ v: 1, answers: {}, first: { [q.id]: { ok: false, at: 1 } } }));
    return { id: q.id, right: q.options.findIndex(o => o.ok), wrong: q.options.findIndex(o => !o.ok) };
  }, KEY);
  const optPos = i => page.evaluate(({ id, i }) => { const q = window.BANK.find(x => x.id === id); return [...document.querySelectorAll(".q .opt .opt-body")].findIndex(b => b.innerHTML === q.options[i].t); }, { id: q.id, i });
  await page.goto(URL + "#drill-misses"); await page.reload(); await page.waitForTimeout(80); checks++;
  if ((await page.locator(".q").count()) !== 1) problems.push(`${tag}: misses drill should show the 1 missed question`);
  await page.locator(".q .opt").nth(await optPos(q.wrong)).click();
  if (!(await page.locator(".q .review-link").count())) problems.push(`${tag}: wrong answer has no review link to its module`);
  await page.goto(URL + "#drill-misses"); await page.reload(); await page.waitForTimeout(80);
  await page.locator(".q .opt").nth(await optPos(q.right)).click();
  await page.goto(URL + "#practice"); await page.reload(); await page.waitForTimeout(80); checks++;
  if (!(await page.getByText("Nothing to retry yet").count())) problems.push(`${tag}: a corrected miss stayed in the misses list`);
  // Plan: save an exam date; the home page follows it.
  await visit("#plan");
  await page.locator("#exd").fill("2026-12-10"); await page.locator("#exsave").click(); await page.waitForTimeout(60); checks++;
  const ex = await page.evaluate(KEY => (JSON.parse(localStorage.getItem(KEY)).plan || {}).examDate, KEY);
  if (ex !== "2026-12-10") problems.push(`${tag}: exam date not saved (${ex})`);
  await page.goto(URL + "#path"); await page.reload(); await page.waitForTimeout(60);
  if (!(await page.locator(".hero h1").textContent()).includes("10")) problems.push(`${tag}: home page doesn't show the saved exam date`);
  // Export, then import the same file: it must merge without an error.
  await page.goto(URL + "#plan"); await page.reload(); await page.waitForTimeout(60);
  const [dl] = await Promise.all([page.waitForEvent("download"), page.locator("#pexport").click()]);
  const file = await dl.path(); checks++;
  if (!file) problems.push(`${tag}: progress download failed`);
  else {
    await page.locator("#pimport").setInputFiles(file); await page.waitForTimeout(200);
    if (((await page.locator("#pmsg").textContent()) || "").includes("isn't")) problems.push(`${tag}: importing an exported backup failed`);
  }
  // Progress over time and trap profile: weekly first attempts, a mock row, and a tagged wrong pick.
  await page.evaluate(KEY => {
    const qs = window.BANK.filter(x => !x.holdout && x.type !== "multi");
    const t = qs.find(x => x.options.some(o => !o.ok && o.trap)), ti = t.options.findIndex(o => !o.ok && o.trap);
    const now = Date.now(), first = {}, answers = { [t.id]: { ok: false, choice: ti, at: now } };
    qs.slice(0, 12).forEach((x, i) => { first[x.id] = { ok: i % 3 !== 0, at: now - (i % 2) * 8 * 864e5 }; });
    first[t.id] = { ok: false, at: now };
    const mock = { kind: "mock", at: now, startedAt: now - 3600e3, correct: 40, total: 60, pct: 0.67, wpct: 0.68, ci: [0.54, 0.77], scen: [1, 2, 3, 4], dom: { d1: [12, 16], d2: [8, 11], d3: [8, 12], d4: [7, 12], d5: [5, 9] }, wrong: [[t.id, ti]], multi: [0, 0], mins: 60 };
    localStorage.setItem(KEY, JSON.stringify({ v: 1, first, answers, mocks: [mock] }));
  }, KEY);
  await page.goto(URL + "#practice"); await page.reload(); await page.waitForTimeout(100); checks++;
  if ((await page.locator(".trend-table").count()) < 2) problems.push(`${tag}: progress tables missing (weekly and mock)`);
  if ((await page.locator(".trap-row").count()) < 1) problems.push(`${tag}: trap profile shows no rows for a tagged wrong pick`);
  await page.goto(URL + "#mock-result"); await page.reload(); await page.waitForTimeout(100);
  if ((await page.locator(".trap-row").count()) < 1) problems.push(`${tag}: mock result shows no trap patterns`);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (over > 1) problems.push(`${tag}: mock result overflows by ${over}px`);
  await page.evaluate(KEY => localStorage.removeItem(KEY), KEY);
}

async function rings(page, tag) {
  const before = () => page.evaluate(() => JSON.parse(localStorage.getItem("cca-study-progress-v1") || "{}").first || {});
  await page.locator(".q .opt").first().click();
  const f1 = await before();
  const again = page.locator(".linkbtn", { hasText: "Try again" }).first();
  if (await again.count()) { await again.click(); await page.locator(".q .opt").nth(1).click(); }
  const f2 = await before(); checks++;
  if (!Object.keys(f1).length) problems.push(`${tag}: answering didn't record a first attempt`);
  if (JSON.stringify(f1) !== JSON.stringify(f2)) problems.push(`${tag}: retry changed a first attempt`);
}

await run({ width: 1280, height: 900 }, "light");
await run({ width: 390, height: 844 }, "dark");
console.log(`${checks} checks · ${problems.length ? `${problems.length} problems:\n  ` + problems.join("\n  ") : "no problems"}`);
process.exit(problems.length ? 1 : 0);
