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
  for (const h of ["#", "#practice", "#blueprint", "#today", "#glossary", "#cards"]) await visit(h);

  // Each scenario drill: answer the first question and advance.
  for (let s = 1; s <= 6; s++) { await visit(`#drill-${s}`); await page.locator(".q .opt").first().click(); await page.locator("#dnext").click(); checks++; }

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
