# Curriculum audit plan: Claude Certified Architect – Foundations study materials

## Context

The repository contains a long-form guide (`exam-preparation-guide.md`) and a study app (`app/`). The app has 14 lessons, 120 questions and 84 flashcards. One AI author built all of it, and nobody has validated it against the real exam. You will use the app to decide when to book the exam, which has a Dec 31, 2026 deadline. This audit checks whether that decision can be trusted, using ground truth: the official Exam Guide v0.1 for scope, and current official documentation for product facts.

**Your decisions.** You chose a thorough budget of 3–4 weeks. You accept fixing the existing items and expanding the bank to about 200. You don't yet have access to the official practice exam.

**Your end goal (this shapes the whole audit).** You want **one app**: a single place where you start from a base understanding and finish proficient and exam-ready, tracking progress along the way. That means:
- no hopping between online modules, videos or the markdown file;
- every primitive explained from first principles, with its *why* (for example: why MCP was created, what problem it solves, why it matters), and presented beautifully.

So the audit judges the app against two bars, not one:
1. **Exam-correct.** It is accurate, the questions are valid, and it gives an honest readiness signal.
2. **Self-sufficient and foundational.** A motivated professional who starts with only basic LLM familiarity can reach exam proficiency inside the app alone.

Anything of value that exists only in `exam-preparation-guide.md` moves into the app. The markdown file stays only as a secondary, consistent companion in the repo.

### Baseline findings (confirmed in Phase 0 by `scripts/audit/`)

These already show that some earlier status claims are wrong.

| # | Finding | Evidence |
|---|---|---|
| F1 | **Answer-length cueing is severe.** Measured on visible option text, the correct option is the longest (or tied) in **98 of 120** items (81.7%). A stem-blind "pick the longest" solver scores **81%** (chance is 25%), and "pick the most clauses" scores 55%. The 1.5× length cap in `docs/STUDY-APP-PLAN.md` §6 holds (max 1.47), but the claim that "about a quarter are not the longest" is false: it's 18%. 56 items exceed 1.25×. | `scripts/audit/content-check.mjs`, `cue-baselines.mjs` |
| F2 | **219 of 360 distractors (61%) have no trap tag.** | same |
| F3 | **Thin task statements.** 3.4 has 1 question. 1.6 and 3.3 have 2 each. 1.2, 2.1, 3.1, 1.7, 4.6, 5.3, 5.4, 5.5 and 5.6 have 3 each. | same |
| F4 | **Domain mix is off.** D1 has 25 questions (21%; the blueprint weight is 27%). D4 has 28 (23%; the weight is 20%). | same |
| F5 | **6 questions have no scenario**, so `startMock` (`app/app.js:374`) never uses them. | same |
| F6 | **The mock exam isn't a holdout, and its domain quotas can never all be met.** Four scenarios give a pool of about 75–78 items, and the mock draws 60 of them, so it's almost entirely items you've already seen. **None of the 15 possible 4-scenario draws can meet all the domain quotas.** For example, draw {1,3,4,6} has 0 of 12 D3 items, and draw {2,4,5,6} has 8 of 16 D1 items. | `app/app.js:374-383` |
| F7 | **Readiness measures how well you remember items, not how well you transfer the skill.** It's the share of *all* questions whose *latest* answer is correct, so repeated attempts overwrite earlier ones. | `app/app.js:96-115` |
| F8 | **The trap T4 description conflicts with TS 5.5.** T4 says "route on … self-rated confidence" is a trap. TS 5.5 explicitly endorses routing low-confidence extractions to human review, with thresholds calibrated on labeled data. `m13.js:27` ("usually confident") overstates the point. | `curriculum.js:78`, guide TS 5.2 vs 5.5 |
| F9 | **Only 3 "Real world today" callouts exist** (m01, m06, m11). `bank.js:28` keys `allowed-tools` as the way to *limit* tools and has no flag noting that current behavior is pre-approval. | grep |
| F10 | **The exam guide doesn't state "60 questions / 120 minutes."** The app hard-codes both. The guide says scaled scoring *equates forms*, so 720 isn't necessarily 72% raw. The guide's 12 sample questions cover scenarios 1, 2, 3 and 5 only. | Exam Guide PDF |
| F11 | **The `segmentReveal` widget's 97% figures may not be labeled as illustrative.** The labels on the compliance and context-token widgets do exist. | `widgets.js:278`, `widgets2.js:143,219` |

