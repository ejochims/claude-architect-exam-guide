# Novice walkthrough audit: study app m00–m13

Persona: a busy, technically literate solution engineer. I have used ChatGPT and Claude in a chat window. I have never called an LLM API, used tool calling, Claude Code, the Agent SDK, MCP or JSON Schema. I want this app to be the only thing I read before the Claude Certified Architect – Foundations exam.

Method: I read every step of every module in `MODULES` order (m00 → m13): read steps, the code of every widget and embed (to see what's on screen and what I'm asked to do), every quiz question with every option's explanation, recaps and flashcards. I did not open `exam-preparation-guide.md` or `docs/`. The app has no glossary, tooltip or term-definition feature (I checked `app.js` and `index.html`), so a term is "defined" only if a step before it explains it.

Step references are `mNN:i`, using the 0-based index into `window.LESSONS.mNN.steps`.

## Summary

83 issues (4 blocking, 32 major, 47 minor) and 30 GOOD notes, across 14 modules and 86 steps.

| Type | BLOCKING | MAJOR | MINOR | Total |
|---|---:|---:|---:|---:|
| UNDEFINED-TERM | 1 | 10 | 15 | 26 |
| JUMP | 3 | 10 | 7 | 20 |
| MISSING-WHY | 0 | 6 | 8 | 14 |
| QUIZ-UNFAIR | 0 | 3 | 12 | 15 |
| OVERLOAD | 0 | 2 | 3 | 5 |
| NEEDS-OUTSIDE | 0 | 1 | 2 | 3 |
| **Total issues** | **4** | **32** | **47** | **83** |
| GOOD (keep) | | | | 30 |

**The four blocking issues** (all are missing *orientation*, not missing exam facts):

1. **m01:0, tool use is never shown end to end.** No tool definition, `tool_use` block or `tool_result` block appears as actual JSON, so the loop rests on a metaphor.
2. **m01:3, the Agent SDK is never defined.** It's mentioned four times (m01, m02, m03, m05) and explained nowhere, so hooks code (m03) and `AgentDefinition` (m06) have no home.
3. **m05:0, MCP has no runtime picture.** Nothing shows client/host/server, or how a server's tools get into `tools[]` and get executed.
4. **m11:0, Claude Code is never introduced.** It's used from m00 onward, and even its own module starts with config files instead of saying what the product is.

**Patterns behind the counts:**

- **Terms used before they are defined.** The app has no glossary or tooltips. Concepts are used several modules before the module that teaches them: subagent and coordinator in m02 and m04 (taught in m06); MCP in m03 and m04 (m05); `CLAUDE.md` in m05 (m11); context window in m01 (m07, and never formally defined); few-shot in m02 and m03 (m08, never shown).
- **m00 tests the whole course on day one.** The trap spotter and all 3 m00 quiz questions need knowledge from m02, m09, m11 and m12.
- **The best parts are the widgets.** `loopStepper`, `complianceSim`, `hookPlayground`, `contextViewer`, `contextBudget`, `slaCalc` and `segmentReveal` each turn a rule into something I could see working. Keep the "First principle" step that opens every module too: it usually *does* give the why.
- **The why is strongest for judgment rules and weakest for mechanisms.** Prompt vs code, errors as information, and batch latency are well argued. How tool use, MCP, hooks, skills, `CLAUDE.md` and plan mode actually *work* is mostly missing, so those turn into lookup tables.

Not audited: `content/bank.js` (the drill and mock-exam question bank). It isn't part of the module walk.

## Issues by module

### m00 — How this exam thinks

Steps: 0 read "What you're walking into" · 1 read "How to read a question" · 2 widget `trapSpotter` · 3 quiz (3 Qs) · 4 recap.

- [MINOR] UNDEFINED-TERM m00:0 — The scenario and domain embeds name "Agentic Architecture & Orchestration", "Tool Design & MCP Integration", "Claude Code Configuration", "Multi-Agent Research System" and "Continuous Integration". None of these is explained, and nothing tells me "you aren't expected to know these yet". At this point I don't know whether Claude Code is a product, a feature or a coding style. — Add a short "map of the territory" box: one plain sentence each for the Claude API, tool use, agents and subagents, MCP, Claude Code and the Agent SDK, plus "every one of these gets its own module".
- [MAJOR] JUMP m00:1 — "Guarantees belong in code; judgment belongs in prompts, descriptions and examples" and "Code is responsible for permissions, thresholds, ordering, retries…" assume I picture an application wrapped around the model. From the chat window, "Claude" is the whole system, so I can't see where "code" would sit or how it could stop the model doing something. "Descriptions" (of what?) and "schema" also show up with no explanation. — Add a one-paragraph diagram first: your app (code) ↔ API ↔ model, with the model only able to *ask* for actions that your code carries out. That turns the "code vs prompt" split from a slogan into something I understand.
- [GOOD] m00:1 — The four moves (evidence → root cause → guarantee vs judgment → proportionate fix) and the "most effective first step" vs "most reliable" qualifier are clear, can be reused, and are worth keeping.
- [MAJOR] OVERLOAD m00:2 — The trap gallery shows nine patterns in one step, and the trap cards and the "name that trap" items use about 15 unexplained terms: system prompt, routing layer, context window, schema, subagent, coordinator, synthesis agent, sentiment score, `-p`, `--output-format json`, `--json-schema`, `.claude/rules/`, `.mcp.json`, `--batch`, `CLAUDE_HEADLESS`. I can only match the wording to the card text, not understand why each one is a trap. — Show the trap gallery here as a preview only ("you'll meet each one in its module"), then bring back each trap's quiz item at the end of the module that teaches the concept behind it.
- [MAJOR] NEEDS-OUTSIDE m00:2 — T8 "Feature that doesn't exist" asks me to tell real flags and files (`-p`, `.claude/rules/`, `.mcp.json`) from invented ones (`--batch`, `CLAUDE_HEADLESS`). With no Claude Code knowledge I can only guess or look it up. — Move the T8 item to after m11/m12, or label it "you'll be able to do this after Module 12".
- [MAJOR] QUIZ-UNFAIR m00:3 (q00-1) — This question assumes that the model "calls" named tools and that each tool has a written "description" that the model reads. Neither has been taught (tools arrive in m01/m02). I can pick the answer from common sense, but I don't know *why* descriptions are "the model's main signal". — Move it to the end of m02, or add one sentence on what a tool and a tool description are before the quiz.
- [MAJOR] QUIZ-UNFAIR m00:3 (q00-2) — "Lease-abstraction pipeline", "schema marks the field as a required integer" and "nullable" assume JSON Schema and structured extraction (m09). — Move it to m09, or replace it with a question that needs no schema knowledge.
- [MAJOR] QUIZ-UNFAIR m00:3 (q00-3) — "Which is not a real Claude Code mechanism?" uses `.claude/rules/`, `paths:` glob frontmatter, `claude -p`, `CLAUDE_HEADLESS` and `${GITHUB_TOKEN}` expansion in `.mcp.json`. At this point all of these are undefined (Claude Code, rules, glob, frontmatter, CI, environment-variable expansion, MCP). I can only guess, and the explanation points to "task statement 3.3", which I've never seen. — Move it to the end of m12.
- [MINOR] MISSING-WHY m00:0 — The page doesn't say what a "scaled score" of 720 means as a raw percentage, or how the 4-of-6 scenario draw affects preparation beyond "prepare all six". — Add one line: scaled scoring isn't a fixed percentage, so aim for about 80% on practice questions (the home screen already says this).

