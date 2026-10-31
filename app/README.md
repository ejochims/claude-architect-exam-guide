# Study app

Interactive study path for the Claude Certified Architect – Foundations exam. It's published as a private claude.ai artifact, and progress syncs per user through the artifact's `db` capability, with `localStorage` as a fallback.

| File | Contents |
|---|---|
| `index.html` | Shell, design tokens and all CSS. The artifact platform wraps it in the document skeleton, so it has no `<html>`/`<head>` tags. |
| `app.js` | Engine: state and sync, readiness math, router, and views (path, lessons, practice, drills, mock exam, flashcards, blueprint). |
| `content/curriculum.js` | Blueprint domains and weights, 30 task statements, 6 scenarios, the module map, and the 9 distractor traps. |
| `content/mNN.js` | One lesson per module: `steps` (`read`, `widget`, `quiz`, `recap`) plus `cards` for flashcards. |
| `content/bank.js` | Extra scenario questions used by drills and the mock exam. |
| `widgets.js`, `widgets2.js` | Interactive widgets (`WIDGETS`) and inline embeds (`EMBEDS`). `sorter` is the generic, config-driven one. |

**Question format.** Each question has an `id` and a task statement `ts`, and optionally a `scenario`. It has four `options`, each with text `t`, an explanation `why`, and optionally `ok: true` (exactly one per question) or a `trap` id. Options are shuffled for display using a seed from the question id. Set `holdout: true` to sequester an item from lessons, drills, mocks and readiness; it's reserved for the one-time Readiness Check.

**Scoring.** Readiness and mastery use each question's *first* attempt (`state.first`), so retries don't inflate them. Mock exams report a domain-weighted percentage with a 95% Wilson interval, not a scaled score, because Anthropic doesn't publish its raw-to-scaled mapping. The 80% practice bar comes from `audit/readiness-review.md`.

**Adding a module.**
1. Create `content/mNN.js` registering `window.LESSONS.mNN`.
2. Add a `<script>` tag for it in `index.html`, before `app.js`.
3. Include the file in the artifact publish's `files` map.
