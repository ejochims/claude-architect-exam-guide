# Phase 4b: Primitives and the "Why test"

Audit date: 2026-10-30. Scope: lessons m00–m13 (86 steps), app/widgets.js, app/widgets2.js, app/content/curriculum.js. Data: `audit/primitives.csv` (50 primitives).

## Method

- **Inventory.** I started from the Phase 4b list and added items from the guide's technology and in-scope appendices that were missing. Additions include `max_tokens`, `allowedTools`, Pydantic, `.claude/rules/`, multi-server MCP access, explicit criteria, structured state persistence, and iterative-refinement techniques. Closely related items were merged:
  - hooks + prerequisite gates;
  - model-driven vs pre-configured flow + prompt chaining vs dynamic decomposition;
  - Pydantic + validation–retry.
- **Scoring.** Each of the six Why-test questions is scored 0–2, so the maximum is 12.
  - 1 = stated as a rule or mentioned.
  - 2 = explained so a newcomer understands why.
  - Quizzes earn Q6 = 2 only when their option rationales name the traps.
  - Sorter widgets count as practice, not as explanation.
- **Citations** use `mNN:i` = `window.LESSONS.mNN.steps[i]`.
- **Gap rule** (Phase 4b): a primitive gets a gap entry if it totals below 10 or scores 0 on any question.

## Summary statistics

| Band | Count |
|---|---|
| ≥ 10 of 12 (passes the total bar) | **24** |
| 6–9 | **15** |
| < 6 | **11** |
| Gap entries (< 10 or any 0) | **26** |
| Mean total | 8.2 / 12 |

Average score per question across the 50 primitives:

| Question | Mean | # scoring 0 | # scoring 2 |
|---|---|---|---|
| Q1 problem-before | 1.36 | 5 | 23 |
| Q2 what-it-is | 1.52 | 2 | 28 |
| Q3 how-it-works | 1.46 | 2 | 25 |
| **Q4 why-this-design** | **0.94** | **13** | 10 |
| Q5 when-vs-neighbors | 1.26 | 8 | 21 |
| Q6 exam/traps | 1.68 | 1 | 35 |

Average total by domain (the first domain listed for each primitive): D1 7.7 (15 primitives), D2 8.6 (10), **D3 7.0 (9)**, D4 8.9 (8), D5 9.4 (8).

**Pattern.** The app is excellent at Q6: it teaches what to pick and why the distractors are wrong. It is weakest at Q4, the design rationale and the rejected alternatives. Wherever the app *does* open with a first-principles failure story, the primitive scores 11–12:

- hooks (m03:0 "probability × volume");
- the agentic loop (m01:0);
- path-scoped rules (m11:1);
- case facts (m07:0).

The weak cluster is the **product layer**: what the API, the Agent SDK, Claude Code and MCP each *are*. The lessons use these terms from m01 onward but never introduce them. This matches the Foundations track in Phase 7 §2b.

## The 10 weakest primitives

| # | Primitive | Score | Core gap |
|---|---|---|---|
| 1 | MCP transports (stdio vs HTTP) | 0 | Absent everywhere. Low exam weight: the guide's lists don't name it. |
| 2 | Claude Code (the product) | 2 | Never introduced; used from m02 onward as if known. |
| 3 | Claude Agent SDK | 3 | Never defined. It appears only inside a "Real world today" callout (m01:3) and code (m03:2, m06:0). There is no rename history and no comparison with the raw API or Claude Code. |
| 4 | System prompt | 4 | No definition. There's no account of what belongs in it vs a user turn, a tool description or CLAUDE.md. |
| 5 | Slash commands | 4 | One table row (m11:0) and one sorter item. No "why", and no link to MCP prompts (m05:0). |
| 6 | Iterative refinement loop (coordinator) | 4 | One bullet (m06:2) and one quiz. No pattern name, no stop condition. |
| 7 | Explore subagent | 4 | "exists for this" (m07:2). Never defined as a built-in, read-only subagent. |
| 8 | Messages, roles and turns | 5 | Implied by m01:1 code. There's no primer on alternating roles or content blocks. |
| 9 | **MCP: what it is and why it exists** | **5** | Q4 = 0. No origin story, no open-standard rationale, no architecture, no diagram. |
| 10 | Structured state persistence / crash recovery | 5 | One paragraph (m07:2). No manifest example, no contrast with `--resume`. |

