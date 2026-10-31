window.LESSONS.l01 = {
 "cards": [
  {
   "f": "In an escalation agent, where does “refunds over $500 need approval” live?",
   "b": "In code: the refund tool (or a hook) returns an escalation-required status above the limit. The prompt can't guarantee it."
  },
  {
   "f": "What should a tool return when a precondition isn't met?",
   "b": "A structured error: what failed, whether it's retryable, and what to do next (e.g. verify the customer first), sent back as a tool_result with is_error."
  },
  {
   "f": "Three escalation triggers to encode as criteria?",
   "b": "An explicit request for a human, a policy gap or exception, and no meaningful progress. Not sentiment, not raw self-rated confidence."
  }
 ],
 "steps": [
  {
   "kind": "read",
   "title": "The brief",
   "html": "<p class=\"lede\">Build a customer-support agent that looks up customers and orders, issues refunds within policy, and escalates to a person when it should. This lab pulls together Modules 1–4 and 13.</p><svg viewBox=\"0 0 640 110\" role=\"img\" aria-label=\"Customer message goes to the agent loop, which calls your tools; some cases go to a human\" style=\"width:100%;height:auto;margin:8px 0 14px\"><rect x=\"10\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"76\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Customer</text><text x=\"76\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">message</text><path d=\"M145 55 H161 M155 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"165\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--accent-soft);stroke:var(--accent)\"/><text x=\"232\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Agent loop</text><text x=\"232\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">Claude + tools</text><path d=\"M300 55 H316 M310 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"320\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"386\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Your tools</text><text x=\"386\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">code gates</text><path d=\"M455 55 H471 M465 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"475\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"542\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Human</text><text x=\"542\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">on escalation</text></svg><h3>Requirements</h3><ul><li>Four tools: <code>get_customer</code>, <code>lookup_order</code>, <code>process_refund</code>, <code>escalate_to_human</code>.</li><li>No refund before the customer is identified.</li><li>Refunds over $500 go to a person.</li><li>Errors come back structured, so the agent can recover.</li><li>Escalation follows explicit criteria, and the handoff is a structured summary.</li></ul><h3>Done when</h3><p>A refund over $500 or for an unverified customer is impossible, not just unlikely. A timeout and a policy refusal produce different agent behavior. A customer who asks for a person gets one immediately.</p>"
  },
  {
   "kind": "widget",
   "title": "Design decisions",
   "intro": "Decide where each requirement lives.",
   "widget": "sorter",
   "config": {
    "cats": [
     {
      "id": "code",
      "label": "Code gate"
     },
     {
      "id": "err",
      "label": "Structured error"
     },
     {
      "id": "prompt",
      "label": "Prompt and examples"
     },
     {
      "id": "esc",
      "label": "Escalation trigger"
     }
    ],
    "items": [
     [
      "No refund until get_customer has identified the customer.",
      "code",
      "A prerequisite must hold every time, so the refund tool checks it."
     ],
     [
      "Refunds above $500 need a manager.",
      "code",
      "A financial limit. The tool returns escalation-required instead of refunding."
     ],
     [
      "The order service timed out.",
      "err",
      "Transient and retryable: say so, so the agent can retry or explain."
     ],
     [
      "Item is final-sale, so no return.",
      "err",
      "A business-rule refusal: not retryable, with a customer-friendly reason."
     ],
     [
      "When a request is ambiguous between a return and an exchange, ask which.",
      "prompt",
      "Judgment. Criteria plus a couple of few-shot examples guide it."
     ],
     [
      "The customer writes “let me talk to a real person.”",
      "esc",
      "An explicit request is honored immediately."
     ],
     [
      "Policy says nothing about reimbursing a taxi fare.",
      "esc",
      "A policy gap: escalate rather than improvise."
     ]
    ]
   }
  },
  {
   "kind": "read",
   "title": "Build it: the loop and the gates",
   "html": "<p class=\"lede\">The whole agent is a loop plus tools that enforce the rules themselves.</p><pre class=\"code\"><code>import json, anthropic\n\nclient = anthropic.Anthropic()          # reads ANTHROPIC_API_KEY\nstate = {&quot;customer_id&quot;: None}           # what your code knows, not what Claude says\n\ndef run_tool(name, args):\n    if name == &quot;get_customer&quot;:\n        state[&quot;customer_id&quot;] = &quot;C-1042&quot;   # look the customer up for real here\n        return {&quot;customer_id&quot;: &quot;C-1042&quot;, &quot;name&quot;: &quot;Ada&quot;}\n    if name == &quot;process_refund&quot;:\n        if not state[&quot;customer_id&quot;]:\n            return {&quot;isError&quot;: True, &quot;category&quot;: &quot;precondition&quot;, &quot;retryable&quot;: False,\n                    &quot;message&quot;: &quot;Identify the customer with get_customer first.&quot;}\n        if args[&quot;amount&quot;] &gt; 500:\n            return {&quot;status&quot;: &quot;escalation_required&quot;,\n                    &quot;message&quot;: &quot;Refunds over $500 need a manager. Call escalate_to_human.&quot;}\n        return {&quot;status&quot;: &quot;refunded&quot;, &quot;amount&quot;: args[&quot;amount&quot;]}\n    ...\n\ndef run(messages):\n    while True:\n        resp = client.messages.create(model=&quot;claude-sonnet-5-5&quot;, max_tokens=1024,\n                                      system=SYSTEM, tools=TOOLS, messages=messages)\n        messages.append({&quot;role&quot;: &quot;assistant&quot;, &quot;content&quot;: resp.content})\n        if resp.stop_reason != &quot;tool_use&quot;:       # end_turn (or max_tokens: handle it)\n            return resp\n        results = []\n        for block in resp.content:\n            if block.type == &quot;tool_use&quot;:\n                out = run_tool(block.name, block.input)\n                results.append({&quot;type&quot;: &quot;tool_result&quot;, &quot;tool_use_id&quot;: block.id,\n                                &quot;content&quot;: json.dumps(out), &quot;is_error&quot;: bool(out.get(&quot;isError&quot;))})\n        messages.append({&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: results})</code></pre><ul><li><strong>The gates are in <code>run_tool</code></strong>, so they hold no matter what Claude decides.</li><li><strong>Errors carry a category and next step</strong>, and go back as <code>tool_result</code> blocks so the loop continues.</li><li><strong><code>SYSTEM</code></strong> holds the escalation criteria with two or three examples of escalate-versus-resolve. <strong><code>TOOLS</code></strong> holds the four definitions, each with a clear description.</li></ul><div class=\"callout today\"><div class=\"callout-label\">Try it for real (optional)</div><p>Run the sketch with your own API key and a fake data layer, then try to break it: ask for a $900 refund before giving a name. Model IDs and SDK details change, so check the <a href=\"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview\" target=\"_blank\" rel=\"noopener\">tool use docs</a>.</p></div>"
  },
  {
   "kind": "widget",
   "title": "Debug it",
   "intro": "Each symptom comes from one design flaw. Pick the fix.",
   "widget": "sorter",
   "config": {
    "cats": [
     {
      "id": "loop",
      "label": "Loop control"
     },
     {
      "id": "desc",
      "label": "Tool description"
     },
     {
      "id": "err",
      "label": "Error design"
     },
     {
      "id": "esc",
      "label": "Escalation criteria"
     }
    ],
    "items": [
     [
      "Runs end after Claude's first sentence, before any lookup.",
      "loop",
      "The loop checks for text instead of stop_reason."
     ],
     [
      "The agent calls lookup_order for “I'd like a refund on my last order” but never get_customer.",
      "desc",
      "Descriptions don't say get_customer comes first or what it returns. (The code gate still blocks the refund.)"
     ],
     [
      "Customers with valid order numbers are told their number is wrong.",
      "err",
      "Every failure returns the same generic error, so a timeout looks like a bad ID."
     ],
     [
      "Angry customers with simple problems get sent to humans.",
      "esc",
      "Sentiment is acting as a trigger. Use explicit criteria with examples."
     ],
     [
      "The agent keeps retrying a refund the policy forbids.",
      "err",
      "The refusal isn't marked non-retryable with a reason."
     ]
    ]
   }
  },
  {
   "kind": "recap",
   "title": "Recap",
   "points": [
    "Guarantees live in the tools (or hooks), not the prompt.",
    "Structured errors tell the agent what failed and what to do next.",
    "Escalate on explicit request, policy gap or no progress, with a structured handoff.",
    "Drive the loop from stop_reason and send results back as tool_result blocks."
   ]
  }
 ]
};
