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
  // Scenario briefs: all six render in Module 0's scenario list.
  await visit("#m00-1");
  const briefs = await page.locator(".scen-brief").count(); checks++;
  if (briefs !== 6) problems.push(`${tag}: expected 6 scenario briefs in m00, got ${briefs}`);
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
    if (await page.locator(".q .multi-bar").count()) { const check = page.locator(".q .multi-bar .btn"); for (let k = 1; k < 5 && await check.isDisabled(); k++) await opts.nth(k).click(); await check.click(); } // "Select THREE" needs a third pick
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
  if (qids.length !== 66 || !qids.every(id => id.startsWith("h"))) problems.push(`${tag}: readiness check should be the 66 holdout items, got ${qids.length}`);
  await page.locator(".q .opt").first().click();
  await page.locator("#msubmit").click(); await page.locator("#msubmit").click(); await page.waitForTimeout(100); checks++;
  const rec = await page.evaluate(() => JSON.parse(localStorage.getItem("cca-study-progress-v1")).readiness);
  if (!rec || rec.total !== 66) problems.push(`${tag}: readiness result not recorded`);
  await visit("#readiness");
  if (await page.locator("#rbegin").count()) problems.push(`${tag}: readiness check can be started a second time`);

  // Today's session: the home card lists three parts; the mixed set draws only from finished modules;
  // a right answer marked "not sure" lands in the confidence drill and leaves once confirmed.
  await page.evaluate(() => {
    const now = Date.now(), steps = {};
    for (const id of ["f01", "m01"]) window.LESSONS[id].steps.forEach((s, i) => { steps[`${id}:${s.key || i}`] = now - 2 * 86400000; });
    localStorage.setItem("cca-study-progress-v1", JSON.stringify({ v: 1, updatedAt: now, steps, answers: {}, first: {}, lessonAns: {}, widgets: {}, cards: {}, mocks: [], mock: null, readiness: null, plan: null, removedMocks: [], last: null }));
  });
  await visit("#path"); await page.reload(); await page.waitForTimeout(80);
  if ((await page.locator(".today-list li").count()) !== 3) problems.push(`${tag}: home should list three session parts`);
  await visit("#drill-today");
  const sq = await page.evaluate(() => document.querySelector(".q .q-stem")?.textContent || "");
  const fromM01 = await page.evaluate(t => window.LESSONS.m01.steps.flatMap(s => s.questions || []).concat(window.BANK.filter(q => ["1.1", "5.1"].includes(q.ts))).some(q => q.stem.replace(/<[^>]+>/g, "").slice(0, 40) === t.slice(0, 40)), sq);
  if (!sq || !fromM01) problems.push(`${tag}: session question isn't from a finished module`);
  await page.locator(".q .unsure-btn").click();
  const rightPos = await page.evaluate(() => { const st = JSON.parse(localStorage.getItem("cca-study-progress-v1")); const stem = document.querySelector(".q .q-stem").innerHTML; const all = [...Object.values(window.LESSONS).flatMap(l => l.steps.flatMap(s => s.questions || [])), ...window.BANK]; const q = all.find(x => x.stem === stem); if (!q || q.type === "multi") return -1; const t = q.options.find(o => o.ok).t; return [...document.querySelectorAll(".q .opt .opt-body")].findIndex(n => n.innerHTML === t); });
  if (rightPos >= 0) {
    await page.locator(".q .opt").nth(rightPos).click(); await page.waitForTimeout(60);
    const shaky = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem("cca-study-progress-v1")); return Object.values(s.first).filter(f => f.ok && f.sure === false).length; });
    if ((await shaky()) !== 1) problems.push(`${tag}: a right answer marked not sure wasn't recorded as one`);
    await visit("#drill-shaky");
    if (!(await page.locator(".q .opt").count())) problems.push(`${tag}: confidence drill is empty after a lucky guess`);
    else { const pos2 = await page.evaluate(() => { const stem = document.querySelector(".q .q-stem").innerHTML; const all = [...Object.values(window.LESSONS).flatMap(l => l.steps.flatMap(s => s.questions || [])), ...window.BANK]; const q = all.find(x => x.stem === stem); const t = q.options.find(o => o.ok).t; return [...document.querySelectorAll(".q .opt .opt-body")].findIndex(n => n.innerHTML === t); });
      await page.locator(".q .opt").nth(pos2).click(); await page.waitForTimeout(60); await visit("#practice");
      if (!(await page.locator("text=No lucky guesses waiting").count())) problems.push(`${tag}: confirmed guess still listed`); }
  }
  // Phone: the tab bar replaces the top nav, and hides inside a lesson. Desktop: no tab bar.
  const tabVisible = () => page.evaluate(() => { const t = document.querySelector(".tabbar"); return !!t && getComputedStyle(t).display !== "none"; });
  await visit("#more");
  if ((await tabVisible()) !== (viewport.width <= 560)) problems.push(`${tag}: tab bar visibility is wrong on #more`);
  if ((await page.locator(".more-list a").count()) !== 6) problems.push(`${tag}: More page should list 6 links`);
  await visit("#m06-2");
  if (await tabVisible()) problems.push(`${tag}: tab bar should hide inside a lesson`);
  if (!(await page.locator(".l-head.compact").count())) problems.push(`${tag}: lesson header should be compact after step 1`);
  await visit("#m09-1");
  if (!(await page.locator(".prose table.stack").count())) problems.push(`${tag}: three-column table wasn't marked for stacking`);
  checks += 8;
  // Coach (the `sample` capability), with Claude stubbed: a graded explanation renders a verdict, a wrong
  // answer offers a fresh variant, and a declined permission removes the coach without breaking the card.
  for (const declined of [false, true]) {
    const cp = await browser.newPage({ viewport, colorScheme });
    cp.on("pageerror", e => problems.push(`${tag} coach pageerror: ${e.message}`));
    await cp.addInitScript(declined => {
      const fn = async () => ({ text: "x", truncated: false });
      fn.json = async prompt => { if (declined) throw { code: "not_granted", message: "no" }; return prompt.startsWith("Write one new") ? { stem: "A <b>new</b> question?", options: [{ t: "one", ok: true, why: "yes" }, { t: "two", ok: false, why: "no" }, { t: "three", ok: false, why: "no" }, { t: "four", ok: false, why: "no" }] } : { verdict: "solid", feedback: "You named the real reason.", missing: "" }; };
      window.claude = { use: async name => name === "sample" ? fn : null };
    }, declined);
    await cp.goto(URL + "#m01-5"); await cp.waitForTimeout(150);
    const wrongPos = await cp.evaluate(() => { const q = window.LESSONS.m01.steps[4].questions[0]; const t = q.options.find(o => !o.ok).t; return [...document.querySelectorAll(".q")][0].querySelectorAll(".opt .opt-body").length && [...[...document.querySelectorAll(".q")][0].querySelectorAll(".opt .opt-body")].findIndex(n => n.innerHTML === t); });
    const card = cp.locator(".q").first();
    await card.locator(".opt").nth(wrongPos).click(); await cp.waitForTimeout(60);
    if (!(await card.locator(".coach").count())) { problems.push(`${tag}: coach missing after an answer`); await cp.close(); continue; }
    await card.locator(".coach-in").fill("Because stop_reason is the structured signal and text can contain the word done.");
    await card.locator(".coach-go").click(); await cp.waitForTimeout(80);
    if (declined) { if (await card.locator(".coach-go").count()) problems.push(`${tag}: declined coach should remove its controls`); }
    else {
      if (!(await card.locator(".coach-v.v-solid").count())) problems.push(`${tag}: coach verdict didn't render`);
      await card.locator(".coach-var").click(); await cp.waitForTimeout(80);
      if ((await card.locator(".q.variant .opt").count()) !== 4) problems.push(`${tag}: fresh variant didn't render four options`);
      if (await card.locator(".q.variant .q-stem b").count()) problems.push(`${tag}: variant text wasn't escaped`);
      await card.locator(".q.variant .opt").first().click();
      if (!(await card.locator(".q.variant .opt.is-right").count())) problems.push(`${tag}: variant didn't reveal its answer`);
    }
    checks += 2; await cp.close();
  }
  // Exam mode hides the "Real world today" callouts and parenthetical asides; turning it off restores them.
  await visit("#m02-4");
  const todayShown = () => page.evaluate(() => [...document.querySelectorAll(".callout.today.rw, .today-inline")].filter(n => n.offsetParent !== null).length);
  if (!(await todayShown())) problems.push(`${tag}: m02 step 4 should show today notes by default`);
  await page.locator("[data-exam-mode]").first().click(); await page.waitForTimeout(60);
  if (await todayShown()) problems.push(`${tag}: exam mode left today notes visible`);
  await visit("#m11-5");
  if (await todayShown()) problems.push(`${tag}: exam mode didn't carry to another lesson`);
  await visit("#today"); await page.locator("[data-exam-mode]").first().click(); await page.waitForTimeout(60);
  await visit("#m02-4");
  if (!(await todayShown())) problems.push(`${tag}: turning exam mode off didn't restore today notes`);
  // The new foundations lesson renders, and a submitted mock reports scores by question type.
  await visit("#f04-2");
  if (!(await page.locator("pre.code").count())) problems.push(`${tag}: f04 step 2 is missing its code sample`);
  await visit("#mock"); if (await page.locator("#begin").count()) await page.locator("#begin").click();
  await page.waitForTimeout(80);
  const mq = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("cca-study-progress-v1")); return s.mock ? s.mock.qids : []; });
  const famShare = await page.evaluate(ids => { const fam = new Set(window.BANK.filter(q => q.family).map(q => q.id)); return ids.filter(id => fam.has(id)).length; }, mq);
  if (mq.length !== 60 || famShare < 20) problems.push(`${tag}: mock should seat 60 questions with at least 20 option-family items, got ${mq.length} and ${famShare}`);
  await page.locator(".opt").first().click(); await page.locator("#msubmit").click(); await page.locator("#msubmit").click(); await page.waitForTimeout(120);
  if (!(await page.locator(".qtype-row").count())) problems.push(`${tag}: mock result is missing the by-question-type rows`);
  checks += 6;
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