**Inherent limit.** The reviewers are AI agents from the same model family as the author, so they will share some blind spots. The plan reduces this risk in three ways: a blueprint-only solver, an options-only solver, and a human checkpoint. It cannot remove the risk. Only external signals can: the official practice exam, or a person who has passed.

---

## Confidentiality and repo hygiene

- The official guide is marked NTK. Extract it into the **scratchpad only**, never into the repo.
- Repo artifacts refer to blueprint bullets by ID (for example `1.1-K1`, `3.4-S2`), with a paraphrase of 10 words or fewer.
- The full-text matrix lives only in the scratchpad or a private artifact.
- No official sample question may be copied or closely paraphrased. Phase 3 checks this.

## Artifacts (all under `audit/`, committed on `claude/peaceful-newton-codnmw`)

| File | Contents |
|---|---|
| `audit/traceability.csv` | One row per blueprint bullet (240 rows: 30 task statements × their K and S bullets): `bullet_id, ts, kind(K/S), paraphrase, lesson_steps (mNN:i), cards (mNN:i), question_ids, rating, notes` |
| `audit/claims-log.csv` | One row per factual claim: `claim_id, location (file:line), claim_text, category, verdict, severity, source_url, exam_vs_today_note, fix` |
| `audit/question-review.csv` | One row per question ID: `id, ts, scenario, domain, verdict, defect_codes, key_agreement (author / blind solver / blueprint-only solver / options-only solver), trap_tags_before→after, length_rank, fix_summary, reviewer, verifier` |
| `audit/gaps.md` | Uncovered or thin bullets, topics taught too thinly, and out-of-scope leaks |
| `audit/consistency.md` | Contradictions between the guide and the app |
| `audit/readiness-review.md` | Findings on the readiness math and the validation design |
| `audit/backlog.md` | Prioritized remediation items, each with severity, effort, owner (agent) and verifier (a different agent) |
| `audit/primitives.csv` | One row per primitive, with its Why-test scores (6 questions × 0–2) and where the app explains it |
| `audit/novice-walkthrough.md` | Each place a novice gets stuck, located at `mNN:step` |
| `audit/SUMMARY.md` | Before and after metrics, the completion checklist, and residual risks |
| `scripts/audit/*.mjs` | Reproducible checks (Phase 0) |

## Labels and rubrics

### Coverage rating (per bullet)

- **COVERED+TESTED.** The bullet is taught in at least one lesson step. It appears in at least one card or recap line. At least two questions test it, and at least one of them is scenario-framed and judgment-based, not recall.
- **COVERED-NOT-TESTED.** Taught, but tested by fewer than two questions, or only by recall questions.
- **THIN.** Mentioned in a clause, with no mechanism or reasoning.
- **MISSING.**
- **OOS-LEAK.** Out-of-scope material taught as if it were exam-relevant.

### Claim verdict

| Verdict | Meaning |
|---|---|
| CORRECT | Matches current documentation. |
| EXAM-FRAMING (flagged) | Matches the blueprint, differs from current product behavior, and has a "Real world today" note. |
| EXAM-FRAMING-UNFLAGGED | Same, but with no note. |
| OUTDATED | Was true once, isn't now, and the blueprint doesn't require it. |
| WRONG | Incorrect. |
| UNVERIFIABLE | No official source found. |
| ILLUSTRATIVE-UNLABELED | An example number not marked as an example. |

**Severity:**
- **S1:** would change an exam answer.
- **S2:** misleading but unlikely to cost a point.
- **S3:** cosmetic.

### Question verdict

The verdict is KEEP, EDIT-MINOR, REWRITE or RETIRE, plus defect codes:

| Code | Meaning |
|---|---|
| `KEY` | The answer key is wrong. |
| `AMB` | Two options are defensible. |
| `DIS-WEAK` | A distractor nobody with partial knowledge would pick. |
| `WHY` | An explanation is wrong or contradicts its option. |
| `TRAP` | A trap tag is wrong or missing. |
| `CUE-LEN`, `CUE-ABS`, `CUE-GRAM`, `CUE-PATTERN` | Length, absolute-wording, grammatical or repeated-pattern cues. |
| `RECALL` | Tests trivia, not judgment. |
| `OOS` | Out of scope. |
| `SAMPLE-CLOSE` | Too close to an official sample question. |
| `TERM` | Applying the terminology policy could lead to a wrong answer. |
| `STEM` | Unrealistic, no scenario, or easier than exam level. |

