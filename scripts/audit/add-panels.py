"""Adds explanatory panels that a fresh reviewer's walkthrough and Why-test found missing (2026-10-31).
Idempotent: each panel carries a marker and is skipped if present. Usage: python3 scripts/audit/add-panels.py"""
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


PANELS = [
("f01", "f01-why-roles", ("before", "<!-- ex:f01-blocks -->"),
 why("Why it's built this way", [
  ("Alternating roles", "models are trained on conversations written as alternating turns, so the API uses the same shape. Because your code sends Claude's earlier turns back, you control exactly what history the model sees."),
  ("A separate system prompt", "standing instructions belong to the whole conversation, not to one message. Keeping them apart from user messages means they don't need repeating each turn, and your instructions stay distinct from content a user typed."),
  ("When you hit <code>max_tokens</code>", "the reply is cut off, not finished. Raise the limit for that kind of task, or ask Claude to continue in the next turn. If the cut happens inside a tool request, that request is incomplete, so retry with a higher limit."),
  ("Window size", "current models accept hundreds of thousands of tokens per request (each model's documentation gives its limit). A bigger window doesn't fix attention: the exam's “use a larger context window” option is usually a trap."),
 ])),
("m02", "m02-production-rule", ("end", "Fewer tools per agent, and tool_choice"),
 why("Exam answer vs. what you build", [
  ("On the exam", "a forced <code>tool_choice</code> (<code>any</code> or a named tool) is the answer when a tool call must happen."),
  ("When you build today", "check whether your model accepts a forced choice. If it doesn't, use <code>auto</code> with clear instructions, and guarantee the output's shape with strict tools or structured outputs."),
  ("Strict tool use", "with <code>strict: true</code> on a tool, the API constrains Claude's tool input to your JSON Schema, so it always parses and matches. It doesn't make the values correct; Module 9 covers that."),
 ])),
("m03", "m03-mechanisms", ("end", "The three enforcement tools"),
 "<h3>Where each mechanism lives</h3>\n" + table(["Mechanism", "Where it's coded", "What it does", "Use when"], [
  ["Prerequisite gate", "Your tool code or loop, checking session state", "Refuses a call until an earlier step succeeded, and says what to do first", "Steps must happen in order (verify, then refund)"],
  ["<code>PreToolUse</code> hook: deny", "A hook that runs before the call", "Stops the call, with a reason the agent can act on", "An action must never happen (over a limit, a protected branch)"],
  ["<code>PreToolUse</code> hook: rewrite input", "The same hook, returning <code>updatedInput</code>", "Changes the call's input, for example adding a required field", "Every call needs a fixed field or format"],
  ["<code>PostToolUse</code> hook", "A hook that runs after the call", "Changes the result before the model reasons over it", "Results arrive in mixed formats or contain sensitive data"],
  ["Prompt instruction", "System prompt or CLAUDE.md", "Asks; works most of the time", "Soft preferences where an occasional miss is cheap"],
 ])),
("m03", "m03-statuses", ("end", "Handoffs and multi-concern requests"),
 why("Three results that sound alike", [
  ("Blocked, with a reason", "the call was refused and the agent can fix it itself: “identity not verified; call verify_identity first.”"),
  ("Pending", "the action was accepted but is waiting on someone, such as a manager's approval. Return an explicit pending status so the agent tells the customer it isn't done yet, instead of reporting a generic success."),
  ("Structured handoff", "the work passes to a person. Include the facts, what was tried and a suggested next step, so the person doesn't start from scratch."),
 ])),
("m04", "m04-vocabulary", ("end", "First principle: an error is a message to the model"),
 why("Which error fields are real", [
  ("Messages API", "<code>is_error: true</code> on a <code>tool_result</code> block. Your code sets it."),
  ("MCP", "<code>isError: true</code> on a tool's result. The server sets it, and the client passes it to the model."),
  ("Everything else", "fields such as <code>errorCategory</code>, <code>isRetryable</code> or a customer-safe message are a recommended convention inside the error's content, not protocol fields. The exam uses these names; the point is that the model gets enough to decide what to do next."),
 ])),
("m05", "m05-transports", ("end", "Configuring MCP in Claude Code"),
 why("Transports: how a client reaches a server", [
  ("stdio", "the client starts the server as a local process and talks to it over standard input and output. It suits tools that run on your machine; each user runs their own copy, and credentials come from local environment variables. In <code>.mcp.json</code> it's an entry with a <code>command</code>."),
  ("HTTP", "the server runs remotely at a URL, and many clients connect to it. It suits shared, hosted services; authentication goes in headers or OAuth. In <code>.mcp.json</code> it's an entry with <code>\"type\": \"http\"</code> and a <code>url</code>. (The older SSE transport is deprecated.)"),
  ("Why two", "local tools need no network service, while shared services shouldn't be installed on every laptop."),
  ("On the exam", "the transport doesn't change what a tool does. Choose it by where the server runs, and choose the scope (project, user, local) by who should get it."),
 ])),
("m06", "m06-patterns", ("before", "<!-- ex:m06-agents -->"),
 "<h3>Decomposition patterns at a glance</h3>\n" + table(["Pattern", "Use when", "Cue in the question"], [
  ["Fixed pipeline (prompt chaining)", "The same steps run in the same order every time", "“always follows these steps”, auditors want identical handling"],
  ["Per-item pipeline", "Many similar items follow an established pattern", "“30 similar entities”, “every document of this type”"],
  ["Sectioned passes, then merge", "One long input whose parts get missed", "“fields deep in the package are missed”, “clauses late in the document”"],
  ["Group by root cause", "Many failures that interact", "“a fix in one place breaks another”"],
  ["Parallel subagents", "Independent subtopics, when speed matters", "“independent”, “one after another”, “takes four times longer”"],
  ["Dynamic (the agent decides)", "The path depends on what turns up", "“nobody knows where the cause is”, “a lead changes what to search”"],
  ["Single agent", "The task is small", "“two or three searches answer it”"],
 ])),
("m07", "m07-explore", ("end", "Long codebase exploration"),
 why("The Explore subagent", [
  ("What it is", "a built-in Claude Code subagent for searching and reading a codebase. It works in its own context with read-only tools and returns a summary."),
  ("Why it exists", "discovery produces pages of file listings and search output. Keeping that out of the main session leaves room for the actual work."),
  ("Why read-only", "its job is finding things, so it can't change files by mistake."),
  ("How you use it", "Claude Code uses it on its own for broad searches, and you can also ask for it (“use the Explore agent to find where config is loaded”)."),
 ])),
("m10", "m10-sla", ("before", "<!-- ex:m10-batch -->"),
 why("The cadence arithmetic, step by step", [
  ("SLA", "the service-level agreement: the latest a result may be ready after a record arrives."),
  ("Submission interval", "how often you send a batch."),
  ("Worst case", "a record arrives just after a submission, waits a full interval, then up to 24 hours of batch processing, then your post-processing."),
  ("Worked example", "with a 30-hour SLA and 2 hours of post-processing, the interval can be at most 30 − 24 − 2 = 4 hours. A 6-hour interval would breach the SLA."),
 ])),
("m11", "m11-commands-why", ("end", "Path-specific rules, commands and skills"),
 why("Why slash commands exist", [
  ("Problem before", "people retyped the same long prompts (a review checklist, release notes), each a little different, so results varied."),
  ("What it is", "a Markdown file whose body is the prompt. The file name becomes <code>/name</code>, and <code>$ARGUMENTS</code> inserts whatever you type after it."),
  ("Where it lives", "<code>.claude/commands/</code> is shared through the repository; <code>~/.claude/commands/</code> is only yours."),
  ("When to use it, and its neighbors", "a command or skill runs on demand; CLAUDE.md is always loaded; a path rule loads for matching files; a hook runs every time, guaranteed."),
  ("On the exam", "“the whole team should get it” means the project location; “only me” means the user location. (Today commands are merged into skills, which work the same way and can also be used by Claude automatically.)"),
 ])),
("m13", "m13-calibration", ("before", "<!-- ex:m13-routing -->"),
 why("Calibration, worked (illustrative numbers)", [
  ("Label a sample", "have people check 200 extracted fields by hand."),
  ("Bucket by confidence", "confidence 0.9 and above: 147 of 150 correct (98%); 0.8 to 0.9: 28 of 30 (93%); below 0.8: 12 of 20 (60%)."),
  ("Pick the threshold", "if review must catch everything below 95% accuracy, route fields under 0.9 to people. Re-measure as documents change."),
  ("Stratified sampling", "sample separately inside each segment, such as document type or field, so rare segments are represented. One random sample is dominated by the common case and can hide a segment that fails badly."),
 ])),
]


def main():
    done = 0
    for f, marker, (kind, text), html in PANELS:
        p = os.path.join(ROOT, f + ".js")
        src = open(p, encoding="utf-8").read()
        if f"<!-- panel:{marker} -->" in src:
            continue
        i = step_end(src, text) if kind == "end" else src.index(text)
        src = src[:i] + f"\n<!-- panel:{marker} -->\n{html}\n" + src[i:]
        open(p, "w", encoding="utf-8").write(src)
        done += 1
    print(f"Added {done} panels.")


main()
