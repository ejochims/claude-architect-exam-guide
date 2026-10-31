window.LESSONS.f03 = {
  cards: [
    { f: "Messages API vs Agent SDK: who runs the agent loop?", b: "With the raw API, you write the loop. The Agent SDK runs the loop for you, with built-in tools, hooks, subagents and sessions." },
    { f: "What is the Claude Agent SDK?", b: "The agent harness behind Claude Code, packaged as Python and TypeScript libraries so you can build your own agents. It was called the Claude Code SDK until September 2025." },
    { f: "What is Claude Code?", b: "Anthropic's agentic coding tool. It reads your codebase, edits files and runs commands from the terminal, IDE, desktop or web, configured with CLAUDE.md, skills, hooks and MCP servers." },
    { f: "Where does MCP fit relative to the API, the SDK and Claude Code?", b: "It's a protocol for plugging tools and data into any of them. Write an MCP server once and every MCP-capable client can use it." },
    { f: "Which exam domains live mostly in Claude Code?", b: "Domain 3 (CLAUDE.md, rules, skills, plan mode, CI) and the Claude Code parts of Domain 2 (MCP config, built-in tools)." }
  ],
  steps: [
    {
      kind: "read",
      title: "Four things the exam names, and why each exists",
      html: `
<p class="lede">All four rest on the same Messages API calls you saw in F1 and F2. The exam assumes you can tell four products apart: the <strong>Claude API</strong>, the <strong>Claude Agent SDK</strong>, <strong>Claude Code</strong> and the <strong>Model Context Protocol (MCP)</strong>. Each exists because the layer below it left work for you to do.</p>
<svg viewBox="0 0 640 300" role="img" aria-label="Layered map: API at the bottom, Agent SDK above it, Claude Code and your agents on top, MCP connecting tools and data to all of them" style="width:100%;height:auto;margin:6px 0 16px">
  <rect x="20" y="230" width="460" height="54" rx="10" style="fill:var(--sunk);stroke:var(--line)"/>
  <text x="250" y="254" text-anchor="middle" style="fill:var(--fg);font:600 15px var(--sans)">Claude API (Messages API)</text>
  <text x="250" y="273" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">one stateless call · you write the loop</text>
  <rect x="20" y="150" width="460" height="64" rx="10" style="fill:var(--accent-soft);stroke:var(--accent)"/>
  <text x="250" y="177" text-anchor="middle" style="fill:var(--accent-ink);font:600 15px var(--sans)">Claude Agent SDK</text>
  <text x="250" y="198" text-anchor="middle" style="fill:var(--accent-ink);font:12.5px var(--sans)">the loop, built-in tools, hooks, subagents, sessions</text>
  <rect x="20" y="60" width="220" height="74" rx="10" style="fill:var(--surface);stroke:var(--line)"/>
  <text x="130" y="90" text-anchor="middle" style="fill:var(--fg);font:600 15px var(--sans)">Claude Code</text>
  <text x="130" y="110" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">ready-made coding agent</text>
  <rect x="260" y="60" width="220" height="74" rx="10" style="fill:var(--surface);stroke:var(--line)"/>
  <text x="370" y="90" text-anchor="middle" style="fill:var(--fg);font:600 15px var(--sans)">Your agents</text>
  <text x="370" y="110" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">support, research, extraction</text>
  <rect x="510" y="60" width="110" height="224" rx="10" style="fill:var(--sunk);stroke:var(--line);stroke-dasharray:5 4"/>
  <text x="565" y="150" text-anchor="middle" style="fill:var(--fg);font:600 15px var(--sans)">MCP</text>
  <text x="565" y="172" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">tools and</text>
  <text x="565" y="190" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">data, plugged</text>
  <text x="565" y="208" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">in anywhere</text>
  <text x="250" y="40" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">each layer is built on the one below</text>
</svg>
<div class="table-wrap"><table>
<thead><tr><th></th><th>What it is</th><th>Why it exists</th><th>Who runs the loop</th></tr></thead>
<tbody>
<tr><td><strong>Claude API</strong></td><td>The Messages API: send a request, get one response</td><td>The raw capability, with full control</td><td>You do</td></tr>
<tr><td><strong>Agent SDK</strong></td><td>Python and TypeScript libraries containing the harness behind Claude Code</td><td>Writing a reliable loop, tool execution, permissions and context management by hand is a lot of work</td><td>The SDK</td></tr>
<tr><td><strong>Claude Code</strong></td><td>A coding agent for the terminal, IDE, desktop and web</td><td>Developers wanted to hand real engineering tasks to Claude inside their repo</td><td>Claude Code</td></tr>
<tr><td><strong>MCP</strong></td><td>An open protocol for exposing tools, data and prompts to AI clients</td><td>Every app was wiring every data source by hand (Module 5)</td><td>Not a loop: a connector</td></tr>
</tbody></table></div>
<div class="callout key"><div class="callout-label">Key terms</div><ul style="margin:0;padding-left:18px"><li><strong>Harness.</strong> the code around the model that runs the loop: it calls Claude, executes the tools Claude asks for, enforces <em>permissions</em> (which tools may run, and which need a person's approval) and manages what's in context.</li><li><strong>Which to pick.</strong> the raw API when you need full control over a simple call or a custom loop; the Agent SDK to build your own agent without writing that harness; Claude Code for coding work in a repository; MCP whenever a tool or data source should be reusable across any of them.</li><li><strong>Hooks.</strong> your own code that the harness runs at fixed points, such as just before or just after a tool call. Unlike instructions in a prompt, a hook runs every time (Module 3).</li><li><strong>Subagents.</strong> separate agents, each with its own context and tools, that a coordinating agent hands focused tasks to (Module 6).</li></ul></div>`
    },
    {
      kind: "read",
      title: "Where each exam domain lives",
      html: `
<p class="lede">Knowing which product a question is about tells you which mechanisms are available.</p>
<ul>
<li><strong>Raw API (Domains 1 and 4).</strong> The agentic loop and <code>stop_reason</code>, tool definitions and <code>tool_choice</code>, structured output with JSON Schema, the Message Batches API. If a question shows request JSON or a loop in your code, you're here.</li>
<li><strong>Agent SDK (Domain 1).</strong> Coordinators and subagents (<code>AgentDefinition</code>, the Task tool), hooks such as <code>PreToolUse</code> and <code>PostToolUse</code> for enforcement and normalization, and sessions you can resume or fork.</li>
<li><strong>Claude Code (Domain 3, parts of 2 and 5).</strong> <code>CLAUDE.md</code> memory, path-scoped rules, skills and slash commands, plan mode, the Explore subagent, MCP server configuration, and running non-interactively in CI with <code>claude -p</code>.</li>
<li><strong>MCP (Domain 2).</strong> Designing tools and resources, structured errors, and where a server is configured.</li>
</ul>

<!-- ex:f03-layers -->
<h3>The same task at each layer</h3>
<p>Here is one job, “find where configuration is loaded and summarize it,” done three ways. Notice how much of the work moves off your plate at each layer.</p>
<p><strong>Claude API.</strong> You write the loop (Module 1):</p>
<pre class="code"><code>response = client.messages.create(model=MODEL, max_tokens=<span class="k">1024</span>,
                                  tools=TOOLS, messages=messages)
<span class="c"># then: check stop_reason, run the tools yourself, append results, repeat</span></code></pre>
<!-- ex:f03-sdk -->
<p><strong>Agent SDK.</strong> The SDK runs the loop and provides built-in tools such as Read, Grep and Glob:</p>
<pre class="code"><code><span class="k">from</span> claude_agent_sdk <span class="k">import</span> query, ClaudeAgentOptions

<span class="k">async</span> <span class="k">for</span> message <span class="k">in</span> query(
    prompt=<span class="s">"Find where configuration is loaded and summarize it"</span>,
    options=ClaudeAgentOptions(allowed_tools=[<span class="s">"Read"</span>, <span class="s">"Grep"</span>, <span class="s">"Glob"</span>]),
):
    print(message)</code></pre>
<!-- ex:f03-cli -->
<p><strong>Claude Code.</strong> The finished agent, here run non-interactively from a script (Module 12):</p>
<pre class="code"><code>claude -p <span class="s">"Find where configuration is loaded and summarize it"</span></code></pre>
<!-- ex:f03-mcp -->
<p><strong>MCP.</strong> A minimal server using the official Python SDK. The function's docstring becomes the tool description, and any MCP client (Claude Code, an Agent SDK app, Claude Desktop) can now call <code>get_order</code>:</p>
<pre class="code"><code><span class="k">from</span> mcp.server.mcpserver <span class="k">import</span> MCPServer   <span class="c"># mcp 1.x: from mcp.server.fastmcp import FastMCP</span>

mcp = MCPServer(<span class="s">"orders"</span>)

@mcp.tool()
<span class="k">def</span> get_order(order_number: str) -&gt; str:
    <span class="s">""</span><span class="s">"Look up one order by its number. Returns status and delivery date."</span><span class="s">""</span>
    <span class="k">return</span> lookup(order_number)          <span class="c"># your real order system</span>

mcp.run()</code></pre><h3>A short history</h3>
<ul>
<li><strong>Feb 2025:</strong> Claude Code launched as a command-line tool for agentic coding (<a href="https://www.anthropic.com/news/claude-3-7-sonnet" target="_blank" rel="noopener">source</a>).</li>
<li><strong>Sep 2025:</strong> the Claude Code SDK was renamed the <strong>Claude Agent SDK</strong>, because the same harness was proving useful for agents far beyond coding (<a href="https://claude.com/blog/building-agents-with-the-claude-agent-sdk" target="_blank" rel="noopener">source</a>).</li>
<li>MCP's own history is in Module 5.</li>
</ul>
<div class="callout note"><div class="callout-label">Exam terms</div><p>The exam blueprint predates some product changes, for example the Task tool's rename to Agent. Each module flags these, and the <a href="#today">Exam vs. today</a> page lists them all.</p></div>`
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Claude API: one stateless call; you write the loop.",
        "Agent SDK: Claude Code's harness as a library: loop, tools, hooks, subagents, sessions.",
        "Claude Code: a ready-made coding agent configured by CLAUDE.md, rules, skills, hooks and MCP.",
        "MCP: an open protocol that plugs tools and data into any of them.",
        "Identify the product in a question first; it tells you which mechanisms exist."
      ]
    }
  ]
};
