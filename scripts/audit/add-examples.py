"""Adds worked code examples to lesson steps. Idempotent: each example carries a marker and is skipped if present.
Usage: python3 scripts/audit/add-examples.py
Code is written as plain text below and highlighted here (strings, keywords, comments) to match app/styles.css."""
import html, os, re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "app", "content")
PY_KW = r"\b(def|async|await|for|in|if|else|return|import|from|True|False|None|while|continue|break|and|or|not)\b"


def hl(code, lang):
    out = []
    for line in code.strip("\n").split("\n"):
        line = html.escape(line, quote=False)
        # Split off a trailing comment: "#" at line start or after two spaces, outside a string.
        m = re.search(r'(^|\s{2,})(#.*)$', line)
        body, comment = (line[:m.start(2)], m.group(2)) if m and line[:m.start(2)].count('"') % 2 == 0 else (line, "")
        parts = re.split(r'("(?:[^"\\]|\\.)*")', body)
        for i, p in enumerate(parts):
            if i % 2:
                parts[i] = f'<span class="s">{p}</span>'
            else:
                if lang == "py":
                    p = re.sub(PY_KW, r'<span class="k">\1</span>', p)
                p = re.sub(r'(?<![\w.$-])(\d+(?:\.\d+)?|true|false|null)(?![\w-])', r'<span class="k">\1</span>', p)
                parts[i] = p
        out.append("".join(parts) + (f'<span class="c">{comment}</span>' if comment else ""))
    src = "\n".join(out)
    # The lesson html lives in JS template literals: escape backslashes, backticks and ${.
    src = src.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    return f'<pre class="code"><code>{src}</code></pre>'


def block(marker, intro, code, lang="json", outro=""):
    return f"\n<!-- ex:{marker} -->\n{intro}\n{hl(code, lang)}" + (f"\n{outro}" if outro else "")


def step_end(src, title):
    t = src.index(f'title: "{title}"')
    h = src.index("html: `", t) + len("html: `")
    i = h
    while True:
        i = src.index("`", i)
        if src[i - 1] != "\\":
            return i
        i += 1


EXAMPLES = []  # (file, marker, where, html) ; where = ("end", title) | ("before", text) | ("after", text)


def add(f, marker, where, *args, **kw):
    EXAMPLES.append((f, marker, where, block(marker, *args, **kw)))


# ---------------- F1 ----------------
add("f01", "f01-response", ("before", '<svg viewBox="0 0 640 170"'),
    "<p><strong>What comes back.</strong> The response to that request looks like this. The reply sits in <code>content</code>, a list of blocks; here there's a single text block. This agent has no tools yet (F2 adds them), so it can't actually look the order up:</p>",
    """
{
  "id": "msg_01…",
  "type": "message",
  "role": "assistant",
  "content": [
    {"type": "text", "text": "I can't look up orders, but I can explain how tracking works."}
  ],
  "stop_reason": "end_turn",                  # finished normally
  "usage": {"input_tokens": 48, "output_tokens": 17}   # what you're billed for
}
""")
add("f01", "f01-next-turn", ("end", "First principle: a model call is a function"),
    "<p><strong>The next turn.</strong> To ask a follow-up, you send everything again, with Claude's last reply included as an <code>assistant</code> message:</p>",
    """
"messages": [
  {"role": "user", "content": "Where is order 1042?"},
  {"role": "assistant", "content": "I can't look up orders, but…"},   # resent by you
  {"role": "user", "content": "OK. How long is your returns window?"}  # the new message
]
""")
add("f01", "f01-blocks", ("end", "Tokens, the context window and the system prompt"),
    "<h3>Content blocks at a glance</h3>\n<p>Once tools are involved, <code>content</code> becomes a list of typed blocks. Claude's reply can mix text with a tool request, and your next message carries the result, linked by its <code>id</code>:</p>",
    """
# Claude's reply (role "assistant"), ending with stop_reason "tool_use"
[
  {"type": "text", "text": "Let me check that order."},
  {"type": "tool_use", "id": "toolu_01", "name": "get_order",
   "input": {"order_number": "A-1042"}}
]

# Your next message (role "user")
[
  {"type": "tool_result", "tool_use_id": "toolu_01",
   "content": "status: shipped; delivery: Friday"}
]
""", outro="<p>F2 walks through this exchange step by step.</p>")

