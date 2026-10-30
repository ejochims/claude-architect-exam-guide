# Coverage notes, auditor A2 (Domains 3–5)

Scope: the guide's other lists (technologies, in-scope topics, preparation exercises), plus the precision check on nuances known to be risky. The per-bullet ratings are in `audit/work/traceability-A2.csv`. Guide items are referred to by short label or bullet ID only.

Citations: `mNN:i` is a lesson step, `mNN:c<i>` is a card, and `file:line` points into `app/content/` unless another file is named.

## Summary of the bullet ratings (149 bullets, D3–D5)

| Domain | COVERED+TESTED | COVERED-NOT-TESTED | THIN | MISSING |
|---|---|---|---|---|
| D3 (49) | 15 | 33 | 1 (3.1-S3) | 0 |
| D4 (47) | 20 | 27 | 0 | 0 |
| D5 (53) | 15 | 37 | 1 (5.1-S2) | 0 |
| **Total** | **50** | **97** | **2** | **0** |

Every bullet is taught somewhere, and nothing is MISSING. The dominant weakness is test depth. Most bullets have exactly one question, because each task statement has only 3–7 questions and each question covers a different bullet. When the strict rule is applied (getting the question right must require knowing the bullet), 97 of 149 bullets fall short of the 2-question bar.

Risk to the counts: several items closely track official sample questions. They are q11-7 (sample 5), the m11:4 sorter item "split a monolith's user module", b5-1, q00-3 and the distractor list at m12.js:25 (sample 10), q10-1 (sample 11), q08-7 (sample 12) and q11-3 (sample 6). If Phase 3 rewrites or retires them, coverage of 3.4, 3.3, 3.6-K1/S1, 4.5-S1 and 4.6-K3/S2 drops even further.

---

## 2a. Technologies and concepts list (tech.txt)

| Item | Where the app teaches it | Verdict |
|---|---|---|
| Agent SDK: agent definitions | m06:0 (AgentDefinition), m06:c2, b4-6 | Covered |
| Agent SDK: agentic loop and stop_reason | m01:0, m01:1, m01:2 (loopStepper), m01:c1 | Covered |
| Agent SDK: hooks (PostToolUse, tool-call interception) | m03:2, m03:3 (hookPlayground), m03:c3, m07:0 | Covered |
| Agent SDK: subagents spawned via Task, allowedTools | m06:0, m06:1 (contextViewer), m06:c0 | Covered (with a Real-world note on Task vs Agent) |
| MCP: servers, tools, resources | m05:0, m05:3 | Covered |
| MCP: isError flag | m04:0, m04:c1, q04-2, q04-4 | Covered |
| MCP: tool descriptions and distribution | m02:0, m02:1 | Covered |
| MCP: .mcp.json, env-var expansion | m05:1, m05:2, m05:c2 | Covered |
| Claude Code: CLAUDE.md hierarchy | m11:0 | Covered |
| Claude Code: .claude/rules/ with paths | m11:0, m11:1 | Covered |
| Claude Code: .claude/commands/ | m11:0 (table row), m11:2 (one sorter item), m11:c3 | **Thin.** No prose and no question |
| Claude Code: skills, SKILL.md frontmatter | m11:1 | Covered |
| Claude Code: plan mode and direct execution | m11:3, m11:4 | Covered, but tested by 1 item |
| Claude Code: /memory | m11:0, m11:c1 | Covered (1 item) |
| Claude Code: /compact | m07:2 (one clause), m07:c4 | **Thin.** The app never says what it does; it appears only as a distractor |
| Claude Code: --resume, fork_session | m12:2, m12:3 | Covered |
| Claude Code: Explore subagent | m11:3 (one clause), m07:2 (one sentence) | **Thin.** Never described (built-in, read-only, returns a summary) |
| CLI: -p, --output-format json, --json-schema | m12:0, m12:1 (ciBuilder) | Covered |
| API: tool_use with JSON schemas | m09:0 | Covered |
| API: tool_choice auto / any / forced | m02:1, m02:2 (toolChoice) | Covered |
| API: stop_reason tool_use and end_turn, max_tokens | m01:1, q01-4 | Covered |
| API: system prompts | m01:0 (named as an input) | Covered, but only implicitly |
| Batches: 50%, 24h, custom_id, no multi-turn tools | m10:0, m10:2 | Covered |
| Batches: polling for completion | m10.js:24 (one bullet) | Thin, though adequate for recall |
| JSON Schema: required/optional, enum, nullable, other+detail | m09:0 | Covered |
| JSON Schema: strict mode for syntax elimination | m09:0 ("strict schema" in prose), q09-2 | Partial. The API's `strict` option is never named |
| **Pydantic: schema and semantic validation, retry loops** | Validation-retry is taught conceptually in m09:1. Pydantic itself is never mentioned anywhere | **MISSING (name and tooling)** |
| Built-in tools: Read, Write, Edit, Bash, Grep, Glob | m02:3, m02:4 | Covered |
| Few-shot prompting | m08:2 | Covered (weakly tested) |
| Prompt chaining | m06:2, m06:c4, b4-8 | Covered |
| Context management: token budgets, summarization, lost-in-middle, extraction, scratchpads | m07:0, m07:1, m07:2 | Covered |
| Sessions: resumption, fork, named sessions, context isolation | m12:2, q12-5, m12:0, m08:2 | Covered |
| Confidence scoring: field-level, calibration, stratified sampling | m13:2, m13:3 | Covered |

