window.LESSONS.m06 = {
  cards: [
    { f: "A coordinator says it is delegating, but no subagent runs. Likely cause?", b: "Its allowedTools doesn't include \"Task\" (the subagent-spawning tool; it's called Agent in current Claude Code)." },
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
<div class="callout today"><div class="callout-label">Real world today</div><p>Current Claude Code calls the Task tool <code>Agent</code> (<code>Task</code> still works as an alias), and subagents can nest a few levels deep. The exam uses “Task” and hub-and-spoke, so answer in those terms.</p></div>`
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
          stem: "A coordinator's logs show “Delegating literature search to the search specialist,” but no subagent ever runs, and the coordinator then answers from its own knowledge. What is the most likely cause?",
          options: [
            { t: "The search subagent's description is too vague.", trap: "T7", why: "A vague description would cause a wrong choice, not a total failure to spawn." },
            { t: "The coordinator's <code>allowedTools</code> doesn't include <code>\"Task\"</code>.", ok: true, why: "Without the Task tool, the coordinator can only describe delegation." },
            { t: "Subagents need a larger context window.", trap: "T3", why: "Nothing was spawned, so context size isn't the issue." },
            { t: "The coordinator needs “always delegate” in its prompt.", trap: "T1", why: "It already tried to delegate. It lacks the mechanism." }
          ]
        },
        {
          id: "q06-2", ts: "1.3", scenario: 3,
          stem: "Two research subagents are independent, yet total research time equals the sum of both. Logs show the coordinator issues one Task call, waits for the result, then issues the next. How do you get parallel execution?",
          options: [
            { t: "Have the coordinator emit both Task calls in a single response.", ok: true, why: "Multiple Task calls in one response run in parallel." },
            { t: "Merge both subagents into one with both tool sets.", trap: "T5", why: "This loses specialization and still runs the work serially." },
            { t: "Lower each subagent's max tokens so their responses come back sooner.", why: "That shortens outputs but doesn't parallelize." },
            { t: "Use the Message Batches API for subagent calls.", why: "Batch is asynchronous with up to 24-hour latency, which is wrong for an interactive pipeline." }
          ]
        },
        {
          id: "q06-3", ts: "1.3", scenario: 3,
          stem: "The synthesis subagent writes fluent reports with no citations. Its prompt from the coordinator is “Synthesize the findings from the research phase into a report with sources.” What's the fix?",
          options: [
            { t: "Tell the synthesis agent to look harder for sources and cite each one it uses.", trap: "T9", why: "It has no findings to look at. Subagents don't inherit context." },
            { t: "Include the complete findings in the synthesis prompt as structured records (claim, source URL or document, page, date).", ok: true, why: "Context must be passed explicitly, and the structure keeps attribution intact." },
            { t: "Give the synthesis agent web search so it can find and cite its own sources.", trap: "T5", why: "This duplicates research and breaks role separation." },
            { t: "Have the synthesis agent read the coordinator's transcript to recover the research findings.", trap: "T8", why: "Subagents don't get the coordinator's history automatically." }
          ]
        },
        {
          id: "q06-4", ts: "1.2", scenario: 3,
          stem: "Every query, including “What year was the company founded?”, runs through search, document analysis, synthesis and report generation, taking about 90 seconds. What should change?",
          options: [
            { t: "Have the coordinator analyze query complexity and invoke only the subagents needed.", ok: true, why: "Dynamic selection avoids running the full pipeline for simple requests." },
            { t: "Run all four subagents in parallel for every query to cut the total time.", why: "Synthesis depends on research, and simple queries still pay for the unneeded agents." },
            { t: "Cache answers to every query so repeated questions return instantly.", why: "This helps repeats only and doesn't address the design." },
            { t: "Remove the coordinator and have the user's query call the subagents directly.", why: "This loses routing, error handling and observability." }
          ]
        },
        {
          id: "q06-5", ts: "1.2", scenario: 3,
          stem: "A report on “the future of urban mobility” covered only electric cars. Logs show the coordinator created three subtasks: EV batteries, EV charging and EV pricing. Each subagent returned high-quality results. Root cause?",
          options: [
            { t: "The search subagent's queries were too narrow and missed sources on other forms of mobility.", trap: "T7", why: "It searched exactly what it was assigned." },
            { t: "The coordinator's decomposition was too narrow, omitting transit, micromobility, rail and urban planning.", ok: true, why: "When every subagent succeeds and coverage is missing, look at the decomposition." },
            { t: "The synthesis subagent failed to notice and fill the gaps in the findings it received.", trap: "T7", why: "Synthesis could add a gap check, but the gap originated in the coordinator's plan." },
            { t: "The model needs a larger context window to handle a topic this broad.", trap: "T3", why: "Capacity isn't the issue." }
          ]
        },
        {
          id: "q06-6", ts: "1.2", scenario: 3,
          stem: "After synthesis, the coordinator notices the report has nothing on regulatory risk, which the user asked about. What should it do?",
          options: [
            { t: "Ship the report now and note that regulatory risk wasn't covered.", why: "Acceptable only if no further research is possible. Here it is." },
            { t: "Ask the synthesis agent to add a regulatory section from its general knowledge.", why: "That produces uncited, possibly fabricated content." },
            { t: "Re-delegate targeted queries on regulatory risk to the search and analysis subagents, then re-run synthesis.", ok: true, why: "This is the iterative refinement loop: evaluate gaps, re-delegate, re-synthesize." },
            { t: "Restart the entire research run from scratch with a larger budget and more subagents.", why: "Wasteful. Target the gap." }
          ]
        },
        {
          id: "q06-7", ts: "1.6", scenario: 4,
          stem: "A developer asks the agent to “add comprehensive tests to this 10-year-old billing service.” How should the work be decomposed?",
          options: [
            { t: "Use a fixed chain that writes tests for every file in alphabetical order until all are covered.", why: "This ignores risk and dependencies. Open-ended work needs adaptive planning." },
            { t: "Map the structure, identify high-impact areas, make a prioritized plan, and adapt it as dependencies are discovered.", ok: true, why: "Dynamic decomposition suits open-ended investigation." },
            { t: "Ask the developer for a complete list of every function that needs tests before starting.", why: "This pushes the analysis back onto the developer." },
            { t: "Spawn one subagent per file all at once so every file gets tests in parallel.", why: "There's no prioritization, and files that depend on each other get analyzed blind." }
          ]
        },
        {
          id: "q06-8", ts: "1.3", scenario: 3,
          stem: "The coordinator gives the search subagent a 14-step procedure (“1. Search Google Scholar. 2. Open top 3 results…”). It fails when the best sources are government datasets the procedure never mentions. Better prompt design?",
          options: [
            { t: "Add more steps to the procedure covering government datasets and other source types.", why: "There will always be another unanticipated source type." },
            { t: "Specify the research goal and quality criteria (recency, credibility, coverage), and let the subagent choose its approach.", ok: true, why: "Goals and criteria let subagents adapt. Procedures make them brittle." },
            { t: "Give the search subagent every available tool so it can handle any kind of source.", trap: "T5", why: "The rigid prompt is the constraint, not the tools." },
            { t: "Replace the search subagent with a fixed script that follows the procedure exactly.", why: "This removes the adaptability the subagent provides." }
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
