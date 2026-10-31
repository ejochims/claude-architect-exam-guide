"""Fixes the remaining issues from the fresh reviewer's beginner walkthrough and Why-test (2026-10-31).
Idempotent: text edits apply only while the old text is present; panels carry markers.
Usage: python3 scripts/audit/fix-walkthrough.py"""
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "app", "content")


def step_end(src, title):
    t = src.index(f'title: "{title}"')
    i = src.index("html: `", t) + len("html: `")
    while True:
        i = src.index("`", i)
        if src[i - 1] != "\\":
            return i
        i += 1


def why(label, items):
    lis = "".join(f"<li><strong>{k}.</strong> {v}</li>" for k, v in items)
    return f'<div class="callout key"><div class="callout-label">{label}</div><ul style="margin:0;padding-left:18px">{lis}</ul></div>'


def table(head, rows):
    th = "".join(f"<th>{h}</th>" for h in head)
    trs = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
    return f'<div class="table-wrap"><table><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table></div>'


EDITS = [
("f01", "facts buried in the middle of a long history are easier to miss.",
 "facts buried in the middle of a long history are easier to miss. (<em>Attention</em> is how a model weighs which parts of its input matter for each word it writes. Research on long inputs found facts in the middle are recalled less reliably than those at the start or end, an effect called “lost in the middle.”)"),
("f03", "<li><strong>Raw API (Domains 1 and 4).</strong>", "<li><strong>Raw API (Domain 1, agentic architecture; Domain 4, prompt engineering and structured output).</strong>"),
("f03", "<li><strong>Agent SDK (Domain 1).</strong>", "<li><strong>Agent SDK (Domain 1, agentic architecture).</strong>"),
("f03", "<li><strong>Claude Code (Domain 3, parts of 2 and 5).</strong>", "<li><strong>Claude Code (Domain 3, Claude Code configuration; parts of Domain 2, tools and MCP, and Domain 5, context and reliability).</strong>"),
("f03", "<li><strong>MCP (Domain 2).</strong>", "<li><strong>MCP (Domain 2, tool design and MCP).</strong>"),
("m01", "The model can't execute a client tool (the kind this course focuses on).",
 "The model can't execute a client tool (the kind this course focuses on: it runs in your code). Server tools, such as Anthropic's web search, run on Anthropic's side instead."),
("m02", "(plus any input examples)", "(plus example inputs, if you provide them)"),
("m02", "<p class=\"lede\">Selection accuracy falls as options grow.",
 "<p class=\"lede\">Selection accuracy falls as options grow, because every description competes for the model's attention and similar tools blur together, so there are more near-misses to pick."),
("m04", "<p class=\"lede\">In multi-agent systems, failures happen inside subagents but recovery decisions belong to the coordinator.",
 "<p class=\"lede\">In multi-agent systems, failures happen inside subagents but recovery decisions belong to the coordinator (the agent that splits a task, hands the parts to subagents and combines their results; Module 6 covers it)."),
("m08", "or extended (or adaptive) thinking in the same session.", "or extended (or adaptive) thinking, a mode where the model reasons step by step before answering, in the same session."),
("m09", "On the exam, this is the most reliable way to get schema-compliant output, and it eliminates JSON syntax errors.",
 "On the exam, this is the most reliable way to get schema-compliant output and avoid JSON syntax errors. (A strict guarantee takes <code>strict: true</code> or structured outputs; see the note below.)"),
("m09", '<span class="c">// may be absent</span>', '<span class="c"># may be absent</span>'),
("m09", '<span class="c">// filled when "other"</span>', '<span class="c"># filled when "other"</span>'),
("m13", "Acknowledge the frustration and offer the resolution. Escalate if they reiterate that they want a person.",
 "Acknowledge the frustration and offer the resolution. If they then ask for a person, hand off right away."),
("l03", "&quot;tools&quot;: [EXTRACT], &quot;messages&quot;:",
 "&quot;tools&quot;: [EXTRACT],\\n        &quot;tool_choice&quot;: {&quot;type&quot;: &quot;tool&quot;, &quot;name&quot;: &quot;record_invoice&quot;},  # exam framing\\n        &quot;messages&quot;:"),
("l03", "&quot;strict&quot;: True,                                  # schema-valid input, guaranteed",
 "&quot;strict&quot;: True,                                  # schema-valid input, guaranteed; strict needs additionalProperties False"),
]

