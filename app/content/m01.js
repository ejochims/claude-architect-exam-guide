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
<p class="lede">Every call to Claude is a pure function. Input goes in (system prompt, message history, tool definitions) and output comes back (content blocks plus a <code>stop_reason</code>). Nothing carries over between calls.</p>
<div data-embed="statelessDiagram"></div>
<p>Two consequences follow, and much of the exam builds on them:</p>
<ul>
  <li><strong>Your application is the memory.</strong> If the assistant forgets something said three turns ago in a short chat, the most likely cause is that your app didn't send those turns. Look there before blaming the context window or reaching for a “memory feature.”</li>
  <li><strong>Your application is the clock.</strong> The model can't execute a tool. It can only <em>ask</em> for one. Your code runs the tool, writes the result into history, and calls the model again. That repetition is the agentic loop.</li>
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
        model=MODEL, system=SYSTEM, tools=TOOLS, messages=messages)
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
            { t: "Instruct Claude to end every finished task with the exact token <code>TASK_COMPLETE</code> and match on that instead.", trap: "T1", why: "This still parses generated text. A more distinctive phrase is less likely to collide, but it's still probabilistic." },
            { t: "Continue while <code>stop_reason</code> is <code>\"tool_use\"</code> and finish when it is <code>\"end_turn\"</code>.", ok: true, why: "<code>stop_reason</code> is the API's authoritative signal of whether Claude wants tools run or has finished its turn." },
            { t: "Cap the loop at 8 iterations so runs always terminate.", why: "A cap is a fine safety net but the wrong termination logic. It still stops this run halfway if the task needs 9 steps." },
            { t: "Stop when a response contains no text blocks.", why: "Text presence says nothing about completion. Responses often pair narration with a tool call." }
          ]
        },
        {
          id: "q01-2", ts: "1.1",
          stem: "A developer's loop executes requested tools correctly, but each iteration rebuilds <code>messages</code> from just the original user question. Claude keeps requesting the same <code>search_kb</code> call over and over. Most likely cause?",
          options: [
            { t: "The tool results never reach the conversation history, so Claude never sees that the search already ran.", ok: true, why: "The model only knows what's in the request. Without the assistant <code>tool_use</code> turn and the user <code>tool_result</code> turn, each call looks like the first." },
            { t: "<code>search_kb</code>'s description doesn't say it should be called only once per question, so Claude keeps calling it.", trap: "T7", why: "The description is fine. Claude is reacting rationally to a history that never shows the result." },
            { t: "Temperature is set too high, which pushes the model into repetitive tool-calling behavior.", why: "Sampling settings don't explain a deterministic repeat. The missing history does." },
            { t: "The system prompt needs a rule forbidding Claude from calling the same tool twice in one task.", trap: "T1", why: "This patches a symptom with a prompt rule, and it would block legitimate repeat searches too." }
          ]
        },
        {
          id: "q01-3", ts: "5.1", scenario: 1,
          stem: "In a 6-turn support chat, the assistant asks again for the order number the customer gave in turn 2. Logs show each API request contains the system prompt and the latest user message. What should you change?",
          options: [
            { t: "Enable the API's persistent memory setting for the session.", trap: "T8", why: "No such setting exists. The Messages API is stateless; history is the application's job." },
            { t: "Move to a model with a larger context window so earlier details aren't dropped.", trap: "T3", why: "Six turns fit easily. The window was never the limit, because the earlier turns weren't sent." },
            { t: "Send the full conversation history (or a managed form of it) on every request.", ok: true, why: "Claude only sees what the request contains. Coherence across turns requires the prior turns." },
            { t: "Add “remember the customer's details” to the system prompt.", trap: "T9", why: "The model can't remember what it was never shown." }
          ]
        },
        {
          id: "q01-4", ts: "1.1",
          stem: "A response returns with <code>stop_reason: \"max_tokens\"</code> partway through a long answer. Your loop treats anything that isn't <code>\"tool_use\"</code> as finished and shows the text to the user. What's the problem?",
          options: [
            { t: "Nothing is wrong. Any stop_reason other than <code>tool_use</code> means Claude has finished, so showing the text is correct.", why: "<code>max_tokens</code> means the output was truncated by your limit, not that Claude finished." },
            { t: "The user sees a truncated answer as if it were complete. Handle <code>max_tokens</code> explicitly, e.g. raise the limit or continue the response.", ok: true, why: "Branch on each <code>stop_reason</code> deliberately: <code>end_turn</code> is the completion signal, and <code>max_tokens</code> is a cutoff." },
            { t: "Automatically retry the identical request until a response comes back with <code>end_turn</code>.", trap: "T6", why: "The same request with the same limit truncates again. Blind retry wastes calls." },
            { t: "Send long answers through the Message Batches API instead, which has no per-request token limit.", trap: "T8", why: "Batch requests have the same per-request limits, and batch is about cost and latency, not length." }
          ]
        },
        {
          id: "q01-5", ts: "1.1", scenario: 1,
          stem: "A retailer's support agent receives requests that mix returns, billing questions and address changes in one message. An architect proposes hard-coding a decision tree of tool sequences per request type. What's the better design?",
          options: [
            { t: "Keep the decision tree, and add branches for each combination of request types as they appear in production logs.", why: "Combinations multiply quickly. A fixed tree keeps failing on mixes nobody anticipated." },
            { t: "Let Claude choose the next tool from context in an agentic loop, and enforce only the must-happen steps (such as identity verification) in code.", ok: true, why: "Model-driven selection handles open-ended mixes. Programmatic gates make sure the few hard rules can't be skipped." },
            { t: "Set <code>tool_choice: \"any\"</code> on every turn so Claude is always forced to act through a tool instead of guessing.", why: "This forces a tool call even when Claude should answer or ask a question, and it doesn't address ordering." },
            { t: "Route each message through a separate classifier model that picks the right tool sequence before Claude starts.", trap: "T2", why: "Extra infrastructure that recreates the rigid-tree problem one layer up." }
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
