window.LESSONS.m10 = {
  cards: [
    { f: "Message Batches API: the three numbers to know?", b: "About 50% cost savings, up to a 24-hour processing window, no guaranteed latency SLA." },
    { f: "How do you match batch results to inputs?", b: "By custom_id. Never rely on result order." },
    { f: "Can a batch request run a multi-turn tool loop?", b: "No, not with your own tools. A batch request can't execute them mid-request and continue. Use the synchronous API for agentic loops." },
    { f: "Max submission interval for an SLA?", b: "SLA − 24h batch window − post-processing time." },
    { f: "3% of a batch failed for context length. Next step?", b: "Resubmit only the failed custom_ids, modified (e.g. chunked), not the whole batch." },
    { f: "Before batching 50,000 documents?", b: "Refine the prompt on a representative sample to maximize first-pass success." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: latency is a requirement",
      html: `
<p class="lede">The Message Batches API halves the cost of a call in exchange for time: a batch may take <strong>up to 24 hours</strong>, with <strong>no latency guarantee</strong>. Whether that's acceptable depends only on whether something is waiting.</p>
<div class="table-wrap"><table>
<thead><tr><th>Good fit for batch</th><th>Wrong fit for batch</th></tr></thead>
<tbody>
<tr><td>Overnight reports, weekly audits, nightly test generation, backfills</td><td>Pre-merge checks developers wait on, live chat, anything that blocks a person</td></tr>
</tbody></table></div>
<ul>
<li><strong><code>custom_id</code></strong> on every request is how you correlate results. Don't assume results come back in order.</li>
<li><strong>No multi-turn tool calling inside a request.</strong> A batch request is one Messages call. If Claude asks for a tool, nothing executes it and continues. Agentic loops stay on the synchronous API, or you pre-fetch the data into the prompt. (Real world today: Anthropic-run server tools such as web search do execute inside a batch request; the rule holds for your own tools.)</li>
<li><strong>Poll for completion</strong>, then process results.</li>
<li><strong>Refine on a sample first.</strong> Tune the prompt and schema on a representative sample with synchronous calls before batching thousands of documents, so fewer need resubmitting.</li>
<li><strong>Handle failures surgically.</strong> Resubmit only the failed <code>custom_id</code>s, modified as needed (for example, chunk the documents that exceeded the context limit).</li>
</ul>
<h3>SLA arithmetic</h3>
<p>A record that arrives just after a submission waits a full interval, then up to 24 hours in the batch, then your post-processing. (Requests not processed within 24 hours expire and must be resubmitted.) So:</p>
<pre class="code"><code>max interval = SLA − 24h − post-processing</code></pre>`
    },
    {
      kind: "widget",
      title: "Find a safe cadence",
      intro: "Set the deadline and post-processing time, then choose how often to submit.",
      widget: "slaCalc"
    },
    {
      kind: "widget",
      title: "Batch or synchronous?",
      intro: "Choose the API for each workload.",
      widget: "sorter",
      config: {
        cats: [{ id: "batch", label: "Batch API" }, { id: "sync", label: "Synchronous" }],
        items: [
          ["Nightly generation of test-gap reports reviewed the next morning.", "batch", "Latency-tolerant and high volume: take the 50% savings."],
          ["A check that must finish before a PR can merge.", "sync", "Developers are blocked. No 24-hour risk is acceptable."],
          ["Re-extracting 80,000 archived contracts for a new field.", "batch", "A backfill with no one waiting."],
          ["An agent that calls inventory tools during extraction.", "sync", "Batch can't execute your own tools mid-request."],
          ["A weekly compliance audit of support transcripts.", "batch", "Weekly cadence, no blocking dependency."],
          ["Customer-facing chat replies.", "sync", "Someone is waiting on every turn."]
        ]
      }
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q10-1", ts: "4.5", scenario: 5,
          stem: "A 20,000-request batch reached its 24-hour limit. 18,800 requests succeeded, and 1,200 are marked <code>expired</code>. What should you do next?",
          options: [
            { t: "Download the expired results from the results file; they finished but arrived after the cutoff.", why: "Expired requests were never sent to the model, so there are no results to download." },
            { t: "Resubmit the whole batch so all 20,000 results come from the same run.", why: "Re-pays for 18,800 successes." },
            { t: "Resubmit only the 1,200 expired <code>custom_id</code>s.", ok: true, why: "Expired requests weren't processed or billed. Resubmit just those." },
            { t: "Fix the prompt for the expired requests first, since expiry means their input was invalid.", why: "Expiry is about time, not input validity. Invalid input shows up as errored." }
          ]
        },
        {
          id: "q10-2", ts: "4.5", scenario: 6,
          stem: "Extracted records must be available within 36 hours of arrival. Batches can take up to 24 hours, and post-processing takes 2 hours. Which submission interval guarantees the SLA?",
          options: [
            { t: "Every 12 hours", why: "12 + 24 + 2 = 38 hours, over the 36-hour SLA." },
            { t: "Every 8 hours", ok: true, why: "Worst case is 8 + 24 + 2 = 34 hours, within 36." },
            { t: "Once a day", why: "24 + 24 + 2 = 50 hours." },
            { t: "Every 16 hours", why: "16 + 24 + 2 = 42 hours." }
          ]
        },
        {
          id: "q10-3", ts: "4.5", scenario: 6,
          stem: "A 10,000-document batch finishes with 280 failures, all “prompt is too long” errors because the documents exceed the context window. What next?",
          options: [
            { t: "Resubmit the whole batch with a larger <code>max_tokens</code>.", why: "Re-pays for 9,720 successes, and <code>max_tokens</code> limits output, not input." },
            { t: "Resubmit only the 280 failed <code>custom_id</code>s, with those documents chunked.", ok: true, why: "Targeted resubmission with the change that fixes the cause." },
            { t: "Resubmit the 280 failures unchanged in a new batch, since errors are often transient.", trap: "T6", why: "Prompt-too-long errors aren't transient; the same input fails again." },
            { t: "Process the 280 with synchronous calls, which accept longer inputs than <code>/v1/messages/batches</code> requests.", why: "The context window is the same either way. The documents need chunking." }
          ]
        },
        {
          id: "q10-4", ts: "4.5", scenario: 6,
          stem: "You want each extraction to call <code>lookup_vendor</code> to validate vendor IDs. Someone proposes running this agentic extraction through the Batches API to save money. What's the problem?",
          options: [
            { t: "None. Batch requests support tool definitions, so <code>lookup_vendor</code> will run during processing.", why: "You can define tools, but nothing executes your tool and continues the conversation inside a batch request." },
            { t: "Batch requests can't run a multi-turn tool loop; pre-fetch vendor data or stay synchronous.", ok: true, why: "A batch request is one Messages call; your own tools can't execute mid-request." },
            { t: "Batch requests don't support system prompts, so the extraction instructions would be lost.", trap: "T8", why: "Not true; batch requests take the same parameters as normal Messages calls." },
            { t: "Batch results arrive unordered, so lookups can't be matched back to their documents.", why: "<code>custom_id</code> handles correlation." }
          ]
        },
        {
          id: "q10-5", ts: "4.5", scenario: 6,
          stem: "A developer writes batch results to the database by matching result <em>N</em> to input <em>N</em>. Some records end up with the wrong extraction. Fix?",
          options: [
            { t: "Sort results by their completion timestamps before matching them to inputs.", why: "Completion order isn't input order. Only <code>custom_id</code> is a reliable key." },
            { t: "Give each request a unique <code>custom_id</code> and join results on it.", ok: true, why: "custom_id is the correlation mechanism. Order isn't guaranteed." },
            { t: "Submit one request per batch so there's never anything to reorder.", why: "Defeats the point of batching and multiplies overhead." },
            { t: "Switch to synchronous calls, since those return in the order they were sent.", why: "Unnecessary. Use custom_id and keep the discount." }
          ]
        },
        {
          id: "q10-6", ts: "4.5", scenario: 6,
          stem: "You're about to batch 50,000 insurance claims with a brand-new prompt. What reduces total cost the most?",
          options: [
            { t: "Submit everything now, then fix failures in later rounds of resubmission.", why: "Pays to process 50,000 claims with a prompt you haven't tested." },
            { t: "Refine the prompt and schema on a representative sample first, then submit the full set.", ok: true, why: "Sample-first iteration catches prompt problems before they're paid for at scale." },
            { t: "Split the job into 50 batches of 1,000 and adjust the prompt and schema between batches as problems appear.", why: "Better than one shot, but slow, and early batches still run on the untested prompt." },
            { t: "Use the largest available model, so the first run has the fewest errors.", trap: "T3", why: "Costs more on every claim, and doesn't fix prompt or schema mistakes." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Batch: about 50% cheaper, up to 24h, no latency SLA. Use it only where nothing is waiting.",
        "Correlate by custom_id; never by order.",
        "No multi-turn tool calling with your own tools inside a batch request.",
        "Max interval = SLA − 24h − post-processing.",
        "Resubmit only failed custom_ids, with the fix (e.g. chunking).",
        "Refine on a sample before large batches."
      ]
    }
  ]
};
