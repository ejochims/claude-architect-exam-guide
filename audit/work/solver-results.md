# Phase 3a: independent solver panel

Answers are scored with `node scripts/audit/score-solver.mjs <answers.json> <answer-key.json>`. The answer key lives outside the repo, so solvers can never see it. Solvers saw items in a fresh option order, with the HTML stripped and no keys or explanations.

## Blind solver (stem and options; no keys, no web) — 2026-10-30

| Metric | Result |
|---|---|
| Agreement with the key | **120 / 120 (100%)**. Every domain is 100%. |
| Confidence | 99 items at 5 of 5 and 21 at 4 of 5. Nothing at 3 or below. |
| Flagged ambiguous | 4: `b2-5` (3.5), `q09-4` (4.4), `q11-4` (3.2), `q13-1` (5.2) |
| Flagged factually dubious | 1: `q11-6` (3.2). `argument-hint` shows an autocomplete hint; it doesn't enforce the argument. |

The raw answers are in `solver-blind-answers.json`.

### What this means

1. **No answer key was found wrong.** This is real evidence, but limited: the solver comes from the same model family as the author, so the two share blind spots. The blueprint-only solver and the adversarial reviewer still have to run.
2. **The bank is too easy to tell a prepared candidate from an unprepared one.** A well-informed solver hit 100% while never dropping below 4 of 5 confidence. A pick-the-longest heuristic gets 81% (see `audit/SUMMARY.md`). Together, these mean **a high score on this bank isn't evidence of exam readiness.** The official exam is built so that distractors are "responses that a candidate with incomplete knowledge or experience might choose". Here, most distractors can be ruled out without real knowledge.
3. **Effect on the plan.** Phase 7's item rewrites must raise difficulty, not only remove length cues:
   - distractors should be correct in general but wrong for this scenario;
   - pairs of options should be close neighbors (for example, hook vs. prompt with few-shot examples);
   - the "first step" should be ordered against a better but costlier step.

   The holdout set should be written to that harder standard. Its pass bar: the blind solver's confidence should average ≤ 4, and items should be at least moderately hard for a solver given only the lessons.

## Options-only solver (stems hidden; options only) — 2026-10-30

| Metric | Result |
|---|---|
| Agreement with the key | **119 / 120 (99.2%)**. Chance is 25%; the pass target for this test is ≤ 35%. |
| The one miss | `q10-2`: a numeric-only option set, a pure guess |
| At confidence ≥ 4 | 100 / 100 correct |
| Cues reported, with hits/uses | specificity 76/76 · best-practice tone 44/44 · length 24/24 · odd-one-out 4/4 · absolute words in the other options 4/4 · hedging 2/2 |

The raw answers are in `solver-options-only-answers.json`.

### What this means: the most serious finding of the audit so far

**Almost every item can be answered without reading the question.** The keyed option is reliably:
- the most specific option, naming real flags, fields or a structured process;
- the one that sounds most like expert best practice, often enforcing a rule in code;
- the longest.

The distractors are reliably vague prompt tweaks, "use a bigger model", or options with absolute words.

So, in the bank's current form:
- **Every score the app reports is uninformative about exam readiness:** lessons, drills, mock exams and the readiness score.
- The trap catalog (T1–T9) partly *causes* the problem. Each trap is written as an obviously weak option, so learning the trap names teaches you how to spot a bad option, not how to choose between good ones.

**Required changes to Phase 7 (item writing):**
1. **Every distractor must look as expert as the key.** It should be specific, technically real and plausibly best practice, but wrong for *this* scenario. Examples: the wrong scope, the wrong order, overkill for this risk level, a fix to the wrong component, a correct mechanism applied at the wrong layer.
2. **Prompt-based options are sometimes correct.** About 25–35% of keys should be the "softer" option (a prompt or few-shot fix, the cheaper first step), so that "always pick the option that enforces in code" stops working as a heuristic.
3. **Acceptance test for every rewritten or new item:** an options-only solver panel must score ≤ 35% across the bank, and no single item may be correctly guessed at confidence ≥ 4 by 2 of 3 options-only runs.
4. **Holdout items must pass the same gate before you see them.**

## Blueprint-only solver (exam guide and official docs only; no curriculum) — 2026-10-30

| Metric | Result |
|---|---|
| Agreement with the key | **120 / 120**. 119 items at confidence 4–5. |
| Too close to an official sample question | **9**: `b1-1`, `b5-1`, `q00-1`, `q02-1`, `q04-3`, `q06-5`, `q08-7`, `q10-1`, `q11-3` |
| Exam-vs-today gaps | 5: `b2-3`, `q02-7`, `q06-1`, `q11-4`, `q11-6`. In each, the key is still right for the exam. |
| Ambiguous | 2: `b1-2`, `b5-4` |

The raw answers, with governing bullet IDs per item, are in `solver-blueprint-answers.json`.

### What this means

1. **Three independent solvers found no wrong keys.** The blind, options-only and blueprint-only solvers together found zero. What remains are the ambiguity flags.
2. **9 items paraphrase official sample questions too closely.** Each copies a sample's structure and option set, changing only the topic. This breaks the originality rule. It also inflates practice scores, because a learner who has read the official guide recognizes the pattern. → **REWRITE** all 9, keeping the task statement but changing the decision being tested.
3. **The ambiguity flags corroborate each other:**
   - `b1-2`: the blueprint treats timeouts as transient and retryable, while the key relies on non-idempotent refund safety, which no bullet covers.
   - `b5-4`: blueprint bullet 4.5-K2 names nightly test generation as a good fit for batch, which is in tension with the synchronous key.
   - Together with the blind solver's 4 flags, there are **6 AMB candidates** for Phase 3b.
4. **`q11-6` and `argument-hint`:** the blueprint's own wording treats `argument-hint` as prompting for required parameters. So the key is correct *for the exam*, and D3's S1 finding is reclassified as EXAM-FRAMING-UNFLAGGED. The fix is a "Real world today" note, not a key change.
