# Coverage audit A1: notes for Domains 1–2, scenarios, out-of-scope sweep and exam format

Auditor: A1 (Phase 1). Baseline: working tree as of 2026-10-30. Nothing in the curriculum was edited.
Bullet-level results are in `audit/work/traceability-A1.csv` (91 rows: D1 has 48 bullets, D2 has 43).
Confidentiality: the official guide is cited only by bullet ID, sample number or section name. No guide text is reproduced here.

## 0. Traceability summary (section 1 of the brief)

| Rating | D1 | D2 | Total |
|---|---|---|---|
| COVERED+TESTED | 14 | 18 | 32 |
| COVERED-NOT-TESTED | 34 | 24 | 58 |
| THIN | 0 | 1 (2.1-S3) | 1 |
| MISSING | 0 | 0 | 0 |

How the ratings were applied:
- A question counts toward a bullet only if its key requires that bullet. Elsewhere in the CSV, a question that has the bullet only in a distractor, or only names the term in its stem, is not counted.
- The "cards" column lists both cards (`mNN:cI`) and recap steps (`recap mNN:I`). The plan accepts either one.
- Widgets count as lesson steps, but they are not scored questions.

Patterns:
- **Every D1 and D2 bullet is taught somewhere, but 59 of 91 fall short of COVERED+TESTED** (58 not tested, plus 1 THIN). The binding constraint is almost always the number of questions, not the teaching. 47 of the 58 COVERED-NOT-TESTED bullets have exactly one testing question. 11 have none: 1.2-K1, 1.2-S2, 1.2-S4, 1.7-K3 and 1.7-S4 in D1, and none in D2 beyond the THIN 2.1-S3.
- **The weakest task statements are 1.7 (0 of 8 C+T), 1.3 (1 of 8), 1.2 (1 of 8), 2.4 (1 of 9) and 2.5 (2 of 9).**
- **Mapping problems:**
  - 1.7 (sessions) and 1.3-K4 (fork) are taught only in `m12`, the CI module. `m06`, which is mapped to 1.3, never mentions forking.
  - 1.6-K2 and 1.6-S2 (per-file plus integration review passes) are tested only by `q08-7`, which is tagged 4.6.
  - 2.2-S3 is tested only by `q04-3` and `q04-5`, which are tagged 5.3.
- **Items that are only recall:** `q12-5` (1.7, asks for a command), `b4-1` (2.5, "which tool first"), `q05-2` (2.4, near-recall), `q03-4` (1.4, classification with no scenario).

## 2. Scenario check

### 2a. Names and listed domains, compared with the guide's scenarios

All six scenario names and primary-domain lists in `app/content/curriculum.js:46-51` match the guide's scenario section exactly, including the order of the domains for scenario 4 (D2, D3, D1). No discrepancy.

Finding S-1 (S2):
- `curriculum.js:46-51` stores only a name and a list of domains. The guide gives every scenario a framing paragraph: the system being built, the named tools (for scenario 1, the four MCP tools) and the target metric (for scenario 1, a first-contact resolution target).
- The app never shows that framing. The mock and drill views show only "Scenario n · name" (`app/app.js:412-413`, `app/app.js:140`).
- On the real exam the scenario paragraph frames each set of questions, so the learner never practises reading questions against a shared context.

### 2b. Questions per scenario and domain mix

Source: `node scripts/audit/content-check.mjs --json`, cross-checked by A1's own script. A question's domain is the first digit of its `ts`.

