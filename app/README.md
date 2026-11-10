# Study app

Interactive study path for the Claude Certified Architect – Foundations exam. It's published as a private claude.ai artifact, and progress syncs per user through the artifact's `db` capability, with `localStorage` as a fallback.

| File | Contents |
|---|---|
| `index.html` | Shell, design tokens and all CSS. The artifact platform wraps it in the document skeleton, so it has no `<html>`/`<head>` tags. |
| `app.js` | Engine: state and sync, readiness math, router, and views (path, lessons, practice, drills, mock exam, flashcards, blueprint). |
| `content/curriculum.js` | Blueprint domains and weights, 30 task statements, 6 scenarios, the module map, and the 9 distractor traps. |
| `content/mNN.js` | One lesson per module: `steps` (`read`, `widget`, `quiz`, `recap`) plus `cards` for flashcards. |
| `content/bank.js` | Extra scenario questions used by drills and the mock exam. |
| `content/examday.js` | The exam-day playbook (`#exam-day`): the numbers, pacing, reading and eliminating, multiple-response technique, and logistics to confirm. Load it before `app.js`. |
| `content/principles.js` | The Principles page (`#principles`): the design beliefs behind the right answers, grouped by theme. Each has a rule, why it holds, the wrong answer it beats, its trap pattern, task statement and bullet IDs. Load it before `app.js`. |
| `content/holdout.js` | The 66-item Readiness Check (`holdout: true`), 11 per scenario: 10 single-answer option-family questions and 1 multiple-response question. Never shown in lessons, drills or mocks; taken once. Load it after `bank.js`. |
| `content/f01.js`–`f04.js` | Foundations lessons that come before Module 0 (ids `f01`–`f04`). F4 covers what a model is and the out-of-scope terms an answer option can lean on (fine-tuning, RAG, temperature, caching and so on). |
| `widgets.js`, `widgets2.js` | Interactive widgets (`WIDGETS`) and inline embeds (`EMBEDS`). `sorter` is the generic, config-driven one. |

**Question format.** Each question has an `id` and a task statement `ts`, and optionally a `scenario`. It has four `options`, each with text `t`, an explanation `why`, and optionally `ok: true` (exactly one per question) or a `trap` id. Options are shuffled for display using a seed from the question id. Set `holdout: true` to sequester an item from lessons, drills, mocks and readiness; it's reserved for the one-time Readiness Check. An optional `family` id links a holdout question to a practice twin in `bank.js` that has the same four options but a different correct one. Generate families with `scripts/audit/build-families.mjs`; `content-check.mjs` enforces the rules, and a mock never draws two members of the same family.

**Scoring.** Readiness and mastery use each question's *first* attempt (`state.first`), so retries don't inflate them. Mock exams report a domain-weighted percentage with a 95% Wilson interval, not a scaled score, because Anthropic doesn't publish its raw-to-scaled mapping. The 80% practice bar comes from `audit/readiness-review.md`. Multiple-response items (`type: "multi"`: 5 options, 2–3 keyed, and a stem that says "Select TWO") are scored all-or-nothing, so each still yields one right-or-wrong result. The Readiness Check has six of them (`hm-1` to `hm-6`), one per scenario; they aren't in option families.

**Adding a module.**
1. Create `content/mNN.js` registering `window.LESSONS.mNN`.
2. Add a `<script>` tag for it in `index.html`, before `app.js`.
3. Include the file in the artifact publish's `files` map.

**Mock composition.** `startMock()` meets the blueprint's domain quotas exactly, seats about 10% multiple-response items, and gives about half of each domain's seats to option-family questions from the drawn scenarios. The result page reports scores by question type (scenario judgment, recognition, multiple response), because the non-family questions mostly test recognizing the best practice and read higher.

**Exam mode.** A per-device toggle (in each lesson header and on the Exam vs. today page, stored in `localStorage` under `cca-exam-mode`) hides the "Real world today" callouts and any parenthetical aside that mentions "today" in lessons, flashcards and answer explanations. `T()` in `app.js` marks those notes at render time; the content files aren't changed.

**Step keys.** Step completion is saved under `module:key`. A step without a `key` uses its position among the unkeyed steps, so removing or inserting an unkeyed step shifts the ones after it. When you remove a step, give the later steps an explicit `key` equal to their old position (as in `m09.js` and `m12.js`) so saved progress still lines up.

**Today's session.** The home page leads with three parts: up to 12 due flashcards, ten mixed questions, then the next lesson steps. The mixed set (`sessionQuestions()`) takes misses and lucky guesses first, then unseen questions from finished modules spread across domains (weakest first), then the right answers given longest ago. Each part's progress is derived from timestamps already in the synced state, so there's no extra storage.

**Confidence mark.** Practice questions have a "Not sure?" toggle; in a mock, a flagged question counts as not sure. `state.first[id].sure` and `state.answers[id].sure` record it. A first attempt that was right but not sure is a lucky guess and stays in the `#drill-shaky` drill until it's answered right without the mark.

**Coach (`sample` capability).** After an answer, the learner can type an explanation for Claude to grade against the question's own explanations, and after a wrong answer can ask for a fresh variant. Both run on the viewer's Claude account, only on a click, and nothing returned is scored or saved; variants are labeled as unreviewed. The coach appears only when `claude.use("sample")` resolves, so the artifact must be published with `capabilities: {db: {}, user: {}, sample: {}}`. A declined or unavailable permission removes the coach for that view.

**Phone layout.** At 560px and under, a bottom tab bar (Today, Practice, Cards, More) replaces the top nav and hides inside lessons, drills and mocks. Lesson headers collapse after step 1, and tables with three or more columns stack into one card per row.