### m01 — The agentic loop

Steps: 0 read "First principle: the model is a function" · 1 read "The loop and its one signal" · 2 widget `loopStepper` · 3 read "How the exam frames it" · 4 quiz (5 Qs) · 5 recap.

- [BLOCKING] JUMP m01:0 — The whole loop rests on "tool definitions" and Claude "asking" for a tool, but nothing explains what a tool *is* in API terms: a name, a description and an input schema that you send in `tools[]`. Nothing explains how a text model "asks" either: it emits a structured `tool_use` block with an id, a tool name and JSON arguments instead of (or as well as) prose. I've never used tool calling, so "the model can only ask for one" stays a metaphor and I can't picture the bytes going back and forth. — Before the loop, add a "tool use in 60 seconds" step: one tool definition, the matching `tool_use` block Claude returns, and the `tool_result` block your code sends back, shown as raw JSON with the three linked by `id`/`tool_use_id`.
- [MAJOR] UNDEFINED-TERM m01:0 — "System prompt", "message history", "content blocks", "context window" and "input tokens" are all used with no definition. I know "prompt" from chat, but not that the system prompt is a separate field, and I don't know what a token is or why cost grows per turn. — Add a foundations module (m00.5) covering the request/response shape, the user/assistant roles, the system prompt, tokens (rough rule of thumb: about 4 characters each) and the context window as a hard per-request token budget.
- [MINOR] MISSING-WHY m01:0 — "Nothing carries over between calls" contradicts what I see in ChatGPT and Claude.ai, which remember the conversation and even have "memory" features. The lesson never squares the two, and q01-3 then tempts me with an "API persistent memory setting" that feels plausible *because* consumer chat has one. — Add one sentence: "The chat app you've used is an application that resends the transcript every turn. Its 'memory' feature is app code too, not the model."
- [GOOD] m01:0 — "Your application is the memory / your application is the clock" and "the model can't execute a tool, it can only ask for one" are the best mental hooks in the module. Keep them.
- [MAJOR] MISSING-WHY m01:1 — The code appends tool results in a message with `"role": "user"`. That surprised me: the user didn't say anything. Nothing explains that the API alternates user and assistant roles, and that anything coming from outside the model (people *or* your code) goes in the user turn. — Add one line plus a labeled transcript showing user → assistant(tool_use) → user(tool_result) → assistant(text).
- [MINOR] UNDEFINED-TERM m01:1 — `client.messages.create(...)` uses "client" (an SDK object) with no mention of what an SDK or client library is. `max_tokens` is listed as "cut off at the token limit", but the code never shows where that limit is set. `tool_use_id` is said to link results to calls, but the widget never shows an id. — Show `max_tokens=1024` in the snippet, add a comment `# Anthropic Python SDK: a thin wrapper over the HTTP API`, and show the ids in the widget's blocks.
- [GOOD] m01:2 — `loopStepper` works well. Watching `messages[ ] sent` grow from 1 to 5 while each response is judged only on `stop_reason` makes statelessness and the loop concrete, and the "I'm done with the tracking lookup" trap teaches the natural-language anti-pattern by letting me fall for it.
- [BLOCKING] UNDEFINED-TERM m01:3 — "The Claude Agent SDK runs this loop for you, and hooks plug into it." This is the first time I see either term, and it's dropped in a callout. Is the Agent SDK a library? A product? Is it the same as Claude Code? What is a hook? I checked: the app mentions the Agent SDK four times (m01:3, m02:3, m03:2, m05:0) and never defines it. So the SDK code in m03:2 (`ClaudeAgentOptions`, `HookMatcher`) and m06:0 (`AgentDefinition`, `allowedTools`) has nowhere to hang, and I can't answer "Agent SDK vs Claude Code vs API" at all. — Expand the callout into a short "who runs the loop?" box: (a) you, with the raw Messages API; (b) the Agent SDK, a library that runs this loop, tool execution and context management for you; (c) Claude Code, an app built on that same harness for coding in a terminal. Add: "hooks = your code that runs at fixed points in the loop; Module 3."
- [MINOR] QUIZ-UNFAIR m01:4 (q01-2) — The distractor "temperature is set too high" relies on knowing what temperature is. It has never been defined, so I can't rule it out by reasoning. — Add "temperature" to the foundations glossary (a randomness setting for sampling).
- [MINOR] QUIZ-UNFAIR m01:4 (q01-4) — The "Message Batches API" distractor needs m10 knowledge, and the correct answer's "continue the response" names a technique that hasn't been taught. — Add a sentence to m01:1 on how to handle `max_tokens` (raise the limit, or send a follow-up asking it to continue), and drop or defer the batch distractor.
- [MINOR] QUIZ-UNFAIR m01:4 (q01-5) — `tool_choice: "any"` appears as a distractor before `tool_choice` is taught (m02). — Move the question after m02, or swap the distractor.

### m02 — Tools are the interface

Steps: 0 read "First principle: descriptions are the interface" · 1 read "Fewer tools per agent, and tool_choice" · 2 widget `toolChoice` · 3 read "The built-in tools" · 4 widget `sorter` (built-in tools) · 5 quiz (7 Qs) · 6 recap.