| Scenario | n | Domain mix | Task statements present (count) | Guide's primary domains |
|---|---|---|---|---|
| 1 Customer Support | 20 | d1 7 · d2 4 · d4 1 · d5 8 | 1.1:2 1.4:3 1.5:2 2.1:1 2.2:3 4.2:1 5.1:3 5.2:5 | D1, D2, D5 |
| 2 Code Generation | 19 | d1 2 · d3 15 · d5 2 | 1.7:2 3.1:3 3.2:5 3.3:2 3.4:1 3.5:4 5.4:2 | D3, D5 |
| 3 Multi-Agent Research | 20 | d1 7 · d2 4 · d5 9 | 1.2:3 1.3:4 2.1:1 2.2:1 2.3:2 5.1:2 5.3:3 5.4:1 5.6:3 | D1, D2, D5 |
| 4 Developer Productivity | 18 | d1 6 · d2 12 · **d3 0** | 1.3:1 1.5:2 1.6:2 1.7:1 2.3:1 2.4:7 2.5:4 | D2, D3, D1 |
| 5 CI/CD | 18 | d3 6 · d4 12 | 3.6:6 4.1:4 4.2:2 4.4:1 4.5:2 4.6:3 | D3, D4 |
| 6 Structured Extraction | 19 | d2 2 · d4 14 · d5 3 | 2.3:2 4.2:1 4.3:5 4.4:3 4.5:5 5.5:3 | D4, D5 |
| none | 6 | d1 3 · d2 1 · d3 1 · d4 1 | 1.1:2 1.4:1 2.1:1 3.6:1 4.3:1 | — |

