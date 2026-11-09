window.LESSONS.m12 = {
  revised: "2026-11-05",
  cards: [
    { f: "Claude Code hangs in CI waiting for input. Fix?", b: "Run it with -p (--print) for non-interactive mode." },
    { f: "Machine-parseable, schema-shaped CI output?", b: "--output-format json together with --json-schema." },
    { f: "How does CI-invoked Claude Code learn the team's review criteria?", b: "From the project CLAUDE.md, the same as an interactive session." },
    { f: "Re-review after new commits posts duplicate comments. Fix?", b: "Include prior findings in context; instruct Claude to report only new or still-unaddressed issues." },
    { f: "Continue yesterday's named investigation?", b: "claude --resume <session-name>." },
    { f: "Compare two refactoring approaches from the same analysis?", b: "fork_session (--fork-session) to branch from the shared baseline." },
    { f: "Resume or start fresh?", b: "Resume when prior context is mostly valid (and say which files changed). Start fresh with a structured summary when tool results are stale." },
    { f: "What decides whether a CI step is green or red?", b: "Its exit code: 0 is success (green), anything else is failure (red). Claude finishing a review exits 0 even if it found bugs; a later step must fail the job on serious findings." },
    { f: "What turns a CI check into a real gate?", b: "Branch protection on main with the check marked required: the merge button stays disabled until it passes." },
    { f: "Continuous delivery vs continuous deployment?", b: "Both auto-deploy merged changes to staging. Delivery: a person releases to production. Deployment: production is automatic when every check passes." },
    { f: "The four runner constraints and their Claude Code settings?", b: "No input: -p. Program-readable output: --output-format json (+ --json-schema). No one to approve: --allowedTools. Knowledge from the repo: project CLAUDE.md." }
  ],
  steps: [
    {
      kind: "read", key: "cd-vc",
      title: "CI/CD from zero, part 1: version control and commits",
      html: `
<p class="lede">Before CI/CD makes sense, you need the thing it's built on: version control. It's a way for many people to change the same set of files without losing work, overwriting each other, or forgetting who changed what and why.</p>
<h3>The problem</h3>
<p>Imagine ten people editing one shared folder of files with no history. Someone's edit breaks the checkout page. Which edit? Who made it? What did the file look like yesterday, when it worked? Nobody knows, and there's no undo for the whole folder. Version control fixes exactly this.</p>
<h3>The pieces</h3>
<ul>
<li><strong>Repository ("repo").</strong> The project folder plus its complete history. This study guide lives in one: <code>claude-architect-exam-guide</code>.</li>
<li><strong>git.</strong> The version-control tool almost everyone uses. <strong>GitHub</strong> is a website that hosts git repositories and adds pull requests, reviews and CI on top.</li>
<li><strong>Commit.</strong> A saved snapshot of a change, with a short message, an author, a time and a unique ID (a hash such as <code>c33a369</code>). Commits are small and frequent: "Fix the sync loop on lesson pages" is one commit.</li>
<li><strong>History.</strong> The chain of commits. You can see who changed any line and why, compare any two points, and restore an earlier version.</li>
<li><strong><code>main</code>.</strong> The official, shared version of the code. What's on <code>main</code> is what the team agrees is true, and usually what gets released.</li>
<li><strong>Clone, push, pull.</strong> <em>Clone</em> downloads your own copy of the repo. <em>Push</em> uploads your new commits to GitHub. <em>Pull</em> downloads everyone else's.</li>
</ul>
<h3>What a change looks like: the diff</h3>
<p>Every commit records exactly which lines were added and removed. That's a <strong>diff</strong>, and it's what reviewers read:</p>
<pre class="code"><code>   module m12 minutes
<span class="c">-  minutes: 25</span>
<span class="s">+  minutes: 45</span></code></pre>
<p>Lines starting with <code>-</code> were removed, and lines with <code>+</code> were added. A reviewer doesn't read the whole codebase, just the diff.</p>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><ul style="margin:0;padding-left:18px">
<li><strong>A repo</strong> is like an SFDX project kept in source control: the org's metadata (objects, flows, Apex) stored as files.</li>
<li><strong>A commit</strong> is like one entry in a Setup Audit Trail, except it covers every line of every file, keeps the before-and-after, never expires, and can be undone.</li>
<li><strong><code>main</code></strong> is like the metadata that's in production: the agreed source of truth.</li>
<li><strong>Change sets have none of this.</strong> They don't keep line-by-line history and can't combine two people's edits. That gap is why DevOps Center is built on git underneath.</li>
</ul></div>`
    },
    {
      kind: "read", key: "cd-pr",
      title: "CI/CD from zero, part 2: branches, pull requests and merging",
      html: `
<p class="lede">If everyone committed straight to <code>main</code>, one half-finished change could break it for the whole team. So changes are built on the side, reviewed, and only then joined in.</p>
<h3>Branches</h3>
<p>A <strong>branch</strong> is your own line of commits that starts from <code>main</code> and runs alongside it. You can commit as often as you like there without affecting anyone. When the work is ready, you ask for it to be <strong>merged</strong>: your commits are joined into <code>main</code>.</p>
<h3>Pull requests</h3>
<p>A <strong>pull request (PR)</strong> is that request: "please review my branch and merge it into <code>main</code>." It's the place where the change is discussed, checked and approved. Its life cycle:</p>
<div class="flow" aria-label="Life of a pull request">
<span class="box">Open (often as a draft)</span><span class="arr">→</span>
<span class="box">Checks run</span><span class="arr">→</span>
<span class="box">Reviewers comment on the diff</span><span class="arr">→</span>
<span class="box">Author pushes fixes</span><span class="arr">→</span>
<span class="box">Approved</span><span class="arr">→</span>
<span class="box">Merged into main</span>
</div>
<h3>You've already done this</h3>
<p>The changes to this study guide went through exactly this path, as PR #11:</p>
<ol class="moves">
<li>The work happened on a branch named <code>claude/awesome-gauss-7uh44a</code>, starting from <code>main</code>.</li>
<li>Eight commits landed there between Nov 2 and Nov 5, from "Lesson quizzes start fresh" to "Add a sync loop breaker".</li>
<li>PR #11 was opened as a <strong>draft</strong>, meaning "not ready to merge yet."</li>
<li>When you said "merge and close," it was marked <strong>ready for review</strong> and then <strong>merged</strong>. The merge added one merge commit (<code>591cbdd</code>) to <code>main</code>, and the PR closed.</li>
</ol>
<p>One thing was missing: <strong>checks</strong>. PR #11 showed zero, because this repo has no CI. Before each push, I ran the guide's three test scripts by hand. Part 3 is about making a robot do that.</p>
<h3>Merge conflicts</h3>
<p>If your branch and <code>main</code> both changed the <em>same lines</em> since you branched, git can't know which version is right. That's a <strong>merge conflict</strong>. A person has to decide how to combine the two edits before the merge can finish. Git never silently picks one.</p>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><ul style="margin:0;padding-left:18px">
<li><strong>A branch</strong> is like a developer sandbox: your own space to change things without touching production.</li>
<li><strong>A PR</strong> is like a DevOps Center work item moving to the next stage, or a change set waiting for review. DevOps Center really does create a branch per work item and promote it with pull requests.</li>
<li><strong>A merge conflict</strong> is two admins editing the same flow in two sandboxes. With change sets the last deploy silently wins. With git you're forced to reconcile.</li>
</ul></div>`
    },
    {
      kind: "read", key: "cd-ci",
      title: "CI/CD from zero, part 3: CI, the robot that checks every change",
      html: `
<p class="lede"><strong>Continuous Integration (CI)</strong> means every change is checked automatically, every time, before it joins <code>main</code>. "Continuous" because it runs on every push, not once before a big release. "Integration" because it proves your change still works when combined with everyone else's.</p>
<h3>What a "check" actually is</h3>
<p>A check is just a command that a machine runs, and the machine reads one number at the end: the <strong>exit code</strong>. Exit code <code>0</code> means success, and the PR shows a green check. Anything else means failure, and the PR shows a red X. That's the whole contract.</p>
<div class="table-wrap"><table>
<thead><tr><th>Common check</th><th>What it does</th><th>Fails when</th></tr></thead>
<tbody>
<tr><td><strong>Build</strong></td><td>Turns the source into a runnable app</td><td>The code doesn't compile or assemble</td></tr>
<tr><td><strong>Tests</strong></td><td>Runs code that exercises the app and compares results to expectations</td><td>Any test's result is wrong</td></tr>
<tr><td><strong>Lint</strong></td><td>Checks style and common mistakes</td><td>Code breaks a team rule</td></tr>
<tr><td><strong>Security scan</strong></td><td>Looks for leaked keys and vulnerable libraries</td><td>Something risky is found</td></tr>
<tr><td><strong>AI review</strong> (Claude Code)</td><td>Reads the diff against the team's criteria and posts findings</td><td>Only if your workflow fails it on serious findings: Claude finishing its review is itself a success</td></tr>
</tbody></table></div>
<h3>Making checks a gate</h3>
<p>A check that runs but can be ignored is advice, not a gate. Teams make <code>main</code> <strong>protected</strong>: changes arrive only through a PR, and named checks are <strong>required</strong>, so the merge button stays disabled until they're green. That's the "prompts guide, code guarantees" idea from Module 3, applied to a team's code.</p>
<h3>Why it's worth it</h3>
<ul>
<li><strong>You find out in minutes, not weeks,</strong> and you know which change caused it: the one that just went red.</li>
<li><strong>Small changes are cheap to fix.</strong> Finding a break across a month of merged work is the expensive part.</li>
<li><strong>Nobody has to remember to run the tests.</strong> For this guide, I ran <code>content-check</code>, <code>cue-baselines</code> and the 351-check browser suite by hand before each push. CI is writing those three commands into a file so a robot runs them on every push, and the PR can't merge until they pass.</li>
</ul>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><p>You've met a CI gate already. Salesforce won't deploy Apex to production unless the tests pass and cover at least 75% of the code. That's a required check enforced by the platform. CI generalizes it: every proposed change runs the team's checks automatically, and the result decides whether it can merge.</p></div>`
    },
    {
      kind: "read", key: "cd-cd",
      title: "CI/CD from zero, part 4: CD, getting changes to users",
      html: `
<p class="lede">CI answers "is this change safe to join <code>main</code>?" <strong>CD</strong> answers "how does <code>main</code> reach users?" Once changes are merged and checked, the same robot can ship them, stage by stage.</p>
<h3>Environments</h3>
<div class="flow" aria-label="Environments a change moves through">
<span class="box">Development</span><span class="arr">→</span>
<span class="box">Test / staging (a copy of production)</span><span class="arr">→</span>
<span class="box">Production (real users)</span>
</div>
<p>Each environment is a separate running copy of the app. Staging is built to look like production, so problems show up there first.</p>
<h3>Two meanings of CD</h3>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Continuous Delivery</th><th>Continuous Deployment</th></tr></thead>
<tbody>
<tr><td>After merge</td><td>Automatically built, tested and deployed to staging</td><td>Same</td></tr>
<tr><td>To production</td><td>A person presses "release" when the business is ready</td><td>Automatic, as soon as every check passes</td></tr>
<tr><td>Best when</td><td>Releases need timing or sign-off</td><td>The tests are trusted enough to stand in for sign-off</td></tr>
</tbody></table></div>
<p>If a release goes wrong, teams <strong>roll back</strong>: they redeploy the previous version, which is easy because every version is a commit in history.</p>
<h3>The whole path, start to finish</h3>
<div class="flow" aria-label="The full CI/CD path">
<span class="box">Branch + commits</span><span class="arr">→</span>
<span class="box">Pull request</span><span class="arr">→</span>
<span class="box">CI checks (incl. Claude review)</span><span class="arr">→</span>
<span class="box">Human approval</span><span class="arr">→</span>
<span class="box">Merge to main</span><span class="arr">→</span>
<span class="box">CD: staging, then production</span>
</div>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><ul style="margin:0;padding-left:18px">
<li><strong>Environments</strong> are your sandbox chain: developer sandbox, then a partial or full sandbox for UAT, then production.</li>
<li><strong>Continuous delivery</strong> is like validating a deployment against production ahead of time, then using Quick Deploy in the release window.</li>
<li><strong>A DevOps Center pipeline</strong> is CD with stages you promote through.</li>
</ul></div>
<div class="callout note"><div class="callout-label">What the exam needs from this</div><p>The exam won't ask you to configure a deployment. It assumes you know this path, so that a question like "a pre-merge review that developers wait on" or "a nightly audit nobody waits on" makes sense at once. Claude Code's exam questions all sit in the CI half: the checks on a pull request, and scheduled jobs.</p></div>`
    },
    {
      kind: "widget", key: "cd-sort",
      title: "Which part of the path?",
      intro: "Sort each moment into the part of the path where it happens.",
      widget: "sorter",
      config: {
        cats: [{ id: "vc", label: "Version control (git)" }, { id: "pr", label: "Pull request & review" }, { id: "ci", label: "CI checks" }, { id: "cd", label: "CD (release)" }],
        items: [
          ["A developer saves a snapshot of a change with the message \"Fix rounding in invoice totals\".", "vc", "A commit: a recorded snapshot with a message, author and ID."],
          ["You find which change broke the export, and who made it three weeks ago.", "vc", "History: every line has a commit behind it."],
          ["A teammate comments on line 42 of the diff: \"This should handle null.\"", "pr", "Review happens on the PR, against the diff."],
          ["Two branches changed the same lines, and someone must decide how to combine them.", "pr", "A merge conflict, settled before the PR can merge."],
          ["The test suite runs automatically on a fresh machine within a minute of a push.", "ci", "CI: checks run on every push."],
          ["The merge button stays grey until the tests and Claude's review job are green.", "ci", "Required checks turn CI into a gate on main."],
          ["After merge, the app is deployed to staging automatically, and someone releases it to production on Tuesday.", "cd", "Continuous delivery: automatic to staging, with a human release step."],
          ["A bad release is fixed by redeploying the previous version.", "cd", "Rollback, which works because every version is in history."]
        ]
      }
    },
    {
      kind: "read", key: "cd-anat",
      title: "CI/CD from zero, part 5: anatomy of a pipeline",
      html: `
<p class="lede">A <strong>pipeline</strong> is the set of jobs the robot runs, written down in a <strong>workflow file</strong> that lives in the repo itself. Here's a minimal one for GitHub Actions, with no Claude yet: it just runs the tests.</p>
<pre class="code"><code><span class="c"># .github/workflows/tests.yml</span>
name: tests
on:                                  <span class="c"># TRIGGERS: when does this run?</span>
  pull_request:                      <span class="c">#   every time a PR is opened or updated</span>
  push:
    branches: [main]                 <span class="c">#   every merge to main</span>
jobs:
  test:                              <span class="c"># a JOB: one unit of work, on one machine</span>
    runs-on: ubuntu-latest           <span class="c"># the RUNNER: a fresh, empty, temporary computer</span>
    steps:                           <span class="c"># STEPS: commands, in order</span>
      - uses: actions/checkout@v4    <span class="c">#   copy the repo onto the runner</span>
      - run: npm ci                  <span class="c">#   install dependencies</span>
      - run: npm test                <span class="c">#   exit code 0 = green, anything else = red</span></code></pre>
<div class="table-wrap"><table>
<thead><tr><th>Piece</th><th>Plain meaning</th></tr></thead>
<tbody>
<tr><td><strong>Trigger</strong> (<code>on:</code>)</td><td>The event that starts it: a PR, a merge to <code>main</code>, a schedule (<code>schedule: cron: "0 2 * * *"</code> is 2 a.m. daily, UTC), or a manual button (<code>workflow_dispatch</code>)</td></tr>
<tr><td><strong>Job</strong></td><td>A unit of work on its own runner. Jobs can run in parallel or wait for each other.</td></tr>
<tr><td><strong>Runner</strong></td><td>A clean machine created for this job and thrown away afterward. Nothing from the last run survives, and nobody is logged in.</td></tr>
<tr><td><strong>Step</strong></td><td>One command. The first step to exit non-zero stops the job and turns it red.</td></tr>
<tr><td><strong>Secrets</strong></td><td>Keys stored encrypted in the CI service and injected as environment variables at run time (<code>\${{ secrets.NAME }}</code>), so they never sit in the repo.</td></tr>
<tr><td><strong>Logs and artifacts</strong></td><td>Everything a step prints is saved, so you can read why it failed. Files can be saved too, such as a report.</td></tr>
</tbody></table></div>
<h3>The one fact that drives every Claude Code CI question</h3>
<p><strong>Nobody is sitting at the runner.</strong> There's no keyboard, no screen and nobody to click "Allow." So anything that runs there must:</p>
<ol class="moves">
<li><strong>Never wait for input.</strong> A program that pauses for a person hangs until the job times out.</li>
<li><strong>Produce output another program can read,</strong> because the next step is a script, not a person.</li>
<li><strong>Already have every permission it needs,</strong> because nobody can approve anything mid-run.</li>
<li><strong>Get its knowledge from the repo,</strong> because the runner's own home folder is empty. Whatever <code>checkout</code> copied is all there is.</li>
</ol>
<p>Each of those four becomes a specific Claude Code setting on the next pages.</p>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><p>A workflow file is a record-triggered flow for code. The trigger is "PR opened" instead of "record created," and the steps are commands instead of elements. Unlike a flow, it runs on a throwaway machine with no running user, which is why it can't stop and ask anyone anything.</p></div>`
    },
    {
      kind: "read", key: "cd-claude",
      title: "Where Claude Code fits in the pipeline",
      html: `
<p class="lede">Claude Code is the same agent a developer runs at their desk, run by the robot instead. It reads the repo, uses its tools and reports back. What changes is when it runs, who waits for it, and what it's allowed to do.</p>
<div class="table-wrap"><table>
<thead><tr><th>Trigger</th><th>Claude Code's job</th><th>Who waits?</th><th>What that implies</th></tr></thead>
<tbody>
<tr><td>PR opened or updated</td><td>Review the diff against the team's criteria; post findings as inline comments</td><td>The developer, before merging</td><td>Must be fast: synchronous calls</td></tr>
<tr><td>PR opened or updated</td><td>Suggest or write tests for the changed code</td><td>The developer</td><td>Needs to see the existing tests, or it proposes duplicates</td></tr>
<tr><td>New commits on the same PR</td><td>Re-review</td><td>The developer</td><td>Pass in the previous findings and ask for only new or unaddressed issues</td></tr>
<tr><td>A check failed</td><td>Read the logs and propose a fix</td><td>The developer</td><td>A separate run should review that fix: the author is a weak reviewer of its own work</td></tr>
<tr><td>Nightly or weekly schedule</td><td>Test-gap report, dependency or tech-debt audit</td><td>Nobody</td><td>Latency doesn't matter; many independent requests can go through the Message Batches API at half price (Module 10)</td></tr>
</tbody></table></div>
<h3>The four constraints become four settings</h3>
<div class="table-wrap"><table>
<thead><tr><th>Constraint from the runner</th><th>Claude Code setting</th></tr></thead>
<tbody>
<tr><td>Never wait for input</td><td><code>claude -p "…"</code> (print mode): run once, print, exit</td></tr>
<tr><td>Output a program can read</td><td><code>--output-format json</code>, plus <code>--json-schema</code> for an exact shape</td></tr>
<tr><td>Permissions granted in advance</td><td><code>--allowedTools</code> pre-approves only what the job needs; read-only for a review</td></tr>
<tr><td>Knowledge comes from the repo</td><td>The project <code>CLAUDE.md</code>, read automatically after checkout: review criteria, testing standards, fixtures</td></tr>
</tbody></table></div>
<h3>Pass or fail is your decision</h3>
<p>When Claude finishes a review, the command succeeds and exits <code>0</code>, even if it found a serious bug. If you want serious findings to block the merge, add a step that reads Claude's JSON and exits non-zero when, say, any finding has <code>severity: "high"</code>. Then mark that job as a required check.</p>
<div class="callout key"><div class="callout-label">How the exam frames it</div><ul style="margin:0;padding-left:18px">
<li><strong>Symptoms point to a missing setting.</strong> "Hangs in CI" means <code>-p</code>. "The parser breaks on rephrased output" means <code>--output-format json</code> with <code>--json-schema</code>. "Doesn't follow our standards in CI" means project <code>CLAUDE.md</code>.</li>
<li><strong>Invented mechanisms are wrong.</strong> There's no <code>CLAUDE_HEADLESS</code> variable and no <code>--batch</code> flag, and piping <code>/dev/null</code> into it isn't the fix.</li>
<li><strong>Design questions test the re-run, test and reviewer rules</strong> from the table above, and blocking versus nightly.</li>
</ul></div>`
    },
    {
      kind: "widget", key: "cd-decide",
      title: "What decides it?",
      intro: "Each question is answered by one part of the pipeline. Sort them.",
      widget: "sorter",
      config: {
        cats: [{ id: "exit", label: "The exit code" }, { id: "req", label: "A required check" }, { id: "trig", label: "The trigger" }, { id: "secret", label: "A CI secret" }],
        items: [
          ["Whether a step shows a green check or a red X.", "exit", "0 is green; anything else is red."],
          ["Claude reported a critical bug, but its step is green.", "exit", "Claude finished successfully, so it exited 0. A later step must read the findings and exit non-zero."],
          ["Whether a red check actually stops the merge button.", "req", "Only checks marked required on a protected branch block merging."],
          ["main can only change through a PR whose tests passed.", "req", "Branch protection plus required checks."],
          ["The Claude review runs on every PR, but the dependency audit runs at 2 a.m.", "trig", "on: pull_request versus on: schedule."],
          ["A job someone starts by clicking a button before a release.", "trig", "A manual trigger: workflow_dispatch."],
          ["How the runner authenticates to the Anthropic API without a key in the repo.", "secret", "An encrypted secret injected as ANTHROPIC_API_KEY at run time."],
          ["Rotating the API key without changing any workflow file.", "secret", "Update the stored secret; the workflow only references its name."]
        ]
      }
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
<div class="callout today"><div class="callout-label">Real world today</div><p>Anthropic also publishes a ready-made GitHub Action for Claude Code. It wraps this same pattern. The exam asks about the flags and the design rules, not about any particular CI product.</p></div><!-- panel:m12-ci-terms -->
<div class="callout key"><div class="callout-label">CI terms</div><ul style="margin:0;padding-left:18px"><li><strong>CI (continuous integration).</strong> automated jobs that run on every push or pull request.</li><li><strong>Runner.</strong> the machine that runs those jobs.</li><li><strong>Headless.</strong> no person at a keyboard, so the agent can't ask questions and must not wait for input.</li><li><strong><code>&#36;{{ secrets.NAME }}</code>.</strong> GitHub Actions syntax that injects a stored secret, so API keys never appear in the workflow file.</li></ul></div>
`
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
      kind: "widget", key: "3",
      title: "Build the CI step",
      intro: "Turn on each piece and watch the command and its behavior change.",
      widget: "ciBuilder"
    },
    {
      kind: "read", key: "4",
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
      kind: "widget", key: "5",
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
      kind: "quiz", key: "6",
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
      kind: "recap", key: "7",
      title: "Recap",
      points: [
        "The path: commits on a branch, a pull request, CI checks, human approval, merge to main, then CD to staging and production.",
        "A CI check is a command; its exit code decides green (0) or red. Required checks on a protected main turn checks into a gate.",
        "Nobody is at the runner: no input, program-readable output, permissions granted up front, knowledge from the repo.",
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