**Item pass bar.** An item passes only if all of the following hold:
- The author's key, a blind solver and a blueprint-only solver all agree.
- The options-only solver does no better than chance across the bank.
- There is no S1 or S2 defect.
- Every distractor maps to a real misconception, tagged with a trap ID or `—` with a stated misconception.

---

## Phases, order and effort

Effort is in agent working days. "You" marks a checkpoint for you. Order follows risk: wrong facts and answer keys first, weighted toward D1 (27%), then D3 and D4 (20% each).

### Phase 0: Baseline and tooling (0.5 day)

1. Tag the baseline commit `audit-baseline`.
2. Extract the guide PDF into the scratchpad. Parse the 30 task statements into bullet IDs. The PDF splits 4.2 across a page break, so fix that by hand.
3. Write `scripts/audit/content-check.mjs`. It loads the content the way the probe did: a `vm` context over `curriculum.js`, `m*.js` and `bank.js`, mirroring `app/app.js:70-75`. It reports:
   - exactly one `ok` per question, four options, unique IDs, a valid `ts`, and a scenario present;
   - counts per task statement, domain, scenario, and scenario × domain;
   - length rank of the correct option, ratio of correct length to longest distractor, share where the correct option is longest;
   - absolute-word rates (correct vs distractor) and trap-tag coverage;
   - the original-index distribution of the correct option, and a simulation of the seeded display shuffle;
   - mock feasibility: for all 15 possible 4-scenario draws, whether each domain quota can be met;
   - card count per module.
4. Write `scripts/audit/cue-baselines.mjs` with heuristic solvers: pick-longest, pick-most-hedged, pick-least-absolute and pick-most-technical-tokens. Report each one's accuracy.
5. Save the output as `audit/SUMMARY.md` §Before.

**Pass:** the scripts reproduce F1–F6 or correct them, with numbers.

### Phase 1: Blueprint coverage (A) (1.5 days; 2 parallel agents)

- **Agent A1** (D1 and D2) and **agent A2** (D3–D5) each fill `traceability.csv` for their bullets. Each cites exact `mNN:stepIndex`, card indices and question IDs.
- Scenario check:
  - questions per scenario (target ≥ 25 after expansion);
  - scenario × domain mix compared with the guide's scenario descriptions (for example, Scenario 5 should include D4 multi-pass review and batch, not only D3);
  - each scenario's description in `curriculum.js:45-52` compared with the guide.
- Out-of-scope sweep: grep for caching, pricing, streaming, embeddings, OAuth, rate limits, vision and so on in lessons and in `exam-preparation-guide.md` (for example §1 "Partial Assistant Prefill", the caching notes). Each hit is tagged OOS-LEAK, or kept as an explicitly labeled aside.
- Also check:
  - technologies and in-scope topics from the guide's appendix are each mapped;
  - all 4 preparation exercises have a hands-on equivalent;
  - exam-format claims (60 Q / 120 min, $ cost, registration path) are checked against an official Anthropic page, or labeled unverified (F10).

**Pass:** every bullet is rated. Any MISSING or THIN bullet in D1, D3 or D4 is S1 in the backlog.

### Phase 2: Factual accuracy (B) (2.5 days; 5 parallel domain agents)

Each domain agent extracts **every** checkable claim in its modules, cards, widgets (including embedded numbers), question options and explanations, and the matching guide sections. Targets include:
- CLI flags (`-p`, `--output-format`, `--json-schema`, `--resume`, `fork_session`);
- file paths and precedence (CLAUDE.md levels, `.claude/rules/` `paths:`, skills and commands locations, `.mcp.json` vs `~/.claude.json`, MCP scope precedence local > project > user);
- hook event names, matcher and decision fields (`PreToolUse` deny/`updatedInput`, `PostToolUse`), and the Agent SDK `HookMatcher` and `allowedTools`;
- `stop_reason` values: `tool_use`, `end_turn`, `max_tokens`, plus `stop_sequence`, `pause_turn` and `refusal` (check whether these are omitted or misstated);
- `tool_choice` modes (`auto`, `any`, `tool`, `none`);
- Batch API facts: 24-hour window, 50% cost, `custom_id`, result ordering, request and size limits, no multi-turn tool use inside one request;
- MCP primitives (tools, resources, prompts) and `isError` semantics, with protocol errors kept separate from tool-execution errors;
- Explore subagent behavior, plan mode and `/compact`.