Findings:
- **S-2 (S1). Scenario 4 has 0 D3 questions, although the guide lists D3 as one of its primary domains.**
  - Its 18 items are D2 (12) and D1 (6).
  - Any mock draw that includes scenario 4 gets no Claude Code configuration items from it.
  - This compounds baseline finding F6 (D3 quotas can't be met for some draws).
- **S-3 (S2). Three D1 items have no scenario tag** (`q01-2` m01.js:86, `q01-4` m01.js:106, `q03-4` m03.js:129). So does `q00-1` (D2, m00.js:44).
  - `startMock` (`app/app.js:375-381`) only draws tagged items, so the mock never uses them.
  - `q01-2` is the only item that tests 1.1-K2 and 1.1-S2, so in the mock **tool-result appending is never tested**.
- **S-4 (S2). Every scenario is below the plan's target of at least 25 items.** The range is 18–20.
- **S-5 (S2). Each D1 and D2 task statement lives almost entirely inside one scenario.**
  - 2.4 is 7 of 7 in scenario 4.
  - 1.2 is 3 of 3 in scenario 3.
  - 1.7 is 2 items in scenario 2 and 1 in scenario 4.
  - If a mock draw excludes scenario 4, it contains **zero 2.4 or 2.5 items**. If it excludes scenario 3, it contains zero 1.2 items.

### 2c. Task statements each scenario's description implies, and which have zero questions there

These are A1's judgments from each scenario's framing paragraph and primary domains. "Core" means the paragraph names the mechanism directly. "Plausible" means a likely question area for that system.

| Scenario | Implied: core | Implied: plausible | Zero questions in this scenario |
|---|---|---|---|
| 1 Customer Support (Agent SDK, custom MCP tools, escalation, resolution target) | 1.1, 1.4, 1.5, 2.1, 2.2, 5.1, 5.2 | 2.3 (tool scoping and tool_choice for the support agent), 2.4 (custom MCP servers, resources), 1.7 | **2.3, 2.4, 1.7** |
| 2 Code Generation (slash commands, CLAUDE.md, plan mode) | 3.1, 3.2, 3.3, 3.4, 3.5 | 5.4 (codebase context), 5.1, 1.7, 2.5 (built-in tools), 1.6 (refactor decomposition) | **5.1, 2.5, 1.6**. 3.4 has only 1 item |
| 3 Multi-Agent Research (coordinator, four subagents, cited reports) | 1.2, 1.3, 2.2, 2.3, 5.3, 5.6 | 1.1, 1.6 (dynamic decomposition of research), 2.1, 5.1, 1.7 (fork), 5.4 | **1.1, 1.6, 1.7**. 2.1 and 2.2 have 1 item each |
| 4 Developer Productivity (Agent SDK, exploring legacy code, boilerplate, built-in tools, MCP) | 2.4, 2.5, 1.6, 5.4 | 1.1, 1.3 (Explore-type subagents), 2.1, 2.2, 3.1, 3.2, 3.4 (guide lists D3 as primary) | **5.4, 1.1, 2.1, 2.2, every D3 task statement (3.1–3.6)** |
| 5 CI/CD (automated review, test generation, PR feedback, false positives) | 3.6, 4.1, 4.2, 4.6 | 4.3 (structured output via `--json-schema`), 4.5 (batch), 3.1 (CLAUDE.md for CI), 1.6 (per-file plus integration review) | **4.3, 3.1**. 1.6 appears only as `q08-7`, tagged 4.6 |
| 6 Structured Extraction (schemas, validation, accuracy, edge cases, downstream) | 4.3, 4.4, 4.2, 5.5 | 4.5, 2.3 (tool_choice), 5.6 (source traceability), 4.1, 2.2 | **5.6, 4.1, 2.2** |

The planning note "scenario 5 should include D4 multi-pass review and batch" is satisfied: 4.6 has 3 items and 4.5 has 2.

### 2d. D1/D2 items that mirror the official samples (relevant to the readiness signal; Phase 3 owns the verdicts)

- **`app/content/m02.js:23-25`.** The "Weak" example reproduces, word for word, the two minimal tool descriptions from official sample question 2. This is a confidentiality and hygiene issue, and it primes the learner for that sample.
- **`q00-1` (m00.js:44).** Same structure as sample Q2: two confusable tools, one-line descriptions, "most effective first step", and a similar set of distractors.
- **`b1-1` (bank.js:221).** Same structure as sample Q1 (an ordering failure fixed by a programmatic prerequisite). It is the only item for 1.4-S1.
- **`q06-5` (m06.js:97).** Same structure as sample Q7 (every subagent succeeds but a whole subtopic is missing, so the coordinator's decomposition is the cause). It is the only item for 1.2-K4.
- **`q02-3` (m02.js:125) and its explanation (a narrow verify_fact tool).** This is the answer to sample Q9. `q04-3` and `q04-5` (m04.js:99, :119) cover sample Q8's error-propagation pattern.

Effect: for 1.2-K4, 1.4-S1 and 2.1-K1, the only or main testing item can be answered by recognising a pattern the learner has already seen in the official samples. Readiness for those bullets is overstated.

## 3. Out-of-scope sweep

Search terms came from the guide's out-of-scope list: caching, pricing and cost, streaming, embeddings and vectors, fine-tuning, vision and images, computer use, rate limits and quotas, OAuth and API keys, tokens and tokenization, cloud providers, prefill, temperature, extended thinking, benchmarks, RLHF, SSE and hosting.

Searched: `app/content/*.js`, `app/widgets.js`, `app/widgets2.js` and `exam-preparation-guide.md`.

Labels:
- **OOS-LEAK**: out-of-scope or off-blueprint material taught as if it were exam-relevant.
- **OK-ASIDE**: clearly labeled, or used only as a wrong-answer distractor.
- **NOT-OOS**: the hit is in scope.

### App (lessons, cards, questions, widgets)

The app is clean. **No OOS-LEAK was found in the app.**

| Location | Hit | Label | Note |
|---|---|---|---|
| `app/content/m10.js:3,15,46,64,125` | Batch is about 50% cheaper | NOT-OOS | Bullet 4.5-K1 requires it. This is not pricing math. |
| `app/content/m01.js:21` | "Cost of statelessness" callout (token, latency and cost growth) | NOT-OOS | Supports 5.1 (tool results consume tokens). No numbers. |
| `app/content/m01.js:91`, `m08.js:105`, `bank.js:214` | Temperature | OK-ASIDE | Only as wrong distractors, with an explanation of why. |
| `app/content/m08.js:123` | Extended thinking | OK-ASIDE | Only as a wrong distractor. Not on the out-of-scope list. |
| `app/content/m05.js:126`, `m06.js:92` | "Cache …" | OK-ASIDE | Distractors about application caching, not prompt caching. |
| `app/widgets.js:85` | "fine-tuned routing model" | OK-ASIDE | A trapSpotter example of trap T2 (over-built first step). |
| `app/widgets2.js:143` (contextBudget), `widgets.js:278` (complianceSim) | Token counts and miss rates | OK-ASIDE | Labeled "illustrative" on screen. |
| `app/content/m05.js:26` | MCP tool annotations (`readOnlyHint`, `destructiveHint`) | Beyond the blueprint, not on the out-of-scope list | An unlabeled aside. Recommend tagging it "not on the exam". |
| `app/content/m05.js:6,38,40` (card m05:c3, step m05:1) | Local scope and local > project > user precedence | Beyond the blueprint, not on the out-of-scope list | The blueprint tests only project vs user scope. Precedence is a card (m05:c3), so learners will drill it as if it were exam material. Recommend labeling it. |
| `app/content/m06.js:25` | Task renamed to Agent; nesting depth | OK-ASIDE | A labeled "Real world today" callout. |

### `exam-preparation-guide.md`

| Location | Hit | Label | Note |
|---|---|---|---|
| `exam-preparation-guide.md:27` | Explicit out-of-scope list | OK | A correct and useful scope statement. |
| `exam-preparation-guide.md:90` | Tool definitions consume input tokens; a schema costs about 2,500 tokens | OOS-LEAK (minor) | Token accounting with a specific, unlabeled number. |
| `exam-preparation-guide.md:92` | Structured-output grammar compilation latency, schema caching, compilation limits | OOS-LEAK | Implementation detail outside the blueprint. Unlabeled. |
| `exam-preparation-guide.md:62-63, 84, 416, 495, 1758-1759` (and the table at :39) | `output_config.format` JSON structured outputs and `strict: true` | Beyond the blueprint (Phase 2 should check it) | Partly labeled at :39 ("the exam's canonical answer is still tool_use"). The other occurrences present it as the default choice, which could pull an exam answer away from tool_use (4.3). |
| `exam-preparation-guide.md:94-96` | §1 "Partial Assistant Prefill" | OOS-LEAK | Not in any task statement. Taught as a technique, with no "not tested" label. |
| `exam-preparation-guide.md:899-902, 1761` | Prefill recommended for repetitive openers; cheat-sheet line | OOS-LEAK | Same. It appears in the §13 quick-reference cheat sheet, which signals that it is exam material. Phase 2 should also check whether current models still support prefill. |
| `exam-preparation-guide.md:1368-1374` | "Plan Mode vs Extended Thinking" | Beyond the blueprint, not on the out-of-scope list | Extended thinking isn't a blueprint topic. Acceptable as a contrast, but unlabeled. |
| `exam-preparation-guide.md:1738-1740` | "Batch and Prompt Caching" | NOT-OOS (borderline) | Stays at the "knows it exists" level the guide allows, but has no label saying the details aren't tested. |
| `exam-preparation-guide.md:1679` | Batch about 50% discount | NOT-OOS | Bullet 4.5-K1. |
| `exam-preparation-guide.md:1703` | Batch results JSONL "should be streamed" | OOS-LEAK (minor) | A results-handling detail, not part of the blueprint. |
| `exam-preparation-guide.md:1705` | "Batch size and request count have platform limits" | OOS-LEAK (minor) | Quota and limit territory. Harmless as written. |
| `exam-preparation-guide.md:1781` | Retry rate-limit failures inside the tool | NOT-OOS | Rate limiting appears only as an example of a transient error (2.2-K2), not as rate-limit detail. |
| `exam-preparation-guide.md:947, 1836` | "MCP does not handle auth, rate limiting, caching" | OK | A scope boundary statement. |
| `exam-preparation-guide.md:1951` | Link annotated "pricing/token implications" | OK-ASIDE | Reading list only. |

## 4. Exam-format claims

Where the claims are made:
- `app/content/m00.js:3` (card m00:c0)
- `m00.js:13-14` (step m00:0)
- `m00.js:79-80` (recap m00:4)
- `app/app.js:324`, `:331`, `:403`, `:405`
- `exam-preparation-guide.md:17`
- `docs/STUDY-APP-PLAN.md:19, 23, 101, 152`

The guide sections checked are Exam Content, Exam Results and the Scenarios section of the official Exam Guide v0.1. The guide text is in the scratchpad only.

| Claim | Verdict | Evidence |
|---|---|---|
| 60 questions | **UNVERIFIED** | Not in the guide. No official page states a question count: the Partner Academy cert page, the Partner Academy FAQ, the claude.com certifications post, the anthropic.com Partner Network post and the Pearson VUE Anthropic page were all checked. Only third-party sites say 60 (for example rickhigh.substack.com, smartscope.blog, claude-certified-architect.pages.dev). The claim is hard-coded at `app/app.js:324,403`, `m00.js:3,13,79`, `exam-preparation-guide.md:17` and the mock's draw size `app/app.js:380`. |
| 120 minutes | **VERIFIED** | Official FAQ: all Claude certification exams allow 120 minutes, and it advises about 135 minutes of seat time. https://anthropic-partners.skilljar.com/page/faq-certifications. Not in the guide. |
| About $125 | **VERIFIED** | The CCAR-F page lists the purchase price as $125 (https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification). The official FAQ says the price rose from $99 to $125 on June 30, 2026, before any partner-tier discount (https://anthropic-partners.skilljar.com/page/faq-certifications). `docs/STUDY-APP-PLAN.md:23` still calls this "third-party"; that can now be upgraded. |
| Registration through the Claude Partner Network / Pearson VUE | **VERIFIED, with nuance** | (a) Exams are open only to Claude Partner Network members: https://claude.com/blog/four-role-based-claude-certifications and the FAQ. Membership is free. (b) You register and pay on the Partner Academy cert page, then get a link to Pearson; registration needs a partner email on a recognised company domain (FAQ). (c) The exam is delivered by Pearson, proctored, online (OnVUE) or at a test center: https://www.pearsonvue.com/us/en/anthropic.html. The claude.com post says "Pearson Professional Assessments". The guide does not mention registration. |
| 4 of 6 scenarios | **GUIDE-ONLY** | Stated in the guide's Exam Scenarios section. No official web page states it. |
| Scaled score 100–1000 | **VERIFIED** | In the guide (Exam Results), and in the FAQ (https://anthropic-partners.skilljar.com/page/faq-certifications). |
| 720 to pass | **VERIFIED** | In the guide and the FAQ. The FAQ says 720 applies to all four certifications. |
| One best answer, three distractors | **GUIDE-ONLY, and contradicted by the current FAQ** | Guide v0.1 says every question has one correct response and three distractors. The current official FAQ says all Claude certification exams use "multiple choice and scenario-based multiple response questions". The app states "one best answer each" (`app/app.js:403`, `m00.js:13`) and has no multiple-response items. |
| No penalty for guessing | GUIDE-ONLY | Guide, Exam Content section. |

Additional format findings:
- **FMT-1 (S1 risk).** The current official FAQ mentions multiple-response questions. If CCAR-F now includes them, the app's single-answer format and its 25%-chance baselines no longer match the exam. Confirm against the current CCAR-F exam guide on the Partner Academy before booking.
- **FMT-2.** The Pearson VUE Anthropic page announces updated content from December 7, 2026 for the Associate, Developer and Architect–Professional exams. CCAR-F is not named. Search results (not confirmed on a fetched page) say updated guides arrive November 17, 2026. The study plan uses Exam Guide v0.1, dated February 2025, so re-check the CCAR-F guide's version after November 17, before the December 31 deadline.
- **FMT-3.** The raw-to-scaled mapping in `app/app.js:92-93` (72% raw maps to 720) is an assumption. The guide says scaled scoring equates forms of different difficulty. The mock disclaimer at `app/app.js:405` labels the score a rough estimate, which is acceptable, but readiness should not be presented as a pass probability.
- **FMT-4.** The FAQ allows 4 attempts per rolling 12 months, with waiting periods after a failure, and certification is valid for 12 months. The app does not mention either; both are useful when planning the booking.
