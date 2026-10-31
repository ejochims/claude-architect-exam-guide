// Applies rewritten questions to the content files in place, matching each by id.
// Usage: node scripts/audit/apply-rewrites.mjs <rewrites.json>
// rewrites.json: { "<id>": { "stem"?: "...", "family"?: "...", "options": [{ "t", "ok"?, "trap"?, "why" }] } }
// Only the stem string and the options array of each question are replaced; everything else is untouched.
import fs from "fs";
import path from "path";
import { ROOT } from "./lib.mjs";

const rewrites = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const dir = path.join(ROOT, "app/content");
const files = fs.readdirSync(dir).filter(f => /\.js$/.test(f)).map(f => path.join(dir, f));
const lit = o => `{ t: ${JSON.stringify(o.t)}${o.ok ? ", ok: true" : ""}${o.trap ? `, trap: ${JSON.stringify(o.trap)}` : ""}, why: ${JSON.stringify(o.why)} }`;

// Index of the bracket that closes the one at `open`, skipping string contents.
function closing(src, open) {
  let depth = 0, q = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === "\\") i++; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") q = c;
    else if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") { depth--; if (depth === 0) return i; }
  }
  throw new Error("unbalanced");
}

let done = 0;
for (const [id, rw] of Object.entries(rewrites)) {
  if (rw.options.filter(o => o.ok).length !== 1 || rw.options.length !== 4) throw new Error(`${id}: need 4 options, exactly one ok`);
  const file = files.find(f => fs.readFileSync(f, "utf8").includes(`id: "${id}"`));
  if (!file) throw new Error(`${id}: not found`);
  let src = fs.readFileSync(file, "utf8");
  const at = src.indexOf(`id: "${id}"`);
  const indent = src.slice(src.lastIndexOf("\n", at) + 1, at).match(/^\s*/)[0];
  if (rw.stem) {
    const s = src.indexOf("stem: ", at), e = src.indexOf('",', s);
    src = src.slice(0, s) + `stem: ${JSON.stringify(rw.stem)}` + src.slice(e + 1);
  }
  // Optional option-family id, added to the question's id line.
  if (rw.family && !src.slice(at, src.indexOf("\n", at)).includes("family:")) {
    const eol = src.indexOf("\n", at);
    src = src.slice(0, eol) + ` family: ${JSON.stringify(rw.family)},` + src.slice(eol);
  }
  const o = src.indexOf("options: [", at) + "options: ".length, c = closing(src, o);
  src = src.slice(0, o) + "[\n" + rw.options.map(x => `${indent}  ${lit(x)}`).join(",\n") + `\n${indent}]` + src.slice(c + 1);
  fs.writeFileSync(file, src);
  done++;
}
console.log(`Applied ${done} rewrites.`);
