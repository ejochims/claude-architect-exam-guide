// Appends new questions to the content: practice items into bank.js, holdout items into holdout.js.
// Usage: node scripts/audit/add-items.mjs <items.json> <bank|holdout>
// items.json: [{ id, ts, scenario, stem, options: [{ t, ok?, trap?, why }] }]
import fs from "fs";
import path from "path";
import { ROOT } from "./lib.mjs";

const [file, target] = process.argv.slice(2);
const items = JSON.parse(fs.readFileSync(file, "utf8"));
for (const q of items) if (q.options.length !== 4 || q.options.filter(o => o.ok).length !== 1) throw new Error(`${q.id}: need 4 options, exactly one ok`);

const opt = o => `      { t: ${JSON.stringify(o.t)}${o.ok ? ", ok: true" : ""}${o.trap ? `, trap: ${JSON.stringify(o.trap)}` : ""}, why: ${JSON.stringify(o.why)} }`;
const item = (q, holdout) => `  {\n    id: ${JSON.stringify(q.id)}, ts: ${JSON.stringify(q.ts)}, scenario: ${q.scenario},${holdout ? " holdout: true," : ""}\n    stem: ${JSON.stringify(q.stem)},\n    options: [\n${q.options.map(opt).join(",\n")}\n    ]\n  }`;

if (target === "bank") {
  const p = path.join(ROOT, "app/content/bank.js");
  const src = fs.readFileSync(p, "utf8"), end = src.lastIndexOf("];");
  fs.writeFileSync(p, src.slice(0, end).replace(/\s*$/, "") + ",\n" + items.map(q => item(q, false)).join(",\n") + "\n" + src.slice(end));
} else if (target === "holdout") {
  const p = path.join(ROOT, "app/content/holdout.js");
  const head = "// Sequestered Readiness Check items: never shown in lessons, drills or mocks. Take the check once, cold.\nwindow.BANK = window.BANK || [];\nwindow.BANK.push(\n";
  fs.writeFileSync(p, head + items.map(q => item(q, true)).join(",\n") + "\n);\n");
} else throw new Error("target must be bank or holdout");
console.log(`Added ${items.length} items to ${target}.`);
