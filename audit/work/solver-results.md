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

## Options-only solver

Pending.

## Blueprint-only solver

Pending.
