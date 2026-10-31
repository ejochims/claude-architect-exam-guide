# Usage: python3 -m venv /tmp/venv && /tmp/venv/bin/pip install anthropic claude-agent-sdk mcp
#        /tmp/venv/bin/python scripts/audit/check-examples.py
"""Executes the lesson's Python examples against the real libraries. The Anthropic API is mocked with httpx
(no API key here), so this checks that every call, parameter and response field the examples use exists and
behaves as the lesson says; it can't check model behavior."""
import asyncio, json, anthropic, traceback
import httpx2 as httpx

ok, fail = [], []
def check(name, fn):
    try:
        r = fn()
        if asyncio.iscoroutine(r): r = asyncio.run(r)
        ok.append(name); print("OK  ", name, "" if r is None else r)
    except Exception as e:
        fail.append(name); print("FAIL", name, type(e).__name__, str(e)[:300])

# ---------- Mocked Messages API ----------
def msg(content, stop):
    return {"id": "msg_01", "type": "message", "role": "assistant", "model": "claude-sonnet-5-5",
            "content": content, "stop_reason": stop, "stop_sequence": None,
            "usage": {"input_tokens": 10, "output_tokens": 5}}
SCRIPT, SEEN = [], []
def handler(req):
    SEEN.append(json.loads(req.content) if req.content else None)
    if req.url.path.endswith("/results"):
        lines = [{"custom_id": "invoice-00017", "result": {"type": "succeeded", "message": msg([{"type": "text", "text": "ok"}], "end_turn")}},
                 {"custom_id": "invoice-00018", "result": {"type": "errored", "error": {"type": "error", "error": {"type": "api_error", "message": "x"}}}}]
        return httpx.Response(200, text="\n".join(json.dumps(l) for l in lines))
    if "/batches" in req.url.path:
        return httpx.Response(200, json={"id": "msgbatch_01", "type": "message_batch", "processing_status": "ended",
            "request_counts": {"processing": 0, "succeeded": 1, "errored": 1, "canceled": 0, "expired": 0},
            "created_at": "2026-10-31T00:00:00Z", "expires_at": "2026-11-01T00:00:00Z", "ended_at": "2026-10-31T01:00:00Z",
            "archived_at": None, "cancel_initiated_at": None,
            "results_url": "https://api.anthropic.com/v1/messages/batches/msgbatch_01/results"})
    return httpx.Response(200, json=SCRIPT.pop(0))
client = anthropic.Anthropic(api_key="test", http_client=httpx.Client(transport=httpx.MockTransport(handler)))
MODEL, SYSTEM = "claude-sonnet-5-5", "You are a support agent."
TOOLS = [{"name": "get_order", "description": "Look up one order.", "input_schema": {"type": "object", "properties": {"order_number": {"type": "string"}}, "required": ["order_number"]}}]
TOOL_TURN = msg([{"type": "text", "text": "Let me check."}, {"type": "tool_use", "id": "toolu_01", "name": "get_order", "input": {"order_number": "A-1042"}}], "tool_use")
DONE = msg([{"type": "text", "text": "It arrives Friday."}], "end_turn")
def run_tool(b): return {"type": "tool_result", "tool_use_id": b.id, "content": "status: shipped"}

def m01_loop():
    # Module 1 loop as published (fixed: max_tokens is required).
    SCRIPT[:] = [TOOL_TURN, DONE]; messages = [{"role": "user", "content": "Where is A-1042?"}]
    while True:
        response = client.messages.create(model=MODEL, max_tokens=1024, system=SYSTEM, tools=TOOLS, messages=messages)
        messages.append({"role": "assistant", "content": response.content})
        if response.stop_reason == "tool_use":
            results = [run_tool(b) for b in response.content if b.type == "tool_use"]
            messages.append({"role": "user", "content": results}); continue
        if response.stop_reason == "end_turn": break
    assert SEEN[-1]["messages"][-1]["content"][0]["type"] == "tool_result"
    return f"{len(messages)} messages, final: {response.content[0].text!r}"
check("m01 loop (with max_tokens)", m01_loop)

def m01_without_max_tokens():
    try:
        client.messages.create(model=MODEL, system=SYSTEM, tools=TOOLS, messages=[{"role": "user", "content": "hi"}])
    except TypeError as e:
        return f"as published fails: {e}"
    raise AssertionError("expected missing max_tokens to fail")
check("m01 as published (no max_tokens) is broken", m01_without_max_tokens)