Next in line, at 5–6: Iterative refinement in Claude Code (5), `max_tokens` (6), `allowedTools` (6).

## Is MCP's "why" adequately taught today? No.

m05:0 opens with a good one-line principle: "Write an MCP server … once, and Claude Code, an Agent SDK app and Claude Desktop can all use it". It then moves straight to a primitives table, scopes and configuration. It never says:

- what was painful before;
- who created MCP, or when;
- that it is an open standard rather than a Claude-only plugin system, or why that matters;
- how it works (host/client/server, discovery then call);
- why capabilities split three ways by *who controls* them.

There is no MCP diagram; m05's visuals are two sorters. A learner who asks "Why was MCP created? Why is it important?" would find the configuration answer in m05:0–m05:1, but not the motivation. The fix is a "Why it exists" panel plus an N×M → N+M diagram, using the sourced draft below.

## Sourced history and motivation drafts

All drafts were checked against official pages on 2026-10-30. Quoted fragments are exact; everything else is paraphrased.

### 1. MCP origin (for m05:0 or the Foundations product map)

> Anthropic introduced the Model Context Protocol on **November 25, 2024** as an open standard for connecting AI assistants to the systems where data lives. Before it, "every new data source requires its own custom implementation," so each AI application had to hand-wire each tool or data source. MCP replaces "fragmented integrations with a single protocol": write a server once, and any MCP-capable client can use it. The launch shipped the specification and SDKs, local-server support in Claude Desktop, and an open-source repository of pre-built servers.

- Source: https://www.anthropic.com/news/model-context-protocol
- **Note on "N×M".** Anthropic's post describes the problem as needing a custom implementation for every data source. The "N apps × M tools → N + M" phrasing is a common and accurate gloss, but **it is not Anthropic's wording**. Present it as our explanation, not as a quote.
- Supporting definition: modelcontextprotocol.io calls MCP "an open-source standard for connecting AI applications to external systems". It uses the analogy "Think of MCP like a USB-C port for AI applications" and says it is supported across many clients ("build once and integrate everywhere"). Source: https://modelcontextprotocol.io/docs/getting-started/intro

### 2. MCP's open-governance status (a "Real world today" note)

> On **December 9, 2025**, Anthropic donated MCP to the Agentic AI Foundation, a directed fund under the Linux Foundation, to keep it "open-source, community-driven and vendor-neutral." At the time it cited more than 10,000 active public MCP servers and adoption across ChatGPT, Cursor, Gemini, Microsoft Copilot and VS Code.

- Source: https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation

### 3. Why tools, resources and prompts are split (m05:0, Q4)

> MCP splits server capabilities by who is in control. **Tools** are model-controlled: the LLM decides when to call them to take actions. **Resources** are application-controlled, read-only context such as file contents or database schemas; the host app decides what to include. **Prompts** are user-controlled templates that need explicit invocation and typically appear as slash commands.

- Source: https://modelcontextprotocol.io/docs/learn/server-concepts

### 4. Claude Code SDK → Claude Agent SDK rename

> The Agent SDK began as the **Claude Code SDK**. On **September 29, 2025**, Anthropic renamed it the **Claude Agent SDK**, because the harness behind Claude Code had proved useful for many kinds of agents beyond coding. The packages changed accordingly:
>
> - `claude-code-sdk` → `claude-agent-sdk`
> - `@anthropic-ai/claude-code` → `@anthropic-ai/claude-agent-sdk`
> - Python `ClaudeCodeOptions` → `ClaudeAgentOptions`
>
> It gives you "the same tools, agent loop, and context management that power Claude Code", as Python and TypeScript packages and through `claude -p`.

