// Blueprint, module map, and distractor patterns. Lessons register themselves in window.LESSONS.
window.LESSONS = window.LESSONS || {};

window.BLUEPRINT = {
  examDate: "2026-12-31",
  domains: [
    { id: "d1", n: 1, name: "Agentic Architecture & Orchestration", short: "Agentic architecture", weight: 27 },
    { id: "d2", n: 2, name: "Tool Design & MCP Integration", short: "Tools & MCP", weight: 18 },
    { id: "d3", n: 3, name: "Claude Code Configuration & Workflows", short: "Claude Code", weight: 20 },
    { id: "d4", n: 4, name: "Prompt Engineering & Structured Output", short: "Prompts & output", weight: 20 },
    { id: "d5", n: 5, name: "Context Management & Reliability", short: "Context & reliability", weight: 15 }
  ],
  tasks: {
    "1.1": "Design and implement agentic loops",
    "1.2": "Orchestrate coordinator–subagent systems",
    "1.3": "Configure subagent invocation and context passing",
    "1.4": "Enforce multi-step workflows and handoffs",
    "1.5": "Apply hooks for interception and normalization",
    "1.6": "Choose task decomposition strategies",
    "1.7": "Manage sessions: resume and fork",
    "2.1": "Write tool descriptions with clear boundaries",
    "2.2": "Return structured MCP errors",
    "2.3": "Distribute tools and configure tool_choice",
    "2.4": "Integrate MCP servers into Claude Code",
    "2.5": "Use the built-in tools well",
    "3.1": "Configure the CLAUDE.md hierarchy",
    "3.2": "Create slash commands and skills",
    "3.3": "Apply path-specific rules",
    "3.4": "Choose plan mode or direct execution",
    "3.5": "Refine iteratively",
    "3.6": "Run Claude Code in CI/CD",
    "4.1": "Write explicit criteria to cut false positives",
    "4.2": "Use few-shot examples",
    "4.3": "Enforce structured output with tool_use",
    "4.4": "Build validation and retry loops",
    "4.5": "Design batch processing",
    "4.6": "Design multi-pass and independent review",
    "5.1": "Preserve facts across long conversations",
    "5.2": "Design escalation and ambiguity handling",
    "5.3": "Propagate errors across agents",
    "5.4": "Manage context in large codebases",
    "5.5": "Calibrate confidence and human review",
    "5.6": "Preserve provenance across synthesis"
  },
  scenarios: [
    { n: 1, name: "Customer Support Resolution Agent", domains: ["d1", "d2", "d5"] },
    { n: 2, name: "Code Generation with Claude Code", domains: ["d3", "d5"] },
    { n: 3, name: "Multi-Agent Research System", domains: ["d1", "d2", "d5"] },
    { n: 4, name: "Developer Productivity with Claude", domains: ["d2", "d3", "d1"] },
    { n: 5, name: "Claude Code for Continuous Integration", domains: ["d3", "d4"] },
    { n: 6, name: "Structured Data Extraction", domains: ["d4", "d5"] }
  ]
};

