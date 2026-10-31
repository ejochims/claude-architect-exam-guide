window.LESSONS.m03 = {
  cards: [
    { f: "Prompt vs code: the decision rule?", b: "If one miss has financial, legal, safety or irreversible consequences, enforce it in code. Otherwise guide it with the prompt." },
    { f: "Prerequisite gate?", b: "Code that blocks a downstream tool (process_refund) until an upstream step (get_customer verified) has succeeded." },
    { f: "Tool-call interception hook?", b: "e.g. PreToolUse: inspect outgoing calls and deny or redirect policy violations (refund > $500 → escalate_to_human)." },
    { f: "PostToolUse hook use case?", b: "Normalize tool results (Unix epoch, ISO 8601, status codes) before the model processes them." },
    { f: "What goes into a human handoff?", b: "Customer ID, verification status, root cause, amounts, actions taken and recommended action. The human lacks the transcript." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: probability × volume",
      html: `
<p class="lede">A prompt changes the <em>probability</em> of a behavior. Code changes whether it's <em>possible</em>. The exam tests this distinction often, across Domains 1 and 4.</p>
<p>Suppose a well-written instruction is followed 99.5% of the time. That's excellent for tone, phrasing, or deciding when to offer a coupon. Now apply it to “never refund more than $500 without a manager” across 200,000 conversations a year: <strong>about 1,000 unauthorized refunds</strong>. More emphasis, capital letters or few-shot examples can raise 99.5%, but never to 100%.</p>
<div class="callout key"><div class="callout-label">Decision rule</div><p>If one miss has financial, legal, safety or irreversible consequences, enforce it in code: a hook, a prerequisite gate, or logic inside the tool. If a miss just makes a reply less good, guide it with the prompt.</p></div>
<p>Next, watch the arithmetic play out.</p>`
    },
    {
      kind: "widget",
      title: "Run 1,000 conversations",
      intro: "Each dot is a conversation where a customer asks for a refund above the $500 limit. Switch between prompt-only enforcement and a hook, then run the simulation.",
      widget: "complianceSim"
    },
    {
      kind: "read",
      title: "The three enforcement tools",
      html: `
<p class="lede">The blueprint names three programmatic mechanisms. Know what each one intercepts.</p>
<div class="callout key"><div class="callout-label">Why it exists</div><ul style="margin:0;padding-left:18px"><li><strong>Problem before.</strong> rules written in a prompt are followed most of the time; at production volume, “most” still means many violations.</li><li><strong>What a hook is.</strong> your code, registered with the agent harness, that runs at a fixed point in the loop (before a tool call, after a tool result, when a prompt is submitted) and can allow, block or modify what happens.</li><li><strong>Why this design.</strong> it moves guarantees out of the model's probabilistic judgment and into deterministic code, while leaving judgment calls to the model.</li><li><strong>Use it when.</strong> a rule must hold every time: money, identity, compliance, irreversible actions. For tone or preferences, a prompt is the proportionate tool.</li></ul></div>
<div class="mech">
  <div><span class="tag">Gate</span><h4>Prerequisite gates</h4><p>Block a downstream tool until an upstream step has <em>actually</em> succeeded. For example, <code>process_refund</code> is refused until <code>get_customer</code> has returned a verified customer ID in this session. This guarantees <strong>ordering</strong>.</p></div>
  <div><span class="tag">Pre</span><h4>Tool-call interception</h4><p>A hook such as <code>PreToolUse</code> sees each outgoing call and can allow it, deny it, or redirect it. For example, it blocks <code>process_refund</code> above $500 and tells Claude to use <code>escalate_to_human</code>. This guarantees <strong>policy</strong>.</p></div>
  <div><span class="tag">Post</span><h4>Result normalization</h4><p>A <code>PostToolUse</code> hook transforms tool results <em>before</em> the model reads them, e.g. converting Unix epochs, ISO 8601 and status codes from three backends into one format. This guarantees <strong>consistency</strong>.</p></div>
</div>
<p class="small">Python, Claude Agent SDK (abridged):</p>
<pre class="code"><code><span class="k">async def</span> refund_limit(input_data, tool_use_id, context):
    amount = input_data[<span class="s">"tool_input"</span>].get(<span class="s">"amount"</span>, 0)
    <span class="k">if</span> amount > 500:
        <span class="k">return</span> {<span class="s">"hookSpecificOutput"</span>: {
            <span class="s">"hookEventName"</span>: <span class="s">"PreToolUse"</span>,
            <span class="s">"permissionDecision"</span>: <span class="s">"deny"</span>,
            <span class="s">"permissionDecisionReason"</span>:
                <span class="s">"Refunds over $500 need approval. Use escalate_to_human."</span>}}
    <span class="k">return</span> {}

options = ClaudeAgentOptions(hooks={
    <span class="s">"PreToolUse"</span>: [HookMatcher(matcher=<span class="s">"mcp__billing__process_refund"</span>, hooks=[refund_limit])]  <span class="c"># full tool name</span>
})</code></pre>
<p>Notice the deny reason <em>redirects</em> Claude toward the right workflow instead of simply failing. A good gate stops the forbidden path and points to the allowed one.</p>
<!-- panel:m03-mechanisms -->
<h3>Where each mechanism lives</h3>
<div class="table-wrap"><table><thead><tr><th>Mechanism</th><th>Where it's coded</th><th>What it does</th><th>Use when</th></tr></thead><tbody><tr><td>Prerequisite gate</td><td>Your tool code or loop, checking session state</td><td>Refuses a call until an earlier step succeeded, and says what to do first</td><td>Steps must happen in order (verify, then refund)</td></tr><tr><td><code>PreToolUse</code> hook: deny</td><td>A hook that runs before the call</td><td>Stops the call, with a reason the agent can act on</td><td>An action must never happen (over a limit, a protected branch)</td></tr><tr><td><code>PreToolUse</code> hook: rewrite input</td><td>The same hook, returning <code>updatedInput</code></td><td>Changes the call's input, for example adding a required field</td><td>Every call needs a fixed field or format</td></tr><tr><td><code>PostToolUse</code> hook</td><td>A hook that runs after the call</td><td>Changes the result before the model reasons over it</td><td>Results arrive in mixed formats or contain sensitive data</td></tr><tr><td>Prompt instruction</td><td>System prompt or CLAUDE.md</td><td>Asks; works most of the time</td><td>Soft preferences where an occasional miss is cheap</td></tr></tbody></table></div>

<!-- panel:m03-tool-names -->
<div class="callout key"><div class="callout-label">Tool names in hooks</div><ul style="margin:0;padding-left:18px"><li><strong>Built-in tools.</strong> use plain names, such as <code>Bash</code> or <code>Edit</code>.</li><li><strong>Your own tools.</strong> in the Agent SDK, custom tools are served through an MCP server, so their names are <code>mcp__&lt;server&gt;__&lt;tool&gt;</code>. A hook's matcher must use that full name, or a pattern that matches it.</li></ul></div>
`
    },
    {
      kind: "widget",
      title: "Watch a hook decide",
      intro: "Drag the refund amount and pick whether identity is verified. The gate and hook run before the tool does.",
      widget: "hookPlayground"
    },
    {
      kind: "widget",
      title: "Prompt or code?",
      intro: "Sort each requirement. Ask one question: what happens when the model gets it wrong once?",
      widget: "sorter",
      config: {
        cats: [{ id: "prompt", label: "Prompt" }, { id: "code", label: "Code" }],
        items: [
          ["Refunds over $500 require a manager's approval.", "code", "Financial limit. Enforce it with a tool-call hook or inside the tool itself."],
          ["Keep replies warm and under about 120 words.", "prompt", "Style. An occasional long reply costs little."],
          ["Verify identity before changing the email on an account.", "code", "Account takeover risk. A prerequisite gate blocks update_email until verification succeeds."],
          ["Ask one clarifying question when a request is ambiguous.", "prompt", "Judgment about language. Prompts and examples are the right tool."],
          ["Never show a full card number in a reply.", "code", "Compliance. Mask it in the tool result (PostToolUse) so the model never has it to repeat."],
          ["Suggest the loyalty program to repeat customers when relevant.", "prompt", "A missed upsell is a small cost. Guidance is enough."],
          ["Block DROP TABLE and rm -rf in the agent's shell tool.", "code", "Irreversible. A PreToolUse hook denies matching commands every time."],
          ["Map three backends' status codes to one enum before the agent reads them.", "code", "Mechanical transformation. PostToolUse normalization is deterministic and free."]
        ]
      }
    },
    {
      kind: "read",
      title: "Handoffs and multi-concern requests",
      html: `
<p class="lede">Enforcement often ends in escalation, and the exam cares about what the human receives.</p>
<p>The human agent usually <strong>doesn't have the conversation transcript</strong>. A handoff that says “Customer escalated: refund issue” forces them to start over. Compile a structured summary instead:</p>
<pre class="code"><code>{
  <span class="s">"customer_id"</span>: <span class="s">"C-20931"</span>,
  <span class="s">"identity_verified"</span>: <span class="k">true</span>,
  <span class="s">"issue"</span>: <span class="s">"refund above agent limit"</span>,
  <span class="s">"root_cause"</span>: <span class="s">"duplicate charge on invoice INV-7712"</span>,
  <span class="s">"amount"</span>: 742.18,
  <span class="s">"actions_taken"</span>: [<span class="s">"verified identity"</span>, <span class="s">"confirmed duplicate in billing"</span>],
  <span class="s">"recommended_action"</span>: <span class="s">"approve refund of 742.18 to original card"</span>
}</code></pre>
<h3>Several problems in one message</h3>
<p>“I was double-charged <em>and</em> my replacement never shipped.” Split the request into distinct items. Investigate each one (in parallel where they're independent), using the shared customer context, then give a single unified answer. Don't make the customer open a second ticket, and don't silently handle only the bigger issue.</p>
<!-- panel:m03-statuses -->
<div class="callout key"><div class="callout-label">Three results that sound alike</div><ul style="margin:0;padding-left:18px"><li><strong>Blocked, with a reason.</strong> the call was refused and the agent can fix it itself: “identity not verified; call verify_identity first.”</li><li><strong>Pending.</strong> the action was accepted but is waiting on someone, such as a manager's approval. Return an explicit pending status so the agent tells the customer it isn't done yet, instead of reporting a generic success.</li><li><strong>Structured handoff.</strong> the work passes to a person. Include the facts, what was tried and a suggested next step, so the person doesn't start from scratch.</li></ul></div>
`
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q03-1", ts: "1.5", scenario: 1,
          stem: "An airline-rebooking agent may only cancel non-refundable fares with a supervisor override code. Audit logs show about 2% of such cancellations happen without one. What change is most reliable?",
          options: [
            { t: "Add a required <code>override_code</code> string to <code>cancel_booking</code>'s <code>input_schema</code>, so Claude can't call it without supplying one.", why: "A required field makes the model fill it, possibly with a guess. It doesn't check that the code is valid." },
            { t: "Add few-shot examples where the agent asks for the override code before cancelling a non-refundable fare.", trap: "T1", why: "Examples lower the miss rate but can't guarantee it, and a 2% miss on a financial rule is too many." },
            { t: "A hook that denies <code>cancel_booking</code> for non-refundable fares without a valid override, and says to escalate.", ok: true, why: "Code-level interception enforces the rule every time and gives the agent a recovery path." },
            { t: "Log every non-refundable cancellation to an audit table and have supervisors review each one within 24 hours.", trap: "T2", why: "Review detects violations after the money has moved. It doesn't prevent them." }
          ]
        },
        {
          id: "q03-2", ts: "1.5", scenario: 1,
          stem: "Three MCP tools return dates as a Unix epoch, ISO 8601, and <code>MM/DD/YY</code>. The agent sometimes puts shipment events in the wrong order. What's the best fix?",
          options: [
            { t: "Add a <code>PostToolUse</code> hook that converts every date to ISO 8601 before the model reads the result.", ok: true, why: "Deterministic normalization removes the inconsistency before the model has to reason about it." },
            { t: "Explain the three formats in the system prompt, with a worked conversion example for each one.", trap: "T1", why: "The model still converts on every read, and a probabilistic conversion occasionally goes wrong." },
            { t: "Add a structured <code>date_format</code> field to each tool's output so Claude knows how to interpret every value it receives.", why: "Labels the problem but still leaves the conversion to the model each time." },
            { t: "Switch to a larger model, which handles mixed date formats more reliably than the current one.", trap: "T3", why: "A bigger model still converts probabilistically. Normalize the data instead." }
          ]
        },
        {
          id: "q03-3", ts: "1.4", scenario: 1,
          stem: "Escalated cases reach human agents as “Customer escalated: billing issue.” Humans spend about 8 minutes re-asking questions. They can't see the AI conversation. What's the best change?",
          options: [
            { t: "Attach the full transcript, including every tool call and result, so the human sees everything the agent saw.", why: "Better than nothing, but reading a whole transcript still costs minutes. Put the key facts up front." },
            { t: "A structured handoff summary listing the customer and case facts, what's verified, actions taken and the recommended next step.", ok: true, why: "A structured summary gives the human what they need without re-asking or reading the whole conversation." },
            { t: "Escalate earlier in each conversation, before much context builds up, so less is lost when the case changes hands.", why: "Escalating sooner doesn't transfer the context, and it lowers the agent's resolution rate." },
            { t: "Send the human the agent's last message to the customer together with a standard escalation reason code.", why: "Still missing identity, verification status, amounts and what's already been tried." }
          ]
        },
        {
          id: "q03-4", ts: "1.4",
          stem: "Which requirement is fine to leave as prompt guidance rather than enforce in code?",
          options: [
            { t: "Goodwill credit stays under $250 per customer in any rolling 12-month period.", why: "A financial limit needs a guarantee, so enforce it in code." },
            { t: "Identity is confirmed before a shipping address is revealed.", why: "A privacy rule needs a guarantee, so enforce it in code." },
            { t: "Gift wrap is offered when the customer says the order is a present.", ok: true, why: "Missing it occasionally costs little, so prompt guidance is proportionate." },
            { t: "<code>close_account</code> runs only with a confirmation token from the preview step.", why: "An irreversible action needs a guarantee, so enforce it in code." }
          ]
        },
        {
          id: "q03-5", ts: "1.4", scenario: 1,
          stem: "A customer writes: “I was charged twice for March <em>and</em> the replacement headphones you promised never shipped.” How should the agent proceed?",
          options: [
            { t: "Resolve the double charge now, then open a linked follow-up ticket for the shipment, so each issue has a clear owner.", why: "The agent can investigate both now with the same context. Splitting tickets fragments the resolution." },
            { t: "Escalate to a human, since the request spans both the billing and the fulfillment systems.", why: "The agent has tools for both. Several issues in one message isn't an escalation trigger." },
            { t: "Treat them as two items, investigate both with the shared context, then send one combined reply.", ok: true, why: "Decompose multi-concern requests, investigate each using shared context, and synthesize one answer." },
            { t: "Work through the issues in the order the customer raised them, sending a separate reply as each one is resolved.", why: "Sequential replies fragment the experience. Investigate both, then answer once." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Prompts change probability; code changes possibility.",
        "Any nonzero miss rate × volume = guaranteed violations. Financial, legal, safety and irreversible rules go in code.",
        "Gates enforce ordering; PreToolUse-style interception enforces policy; PostToolUse normalizes results.",
        "A good block redirects (“use escalate_to_human”) rather than just failing.",
        "Handoffs to humans are structured: IDs, root cause, amounts, actions taken, recommendation.",
        "Multi-concern messages: decompose → investigate each → one unified answer."
      ]
    }
  ]
};