- Sources: https://claude.com/blog/building-agents-with-the-claude-agent-sdk (rename and reason, dated Sep 29 2025); https://code.claude.com/docs/en/agent-sdk/migration-guide ("renamed … reflects the SDK's broader capabilities for building AI agents beyond coding tasks"); https://code.claude.com/docs/en/headless

### 5. Claude Code launch

> Claude Code launched on **February 24, 2025**, alongside Claude 3.7 Sonnet, as "a command line tool for agentic coding" in limited research preview. It lets developers hand substantial engineering work to Claude from the terminal: searching and reading code, editing files, and writing and running tests.

- Source: https://www.anthropic.com/news/claude-3-7-sonnet

### 6. Why the Message Batches API exists

> Anthropic launched the Message Batches API on **October 8, 2024** (generally available December 17, 2024) for large workloads that aren't time-sensitive. You submit up to 10,000 queries per batch, with no need to build your own queueing or manage rate limits. Each batch "is processed in less than 24 hours and costs 50% less than standard API calls."

- Real world today: the docs say most batches finish within about an hour, but only the 24-hour window is guaranteed, and unfinished requests expire.
- Sources: https://claude.com/blog/message-batches-api ; https://platform.claude.com/docs/en/build-with-claude/batch-processing

### 7. Why skills exist

> Anthropic introduced Agent Skills on **October 16, 2025**: folders of instructions, scripts and resources that Claude loads only when relevant to the task. The same format works across Claude apps, Claude Code and the API. In Claude Code, "a skill's body loads only when it's used, so long reference material costs almost nothing until you need it". That is the contrast with always-loaded CLAUDE.md.

- Sources: https://claude.com/blog/skills ; https://code.claude.com/docs/en/skills

### 8. Why hooks exist (supports m03, already strong)

> Hooks give "deterministic control: certain actions always happen rather than relying on the LLM to choose to run them."

- Source: https://code.claude.com/docs/en/hooks-guide
- Related: CLAUDE.md is treated "as context, not enforced configuration"; to block an action, use a PreToolUse hook. Source: https://code.claude.com/docs/en/memory

### 9. Workflows vs agents, and prompt chaining

> In "Building effective agents" (**December 19, 2024**), Anthropic distinguishes **workflows**, where LLMs and tools are orchestrated "through predefined code paths", from **agents**, where LLMs "dynamically direct their own processes and tool usage". Prompt chaining aims "to trade off latency for higher accuracy, by making each LLM call an easier task." The article's advice is to find "the simplest solution possible" and add complexity only when needed. It also names the evaluator-optimizer loop: one call generates, another evaluates and feeds back.

- Source: https://www.anthropic.com/engineering/building-effective-agents

### 10. The cost of multi-agent systems (subagents, Q4/Q5)

> In Anthropic's multi-agent research system (**June 13, 2025**):
>
> - subagents help by "operating in parallel with their own context windows";
> - multi-agent systems use "about 15× more tokens than chats", so they pay off only for high-value tasks;
> - domains that need shared context or have many dependencies between agents are "not a good fit for multi-agent systems today";
> - the lead agent "spins up 3-5 subagents in parallel".

- Source: https://www.anthropic.com/engineering/multi-agent-research-system

### 11. Context as a finite attention budget (m07:0)

> Anthropic describes LLMs as having an "attention budget": as context grows, recall degrades ("context rot"). It recommends three remedies:
>
> - compaction;
> - structured note-taking to files outside the window;
> - sub-agents that return "a condensed, distilled summary".

- Source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

## Accuracy flags found while scoring (send to claims log or Phase 6)

