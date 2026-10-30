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
  T4: { name: "Unreliable proxy", tell: "Route on sentiment, or on the model’s self-rated confidence score.", why: "Anger doesn’t measure complexity, and LLM self-confidence is poorly calibrated: wrong answers are often confident." },
  T5: { name: "Consolidate everything", tell: "Merge similar tools into one generic tool, or give one agent every tool.", why: "Selection degrades with more, vaguer options. Specific tools and scoped agents are easier to choose correctly." },
  T6: { name: "Hide or hammer the error", tell: "Generic “operation failed,” return empty results as success, blind retries, or kill the whole workflow.", why: "Recovery needs structured context: what failed, whether it can be retried, and what partial results exist." },
  T7: { name: "Fix the wrong component", tell: "Blames a downstream agent or step that did its job correctly.", why: "Trace the evidence to where the fault starts. If every subagent succeeded and coverage is missing, look at the coordinator’s decomposition." },
  T8: { name: "Feature that doesn’t exist", tell: "Plausible-sounding flags, env vars or config files (a --batch flag, CLAUDE_HEADLESS, .claude/config.json).", why: "Distractors often invent mechanisms. Know the real ones: -p, --output-format json, --json-schema, .claude/rules/, .mcp.json." },
  T9: { name: "Just tell it to try harder", tell: "“Be careful,” “be consistent,” “review critically,” “remember the details,” or a bold repeat of the same instruction.", why: "Exhortations add no information or structure. Fix what’s actually missing: criteria, examples, context, or an independent reviewer." }
};
