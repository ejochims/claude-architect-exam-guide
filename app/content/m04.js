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
<div class="callout key"><div class="callout-label">Empty is not an error</div><p>A search that ran and found nothing is a <strong>successful</strong> result with an empty list. A search that couldn't run is an <strong>error</strong>. Mixing them up either retries valid queries or reports outages as “no results.”</p></div>`
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
          ["Request to the carrier API timed out after 10 seconds.", "transient", "A read that timed out is usually safe to retry locally."],
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
            { t: "Return structured errors with an errorCategory (transient / validation / permission), isRetryable, and a human-readable description.", ok: true, why: "Uniform errors make appropriate recovery impossible. Categories and retryability tell the agent what to do." },
            { t: "Add system-prompt guidance explaining how the agent should interpret and respond to “Operation failed.”", trap: "T9", why: "The information isn't in the error, so no prompt can help the model recover it." },
            { t: "Retry every failure three times with backoff inside the tool before reporting it to the agent.", trap: "T6", why: "This wastes retries on malformed IDs and permission errors that never succeed." },
            { t: "Escalate every tool failure to a human agent so customers never receive a wrong answer.", why: "This overwhelms humans with transient blips the tool could absorb." }
          ]
        },
        {
          id: "q04-2", ts: "2.2", scenario: 1,
          stem: "<code>process_return</code> rejects a request because the item is final-sale. How should the tool report this?",
          options: [
            { t: "Throw an exception so the agent framework surfaces the full stack trace to the model.", why: "Exceptions often reach the model as opaque failures, if they reach it at all." },
            { t: "Return a successful result with <code>{\"note\": \"final sale\"}</code> so the agent can explain it if needed.", trap: "T6", why: "Marking a rejection as success invites the agent to tell the customer the return went through." },
            { t: "Return <code>isError: true</code> with category “business”, <code>isRetryable: false</code>, and a customer-friendly explanation.", ok: true, why: "The agent knows not to retry and has wording to explain the outcome." },
            { t: "Return a JSON-RPC protocol error so the client knows the call was rejected.", why: "Protocol errors are for malformed requests. The tool ran and applied policy." }
          ]
        },
        {
          id: "q04-3", ts: "5.3", scenario: 3,
          stem: "A document-analysis subagent can open 7 of 10 assigned PDFs. The other 3 return 403 after retries. What should it return to the coordinator?",
          options: [
            { t: "The analysis of the 7 readable PDFs, presented as the complete result so the synthesis step isn't delayed.", trap: "T6", why: "Silent suppression. The coordinator can't compensate for a gap it doesn't know about." },
            { t: "An error that stops the research workflow, so nobody receives a report built on incomplete documents.", trap: "T6", why: "This discards 7 good analyses over a recoverable problem." },
            { t: "Structured status: the 7 analyses as partial results, the 3 failed documents with failure type (access denied), what was attempted, and alternatives.", ok: true, why: "The coordinator can now find alternate sources, proceed with annotated gaps, or escalate." },
            { t: "A status of “Document analysis unavailable” after its retries, so the coordinator knows something failed.", trap: "T6", why: "Generic status hides the partial results and specifics." }
          ]
        },
        {
          id: "q04-4", ts: "2.2", scenario: 3,
          stem: "<code>search_archive</code> returns <code>[]</code> both when nothing matches and when the archive service is unreachable. The coordinator concludes some topics have no coverage. Fix?",
          options: [
            { t: "Return an empty successful result for no matches, and an isError result with a transient category when the service is unreachable.", ok: true, why: "Access failures need retry decisions; valid empty results don't. They must be distinguishable." },
            { t: "Always retry empty results twice inside the tool before returning them, in case the service was down.", why: "This wastes calls on genuinely empty queries and still can't tell the cases apart." },
            { t: "Have the coordinator treat every empty result as a possible outage and re-run that query later.", trap: "T7", why: "The tool is ambiguous. Fix it at the source." },
            { t: "Return a dummy result with default values when the service is down, so downstream steps still have data.", trap: "T6", why: "Fabricating data is worse than an empty list." }
          ]
        },
        {
          id: "q04-5", ts: "5.3", scenario: 3,
          stem: "The search subagent hits frequent 2-second timeouts that succeed on immediate retry. Currently each timeout goes back to the coordinator, which re-delegates, adding about 30 seconds per task. Best design?",
          options: [
            { t: "Have the subagent retry transient timeouts locally with backoff and propagate only failures it can't resolve, with context.", ok: true, why: "Local recovery for transient errors, escalation for the rest." },
            { t: "Increase the coordinator's turn limit so it has room for the extra re-delegation round trips.", why: "This doesn't reduce the wasted round trips." },
            { t: "Have the subagent return an empty result list on timeout so the coordinator isn't interrupted.", trap: "T6", why: "Silent suppression of a failure." },
            { t: "Give the coordinator the search tools directly so it can retry searches itself without delegating.", trap: "T5", why: "This breaks role separation and still doesn't handle retries well." }
          ]
        },
        {
          id: "q04-6", ts: "5.3", scenario: 3,
          stem: "A financial-sector report was produced after the market-data subagent failed. The final report reads as complete. What should the synthesis output include?",
          options: [
            { t: "Nothing extra. Readers prefer clean reports, and the missing data can be added in the next edition.", trap: "T6", why: "Hiding gaps misleads the reader." },
            { t: "Coverage annotations distinguishing well-supported findings from areas with gaps due to unavailable sources.", ok: true, why: "Readers can judge reliability, and the coordinator can target re-research." },
            { t: "A general disclaimer at the top of the report noting that some data may be incomplete.", why: "Too vague to act on. Name the specific gaps." },
            { t: "Estimated figures from the model's own knowledge to fill the market-data gap, labeled as estimates.", why: "This fabricates data and destroys provenance." }
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