## 2b. In-scope topics list (inscope.txt)

| Topic | Where | Verdict |
|---|---|---|
| Agentic loop implementation | m01:0–m01:3 | Covered |
| Multi-agent orchestration (including parallel subagents and iterative refinement) | m06:0, m06:2, q06-2, q06-6 | Covered |
| Subagent context management, state persistence, manifests | m06:0, m07:2, q07-6 | Covered (manifests have 1 item) |
| Tool interface design: descriptions, split vs consolidate, naming | m02:0, m02:1 | Covered |
| MCP tool vs resource design, description quality | m05:0, m05:3 | Covered |
| MCP server configuration: scopes, env expansion, several servers at once | m05:1, m05:2 | Covered |
| Error handling and propagation | m04:0–m04:2 | Covered |
| Escalation decision-making | m13:0, m13:1 | Covered. The "explicit criteria" sub-point has no question (5.2-S1) |
| CLAUDE.md configuration: hierarchy, @import, rules with globs | m11:0, m11:1 | Covered (@import has 1 item) |
| Custom commands and skills | m11:0, m11:1 | Skills covered. **Commands have zero questions** |
| Plan mode vs direct execution | m11:3, m11:4 | Covered. **1 question** |
| Iterative refinement: I/O examples, TDD, interview, sequential vs together | m11:3 | Covered. TDD has 0 questions; the others have 1 each |
| Structured output via tool_use: schema, tool_choice, nullable | m09:0, m02:1 | Covered |
| Few-shot prompting: ambiguity, format, fewer false positives | m08:2 | Covered. 1 item per purpose |
| Batch processing: fit, latency tolerance, custom_id failures | m10:0–m10:2 | Covered |
| Context window optimization: trimming, fact extraction, ordering by position | m07:0, m07:1 | Covered |
| Human review workflows: calibration, stratified sampling, segmentation | m13:2, m13:3 | Covered |
| Information provenance: claim-source, dates, conflicts, coverage gaps | m13:4, m04:2 | Covered. The "established vs contested" split is untested |

## 2c. Preparation exercises (exercises.txt)

The app has **no hands-on exercises**. Nothing asks the learner to write code, run Claude Code, call the API or check real behavior. What it offers is simulated: sorters and interactive widgets. For each step below, "Sim" means a simulated or interactive equivalent exists, and "None" means there isn't one.

**Exercise 1: support agent with tools, errors, a hook and escalation (D1, D2, D5)**

| Step | Equivalent |
|---|---|
| 1. Write similar tools with distinguishing descriptions | None. Read-only (m02:0) and quiz only (q00-1, q02-1) |
| 2. Loop that checks stop_reason | Sim: m01:2 `loopStepper` |
| 3. Structured errors (category, retryable) | Sim: the m04:1 classification sorter. The learner never builds or tests the responses |
| 4. Interception hook with an escalation redirect | Sim: m03:3 `hookPlayground` and m03:1 `complianceSim` |
| 5. Decomposing a multi-concern message | None. Read (m03:5) and q03-5 only |

**Overall:** partially simulated.

**Exercise 2: configure Claude Code for a team (D3, D2)**

| Step | Equivalent |
|---|---|
| 1. Project CLAUDE.md applied to all teammates | Sim: the m11:2 "where does it go" sorter |
| 2. Rules files with globs, checking that they load only on matching files | Sim: m11:2 sorter items only. No check of load behavior |
| 3. Project skill with fork and allowed-tools, checking isolation | None beyond reading m11:1 and q11-5 |
| 4. .mcp.json with env expansion plus a personal server in ~/.claude.json | Sim: the m05:2 scope sorter |
| 5. Plan mode vs direct execution on three tasks | Sim: the m11:4 sorter |

**Overall:** classification drills only. Nothing has the learner create files or observe loading (for example with /memory), which is the point of the exercise. This is the weakest equivalent, and it sits in the heaviest D3 area.

**Exercise 3: extraction pipeline (D4, D5)**

