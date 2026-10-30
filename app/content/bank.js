// Extra scenario questions used by drills and the mock exam (not attached to a lesson step).
window.BANK = [
  // ---------- Scenario 2: Code Generation with Claude Code ----------
  {
    id: "b2-1", ts: "3.1", scenario: 2,
    stem: "In the same repository, Claude follows the team's naming conventions in some sessions but not others. What is the best first diagnostic?",
    options: [
      { t: "Run <code>/memory</code> to see which memory files are actually loaded in the failing sessions.", ok: true, why: "If the file holding the rule isn't loaded for that working directory, no rewording will help. Check loading first." },
      { t: "Rewrite the conventions in CLAUDE.md in capital letters.", trap: "T9", why: "Emphasis doesn't matter if the file isn't loaded." },
      { t: "Switch to a more capable model.", trap: "T3", why: "Inconsistency by session points to configuration, not capability." },
      { t: "Paste the conventions into the start of every prompt.", why: "A workaround that skips diagnosing the loading problem." }
    ]
  },
  {
    id: "b2-2", ts: "3.3", scenario: 2,
    stem: "A rule file has <code>paths: [\"src/api/**/*\"]</code>, but its conventions don't apply when Claude edits API tests in <code>tests/api/</code>. Why?",
    options: [
      { t: "Path-scoped rules load only for matching files, and tests/api/ doesn't match src/api/**/*. Add a matching pattern.", ok: true, why: "Rules with paths load only when the edited file matches." },
      { t: "Rules files are only loaded when they're referenced from the repository root CLAUDE.md.", trap: "T8", why: ".claude/rules/ files load on their own." },
      { t: "The paths field doesn't support globs; it needs a regular expression.", trap: "T8", why: "paths takes glob patterns." },
      { t: "The rule has to be copied into a tests/api/CLAUDE.md file before it applies to that folder.", why: "Fixing the glob is cleaner than duplicating the rule." }
    ]
  },
  {
    id: "b2-3", ts: "3.2", scenario: 2,
    stem: "A <code>/scaffold-component</code> skill should only read templates and write new files. It should never run shell commands. Which frontmatter setting configures this?",
    options: [
      { t: "<code>allowed-tools</code>, listing only the file tools the skill needs", ok: true, why: "allowed-tools configures tool access while the skill runs." },
      { t: "<code>context: fork</code>, so the skill runs isolated from the shell", why: "Isolates context; doesn't limit tools." },
      { t: "<code>argument-hint</code>, declaring which tools the skill may use", why: "Prompts for parameters; doesn't limit tools." },
      { t: "<code>sandbox: true</code>, which disables shell access for the skill", trap: "T8", why: "Not a skill frontmatter field." }
    ]
  },
  {
    id: "b2-4", ts: "3.2", scenario: 2,
    stem: "Your team has a 300-line quarterly dependency-audit procedure. Someone proposes adding it to the root CLAUDE.md so Claude “always knows it.” Better option?",
    options: [
      { t: "Make it an on-demand skill; keep CLAUDE.md for standards that apply to every task.", ok: true, why: "Skills are on demand and task-specific; CLAUDE.md is always loaded." },
      { t: "Add it to CLAUDE.md under a clear heading so it's always available.", why: "This spends tokens on every turn for a quarterly task, and dilutes everyday rules." },
      { t: "Add it to each developer's ~/.claude/CLAUDE.md instead.", why: "Not shared, and still always loaded." },
      { t: "Paste the procedure into the prompt each quarter.", why: "Error-prone and unversioned." }
    ]
  },
  {
    id: "b2-5", ts: "3.5", scenario: 2,
    stem: "Three bugs remain: the date parser drops time zones, the import validator rejects valid ISO dates, and the monthly rollup double-counts midnight records. All stem from the shared date utility. How should you ask Claude to fix them?",
    options: [
      { t: "Describe all three together in one detailed message, because the fixes interact through the shared utility.", ok: true, why: "Interacting issues belong in a single message. Fixing one at a time risks undoing the others." },
      { t: "Fix them one at a time in separate messages, verifying each before the next.", why: "Better for independent issues. These interact." },
      { t: "Ask Claude to fix only the most important bug first.", why: "This leaves related bugs and invites rework." },
      { t: "Use plan mode separately for each of the three bugs.", why: "Three separate plans miss the shared cause." }
    ]
  },
  {
    id: "b2-6", ts: "3.5", scenario: 2,
    stem: "A data-migration script Claude wrote crashes on rows where <code>middle_name</code> is NULL. You've told it twice to “handle nulls,” and its fixes still fail on some rows. Most effective next step?",
    options: [
      { t: "Give a specific test case: an input row with NULLs and the exact expected output.", ok: true, why: "Concrete input and expected output pin down the edge case." },
      { t: "Tell Claude to be very careful with null values this time.", trap: "T9", why: "A general exhortation." },
      { t: "Rewrite the script yourself instead of iterating.", why: "This abandons the iteration loop." },
      { t: "Switch to plan mode and ask Claude to rethink the script.", why: "The problem is specification, not planning." }
    ]
  },

  // ---------- Scenario 4: Developer Productivity with Claude ----------
  {
    id: "b4-1", ts: "2.5", scenario: 4,
    stem: "A developer asks the agent to list every React component test file in a large monorepo. Which built-in tool should it use first?",
    options: [
      { t: "Glob with a pattern such as <code>**/*.test.tsx</code>", ok: true, why: "Finding files by name pattern is Glob's job." },
      { t: "Grep for “describe(”", why: "This searches contents, slowly, and matches non-component tests too." },
      { t: "Read the root directory listing recursively", why: "Inefficient, and Read isn't a search tool." },
      { t: "Bash with a long find command", why: "It works, but the built-in Glob is the intended tool." }
    ]
  },
  {
    id: "b4-2", ts: "2.5", scenario: 4,
    stem: "An engineer wants to understand how a legacy order service processes cancellations. What exploration strategy should the agent follow?",
    options: [
      { t: "Grep for the cancellation entry point, Read it, then follow imports to trace the flow.", ok: true, why: "Incremental exploration from entry points keeps context focused." },
      { t: "Read every file in the service before answering, to be thorough.", why: "This floods context and degrades answers." },
      { t: "Glob for files containing “cancel” in the name and read them all.", why: "Name matching misses logic and pulls in noise." },
      { t: "Ask the engineer which files implement cancellation.", why: "This pushes work back that the tools can do." }
    ]
  },
  {
    id: "b4-3", ts: "1.5", scenario: 4,
    stem: "A developer-productivity agent built on the Agent SDK must never run <code>git push --force</code> against protected branches. What's the right mechanism?",
    options: [
      { t: "A PreToolUse hook on Bash that denies matching commands and explains the allowed alternative.", ok: true, why: "Tool-call interception guarantees the rule." },
      { t: "Add a line to CLAUDE.md forbidding force pushes to protected branches.", trap: "T1", why: "Probabilistic, for an irreversible action." },
      { t: "Remove Bash from the agent's tools entirely.", why: "Overkill. The agent needs Bash for tests and builds." },
      { t: "Instruct the model to ask for confirmation before every git command.", trap: "T1", why: "This still relies on the model, and adds friction." }
    ]
  },
  {
    id: "b4-4", ts: "1.5", scenario: 4,
    stem: "Three MCP servers report file sizes as raw bytes, “4.2 MB” strings and kibibytes. The agent's cleanup recommendations are often off by orders of magnitude. Best fix?",
    options: [
      { t: "Add a PostToolUse hook that normalizes every size to bytes before the agent sees it.", ok: true, why: "Normalize heterogeneous formats in code before the model reasons over them." },
      { t: "Explain all three size formats and how to convert them in the system prompt.", trap: "T1", why: "This asks the model to do mechanical conversion perfectly." },
      { t: "Merge the three MCP servers into one server.", trap: "T5", why: "Merging doesn't normalize anything, and you may not own the servers." },
      { t: "Ask the agent to double-check its unit conversions.", trap: "T1", why: "This is still probabilistic." }
    ]
  },
  {
    id: "b4-5", ts: "2.3", scenario: 4,
    stem: "A single developer-productivity agent has 26 tools from four MCP servers plus the built-ins. Logs show frequent wrong-tool calls among similar tools. Which change most improves selection?",
    options: [
      { t: "Split the work into specialized subagents, each with only the tools its role needs.", ok: true, why: "Fewer, role-scoped tools per agent improve selection reliability." },
      { t: "Add a detailed paragraph per tool to the system prompt.", why: "Helpful, but 26 options is still too many." },
      { t: "Consolidate all MCP tools into one generic <code>do_task</code> tool.", trap: "T5", why: "This hides the real choices." },
      { t: "Move to a bigger model that copes better with large, overlapping tool sets.", trap: "T3", why: "Decision complexity remains." }
    ]
  },
  {
    id: "b4-6", ts: "1.3", scenario: 4,
    stem: "An “explorer” subagent meant only to map unfamiliar code occasionally edits files while investigating. Where should you fix this?",
    options: [
      { t: "Restrict its tools in its AgentDefinition to read-only ones (Read, Grep, Glob).", ok: true, why: "Tool restrictions in the agent definition make the role's limits structural." },
      { t: "Tell it in its prompt that it must never edit files.", trap: "T1", why: "Structural restriction is more reliable." },
      { t: "Give the coordinator fewer tools so it delegates less.", trap: "T7", why: "The subagent is the one editing." },
      { t: "Have a reviewer check its edits after each run.", why: "Reactive, and it wastes reviewer time." }
    ]
  },
  {
    id: "b4-7", ts: "2.4", scenario: 4,
    stem: "Five internal teams are building different Claude-powered tools that all need read access to your company's API catalog. What's the most reusable integration?",
    options: [
      { t: "Expose the catalog once through an MCP server that every team's client can connect to.", ok: true, why: "MCP shines when many clients need the same integration." },
      { t: "Have each of the five teams write its own custom tool against the catalog API.", why: "Five implementations that drift apart." },
      { t: "Paste the full catalog into each tool's system prompt.", trap: "T3", why: "Bloated and stale." },
      { t: "Put the catalog in each repository's CLAUDE.md file.", why: "Only works in Claude Code, and goes stale." }
    ]
  },
  {
    id: "b4-8", ts: "1.6", scenario: 4,
    stem: "The agent must generate CRUD boilerplate (model, controller, tests, docs) for 30 similar entities that follow an established pattern. Which decomposition fits?",
    options: [
      { t: "A fixed sequential pipeline (prompt chaining) applied per entity.", ok: true, why: "Predictable, repeated steps suit chaining." },
      { t: "Dynamic decomposition that re-plans after each entity.", why: "Unnecessary overhead and variability for a known pattern." },
      { t: "One giant prompt generating all 30 at once.", trap: "T3", why: "Attention dilution and inconsistent output." },
      { t: "Ask the developer to specify each file individually.", why: "This defeats the purpose of automation." }
    ]
  },

  // ---------- Scenario 5: Claude Code for CI ----------
  {
    id: "b5-1", ts: "3.6", scenario: 5,
    stem: "A GitHub Actions step runs <code>claude \"Summarize risky changes in this PR\"</code> and times out after 6 hours with no output. What's the fix?",
    options: [
      { t: "Run <code>claude -p \"Summarize risky changes in this PR\"</code>.", ok: true, why: "Print mode runs non-interactively and exits." },
      { t: "Add <code>--yes</code> to auto-approve prompts.", trap: "T8", why: "Not the documented mechanism for non-interactive runs." },
      { t: "Set <code>CI=true</code> so Claude detects the runner.", trap: "T8", why: "Not how Claude Code switches modes." },
      { t: "Increase the job timeout so the step has time to finish.", why: "It will wait forever either way." }
    ]
  },
  {
    id: "b5-2", ts: "4.2", scenario: 5,
    stem: "The security reviewer flags parameterized queries as SQL injection in about 30% of PRs. Its criteria already say “flag only user input concatenated into SQL.” What helps most next?",
    options: [
      { t: "Add few-shot examples contrasting safe parameterized queries with real concatenation.", ok: true, why: "Examples of acceptable vs problematic patterns cut false positives and generalize." },
      { t: "Add “be conservative about SQL injection findings” to the prompt.", trap: "T9", why: "A general exhortation." },
      { t: "Disable the security review category entirely.", why: "Security findings are the most valuable category. Fix this one pattern instead." },
      { t: "Only post findings the model rates 9/10 or higher.", trap: "T4", why: "Uncalibrated confidence." }
    ]
  },
  {
    id: "b5-3", ts: "4.6", scenario: 5,
    stem: "The team wants clear-cut findings posted automatically and borderline ones sent to a human reviewer queue. What design supports this?",
    options: [
      { t: "Have a verification pass report confidence per finding, with routing thresholds calibrated on labeled reviews.", ok: true, why: "Calibrated confidence per finding enables review routing." },
      { t: "Post every finding automatically and let developers decide which ones matter.", why: "This erodes trust." },
      { t: "Route findings to the human queue based only on which category they belong to.", why: "Categories vary in clarity within themselves." },
      { t: "Use the model's raw self-rated confidence with a 0.5 cutoff to decide.", trap: "T4", why: "Uncalibrated thresholds mis-route." }
    ]
  },
  {
    id: "b5-4", ts: "4.5", scenario: 5,
    stem: "A nightly job starts at 6 pm and generates test suggestions that must be ready by 9 am. Someone proposes the Message Batches API for the savings. What's the issue?",
    options: [
      { t: "Batches can take up to 24 hours with no guarantee, so a 15-hour window isn't safe. Use synchronous calls.", ok: true, why: "Check the worst case against the deadline, not the typical completion time." },
      { t: "No issue. Batches usually finish within an hour, well inside the window.", why: "“Usually” isn't a guarantee." },
      { t: "The batch API can't process source code, so test suggestions won't work.", trap: "T8", why: "Not true." },
      { t: "Batch results come back in a different order than the requests.", why: "custom_id handles correlation." }
    ]
  },
  {
    id: "b5-5", ts: "3.6", scenario: 5,
    stem: "A pipeline has Claude auto-fix lint failures and then, in the same session, review its own fix before pushing. Reviewers keep finding problems the self-review approved. Best change?",
    options: [
      { t: "Run the review in a separate Claude Code invocation that sees the diff but not the fix's reasoning.", ok: true, why: "Session context isolation makes review more effective." },
      { t: "Add “review critically” to the same session's prompt before the review step.", trap: "T9", why: "It still carries its generation reasoning." },
      { t: "Increase the maximum turns in the fixing session.", why: "That doesn't add independence." },
      { t: "Skip the review step for lint fixes.", why: "The stem shows real problems slipping through." }
    ]
  },
  {
    id: "b5-6", ts: "4.1", scenario: 5,
    stem: "The reviewer's “documentation” category flags any function without a docstring, including one-line private helpers. Developers ignore it. Best prompt change?",
    options: [
      { t: "Define explicit criteria: flag missing docs only on public APIs and contradicting comments; skip private helpers.", ok: true, why: "Categorical criteria target what matters." },
      { t: "Tell the reviewer to be less strict about documentation findings from now on.", trap: "T9", why: "Vague." },
      { t: "Cap documentation findings at 3 per PR so they don't crowd out others.", why: "Arbitrary. It still posts low-value items." },
      { t: "Have the model rate each doc finding's importance and drop low ones.", trap: "T4", why: "Uncalibrated self-rating." }
    ]
  },
  {
    id: "b5-7", ts: "4.2", scenario: 5,
    stem: "CI review findings vary in shape: some include a suggested fix, some lack line numbers, and severity wording differs. Instructions already list the required fields. What most improves consistency?",
    options: [
      { t: "Add few-shot examples of complete findings in the exact format: location, issue, severity, fix.", ok: true, why: "Examples are the most effective lever for consistent formatting when instructions alone vary." },
      { t: "Repeat the required field list three times in the prompt for emphasis.", trap: "T9", why: "Repetition isn't demonstration." },
      { t: "Lower the temperature so the format is consistent.", why: "Consistent isn't the same as correctly formatted." },
      { t: "Post-process findings with regex to fill in missing fields.", trap: "T6", why: "Fragile. Also consider --json-schema for guaranteed shape." }
    ]
  },

  // ---------- Scenario 1: Customer Support Resolution Agent ----------
  {
    id: "b1-1", ts: "1.4", scenario: 1,
    stem: "In about 3% of conversations the agent calls <code>update_payment_method</code> before <code>verify_identity</code> has succeeded. What makes this impossible?",
    options: [
      { t: "Add a programmatic prerequisite that blocks update_payment_method until verify_identity succeeds.", ok: true, why: "A gate guarantees ordering for a high-risk action." },
      { t: "Reorder the tools so verify_identity is listed first in the tools array.", why: "Tool order isn't enforcement." },
      { t: "Add few-shot examples that show verification happening first.", trap: "T1", why: "This lowers the rate but can't make it zero." },
      { t: "Route all payment-method changes to human agents.", trap: "T2", why: "Disproportionate. A gate solves it." }
    ]
  },
  {
    id: "b1-2", ts: "2.2", scenario: 1,
    stem: "<code>process_refund</code> sends the request to the payment provider, which then times out without confirming. How should the tool report this?",
    options: [
      { t: "As an error saying the outcome is uncertain and unsafe to retry until the refund status is checked.", ok: true, why: "A timeout after submission may already have succeeded. Blind retries risk a double refund." },
      { t: "As a transient error with isRetryable: true, so the agent retries the refund.", trap: "T6", why: "A write that may have happened isn't safe to retry blindly." },
      { t: "As a success, since the request was probably processed.", why: "This could tell the customer a refund happened when it didn't." },
      { t: "As a generic “payment failed” error so the agent tells the customer to try again.", trap: "T6", why: "This hides the uncertainty the agent must act on." }
    ]
  },

  // ---------- Scenario 3: Multi-Agent Research System ----------
  {
    id: "b3-1", ts: "5.6", scenario: 3,
    stem: "The final research report converts everything (quarterly revenue figures, news developments, technical specifications) into uniform bullet prose. Readers find the financials hard to compare. What should synthesis do?",
    options: [
      { t: "Render each type to fit: financial data as tables, news as prose, technical findings as lists.", ok: true, why: "Format should fit the content." },
      { t: "Use tables for everything so all content types are easy to compare.", why: "News and narrative don't fit tables." },
      { t: "Shorten the report so readers can scan it faster.", why: "This doesn't fix comparability." },
      { t: "Add an appendix containing all the raw data behind the report.", why: "It helps a little, but the main report stays hard to use." }
    ]
  },
  {
    id: "b3-2", ts: "2.3", scenario: 3,
    stem: "The document-analysis subagent has a generic <code>fetch_url</code> tool and sometimes fetches tracking pages and login walls instead of documents. Best change?",
    options: [
      { t: "Replace fetch_url with a load_document tool that validates the URL is a supported document.", ok: true, why: "Constrained tools prevent misuse structurally." },
      { t: "Tell the subagent in its prompt to fetch only document URLs.", trap: "T1", why: "Probabilistic, when a structural fix exists." },
      { t: "Give the subagent web search too, so it can find better URLs.", trap: "T5", why: "This adds cross-role tools." },
      { t: "Retry any fetch that returns an HTML page instead of a document.", trap: "T6", why: "Retrying doesn't fix the wrong target." }
    ]
  },

  // ---------- Scenario 6: Structured Data Extraction ----------
  {
    id: "b6-1", ts: "4.4", scenario: 6,
    stem: "Extracted invoices sometimes have line items that don't add up to the stated total, and you can't tell whether the document or the extraction is wrong. What schema change helps most?",
    options: [
      { t: "Extract calculated_total and stated_total plus a conflict_detected flag, and route conflicts to review.", ok: true, why: "Self-checking fields let code flag discrepancies automatically." },
      { t: "Extract only the stated total, since that's the figure downstream systems use.", why: "This hides discrepancies." },
      { t: "Instruct the model to adjust the line items so they match the total.", why: "This forces fabrication." },
      { t: "Retry the extraction until the totals match.", trap: "T6", why: "If the document is inconsistent, this produces false agreement." }
    ]
  },
  {
    id: "b6-2", ts: "4.3", scenario: 6,
    stem: "Some agreements are genuinely ambiguous between “lease” and “service agreement.” The schema's <code>contract_type</code> enum forces a choice, and those records are often wrong. Best change?",
    options: [
      { t: "Add an \"unclear\" enum value and route those records to human review.", ok: true, why: "An explicit ambiguity value prevents forced guesses." },
      { t: "Change contract_type to free text.", why: "This loses normalization for the clear majority." },
      { t: "Default to whichever contract type is more common.", why: "A systematic bias." },
      { t: "Ask for a confidence score and keep the guess.", trap: "T4", why: "Still a forced guess." }
    ]
  }
];
