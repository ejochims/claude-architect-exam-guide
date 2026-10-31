// Extra scenario questions used by drills and the mock exam (not attached to a lesson step).
window.BANK = [
  // ---------- Scenario 2: Code Generation with Claude Code ----------
  {
    id: "b2-1", ts: "3.1", scenario: 2,
    stem: "In the same repository, Claude follows the team's naming conventions in some sessions but not others. What is the best first diagnostic?",
    options: [
      { t: "Run <code>/memory</code> to see which memory files are loaded in the failing sessions.", ok: true, why: "Exam framing: check which memory files load before changing them. (Today <code>/context</code> shows what's loaded and <code>/memory</code> opens the files; see Exam vs. today.)" },
      { t: "Rewrite the conventions in CLAUDE.md in capital letters with “IMPORTANT” markers so they stand out.", trap: "T9", why: "Emphasis doesn't help if the file isn't loaded. Diagnose first." },
      { t: "Switch to a more capable model, which follows long instruction files more reliably.", trap: "T3", why: "Doesn't diagnose why the conventions apply in some sessions and not others." },
      { t: "Paste the conventions into the start of every prompt until the inconsistency goes away.", why: "A workaround that hides the cause, likely a file that loads in some sessions but not others." }
    ]
  },
  {
    id: "b2-2", ts: "3.3", scenario: 2,
    stem: "A rule file has <code>paths: [\"src/api/**/*\"]</code>, but its conventions don't apply when Claude edits API tests in <code>tests/api/</code>. Why?",
    options: [
      { t: "Path-scoped rules load only for matching files, and <code>tests/api/</code> doesn't match <code>src/api/**/*</code>.", ok: true, why: "Add a pattern that covers the tests, such as <code>tests/api/**/*</code>." },
      { t: "Rules files load only when the root CLAUDE.md references them with an <code>@import</code>.", trap: "T8", why: "Rules in <code>.claude/rules/</code> load on their own; no import is needed." },
      { t: "The <code>paths</code> field expects regular expressions, so the glob is being read literally.", trap: "T8", why: "<code>paths</code> takes glob patterns." },
      { t: "A rule applies only inside the directory tree containing it, so it must live in <code>tests/api/</code>.", why: "Rules live in <code>.claude/rules/</code>; their <code>paths</code> decide where they apply." }
    ]
  },
  {
    id: "b2-3", ts: "3.2", scenario: 2,
    stem: "A <code>/scaffold-component</code> skill should only read templates and write new files. It should never run shell commands. Which frontmatter setting configures this?",
    options: [
      { t: "<code>allowed-tools</code>, listing only the file tools the skill needs", ok: true, why: "Exam framing: allowed-tools restricts tool access while the skill runs. (Real world today: it pre-approves the listed tools, and restriction is done with disallowed tools or the agent's tool list; see Exam vs. today.)" },
      { t: "<code>context: fork</code>, so the skill runs in an isolated context away from the main shell", why: "Isolates context. It doesn't limit which tools run." },
      { t: "<code>argument-hint</code>, declaring which tools the skill may use", why: "Describes the expected argument. It doesn't limit tools." },
      { t: "<code>sandbox: true</code>", trap: "T8", why: "Not a skill frontmatter field." }
    ]
  },
  {
    id: "b2-4", ts: "3.2", scenario: 2,
    stem: "Your team has a 300-line quarterly dependency-audit procedure. Someone proposes adding it to the root CLAUDE.md so Claude “always knows it.” Better option?",
    options: [
      { t: "Add it to CLAUDE.md under a clearly labeled heading, so it's always available when needed.", why: "300 lines load into every session to serve a task done four times a year." },
      { t: "Make it an on-demand skill, and keep CLAUDE.md for standards that apply to every task.", ok: true, why: "Skills hold task-specific workflows loaded when invoked; CLAUDE.md holds always-on standards." },
      { t: "Add it to each developer's <code>~/.claude/CLAUDE.md</code>, so it doesn't bloat the shared file.", why: "Still loads in every session for each developer, and copies drift." },
      { t: "Keep it in the wiki and paste it into the prompt each quarter.", why: "Manual and easy to forget. A skill makes it a versioned, invocable workflow." }
    ]
  },
  {
    id: "b2-5", ts: "3.5", scenario: 2,
    stem: "Three bugs remain: the date parser drops time zones, the import validator rejects valid ISO dates, and the monthly rollup double-counts midnight records. All three come from the shared date utility, and fixing any one of them changes behavior the other two rely on. How should you ask Claude to fix them?",
    options: [
      { t: "Fix them one at a time in separate messages, verifying each before moving to the next.", why: "Sequential fixes suit independent bugs. Here each fix changes what the others depend on." },
      { t: "Describe all three together in one detailed message, because each fix changes what the others rely on.", ok: true, why: "Interacting problems need to be solved together, so one fix doesn't break another." },
      { t: "Fix the most user-visible bug first, then re-test the other two against the new behavior.", why: "Still sequential, and the first fix is designed without the constraints of the other two." },
      { t: "Use plan mode separately for each bug, so each gets its own investigation and design.", why: "Three separate plans miss the shared cause in the date utility." }
    ]
  },
  {
    id: "b2-6", ts: "3.5", scenario: 2,
    stem: "A data-migration script Claude wrote crashes on rows where <code>middle_name</code> is NULL. You've told it twice to “handle nulls,” and its fixes still fail on some rows. Most effective next step?",
    options: [
      { t: "Tell Claude to handle every possible null value carefully this time, in every column.", trap: "T9", why: "A third instruction to “handle nulls” adds nothing." },
      { t: "Rewrite the null handling yourself rather than iterating on Claude's version again.", why: "Gives up on a fix that one concrete test case would likely produce." },
      { t: "Give a concrete test case: a row with NULLs and the exact expected output.", ok: true, why: "A concrete failing input with its expected output removes the ambiguity in “handle nulls”." },
      { t: "Switch to plan mode and ask Claude to redesign the script's data model from scratch.", why: "Overkill for one unclear requirement. A test case is the targeted fix." }
    ]
  },

  // ---------- Scenario 4: Developer Productivity with Claude ----------
  {
    id: "b4-1", ts: "2.5", scenario: 4,
    stem: "A developer asks the agent to list every React component test file in a large monorepo. Which built-in tool should it use first?",
    options: [
      { t: "Glob, with a pattern such as <code>**/*.test.tsx</code>", ok: true, why: "Finding files by name pattern is Glob's job." },
      { t: "Grep for <code>describe(</code> across the repository", why: "This searches contents, slowly, and matches non-component tests too." },
      { t: "Read the root directory listing, then each subdirectory listing in turn", why: "Inefficient, and Read isn't a search tool." },
      { t: "Bash, with <code>find . -name \"*.test.tsx\"</code>", why: "Exam framing: Glob is the dedicated file-pattern tool. (Real world today: on macOS and Linux, current Claude Code runs file search through Bash by default; the exam still expects Glob.)" }
    ]
  },
  {
    id: "b4-2", ts: "2.5", scenario: 4,
    stem: "An engineer wants to understand how a legacy order service processes cancellations. What exploration strategy should the agent follow?",
    options: [
      { t: "Grep for the cancellation entry point, Read it and then follow its imports.", ok: true, why: "Incremental, targeted exploration builds understanding without flooding context." },
      { t: "Read every file in the service before answering, so nothing relevant is missed.", why: "Fills the context window with irrelevant code." },
      { t: "Glob for files with “cancel” in their names, then Read all of them in full.", why: "Names miss the real flow, which often runs through generic handlers." },
      { t: "Ask the engineer which files implement cancellation, then read those.", why: "The agent can find this itself; that's the point of the request." }
    ]
  },
  {
    id: "b4-3", ts: "1.5", scenario: 4, family: "P01",
    stem: "A developer-productivity agent built on the Agent SDK must never run <code>git push --force</code> against protected branches. What's the right mechanism?",
    options: [
      { t: "A <code>PreToolUse</code> hook that denies the matching call and says why.", ok: true, why: "An action that must never happen is blocked before it runs, with a reason the agent can act on." },
      { t: "A <code>PostToolUse</code> hook that converts results to one unit before the agent sees them.", why: "Right when results arrive in mixed formats. Here the danger is an action, not a result." },
      { t: "A <code>PreToolUse</code> hook that rewrites the tool's input into the required form.", why: "Right when a call needs a missing field added. Silently rewriting a force push changes what the developer asked for." },
      { t: "A CLAUDE.md rule that explains the convention and the reason for it.", why: "Right for a convention where an occasional miss is cheap. A force push to a protected branch isn't." }
    ]
  },
  {
    id: "b4-4", ts: "1.5", scenario: 4, family: "P01",
    stem: "Three MCP servers report file sizes as raw bytes, “4.2 MB” strings and kibibytes. The agent's cleanup recommendations are often off by orders of magnitude. What's the right mechanism?",
    options: [
      { t: "A <code>PreToolUse</code> hook that denies the matching call and says why.", why: "Right when an action must be stopped. Nothing here should be blocked." },
      { t: "A <code>PostToolUse</code> hook that converts results to one unit before the agent sees them.", ok: true, why: "Normalize results to one unit before the model reasons over them." },
      { t: "A <code>PreToolUse</code> hook that rewrites the tool's input into the required form.", why: "Right when the agent's inputs need fixing. The problem here is what comes back." },
      { t: "A CLAUDE.md rule that explains the convention and the reason for it.", why: "Right for soft conventions. Unit conversion needs to happen every time." }
    ]
  },
  {
    id: "b4-5", ts: "2.3", scenario: 4,
    stem: "A single developer-productivity agent has 26 tools from four MCP servers plus the built-ins. Logs show frequent wrong-tool calls among similar tools. Which change most improves selection?",
    options: [
      { t: "Split the work into specialized subagents, each given only the tools that its particular role needs.", ok: true, why: "Fewer, role-relevant tools per agent improve selection." },
      { t: "Add a detailed paragraph for each of the 26 tools to the system prompt, with usage examples.", why: "Helps a little, but 26 overlapping options still degrade selection." },
      { t: "Consolidate all MCP tools into one generic <code>do_task</code> tool with free-form input.", trap: "T5", why: "Hides the distinctions instead of resolving them." },
      { t: "Move to a bigger model that copes better with large, overlapping tool sets.", trap: "T3", why: "Capacity doesn't fix an overloaded tool set." }
    ]
  },
  {
    id: "b4-6", ts: "1.3", scenario: 4, family: "P02",
    stem: "An “explorer” subagent meant only to map unfamiliar code occasionally edits files while investigating. Where should you fix this?",
    options: [
      { t: "Give the subagent's AgentDefinition only the read-only tools it needs.", ok: true, why: "Scope the tools to the role: a subagent can't edit files if it has no editing tools." },
      { t: "Pass everything the coordinator already gathered in the delegation prompt.", why: "Right when a subagent re-fetches what the coordinator has. This one does too much, not too little." },
      { t: "Have the subagent return its findings in a fixed, structured format.", why: "Right when the caller can't parse results. The problem here is unwanted edits." },
      { t: "Write the subagent's prompt as goals and quality criteria, not fixed steps.", why: "Right when rigid steps make a subagent inflexible. Prompt wording won't guarantee it never edits." }
    ]
  },
  {
    id: "b4-7", ts: "2.4", scenario: 4,
    stem: "Five internal teams are building different Claude-powered tools that all need read access to your company's API catalog. What's the most reusable integration?",
    options: [
      { t: "Expose the catalog once through an MCP server that every team's client connects to.", ok: true, why: "Integrate once; every MCP-capable client can use it." },
      { t: "Have each of the five teams write a custom tool against the catalog's REST API, sharing a common client library.", why: "Five integrations to maintain, even with a shared library." },
      { t: "Paste the full catalog into each tool's system prompt.", trap: "T3", why: "Bloats every request and goes stale." },
      { t: "Generate a nightly export of the catalog into each repository's CLAUDE.md.", why: "Bloats memory and isn't queryable." }
    ]
  },
  {
    id: "b4-8", ts: "1.6", scenario: 4, family: "P03",
    stem: "The agent must generate CRUD boilerplate (model, controller, tests, docs) for 30 similar entities that follow an established pattern. Which decomposition fits?",
    options: [
      { t: "Run the same fixed sequence of steps once for each item.", ok: true, why: "A known, repeated pattern is what a fixed sequence is for: predictable and easy to check." },
      { t: "Group the work by root cause first, then handle one group at a time.", why: "Right when failures share causes. Nothing has failed here." },
      { t: "Split the input into its parts, process each part separately, then merge.", why: "Right when one large input hides details. These are 30 small, similar tasks." },
      { t: "Let the agent choose each next step from what the previous one found.", why: "Right when the path depends on findings. Here the path is known in advance." }
    ]
  },

  // ---------- Scenario 5: Claude Code for CI ----------
  {
    id: "b5-1", ts: "3.6", scenario: 5,
    stem: "A CI step runs <code>claude -p \"Review this PR for risky changes\"</code> with no other input. Claude spends 25+ minutes exploring the whole repository before it reviews anything, and the job often times out. What's the best fix?",
    options: [
      { t: "Pipe the PR's diff into the command and scope the review to those changes.", ok: true, why: "Give the agent the scope directly. It no longer has to discover what changed." },
      { t: "Add <code>--max-turns 5</code> so every run ends quickly, whatever it has found by then.", why: "A turn cap cuts reviews off midway. Scope the input so the work is small instead." },
      { t: "Raise the job timeout to two hours so the exploration has time to finish.", why: "Pays for the waste instead of removing it." },
      { t: "Add <code>--output-format json</code> so the pipeline gets results as soon as they're ready.", why: "Changes the output format, not how much the agent explores." }
    ]
  },
  {
    id: "b5-2", ts: "4.2", scenario: 5,
    stem: "The security reviewer flags parameterized queries as SQL injection in about 30% of PRs. Its criteria already say “flag only user input concatenated into SQL.” What helps most next?",
    options: [
      { t: "Add few-shot examples contrasting safe parameterized queries with real concatenation.", ok: true, why: "When criteria are clear but misapplied, examples of acceptable vs genuine patterns fix it." },
      { t: "Add “be conservative about SQL injection findings” to the security reviewer's prompt.", trap: "T9", why: "Vague caution doesn't teach the distinction." },
      { t: "Disable the security category until the false-positive rate drops below 10%.", why: "Turns off a high-value category; the fix here is targeted examples." },
      { t: "Post only findings the model rates 9/10 or higher on its own confidence scale.", trap: "T4", why: "Raw self-ratings are uncalibrated; false positives are often rated confidently." }
    ]
  },
  {
    id: "b5-3", ts: "4.6", scenario: 5,
    stem: "The team wants clear-cut findings posted automatically and borderline ones sent to a human reviewer queue. What design supports this?",
    options: [
      { t: "Post every finding automatically and let developers decide, tracking which ones they dismiss over time.", why: "No routing at all, and borderline findings erode trust." },
      { t: "Have a verification pass score each finding's confidence, with thresholds calibrated on labeled reviews.", ok: true, why: "Calibrated confidence is a sound way to route review effort." },
      { t: "Route findings to the human queue by category, sending all security findings there.", why: "Category isn't certainty; clear-cut security bugs get delayed and borderline style issues get posted." },
      { t: "Route on the model's raw self-rated confidence, with a 0.5 cutoff.", trap: "T4", why: "Uncalibrated, the cutoff is arbitrary." }
    ]
  },
  {
    id: "b5-4", ts: "4.5", scenario: 5,
    stem: "A job starts at 6 pm and generates test suggestions for the next morning's release. If they aren't ready by 9 am, the release is blocked. Someone proposes the Message Batches API to halve the cost. What's the right call?",
    options: [
      { t: "Use synchronous calls: the 15-hour window is shorter than batch's 24-hour worst case, and a miss blocks the release.", ok: true, why: "Batch fits only when the deadline tolerates the documented worst case, not the typical completion time." },
      { t: "Use batch. Overnight, latency-tolerant work is the textbook batch case, and most batches finish within an hour.", why: "It's the textbook case only when a late result is acceptable. Here a miss blocks the release, so “usually” isn't enough." },
      { t: "Use batch and give each file a custom_id, so each finished suggestion can be published as soon as its request completes.", why: "custom_id correlates results, but it doesn't change the 24-hour worst case for the batch as a whole." },
      { t: "Use batch, split into twelve smaller batches so that each one finishes well before 9 am.", trap: "T2", why: "Every batch carries the same 24-hour worst case. Splitting adds work without changing the guarantee." }
    ]
  },
  {
    id: "b5-5", ts: "3.6", scenario: 5,
    stem: "A pipeline has Claude auto-fix lint failures and then, in the same session, review its own fix before pushing. Reviewers keep finding problems the self-review approved. Best change?",
    options: [
      { t: "Run the review in a separate Claude Code invocation that sees the diff but not the fix's reasoning.", ok: true, why: "An independent instance isn't anchored on the reasoning that produced the fix." },
      { t: "Add “review critically and assume the fix is wrong” to the same session's prompt before the review step.", trap: "T9", why: "The same session still carries the reasoning that produced the fix." },
      { t: "Increase the fixing session's maximum turns so it has room to test its own changes.", why: "More turns in the same context doesn't add an independent perspective." },
      { t: "Have the same session re-run the linter and the test suite after its self-review.", why: "Useful, but reviewers are finding problems tools don't catch. The fix is independence." }
    ]
  },
  {
    id: "b5-6", ts: "4.1", scenario: 5,
    stem: "The reviewer's “documentation” category flags any function without a docstring, including one-line private helpers. Developers ignore it. Best prompt change?",
    options: [
      { t: "Define criteria: flag missing docs only on public APIs and contradicting comments.", ok: true, why: "Explicit criteria fix the false positives at their source." },
      { t: "Tell the reviewer to be less strict about documentation findings.", trap: "T9", why: "Vague guidance with no criteria." },
      { t: "Cap documentation findings at three per PR, so they don't crowd out the security and correctness categories.", why: "Caps the noise but keeps the wrong findings." },
      { t: "Have the model rate each documentation finding's importance and drop those rated below 5.", trap: "T4", why: "Uncalibrated ratings don't fix unclear criteria." }
    ]
  },
  {
    id: "b5-7", ts: "4.2", scenario: 5,
    stem: "CI review findings vary in shape: some include a suggested fix, some lack line numbers, and severity wording differs. Instructions already list the required fields. What most improves consistency?",
    options: [
      { t: "Add few-shot examples of complete findings in the exact required format.", ok: true, why: "When instructions alone give inconsistent output, examples of the exact format fix it." },
      { t: "Repeat the required field list three times in the prompt for emphasis.", trap: "T9", why: "Repetition adds no new information." },
      { t: "Lower the temperature to 0 so the output format is more consistent from run to run.", why: "Makes each output more repeatable, not more complete. Missing fields stay missing." },
      { t: "Post-process findings with regular expressions that fill in missing fields with defaults.", trap: "T6", why: "Defaults hide missing information, such as a line number nobody knows." }
    ]
  },

  // ---------- Scenario 1: Customer Support Resolution Agent ----------
  {
    id: "b1-1", ts: "1.4", scenario: 1, family: "P05",
    stem: "A prerequisite gate blocks <code>update_payment_method</code> until <code>verify_identity</code> succeeds. When it blocks a call, it returns the text “Error.” Logs show the agent retrying the same blocked call several times before giving up. What should change?",
    options: [
      { t: "Return a structured result saying why the call was blocked and what to do first.", ok: true, why: "Say why the call was blocked and what unblocks it, so the agent calls <code>verify_identity</code> instead of retrying." },
      { t: "Return an explicit pending status that the agent must relay to the customer.", why: "Right when an action is waiting on someone. Here the agent needs to take a step first." },
      { t: "Post a structured handoff: the problem, what was tried and a suggested next step.", why: "Right when handing work to a person. The agent can fix this itself." },
      { t: "Add a system-prompt rule telling the agent to follow the required order.", why: "The gate already enforces the order. The agent's problem is that it can't tell what the gate wants." }
    ]
  },
  {
    id: "b1-2", ts: "2.2", scenario: 1,
    stem: "<code>process_refund</code> isn't idempotent: sending the same request twice issues two refunds. It sends a refund to the payment provider, which then times out without confirming. How should the tool report this?",
    options: [
      { t: "As an error saying the outcome is unknown and it's unsafe to retry until the refund status is checked.", ok: true, why: "For a non-idempotent action, a timeout means “unknown”, not “failed”. Check before retrying." },
      { t: "As a transient error with <code>isRetryable: true</code>, since payment-provider timeouts are usually temporary.", trap: "T6", why: "Timeouts are usually retryable, but here a retry can refund the customer twice." },
      { t: "As a success, since the provider probably processed it.", why: "“Probably” isn't confirmation." },
      { t: "As a generic “payment failed” error so the agent asks the customer to try the refund again.", trap: "T6", why: "Could trigger a duplicate refund, and hides the uncertainty." }
    ]
  },

  // ---------- Scenario 3: Multi-Agent Research System ----------
  {
    id: "b3-1", ts: "5.6", scenario: 3,
    stem: "The final research report converts everything (quarterly revenue figures, news developments, technical specifications) into uniform bullet prose. Readers find the financials hard to compare. What should synthesis do?",
    options: [
      { t: "Use tables for the financial data, prose for news and lists for technical findings.", ok: true, why: "Format should follow content type." },
      { t: "Use tables for everything, so all content types are equally easy to scan and compare.", why: "News and narrative findings don't fit tables." },
      { t: "Shorten the report to a one-page executive summary so readers can scan it faster.", why: "Doesn't solve the comparison problem, and loses detail." },
      { t: "Add an appendix with all the raw revenue data in CSV form behind the report.", why: "Pushes the work to the reader." }
    ]
  },
  {
    id: "b3-2", ts: "2.3", scenario: 3,
    stem: "The document-analysis subagent has a generic <code>fetch_url</code> tool and sometimes fetches tracking pages and login walls instead of documents. Best change?",
    options: [
      { t: "Replace <code>fetch_url</code> with a <code>load_document</code> tool that accepts only supported documents.", ok: true, why: "A constrained, purpose-specific tool removes the misuse at the interface." },
      { t: "Tell the subagent in its prompt to fetch only URLs ending in <code>.pdf</code>, <code>.docx</code> or similar document types.", trap: "T1", why: "Probabilistic; the tool still accepts any URL." },
      { t: "Give the subagent web search too, so it can find better URLs before fetching anything.", trap: "T5", why: "More tools, same problem." },
      { t: "Retry any fetch that returns an HTML page instead of a document, up to three times.", trap: "T6", why: "The same URL returns the same page." }
    ]
  },

  // ---------- Scenario 6: Structured Data Extraction ----------
  {
    id: "b6-1", ts: "4.4", scenario: 6,
    stem: "Extracted invoices sometimes have line items that don't add up to the stated total, and you can't tell whether the document or the extraction is wrong. What schema change helps most?",
    options: [
      { t: "Extract both <code>calculated_total</code> and <code>stated_total</code>, and flag any mismatch for human review.", ok: true, why: "Extracting both values exposes the discrepancy instead of hiding it." },
      { t: "Extract only <code>stated_total</code>, since that's the figure the downstream ledger system uses.", why: "Hides the discrepancy you need to see." },
      { t: "Tell the model to adjust the line items so they add up to the stated total.", why: "Fabricates data to hide a conflict." },
      { t: "Retry the extraction until the line items match the total.", trap: "T6", why: "If the document itself is inconsistent, retries can only fabricate agreement." }
    ]
  },
  {
    id: "b6-2", ts: "4.3", scenario: 6,
    stem: "Some agreements are genuinely ambiguous between “lease” and “service agreement.” The schema's <code>contract_type</code> enum forces a choice, and those records are often wrong. Best change?",
    options: [
      { t: "Add an <code>\"unclear\"</code> value to the enum and route those records to human review.", ok: true, why: "Ambiguity becomes explicit and goes to a person." },
      { t: "Change <code>contract_type</code> to free text so the model can describe hybrid agreements in its own words.", why: "Loses the categorization downstream systems depend on." },
      { t: "Default ambiguous agreements to whichever contract type appears more often in the portfolio.", why: "Systematically mislabels the minority type." },
      { t: "Ask for a confidence score with each classification and keep the guess either way.", trap: "T4", why: "Records the uncertainty but still keeps a guess as fact." }
    ]
  },
  {
    id: "b7-1", ts: "3.4", scenario: 4,
    stem: "A stack trace points to the exact line where a function dereferences a missing config value. A developer asks Claude Code to add a null check there. A teammate suggests starting in plan mode “to be safe.” Best approach?",
    options: [
      { t: "Direct execution: the change is small, well scoped, and the cause is already known.", ok: true, why: "Plan mode pays off when there are design choices or many files. Here there are neither." },
      { t: "Plan mode first, since every change to production code should start from a reviewed plan.", why: "Planning adds a round trip with no decision to make; the fix is already determined." },
      { t: "Run the Explore subagent to map the module and its callers before touching the function.", why: "Discovery isn't needed when the stack trace pinpoints the line." },
      { t: "Ask Claude to interview you about edge cases and failure modes before it writes the check.", why: "The interview pattern helps in unfamiliar domains; this requirement is already clear." }
    ]
  },
  {
    id: "b7-2", ts: "3.4", scenario: 2,
    stem: "A new billing feature could be built on a message queue or on webhooks from the payment provider. Each implies different infrastructure, retries and failure handling. How should you start with Claude Code?",
    options: [
      { t: "Direct execution of the simpler webhook design; refactor to a queue later if load requires it.", why: "Commits to an architecture before comparing approaches whose infrastructure costs differ." },
      { t: "Plan mode, to explore the codebase and compare both designs before committing to one.", ok: true, why: "Multiple valid approaches with architectural consequences are exactly what plan mode is for." },
      { t: "Direct execution, asking Claude to keep the code modular so the transport can be swapped.", why: "Modularity doesn't replace deciding which infrastructure you're building." },
      { t: "Have Claude implement both designs on separate branches and pick the one whose tests pass.", why: "Doubles the work; both can pass tests while differing in operational cost." }
    ]
  },
  {
    id: "b7-3", ts: "3.4", scenario: 5,
    stem: "A nightly CI job asks Claude Code to replace a deprecated API across 60 files. Each run makes different choices file to file, so reviewers see inconsistent code. What should change?",
    options: [
      { t: "Add “apply one consistent approach to every file” to the job's prompt.", trap: "T9", why: "An exhortation without the approach itself doesn't produce consistency." },
      { t: "Split it: a planning run produces a migration plan for human approval, then an execution run applies the approved plan.", ok: true, why: "Plan once, agree the approach, then execute it uniformly." },
      { t: "Raise the job's turn limit so Claude can revisit early files once it understands the pattern.", why: "More turns don't create an agreed approach; files may still diverge." },
      { t: "Run one job per file in parallel so each file gets Claude's full attention.", why: "Independent runs make even more inconsistent choices." }
    ]
  },
  {
    id: "b7-4", ts: "3.3", scenario: 4,
    stem: "<code>.claude/rules/migrations.md</code> holds conventions for SQL migrations in <code>db/migrations/</code>, but its contents appear in every session, including ones that never touch SQL. What's the most likely cause?",
    options: [
      { t: "The rule file has no <code>paths:</code> frontmatter, so it loads unconditionally.", ok: true, why: "Rules without paths apply to every session; add <code>paths: [\"db/migrations/**\"]</code>." },
      { t: "Every file in <code>.claude/rules/</code> loads in every session; scoping isn't supported there.", why: "Path-scoped rules are exactly what <code>paths:</code> frontmatter provides." },
      { t: "The root CLAUDE.md @imports the rules folder, which forces every rule to load each time.", trap: "T8", why: "Rules load from <code>.claude/rules/</code> on their own; no import is involved." },
      { t: "The file name needs a <code>.rules.md</code> suffix before Claude Code scopes it by directory.", trap: "T8", why: "Not a real convention; scoping comes from <code>paths:</code>." }
    ]
  },
  {
    id: "b7-5", ts: "3.3", scenario: 2,
    stem: "Test files are colocated with source as <code>*.test.ts</code> and <code>*.spec.ts</code> throughout <code>src/</code> and <code>packages/</code>. You want the testing conventions to load only when Claude works on a test file. Which frontmatter fits?",
    options: [
      { t: "<code>paths: [\"tests/**\"]</code>", why: "There's no tests directory; colocated test files would never match." },
      { t: "<code>paths: [\"src/**\", \"packages/**\"]</code>", why: "Matches every source file, so the conventions load almost always." },
      { t: "<code>paths: [\"**/*.test.ts\", \"**/*.spec.ts\"]</code>", ok: true, why: "Globs on the file pattern match test files wherever they live." },
      { t: "<code>paths: [\"**/test*\"]</code>", why: "Matches names starting with “test”, not files ending in .test.ts." }
    ]
  },
  {
    id: "b7-6", ts: "3.1", scenario: 4,
    stem: "The API team's conventions live in <code>packages/api/CLAUDE.md</code>. A developer starts Claude Code at the repo root and asks about the web app; Claude never mentions the API conventions. Is something wrong?",
    options: [
      { t: "Yes: subdirectory CLAUDE.md files load only if the root CLAUDE.md @imports them.", trap: "T8", why: "Subdirectory memory files load without an import." },
      { t: "No: a subdirectory CLAUDE.md loads when Claude works with files in that directory.", ok: true, why: "Nested memory is loaded on demand, which keeps unrelated sessions lean." },
      { t: "Yes: Claude Code reads only the CLAUDE.md in the directory where it was launched.", why: "It also reads parent and nested memory files." },
      { t: "Yes: nested CLAUDE.md files need <code>paths:</code> frontmatter to say where they apply.", why: "<code>paths:</code> is for rules in <code>.claude/rules/</code>, not CLAUDE.md files." }
    ]
  },
  {
    id: "b7-7", ts: "1.6", scenario: 6, family: "P04",
    stem: "An agent extracts 40 fields from 300-page loan packages that bundle an application, appraisals, tax returns and disclosures. Fields from documents deep in the package are often missed. What decomposition helps most?",
    options: [
      { t: "A fixed pipeline that runs the same steps in the same order every time.", why: "Right when every case follows identical steps. The problem here is attention over a long input." },
      { t: "Separate passes for each document or section, then a step that merges results.", ok: true, why: "Focused passes per document keep attention on each part; the merge step reconciles them." },
      { t: "A single agent that decides its next step from each result.", why: "Right when the path depends on findings. The problem here is coverage of a long input." },
      { t: "Parallel subagents, one per independent subtask, then a synthesis step.", why: "Right for independent research subtasks. Fields here are extracted from parts of one package and need reconciling." }
    ]
  },
  {
    id: "b7-8", ts: "1.6", scenario: 5, family: "P03",
    stem: "A CI agent told to “fix all failing tests” (37 failures across 9 modules) thrashes: a fix in one module breaks tests in another, and runs time out. How should the work be decomposed?",
    options: [
      { t: "Run the same fixed sequence of steps once for each item.", why: "Right for repeated, independent tasks. These failures interact." },
      { t: "Group the work by root cause first, then handle one group at a time.", ok: true, why: "Fixing by root cause stops one fix from breaking another, and shrinks 37 failures to a few causes." },
      { t: "Split the input into its parts, process each part separately, then merge.", why: "Right when a long input hides details. Splitting by module keeps the interacting fixes apart." },
      { t: "Let the agent choose each next step from what the previous one found.", why: "Right for open-ended investigation. Here, unstructured fixing is what causes the thrashing." }
    ]
  },
  {
    id: "b7-9", ts: "1.6", scenario: 1, family: "P04",
    stem: "Every return request follows the same four steps: verify identity, check eligibility, create the RMA, send the shipping label. Which decomposition fits best?",
    options: [
      { t: "A fixed pipeline that runs the same steps in the same order every time.", ok: true, why: "When the steps and their order never change, a fixed pipeline is predictable and easy to audit." },
      { t: "Separate passes for each document or section, then a step that merges results.", why: "Right when a long input hides details. A return request is short." },
      { t: "A single agent that decides its next step from each result.", why: "Right when each step depends on what turns up. Here the steps are always the same." },
      { t: "Parallel subagents, one per independent subtask, then a synthesis step.", why: "Right for independent subtasks. These steps depend on each other in order." }
    ]
  },
  {
    id: "b7-10", ts: "1.2", scenario: 3, family: "P06",
    stem: "To save a hop, a teammate proposes letting the search subagent send its results straight to the synthesis subagent, bypassing the coordinator. Coverage gaps have been the system's main quality problem. What should the team do?",
    options: [
      { t: "Keep routing results through the coordinator so it can check coverage.", ok: true, why: "The coordinator can only spot gaps and re-delegate if results pass through it." },
      { t: "Pass each subagent only its goal, constraints and the relevant prior findings.", why: "Right when subagents get too much context. This is about where results go." },
      { t: "Have independent subagents run in parallel within the same turn.", why: "Right when independent work runs one after another. Saving a hop isn't worth losing the coverage check." },
      { t: "Give the coordinator a cap on research rounds before it synthesizes.", why: "Right when the coordinator won't stop. Here the concern is coverage." }
    ]
  },
  {
    id: "b7-11", ts: "1.2", scenario: 3, family: "P06",
    stem: "For “context,” the coordinator passes every subagent the user's full 30-turn conversation. Subagents get distracted by side topics and run slowly. What should the coordinator pass instead?",
    options: [
      { t: "Keep routing results through the coordinator so it can check coverage.", why: "Right when results bypass the coordinator. The problem here is what goes into each subagent." },
      { t: "Pass each subagent only its goal, constraints and the relevant prior findings.", ok: true, why: "Give each subagent what its task needs, and no more." },
      { t: "Have independent subagents run in parallel within the same turn.", why: "Right when independent work runs one after another. Each subagent is slow here because of its input." },
      { t: "Give the coordinator a cap on research rounds before it synthesizes.", why: "Right when the coordinator loops too long. The problem here is the input." }
    ]
  },
  {
    id: "b7-12", ts: "1.7", scenario: 5, family: "P07",
    stem: "A CI review step runs <code>claude -p --output-format json</code>. A later step must apply the suggested fixes with the full context of that review, and nothing has changed in between. How do you carry the context over?",
    options: [
      { t: "Resume the earlier session by its ID with <code>--resume</code>.", ok: true, why: "Read <code>session_id</code> from the first step's JSON output and pass it to <code>--resume</code> in the second step." },
      { t: "Resume, and tell Claude which files changed so it re-reads only those.", why: "Right when files changed since the session. Nothing changed here." },
      { t: "Start a fresh session seeded with a short summary of the findings.", why: "Right when the old context is stale or too long. Here it's exactly what the next step needs." },
      { t: "Fork the session to try a different approach from the same point.", why: "Right for exploring an alternative. Here the next step continues the same work." }
    ]
  },
  {
    id: "b7-13", ts: "1.7", scenario: 4, family: "P07",
    stem: "You resume yesterday's investigation session. Since then a teammate changed 3 of the 40 files Claude analyzed; the rest are untouched. What's the most efficient reliable approach?",
    options: [
      { t: "Resume the earlier session by its ID with <code>--resume</code>.", why: "Resuming alone leaves Claude trusting stale reads of the 3 changed files." },
      { t: "Resume, and tell Claude which files changed so it re-reads only those.", ok: true, why: "Keep the valid context, and point Claude at the specific files that are now stale." },
      { t: "Start a fresh session seeded with a short summary of the findings.", why: "Right when most of the context is stale. Here 37 of 40 files are unchanged." },
      { t: "Fork the session to try a different approach from the same point.", why: "Right for trying an alternative approach. Here the work continues, with 3 files updated." }
    ]
  },
  {
    id: "b7-14", ts: "1.1", scenario: 6,
    stem: "An extraction agent may call <code>lookup_vendor</code> several times per document. The loop exits with <code>if response.content[0].type == \"text\": break</code>, and many runs stop after Claude's first sentence, before any lookup. Fix?",
    options: [
      { t: "Check the last content block instead of the first, and break when it's text.", why: "Still infers completion from content shape; a reply can end in text and still be mid-task." },
      { t: "Loop while <code>stop_reason</code> is <code>\"tool_use\"</code> and exit on <code>\"end_turn\"</code>.", ok: true, why: "stop_reason is the structured completion signal; Claude often writes text before a tool call." },
      { t: "Tell Claude in the system prompt to emit tool calls before any text in its reply.", trap: "T1", why: "Fragile and unnecessary; the loop is reading the wrong signal." },
      { t: "Raise <code>max_tokens</code> so the tool call fits in the same response as the text.", why: "The tool call is already there; the loop exits before looking at it." }
    ]
  },
  {
    id: "b7-15", ts: "1.4", scenario: 1, family: "P05",
    stem: "Refunds over $500 need a manager's approval. The agent routes them for approval correctly, but sometimes tells customers “your refund is on its way” before anyone has approved it. What should change?",
    options: [
      { t: "Return a structured result saying why the call was blocked and what to do first.", why: "Right when a call is blocked by a missing step. This one went through and is waiting." },
      { t: "Return an explicit pending status that the agent must relay to the customer.", ok: true, why: "An explicit pending status makes the agent tell the customer the true state, not a generic success." },
      { t: "Post a structured handoff: the problem, what was tried and a suggested next step.", why: "Right when handing work to a person. The customer is the one being misinformed here." },
      { t: "Add a system-prompt rule telling the agent to follow the required order.", why: "Right for soft preferences. What the customer is told about money needs to be accurate every time." }
    ]
  },
  {
    id: "b7-16", ts: "1.4", scenario: 5, family: "P05",
    stem: "When the CI agent can't fix a failing test, it posts “Could not fix this test” on the PR, and engineers start their investigation from scratch. What should it post instead?",
    options: [
      { t: "Return a structured result saying why the call was blocked and what to do first.", why: "Right when an agent's call is blocked. Here the agent is handing the work to people." },
      { t: "Return an explicit pending status that the agent must relay to the customer.", why: "Right when work is waiting on approval. Here engineers need to take over." },
      { t: "Post a structured handoff: the problem, what was tried and a suggested next step.", ok: true, why: "Give the humans the failure, the hypothesis, what was tried and what to do next, so they don't start over." },
      { t: "Add a system-prompt rule telling the agent to follow the required order.", why: "Right when steps run in the wrong order. Here the problem is an empty handoff." }
    ]
  },
  {
    id: "b7-17", ts: "1.3", scenario: 4, family: "P02",
    stem: "A coordinator delegates “review PR 4812” to a reviewer subagent, passing only the PR number. The reviewer spends most of its budget re-fetching the diff, CI logs and the linked issue, all of which the coordinator already loaded. What fits best?",
    options: [
      { t: "Give the subagent's AgentDefinition only the read-only tools it needs.", why: "Right when a subagent does things outside its role. This one is just repeating work." },
      { t: "Pass everything the coordinator already gathered in the delegation prompt.", ok: true, why: "A subagent starts with none of the coordinator's context, so pass what's already been gathered." },
      { t: "Have the subagent return its findings in a fixed, structured format.", why: "Right when results are hard to use. The waste here happens before the review starts." },
      { t: "Write the subagent's prompt as goals and quality criteria, not fixed steps.", why: "Right when step-by-step prompts make subagents rigid. The problem here is missing context." }
    ]
  },
  {
    id: "b7-18", ts: "1.5", scenario: 5, family: "P01",
    stem: "Every commit the CI agent makes must include a <code>Ticket:</code> trailer with the issue ID from the job's context. The agent leaves it out about one time in ten. What's the right mechanism?",
    options: [
      { t: "A <code>PreToolUse</code> hook that denies the matching call and says why.", why: "Right when an action must not happen. Here the commit is fine; its input is missing a field." },
      { t: "A <code>PostToolUse</code> hook that converts results to one unit before the agent sees them.", why: "Right when results vary in format. The problem here is the outgoing call." },
      { t: "A <code>PreToolUse</code> hook that rewrites the tool's input into the required form.", ok: true, why: "A pre-call hook can add the required trailer to every commit, so it's there every time." },
      { t: "A CLAUDE.md rule that explains the convention and the reason for it.", why: "Right when an occasional miss is acceptable. Here every commit needs the trailer." }
    ]
  },
  {
    id: "b7-19", ts: "2.3", scenario: 4,
    stem: "A developer agent investigates Jira issues and sometimes updates them, but updates should happen only after the developer confirms. The investigation is done by a subagent. How should Jira tools be distributed?",
    options: [
      { t: "Give the investigation subagent read-only Jira tools, and keep update tools with the coordinator, which confirms with the developer first.", ok: true, why: "Scope each agent's tools to its role; writes stay where confirmation happens." },
      { t: "Give the subagent all Jira tools, and instruct it to ask before any update.", trap: "T1", why: "The subagent can't ask the developer directly, and the instruction isn't a guarantee." },
      { t: "Remove update tools entirely and have developers update issues by hand.", why: "Overcorrects; confirmed updates are part of the job." },
      { t: "Give both agents every Jira tool, so either can act when needed.", trap: "T5", why: "Spreads write access to an agent whose role doesn't need it." }
    ]
  },
  {
    id: "b7-20", ts: "2.5", scenario: 2,
    stem: "Before deleting a deprecated module, you need every file that imports it and what each one uses it for. Which built-in tool approach fits best?",
    options: [
      { t: "Glob for files with the module's name in their path, then Read each of them.", why: "File names don't reveal which files import the module." },
      { t: "Read the deprecated module itself, then infer its likely callers from what it exports.", why: "Inference isn't a search; you need the actual import sites." },
      { t: "Grep for the module's import statements, then Read only the matching files to see how each uses it.", ok: true, why: "Search content to find the importers, then read just those." },
      { t: "Read every file under <code>src/</code> so that no indirect usage is missed.", why: "Floods context; targeted search finds the importers directly." }
    ]
  },
  {
    id: "b7-21", ts: "2.1", scenario: 1,
    stem: "<code>search_kb</code>'s description reads “Searches help-center articles.” For questions like “where is my order?” the agent calls it and returns generic shipping articles instead of using <code>get_order</code>. What's the best first fix?",
    options: [
      { t: "Route any message mentioning an order to <code>get_order</code> with a keyword rule.", trap: "T2", why: "Keyword routing misfires on paraphrases and bypasses the agent's judgment." },
      { t: "Say in <code>search_kb</code>'s description what it doesn't cover (order and account data) and which tool to use instead.", ok: true, why: "Descriptions should state boundaries, not just purpose." },
      { t: "Remove <code>search_kb</code> from the agent, since its articles rarely resolve tickets.", why: "Breaks the questions help articles do answer." },
      { t: "Add several few-shot examples of order questions answered with <code>get_order</code>.", trap: "T1", why: "Can help, but the description still invites the wrong choice; fix the interface first." }
    ]
  },
  {
    id: "b7-22", ts: "3.3", scenario: 2,
    stem: "<code>.claude/rules/api.md</code> has <code>paths: [\"src/api/**\"]</code>, and <code>.claude/rules/testing.md</code> has <code>paths: [\"**/*.test.ts\"]</code>. Claude edits <code>src/api/user.test.ts</code>. Which rules apply?",
    options: [
      { t: "Only <code>api.md</code>, because its directory pattern is more specific than a file pattern.", why: "Rules don't compete; every matching rule applies." },
      { t: "Only <code>testing.md</code>, because file-pattern rules take precedence over directory rules.", why: "There's no precedence between matching rules." },
      { t: "Both, since the file matches both glob patterns.", ok: true, why: "Every rule whose paths match the file is loaded." },
      { t: "Neither, unless the root CLAUDE.md imports them.", trap: "T8", why: "Rules load from .claude/rules/ without imports." }
    ]
  },
  {
    id: "b7-23", ts: "5.3", scenario: 3,
    stem: "A search subagent runs 10 queries. Six return results; four still time out after local retries. Its output is a single <code>status: \"partial\"</code> plus the merged results. Why is that a problem, and what's better?",
    options: [
      { t: "It's fine: “partial” tells the coordinator enough to note a coverage gap in the report.", why: "The coordinator can't tell which queries failed, so it can't re-delegate them." },
      { t: "Return per-query status: results for the six, and for the four, the query, error type and attempts made.", ok: true, why: "Granular status lets the coordinator retry or re-scope exactly what's missing." },
      { t: "Report “failed” for the whole task, so the coordinator re-runs all 10 queries.", trap: "T6", why: "Throws away six good results." },
      { t: "Retry the four queries until they succeed before returning anything.", trap: "T6", why: "Timeouts that survive local retries may not resolve; the coordinator may have alternatives." }
    ]
  },
  {
    id: "b7-24", ts: "5.5", scenario: 6,
    stem: "You have 2,000 labeled extractions. On the <code>tax_id</code> field, a model confidence of 0.9 corresponds to 82% observed accuracy; on <code>invoice_date</code>, 0.9 corresponds to 99%. How should review thresholds be set?",
    options: [
      { t: "Use 0.9 for every field, since it means 90% confidence.", why: "The labeled data shows 0.9 means different accuracy on different fields." },
      { t: "Set every field's threshold from the labeled accuracy, so <code>tax_id</code> needs a higher score.", ok: true, why: "Calibrate thresholds per field against labeled data." },
      { t: "Average the two fields' accuracy and use a single threshold matching that average.", why: "Averaging hides exactly the per-field difference you measured." },
      { t: "Send every <code>tax_id</code> to review and never review <code>invoice_date</code>.", why: "Ignores the scores entirely and stops measuring invoice_date." }
    ]
  },
  {
    id: "b8-1", ts: "4.1", scenario: 1,
    stem: "The support agent's prompt says to “offer a goodwill credit when appropriate.” Credits vary wildly between similar cases, and finance can't predict the cost. Best change?",
    options: [
      { t: "Spell out when a credit applies and how much, by case type, with an example of each.", ok: true, why: "Explicit criteria replace a vague judgment with a consistent rule." },
      { t: "Tell the agent to be fair and consistent when it decides on credits.", trap: "T9", why: "Restates the goal without saying what fair means." },
      { t: "Have the agent rate each case's severity from 1 to 10 and credit cases above 7.", trap: "T4", why: "An uncalibrated self-rating moves the inconsistency rather than removing it." },
      { t: "Route every credit decision to a human team lead for approval.", trap: "T2", why: "Overkill for small credits; clear criteria fix the inconsistency." }
    ]
  },
  {
    id: "b8-2", ts: "4.2", scenario: 1,
    stem: "The agent's replies must end with a summary block in a set format (case ID, actions taken, next step) that the CRM parses. Instructions describe the format, but about 15% of replies vary it. What helps most?",
    options: [
      { t: "Repeat the format description at the end of the system prompt as well.", trap: "T9", why: "More description of the same format adds no new information." },
      { t: "Add two or three examples of replies ending in the exact summary block.", ok: true, why: "When instructions alone vary, examples of the exact format fix it." },
      { t: "Let the CRM parser accept the common variations as they appear.", trap: "T6", why: "Chases the variations instead of fixing the output." },
      { t: "Lower the temperature so replies follow the format more closely.", why: "More repeatable, not more correct; the format still drifts." }
    ]
  },
  {
    id: "b8-3", ts: "4.6", scenario: 1,
    stem: "Before an agent's reply goes out in high-value disputes, a second step checks it against policy. That step is the same conversation asked to “review your reply.” It rarely catches the errors auditors later find. Better design?",
    options: [
      { t: "Ask the same conversation to review its reply twice before sending.", why: "The same context repeats the same blind spots." },
      { t: "A separate call given the reply and policy but not the agent's reasoning.", ok: true, why: "An independent reviewer isn't anchored on how the reply was produced." },
      { t: "Have the agent attach a confidence score and send low-scoring replies to a human.", trap: "T4", why: "Uncalibrated scores don't catch confident policy errors." },
      { t: "Switch the agent to a larger model for high-value disputes.", trap: "T3", why: "Doesn't add an independent check." }
    ]
  },
  {
    id: "b8-4", ts: "4.6", scenario: 2,
    stem: "Claude Code generates a migration script, then you ask the same session whether it's safe to run in production. It says yes; the script later locks a large table for 20 minutes. What would have caught it?",
    options: [
      { t: "Asking the same session again, more skeptically, before running it.", trap: "T9", why: "The same context shares the original blind spots." },
      { t: "A fresh session reviewing the script against locking and data-volume criteria.", ok: true, why: "An independent review with concrete criteria isn't anchored on the generator's reasoning." },
      { t: "Plan mode for the next migration so Claude thinks harder before writing it.", why: "Better planning, but still no independent check of the result." },
      { t: "Running the script in production during low traffic, as a rule.", why: "Reduces impact without catching the problem." }
    ]
  },
  {
    id: "b8-5", ts: "4.1", scenario: 2,
    stem: "You ask Claude Code to “write good tests” for a payment module. It writes many tests for getters and setters and few for refund edge cases. Best change to the request?",
    options: [
      { t: "Name what to cover, such as refund edge cases and rounding.", ok: true, why: "Explicit criteria define what good means for this module." },
      { t: "Ask for “more thorough tests” this time.", trap: "T9", why: "Thorough by what standard? The criteria are still missing." },
      { t: "Ask for at least 50 tests so coverage goes up.", why: "A count invites more trivial tests." },
      { t: "Generate tests with a larger model.", trap: "T3", why: "Without criteria, any model can focus on the easy cases." }
    ]
  },
  {
    id: "b8-6", ts: "4.3", scenario: 3,
    stem: "Search subagents return findings as free-form text. Synthesis often can't tell a claim from its source or date, and parsing breaks. What should subagents produce?",
    options: [
      { t: "Markdown with a heading per finding, so synthesis can split on headings.", why: "Still free text; fields aren't guaranteed." },
      { t: "Tool output with claim, source, date and excerpt fields.", ok: true, why: "A schema-defined tool output gives synthesis reliable fields." },
      { t: "A longer narrative that explains where each claim came from.", why: "Harder to parse, and the fields still aren't structured." },
      { t: "Plain text, with synthesis told to extract sources carefully.", trap: "T9", why: "Leaves the structure to chance." }
    ]
  },
  {
    id: "b8-7", ts: "4.4", scenario: 3,
    stem: "Findings must cite a URL that appears in the subagent's fetched sources. A validator finds about 5% cite URLs that were never fetched. Retrying with “cite real sources” barely helps. Better retry?",
    options: [
      { t: "Retry with the list of fetched URLs and the specific citation that failed.", ok: true, why: "Specific feedback, plus the valid options, lets the model correct the citation." },
      { t: "Retry up to five times with the same instruction.", trap: "T6", why: "The same request repeats the same mistake." },
      { t: "Drop any finding with an invalid citation, without telling anyone.", trap: "T6", why: "Silently loses findings that may be real." },
      { t: "Raise the subagent's temperature on retries for more variety.", why: "Variety isn't correctness." }
    ]
  },
  {
    id: "b8-8", ts: "4.6", scenario: 3,
    stem: "Reports sometimes include claims their cited sources don't support. A teammate proposes asking the synthesis agent to “double-check its citations” at the end. Better approach?",
    options: [
      { t: "An independent pass checking each claim against its excerpt.", ok: true, why: "An independent, source-grounded check catches what self-review misses." },
      { t: "The synthesis agent's own double-check, run in the same conversation.", why: "Anchored on its own wording and reasoning." },
      { t: "Requiring at least two sources for every claim in the report.", why: "Changes the threshold without checking support." },
      { t: "Dropping every claim that has only one source.", why: "Loses valid findings; still doesn't check support." }
    ]
  },
  {
    id: "b8-9", ts: "4.1", scenario: 4,
    stem: "A code-review assistant in the editor flags every TODO comment as an issue. Developers silence it. The team wants TODOs flagged only when they reference a closed ticket or are older than 90 days. Best change?",
    options: [
      { t: "Tell the assistant to use judgment about which TODOs matter.", trap: "T9", why: "No criteria, so the noise continues." },
      { t: "Stop checking TODOs entirely.", why: "Loses the useful cases." },
      { t: "State both criteria, with examples that count and don't.", ok: true, why: "Explicit criteria with contrasting examples cut the false positives." },
      { t: "Cap the assistant at two TODO findings per file.", why: "Still flags the wrong ones." }
    ]
  },
  {
    id: "b8-10", ts: "4.2", scenario: 4,
    stem: "A developer tool drafts commit messages. Your convention is “type(scope): summary” plus a body explaining why. The instructions describe it, but drafts drift in format. What helps most?",
    options: [
      { t: "Two or three example commit messages in exactly the team's format.", ok: true, why: "Examples show the precise format instructions leave room on." },
      { t: "A longer description of the convention with every allowed type listed.", why: "More prose, same ambiguity." },
      { t: "A regex that rejects drafts and asks the developer to rewrite them.", trap: "T6", why: "Pushes the work to the developer." },
      { t: "A bigger model for drafting commit messages.", trap: "T3", why: "Format drift isn't a capability problem." }
    ]
  },
  {
    id: "b8-11", ts: "4.5", scenario: 4,
    stem: "Every weekend, a job asks Claude to check 4,000 internal repositories' READMEs against the documentation standard. Results are reviewed on Monday. Cost matters. How should the job run?",
    options: [
      { t: "Synchronous calls in parallel, so results arrive within minutes.", why: "Full price for results nobody reads until Monday." },
      { t: "The Message Batches API, with a <code>custom_id</code> per repository.", ok: true, why: "Latency-tolerant work fits batch: half the cost, matched by custom_id." },
      { t: "One request containing all 4,000 READMEs, to save on overhead.", trap: "T3", why: "Far beyond a single context window, and one failure loses everything." },
      { t: "Synchronous calls, one repository at a time, overnight.", why: "Slow and still full price." }
    ]
  },
  {
    id: "b8-12", ts: "3.2", scenario: 4,
    stem: "Developers repeatedly paste the same 40-line prompt to triage flaky tests. You want it versioned with the repo and runnable as one command. What should you create?",
    options: [
      { t: "A committed project skill or command for the workflow.", ok: true, why: "A reusable, versioned workflow everyone gets on clone." },
      { t: "A section in CLAUDE.md, so the prompt loads in every session.", why: "Always-on context for an occasional task." },
      { t: "A snippet in each developer's editor.", why: "Not versioned with the repo, so copies drift." },
      { t: "A wiki page developers copy from.", why: "Still manual pasting." }
    ]
  },
  {
    id: "b8-13", ts: "3.4", scenario: 4,
    stem: "A developer wants to replace the app's hand-rolled auth with the company's SSO library. It touches routing, sessions and 30 files, and there are two plausible integration approaches. How should they start?",
    options: [
      { t: "Direct execution, starting with the routing changes and adjusting as needed.", why: "Commits to an approach before comparing the two options." },
      { t: "Plan mode to compare both approaches, then execute the plan.", ok: true, why: "Architectural, multi-file, with alternatives: plan first." },
      { t: "Ask Claude to implement both approaches and keep whichever compiles.", why: "Twice the work, and compiling doesn't decide architecture." },
      { t: "Direct execution with tests run after each file.", why: "Tests catch breakage but don't choose the design." }
    ]
  },
  {
    id: "b8-14", ts: "3.1", scenario: 4,
    stem: "An engineer's personal <code>~/.claude/CLAUDE.md</code> says “prefer tabs.” The project's CLAUDE.md says “use 2-space indentation,” and the formatter enforces it in CI. The engineer's sessions sometimes produce tabs. What's the right fix?",
    options: [
      { t: "Remove the conflicting personal preference.", ok: true, why: "Personal memory shouldn't contradict project standards." },
      { t: "Add “IMPORTANT” to the project rule so it wins.", trap: "T9", why: "Emphasis doesn't resolve the contradiction." },
      { t: "Move the project rule into each engineer's personal file.", why: "Unversioned copies drift." },
      { t: "Disable the CI formatter check.", why: "Removes the guarantee instead of fixing the conflict." }
    ]
  },
  // ---- Option-family practice twins (generated by scripts/audit/build-families.mjs) ----
  {
    id: "p1-1", ts: "1.1", scenario: 1, family: "F01",
    stem: "When the order-lookup tool times out, the loop exits and the agent replies “I couldn't complete that,” even though a cached-orders tool could have answered. What should change?",
    options: [
      { t: "Decide when to stop by checking <code>stop_reason</code>, not by parsing the reply text.", why: "Right when the loop guesses completion from the text. Here the exit is caused by the tool failure." },
      { t: "Return a tool failure to Claude as a <code>tool_result</code> with <code>is_error</code> set, and keep looping.", ok: true, why: "Errors are information: send the failure back so Claude can try the cached-orders tool." },
      { t: "Cap the loop at a set number of iterations and hand off to a human when it's reached.", why: "Right when the agent loops without progress. Here it gives up after one failure." },
      { t: "Raise <code>max_tokens</code> and continue the turn when <code>stop_reason</code> is <code>max_tokens</code>.", why: "Right when replies are truncated. Nothing was cut off here; a tool failed." }
    ]
  },
  {
    id: "p1-2", ts: "1.4", scenario: 1, family: "F02",
    stem: "An audit finds 3% of refunds were issued before identity verification, despite a bold system-prompt rule. Verification is a compliance requirement. What fixes this?",
    options: [
      { t: "Block the refund tool in code until <code>verify_identity</code> has succeeded this session.", ok: true, why: "A requirement with compliance stakes needs a guarantee in code, not a more emphatic instruction." },
      { t: "Add few-shot examples showing how the agent should word its identity-check request.", why: "Right when the wording of the check confuses customers. Examples still leave the order probabilistic." },
      { t: "Escalate with a structured summary: customer ID, issue, steps taken, what's needed.", why: "Right when humans receive thin handoffs. This is about the order of the agent's own steps." },
      { t: "Record completed steps in session state so later checks don't ask for them again.", why: "Right when completed checks get repeated. Here a required check is sometimes skipped." }
    ]
  },
  {
    id: "p1-3", ts: "1.5", scenario: 1, family: "F03",
    stem: "Policy now requires manager approval for refunds over $500. When customers push hard, the agent sometimes issues larger refunds anyway. Which addition fits best?",
    options: [
      { t: "A <code>PreToolUse</code> hook that blocks refund calls above the approval limit.", ok: true, why: "A financial limit needs to be enforced before the call runs, every time." },
      { t: "A <code>PostToolUse</code> hook that masks card numbers to the last four digits.", why: "Right when sensitive data appears in tool results. Here the issue is an action that shouldn't run." },
      { t: "A <code>PostToolUse</code> hook that converts each backend's dates to ISO 8601.", why: "Right when results arrive in mixed formats. Here the issue is an action that shouldn't run." },
      { t: "A system-prompt line asking the agent to suggest the cheaper shipping option first.", why: "Right for soft preferences. A refund limit with financial stakes needs a guarantee." }
    ]
  },
  {
    id: "p1-4", ts: "1.6", scenario: 1, family: "F04",
    stem: "Warranty claims follow the same three steps in the same order every time, and auditors want each claim handled identically. What design fits best?",
    options: [
      { t: "Extract every request into a checklist first, then resolve each one in turn.", why: "Right when one message holds several requests. A warranty claim is a single, predictable task." },
      { t: "Run a fixed sequence: classify, look up the order, then draft the reply.", ok: true, why: "A predictable, identical sequence is what a fixed pipeline is for, and it's easy to audit." },
      { t: "Let the agent pick each next step from what the previous tool returned.", why: "Right when the path depends on what turns up. Here the path never changes, and auditors want it fixed." },
      { t: "Give each request to its own subagent and run them in parallel.", why: "Right for heavy, independent sub-tasks. These steps depend on each other in order." }
    ]
  },
  {
    id: "p1-5", ts: "1.4", scenario: 1, family: "F05",
    stem: "Account closures can't be undone, and legal requires a supervisor's sign-off before one runs. The agent occasionally closes accounts directly. What should change?",
    options: [
      { t: "Escalate with a structured summary: customer ID, issue, steps taken, what's needed.", why: "Right when handoffs lack context. Here the agent skips a required step." },
      { t: "Require a code-checked supervisor approval before any account closure runs.", ok: true, why: "An irreversible action with legal stakes needs its prerequisite enforced in code." },
      { t: "Keep verified facts in a case-facts block that is re-sent every turn.", why: "Right when the agent forgets facts. Here it skips a required approval." },
      { t: "Hand the conversation to a human when the customer explicitly asks for one.", why: "Right when a customer asks for a person. Here the problem is an unapproved action." }
    ]
  },
  {
    id: "p2-4", ts: "1.5", scenario: 2, family: "F06",
    stem: "PRs keep failing review because about one in ten of Claude's edits ignores the project's formatter settings. Formatting must match exactly. Which addition fits best?",
    options: [
      { t: "A <code>PreToolUse</code> hook that blocks Bash commands touching the production config.", why: "Right when an action must be blocked. Formatting needs to be applied, not blocked." },
      { t: "A <code>PostToolUse</code> hook that runs the formatter on every file Claude edits.", ok: true, why: "Run the formatter after every edit so the result is correct every time." },
      { t: "A CLAUDE.md note describing the team's preferred commit-message style.", why: "Right for a convention where an occasional miss is fine. Exact formatting needs a guarantee." },
      { t: "A <code>PostToolUse</code> hook that trims test output to the failures before Claude sees it.", why: "Right when tool output floods the context. This is about the files Claude writes." }
    ]
  },
  {
    id: "p2-10", ts: "1.6", scenario: 2, family: "F07",
    stem: "The build fails intermittently and nobody knows which part of the codebase causes it. What approach fits best?",
    options: [
      { t: "Have Claude write a plan, then implement it step by step against that plan.", why: "Right when the steps are known up front. Here you don't yet know what to change." },
      { t: "Review one file per pass, then run a final pass over cross-file consistency.", why: "Right for reviewing a large, known set of files. Here the cause isn't located yet." },
      { t: "Make the change directly in one pass, because it's small and well understood.", why: "Right for a small, well-understood change. The cause here is unknown." },
      { t: "Explore the codebase first, then decide the next steps from what turns up.", ok: true, why: "When the cause is unknown, investigate first and let the findings decide the next step." }
    ]
  },
  {
    id: "p3-1", ts: "1.2", scenario: 3, family: "F08",
    stem: "The web-search subagent keeps calling the document-analysis tools, and the analysis subagent keeps searching the web. Work is duplicated and the budget runs out. What change fits best?",
    options: [
      { t: "Have the coordinator split the topic into distinct subtopics before delegating.", why: "Right when the split misses parts of the question. Here the roles are blurred by their tools." },
      { t: "Have the coordinator check results against the question and re-delegate the gaps.", why: "Right when coverage gaps appear after results arrive. Here the issue is role overlap." },
      { t: "Route all subagent output through the coordinator, not directly between subagents.", why: "Right when subagents bypass the coordinator. Here each one simply has tools outside its role." },
      { t: "Give each subagent only the tools that its role needs.", ok: true, why: "Scoping tools to each role keeps subagents on their job and makes selection reliable." }
    ]
  },
  {
    id: "p3-2", ts: "1.3", scenario: 3, family: "F09",
    stem: "The synthesis subagent is asked to “write up the findings so far” and produces a confident report with invented details. It never received the search results. What change fits best?",
    options: [
      { t: "Put the earlier findings and their sources directly in the subagent's prompt.", ok: true, why: "Subagents don't share the coordinator's context; the findings must be passed in the prompt." },
      { t: "Have subagents return structured results: claim, source URL and date for each.", why: "Right when results lose their sources. Here the subagent got no results at all." },
      { t: "Spawn the independent searches in the same turn so they run in parallel.", why: "Right when independent subagents run one after another. This one lacks its input." },
      { t: "Write the subagent's prompt as goals and quality criteria, not fixed steps.", why: "Right when step-by-step prompts make subagents rigid. Without the findings, no prompt style helps." }
    ]
  },
  {
    id: "p3-3", ts: "1.6", scenario: 3, family: "F10",
    stem: "Investigations often turn up a lead, such as a name or a dataset, that changes what should be searched next. The current fixed pipeline can't follow it. What design fits best?",
    options: [
      { t: "Use a fixed pipeline: search, then analyze, then synthesize, in that order.", why: "That's the current design, and it can't follow new leads." },
      { t: "Let the coordinator choose the next subagent based on what the last one found.", ok: true, why: "When findings change the path, decide each next step from what came back." },
      { t: "Run the searches for independent subtopics in parallel subagents.", why: "Right when subtopics are known and independent. Here the next search depends on the last result." },
      { t: "Handle the whole request in a single agent with one context.", why: "Right for small tasks. These investigations are open-ended." }
    ]
  },
  {
    id: "p3-4", ts: "1.2", scenario: 3, family: "F11",
    stem: "When a search subagent finds nothing for one subtopic, the coordinator quietly drops it, and the report has a hole nobody notices. A narrower search usually does find sources for these subtopics. What change fits best?",
    options: [
      { t: "Have subagents report to the coordinator, which decides what to pass on.", why: "Right when subagents bypass the coordinator. Here the coordinator receives the result and drops it." },
      { t: "Have the coordinator check each claim's source before including it.", why: "Right when claims lack support. Here a subtopic has no claims at all." },
      { t: "Send a failed subtopic back to a subagent with a narrower query.", ok: true, why: "An empty result calls for a retry with a better query, not silent omission." },
      { t: "Give the coordinator a limit on research rounds before it must synthesize.", why: "Right when the coordinator won't stop. Here it stops too soon on one subtopic." }
    ]
  },
  {
    id: "p3-5", ts: "1.3", scenario: 3, family: "F12",
    stem: "The coordinator spawns subagents for four independent subtopics, one after another across four turns. Each request takes about four times longer than it should. What change fits best?",
    options: [
      { t: "Add the Task (Agent) tool to the coordinator's <code>allowedTools</code>.", why: "Right when the coordinator can't spawn subagents. It can; it just does so one at a time." },
      { t: "Include the earlier agent's complete findings in the subagent's prompt.", why: "Right when a subagent lacks context. Here the subtopics are independent." },
      { t: "Define each subagent with its own description, prompt and tool list.", why: "Right when subagent roles are unclear. Here the roles work; the timing doesn't." },
      { t: "Spawn the subagents in the same response so they run in parallel.", ok: true, why: "Several subagent calls in one response run in parallel." }
    ]
  },
  {
    id: "p4-8", ts: "1.5", scenario: 4, family: "F13",
    stem: "Developers want a repeatable way to cut a release that any teammate can invoke when needed, with the team's steps written down once. What fits best?",
    options: [
      { t: "A <code>PreToolUse</code> hook that denies file writes outside the project directory.", why: "Right when an action must be prevented. Nothing needs blocking here." },
      { t: "A <code>PostToolUse</code> hook that maps the internal API's responses onto one schema.", why: "Right when responses vary in shape. This is about a procedure." },
      { t: "A <code>PreToolUse</code> hook that adds the required team label to the tool's input.", why: "Right when every call needs a fixed input. Here developers want a procedure they run on request." },
      { t: "A skill containing the team's release steps, which developers run on demand.", ok: true, why: "A skill packages a repeatable procedure that people invoke on demand." }
    ]
  },
  {
    id: "p4-9", ts: "1.3", scenario: 4, family: "F14",
    stem: "In a large, unfamiliar repository, the main session fills with file listings and search output before any real work starts. What fixes this?",
    options: [
      { t: "Use the Explore subagent to search the codebase and return a summary.", ok: true, why: "Exploration in a separate context returns only a summary, keeping the main session clean." },
      { t: "Pass the relevant file paths and the decisions so far in the subagent's prompt.", why: "Right when a subagent lacks specifics. Here the main session is overloaded." },
      { t: "Give the subagent read-only tools so it can't modify anything.", why: "Right for review work that shouldn't modify files. Here the problem is context bloat." },
      { t: "Ask the subagent to return its findings in a fixed structured format.", why: "Right when the output format is unreliable. Here the problem is volume in the main session." }
    ]
  },
  {
    id: "p4-10", ts: "1.1", scenario: 4, family: "F15",
    stem: "In the internal assistant, follow-up questions are answered as if earlier tool results never happened. The loop sends only the newest user message with each request. What should change?",
    options: [
      { t: "Return a tool's error to Claude with <code>is_error</code> set so it can try another approach.", why: "Right when errors end the loop. Here context is missing." },
      { t: "Check <code>stop_reason</code> to decide whether to run tools or return the answer.", why: "Right when the loop guesses completion. Here context is missing." },
      { t: "Run every <code>tool_use</code> block in a response and return all the results together.", why: "Right when some tool calls go unanswered. Here past results are dropped." },
      { t: "Send the full message history, including tool results, with each request.", ok: true, why: "The API is stateless; each request must carry the whole conversation." }
    ]
  },
  {
    id: "p5-9", ts: "1.4", scenario: 5, family: "F16",
    stem: "The review flags blocking issues correctly, but teams merge anyway because the job only posts a comment. Blocking issues must stop the merge. What fixes this?",
    options: [
      { t: "Have the pipeline block the merge in code when the review reports a blocking issue.", ok: true, why: "A rule that must hold needs enforcement in code; a comment can be ignored." },
      { t: "Add explicit criteria to the review prompt for what counts as blocking.", why: "Right when the review over-flags. Here its verdicts are right; they're ignored." },
      { t: "Make the secret scan a required step that must pass before the review job starts.", why: "Right when the review runs on unscanned code. Here the issue is what happens after." },
      { t: "Post findings as inline comments that cite the file and line.", why: "Right when findings are hard to locate. Here they're found and ignored." }
    ]
  },
  {
    id: "p5-10", ts: "1.6", scenario: 5, family: "F17",
    stem: "After each push, the review re-reports issues on files that didn't change, burying the new findings. What fits best?",
    options: [
      { t: "Review each changed file in its own pass, then one pass on cross-file interactions.", why: "Right for large diffs. Here the problem is re-reviewing unchanged files." },
      { t: "Review the whole diff in a single pass, with the PR description as context.", why: "Right for small diffs. It still re-reviews everything." },
      { t: "Run separate passes for security, performance and style.", why: "Right when one concern crowds out the others. Here the problem is repetition." },
      { t: "Review only the files that changed since the last reviewed commit.", ok: true, why: "Limit each re-review to what changed so old findings don't repeat." }
    ]
  },
  {
    id: "p2-1", ts: "3.1", scenario: 2, family: "F18",
    stem: "A developer wants Claude to give terse explanations in every project they work on. Their teammates don't share the preference. Where should it go?",
    options: [
      { t: "Put the rule in the repository's root CLAUDE.md and commit it.", why: "Right for team conventions. This would impose one person's preference on everyone." },
      { t: "Put the rule in <code>~/.claude/CLAUDE.md</code> on the developer's machine.", ok: true, why: "User-level memory applies to all of one person's projects and isn't shared." },
      { t: "Put the rule in a <code>.claude/rules/</code> file with a <code>paths:</code> glob for test files.", why: "Right for conventions scoped to file patterns. This is a personal preference." },
      { t: "Put the rule in a CLAUDE.md inside the one directory it applies to.", why: "Right for one directory's conventions. This applies everywhere for one person." }
    ]
  },
  {
    id: "p4-7", ts: "3.1", scenario: 4, family: "F19",
    stem: "A new teammate says Claude ignores the team's conventions on their machine; for everyone else it follows them. The conventions live in the tech lead's <code>~/.claude/CLAUDE.md</code>. What fixes this?",
    options: [
      { t: "Commit the conventions to the repository's root CLAUDE.md.", ok: true, why: "Team conventions belong in project memory that everyone gets from the repository." },
      { t: "Split each topic into its own file and <code>@import</code> them from CLAUDE.md.", why: "Right for organizing a large file. The conventions still wouldn't reach the teammate." },
      { t: "Run <code>/memory</code> to see which memory files this session has loaded.", why: "Useful for diagnosis, but the cause is already known: user-level memory isn't shared." },
      { t: "Add a CLAUDE.md in the <code>legacy/</code> directory with its own conventions.", why: "Right for one directory's conventions. These apply to the whole team." }
    ]
  },
  {
    id: "p2-2", ts: "3.2", scenario: 2, family: "F20",
    stem: "A codebase-analysis skill dumps pages of exploration output into the session each time it runs, crowding out the developer's own work. What fits best?",
    options: [
      { t: "A skill in <code>.claude/skills/</code> with <code>context: fork</code> in its frontmatter.", ok: true, why: "Running the skill in a forked context keeps its exploration out of the main session." },
      { t: "A slash command in <code>.claude/commands/</code>, committed to the repository.", why: "Right for sharing a command with the team. The problem here is output volume." },
      { t: "A command in <code>~/.claude/commands/</code> on the developer's machine.", why: "Right for a personal shortcut. The problem here is output volume." },
      { t: "A rule in CLAUDE.md so that it applies in every session.", why: "Right for always-on guidance. This would load more into every session." }
    ]
  },
  {
    id: "p2-3", ts: "3.2", scenario: 2, family: "F21",
    stem: "A skill's SKILL.md has grown to 900 lines of reference tables. Any single run needs only a few of them, but all 900 lines load every time. What fixes this?",
    options: [
      { t: "Move the detailed reference material into supporting files that the skill links to.", ok: true, why: "Keep SKILL.md short and load detailed material only when a run needs it." },
      { t: "Add <code>argument-hint</code> to the frontmatter so users see what to pass.", why: "Right when users don't know what to pass. Size is the problem here." },
      { t: "Rewrite the skill's description to say when it should be used.", why: "Right when Claude doesn't know when to use the skill. Size is the problem here." },
      { t: "Copy the skill into <code>~/.claude/skills/</code> and change the copy.", why: "Right for a personal variant. The copy would be just as large." }
    ]
  },
  {
    id: "p4-6", ts: "3.2", scenario: 4, family: "F22",
    stem: "The platform team wants every engineer who works in the monorepo to get the same <code>/new-service</code> workflow. Where should it live?",
    options: [
      { t: "A skill in <code>~/.claude/skills/</code> on the developer's machine.", why: "Right for one person's workflow. Other engineers wouldn't get it." },
      { t: "A skill in the repository's <code>.claude/skills/</code> directory.", ok: true, why: "A project skill is shared with everyone through the repository." },
      { t: "A section in the repository's CLAUDE.md that describes the steps.", why: "Right for always-on conventions. This is an on-demand workflow." },
      { t: "A <code>PostToolUse</code> hook that runs the steps after each edit.", why: "Right for something that must run after every edit. This runs when asked." }
    ]
  },
  {
    id: "p2-5", ts: "3.4", scenario: 2, family: "F23",
    stem: "The team needs to replace the logging library across 120 files. Several modules use it in unusual ways, and the team hasn't agreed on the migration pattern. What's the best way to work?",
    options: [
      { t: "Start in plan mode and agree on an approach before any files change.", ok: true, why: "A large change with open design choices needs an agreed plan before edits start." },
      { t: "Make the change directly, then review the diff.", why: "Right for a small, well-understood change. This is neither." },
      { t: "Have Claude interview you about the requirements before it starts.", why: "Right when the developer doesn't know the requirements. Here the open question is the approach." },
      { t: "Run the exploration in a subagent and keep only its summary.", why: "Right when exploration would flood the context. It doesn't settle the approach." }
    ]
  },
  {
    id: "p2-6", ts: "3.5", scenario: 2, family: "F24",
    stem: "Claude's date parser keeps misreading what the team means by “short date.” Two rounds of prose explanation haven't helped. What works best?",
    options: [
      { t: "Give two or three concrete input/output examples of the transformation.", ok: true, why: "Concrete examples remove the ambiguity that prose descriptions leave." },
      { t: "Write the tests first and have Claude iterate until they pass.", why: "Right for larger behavioral specs. A few examples settle a format faster." },
      { t: "Have Claude ask clarifying questions before implementing anything.", why: "Right when the developer is unsure what they want. Here they know; Claude misreads it." },
      { t: "Describe all the problems in one message, because they interact.", why: "Right when several problems interact. Here there's one misunderstanding." }
    ]
  },
  {
    id: "p2-7", ts: "3.5", scenario: 2, family: "F25",
    stem: "A refactored function must produce identical outputs for 40 known inputs. Claude's versions keep breaking a few of them. What works best?",
    options: [
      { t: "Write the test cases first, then have Claude iterate until they all pass.", ok: true, why: "Known expected outputs make an exact target; tests let Claude check itself." },
      { t: "Add the missing detail to the prompt: inputs, constraints and expected output.", why: "Right when the prompt omits something. Here the target is already known." },
      { t: "Have Claude interview you about edge cases before it writes any code.", why: "Right when requirements are unclear. Here they're exact." },
      { t: "Raise the issues one per message, because they're independent.", why: "Right for independent issues. Here one target covers all of them." }
    ]
  },
  {
    id: "p5-4", ts: "3.5", scenario: 5, family: "F26",
    stem: "The reviewer flags “magic numbers” the team considers fine and misses the ones it cares about. A written rule describing the difference hasn't helped. What works best?",
    options: [
      { t: "Add a few examples of findings the team accepted and ones it rejected.", ok: true, why: "When a written rule fails on a judgment call, examples show where the line is." },
      { t: "Add the team's testing and style conventions to the repository's CLAUDE.md.", why: "Right when the reviewer lacks project context. Here it has a rule but misapplies it." },
      { t: "Try the prompt on a sample of past PRs and refine it before rollout.", why: "Right before rollout. The problem is already known here." },
      { t: "Split the prompt into separate review passes, one for each concern.", why: "Right when one concern crowds out others. Here one judgment is miscalibrated." }
    ]
  },
  {
    id: "p5-1", ts: "3.6", scenario: 5, family: "F27",
    stem: "A script that posts inline PR comments breaks whenever Claude phrases its findings differently. What fixes this?",
    options: [
      { t: "Run Claude with the <code>-p</code> flag so that it runs non-interactively.", why: "Right when the job hangs waiting for input. It runs fine here." },
      { t: "Use <code>--output-format json</code> with <code>--json-schema</code> for parseable output.", ok: true, why: "Schema-constrained JSON gives the script a fixed structure to read." },
      { t: "Include the previous run's findings so only new issues are reported.", why: "Right when re-runs repeat findings. Here the format varies." },
      { t: "Run the review in a separate session from the one that generated the code.", why: "Right when the reviewer shares the author's blind spots. Here the format varies." }
    ]
  },
  {
    id: "p5-2", ts: "3.6", scenario: 5, family: "F28",
    stem: "Every new push gets a full set of review comments. Many repeat issues that were already raised and fixed. What fixes this?",
    options: [
      { t: "Pass the prior review's findings and ask only for new or unresolved issues.", ok: true, why: "With the earlier findings in context, the reviewer can report only what's new or still open." },
      { t: "Generate the tests and review them in separate Claude sessions.", why: "Right when a session reviews its own output. The problem here is repetition." },
      { t: "Put the project's test conventions and fixture helpers in CLAUDE.md.", why: "Right when generated code ignores conventions. The problem here is repetition." },
      { t: "Validate the JSON output against the schema and fail the job if it's invalid.", why: "Right when malformed output breaks parsing. The problem here is repetition." }
    ]
  },
  {
    id: "p5-3", ts: "3.6", scenario: 5, family: "F29",
    stem: "The reviewer flags intentional behavior changes as bugs because it doesn't know what each PR is meant to do. What fits best?",
    options: [
      { t: "Have a separate session, without the generator's context, review the code.", why: "Right when the reviewer shares the author's blind spots. Here it lacks the PR's intent." },
      { t: "Run the review overnight on a schedule instead of on every push.", why: "Right when cost matters more than speed. It doesn't explain the change's intent." },
      { t: "Give the reviewer the PR description and linked issue as context.", ok: true, why: "Telling the reviewer what the change is for lets it tell intended changes from bugs." },
      { t: "Give the review job read-only tools so it can't change the branch.", why: "Right when the reviewer must not modify the branch. Here it misjudges intent." }
    ]
  },
  {
    id: "p5-5", ts: "4.1", scenario: 5, family: "F30",
    stem: "The reviewer reports style nits, possible bugs and security holes with the same urgency. The team wants all three kinds of finding, but developers can't tell what must be fixed before merging. What's the best step?",
    options: [
      { t: "Define which issue categories to report and which to skip, with an example of each.", why: "Right when unwanted categories are reported. All of these are wanted; their priority is unclear." },
      { t: "Turn off the noisiest category for now while its criteria are rewritten.", why: "Right when one category is unreliable. Here they all lack priority." },
      { t: "Require each finding to cite the exact line and state its concrete impact.", why: "Right when findings are vague. Here they're specific but unranked." },
      { t: "Add severity levels, with a written criterion for each level.", ok: true, why: "Defined severity levels let developers see what blocks a merge." }
    ]
  },
  {
    id: "p6-7", ts: "4.1", scenario: 6, family: "F31",
    stem: "Reviewers can't check extracted values quickly: they have to search 80-page contracts for where each one came from. What fixes this?",
    options: [
      { t: "Define exactly what counts as a “termination clause,” with included and excluded examples.", why: "Right when a category is misunderstood. Here the values are fine but hard to verify." },
      { t: "Make the field nullable, and return null when the document doesn't contain one.", why: "Right when values are invented for absent fields. Here the issue is verification time." },
      { t: "Add a field where the model explains how it arrived at each value.", why: "Explaining the derivation doesn't say where in the document to look." },
      { t: "Require a page and section reference for every extracted value.", ok: true, why: "A location for every value lets reviewers jump straight to the evidence." }
    ]
  },
  {
    id: "p5-6", ts: "4.6", scenario: 5, family: "F32",
    stem: "Claude reviews the code it just generated, in the same conversation, and approves nearly everything. What fits best?",
    options: [
      { t: "Review each file separately, then do one pass on cross-file interactions.", why: "Right for large diffs. The issue here is self-review." },
      { t: "Have a second, independent instance review without the first one's reasoning.", ok: true, why: "An instance without the generator's reasoning doesn't share its blind spots." },
      { t: "Have the reviewer give a confidence for each finding to direct human attention.", why: "Right for directing human attention. The reviewer still shares the author's blind spots." },
      { t: "Review the whole diff in a single pass, with the PR description as context.", why: "Right for small diffs. Self-review would remain." }
    ]
  },
  {
    id: "p6-6", ts: "4.6", scenario: 6, family: "F33",
    stem: "The same instance that extracted the data is asked to verify it, and it confirms its own errors. What fits best?",
    options: [
      { t: "Have a second instance, without the first one's reasoning, re-extract a sample to compare.", ok: true, why: "An independent instance doesn't share the first one's reasoning, so it can catch its errors." },
      { t: "Have the model report confidence per field and send low-confidence fields to people.", why: "Right for prioritizing human review. Self-verification would still miss these errors." },
      { t: "Check that the totals add up, and retry with the error when they don't.", why: "Right for checkable arithmetic. Most fields can't be checked that way." },
      { t: "Split long documents into sections, extract from each, then merge the results.", why: "Right for long documents. The problem here is self-verification." }
    ]
  },
  {
    id: "p5-7", ts: "4.2", scenario: 5, family: "F34",
    stem: "Review findings come back in a different shape each run: sometimes a list, sometimes prose, sometimes a table. What works best?",
    options: [
      { t: "Add two or three borderline findings as examples, with the reasoning for each.", why: "Right for borderline judgment. Here the content is fine; the shape varies." },
      { t: "Write explicit criteria for which categories to report and which to skip.", why: "Right when unwanted categories appear. Here the shape varies." },
      { t: "Show an example of the exact output structure for one finding.", ok: true, why: "An example of the exact format shows the model what to reproduce every time." },
      { t: "Add examples from each of the languages the reviewer covers.", why: "Right when quality differs by language. Here the shape varies." }
    ]
  },
  {
    id: "p6-1", ts: "4.2", scenario: 6, family: "F35",
    stem: "Extraction works on the standard invoice template but fails on invoices that put the total in a footer table or a sidebar. What works best?",
    options: [
      { t: "Add example documents in each layout, showing where each field is found.", ok: true, why: "Examples of each layout show the model where fields live when the structure changes." },
      { t: "Add an example of a document missing a field, with null as the output.", why: "Right when fields are absent. Here they're present in other places." },
      { t: "Add an example that shows the reasoning for an ambiguous date.", why: "Right for ambiguous values. Here the problem is location." },
      { t: "Define each field precisely in the prompt, with its expected format.", why: "Right when a field's meaning is unclear. Here its location varies." }
    ]
  },
  {
    id: "p6-2", ts: "4.3", scenario: 6, family: "F36",
    stem: "Every document must go through <code>extract_metadata</code> before any other processing. The model sometimes calls a different tool first. What fixes this?",
    options: [
      { t: "Set <code>tool_choice</code> to <code>\"any\"</code> so a tool call is required.", why: "Right when any of several tools is acceptable. Here one specific tool must run first." },
      { t: "Force one tool with <code>tool_choice: {\"type\": \"tool\", \"name\": …}</code>.", ok: true, why: "Forcing the named tool guarantees it runs first. (Exam framing; see Exam vs. today for current model support.)" },
      { t: "Make the fields that may be absent nullable in the schema.", why: "Right when values are invented. Here the wrong tool runs." },
      { t: "Add an <code>\"other\"</code> enum value plus a free-text detail field.", why: "Right when categories don't fit. Here the wrong tool runs." }
    ]
  },
  {
    id: "p6-8", ts: "4.3", scenario: 6, family: "F37",
    stem: "The <code>payment_terms</code> enum has four values, but about 8% of contracts use other terms, and the model forces them into the nearest value. What fixes this?",
    options: [
      { t: "Make the fields that may be absent nullable in the schema.", why: "Right when a value is absent. Here a real value doesn't fit the list." },
      { t: "Add an <code>\"other\"</code> enum value with a free-text detail field.", ok: true, why: "An escape value plus detail captures real cases that the list doesn't cover." },
      { t: "Define the output with a strict JSON schema in the tool definition.", why: "Right for syntax errors. The output is valid, just forced into the wrong category." },
      { t: "Add a validation step that checks the values against business rules.", why: "Right for checkable rules. A wrong but valid category passes them." }
    ]
  },
  {
    id: "p6-3", ts: "4.4", scenario: 6, family: "F38",
    stem: "About 5% of extractions fail validation because dates come back as “March 3rd” instead of ISO 8601. The dates are in the documents. What's the right next step?",
    options: [
      { t: "Retry, including the specific validation error in the follow-up request.", ok: true, why: "The value exists; telling the model exactly what failed lets it correct the format." },
      { t: "Stop retrying and send the document to human review.", why: "Right when the source lacks the value. Here it's present." },
      { t: "Extract both the stated total and a calculated total, and flag mismatches.", why: "Right for internal consistency. This is a format error." },
      { t: "Record a <code>detected_pattern</code> with each flag to see which ones reviewers dismiss.", why: "Right for analyzing reviewer dismissals. This is a format error." }
    ]
  },
  {
    id: "p6-4", ts: "4.4", scenario: 6, family: "F39",
    stem: "Reviewers dismiss many of the extractor's “anomaly” flags. The team wants to learn which kinds of flag to stop raising. What fits best?",
    options: [
      { t: "Retry with the validation error and the original document in the follow-up.", why: "Right for correcting format errors. This is about which flags are useful." },
      { t: "Extract the line items, the stated total and a calculated total, then compare them.", why: "Right for detecting inconsistencies. This is about which flags are useful." },
      { t: "Make the field nullable so the model can report that a value is absent.", why: "Right when values are absent. This is about which flags are useful." },
      { t: "Record a <code>detected_pattern</code> with each flag to see which ones reviewers dismiss.", ok: true, why: "Tagging each flag with its pattern shows which patterns reviewers dismiss." }
    ]
  },
  {
    id: "p5-8", ts: "4.5", scenario: 5, family: "F40",
    stem: "A weekly scan of 2,000 repositories runs through synchronous calls. Nobody needs the results before Monday morning, and cost is the main complaint. What fits best?",
    options: [
      { t: "Use the Message Batches API for the nightly audit of every repository.", ok: true, why: "Non-urgent bulk work suits batches, which cost 50% less." },
      { t: "Keep synchronous calls for the pre-merge check that developers wait on.", why: "Right for blocking checks. Nobody waits on this one." },
      { t: "Refine the prompt on a sample first, then submit the full batch.", why: "Right for a new prompt. This scan's prompt is established." },
      { t: "Resubmit only the failed requests, matched by their <code>custom_id</code>.", why: "Right after failures. Here the issue is cost." }
    ]
  },
  {
    id: "p6-5", ts: "4.5", scenario: 6, family: "F41",
    stem: "A new extraction prompt has never run on real documents. The team must process 50,000 by Friday at the lowest cost. What fits best?",
    options: [
      { t: "Submit all 50,000 documents through the Message Batches API.", why: "Batching an untested prompt risks paying for 50,000 bad results." },
      { t: "Resubmit only the failed documents, matched by their <code>custom_id</code>.", why: "Right after a batch with failures. Nothing has run yet." },
      { t: "Run the prompt on a sample of a few hundred, refine it, then batch the rest.", ok: true, why: "Fix problems on a sample cheaply first, then batch the rest at the lower price." },
      { t: "Process documents synchronously as they arrive.", why: "Right when results are needed immediately. It costs more and nothing here is urgent." }
    ]
  },
  {
    id: "p1-6", ts: "2.2", scenario: 1, family: "F42",
    stem: "A refund request falls outside the 90-day policy window. The tool returns “Operation failed,” and the agent retries three times before apologizing vaguely. What should the tool return?",
    options: [
      { t: "Return <code>isError</code> with a transient category and <code>isRetryable: true</code>.", why: "Right for transient faults. A policy limit won't change on retry." },
      { t: "Return <code>isError</code> with a business-rule category and a message the agent can relay.", ok: true, why: "A business-rule error tells the agent not to retry, and gives it something to explain to the customer." },
      { t: "Return a successful result with an empty list, noting that nothing matched.", why: "Right when a search finds nothing. The refund was refused." },
      { t: "Return <code>isError</code> with a permission category so the agent hands off to staff.", why: "Right when credentials don't allow the action. This is a policy decision." }
    ]
  },
  {
    id: "p1-8", ts: "2.2", scenario: 1, family: "F43",
    stem: "The agent passes order numbers like “#A-1234,” but the tool expects “A1234.” The tool returns “Error,” and the agent keeps retrying with the same input. What should the tool return?",
    options: [
      { t: "Mark the error as transient and retryable so the agent tries again.", why: "Right for transient faults. Retrying the same input fails the same way." },
      { t: "Return a validation error naming the field and the format it expects.", ok: true, why: "Naming the field and the expected format lets the agent fix its input." },
      { t: "Return a business-rule error that names the policy blocking the action.", why: "Right when a policy blocks the action. This is an input format problem." },
      { t: "Return a permission error so the agent passes the request to staff with access.", why: "Right when access is denied. This is an input format problem." }
    ]
  },
  {
    id: "p3-6", ts: "2.2", scenario: 3, family: "F44",
    stem: "An archive's API is down for maintenance for the next hour. After its retries fail, the subagent reports only “search failed,” and the coordinator can't decide whether to wait or use another source. What fits best?",
    options: [
      { t: "Have the subagent retry transient failures itself and report only what it can't resolve.", why: "Right for brief, transient errors. Retries have already failed." },
      { t: "Return the error to the coordinator with the query, what was tried and any partial results.", ok: true, why: "With the details and partial results, the coordinator can choose a sensible alternative." },
      { t: "Return an empty result marked as a successful search with no matches.", why: "That would hide a real failure as an empty search." },
      { t: "Return a permission error so the coordinator stops using that source.", why: "Right when credentials are refused. This source will return within the hour." }
    ]
  },
  {
    id: "p4-5", ts: "2.2", scenario: 4, family: "F45",
    stem: "When a tool's date argument is malformed, the server returns a JSON-RPC error. Claude never sees what went wrong, so it can't correct the call. What should the tool do?",
    options: [
      { t: "Return a tool result with <code>isError: true</code> and a message saying what to fix.", ok: true, why: "Under the current MCP spec, input-validation errors go back as tool results the model can read and act on." },
      { t: "Return an empty result set as a success when the query matches nothing.", why: "Right when the query matches nothing. Here the input is invalid." },
      { t: "Mark rate-limit failures as retryable so the client waits and tries again.", why: "Right for rate limits. Here the input is invalid." },
      { t: "Return a JSON-RPC protocol error for a malformed request, such as an unknown tool.", why: "That's the current behavior, and the model never sees it." }
    ]
  },
  {
    id: "p1-7", ts: "2.3", scenario: 1, family: "F46",
    stem: "The support agent has 22 tools across billing, shipping and returns, and it often picks the wrong one. What fixes this?",
    options: [
      { t: "Give each agent only the 4–5 tools its role needs.", ok: true, why: "Fewer, role-specific tools make selection reliable." },
      { t: "Set <code>tool_choice</code> to <code>\"auto\"</code> so Claude can reply in text when no tool is needed.", why: "Right when tool calls are forced unnecessarily. Here the problem is choice overload." },
      { t: "Set <code>tool_choice</code> to <code>\"any\"</code> so Claude must call one of the tools.", why: "Right when output must be structured. It doesn't help choose among 22." },
      { t: "Give the agent one narrow lookup tool from another role, not that role's full toolset.", why: "Right for one cross-role capability. Here the toolset is already too large." }
    ]
  },
  {
    id: "p3-7", ts: "2.3", scenario: 3, family: "F47",
    stem: "Synthesis sometimes needs a deeper follow-up investigation, involving several searches. The team wants the coordinator to keep track of all research done. What fits best?",
    options: [
      { t: "Give the synthesis agent a narrow <code>verify_fact</code> tool for quick checks.", why: "Right for quick single-fact checks. This is real research the coordinator should track." },
      { t: "Send verification requests back through the coordinator to the search agent.", ok: true, why: "Routing through the coordinator keeps it aware of all research and able to plan." },
      { t: "Remove the web-search tools from the document-analysis subagent.", why: "Right when an agent strays outside its role. Here the coordinator needs visibility." },
      { t: "Force the citation-formatting tool on the synthesis agent's final step.", why: "Right for formatting. This is about research flow." }
    ]
  },
  {
    id: "p3-8", ts: "2.1", scenario: 3, family: "F48",
    stem: "The agent calls <code>search_papers</code> with full sentences, but the tool expects keyword queries plus a year range such as “2020-2024.” What fixes this?",
    options: [
      { t: "State each tool's scope in its description, and when to use the other.", why: "Right when tools get confused with each other. Here the right tool gets the wrong input." },
      { t: "Rename the tools so that each name states what the tool is for.", why: "Right when names mislead. The tool is chosen correctly." },
      { t: "Add examples of the expected input format to the tool's description.", ok: true, why: "Showing the expected input format in the description fixes how the tool is called." },
      { t: "Split the generic tool into separate tools, each with one narrow purpose.", why: "Right when one tool does several jobs. This one does one." }
    ]
  },
  {
    id: "p4-1", ts: "2.4", scenario: 4, family: "F49",
    stem: "A developer wants an experimental MCP server available in every project they work on, without teammates getting it. What fits best?",
    options: [
      { t: "Add the server to the project's <code>.mcp.json</code> and commit it.", why: "Right for team-wide servers. This would push it on teammates." },
      { t: "Add the server in user scope so it's available in all of one person's projects.", ok: true, why: "User scope follows one person across projects and isn't shared." },
      { t: "Reference the token as <code>${GITHUB_TOKEN}</code> in <code>.mcp.json</code> instead of pasting it in.", why: "Right for keeping secrets out of the file. This is about who gets the server." },
      { t: "Use the maintained community GitHub server rather than building a custom one.", why: "Right for standard integrations. This is about where it's configured." }
    ]
  },
  {
    id: "p4-2", ts: "2.4", scenario: 4, family: "F50",
    stem: "Before every task, Claude runs dozens of exploratory search calls just to find out which internal docs exist. What fits best?",
    options: [
      { t: "Expose the documentation catalog as MCP resources.", ok: true, why: "Resources let the client see what content is available without exploratory tool calls." },
      { t: "Build a custom MCP server for the team's in-house deployment system.", why: "Right when no server exists for an in-house system. Here Claude needs a catalog." },
      { t: "Use an existing, maintained community server for the standard integration.", why: "Right for standard integrations. Here Claude needs a catalog." },
      { t: "Add the server to the project's <code>.mcp.json</code> so everyone gets it.", why: "Right for sharing a server. Here Claude needs a catalog." }
    ]
  },
  {
    id: "p4-4", ts: "2.4", scenario: 4, family: "F51",
    stem: "A new developer clones the repository and doesn't get the team's database MCP server, which everyone else uses. What fixes this?",
    options: [
      { t: "Commit the server configuration to the project's <code>.mcp.json</code>.", ok: true, why: "Project scope is shared through the repository." },
      { t: "Keep the server in local scope, for this one developer and this one project.", why: "Right for a personal server. Here the team needs to share it." },
      { t: "Rewrite the MCP tool's description to say when it beats the built-ins.", why: "Right when Claude won't pick the tool. Here the server isn't there at all." },
      { t: "Expose the read-only reference data as MCP resources rather than tools.", why: "Right for browsable content. Here the server isn't there at all." }
    ]
  },
  {
    id: "p4-3", ts: "2.5", scenario: 4, family: "F52",
    stem: "Claude needs to find every caller of <code>parseConfig</code> across the codebase. Which tool fits best?",
    options: [
      { t: "Use Grep to search file contents for the function name.", ok: true, why: "Searching file contents is how you find every call site." },
      { t: "Use Glob to find files by a name pattern such as <code>**/*.test.ts</code>.", why: "Right for finding files by name. Callers are found by content." },
      { t: "Use Edit with a longer anchor that appears only once in the file.", why: "Right for making an edit. This is a search." },
      { t: "Read the whole file and write back the full corrected version.", why: "Right for a non-unique edit. This is a search." }
    ]
  },
  {
    id: "p1-9", ts: "5.2", scenario: 1, family: "F53",
    stem: "A customer signed “J. Smith” asks about “my order,” and the lookup returns three customers with that name. What should the agent do?",
    options: [
      { t: "Hand off to a human when the customer explicitly asks for one.", why: "Right when a person is requested. Nobody asked for one." },
      { t: "Ask a clarifying question when the request matches more than one account.", ok: true, why: "With several matches, ask for an identifier instead of guessing." },
      { t: "Escalate when the request falls outside what the documented policy covers.", why: "Right for gaps in the policy. This is an identification problem." },
      { t: "Resolve it directly when it's within policy, even if the customer is upset.", why: "Right for in-policy requests. First the agent needs to know whose order it is." }
    ]
  },
  {
    id: "p1-10", ts: "5.1", scenario: 1, family: "F54",
    stem: "Each order lookup returns 40 fields, and the agent uses about 5 of them. Long chats hit the context limit. What fixes this?",
    options: [
      { t: "Keep a case-facts block with amounts, dates and order numbers, re-sent every turn.", why: "Right for keeping exact facts. Here the problem is bloat." },
      { t: "Trim each tool result down to the few fields the agent actually uses.", ok: true, why: "Cut tool output to what matters, before it accumulates in the context." },
      { t: "Summarize the earlier part of the conversation once it gets long.", why: "Right for long conversational history. The bloat here is tool output." },
      { t: "Place the key findings at the start of the input, not buried in the middle.", why: "Right when findings get lost in the middle. Here the problem is volume." }
    ]
  },
  {
    id: "p2-8", ts: "5.4", scenario: 2, family: "F55",
    stem: "Before starting a feature, Claude must survey 200 files to find where configuration is loaded. The survey output would fill the session. What fits best?",
    options: [
      { t: "Delegate the exploration to a subagent and keep only its summary.", ok: true, why: "A subagent explores in its own context and returns only what matters." },
      { t: "Have Claude write key findings to a scratchpad file it can reread later.", why: "Right for preserving findings over a long session. The issue here is the volume of exploration." },
      { t: "Run <code>/compact</code> once the session gets long.", why: "Right once a session gets long. Here the overload hasn't happened yet." },
      { t: "Start a fresh session seeded with a summary of the decisions so far.", why: "Right when earlier context is stale. There's no earlier context here." }
    ]
  },
  {
    id: "p2-9", ts: "5.4", scenario: 2, family: "F56",
    stem: "A developer wants a summary of how authentication works across 15 services, and wants the main session kept free for the implementation that follows. What fits best?",
    options: [
      { t: "Grep for the symbol first and read only the files that match.", why: "Right for a targeted search. This is a broad survey." },
      { t: "Have Claude record its findings in a scratchpad file as it goes.", why: "Right for preserving findings. The survey would still fill the main context." },
      { t: "Delegate the investigation to a subagent and keep only its summary.", ok: true, why: "A broad survey in a separate context returns only the summary." },
      { t: "Run <code>/compact</code> after the investigation to free up space.", why: "Right once a session is long. It's better not to fill it in the first place." }
    ]
  },
  {
    id: "p3-9", ts: "5.6", scenario: 3, family: "F57",
    stem: "The final report states figures without any indication of where each came from, so editors can't check them. What fits best?",
    options: [
      { t: "Keep claim-to-source mappings through synthesis, with each source's date.", ok: true, why: "Carry the source, and its date, with every claim so it can be traced." },
      { t: "Report conflicting figures side by side with their sources instead of picking one.", why: "Right when sources disagree. Here attribution is missing." },
      { t: "Label which findings are well established and which are contested.", why: "Right for marking certainty. Editors still couldn't trace the figures." },
      { t: "Have the synthesis agent re-check each claim against its cited source.", why: "Right when synthesis distorts claims. Here attribution is missing." }
    ]
  },
  {
    id: "p6-10", ts: "5.6", scenario: 6, family: "F58",
    stem: "Auditors ask where a figure in the summary came from, and nobody can tell without re-reading every document. What fits best?",
    options: [
      { t: "Store each value with its document, page and the quoted source text.", ok: true, why: "Store provenance with each value so it can be traced instantly." },
      { t: "Keep both values and flag the conflict for review, instead of choosing one.", why: "Right when values conflict. Here the problem is traceability." },
      { t: "Record the document version and date alongside each extracted value.", why: "Right when versions matter. The location still wouldn't be recorded." },
      { t: "Route low-confidence values to a person for review.", why: "Right for uncertain values. Here the problem is traceability." }
    ]
  },
  {
    id: "p3-10", ts: "5.3", scenario: 3, family: "F59",
    stem: "A subagent returns “no relevant sources” both when a search found nothing and when the search API crashed, and the coordinator treats both the same way. What fits best?",
    options: [
      { t: "Have the subagent retry transient errors locally before reporting.", why: "Right for transient faults. The coordinator still can't tell the two cases apart." },
      { t: "Report the failure type, the query and any partial results to the coordinator.", why: "Right for failure details. First the two outcomes must be told apart." },
      { t: "Continue with the other subagents and mark the gap in the final report.", why: "Right when a failure is known. Here failures are disguised as empty results." },
      { t: "Distinguish “no results found” from “search failed” in what subagents return.", ok: true, why: "An empty result and a failure need different handling, so they must look different." }
    ]
  },
  {
    id: "p6-9", ts: "5.5", scenario: 6, family: "F60",
    stem: "The model reports a confidence for each field. The team wants to route review by it, but nobody knows what 0.8 actually means for accuracy. What should happen first?",
    options: [
      { t: "Calibrate the confidence threshold on a labeled sample before relying on it.", ok: true, why: "Measure how confidence relates to accuracy on labeled data before acting on it." },
      { t: "Keep sampling high-confidence extractions for ongoing spot checks.", why: "Right after routing is in place. First the scores need meaning." },
      { t: "Route fields below the confidence threshold to human review.", why: "That relies on the threshold before anyone knows what it means." },
      { t: "Break accuracy down by document type and field, not just overall.", why: "Right for finding weak segments. Here the confidence scale itself is unknown." }
    ]
  }
];
