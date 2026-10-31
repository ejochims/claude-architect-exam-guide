window.LESSONS.m04 = {
  cards: [
    { f: "Four error categories the exam uses?", b: "Transient (timeouts, 503), validation (bad input), business (policy violation), permission (access denied). Plus: a valid empty result is not an error." },
    { f: "What should a structured tool error contain?", b: "isError: true, an error category, isRetryable, a human-readable description, and for business rules a customer-friendly explanation." },
    { f: "Where should transient failures be retried?", b: "Locally, inside the tool or subagent, with backoff. Propagate only what can't be resolved, with what was attempted and any partial results." },
    { f: "Why is returning [] on a timeout dangerous?", b: "It reports a failure as “no matches,” so the coordinator can't retry or note a coverage gap." },
    { f: "What should a subagent's failure report to the coordinator include?", b: "Failure type, what was attempted (the query), partial results, and possible alternatives." },
    { f: "Synthesis has gaps because a source was down. What should the report do?", b: "Annotate coverage: which findings are well supported and which areas have gaps because sources were unavailable." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: an error is a message to the model",
      html: `
<p class="lede">When a tool fails, the agent decides what to do next from the error text alone. “Operation failed” leaves it guessing between retrying, rephrasing, asking the user, escalating or giving up, and it will guess wrong some of the time.</p>
<p>Return failures as <strong>structured tool results</strong>. In MCP, set <code>isError: true</code> on the result and describe the failure in fields the agent can act on:</p>
<pre class="code"><code>{
  <span class="s">"isError"</span>: <span class="k">true</span>,
  <span class="s">"errorCategory"</span>: <span class="s">"business"</span>,
  <span class="s">"isRetryable"</span>: <span class="k">false</span>,
  <span class="s">"description"</span>: <span class="s">"Order 48213 is outside the 30-day return window (delivered 41 days ago)."</span>,
  <span class="s">"customerMessage"</span>: <span class="s">"This order is past our 30-day return window."</span>,
  <span class="s">"alternatives"</span>: [<span class="s">"offer_repair"</span>, <span class="s">"escalate_for_exception"</span>]
}</code></pre>
<div class="table-wrap"><table>
<thead><tr><th>Category</th><th>Example</th><th>Right response</th></tr></thead>
<tbody>
<tr><td>Transient</td><td>Timeout, 503, connection reset</td><td>Retry with backoff, preferably <em>inside</em> the tool</td></tr>
<tr><td>Validation</td><td>Malformed order ID, bad date</td><td>Fix the input or ask the user. Retrying unchanged fails again</td></tr>
<tr><td>Business</td><td>Outside return window, over limit</td><td>Don't retry. Explain to the customer and offer alternatives or escalation</td></tr>
<tr><td>Permission</td><td>Caller lacks access</td><td>Don't retry. Escalate or request access</td></tr>
</tbody></table></div>
<div class="callout key"><div class="callout-label">Empty is not an error</div><p>A search that ran and found nothing is a <strong>successful</strong> result with an empty list. A search that couldn't run is an <strong>error</strong>. Mixing them up either retries valid queries or reports outages as “no results.”</p></div>
<!-- panel:m04-vocabulary -->
<div class="callout key"><div class="callout-label">Which error fields are real</div><ul style="margin:0;padding-left:18px"><li><strong>Messages API.</strong> <code>is_error: true</code> on a <code>tool_result</code> block. Your code sets it.</li><li><strong>MCP.</strong> <code>isError: true</code> on a tool's result. The server sets it, and the client passes it to the model.</li><li><strong>Everything else.</strong> fields such as <code>errorCategory</code>, <code>isRetryable</code> or a customer-safe message are a recommended convention inside the error's content, not protocol fields. The exam uses these names; the point is that the model gets enough to decide what to do next.</li></ul></div>
`
    },
    {
      kind: "widget",
      title: "Classify the failure",
      intro: "For each tool outcome, choose the category. The explanation gives the right handling.",
      widget: "sorter",
      config: {
        cats: [{ id: "transient", label: "Transient" }, { id: "validation", label: "Validation" }, { id: "business", label: "Business" }, { id: "permission", label: "Permission" }, { id: "empty", label: "Valid empty result" }],
        items: [
          ["Inventory API returned 503 Service Unavailable.", "transient", "Retry with backoff inside the tool. Surface it only if retries are exhausted."],
          ["Order ID “48-21-3” doesn't match the ORD-##### format.", "validation", "Not retryable as-is. Ask for the correct ID or correct the format."],
          ["Refund of $640 exceeds the $500 agent limit.", "business", "isRetryable: false, a customer-friendly explanation, and a pointer to escalation."],
          ["Knowledge-base search for “firmware 2.1 rollback” returned zero articles.", "empty", "Success with no matches. Don't retry, and don't report an outage."],
          ["The service account can't read the HR records table.", "permission", "Not retryable. Escalate or route to someone with access."],
          ["A read-only tracking request to the carrier API timed out after 10 seconds.", "transient", "A read that timed out is usually safe to retry locally."],
          ["Customer asked to cancel an order that has already shipped.", "business", "A policy outcome. Explain and offer the return flow instead."]
        ]
      }
    },
    {
      kind: "read",
      title: "Propagating errors across agents",
      html: `
<p class="lede">In multi-agent systems, failures happen inside subagents but recovery decisions belong to the coordinator. The coordinator can only decide well if failures arrive with context.</p>
<p><strong>Recover locally first.</strong> A subagent retries its own transient failures. It propagates only what it can't resolve, and when it does, it sends:</p>
<pre class="code"><code>{
  <span class="s">"status"</span>: <span class="s">"partial"</span>,
  <span class="s">"failureType"</span>: <span class="s">"access_denied"</span>,
  <span class="s">"attempted"</span>: <span class="s">"Fetch 3 reports from analyst site (2 retries each)"</span>,
  <span class="s">"partialResults"</span>: [<span class="s">"… 6 findings from the 2 reachable reports …"</span>],
  <span class="s">"alternatives"</span>: [<span class="s">"search press releases for the same figures"</span>, <span class="s">"proceed and mark gap"</span>]
}</code></pre>
<p>Two anti-patterns sit at opposite extremes, and both appear as distractors:</p>
<div class="anti" style="grid-template-columns:repeat(2,minmax(0,1fr))">
<div><h4>Silent suppression</h4><p>Catch the error and return an empty result marked as success. The coordinator believes the topic has no data, and the report is incomplete without anyone knowing.</p></div>
<div><h4>Total failure</h4><p>Let one subagent's timeout terminate the whole workflow, discarding every other agent's good results.</p></div>
</div>
<p>Somewhere between them sits a third trap: <strong>generic status</strong>, such as “search unavailable,” sent after retries. It's honest but hides the query, the partial results and the alternatives the coordinator needs.</p>
<p>Finally, the synthesis should be honest about gaps. Use <strong>coverage annotations</strong> that say which findings are well supported and which areas are thin because a source was unavailable.</p>`
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q04-1", ts: "2.2", scenario: 1,
          stem: "<code>lookup_order</code> returns <code>{\"error\": \"Operation failed\"}</code> for timeouts, malformed IDs and permission problems alike. The agent retries malformed IDs repeatedly and tells customers with valid IDs to “provide a correct order number.” Best fix?",
          options: [
            { t: "Return structured errors with an <code>errorCategory</code>, <code>isRetryable</code> and a readable description.", ok: true, why: "The agent needs to know what failed and whether to retry, ask or explain." },
            { t: "Add structured system-prompt guidance on interpreting “Operation failed” in each situation.", trap: "T9", why: "The agent can't tell the situations apart from an identical message." },
            { t: "Retry every failure three times with exponential backoff (<code>retry(3)</code>) inside the tool, then report “Operation failed.”", trap: "T6", why: "Wastes time on permanent errors and still hides the cause." },
            { t: "Escalate every tool failure to a human agent, so customers never receive a wrong answer.", trap: "T7", why: "Overkill. Most failures can be handled once they're classified." }
          ]
        },
        {
          id: "q04-2", ts: "2.2", scenario: 1,
          stem: "<code>process_return</code> rejects a request because the item is final-sale. How should the tool report this?",
          options: [
            { t: "Throw an exception, so the agent framework passes the full stack trace, including the policy check, to the model.", why: "A stack trace isn't actionable, and it leaks internals." },
            { t: "Return a successful result with <code>{\"note\": \"final sale\"}</code> so the agent can mention it if needed.", trap: "T6", why: "Marking a rejection as success invites the agent to say the return worked." },
            { t: "Return <code>isError: true</code> with category “business”, marked not retryable, plus a customer-friendly reason.", ok: true, why: "The agent can explain the policy and won't retry." },
            { t: "Return a structured JSON-RPC protocol error so the client knows the call was rejected.", why: "Protocol errors are for malformed requests. The tool ran and applied policy." }
          ]
        },
        {
          id: "q04-3", ts: "5.3", scenario: 3,
          stem: "A document-analysis subagent can open 7 of 10 assigned PDFs. The other 3 return 403 (access denied). Some topics in the research brief depend mainly on those 3 documents. Who should decide how the research proceeds, and with what information?",
          options: [
            { t: "The subagent should finish with the 7 and leave the 3 out of its output, so the run isn't delayed.", trap: "T6", why: "Silently dropping failures makes the coordinator believe coverage is complete." },
            { t: "The subagent should retry the 403s with backoff until they succeed or the run's time budget is spent.", trap: "T6", why: "Access-denied errors aren't transient. Retrying wastes time and changes nothing." },
            { t: "The coordinator, given the 7 analyses as partial results and each failed document with its error type and attempts.", ok: true, why: "The coordinator has the whole brief, so it decides: find other sources, re-scope, or proceed with coverage notes." },
            { t: "The subagent should stop the workflow with an error, so no report is built on incomplete documents.", trap: "T6", why: "Throws away 7 good analyses; the coordinator may well have a way around the gap." }
          ]
        },
        {
          id: "q04-4", ts: "2.2", scenario: 3,
          stem: "<code>search_archive</code> returns <code>[]</code> both when nothing matches and when the archive service is unreachable. The coordinator concludes some topics have no coverage. Fix?",
          options: [
            { t: "Return an empty success only for true no-matches, and an <code>isError</code> result marked transient when the service is down.", ok: true, why: "An access failure and an empty result mean different things and need different handling." },
            { t: "Retry every empty <code>[]</code> result twice inside the tool before returning it, in case the service was down.", why: "Slows down every genuine no-match and still can't tell the agent which case it is." },
            { t: "Have the coordinator treat every empty result as a possible outage and re-run that query later.", trap: "T7", why: "Fixes the wrong component. The tool should say what happened." },
            { t: "Return placeholder results with default values when the service is down, so downstream steps still have data.", trap: "T6", why: "Fabricated data is worse than an honest error." }
          ]
        },
        {
          id: "q04-5", ts: "5.3", scenario: 3,
          stem: "The search subagent hits frequent 2-second timeouts that succeed on immediate retry. Currently each timeout goes back to the coordinator, which re-delegates, adding about 30 seconds per task. Best design?",
          options: [
            { t: "Have the subagent retry transient timeouts locally, escalating only what it can't resolve.", ok: true, why: "Handle recoverable errors where they happen; propagate only real failures, with context." },
            { t: "Raise the coordinator's <code>max_turns</code> so it has room for the extra re-delegation round trips.", why: "Accommodates the waste instead of removing it." },
            { t: "Have the subagent return an empty result list on timeout so the coordinator isn't interrupted.", trap: "T6", why: "Turns a recoverable error into a silent coverage gap." },
            { t: "Give the coordinator the search tools directly so it can retry searches without delegating.", trap: "T5", why: "Blurs roles and bloats the coordinator's context; the retry belongs in the subagent." }
          ]
        },
        {
          id: "q04-6", ts: "5.3", scenario: 3,
          stem: "A financial-sector report was produced after the market-data subagent failed. The final report reads as complete. What should the synthesis output include?",
          options: [
            { t: "Nothing extra. Readers prefer clean reports, and missing data can be added in the next edition.", trap: "T6", why: "Presents partial work as complete." },
            { t: "Coverage annotations that separate well-supported findings from gaps caused by the failed market-data source.", ok: true, why: "Readers need to know which conclusions rest on full data and which don't." },
            { t: "A general disclaimer at the top of the report noting that some figures may be incomplete or estimated.", why: "Too vague to tell readers which findings are affected." },
            { t: "Estimated market figures from the model's own knowledge, clearly labeled as estimates, to fill the gap.", why: "Unsourced figures in a financial report, however labeled, undermine trust." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "An error message is input to the model's next decision. Make it structured.",
        "Categories: transient, validation, business, permission. Include isRetryable and a description.",
        "Business-rule errors get retryable: false and a customer-friendly explanation.",
        "Empty success ≠ access failure. Never return [] for an outage.",
        "Subagents recover locally from transient errors, then propagate failure type, attempt, partial results and alternatives.",
        "Avoid both silent suppression and killing the whole workflow. Annotate coverage gaps."
      ]
    }
  ]
};
