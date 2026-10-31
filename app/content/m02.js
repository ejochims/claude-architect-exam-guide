window.LESSONS.m02 = {
  cards: [
    { f: "What is the model's main signal for choosing between tools?", b: "The tool descriptions (plus names and schemas). Minimal or overlapping descriptions cause misrouting." },
    { f: "Two tools keep getting confused. First step?", b: "Rewrite and differentiate the descriptions (inputs, example queries, edge cases, when to use instead of the other). Rename if purposes overlap." },
    { f: "tool_choice \"any\" vs a named tool?", b: "\"any\" guarantees some tool call, and Claude picks which. {\"type\":\"tool\",\"name\":X} forces that specific tool." },
    { f: "Why not give every agent all 18 tools (the exam's example)?", b: "More tools means harder selection and cross-role misuse. Give each agent the 4–5 tools its role needs, plus scoped cross-role tools for frequent needs." },
    { f: "Grep vs Glob?", b: "Grep searches file contents (function names, error strings). Glob matches file paths and names (**/*.test.tsx)." },
    { f: "Edit fails because the anchor text isn't unique. Fallback?", b: "Read the full file, then Write the modified version. (Exam answer. Today a longer, unique old_string or replace_all also works.)" }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: descriptions are the interface",
      html: `
<p class="lede">Claude never sees your tool's code. It sees a name, a description and an input schema (plus any input examples), and chooses from those alone. A vague description is a bug in the interface, even though it shows up as a “reasoning” failure.</p>
<p>A description that lets Claude choose reliably says:</p>
<ul>
<li><strong>What it does</strong> and what it returns.</li>
<li><strong>Input formats</strong>, with example queries or identifiers.</li>
<li><strong>Edge cases and limits.</strong></li>
<li><strong>Boundaries:</strong> when to use it <em>instead of</em> the similar tool next to it.</li>
</ul>
<pre class="code"><code><span class="c"># Weak: two tools Claude can't tell apart</span>
get_customer: <span class="s">"Retrieves customer information"</span>
lookup_order: <span class="s">"Retrieves order details"</span>

<span class="c"># Strong: purpose, inputs, examples, boundary</span>
lookup_order: <span class="s">"Fetch one order by order number (e.g. #48213 or ORD-48213):
  status, items, shipping, refund eligibility. Use for any question about a
  specific order. Use get_customer only for account-level details
  (contact info, tier, verification) when no order number is given."</span></code></pre>
<h3>When descriptions aren't enough</h3>
<ul>
<li><strong>Rename overlapping tools.</strong> <code>analyze_content</code> and <code>analyze_document</code> invite confusion. <code>extract_web_results</code> and <code>extract_pdf_tables</code> don't.</li>
<li><strong>Split generic tools</strong> (exam framing; today's tool docs also endorse grouping closely related operations behind an <code>action</code> parameter) into purpose-specific ones with clear contracts: <code>analyze_document</code> becomes <code>extract_data_points</code>, <code>summarize_content</code> and <code>verify_claim_against_source</code>.</li>
<li><strong>Check the system prompt.</strong> A line like “whenever a customer mentions their account, start with get_customer” can override a perfect description and misroute order questions.</li>
</ul>`
    },
    {
      kind: "read",
      title: "Fewer tools per agent, and tool_choice",
      html: `
<p class="lede">Selection accuracy falls as options grow. In the exam's example, an agent with 18 tools makes more mistakes than one with 4–5, and an agent with tools outside its role tends to use them: a synthesis agent with web search starts searching instead of synthesizing.</p>
<ul>
<li><strong>Scope tools to the role.</strong> Each subagent gets what its job needs.</li>
<li><strong>Constrain generic tools.</strong> Replace <code>fetch_url</code> with <code>load_document</code>, which validates that the URL is a document.</li>
<li><strong>Add narrow cross-role tools for frequent needs.</strong> If synthesis often needs a quick fact check, give it a scoped <code>verify_fact</code> tool and keep deep investigations routed through the coordinator.</li>
</ul>
<h3><code>tool_choice</code></h3>
<div class="table-wrap"><table>
<thead><tr><th>Setting</th><th>Guarantee</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td><code>"auto"</code></td><td>None. Claude may reply in text</td><td>General assistants</td></tr>
<tr><td><code>"any"</code></td><td>Some tool is called; Claude picks which</td><td>Several extraction schemas, document type unknown</td></tr>
<tr><td><code>{"type": "tool", "name": "…"}</code></td><td>That exact tool is called</td><td>A step that must run first (e.g. <code>extract_metadata</code>), with later steps in follow-up turns</td></tr>
<tr><td><code>"none"</code></td><td>No tool is called</td><td>A text-only step</td></tr>
</tbody></table></div>
<div class="callout today"><div class="callout-label">Real world today</div><p>Not every model accepts forced tool use. On Claude Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1, and with manual extended thinking, <code>"any"</code> and a named tool return a 400 error. The documented alternative is <code>"auto"</code> plus <code>strict: true</code> tool definitions, or structured outputs. The exam's answer is still the table above, so use it on the exam. See <a href="#today">Exam vs. today</a>.</p></div>
<!-- ex:m02-tool-choice -->
<h3>The four <code>tool_choice</code> settings</h3>
<p>Set it in the request next to <code>tools</code>:</p>
<pre class="code"><code><span class="s">"tool_choice"</span>: {<span class="s">"type"</span>: <span class="s">"auto"</span>}                              <span class="c"># default: Claude decides, may reply in text</span>
<span class="s">"tool_choice"</span>: {<span class="s">"type"</span>: <span class="s">"any"</span>}                               <span class="c"># must call a tool; Claude picks which</span>
<span class="s">"tool_choice"</span>: {<span class="s">"type"</span>: <span class="s">"tool"</span>, <span class="s">"name"</span>: <span class="s">"extract_invoice"</span>}   <span class="c"># must call this one tool</span>
<span class="s">"tool_choice"</span>: {<span class="s">"type"</span>: <span class="s">"none"</span>}                              <span class="c"># may not call tools this turn</span></code></pre>
<div class="callout note"><div class="callout-label">Real world today</div><p>Newer models reject a forced choice (<code>any</code> or a named tool) in some configurations. Answer the exam with the framing above; see <a href="#today">Exam vs. today</a> for details.</p></div>
<!-- panel:m02-production-rule -->
<div class="callout key"><div class="callout-label">Exam answer vs. what you build</div><ul style="margin:0;padding-left:18px"><li><strong>On the exam.</strong> a forced <code>tool_choice</code> (<code>any</code> or a named tool) is the answer when a tool call must happen.</li><li><strong>When you build today.</strong> check whether your model accepts a forced choice. If it doesn't, use <code>auto</code> with clear instructions, and guarantee the output's shape with strict tools or structured outputs.</li><li><strong>Strict tool use.</strong> with <code>strict: true</code> on a tool, the API constrains Claude's tool input to your JSON Schema, so it always parses and matches. It doesn't make the values correct; Module 9 covers that.</li></ul></div>
`
    },
    {
      kind: "widget",
      title: "Pick the tool_choice",
      intro: "For each situation, find the setting that gives the guarantee you need, and no more.",
      widget: "toolChoice"
    },
    {
      kind: "read",
      title: "The built-in tools",
      html: `
<p class="lede">Claude Code and the Agent SDK ship with Read, Write, Edit, Bash, Grep and Glob. The exam checks that you match each to its job. (Real world today: on macOS and Linux, Claude Code runs file search through Bash by default, and Edit can also take a longer unique <code>old_string</code> or <code>replace_all</code>. Answer the exam with the dedicated tools.)</p>
<div class="callout key"><div class="callout-label">Key terms</div><ul style="margin:0;padding-left:18px"><li><strong>What they are.</strong> the tools Claude Code ships with: <strong>Read</strong> (open a file), <strong>Write</strong> (create a file), <strong>Edit</strong> (replace a unique text span), <strong>Bash</strong> (run a shell command), <strong>Grep</strong> (search file contents), <strong>Glob</strong> (find files by name pattern), plus web tools and the subagent tool.</li><li><strong>Why separate tools.</strong> a narrow tool with a clear purpose is easier for the model to choose correctly and easier for you to permit or block than one general shell.</li><li><strong>Neighbors.</strong> MCP tools add capabilities from outside systems and compete with built-ins for selection, which is why their descriptions must say when they're the better choice.</li></ul></div>
<div class="table-wrap"><table>
<thead><tr><th>Need</th><th>Tool</th></tr></thead>
<tbody>
<tr><td>Search file <em>contents</em>: callers of a function, an error string, an import</td><td><code>Grep</code></td></tr>
<tr><td>Find files by <em>path or name</em>: <code>**/*.test.tsx</code></td><td><code>Glob</code></td></tr>
<tr><td>Load a whole file</td><td><code>Read</code></td></tr>
<tr><td>Targeted change with unique anchor text</td><td><code>Edit</code></td></tr>
<tr><td><code>Edit</code> fails because the anchor text isn't unique</td><td><code>Read</code> the full file, then <code>Write</code> it</td></tr>
<tr><td>Run tests, builds, git</td><td><code>Bash</code></td></tr>
</tbody></table></div>
<p><strong>Explore incrementally.</strong> Grep for an entry point, Read it, follow its imports, and trace one flow. Don't read every file up front. To trace a function that's re-exported through wrapper modules, first list every name it's exported under, then Grep for each name.</p>`
    },
    {
      kind: "widget",
      title: "Which built-in tool?",
      intro: "Choose the tool Claude should reach for first.",
      widget: "sorter",
      config: {
        cats: [{ id: "grep", label: "Grep" }, { id: "glob", label: "Glob" }, { id: "read", label: "Read" }, { id: "edit", label: "Edit" }, { id: "rw", label: "Read + Write" }, { id: "bash", label: "Bash" }],
        items: [
          ["Find every call to calculateTax( across the repo.", "grep", "Searching inside files is Grep."],
          ["List all Storybook files (*.stories.tsx) anywhere in the tree.", "glob", "Matching paths and names is Glob."],
          ["Change one validation constant that appears once in config.ts.", "edit", "A unique anchor makes Edit the precise choice."],
          ["Update a block whose text appears three times in the file; Edit keeps failing.", "rw", "When the anchor isn't unique, Read the file and Write the new version."],
          ["Run the test suite after a change.", "bash", "Executing commands is Bash."],
          ["Find where the error message “quota exceeded for tenant” is raised.", "grep", "An error string inside source files: Grep."],
          ["Open the router file you just located to follow its imports.", "read", "You know the file. Read it."]
        ]
      }
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q02-1", ts: "2.1", scenario: 3,
          stem: "A research agent uses one generic <code>analyze_document</code> tool to summarize papers, extract statistics and fact-check claims. Its outputs come back in inconsistent shapes, and downstream steps break. What should you do first?",
          options: [
            { t: "Add few-shot examples of each output shape to the agent's prompt, one for every kind of analysis.", trap: "T1", why: "Improves consistency a little, but one tool still serves three purposes with no contract for any of them." },
            { t: "Split it into purpose-specific tools such as <code>extract_statistics</code>, each with a defined output.", ok: true, why: "Purpose-specific tools with clear input and output contracts are easier to select and to consume." },
            { t: "Normalize every output into one shape with a <code>normalize_output()</code> post-processing step.", trap: "T6", why: "Patches the symptom; the mixed-purpose tool keeps producing ambiguous results." },
            { t: "Move the agent to a larger model that keeps its output format consistent across tasks.", trap: "T3", why: "The interface is ambiguous; a bigger model doesn't define a contract." }
          ]
        },
        {
          id: "q02-2", ts: "2.1", scenario: 1,
          stem: "Your tool descriptions are detailed and distinct, yet the agent calls <code>get_customer</code> when users ask “where is order #5521?”. The system prompt includes: “Whenever a customer mentions their account or an order, start by calling get_customer.” What is the most likely fix?",
          options: [
            { t: "Rewrite the tool descriptions again, adding several example customer questions to each.", trap: "T7", why: "The descriptions are already good. The system prompt is overriding them." },
            { t: "Revise the system prompt rule that ties the word “order” to <code>get_customer</code>.", ok: true, why: "Keyword-triggered instructions in the system prompt can override well-written tool descriptions." },
            { t: "Remove <code>get_customer</code> from the tools so it can't be chosen for order questions.", why: "Breaks every request that genuinely needs customer data." },
            { t: "Force <code>lookup_order</code> with <code>tool_choice</code> on every turn of the conversation.", why: "Breaks every request that isn't about an order." }
          ]
        },
        {
          id: "q02-3", ts: "2.3", scenario: 3,
          stem: "A synthesis subagent was given all 16 research tools “for flexibility.” It now runs its own web searches mid-synthesis, producing duplicate and lower-quality sources. Best change?",
          options: [
            { t: "Limit the synthesis agent to its role's tools, plus a narrow <code>verify_fact</code> tool if quick fact checks are common.", ok: true, why: "Scoped tools keep each agent in its role; a narrow tool covers the legitimate need." },
            { t: "Tell the synthesis agent in its system prompt never to call <code>web_search</code>, and to use only the findings it's given.", trap: "T1", why: "Probabilistic, while the search tools stay available to misuse." },
            { t: "Switch the synthesis agent to a more capable model that uses its 16 tools with better judgment.", trap: "T3", why: "Too many tools degrade selection whatever the model." },
            { t: "Merge search and synthesis into one agent with all 16 tools, so no handoff is needed.", trap: "T5", why: "Makes the overload worse and loses context isolation." }
          ]
        },
        {
          id: "q02-4", ts: "2.3", scenario: 6,
          stem: "An extraction pipeline must always run <code>extract_metadata</code> before enrichment tools. Sometimes Claude calls <code>enrich_with_crm</code> first. What is the most reliable fix?",
          options: [
            { t: "List <code>extract_metadata</code> first in the tools array, so Claude sees it before the enrichment tools.", why: "Tool order isn't a sequencing mechanism." },
            { t: "Force <code>extract_metadata</code> with <code>tool_choice</code> on the first request, then enrich in later turns.", ok: true, why: "Exam framing: forcing a named tool guarantees it runs first. (Today forced tool use returns 400 on some models; see Exam vs. today.)" },
            { t: "Set <code>tool_choice: \"any\"</code> on every request, so Claude always calls one of the extraction tools.", why: "Guarantees some tool call, not which one." },
            { t: "Add “ALWAYS call <code>extract_metadata</code> before any <code>enrich_*</code> tool” to the system prompt, in bold.", trap: "T1", why: "Lowers the rate but doesn't guarantee the order." }
          ]
        },
        {
          id: "q02-5", ts: "2.3", scenario: 6,
          stem: "A pipeline has <code>extract_invoice</code>, <code>extract_receipt</code> and <code>extract_contract</code>. Documents arrive unlabeled. About 4% of responses are prose summaries instead of tool calls. Fix?",
          options: [
            { t: "Keep <code>tool_choice: \"auto\"</code> and add a firm instruction to always respond with one of the extraction tools.", trap: "T1", why: "“auto” permits text. Stronger wording only lowers the rate." },
            { t: "Force <code>extract_invoice</code> on every request, since invoices are the most common document type.", why: "Mislabels every receipt and contract." },
            { t: "Set <code>tool_choice: \"any\"</code>.", ok: true, why: "A tool call is guaranteed, and Claude still picks the schema that matches. (Exam framing; on models that reject forced tool use, use auto plus strict tools.)" },
            { t: "Parse the prose summaries with regular expressions as a fallback path into the same schema.", trap: "T6", why: "Fragile, and it treats the symptom." }
          ]
        },
        {
          id: "q02-6", ts: "2.5", scenario: 4,
          stem: "A developer asks the agent to find every place <code>formatCurrency</code> is used, but it's re-exported from <code>utils/index.ts</code> as <code>fmtMoney</code> and from <code>legacy.ts</code> as <code>toCurrency</code>. What approach finds all usages?",
          options: [
            { t: "Glob for files with “currency” in their names, then Read each one and list its call sites.", why: "File names don't reveal where a function is called from." },
            { t: "Grep the whole repository for <code>formatCurrency</code>, which covers every call site.", why: "Misses calls made through the aliases <code>fmtMoney</code> and <code>toCurrency</code>." },
            { t: "First find every name the function is exported under, then Grep for each of those names across the codebase.", ok: true, why: "Trace re-exports first, then search for every alias." },
            { t: "Read every file in <code>src/</code> one by one, since text search can miss indirect usage.", why: "Slow and fills the context window. Targeted search is the right tool." }
          ]
        },
        {
          id: "q02-7", ts: "2.5", scenario: 4,
          stem: "Claude's <code>Edit</code> on <code>routes.ts</code> keeps failing with “old_string is not unique.” The same block appears in three handlers, and only one of them should change. What is the reliable next step?",
          options: [
            { t: "Retry the same Edit; the match may succeed on another attempt.", trap: "T6", why: "The text is still duplicated, so the match fails the same way." },
            { t: "Read the full file, then Write the modified version.", ok: true, why: "Exam framing: when Edit can't find a unique anchor, fall back to Read + Write. (Today a longer, unique old_string or replace_all also works; see Exam vs. today.)" },
            { t: "Run <code>sed -i</code> through Bash to replace the block in place, since sed doesn't need a unique match.", why: "sed changes all three handlers, but only one should change." },
            { t: "Use Grep with a replacement pattern to change only the first occurrence of the block.", why: "Grep searches; it doesn't edit files." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Descriptions are the selection mechanism: say what, inputs, examples, edge cases, and when to use it instead of the neighbor.",
        "Overlapping tools: rename and split them. Also check the system prompt for keyword triggers.",
        "4–5 role-scoped tools per agent beat 18. Add narrow cross-role tools for frequent needs.",
        "tool_choice: auto (no guarantee), any (some tool), named (that tool), none. Forced choices need a model that supports them.",
        "Grep = contents, Glob = paths, Edit = unique anchor, Read + Write = fallback (exam framing; see Exam vs. today).",
        "Explore incrementally from entry points; resolve aliases before tracing usage."
      ]
    }
  ]
};
