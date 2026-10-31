window.LESSONS.m05 = {
  cards: [
    { f: "Team-shared MCP server config lives where?", b: "Project scope: .mcp.json at the repo root, committed to version control." },
    { f: "Personal or experimental MCP server, available in all your projects?", b: "User scope in ~/.claude.json (e.g. claude mcp add --scope user). Not shared with teammates." },
    { f: "How do you keep secrets out of a committed .mcp.json?", b: "Environment variable expansion: \"${GITHUB_TOKEN}\" (also ${VAR:-default})." },
    { f: "Same server name at several scopes. Which wins?", b: "Local > project > user. The whole entry from the winner is used." },
    { f: "Tool or resource for a documentation tree or a database schema?", b: "Resource. Content catalogs let the agent see what exists without exploratory tool calls. Tools are for actions and live lookups." },
    { f: "The agent uses Grep instead of your richer MCP code-search tool. First fix?", b: "Improve the MCP tool's description: explain its capabilities and outputs and why it beats generic search." }
  ],
  steps: [
    {
      kind: "read",
      title: "Why MCP exists",
      html: `
<p class="lede">Before MCP, every AI application connected to every data source with its own custom code. A support bot, an IDE assistant and an internal research agent that all needed the ticketing system each built and maintained their own integration.</p>
<p>That doesn't scale. With several AI apps and several systems, the number of integrations grows with <em>apps × systems</em>, and each one breaks separately when an API changes. (That “N×M” framing is our summary; Anthropic's announcement put it as every new data source needing its own custom implementation.)</p>
<p><strong>Anthropic introduced the Model Context Protocol on November 25, 2024</strong> as an open standard for connecting AI assistants to the systems where data lives. Each system is exposed once, as an <strong>MCP server</strong>, and any MCP-capable application can use it. The integrations needed drop to roughly <em>apps + systems</em> (<a href="https://www.anthropic.com/news/model-context-protocol" target="_blank" rel="noopener">source</a>).</p>
<p>It's an open protocol rather than a Claude-only plugin format because the value grows with adoption: a server written for one client works with others. In December 2025 Anthropic donated MCP to the Agentic AI Foundation, a fund under the Linux Foundation, to keep it vendor-neutral (<a href="https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation" target="_blank" rel="noopener">source</a>).</p>
<h3>How it runs</h3>
<svg viewBox="0 0 640 210" role="img" aria-label="A host application contains MCP clients, each connected to one MCP server that wraps a system" style="width:100%;height:auto;margin:6px 0 14px">
  <rect x="10" y="20" width="250" height="170" rx="12" style="fill:var(--accent-soft);stroke:var(--accent)"/>
  <text x="135" y="46" text-anchor="middle" style="fill:var(--accent-ink);font:600 15px var(--sans)">Host</text>
  <text x="135" y="66" text-anchor="middle" style="fill:var(--accent-ink);font:12.5px var(--sans)">Claude Code, Claude Desktop, your app</text>
  <rect x="40" y="86" width="190" height="36" rx="8" style="fill:var(--surface);stroke:var(--line)"/>
  <text x="135" y="109" text-anchor="middle" style="fill:var(--fg);font:13px var(--sans)">MCP client → server A</text>
  <rect x="40" y="134" width="190" height="36" rx="8" style="fill:var(--surface);stroke:var(--line)"/>
  <text x="135" y="157" text-anchor="middle" style="fill:var(--fg);font:13px var(--sans)">MCP client → server B</text>
  <rect x="330" y="80" width="140" height="48" rx="8" style="fill:var(--surface);stroke:var(--line)"/>
  <text x="400" y="101" text-anchor="middle" style="fill:var(--fg);font:600 13px var(--sans)">Server A</text>
  <text x="400" y="118" text-anchor="middle" style="fill:var(--muted);font:12px var(--sans)">local process</text>
  <rect x="330" y="140" width="140" height="48" rx="8" style="fill:var(--surface);stroke:var(--line)"/>
  <text x="400" y="161" text-anchor="middle" style="fill:var(--fg);font:600 13px var(--sans)">Server B</text>
  <text x="400" y="178" text-anchor="middle" style="fill:var(--muted);font:12px var(--sans)">remote, over HTTP</text>
  <rect x="520" y="80" width="110" height="48" rx="8" style="fill:var(--sunk);stroke:var(--line)"/>
  <text x="575" y="109" text-anchor="middle" style="fill:var(--fg);font:13px var(--sans)">Ticketing</text>
  <rect x="520" y="140" width="110" height="48" rx="8" style="fill:var(--sunk);stroke:var(--line)"/>
  <text x="575" y="169" text-anchor="middle" style="fill:var(--fg);font:13px var(--sans)">Database</text>
  <path d="M230 104 H330 M230 152 L330 164 M470 104 H520 M470 164 H520" style="stroke:var(--fg);stroke-width:2;fill:none"/>
</svg>
<ul>
<li>The <strong>host</strong> is the AI application. It holds one <strong>MCP client</strong> per server it connects to.</li>
<li>When it connects, the client asks the server what it offers (<code>tools/list</code>), so Claude sees each tool's name, description and input schema, just like the tools in Foundations F2.</li>
<li>When Claude wants a tool, the host sends <code>tools/call</code> and <strong>the server executes it</strong> against the real system, returning a result or an error marked <code>isError</code>.</li>
<li>A server runs either as a local process the host starts (the <em>stdio</em> transport) or as a remote service over HTTP (<a href="https://modelcontextprotocol.io/specification/2025-11-25/basic/transports" target="_blank" rel="noopener">transports</a>). Hosting and deploying servers is out of scope for the exam.</li>
</ul>
<div class="callout key"><div class="callout-label">Why three primitives</div><p>The next step introduces tools, resources and prompts. They differ in <em>who decides when they're used</em>: the model picks tools, the application chooses which resources to load, and the user invokes prompts. Splitting them lets each actor keep control of what it should control.</p></div>`
    },
    {
      kind: "read",
      title: "First principle: integrate once",
      html: `
<p class="lede">The Model Context Protocol is a standard way to expose a system to any AI client. Write an MCP server for your ticketing system once, and Claude Code, an Agent SDK app and Claude Desktop can all use it.</p>
<p>A server offers three kinds of capability:</p>
<div class="table-wrap"><table>
<thead><tr><th>Primitive</th><th>Controlled by</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td><strong>Tools</strong></td><td>The model</td><td>Actions and live lookups: create a ticket, check stock, run a query</td></tr>
<tr><td><strong>Resources</strong></td><td>The application</td><td>Content catalogs: issue summaries, documentation hierarchies, database schemas</td></tr>
<tr><td><strong>Prompts</strong></td><td>The user</td><td>Reusable templates; in Claude Code they appear as slash commands</td></tr>
</tbody></table></div>
<p><strong>Resources reduce exploratory tool calls.</strong> Without a catalog, an agent calls <code>list_docs</code>, <code>search_docs</code> and <code>get_doc</code> just to learn what exists. With the documentation tree exposed as a resource, it can see the map first and fetch only what it needs.</p>
<p><strong>Build or reuse?</strong> For standard integrations such as Jira, GitHub, Slack or Postgres, use an existing community or vendor server. Write a custom server only for team-specific workflows nothing else covers.</p>
<div class="callout note"><div class="callout-label">Annotations are hints</div><p>Tool annotations like <code>readOnlyHint</code> or <code>destructiveHint</code> help the host's UI. They aren't a security boundary, because a server can claim anything. Real enforcement lives in hooks, permissions and the tool's own code.</p></div>
<div class="callout key"><div class="callout-label">Tools, resources and prompts</div><ul style="margin:0;padding-left:18px"><li><strong>Tools.</strong> actions the <em>model</em> decides to call, like the tools in F2.</li><li><strong>Resources.</strong> read-only content the server makes available by address (a URI), such as a docs index or a database schema. The <em>host application</em> decides which resources go into the model's context, sometimes because you pick one (in Claude Code, by typing <code>@</code> and choosing it). The model reads them as context rather than calling them, which is why a catalog resource saves exploratory tool calls.</li><li><strong>Prompts.</strong> reusable templates the <em>user</em> invokes; Claude Code shows them as slash commands.</li><li><strong>Why split them.</strong> each one is controlled by whoever should decide when it's used: the model acts, the application supplies context, the user chooses templates.</li></ul></div>
<!-- ex:m05-server -->
<h3>What a server looks like</h3>
<p>A server exposes <strong>tools</strong> (actions the model calls) and <strong>resources</strong> (content the client can list and read). With the official Python SDK, each one is a decorated function:</p>
<pre class="code"><code><span class="k">from</span> mcp.server.mcpserver <span class="k">import</span> MCPServer   <span class="c"># mcp 1.x: from mcp.server.fastmcp import FastMCP</span>

mcp = MCPServer(<span class="s">"docs"</span>)

@mcp.tool()
<span class="k">def</span> search_docs(query: str) -&gt; str:
    <span class="s">""</span><span class="s">"Full-text search over internal engineering docs. Use for how-to and design questions."</span><span class="s">""</span>
    <span class="k">return</span> search(query)

@mcp.resource(<span class="s">"docs://catalog"</span>)
<span class="k">def</span> catalog() -&gt; str:
    <span class="s">""</span><span class="s">"Index of every doc: title, path and one-line summary."</span><span class="s">""</span>
    <span class="k">return</span> build_index()</code></pre>
<p>When a tool call fails on bad input, the server returns a normal result flagged as an error, so the model can read it and fix the call (Module 4):</p>
<!-- ex:m05-iserror -->

<pre class="code"><code>{<span class="s">"content"</span>: [{<span class="s">"type"</span>: <span class="s">"text"</span>, <span class="s">"text"</span>: <span class="s">"Invalid date '03/04'. Use YYYY-MM-DD."</span>}],
 <span class="s">"isError"</span>: <span class="k">true</span>}</code></pre>`
    },
    {
      kind: "read",
      title: "Configuring MCP in Claude Code",
      html: `
<p class="lede">Where you configure a server decides who gets it.</p>
<div class="table-wrap"><table>
<thead><tr><th>Scope</th><th>Stored in</th><th>Who sees it</th></tr></thead>
<tbody>
<tr><td>Project</td><td><code>.mcp.json</code> at the repo root (committed)</td><td>Everyone who clones the repo</td></tr>
<tr><td>User</td><td><code>~/.claude.json</code></td><td>You, in every project</td></tr>
<tr><td>Local</td><td><code>~/.claude.json</code>, keyed to this project</td><td>You, in this project only</td></tr>
</tbody></table></div>
<p>If the same server name appears at more than one scope, <strong>local beats project beats user</strong>, and the winner's whole entry is used. Servers with different names all load together: <strong>tools from every configured server are discovered at connection time and available simultaneously.</strong> (Real world today: Claude Code can defer loading full tool definitions until they're needed, using tool search. On the exam, treat all configured tools as available.)</p>
<p><strong>Never commit a secret.</strong> <code>.mcp.json</code> expands environment variables, so the team shares the config and each person supplies their own token:</p>
<pre class="code"><code>{
  <span class="s">"mcpServers"</span>: {
    <span class="s">"jira"</span>: {
      <span class="s">"command"</span>: <span class="s">"npx"</span>,
      <span class="s">"args"</span>: [<span class="s">"-y"</span>, <span class="s">"some-community-jira-mcp"</span>],
      <span class="s">"env"</span>: { <span class="s">"JIRA_TOKEN"</span>: <span class="s">"\${JIRA_TOKEN}"</span>, <span class="s">"JIRA_URL"</span>: <span class="s">"\${JIRA_URL:-https://acme.atlassian.net}"</span> }
    }
  }
}</code></pre>
<p><strong>MCP tools compete with built-ins.</strong> If the agent keeps using <code>Grep</code> instead of your dependency-aware code-search tool, the description is usually too thin. Explain what it can do (transitive callers, ranking, cross-repo results) and what it returns, so Claude can see why it's the better choice.</p>`
    },
    {
      kind: "widget",
      title: "Where does this server go?",
      intro: "Pick the scope for each MCP server.",
      widget: "sorter",
      config: {
        cats: [{ id: "project", label: "Project .mcp.json" }, { id: "user", label: "User ~/.claude.json" }, { id: "local", label: "Local (this project, just me)" }],
        items: [
          ["The team's internal docs server that every engineer on this repo should have.", "project", "Shared team tooling belongs in the committed .mcp.json, with secrets as ${VARS}."],
          ["Your personal calendar server you want in every project.", "user", "Personal and cross-project: user scope."],
          ["An experimental server you're trying only in this repo, with your own credentials.", "local", "Personal and project-specific: local scope keeps it off the team's config."],
          ["A GitHub server the whole team uses, needing each person's token.", "project", "Project scope with \"${GITHUB_TOKEN}\" expansion. Never commit the literal token."],
          ["A note-taking server you rely on everywhere but teammates don't use.", "user", "User scope: available across your projects, invisible to others."]
        ]
      }
    },
    {
      kind: "widget",
      title: "Tool or resource?",
      intro: "Decide whether each capability should be an MCP tool or an MCP resource.",
      widget: "sorter",
      config: {
        cats: [{ id: "tool", label: "Tool" }, { id: "resource", label: "Resource" }],
        items: [
          ["The database schema for the analytics warehouse.", "resource", "Reference context the agent should see before writing queries."],
          ["Create a Jira ticket.", "tool", "An action with side effects."],
          ["A catalog of open-issue summaries for the sprint.", "resource", "A content catalog lets the agent see what exists without listing calls."],
          ["Current stock level for a SKU.", "tool", "Live data that changes between calls needs a lookup."],
          ["The documentation hierarchy of the internal platform.", "resource", "A map of available content, which cuts exploratory calls."],
          ["Run a SQL query against the warehouse.", "tool", "Computation on live data is an action."]
        ]
      }
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q05-1", ts: "2.4", scenario: 4,
          stem: "Your team wants everyone who clones the repo to have the same Jira MCP server, but each engineer has a personal API token. What configuration should you use?",
          options: [
            { t: "Commit <code>.mcp.json</code> with <code>\"JIRA_TOKEN\": \"${JIRA_TOKEN}\"</code> and have every engineer set the variable.", ok: true, why: "Shared configuration, personal secrets, nothing sensitive in the repo." },
            { t: "Commit <code>.mcp.json</code> with one shared service-account token in <code>\"JIRA_TOKEN\"</code>, so every clone works out of the box.", why: "A secret in version control, and every action is attributed to one account." },
            { t: "Have each engineer add the server to their own <code>~/.claude.json</code> with a personal token.", why: "Works, but the setup isn't shared and drifts between engineers." },
            { t: "Put the server definition and a token placeholder in CLAUDE.md, so Claude Code configures it.", trap: "T8", why: "CLAUDE.md doesn't configure MCP servers." }
          ]
        },
        {
          id: "q05-2", ts: "2.4", scenario: 4,
          stem: "You want to try an experimental MCP server in all your projects without affecting teammates. Where should you configure it?",
          options: [
            { t: "The project's <code>.mcp.json</code>, on a feature branch that you never merge.", why: "Per-project, and it ends up on a shared branch." },
            { t: "User scope in <code>~/.claude.json</code>.", ok: true, why: "User scope applies to you, in every project." },
            { t: "<code>.claude/settings.local.json</code> in each repository you work in.", why: "Per-project, so you'd repeat it in every repo." },
            { t: "<code>~/.claude/CLAUDE.md</code>, so it loads in every project for you alone.", trap: "T8", why: "Memory files don't configure MCP servers." }
          ]
        },
        {
          id: "q05-3", ts: "2.4", scenario: 4,
          stem: "You added an MCP server with a <code>find_references</code> tool that understands transitive imports, but the agent keeps using Grep. Its description is “Finds references.” What should you do first?",
          options: [
            { t: "Remove Grep from the agent's tools so it has to use the MCP tool for references.", why: "Breaks every legitimate text search." },
            { t: "Expand the MCP tool's description to say what it finds, what it returns and when it beats text search.", ok: true, why: "Agents choose tools from descriptions. A two-word description loses to a familiar built-in." },
            { t: "Add “always prefer MCP tools over built-in tools” to the project CLAUDE.md.", trap: "T1", why: "A blanket rule is wrong in many cases and doesn't explain this tool's value." },
            { t: "Switch to a larger model, which is better at noticing when a specialized tool is available, and retest.", trap: "T3", why: "The description gives any model nothing to go on." }
          ]
        },
        {
          id: "q05-4", ts: "2.4", scenario: 4,
          stem: "Logs show the agent calls <code>list_runbooks</code>, then <code>search_runbooks</code> several times, before every incident, just to learn which runbooks exist. How can you cut those calls?",
          options: [
            { t: "Expose the runbook catalog as an MCP resource.", ok: true, why: "A resource lets the agent see what exists without exploratory tool calls." },
            { t: "Merge <code>list_runbooks</code> and <code>search_runbooks</code> into one tool with a query parameter.", trap: "T5", why: "Still a tool call per incident just to discover what exists." },
            { t: "Cache search results inside the tool for an hour, so repeated searches return instantly.", why: "Faster calls, but the agent still makes them." },
            { t: "Add every runbook's full text to the system prompt.", trap: "T3", why: "Bloats every request. A catalog is enough." }
          ]
        },
        {
          id: "q05-5", ts: "2.4", scenario: 4,
          stem: "The team needs the agent to read and update GitHub issues, and also run a proprietary release checklist unique to your company. What's the sensible approach?",
          options: [
            { t: "Build one custom MCP server covering both the GitHub issues and the release checklist.", why: "Reinvents a standard integration that already exists." },
            { t: "Use an existing GitHub MCP server, and write a small custom one only for the checklist.", ok: true, why: "Reuse standard servers; build custom only for what's unique to you." },
            { t: "Have the agent call GitHub's REST API with curl through Bash, authenticating with a token.", why: "Bypasses typed tools and descriptions, and is brittle." },
            { t: "Describe the checklist in CLAUDE.md and skip MCP, letting Claude follow it manually.", why: "Loses structured, reliable tool access for the checklist." }
          ]
        },
        {
          id: "q05-6", ts: "2.4", scenario: 4,
          stem: "The repo's <code>.mcp.json</code> defines a <code>github</code> server. A developer also has a personal <code>notes</code> server at user scope. What does the agent have access to in this project?",
          options: [
            { t: "Only the project servers, because project scope replaces user scope.", why: "Scopes combine. Precedence matters only when names collide." },
            { t: "Tools from both servers, all discovered at connection and available together.", ok: true, why: "All configured servers load; their tools are available at the same time." },
            { t: "Only the notes server, because personal configuration takes precedence over the project's.", why: "Precedence applies to same-named servers, and local beats project beats user." },
            { t: "Whichever single server the developer selects with <code>--mcp-server</code> when starting the session.", trap: "T8", why: "No such selection exists; configured servers all load." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "MCP exposes a system once, for any client. Tools are actions; resources are content catalogs; prompts are templates.",
        "Resources cut exploratory tool calls. Use them for schemas, doc trees and issue summaries.",
        "Project .mcp.json is shared; ~/.claude.json holds user (all projects) and local (this project) config.",
        "Same name at several scopes: local > project > user. Different names: all available at once.",
        "Secrets go in ${ENV_VAR} expansion, never committed.",
        "Reuse community servers for standard integrations. Write descriptions that explain why your MCP tool beats built-ins."
      ]
    }
  ]
};
