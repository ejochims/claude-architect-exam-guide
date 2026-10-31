# Remediation backlog

Items are ordered by severity, then by exam weight. **S1** would change an exam answer, **S2** is misleading, **S3** is cosmetic. Each item names its source evidence. The owner (the author agent) and the verifier must be different agents (see `docs/AUDIT-PLAN.md`, the independence rule in Phase 7).

The backlog fills in as each phase completes. Claims in the D1, D3, D4 and D5 domains, plus the question review (Phase 3) and the pedagogy review (Phases 4 and 4b), haven't reported yet.

## Remediation log

### Batch 1 (2026-10-31): S1 claim fixes and the "Exam vs. today" page

| Item | Status |
|---|---|
| C-D1-1 | Fixed: the `allowedTools`/Task rule is now flagged (m06 callout, card and q06-1; guide 1133/1157/1855/1887) |
| C-D1-2 | Fixed: the q06-1 stem now isolates the coordinator's config (the same definitions work under another coordinator), and option A's `why` is corrected |
| C-D1-3 / C-D5-1 | Fixed: T4 is narrowed to raw confidence as a complexity proxy for escalation, and explicitly allows calibrated confidence for routing review. The m13 lede, the bullet and card c3, and m00 q00 option D are made precise |
| C-D2-1 / C-D4-1 | Fixed: "Real world today" callouts on forced `tool_choice` in m02 and m09; q02-4/q02-5 `why` say "exam framing" |
| C-D2-2 | Fixed: b4-1 Bash `why` |
| C-D2-3 | Fixed: guide MCP error tiers at 366/367/371/972/973/975/1785/1839, per spec 2025-11-25 (verified). m04 was already consistent |
| C-D3-1 | Fixed: b2-3 `why` adds the exam-framing note |
| C-D3-2 | Fixed: the m11 callout covers `argument-hint` and same-name precedence; guide 1508 |
| C-D3-3 | Fixed: the m11 sorter item states it's the exam answer and that skills work today |
| C-D4-2 | Fixed: the m10 batch server-tool nuance |
| C-D4-3 | Fixed: guide 607 now says refine on a sample, then batch |
| Q6 | Fixed: b5-4 is rewritten, with an unambiguous deadline and equally expert distractors |
| New | **`#today` "Exam vs. today" page**: 16 rows, each with a source. Linked from the blueprint page and every new callout |

### Batch 2 (2026-10-31): readiness engine (`app/app.js`)

| Readiness finding | Status |
|---|---|
| E2 / E3 | Fixed: first attempts are stored in `state.first`, written once and merged across devices by earliest time. Readiness, mastery and weakest areas use them. Older saves are seeded once from their latest answers. Verified headlessly: a wrong answer, then "Try again", then a right answer leaves the first attempt wrong. |
| E4 | Partly fixed: the engine supports `holdout: true`, so items are sequestered from every practice path. The Readiness Check view and the 60 holdout items come in batch 5. |
| E5 / E6 | Fixed: the mock reports a domain-weighted % (blueprint weights, renormalized over the domains drawn) plus the raw % and a 95% Wilson range. The scaled-score function is removed. The history and home tiles show %. |
| E7 | Fixed: the home copy no longer says "Aim for 80%+ before booking". It says practice scores alone don't justify booking, and states the real rule. |
| E8 | Fixed: the task chip is hidden in exam mode (verified: 0 chips). |
| R3 | Fixed: the mock intro says "about 60 questions (the count is unofficial)". |
| Still open | Mock domain quotas remain infeasible for some draws. Weighted scoring makes scores comparable; a feasible bank comes with batches 4–5. |

### Batch 3 (2026-10-31): Foundations, MCP's "why", logistics, glossary

