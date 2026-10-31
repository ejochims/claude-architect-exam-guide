// Loads the study app's content files the way index.html does, without a browser.
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONTENT = path.join(ROOT, "app/content");

export function loadContent() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  const lessons = fs.readdirSync(CONTENT).filter(f => /^m\d+\.js$/.test(f)).sort();
  const extra = fs.existsSync(path.join(CONTENT, "holdout.js")) ? ["holdout.js"] : [];
  for (const f of ["curriculum.js", ...lessons, "bank.js", ...extra]) vm.runInContext(fs.readFileSync(path.join(CONTENT, f), "utf8"), ctx, { filename: f });
  const w = ctx.window;
  // Same ordering as app/app.js "Content index": lesson questions in module order, then the bank.
  const questions = [];
  for (const m of w.MODULES) if (w.LESSONS[m.id]) w.LESSONS[m.id].steps.forEach((s, si) => (s.questions || []).forEach(q => questions.push({ ...q, module: m.id, step: si, src: m.id })));
  for (const q of w.BANK || []) questions.push({ ...q, module: (w.MODULES.find(m => m.tasks.includes(q.ts)) || {}).id, src: q.holdout ? "holdout" : "bank" });
  const cards = [];
  for (const m of w.MODULES) if (w.LESSONS[m.id]) (w.LESSONS[m.id].cards || []).forEach((c, i) => cards.push({ id: `${m.id}:${i}`, module: m.id, ...c }));
  return { blueprint: w.BLUEPRINT, modules: w.MODULES, lessons: w.LESSONS, traps: w.TRAPS, questions, cards };
}

export const domainOf = ts => "d" + String(ts)[0];

// Copied from app/app.js so display-position stats match what the learner sees.
export const hashStr = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
export const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
export const shuffle = (arr, rand = Math.random) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const optionOrder = q => shuffle(q.options.map((_, i) => i), rng(hashStr(q.id)));

// Visible option text: strip tags and decode the few entities the content uses.
export const plain = s => String(s).replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

export const ABSOLUTE = /\b(always|never|only|all|every|must|guarantee[sd]?|none|any|entirely|completely)\b/i;