How to verify each claim:
- Use WebFetch against code.claude.com/docs, docs.claude.com (API, Agent SDK, Batches) and modelcontextprotocol.io/specification. Record the exact URL, and the section anchor where one exists.
- Apply the terminology policy:
  - when the blueprint and current docs differ, the claim must be EXAM-FRAMING (flagged);
  - if the flag is missing, the claim is EXAM-FRAMING-UNFLAGGED;
  - if following the current product behavior would lead you to pick a wrong exam answer (`bank.js:28` `allowed-tools`, Task vs Agent, commands vs skills, nesting), mark it S1-TERM.
- Precision checks on nuance (rule 7):
  - confidence (escalation vs calibrated review routing; F8);
  - "be conservative" vs explicit criteria;
  - few-shot count guidance;
  - "never" and "always" statements in lessons;
  - batch-cadence arithmetic (`m10.js:71`, guide §12);
  - nested-subagent claims.
- Spot-recheck the four errors the earlier audit claims it fixed (E1–E4) to confirm the fixes are actually in place.

**Pass:** 100% of claims have a verdict and a URL, or are UNVERIFIABLE with a search trail. Zero S1 left unbacklogged.

### Phase 3: Question quality (C), all 120 (3 days; 7 agents)

- **Wave 3a (parallel):**
  - **Blind solver.** A fresh agent sees each stem and options in shuffled order, with no keys and no explanations. It answers, gives a confidence, and flags any second defensible option.
  - **Blueprint-only solver.** Has only the scratchpad guide text and the official docs (no curriculum). Answers each item. Disagreement with the key → `KEY` or `AMB` candidate.
  - **Options-only solver.** Sees the options with the stem hidden. Accuracy above about 35% across the bank, or per-item hits that repeat across seeds → `CUE-*`.
- **Wave 3b (parallel, 1 reviewer per domain).** Each reviewer applies the rubric per item using the 3a results:
  - Does every distractor reflect a plausible misconception?
  - Is each `why` accurate and consistent with its option text?
  - Re-tag traps, including the 219 untagged distractors and the 9 trap definitions, which need tighter wording (fix the T4 conflict).
  - Is the stem realistic, at exam difficulty, and framed as best or first step?
  - Is the item TERM-safe?
  - Is it too close to an official sample? Compare against the 12 samples by meaning, not only by wording.
- **Adversarial reviewer (separate agent).** Tries to break each item by arguing for a distractor using official docs, and writes the strongest case. Any case the domain reviewer can't refute → `AMB` → REWRITE.
- **Output:** `question-review.csv`, plus target counts for the expanded bank (table below).

**Pass:** every ID has a verdict. Every KEY and AMB item is REWRITE or RETIRE.

#### Target bank (about 200 items, weighted by domain; at least 5 per task statement)

| Domain (weight) | Target | Per task statement | Now |
|---|---|---|---|
| D1 (27%) | 54 | 7–8 × 7 task statements | 25 |
| D2 (18%) | 36 | 7 × 5 | 23 |
| D3 (20%) | 40 | 6–7 × 6 (3.4 and 3.3 ≥ 6) | 22 |
| D4 (20%) | 40 | 6–7 × 6 | 28 |
| D5 (15%) | 30 | 5 × 6 | 22 |

- Every item has a scenario.
- Each scenario has at least 30 items, with a domain mix that follows the guide's description of that scenario.
- Add scenario-framed items for the 4 preparation exercises.

### Phase 4: Teaching depth and pedagogy (D) (1.5 days; 2 agents)

- For each module, check five things:
  - the first principle leads to a mechanism, then to exam judgment;
  - every bullet the module maps to in `traceability.csv` is taught with its *reason*, not only its rule;
  - the "how the exam frames it" section and the traps cover the variants the guide lists;
  - the recap and cards are enough to answer a **harder variant**;
  - "Real world today" callouts are present wherever a terminology gap exists.
- Test sufficiency: a fresh agent studies only one module's lesson, recap and cards, then answers 3 new, harder variants the auditor writes per task statement. If it fails any, the module is THIN for that task statement. These variants then become candidate items for the holdout set.
- Output: a ranked list of the concepts most likely to be tested but taught too thinly. Rank by how heavily the bullet is weighted, how often it appears in the guide's samples and exercises, and the current rating.