// Every module in dependency order. `ready` modules have lesson content in window.LESSONS.
window.MODULES = [
  { id: "f01", n: "F1", title: "What a Claude call really is", principle: "A model call is a stateless function: the request is everything it knows.", tasks: [], minutes: 12 },
  { id: "f02", n: "F2", title: "Tool use from scratch", principle: "The model can only ask; your code decides what runs.", tasks: [], minutes: 15 },
  { id: "f03", n: "F3", title: "The Claude product map", principle: "Each product exists because the layer below left work for you.", tasks: [], minutes: 12 },
  { id: "m00", n: 0, title: "How this exam thinks", principle: "Every question rewards the proportionate fix for the real root cause.", tasks: [], minutes: 15 },
  { id: "m01", n: 1, title: "The agentic loop", principle: "The model is stateless; your loop is its memory and its clock.", tasks: ["1.1", "5.1"], minutes: 20 },
  { id: "m02", n: 2, title: "Tools are the interface", principle: "The model chooses tools by reading their descriptions.", tasks: ["2.1", "2.3", "2.5"], minutes: 25 },
  { id: "m03", n: 3, title: "Prompts guide, code guarantees", principle: "Anything that must never fail belongs in code, not in the prompt.", tasks: ["1.4", "1.5"], minutes: 20 },
  { id: "m04", n: 4, title: "Errors are information", principle: "A failure the agent can't classify is a failure it can't recover from.", tasks: ["2.2", "5.3"], minutes: 20 },
  { id: "m05", n: 5, title: "MCP: integrate once", principle: "Expose a system once; every client can use it.", tasks: ["2.4"], minutes: 20 },
  { id: "m06", n: 6, title: "Multi-agent orchestration", principle: "Isolated context is a feature you must feed explicitly.", tasks: ["1.2", "1.3", "1.6"], minutes: 30 },
  { id: "m07", n: 7, title: "Attention is finite", principle: "What sits in context, and where, decides what gets used.", tasks: ["5.1", "5.4"], minutes: 25 },
  { id: "m08", n: 8, title: "Prompting for precision", principle: "Specific criteria and examples beat general exhortations.", tasks: ["4.1", "4.2", "4.6"], minutes: 25 },
  { id: "m09", n: 9, title: "Structured extraction", principle: "A schema guarantees syntax, never truth.", tasks: ["4.3", "4.4"], minutes: 25 },
  { id: "m10", n: 10, title: "Batch processing", principle: "Latency is a requirement, not a preference.", tasks: ["4.5"], minutes: 15 },
  { id: "m11", n: 11, title: "Configuring Claude Code", principle: "Configuration is code: scope decides who gets it, and when.", tasks: ["3.1", "3.2", "3.3", "3.4", "3.5"], minutes: 35 },
  { id: "m12", n: 12, title: "CI/CD and sessions", principle: "Automation needs non-interactive, machine-readable runs.", tasks: ["3.6", "1.7"], minutes: 25 },
  { id: "m13", n: 13, title: "Escalation, review, provenance", principle: "Human attention is scarce; route it where it changes outcomes.", tasks: ["5.2", "5.5", "5.6"], minutes: 30 }
];

// Recurring distractor patterns. Questions tag wrong options with these ids.
window.TRAPS = {
  T1: { name: "Prompt where code is needed", tell: "“Add to the system prompt that X is mandatory” for a rule with financial, legal or safety stakes.", why: "Prompts are followed probabilistically. A 1% miss rate across 100,000 conversations is 1,000 violations." },
  T2: { name: "Over-built first step", tell: "A classifier, routing layer, new service or ML model when a description or prompt fix hasn’t been tried.", why: "The exam rewards the proportionate fix that targets the root cause. Infrastructure comes after the cheap fix fails." },
  T3: { name: "Bigger model or bigger window", tell: "“Switch to a larger model” or “use a larger context window.”", why: "Capacity doesn’t fix design. More context doesn’t mean even attention, and a bigger model still fabricates a value a schema forces it to supply." },
  T4: { name: "Unreliable proxy", tell: "Escalate on sentiment, or on the model’s raw self-rated confidence, as a stand-in for how hard the case is.", why: "Anger doesn’t measure complexity, and uncalibrated self-confidence doesn’t track case difficulty. Not a trap: field-level confidence calibrated on labeled data, used to prioritize human review (task 5.5)." },
  T5: { name: "Consolidate everything", tell: "Merge similar tools into one generic tool, or give one agent every tool.", why: "Selection degrades with more, vaguer options. Specific tools and scoped agents are easier to choose correctly." },
  T6: { name: "Hide or hammer the error", tell: "Generic “operation failed,” return empty results as success, blind retries, or kill the whole workflow.", why: "Recovery needs structured context: what failed, whether it can be retried, and what partial results exist." },
  T7: { name: "Fix the wrong component", tell: "Blames a downstream agent or step that did its job correctly.", why: "Trace the evidence to where the fault starts. If every subagent succeeded and coverage is missing, look at the coordinator’s decomposition." },
  T8: { name: "Feature that doesn’t exist", tell: "Plausible-sounding flags, env vars or config files (a --batch flag, CLAUDE_HEADLESS, .claude/config.json).", why: "Distractors often invent mechanisms. Know the real ones: -p, --output-format json, --json-schema, .claude/rules/, .mcp.json." },
  T9: { name: "Just tell it to try harder", tell: "“Be careful,” “be consistent,” “review critically,” “remember the details,” or a bold repeat of the same instruction.", why: "Exhortations add no information or structure. Fix what’s actually missing: criteria, examples, context, or an independent reviewer." }
};

