window.LESSONS.m07 = {
  cards: [
    { f: "What does progressive summarization tend to lose?", b: "Exact numbers, percentages, dates, order IDs and customer-stated expectations. They get compressed into vague prose." },
    { f: "The fix for losing exact transactional facts?", b: "A persistent “case facts” block (amounts, dates, IDs, statuses) included in every prompt, outside the summarized history." },
    { f: "Lost in the middle: what is it, and the mitigation?", b: "Models use the start and end of long inputs most reliably. Put a key-findings summary first and use explicit section headers." },
    { f: "Order lookups return 40+ fields, and 5 matter. What do you do?", b: "Trim tool output to the relevant fields before it enters context, in the tool or in a PostToolUse hook." },
    { f: "Long exploration: Claude starts citing “typical patterns” instead of the actual classes. Remedies?", b: "Scratchpad files for key findings, Explore or other subagents for verbose discovery, phase summaries injected into new contexts, and /compact. (Today Claude Code also compacts automatically near the context limit.)" },
    { f: "Crash recovery in multi-agent systems?", b: "Each agent exports state to a known location; on resume the coordinator loads a manifest and injects the relevant state into agent prompts." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: attention is finite",
      html: `
<p class="lede">A context window isn't a hard drive. Everything in it competes for the model's attention, and position matters. Context management decides what goes in, in what form, and where.</p>
<h3>Four ways long conversations go wrong</h3>
<ul>
<li><strong>Summaries lose specifics.</strong> “Customer was promised a $247.83 refund on order #8812 by Friday” becomes “customer discussed a refund.” When they ask “where's my $247.83?”, the agent can't answer.</li>
<li><strong>Tool output crowds out everything else.</strong> An order lookup returns 40+ fields; the return workflow needs 5. Over twenty turns, those unused fields can fill most of the context (illustrative).</li>
<li><strong>The middle gets skipped.</strong> Models reliably use the beginning and end of long inputs and may miss findings buried in the middle.</li>
<li><strong>History isn't sent.</strong> If prior turns aren't in the request, they don't exist for the model (Module 1).</li>
</ul>
<h3>The fixes</h3>
<ul>
<li><strong>A case-facts block.</strong> Extract amounts, dates, order numbers and statuses into a structured block sent with every prompt, <em>outside</em> the summarized history. For multi-issue sessions, keep one entry per issue.</li>
<li><strong>Trim at the source.</strong> Keep only relevant fields before results accumulate (in the tool, or with a <code>PostToolUse</code> hook).</li>
<li><strong>Choose how history shrinks.</strong> A <em>sliding window</em> keeps the last N turns verbatim and drops older ones, which is simple but forgets early commitments. <em>Progressive summarization</em> condenses older turns into a running summary, which keeps the gist but blurs exact numbers and dates. Either way, pair it with a case-facts block so the specifics survive.</li>
<li><strong>Position-aware ordering.</strong> Put a key-findings summary at the top of aggregated input, and organize detail under explicit section headers.</li>
<li><strong>Structured handoffs between agents.</strong> If a downstream agent has a tight budget, have upstream agents return key facts, citations and relevance scores, not verbose reasoning. Ask subagents for metadata too (dates, source locations, methodology).</li>
</ul>
<!-- ex:m07-case-facts -->
<h3>In practice: keep facts exact, trim the rest</h3>
<p>A <strong>case-facts block</strong> holds the values that must not drift. Your code keeps it up to date and re-sends it every turn, instead of relying on a summary of the conversation:</p>
<pre class="code"><code><span class="c">## Case facts (verbatim; re-sent every turn)</span>
customer_id: C-20931 (identity verified)
order: A-1042, shipped 2026-03-02
agreed: refund $84.20 to the original card
open: customer also wants a replacement charger</code></pre>
<!-- ex:m07-trim -->
<p>And trim tool results before they reach the model:</p>
<pre class="code"><code><span class="c"># Raw result: 40 fields, about 1,800 tokens</span>
{<span class="s">"order_id"</span>: <span class="s">"A-1042"</span>, <span class="s">"warehouse_bin"</span>: <span class="s">"R7-14"</span>, <span class="s">"carrier_route"</span>: <span class="s">"…"</span>, …}

<span class="c"># What your code passes on</span>
{<span class="s">"order_id"</span>: <span class="s">"A-1042"</span>, <span class="s">"status"</span>: <span class="s">"shipped"</span>, <span class="s">"delivery"</span>: <span class="s">"2026-03-06"</span>,
 <span class="s">"items"</span>: [<span class="s">"USB-C charger"</span>], <span class="s">"total"</span>: <span class="k">84.20</span>}</code></pre>`
    },
    {
      kind: "widget",
      title: "Watch the context fill",
      intro: "A long support conversation with an order lookup on every turn. Drag the turn count, then turn on each technique.",
      widget: "contextBudget"
    },
    {
      kind: "read",
      title: "Long codebase exploration",
      html: `
<p class="lede">Hours-long exploration sessions degrade in a recognizable way. The model starts giving inconsistent answers and talks about “typical patterns” instead of the specific classes it found earlier.</p>
<div class="callout key"><div class="callout-label">Why it exists</div><ul style="margin:0;padding-left:18px"><li><strong>Problem before.</strong> long sessions fill the context window; older details fade from attention or get summarized away, and a crash loses everything in memory.</li><li><strong>The tools.</strong> <strong>/compact</strong> summarizes the conversation so far to free space (Claude Code also does this automatically near the limit); a <strong>scratchpad file</strong> keeps key findings outside the conversation; the <strong>Explore subagent</strong> is a built-in, read-only subagent that does verbose searching in its own context and returns only a summary.</li><li><strong>Crash recovery.</strong> each agent writes its state to a known file, and a <em>manifest</em> lists them, e.g. <code>{"agent": "pricing", "status": "done", "output": "out/pricing.json"}</code>. On restart the coordinator reads the manifest and resumes only unfinished work.</li><li><strong>Which to use.</strong> compaction for one long conversation, a scratchpad for facts you'll need again, Explore for noisy discovery, manifests for multi-agent jobs that must survive a crash.</li></ul></div>
<div class="mech">
<div><span class="tag">Persist</span><h4>Scratchpad files</h4><p>Have the agent record key findings (files, data flow, confirmed facts) in a file and refer back to it. Facts survive context boundaries.</p></div>
<div><span class="tag">Isolate</span><h4>Subagents</h4><p>Send verbose discovery to subagents (“find all test files,” “trace the refund flow”). The <strong>Explore</strong> subagent exists for this. The main agent keeps the high-level picture.</p></div>
<div><span class="tag">Compress</span><h4>Phase summaries and <code>/compact</code></h4><p>Summarize one phase before spawning the next phase's subagents, and inject the summary. Use <code>/compact</code> when context fills with discovery output.</p></div>
</div>
<h3>Crash recovery</h3>
<p>For long multi-agent jobs, have each agent <strong>export its state to a known location</strong>. On resume, the coordinator loads a <strong>manifest</strong> and injects the relevant state into each agent's prompt. Don't replay every transcript.</p>
<!-- panel:m07-explore -->
<div class="callout key"><div class="callout-label">The Explore subagent</div><ul style="margin:0;padding-left:18px"><li><strong>What it is.</strong> a built-in Claude Code subagent for searching and reading a codebase. It works in its own context with read-only tools and returns a summary.</li><li><strong>Why it exists.</strong> discovery produces pages of file listings and search output. Keeping that out of the main session leaves room for the actual work.</li><li><strong>Why read-only.</strong> its job is finding things, so it can't change files by mistake.</li><li><strong>How you use it.</strong> Claude Code uses it on its own for broad searches, and you can also ask for it (“use the Explore agent to find where config is loaded”).</li></ul></div>

<!-- panel:m07-crash -->
<div class="callout key"><div class="callout-label">Surviving a crash</div><ul style="margin:0;padding-left:18px"><li><strong>Problem.</strong> a long multi-agent job dies at hour three. Replaying the whole transcript is slow, may not fit, and carries stale results.</li><li><strong>What to do.</strong> after each unit of work, each agent writes its state to a manifest file: the task, the items done, where results are, and the next step.</li><li><strong>Restart.</strong> the coordinator reads the manifest, resumes from the next unfinished item, and passes the saved state to fresh agents.</li><li><strong>Tradeoff.</strong> a manifest is small and exact; a transcript is complete but large. On the exam, the manifest is the answer.</li></ul></div>

<!-- panel:m07-compact -->
<div class="callout key"><div class="callout-label">What <code>/compact</code> costs</div><ul style="margin:0;padding-left:18px"><li><strong>What it does.</strong> summarizes the conversation so far and carries on from the summary.</li><li><strong>The cost.</strong> it's lossy: exact values and specific findings can vanish into the summary.</li><li><strong>Use it when.</strong> a long session is full of verbose output whose details you no longer need.</li><li><strong>Use something else when.</strong> values must stay exact (a case-facts block or a scratchpad file), or a new phase is starting (a phase summary passed into a fresh context).</li></ul></div>
`
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q07-1", ts: "5.1", scenario: 1,
          stem: "In a 40-turn support session with progressive summarization, the customer asks, “So the $312.40 credit will post by the 14th, right?” The agent replies vaguely that a credit was discussed. Best fix?",
          options: [
            { t: "Stop summarizing and send the complete 40-turn transcript on every turn so nothing is ever lost.", why: "Misconception: avoid summarization at any cost. Full history is the baseline; at 40 turns it costs more, and important details can still get lost in the middle." },
            { t: "Keep a persistent case-facts section (amounts, dates, IDs, commitments) in every prompt.", ok: true, why: "Facts kept outside the summarized history survive summarization." },
            { t: "Instruct the summarizer to keep every number and date it sees, verbatim, in each summary.", trap: "T9", why: "Summaries still compress and drift; key facts need a dedicated place." },
            { t: "Have the agent search the transcript store whenever the customer mentions an amount or a date.", why: "Adds a lookup per turn and still depends on the agent noticing it needs one." }
          ]
        },
        {
          id: "q07-2", ts: "5.1", scenario: 1,
          stem: "Each <code>lookup_order</code> call returns 47 fields, and the returns workflow uses 5 (status, delivery date, items, price paid, return eligibility). After 15 turns, latency and cost have tripled. Best change?",
          options: [
            { t: "Trim each result down to the 5 fields the workflow uses as it's appended to context.", ok: true, why: "Verbose tool output accumulates. Keep only what the task needs." },
            { t: "Move to a model with a larger context window to absorb the growth over long sessions.", trap: "T3", why: "Cost and latency still grow; more room doesn't remove the waste." },
            { t: "Tell Claude in the system prompt to ignore all fields except status, dates, items, price and eligibility.", trap: "T9", why: "The fields are still in context, so you still pay for them every turn." },
            { t: "Cache <code>lookup_order</code> results and call it only when the order number changes.", why: "Fewer calls, but each result still drags 47 fields into context." }
          ]
        },
        {
          id: "q07-3", ts: "5.1", scenario: 3,
          stem: "A synthesis prompt concatenates 12 subagent reports. Final reports consistently miss findings from reports 5 to 8. Most effective change?",
          options: [
            { t: "Use a model with a 1M-token context window so all 12 reports fit comfortably.", trap: "T3", why: "They already fit. The problem is attention to the middle of a long input." },
            { t: "Put a key-findings summary first, and give each of the 12 reports its own header.", ok: true, why: "Position-aware ordering and clear structure counter lost-in-the-middle effects." },
            { t: "Randomize the order of the 12 reports on each run so no report is always stuck in the middle.", why: "Spreads the misses around instead of preventing them." },
            { t: "Send only the 4 reports the coordinator rates most important, and drop the other 8.", why: "Loses findings outright." }
          ]
        },
        {
          id: "q07-4", ts: "5.4", scenario: 2,
          stem: "Three hours into mapping a legacy codebase, Claude describes “the service layer typically handles validation” although it earlier identified the specific <code>LedgerGuard</code> class that does. What helps most?",
          options: [
            { t: "Keep a <code>findings.md</code> scratchpad of key discoveries and consult it later.", ok: true, why: "Persisting findings outside the conversation counters context degradation in long sessions." },
            { t: "Tell Claude to stop generalizing and to name only classes it has actually opened and read.", trap: "T9", why: "The specific detail has faded from attention; an instruction doesn't bring it back." },
            { t: "Upgrade to a larger model, which holds specific details better over a three-hour session.", trap: "T3", why: "Any model's attention to early details degrades as context grows." },
            { t: "Restart the session and have Claude re-read the whole codebase from the beginning.", why: "Throws away three hours of work, and the same fade will happen again." }
          ]
        },
        {
          id: "q07-5", ts: "5.4", scenario: 2,
          stem: "Before a large refactor, Claude must survey 600 files to find every place feature flags are read. You still need the main session's context for planning afterward. Best approach?",
          options: [
            { t: "Have the main session Grep and Read all 600 files directly, then plan with the results in front of it.", why: "Floods the main context you need for planning." },
            { t: "Use the Explore subagent for the 600-file survey and bring back a concise summary.", ok: true, why: "Verbose discovery runs in an isolated context and returns only the summary." },
            { t: "Run <code>/compact</code> first, then survey the files in the main session.", why: "Compacts what's there now; the 600-file survey still floods context afterwards." },
            { t: "Split the survey across 6 separate sessions, 100 files each, and start planning in a seventh.", why: "Without summaries carried over, the planning session sees none of the findings." }
          ]
        },
        {
          id: "q07-6", ts: "5.4", scenario: 3,
          stem: "A six-agent overnight analysis crashed at agent 4. Restarting from scratch costs hours. What design enables recovery?",
          options: [
            { t: "Every agent saves its state to a known location, and on resume the coordinator loads a manifest and injects that state.", ok: true, why: "Structured state persistence makes crash recovery possible without redoing work." },
            { t: "On restart, replay every agent's full transcript into the coordinator so it can work out where things stopped.", why: "Huge, noisy context, and it relies on inference rather than recorded state." },
            { t: "Run all six agents inside one long session so their state lives in a single shared context.", trap: "T5", why: "Loses isolation and still loses everything on a crash." },
            { t: "Automatically retry the whole job from the beginning whenever it crashes.", trap: "T6", why: "Repeats hours of completed work." }
          ]
        },
        {
          id: "q07-7", ts: "5.1", scenario: 3,
          stem: "The report-writing agent has a tight context budget. Upstream analysis agents send 3,000-word narratives including their chain of reasoning. Reports omit key numbers. What should upstream agents return?",
          options: [
            { t: "Key facts, citations and relevance scores as structured output, with dates and source locations.", ok: true, why: "Compact structured data fits the downstream budget and keeps provenance." },
            { t: "The same 3,000-word narratives, which the writing agent compresses itself before it starts writing.", why: "Spends the writer's tight budget on reading and compressing." },
            { t: "Only their final conclusions, with sources and reasoning removed to save space.", why: "Loses the citations the report needs." },
            { t: "Longer narratives with more detail and reasoning, so nothing important is missed downstream.", trap: "T3", why: "Makes the budget problem worse." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Context is attention, not storage. What's in it, its form and its position all matter.",
        "Summaries lose numbers, dates and commitments. Keep a case-facts block outside them.",
        "Trim tool output to relevant fields before it accumulates.",
        "Lost in the middle: key findings first, explicit section headers.",
        "Upstream agents send structured facts, citations and metadata to budget-limited downstream agents.",
        "Long exploration: scratchpads, Explore subagents, phase summaries, /compact. Use manifests for crash recovery."
      ]
    }
  ]
};