- [MAJOR] UNDEFINED-TERM m02:0 — "It sees a name, a description and an input schema." I've never seen JSON Schema, and the examples show only description strings, never a whole tool definition. I still don't know what I would actually send. — Show one complete tool definition (`name`, `description`, `input_schema` with `type: object`, `properties`, `required`) and annotate each part. Add a 5-line JSON Schema primer (types, `required`, `enum`, nullable) here, since m00, m09 and later all rely on it.
- [GOOD] m02:0 — "Claude never sees your tool's code… a vague description is a bug in the interface, even though it shows up as a 'reasoning' failure." This gives the reason behind the rule. The weak/strong `lookup_order` contrast and the "check the system prompt for keyword triggers" point are both clear.
- [MAJOR] JUMP m02:1 — The step relies on a multi-agent picture that comes four modules later (m06): "Each subagent gets what its job needs", "a synthesis agent with web search", "routed through the coordinator". I don't yet know that one app can run several Claude "agents" with different prompts and tool lists. — Either keep this step to a single-agent example (a support agent with 18 tools vs 5) and defer the subagent version to m06, or add a two-sentence preview: "Later you'll split work across several agents, each its own loop with its own tools."
- [MAJOR] JUMP m02:1 — The `tool_choice` table's "typical use" for `any` is "several extraction schemas, document type unknown". That depends on an idea never stated: a "tool" can exist *only* to force Claude to return data in a fixed shape, with no action behind it. I came in thinking tool = action (look up an order), so "extraction tool" makes no sense yet. — Add a short "two uses of tools" box: (1) actions your code carries out, (2) output schemas you never "run". You just read the arguments Claude filled in. Point ahead to m09.
- [MINOR] MISSING-WHY m02:1 — It never says where `tool_choice` goes: a parameter on the same `messages.create` request as `tools`. — Add it to the m01 code snippet, or show `tool_choice=` inline here.
- [GOOD] m02:2 — The `toolChoice` widget's three situations × four settings, each with a one-line consequence, teach "the smallest guarantee you need" well.
- [MAJOR] JUMP m02:3 — "Claude Code and the Agent SDK ship with Read, Write, Edit, Bash, Grep and Glob." Claude Code hasn't been introduced and the Agent SDK has only been named. This also seems to contradict m01, where *my* code runs tools. Who executes `Bash` here? Nothing separates tools you define and run (custom/client tools) from tools the harness defines and runs for you (built-in tools). — Add a one-paragraph bridge: "Claude Code is Anthropic's coding agent for the terminal; the Agent SDK is the same engine as a library. Both come with built-in tools they execute themselves, so you don't write `run_tool` for these." Or move this step into m11.
- [MINOR] UNDEFINED-TERM m02:3 — Glob pattern syntax (`**/*.test.tsx`) and Edit's "unique anchor text" are not explained, and q02-7 then quotes the error "old_string is not unique". — One line each: `**` means any folder depth; Edit replaces an exact `old_string` with `new_string` and refuses if `old_string` occurs more than once.
- [MINOR] QUIZ-UNFAIR m02:5 (q02-1) — It uses a "coordinator" in a "research system" (m06), and a distractor relies on "few-shot examples" (m08). Neither has been taught. — Reword the stem around a single agent, or move it to m06.
- [MINOR] QUIZ-UNFAIR m02:5 (q02-3) — "Synthesis subagent" and "16 research tools" assume the m06 architecture. It's answerable from m02:1's rule, but I'm memorizing "scope tools to role" without knowing what a subagent is. — Same fix as the m02:1 JUMP.

### m03 — Prompts guide, code guarantees

Steps: 0 read "First principle: probability × volume" · 1 widget `complianceSim` · 2 read "The three enforcement tools" · 3 widget `hookPlayground` · 4 widget `sorter` (prompt or code) · 5 read "Handoffs and multi-concern requests" · 6 quiz (5 Qs) · 7 recap.

- [GOOD] m03:0 — "A prompt changes the probability of a behavior. Code changes whether it's possible", backed by the 99.5% × 200,000 = 1,000 arithmetic, is the clearest "why" in the course so far. Together with the `complianceSim` widget (m03:1), it fixes the m00:1 slogan in my head. Keep both.
- [MINOR] UNDEFINED-TERM m03:0 — "More emphasis, capital letters or few-shot examples…" and "a hook, a prerequisite gate" are used before they're defined (few-shot in m08, hook in m03:2). The m03:1 widget toggle says "PreToolUse hook" before I know what one is. — Add a one-line forward gloss in m03:0: "hook = a function the agent framework calls automatically before or after every tool call; details in two steps."
- [MAJOR] MISSING-WHY m03:2 — In m01 *my* code ran every tool (`run_tool(b)`), so I could just put `if amount > 500: refuse` there. Why do hooks exist? The step never says that once a framework (the Agent SDK or Claude Code) runs the loop and executes tools for you, you no longer own that code path. Hooks are the official way to get back in at fixed points. Without that, "hook vs logic inside the tool" seems like an arbitrary choice. — Add: "If you run the raw loop, a check in your tool code is a gate. If the SDK or Claude Code runs the loop, register a hook. Same idea, different owner of the loop." Also say when to prefer each (the hook applies across every tool matching a pattern; tool-internal logic travels with the tool to every client).
- [MAJOR] JUMP m03:2 — The "Prerequisite gate" is described by its effect, but there's no mechanism or code. Is it an SDK feature, a hook that reads session state, or a flag inside `process_refund`? The exam separates "gate" from "hook", and I can't tell them apart beyond "ordering vs policy". — Add 5 lines of pseudo-code: `if not session.verified_customer_id: return error("Verify with get_customer first")`, and say it can live in the tool or in a PreToolUse hook.
- [MINOR] OVERLOAD m03:2 — Three mechanisms plus an SDK snippet (`ClaudeAgentOptions`, `HookMatcher`, `hookSpecificOutput`, `permissionDecision`) in one phone screen. I'll memorize the field names rather than understand them. — Cut the snippet down to the essentials (matcher → function → allow/deny + reason), or move it to a collapsible "what it looks like in code" block.
- [GOOD] m03:3 — `hookPlayground`'s request → gate → hook → tool pipeline, with the deny reason pointing Claude to `escalate_to_human`, makes "redirect, don't just fail" concrete.
- [GOOD] m03:4 — The sorter's single question ("what happens when the model gets it wrong once?") is a reusable test. The card-number item ("mask it in the tool result so the model never has it to repeat") is a strong example.
- [MINOR] JUMP m03:5 — "Investigate each one (in parallel where they're independent)" assumes Claude can request several tools at once. The m01 code silently handled a list of `tool_use` blocks, but parallel tool calls were never named. — One sentence in m01:1: "a single response can contain several `tool_use` blocks; run them all and return every result in one user message."
- [MINOR] QUIZ-UNFAIR m03:6 (q03-2) — "Three MCP tools…" uses MCP two modules before it's defined. It's answerable without knowing what MCP is, but it's another unexplained acronym. — Say "three backend tools", or gloss MCP in a glossary.

### m04 — Errors are information

Steps: 0 read "First principle: an error is a message to the model" · 1 widget `sorter` (classify failure) · 2 read "Propagating errors across agents" · 3 quiz (6 Qs) · 4 recap.