# ---------------- F2 ----------------
add("f02", "f02-full-response", ("before", "<p><strong>④ Your next request</strong>"),
    "<p>In full, it's an ordinary message whose content holds an optional text block followed by the tool request:</p>",
    """
{
  "role": "assistant",
  "content": [
    {"type": "text", "text": "Let me look up that order."},
    {"type": "tool_use", "id": "toolu_01", "name": "get_order",
     "input": {"order_number": "A-1042"}}
  ],
  "stop_reason": "tool_use"          # Claude is waiting for your result
}
""")
add("f02", "f02-error-parallel", ("after", "so Claude can retry, ask the customer, or explain.</p>"),
    "",
    """
{"type": "tool_result", "tool_use_id": "toolu_01", "is_error": true,
 "content": "Order service timed out after 10 seconds. Safe to retry."}
""", outro="")
add("f02", "f02-parallel", ("after", "<!-- ex:f02-error-parallel -->"),
    "<h3>Several tools in one turn</h3>\n<p>Claude can request more than one tool in a single response. Run them all, then return <strong>every</strong> result in <strong>one</strong> <code>user</code> message, each matched by its id. If a result is missing, the next request is rejected.</p>",
    """
# Claude's response: two requests
[{"type": "tool_use", "id": "toolu_01", "name": "get_order", "input": {"order_number": "A-1042"}},
 {"type": "tool_use", "id": "toolu_02", "name": "get_customer", "input": {"email": "sam@example.com"}}]

# Your next message: both results together
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", "content": "status: shipped"},
  {"type": "tool_result", "tool_use_id": "toolu_02", "content": "customer C-20931, plan Plus"}
]}
""")

# ---------------- F3 ----------------
add("f03", "f03-layers", ("before", "<h3>A short history</h3>"),
    "<h3>The same task at each layer</h3>\n<p>Here is one job, “find where configuration is loaded and summarize it,” done three ways. Notice how much of the work moves off your plate at each layer.</p>\n<p><strong>Claude API.</strong> You write the loop (Module 1):</p>",
    """
response = client.messages.create(model=MODEL, max_tokens=1024,
                                  tools=TOOLS, messages=messages)
# then: check stop_reason, run the tools yourself, append results, repeat
""", lang="py")
add("f03", "f03-sdk", ("after", "<!-- ex:f03-layers -->"),
    "<p><strong>Agent SDK.</strong> The SDK runs the loop and provides built-in tools such as Read, Grep and Glob:</p>",
    """
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Find where configuration is loaded and summarize it",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Grep", "Glob"]),
):
    print(message)
""", lang="py")
add("f03", "f03-cli", ("after", "<!-- ex:f03-sdk -->"),
    "<p><strong>Claude Code.</strong> The finished agent, here run non-interactively from a script (Module 12):</p>",
    """
claude -p "Find where configuration is loaded and summarize it"
""", lang="sh")
add("f03", "f03-mcp", ("after", "<!-- ex:f03-cli -->"),
    "<p><strong>MCP.</strong> A minimal server using the official Python SDK. The function's docstring becomes the tool description, and any MCP client (Claude Code, an Agent SDK app, Claude Desktop) can now call <code>get_order</code>:</p>",
    """
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("orders")

@mcp.tool()
def get_order(order_number: str) -> str:
    \"\"\"Look up one order by its number. Returns status and delivery date.\"\"\"
    return lookup(order_number)          # your real order system

mcp.run()
""", lang="py")

# ---------------- M2 ----------------
add("m02", "m02-tool-choice", ("end", "Fewer tools per agent, and tool_choice"),
    "<h3>The four <code>tool_choice</code> settings</h3>\n<p>Set it in the request next to <code>tools</code>:</p>",
    """
"tool_choice": {"type": "auto"}                              # default: Claude decides, may reply in text
"tool_choice": {"type": "any"}                               # must call a tool; Claude picks which
"tool_choice": {"type": "tool", "name": "extract_invoice"}   # must call this one tool
"tool_choice": {"type": "none"}                              # may not call tools this turn
""", outro='<div class="callout note"><div class="callout-label">Real world today</div><p>Newer models reject a forced choice (<code>any</code> or a named tool) in some configurations. Answer the exam with the framing above; see <a href="#today">Exam vs. today</a> for details.</p></div>')

