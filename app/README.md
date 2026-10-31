# Study app

Interactive study path for the Claude Certified Architect – Foundations exam. It's published as a private claude.ai artifact, and progress syncs per user through the artifact's `db` capability, with `localStorage` as a fallback.

| File | Contents |
|---|---|
| `index.html` | Shell, design tokens and all CSS. The artifact platform wraps it in the document skeleton, so it has no `<html>`/`<head>` tags. |
| `app.js` | Engine: state and sync, readiness math, router, and views (path, lessons, practice, drills, mock exam, flashcards, blueprint). |
| `content/curriculum.js` | Blueprint domains and weights, 30 task statements, 6 scenarios, the module map, and the 9 distractor traps. |
| `content/mNN.js` | One lesson per module: `steps` (`read`, `widget`, `quiz`, `recap`) plus `cards` for flashcards. |
| `content/bank.js` | Extra scenario questions used by drills and the mock exam. |
| `content/principles.js` | The Principles page (`#principles`): the design beliefs behind the right answers, grouped by theme. Each has a rule, why it holds, the wrong answer it beats, its trap pattern, task statement and bullet IDs. Load it before `app.js`. |
| `content/holdout.js` | The 60-item Readiness Check (`holdout: true`), 10 per scenario. Never shown in lessons, drills or mocks; taken once. Load it after `bank.js`. |
| `content/f01.js`–`f03.js` | Foundations lessons that come before Module 0 (ids `f01`–`f03`). |
| `widgets.js`, `widgets2.js` | Interactive widgets (`WIDGETS`) and inline embeds (`EMBEDS`). `sorter` is the generic, config-driven one. |

**Question format.** Each question has an `id` and a task statement `ts`, and optionally a `scenario`. It has four `options`, each with text `t`, an explanation `why`, and optionally `ok: true` (exactly one per question) or a `trap` id. Options are shuffled for display using a seed from the question id. Set `holdout: true` to sequester an item from lessons, drills, mocks and readiness; it's reserved for the one-time Readiness Check. An optional `family` id links a holdout question to a practice twin in `bank.js` that has the same four options but a different correct one. Generate families with `scripts/audit/build-families.mjs`; `content-check.mjs` enforces the rules, and a mock never draws two members of the same family.

**Scoring.** Readiness and mastery use each question's *first* attempt (`state.first`), so retries don't inflate them. Mock exams report a domain-weighted percentage with a 95% Wilson interval, not a scaled score, because Anthropic doesn't publish its raw-to-scaled mapping. The 80% practice bar comes from `audit/readiness-review.md`. Multiple-response items (`type: "multi"`: 5 options, 2–3 keyed, and a stem that says "Select TWO") are scored all-or-nothing, so each still yields one right-or-wrong result. They're practice only; the Readiness Check stays single-answer.

**Adding a module.**
1. Create `content/mNN.js` registering `window.LESSONS.mNN`.
2. Add a `<script>` tag for it in `index.html`, before `app.js`.
3. Include the file in the artifact publish's `files` map.