| Item | Status |
|---|---|
| P1 (BLOCKING) | Fixed: **F2 "Tool use from scratch"**. A tool definition, JSON Schema basics, and the full round trip as annotated JSON (`tool_use` → your code executes → `tool_result`, plus `is_error`), with a sequence diagram. |
| P2, P4 (BLOCKING) | Fixed: **F3 "The Claude product map"**. API vs Agent SDK vs Claude Code vs MCP: what each is, why it exists, who runs the loop, and which exam domains live where, with a layered diagram and sourced history (Claude Code, Feb 2025; Claude Code SDK renamed Agent SDK, Sep 2025). |
| P3, P8 (BLOCKING / MAJOR) | Fixed: **new m05 step 0, "Why MCP exists"**. The integration problem before MCP ("N×M" labeled as our gloss), the 2024-11-25 launch, the open-standard rationale, the Dec 2025 donation to the Linux Foundation (all sourced), a host/client/server diagram, `tools/list` and `tools/call`, who executes, the transports (verified against spec 2025-11-25), and why there are three primitives. |
| P6 (MAJOR) | Fixed: **F1 "What a Claude call really is"**. HTTP/API/SDK, request anatomy, content blocks and `stop_reason`, tokens, the context window, `max_tokens`, roles and the system prompt, with a diagram. Plus a **searchable glossary** (`#glossary`, 50 terms, each linked to its lesson) and a nav link. |
| R4, F10 | Fixed: m00 opens with verified logistics (120 min, 100–1,000 scale, 720, $125, Partner Network, 4 attempts in 12 months, 12-month validity), the 60-question count labeled unofficial, the multiple-response and guide-update warnings, sources, and the booking rule. |
| Note | Inserting m05 step 0 shifts m05's step indices by one. Saved step-completion for m05 may be off by one, and older audit references to `m05:i` mean the pre-batch numbering. |
| Still open | P5: move the m00 quiz and trap spotter to a capstone. P7: "Why it exists" panels for the remaining primitives below 10/12. The 4 preparation exercises as in-app labs. |

### Batch 4 (2026-10-31): all 120 questions rewritten (backlog Q1–Q7)

| Metric (whole bank) | Before | After | Target |
|---|---|---|---|
| Correct option is the longest | 81.7% | **24.2%** | ≤ 30% |
| Correct option's length rank (longest / 2nd / 3rd / shortest) | 98 / 15 / 4 / 3 | **29 / 32 / 30 / 29** | about even |
| Correct-to-longest-distractor ratio above 1.25 | 56 items | **1** | 0–few |
| pick-longest | 81.3% | **22.9%** | ≤ 35% |
| pick-most-clauses | 54.9% | **22.8%** | ≤ 35% |
| pick-most-concrete (new) | 53.6% | **25.1%** | ≤ 35% |
| pick-enforce-in-code (new) | 36.9% | **27.7%** | ≤ 35% |
| pick-shortest / pick-least-concrete (new, catch over-correction) | — | 24.4% / 16.5% | ≤ 35% |
| Absolute wording, correct vs distractors | 20.8% vs 28.9% | **28.3% vs 31.4%** | within 5 points |

- **Q5:** done. All 9 SAMPLE-CLOSE items now test different decisions: q00-1, q02-1, q04-3, q06-5, q08-7, q10-1, q11-3, b1-1, b5-1.
- **Q2:** done. AMB items are disambiguated in their stems: b1-2 (non-idempotent), b2-5 (fixes interact), q09-4 (locale-ambiguous dates). q11-4 and q13-1 keep their keys, with clarified explanations. b5-4 was fixed in batch 1.
- **Q3 / Q7:** the `why` and trap issues are applied during the rewrites. Terminology notes are added where keys rely on exam framing.
- **Method.** Items were rewritten inline, domain by domain, with `scripts/audit/apply-rewrites.mjs`. Each domain was gated with `cue-baselines.mjs --ts N` before committing.
- **Still owed:** Phase 8 runs a fresh options-only solver and a blind solver on the rewritten bank, to confirm with a model and not just heuristics.

### Batch 5 (2026-10-31): bank expanded to 204 items, with the Readiness Check