| Step | Equivalent |
|---|---|
| 1. Schema with required, optional, enum+other and nullable fields; check that absent fields come back null | Read only: the schema snippet at m09:0. No interaction |
| 2. Validation-retry loop, tracking which errors a retry can fix | Sim: the m09:2 "will a retry fix it?" sorter. Pydantic is absent |
| 3. Few-shot examples for varied formats | None. Read only (m08:2) |
| 4. Batch of 100 documents: resubmit failures by custom_id, compute timing against the SLA | Sim: m10:1 `slaCalc` (timing) and the m10:2 sorter. No custom_id resubmission simulation |
| 5. Route on confidence, segment accuracy by type and field | Sim: m13:3 `segmentReveal` (segmentation only). Confidence routing is not simulated |

**Overall:** partially simulated.

**Exercise 4: multi-agent research pipeline (D1, D2, D5)**

| Step | Equivalent |
|---|---|
| 1. Coordinator with Task in allowedTools; findings passed explicitly | Sim: m06:1 `contextViewer` |
| 2. Parallel Task calls and the latency gain | Sim: the m06:1 toggle (40s vs 80s) |
| 3. Structured claim, excerpt, source and date | Sim: partly, in m06:1 (finding JSON is shown) |
| 4. Simulated timeout producing structured error context, coverage gaps | None. Read only (m04:2) plus q04-3 and q04-6 |
| 5. Conflicting statistics preserved; established vs contested | None. Read only (m13:4) plus q13-9 |

**Overall:** best covered of the four, but D5 steps 4 and 5 have no interactive equivalent.

---

## 3. Precision check on nuances known to be risky

### 3.1 Self-reported confidence (5.2 escalation proxy vs 5.5 and 4.6 calibrated routing). Verdict: **IMPRECISE, S2 (could become S1)**

The guide holds both positions at once. 5.2-K3 says self-reported confidence is an unreliable proxy for case complexity. 4.6-S3 and 5.5-S3/K3 endorse model-reported confidence when it is calibrated on labeled data and used to route review.

**Where the app gets it right:**
- m13.js:59, the callout: "Raw self-rated confidence as an *escalation trigger* is a trap. Field-level confidence *calibrated against labeled data* and used to *prioritize review* is good practice. The difference is calibration."
- m08.js:62: confidence per finding is "useful for routing … once the thresholds have been calibrated."
- m13.js:192, the recap, says "raw self-confidence."
- The keys of b5-3 and q13-8 are correct.

**Where it is imprecise:**
- curriculum.js:78, T4: the tell is "Route on sentiment, or on the model's self-rated confidence score." The why is "LLM self-confidence is poorly calibrated: wrong answers are often confident." Neither is qualified with *raw* or *uncalibrated*, and neither is limited to *escalation or complexity*. As written, T4 also condemns the mechanism that 4.6-S3 and 5.5-S3 endorse.
- m13.js:6, card m13:c3: the same unqualified sentence.
- m13.js:27: "The agent that's mishandling hard cases is usually confident about them." "Usually" goes beyond what the guide says, which is only that confidence is an *unreliable proxy*. This is the overstatement already logged as F8.
- m00.js:57, q00-2 distractor (T4): "Ask the model to add a confidence score for each field and discard values below 0.7," with the why "Self-reported confidence is poorly calibrated." Field-level confidence is the 5.5-S3 mechanism. The option is wrong because of its uncalibrated cutoff and because it misses the root cause, but the why teaches a blanket rule in the very first module.
- m03.js:115 (q03-2 distractor, T4) uses the same blanket phrasing.

**Exam risk:** a learner who has absorbed T4 could reject the correct answer on a 4.6-S3 or 5.5-S3 item ("have the model output confidence per field, calibrate thresholds on labeled data").

### 3.2 "Be conservative" vs explicit criteria (4.1). Verdict: **PRECISE**

- m08.js:15: "'Be conservative' and 'only report high-confidence issues' … barely move precision, because they don't tell the model *which* findings matter." This matches 4.1-K2.
- m08.js:17–24 contrasts a vague and an explicit instruction and gives report and skip categories (4.1-K1/S1).
- m08.js:3 (card m08:c0) and m08.js:144 (recap) agree.
- q08-1 also keys criteria over confidence-based filtering, which matches the 4.1-S1 wording.
- Minor: the T9 tell (curriculum.js:83) doesn't list "be conservative," but b5-2 tags it T9. That is harmless.

### 3.3 Few-shot count and purpose (4.2). Verdict: **PRECISE**

- m08.js:51: "**2–4 targeted examples** aimed at the *ambiguous* cases." Card m08.js:5 adds "showing the reasoning for why one option was chosen over plausible alternatives." Both match 4.2-S1.
- m11.js:93 and card m11.js:10 give "2–3 input/output examples" for transformations. That matches 3.5-S1. The two counts are kept in their own contexts, which is correct.
- Purposes at m08.js:49–55: format (S2), acceptable vs real patterns (S3), varied structures (S4), and empty or fabricated fields (K4/S5). Generalization through reasoning (K3) is at m08.js:52.
- Omissions: the "informal measurements" example and the branch-level test-coverage example are missing. There is no single item where generalization is the deciding factor.

