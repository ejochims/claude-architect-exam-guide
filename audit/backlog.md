# Remediation backlog

Items are ordered by severity, then by exam weight. **S1** would change an exam answer, **S2** is misleading, **S3** is cosmetic. Each item names its source evidence. The owner (the author agent) and the verifier must be different agents (see `docs/AUDIT-PLAN.md`, the independence rule in Phase 7).

The backlog fills in as each phase completes. Claims in the D1, D3, D4 and D5 domains, plus the question review (Phase 3) and the pedagogy review (Phases 4 and 4b), haven't reported yet.

## R: Readiness and exam-format risks (need your action, or affect the booking decision)

| ID | Sev | Item | Evidence | Action |
|---|---|---|---|---|
| R0 | S1 | No access yet to the official practice exam, the only external calibration signal | Guide v0.1 preparation step 8 | **You:** ask your Partner Network or Academy contact for the practice-exam link. Save it for the final pre-booking check. |
| R1 | S1 | The current official certification FAQ says the exams use "multiple choice and scenario-based multiple response questions". Guide v0.1 says every question has one correct answer and three distractors. The app models only single-answer items, so its chance baseline and readiness math assume that format. | `audit/work/coverage-A1-notes.md` §4 (FMT-1); https://anthropic-partners.skilljar.com/page/faq-certifications | Confirm the CCAR-F format (see R2). If multiple-response items are in scope: add a `multi` item type (several `ok` options, all-or-nothing scoring), write about 15 practice items, and update `content-check.mjs` and the readiness math. |
| R2 | S1 | Exam content may be updated. Pearson VUE announces updated content from 2026-12-07 for the other Claude exams, and there are unconfirmed mentions of updated guides on 2026-11-17. The audit uses Guide v0.1, dated Feb 2025. | `coverage-A1-notes.md` §4 (FMT-2) | **You:** check the current CCAR-F exam guide version on the Partner Academy after Nov 17, and before booking. If it changed, re-parse it and re-run Phase 1 coverage against the diff. |
| R3 | S2 | "60 questions" is stated only on third-party sites. The 120-minute limit is official. | `coverage-A1-notes.md` §4 | Show the question count in the app as "about 60 (unofficial)" until it's confirmed. Keep the 60-item mock, which costs nothing if the real count differs. |
| R4 | S2 | The app doesn't mention the 4-attempts-per-12-months limit, the retake waiting periods, or the 12-month validity. | FAQ | Add these to the in-app logistics page (the Foundations track). |
| R5 | S1 | The mock exam can't meet the domain quotas in any of the 15 possible draws. Readiness uses the latest answer, not the first attempt, and there's no holdout set. | `audit/SUMMARY.md` | Phase 5 and Phase 7 step 5. |

## C: Factual claims (Phase 2)

### Domain 2: 10 S1 claims from `audit/work/claims-D2.csv`

| ID | Sev | Item | Locations | Fix |
|---|---|---|---|---|
| C-D2-1 | S1 (TERM) | `tool_choice` `any` and `{type:"tool"}` are taught as guaranteeing a tool call, with no "Real world today" note. The D2 auditor reports that current top-tier models reject forced tool choice. **This is a surprising claim. Re-verify it against the tool-use docs before acting on it.** | m02.js:54-55 (D2-017), q02-4 (D2-033), q02-5 (D2-036) | Keep the exam framing, which is still correct for the exam. Add a "Real world today" callout in m02 and in the `why` text of q02-4 and q02-5, worded exactly as the official docs state it. |
| C-D2-2 | S1 (TERM) | b4-1 keys Glob as the right tool for file-pattern search. The `why` on the Bash option conflicts with current Claude Code behavior. | bank.js:67-74 (D2-100) | Keep the key. Reword that option's `why` and add a real-world note. |
| C-D2-3 | S1 | **The markdown guide teaches the old MCP error split.** Since MCP spec 2025-11-25 (SEP-1303), invalid or missing tool *arguments* are returned as tool execution errors (`isError: true`), not as JSON-RPC protocol errors. The guide still says missing parameters produce a protocol error. | exam-preparation-guide.md:366, 369-371, 972, 975, 1785, 1839 (D2-133/135/154/156/178/180) | Rewrite these to match the current specification. Then check that the exam framing (TS 2.2) doesn't depend on the old split; if it does, flag it as exam-framing. Cross-check m04 for the same error. |

