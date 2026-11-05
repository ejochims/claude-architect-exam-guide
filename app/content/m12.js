window.LESSONS.m12 = {
  revised: "2026-11-05",
  cards: [
    { f: "Claude Code hangs in CI waiting for input. Fix?", b: "Run it with -p (--print) for non-interactive mode." },
    { f: "Machine-parseable, schema-shaped CI output?", b: "--output-format json together with --json-schema." },
    { f: "How does CI-invoked Claude Code learn the team's review criteria?", b: "From the project CLAUDE.md, the same as an interactive session." },
    { f: "Re-review after new commits posts duplicate comments. Fix?", b: "Include prior findings in context; instruct Claude to report only new or still-unaddressed issues." },
    { f: "Continue yesterday's named investigation?", b: "claude --resume <session-name>." },
    { f: "Compare two refactoring approaches from the same analysis?", b: "fork_session (--fork-session) to branch from the shared baseline." },
    { f: "Resume or start fresh?", b: "Resume when prior context is mostly valid (and say which files changed). Start fresh with a structured summary when tool results are stale." }
  ],
  steps: [
    {
      kind: "read",
      title: "Start here: what CI/CD is, from zero",
      html: `
<p class="lede">CI/CD is how software teams stop one person's change from quietly breaking everyone else's work. It's a robot that checks every proposed change automatically, before a human approves it. Claude Code can be one of the checks that robot runs.</p>
<h3>The problem it solves</h3>
<p>Ten developers change the same code every day. If each change goes straight into the shared copy, nobody knows which one broke the billing page until a customer finds out. The answer is a gated path: <strong>propose, check automatically, review, then merge</strong>.</p>
<h3>The pieces, in order</h3>
<div class="flow" aria-label="The path of a code change">
<span class="box">Developer pushes a branch</span><span class="arr">→</span>
<span class="box">Pull request opened</span><span class="arr">→</span>
<span class="box">CI runner starts</span><span class="arr">→</span>
<span class="box">Checks run: tests, linters, Claude review</span><span class="arr">→</span>
<span class="box">Results posted on the PR</span><span class="arr">→</span>
<span class="box">Human approves and merges</span><span class="arr">→</span>
<span class="box">CD deploys</span>
</div>
<ul>
<li><strong>Branch.</strong> A developer's private line of changes, separate from the shared <code>main</code> copy.</li>
<li><strong>Pull request (PR).</strong> "Please review and merge my branch." Reviewers see exactly what changed (the <em>diff</em>) and comment on specific lines.</li>
<li><strong>CI, Continuous Integration.</strong> Every time a PR is opened or updated, a robot automatically builds the code and runs the checks, then reports pass or fail on the PR. Required checks can block merging until they pass.</li>
<li><strong>CD, Continuous Delivery or Deployment.</strong> After merge, the robot ships the change automatically, to a test environment or to production.</li>
<li><strong>The robot.</strong> A CI service such as GitHub Actions, GitLab CI or Jenkins. A <em>workflow file</em> committed in the repo (for example <code>.github/workflows/review.yml</code>) says: "when a PR opens, start a fresh machine, copy the code, run these commands."</li>
<li><strong>The runner.</strong> That fresh machine: temporary, empty and unattended. It's thrown away when the job ends.</li>
</ul>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div>
<ul style="margin:0;padding-left:18px">
<li><strong>A PR</strong> is like a DevOps Center work item, or a change set waiting for review before promotion.</li>
<li><strong>CI</strong> is like automatically deploying every proposed change to a scratch org and running all the Apex tests, on every change rather than once before release.</li>
<li><strong>The workflow file</strong> is like a record-triggered flow: a trigger (PR opened), then steps. The difference is that it runs on a throwaway machine.</li>
<li><strong>CD</strong> is the pipeline promoting the change to the next stage on its own.</li>
</ul></div>
<h3>The one fact that drives every exam question here</h3>
<p><strong>Nobody is sitting at the runner.</strong> There's no keyboard, no screen and nobody to click "Allow." Whatever runs there must finish without asking anything, and leave its results in a form another program can read and post on the PR. Every Claude Code CI flag exists because of this.</p>
<div class="callout key"><div class="callout-label">Blocking vs. non-blocking jobs</div><p>A <strong>pre-merge check</strong> blocks developers until it finishes, so it must be fast: use synchronous Claude calls. A <strong>nightly or weekly job</strong> (a test-gap report, a debt audit) blocks nobody, so it can use the Message Batches API for half the price (Module 10).</p></div>`
    },
    {
      kind: "read",
      title: "Claude Code in a pipeline, line by line",
      html: `
<p class="lede">Here's a complete, minimal GitHub Actions workflow that has Claude Code review every pull request. Read the file, then the table that explains each piece.</p>
<pre class="code"><code><span class="c"># .github/workflows/claude-review.yml (committed in the repo)</span>
on: pull_request                     <span class="c"># trigger: a PR is opened or updated</span>
jobs:
  review:
    runs-on: ubuntu-latest           <span class="c"># a fresh, temporary machine</span>
    steps:
      - uses: actions/checkout@v4    <span class="c"># copy the repo, CLAUDE.md included</span>
      - run: npm install -g @anthropic-ai/claude-code
      - run: |
          claude -p "Review this PR's changes using the review criteria in CLAUDE.md. Report only new or unaddressed issues." \\
            --output-format json \\
            --json-schema "$(cat .github/review-schema.json)" \\
            --allowedTools "Read,Grep,Glob" > review.json
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}  <span class="c"># from the CI secret store, never in the repo</span>
      - run: node scripts/post-comments.js review.json   <span class="c"># turn each finding into an inline PR comment</span></code></pre>
<div class="table-wrap"><table>
<thead><tr><th>Piece</th><th>What it does</th><th>Why it's needed</th></tr></thead>
<tbody>
<tr><td><code>-p</code> (<code>--print</code>)</td><td>Runs one request, prints the result and exits</td><td>Without it, Claude Code opens an interactive session and waits for typing that never comes, so the job hangs until it times out.</td></tr>
<tr><td><code>--output-format json</code></td><td>Prints machine-readable JSON instead of chat text</td><td>The next step is a program, not a person. It needs fields it can read.</td></tr>
<tr><td><code>--json-schema</code></td><td>Makes the final answer match your schema (file, line, severity, message)</td><td>The comment-posting script won't break when Claude phrases things differently. This is the same idea as Module 9's extraction schemas.</td></tr>
<tr><td><code>--allowedTools</code></td><td>Pre-approves the tools the run may use</td><td>No one is there to approve a tool. Grant only what the review needs, here read-only tools.</td></tr>
<tr><td>Project <code>CLAUDE.md</code></td><td>Read automatically, because checkout copied the repo</td><td>It's where the team's review criteria, testing standards and fixtures belong. The runner's own home folder is empty, so a <code>~/.claude/</code> file there would be wrong.</td></tr>
<tr><td><code>secrets.ANTHROPIC_API_KEY</code></td><td>Injects the key from the CI service's encrypted secret store</td><td>Keys never sit in the repo. This is the same principle as <code>\${VAR}</code> in <code>.mcp.json</code>.</td></tr>
</tbody></table></div>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><p>You've seen this pattern with the Salesforce CLI. In a script you run <code>sf project deploy start --json</code>, not the interactive Setup UI. <code>--json</code> gives the pipeline structured output it can parse, and a stored auth credential stands in for a person logging in. <code>claude -p … --output-format json</code> is the same move for Claude Code.</p></div>
<h3>Three design rules the exam tests</h3>
<ol class="moves">
<li><strong>Re-runs shouldn't repeat themselves.</strong> When new commits arrive, the workflow runs again. Include the previous findings in the prompt and ask for only new or still-unaddressed issues, or every push reposts the same comments.</li>
<li><strong>Test generation needs to see what exists.</strong> Give Claude the existing test files, so it doesn't propose tests you already have. Document what makes a test valuable, and the available fixtures, in <code>CLAUDE.md</code>.</li>
<li><strong>The reviewer shouldn't be the author.</strong> If one job has Claude write a fix, review it in a separate Claude Code run that sees only the diff and the criteria. The session that wrote the code keeps its own reasoning and tends to approve it, much as an author is a weaker reviewer of their own work than a fresh pair of eyes.</li>
</ol>
<div class="callout today"><div class="callout-label">Real world today</div><p>Anthropic also publishes a ready-made GitHub Action for Claude Code. It wraps this same pattern. The exam asks about the flags and the design rules, not about any particular CI product.</p></div>`
    },
    {
      kind: "widget",
      title: "Which piece does the job?",
      intro: "Match each job to the part of the pipeline that does it.",
      widget: "sorter",
      config: {
        cats: [{ id: "pr", label: "Pull request" }, { id: "wf", label: "CI workflow / runner" }, { id: "flag", label: "Claude Code flag" }, { id: "md", label: "Project CLAUDE.md" }, { id: "secret", label: "CI secret store" }],
        items: [
          ["Where reviewers see the diff, comment on lines and approve the change.", "pr", "The pull request is the review surface. CI posts its results there."],
          ["Starts a fresh machine every time a PR is opened or updated.", "wf", "The workflow file's trigger (on: pull_request) starts a runner."],
          ["Stops Claude Code from waiting for someone to type.", "flag", "-p (print mode): run once, print, exit."],
          ["Makes the findings come back in one fixed JSON shape.", "flag", "--output-format json with --json-schema."],
          ["Tells the CI reviewer what counts as a real bug and what to skip.", "md", "Review criteria in the project CLAUDE.md, which the runner reads after checkout."],
          ["Holds the Anthropic API key so it never sits in the repo.", "secret", "An encrypted CI secret, injected as an environment variable at run time."],
          ["Lists the test fixtures Claude should use when it generates tests.", "md", "Testing standards and fixtures belong in CLAUDE.md, so every run sees them."],
          ["Lets the run use Read, Grep and Glob without a person approving each one.", "flag", "--allowedTools pre-approves tools, which matters because no one is there to click Allow."]
        ]
      }
    },
    {
      kind: "read",
      title: "First principle: automation can't answer questions",
      html: `
<p class="lede">A CI runner has no human to type at a prompt and no human to read free text. Claude Code in a pipeline must run <strong>non-interactively</strong> and emit <strong>machine-readable</strong> output.</p>
<div class="table-wrap"><table>
<thead><tr><th>Need</th><th>Mechanism</th></tr></thead>
<tbody>
<tr><td>Don't hang waiting for input</td><td><code>claude -p "…"</code> (<code>--print</code>)</td></tr>
<tr><td>Parseable output</td><td><code>--output-format json</code></td></tr>
<tr><td>Output in an exact shape, e.g. findings to post as inline PR comments</td><td><code>--json-schema</code> with <code>--output-format json</code></td></tr>
<tr><td>Team standards, fixtures, review criteria</td><td>The project <code>CLAUDE.md</code>, which CI-invoked Claude Code reads</td></tr>
</tbody></table></div>
<p class="small">Distractors invent mechanisms: a <code>--batch</code> flag, a <code>CLAUDE_HEADLESS</code> variable, or offer shell workarounds such as piping <code>/dev/null</code> into stdin instead of the real mechanism. Know the real ones.</p>
<h3>Review and test generation that developers trust</h3>
<ul>
<li><strong>Re-runs:</strong> include the previous review's findings and tell Claude to report only <em>new or still-unaddressed</em> issues. Otherwise every push re-posts the same comments.</li>
<li><strong>Test generation:</strong> give it the existing test files so it doesn't propose duplicate scenarios, and document testing standards, what makes a test valuable, and the available fixtures in <code>CLAUDE.md</code>.</li>
<li><strong>Independence:</strong> the session that generated the code is a weak reviewer of it. Review in a separate instance.</li>
</ul>
<!-- ex:m12-ci -->
<h3>In code: a CI review step</h3>
<p>A GitHub Actions step that runs Claude Code non-interactively. <code>-p</code> means print mode, so it never waits for input; <code>--json-schema</code> makes the result machine-readable. Claude Code also reads the repository's CLAUDE.md, so project conventions apply in CI too.</p>
<pre class="code"><code>- name: Claude review
  env:
    ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    claude -p <span class="s">"Review this PR's diff. Report only new or unresolved issues."</span> \\
      --output-format json \\
      --json-schema <span class="s">"$(cat .github/review-schema.json)"</span> &gt; review.json</code></pre>
<!-- panel:m12-ci-terms -->
<div class="callout key"><div class="callout-label">CI terms</div><ul style="margin:0;padding-left:18px"><li><strong>CI (continuous integration).</strong> automated jobs that run on every push or pull request.</li><li><strong>Runner.</strong> the machine that runs those jobs.</li><li><strong>Headless.</strong> no person at a keyboard, so the agent can't ask questions and must not wait for input.</li><li><strong><code>&#36;{{ secrets.NAME }}</code>.</strong> GitHub Actions syntax that injects a stored secret, so API keys never appear in the workflow file.</li></ul></div>
`
    },
    {
      kind: "widget",
      title: "Build the CI step",
      intro: "Turn on each piece and watch the command and its behavior change.",
      widget: "ciBuilder"
    },
    {
      kind: "read",
      title: "Sessions: resume, fork, or start fresh",
      html: `
<p class="lede">Sessions store conversation history, not the state of your files. That shapes when it's safe to pick one up again.</p>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><ul style="margin:0;padding-left:18px">
<li><strong>A session</strong> is a saved transcript, like a case's activity history. It records what was said and done. It is not a snapshot of the org.</li>
<li><strong>Resume</strong> (<code>claude --resume &lt;session-name&gt;</code>) is like reopening a case. Safe when nothing important changed since, or when you tell Claude exactly what changed.</li>
<li><strong>Fork</strong> is like cloning two sandboxes from the same baseline to try two designs side by side.</li>
<li><strong>A fresh session with a summary</strong> is like opening a new case with a handoff note. Prefer it when the files changed a lot or the old transcript is full of stale tool results.</li>
</ul></div>
<div class="callout key"><div class="callout-label">Why it exists</div><ul style="margin:0;padding-left:18px"><li><strong>Problem before.</strong> real tasks span several sittings, and re-explaining context every time is slow and lossy.</li><li><strong>How sessions work.</strong> Claude Code saves each conversation's transcript locally. <code>--resume</code> reloads one (by name or ID) so it continues with full history; forking copies that history into a new session that then diverges.</li><li><strong>The catch.</strong> a resumed session also brings back old tool results, which may describe code that has since changed.</li><li><strong>Which to use.</strong> resume when nothing relevant changed; tell it what changed when a few files did; fork to explore alternatives; start fresh with a summary when most earlier results are stale.</li></ul></div>
<div class="table-wrap"><table>
<thead><tr><th>Situation</th><th>Use</th></tr></thead>
<tbody>
<tr><td>Continue a specific earlier investigation</td><td><code>claude --resume &lt;session-name&gt;</code></td></tr>
<tr><td>Explore two approaches from the same analysis</td><td><code>fork_session</code> (<code>--fork-session</code>): independent branches from a shared baseline</td></tr>
<tr><td>Resume after a few files changed</td><td>Resume, and <strong>tell Claude exactly which files changed</strong> for targeted re-analysis</td></tr>
<tr><td>Prior tool results are largely stale</td><td><strong>Start fresh</strong> with a structured summary injected. It's more reliable than reasoning over stale results</td></tr>
</tbody></table></div>
<p>When comparing two implementations, fork the session <em>and</em> use separate branches or worktrees, so the conversations diverge and the file edits don't collide.</p>
<p class="small">In the Agent SDK the same choices are options: <code>ClaudeAgentOptions(resume=session_id)</code> continues a session, adding <code>fork_session=True</code> branches a new one from it, and <code>continue_conversation=True</code> picks up the most recent.</p>
<!-- ex:m12-sessions -->
<h3>At the command line</h3>
<pre class="code"><code>claude --continue                                   <span class="c"># resume the most recent session here</span>
claude --resume 4f1c…                               <span class="c"># resume a specific session by ID</span>
claude --resume 4f1c… --fork-session                <span class="c"># same history, new branch of the work</span>
claude                                              <span class="c"># fresh start; paste a short summary of findings</span></code></pre>
<!-- panel:m12-names -->
<div class="callout key"><div class="callout-label">Names and worktrees</div><ul style="margin:0;padding-left:18px"><li><strong>Naming a session.</strong> start it with <code>claude -n auth-race-condition</code>, then resume it later with <code>claude --resume auth-race-condition</code>. Plain <code>--resume</code> opens a picker.</li><li><strong>A git worktree.</strong> a second working folder for the same repository, checked out on another branch, so two sessions can edit files without colliding.</li></ul></div>
`
    },
    {
      kind: "widget",
      title: "Resume, fork or fresh?",
      intro: "Pick the session strategy.",
      widget: "sorter",
      config: {
        cats: [{ id: "resume", label: "Resume" }, { id: "fork", label: "Fork" }, { id: "fresh", label: "Fresh + summary" }],
        items: [
          ["Pick up yesterday's “payments-timeout” investigation. Nothing changed overnight.", "resume", "Prior context is valid: --resume payments-timeout."],
          ["Compare a strategy-pattern refactor against a simple-conditionals refactor from the same analysis.", "fork", "Branch both from the shared baseline."],
          ["A teammate rewrote the module you analyzed last week; most findings are now wrong.", "fresh", "Stale tool results mislead. Start over with a summary of what still holds."],
          ["Two files you analyzed yesterday changed slightly this morning.", "resume", "Resume and name the changed files for targeted re-analysis."]
        ]
      }
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q12-1", ts: "3.6", scenario: 5,
          stem: "Your pipeline runs <code>claude -p</code> for PR review and posts results as inline comments, but the parsing script breaks whenever Claude phrases findings differently. Best fix?",
          options: [
            { t: "Add <code>--output-format json</code> and a <code>--json-schema</code> for the findings.", ok: true, why: "Schema-validated structured output gives the parser a guaranteed shape." },
            { t: "Make the parser's regular expressions tolerant of rephrasing, with fallbacks for the most common variants.", trap: "T6", why: "Chasing phrasing variations never ends. Fix the output format at the source." },
            { t: "Specify the exact format in the prompt, with an example finding such as <code>src/api.ts:42 high …</code>.", trap: "T1", why: "Helps, but prompt formatting is probabilistic. The CLI can enforce a schema." },
            { t: "Add the <code>--format strict</code> flag to the command.", trap: "T8", why: "Not a real flag." }
          ]
        },
        {
          id: "q12-2", ts: "3.6", scenario: 5,
          stem: "After each new commit, the CI reviewer re-posts many of the comments it already made on the PR. Developers are annoyed. What should change?",
          options: [
            { t: "Give Claude the prior findings and have it report only new or unaddressed issues.", ok: true, why: "With earlier results in context, Claude can tell what's new and what's been fixed." },
            { t: "Review only the latest commit's diff (<code>git diff HEAD~1</code>) instead of the whole PR.", why: "Misses issues that appear only when the new commit interacts with earlier changes." },
            { t: "Before posting, drop any comment whose text exactly matches one already on the PR.", why: "Rephrased duplicates slip through, and fixed issues are never acknowledged." },
            { t: "Run the review once, on the PR's first commit, and skip later commits.", why: "New problems in later commits go unreviewed." }
          ]
        },
        {
          id: "q12-3", ts: "3.6", scenario: 5,
          stem: "CI test generation keeps proposing tests that already exist and ignores the team's fixture helpers. What two changes help most?",
          options: [
            { t: "Ask in the prompt to avoid duplicate tests and to use the team's fixtures.", trap: "T9", why: "Claude can't avoid duplicates it can't see or use fixtures it doesn't know about." },
            { t: "Put existing test files in context, and document standards and fixtures in CLAUDE.md.", ok: true, why: "Context about what exists, and conventions in project memory, fix both problems at the source." },
            { t: "Move test generation to a nightly batch job (<code>cron: 0 2 * * *</code>) over the whole repo.", why: "Changes when it runs, not what it knows." },
            { t: "Use a higher-tier model for test generation, since it reasons better about coverage.", trap: "T3", why: "A bigger model still can't see the existing tests or fixtures." }
          ]
        },
        {
          id: "q12-4", ts: "3.6", scenario: 5,
          stem: "Where should CI-invoked Claude Code get the team's review criteria and testing conventions?",
          options: [
            { t: "The project CLAUDE.md in the repository.", ok: true, why: "Committed project memory loads in CI the same way it does locally." },
            { t: "A <code>CLAUDE_REVIEW_RULES</code> environment variable set in the pipeline's configuration.", trap: "T8", why: "Not a real mechanism." },
            { t: "A <code>~/.claude/CLAUDE.md</code> baked into the CI runner's image for every job.", why: "Unversioned and separate from the repo, so it drifts from what developers use locally." },
            { t: "Each pipeline's prompt string, pasted in full so the criteria are always explicit.", why: "Duplicated across pipelines and drifts. CLAUDE.md keeps one versioned source." }
          ]
        },
        {
          id: "q12-5", ts: "1.7", scenario: 2,
          stem: "Yesterday you named a session “auth-race-condition” while investigating a bug. Today you want to continue it. Command?",
          options: [
            { t: "<code>claude --continue</code>", why: "Continues the most recent conversation in this directory, which may not be this one." },
            { t: "<code>claude --resume auth-race-condition</code>", ok: true, why: "<code>--resume</code> with the session name picks up that named session." },
            { t: "<code>claude --resume auth-race-condition --fork-session</code>", why: "Forking creates a new branch from that session. You wanted to continue the original." },
            { t: "Start a new session and paste in yesterday's notes.", why: "Throws away context that is still valid. Nothing has changed since yesterday." }
          ]
        },
        {
          id: "q12-6", ts: "1.7", scenario: 4,
          stem: "After a long analysis of a payments module, you want to try two different refactoring strategies without either polluting the other's conversation. Best approach?",
          options: [
            { t: "Use <code>fork_session</code> to create two branches from the shared analysis.", ok: true, why: "Forks share the analysis up to the branch point, then diverge independently." },
            { t: "Resume the session twice, with <code>--resume</code> in two terminals, one strategy in each.", why: "Both attempts build on one session's history, so they aren't cleanly isolated." },
            { t: "Ask Claude to try both strategies one after the other in the current session.", why: "The second attempt is shaped by everything in the first." },
            { t: "Start two new sessions and redo the analysis in each one.", why: "Wastes the completed analysis." }
          ]
        },
        {
          id: "q12-7", ts: "1.7", scenario: 2,
          stem: "You resume an investigation session from last week. Since then, teammates refactored most of the module you analyzed. What's the most reliable approach?",
          options: [
            { t: "Resume the session and give Claude a specific list of the changed files, so it re-reads only those.", why: "Targeted re-analysis works when a few files changed. Here most of the module did, so nearly every earlier result is stale." },
            { t: "Start fresh, with a structured summary of the findings that still hold.", ok: true, why: "When most earlier tool results are stale, a fresh start with a curated summary is more reliable." },
            { t: "Resume the session and run <code>/compact</code> first so the stale details get summarized away.", why: "Compaction summarizes stale results; it doesn't refresh them." },
            { t: "Fork last week's session and continue the work in the fork.", why: "A fork inherits the same stale tool results." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "CI: -p for non-interactive; --output-format json + --json-schema for parseable, shaped output.",
        "CI reads the project CLAUDE.md. Put review criteria, testing standards and fixtures there.",
        "Re-reviews: include prior findings and report only new or unaddressed issues.",
        "Test generation: provide existing tests to avoid duplicates.",
        "--resume <name> for a specific session; fork_session for parallel approaches from one baseline.",
        "Resume and name the changed files when context is mostly valid; start fresh with a summary when it's stale."
      ]
    }
  ]
};
