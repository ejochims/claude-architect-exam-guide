window.LESSONS.m11 = {
  cards: [
    { f: "A new teammate doesn't get the team's conventions. Common cause?", b: "The conventions live in someone's user-level ~/.claude/CLAUDE.md, which isn't shared. Move them to the project CLAUDE.md." },
    { f: "How do you diagnose which memory files are loaded?", b: "The /memory command (exam term; today /context lists what loaded and /memory opens the files)." },
    { f: "Conventions for test files spread across every directory?", b: ".claude/rules/ file with YAML frontmatter paths: [\"**/*.test.tsx\"]. It loads only when matching files are edited." },
    { f: "Team slash command vs personal one?", b: "Team: .claude/commands/ in the repo. Personal: ~/.claude/commands/. (Exam terms; commands are merged into skills today.)" },
    { f: "Skill frontmatter: context: fork, allowed-tools, argument-hint?", b: "fork = run in an isolated sub-agent context; allowed-tools = (exam) restrict tool access during the skill, today it pre-approves; argument-hint = (exam) prompt for missing parameters, today an autocomplete hint." },
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
<div class="callout key"><div class="callout-label">Why it exists</div><ul style="margin:0;padding-left:18px"><li><strong>Problem before.</strong> Claude is stateless, so without help every session starts knowing nothing about your project's conventions.</li><li><strong>What CLAUDE.md is.</strong> a Markdown file of instructions that Claude Code automatically loads into the model's context at the start of a session (its “memory”). Files can live at user level (<code>~/.claude/CLAUDE.md</code>), project level (committed in the repo) and in subdirectories (loaded when Claude works there).</li><li><strong>Rules, commands, skills.</strong> <strong>rules</strong> (<code>.claude/rules/*.md</code>) are instruction files that can be scoped to file patterns; <strong>commands</strong> are saved prompts you run as <code>/name</code>; <strong>skills</strong> are folders with a <code>SKILL.md</code> (plus optional scripts) that load only when invoked or relevant.</li><li><strong>@import.</strong> pulls another file into CLAUDE.md in full, so it organizes memory but doesn't save context. Path-scoped rules and skills are what keep context small.</li></ul></div>
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
<div class="callout key"><div class="callout-label">Why it exists</div><ul style="margin:0;padding-left:18px"><li><strong>What a skill is.</strong> a folder such as <code>.claude/skills/release/</code> containing <code>SKILL.md</code>: YAML <em>frontmatter</em> (settings between <code>---</code> lines, including a description) followed by the instructions themselves, and optionally scripts or templates.</li><li><strong>Who triggers it.</strong> you, by typing <code>/release</code>, or Claude, when the skill's description matches the task. Its full instructions load only then.</li><li><strong>Why this design.</strong> long procedures stay out of every session's context until they're needed, unlike CLAUDE.md, which always loads.</li><li><strong>Neighbors.</strong> a command is the simple, single-file version; an MCP prompt is a template served by an MCP server; CLAUDE.md is for standards that apply to every task.</li></ul></div>
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
<li>For your own variant of a team skill, create it in <code>~/.claude/skills/</code> <strong>under a different name</strong> so teammates aren't affected and the team version stays available to you.</li>
</ul>
<div class="callout today"><div class="callout-label">Real world today</div><p>Claude Code has since merged custom commands into skills (both create <code>/name</code>, and <code>.claude/commands/</code> still works). <code>allowed-tools</code> now <em>pre-approves</em> the listed tools for the turn, rather than restricting. <code>argument-hint</code> only shows a hint in autocomplete; it doesn't stop a skill being invoked without the argument. A personal skill with the same name as a project skill now takes precedence for you. Answer in the exam's terms. See <a href="#today">Exam vs. today</a>.</p></div>
<!-- panel:m11-commands-why -->
<div class="callout key"><div class="callout-label">Why slash commands exist</div><ul style="margin:0;padding-left:18px"><li><strong>Problem before.</strong> people retyped the same long prompts (a review checklist, release notes), each a little different, so results varied.</li><li><strong>What it is.</strong> a Markdown file whose body is the prompt. The file name becomes <code>/name</code>, and <code>$ARGUMENTS</code> inserts whatever you type after it.</li><li><strong>Where it lives.</strong> <code>.claude/commands/</code> is shared through the repository; <code>~/.claude/commands/</code> is only yours.</li><li><strong>When to use it, and its neighbors.</strong> a command or skill runs on demand; CLAUDE.md is always loaded; a path rule loads for matching files; a hook runs every time, guaranteed.</li><li><strong>On the exam.</strong> “the whole team should get it” means the project location; “only me” means the user location. (Today commands are merged into skills, which work the same way and can also be used by Claude automatically.)</li></ul></div>
`
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
          ["A simple /release-notes prompt (one Markdown file, no scripts) every developer should have after pulling.", "cmd", "Exam answer: a project command in .claude/commands/, versioned and shared. Today a project skill in .claude/skills/ works too, since commands merged into skills."],
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
<div class="callout key"><div class="callout-label">Why it exists</div><ul style="margin:0;padding-left:18px"><li><strong>Plan mode.</strong> Claude reads and explores but makes no edits; it proposes a plan and waits for your approval. Enter it with Shift+Tab in the terminal, or <code>--permission-mode plan</code>.</li><li><strong>Why it exists.</strong> for changes with design choices or many files, discovering the approach midway means rework. Planning first separates deciding from doing.</li><li><strong>Explore subagent.</strong> a built-in, read-only subagent for searching code. Its verbose output stays in its own context, and only a summary returns.</li><li><strong>Iterating well.</strong> concrete input/output examples remove ambiguity prose leaves; tests give an objective finish line; the interview pattern surfaces requirements you didn't know to state.</li></ul></div>
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
            { t: "Move the conventions into the project's CLAUDE.md and commit it.", ok: true, why: "Project-level memory is shared through version control; user-level memory applies only to the person who wrote it." },
            { t: "Have each new engineer copy the tech lead's <code>~/.claude/CLAUDE.md</code> into their own home directory during onboarding.", why: "Works until the lead edits their copy. Shared standards belong in the repo, not in personal files." },
            { t: "Add an @import in each engineer's user-level CLAUDE.md that points at the lead's file on a shared drive.", why: "Fragile and still per-person. Committing to the project CLAUDE.md gives everyone the same version." },
            { t: "Store the conventions in <code>.claude/config.json</code> at the repo root.", trap: "T8", why: "Not a Claude Code memory file." }
          ]
        },
        {
          id: "q11-2", ts: "3.1", scenario: 2,
          stem: "A monorepo has 9 packages. Payments needs the security and PCI standards; the web app needs accessibility and UI standards. The root CLAUDE.md is 1,400 lines of everything. What's the most maintainable setup?",
          options: [
            { t: "Keep one root file, organized under a heading for each package, so everything stays in one place.", why: "Every session still loads all 1,400 lines, including standards irrelevant to the package being edited." },
            { t: "Give each package its own CLAUDE.md that @imports only the standards files that package needs.", ok: true, why: "Modular standards files, imported where relevant, stay maintainable and keep context focused." },
            { t: "Copy the relevant standards text into each package's CLAUDE.md so each package is self-contained.", why: "Copies drift apart. Import shared files instead of duplicating them." },
            { t: "Move the standards into each engineer's <code>~/.claude/CLAUDE.md</code>, organized by the packages they work on.", why: "Standards become per-person and unversioned, so teammates diverge." }
          ]
        },
        {
          id: "q11-3", ts: "3.3", scenario: 2,
          stem: "Terraform conventions take up 600 of the root CLAUDE.md's 1,100 lines, but most sessions never touch <code>.tf</code> files, which live in <code>infra/</code>, <code>modules/</code> and several <code>services/*/deploy/</code> folders. A teammate proposes moving them to <code>terraform.md</code> and adding <code>@terraform.md</code> to the root CLAUDE.md to save context. What's the better approach?",
          options: [
            { t: "Do it: an <code>@terraform.md</code> import is only read when Claude opens a <code>.tf</code> file, so this already saves context.", why: "Imports are expanded at load time, so the 600 lines still load in every session." },
            { t: "Move them into <code>.claude/rules/terraform.md</code> with <code>paths: [\"**/*.tf\"]</code>, so they load only for Terraform files.", ok: true, why: "A path-scoped rule loads only when Claude works with matching files, wherever they are." },
            { t: "Put a copy of the conventions in a CLAUDE.md inside each folder that contains Terraform files.", why: "Saves context but duplicates the conventions across many folders, so they drift." },
            { t: "Turn them into a <code>/terraform</code> skill that developers invoke before editing infrastructure code.", why: "Saves context, but depends on people remembering to invoke it. A path-scoped rule applies automatically." }
          ]
        },
        {
          id: "q11-4", ts: "3.2", scenario: 2,
          stem: "The team's <code>/deploy-check</code> skill is in the repo. You want a variant that also runs your personal smoke tests, without changing anything for teammates. What should you do?",
          options: [
            { t: "Edit <code>.claude/skills/deploy-check/SKILL.md</code> locally and simply never commit the change.", why: "One accidental commit changes it for everyone, and every pull brings merge conflicts." },
            { t: "Create a personal skill in <code>~/.claude/skills/</code> with a different name, such as <code>deploy-check-plus</code>.", ok: true, why: "A personal skill under a different name affects only you, and you can still run the team version." },
            { t: "Add your smoke-test steps to the project CLAUDE.md under a section marked <code>personal</code>.", why: "Project memory is shared, so every teammate gets your steps." },
            { t: "Create <code>~/.claude/skills/deploy-check</code> with the same name, so your version runs in place of the team's.", why: "Exam framing: use a different name. A same-name personal skill shadows the team version, so you'd silently stop getting the team's updates." }
          ]
        },
        {
          id: "q11-5", ts: "3.2", scenario: 2,
          stem: "Running the <code>/analyze-deps</code> skill dumps about 30,000 tokens of dependency listings into the main conversation, degrading the rest of the session. Fix?",
          options: [
            { t: "Add <code>context: fork</code> to the skill's frontmatter so it runs in an isolated sub-agent context.", ok: true, why: "The skill runs in an isolated sub-agent context and returns only its result to the main conversation." },
            { t: "Run <code>/compact</code> after each use of the skill to summarize the dependency listing away.", why: "Cleans up after the damage, and compaction can drop details you still need." },
            { t: "Have the skill write the full listing to a file and print only a short summary to the conversation.", why: "Helps, but the skill's own exploration still runs in the main context. Forking isolates all of it." },
            { t: "Move the skill's instructions into CLAUDE.md so they're loaded once per session instead.", why: "Instructions aren't the problem; the 30,000-token output is." }
          ]
        },
        {
          id: "q11-6", ts: "3.2", scenario: 2,
          stem: "Developers often run <code>/triage</code> without a ticket ID, and the skill guesses which ticket they meant. What frontmatter fixes this?",
          options: [
            { t: "<code>argument-hint: \"[ticket-id]\"</code>", ok: true, why: "Exam framing: argument-hint tells developers the skill expects a ticket ID. (Real world today: it shows a hint in autocomplete; the skill body should still handle a missing ID. See Exam vs. today.)" },
            { t: "<code>context: fork</code>, so the guess happens in an isolated context", why: "Isolates context. It doesn't tell anyone an argument is expected." },
            { t: "<code>allowed-tools: Read</code>, so the skill can't change the wrong ticket", why: "Limits tools. It doesn't address the missing argument." },
            { t: "<code>required-args: true</code>", trap: "T8", why: "Not a skill frontmatter field." }
          ]
        },
        {
          id: "q11-7", ts: "3.4", scenario: 2,
          stem: "You must upgrade a logging library whose API changed, affecting about 45 files with a few different call patterns. What's the best workflow?",
          options: [
            { t: "Direct execution, file by file, fixing compile errors as they appear.", why: "With several call patterns across 45 files, you'd discover the patterns mid-change and rework earlier files." },
            { t: "Plan mode to survey the patterns and design the migration, then execute the plan.", ok: true, why: "Plan for multi-file work with several valid approaches, then execute the agreed plan." },
            { t: "Plan mode for the whole task, including making each of the 45 edits.", why: "Planning is for investigation and design. Once the approach is set, execution doesn't need it." },
            { t: "Direct execution, switching to plan mode only if a file turns out to be complicated.", why: "By the time it's complicated, earlier files may already follow the wrong pattern." }
          ]
        },
        {
          id: "q11-8", ts: "3.5", scenario: 2,
          stem: "You've described in prose how to convert legacy address strings to structured fields. Claude's output handles units and PO boxes inconsistently across attempts. Most effective next step?",
          options: [
            { t: "Give 2–3 concrete input/output examples that include a unit number and a PO box.", ok: true, why: "Examples communicate a transformation more precisely than prose." },
            { t: "Rewrite the prose with a dedicated paragraph each for unit numbers (“Apt 4B”) and PO boxes (“PO Box 12”).", why: "More prose is still prose. Concrete examples remove the ambiguity." },
            { t: "Ask Claude to be especially careful with edge cases this time.", trap: "T9", why: "An exhortation adds no information." },
            { t: "Switch to plan mode so Claude designs the parsing approach before writing the code.", why: "Planning doesn't resolve what the output should look like. Examples do." }
          ]
        },
        {
          id: "q11-9", ts: "3.5", scenario: 2,
          stem: "You're asking Claude to add a caching layer to a service in a domain you don't know well. What technique best surfaces the considerations you haven't thought of?",
          options: [
            { t: "Ask Claude to interview you first, about invalidation, staleness and failure modes.", ok: true, why: "The interview pattern surfaces design considerations you didn't know to specify." },
            { t: "Ask for the implementation now, then review it carefully against your requirements afterwards.", why: "You can only check what you already thought of. The unknown considerations stay unknown." },
            { t: "Write a long, detailed specification up front, covering every behavior you can think of, before Claude starts.", why: "In an unfamiliar domain, your specification has the same blind spots you do." },
            { t: "Use direct execution, then add tests for each behavior once the cache works end to end.", why: "Tests check what you anticipated; they won't surface considerations you missed." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Ask who (me vs team) and when (always, matching files, on demand).",
        "~/.claude/CLAUDE.md is personal. Team standards go in the project CLAUDE.md. Use @import for modularity and /memory to diagnose (exam term; /context lists what loaded today).",
        ".claude/rules/ with paths globs: conventions for files scattered across directories.",
        "Commands (exam terms): .claude/commands (team) vs ~/.claude/commands (personal). Skills: context: fork, allowed-tools, argument-hint.",
        "Plan mode for big, multi-file or architectural work; direct for scoped fixes; plan then execute.",
        "Iterate with I/O examples, tests first, the interview pattern, and batched interacting fixes."
      ]
    }
  ]
};
