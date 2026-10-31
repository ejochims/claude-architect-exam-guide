window.LESSONS.m10 = {
  cards: [
    { f: "Message Batches API: the three numbers to know?", b: "About 50% cost savings, up to a 24-hour processing window, no guaranteed latency SLA." },
    { f: "How do you match batch results to inputs?", b: "By custom_id. Never rely on result order." },
    { f: "Can a batch request run a multi-turn tool loop?", b: "No. A batch request can't execute tools mid-request and continue. Use the synchronous API for agentic loops." },
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
<p>A record that arrives just after a submission waits a full interval, then up to 24 hours in the batch, then your post-processing. So:</p>
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
          ["An agent that calls inventory tools during extraction.", "sync", "Batch can't execute tools mid-request."],
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
          stem: "Finance wants to cut API spend. Two workloads use real-time calls: (1) a weekly dependency-license audit read on Mondays, and (2) inline code suggestions in developers' editors. Which should move to the Message Batches API?",
          options: [
            { t: "Both, with polling for completion.", why: "Editor suggestions are interactive. Batch latency can be hours." },
            { t: "Only the weekly audit.", ok: true, why: "Latency-tolerant work gets the 50% savings; interactive work stays synchronous." },
            { t: "Neither, because batch results come back out of order.", why: "custom_id solves ordering." },
            { t: "Both, with a real-time fallback if a batch takes over 5 minutes.", why: "This adds complexity to force-fit an interactive workload." }
          ]
        },
        {
          id: "q10-2", ts: "4.5", scenario: 6,
          stem: "Extracted records must be available within 36 hours of arrival. Batches can take up to 24 hours, and post-processing takes 2 hours. Which submission interval guarantees the SLA?",
          options: [
            { t: "Every 12 hours", why: "12 + 24 + 2 = 38 hours, which misses the SLA in the worst case." },
            { t: "Every 8 hours", ok: true, why: "8 + 24 + 2 = 34 hours, within 36. The maximum is 36 − 24 − 2 = 10 hours." },
            { t: "Once a day", why: "24 + 24 + 2 = 50 hours." },
            { t: "Every 16 hours", why: "16 + 24 + 2 = 42 hours." }
          ]
        },
        {
          id: "q10-3", ts: "4.5", scenario: 6,
          stem: "A 10,000-document batch finishes with 280 failures, all <code>context_length_exceeded</code>. What next?",
          options: [
            { t: "Resubmit the whole batch with a larger max_tokens.", why: "This re-pays for 9,720 successes, and max_tokens limits output, not input." },
            { t: "Resubmit only the 280 failed custom_ids, with those documents chunked.", ok: true, why: "Targeted resubmission with the modification that fixes the cause." },
            { t: "Drop the 280 documents and report the rest.", why: "This silently loses data." },
            { t: "Switch all processing to synchronous calls.", why: "It's unnecessary. Batch worked for 97%." }
          ]
        },
        {
          id: "q10-4", ts: "4.5", scenario: 6,
          stem: "You want each extraction to call <code>lookup_vendor</code> to validate vendor IDs. Someone proposes running this agentic extraction through the Batches API to save money. What's the problem?",
          options: [
            { t: "None. Batch requests support tool use the same way synchronous requests do, so the lookups will run.", why: "Tools can be defined, but nothing executes them and continues the request." },
            { t: "Batch requests can't run multi-turn tool calls, so the lookup can't execute mid-request. Pre-fetch vendor data, or keep this stage synchronous.", ok: true, why: "Each batch request is a single call with no tool round trips." },
            { t: "Batch requests don't support system prompts, so the extraction instructions would be lost.", trap: "T8", why: "It does. Batch requests take the normal Messages parameters." },
            { t: "Batch results don't include a custom_id, so you can't tell which lookup belonged to which document.", why: "custom_id is how results are correlated." }
          ]
        },
        {
          id: "q10-5", ts: "4.5", scenario: 6,
          stem: "A developer writes batch results to the database by matching result <em>N</em> to input <em>N</em>. Some records end up with the wrong extraction. Fix?",
          options: [
            { t: "Sort the results by their completion timestamps before matching them to the inputs.", why: "There's no reliable key to sort by except custom_id." },
            { t: "Give each request a unique custom_id (such as the record's key) and join results on it.", ok: true, why: "custom_id is the correlation mechanism. Order isn't guaranteed." },
            { t: "Submit one request per batch so ordering doesn't matter.", why: "This defeats the purpose of batching." },
            { t: "Switch to synchronous calls, which return in order.", why: "Unnecessary. Use custom_id." }
          ]
        },
        {
          id: "q10-6", ts: "4.5", scenario: 6,
          stem: "You're about to batch 50,000 insurance claims with a brand-new prompt. What reduces total cost the most?",
          options: [
            { t: "Submit everything, then fix failures in later rounds.", why: "Each round of resubmissions costs more and delays results." },
            { t: "Refine the prompt and schema on a representative sample first, then submit the full set.", ok: true, why: "A higher first-pass success rate means fewer costly resubmissions." },
            { t: "Split the job into 50 smaller batches of 1,000 claims each.", why: "This doesn't improve quality. The same failures happen in smaller chunks." },
            { t: "Use the largest available model to minimize extraction errors.", trap: "T3", why: "Prompt and schema problems persist on any model." }
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
        "No multi-turn tool calling inside a batch request.",
        "Max interval = SLA − 24h − post-processing.",
        "Resubmit only failed custom_ids, with the fix (e.g. chunking).",
        "Refine on a sample before large batches."
      ]
    }
  ]
};
