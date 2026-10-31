# Novice read-through: issue list

Reader: technically literate solution engineer, chat-window user of ChatGPT and Claude, no API, tool-calling, Claude Code, Agent SDK, MCP or JSON Schema experience. I could not see the [DIAGRAM] blocks. Where prose depends on a diagram, I say so.

## F01 What a Claude call really is
- [MINOR] UNDEFINED-TERM F01 step 0 — "max_tokens" and the "assistant" role appear in the sample request before tokens and roles are explained in step 1 — add a one-line gloss beside the JSON or reorder.
- [MAJOR] MISSING-WHY F01 step 0 — "the model keeps nothing afterwards" is asserted as a fact but never explained: each request is processed independently and nothing is stored server-side. I would repeat it without understanding — add two sentences on why, plus a worked second turn showing the resent history.
- [MAJOR] UNDEFINED-TERM F01 step 0 — "agent" ("support agent", "agents… multi-agent systems") is used as if known and never defined, even in F02 where it only arrives as "you've built an agent" — add a definition: a program that loops, calling the model and running the tools it asks for.
- [MINOR] UNDEFINED-TERM F01 step 0 — "content blocks" and "a request to use a tool" (stop_reason "tool_use") are used before tools exist in the course — add "(explained next lesson)" or a one-line gloss.
- [MINOR] JUMP F01 step 0 — the sample JSON contains # comments (invalid JSON) and "claude-…" — say the comments are annotations only.
- [MAJOR] MISSING-WHY F01 step 1 — "the system prompt is followed probabilistically" is stated with no reason (the model samples its output, so nothing is guaranteed). The advice "enforce in code" then feels arbitrary — add one sentence and a concrete example of a rule that must not be left to the prompt.
- [MINOR] JUMP F01 step 1 — "attends to all of it equally" and "buried in the middle" assume knowledge of how models read context. It is also unclear whether the reply counts against the context window — add one plain sentence on each.
- [MINOR] NEEDS-OUTSIDE F01 steps 1–2 — "trim tool output", "structured block" and "later modules" are forward references to things I can't picture yet — mark them as previews.

## F02 Tool use from scratch
- [MAJOR] JUMP F02 step 0 — F01's request had no tools field. The text says "a tool definition you send" but never says where it goes in the request — show the F01 request again with a "tools": [...] list added.
- [MINOR] JUMP F02 step 0 — "structured output: define a tool and read the arguments Claude fills in" is confusing. If the tool is never executed, what happens to it? — say explicitly that you don't run it and just read the input.
- [MAJOR] JUMP F02 step 1 — the prose gives only ② and ④. Steps ①, ③ (your code actually running get_order) and the final answer exist only in the diagram. Without the diagram I can't tell who executes the lookup or what the second response looks like — write out ①–⑤ in prose, ending with the end_turn text reply.
- [MINOR] MISSING-WHY F02 step 1 — why is the tool_result carried in a "user" message? — one sentence: the only roles are user and assistant, and results come from your side.
- [MINOR] JUMP F02 step 1 — content is a list, so can Claude request several tools in one response? Not addressed — one sentence.
- [MINOR] NEEDS-OUTSIDE F02 steps 0–1 — Module 1, 2 and 9 are cited as forward references (agent loop, description writing, structured output) — mark as previews.

## F03 The Claude product map
- [MAJOR] UNDEFINED-TERM F03 step 0 — "harness", used to define the Agent SDK, is never defined. "Permissions" is used as a thing the SDK handles but is never explained — gloss both in one line each.
- [MAJOR] MISSING-WHY F03 step 0 — the table says what each product is and who runs the loop, but not when I would pick which. It also never says that all of them ultimately sit on the Messages API calls from F01–F02. Which one do I use to build an app for customers and which to help me code? — add a "choose by situation" line and a layering picture in prose.
- [MAJOR] UNDEFINED-TERM F03 step 1 — a wall of unexplained terms: tool_choice, Message Batches API, coordinators/subagents, AgentDefinition, Task tool, PreToolUse/PostToolUse, "enforcement and normalization", sessions "resume or fork", Explore subagent, claude -p, CI. I can only memorize the list — define subagent, hook and session here, or cut the list down to a preview.
- [MAJOR] UNDEFINED-TERM F03 step 1 / M05 step 1 / M11 recap — "hooks" are cited repeatedly as where enforcement lives ("real enforcement lives in hooks, permissions"). They are never defined in these five lessons — add a definition: code that runs automatically before or after a tool call.
- [MINOR] JUMP F03 step 1 — "Domains 1–5" are referenced with no outline of the exam — add a five-line exam map.
- [MINOR] NEEDS-OUTSIDE F03 step 1 — the Task tool is now called Agent, with a pointer to an "Exam vs. today" page I haven't seen — keep one inline sentence on the name change.
- [MINOR] JUMP F03 step 0 — "each exists because the layer below left work for you" fits API, SDK and Claude Code, but MCP is not a layer above. The odd one out is only noticed in the table's last row — state it.

