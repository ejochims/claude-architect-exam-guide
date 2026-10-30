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

## After

To be filled in Phase 8.

## Completion checklist

See `docs/AUDIT-PLAN.md`, "Definition of audit complete". Each item gets checked off here with its evidence.

## Residual risks

To be filled in Phase 8.
