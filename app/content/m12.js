window.LESSONS.m12 = {
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
</ul>`
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
<div class="callout key"><div class="callout-label">Why it exists</div><ul style="margin:0;padding-left:18px"><li><strong>Problem before.</strong> real tasks span several sittings, and re-explaining context every time is slow and lossy.</li><li><strong>How sessions work.</strong> Claude Code saves each conversation's transcript locally. <code>--resume</code> reloads one (by name or ID) so it continues with full history; forking copies that history into a new session that then diverges.</li><li><strong>The catch.</strong> a resumed session also brings back old tool results, which may describe code that has since changed.</li><li><strong>Which to use.</strong> resume when nothing relevant changed; tell it what changed when a few files did; fork to explore alternatives; start fresh with a summary when most earlier results are stale.</li></ul></div>
<div class="table-wrap"><table>
<thead><tr><th>Situation</th><th>Use</th></tr></thead>
<tbody>
<tr><td>Continue a specific earlier investigation</td><td><code>claude --resume &lt;session-name&gt;</code></td></tr>
<tr><td>Explore two approaches from the same analysis</td><td><code>fork_session</code> (<code>--fork-session</code>): independent branches from a shared baseline</td></tr>
<tr><td>Resume after a few files changed</td><td>Resume, and <strong>tell Claude exactly which files changed</strong> for targeted re-analysis</td></tr>
<tr><td>Prior tool results are largely stale</td><td><strong>Start fresh</strong> with a structured summary injected. It's more reliable than reasoning over stale results</td></tr>
</tbody></table></div>
<p>When comparing two implementations, fork the session <em>and</em> use separate branches or worktrees, so the conversations diverge and the file edits don't collide.</p>`
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