| Metric | Before | After |
|---|---|---|
| Total items | 120 | **204**: 144 practice and 60 holdout |
| Task statements with fewer than 5 items | 21 | **0** |
| Domain mix (D1–D5) | 21/19/18/23/18% | **26.5 / 18.1 / 20.1 / 19.6 / 15.7%** against 27/18/20/20/15 |
| Holdout | none | **60 items, 10 per scenario**; D1 17, D2 11, D3 12, D4 12, D5 8 |
| Stem-blind heuristics, practice and holdout separately | — | every one ≤ 35% (holdout: pick-longest 31.7%, most-clauses 27.4%) |
| Correct option longest, whole bank | 81.7% | 32.4%. Under the 35% gate but above the 30% aim, because the holdout keys are a little long. |
| Absolute wording, correct vs distractors | 20.8% vs 28.9% | **26.0% vs 30.2%** |

- **New practice items (24, `b7-*`).** These cover the thinnest task statements: plan mode vs direct execution (3.4 ×3), path rules (3.3 ×3), CLAUDE.md loading (3.1), decomposition (1.6 ×3), hub-and-spoke and context scoping (1.2 ×2), sessions (1.7 ×2), and loop, enforcement, hook and context-passing items, plus 2.1, 2.3, 2.5, 5.3 and 5.5.
- **Holdout (`content/holdout.js`, `h1-1` to `h6-10`).** These were written to the harder standard. Each shares a task statement with practice items but presents a new decision or a new surface. None paraphrases the official samples.
- **Readiness Check view (`#readiness`).**
  - It takes one attempt, merged across devices by its earliest timestamp, with a 120-minute timer.
  - The result shows the raw % with a 95% range, a per-domain breakdown, and the booking-bar verdict (80% overall and every domain at 70% or more), along with a reminder about the other booking conditions.
  - Verified headlessly: all 60 holdout items appear in the check, and none appear in mocks or drills.
- **Residual risk: the same author wrote the holdout and the practice rewrites.** The plan called for separate author agents; efficiency mode dropped that. Batch 7's blind solver on the holdout is the independence check.
- **Still open: 10 of 15 mock draws can't meet every domain quota** from the practice pool. Scoring is domain-weighted, so results stay comparable, but some draws under-sample D1 or D3.

### Batch 8 (2026-10-31): labs and "Why it exists" panels

| Item | Status |
|---|---|
| P7: "why this design" weakest across primitives | **Panels added** in m01 (agentic loop; workflows vs agents), m02 (built-in tools), m03 (hooks), m05 (tools, resources and prompts), m06 (hub-and-spoke, evaluator-optimizer, allowedTools vs tools vs allowed-tools), m07 (/compact, scratchpad, Explore, manifests), m08 (few-shot), m11 (CLAUDE.md and memory, rules, commands, skills, @import, plan mode, Explore, iterating), m12 (sessions). Each panel covers the problem before, what it is, why this design, and when to use it vs its neighbors. |
| Final novice walkthrough (`audit/work/novice-final.md`): 1 BLOCKING, 16 MAJOR | **Addressed.** CLAUDE.md and memory are now defined (m11). Also added: agent, statelessness and why the prompt is probabilistic (F1); where the `tools` list goes and the round trip in prose (F2); harness, permissions, which product to pick, hooks and subagents (F3); built-in tools (m02); resources (m05); skill anatomy, plan mode mechanics, Explore (m11). |
| The 4 official preparation exercises have no in-app home | **Built as labs L1–L4** (`content/l01.js`–`l04.js`): support agent with escalation; Claude Code team configuration; structured extraction pipeline; multi-agent research pipeline. Each lab has a brief with a diagram and done-when criteria, a design-decision sorter, annotated code or config to build and run, a debugging sorter, a recap, and flashcards. |
| Verification | content-check passes (113 cards, 21 modules); browser suite 274 checks, no problems. |

### Batch 9 (2026-10-31): capstone (backlog P5)