1. **m04:0: MCP error fields.** The app presents `errorCategory`, `isRetryable`, `customerMessage` and `alternatives` next to `isError`. The MCP spec defines only `isError: true` plus `content`; the rest is a recommended convention. Label it as a convention. (Spec: https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
2. **m06:0 and q06-1: `allowedTools` semantics.**
   - In current Claude Code, `--allowedTools` pre-approves the listed tools so they run without a permission prompt.
   - Unlisted tools that need no approval still run.
   - m11:1 already carries a similar "Real world today" note for skills' `allowed-tools`. `allowedTools` needs one too, while keeping the exam's framing. (https://code.claude.com/docs/en/headless)
3. **m08:2: number of few-shot examples.** The app says "2–4 targeted examples". Anthropic's prompting guide says "Include 3–5 examples for best results". Check the exam guide's wording and reconcile.
4. **m06:0: Task → Agent rename.** Confirmed: the docs say the Task tool was renamed Agent in v2.1.63, and `Task(...)` still works as an alias. Subagents can nest up to three levels by default. The app's note ("a few levels deep") is consistent. (https://code.claude.com/docs/en/sub-agents)

## Visuals inventory (Q2 "with a picture")

Of 50 primitives, 31 have some visual or interactive element and 19 are text-only. Most of the 31, however, have only a **sorter**: a classification drill that tests understanding but does not explain a mechanism.

**Explanatory visuals:** diagrams, animations and simulations that show a mechanism (18 primitives; provenance only partially).

| Visual | Kind | Primitives it explains |
|---|---|---|
| m01:0 `statelessDiagram` | static SVG diagram | stateless model, agentic loop, system prompt (box only) |
| m01:2 `loopStepper` | step-through interactive | tool use, stop_reason, messages/turns, agentic loop |
| m02:2 `toolChoice` | interactive | tool_choice |
| m03:1 `complianceSim` | animation (1,000-dot simulation) | hooks / programmatic enforcement |
| m03:3 `hookPlayground` | interactive | hooks, prerequisite gates |
| m06:1 `contextViewer` | interactive | subagents, hub-and-spoke, allowedTools, provenance (partial) |
| m07:1 `contextBudget` | interactive chart | context window, case-facts block, tool-output trimming |
| m10:1 `slaCalc` | interactive calculator | Message Batches API |
| m12:1 `ciBuilder` | interactive | headless/CI flags, independent review |
| m13:3 `segmentReveal` | interactive | segmented accuracy / confidence calibration |
| m00:0 `scenarios`, `weights` | embeds | exam logistics (not a primitive) |

**Sorter only** (practice, no explanatory visual): built-in tools (m02:4), structured errors (m04:1), MCP scopes (m05:2), MCP tools vs resources (m05:3), explicit criteria (m08:1), validation–retry (m09:2), CLAUDE.md, rules, commands and skills (m11:2), plan mode (m11:4), sessions (m12:3), escalation (m13:1).

**Text-only** (19): system prompt, max_tokens, JSON Schema, strict / tool_use structured output, tool descriptions, tool distribution, workflows vs agents / decomposition, Claude Agent SDK, Claude Code, iterative refinement loop, Explore subagent, /compact and scratchpads, **MCP (what/why)**, MCP transports, error propagation across agents, few-shot prompting, structured handoff, crash recovery/manifests, iterative refinement in Claude Code.

**Highest-value new visuals:**

1. A Claude product map: API ↔ Agent SDK ↔ Claude Code ↔ MCP, with dates.
2. MCP N×M → N+M, plus host/client/server.
3. Hub-and-spoke with parallel Task calls.
4. A sessions branch diagram (resume vs fork).
5. Skill progressive disclosure.
6. A schema → tool_use → strict comparison.
7. A lost-in-the-middle curve, labelled illustrative.

## Recommended priority for Phase 7 §2b

1. Foundations "product map" module, which covers Claude Code, the Agent SDK, MCP, the system prompt and messages. It lifts the five weakest product-layer primitives at once.
2. An MCP "Why it exists" panel with drafts 1–3 and a diagram.
3. Q4 sweep: add one "why this design / what it rejected" sentence to each of the 13 primitives scoring Q4 = 0.
4. Define Explore, plan-mode mechanics, slash commands and Pydantic in two or three sentences each.
5. Fix accuracy flags 1–3.
