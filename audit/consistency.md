# Guide vs. app consistency (Phase 6, efficiency mode)

**Method.** Contradictions come from the verified claims log (`audit/claims-log.csv`), which already holds about 150 rows located in `exam-preparation-guide.md`. Each row has a verdict and an official source. For the ABSORB check, I compared the guide's section topics with the app's content by keyword, then decided against the blueprint coverage map (`audit/work/traceability-*.csv`, 240/240 bullets mapped to app content).

**Rule.** The app is authoritative for exam framing. The guide is corrected to match the app unless the claims log shows the app is wrong.

## Contradictions and errors fixed in the guide

| Claims | Topic | Fix | Batch |
|---|---|---|---|
| D2-133/135/154/156/178/180 (S1) | MCP error tiers: missing arguments described as JSON-RPC errors | Rewritten to MCP spec 2025-11-25: input validation errors are `isError` tool results | 1 |
| D4-145 (S1) | Bulk extraction: "batch everything first" | Refine on a sample, then batch; resubmit by `custom_id` | 1 |
| D1-202/210/225/235 (S1) | `allowedTools` must include `"Task"` | Kept as exam framing, with a note on today's behavior | 1 |
| D3-177 (S1→framing) | `argument-hint` prompts for parameters | Flagged as exam framing; today it's an autocomplete hint | 1 |
| D4-119/160/161/185 (S2) | Assistant prefill recommended | Marked legacy; returns 400 on Claude 4.6+; alternatives given | 6 |
| D4-128 (S2) | Second-call verification "generally inferior" | Fix the schema first; an independent, source-grounded verification pass is sound (task 4.6) | 6 |
| D5-136 (S2) | "Self-confidence is poorly calibrated… usually confidently wrong" | The precise rule: raw self-rating isn't a complexity proxy; calibrated field confidence for review routing is fine | 6 |
| D3-188, D3-190 (S2) | Behavior of `PreToolUse` "defer" and `UserPromptSubmit` | Corrected to the current hooks reference | 6 |
| D3-195 (S2) | Whether subagents load CLAUDE.md | Custom subagents load it; built-in Explore/Plan skip it | 6 |
| D1-198, D1-211 (S2) | Subagent resume; AgentDefinition `allowedTools` | Resume by agent ID; the field is `tools` | 6 |
| D3-144 (S2) | Terminology table incomplete | Rows added: forced `tool_choice`, `argument-hint`, `/memory` vs `/context`, MCP argument errors | 6 |
| — | Invented error name `context_length_exceeded` (guide and app q10-3) | Replaced with the real "prompt is too long" error | 6 |

All S1 and S2 claims located in the guide are now resolved. S3 items are cosmetic and remain in the claims log.

## Guide-only topics (ABSORB decisions)

| Topic in the guide | In blueprint scope? | Decision |
|---|---|---|
| Sliding window vs. progressive summarization (§5) | Yes, task 5.1 | **Absorbed** into m07 "The fixes" (batch 6) |
| Uncertain side effects and idempotency (§3) | Yes, task 2.2 | Already covered: b1-2 (non-idempotent refund timeout) and m04 |
| Pagination, `requires_review` and decision hints in tool output (§2) | Not a blueprint bullet | Guide-only depth; not absorbed |
| Tool search and progressive tool availability (§2, §7) | Not a blueprint bullet | Guide-only depth |
| Principles vs. conditionals, prompt dilution, system prompt versioning (§5, §6) | Not a blueprint bullet | Guide-only depth |
| Returning users and stale data, external updates (§5) | Partly 1.7 (stale session results) | Covered by q12-7 and b7-13; the rest is guide-only depth |
| Evaluation and feedback loops (§4, §11) | Partly 3.5, 5.5 | Covered at blueprint depth (iterative refinement, stratified sampling, calibration) |

**Result:** zero open S1 or S2 contradictions. The guide now opens with a banner naming the app as the primary study path.
