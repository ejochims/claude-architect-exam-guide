# Curriculum audit summary

The plan is in [`docs/AUDIT-PLAN.md`](../docs/AUDIT-PLAN.md). This file records the measured state before and after remediation, the completion checklist, and residual risks.

## Before (Phase 0 baseline, 2026-10-30)

**Baseline commit:** `7586993` (local tag `audit-baseline`).

**Reproduce:**
- `node scripts/audit/content-check.mjs`
- `node scripts/audit/cue-baselines.mjs`

**Blueprint:** the Exam Guide v0.1 has **30 task statements and 240 bullets** (113 "Knowledge of" and 127 "Skills in"). The parsed text stays outside the repo because the guide is marked Confidential NTK. Repo artifacts cite bullets by ID only (`1.1-K1`, `4.2-S3`, …).

### Size

| Metric | Value |
|---|---|
| Questions | 120 (93 in lessons, 27 in the bank) |
| Flashcards | 84 |
| Modules | 14 |
| Structural invariants | Pass: unique IDs, 4 options each, exactly one correct, every task statement valid |
| Warning | `q00-3` has a negated stem, with the trap tag on the keyed option |

### Coverage

| Metric | Value | Target |
|---|---|---|
| Task statements with fewer than 5 questions | **21 of 30** | 0 |
| Thinnest task statements | 3.4 = 1; 1.6 = 2; 3.3 = 2; 1.2, 1.7, 2.1, 3.1, 4.6, 5.3, 5.4, 5.5, 5.6 = 3 each | ≥ 5 each |
| Domain mix (share of questions vs. blueprint weight) | D1 20.8% vs 27 · D2 19.2% vs 18 · D3 18.3% vs 20 · D4 23.3% vs 20 · D5 18.3% vs 15 | ± 2 points |
| Questions per scenario | 18–20, plus 6 with no scenario | ≥ 30 |

