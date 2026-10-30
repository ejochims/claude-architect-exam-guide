# Readiness-signal review (Phase 5)

**Question:** do the app's readiness score, mock exam and scaled-score estimate give an honest signal of whether you'll pass?

**Short answer: no, not yet.** Each problem below inflates the signal on its own. Together they make a high score close to meaningless. Lines refer to `app/app.js` at the audit baseline.

## Findings

| # | Sev | Finding | Where | Effect |
|---|---|---|---|---|
| E1 | S1 | **The items can be answered without reading the questions.** The options-only solver scores 119/120, and pick-longest scores 81%. | `audit/work/solver-results.md` | A high score is possible with no domain knowledge. This dominates every other issue. |
| E2 | S1 | **"Try again" deletes the earlier answer** (`delete state.answers[q.id]`). Readiness then counts only the newest attempt. | `:169-170` | You can reach 100% readiness by retrying until each answer is right. |
| E3 | S1 | **Every answer overwrites the stored one.** Lessons, drills and mock submissions all write `state.answers[id]`, so readiness reflects your latest exposure to each item, not your first-attempt performance. | `:160`, `:394` | It measures recall of answers you've already seen. |
| E4 | S1 | **There's no held-out set.** The mock exam draws from the same 120 items as the lessons and drills. With 4 of 6 scenarios, the pool is 74–78 items and 60 are drawn, so almost every mock item is one you've already seen with its explanation. | `:374-383` | The mock exam measures memory, not transfer. |
| E5 | S2 | **The mock's domain quotas can't be met in any of the 15 possible scenario draws.** It falls back to filling from whatever is left, so its domain mix varies a lot from attempt to attempt. | `:379-380`; `scripts/audit/content-check.mjs` | Mock scores aren't comparable across attempts. |
| E6 | S2 | **The raw-to-scaled mapping is an assumption** (72% raw = 720). The guide says scaled scores *equate forms of different difficulty*, so the real cut score in raw terms is unknown and varies by form. | `:92-93` | The "720" shown is a guess, displayed with false precision. |
| E7 | S2 | **The readiness copy invites a booking decision:** "Aim for 80%+ before booking". | `:199` | Given E1–E4, that threshold isn't meaningful. |
| E8 | S3 | **The mock exam shows each question's task-statement chip** (for example "3.4"). It hides the scenario name in exam mode, but not the task chip. | `:145` | This hints at the topic. The real exam has no such label. |
| E9 | S2 | **The exam format may include multiple-response items** (current FAQ), but the app models single-answer items only. | backlog R1 | If true, the mock understates the difficulty. |
| E10 | S3 | **Unanswered questions count as zero** in readiness, so the score mixes coverage with accuracy. | `:96-115` | It's mostly harmless, but the number reads as accuracy when it isn't. |

## Recommended design (Phase 7, step 5)

1. **Record first attempts.** Store `first: {ok, at}` once per item and never overwrite it. Readiness and per-domain mastery use first attempts only. "Try again" still lets you practice, but doesn't change readiness.
2. **Add a held-out Readiness Check.**
   - About 60 sequestered items: 10 per scenario, with a domain mix that follows the blueprint weights.
   - Written by a separate author agent to the harder standard in solver-results.md, and gated by the options-only panel (≤ 35%).
   - Never shown in lessons, drills or the mock exam. It can be taken once, cold, and its explanations unlock only afterwards.
   - This becomes the primary booking signal inside the app.
3. **Score the mock by domain weights.** Report the weighted score Σ w_d × accuracy_d using the blueprint weights, so the score doesn't depend on which domains happen to be drawn. Show the per-domain n alongside it.
4. **Make every mock draw feasible.** Require the bank to satisfy the domain quotas for all 15 draws, and have `content-check.mjs` enforce it. In practice, every scenario needs items from at least 3 domains.
5. **Show uncertainty, not false precision.**
   - Replace the "scaled score" with **raw % plus a 95% interval** (Wilson).
   - At n = 60 and 80% raw, the interval is about **68%–88%**.
   - Show "≈720 means roughly 70–75% raw (unofficial)" as a footnote only.
6. **Hide the task chip in exam mode.**
7. **If R1 confirms multiple-response items:** add a `multi` item type with all-or-nothing scoring, include about 10% such items in the holdout and the mock, and recompute the chance baseline.

## Booking rule (set before any data, so it can't drift)

Book only when **all** of these hold:
1. Readiness Check (holdout), first and only attempt: **≥ 80% raw**. Its 95% lower bound is about 68%; this leaves margin over a cut score that's probably near 72%.
2. Every domain on the holdout is **≥ 70%**.
3. Two domain-weighted mock exams score **≥ 80%**, at least 7 days apart, taken *after* the bank rewrite.
4. The **official practice exam** scores **≥ 80%**, once you have access (backlog R0).
5. **If the official practice exam and the holdout differ by more than 10 points, trust the official one** and treat the app as miscalibrated.
6. You've confirmed the current CCAR-F exam guide version after Nov 17 (backlog R2).

**Until E1–E4 are fixed, no score in the app should influence the booking decision.**
