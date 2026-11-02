window.LESSONS.m14 = {
  cards: [
    { f: "Name the nine traps.", b: "Prompt where code is needed; over-built first step; bigger model or window; unreliable proxy; consolidate everything; hide or hammer the error; fix the wrong component; feature that doesn't exist; just tell it to try harder." },
    { f: "Before booking, what must be true?", b: "A cold Readiness Check at 80% or more with every domain at 70% or more, two mocks at 80% a week apart, and the official practice exam at 80% or more." }
  ],
  steps: [
    {
      kind: "read",
      title: "Think like the exam",
      html: `
<p class="lede">You've now seen every domain. This capstone turns that knowledge into exam technique: spotting the distractor that sounds right for the wrong reason.</p>
<p>Use the four moves from Module 0 on every question: find the evidence in the stem, name the root cause, decide whether the behavior needs a <em>guarantee</em> (code) or <em>judgment</em> (prompt, description, examples), then pick the proportionate fix. Most wrong answers fail one of those moves in a recognizable way. Those patterns are the nine traps you'll sort next.</p>
<div class="callout key"><div class="callout-label">Before you book</div><p>When the traps feel automatic, take a full <a href="#mock">mock exam</a>, then the one-time <a href="#readiness">Readiness Check</a>. Book when the Readiness Check is at 80% or more with every domain at 70% or more, two mocks a week apart are at 80% or more, and the official practice exam is at 80% or more.</p></div>`
    },
    {
      kind: "read",
      title: "Put it together: where each rule lives",
      html: `
<p class="lede">Most exam questions are really one question: <em>which layer should this change go in?</em> The modules taught each layer on its own. Here they stack into one system, so you can place any requirement quickly.</p>
<h3>The layers, bottom to top</h3>
<ol>
<li><strong>The model call</strong> (Foundations F1, F2). Stateless: each request carries the system prompt, the messages so far and the tool definitions. The model returns text or <code>tool_use</code> blocks and a <code>stop_reason</code>.</li>
<li><strong>Your loop and tools</strong> (Modules 1–4). Your code runs the tools Claude asks for, appends the results, keeps state, and can refuse a call that breaks a rule.</li>
<li><strong>The Agent SDK</strong> (Modules 3, 6, 12). The same loop, prebuilt, plus hooks that run before and after tool calls, subagents with their own contexts, and sessions you can resume or fork.</li>
<li><strong>MCP servers</strong> (Module 5). Tools, resources and prompts packaged once and usable by any host: your SDK app, Claude Code, Claude Desktop.</li>
<li><strong>Claude Code</strong> (Modules 11, 12). The SDK's harness as a developer tool, configured by CLAUDE.md, rules, skills and commands, run interactively or with <code>-p</code> in CI.</li>
</ol>
<h3>One request, traced through the layers</h3>
<p>Scenario 1, a support agent. A customer writes: “Order A-1042 arrived broken. I want my $640 back.”</p>
<ol>
<li><strong>Building the request.</strong> The system prompt sets tone and the escalation criteria, with a few examples (Modules 8, 13). A case-facts block carries the order number and amount so they survive any summarizing (Module 7). Each tool's description says what it's for and when to use it (Module 2).</li>
<li><strong>Looking things up.</strong> Claude asks for <code>get_customer</code>. Your loop runs it through the CRM's MCP server (Modules 1, 5). A <code>PostToolUse</code> hook converts the CRM's dates to ISO format before Claude reads them (Module 3).</li>
<li><strong>Trying to refund.</strong> Claude calls <code>process_refund</code> for $640. A <code>PreToolUse</code> hook denies it, because refunds over $500 need a person, and its reason tells Claude to escalate instead (Module 3).</li>
<li><strong>A failure on the way.</strong> The order system times out. The tool retries with backoff, then returns a structured error marked retryable, so Claude neither invents an answer nor gives up blindly (Module 4).</li>
<li><strong>Handing off.</strong> Claude calls <code>escalate_to_human</code> with a structured summary: customer, verified status, order, amount, what was tried and why it's escalating (Modules 3, 13).</li>
<li><strong>Meanwhile, the team building it</strong> uses Claude Code: shared conventions in the project's CLAUDE.md, a path-scoped rule for test files, plan mode for the migration to the new refund API, and a CI review job run with <code>-p</code> and a JSON schema (Modules 11, 12).</li>
</ol>
<h3>Where does this requirement live?</h3>
<div class="table-wrap"><table><thead><tr><th>Requirement</th><th>Put it in</th><th>Why there</th><th>Module</th></tr></thead><tbody>
<tr><td>Refunds over $500 must never go through automatically</td><td><code>PreToolUse</code> hook, or a check in the tool's code</td><td>It must always hold, so it needs code, not a request</td><td>3</td></tr>
<tr><td>Verify the customer before any refund</td><td>A prerequisite gate in code</td><td>Order must be guaranteed</td><td>3</td></tr>
<tr><td>Be warm; acknowledge frustration</td><td>System prompt</td><td>Tone and judgment are what prompts are for</td><td>8, 13</td></tr>
<tr><td>Use <code>lookup_order</code> for order numbers, not <code>search</code></td><td>Tool descriptions</td><td>The model picks tools from their descriptions</td><td>2</td></tr>
<tr><td>Three systems return dates in three formats</td><td><code>PostToolUse</code> hook</td><td>Normalize before the model reads them</td><td>3</td></tr>
<tr><td>Escalate when the policy doesn't cover the case</td><td>Explicit criteria plus examples in the prompt</td><td>Judgment, made consistent</td><td>13</td></tr>
<tr><td>The output must be machine-readable</td><td><code>tool_use</code> with a JSON schema</td><td>Structure is guaranteed by the API</td><td>9</td></tr>
<tr><td>Line items must add up to the total</td><td>Validation code, then a retry with the errors</td><td>A schema checks shape, not meaning</td><td>9</td></tr>
<tr><td>The CRM connector should work in the agent and in Claude Code</td><td>An MCP server</td><td>Build once, use from any host</td><td>5</td></tr>
<tr><td>A subagent needs earlier findings</td><td>That subagent's prompt, written by the coordinator</td><td>Subagents inherit nothing</td><td>6</td></tr>
<tr><td>Remember the refund amount through a long chat</td><td>A case-facts block sent with every request</td><td>Summaries lose exact numbers</td><td>7</td></tr>
<tr><td>Team test conventions</td><td>Project CLAUDE.md, or <code>.claude/rules/</code> with a paths glob</td><td>Shared through git; path rules load only where relevant</td><td>11</td></tr>
<tr><td>An automated review on every pull request</td><td><code>claude -p</code> with <code>--output-format json</code> and <code>--json-schema</code></td><td>Runs unattended; output can be parsed</td><td>12</td></tr>
<tr><td>Extract 10,000 documents overnight</td><td>The Batch API, with a <code>custom_id</code> per request</td><td>Can wait, and costs about half</td><td>10</td></tr>
</tbody></table></div>
<div class="callout key"><div class="callout-label">The placement test</div><ul style="margin:0;padding-left:18px"><li><strong>Must always happen?</strong> Code: a hook, a gate, a schema, validation.</li><li><strong>Needs judgment?</strong> The prompt, tool descriptions, examples.</li><li><strong>Knowledge the model lacks?</strong> Put it in the context: tool results, a case-facts block, CLAUDE.md, the subagent's prompt.</li><li><strong>Shared across tools or hosts?</strong> An MCP server.</li><li><strong>The developers' own workflow?</strong> Claude Code configuration.</li></ul></div>`
    },
    {
      kind: "widget",
      title: "Know the nine traps",
      intro: "Distractors aren't random. Nearly all of them fall into nine recurring patterns. Learn to name the pattern and you can eliminate options in seconds.",
      widget: "trapSpotter"
    },
    {
      kind: "quiz",
      title: "Check your reasoning",
      questions: [
        {
          id: "q00-1", ts: "2.1",
          stem: "An IT-helpdesk agent's <code>get_account</code> tool takes an <code>account_id</code> such as <code>AC-00418822</code>. Its description is detailed, yet the agent often passes users' email addresses into <code>account_id</code>, and the calls fail. What is the most effective first step?",
          options: [
            { t: "Train a small classifier that rewrites emails into <code>account_id</code> values before each call reaches the backend.", trap: "T2", why: "New infrastructure before the cheap fix: tell the model what the parameter expects." },
            { t: "Describe the parameter's format, and say to call <code>find_account_by_email</code> first whenever only an email is known.", ok: true, why: "Parameter descriptions guide inputs too. State the format and how to get a valid ID." },
            { t: "Have the backend return a generic “invalid input” error so the agent learns from the failures.", trap: "T6", why: "A generic error doesn't say what's wrong or how to get the right value." },
            { t: "Upgrade to the most capable model, which infers ID formats from examples it has seen before.", trap: "T3", why: "No model can know your ID format unless you describe it." }
          ]
        },
        {
          id: "q00-2", ts: "4.3",
          stem: "A lease-abstraction pipeline extracts <code>renewal_notice_days</code>. When a lease doesn't mention notice, the output still contains a plausible number such as 60. The schema marks the field as a required integer. Which change fixes the root cause?",
          options: [
            { t: "Have the model add a confidence score to each field and drop values below 0.7.", trap: "T4", why: "An arbitrary threshold doesn't touch the cause: the schema forces a value to exist." },
            { t: "Make the field nullable and tell the model to return null whenever the lease doesn't state it.", ok: true, why: "A required field creates pressure to fabricate. Allow absence explicitly." },
            { t: "Run each extraction three times at temperature 0.7 and keep the value that at least two runs agree on.", trap: "T6", why: "Fabricated defaults are often consistent, so runs can agree on the same invented 60." },
            { t: "Switch to a model with a longer context window so it reads the whole lease, including the appendices.", trap: "T3", why: "The model isn't missing text; the value doesn't exist and the schema demands one." }
          ]
        },
        {
          id: "q00-3", ts: "3.6",
          stem: "Which of these is <strong>not</strong> a real Claude Code mechanism?",
          options: [
            { t: "<code>.claude/rules/</code> files whose <code>paths:</code> frontmatter loads conventions only for matching files", why: "Real. Path-scoped rules are explicitly on the exam (task statement 3.3)." },
            { t: "<code>claude -p</code> for one-shot, non-interactive runs in CI", why: "Real. <code>-p</code> (<code>--print</code>) runs once and exits, so pipelines don't hang." },
            { t: "Setting <code>CLAUDE_HEADLESS=true</code> so Claude Code stops waiting for input", ok: true, why: "Invented. The documented mechanism is the <code>-p</code> flag. Invented flags and env vars are a common distractor." },
            { t: "<code>${GITHUB_TOKEN}</code> expansion inside a committed <code>.mcp.json</code>, keeping secrets out of the repo", why: "Real. It's how teams share MCP configuration without committing secrets." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Evidence → root cause → guarantee or judgment → proportionate fix.",
        "Nine traps: prompt-for-guarantee, over-built, bigger model, unreliable proxy, consolidate, hide/hammer errors, wrong component, invented feature, try-harder exhortations.",
        "Next: a mock exam, then the Readiness Check, then the official practice exam."
      ]
    }
  ]
};