- [GOOD] m04:0 — "When a tool fails, the agent decides what to do next from the error text alone" ties straight back to m01 (the model only knows what's in the request). The four-category table with a "right response" column and the "empty is not an error" callout are clear and give the reasons.
- [MAJOR] UNDEFINED-TERM m04:0 — "In MCP, set `isError: true` on the result." MCP is used as if known, one module before it's defined. — Say "In the raw API, set `is_error: true` on the `tool_result` block; MCP (Module 5) uses `isError` for the same thing", or move the MCP detail into m05.
- [MAJOR] JUMP m04:0 — The example error object mixes one protocol field (`isError`) with fields that look like conventions (`errorCategory`, `isRetryable`, `customerMessage`, `alternatives`). Nothing says which fields the protocol defines and which ones I invent and put in the result content. The flashcard ("isError: true, an error category, isRetryable…") then has me memorize them as one standard list. — Add one line: "Only the error flag is part of the protocol; the rest is your own JSON inside the result text. The model reads it like any other text, which is why clear field names matter."
- [GOOD] m04:1 — Including "valid empty result" as a fifth sorter category, next to the four error types, sticks.
- [MAJOR] JUMP m04:2 — "In multi-agent systems, failures happen inside subagents but recovery decisions belong to the coordinator." This is the third module to lean on coordinator/subagent before m06 explains what they are or how they talk to each other. I can't picture how a subagent "returns" anything to a coordinator (I only learn in m06 that it's a tool result of the Task tool). — Move m06 before m04, or add a 3-sentence "multi-agent in one paragraph" preview in m02 that later modules can refer back to.
- [MINOR] QUIZ-UNFAIR m04:3 (q04-2) — The distractor "Return a JSON-RPC protocol error" relies on knowing that MCP runs over JSON-RPC and has two error levels. Neither is taught here (or, as far as I can tell, before this point). — Teach the two levels (protocol error vs tool-result error) in m05, and ask this question there.
- [MINOR] QUIZ-UNFAIR m04:3 (q04-5) — "Increase the coordinator's turn limit" assumes knowing what a turn limit is (`max_turns` on an SDK agent). — Gloss it, or swap the distractor.

### m05 — MCP: integrate once

Steps: 0 read "First principle: integrate once" · 1 read "Configuring MCP in Claude Code" · 2 widget `sorter` (scope) · 3 widget `sorter` (tool or resource) · 4 quiz (6 Qs) · 5 recap.

- [BLOCKING] JUMP m05:0 — MCP is defined as "a standard way to expose a system to any AI client", but there's no picture of how it works. What *is* an MCP server: a process, a URL? Who are the "client" and the "host"? Most of all, how does an MCP server's tool end up in the `tools[]` list from m01/m02, and who runs it when Claude emits `tool_use`? Without that link, MCP feels like a separate world from the loop I just learned, and the `.mcp.json` `"command": "npx"` entry in m05:1 is unreadable. Is Claude Code launching a program? — Add a sequence diagram: the host app (Claude Code) starts or connects to the server → asks it for its tools and resources (`tools/list`) → copies those definitions into `tools[]` on each API request → when Claude emits `tool_use` for one, the host forwards it to the server (`tools/call`) → the server runs it and returns the result → the host wraps that in a `tool_result`. Name the two transports (a local process over stdio, or a remote server over HTTP) in one line.
- [MAJOR] MISSING-WHY m05:0 — Why MCP was created is given only as the slogan "integrate once". The "before" world is missing: every AI app wrote its own tool definitions plus its own `run_tool` glue for every system (N apps × M systems), as I did in m01. — Add a 3-line before/after: "Before: Jira integration written separately for Claude Desktop, your SDK agent and your IDE. After: one Jira MCP server; any MCP-speaking host discovers and uses its tools."
- [MAJOR] JUMP m05:0 — In the primitives table, resources are "controlled by the application" and "let the agent see the map first", but it never says *how* a resource reaches the model. Does the host inject it into context? Does the user attach it? Does the model fetch it? So "use a resource instead of list/search tools" is a rule I memorize, not understand. — Add one sentence on how a host exposes resources (for example, it lists or attaches them so their content goes into the request), and contrast that with tools, which the model calls whenever it decides to.
- [MINOR] UNDEFINED-TERM m05:0 — "Claude Desktop", "slash commands" (as the form prompts take in Claude Code), "the host's UI" and "permissions" are all used without definition. — Glossary entries, or a one-line gloss for each.
- [GOOD] m05:0 — The "annotations are hints" callout (a server can claim anything, so `readOnlyHint` isn't a security boundary) is a good example of saying *why* something can't be relied on.
- [MAJOR] UNDEFINED-TERM m05:1 — "Configuring MCP in Claude Code." This is the fifth module to rely on Claude Code, and the app still hasn't said what it is: a terminal-based coding agent that reads and edits your repo, runs commands, and loads project config from `.claude/`, `CLAUDE.md` and `.mcp.json`. I'm learning its config files before I know the product. — Add a Claude Code orientation before m02:3 or here (what it is, how you start it, what it can touch, which files it reads at startup), or move m11's opening ahead of this module.
- [GOOD] m05:1/m05:2 — The project/user/local scope table, "different names merge, same name: local > project > user", and the sorter that makes me place five servers are clear. The `${JIRA_TOKEN}` example shows *why* expansion exists (share the config, not the secret).
- [MINOR] QUIZ-UNFAIR m05:4 (q05-1, q05-2, q05-3, q05-5) — Distractors use `CLAUDE.md`, `~/.claude/CLAUDE.md` ("memory files") and `.claude/settings.json`, none of which are taught until m11. The right answers are still reachable, but I can't eliminate the CLAUDE.md options by understanding them. — Gloss CLAUDE.md in the Claude Code orientation proposed above.

### m06 — Multi-agent orchestration

Steps: 0 read "First principle: isolated context is a feature" · 1 widget `contextViewer` · 2 read "What a good coordinator does" · 3 quiz (8 Qs) · 4 recap.

- [MAJOR] JUMP m06:0 — "A subagent starts with an empty conversation" comes before any plain definition of a subagent in terms of the loop I learned in m01. The missing bridge: a subagent is *another agentic loop*, a separate `messages[]` conversation. The coordinator starts it by emitting a `tool_use` for the Task tool, whose input is the prompt, and the subagent's final answer comes back as that call's `tool_result`. Without this, "subagents don't inherit context" and "parallel = multiple Task calls in one response" are rules to memorize. With it, they follow from m01. — Add a 4-box diagram: coordinator loop → `tool_use: Task{prompt}` → new loop with its own `messages[]` → final text → `tool_result` back to the coordinator.
- [MAJOR] UNDEFINED-TERM m06:0 — `allowedTools`, `AgentDefinition` and "Task tool" are introduced as API names, but I don't know whose API: the Agent SDK's? Claude Code's? Both? The Agent SDK has still only been named in a callout (m01:3). — Label the snippet's origin ("Agent SDK option names; Claude Code uses the same concepts in `.claude/agents/*.md`") and point back to an SDK orientation (see the m01:3 fix).
- [GOOD] m06:0 — "Isolated context is a feature… the cost is that you must pass everything a subagent needs, explicitly" gives both the benefit and the price, which is the shape of explanation that makes the exam's trade-off questions answerable.
- [MINOR] JUMP m06:0 — The "why use subagents at all" argument ("verbose search results stay out of the coordinator's context") depends on context-window cost and attention, which m07 teaches *after* this module. — Move m07's first principle (context is finite, and attention is uneven) before m06, or add a one-line forward reference.
- [MINOR] NEEDS-OUTSIDE m06:0 — The "Real world today" callout says the Task tool is now called `Agent`, but the exam says "Task". It's honest, but it leaves me unsure which name a question will use and whether other names have also drifted. — Keep the callout, and add "if an option says Agent tool, treat it as the same thing".
- [GOOD] m06:1 — `contextViewer` is the best widget for this topic. Toggling "Task in allowedTools" / "pass findings" / "parallel" and watching each card's *context window* contents change makes isolation concrete, and the 80s → 40s timing shows why parallel matters.
- [GOOD] m06:2 — The "climate adaptation → only irrigation" example makes "every subagent succeeded, so blame the decomposition" stick (trap T7 finally makes sense here, five modules after m00 asked me to spot it).
- [MINOR] QUIZ-UNFAIR m06:3 (q06-2) — The "Message Batches API… up to 24-hour latency" distractor depends on m10. — Defer, or gloss.

### m07 — Attention is finite

Steps: 0 read "First principle: attention is finite" · 1 widget `contextBudget` · 2 read "Long codebase exploration" · 3 quiz (7 Qs) · 4 recap.

- [MAJOR] UNDEFINED-TERM m07:0 — This is the module about the context window, yet it never defines one: the maximum number of tokens one request (input plus output) can hold. Nor does it say what a token is, or give a rough size (for example, hundreds of thousands of tokens is a few hundred pages). The widget then measures everything in "tokens" against a "budget shown: 100,000". The term has been used since m01:0, so by now I've been nodding along for six modules. — Open m07 with three sentences: token ≈ ¾ of a word; the context window = a hard per-request token limit; you pay, and wait, for every input token on every turn (link to m01's "cost of statelessness").
- [MINOR] JUMP m07:0 — "Summaries lose specifics" and the flashcard's "progressive summarization" assume I know that apps routinely summarize older turns (usually with another model call) to stay under the limit. That technique is never introduced as a technique; it only appears as a source of failure. — Add one line: "To keep long chats under the limit, apps replace old turns with a model-written summary. That's progressive summarization, and here's what it loses."
- [MINOR] MISSING-WHY m07:0 — "Lost in the middle" is stated as a fact with a mitigation, but no reason or source. Is it a quirk of one model? A general finding? — Add one clause: "an observed property of long-context models: recall is strongest at the start and end."
- [MINOR] OVERLOAD m07:0 — Four failure modes plus four fixes (case facts, trimming, positional ordering, structured inter-agent handoffs) on one phone screen. — Split into "what goes wrong" and "the fixes", or pair each failure with its fix in a 2-column table.
- [GOOD] m07:0 — The "$247.83 refund on #8812 by Friday" → "customer discussed a refund" example is concrete and memorable, and the case-facts block fix follows naturally.
- [GOOD] m07:1 — `contextBudget` shows it working: turning on summarization *without* case facts flips "Exact" to "Lost", so I see the trade-off instead of being told about it. Trimming 40 fields to 5 visibly collapses the tool-output bar.
- [MAJOR] JUMP m07:2 — "Long codebase exploration" is about Claude Code sessions, but it doesn't say so. It introduces the "Explore subagent" (a built-in Claude Code subagent?), the `/compact` command (what does it do: summarize the conversation in place?) and "context boundaries" with no definitions. I can't tell which are Claude Code features, which are SDK features and which are general patterns. — Label the step "In Claude Code:", define `/compact` (it replaces the conversation history with a summary to free context) and Explore (a built-in read-only subagent for searching a codebase), and say that slash commands are typed in the Claude Code prompt.
- [MINOR] MISSING-WHY m07:2 — Crash recovery ("export state to a known location… manifest") is described in two sentences, with no example of what's in a manifest or why replaying transcripts is worse beyond "expensive". — Add a 4-line example manifest (agent → status → output file).