Scenario × domain skews (Phase 1 will check these against the guide's scenario descriptions):
- Scenario 2 is 15 of 19 D3.
- Scenario 4 (Developer Productivity) has **0 D3 items**: 12 are D2 and 6 are D1.
- Scenario 6 has only 3 D5 items, although human review and confidence routing (5.5) are central to extraction.

### Answer cueing

| Metric | Value | Target |
|---|---|---|
| Correct option is longest or tied | **98 / 120 (81.7%)** | ≤ 30% |
| Stem-blind "pick longest" solver | **81.3%** | ≤ 35% (chance is 25%) |
| Stem-blind "pick most clauses" solver | **54.9%** | ≤ 35% |
| Ratio of correct length to longest distractor | > 1.25 in 56 items; max 1.47 | ≤ 1.25 |
| Absolute wording | correct options 20.8%, distractors 28.9% | within 5 points |
| Correct position as authored | A 68, B 38, C 14, D 0 | (display shuffle fixes this) |
| Correct position as displayed | 32 / 33 / 29 / 26 | about 30 each |
| Distractors with a trap tag | **141 / 360 (39.2%)** | 100%, or a stated misconception |

### Readiness signal

| Metric | Value |
|---|---|
| Mock draws that can meet all domain quotas | **0 of 15** |
| Mock pool per draw | 74–78 items, of which 60 are drawn, so almost no unseen items |
| Readiness formula | the *latest* answer per question across all questions; no holdout and no first-attempt measure |

### Corrections to `docs/STUDY-APP-PLAN.md` §6

| Claim | Measured | Verdict |
|---|---|---|
| "No correct answer is more than 1.5× its longest distractor." | Max ratio is 1.47 | **True** |
| "About a quarter are not the longest option at all." | 18% are not the longest | **False** |
| The mock is "balanced toward the blueprint's domain weights." | No draw can meet all the domain quotas | **False in every draw** |

## After (2026-10-31, remediation batches 1–7)

> The tables below are the batch 1–7 snapshot. For current totals, run the scripts or see the latest batch in `audit/backlog.md`. As of Batch 16: 293 questions (233 practice, including 15 multiple-response, and 60 holdout), 79 families, and domains at 25.9 / 17.4 / 20.1 / 21.8 / 14.7%.

**Reproduce:**
- `node scripts/audit/content-check.mjs`
- `node scripts/audit/cue-baselines.mjs` (add `--set holdout`, or `--ts N`, to check a subset)
- `node scripts/audit/browser-suite.mjs`

### Content

| Metric | Before | After |
|---|---|---|
| Questions | 120 | **218**: 158 practice and 60 holdout |
| Task statements with fewer than 5 questions | 21 | **0** |
| Domain mix (D1–D5) | 21 / 19 / 18 / 23 / 18% | **26.5 / 18.1 / 20.1 / 19.6 / 15.7%** against 27/18/20/20/15 |
| Foundations lessons | none | **F1–F3**: API call, tool use end to end, product map |
| "Why it exists" for MCP | 5/12 | Rebuilt m05 opening: sourced history, a diagram, why three primitives |
| Glossary / Exam vs. today page | none | **50 terms / 16 sourced differences** |
| Claims fixed or flagged | — | All 28 S1 claims; all S1 and S2 claims located in the guide (see `consistency.md`) |

### Answer cueing

| Metric | Before | After |
|---|---|---|
| Correct option is longest | 81.7% | **32.4%** (holdout 31.7%) |
| Length rank, longest / 2nd / 3rd / shortest | 98 / 15 / 4 / 3 | **66 / 50 / 44 / 44** |
| Best stem-blind heuristic (chance is 25%) | 81.3% | **31.1%** |
| Absolute wording, correct vs distractors | 20.8% vs 28.9% | **26.0% vs 29.7%** |

### Independent solver panel

The final panel saw items with shuffled options and no keys or explanations.

| Solver | Before | After |
|---|---|---|
| Blind solver: agreement with the key | 120/120 (Opus) | **204/204 (Sonnet)**. 5 items flagged ambiguous; 2 fixed (`h3-3`, `q02-7`), the rest judged acceptable. |
| Options-only solver: stems hidden | 119/120 (Opus) | **188/204 = 92.2% (Haiku)**: practice 91.7%, holdout 93.3% |

### Readiness signal

| Metric | Before | After |
|---|---|---|
| Readiness measure | latest answer, inflatable by retries | **first attempt only** |
| Holdout | none | **60-item Readiness Check, taken once** |
| Mock score | invented scaled score | **domain-weighted % with a 95% range** |
| Browser suite | — | **278 checks, no problems** (1280px light and 390px dark, labs and capstone included) |

### What the options-only result means

The heuristic solvers, which have no knowledge of the topic, now perform at chance, so the surface cues are gone. A model that already knows agent best practices can still pick the key from the options alone 92% of the time. The items mostly test whether you can **recognize the best practice**; the scenario in the stem rarely changes which option is right.

Two things follow:
1. **A score in the app reflects real best-practice knowledge, not pattern-spotting.**
2. **It says less about the harder skill of choosing between two good practices for a specific scenario.**

The official sample questions use the same distractor families (prompt-only fixes, bigger model, routing classifier, tool consolidation), so the real exam probably leans the same way. Whether it does is unverified until you take the official practice exam.

## Option families (2026-10-31, follow-up to the options-only result)

**The problem.** In most questions the keyed option was simply the generic best practice, so a model could pick the key from the options alone 92% of the time without reading the question.

**The fix.** All 60 Readiness Check questions were rewritten as **option families**. Each family is two questions that share the same four options but key different ones:
- one question is in the Readiness Check and its twin is a new practice question (`p*`);
- every option is a technique the curriculum endorses in some situation;
- one constraint in the question decides which option is right;
- each explanation says when that option *would* be right.

Memorizing a practice answer therefore points you to the wrong answer on its Readiness Check twin. `content-check.mjs` enforces the family rules, `startMock()` never puts two members of one family in a single sitting, and the source files are in `audit/work/families/`.

| Metric | Before | After |
|---|---|---|
| Options-only model on the Readiness Check (Haiku, question hidden) | 93.3% | **28.3%** (chance is 25%) |
| Options-only model on the practice twins | — | 33.3% |
| Highest options-only score possible across both twins in a family | — | 50% by construction |
| Blind solver agreement with the key (Sonnet, sees the question) | — | **120/120**. Flagged 6 items as having a second defensible option; 3 were reworded to make the deciding constraint explicit (`p3-4`, `p5-5`, `h2-8`), and 3 were already decided by stated facts. |
| Best stem-blind heuristic on the Readiness Check | 31.1% | 31.0% |
| Questions | 218 | **278** (218 practice, 60 holdout) |

**What it means for you.**
- **The Readiness Check now measures scenario judgment.** It's probably harder than the real exam, whose official sample questions look more recognition-based, so treat a pass as conservative.
- **Keep the 80% bar, but recalibrate it once you take the official practice exam.** If the two scores differ by more than 10 points, trust the official one.
- **The 158 original practice questions are unchanged.** They still mostly test recognition, so the mock exams draw mainly on them and may read higher than the Readiness Check.

## Completion checklist

`docs/AUDIT-PLAN.md`, "Definition of audit complete":

| # | Criterion | Status |
|---|---|---|
| 1 | Every blueprint bullet COVERED+TESTED; no unlabeled out-of-scope leaks | **Met for coverage.** Every task statement now has at least 5 items, and the 155 bullets that were covered but under-tested gained items. A full re-rating of all 240 bullets wasn't repeated. |
| 2 | Every claim verified; zero S1/S2 WRONG, OUTDATED or UNFLAGGED; illustrative numbers labeled | **Met for the app.** Every non-correct claim is fixed, flagged as exam framing, or accepted (`claims-status.md`). The `segmentReveal` numbers now add up to 97.0% and are labeled illustrative. 52 S3 wording items remain in the secondary markdown guide. |
| 3 | Every question meets the pass bar; cue metrics on target | **Mostly met.** The key agreement and heuristic gates are met. The options-only model result is at 92% (see above). |
| 4 | About 200 items, domain targets met, about 60 unseen holdout | **Met** (204 items; 60 holdout). |
| 5 | Readiness uses first attempts with an interval; caveated score; feasible mock | **Met.** Every mock matches the blueprint's domain quotas exactly in all 15 draws. 6 draws borrow up to 6 of 60 questions from another scenario. |
| 6 | Zero open S1/S2 contradictions between guide and app | **Met** (`consistency.md`). |
| 6b | One-stop shop: Foundations, Why-test ≥ 10/12, novice walkthrough with zero blocking issues, labs, glossary | **Mostly met.** Foundations F1–F3, glossary, Exam vs. today, the MCP "why", and **four in-app labs** (L1–L4, one per official preparation exercise) are built. **"Why it exists" panels** were added for the primitives that scored below 10/12. The final novice walkthrough of F1–F3, m05 and m11 found 1 blocking issue (CLAUDE.md and memory undefined) and 16 major ones; all are addressed by the panels and Foundations edits. A re-score of the primitives by a new reviewer wasn't run. |
| 7 | Scripts and browser suite pass; artifact republished; PR up | **Met.** |
| 8 | Residual risks listed honestly | Below. |

## Residual risks

1. **Every reviewer and author is an AI model.** The same model family wrote, rewrote and checked these items, and the holdout and practice rewrites had the same author in efficiency mode. No human who has passed the exam has reviewed them. Calibrate against the **official practice exam** (backlog R0) before trusting any score.
2. **Practice questions test recognition more than scenario judgment.** This was fixed for the Readiness Check and the 60 practice twins (see "Option families"). The 158 original practice questions, and therefore most mock-exam questions, are unchanged. Expect mock scores to run higher than the Readiness Check.
3. **The exam format may have changed.** The official FAQ (checked 2026-10-31) says every Claude exam uses "multiple choice and scenario-based multiple response questions"; guide v0.1 describes single-answer items only. The app now has 15 multiple-response practice items, scored all-or-nothing (Batch 16). The real exam's share of them, and how many answers each asks for, are unknown. An updated guide may appear after Nov 17 (backlog R2).
4. **Some open items remain:**
   - none in the markdown guide: its 52 S3 wording items were closed on 2026-10-31;
   - **114 practice questions aren't in option families** and still mostly test recognition. Convert them, Domains 1 and 3 first, if mock scores and the Readiness Check differ by more than 10 points (Batch 11);
   - **no blind solver check yet on the 15 multiple-response items.** The session that wrote them can't check them independently, so it's deferred to a fresh session;
   - **15 blueprint bullets have no question linked by ID** (`node scripts/audit/traceability.mjs`). All are in task statements with at least 5 questions, and 158 later questions carry only a task-statement tag, so most are probably tested but unattributed (Batch 16);
   - **no re-score of the Why-test by a new reviewer**, and the minor items in `audit/work/novice-fresh-2026-10-31.json` are open;
   - **no human who has passed the exam has reviewed anything** (risk 1). The official practice exam is the only external check (backlog R0).