**Pass:** every module is rated SUFFICIENT, THIN or MISSING per task statement, with evidence.

### Phase 4b: One-stop-shop and first-principles audit (2 days; 3 parallel agents)

This phase tests whether the app alone can take you from base understanding to proficiency.

1. **Primitive inventory.**
   - List every primitive the exam touches:
     - the model as a stateless function; messages and turns; system prompt; context window; tool use and `tool_result`; `stop_reason`; JSON Schema; `tool_choice`;
     - the agentic loop; the Agent SDK; Claude Code; CLAUDE.md and memory; rules; skills; slash commands; hooks; subagents and the Task/Agent tool; plan mode; the Explore subagent; sessions (resume and fork); headless and CI mode;
     - MCP (tools, resources, prompts, transports, scopes, `isError`);
     - the Message Batches API; few-shot prompting; validation–retry; multi-pass review; escalation; provenance.
   - Sources: the guide's "Technologies and Concepts" and "In-Scope Topics" appendices, plus the traceability matrix.
   - Output: `audit/primitives.csv`.
2. **The "Why test" (per primitive).** Score each primitive 0–2 on six questions:
   1. **Problem before.** What was painful before it existed? For MCP: the N×M custom-integration problem, every app wiring every tool by hand.
   2. **What it is.** A plain-language definition with a picture or diagram.
   3. **How it works.** The mechanism at the level the exam needs.
   4. **Why this design.** The tradeoffs it chose and the alternatives it rejected. For MCP: an open protocol instead of per-vendor plugins, and the split between tools, resources and prompts.
   5. **When to use it and when not.** Including its neighbors (MCP vs a built-in tool vs a skill; hook vs prompt; subagent vs a single agent).
   6. **How the exam tests it.** The traps, plus a "Real world today" note.

   A primitive scoring below 10 of 12, or 0 on any question, gets a gap entry. Claims about history and motivation (for example MCP's launch, its open-standard status, the Claude Code SDK being renamed to the Agent SDK) go into `claims-log.csv` with official sources. No folklore.
3. **Novice walkthrough (persona test).** A fresh agent is told it knows only basic LLM chat use. It walks the app in order, from m00 to m13, and logs every place where it hits:
   - a term used before it is defined;
   - a jump in reasoning;
   - a "because" that is missing;
   - a step that needs an outside resource (docs, a video, the markdown guide) to understand.

   Output: `audit/novice-walkthrough.md`, with each issue at `mNN:step`.
4. **Self-sufficiency check.**
   - Every concept the exam needs must be learnable inside the app. External links can only be optional "go deeper" links.
   - Do a section-by-section diff of `exam-preparation-guide.md` against the app. Any in-scope content that exists only in the markdown is an **ABSORB** item.
   - The guide's 4 preparation exercises need an in-app equivalent: a guided lab or simulation with an optional "try it for real" snippet.
   - Exam logistics (format, scoring, scenarios, booking path, study schedule to Dec 31) need a home in the app.
5. **Presentation quality.**
   - Is each primitive explained with a visual (diagram, animation or interactive)?
   - Is reading load reasonable per step on a phone?
   - Are a consistent "primitive card" layout and a glossary or search available so you can look anything up in-app?
   - Rate each module: EXCELLENT, ADEQUATE or WEAK, with specific notes.

**Pass:** every primitive scores at least 10 of 12. The novice walkthrough has zero blocking issues. There are zero ABSORB items left. Every exercise has an in-app home.

### Phase 5: Readiness signal (E) (1 day; 1 agent plus you)

Review `app/app.js:92-131`, `374-400`, and the copy at lines 199 and 405. Expected recommendations:
- **First-attempt accuracy** only (store the first answer separately; don't overwrite it).
- Exclude items whose explanation you've already seen from readiness.
- Show sample size and a 95% interval.
- **Holdout form.** Sequester about 60 of the 200 items (10 per scenario, domain-weighted, written in Phase 7 by a *different* agent than the practice items). They are never shown in lessons, drills or the mock exam, and are unlocked once as "Readiness Check".
- Make mock composition feasible. Use domain quotas *within* the drawn scenarios. Verify all 15 possible draws with a script.
- Replace the "scaled score" with **raw % plus a band**. Keep "≈720" only as a caveated note: Anthropic doesn't publish the mapping, and forms are equated.
- Make the 60-question / 120-minute claim conditional on Phase 1 confirming it.

**Booking threshold (decided now, before any data).**
- Holdout first attempt ≥ 80%. At n = 60 the 95% lower bound is about 70%.
- Every domain ≥ 70% on the holdout.
- Two mock exams ≥ 80%, at least a week apart.
- Official practice exam ≥ 80% once you have access.
- If the holdout and the official practice exam disagree by more than 10 points, trust the official one and treat the app as miscalibrated.

**Practice-exam access.** Ask your Anthropic Partner/Academy contact for the link that guide step 8 says "will be provided separately". Track this as backlog item R0. Save the practice exam for the final checkpoint.

### Phase 6: Markdown guide vs. app consistency (F) (1 day; 1 agent)

- Compare section by section against `traceability.csv` and `claims-log.csv`. Look for:
  - contradictions;
  - claims that appear in one source but not the other;
  - terminology inconsistency;
  - out-of-scope depth in the guide.
- The app is authoritative for exam framing. Fix the guide to match, unless the claims log shows the app is wrong.

**Pass:** zero open S1 or S2 contradictions.

**Checkpoint (you, about 1.5 hours):** review `SUMMARY.md` §Findings, the top 20 backlog items and the readiness design. Approve the remediation scope.

### Phase 7: Remediation (8–10 days; parallel authors)

1. **S1 fixes first.** Wrong claims, KEY and AMB items, unflagged terminology that could cause a wrong answer, and the T4/5.5 precision fix. Rewrite the trap definitions in `curriculum.js:74-84`.
2. **Lesson depth.** Expand the THIN topics from Phase 4. Add missing "Real world today" callouts. Label illustrative widget numbers.
2b. **Foundations and one-stop shop** (from Phase 4b).
   - Add a **Foundations track** before m01, about 3–4 short modules:
     - an LLM call is a stateless function (messages, system prompt, context window, tokens at concept level only);
     - tool use and JSON Schema from scratch;
     - the Claude product map: what the API, the Agent SDK, Claude Code and MCP each are, why each exists, and how they relate (one diagram);
     - how the exam works, plus your study plan to Dec 31.
   - Give every primitive a consistent **"Why it exists" panel**: problem before, design, tradeoffs, when to use and when not. Fill all Why-test gaps. MCP gets a full origin story with sourced history.
   - Add an in-app **Glossary/Primitives index** that is searchable and links each term to its lesson step and cards, so nothing needs an outside lookup.
   - Turn the 4 preparation exercises into **in-app guided labs**: simulated with widgets, plus optional copy-paste snippets for real practice.
   - Absorb every ABSORB item from the markdown guide.
   - Fix every blocking issue from the novice walkthrough.
   - Load the artifact-design skill before building new screens, so they match the existing design system.
3. **Item rewrites.** Rebalance option lengths. Correct options should be the longest in about 25–30% of items, and the ratio of correct to longest distractor should be ≤ 1.25. Remove absolute and grammatical cues. Tag every distractor.
4. **New items (about 80).** Hold the practice items and the holdout items to separate author agents. Each item goes through Phase 3's solver panel before it's accepted.
5. **Engine changes** from Phase 5 in `app/app.js`. Add a holdout flag to the item schema.
6. **Guide fixes** from Phase 6. Add a banner at the top of the markdown guide saying the app is the primary study path.
7. **Update the status record.** Correct the claims in `docs/STUDY-APP-PLAN.md` §6 (F1), and add a dated audit section.

**Independence rule.** No agent verifies content it wrote. Verifiers receive only the final content, the guide and the docs, not the authors' rationale.

### Phase 8: Independent verification (2 days)

1. Re-run `content-check.mjs` and `cue-baselines.mjs`. Targets:
   - exactly one `ok` per question, unique IDs, every bullet COVERED+TESTED;
   - ≥ 5 items per task statement and every item has a scenario;
   - pick-longest ≤ 30%, every heuristic solver ≤ 35%;
   - correct options and distractors use absolute wording at rates within 5 points of each other;
   - all 15 mock draws are feasible.
1b. Re-run the novice walkthrough and the Why-test using **new** agents. Their pass bars are the same as in Phase 4b.
2. Fresh solver panel (3a) on **all** items. Key agreement must be 100%, or each disagreement must be adjudicated with a citation.
3. Fresh claims spot-check: a random 25% of claims plus 100% of S1 fixes, done by an agent that didn't do Phase 2.
4. Headless Playwright tests (Chromium is preinstalled) at 1280px light and 390px dark. Check that there are no console errors or horizontal overflow, and that each of the following renders and completes:
   - every lesson step and every widget interaction;
   - each scenario drill;
   - a full mock run with forced submit;
   - the holdout flow;
   - flashcard review;
   - readiness numbers recomputed against a fixed seeded state.
5. Republish the existing artifact. Find its URL with Artifact `list`, read it first, and publish to the same URL. Then commit, push and open a draft PR.

### Phase 9: External calibration (ongoing, you)

1. Take the holdout Readiness Check once, cold.
2. Take the official practice exam when you have access.
3. Ideally, get one person who has passed to review 20 randomly sampled items (you would ask a contact).
4. Record the results in `SUMMARY.md` and apply the booking rule from Phase 5.

---

## Timeline (about 3.5 weeks; study time continues in parallel on modules that already pass)

| Week | Work |
|---|---|
| Oct 31–Nov 6 | Phases 0–3. Phase 2 and Phase 3a run in parallel. |
| Nov 7–12 | Phases 4, 4b, 5 and 6, then your checkpoint. |
| Nov 13–25 | Phase 7, including the Foundations track and the labs. Ship it in two drops: S1 fixes plus Foundations by Nov 18, the rest by Nov 25. |
| Nov 26–28 | Phase 8, republish |
| Dec 1–20 | Study, holdout check, official practice exam, book |

## Subagent topology (parallel waves, 5 agents at most at once)

| Wave | Agents |
|---|---|
| 1 | A1, A2 (coverage) and B-D1 … B-D5 (claims). Start B-D1 and B-D3 first because of their weight. |
| 2 | Blind, blueprint-only and options-only solvers, then 5 domain item reviewers and 1 adversarial reviewer |
| 3 | 2 pedagogy agents, 1 primitives and Why-test agent, 1 novice-persona walker, 1 readiness and consistency agent |
| 4 | Authors: practice-item authors (by domain), a holdout author (isolated), lesson fixers |
| 5 | Fresh verifiers: solver panel, claims spot-check, browser tester |

## Definition of "audit complete" (all must be true before you rely on this to book)

1. Every blueprint bullet is COVERED+TESTED. No out-of-scope leaks remain unlabeled.
2. Every claim has a verdict and a source. There are zero WRONG, OUTDATED or EXAM-FRAMING-UNFLAGGED claims at S1 or S2. Every illustrative number is labeled.
3. Every question meets the pass bar. Key agreement across independent solvers is 100%, or each disagreement is adjudicated. The cueing metrics meet the Phase 8 targets.
4. The bank has about 200 items, matches the domain targets, and contains a sequestered holdout of about 60 items that you haven't seen.
5. Readiness uses first-attempt data and shows an interval. The scaled score is caveated, and the mock feasibility check passes.
6. There are zero open S1 or S2 contradictions between the guide and the app.
6b. **The app is a one-stop shop.**
   - The Foundations track exists.
   - Every primitive scores at least 10 of 12 on the Why-test, with sourced history and motivation.
   - A fresh novice-persona walkthrough (a *new* agent) finds zero blocking issues.
   - There are no in-scope concepts that live only outside the app.
   - The 4 exercises exist as in-app labs.
   - The glossary covers every primitive.
7. The scripts and the headless browser suite pass, the artifact is republished, and the PR is up.
8. `SUMMARY.md` lists the residual risks honestly, including AI-only validation if Phase 9 steps 2 and 3 haven't happened yet.

## Critical files

- `app/content/curriculum.js`: traps, scenarios
- `app/content/m00–m13.js` and `bank.js`
- `app/widgets.js` and `widgets2.js`: illustrative labels
- `app/app.js`: lines 70-75, 92-131 and 374-400, plus the router and views for the glossary and labs
- new Foundations lesson files (registered in `app/index.html` and the publish `files` map, following `app/README.md`)
- `exam-preparation-guide.md`
- `docs/STUDY-APP-PLAN.md` §6
- new: `scripts/audit/`, `audit/`
