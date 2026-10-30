window.LESSONS.m03 = {
  steps: [
    {
      kind: "read",
      title: "First principle: probability × volume",
      html: `
<p class="lede">A prompt changes the <em>probability</em> of a behavior. Code changes whether it's <em>possible</em>. The exam tests this distinction more than anything else.</p>
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
    <span class="s">"PreToolUse"</span>: [HookMatcher(matcher=<span class="s">"process_refund"</span>, hooks=[refund_limit])]
})</code></pre>
<p>Notice the deny reason <em>redirects</em> Claude toward the right workflow instead of simply failing. A good gate stops the forbidden path and points to the allowed one.</p>`
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
      widget: "promptOrCode"
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
<p>“I was double-charged <em>and</em> my replacement never shipped.” Split the request into distinct items. Investigate each one (in parallel where they're independent), using the shared customer context, then give a single unified answer. Don't make the customer open a second ticket, and don't silently handle only the bigger issue.</p>`
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q03-1", ts: "1.5", scenario: 1,
          stem: "An airline-rebooking agent may only cancel non-refundable fares with a supervisor override code. Audit logs show about 2% of such cancellations happen without one. What change is most reliable?",
          options: [
            { t: "Rewrite the system prompt to state the override requirement first, in bold, with consequences.", trap: "T1", why: "Better wording lowers the rate but can't make it zero, and the stakes here are financial." },
            { t: "Add few-shot examples where the agent asks for the override code before cancelling.", trap: "T1", why: "Examples are still probabilistic guidance. Good for judgment calls, not for a rule that must hold." },
            { t: "Intercept <code>cancel_booking</code> calls with a hook that denies non-refundable cancellations lacking a valid override and directs the agent to escalate.", ok: true, why: "A tool-call interception hook makes the violation impossible and redirects to the allowed path." },
            { t: "Train a classifier to flag risky cancellations for weekly audit.", trap: "T2", why: "This detects violations after the fact instead of preventing them, and it adds infrastructure." }
          ]
        },
        {
          id: "q03-2", ts: "1.5", scenario: 1,
          stem: "Three MCP tools return dates as a Unix epoch, ISO 8601, and <code>MM/DD/YY</code>. The agent sometimes puts shipment events in the wrong order. What's the best fix?",
          options: [
            { t: "Add a <code>PostToolUse</code> hook that converts every date to ISO 8601 before the model reads the result.", ok: true, why: "Normalize deterministically before the model processes results. It's mechanical work, so code it." },
            { t: "Explain all three formats in the system prompt and ask Claude to convert carefully.", trap: "T1", why: "This asks the model to do mechanical conversion reliably, every time, in its head." },
            { t: "Merge the three tools into one <code>get_events</code> tool.", trap: "T5", why: "Merging doesn't normalize anything. The formats come from the backends." },
            { t: "Ask Claude to report its confidence in each date and re-query low-confidence ones.", trap: "T4", why: "Self-rated confidence doesn't fix a format mismatch." }
          ]
        },
        {
          id: "q03-3", ts: "1.4", scenario: 1,
          stem: "Escalated cases reach human agents as “Customer escalated: billing issue.” Humans spend about 8 minutes re-asking questions. They can't see the AI conversation. What's the best change?",
          options: [
            { t: "Escalate earlier so less context is lost.", why: "The timing isn't the problem. The handoff content is." },
            { t: "Have the agent compile a structured handoff: customer ID, verification status, root cause, amounts, actions taken and recommended action.", ok: true, why: "A human without the transcript needs the facts and a recommendation in a scannable structure." },
            { t: "Attach a link to the full transcript.", why: "The stem says humans can't access it. Even if they could, raw transcripts are slow to read." },
            { t: "Tell the agent to apologize and set expectations before escalating.", why: "Fine for tone, but it doesn't give the human anything to act on." }
          ]
        },
        {
          id: "q03-4", ts: "1.4",
          stem: "Which requirement is fine to leave as prompt guidance rather than enforce in code?",
          options: [
            { t: "Never issue goodwill credit above $250 per customer per year.", why: "A financial limit. Enforce it in the tool or a hook." },
            { t: "Confirm identity before revealing a shipping address.", why: "A privacy rule. Use a prerequisite gate." },
            { t: "Mention the gift-wrap option when the customer says the order is a present.", ok: true, why: "A miss only costs a small upsell. This is judgment, so guide it with the prompt." },
            { t: "Never call <code>close_account</code> without a confirmation token from the preview step.", why: "Irreversible. Enforce structurally with the token check." }
          ]
        },
        {
          id: "q03-5", ts: "1.4", scenario: 1,
          stem: "A customer writes: “I was charged twice for March <em>and</em> the replacement headphones you promised never shipped.” How should the agent proceed?",
          options: [
            { t: "Resolve the billing issue and ask the customer to open a separate ticket for shipping.", why: "This pushes work back onto the customer and abandons half the request." },
            { t: "Escalate immediately, because multi-issue requests are complex.", trap: "T4", why: "Having two issues doesn't make a case complex. Both may be routine." },
            { t: "Split it into two items, investigate each with the shared customer context, then reply with one unified resolution.", ok: true, why: "Decompose, investigate (in parallel when independent), then synthesize one answer." },
            { t: "Handle whichever issue is worth more money and mention the other will be followed up.", why: "This silently drops part of the request." }
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