# ---------------- M5 ----------------
add("m05", "m05-server", ("end", "First principle: integrate once"),
    "<h3>What a server looks like</h3>\n<p>A server exposes <strong>tools</strong> (actions the model calls) and <strong>resources</strong> (content the client can list and read). With the official Python SDK, each one is a decorated function:</p>",
    """
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("docs")

@mcp.tool()
def search_docs(query: str) -> str:
    \"\"\"Full-text search over internal engineering docs. Use for how-to and design questions.\"\"\"
    return search(query)

@mcp.resource("docs://catalog")
def catalog() -> str:
    \"\"\"Index of every doc: title, path and one-line summary.\"\"\"
    return build_index()
""", lang="py", outro="<p>When a tool call fails on bad input, the server returns a normal result flagged as an error, so the model can read it and fix the call (Module 4):</p>")
add("m05", "m05-iserror", ("after", "<!-- ex:m05-server -->"),
    "",
    """
{"content": [{"type": "text", "text": "Invalid date '03/04'. Use YYYY-MM-DD."}],
 "isError": true}
""")

# ---------------- M6 ----------------
add("m06", "m06-agents", ("end", "What a good coordinator does"),
    "<h3>In code: defining subagents</h3>\n<p>In the Agent SDK, each subagent gets a description (how the coordinator decides to use it), its own prompt and its own tools. The coordinator needs the Task tool to spawn them:</p>",
    """
from claude_agent_sdk import ClaudeAgentOptions, AgentDefinition

options = ClaudeAgentOptions(
    allowed_tools=["Task", "WebSearch", "WebFetch"],   # Task is called Agent today
    agents={
        "web-researcher": AgentDefinition(
            description="Finds and reads web sources on one subtopic.",
            prompt="Search for sources on the subtopic you're given. "
                   "Return each finding as claim, source URL and date.",
            tools=["WebSearch", "WebFetch"],
        ),
    },
)
""", lang="py")
add("m06", "m06-task-call", ("after", "<!-- ex:m06-agents -->"),
    "<p>When the coordinator delegates, it calls Task. The subagent sees <strong>only</strong> this prompt, so everything it needs goes in it:</p>",
    """
{"type": "tool_use", "id": "toolu_07", "name": "Task",
 "input": {
   "subagent_type": "web-researcher",
   "description": "Research EU rules for hospital AI",
   "prompt": "Subtopic: EU AI Act obligations for hospitals, 2024-2026.\\nAlready covered: FDA guidance, so skip it.\\nReturn: claim, source URL and publication date for each finding."
 }}
""")

# ---------------- M7 ----------------
add("m07", "m07-case-facts", ("end", "First principle: attention is finite"),
    "<h3>In practice: keep facts exact, trim the rest</h3>\n<p>A <strong>case-facts block</strong> holds the values that must not drift. Your code keeps it up to date and re-sends it every turn, instead of relying on a summary of the conversation:</p>",
    """
## Case facts (verbatim; re-sent every turn)
customer_id: C-20931 (identity verified)
order: A-1042, shipped 2026-03-02
agreed: refund $84.20 to the original card
open: customer also wants a replacement charger
""", lang="text")
add("m07", "m07-trim", ("after", "<!-- ex:m07-case-facts -->"),
    "<p>And trim tool results before they reach the model:</p>",
    """
# Raw result: 40 fields, about 1,800 tokens
{"order_id": "A-1042", "warehouse_bin": "R7-14", "carrier_route": "…", …}

# What your code passes on
{"order_id": "A-1042", "status": "shipped", "delivery": "2026-03-06",
 "items": ["USB-C charger"], "total": 84.20}
""")

# ---------------- M9 ----------------
add("m09", "m09-retry", ("end", "Semantics: validate, then retry with feedback"),
    "<h3>In code: retry with the specific error</h3>\n<p>Your code validates what Claude extracted. If a check fails and the information is in the document, send back exactly what failed:</p>",
    """
data = tool_use_block.input                       # what Claude extracted
errors = validate(data)                           # schema + business rules, in your code
if errors and attempts < 2:
    messages += [
        {"role": "assistant", "content": response.content},
        {"role": "user", "content": [{
            "type": "tool_result", "tool_use_id": tool_use_block.id, "is_error": True,
            "content": "Validation failed: invoice_date 'March 3rd' must be YYYY-MM-DD; "
                       "line items sum to 412.50 but total is 421.50. Re-check the document.",
        }]},
    ]
elif errors:
    send_to_human_review(document, errors)        # retries can't find what isn't there
""", lang="py")