### 3.4 Batch API limits and the multi-turn tool-use incompatibility (4.5). Verdict: **PRECISE for the blueprint facts**

- m10.js:15: "halves the cost … up to 24 hours … no latency guarantee." Card m10.js:3: "About 50% cost savings, up to a 24-hour processing window, no guaranteed latency SLA."
- m10.js:23: "No multi-turn tool calling inside a request. A batch request is one Messages call. If Claude asks for a tool, nothing executes it and continues. Agentic loops stay on the synchronous API, or you pre-fetch the data into the prompt." This is exact, and the workaround is useful. Card m10.js:5 agrees, and the q10-4 why ("Tools can be defined, but nothing executes them") is precise.
- m10.js:22 and m10.js:4: "Don't assume results come back in order" / "Never rely on result order." Phase 2 should confirm this against current documentation.
- m10.js:30: the formula "max interval = SLA − 24h − post-processing" goes beyond the guide by adding post-processing time. With 2 h of post-processing it gives the guide's worked example (4 h), and q10-2's arithmetic is correct.
- The app states no product limits (requests or bytes per batch, result retention). The blueprint doesn't require them, so this is not a gap.

### 3.5 Plan mode vs direct execution, and the Explore subagent (3.4). Verdict: **ACCURATE BUT THIN**

- m11.js:88: plan mode is for "Large-scale or multi-file changes, architectural decisions, several valid approaches, migrations touching dozens of files." Direct execution is for "a single-file bug fix with a clear stack trace, adding one validation check." Both match K1/K2 and S1/S2.
- m11.js:90: "Plan mode explores the codebase safely and designs the change before anything is edited, which prevents costly rework … **plan, then execute** … Use the **Explore subagent** to keep verbose discovery out of the main context." This is accurate. The Explore subagent gets only this one clause.
- m07.js:44 adds only "The **Explore** subagent exists for this." The app never says that Explore is a built-in subagent, that it is read-only, or that it returns a summary. "Bring back a concise summary" appears only in the q07-5 key.
- Card m11.js:9 omits the why (safe exploration and less rework).
- No question has direct execution as the key. TS 3.4 has one question in total (q11-7), and q11-7 is close to official sample 5.

### 3.6 Path-specific rules (3.3). Verdict: **PRECISE against the blueprint**

- m11.js:25: rules load "Always, or only for files matching `paths` globs." This correctly implies that a rule without `paths` loads every time.
- m11.js:41–46 shows the `paths: ["**/*.stories.tsx"]` frontmatter and says the rule "loads **only when Claude is editing matching files**, which saves context and tokens. It also beats subdirectory `CLAUDE.md` files when the files are **spread across many directories**." This matches K1–K3.
- Card m11.js:5 uses the guide's own `**/*.test.tsx` case.
- Phase 2 should check whether current documentation describes activation as happening when Claude *reads or works with* matching files rather than only when it *edits* them. If so, the app needs a Real-world note. The "editing" wording matches the exam framing.

### 3.7 Lost in the middle and the case-facts block (5.1). Verdict: **PRECISE, with one tension**

- m07.js:20: "Models reliably use the beginning and end of long inputs and may miss findings buried in the middle." This matches 5.1-K2.
- m07.js:27: "Put a key-findings summary at the top of aggregated input, and organize detail under explicit section headers." This matches S4.
- m07.js:25: "Extract amounts, dates, order numbers and statuses into a structured block sent with every prompt, *outside* the summarized history. For multi-issue sessions, keep one entry per issue." This matches S1. S2 gets this one clause only, so it is rated THIN.
- Cards m07.js:4–5 agree.
- Tension: in q07-1 (m07.js:58), "send the complete transcript on every turn" is a T3 distractor. Meanwhile 5.1-K4 stresses passing the complete conversation history, and q01-3 keys "send the full conversation history (or a managed form of it)." The q07-1 why ("defers the problem and inflates cost") can be defended. Still, the T3 tag ("bigger model or window") doesn't fit well, and the contrast with q01-3 isn't explained anywhere (S3).

### Other precision observations

- widgets2.js:211–219 (`segmentReveal`): the per-type breakdown (6,200 at 99.1%, 2,900 at 98.4%, 900 at 81.7%) has a weighted mean of about 97.3%, but the widget displays "97.0%." The figures are not labeled illustrative. This confirms F11 (S3).
- m11.js:61: the Real-world note on `allowed-tools` (it now pre-approves rather than restricts) is present. Because of it, b2-3's exam-framed key is flagged, not unflagged.
