window.LESSONS.m06 = {
  cards: [
    { f: "A coordinator says it is delegating, but no subagent runs. Likely cause?", b: "Exam answer: its allowedTools doesn't include \"Task\" (the subagent-spawning tool). Today the tool is called Agent and allowedTools only pre-approves tools, so check the subagent's description too." },
    { f: "How do you run subagents in parallel?", b: "Emit multiple Task calls in a single coordinator response, not one per turn." },
    { f: "What does a subagent know about the coordinator's conversation?", b: "Nothing automatically. Its context is its AgentDefinition plus the prompt the coordinator writes, so include prior findings explicitly." },
    { f: "Every subagent succeeded but the report misses whole subtopics. Root cause?", b: "The coordinator's task decomposition was too narrow." },
    { f: "Prompt chaining vs dynamic decomposition?", b: "Chaining for predictable, fixed multi-step work (e.g. per-file review, then an integration pass). Dynamic for open-ended investigation where findings change the plan." },
    { f: "Hub-and-spoke means…", b: "The coordinator routes all communication between subagents, giving observability, consistent error handling and controlled information flow." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: isolated context is a feature",
      html: `
<p class="lede">A subagent starts with an empty conversation. It sees only its own definition (system prompt, allowed tools) and the prompt the coordinator writes for it. It does <em>not</em> inherit the coordinator's history or share memory with other subagents.</p>
<p>That isolation is the point. Verbose search results stay out of the coordinator's context, and each specialist gets a focused prompt and a small tool set. The cost is that <strong>you must pass everything a subagent needs, explicitly.</strong></p>
<h3>The mechanics</h3>
<ul>
<li>Subagents are spawned with the <strong>Task tool</strong>. A coordinator can only delegate if its <code>allowedTools</code> includes <code>"Task"</code>.</li>
<li>Each subagent type is defined by an <strong><code>AgentDefinition</code></strong>: a description (used to decide when to call it), a system prompt, and restricted tools.</li>
<li><strong>Parallelism comes from multiple Task calls in one response.</strong> One call per turn runs them one after another.</li>
<li>Pass prior results <strong>in full, as structured data</strong> that separates content from metadata (URL, document, page, date), so attribution survives.</li>
<li>Give subagents <strong>goals and quality criteria</strong>, not step-by-step procedures, so they can adapt to what they find.</li>
</ul>
<div class="callout today"><div class="callout-label">Real world today</div><p>Current Claude Code calls the Task tool <code>Agent</code> (<code>Task</code> still works as an alias), and subagents can nest a few levels deep. In today's Agent SDK, <code>allowedTools</code> <em>pre-approves</em> tools rather than gating them, so a coordinator can often delegate without listing <code>"Task"</code>; a vague subagent description is now a common reason Claude answers directly instead of delegating. Subagents also start in the background by default. The exam uses “Task”, an <code>allowedTools</code> gate and hub-and-spoke, so answer in those terms. See <a href="#today">Exam vs. today</a>.</p></div>`
    },
    {
      kind: "widget",
      title: "What does each agent see?",
      intro: "A research coordinator, two research subagents and a synthesis subagent. Toggle the three settings and watch what lands in each context window.",
      widget: "contextViewer"
    },
    {
      kind: "read",
      title: "What a good coordinator does",
      html: `
<p class="lede">In hub-and-spoke designs, the coordinator owns decomposition, delegation, routing, error handling and aggregation. Subagents never talk to each other directly.</p>
<ul>
<li><strong>Choose subagents dynamically.</strong> A simple factual query doesn't need all four specialists. Routing everything through the full pipeline adds latency and cost.</li>
<li><strong>Partition scope.</strong> Give each subagent a distinct subtopic or source type so they don't duplicate work.</li>
<li><strong>Decompose broadly enough.</strong> “Climate adaptation in agriculture” split into drip irrigation, sprinkler systems and irrigation scheduling produces three successful subagents and a report that never mentions crop breeding, soil health or insurance. When every subagent did its job and coverage is still missing, <strong>the decomposition is the root cause</strong>, not the agents downstream.</li>
<li><strong>Refine iteratively.</strong> Evaluate the synthesis for gaps, re-delegate targeted queries to the research subagents, and re-synthesize until coverage is sufficient.</li>
</ul>
<h3>Choosing a decomposition pattern</h3>
<div class="table-wrap"><table>
<thead><tr><th>Pattern</th><th>When</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Prompt chaining (fixed steps)</td><td>The steps are predictable</td><td>Review each file for local issues, then run one cross-file integration pass</td></tr>
<tr><td>Dynamic decomposition</td><td>The next step depends on what you find</td><td>“Add tests to this legacy codebase”: map the structure, find high-impact areas, plan by priority, adapt as dependencies appear</td></tr>
</tbody></table></div>`
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q06-1", ts: "1.3", scenario: 3,
          stem: "A coordinator's logs show “Delegating literature search to the search specialist,” but no subagent ever runs, and the coordinator then answers from its own knowledge. The same subagent definitions are delegated to reliably by a second coordinator that was configured separately. What is the most likely cause?",
          options: [
            { t: "The search subagent's description is too vague for the coordinator to match it to the task.", trap: "T7", why: "Vague descriptions do make Claude skip delegation, but the same definitions work under another coordinator, so the difference is in this coordinator's configuration." },
            { t: "The coordinator's <code>allowedTools</code> doesn't include <code>\"Task\"</code>.", ok: true, why: "Exam framing: without the Task tool, the coordinator can only describe delegation. (Today the tool is named Agent and allowedTools pre-approves rather than gates; see Exam vs. today.)" },
            { t: "The coordinator's <code>maxTurns</code> is too low, so its run ends before the subagent call can be made.", why: "The coordinator kept going and answered the question, so it wasn't stopped by a turn limit." },
            { t: "The subagent's AgentDefinition lists <code>tools</code> the search doesn't use, so it exits as soon as it starts.", why: "The subagent never ran at all, and the same definition works under the other coordinator." }
          ]
        },
        {
          id: "q06-2", ts: "1.3", scenario: 3,
          stem: "Two research subagents are independent, yet total research time equals the sum of both. Logs show the coordinator issues one Task call, waits for the result, then issues the next. How do you get parallel execution?",
          options: [
            { t: "Have the coordinator emit both Task calls together in a single response.", ok: true, why: "Several Task calls in a single response run in parallel." },
            { t: "Give each research thread its own coordinator, so the two subagents run inside separate agent loops.", why: "Adds orchestration layers without fixing the cause: the coordinator issues calls one at a time." },
            { t: "Send the subagent calls through the Message Batches API so they're processed together.", why: "Batches can take up to 24 hours and don't run multi-turn tool loops. Wrong tool for interactive research." },
            { t: "Lower each subagent's <code>max_tokens</code> so that each one returns sooner.", why: "They'd still run back to back, and their answers might be cut off." }
          ]
        },
        {
          id: "q06-3", ts: "1.3", scenario: 3,
          stem: "The synthesis subagent writes fluent reports with no citations. Its prompt from the coordinator is “Synthesize the findings from the research phase into a report with sources.” What's the fix?",
          options: [
            { t: "Instruct the synthesis agent to attach a source to every claim it makes in the report.", trap: "T9", why: "It can't cite sources it was never given." },
            { t: "Pass all the findings in the synthesis prompt as structured records with source, page and date.", ok: true, why: "Subagents only know what they're passed. Structured records keep attribution intact." },
            { t: "Give the synthesis agent a <code>web_search</code> tool, so it can find a source and add a structured citation for each claim itself.", trap: "T5", why: "It would redo research and could attach sources that differ from where the findings came from." },
            { t: "Let it read the research subagents' session transcripts through the coordinator's shared memory to recover sources.", why: "Subagents have isolated contexts. Nothing is shared unless the coordinator passes it." }
          ]
        },
        {
          id: "q06-4", ts: "1.2", scenario: 3,
          stem: "Every query, including “What year was the company founded?”, runs through search, document analysis, synthesis and report generation, taking about 90 seconds. What should change?",
          options: [
            { t: "Have the coordinator assess each query's complexity and invoke only the subagents that query needs.", ok: true, why: "Routing by complexity is the coordinator's job. Simple questions don't need the full pipeline." },
            { t: "Run all four subagents in parallel for every query, so total time drops to that of the slowest one.", why: "Faster, but still wasteful. A founding-year question needs no pipeline at all." },
            { t: "Add a cache keyed on query text, so repeated questions skip the pipeline entirely.", why: "Helps only with repeats. First-time simple questions still take 90 seconds." },
            { t: "Put a fast classifier model in front that routes simple queries to a direct-answer path.", trap: "T2", why: "Extra infrastructure for a decision the coordinator is already positioned to make." }
          ]
        },
        {
          id: "q06-5", ts: "1.2", scenario: 3,
          stem: "To get broader coverage, a coordinator sends the same prompt, “Research AI's impact on healthcare,” to three search subagents. Their results overlap by about 70%, and research costs have tripled. What should change?",
          options: [
            { t: "Give each subagent a distinct slice of the topic, such as diagnostics, drug discovery or hospital operations and billing.", ok: true, why: "Partition the scope so parallel subagents cover different ground instead of duplicating work." },
            { t: "Point each subagent at a different search backend (Scholar, PubMed, news), so each surfaces different sources.", why: "Different engines still return the same subtopics. The overlap is in scope, not in sources." },
            { t: "Deduplicate the overlapping results in the synthesis step before the report is written.", trap: "T7", why: "Hides the duplication but still pays for it three times, and adds no coverage." },
            { t: "Replace the three with one search subagent that has three times the <code>max_tokens</code> budget.", trap: "T3", why: "Loses parallelism and puts everything in one context. The fix is a better decomposition." }
          ]
        },
        {
          id: "q06-6", ts: "1.2", scenario: 3,
          stem: "After synthesis, the coordinator notices the report has nothing on regulatory risk, which the user asked about. What should it do?",
          options: [
            { t: "Ship it with a coverage note, stating that regulatory risk wasn't researched, so the user can follow up.", why: "Coverage notes suit gaps you can't fill. The user asked for this, and it can be filled." },
            { t: "Ask the synthesis agent to add a regulatory section from its general knowledge.", why: "Unsourced content breaks provenance and may be wrong." },
            { t: "Re-delegate targeted regulatory-risk queries to the search and analysis subagents, then re-run synthesis with the new findings.", ok: true, why: "The coordinator evaluates gaps and re-delegates only what's missing: the iterative refinement loop." },
            { t: "Re-run the full pipeline, adding “emphasize regulation” to the coordinator's prompt.", why: "Repeats completed work. A targeted follow-up is cheaper and faster." }
          ]
        },
        {
          id: "q06-7", ts: "1.6", scenario: 4,
          stem: "A developer asks the agent to “add comprehensive tests to this 10-year-old billing service.” How should the work be decomposed?",
          options: [
            { t: "A fixed prompt chain: list files, generate tests for each, run <code>pytest</code>, then fix failures until the suite passes.", why: "Fixed chains suit predictable work. Legacy code needs re-planning as dependencies and risks surface." },
            { t: "Map the codebase, find the high-impact areas, plan tests by priority, and adapt the plan as hidden dependencies surface.", ok: true, why: "Open-ended work on unfamiliar code calls for dynamic, adaptive decomposition." },
            { t: "Spawn one subagent per file in parallel, so every file gets tests at the same time.", why: "Ignores priority and cross-file dependencies, and spreads effort evenly where risk isn't even." },
            { t: "Ask the developer for a list of the functions to test before doing anything else.", why: "Pushes the investigation back onto the developer. The agent can explore the code itself." }
          ]
        },
        {
          id: "q06-8", ts: "1.3", scenario: 3,
          stem: "The coordinator gives the search subagent a 14-step procedure (“1. Search Google Scholar. 2. Open top 3 results…”). It fails when the best sources are government datasets the procedure never mentions. Better prompt design?",
          options: [
            { t: "Extend the procedure with steps for government datasets (data.gov, Eurostat), preprint servers and industry reports.", why: "Patching the list fails again on the next source nobody listed." },
            { t: "Give it the research goal and quality criteria, and let it choose its own approach.", ok: true, why: "Goals and criteria let the subagent adapt; rigid procedures break on cases they didn't anticipate." },
            { t: "Give the search subagent every available tool so it can reach any kind of source.", trap: "T5", why: "More tools make selection worse, and the procedure would still steer it away from datasets." },
            { t: "Pass a ranked allowlist of credible sources (journals, agencies, datasets) for the subagent to search in order.", why: "Still an enumeration: the best source for a new question may not be on the list." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Subagents start empty: AgentDefinition + the prompt you write. Pass findings explicitly and in structure.",
        "Delegation requires \"Task\" in the coordinator's allowedTools.",
        "Parallel = multiple Task calls in one response.",
        "Hub-and-spoke: the coordinator routes everything. Select subagents dynamically and partition scope.",
        "Missing coverage with successful subagents points to narrow decomposition.",
        "Prompt subagents with goals and criteria; refine iteratively; chain predictable work, decompose open-ended work."
      ]
    }
  ]
};