# ---------------- M10 ----------------
add("m10", "m10-batch", ("end", "First principle: latency is a requirement"),
    "<h3>In code: the Message Batches API</h3>\n<p>Each request carries your own <code>custom_id</code>, because results can come back in any order:</p>",
    """
batch = client.messages.batches.create(requests=[
    {"custom_id": "invoice-00017",               # your key for matching results
     "params": {"model": MODEL, "max_tokens": 1024,
                "messages": [{"role": "user", "content": doc_17}]}},
    # ... up to 100,000 requests per batch
])

# Later, within 24 hours
for r in client.messages.batches.results(batch.id):
    if r.result.type == "succeeded":
        save(r.custom_id, r.result.message)
    else:                                        # "errored", "canceled" or "expired"
        resubmit.append(r.custom_id)             # rerun only these
""", lang="py")

# ---------------- M12 ----------------
add("m12", "m12-ci", ("end", "First principle: automation can't answer questions"),
    "<h3>In code: a CI review step</h3>\n<p>A GitHub Actions step that runs Claude Code non-interactively. <code>-p</code> means print mode, so it never waits for input; <code>--json-schema</code> makes the result machine-readable. Claude Code also reads the repository's CLAUDE.md, so project conventions apply in CI too.</p>",
    """
- name: Claude review
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    claude -p "Review this PR's diff. Report only new or unresolved issues." \\
      --output-format json \\
      --json-schema "$(cat .github/review-schema.json)" > review.json
""", lang="yaml")
add("m12", "m12-sessions", ("end", "Sessions: resume, fork, or start fresh"),
    "<h3>At the command line</h3>",
    """
claude --continue                                   # resume the most recent session here
claude --resume 4f1c…                               # resume a specific session by ID
claude --resume 4f1c… --fork-session                # same history, new branch of the work
claude                                              # fresh start; paste a short summary of findings
""", lang="sh")

# ---------------- M13 ----------------
add("m13", "m13-routing", ("end", "Human review and confidence calibration"),
    "<h3>What a routed field looks like</h3>\n<p>Each extracted value carries its confidence and its source, so a reviewer can check it quickly:</p>",
    """
{"field": "renewal_date", "value": "2027-01-31",
 "confidence": 0.62,                          # below the 0.80 threshold calibrated on labeled data
 "source": {"doc": "MSA-2291.pdf", "page": 14,
            "quote": "renews automatically on 31 January 2027"},
 "route": "human_review"}
""")
add("m13", "m13-conflict", ("end", "Provenance across synthesis"),
    "<h3>What preserved provenance looks like</h3>\n<p>Each claim keeps its sources and dates through synthesis, and a conflict is shown, not averaged away:</p>",
    """
{"claim": "Share of hospitals using AI triage",
 "values": [
   {"value": "38%", "source": "HIMSS survey", "url": "https://…", "date": "2025-09"},
   {"value": "52%", "source": "KLAS report",  "url": "https://…", "date": "2025-11"}
 ],
 "status": "conflict"}                        # report both, with attribution
""")


def main():
    done = 0
    for f, marker, where, snippet in EXAMPLES:
        p = os.path.join(ROOT, f + ".js")
        src = open(p, encoding="utf-8").read()
        if f"<!-- ex:{marker} -->" in src:
            continue
        kind, text = where
        if kind == "end":
            i = step_end(src, text)
        elif kind == "before":
            i = src.index(text)
        else:
            j = src.index(text) + len(text)
            # After a marker, skip past the rest of that example (to the end of its </pre> and outro paragraph).
            if text.startswith("<!-- ex:"):
                j = src.index("</code></pre>", j) + len("</code></pre>")
                if src.startswith("\n<p>", j) and "<!-- ex:" not in src[j:src.find("</p>", j)]:
                    j = src.index("</p>", j) + len("</p>")
            i = j
        src = src[:i] + snippet + src[i:]
        open(p, "w", encoding="utf-8").write(src)
        done += 1
    print(f"Added {done} examples.")


main()