### m08 — Prompting for precision

Steps: 0 read "First principle: specific beats general" · 1 widget `sorter` (report or skip) · 2 read "Few-shot examples and review architecture" · 3 quiz (7 Qs) · 4 recap.

- [GOOD] m08:0 — The vague-vs-explicit pair ("Be conservative" vs "flag only when the behavior it claims contradicts what the code does…") shows *why* exhortations fail: they don't say which findings matter. The "trust is shared across categories" callout gives a real-world reason for the counter-intuitive "disable a category" answer.
- [MAJOR] UNDEFINED-TERM m08:2 — "Few-shot examples" has been used since m03, and this is where it's taught, but the step never *shows* one. I don't know where examples go (system prompt? fake earlier user/assistant turns?), how they're marked off, or what "show the reasoning" looks like on the page. So I can recite "2–4 examples, ambiguous cases, with reasoning" without being able to write one. — Add one concrete few-shot block: two `<example>` sections, each with input → chosen action → one-line "why not the alternative", placed in the system prompt.
- [MINOR] JUMP m08:2 — "A session that generated code keeps its reasoning… an independent instance without that context" is the right idea, but it's never tied back to m01. An "independent instance" is just a new request whose `messages[]` doesn't contain the generator's turns. The words "session" and "instance" sound like infrastructure (a new server?) rather than "a fresh conversation". — Add one line: "Independent = a new conversation that gets only the diff and the criteria (Module 1: the model only knows what you send)."
- [MINOR] UNDEFINED-TERM m08:2 — "Extended thinking" appears here and in q08-6 with no definition. — One-line gloss: an API option that lets the model reason step by step before answering, at extra token cost.
- [MINOR] OVERLOAD m08:2 — Five few-shot rules, two review architectures and a note on confidence routing in one step. — Split into "few-shot examples" and "who reviews, how much at once".
- [MINOR] UNDEFINED-TERM m08:3 (q08-2) — "Your CI reviewer…" CI (continuous integration) is still undefined (m12). — Gloss it once in a glossary, or say "your automated PR reviewer".
- [MINOR] QUIZ-UNFAIR m08:3 (q08-5) — This extraction question relies on "make the field required" vs null, which is schema design from m09. — Move it to m09, or keep it with a back-reference to m00's lease example.

### m09 — Structured extraction

Steps: 0 read "First principle: syntax is not truth" · 1 read "Semantics: validate, then retry with feedback" · 2 widget `sorter` (will a retry fix it?) · 3 quiz (7 Qs) · 4 recap.