## M05 MCP: integrate once
- [MINOR] UNDEFINED-TERM M05 step 0 — host vs MCP client, tools/list, tools/call, "stdio transport" and HTTP transport — add that the host is the program running your F02 loop, a client is one connection per server, and stdio means a local subprocess.
- [MINOR] JUMP M05 step 0 — the link from MCP back to F02 is implicit. Nothing says that the host turns the tools/list result into tool definitions and answers a tool_use by sending tools/call. The isError / is_error naming is also confusing — add one connecting sentence.
- [MAJOR] JUMP M05 step 1 — resources. What is a resource, how does the application load one, and does the model see it? "The application chooses" and "the agent can see the map first" sound contradictory. I'd memorize "catalog = resource" without understanding — add a concrete read example.
- [MINOR] UNDEFINED-TERM M05 step 1 — "Claude Desktop", "slash commands" (prompts), and "hooks, permissions" as the real enforcement — gloss or link.
- [MAJOR] UNDEFINED-TERM M05 step 2 — "built-ins" such as Grep (and Read, Glob in M11) are Claude Code's built-in tools. They are never introduced, so "MCP tools compete with built-ins" is opaque — list the built-in tools once.
- [MINOR] MISSING-WHY M05 step 2 — why does the winning scope's entry replace the others whole rather than merge? Why do user and local scope share one file? — one sentence each.
- [MINOR] NEEDS-OUTSIDE M05 step 2 — the config snippet (command, args, env, npx -y, ${VAR:-default}) and "transitive callers" are unexplained. The snippet is the first place I learn that the "command" is how a stdio server is started — annotate it.
- [MINOR] NEEDS-OUTSIDE M05 step 5 — quiz distractors use .claude/settings.local.json and --mcp-server, neither taught — leave out or teach.

## M11 Configuring Claude Code
- [BLOCKING] UNDEFINED-TERM M11 step 0 — CLAUDE.md and "memory" are never defined. Nowhere do the lessons say what the file is, that its text is put into the model's context at session start (the only way a stateless model can "remember" conventions), or what "loads" means. The whole table is scope metadata for an object I don't understand, and I can't reason about "always / matching files / on demand" — add a first-principles paragraph tying it to F01 statelessness.
- [MAJOR] UNDEFINED-TERM M11 step 0 — rules, commands, skills, slash commands and /memory appear only as paths and schedules. I can't tell what each contains or how rules differ from CLAUDE.md beyond scoping — add one definition and one tiny example for each.
- [MAJOR] MISSING-WHY M11 step 0 — "@import keeps memory modular" never says that imported files are loaded in full along with the parent, so it saves no context. Quiz Q3 depends on this fact — state it and contrast with path-scoped rules.
- [MINOR] JUMP M11 step 0 — "Directory memory… when working in that subtree": how does Claude decide it is working there? — one sentence.
- [MAJOR] JUMP M11 step 1 — the skill example shows only frontmatter, no body. It never says what a skill is, who triggers it (me via /name, or Claude on its own), how it differs from a command, or what YAML frontmatter and a "sub-agent context" are — show a complete SKILL.md and define sub-agent.
- [MAJOR] JUMP M11 step 1 — "Real world today" contradicts what was just taught (commands merged into skills, allowed-tools pre-approves instead of restricting, argument-hint is only a hint, personal skill beats project skill). I'm told to "answer in the exam's terms" but left unsure which model is true — present exam vs. current as a side-by-side table after the base idea is solid.
- [MINOR] UNDEFINED-TERM M11 step 1 — glob syntax (**/*.stories.tsx) and Storybook — add a one-line gloss.
- [MAJOR] UNDEFINED-TERM M11 step 3 — plan mode mechanics (read-only? how entered?) and the "Explore subagent" are not defined — define both.
- [MINOR] NEEDS-OUTSIDE M11 step 5 — quiz distractors use /compact and .claude/config.json, neither taught — teach or avoid.

## Scores (0 = could not explain, 1 = partial, 2 = could explain from first principles)

| Question | Score | Why |
|---|---|---|
| (a) What a Claude API call is, and why the model is stateless | 1 | I can describe the request and response, stop_reason and "resend the history". The reason for statelessness is only asserted. |
| (b) Tool use end to end | 2 | Define, ask, execute in your code, send tool_result, loop until end_turn, with is_error. This relies on the diagram for steps ① and ③ and on guessing where the tool definition goes. |
| (c) API vs Agent SDK vs Claude Code vs MCP | 1 | I can say who runs the loop. "Harness", hooks, subagents and sessions are undefined, and there is no guidance on when to use which. |
| (d) Why MCP was created and how it runs | 2 | N×M versus N+M is clear. Host, client and server, tools/list, tools/call and local-versus-remote are enough. Resources and prompts stay fuzzy. |
| (e) What CLAUDE.md, rules and skills are for | 1 | I can infer scope (me vs team, always vs on demand) from the table. I can't say what a skill actually is or how any of them reach the model. |
