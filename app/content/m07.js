window.LESSONS.m07 = {
  cards: [
    { f: "What does progressive summarization tend to lose?", b: "Exact numbers, percentages, dates, order IDs and customer-stated expectations. They get compressed into vague prose." },
    { f: "The fix for losing exact transactional facts?", b: "A persistent “case facts” block (amounts, dates, IDs, statuses) included in every prompt, outside the summarized history." },
    { f: "Lost in the middle: what is it, and the mitigation?", b: "Models use the start and end of long inputs most reliably. Put a key-findings summary first and use explicit section headers." },
    { f: "Order lookups return 40+ fields, and 5 matter. What do you do?", b: "Trim tool output to the relevant fields before it enters context, in the tool or in a PostToolUse hook." },
    { f: "Long exploration: Claude starts citing “typical patterns” instead of the actual classes. Remedies?", b: "Scratchpad files for key findings, Explore or other subagents for verbose discovery, phase summaries injected into new contexts, and /compact." },
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
<li><strong>Tool output crowds out everything else.</strong> An order lookup returns 40+ fields; the return workflow needs 5. Over twenty turns, that's most of your context.</li>
<li><strong>The middle gets skipped.</strong> Models reliably use the beginning and end of long inputs and may miss findings buried in the middle.</li>
<li><strong>History isn't sent.</strong> If prior turns aren't in the request, they don't exist for the model (Module 1).</li>
</ul>
<h3>The fixes</h3>
<ul>
<li><strong>A case-facts block.</strong> Extract amounts, dates, order numbers and statuses into a structured block sent with every prompt, <em>outside</em> the summarized history. For multi-issue sessions, keep one entry per issue.</li>
<li><strong>Trim at the source.</strong> Keep only relevant fields before results accumulate (in the tool, or with a <code>PostToolUse</code> hook).</li>
<li><strong>Position-aware ordering.</strong> Put a key-findings summary at the top of aggregated input, and organize detail under explicit section headers.</li>
<li><strong>Structured handoffs between agents.</strong> If a downstream agent has a tight budget, have upstream agents return key facts, citations and relevance scores, not verbose reasoning. Ask subagents for metadata too (dates, source locations, methodology).</li>
</ul>`
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
<div class="mech">
<div><span class="tag">Persist</span><h4>Scratchpad files</h4><p>Have the agent record key findings (files, data flow, confirmed facts) in a file and refer back to it. Facts survive context boundaries.</p></div>
<div><span class="tag">Isolate</span><h4>Subagents</h4><p>Send verbose discovery to subagents (“find all test files,” “trace the refund flow”). The <strong>Explore</strong> subagent exists for this. The main agent keeps the high-level picture.</p></div>
<div><span class="tag">Compress</span><h4>Phase summaries and <code>/compact</code></h4><p>Summarize one phase before spawning the next phase's subagents, and inject the summary. Use <code>/compact</code> when context fills with discovery output.</p></div>
</div>
<h3>Crash recovery</h3>
<p>For long multi-agent jobs, have each agent <strong>export its state to a known location</strong>. On resume, the coordinator loads a <strong>manifest</strong> and injects the relevant state into each agent's prompt. Don't replay every transcript.</p>`
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q07-1", ts: "5.1", scenario: 1,
          stem: "In a 40-turn support session with progressive summarization, the customer asks, “So the $312.40 credit will post by the 14th, right?” The agent replies vaguely that a credit was discussed. Best fix?",
          options: [
            { t: "Stop summarizing and send the complete transcript on every turn so nothing is ever lost.", trap: "T3", why: "This defers the problem and inflates cost and latency." },
            { t: "Keep a persistent case-facts block (amounts, dates, order IDs, commitments) in every prompt, outside the summarized history.", ok: true, why: "Exact transactional facts survive verbatim while the narrative is summarized." },
            { t: "Ask the summarizer to be more detailed and to keep every number it sees.", trap: "T9", why: "Summaries are lossy by nature. Critical facts need a structural home." },
            { t: "Look up the transcript in the database whenever the customer mentions an amount or date.", why: "Possible, but it reacts after the fact, adds latency, and may still bury the fact." }
          ]
        },
        {
          id: "q07-2", ts: "5.1", scenario: 1,
          stem: "Each <code>lookup_order</code> call returns 47 fields, and the returns workflow uses 5 (status, delivery date, items, price paid, return eligibility). After 15 turns, latency and cost have tripled. Best change?",
          options: [
            { t: "Trim each result to the relevant fields before it's appended to context.", ok: true, why: "Tool results accumulate. Keep only what the workflow needs." },
            { t: "Move to a model with a larger context window to absorb the growth.", trap: "T3", why: "You'd still pay for the 42 irrelevant fields on every turn." },
            { t: "Tell Claude in the prompt to ignore the irrelevant fields.", trap: "T9", why: "They still consume tokens and attention." },
            { t: "Call lookup_order only every other turn.", why: "This risks stale data and doesn't address payload size." }
          ]
        },
        {
          id: "q07-3", ts: "5.1", scenario: 3,
          stem: "A synthesis prompt concatenates 12 subagent reports. Final reports consistently miss findings from reports 5 to 8. Most effective change?",
          options: [
            { t: "Use a model with a larger context window so all 12 reports fit comfortably.", trap: "T3", why: "More room isn't even attention." },
            { t: "Put a key-findings summary at the top and organize the detailed reports under explicit section headers.", ok: true, why: "This mitigates the lost-in-the-middle effect through position-aware structure." },
            { t: "Randomize the report order on each run so no report is always in the middle.", why: "This moves the blind spot around instead of removing it." },
            { t: "Cut the input down to the 4 most important reports.", why: "This throws away research to dodge a structure problem." }
          ]
        },
        {
          id: "q07-4", ts: "5.4", scenario: 2,
          stem: "Three hours into mapping a legacy codebase, Claude describes “the service layer typically handles validation” although it earlier identified the specific <code>LedgerGuard</code> class that does. What helps most?",
          options: [
            { t: "Have Claude keep a scratchpad file of key findings and consult it for later questions.", ok: true, why: "Persisting findings outside the context counteracts degradation in long sessions." },
            { t: "Tell Claude to stop generalizing and refer only to classes it has actually seen.", trap: "T9", why: "The specifics are fading from usable context. An instruction doesn't restore them." },
            { t: "Upgrade to a larger model that holds details better over long sessions.", trap: "T3", why: "Degradation over a long session isn't fixed by capability." },
            { t: "Restart the session and have Claude re-read the whole codebase.", why: "Wasteful, and it degrades again the same way." }
          ]
        },
        {
          id: "q07-5", ts: "5.4", scenario: 2,
          stem: "Before a large refactor, Claude must survey 600 files to find every place feature flags are read. You still need the main session's context for planning afterward. Best approach?",
          options: [
            { t: "Have the main session Grep and Read everything directly.", why: "This floods the main context with discovery output." },
            { t: "Use the Explore subagent for discovery and bring back a concise summary.", ok: true, why: "It isolates verbose discovery and preserves the main context." },
            { t: "Run /compact before starting.", why: "Compacting helps after context fills. It doesn't keep discovery out." },
            { t: "Split the work into 6 separate sessions without summaries.", why: "This loses continuity between phases." }
          ]
        },
        {
          id: "q07-6", ts: "5.4", scenario: 3,
          stem: "A six-agent overnight analysis crashed at agent 4. Restarting from scratch costs hours. What design enables recovery?",
          options: [
            { t: "Each agent exports its state to a known location; on resume, the coordinator loads a manifest and injects relevant state into agent prompts.", ok: true, why: "Structured state persistence plus a manifest lets you resume where you stopped." },
            { t: "Replay every agent's full transcript into the coordinator on restart so it can work out where things stopped.", why: "This is expensive and floods context." },
            { t: "Run all six agents inside one long session so their state lives in a single context.", trap: "T5", why: "One giant context loses the isolation benefits and still crashes." },
            { t: "Retry the whole job automatically from the beginning whenever it crashes.", trap: "T6", why: "This repeats completed work." }
          ]
        },
        {
          id: "q07-7", ts: "5.1", scenario: 3,
          stem: "The report-writing agent has a tight context budget. Upstream analysis agents send 3,000-word narratives including their chain of reasoning. Reports omit key numbers. What should upstream agents return?",
          options: [
            { t: "Structured output: key facts, citations and relevance scores, plus metadata such as dates and source locations.", ok: true, why: "A downstream agent with a limited budget needs dense, structured inputs." },
            { t: "The same full narratives, which the writing agent compresses itself before writing.", why: "This spends the writer's budget on compression." },
            { t: "Only their final conclusions, with sources and reasoning removed to save space.", why: "This loses attribution." },
            { t: "Longer narratives with more detail, so nothing important is missed downstream.", trap: "T3", why: "This makes the budget problem worse." }
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