- [GOOD] m09:0 — "A schema can guarantee that `total` is a number. It can't guarantee that the number is right, or that the document mentioned a total at all." This is a sharp first principle that kills a whole class of distractors.
- [MAJOR] MISSING-WHY m09:0 — "This is the most reliable way to get schema-compliant output, and it eliminates JSON syntax errors. Prompt-only 'respond in JSON' does not." I'm given the conclusion but not the mechanism. Why does wrapping the schema in a tool make the JSON valid, when asking politely doesn't? Is the API checking it? Is the model constrained while it generates? Without the reason, I can't answer a variant ("what about few-shot JSON examples?") except by memory. This is exactly the "use tool_use for structured output" gap. — Add 2–3 sentences: free-text generation is probabilistic (m03), so a missing brace slips through some fraction of the time. Tool arguments are produced as structured JSON that the API parses against your `input_schema` (and, with strict tool definitions, constrains generation to it). So syntax becomes the platform's job, not the model's.
- [MAJOR] UNDEFINED-TERM m09:0 — JSON Schema is finally shown, but as a bare map of properties, with no `type: "object"`, no `properties` wrapper and no `required` array. The bullets talk about "required", "optional" *and* "nullable" as if they were different things, and I can't tell how to express each. The m00 lease question (q00-2) depended on this distinction eight modules ago. — Show the full `input_schema` (`type`, `properties`, `required`), and spell out: not in `required` = the key may be missing; `["string","null"]` = the key is present but may be null. Say which one the exam means by "make it nullable".
- [MINOR] JUMP m09:0 — "Define an extraction tool… read the `tool_use` input" never says that nothing runs and no `tool_result` is sent. You just take the arguments and stop. After m01, I expected to "run" the tool. — Add one sentence, and link it to the "two uses of tools" box proposed for m02.
- [GOOD] m09:1 — "Know when retries can't help… every retry is an invitation to invent one" and the three-part retry (document + failed extraction + specific errors) are clear and give the reason. The `calculated_total` vs `stated_total` self-check is a nice concrete pattern.
- [GOOD] m09:2 — The sorter item where the *document itself* shows both $1,180 and $1,280 (so retry won't help: flag the conflict) is a well-chosen trap that tests understanding, not recall.

### m10 — Batch processing

Steps: 0 read "First principle: latency is a requirement" · 1 widget `slaCalc` · 2 widget `sorter` (batch or synchronous) · 3 quiz (6 Qs) · 4 recap.

- [GOOD] m10:0 — "Whether that's acceptable depends only on whether something is waiting" is the cleanest decision rule in the course. "No multi-turn tool calling inside a request… nothing executes it and continues" follows directly from the m01 loop, so I understand it instead of memorizing it.
- [MINOR] JUMP m10:0 — I never see what a batch *is* in practice: a list of normal Messages requests, each tagged with a `custom_id`, submitted together. You get back a batch id, poll its status, then download a results file. "Poll for completion" and `custom_id` make more sense with that 4-step picture. — Add a tiny flow (submit → id → poll → results file keyed by `custom_id`) and a 3-line request example.
- [MINOR] MISSING-WHY m10:0 — It never says *why* batch is about 50% cheaper, which would help me remember the trade: Anthropic can run the work whenever it has spare capacity, so you give up timing in exchange for price. — Add one clause.
- [GOOD] m10:1 — `slaCalc` turns "SLA − 24h − post-processing" into something I can see on a timeline, including the "no interval works, use synchronous" edge case.
- [MINOR] UNDEFINED-TERM m10:3 (q10-3) — The explanation "max_tokens limits output, not input" is new information that should have been taught in m01, where `max_tokens` was only "the token limit". `context_length_exceeded` is also unexplained. — Fix in m01 (`max_tokens` caps the *response* length; the context window caps the whole request) and add the error name to the foundations glossary.

### m11 — Configuring Claude Code

Steps: 0 read "First principle: scope decides who gets it, and when" · 1 read "Path-specific rules, commands and skills" · 2 widget `sorter` (where does it go?) · 3 read "Plan mode and iterative refinement" · 4 widget `sorter` (plan or direct) · 5 quiz (9 Qs) · 6 recap.

- [BLOCKING] JUMP m11:0 — This is the dedicated Claude Code module, and it opens with "Every Claude Code configuration question comes down to…" without ever saying what Claude Code *is*. I've now seen the name in ten modules and still couldn't tell a colleague: it's a terminal app you start with `claude` in a repo; it runs the m01 agentic loop with built-in tools (m02:3) against your files; it asks permission before edits and commands; and at startup it reads `CLAUDE.md`, `.claude/` and `.mcp.json`. Every configuration rule in the module hangs on that picture. Domain 3 is 20% of the exam. — Add a "Claude Code in 90 seconds" step at the start of m11 (and a 2-line preview in m00/m02): what it is, how a session starts, what it loads, what it can touch, and a screenshot-style transcript of one task.
- [MAJOR] MISSING-WHY m11:0 — `CLAUDE.md` is called "memory" ("user memory", "project memory", `/memory`). After m01 taught "the model has no memory; your app resends everything", that word confused me. The step never says what `CLAUDE.md` actually *does*: Claude Code reads the file and puts its text into the context of every session, so it's standing instructions, not memory. Without that, "always loaded costs tokens", "split it into rules" and "skills load on demand to save context" are unexplained preferences. — Add one sentence: "'Memory' here means files Claude Code automatically adds to the context at session start. That's why size and scope matter (Module 7)."
- [MAJOR] OVERLOAD m11:0 — A 7-row table (user/project/local/directory memory, rules, commands, skills), three file locations each, plus `@import`, `/memory` and "split a monolith", all in one phone screen. This is the densest step in the app. — Split it into two steps: (1) `CLAUDE.md` levels (who), (2) rules/commands/skills (when), each with its own small sorter.
- [GOOD] m11:0 — The "who gets it × when it loads" framing is a strong organizing idea. Once I knew what the files were for, every sorter item in m11:2 came down to answering those two questions.
- [MAJOR] UNDEFINED-TERM m11:1 — Skills and commands are configured here (frontmatter fields), but I never learn what's *inside* one or how it gets triggered. A command is a markdown prompt file that runs when you type `/name`. A skill is a folder with `SKILL.md` instructions (plus optional scripts). Claude sees only its name and description, and pulls in the full file when a task matches, just as it picks tools by description in m02. "On demand" in the table never says *whose* demand. — Add a 3-line `SKILL.md` body below the frontmatter and one sentence on how it gets triggered (by the user via `/name`, or by Claude via the description). Link it to m02's "descriptions are the interface".
- [MINOR] UNDEFINED-TERM m11:1 — "Frontmatter" (used in m00 and the flashcards) is never named or explained in a read step; the `---` block just appears. Glob syntax (`**/*.stories.tsx`) is still unexplained. — "Frontmatter = a YAML metadata block between `---` lines at the top of a markdown file; `**` = any folder depth."
- [MINOR] NEEDS-OUTSIDE m11:1 — The "Real world today" callout says commands have merged into skills and `allowed-tools` now *pre-approves* rather than restricts. "Pre-approve" relies on a permission-prompt model that's never taught, and I'm told to answer in exam terms that differ from the product I might try. — Keep the callout, but add one line on Claude Code's permission prompts (it asks before running tools unless they're allowed), so "pre-approve vs restrict" means something.
- [MINOR] UNDEFINED-TERM m11:3 — "Plan mode explores the codebase safely" doesn't say what "safely" means (read-only: no edits or commands until you approve a plan), how you enter it, or what you get back (a written plan to approve). — Add one sentence on the mechanism.
- [MINOR] UNDEFINED-TERM m11:3 — "Batch interacting issues" reuses "batch" one module after the Batch API, with an unrelated meaning. — Rename it to "group interacting issues in one message".

