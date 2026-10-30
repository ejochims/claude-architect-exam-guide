window.LESSONS.m11 = {
  cards: [
    { f: "A new teammate doesn't get the team's conventions. Common cause?", b: "The conventions live in someone's user-level ~/.claude/CLAUDE.md, which isn't shared. Move them to the project CLAUDE.md." },
    { f: "How do you diagnose which memory files are loaded?", b: "The /memory command." },
    { f: "Conventions for test files spread across every directory?", b: ".claude/rules/ file with YAML frontmatter paths: [\"**/*.test.tsx\"]. It loads only when matching files are edited." },
    { f: "Team slash command vs personal one?", b: "Team: .claude/commands/ in the repo. Personal: ~/.claude/commands/." },
    { f: "Skill frontmatter: context: fork, allowed-tools, argument-hint?", b: "fork = run in an isolated sub-agent context; allowed-tools = control tool access during the skill; argument-hint = prompt for missing parameters." },
    { f: "Skills vs CLAUDE.md?", b: "Skills load on demand for task-specific workflows. CLAUDE.md is always loaded and holds universal standards." },
    { f: "Plan mode or direct execution?", b: "Plan mode for large, multi-file, architectural or multi-approach work. Direct for clear, well-scoped changes. Often: plan, then execute." },
    { f: "Prose description of a transformation is interpreted inconsistently. Fix?", b: "Give 2–3 concrete input/output examples." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: scope decides who gets it, and when",
      html: `
<p class="lede">Every Claude Code configuration question comes down to two things: <strong>who</strong> should get this behavior (just me, or the whole team via git) and <strong>when</strong> it should load (always, for matching files only, or on demand).</p>
<div class="table-wrap"><table>
<thead><tr><th>Mechanism</th><th>Location</th><th>Who</th><th>When it loads</th></tr></thead>
<tbody>
<tr><td>User memory</td><td><code>~/.claude/CLAUDE.md</code></td><td>Just you</td><td>Always, every project</td></tr>
<tr><td>Project memory</td><td><code>CLAUDE.md</code> or <code>.claude/CLAUDE.md</code></td><td>Team (git)</td><td>Always</td></tr>
<tr><td>Local memory</td><td><code>CLAUDE.local.md</code> (gitignored)</td><td>Just you, this project</td><td>Always</td></tr>
<tr><td>Directory memory</td><td><code>src/payments/CLAUDE.md</code></td><td>Team</td><td>Working in that subtree</td></tr>
<tr><td>Rules</td><td><code>.claude/rules/*.md</code></td><td>Team</td><td>Always, or only for files matching <code>paths</code> globs</td></tr>
<tr><td>Commands</td><td><code>.claude/commands/</code> · <code>~/.claude/commands/</code></td><td>Team · just you</td><td>When invoked as <code>/name</code></td></tr>
<tr><td>Skills</td><td><code>.claude/skills/&lt;name&gt;/SKILL.md</code> · <code>~/.claude/skills/</code></td><td>Team · just you</td><td>On demand</td></tr>
</tbody></table></div>
<ul>
<li><strong>User-level files aren't shared.</strong> If a new teammate isn't following conventions, check whether they live in someone's <code>~/.claude/CLAUDE.md</code>.</li>
<li><strong><code>@import</code> keeps memory modular.</strong> Each package's <code>CLAUDE.md</code> can import only the standards files relevant to it, e.g. <code>@docs/standards/api.md</code>.</li>
<li><strong><code>/memory</code></strong> shows which memory files are loaded. It's the first diagnostic when behavior is inconsistent.</li>
<li><strong>Split a monolithic <code>CLAUDE.md</code></strong> into topic files in <code>.claude/rules/</code>, such as <code>testing.md</code>, <code>api-conventions.md</code> and <code>deployment.md</code>.</li>
</ul>`
    },
    {
      kind: "read",
      title: "Path-specific rules, commands and skills",
      html: `
<h3>Path-scoped rules</h3>
<pre class="code"><code>---
paths: [<span class="s">"**/*.stories.tsx"</span>]
---
<span class="c"># Storybook conventions</span>
- One default export per file; name stories after the visual state.</code></pre>
<p>A rule with <code>paths</code> loads <strong>only when Claude is editing matching files</strong>, which saves context and tokens. It also beats subdirectory <code>CLAUDE.md</code> files when the files are <strong>spread across many directories</strong>. A directory file is bound to one folder; a glob follows the file type wherever it lives.</p>
<h3>Skills</h3>
<pre class="code"><code>---
name: map-codebase
description: Survey an unfamiliar module and summarize its architecture
context: fork
allowed-tools: Read, Grep, Glob
argument-hint: <span class="s">"[module-path]"</span>
---</code></pre>
<ul>
<li><strong><code>context: fork</code></strong> runs the skill in an isolated sub-agent context, so verbose output (codebase analysis) or exploratory noise (brainstorming) doesn't pollute the main conversation.</li>
<li><strong><code>allowed-tools</code></strong> controls tool access while the skill runs, for example limiting it to file operations so it can't take destructive actions.</li>
<li><strong><code>argument-hint</code></strong> prompts the developer for a required parameter when they invoke the skill without one.</li>
<li>For your own variant of a team skill, create it in <code>~/.claude/skills/</code> <strong>under a different name</strong> so teammates aren't affected.</li>
</ul>
<div class="callout today"><div class="callout-label">Real world today</div><p>Claude Code has since merged custom commands into skills (both create <code>/name</code>, and <code>.claude/commands/</code> still works). <code>allowed-tools</code> now <em>pre-approves</em> the listed tools for the turn, rather than restricting. Answer in the exam's terms.</p></div>`
    },
    {
      kind: "widget",
      title: "Where does it go?",
      intro: "Choose the right home for each piece of configuration.",
      widget: "sorter",
      config: {
        cats: [{ id: "proj", label: "Project CLAUDE.md" }, { id: "user", label: "~/.claude/CLAUDE.md" }, { id: "rules", label: ".claude/rules/ with paths" }, { id: "cmd", label: ".claude/commands/" }, { id: "skill", label: ".claude/skills/" }],
        items: [
          ["“All services use structured JSON logging.” The whole team needs it on every task.", "proj", "Universal team standard: the project CLAUDE.md, loaded always and shared through git."],
          ["Your preference for terse commit messages.", "user", "Personal, every project, not imposed on teammates."],
          ["Conventions for *.sql migration files found in a dozen service folders.", "rules", "A file type scattered across directories: glob-scoped rule."],
          ["A /release-notes command every developer should have after pulling.", "cmd", "Project-scoped commands are versioned and shared."],
          ["A verbose dependency-audit workflow with its own scripts, run on demand in an isolated context.", "skill", "A skill with supporting files and context: fork."],
          ["Terraform conventions that matter only when editing infra/**/*.tf.", "rules", "A rule with paths: [\"infra/**/*.tf\"] loads only for those files."]
        ]
      }
    },
    {
      kind: "read",
      title: "Plan mode and iterative refinement",
      html: `
<h3>Plan mode vs direct execution</h3>
<div class="table-wrap"><table>
<thead><tr><th>Plan mode</th><th>Direct execution</th></tr></thead>
<tbody>
<tr><td>Large-scale or multi-file changes, architectural decisions, several valid approaches, migrations touching dozens of files</td><td>Clear, well-scoped changes: a single-file bug fix with a clear stack trace, adding one validation check</td></tr>
</tbody></table></div>
<p>Plan mode explores the codebase safely and designs the change before anything is edited, which prevents costly rework. A common pattern is to <strong>plan, then execute</strong>: plan a library migration, then carry it out directly. Use the <strong>Explore subagent</strong> to keep verbose discovery out of the main context.</p>
<h3>Iterating well</h3>
<ul>
<li><strong>Concrete examples beat prose.</strong> When a description of a transformation is interpreted inconsistently, give <strong>2–3 input/output examples</strong>.</li>
<li><strong>Test-driven iteration.</strong> Write tests (expected behavior, edge cases, performance) first, then iterate by sharing the failures.</li>
<li><strong>The interview pattern.</strong> In an unfamiliar domain, have Claude ask you questions first, to surface things like cache invalidation or failure modes before it builds.</li>
<li><strong>Batch interacting issues.</strong> If fixes interact, describe them together in one detailed message. If they're independent, fix them one after another.</li>
</ul>`
    },
    {
      kind: "widget",
      title: "Plan mode or direct?",
      intro: "Decide how to start each task.",
      widget: "sorter",
      config: {
        cats: [{ id: "plan", label: "Plan mode" }, { id: "direct", label: "Direct" }],
        items: [
          ["Fix a null check flagged by a stack trace in one function.", "direct", "Clear and narrow."],
          ["Migrate from one ORM to another across 60 files.", "plan", "A large-scale change with dependency risks."],
          ["Choose between event sourcing and CRUD for a new billing module.", "plan", "An architectural decision with several valid approaches."],
          ["Add a date-format validation to one form field.", "direct", "Well-understood, single change."],
          ["Split a monolith's user module into a separate service.", "plan", "Service boundaries and module dependencies need design first."]
        ]
      }
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q11-1", ts: "3.1", scenario: 2,
          stem: "A new engineer's Claude Code ignores the team's error-handling conventions, while senior engineers' sessions follow them. The conventions are in the tech lead's <code>~/.claude/CLAUDE.md</code>. Fix?",
          options: [
            { t: "Move the conventions into the project's CLAUDE.md and commit it.", ok: true, why: "User-level memory isn't shared. Team standards belong at project level." },
            { t: "Have the new engineer copy the tech lead's user-level file to their machine.", why: "This works once and drifts. It isn't versioned." },
            { t: "Paste the conventions into the start of every prompt.", why: "Manual and error-prone." },
            { t: "Store conventions in .claude/config.json.", trap: "T8", why: "That's not a memory mechanism." }
          ]
        },
        {
          id: "q11-2", ts: "3.1", scenario: 2,
          stem: "A monorepo has 9 packages. Payments needs the security and PCI standards; the web app needs accessibility and UI standards. The root CLAUDE.md is 1,400 lines of everything. What's the most maintainable setup?",
          options: [
            { t: "Keep everything in the root file, organized under a heading per package.", why: "Every session loads everything, and Claude has to infer relevance." },
            { t: "Give each package a CLAUDE.md that uses @import to pull in only its relevant standards files.", ok: true, why: "@import keeps memory modular and package-specific." },
            { t: "Copy the relevant standards into each package's CLAUDE.md.", why: "Duplication drifts." },
            { t: "Move all the standards into each engineer's user-level memory.", why: "Not shared, and still undifferentiated." }
          ]
        },
        {
          id: "q11-3", ts: "3.3", scenario: 2,
          stem: "Storybook files (<code>*.stories.tsx</code>) live next to components in 40 directories. You want their conventions applied automatically whenever one is edited, and not otherwise. Best approach?",
          options: [
            { t: "A <code>.claude/rules/storybook.md</code> file with <code>paths: [\"**/*.stories.tsx\"]</code> frontmatter.", ok: true, why: "A glob-scoped rule follows the file type across directories and loads only when relevant." },
            { t: "A CLAUDE.md file in each of the 40 component directories.", why: "Duplicated and directory-bound." },
            { t: "A Storybook section in the root CLAUDE.md.", why: "Always loaded, and relies on Claude inferring when it applies." },
            { t: "A /storybook skill developers run when editing stories.", why: "Manual invocation, not automatic." }
          ]
        },
        {
          id: "q11-4", ts: "3.2", scenario: 2,
          stem: "The team's <code>/deploy-check</code> skill is in the repo. You want a variant that also runs your personal smoke tests, without changing anything for teammates. What should you do?",
          options: [
            { t: "Edit .claude/skills/deploy-check/SKILL.md and don't commit the change.", why: "Fragile, and it risks an accidental commit." },
            { t: "Create a personal skill in ~/.claude/skills/ with a different name, such as deploy-check-plus.", ok: true, why: "A personal variant under a different name doesn't affect teammates." },
            { t: "Add your smoke-test steps to the project CLAUDE.md.", why: "This affects everyone, always." },
            { t: "Create ~/.claude/skills/deploy-check with the same name.", why: "Reusing the name creates confusing precedence. Use a distinct name." }
          ]
        },
        {
          id: "q11-5", ts: "3.2", scenario: 2,
          stem: "Running the <code>/analyze-deps</code> skill dumps about 30,000 tokens of dependency listings into the main conversation, degrading the rest of the session. Fix?",
          options: [
            { t: "Add <code>context: fork</code> to the skill's frontmatter so it runs in an isolated sub-agent context.", ok: true, why: "Verbose output stays out of the main conversation; only the result returns." },
            { t: "Run /compact after each use of the skill.", why: "This treats the symptom after the damage." },
            { t: "Move the skill's content into CLAUDE.md so it's always available.", why: "Then it's always loaded, which is worse." },
            { t: "Shorten the skill's instructions so it produces less output.", why: "The output is the problem, not the instructions." }
          ]
        },
        {
          id: "q11-6", ts: "3.2", scenario: 2,
          stem: "Developers often run <code>/triage</code> without a ticket ID, and the skill guesses which ticket they meant. What frontmatter fixes this?",
          options: [
            { t: "<code>argument-hint: \"[ticket-id]\"</code>", ok: true, why: "It prompts for the required parameter when it's missing." },
            { t: "<code>context: fork</code>", why: "This isolates context; it doesn't prompt for arguments." },
            { t: "<code>allowed-tools: Read</code>", why: "This controls tools, not arguments." },
            { t: "<code>required-args: true</code>", trap: "T8", why: "Not a real field." }
          ]
        },
        {
          id: "q11-7", ts: "3.4", scenario: 2,
          stem: "You must upgrade a logging library whose API changed, affecting about 45 files with a few different call patterns. What's the best workflow?",
          options: [
            { t: "Direct execution, file by file, fixing errors as they appear.", why: "This risks inconsistent patterns and rework when later files reveal new cases." },
            { t: "Plan mode to survey call patterns and design the migration, then execute the plan.", ok: true, why: "Plan for scale and multiple patterns, then implement directly." },
            { t: "Plan mode for the entire implementation too.", why: "Once the plan is set, execution doesn't need to stay in plan mode." },
            { t: "Direct execution, switching to plan mode if it gets complicated.", why: "The complexity is known up front." }
          ]
        },
        {
          id: "q11-8", ts: "3.5", scenario: 2,
          stem: "You've described in prose how to convert legacy address strings to structured fields. Claude's output handles units and PO boxes inconsistently across attempts. Most effective next step?",
          options: [
            { t: "Provide 2–3 concrete input/output examples, including a unit number and a PO box.", ok: true, why: "Examples communicate transformations better than prose." },
            { t: "Rewrite the prose description with more detail about units and PO boxes.", why: "More prose was already being interpreted inconsistently." },
            { t: "Ask Claude to be careful with edge cases this time.", trap: "T9", why: "A general exhortation." },
            { t: "Switch to plan mode before trying again.", why: "Plan mode doesn't clarify the transformation." }
          ]
        },
        {
          id: "q11-9", ts: "3.5", scenario: 2,
          stem: "You're asking Claude to add a caching layer to a service in a domain you don't know well. What technique best surfaces the considerations you haven't thought of?",
          options: [
            { t: "The interview pattern: have Claude ask you about invalidation, staleness and failure modes first.", ok: true, why: "It surfaces design considerations early." },
            { t: "Ask for the implementation now, then review it carefully against your requirements afterwards.", why: "Rework is likely when assumptions are wrong." },
            { t: "Write a long, detailed specification up front before Claude starts.", why: "You don't know what you don't know." },
            { t: "Use direct execution and add tests once it works.", why: "Tests can't check considerations nobody raised." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Ask who (me vs team) and when (always, matching files, on demand).",
        "~/.claude/CLAUDE.md is personal. Team standards go in the project CLAUDE.md. Use @import for modularity and /memory to diagnose.",
        ".claude/rules/ with paths globs: conventions for files scattered across directories.",
        "Commands: .claude/commands (team) vs ~/.claude/commands (personal). Skills: context: fork, allowed-tools, argument-hint.",
        "Plan mode for big, multi-file or architectural work; direct for scoped fixes; plan then execute.",
        "Iterate with I/O examples, tests first, the interview pattern, and batched interacting fixes."
      ]
    }
  ]
};