// Sync must settle. The database stores keys alphabetically, and two open devices can hold different
// timestamps for the same step; either used to make the app save in an endless loop.
async function syncSettles() {
  const browser = await chromium.launch();
  const sortKeys = v => Array.isArray(v) ? v.map(sortKeys) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map(k => [k, sortKeys(v[k])])) : v;
  const now = Date.now(), base = { v: 1, updatedAt: now - 5000, steps: { "m09:0": now - 9000 }, widgets: {}, answers: { "q09-1": { ok: true, choice: 0, at: now - 8000 } }, first: {}, lessonAns: {}, cards: {}, last: { m: "m08", s: 1, at: now - 7000 }, mocks: [], mock: null, readiness: null, plan: null, removedMocks: [] };
  const other = JSON.parse(JSON.stringify(base)); other.steps["m09:0"] = now - 1000;
  let stored = sortKeys(base), saves = 0; const pages = [];
  for (const seed of [base, other]) {
    const p = await (await browser.newContext()).newPage(); pages.push(p);
    p.on("pageerror", e => problems.push(`sync pageerror: ${e.message}`));
    await p.exposeFunction("__set", d => { saves++; stored = sortKeys(d); setTimeout(() => pages.forEach(q => q.evaluate(s => window.__emit(s), stored).catch(() => {})), 30); });
    await p.addInitScript(seed => {
      const subs = []; window.__emit = s => subs.forEach(f => f({ exists: true, data: () => s }));
      window.claude = { use: async n => n === "user" ? { id: async () => "u1" } : { doc: () => ({ set: d => window.__set(JSON.parse(JSON.stringify(d))), onSnapshot: f => { subs.push(f); } }) } };
      if (!sessionStorage.getItem("seeded")) { localStorage.setItem("cca-study-progress-v1", JSON.stringify(seed)); sessionStorage.setItem("seeded", "1"); }
    }, seed);
  }
  for (const p of pages) { await p.goto(URL + "#m09"); await p.evaluate(s => window.__emit(s), stored); }
  await pages[0].waitForTimeout(2500); const s1 = saves; await pages[0].waitForTimeout(2500); checks++;
  if (saves > s1) problems.push(`sync: still saving after 2.5s (${saves - s1} more saves): it never settles`);
  const t = await Promise.all(pages.map(p => p.evaluate(() => JSON.parse(localStorage.getItem("cca-study-progress-v1")).steps["m09:0"])));
  if (t[0] !== t[1] || t[0] !== now - 1000) problems.push(`sync: devices disagree on a step timestamp (${t.join(" vs ")})`);
  await browser.close();
}

await syncSettles();
await run({ width: 1280, height: 900 }, "light");
await run({ width: 390, height: 844 }, "dark");
console.log(`${checks} checks · ${problems.length ? `${problems.length} problems:\n  ` + problems.join("\n  ") : "no problems"}`);
process.exit(problems.length ? 1 : 0);
