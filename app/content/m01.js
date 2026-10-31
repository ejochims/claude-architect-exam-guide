window.LESSONS.m01 = {
  cards: [
    { f: "What does Claude know on a given API call?", b: "Only what's in that request: system prompt, messages and tool definitions. The API is stateless." },
    { f: "Agentic loop: when to continue, when to stop?", b: "Continue while stop_reason is \"tool_use\"; stop on \"end_turn\". \"max_tokens\" means truncated, not done." },
    { f: "What gets appended each iteration?", b: "The assistant message with its tool_use blocks, then a user message with matching tool_result blocks." },
    { f: "Three loop-termination anti-patterns?", b: "Parsing natural language (\u201cdone\u201d), iteration caps as the primary stop, and treating assistant text as completion." },
    { f: "Model-driven vs pre-configured flow?", b: "Model-driven: Claude picks the next tool from context (open-ended work). Pre-configured: code fixes the sequence. Use code only for must-happen steps." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: the model is a function",
      html: `
<p class="lede">Every call to Claude is a stateless function. Input goes in (system prompt, message history, tool definitions) and output comes back (content blocks plus a <code>stop_reason</code>). Nothing carries over between calls.</p>
<div class="callout key"><div class="callout-label">Why it exists</div><ul style="margin:0;padding-left:18px"><li><strong>Problem before.</strong> early LLM apps answered one prompt and stopped; multi-step work (look something up, then act on it) needed a person in between.</li><li><strong>What it is.</strong> a loop in your code: call Claude, run any tools it requests, append the results, and call again until it stops asking.</li><li><strong>Why this design.</strong> the model decides the next step from what it just learned, instead of you scripting every path in advance. Anthropic calls fixed, scripted paths <em>workflows</em> and self-directed loops <em>agents</em>.</li><li><strong>Use it when.</strong> the steps depend on what's found along the way. When the steps never vary, a fixed workflow (prompt chaining) is simpler and more predictable.</li></ul></div>
<div data-embed="statelessDiagram"></div>
<p>Two consequences follow, and much of the exam builds on them:</p>
<ul>
  <li><strong>Your application is the memory.</strong> If the assistant forgets something said three turns ago in a short chat, the most likely cause is that your app didn't send those turns. Look there before blaming the context window or reaching for a “memory feature.”</li>
  <li><strong>Your application is the clock.</strong> The model can't execute a client tool (the kind this course focuses on: it runs in your code). Server tools, such as Anthropic's web search, run on Anthropic's side instead. It can only <em>ask</em> for one. Your code runs the tool, writes the result into history, and calls the model again. That repetition is the agentic loop.</li>
</ul>
<div class="callout note"><div class="callout-label">Cost of statelessness</div><p>Each turn resends the whole history, so input tokens, latency and cost grow every turn. That's why context management (Module 7) exists.</p></div>`
    },
    {
      kind: "read",
      title: "The loop and its one signal",
      html: `
<p class="lede">An agent is a loop that keeps calling the model until the model says it's finished. The only reliable way to know is <code>stop_reason</code>.</p>
<pre class="code"><code><span class="k">while</span> <span class="k">True</span>:
    response = client.messages.create(
        model=MODEL, max_tokens=<span class="k">1024</span>, system=SYSTEM, tools=TOOLS, messages=messages)
    messages.append({<span class="s">"role"</span>: <span class="s">"assistant"</span>, <span class="s">"content"</span>: response.content})

    <span class="k">if</span> response.stop_reason == <span class="s">"tool_use"</span>:
        results = [run_tool(b) <span class="k">for</span> b <span class="k">in</span> response.content <span class="k">if</span> b.type == <span class="s">"tool_use"</span>]
        messages.append({<span class="s">"role"</span>: <span class="s">"user"</span>, <span class="s">"content"</span>: results})  <span class="c"># tool_result blocks</span>
        <span class="k">continue</span>

    <span class="k">if</span> response.stop_reason == <span class="s">"end_turn"</span>:
        <span class="k">break</span>                       <span class="c"># finished: present the answer</span>

    handle_other(response)          <span class="c"># e.g. "max_tokens" = truncated, not done</span></code></pre>
<div class="table-wrap"><table>
<thead><tr><th><code>stop_reason</code></th><th>Meaning</th><th>Your loop</th></tr></thead>
<tbody>
<tr><td><code>"tool_use"</code></td><td>Claude wants one or more tools run</td><td>Execute them, append <code>tool_result</code> blocks, call again</td></tr>
<tr><td><code>"end_turn"</code></td><td>Claude has finished its turn</td><td>Stop and present the response</td></tr>
<tr><td><code>"max_tokens"</code></td><td>Output was cut off at the token limit</td><td>Not finished. Handle it explicitly; don't present it as final</td></tr>
</tbody></table></div>
<p>Two details matter. Every <code>tool_result</code> carries the <code>tool_use_id</code> it answers, and the assistant message holding the <code>tool_use</code> blocks must stay in history ahead of it. Appending the results is the <em>only</em> way the model learns what happened.</p>`
    },
    {
      kind: "widget",
      title: "Run the loop yourself",
      intro: "A customer asks about a late order. At each step, inspect what was sent and what came back, then decide what your loop does next.",
      widget: "loopStepper"
    },
    {
      kind: "read",
      title: "How the exam frames it",
      html: `
<p class="lede">The exam tests whether you trust the right signal. Three termination anti-patterns show up as distractors:</p>
<div class="anti">
  <div><h4>Parsing natural language</h4><p>Stopping when the text says “done” or “task complete.” Phrases are generated, not guaranteed: “I'm done checking stock, now I'll update the order” contains “done.”</p></div>
  <div><h4>Iteration cap as the stop</h4><p>“Stop after 10 iterations.” A cap is a reasonable <em>safety backstop</em>. As the primary termination logic it cuts off long tasks and lets short broken ones spin.</p></div>
  <div><h4>Text means finished</h4><p>“If the response has text, show it and stop.” A single response can contain text <em>and</em> <code>tool_use</code> blocks (“Let me check that…” plus a call).</p></div>
</div>
<h3>Model-driven vs. pre-configured</h3>
<p>In an agentic loop, <strong>Claude decides which tool to call next</strong> based on what it has learned so far. A pre-configured decision tree hard-codes the sequence in your code. Use model-driven loops for unpredictable, mixed requests. Use code to pin down only the steps that must happen (identity checks, approval gates, which you'll build in Module 3). Don't hard-code the whole conversation.</p>
<div class="callout today"><div class="callout-label">Real world today</div><p>The Claude Agent SDK runs this loop for you, and hooks plug into it. The exam still expects you to understand the raw loop: what <code>stop_reason</code> means, and why results go back into history.</p></div>`
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q01-1", ts: "1.1", scenario: 1,
          stem: "A support agent's loop ends with <code>if \"done\" in text.lower(): break</code>. In production, some runs stop halfway after Claude writes “I'm done checking your warranty, now I'll create the RMA.” What is the right fix?",
          options: [
            { t: "Have the system prompt tell Claude to emit a sentinel such as <code>TASK_COMPLETE</code> only when every step is done, and break on that.", trap: "T1", why: "Still parsing generated text: the model can emit or omit the sentinel at the wrong time. The API already gives a structured signal." },
            { t: "Use <code>stop_reason</code>: keep looping while it's tool use, and exit when it's end of turn.", ok: true, why: "<code>stop_reason</code> is the structured signal for whether Claude wants a tool or has finished." },
            { t: "Stop after a fixed budget of tool calls, such as <code>max_iterations=12</code>, set from the 95th-percentile length of successful runs.", why: "An iteration cap is a safety net, not the stopping mechanism. Legitimate long runs get cut off." },
            { t: "Stop when a response contains no text blocks, since Claude writes text only when it's addressing the user.", why: "Claude often writes text alongside tool calls, so text presence says nothing about whether the task is finished." }
          ]
        },
        {
          id: "q01-2", ts: "1.1",
          stem: "A developer's loop executes requested tools correctly, but each iteration rebuilds <code>messages</code> from just the original user question. Claude keeps requesting the same <code>search_kb</code> call over and over. Most likely cause?",
          options: [
            { t: "Earlier <code>tool_use</code> and <code>tool_result</code> blocks are dropped from each request, so Claude never sees that the search already ran.", ok: true, why: "Tool results must be appended to the history between iterations; without them Claude repeats the call." },
            { t: "<code>search_kb</code> returns no stable <code>query_id</code>, so Claude can't recognize that this search duplicates one it already made.", trap: "T7", why: "IDs wouldn't help: the earlier results aren't in the conversation at all." },
            { t: "Sampling temperature is too high, so tool selection is too random for Claude to settle on an answer.", why: "Randomness doesn't produce the same call every time. Claude is consistently missing information." },
            { t: "The system prompt lacks a rule against repeating a tool call that Claude has already made in this task.", trap: "T1", why: "Claude can't avoid repeating a call it can't see. The history is the problem." }
          ]
        },
        {
          id: "q01-3", ts: "5.1", scenario: 1,
          stem: "In a 6-turn support chat, the assistant asks again for the order number the customer gave in turn 2. Logs show each API request contains the system prompt and the latest user message. What should you change?",
          options: [
            { t: "Enable the API's persistent session memory, keyed on the customer's <code>conversation_id</code>.", trap: "T8", why: "The Messages API is stateless; there's no server-side memory to enable." },
            { t: "Move to a model with a 1M-token context window so earlier details aren't dropped.", trap: "T3", why: "Window size is irrelevant: earlier turns are never sent at all." },
            { t: "Send the full conversation history (or a managed version of it) on every request.", ok: true, why: "The model is stateless. History must be in each request." },
            { t: "Add “Remember the customer's details from earlier turns” to the system prompt.", trap: "T9", why: "It can't remember what isn't in the request." }
          ]
        },
        {
          id: "q01-4", ts: "1.1",
          stem: "A response returns with <code>stop_reason: \"max_tokens\"</code> partway through a long answer. Your loop treats anything that isn't <code>\"tool_use\"</code> as finished and shows the text to the user. What's the problem?",
          options: [
            { t: "Nothing: <code>max_tokens</code> is a soft limit, and the text returned is Claude's complete answer at that length.", why: "<code>max_tokens</code> means the output was cut off mid-answer. It isn't a finished response." },
            { t: "Truncation is shown as a complete answer; handle <code>max_tokens</code> explicitly, for example by continuing the response or raising the limit.", ok: true, why: "Only <code>end_turn</code> means finished. Truncation needs its own handling." },
            { t: "Retry the identical request automatically until a response comes back with <code>end_turn</code>.", trap: "T6", why: "The same request hits the same limit again. Blind retries cost money and don't fix the cause." },
            { t: "Treat <code>max_tokens</code> like <code>tool_use</code>: loop again with the same <code>messages</code> array so Claude carries on from where it stopped.", why: "Resending the same messages restarts the answer. To continue, you'd append the partial reply first." }
          ]
        },
        {
          id: "q01-5", ts: "1.1", scenario: 1,
          stem: "A retailer's support agent receives requests that mix returns, billing questions and address changes in one message. An architect proposes hard-coding a decision tree of tool sequences per request type. What's the better design?",
          options: [
            { t: "Keep the tree, auto-generating a branch from production logs for each combination of request types (return + billing, billing + address…).", why: "Combinations multiply, and fixed sequences can't adapt to what each message actually needs." },
            { t: "Let Claude choose each next tool from context in a loop, and enforce only must-happen steps in code.", ok: true, why: "Model-driven tool selection handles mixed requests; code guarantees the few steps that must always happen." },
            { t: "Classify each message with a small model first, then enforce the fixed tool sequence for its predicted type.", trap: "T2", why: "Still a fixed sequence per type, and a mixed message doesn't fit one label." },
            { t: "Put the tree in the system prompt as numbered steps (“1. If return: call <code>lookup_order</code>, then <code>create_rma</code>”) for Claude to follow.", trap: "T1", why: "Turns model reasoning back into a brittle script, and still gives no guarantee for the steps that must happen." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Each API call is stateless: the request is everything the model knows.",
        "Your app is the memory (send history) and the clock (run the loop).",
        "Continue on stop_reason \"tool_use\"; finish on \"end_turn\"; treat \"max_tokens\" as truncated.",
        "Append the assistant tool_use turn and the user tool_result turn every iteration.",
        "Anti-patterns: parsing “done” text, iteration caps as the stop, text-means-finished.",
        "Model-driven selection for open-ended work; code only for the must-happen steps."
      ]
    }
  ]
};