The other 28 D2 S2 items and 23 D2 S3 items: to be triaged after all the domain claim checks report.

### Domain 1: 10 S1 claims from `audit/work/claims-D1.csv`

| ID | Sev | Item | Locations | Fix |
|---|---|---|---|---|
| C-D1-1 | S1 (TERM) | **The rule that a coordinator's `allowedTools` must include `"Task"` has no flag.** This is exam framing (TS 1.2/1.3), so keep it as the exam answer. In today's Agent SDK, `allowedTools` only pre-approves tools and the Agent tool needs no approval, so a coordinator can delegate without it. The m06 "Real world today" note covers only the rename and nesting. | m06 card c0, m06:19, q06-1 key, m06 recap (D1-079/089/102/116); guide:1133, 1157, 1855, 1887 (D1-202/210/225/235) | Extend the m06 callout. Add a one-line real-world note to the card, q06-1's `why` and the guide lines. |
| C-D1-2 | S1 | q06-1, option A: the `why` says a vague subagent description can't stop delegation. The SDK troubleshooting docs say a vague description is exactly why Claude answers directly instead of delegating. | q06-1 (D1-101) | Rewrite the `why`. Check whether option A becomes defensible, and if so send the item to Phase 3 as AMB. |
| C-D1-3 | S1 | **Trap T4 treats any routing on self-rated confidence as a trap.** This conflicts with TS 5.5 (and 4.6): confidence calibrated on labeled data is valid for routing work to human review. Baseline finding F8. | curriculum.js:78 (D1-157) | Reword T4 so it covers *uncalibrated self-confidence as an escalation or complexity proxy*, and explicitly allows calibrated confidence for prioritizing review. Re-tag any questions that use T4. |

Key D1 S2 items, kept here so they aren't lost:
- **D1-091:** "One Task call per turn runs them sequentially" is outdated. Subagents now run in the background by default.
- **D1-085:** A subagent no longer starts with an "empty conversation". It also gets CLAUDE.md, and fork subagents inherit the parent conversation.
- **D1-059:** In the m03 hook example, `matcher="process_refund"` would never match, because SDK custom tools are named `mcp__<server>__<tool>`.
- **D1-198 and D1-211:** The guide says subagents can't be resumed, but they can. The guide also names the AgentDefinition field `allowedTools`; the real field is `tools`.

## Q: Question quality (Phase 3)

| ID | Sev | Item | Evidence | Fix |
|---|---|---|---|---|
| Q1 | **S1, blocks any readiness claim** | **The bank can be answered without reading the questions.** An options-only solver scores 119/120, and pick-longest scores 81%. A well-informed blind solver scores 120/120, all at confidence 4–5. So the readiness score, drills and mock exams carry almost no information about how you'd do on the exam. | `audit/work/solver-results.md`, `audit/SUMMARY.md` | Rewrite the distractors in all 120 items to the "equally expert" standard in solver-results.md. Re-balance which kinds of option are keyed (about 25–35% keyed to the softer option). Gate every item on the options-only panel scoring ≤ 35%. **Until this is done, don't use app scores to decide on booking.** |
| Q2 | S2 | 4 items flagged ambiguous by the blind solver | `b2-5`, `q09-4`, `q11-4`, `q13-1` | Send them to the domain reviewers in Phase 3b, then rewrite them. |
| Q3 | S2 | `q11-6` treats `argument-hint` as enforcing an argument, but it is only an autocomplete hint | blind solver; cross-check D3 claims | Fix the stem or option wording. |
| Q4 | S2 | Trap definitions T1–T9 describe obviously weak options, which teaches you to spot weak options rather than to tell good ones apart | solver-results.md | Rewrite each trap as a *plausible expert mistake*, and add the T4 fix from C-D1-3. |

## P: Pedagogy and the one-stop shop (Phases 4 and 4b)

Pending.
