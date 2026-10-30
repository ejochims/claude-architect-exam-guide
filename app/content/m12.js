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
<p class="small">Distractors invent mechanisms: a <code>--batch</code> flag, a <code>CLAUDE_HEADLESS</code> variable, piping <code>/dev/null</code> into stdin. Know the real ones.</p>
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
            { t: "Add <code>--output-format json</code> with a <code>--json-schema</code> for file, line, severity and message.", ok: true, why: "Structured, schema-shaped output is reliable to parse and post." },
            { t: "Make the parser's regular expressions more flexible so they handle rephrased findings.", trap: "T6", why: "This chases phrasing variations forever." },
            { t: "Ask in the prompt for a consistent output format.", trap: "T1", why: "Better, but probabilistic, when flags give a guarantee." },
            { t: "Add the <code>--format strict</code> flag to the command.", trap: "T8", why: "Not a real flag." }
          ]
        },
        {
          id: "q12-2", ts: "3.6", scenario: 5,
          stem: "After each new commit, the CI reviewer re-posts many of the comments it already made on the PR. Developers are annoyed. What should change?",
          options: [
            { t: "Include prior findings in context and have Claude report only new or still-unaddressed issues.", ok: true, why: "The reviewer knows what was already said." },
            { t: "Review only the latest commit's diff instead of the whole PR.", why: "This misses issues that span commits and unresolved earlier ones." },
            { t: "Deduplicate comments by exact text match against earlier comments before posting.", why: "Rephrased duplicates slip through." },
            { t: "Run the review only on the PR's first commit.", why: "Later changes go unreviewed." }
          ]
        },
        {
          id: "q12-3", ts: "3.6", scenario: 5,
          stem: "CI test generation keeps proposing tests that already exist and ignores the team's fixture helpers. What two changes help most?",
          options: [
            { t: "Provide existing test files in context, and document testing standards and available fixtures in CLAUDE.md.", ok: true, why: "Claude sees what's covered and what helpers exist." },
            { t: "Ask Claude in the prompt to “avoid duplicate tests” and “use our fixtures.”", trap: "T9", why: "It can't avoid duplicates it can't see." },
            { t: "Generate the tests in a nightly batch job instead of per PR.", why: "Timing doesn't change quality." },
            { t: "Use a higher-tier model for test generation.", trap: "T3", why: "Missing context, not capability." }
          ]
        },
        {
          id: "q12-4", ts: "3.6", scenario: 5,
          stem: "Where should CI-invoked Claude Code get the team's review criteria and testing conventions?",
          options: [
            { t: "The project CLAUDE.md in the repository.", ok: true, why: "CI-invoked Claude Code reads project memory like any session, and it's versioned with the code." },
            { t: "A <code>CLAUDE_REVIEW_RULES</code> environment variable.", trap: "T8", why: "Not a mechanism Claude Code uses." },
            { t: "The CI runner's ~/.claude/CLAUDE.md.", why: "This is runner-specific and not versioned with the code." },
            { t: "Pasted into each pipeline's prompt string.", why: "It works, but duplicates and drifts. CLAUDE.md is the mechanism." }
          ]
        },
        {
          id: "q12-5", ts: "1.7", scenario: 2,
          stem: "Yesterday you named a session “auth-race-condition” while investigating a bug. Today you want to continue it. Command?",
          options: [
            { t: "<code>claude --continue</code>", why: "This picks the most recent session in the directory, which may not be this one." },
            { t: "<code>claude --resume auth-race-condition</code>", ok: true, why: "Named resumption picks up that specific conversation." },
            { t: "<code>claude --session auth-race-condition</code>", trap: "T8", why: "Not the documented flag." },
            { t: "Start fresh and paste yesterday's notes.", why: "Valid if things are stale, but here the context is still useful." }
          ]
        },
        {
          id: "q12-6", ts: "1.7", scenario: 4,
          stem: "After a long analysis of a payments module, you want to try two different refactoring strategies without either polluting the other's conversation. Best approach?",
          options: [
            { t: "Use fork_session to create two branches from the shared analysis.", ok: true, why: "Forks share the baseline and diverge independently." },
            { t: "Resume the same session twice in two terminals.", why: "Both append to one history, which gets confusing." },
            { t: "Ask the session to try both approaches one after the other.", why: "The second approach is influenced by the first." },
            { t: "Start two fresh sessions and redo the analysis.", why: "This wastes the shared baseline." }
          ]
        },
        {
          id: "q12-7", ts: "1.7", scenario: 2,
          stem: "You resume an investigation session from last week. Since then, teammates refactored most of the module you analyzed. What's the most reliable approach?",
          options: [
            { t: "Resume the session and let Claude rely on its earlier tool results.", why: "Stale results mislead." },
            { t: "Start a new session and inject a structured summary of the findings that still hold.", ok: true, why: "Fresh with a summary beats reasoning over stale tool results." },
            { t: "Resume the session and run /compact to clean it up.", why: "Compacting stale content doesn't make it accurate." },
            { t: "Fork the old session and continue in the fork.", why: "The fork inherits the same stale context." }
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
