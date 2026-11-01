# Prompt: independent blind check of the 15 multiple-response items

Paste everything below the line into a fresh Claude Code session on this repo. Sonnet is fine.

---

You're working in the repo `ejochims/claude-architect-exam-guide`, a study app for the Claude Certified Architect – Foundations exam. Your task is an **independent blind check of the 15 multiple-response practice questions** (`mr-01` to `mr-15`). Each one says "Select TWO" and is scored all-or-nothing. A different session wrote them, so your answers must not be influenced by their answer keys.

**Budget:** capacity is limited.
- Don't spawn subagents.
- Use the repo's scripts.
- Read only what each step needs.

**Independence rule:** don't open `app/content/bank.js`, `audit/work/multi-items.json` or `/tmp/multi-key.json` before step 5. They contain the keys.

1. **Branch.** Start from the latest `main` (`git fetch origin main`), on the branch your session designates.

2. **Export the items without keys.** Run this from the repo root:
   ```
   node -e '
   import("./scripts/audit/lib.mjs").then(({ loadContent, shuffle, rng, hashStr, plain }) => {
     const fs = require("fs"), Q = loadContent().questions.filter(q => q.type === "multi");
     const ord = q => shuffle(q.options.map((_, i) => i), rng(hashStr(q.id + "blind")));
     const items = Q.map(q => ({ id: q.id, stem: plain(q.stem), options: ord(q).map((k, j) => "ABCDE"[j] + ". " + plain(q.options[k].t)) }));
     fs.writeFileSync("/tmp/multi-blind.json", JSON.stringify(items, null, 1));
     fs.writeFileSync("/tmp/multi-optonly.json", JSON.stringify(items.map(({ id, stem, options }) => ({ id, pick: (stem.match(/Select (TWO|THREE)/) || [])[1], options })), null, 1));
     fs.writeFileSync("/tmp/multi-key.json", JSON.stringify(Object.fromEntries(Q.map(q => [q.id, ord(q).map((k, j) => q.options[k].ok ? "ABCDE"[j] : "").join("")]))));
     console.log("exported", items.length);
   });'
   ```

3. **Pass A, options only.** Read only `/tmp/multi-optonly.json`, which has no question stems. For each item, pick the stated number of options from the options alone. Write the picks as `{"mr-01": "AC", ...}` to `/tmp/ans-optonly.json`. This measures whether the options give away the key; chance is 10%.

4. **Pass B, blind with stems.** Read `/tmp/multi-blind.json`.
   - For each item, choose exactly the stated number of options, with a one-line reason for each pick.
   - Flag any item where a third option is also defensible, or where the stem doesn't decide between options.
   - Write the picks to `/tmp/ans-blind.json` and the reasons and flags to `/tmp/notes-blind.md`.

5. **Score both passes.** Run this once per answer file:
   ```
   node -e '
   const k = require("/tmp/multi-key.json"), a = require(process.argv[1]); let r = 0;
   for (const id of Object.keys(k)) { const g = String(a[id] || "").toUpperCase().split("").sort().join(""); if (g === k[id]) r++; else console.log(id, "answered", g || "-", "key", k[id]); }
   console.log("agreement", r + "/" + Object.keys(k).length);' /tmp/ans-blind.json
   ```
   Then open `audit/work/multi-items.json`. For every disagreement and every flag, decide which of these it is:
   - **The key is wrong:** fix the key.
   - **The item is ambiguous:** reword the stem so the deciding constraint is explicit, or tighten an option.
   - **Your answer was wrong:** no change.

   Keep edits minimal:
   - keep 5 options, 2 keyed, and "Select TWO" in the stem;
   - don't make the keyed options systematically longer than the others.

6. **Apply and check.** Make the same edits in both `app/content/bank.js` and `audit/work/multi-items.json`. Then run:
   - `node scripts/audit/content-check.mjs`: must report "Invariants: OK";
   - `node scripts/audit/cue-baselines.mjs`: every multiple-response heuristic must be at or below 25%;
   - `node scripts/audit/browser-suite.mjs`: must report no problems.

7. **Record the results.** Add "Batch 20: blind check of multiple-response items" to `audit/backlog.md`, with both scores, the flags and the changes. In `audit/SUMMARY.md`, residual risk #4, mark the open item for this check as done.

8. **Ship.** Commit, push and open a draft PR. Don't merge it or republish the app unless I ask.

**Pass:** blind agreement of at least 14/15 after fixes, and options-only agreement of 25% or less.

**Report back:** both scores, each disagreement or flag, and what you did about it.
