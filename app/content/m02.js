window.LESSONS.m02 = {
  cards: [
    { f: "What is the model's main signal for choosing between tools?", b: "The tool descriptions (plus names and schemas). Minimal or overlapping descriptions cause misrouting." },
    { f: "Two tools keep getting confused. First step?", b: "Rewrite and differentiate the descriptions (inputs, example queries, edge cases, when to use instead of the other). Rename if purposes overlap." },
    { f: "tool_choice \"any\" vs a named tool?", b: "\"any\" guarantees some tool call, and Claude picks which. {\"type\":\"tool\",\"name\":X} forces that specific tool." },
    { f: "Why not give every agent all 18 tools?", b: "More tools means harder selection and cross-role misuse. Give each agent the 4–5 tools its role needs, plus scoped cross-role tools for frequent needs." },
    { f: "Grep vs Glob?", b: "Grep searches file contents (function names, error strings). Glob matches file paths and names (**/*.test.tsx)." },
    { f: "Edit fails because the anchor text isn't unique. Fallback?", b: "Read the full file, then Write the modified version." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: descriptions are the interface",
      html: `
<p class="lede">Claude never sees your tool's code. It sees a name, a description and an input schema, and chooses from those alone. A vague description is a bug in the interface, even though it shows up as a “reasoning” failure.</p>
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
<li><strong>Split generic tools</strong> into purpose-specific ones with clear contracts: <code>analyze_document</code> becomes <code>extract_data_points</code>, <code>summarize_content</code> and <code>verify_claim_against_source</code>.</li>
<li><strong>Check the system prompt.</strong> A line like “whenever a customer mentions their account, start with get_customer” can override a perfect description and misroute order questions.</li>
</ul>`
    },
    {
      kind: "read",
      title: "Fewer tools per agent, and tool_choice",
      html: `
<p class="lede">Selection accuracy falls as options grow. An agent with 18 tools makes more mistakes than one with 4–5, and an agent with tools outside its role tends to use them: a synthesis agent with web search starts searching instead of synthesizing.</p>
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
</tbody></table></div>`
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
<p class="lede">Claude Code and the Agent SDK ship with Read, Write, Edit, Bash, Grep and Glob. The exam checks that you match each to its job.</p>
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
          stem: "In a research system, the coordinator sends web-search results to <code>analyze_document</code> and PDFs to <code>analyze_content</code> about a third of the time. Both descriptions read “Analyzes the provided content and extracts key points.” What should you do first?",
          options: [
            { t: "Add a routing layer that inspects each input's MIME type and calls the right tool directly.", trap: "T2", why: "This bypasses the model with new infrastructure before fixing the obvious interface problem." },
            { t: "Rename and redescribe the tools so each states its input type, output and when to use it, e.g. <code>extract_web_results</code> vs <code>extract_pdf_tables</code>.", ok: true, why: "Identical descriptions give Claude nothing to choose between. Distinct names and boundaries fix the root cause." },
            { t: "Merge both into one <code>analyze</code> tool that accepts any input and works out internally which analysis to run.", trap: "T5", why: "This removes the choice but hides real differences in input handling and output contracts." },
            { t: "Add eight few-shot examples of correct routing to the coordinator's prompt, covering both web results and PDFs.", why: "Examples help with ambiguous cases, but these tools are identical by description. Fix the descriptions first." }
          ]
        },
        {
          id: "q02-2", ts: "2.1", scenario: 1,
          stem: "Your tool descriptions are detailed and distinct, yet the agent calls <code>get_customer</code> when users ask “where is order #5521?”. The system prompt includes: “Whenever a customer mentions their account or an order, start by calling get_customer.” What is the most likely fix?",
          options: [
            { t: "Rewrite the tool descriptions again with more examples.", trap: "T7", why: "The descriptions are already good. A keyword-triggered instruction in the system prompt is overriding them." },
            { t: "Revise the system prompt instruction that ties the word “order” to get_customer.", ok: true, why: "Keyword-sensitive instructions create unintended tool associations. Remove or narrow the rule." },
            { t: "Remove get_customer from the agent's tools.", why: "The agent still needs it for account questions and verification." },
            { t: "Use <code>tool_choice: {\"type\":\"tool\",\"name\":\"lookup_order\"}</code> on every turn.", why: "Forcing one tool every turn breaks every non-order request." }
          ]
        },
        {
          id: "q02-3", ts: "2.3", scenario: 3,
          stem: "A synthesis subagent was given all 16 research tools “for flexibility.” It now runs its own web searches mid-synthesis, producing duplicate and lower-quality sources. Best change?",
          options: [
            { t: "Restrict the synthesis agent to the tools its role needs, plus a narrow <code>verify_fact</code> tool if quick checks are common.", ok: true, why: "Scope tools to role. Cross-specialization tools get misused; a narrow cross-role tool covers the frequent need." },
            { t: "Tell the synthesis agent in its system prompt that it must not run searches and should only use the findings it's given.", trap: "T1", why: "This leaves the temptation in place and relies on compliance. Removing the tools is structural." },
            { t: "Switch the synthesis agent to a more capable model that will use its tools with better judgment.", trap: "T3", why: "The problem is tool distribution, not capability." },
            { t: "Merge search and synthesis into one agent with all 16 tools so no handoff is needed.", trap: "T5", why: "This worsens the selection problem." }
          ]
        },
        {
          id: "q02-4", ts: "2.3", scenario: 6,
          stem: "An extraction pipeline must always run <code>extract_metadata</code> before enrichment tools. Sometimes Claude calls <code>enrich_with_crm</code> first. What is the most reliable fix?",
          options: [
            { t: "List <code>extract_metadata</code> first in the tools array so Claude sees it before the enrichment tools.", why: "Tool order isn't a sequencing guarantee." },
            { t: "Set <code>tool_choice: {\"type\": \"tool\", \"name\": \"extract_metadata\"}</code> on the first request, then run enrichment in follow-up turns.", ok: true, why: "Forced tool choice guarantees that tool is called. Later steps get their own requests." },
            { t: "Set <code>tool_choice: \"any\"</code> on every request so Claude is required to call one of the extraction tools.", why: "This guarantees some tool call, not which one." },
            { t: "Add “ALWAYS call extract_metadata before any enrichment tool” to the system prompt, in bold.", trap: "T1", why: "Probabilistic, when an API setting gives a guarantee." }
          ]
        },
        {
          id: "q02-5", ts: "2.3", scenario: 6,
          stem: "A pipeline has <code>extract_invoice</code>, <code>extract_receipt</code> and <code>extract_contract</code>. Documents arrive unlabeled. About 4% of responses are prose summaries instead of tool calls. Fix?",
          options: [
            { t: "Keep <code>tool_choice: \"auto\"</code> and strengthen the instruction to always use a tool.", trap: "T1", why: "\"auto\" permits text. Stronger wording only lowers the rate." },
            { t: "Force <code>extract_invoice</code>; invoices are the most common type.", why: "This applies the wrong schema to receipts and contracts." },
            { t: "Set <code>tool_choice: \"any\"</code>.", ok: true, why: "A tool call is guaranteed, and Claude still picks the schema that matches the document." },
            { t: "Parse the prose summaries with regex as a fallback.", trap: "T6", why: "This patches symptoms with fragile parsing instead of using the guarantee the API offers." }
          ]
        },
        {
          id: "q02-6", ts: "2.5", scenario: 4,
          stem: "A developer asks the agent to find every place <code>formatCurrency</code> is used, but it's re-exported from <code>utils/index.ts</code> as <code>fmtMoney</code> and from <code>legacy.ts</code> as <code>toCurrency</code>. What approach finds all usages?",
          options: [
            { t: "Glob for files with “currency” in their names, then read each of them for call sites.", why: "Glob matches file names, not usages inside files." },
            { t: "Grep the whole repository for formatCurrency, which will find every call site including re-exports.", why: "This misses every call through the aliases." },
            { t: "First identify every name the function is exported under, then Grep for each name across the codebase.", ok: true, why: "Tracing through wrapper modules means collecting the aliases first, then searching for each." },
            { t: "Read every file in src/ one by one to be thorough, since text search can miss indirect usage.", why: "Reading everything up front wastes context. Explore incrementally." }
          ]
        },
        {
          id: "q02-7", ts: "2.5", scenario: 4,
          stem: "Claude's <code>Edit</code> on <code>routes.ts</code> keeps failing with “old_string is not unique.” The block to change appears in three handlers. What is the reliable next step?",
          options: [
            { t: "Retry the same Edit; it may succeed on another attempt.", trap: "T6", why: "The same non-unique anchor fails the same way." },
            { t: "Read the full file, then Write the modified version.", ok: true, why: "When Edit can't find a unique anchor, Read + Write is the documented fallback." },
            { t: "Use Grep to replace the text.", why: "Grep searches; it doesn't edit." },
            { t: "Ask the developer to make the code unique first.", why: "This pushes work to a human when a tool fallback exists." }
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
        "tool_choice: auto (no guarantee), any (some tool), named (that tool), none.",
        "Grep = contents, Glob = paths, Edit = unique anchor, Read + Write = fallback.",
        "Explore incrementally from entry points; resolve aliases before tracing usage."
      ]
    }
  ]
};