| Item | Status |
|---|---|
| P5: m00 tested material from m02–m12 on day one | **Fixed.** The trap spotter and q00-1, q00-2 and q00-3 moved, unchanged, into the new **Module 14, "Capstone: think like the exam"**, after Module 13 and before the labs. It opens with a recap of the four moves and the booking rule, linking to the mock and the Readiness Check. m00 now keeps only orientation (logistics and how to read a question), and its recap points to the capstone. Question IDs are unchanged, so saved answers carry over; m00's saved step-completion indices may be off by up to two. |

### Batch 10 (2026-10-31): mock balance and remaining claims

| Item | Status |
|---|---|
| Mock domain balance (E5) | **Fixed.** `startMock` fills each domain's quota from the drawn scenarios, then borrows from other scenarios. All 15 draws now meet the blueprint weights exactly. 14 new practice items (`b8-*`: D4 in scenarios 1–4, D3 in scenario 4) cut borrowing to 6 of 15 draws, at most 6 of 60 questions. |
| App-side S2/S3 claims | **Resolved:** wording fixes and exam-framing notes across m00–m13, the `segmentReveal` arithmetic and label, and the q07-1 trap tag. Status per row is in `audit/claims-status.md`. |

## R: Readiness and exam-format risks (need your action, or affect the booking decision)

| ID | Sev | Item | Evidence | Action |
|---|---|---|---|---|
| R0 | S1 | No access yet to the official practice exam, the only external calibration signal | Guide v0.1 preparation step 8 | **You:** ask your Partner Network or Academy contact for the practice-exam link. Save it for the final pre-booking check. |
| R1 | S1 | The current official certification FAQ says the exams use "multiple choice and scenario-based multiple response questions". Guide v0.1 says every question has one correct answer and three distractors. The app models only single-answer items, so its chance baseline and readiness math assume that format. | `audit/work/coverage-A1-notes.md` §4 (FMT-1); https://anthropic-partners.skilljar.com/page/faq-certifications | Confirm the CCAR-F format (see R2). If multiple-response items are in scope: add a `multi` item type (several `ok` options, all-or-nothing scoring), write about 15 practice items, and update `content-check.mjs` and the readiness math. |
| R2 | S1 | Exam content may be updated. Pearson VUE announces updated content from 2026-12-07 for the other Claude exams, and there are unconfirmed mentions of updated guides on 2026-11-17. The audit uses Guide v0.1, dated Feb 2025. | `coverage-A1-notes.md` §4 (FMT-2) | **You:** check the current CCAR-F exam guide version on the Partner Academy after Nov 17, and before booking. If it changed, re-parse it and re-run Phase 1 coverage against the diff. |
| R3 | S2 | "60 questions" is stated only on third-party sites. The 120-minute limit is official. | `coverage-A1-notes.md` §4 | Show the question count in the app as "about 60 (unofficial)" until it's confirmed. Keep the 60-item mock, which costs nothing if the real count differs. |
| R4 | S2 | The app doesn't mention the 4-attempts-per-12-months limit, the retake waiting periods, or the 12-month validity. | FAQ | Add these to the in-app logistics page (the Foundations track). |
| R5 | S1 | The readiness signal is inflated in several ways. "Try again" deletes the earlier answer, so readiness can reach 100% by retrying. Every answer overwrites the stored one. There's no holdout set. The mock can't meet its domain quotas in any of the 15 draws. The mock shows task-statement chips. The scaled score shows false precision. | `audit/readiness-review.md` (E1–E10) | Implement the design and booking rule in readiness-review.md (Phase 7, step 5). |

## C: Factual claims (Phase 2)

### Domain 2: 10 S1 claims from `audit/work/claims-D2.csv`

| ID | Sev | Item | Locations | Fix |
|---|---|---|---|---|
| C-D2-1 | S1 (TERM) | `tool_choice` `any` and `{type:"tool"}` are taught as guaranteeing a tool call, with no "Real world today" note. The D2 auditor reports that current top-tier models reject forced tool choice. **Verified 2026-10-30** on https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools#forcing-tool-use: `any` and `tool` return 400 on Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1, and with manual extended thinking. The docs recommend `auto` + `strict: true`, or structured outputs. This also covers D4-038 (m09.js:17). | m02.js:54-55 (D2-017), q02-4 (D2-033), q02-5 (D2-036) | Keep the exam framing, which is still correct for the exam. Add a "Real world today" callout in m02 and in the `why` text of q02-4 and q02-5, worded exactly as the official docs state it. |
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