// Where the exam blueprint's view of the product differs from what ships today. Answer the exam with `exam`;
// know `today` for real work. Linked from "Real world today" callouts as #today. Sources verified 2026-10-30.
window.EXAM_VS_TODAY = [
  { topic: "Spawning subagents", ts: "1.2–1.3", exam: "Subagents are spawned with the Task tool, and the coordinator's allowedTools must include \"Task\" or it can't delegate.", today: "The tool is named Agent (Task still works as an alias). In the Agent SDK, allowedTools pre-approves tools rather than gating them; a vague subagent description is a common reason Claude answers directly instead of delegating.", src: "https://code.claude.com/docs/en/agent-sdk/subagents" },
  { topic: "Parallel subagents", ts: "1.2", exam: "Emit several Task calls in one response to run subagents in parallel; one call per turn runs them one after another.", today: "Subagents start in the background by default, so the coordinator isn't blocked between calls.", src: "https://code.claude.com/docs/en/agent-sdk/subagents" },
  { topic: "What a subagent sees", ts: "1.3", exam: "A subagent starts with only what the coordinator passes it, so pass context explicitly.", today: "Subagents also load CLAUDE.md, and fork-style subagents can inherit the parent conversation. Passing context explicitly is still the reliable design.", src: "https://code.claude.com/docs/en/sub-agents" },
  { topic: "Forced tool_choice", ts: "2.3, 4.3", exam: "tool_choice \"any\" guarantees some tool is called; a named tool guarantees that tool.", today: "On Claude Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1, and with manual extended thinking, \"any\" and named tools return a 400 error. Use \"auto\" with strict: true tools, or structured outputs.", src: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools#forcing-tool-use" },
  { topic: "Guaranteed structured output", ts: "4.3", exam: "tool_use with a JSON Schema, plus tool_choice, is the most reliable way to get schema-compliant output.", today: "Only strict: true on a tool, or structured outputs (output_config.format), guarantees schema-valid output.", src: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use" },
  { topic: "Tools inside a batch", ts: "4.5", exam: "A batch request can't run a multi-turn tool loop; keep agentic loops on the synchronous API.", today: "True for your own (client) tools. Anthropic-run server tools such as web search do execute inside a batch request.", src: "https://platform.claude.com/docs/en/build-with-claude/batch-processing#server-tools-and-the-agentic-loop" },
  { topic: "Skill allowed-tools", ts: "3.2", exam: "allowed-tools restricts which tools a skill can use while it runs.", today: "allowed-tools pre-approves the listed tools so they run without a permission prompt. Restricting tools is done with disallowed tools or an agent's tool list.", src: "https://code.claude.com/docs/en/skills#pre-approve-tools-for-a-skill" },
  { topic: "Skill argument-hint", ts: "3.2", exam: "argument-hint prompts the developer for a required parameter.", today: "It only shows a hint in autocomplete; it doesn't block invoking the skill without the argument.", src: "https://code.claude.com/docs/en/skills#frontmatter-reference" },
  { topic: "Slash commands", ts: "3.2", exam: "Team commands live in .claude/commands/; personal ones in ~/.claude/commands/.", today: "Custom commands have been merged into skills. .claude/commands/ still works, and a skill in .claude/skills/ creates the same /name.", src: "https://code.claude.com/docs/en/skills" },
  { topic: "Personal variant of a team skill", ts: "3.2", exam: "Create your variant in ~/.claude/skills/ under a different name so teammates aren't affected.", today: "A personal skill with the same name takes precedence for you only. A different name still avoids confusion.", src: "https://code.claude.com/docs/en/skills#resolve-skills-that-share-a-name" },
  { topic: "Finding files by pattern", ts: "2.5", exam: "Use Glob for file-name patterns, Grep for contents.", today: "On macOS and Linux, current Claude Code runs file search through Bash by default.", src: "https://code.claude.com/docs/en/tools-reference#glob-tool-behavior" },
  { topic: "Seeing loaded memory", ts: "3.1", exam: "/memory shows which memory files are loaded.", today: "/memory opens memory files for editing; /context shows what is loaded into the context window.", src: "https://code.claude.com/docs/en/memory#view-and-edit-with-%2Fmemory" },
  { topic: "Few-shot count", ts: "4.2", exam: "Use 2–4 targeted examples for ambiguous cases.", today: "Anthropic's prompting guide suggests 3–5 examples. The principle (a few targeted examples that show the reasoning) is the same.", src: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#use-examples-effectively" },
  { topic: "Consolidating tools", ts: "2.1", exam: "Don't merge distinct-purpose tools into one vague generic tool; sharpen descriptions and boundaries instead.", today: "The tool docs recommend grouping related operations into one tool with an action parameter. Both agree that tools must be unambiguous to choose between.", src: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools" },
  { topic: "MCP: bad tool arguments", ts: "2.2", exam: "Return structured errors with isError: true so the agent can recover.", today: "Since MCP spec 2025-11-25, invalid or missing arguments are tool execution errors (isError: true). JSON-RPC errors are only for unknown tools, malformed requests and server errors.", src: "https://modelcontextprotocol.io/specification/2025-11-25/server/tools#error-handling" },
  { topic: "Prefilling the response", ts: "—", exam: "Not tested directly.", today: "Prefilling the assistant turn returns a 400 error on recent models. Use structured outputs or instructions instead.", src: "https://platform.claude.com/docs/en/api/errors#prefill-not-supported" }
];

// Searchable glossary: every term links to the lesson that teaches it, so nothing needs an outside lookup.
window.GLOSSARY = [
  ["Messages API", "f03", "Anthropic's HTTP API for Claude: send a request (system prompt, messages, tools), get one response. Stateless."],
  ["SDK", "f01", "A client library (Python, TypeScript and others) that calls the API for you."],
  ["Token", "f01", "The unit models read and write in: a chunk of a few characters. Limits and costs are counted in tokens."],
  ["Context window", "f01", "The most one request can hold: system prompt, tool definitions, history and the new message together."],
  ["max_tokens", "f01", "A cap on the length of one response. Reaching it truncates the answer (stop_reason \"max_tokens\")."],
  ["System prompt", "f01", "Standing instructions and context for a whole conversation. Followed probabilistically, so hard rules belong in code."],
  ["stop_reason", "m01", "Why a response ended: \"end_turn\" (finished), \"tool_use\" (wants a tool), \"max_tokens\" (truncated)."],
  ["Agentic loop", "m01", "Call the model, run any tools it requests, append the results, repeat until stop_reason is \"end_turn\"."],
  ["Tool definition", "f02", "name + description + input_schema. The description is how the model decides when to use the tool."],
  ["tool_use / tool_result", "f02", "The block where Claude requests a tool call, and the block where your code returns the result (matched by tool_use_id)."],
  ["JSON Schema", "f02", "A standard way to describe JSON: type, properties, required, enum, and null for values that may be absent."],
  ["tool_choice", "m02", "Whether Claude must call a tool: auto (its choice), any (some tool), a named tool, or none."],
  ["Structured output", "m09", "Getting output in an exact JSON shape, on the exam via tool_use + JSON Schema + tool_choice."],
  ["Validation–retry loop", "m09", "Check extracted output in code; on failure, send the specific error back and retry. Fixes format errors, not missing source data."],
  ["Few-shot examples", "m08", "A handful of worked examples in the prompt that show the format and the reasoning for ambiguous cases."],
  ["Multi-pass review", "m08", "Splitting a big review into focused passes (per file, then cross-file), or using an independent instance to check work."],
  ["Message Batches API", "m10", "Asynchronous processing at half the cost, with up to 24 hours to complete. For latency-tolerant work."],
  ["custom_id", "m10", "Your identifier on each batch request; the only reliable way to match results to inputs."],
  ["Claude Agent SDK", "f03", "Claude Code's agent harness as a library: the loop, built-in tools, hooks, subagents and sessions. Formerly the Claude Code SDK."],
  ["Claude Code", "f03", "Anthropic's agentic coding tool for the terminal, IDE, desktop and web."],
  ["Hook", "m03", "Code that runs at fixed points in the agent loop, such as before or after a tool call. Deterministic, unlike a prompt."],
  ["PreToolUse / PostToolUse", "m03", "Hooks that inspect (and can block or modify) a tool call before it runs, or transform its result before the model sees it."],
  ["Subagent", "m06", "A separate agent with its own context, prompt and tools, invoked by a coordinator for a focused task."],
  ["Coordinator", "m06", "The agent that decomposes a task, delegates to subagents, and synthesizes their results (hub-and-spoke)."],
  ["Task tool (Agent tool)", "m06", "The tool a coordinator uses to spawn a subagent. Renamed Agent in current Claude Code; the exam says Task."],
  ["AgentDefinition", "m06", "In the Agent SDK, a subagent's description, system prompt and tools."],
  ["allowedTools", "m06", "On the exam, the list of tools an agent may use. Today it pre-approves tools rather than gating them."],
  ["Session resume / fork", "m12", "Continue an earlier session with its history (resume), or branch a copy to explore an alternative (fork)."],
  ["MCP", "m05", "Model Context Protocol: an open standard for exposing tools, resources and prompts to any AI application."],
  ["MCP host / client / server", "m05", "The AI app (host) holds one client per server; the server wraps a system and executes its tools."],
  ["Tools / resources / prompts", "m05", "MCP's three primitives: actions the model calls, content the app loads, templates the user invokes."],
  ["isError", "m04", "The flag on an MCP tool result marking a failure the agent can reason about and recover from."],
  [".mcp.json", "m05", "Project-scoped MCP server config at the repo root, committed and shared with the team."],
  ["Environment variable expansion", "m05", "${VAR} in .mcp.json, so secrets stay out of version control."],
  ["CLAUDE.md", "m11", "Memory files Claude Code loads as instructions: user-level, project-level, and in subdirectories."],
  [".claude/rules/", "m11", "Rule files with paths: glob frontmatter that load only when Claude works on matching files."],
  ["Skill", "m11", "A reusable capability in .claude/skills/<name>/SKILL.md, invoked as /name, with optional frontmatter and supporting files."],
  ["Slash command", "m11", "A /name shortcut. On the exam, defined in .claude/commands/; today merged into skills."],
  ["Frontmatter", "m11", "The YAML block between --- lines at the top of a Markdown file, holding settings such as paths: or context: fork."],
  ["Glob pattern", "m11", "A file-matching pattern such as **/*.test.tsx (** means any directories)."],
  ["Plan mode", "m11", "Claude Code explores and proposes a plan before editing. For large, ambiguous or architectural changes."],
  ["Explore subagent", "m11", "A built-in subagent that does verbose discovery in its own context and returns a summary."],
  ["claude -p", "m12", "Claude Code's non-interactive (print) mode for scripts and CI: run once, print the result, exit."],
  ["--output-format json / --json-schema", "m12", "CLI flags for machine-readable output in CI, optionally validated against a schema."],
  ["Lost in the middle", "m07", "Models attend less reliably to information in the middle of a long context than at its start or end."],
  ["Case-facts block", "m07", "A compact, structured summary of key facts kept in context so they survive long conversations and summarization."],
  ["Escalation", "m13", "Handing a case to a human: on explicit request, a policy gap, or no meaningful progress."],
  ["Calibration", "m13", "Checking confidence scores against labeled data so a threshold means something. Required before routing on confidence."],
  ["Stratified sampling", "m13", "Reviewing a random sample from each segment (document type, field) to measure error rates where aggregates hide them."],
  ["Provenance", "m13", "Keeping each claim linked to its source (document, location, date) through every summarization step."]
];