### m12 — CI/CD and sessions

Steps: 0 read "First principle: automation can't answer questions" · 1 widget `ciBuilder` · 2 read "Sessions: resume, fork, or start fresh" · 3 widget `sorter` (resume, fork, fresh) · 4 quiz (7 Qs) · 5 recap.

- [GOOD] m12:0 — "A CI runner has no human to type at a prompt and no human to read free text" gives the reason behind `-p` and `--output-format json` in one sentence, so the real flags stick and the invented ones (`--batch`, `CLAUDE_HEADLESS`) stand out. This is where m00:2's T8 item and q00-3 finally become answerable.
- [MINOR] UNDEFINED-TERM m12:0 — "CI", "CI runner" and "pipeline" are used throughout (and since m00) without being spelled out: continuous integration, meaning automated jobs (for example, GitHub Actions) that run on every push or PR. Most solution engineers know this, but the app should still say it once. — One-line gloss.
- [MINOR] JUMP m12:0 — `--json-schema` is the CLI twin of m09's schema-enforced output, but the link isn't made, so I learn it as a separate flag rather than "the same guarantee, from the command line". — Add one clause: "the same idea as Module 9's tool schema: the platform enforces the shape."
- [MAJOR] MISSING-WHY m12:0 — The module shows Claude Code running headless in CI, which raises the question the app never answers: when would I run `claude -p` in a pipeline, when would I write my own Agent SDK program, and when would I call the Messages API directly? The answer (Claude Code = ready-made coding agent you configure; SDK = the same harness as a library for your own agent; API = you write the loop) is the "neighbor" distinction the exam's distractors rely on. — Add a 3-column comparison table here or in the foundations module, with one CI example per column.
- [GOOD] m12:1 — `ciBuilder` builds the command up one toggle at a time, and each toggle names the failure it prevents. "Same session reviews its own reasoning" ties back to m08.
- [GOOD] m12:2 — "Sessions store conversation history, not the state of your files" ties sessions back to m01 and explains *why* stale tool results mislead after a refactor.
- [MINOR] UNDEFINED-TERM m12:2 — `fork_session` (SDK option?) and `--fork-session` (CLI flag) are given together without saying which surface each belongs to. "Worktrees" (git worktrees) is never defined. How you *name* a session, which `--resume <name>` depends on, is never shown. — Label the SDK vs CLI forms, gloss "worktree", and add one line on naming or picking a session.
- [MINOR] QUIZ-UNFAIR m12:4 (q12-5) — The `claude --continue` distractor isn't taught in the step; it's only explained in the answer. — Add `--continue` (most recent session in this directory) to the m12:2 table.

### m13 — Escalation, review, provenance

Steps: 0 read "First principle: human attention is scarce" · 1 widget `sorter` (triage) · 2 read "Human review and confidence calibration" · 3 widget `segmentReveal` · 4 read "Provenance across synthesis" · 5 quiz (10 Qs) · 6 recap.

