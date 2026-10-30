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

## Q: Question quality (Phase 3)

Pending.

## P: Pedagogy and the one-stop shop (Phases 4 and 4b)

Pending.