PANELS = [
("m02", "m02-edit-why", "The built-in tools", why("Why the Edit fallback works", [
  ("Edit", "replaces one exact piece of text. If that text appears several times, Edit can't tell which one you mean, so it refuses."),
  ("Read, then Write", "reading the file and writing back the full corrected version removes the ambiguity. (Today a longer, unique anchor or <code>replace_all</code> also works.)"),
  ("Grep vs. Glob", "Grep searches what's <em>inside</em> files; Glob finds files by <em>name</em>. Searching for a function's callers is Grep; finding every test file is Glob."),
])),
("m03", "m03-tool-names", "The three enforcement tools", why("Tool names in hooks", [
  ("Built-in tools", "use plain names, such as <code>Bash</code> or <code>Edit</code>."),
  ("Your own tools", "in the Agent SDK, custom tools are served through an MCP server, so their names are <code>mcp__&lt;server&gt;__&lt;tool&gt;</code>. A hook's matcher must use that full name, or a pattern that matches it."),
])),
("m04", "m04-backoff", "First principle: an error is a message to the model", why("Retry with backoff", [
  ("What it means", "wait a little longer before each retry (for example 1, then 2, then 4 seconds), so a struggling service has time to recover instead of being hammered."),
  ("Where it belongs", "inside the tool or subagent, for transient errors only. A validation or policy error fails the same way every time."),
])),
("m05", "m05-scopes-notes", "Configuring MCP in Claude Code", why("Reading the configuration", [
  ("User vs. local", "both live in <code>~/.claude.json</code>. Local entries are stored under the current project's path, so they apply only there; user entries apply in every project."),
  ("<code>npx -y</code>", "runs an npm package without installing it first, answering “yes” to the prompt. It's a common way to launch a community stdio server."),
  ("<code>&#36;{VAR:-default}</code>", "uses the environment variable if it's set, otherwise the default after <code>:-</code>."),
])),
("m08", "m08-terms", "First principle: specific beats general", why("Three terms", [
  ("False positive", "a reported finding that isn't a real problem."),
  ("Precision", "the share of reported findings that are real. At 90% precision, one finding in ten is noise."),
  ("Severity", "how much a finding matters. It decides whether the finding blocks a merge."),
])),
("m11", "m11-glob", "First principle: scope decides who gets it, and when", why("Globs", [
  ("What a glob is", "a file-name pattern. <code>*</code> matches any characters within a name, and <code>**</code> matches any number of folders, so <code>**/*.test.ts</code> means every <code>.test.ts</code> file anywhere in the repository."),
])),
("m11", "m11-compare", "Path-specific rules, commands and skills",
 "<h3>Five ways to give Claude standing instructions</h3>\n" + table(["Mechanism", "Loaded or run when", "Who triggers it", "Use for"], [
  ["CLAUDE.md", "Every session", "Automatic", "Conventions that always apply"],
  ["Rule with <code>paths</code>", "When Claude works on matching files", "Automatic", "Conventions for one file type, wherever it lives"],
  ["Slash command", "When you type <code>/name</code>", "You", "A saved prompt you run on demand"],
  ["Skill", "When invoked, or when Claude judges it relevant", "You or Claude", "A procedure with its own instructions, tools or supporting files"],
  ["MCP prompt", "When you pick it", "You", "A prompt template that an MCP server provides"],
 ]) + "\n<p>A hook is different from all five: it isn't instructions to the model. It's your code, and it runs every time.</p>"),
("m12", "m12-ci-terms", "First principle: automation can't answer questions", why("CI terms", [
  ("CI (continuous integration)", "automated jobs that run on every push or pull request."),
  ("Runner", "the machine that runs those jobs."),
  ("Headless", "no person at a keyboard, so the agent can't ask questions and must not wait for input."),
  ("<code>&#36;{{ secrets.NAME }}</code>", "GitHub Actions syntax that injects a stored secret, so API keys never appear in the workflow file."),
])),
("m12", "m12-names", "Sessions: resume, fork, or start fresh", why("Names and worktrees", [
  ("Naming a session", "start it with <code>claude -n auth-race-condition</code>, then resume it later with <code>claude --resume auth-race-condition</code>. Plain <code>--resume</code> opens a picker."),
  ("A git worktree", "a second working folder for the same repository, checked out on another branch, so two sessions can edit files without colliding."),
])),
("m07", "m07-crash", "Long codebase exploration", why("Surviving a crash", [
  ("Problem", "a long multi-agent job dies at hour three. Replaying the whole transcript is slow, may not fit, and carries stale results."),
  ("What to do", "after each unit of work, each agent writes its state to a manifest file: the task, the items done, where results are, and the next step."),
  ("Restart", "the coordinator reads the manifest, resumes from the next unfinished item, and passes the saved state to fresh agents."),
  ("Tradeoff", "a manifest is small and exact; a transcript is complete but large. On the exam, the manifest is the answer."),
])),
("m07", "m07-compact", "Long codebase exploration", why("What <code>/compact</code> costs", [
  ("What it does", "summarizes the conversation so far and carries on from the summary."),
  ("The cost", "it's lossy: exact values and specific findings can vanish into the summary."),
  ("Use it when", "a long session is full of verbose output whose details you no longer need."),
  ("Use something else when", "values must stay exact (a case-facts block or a scratchpad file), or a new phase is starting (a phase summary passed into a fresh context)."),
])),
("m08", "m08-independent", "Few-shot examples and review architecture", why("Running an independent reviewer", [
  ("How", "a separate API call, session or subagent that receives the code and the requirements, but not the conversation that produced the code."),
  ("Cost", "one more model call per review; worth it where a miss is expensive."),
  ("Neighbors", "self-review in the same session is cheap but anchored to its own reasoning; per-file passes fix diluted attention, not anchoring; extended thinking reasons longer but is still anchored."),
])),
("m11", "m11-refine", "Plan mode and iterative refinement",
 "<h3>Iterative refinement, compared</h3>\n" + table(["Technique", "Use when", "Example"], [
  ["Concrete input/output examples", "Prose descriptions keep being misread", "What “short date” means: 03/04/25 → 2025-04-03"],
  ["Tests first, then iterate", "The expected behavior can be pinned down as tests", "A refactor must keep 40 known outputs identical"],
  ["Interview (Claude asks you questions)", "You don't know the requirements yet", "A caching layer in an unfamiliar domain"],
  ["All problems in one message", "The problems interact", "Bugs that share one validation function"],
  ["One problem per message", "The problems are independent", "Unrelated fixes in different modules"],
 ])),
("m06", "m06-stop", "What a good coordinator does", why("When the coordinator should stop", [
  ("The loop", "evaluate the results against the question, re-delegate the gaps, then synthesize again."),
  ("The stop rule", "stop when coverage is good enough, or when a round limit is reached. Without a limit, a coordinator can keep finding “one more angle” for hours."),
])),
("m05", "m05-why-scopes", "Configuring MCP in Claude Code", why("Why three scopes", [
  ("Project", "the team needs the server. It's shared through the repository, so it must hold no secrets."),
  ("User", "you want the server in every project you work on."),
  ("Local", "you want it only in this project and private to you, for example an experiment or personal credentials."),
  ("Conflicts", "if the same server name is defined in several scopes, the more specific one wins: local, then project, then user."),
])),
]


def main():
    edits = panels = 0
    for f, old, new in EDITS:
        p = os.path.join(ROOT, f + ".js")
        s = open(p, encoding="utf-8").read()
        if new in s:
            continue
        if old in s:
            open(p, "w", encoding="utf-8").write(s.replace(old, new, 1)); edits += 1
        else:
            raise SystemExit(f"{f}: text not found: {old[:60]}")
    for f, marker, title, html in PANELS:
        p = os.path.join(ROOT, f + ".js")
        s = open(p, encoding="utf-8").read()
        if f"<!-- panel:{marker} -->" in s:
            continue
        i = step_end(s, title)
        open(p, "w", encoding="utf-8").write(s[:i] + f"\n<!-- panel:{marker} -->\n{html}\n" + s[i:]); panels += 1
    print(f"Applied {edits} edits and {panels} panels.")


main()
