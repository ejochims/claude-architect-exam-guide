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
    id: "b4-3", ts: "1.5", scenario: 4,
    stem: "A developer-productivity agent built on the Agent SDK must never run <code>git push --force</code> against protected branches. What's the right mechanism?",
    options: [
      { t: "A <code>PreToolUse</code> hook on Bash that denies the command and names the safe alternative.", ok: true, why: "Tool-call interception enforces the rule every time and tells the agent what to do instead." },
      { t: "A line in CLAUDE.md that forbids force pushes to protected branches.", trap: "T1", why: "Instructions are followed probabilistically. A destructive action needs a guarantee." },
      { t: "Remove Bash from the agent's tool list, so it can't run <code>git push</code> or any other shell command.", why: "Blocks the legitimate shell work the agent needs. The rule is narrow, so the control should be too." },
      { t: "Have the agent ask the developer to confirm every <code>git</code> command, showing the exact branch and flags first.", trap: "T1", why: "Still prompt-based, and adds friction to every harmless git command." }
    ]
  },
  {
    id: "b4-4", ts: "1.5", scenario: 4,
    stem: "Three MCP servers report file sizes as raw bytes, “4.2 MB” strings and kibibytes. The agent's cleanup recommendations are often off by orders of magnitude. Best fix?",
    options: [
      { t: "Add a <code>PostToolUse</code> hook that normalizes every size to bytes before the agent sees any of the results.", ok: true, why: "Normalize heterogeneous formats in code before the model reasons about them." },
      { t: "Describe the three size formats and their conversion rules in the system prompt.", trap: "T1", why: "The model still converts on every read, and probabilistic arithmetic occasionally fails." },
      { t: "Add a <code>size_unit</code> field to each server's output so the agent knows how to read each value.", why: "Labels the units but still leaves the conversion to the model every time." },
      { t: "Ask the agent to double-check its unit conversions before recommending any deletion.", trap: "T9", why: "An exhortation adds no information or structure. Remove the conversion step instead." }
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
    id: "b4-6", ts: "1.3", scenario: 4,
    stem: "An “explorer” subagent meant only to map unfamiliar code occasionally edits files while investigating. Where should you fix this?",
    options: [
      { t: "Give its AgentDefinition only read-only tools.", ok: true, why: "Scope the subagent's tools to its role (Read, Grep, Glob). It can't edit what it has no tool to edit." },
      { t: "State in its system prompt that it must never modify files while investigating.", trap: "T1", why: "A prompt lowers the rate but doesn't guarantee it." },
      { t: "Add a <code>PostToolUse</code> hook that runs <code>git checkout</code> on any file the explorer edits, reverting it.", why: "Undoes the damage after the fact. Removing the capability prevents it." },
      { t: "Have the coordinator review the explorer's diff after each run, and discard any edits it made.", trap: "T7", why: "Detects the problem after it happens, and puts the fix in the wrong component." }
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
    id: "b4-8", ts: "1.6", scenario: 4,
    stem: "The agent must generate CRUD boilerplate (model, controller, tests, docs) for 30 similar entities that follow an established pattern. Which decomposition fits?",
    options: [
      { t: "Prompt chaining: the same fixed sequence of generation steps, run once for each entity.", ok: true, why: "A predictable, repeated pattern suits a fixed pipeline." },
      { t: "Dynamic decomposition that re-plans after each entity based on what it learned.", why: "Re-planning suits open-ended work. Here the pattern is already established." },
      { t: "Generate all 30 entities in one large request so the outputs stay consistent.", trap: "T3", why: "A huge single output degrades in quality and is hard to verify or retry piece by piece." },
      { t: "Have a coordinator decide, for each entity, which files to generate and in what order.", why: "Adds judgment where none is needed. The files and their order are the same every time." }
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
    id: "b1-1", ts: "1.4", scenario: 1,
    stem: "A prerequisite gate now blocks <code>update_payment_method</code> until <code>verify_identity</code> succeeds. When it blocks a call, it returns the text “Error.” Logs show the agent retrying the same blocked call several times before giving up. What should the gate return?",
    options: [
      { t: "A structured result saying the call was blocked because identity isn't verified, and to call <code>verify_identity</code> first.", ok: true, why: "Tell the agent what failed and what to do next, so it can recover instead of retrying blindly." },
      { t: "A <code>success</code> result with <code>changed: false</code>, so the conversation continues without surfacing an error.", trap: "T6", why: "Hiding the block makes the agent believe the update happened." },
      { t: "Keep returning “Error,” and escalate the conversation to a human whenever the gate blocks a call.", why: "Over-escalation. The agent can recover on its own if it knows why it was blocked." },
      { t: "Leave the gate as is, and add a system-prompt line telling the agent to verify identity first so it rarely triggers.", trap: "T1", why: "Doesn't change what the gate returns, so the agent still can't recover when it does trigger." }
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
    id: "b7-7", ts: "1.6", scenario: 6,
    stem: "An agent extracts 40 fields from 300-page loan packages that bundle an application, appraisals, tax returns and disclosures. Fields from documents deep in the package are often missed. What decomposition helps most?",
    options: [
      { t: "Split the package into its component documents, run a focused extraction per document type, then merge with a reconciliation step.", ok: true, why: "Decompose by document so each pass has a small, relevant context, then reconcile." },
      { t: "Use a model with a larger context window so the whole package fits with room to spare.", trap: "T3", why: "It already fits; attention to buried sections is the problem." },
      { t: "List all 40 fields twice in the prompt, once at the start and once at the end.", trap: "T9", why: "Repetition doesn't help the model find content deep in a long input." },
      { t: "Extract only from the first 50 pages, where most required fields usually appear.", why: "Drops the appraisals and tax returns that hold many of the fields." }
    ]
  },
  {
    id: "b7-8", ts: "1.6", scenario: 5,
    stem: "A CI agent told to “fix all failing tests” (37 failures across 9 modules) thrashes: a fix in one module breaks tests in another, and runs time out. How should the work be decomposed?",
    options: [
      { t: "Spawn one subagent per failing test so all 37 are fixed in parallel.", trap: "T5", why: "Parallel edits to shared code conflict, which is the thrashing you're seeing." },
      { t: "Fix failures in the order the test runner reports them, re-running the suite after each.", why: "Report order ignores shared causes, so related fixes still fight each other." },
      { t: "Group the failures by root cause first, then fix one cause at a time, re-running the suite after each.", ok: true, why: "Diagnose before decomposing; many failures share a cause." },
      { t: "Ask Claude to be careful not to break other tests while fixing each one.", trap: "T9", why: "An exhortation doesn't reveal which failures are related." }
    ]
  },
  {
    id: "b7-9", ts: "1.6", scenario: 1,
    stem: "Every return request follows the same four steps: verify identity, check eligibility, create the RMA, send the shipping label. Which decomposition fits best?",
    options: [
      { t: "Dynamic decomposition, letting the agent plan the steps anew for each request.", why: "Adaptive planning suits open-ended work; this sequence never varies." },
      { t: "A fixed sequence (prompt chaining), since the steps and their order are always the same.", ok: true, why: "Predictable multi-step workflows suit a fixed pipeline." },
      { t: "A coordinator with four subagents, one per step, so each step has isolated context.", trap: "T2", why: "Orchestration overhead for a short, linear workflow." },
      { t: "Give the agent all four tools and let it decide the order from the conversation.", why: "Leaves ordering to chance when the order is fixed and known." }
    ]
  },
  {
    id: "b7-10", ts: "1.2", scenario: 3,
    stem: "To save a hop, a teammate proposes letting the search subagent send its results straight to the synthesis subagent, bypassing the coordinator. What's the main cost?",
    options: [
      { t: "None of note: fewer hops means lower latency and fewer tokens spent on routing.", why: "Ignores what the coordinator does with results besides forwarding them." },
      { t: "Subagents can't communicate with each other at all, so the change wouldn't work.", trap: "T8", why: "It could be built; the question is whether it should be." },
      { t: "The coordinator loses sight of coverage, errors and what synthesis receives, so it can't spot gaps or re-delegate.", ok: true, why: "Hub-and-spoke routing gives the coordinator the observability and control it needs." },
      { t: "Synthesis would receive results in a different order, which breaks citation numbering.", why: "Ordering is minor and fixable; losing coordination isn't." }
    ]
  },
  {
    id: "b7-11", ts: "1.2", scenario: 3,
    stem: "For “context,” the coordinator passes every subagent the user's full 30-turn conversation. Subagents get distracted by side topics and run slowly. What should the coordinator pass instead?",
    options: [
      { t: "A summary of the 30 turns, sent to every subagent so each still has the full picture.", why: "Smaller, but every subagent still gets everything rather than what its task needs." },
      { t: "Only each subagent's specific goal, constraints and relevant prior findings.", ok: true, why: "Scope each subagent's context to its task; isolation is the point of subagents." },
      { t: "The full conversation, with an instruction to ignore turns unrelated to its task.", trap: "T9", why: "Irrelevant context still costs tokens and attention." },
      { t: "The full conversation, with subagents moved to a larger context window.", trap: "T3", why: "Room isn't the problem; focus is." }
    ]
  },
  {
    id: "b7-12", ts: "1.7", scenario: 5,
    stem: "A CI review step runs <code>claude -p --output-format json</code>. A later step should apply the suggested fixes with the full context of that review. How do you carry the context over?",
    options: [
      { t: "Read <code>session_id</code> from the first step's JSON output and run the second step with <code>--resume</code> and that ID.", ok: true, why: "Resuming the specific session gives the second step the review's full context." },
      { t: "Run the second step with <code>--continue</code>, which picks up the review automatically.", why: "<code>--continue</code> takes the most recent session in that directory, which isn't guaranteed to be this one in CI." },
      { t: "Re-run the review inside the fix step so it rebuilds the same context first.", why: "Pays for the review twice and may not reproduce the same findings." },
      { t: "Combine review and fix into one prompt so no context needs to carry over.", why: "Loses the separate review step, and its output, that the pipeline relies on." }
    ]
  },
  {
    id: "b7-13", ts: "1.7", scenario: 4,
    stem: "You resume yesterday's investigation session. Since then a teammate changed 3 of the 40 files Claude analyzed; the rest are untouched. What's the most efficient reliable approach?",
    options: [
      { t: "Start a new session and inject a structured summary of yesterday's findings.", why: "Reasonable when most results are stale; here 37 of 40 files are still accurate." },
      { t: "Resume and tell Claude which 3 files changed, so it re-reads only those.", ok: true, why: "Targeted re-analysis keeps the valid context and refreshes only what changed." },
      { t: "Resume and continue as before, since most of the earlier analysis still holds.", why: "Claude would reason from stale results for the 3 changed files." },
      { t: "Resume and run <code>/compact</code> so the stale details are summarized away.", why: "Compaction summarizes stale results; it doesn't refresh them." }
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
    id: "b7-15", ts: "1.4", scenario: 1,
    stem: "Refunds over $500 need a manager's approval. The agent correctly routes them for approval, but sometimes tells customers “your refund is on its way” before anyone approves it. Best fix?",
    options: [
      { t: "Add few-shot examples of correct wording for refunds that are still pending approval.", trap: "T1", why: "Improves wording on average; the agent still doesn't know the refund's real state." },
      { t: "Have the approval step return an explicit <code>pending_approval</code> status the agent must relay, instead of a generic success.", ok: true, why: "Make the workflow state explicit in what the code returns, so the agent's message matches reality." },
      { t: "Add “never confirm refunds over $500” to the system prompt, in bold.", trap: "T1", why: "Probabilistic, and the agent still can't tell pending from processed." },
      { t: "Audit transcripts weekly and coach the prompt whenever a premature promise appears.", why: "Detects after customers were misinformed." }
    ]
  },
  {
    id: "b7-16", ts: "1.4", scenario: 5,
    stem: "When the CI agent can't fix a failing test, it posts “Could not fix this test” on the PR, and engineers start their investigation from scratch. What should it post instead?",
    options: [
      { t: "The full agent transcript as an attachment, so engineers can see everything it tried.", why: "Complete but slow to read; the key facts should come first." },
      { t: "A structured handoff: the test, the failure, its root-cause hypothesis, what it tried, files touched and a suggested next step.", ok: true, why: "A structured summary lets the engineer continue rather than restart." },
      { t: "A shorter, friendlier message that tags the code owner for the failing module.", why: "Routes the problem but transfers none of the investigation." },
      { t: "Nothing; retry the fix on the next commit, since the agent may succeed with fresh code.", trap: "T6", why: "Hides the failure and wastes runs." }
    ]
  },
  {
    id: "b7-17", ts: "1.3", scenario: 4,
    stem: "A coordinator delegates “review PR 4812” to a reviewer subagent, passing only the PR number. The reviewer spends most of its budget re-fetching the diff, CI logs and the linked issue, all of which the coordinator already loaded. Fix?",
    options: [
      { t: "Pass all the gathered context (the diff, a CI summary and the issue's requirements) in the delegation prompt.", ok: true, why: "Subagents only know what they're given; pass what's already been gathered." },
      { t: "Raise the reviewer's turn limit so it has budget left for the review after fetching.", why: "Pays for duplicated work instead of removing it." },
      { t: "Let the reviewer read the coordinator's conversation history directly.", trap: "T8", why: "Subagent contexts are isolated; the coordinator must pass context explicitly." },
      { t: "Have the coordinator do the review itself, since it already has the context.", why: "Gives up the focused, isolated reviewer context the subagent provides." }
    ]
  },
  {
    id: "b7-18", ts: "1.5", scenario: 5,
    stem: "In CI, the agent must never edit migration files under <code>db/migrations/</code> that have already been applied. It occasionally does while fixing schema-related test failures. What's the right mechanism?",
    options: [
      { t: "A rule in CLAUDE.md stating that applied migrations must never be edited.", trap: "T1", why: "Followed most of the time; an irreversible change needs a guarantee." },
      { t: "Make the entire repository read-only during the CI job.", why: "Blocks the legitimate fixes the job exists to make." },
      { t: "A <code>PreToolUse</code> hook on Edit and Write that denies changes to applied migrations and explains why.", ok: true, why: "Interception enforces the rule every time and tells the agent what to do instead." },
      { t: "A post-run check that fails the job if any applied migration was modified.", why: "Catches it after the run; the agent wasted its work and never learned the constraint." }
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
      { t: "Raise <code>max_tokens</code>, and continue the turn when <code>stop_reason</code> is <code>max_tokens</code>.", why: "Right when replies are truncated. Nothing was cut off here; a tool failed." }
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
    stem: "When a search subagent finds nothing for one subtopic, the coordinator quietly drops it, and the report has a hole nobody notices. What change fits best?",
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
  }
];
