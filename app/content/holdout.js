// Sequestered Readiness Check items: never shown in lessons, drills or mocks. Take the check once, cold.
window.BANK = window.BANK || [];
window.BANK.push(
  {
    id: "h1-1", ts: "1.1", scenario: 1, holdout: true,
    stem: "When any tool returns an error, the support agent's loop exits and the agent replies “I couldn't complete that.” In many of these cases an alternative tool could have answered the request. What should change?",
    options: [
      { t: "Retry the failed tool three times in code with backoff, then exit if it still fails.", trap: "T6", why: "Helps transient errors only; Claude still never sees the failure or gets to choose another path." },
      { t: "Tell Claude in the system prompt to try another tool whenever one fails.", trap: "T1", why: "Claude never sees the error, because the loop exits first." },
      { t: "Return the error to Claude as a <code>tool_result</code> with <code>is_error</code> set, and keep the loop running.", ok: true, why: "Errors are information: send them back so the model can reason about the next step." },
      { t: "Set <code>tool_choice</code> to <code>\"any\"</code> after an error so Claude must call some other tool.", why: "Forces a call without telling Claude what failed or why." }
    ]
  },
  {
    id: "h1-2", ts: "1.4", scenario: 1, holdout: true,
    stem: "A code gate blocks account changes until <code>verify_identity</code> succeeds. Customers now complain they're asked to verify three times in one chat, because the gate checks only the latest turn. Best fix?",
    options: [
      { t: "Track verification in session state and have the gate check it.", ok: true, why: "Keep the guarantee in code, and give the gate the state it needs to decide." },
      { t: "Remove the gate for customers who have chatted before, since they're probably verified.", why: "“Probably” replaces a guarantee with a guess." },
      { t: "Tell the agent to remember when a customer has already verified in this conversation.", trap: "T9", why: "The gate, not the agent's memory, is what blocks the call." },
      { t: "Add few-shot examples where the agent skips re-verification for customers it already verified.", trap: "T1", why: "The gate would still block the call; prompt changes don't alter what code checks." }
    ]
  },
  {
    id: "h1-3", ts: "1.5", scenario: 1, holdout: true,
    stem: "A <code>PostToolUse</code> hook removes card numbers from tool results so the agent can't repeat them. Now the agent can't confirm “the card ending 4242” when customers ask which card was charged. Best fix?",
    options: [
      { t: "Remove the hook and instruct the agent never to repeat full card numbers.", trap: "T1", why: "Swaps a guarantee for a probabilistic instruction on a compliance rule." },
      { t: "Change the hook to mask numbers to the last four digits instead of removing them.", ok: true, why: "Normalize to exactly what's safe and needed; the guarantee stays in code." },
      { t: "Skip the hook for customers who have passed identity verification in this session.", why: "Verification doesn't make it acceptable for the model to hold full card numbers." },
      { t: "Move the redaction into a <code>PreToolUse</code> hook so it runs before the lookup.", why: "Card numbers arrive in the result; a pre-call hook runs before they exist." }
    ]
  },
  {
    id: "h1-4", ts: "1.6", scenario: 1, holdout: true,
    stem: "Customers often send one message with three or four requests. The agent resolves the first and forgets the rest, so customers write back. What design helps most?",
    options: [
      { t: "Ask customers to send one request per message so each can be handled separately.", why: "Pushes the agent's job onto the customer." },
      { t: "Escalate any message containing more than two requests to a human agent.", why: "Several simple requests aren't a reason to escalate." },
      { t: "Move to a larger model that tracks several requests at once more reliably.", trap: "T3", why: "Without a list to work from, any model can drop items." },
      { t: "Extract a checklist of the requests and track every one to a single combined reply.", ok: true, why: "Decompose the message into tracked items, then synthesize one answer." }
    ]
  },
  {
    id: "h1-5", ts: "1.4", scenario: 1, holdout: true,
    stem: "Returns require an RMA and then a shipping label. In about 4% of cases the agent creates the RMA, tells the customer they're all set, and ends the conversation without sending the label. Most reliable fix?",
    options: [
      { t: "Have <code>close_case</code> refuse while any required step such as the label is incomplete.", ok: true, why: "Enforce the workflow's completion condition in code and tell the agent what's left." },
      { t: "Add a bold reminder to the system prompt that every RMA must be followed by a label.", trap: "T1", why: "Lowers the 4% but can't guarantee it." },
      { t: "Combine RMA creation and label sending into one tool so they can't be separated.", why: "Works only if the label never needs separate handling; it removes the step the agent may need to retry alone." },
      { t: "Send a follow-up email with the label automatically 24 hours after every RMA.", why: "Delays the label for everyone to patch a 4% failure." }
    ]
  },
  {
    id: "h1-6", ts: "2.2", scenario: 1, holdout: true,
    stem: "<code>get_order</code> searches only the EU database. For a US order number it returns <code>{\"status\": \"not_found\"}</code> as a normal result, and the agent tells US customers their order doesn't exist. Best fix?",
    options: [
      { t: "Have the agent ask every customer which region they ordered from before looking anything up.", why: "Adds friction for everyone to work around a vague tool result." },
      { t: "Return a structured error saying which region the ID belongs to.", ok: true, why: "Distinguish “doesn't exist” from “not here”, and give the agent a next step." },
      { t: "Retry <code>get_order</code> twice before concluding the order doesn't exist.", trap: "T6", why: "The same database gives the same answer." },
      { t: "Tell the agent that <code>not_found</code> may mean the order is in another region.", trap: "T1", why: "Leaves the agent guessing between two very different situations." }
    ]
  },
  {
    id: "h1-7", ts: "2.3", scenario: 1, holdout: true,
    stem: "The support agent connects to the company's CRM MCP server, which exposes 40 tools. The agent needs about 5 of them, and logs show frequent calls to similar-sounding tools it shouldn't use. What should you do?",
    options: [
      { t: "Rewrite all 40 tool descriptions so the agent can tell the similar ones apart.", why: "Better descriptions help, but 35 tools the agent never needs still compete for selection." },
      { t: "Restrict the agent's available tools to the 5 its role requires.", ok: true, why: "Fewer, role-relevant tools improve selection." },
      { t: "Add a system-prompt list of the 5 tools the agent should prefer.", trap: "T1", why: "The other 35 remain available and keep getting picked." },
      { t: "Ask the CRM team to merge their 40 tools into a few broader ones.", trap: "T5", why: "Changes a shared server for one agent, and vaguer tools don't help selection." }
    ]
  },
  {
    id: "h1-8", ts: "2.2", scenario: 1, holdout: true,
    stem: "During a sale, the payment provider returns HTTP 429 (rate limited) with a <code>Retry-After</code> of 20 seconds. <code>process_refund</code> reports “refund failed,” and the agent tells customers to try again tomorrow. Best fix?",
    options: [
      { t: "A transient, retryable error carrying the retry-after time.", ok: true, why: "Classify the failure and pass its recovery details." },
      { t: "Return a permission error, since the provider refused the request.", why: "Misclassifies a temporary throttle as a lasting denial." },
      { t: "Return success and queue the refund silently for a later attempt.", trap: "T6", why: "The customer is told it worked when it hasn't yet." },
      { t: "Escalate every refund that hits a rate limit to a human agent.", why: "Humans can't make the provider respond faster; a short wait fixes it." }
    ]
  },
  {
    id: "h1-9", ts: "5.2", scenario: 1, holdout: true,
    stem: "A customer asks to transfer their loyalty points to their spouse's account. Policy covers points earning, expiry and redemption, but says nothing about transfers. What should the agent do?",
    options: [
      { t: "Decline the transfer, since it isn't listed among the actions the policy allows.", why: "Silence in policy isn't a prohibition; a human should decide." },
      { t: "Extend the points' expiry instead, which the policy does cover, and explain why.", why: "Answers a different request than the one the customer made." },
      { t: "Escalate, because policy is silent on this specific request.", ok: true, why: "A policy gap is a valid escalation trigger." },
      { t: "Make the transfer, since both accounts share a household address.", why: "Improvises policy the agent isn't authorized to set." }
    ]
  },
  {
    id: "h1-10", ts: "5.1", scenario: 1, holdout: true,
    stem: "Early in a long chat, a customer says “email only, please don't call me.” Forty turns later, after the history has been summarized twice, the agent offers to “have someone call you.” Best fix?",
    options: [
      { t: "Instruct the summarizer to keep any contact preferences it finds in each summary.", trap: "T9", why: "Summaries still compress and drift; durable facts need their own place." },
      { t: "Keep customer preferences in a persistent case-facts section outside the summarized history.", ok: true, why: "Facts outside the summary survive summarization." },
      { t: "Stop summarizing and send the full 40-turn transcript every turn.", trap: "T3", why: "Costly, and details can still get lost in the middle." },
      { t: "Ask the customer to restate their contact preference before offering any follow-up.", why: "Makes the customer repeat themselves to work around the agent's memory." }
    ]
  },
  {
    id: "h2-1", ts: "3.1", scenario: 2, holdout: true,
    stem: "The root CLAUDE.md says “write tests with Jest.” One package, <code>packages/billing</code>, has migrated to Vitest, but Claude keeps writing Jest tests there. Best fix?",
    options: [
      { t: "Add <code>packages/billing/CLAUDE.md</code> stating that this package uses Vitest.", ok: true, why: "A nested CLAUDE.md applies when Claude works in that package, refining the general rule." },
      { t: "Change the root CLAUDE.md to say “use Jest or Vitest, whichever fits.”", why: "Makes the rule vaguer for every package without saying which one uses which." },
      { t: "Add a rule with <code>paths: [\"**/*.test.ts\"]</code> that says to use Vitest.", why: "Applies to test files in every package, including the ones still on Jest." },
      { t: "Remind Claude at the start of each session in that package.", why: "Manual, and easy to forget." }
    ]
  },
  {
    id: "h2-2", ts: "3.2", scenario: 2, holdout: true,
    stem: "A <code>/gen-migration</code> skill reads many schema files, producing thousands of lines of exploration, and needs a migration name. Developers want the main conversation kept clean and a hint about the name. Which frontmatter fits?",
    options: [
      { t: "<code>allowed-tools: Read</code> and <code>argument-hint: \"[migration-name]\"</code>", why: "Limits tools but still runs the exploration in the main conversation." },
      { t: "<code>context: fork</code> and <code>argument-hint: \"[migration-name]\"</code>", ok: true, why: "Fork isolates the verbose work; the hint documents the expected argument." },
      { t: "<code>context: fork</code> and <code>allowed-tools: Read</code>", why: "Isolates the work but says nothing about the name it expects." },
      { t: "<code>argument-hint: \"[migration-name]\"</code> and <code>quiet: true</code>", trap: "T8", why: "<code>quiet</code> isn't a skill frontmatter field." }
    ]
  },
  {
    id: "h2-3", ts: "3.2", scenario: 2, holdout: true,
    stem: "A 15-step weekly release procedure was added to CLAUDE.md. Sessions now load it every time, and Claude occasionally starts release steps during unrelated tasks. Best change?",
    options: [
      { t: "Keep it in CLAUDE.md, but add “only follow this when asked to release.”", trap: "T1", why: "Still loads every session and still competes for attention." },
      { t: "Move it to each release manager's <code>~/.claude/CLAUDE.md</code>.", why: "Still always-on for those people, and copies drift." },
      { t: "Make it a skill invoked as <code>/release</code>, and keep CLAUDE.md for always-on standards.", ok: true, why: "On-demand workflows belong in skills; CLAUDE.md is for what applies to every task." },
      { t: "Split the procedure into 15 separate rules files, one per step.", why: "Rules hold conventions, not invocable workflows." }
    ]
  },
  {
    id: "h2-4", ts: "1.5", scenario: 2, holdout: true,
    stem: "Files under <code>**/__generated__/**</code> are regenerated from schemas and must never be edited by hand. Claude still edits them sometimes when fixing type errors. What's the right mechanism?",
    options: [
      { t: "A path-scoped rule for <code>**/__generated__/**</code> saying “never edit these files.”", trap: "T1", why: "Rules convey conventions; they don't guarantee anything." },
      { t: "Add the generated folders to <code>.gitignore</code> so Claude can't see them.", why: "Claude still needs to read generated types, and ignoring doesn't block edits." },
      { t: "Regenerate the files after every session to overwrite any manual edits.", why: "Erases the symptom but not the wasted work or confusion." },
      { t: "A <code>PreToolUse</code> hook that denies edits to those paths.", ok: true, why: "Interception guarantees the rule and redirects the agent to the right fix." }
    ]
  },
  {
    id: "h2-5", ts: "3.4", scenario: 2, holdout: true,
    stem: "You need to fix an intermittent race condition in a module you've never worked in. You don't yet know where it comes from. What workflow fits best?",
    options: [
      { t: "Plan mode to find the cause, then direct execution for the fix.", ok: true, why: "Investigate before committing; once the cause is clear, execution is straightforward." },
      { t: "Direct execution: ask Claude to fix the race and iterate until the test stops failing.", why: "An intermittent failure can stop appearing without being fixed." },
      { t: "Plan mode for everything, including writing and testing the fix.", why: "Planning is for investigation and design; the fix itself doesn't need it." },
      { t: "Ask Claude to add retries around the failing operation as a first step.", why: "Masks the race instead of finding it." }
    ]
  },
  {
    id: "h2-6", ts: "3.5", scenario: 2, holdout: true,
    stem: "Claude's SQL query passes all tests but takes 40 seconds on production-size data. You've asked twice to “make it faster,” and Claude reshuffles the syntax with little change. Most effective next step?",
    options: [
      { t: "Ask Claude to “aggressively optimize” and try harder this time.", trap: "T9", why: "Adds urgency, not information." },
      { t: "Give it table sizes and current timing plus a target and the <code>EXPLAIN</code> plan.", ok: true, why: "Concrete measurements show where the time goes, and what success means." },
      { t: "Switch to a larger model that knows more optimization techniques.", trap: "T3", why: "Without the plan and data sizes, any model is guessing." },
      { t: "Rewrite the query yourself rather than iterating further.", why: "Gives up before providing the information that would let Claude succeed." }
    ]
  },
  {
    id: "h2-7", ts: "3.5", scenario: 2, holdout: true,
    stem: "You need a parser for a date-range syntax with a strict spec and about 30 edge cases. Earlier attempts each handled a different subset of the cases. What approach converges fastest?",
    options: [
      { t: "Write tests from the spec's examples and iterate until all of them pass.", ok: true, why: "Tests make every edge case concrete and give Claude an objective target." },
      { t: "Paste the full spec and ask for a complete implementation in one pass.", why: "That's what produced partial coverage; nothing checks each case." },
      { t: "Use the interview pattern so Claude asks about requirements before coding.", why: "Useful when requirements are unknown; here they're already written down." },
      { t: "Ask Claude to review its own implementation against the spec after writing it.", why: "Self-review shares the original blind spots; executable tests don't." }
    ]
  },
  {
    id: "h2-8", ts: "5.4", scenario: 2, holdout: true,
    stem: "After reading about 200 files while investigating a large system, Claude's answers become vague and contradict its earlier findings. You still need to implement a change based on that investigation. What helps most?",
    options: [
      { t: "Keep going; Claude can re-read files whenever it needs specifics.", why: "Context keeps degrading, and re-reading adds to it." },
      { t: "Save key findings to a file and continue in a fresh session.", ok: true, why: "Persist findings outside the conversation, then start clean with them." },
      { t: "Switch to a model with a larger context window for the rest of the task.", trap: "T3", why: "More room doesn't restore attention to early details." },
      { t: "Run <code>/compact</code> and ask Claude to be more precise from now on.", why: "Compaction may drop exactly the specifics you need." }
    ]
  },
  {
    id: "h2-9", ts: "5.4", scenario: 2, holdout: true,
    stem: "You need to know which of 300 services call a deprecated endpoint, with per-service details you'll use later, without filling the main session's context. What should you do?",
    options: [
      { t: "Grep from the main session and read each match there so the details are at hand.", why: "Floods the main context you need for the follow-up work." },
      { t: "Delegate discovery to the Explore subagent and have it write a structured list to a file.", ok: true, why: "Isolated discovery plus a persisted, structured result keeps the main context clean." },
      { t: "Split the 300 services across several sessions and compare notes by hand afterwards.", why: "Manual and lossy; no structured result comes back." },
      { t: "Ask Claude to keep only the most important services in mind as it searches.", trap: "T9", why: "Every matching file still enters the main context." }
    ]
  },
  {
    id: "h2-10", ts: "1.6", scenario: 2, holdout: true,
    stem: "A developer asks Claude Code to “improve the performance of the app.” There's no profiling data, and the codebase is large. How should the work be decomposed?",
    options: [
      { t: "Profile to find hotspots first, then plan targeted fixes.", ok: true, why: "Open-ended goals need investigation first, then a plan that adapts to what's found." },
      { t: "Apply a standard checklist of optimizations to every module, in order.", why: "A fixed pipeline spends effort evenly where the cost isn't even." },
      { t: "Spawn one subagent per directory to optimize each in parallel.", why: "Parallel effort without knowing where the time goes." },
      { t: "Ask the developer which functions are slow before doing anything.", why: "The agent can measure this itself." }
    ]
  },
  {
    id: "h3-1", ts: "1.2", scenario: 3, holdout: true,
    stem: "Three subagents research distinct subtopics, but each cites the same landmark study. The final report lists it as three separate findings, overstating the evidence. What should the coordinator do?",
    options: [
      { t: "Tell the synthesis agent to avoid repeating findings in the report.", trap: "T9", why: "Without merged records, synthesis can't tell repeats from corroboration." },
      { t: "Repartition the subtopics so only one subagent can find that study.", why: "The partition is fine; important studies legitimately appear in several subtopics." },
      { t: "Merge findings by claim, keeping all of the subtopics' citations.", ok: true, why: "Deduplicate by claim while preserving provenance, so evidence isn't double-counted." },
      { t: "Drop the study from two of the three subagents' results.", why: "Loses the link between the study and those subtopics." }
    ]
  },
  {
    id: "h3-2", ts: "1.3", scenario: 3, holdout: true,
    stem: "Subagents return prose summaries. The synthesis agent can't tell which claims come from peer-reviewed studies and which from blog posts, so it weights them equally. What should change?",
    options: [
      { t: "Ask the synthesis agent to judge each claim's source quality from the wording of the summaries.", why: "The source type isn't in the summaries to judge." },
      { t: "Have subagents return structured records for each claim, including source type, publication and date.", ok: true, why: "Pass the metadata downstream agents need to weigh evidence." },
      { t: "Restrict subagents to peer-reviewed sources only.", why: "Throws away legitimate sources instead of labeling them." },
      { t: "Give the synthesis agent web search so it can look up each source's quality.", trap: "T5", why: "Redoes research the subagents already did." }
    ]
  },
  {
    id: "h3-3", ts: "1.6", scenario: 3, holdout: true,
    stem: "The research question is: “Compare AI regulation in the EU, the US and China across five dimensions: scope, enforcement, liability, transparency and timelines.” How should the coordinator decompose it?",
    options: [
      { t: "One subagent per region, all using the same template.", ok: true, why: "Partition along the natural boundary and standardize outputs for synthesis." },
      { t: "Fifteen subagents, one for each region and dimension pair.", why: "Fragmented; each region's dimensions interrelate, and coordination overhead balloons." },
      { t: "One subagent that researches everything, to keep the comparison consistent.", why: "Loses parallelism and floods one context." },
      { t: "One subagent per dimension, each choosing its own structure for the three regions.", why: "Without a shared template the regions aren't comparable, and each subagent must master three legal systems." }
    ]
  },
  {
    id: "h3-4", ts: "1.2", scenario: 3, holdout: true,
    stem: "The coordinator always stops after exactly three research rounds. Some reports still have clear gaps, and simple topics waste rounds. What's the better stopping rule?",
    options: [
      { t: "Raise the fixed count to five rounds so more topics are fully covered.", why: "Still ignores whether coverage is actually complete." },
      { t: "Check coverage against the brief after each round and stop once it's met.", ok: true, why: "Evaluate output against criteria; iterate only where there are gaps." },
      { t: "Stop when the subagents stop finding new sources.", why: "New sources can dry up long before the brief is covered." },
      { t: "Ask the synthesis agent after each round whether the report feels complete.", why: "A vague judgment without criteria." }
    ]
  },
  {
    id: "h3-5", ts: "1.3", scenario: 3, holdout: true,
    stem: "The coordinator correctly spawns five subagents in one response, but gives each the same generic instruction plus a topic name. Outputs vary wildly in depth and format. What should it change?",
    options: [
      { t: "Spawn them one at a time so each can be checked before the next starts.", why: "Loses parallelism without fixing the vague instructions." },
      { t: "Give each subagent its own goal and scope plus a required output format.", ok: true, why: "Clear, task-specific prompts make parallel results consistent and usable." },
      { t: "Add “be thorough and consistent” to the shared instruction.", trap: "T9", why: "Adds no definition of depth or format." },
      { t: "Normalize the outputs afterwards with a formatting step.", trap: "T6", why: "Can't add depth that wasn't researched." }
    ]
  },
  {
    id: "h3-6", ts: "2.2", scenario: 3, holdout: true,
    stem: "The web search tool returns “No results” both when a query matches nothing and when the search provider blocks it under its content policy. The coordinator records some topics as having no sources. Best fix?",
    options: [
      { t: "Return empty success for no matches and a structured error for policy blocks.", ok: true, why: "An empty result and a refusal mean different things and need different handling." },
      { t: "Have the coordinator rephrase and re-run every query that returns no results.", why: "Wastes calls on genuine no-matches and never learns which queries were blocked." },
      { t: "Retry every “No results” twice before accepting it.", trap: "T6", why: "A policy block returns the same answer every time." },
      { t: "Return a dummy result explaining the topic may be sensitive.", trap: "T6", why: "Mixes a fabricated result into the data." }
    ]
  },
  {
    id: "h3-7", ts: "2.3", scenario: 3, holdout: true,
    stem: "The coordinator was given its own <code>web_search</code> tool “for quick checks.” It now does more and more research itself instead of delegating, and its context fills up. Best change?",
    options: [
      { t: "Tell the coordinator to use <code>web_search</code> only for checks under a minute.", trap: "T1", why: "The tool stays available and the drift continues." },
      { t: "Give the coordinator a larger context window to absorb the extra research.", trap: "T3", why: "Treats the symptom; the role confusion remains." },
      { t: "Remove <code>web_search</code> from the coordinator so research goes through the search subagent.", ok: true, why: "Scope tools to roles; the coordinator orchestrates rather than researches." },
      { t: "Merge the coordinator and search subagent into one agent.", trap: "T5", why: "Makes the context problem worse." }
    ]
  },
  {
    id: "h3-8", ts: "2.1", scenario: 3, holdout: true,
    stem: "<code>fetch_paper</code> returns only abstracts for paywalled papers, but its description says “Fetches a paper by DOI.” Synthesis treats abstracts as full papers and over-states findings. Best fix?",
    options: [
      { t: "Tell the synthesis agent to be cautious about claims drawn from short sources.", trap: "T9", why: "It can't tell which sources are abstracts." },
      { t: "Document the abstract-only limit and mark it in each result.", ok: true, why: "Describe the tool's limits and mark them in the output, so downstream agents know what they have." },
      { t: "Remove paywalled papers from the research entirely.", why: "Throws away useful abstracts instead of labeling them." },
      { t: "Merge <code>fetch_paper</code> with web search so full texts can be found elsewhere.", trap: "T5", why: "Doesn't tell anyone what was actually retrieved." }
    ]
  },
  {
    id: "h3-9", ts: "5.6", scenario: 3, holdout: true,
    stem: "A report states “AI cuts costs by 30%,” citing a consulting study. The study actually said “up to 30% in pilot projects.” How do you prevent this kind of distortion?",
    options: [
      { t: "Add a final pass that checks every number in the report against its source.", why: "Checks numbers but misses qualifiers like “up to” and “in pilots.”" },
      { t: "Tell the synthesis agent to be precise when it quotes statistics.", trap: "T9", why: "It can't keep qualifiers it never received." },
      { t: "Carry each claim's exact excerpt with its qualifiers through synthesis.", ok: true, why: "Provenance includes the original wording and context, not just a citation." },
      { t: "Remove statistics from reports and keep only qualitative findings.", why: "Loses valuable information to avoid a fixable problem." }
    ]
  },
  {
    id: "h3-10", ts: "5.3", scenario: 3, holdout: true,
    stem: "A long-running search subagent sometimes crashes halfway through its queries. The coordinator then restarts it from scratch, tripling the cost of those tasks. Best design?",
    options: [
      { t: "Have the subagent save progress so any retry resumes where it stopped.", ok: true, why: "Preserve partial progress so recovery doesn't repeat finished work." },
      { t: "Give the subagent a larger timeout so it crashes less often.", why: "Crashes aren't only timeouts, and each one still restarts from zero." },
      { t: "Have the coordinator skip the subagent's topic whenever it crashes.", trap: "T6", why: "Silently creates coverage gaps." },
      { t: "Run three copies of the subagent in parallel and keep whichever finishes.", why: "Triples the cost every time to avoid occasional restarts." }
    ]
  },
  {
    id: "h4-1", ts: "2.4", scenario: 4, holdout: true,
    stem: "An experimental MCP server you're trying out appears in your teammates' Claude Code sessions after they pull. You only wanted it for yourself, in every project. What happened, and what's the fix?",
    options: [
      { t: "It was added to the project's <code>.mcp.json</code>; move it to user scope in <code>~/.claude.json</code>.", ok: true, why: "Project scope is shared through the repo; user scope is yours across projects." },
      { t: "It was added at user scope, which syncs to teammates; move it to project scope.", why: "Backwards: user scope is personal, and project scope is the shared one." },
      { t: "MCP servers always load for everyone in an organization; disable it from the admin console.", trap: "T8", why: "Scope decides who gets a server; there's no automatic org-wide loading." },
      { t: "It was added to CLAUDE.md; move the definition into <code>.claude/settings.json</code>.", trap: "T8", why: "CLAUDE.md doesn't configure MCP servers." }
    ]
  },
  {
    id: "h4-2", ts: "2.4", scenario: 4, holdout: true,
    stem: "The team's committed <code>.mcp.json</code> defines a database MCP server. Most developers use a local database, but some point at a shared staging one. How should the connection string be configured?",
    options: [
      { t: "Commit the local URL; developers on staging edit their copy of the file and don't commit it.", why: "Uncommitted edits drift and eventually get committed." },
      { t: "Use <code>${DB_URL:-postgres://localhost/dev}</code>, so the default works and anyone can override it.", ok: true, why: "Environment expansion with a default shares the config and keeps per-developer values out of the repo." },
      { t: "Define two servers, <code>db-local</code> and <code>db-staging</code>, and let the agent choose between them.", why: "Doubles the tools and lets the agent pick the wrong environment." },
      { t: "Put the staging URL in CLAUDE.md so Claude knows when to use it.", trap: "T8", why: "CLAUDE.md doesn't configure server connections." }
    ]
  },
  {
    id: "h4-3", ts: "2.5", scenario: 4, holdout: true,
    stem: "The agent needs the definition of class <code>LedgerEntry</code> in a 2,000-file repository. It starts reading files directory by directory. What should it do instead?",
    options: [
      { t: "Glob for files with “ledger” in their names, then Read each match.", why: "The class may live in a file with a different name." },
      { t: "Grep for <code>class LedgerEntry</code>, then Read the file it's in.", ok: true, why: "Search content for the definition, then read only that file." },
      { t: "Read the project's README and architecture docs to find where models live.", why: "Indirect, and the docs may be out of date." },
      { t: "Ask the developer where the class is defined.", why: "The agent can find it in one search." }
    ]
  },
  {
    id: "h4-4", ts: "2.4", scenario: 4, holdout: true,
    stem: "At the start of nearly every task, the agent calls <code>get_table_schema</code> for the same 30 tables just to see what columns exist. How can you cut those calls?",
    options: [
      { t: "Cache <code>get_table_schema</code> results inside the MCP server for an hour.", why: "Faster calls, but the agent still makes 30 of them." },
      { t: "Add all 30 schemas to the system prompt of every session.", trap: "T3", why: "Bloats every request, including tasks that don't touch the database." },
      { t: "Expose the schemas as an MCP resource the agent can consult without tool calls.", ok: true, why: "Resources expose catalogs of content without exploratory tool calls." },
      { t: "Merge <code>get_table_schema</code> into the query tool so schemas come back with every query.", trap: "T5", why: "Adds schema noise to every query result." }
    ]
  },
  {
    id: "h4-5", ts: "2.2", scenario: 4, holdout: true,
    stem: "An MCP tool throws an uncaught exception when called with a malformed date. The client reports a protocol-level failure, and the agent gives up instead of correcting the date. What should the server return?",
    options: [
      { t: "A JSON-RPC protocol error with the exception message, so the client knows the call failed.", why: "Under the current MCP spec, bad arguments are tool execution errors the model can act on." },
      { t: "An <code>isError</code> tool result naming the invalid argument and expected format.", ok: true, why: "Input validation errors belong in the tool result, where the model can self-correct." },
      { t: "A success result containing the exception text, so the agent can read it.", trap: "T6", why: "Marking a failure as success invites wrong conclusions." },
      { t: "Nothing; add a system-prompt note on the expected date format instead.", trap: "T1", why: "The model still gets no usable signal when it goes wrong." }
    ]
  },
  {
    id: "h4-6", ts: "3.2", scenario: 4, holdout: true,
    stem: "Your team wants a <code>/pr-summary</code> command available to every developer as soon as they clone the repo, and versioned with the code. Where should it live?",
    options: [
      { t: "In each developer's <code>~/.claude/</code> directory, distributed through the onboarding docs.", why: "Personal and unversioned, so copies drift." },
      { t: "In the project's <code>.claude/</code> directory, as a project command or skill committed to the repo.", ok: true, why: "Project-scoped commands and skills are versioned and shared on clone." },
      { t: "In the root CLAUDE.md, as a section titled “/pr-summary.”", why: "Memory content isn't an invocable command." },
      { t: "In the CI pipeline's configuration, where it runs automatically.", why: "That's automation, not a command developers can run." }
    ]
  },
  {
    id: "h4-7", ts: "3.1", scenario: 4, holdout: true,
    stem: "The root CLAUDE.md contains <code>@docs/standards.md</code>. After the docs were reorganized, Claude stopped following the standards. Nothing else changed. What's the most likely cause?",
    options: [
      { t: "The file moved, so the import no longer resolves. Update the @import path.", ok: true, why: "Imports point at a path; check what's loaded, then fix the reference." },
      { t: "@imports only work for files in the same directory as CLAUDE.md.", why: "Imports can reference other paths." },
      { t: "The standards file is now too long to import, so it's silently skipped.", why: "Length isn't what changed; the location did." },
      { t: "Claude needs a restart after any docs change before imports take effect.", why: "A new session reloads memory, but a broken path stays broken." }
    ]
  },
  {
    id: "h4-8", ts: "1.5", scenario: 4, holdout: true,
    stem: "A developer-productivity agent occasionally runs <code>rm -rf</code> on build directories outside the project workspace while cleaning up. What's the right control?",
    options: [
      { t: "A rule in CLAUDE.md that limits cleanup to the workspace directory.", trap: "T1", why: "An irreversible action needs a guarantee." },
      { t: "A <code>PreToolUse</code> hook that denies <code>rm</code> commands targeting paths outside the workspace.", ok: true, why: "Intercept the call and enforce the boundary every time." },
      { t: "Remove Bash from the agent, so it can't delete anything.", why: "Blocks the legitimate shell work the agent needs." },
      { t: "Back up build directories before each session so deletions can be undone.", why: "Recovers after the damage instead of preventing it." }
    ]
  },
  {
    id: "h4-9", ts: "1.3", scenario: 4, holdout: true,
    stem: "An explorer subagent's summaries say things like “the auth logic is in the middleware layer,” with no file paths. The coordinator can't act on them without re-searching. What should change?",
    options: [
      { t: "Specify an output format with the file path and line range of each finding.", ok: true, why: "Define the structured output the coordinator needs to act on." },
      { t: "Give the coordinator the same search tools so it can find the files itself.", trap: "T5", why: "Duplicates the explorer's work instead of fixing its output." },
      { t: "Tell the subagent to be more specific in its summaries.", trap: "T9", why: "Vague; doesn't say what “specific” means." },
      { t: "Raise the subagent's token limit so it has room for more detail.", why: "Room for detail doesn't define which detail is required." }
    ]
  },
  {
    id: "h4-10", ts: "1.1", scenario: 4, holdout: true,
    stem: "An agent built on the raw API runs two tools in parallel and returns both results as one plain-text user message. Claude sometimes attributes the first tool's result to the second. Fix?",
    options: [
      { t: "Label each result in the text with the tool's name so Claude can tell them apart.", why: "Better than nothing, but the protocol has a structured way to link results." },
      { t: "Return each result as its own <code>tool_result</code> block with the matching <code>tool_use_id</code>.", ok: true, why: "tool_use_id ties each result to the call that requested it." },
      { t: "Run the tools one at a time so only one result comes back per turn.", why: "Gives up parallelism to work around a formatting mistake." },
      { t: "Ask Claude to call at most one tool per response.", trap: "T1", why: "Restricts the model instead of returning results correctly." }
    ]
  },
  {
    id: "h5-1", ts: "3.6", scenario: 5, holdout: true,
    stem: "The CI review job posts comments on lockfiles, generated code and the <code>vendor/</code> directory. Developers ignore its output as noise. Where should the review scope be defined?",
    options: [
      { t: "In the project CLAUDE.md, so every run applies it.", ok: true, why: "Project memory gives CI the same context everywhere, in one versioned place." },
      { t: "In a post-processing script that deletes comments on those paths before posting.", why: "Works, but the job still spends effort reviewing files nobody wants reviewed." },
      { t: "In each pipeline's prompt string, listing the paths to ignore.", why: "Duplicated across pipelines, and it drifts." },
      { t: "In a <code>CLAUDE_IGNORE</code> environment variable on the runner.", trap: "T8", why: "Not a real mechanism." }
    ]
  },
  {
    id: "h5-2", ts: "3.6", scenario: 5, holdout: true,
    stem: "A CI step must gate the merge on Claude's verdict (pass or fail), with reasons attached to the PR. How should the step get the verdict?",
    options: [
      { t: "Check whether the output text contains the word “PASS.”", trap: "T6", why: "Fragile; “doesn't PASS” matches too." },
      { t: "Use the exit code of <code>claude -p</code> as the verdict.", why: "The exit code reflects whether the run succeeded, not what Claude concluded." },
      { t: "<code>--output-format json</code> with a <code>--json-schema</code> verdict field.", ok: true, why: "Schema-validated structured output is machine-readable and reliable." },
      { t: "Ask Claude to put its verdict on the first line of its response.", trap: "T1", why: "Formatting by instruction is probabilistic." }
    ]
  },
  {
    id: "h5-3", ts: "3.6", scenario: 5, holdout: true,
    stem: "A PR has 30 commits. The review job runs on every push, reviews the entire diff each time, and re-raises issues that were already discussed or fixed. What should each run do?",
    options: [
      { t: "Review only the newest commit's diff, ignoring earlier commits.", why: "Misses problems that arise from how new and old changes interact." },
      { t: "Review the diff with prior findings and report only open issues.", ok: true, why: "Prior findings in context let the reviewer skip what's resolved." },
      { t: "Skip review until the PR is marked ready, then review once.", why: "Loses early feedback, the reason it runs on each push." },
      { t: "Post every finding, and let developers resolve duplicates by hand.", why: "The noise is the complaint." }
    ]
  },
  {
    id: "h5-4", ts: "3.5", scenario: 5, holdout: true,
    stem: "The CI test generator produces tests that pass but don't check much: many assert only that a function returns something. How do you get meaningful tests?",
    options: [
      { t: "Tell the generator to write thorough, high-quality assertions.", trap: "T9", why: "Doesn't define what a meaningful assertion is." },
      { t: "Require a minimum number of assertions per test.", why: "Easy to satisfy with more trivial assertions." },
      { t: "Examples of good assertions, plus a fail-when-stubbed check.", ok: true, why: "Examples define quality, and a stub check verifies the test exercises real behavior." },
      { t: "Use a larger model for test generation.", trap: "T3", why: "Without a quality criterion, any model can write weak tests." }
    ]
  },
  {
    id: "h5-5", ts: "4.1", scenario: 5, holdout: true,
    stem: "The security reviewer flags every <code>eval</code>-like call, including test fixtures that deliberately run sandboxed code. Developers now skim past its findings. Best change?",
    options: [
      { t: "Define criteria that cover untrusted input in production code and skip fixtures.", ok: true, why: "Explicit criteria remove the false positives at their source." },
      { t: "Ask the reviewer to use more judgment about which <code>eval</code> calls matter.", trap: "T9", why: "Judgment without criteria is what produced the noise." },
      { t: "Drop the dynamic-execution check, since it's mostly false positives.", why: "Gives up a real security check instead of scoping it." },
      { t: "Post <code>eval</code> findings only when the model rates them severe.", trap: "T4", why: "Uncalibrated ratings don't fix unclear criteria." }
    ]
  },
  {
    id: "h5-6", ts: "4.6", scenario: 5, holdout: true,
    stem: "Code is generated in one CI job and reviewed by a separate Claude instance in another. The reviewer still approves subtle bugs. It receives the diff plus the PR description, which the generator wrote to explain its reasoning. Best change?",
    options: [
      { t: "Withhold the generator's explanation from the reviewer.", ok: true, why: "Independence means not inheriting the generator's reasoning, even secondhand." },
      { t: "Have the reviewer run twice and post only findings both runs agree on.", why: "Both runs see the same anchoring explanation." },
      { t: "Ask the reviewer to assume the explanation is wrong.", trap: "T9", why: "The explanation still frames how it reads the diff." },
      { t: "Use a larger model for the reviewer.", trap: "T3", why: "A bigger model is anchored by the same explanation." }
    ]
  },
  {
    id: "h5-7", ts: "4.2", scenario: 5, holdout: true,
    stem: "The reviewer flags broad <code>except Exception</code> handlers in top-level CLI entry points, where they're intentional, and also catches genuinely swallowed exceptions in library code. Criteria are already written. What helps most?",
    options: [
      { t: "Contrasting few-shot examples of the two patterns.", ok: true, why: "Examples teach the distinction that written criteria leave ambiguous." },
      { t: "Stop checking exception handling in any file named <code>cli.py</code>.", why: "A file-name rule misses entry points elsewhere and hides real bugs in those files." },
      { t: "Add “be conservative about exception-handling findings.”", trap: "T9", why: "Vague caution doesn't teach the distinction." },
      { t: "Disable the exception-handling category.", why: "Loses the genuine catches along with the false positives." }
    ]
  },
  {
    id: "h5-8", ts: "4.5", scenario: 5, holdout: true,
    stem: "Each night, a CI job generates documentation for 3,000 modules. The docs need to be published by the next business day, and the team wants to cut cost. Should it use the Message Batches API?",
    options: [
      { t: "No: batches have no latency guarantee, so nightly jobs should stay synchronous.", why: "The guarantee is up to 24 hours, which fits a next-business-day deadline." },
      { t: "Yes: the deadline tolerates the 24-hour worst case.", ok: true, why: "Check the worst case against the deadline; here it fits." },
      { t: "No: documentation generation needs tool calls, which batch can't run.", why: "Generating docs from supplied source doesn't need a multi-turn tool loop." },
      { t: "Yes, but only if results come back in the same order as the modules.", why: "Use custom_id; order doesn't matter." }
    ]
  },
  {
    id: "h5-9", ts: "1.4", scenario: 5, holdout: true,
    stem: "A CI agent must never merge a PR without human approval. After posting “LGTM” in a review, it sometimes calls <code>merge_pr</code>. What's the right fix?",
    options: [
      { t: "Make <code>merge_pr</code> refuse without a recorded approval.", ok: true, why: "Enforce the precondition in code at the action itself." },
      { t: "Add to the agent's prompt that only humans may merge.", trap: "T1", why: "Probabilistic for an action that must never happen." },
      { t: "Stop the agent from posting “LGTM,” which seems to trigger the merge.", why: "Treats a symptom; the agent can still merge." },
      { t: "Review the merge log each week and revert unapproved merges.", why: "Undoes the damage after it's done." }
    ]
  },
  {
    id: "h5-10", ts: "1.6", scenario: 5, holdout: true,
    stem: "A CI agent must upgrade a framework across a monorepo of 12 interdependent packages. Earlier attempts upgraded packages in alphabetical order, and builds broke midway. How should it be decomposed?",
    options: [
      { t: "Upgrade in dependency order from leaf packages up and verify each before its dependents.", ok: true, why: "Decomposition should follow real dependencies, with checks between steps." },
      { t: "Upgrade all 12 packages at once, then fix whatever breaks.", why: "Every failure arrives at once and tangled." },
      { t: "Upgrade the most-used package first, since it has the biggest impact.", why: "The most-used package depends on others that would break." },
      { t: "Run 12 parallel jobs, one per package.", why: "Interdependent packages can't be upgraded independently." }
    ]
  },
  {
    id: "h6-1", ts: "4.2", scenario: 6, holdout: true,
    stem: "Invoices with line-item tables that continue onto a second page often come back with the second page's items missing. The prompt already says “include every line item.” What helps most?",
    options: [
      { t: "Repeat “include every line item, including those on later pages” in bold.", trap: "T9", why: "Repetition adds no new information." },
      { t: "Add few-shot examples showing correct extraction from tables split across pages.", ok: true, why: "Examples of the varied structure teach the model how to handle it." },
      { t: "Extract each page separately and concatenate the results.", why: "Splits rows and headers that span the page break." },
      { t: "Make the line-items array required, with at least one item.", why: "The array isn't empty; it's incomplete." }
    ]
  },
  {
    id: "h6-2", ts: "4.3", scenario: 6, holdout: true,
    stem: "<code>payment_terms</code> is an enum of <code>NET30</code> and <code>NET60</code>. Some invoices say “due on receipt” or “2/10 net 30,” and these get forced into one of the two values. Best schema change?",
    options: [
      { t: "Add the specific values seen so far to the enum, and review it each month.", why: "The list keeps lagging behind real invoices." },
      { t: "Change <code>payment_terms</code> to free text so any wording is captured.", why: "Loses the consistent values downstream systems use." },
      { t: "Add an <code>\"other\"</code> value with a <code>payment_terms_detail</code> string for the original wording.", ok: true, why: "Keeps the standard categories and captures what doesn't fit." },
      { t: "Make the field optional so unusual terms can be left blank.", why: "Loses information that's actually in the document." }
    ]
  },
  {
    id: "h6-3", ts: "4.4", scenario: 6, holdout: true,
    stem: "Validation flags totals that don't match their line items. Retrying with the specific error fixes about 70%. The rest are low-quality scans where an amount is illegible. What should happen to those?",
    options: [
      { t: "Retry them again with stronger wording in the error feedback.", why: "The missing information isn't in the image; no wording recovers it." },
      { t: "Stop retrying and route it to human review with the conflict flagged.", ok: true, why: "Retries fix extraction errors, not missing source information." },
      { t: "Have the model infer the illegible amount from the total.", why: "Fabricates a value to hide a gap." },
      { t: "Raise the image resolution and retry indefinitely.", why: "A low-quality scan stays low quality; endless retries cost money." }
    ]
  },
  {
    id: "h6-4", ts: "4.4", scenario: 6, holdout: true,
    stem: "The validation–retry loop sends the model “Validation failed. Please try again.” About half of the retries return the same invalid output. Best change?",
    options: [
      { t: "Retry up to five times instead of two.", trap: "T6", why: "More blind retries repeat the same mistake." },
      { t: "Use a different model for retries.", trap: "T3", why: "Without the error, a different model has nothing to correct." },
      { t: "The failing field, rule and returned value.", ok: true, why: "Specific error feedback gives the model what it needs to fix the output." },
      { t: "Lower the validation rules' strictness so fewer records fail.", why: "Lets bad data through." }
    ]
  },
  {
    id: "h6-5", ts: "4.5", scenario: 6, holdout: true,
    stem: "You need to extract data from 500,000 documents within three days, at the lowest cost. The prompt is already validated on a sample. What's the right plan?",
    options: [
      { t: "Submit all 500,000 as one batch for the maximum discount.", why: "A batch is limited to 100,000 requests (or 256 MB), so it won't be accepted." },
      { t: "Run synchronous calls with many parallel workers to finish quickly.", why: "Full price, when the deadline tolerates batch processing." },
      { t: "Several batches within limits; resubmit failed IDs.", ok: true, why: "Batching fits the deadline and halves cost; targeted resubmission handles failures." },
      { t: "Process a small sample each day so the prompt can keep improving.", why: "The prompt is already validated, and this misses the deadline." }
    ]
  },
  {
    id: "h6-6", ts: "4.6", scenario: 6, holdout: true,
    stem: "After extraction, the same request asks the model to “double-check your values.” It rarely changes anything, yet audits still find errors. What's a better verification design?",
    options: [
      { t: "Ask the model to double-check twice, in two separate turns of the same conversation.", why: "The same context repeats the same blind spots." },
      { t: "An independent pass checking every value against its source excerpt.", ok: true, why: "An independent pass grounded in the source catches what self-review misses." },
      { t: "Raise the extraction's temperature so the check sees a different answer.", why: "Randomness isn't verification." },
      { t: "Have the model rate its confidence in each value and flag those below 7.", trap: "T4", why: "Uncalibrated self-ratings don't find errors." }
    ]
  },
  {
    id: "h6-7", ts: "4.1", scenario: 6, holdout: true,
    stem: "<code>is_amended</code> comes back true whenever a contract contains the word “amend,” including clauses like “this contract may be amended by mutual agreement.” What's the best prompt change?",
    options: [
      { t: "Define amended precisely with examples of mentions that don't count.", ok: true, why: "Explicit criteria with contrasting examples remove the keyword shortcut." },
      { t: "Tell the model not to rely on keywords when judging amendments.", trap: "T9", why: "Says what not to do, without saying what amended means." },
      { t: "Have the model report its confidence in each <code>is_amended</code> value.", trap: "T4", why: "The model is confidently wrong when the criteria are unclear." },
      { t: "Post-process with a rule that sets <code>is_amended</code> false unless “amendment” appears twice.", trap: "T6", why: "Swaps one keyword heuristic for another." }
    ]
  },
  {
    id: "h6-8", ts: "4.3", scenario: 6, holdout: true,
    stem: "A downstream system requires dates in ISO 8601. The extraction schema types <code>contract_date</code> as a plain string, and outputs arrive in many formats. What should you add?",
    options: [
      { t: "Change the field type to number and store dates as Unix timestamps.", why: "Pushes the conversion onto the model without telling it how." },
      { t: "State the format in schema and prompt and then validate and retry.", ok: true, why: "State the format, then check it deterministically, with targeted retries." },
      { t: "Accept any format and let the downstream system parse whatever arrives.", why: "Moves the problem downstream, where ambiguous dates are harder to fix." },
      { t: "Ask the model to use “a standard date format.”", trap: "T9", why: "Too vague to produce consistent output." }
    ]
  },
  {
    id: "h6-9", ts: "5.5", scenario: 6, holdout: true,
    stem: "Confidence thresholds were calibrated on last quarter's labeled data. A new vendor's invoice layout arrived, and the error rate among auto-approved extractions rose for weeks before anyone noticed. What would have caught it sooner?",
    options: [
      { t: "Raise the auto-approval threshold permanently to 0.99.", why: "Reduces automation without detecting the shift." },
      { t: "Stratified sampling of auto-approved items by vendor and layout.", ok: true, why: "Stratified sampling measures error rates per segment and catches new patterns." },
      { t: "Ask downstream teams to report extraction errors more quickly.", why: "Still reactive, and depends on someone noticing." },
      { t: "Retrain the extraction prompt whenever a new vendor is onboarded.", why: "Helps, but nothing measures whether it worked." }
    ]
  },
  {
    id: "h6-10", ts: "5.6", scenario: 6, holdout: true,
    stem: "Reviewers spend most of their time hunting through 40-page contracts to verify each extracted value. How can extraction make review faster?",
    options: [
      { t: "Return a confidence score with each field so reviewers can skip confident ones.", why: "Helps prioritize, but reviewers still have to find each value." },
      { t: "Return the page number and the exact source excerpt alongside each extracted value.", ok: true, why: "Provenance per field lets reviewers verify in seconds." },
      { t: "Highlight the whole contract's key sections for the reviewer.", why: "Narrows the search but doesn't tie values to their sources." },
      { t: "Extract fewer fields so there's less to verify.", why: "Loses data the business needs." }
    ]
  }
);