### Domain 3: 4 S1 claims from `audit/work/claims-D3.csv` (221 claims: 168 correct, 23 exam-framing-unflagged, 6 wrong, 3 outdated)

| ID | Sev | Item | Locations | Fix |
|---|---|---|---|---|
| C-D3-1 | S1 (TERM) | The exam's TS 3.2 wording makes "restrict" the exam answer for skill `allowed-tools`. Today the field only pre-approves tools. b2-3 keys the exam framing but has no note. | bank.js:28 b2-3 (D3-125) | Keep the key. Add a "Real world today" line to the `why`. The m11:61 callout already exists; link it from b2-3. |
| C-D3-2 | S1 → EXAM-FRAMING-UNFLAGGED (the blueprint's own wording supports "prompts") | `argument-hint` is described as "prompting for missing parameters". It is only an autocomplete hint. This matches the blind solver's flag on `q11-6`. | m11.js:58 (D3-029), guide:1508 (D3-177), q11-6 | Reword to "shows an argument hint in autocomplete". If the exam blueprint frames it differently, flag the difference. |
| C-D3-3 | S1 | A sorter marks `/release-notes` as belonging in `.claude/commands/`. A project skill in `.claude/skills/` is equally valid today, so a learner who knows the current product is marked wrong. | m11.js:74 (D3-036) | Accept both answers, or reword the item so only one is correct, and add a note that commands have merged into skills. |

Key D3 S2 items:
- **`/memory` is taught as "shows loaded memory files".** Today `/context` shows what's loaded and `/memory` opens files for editing.
- **Guide:1547:** the description of the `PreToolUse` "defer" decision is wrong.
- **Guide:1549:** `UserPromptSubmit` can't modify the prompt; it can only block it or add context.
- **Guide:1582:** the CLAUDE.md default for subagents is backwards. Subagents load it by default; only the built-in Explore and Plan agents skip it.

### Domain 4: 3 S1 claims from `audit/work/claims-D4.csv` (192 claims: 142 correct, 30 exam-framing-unflagged, 8 wrong, 6 outdated; m08–m10 have no "Real world today" callouts)

| ID | Sev | Item | Locations | Fix |
|---|---|---|---|---|
| C-D4-1 | S1 (TERM) | Forced `tool_choice` is taught as the way to guarantee structure, and plain `tool_use` as "the most reliable path". Today only `strict: true` or `output_config.format` *guarantees* schema-valid output, and forced tool choice returns 400 on current top models (verified; see C-D2-1). | m09.js:17 (D4-038); m09 (D4-031/039/049) | Keep the exam answer (TS 4.3: tool_use + JSON Schema + tool_choice). Add a shared "Real world today" callout to m02 and m09 covering forced tool use, strict tools and structured outputs. |
| C-D4-2 | S1 (TERM) | "Batch has no multi-turn tool calling inside a request" is true only for client tools. Server tools (web search, code execution) do run inside batch requests. | m10.js:23 (D4-068) | Keep the exam rule for client tools and add the server-tool nuance as a real-world note. |
| C-D4-3 | S1 | **The guide contradicts the blueprint, the app and itself.** It says to submit everything to the batch first and treat sampling as minor. The blueprint, q10-6 and guide:1725 all say to refine prompts on a sample first. | guide:607 (D4-145) | Rewrite guide:607 to say: refine on a sample, then batch. |

Key D4 S2 and S3 items:
- **guide:460:** calls second-call verification "generally inferior", which conflicts with blueprint 4.6.
- **The guide recommends assistant prefill,** which returns 400 on Claude 4.6 and later models (D4-120/160/161/185).
- **m08 teaches "2–4" few-shot examples.** That count comes from the blueprint, but current docs say 3–5. Keep the blueprint's number for the exam and add a real-world note.
- **q08-4 and trap T5 vs. current docs.** q08-4's explanation says merging tools loses the distinction between them. The current tool docs recommend *consolidating related operations into one tool with an `action` parameter*. Clarify that the blueprint warns against consolidating *distinct-purpose* tools behind vague descriptions, and add a real-world note to T5.
- **`context_length_exceeded` is an invented error name** (q10-3, guide:1733). The real error message is "prompt is too long".
- **Explanations claim temperature 0 is deterministic.** It isn't.

### Domain 5: 1 S1 claim from `audit/work/claims-D5.csv` (158 claims: 126 correct, 17 wrong)

| ID | Sev | Item | Locations | Fix |
|---|---|---|---|---|
| C-D5-1 | S1 | Trap T4 condemns all routing on model confidence. This duplicates **C-D1-3** (finding F8): fix them once. | curriculum.js:78 (D5-094), T4 why (D5-095) | See C-D1-3. Narrow T4 to "raw self-confidence as a proxy for case complexity in escalation". |

Key D5 S2 items:
- **The confidence nuance is overstated in four places.** m13.js:27 says the agent is "usually confident"; the research is mixed (overconfident in some studies, reasonably calibrated in others). m13.js:16 says "not when the agent feels uneasy", which reads as rejecting 5.5-S4's low-confidence routing. The guide repeats this at 1238, contradicting its own line 556. **Rewrite them all around one precise rule:** raw self-confidence is a poor proxy for *case complexity* when deciding escalation (5.2), while field-level confidence *calibrated on labeled data* is a good way to *prioritize human review* (5.5).
- **m07 card c4 has no "Real world today" note.** Today Claude Code compacts context automatically, and its best-practices guidance on subagents for protecting context has changed.
- **The `segmentReveal` widget's numbers don't add up.** The weighted average is 97.33% but the display shows 97.0%, and the field rates average 92.75%. Nothing is labeled illustrative (F11 confirmed). Fix the arithmetic and add a label.
- **m04's crash example and q04-3 retry permission errors** (`access_denied`, 403), contradicting the module's own rule against retrying them.

## Phase 2 totals (`audit/claims-log.csv`, 991 claims, all with a source URL)

| Verdict | Count |
|---|---|
| CORRECT | 750 |
| EXAM-FRAMING-UNFLAGGED | 121 |
| WRONG | 48 |
| UNVERIFIABLE | 36 |
| OUTDATED | 18 |
| EXAM-FRAMING (flagged) | 11 |
| ILLUSTRATIVE-UNLABELED | 7 |

| Severity | Total | D1 | D2 | D3 | D4 | D5 |
|---|---|---|---|---|---|---|
| S1 | 28 | 10 | 10 | 4 | 3 | 1 |
| S2 | 104 | 24 | 28 | 21 | 24 | 7 |
| S3 | 109 | 11 | 23 | 28 | 23 | 24 |

**The dominant pattern is unflagged exam framing (121 claims).** The blueprint's view of the product has drifted from what ships today. Affected areas: forced `tool_choice`, `allowedTools`/Task, skill `allowed-tools` and `argument-hint`, commands vs. skills, prefill, `/memory`, and subagent context. A single **"Exam vs. today" reference page in the app**, linked from short per-item notes, fixes most of them at once and teaches the gap explicitly.

## Q: Question quality (Phase 3)

| ID | Sev | Item | Evidence | Fix |
|---|---|---|---|---|
| Q1 | **S1, blocks any readiness claim** | **The bank can be answered without reading the questions.** An options-only solver scores 119/120, and pick-longest scores 81%. A well-informed blind solver scores 120/120, all at confidence 4–5. So the readiness score, drills and mock exams carry almost no information about how you'd do on the exam. | `audit/work/solver-results.md`, `audit/SUMMARY.md` | Rewrite the distractors in all 120 items to the "equally expert" standard in solver-results.md. Re-balance which kinds of option are keyed (about 25–35% keyed to the softer option). Gate every item on the options-only panel scoring ≤ 35%. **Until this is done, don't use app scores to decide on booking.** |
| Q2 | S2 | 6 items flagged ambiguous (AMB) by the solvers | blind solver: `b2-5`, `q09-4`, `q11-4`, `q13-1`; blueprint-only solver: `b1-2` (the blueprint treats timeouts as retryable), `b5-4` (bullet 4.5-K2 favors batch for nightly jobs) | Send them to the domain reviewers in Phase 3b, then rewrite them. |
| Q5 | S1 | **9 items paraphrase official sample questions** (same structure and option set, new topic). This breaks the originality rule and inflates scores for learners who have read the guide. | `b1-1`, `b5-1`, `q00-1`, `q02-1`, `q04-3`, `q06-5`, `q08-7`, `q10-1`, `q11-3` (solver-results.md) | REWRITE all 9 so they test a different decision within the same task statement. |
| Q3 | S2 | `q11-6` treats `argument-hint` as enforcing an argument, but it is only an autocomplete hint | blind solver; cross-check D3 claims | Fix the stem or option wording. |
| Q6 | S1 | **`b5-4` is BROKEN.** Blueprint bullet 4.5-K2 and the official sample both favor batch for overnight work, but the key says synchronous. | `audit/work/adversarial-review.csv` | Rewrite so the deadline makes batch truly unsafe, for example an SLA shorter than the worst-case batch window, stated explicitly. |
| Q7 | S2 | **The adversarial review found 22 `why` problems and 23 trap-tag problems.** Examples: b4-4 D should be T9, not T1; q04-1 B should be T7, not T9; q04-4 B has no tag. q11-4's `why` contradicts the docs: a personal skill with the same name takes precedence over the project one. | adversarial-review.csv (`why_issues`, `trap_issues`) | Apply the fixes during the item rewrite. |
| Q4 | S2 | Trap definitions T1–T9 describe obviously weak options, which teaches you to spot weak options rather than to tell good ones apart | solver-results.md | Rewrite each trap as a *plausible expert mistake*, and add the T4 fix from C-D1-3. |

### Phase 3 per-item verdicts (`audit/question-review.csv`, built by `scripts/audit/build-question-review.mjs`)

| Verdict | Items | Meaning |
|---|---|---|
| REWRITE | 14 | KEY (1), SAMPLE-CLOSE (9) or non-terminology AMB. Change the decision being tested. |
| REWRITE-DISTRACTORS | 98 | The stem and key are sound, but the options give the answer away. Replace the distractors to the equally-expert standard. |
| EDIT-MINOR | 6 | Terminology notes, `why` text or trap tags only |
| KEEP | 2 | |

Defect counts: CUE-PATTERN 100 · CUE-LEN 98 · CUE-ABS 55 · TRAP 23 · WHY 22 · AMB 10 · SAMPLE-CLOSE 9 · TERM 8 · STEM 6 (no scenario) · KEY 1.

## P: Pedagogy and the one-stop shop (Phases 4 and 4b)

### Novice walkthrough (`audit/novice-walkthrough.md`)

83 issues: 4 blocking, 32 major, 47 minor. There are also 30 GOOD notes; keep those explanations. The persona's self-score after m00–m13 was **17 / 26**. "Agent SDK vs Claude Code vs API" scored **0**.

| ID | Sev | Item | Fix |
|---|---|---|---|
| P1 | BLOCKING | **m01:0** never shows tool use end to end: no tool definition, `tool_use` block or `tool_result` block as real JSON. | Foundations module F2: walk through one full request/response round trip using annotated JSON. |
| P2 | BLOCKING | **m01:3** names the Agent SDK four times without ever defining it. | F3, a product map: the API vs the Agent SDK vs Claude Code vs MCP, showing who runs the loop, with one diagram. |
| P3 | BLOCKING | **m05:0** has no runtime picture of MCP: host, client, server, tool discovery, and who executes the tool. | Add an MCP architecture diagram, plus the "why MCP exists" origin (pending the primitives audit). |
| P4 | BLOCKING | **m11:0** never introduces Claude Code as a product, even in its own module. | F3, plus a Claude Code orientation step at the start of m11. |
| P5 | MAJOR | **m00 tests material from m02–m12 on day one.** The quiz and the trap spotter both do this. | Move them to the end of the course as a capstone. Keep m00 to the exam format and how to read questions. |
| P7 | MAJOR | **The "why this design" dimension is the weakest across all primitives.** It averages 0.94 / 2, with 13 zeros. Of 50 primitives, 24 score ≥ 10 / 12, 15 score 6–9 and 11 score < 6. Weakest: MCP transports (0), Claude Code (2), Agent SDK (3), system prompt (4), slash commands (4), the coordinator refinement loop (4), the Explore subagent (4). | `audit/primitives.csv`, `audit/primitives-notes.md` | Add a standard **"Why it exists" panel** to each primitive (problem before → design → tradeoffs → when vs. its neighbors), using the sourced drafts in primitives-notes.md. |
| P8 | MAJOR | **MCP's "why" scores 5 / 12.** m05:0 gives a one-line idea and goes straight to config. It has no origin, no case for an open standard, no explanation of how it runs, no reason for the tools/resources/prompts split, and no diagram. | primitives-notes.md, with sources: MCP was introduced 2024-11-25 (anthropic.com/news/model-context-protocol) and donated to the Agentic AI Foundation under the Linux Foundation on 2025-12-09 (anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) | Rebuild m05's opening: the integration problem before MCP (present "N×M" as our explanation, not Anthropic's wording), the protocol's design and its three primitives, a host/client/server diagram, and then config. |
| P9 | S2 | **m04:0 presents its extra error fields (category, `isRetryable`…) as if they were MCP spec.** The spec defines only `isError` plus content; the rest is a recommended convention. | primitives-notes.md | Label them as a convention, not spec. |
| P6 | MAJOR | **There's no foundations layer.** Missing: API calls (key, model, SDK), messages and roles, the system prompt, tokens, `max_tokens`, the context window, JSON and JSON Schema, a glossary (CI, glob, frontmatter…), and 26 terms used before they're defined. | Add a Foundations track (F1–F4) and a searchable glossary, per plan Phase 7 step 2b. |

## Batch 11: option families (2026-10-31)

All 60 holdout questions are rewritten as option families, each with a practice twin (`p*`) that shares its options and keys a different one. The options-only model now scores 28.3% on the holdout, down from 93.3%. The blind solver agrees with the key on 120/120. Tooling: `build-families.mjs`, plus family checks in `content-check.mjs` and family exclusion in `startMock()`. **Open:** the 158 original practice questions still test recognition; convert them to families if mock scores and Readiness Check scores diverge by more than 10 points.

## Batch 12: code examples checked against the real libraries (2026-10-31)

`scripts/audit/check-examples.py` runs the lessons' Python examples with anthropic 2.3.0, claude-agent-sdk 0.2.176 and mcp 2.3.0. The Messages API is mocked, since there's no API key, so this checks call shapes and fields, not model behavior. The Claude Code CLI flags were checked against `claude --help` (2.1.316).

Fixed:
- **Module 1 loop.** `max_tokens` was missing; it's required, so the call fails.
- **F3 and Module 5 MCP servers.** mcp 2.x renamed `FastMCP` to `MCPServer` (`mcp.server.mcpserver`); the 1.x import is kept as a comment.
- **Module 3 hook matcher.** A plain string matches a tool name exactly, and SDK custom tools are named `mcp__<server>__<tool>`, so `"process_refund"` never fired. It's now `"mcp__billing__process_refund"`.

Verified unchanged:
- the F1 and F2 shapes;
- the lab 1 loop, Module 9 retry, Module 10 and lab 3 Batches calls and result types, and the `tool_choice` types;
- `AgentDefinition` fields, `query()` and the `PreToolUse` output;
- the CLI flags `-p`, `--output-format`, `--json-schema`, `--resume`, `--continue` and `--fork-session`.