def l01_loop():
    SCRIPT[:] = [msg([{"type": "tool_use", "id": "toolu_02", "name": "process_refund", "input": {"amount": 742}}], "tool_use"), DONE]
    state = {"customer_id": None}
    def run_tool(name, args):
        if name == "process_refund":
            if not state["customer_id"]:
                return {"isError": True, "category": "precondition", "retryable": False, "message": "Identify the customer first."}
    messages = [{"role": "user", "content": "Refund me $742"}]
    while True:
        resp = client.messages.create(model=MODEL, max_tokens=1024, system=SYSTEM, tools=TOOLS, messages=messages)
        messages.append({"role": "assistant", "content": resp.content})
        if resp.stop_reason != "tool_use": return resp.stop_reason
        results = []
        for block in resp.content:
            if block.type == "tool_use":
                out = run_tool(block.name, block.input)
                results.append({"type": "tool_result", "tool_use_id": block.id, "content": json.dumps(out), "is_error": bool(out.get("isError"))})
        messages.append({"role": "user", "content": results})
        assert SEEN[-1] is not None
check("l01 lab loop", l01_loop)

def m09_retry():
    SCRIPT[:] = [msg([{"type": "tool_use", "id": "toolu_03", "name": "record_invoice", "input": {"invoice_date": "March 3rd"}}], "tool_use"), DONE]
    messages = [{"role": "user", "content": "doc"}]
    response = client.messages.create(model=MODEL, max_tokens=1024, tools=TOOLS, messages=messages)
    tool_use_block = next(b for b in response.content if b.type == "tool_use")
    data, attempts = tool_use_block.input, 0
    errors = ["invoice_date"] if data["invoice_date"] == "March 3rd" else []
    if errors and attempts < 2:
        messages += [{"role": "assistant", "content": response.content},
                     {"role": "user", "content": [{"type": "tool_result", "tool_use_id": tool_use_block.id, "is_error": True, "content": "Validation failed: ..."}]}]
    r2 = client.messages.create(model=MODEL, max_tokens=1024, tools=TOOLS, messages=messages)
    return r2.stop_reason
check("m09 validate-and-retry", m09_retry)

def m10_batches():
    batch = client.messages.batches.create(requests=[
        {"custom_id": "invoice-00017", "params": {"model": MODEL, "max_tokens": 1024, "messages": [{"role": "user", "content": "doc"}]}}])
    seen = []
    resubmit = []
    for r in client.messages.batches.results(batch.id):
        if r.result.type == "succeeded": seen.append((r.custom_id, r.result.message.content[0].text))
        else: resubmit.append(r.custom_id)
    return f"saved {seen}, resubmit {resubmit}"
check("m10 / l03 batches create + results", m10_batches)

def tool_choice_types():
    import typing, anthropic.types as at
    hints = [typing.get_type_hints(c) for c in (at.ToolChoiceAutoParam, at.ToolChoiceAnyParam, at.ToolChoiceToolParam, at.ToolChoiceNoneParam)]
    assert "name" in hints[2]
    return sorted(typing.get_args(h["type"])[0] for h in hints)
check("m02 tool_choice types", tool_choice_types)

# ---------- Agent SDK ----------
from claude_agent_sdk import ClaudeAgentOptions, AgentDefinition, HookMatcher, query
def m03_hook():
    async def refund_limit(input_data, tool_use_id, context):
        amount = input_data["tool_input"].get("amount", 0)
        if amount > 500:
            return {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny",
                    "permissionDecisionReason": "Refunds over $500 need approval. Use escalate_to_human."}}
        return {}
    ClaudeAgentOptions(hooks={"PreToolUse": [HookMatcher(matcher="mcp__billing__process_refund", hooks=[refund_limit])]})
    out = asyncio.run(refund_limit({"hook_event_name": "PreToolUse", "tool_name": "mcp__billing__process_refund", "tool_input": {"amount": 742}}, "toolu_1", {"signal": None}))
    return out["hookSpecificOutput"]["permissionDecision"]
check("m03 PreToolUse hook", m03_hook)

def m06_l04_agents():
    o = ClaudeAgentOptions(allowed_tools=["Task", "WebSearch", "WebFetch"], agents={
        "web-researcher": AgentDefinition(description="Finds sources.", prompt="Return claim, URL, date.", tools=["WebSearch", "WebFetch"])})
    return list(o.agents)
check("m06 / l04 AgentDefinition", m06_l04_agents)

def f03_query():
    import inspect
    assert "prompt" in inspect.signature(query).parameters and "options" in inspect.signature(query).parameters
    ClaudeAgentOptions(allowed_tools=["Read", "Grep", "Glob"])
check("f03 query() + options", f03_query)

# ---------- MCP (v2 SDK) ----------
async def mcp_server():
    from mcp.server.mcpserver import MCPServer
    mcp = MCPServer("docs")
    @mcp.tool()
    def search_docs(query: str) -> str:
        """Full-text search over internal engineering docs. Use for how-to and design questions."""
        return "result for " + query
    @mcp.resource("docs://catalog")
    def catalog() -> str:
        """Index of every doc: title, path and one-line summary."""
        return "index"
    tools = await mcp.list_tools(); res = await mcp.list_resources()
    return [(t.name, t.description[:30]) for t in tools], [str(r.uri) for r in res]
check("f03 / m05 MCP server (MCPServer)", mcp_server)

print(f"\n{len(ok)} passed, {len(fail)} failed: {fail}")