- [GOOD] m13:0 — "Anger isn't complexity. A furious customer with a tracking question is a simple case." The demand-vs-frustration contrast, with different handling, makes trap T4 make sense from first principles. The m13:1 triage sorter (explicit request, frustration, three "M. Okafor" accounts, gift-wrap policy gap) covers every branch.
- [MINOR] MISSING-WHY m13:0 — "Honor it immediately, without investigating first" is stated as a rule. The reason (customer autonomy and trust: overriding an explicit request is a failure in itself, whatever the outcome) is only implied. — Add one clause.
- [MAJOR] UNDEFINED-TERM m13:2 — "Calibrated" carries the module's key distinction ("the difference is calibration"), but it's never defined. What does it mean for confidence to be calibrated (when the model says 0.9, it's right about 90% of the time on labeled data)? How do you calibrate (compare scores to a labeled validation set and pick the threshold where accuracy meets your bar)? Without that, "raw confidence = trap, calibrated confidence = good" is two memorized slogans that look contradictory. m08:2 and trap T4 both point here. — Add a 3-row mini table: score bucket → measured accuracy on labeled set → route (auto-accept / review), plus one sentence defining calibration.
- [MINOR] UNDEFINED-TERM m13:2 — "Labeled validation set" and "stratified random sampling" are statistics terms used without definitions. — "Labeled = items where a human recorded the right answer; stratified = sample a fixed share from *each* segment (type × field), so small segments aren't missed."
- [GOOD] m13:3 — `segmentReveal` is excellent. The 97% headline breaks down into 81.7% handwritten and 74.2% tax ID only when I press the buttons, which is the lesson in one interaction.
- [MINOR] UNDEFINED-TERM m13:4 — "Provenance" (the step title and an exam task statement) is never defined as a word. — "Provenance = the traceable chain from each claim back to its source, location and date."
- [MINOR] MISSING-WHY m13:4 — "Render content by type: financial data as tables, news as prose…" doesn't connect to provenance, and no reason is given. — Explain the link (keeping data in tables preserves source figures exactly), or move it.
- [GOOD] m13:4 — The "34% (2021) vs 61% (2025) is a trend, not a conflict, but only if dates travel with the claims" example shows why metadata must flow through the pipeline. It connects back to m06's structured findings.

## End questions

### 1. Self-assessment after m00–m13 (0 = can't explain, 1 = know the rules but not the mechanism or the neighbor, 2 = can explain what, why and when from first principles)

| Concept | Score | What I can and can't explain |
|---|:-:|---|
| The agentic loop | 2 | Statelessness, "your app is the memory and the clock", continue on `tool_use`, stop on `end_turn`, `max_tokens` = truncated. `loopStepper` made this solid. Gap: why tool results go in a `user` message. |
| Tool use | 1 | I know descriptions drive selection, how to scope tools, and `tool_choice` guarantees. I never saw a whole tool definition or raw `tool_use`/`tool_result` JSON, and "tools used purely as output schemas" was only implied until m09. |
| MCP, including why it was created | 1 | Scopes, `.mcp.json` vs `~/.claude.json`, env-var secrets, tools vs resources: yes. Why it exists: only "integrate once". How it works (server process, discovery, who executes calls, how resources reach the model): no. |
| Agent SDK vs Claude Code vs API | 0 | The SDK is never defined, and Claude Code is never introduced as a product. I couldn't tell a customer when to pick each. |
| Hooks | 1 | PreToolUse = block or redirect a call, PostToolUse = normalize results; hooks give a guarantee where a prompt gives a probability. I can't explain where hooks live, or why I'd use one instead of an `if` in my own tool code, because I don't know who owns the loop. |
| Subagents | 2 | Isolated context, spawn via Task in `allowedTools`, pass everything explicitly, parallel = several Task calls in one response, decomposition is the coordinator's job. `contextViewer` did the work. Gap: "a subagent is just another loop whose answer comes back as a tool result" is something I had to infer. |
| CLAUDE.md, rules and skills | 1 | The "who × when" table and the sorter decisions: yes. What `CLAUDE.md` physically does (text added to context), what's inside a skill, and how a skill gets triggered: no. "Memory" contradicts m01. |
| Plan mode | 1 | When to use it vs direct execution: yes. What it actually does (read-only, produces a plan for approval) and how you enter it: no. |
| Batch API | 2 | 50% cheaper, ≤24h, no SLA, `custom_id`, no tool loop inside a request (follows from m01), the SLA arithmetic. Well taught. |
| Structured output | 1 | Rules (tool_use + schema, nullable to stop fabrication, enum + other, validate semantics, retry with feedback): yes. *Why* a tool schema guarantees valid JSON when a prompt doesn't, and JSON Schema basics (`required` vs nullable): no. |
| Few-shot prompting | 1 | "2–4 examples, ambiguous cases, show reasoning": yes. I've never seen one, so I couldn't write one. |
| Escalation | 2 | Three valid triggers, demand vs frustration, why sentiment and raw confidence fail, ask for an identifier when there are multiple matches. Clear and argued. |
| Provenance | 2 | Claim–source mappings, keep conflicts with attribution, dates prevent false contradictions. The word itself is never defined, but the idea is clear. |

Total: 17 / 26. The three 2s that rest on weak foundations (loop, subagents, provenance) would all improve with the foundations module below.

### 2. Foundational lessons missing before m01

The app jumps from "how the exam thinks" (m00) to `client.messages.create(...)` (m01). For someone coming from a chat window, a foundations module (call it m00.5, about 25 min) needs:

1. **What an API call to Claude is.** An HTTP request with an API key, a model id and a JSON body, and a JSON response back. The SDK is a thin client wrapper. The chat apps I've used are themselves applications making these calls, so the "memory" I see there is app code.
2. **Messages and roles.** The `system` prompt as a separate field. The `messages[]` transcript alternating `user` / `assistant`. Content blocks (`text`, `tool_use`, `tool_result`). Why anything from outside the model, including tool results, arrives as a `user` turn.
3. **Tokens, `max_tokens` and the context window.** A token ≈ ¾ of a word. `max_tokens` caps the *response*. The context window caps the *whole request*. Cost and latency scale with input tokens, which grow every turn. Temperature in one line.
4. **JSON and JSON Schema.** Objects, arrays, types, `properties`, `required`, `enum`, nullable via `["string","null"]`. Needed by m00:3, m02, m04, m09 and m12.
5. **Tool use end to end.** One tool definition → Claude's `tool_use` block → your `tool_result`, linked by id, including parallel calls. The two uses of tools (actions you run vs output schemas you just read). Where `tool_choice` goes.
6. **The product map: who runs the loop?** Raw Messages API (you write the loop and run the tools), the Agent SDK (a library that runs the loop and the built-in tools, with hooks, subagents and sessions), Claude Code (a terminal coding agent built on the same harness, configured with `CLAUDE.md`, `.claude/` and `.mcp.json`), and MCP (a protocol for plugging external systems' tools and resources into any of them). One diagram, reused as a "you are here" marker in every later module.
7. **A Claude Code orientation.** Starting a session, permission prompts, built-in tools, what loads at startup, slash commands, `-p` vs interactive.
8. **A dev-ops glossary.** CI/CD, glob patterns, YAML frontmatter, environment variables, git worktrees, stdio/JSON-RPC. One line each, available as tap-to-define.

### 3. What would make this a true one-stop shop

1. **Add the m00.5 foundations module above,** and change the home-screen claim "build from first principles" to match it. Right now the first principles start one layer too high.
2. **Add a glossary with tap-to-define on first use,** plus a build-time lint that flags any glossary term appearing in a step before its defining step. This would remove most of the 26 UNDEFINED-TERM issues mechanically.
3. **Fix the ordering:**
   - put a 3-sentence multi-agent preview in m02, or keep m02 and m04 examples single-agent until m06;
   - move m07's "what is context, and why it is finite" ahead of m06;
   - put the Claude Code orientation before m02:3 and m05;
   - spread m00's quiz questions and trap-spotter items across the modules that teach them, and keep the trap gallery in m00 as a preview only.
4. **Show the real artifact for every mechanism,** not just its effect:
   - a raw request/response;
   - a full tool definition;
   - an MCP handshake sequence;
   - a `CLAUDE.md` and a `SKILL.md` body;
   - a few-shot block;
   - a calibration table;
   - a batch submission.

   Most MAJOR "memorize instead of understand" issues come from seeing the config, but not the thing it configures.
5. **Add a "versus its neighbor" box for each concept,** because the exam's distractors are mostly neighbors:
   - hook vs in-tool check vs prompt;
   - skill vs `CLAUDE.md` vs rule vs command;
   - subagent vs `context: fork` vs prompt chaining;
   - `tool_use` schema vs prompt JSON vs `--json-schema`;
   - batch vs sync;
   - API vs SDK vs Claude Code;
   - resume vs fork vs fresh.
6. **Keep and extend the simulation widgets,** the app's real strength. Add an MCP-host simulator (discover tools → model calls one → host forwards it to the server), a "Claude Code session" simulator (what loads at startup, a plan-mode run, a hook firing) and a JSON Schema playground (toggle required/nullable and watch a lease extraction fabricate or return null).
7. **Make exam-vs-product drift a first-class list,** not scattered "Real world today" callouts: Task/Agent, commands merged into skills, `allowed-tools` restrict vs pre-approve. Then the learner knows exactly which terms to answer in.
8. **Add a capstone "explain it back" checkpoint** after m13 covering the 13 concepts above, each as a short free-recall prompt with a model answer. It would catch the 1-scores before the mock exam does.
