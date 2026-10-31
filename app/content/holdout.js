// Sequestered Readiness Check items: never shown in lessons, drills or mocks. Take the check once, cold.
// Questions with a `family` share their options with a practice twin in bank.js that keys a different option.
window.BANK = window.BANK || [];
window.BANK.push(
  {
    id: "h1-1", ts: "1.1", scenario: 1, holdout: true, family: "F01",
    stem: "Some support replies stop mid-sentence. Logs show those responses ended with <code>stop_reason: \"max_tokens\"</code>, and the loop returns whatever text it has whenever the stop reason isn't <code>tool_use</code>. What should change?",
    options: [
      { t: "Decide when to stop by checking <code>stop_reason</code>, not by parsing the reply text.", why: "Right when the loop guesses completion from phrases in the text. This loop already reads <code>stop_reason</code>; it just treats truncation as done." },
      { t: "Return a tool failure to Claude as a <code>tool_result</code> with <code>is_error</code> set, and keep looping.", why: "Right when a tool error ends the loop. No tool failed here; the reply was cut off." },
      { t: "Cap the loop at a set number of iterations and hand off to a human when it's reached.", why: "Right when the agent can loop forever. This agent stops too early, not too late." },
      { t: "Raise <code>max_tokens</code> and continue the turn when <code>stop_reason</code> is <code>max_tokens</code>.", ok: true, why: "<code>max_tokens</code> means the reply was truncated, not finished. Give it room and continue instead of returning a partial answer." }
    ]
  },
  {
    id: "h1-2", ts: "1.4", scenario: 1, holdout: true, family: "F02",
    stem: "Escalations reach human agents as “customer needs help with a refund.” The humans re-ask for the order number, the verification result and what the agent already tried, so customers repeat themselves. What fixes this?",
    options: [
      { t: "Block the refund tool in code until <code>verify_identity</code> has succeeded this session.", why: "Right when refunds can happen before verification. The workflow order is fine here; the handoff is thin." },
      { t: "Add few-shot examples showing how the agent should word its identity-check request.", why: "Right when the agent asks for verification in confusing ways. The problem here is what the human receives." },
      { t: "Escalate with a structured summary: customer ID, issue, steps taken, what's needed.", ok: true, why: "The human starts without the conversation, so the handoff must carry the facts and progress explicitly." },
      { t: "Record completed steps in session state so later checks don't ask for them again.", why: "Right when the agent itself re-asks for completed steps. Here the humans lack the information." }
    ]
  },
  {
    id: "h1-3", ts: "1.5", scenario: 1, holdout: true, family: "F03",
    stem: "Order data comes from three backends: one returns Unix timestamps, one “MM/DD/YY”, one ISO 8601. The agent sometimes gets return-window eligibility wrong when comparing dates across them. Which addition fits best?",
    options: [
      { t: "A <code>PreToolUse</code> hook that blocks refund calls above the approval limit.", why: "Right when an action must be stopped before it runs. The problem here is inconsistent data coming back." },
      { t: "A <code>PostToolUse</code> hook that masks card numbers to the last four digits.", why: "Right when sensitive values appear in results. The dates here are safe; they're just inconsistent." },
      { t: "A <code>PostToolUse</code> hook that converts each backend's dates to ISO 8601.", ok: true, why: "Normalize tool results to one format before the model reasons over them." },
      { t: "A system-prompt line asking the agent to suggest the cheaper shipping option first.", why: "Right for a soft preference where an occasional miss is fine. Date comparison needs consistent data." }
    ]
  },
  {
    id: "h1-4", ts: "1.6", scenario: 1, holdout: true, family: "F04",
    stem: "Customers often send one message with three or four requests, each needing a quick lookup on the same account. The agent resolves the first and forgets the rest. What design fits best?",
    options: [
      { t: "Extract every request into a checklist first, then resolve each one in turn.", ok: true, why: "Make every request explicit up front so none is dropped, then work through them with the shared account context." },
      { t: "Run a fixed sequence: classify, look up the order, then draft the reply.", why: "Right when every ticket follows the same stages. These messages vary in how many requests they hold." },
      { t: "Let the agent pick each next step from what the previous tool returned.", why: "Right when the path depends on findings. Here the problem is dropping known requests." },
      { t: "Give each request to its own subagent and run them in parallel.", why: "Right for heavy, independent work. These are quick lookups on one account, so subagents add overhead and split shared context." }
    ]
  },
  {
    id: "h1-5", ts: "1.4", scenario: 1, holdout: true, family: "F05",
    stem: "Customers who type “let me talk to a person” are told “I can help with that myself” and kept with the agent. Complaints are rising, although the agent often could have solved the issue. What should change?",
    options: [
      { t: "Escalate with a structured summary: customer ID, issue, steps taken, what's needed.", why: "Right when the human lacks context after a handoff. Here the handoff never happens." },
      { t: "Require a code-checked supervisor approval before any account closure runs.", why: "Right for an irreversible action needing sign-off. Nothing irreversible is involved here." },
      { t: "Keep verified facts in a case-facts block that is re-sent every turn.", why: "Right when facts get lost over a long chat. Here the customer's request is being overridden." },
      { t: "Hand the conversation to a human when the customer explicitly asks for one.", ok: true, why: "An explicit request for a human is a reason to hand off, even when the agent could solve it." }
    ]
  },
  {
    id: "h1-6", ts: "2.2", scenario: 1, holdout: true, family: "F42",
    stem: "The order-lookup tool finds no orders for the email a customer gives. It currently returns <code>isError</code>, so the agent tells the customer the system is down. What should the tool return?",
    options: [
      { t: "Return <code>isError</code> with a transient category and <code>isRetryable: true</code>.", why: "Right for timeouts that a retry would fix. Nothing failed here." },
      { t: "Return <code>isError</code> with a business-rule category and a message the agent can relay.", why: "Right when a policy blocks the action. Nothing was blocked; there are just no matches." },
      { t: "Return a successful result with an empty list, noting that nothing matched.", ok: true, why: "A search that ran and found nothing succeeded; the agent can then ask for another email." },
      { t: "Return <code>isError</code> with a permission category so the agent hands off to staff.", why: "Right when access is denied. The search ran fine." }
    ]
  },
  {
    id: "h1-7", ts: "2.3", scenario: 1, holdout: true, family: "F46",
    stem: "The support agent often only needs to answer a greeting or a simple policy question, but it's configured so that every response must call a tool, so it invents lookups. What fixes this?",
    options: [
      { t: "Give each agent only the 4–5 tools its role needs.", why: "Right when too many tools confuse selection. Here a tool call is forced when none is needed." },
      { t: "Set <code>tool_choice</code> to <code>\"auto\"</code> so Claude can reply in text when no tool is needed.", ok: true, why: "With <code>\"auto\"</code>, Claude calls a tool only when one is needed." },
      { t: "Set <code>tool_choice</code> to <code>\"any\"</code> so Claude must call one of the tools.", why: "That is the problem: it forces a call on every turn." },
      { t: "Give the agent one narrow lookup tool from another role, not that role's full toolset.", why: "Right when a role needs one capability from another role. Here no tool is needed at all." }
    ]
  },
  {
    id: "h1-8", ts: "2.2", scenario: 1, holdout: true, family: "F43",
    stem: "The shipping API times out under load about 2% of the time, and a second attempt almost always succeeds. The agent gives up after the first failure. What should the tool return on a timeout?",
    options: [
      { t: "Mark the error as transient and retryable so the agent tries again.", ok: true, why: "Telling the agent the failure is transient and retryable lets it try once more." },
      { t: "Return a validation error naming the field and the format it expects.", why: "Right when the input is malformed. The input here is fine." },
      { t: "Return a business-rule error that names the policy blocking the action.", why: "Right when a policy blocks the action. Nothing is blocked." },
      { t: "Return a permission error so the agent passes the request to staff with access.", why: "Right when access is denied. This is load, not access." }
    ]
  },
  {
    id: "h1-9", ts: "5.2", scenario: 1, holdout: true, family: "F53",
    stem: "A customer asks for compensation for a missed delivery date. The policy covers refunds for late deliveries but says nothing about compensation. What should the agent do?",
    options: [
      { t: "Hand off to a human when the customer explicitly asks for one.", why: "Right when a person is requested. The customer hasn't asked for one." },
      { t: "Ask a clarifying question when the request matches more than one account.", why: "Right when the account is unclear. Here the account is known; the policy has a gap." },
      { t: "Escalate when the request falls outside what the documented policy covers.", ok: true, why: "When the policy doesn't cover a request, a person should decide rather than the agent improvising." },
      { t: "Resolve it directly when it's within policy, even if the customer is upset.", why: "Right for in-policy requests. This one falls outside the policy." }
    ]
  },
  {
    id: "h1-10", ts: "5.1", scenario: 1, holdout: true, family: "F54",
    stem: "Late in a 40-turn chat, the agent misquotes a refund amount agreed early on. The running summary it keeps says only “discussed a refund.” What fixes this?",
    options: [
      { t: "Keep a case-facts block with amounts, dates and order numbers, re-sent every turn.", ok: true, why: "Exact values need to be stored verbatim; summaries lose them." },
      { t: "Trim each tool result down to the few fields the agent actually uses.", why: "Right when tool output bloats the context. Here a key value was lost." },
      { t: "Summarize the earlier part of the conversation once it gets long.", why: "That's the current approach, and it dropped the amount." },
      { t: "Place the key findings at the start of the input, not buried in the middle.", why: "Right when long inputs bury findings. Here the value isn't in the input anymore." }
    ]
  },
  {
    id: "h2-1", ts: "3.1", scenario: 2, holdout: true, family: "F18",
    stem: "The test conventions apply to every <code>*.test.ts</code> file, and those files are spread across 30 directories. The team wants the conventions loaded only when Claude is working on test files. Where should they go?",
    options: [
      { t: "Put the rule in the repository's root CLAUDE.md and commit it.", why: "Right for conventions everyone needs in every session. This would load them for all work, not just tests." },
      { t: "Put the rule in <code>~/.claude/CLAUDE.md</code> on the developer's machine.", why: "Right for one person's preferences. Teammates wouldn't get these conventions." },
      { t: "Put the rule in a <code>.claude/rules/</code> file with a <code>paths:</code> glob for test files.", ok: true, why: "A path-scoped rule loads only when Claude touches matching files, wherever they live." },
      { t: "Put the rule in a CLAUDE.md inside the one directory it applies to.", why: "Right when the files sit in one directory. These are spread across 30." }
    ]
  },
  {
    id: "h2-2", ts: "3.2", scenario: 2, holdout: true, family: "F20",
    stem: "The team wants a <code>/review-migration</code> command that every developer gets automatically when they pull the repository. Where should it live?",
    options: [
      { t: "A skill in <code>.claude/skills/</code> with <code>context: fork</code> in its frontmatter.", why: "Right when a skill's output would flood the session. Nothing here needs isolation." },
      { t: "A slash command in <code>.claude/commands/</code>, committed to the repository.", ok: true, why: "Project commands are shared through the repository. (Today skills in <code>.claude/skills/</code> work the same way.)" },
      { t: "A command in <code>~/.claude/commands/</code> on the developer's machine.", why: "Right for a personal shortcut. Teammates wouldn't get it." },
      { t: "A rule in CLAUDE.md so that it applies in every session.", why: "Right for always-on guidance. This is an on-demand command." }
    ]
  },
  {
    id: "h2-3", ts: "3.2", scenario: 2, holdout: true, family: "F21",
    stem: "Claude never uses the team's migration skill unprompted, even on migration tasks; people have to invoke it by name. Its description reads “Migration helper.” What fixes this?",
    options: [
      { t: "Move the detailed reference material into supporting files that the skill links to.", why: "Right when SKILL.md is bloated. The problem is that Claude doesn't know when to use it." },
      { t: "Add <code>argument-hint</code> to the frontmatter so users see what to pass.", why: "Right when users don't know what arguments to pass. It's only a hint and doesn't affect when Claude uses the skill." },
      { t: "Rewrite the skill's description to say when it should be used.", ok: true, why: "Claude decides when to use a skill from its description, so the description must say when it applies." },
      { t: "Copy the skill into <code>~/.claude/skills/</code> and change the copy.", why: "Right for a personal variant. It doesn't help Claude recognize when to use the skill." }
    ]
  },
  {
    id: "h2-4", ts: "1.5", scenario: 2, holdout: true, family: "F06",
    stem: "The test suite prints thousands of lines per run. After a few runs Claude's context is full of passing-test output and it loses track of the task. Which addition fits best?",
    options: [
      { t: "A <code>PreToolUse</code> hook that blocks Bash commands touching the production config.", why: "Right when an action must never run. Nothing dangerous is happening here." },
      { t: "A <code>PostToolUse</code> hook that runs the formatter on every file Claude edits.", why: "Right when edits drift from the formatter. The problem here is bloated tool output." },
      { t: "A CLAUDE.md note describing the team's preferred commit-message style.", why: "Right for a convention where occasional drift is cheap. It doesn't change what tools return." },
      { t: "A <code>PostToolUse</code> hook that trims test output to the failures before Claude sees it.", ok: true, why: "Trim tool results to what matters before they reach the model, so they stop crowding the context." }
    ]
  },
  {
    id: "h2-5", ts: "3.4", scenario: 2, holdout: true, family: "F23",
    stem: "A developer needs to fix a typo in one error message. They know exactly which file and line it's in. What's the best way to work?",
    options: [
      { t: "Start in plan mode and agree on an approach before any files change.", why: "Right for large or ambiguous changes. Planning a one-line fix is overhead." },
      { t: "Make the change directly, then review the diff.", ok: true, why: "A small, well-understood change needs no planning step." },
      { t: "Have Claude interview you about the requirements before it starts.", why: "Right when the requirements are unclear. Here they're exact." },
      { t: "Run the exploration in a subagent and keep only its summary.", why: "Right when exploration would flood the context. Nothing needs exploring here." }
    ]
  },
  {
    id: "h2-6", ts: "3.5", scenario: 2, holdout: true, family: "F24",
    stem: "A developer reports bugs one at a time. Each fix breaks something another fix relied on, because all the bugs run through the same validation code. What works best?",
    options: [
      { t: "Give two or three concrete input/output examples of the transformation.", why: "Right when prose descriptions are being misread. Here the fixes conflict." },
      { t: "Write the tests first and have Claude iterate until they pass.", why: "Right when behavior can be pinned down by tests. The issue here is fixing interacting bugs separately." },
      { t: "Have Claude ask clarifying questions before implementing anything.", why: "Right when requirements are unclear. Here the bugs are known." },
      { t: "Describe all the problems in one message, because they interact.", ok: true, why: "Interacting problems need to be seen together, so one fix doesn't undo another." }
    ]
  },
  {
    id: "h2-7", ts: "3.5", scenario: 2, holdout: true, family: "F25",
    stem: "A developer is building a caching layer in a domain they know little about. They aren't sure which invalidation cases matter. What works best?",
    options: [
      { t: "Write the test cases first, then have Claude iterate until they all pass.", why: "Right when the expected behavior is known. Here the developer can't write the cases yet." },
      { t: "Add the missing detail to the prompt: inputs, constraints and expected output.", why: "Right when you know what's missing from the prompt. Here the developer doesn't know." },
      { t: "Have Claude interview you about edge cases before it writes any code.", ok: true, why: "Questions surface edge cases the developer wouldn't think to specify." },
      { t: "Raise the issues one per message, because they're independent.", why: "Right for independent issues. Here the requirements aren't known yet." }
    ]
  },
  {
    id: "h2-8", ts: "5.4", scenario: 2, holdout: true, family: "F55",
    stem: "Hours into a refactoring session, Claude starts referring to “typical patterns” instead of the specific classes it found earlier. It will need those exact findings for several more hours, and the rest of the session's context is still relevant. What fits best?",
    options: [
      { t: "Delegate the exploration to a subagent and keep only its summary.", why: "Right before a big exploration. The findings already exist; they're fading." },
      { t: "Have Claude write key findings to a scratchpad file it can reread later.", ok: true, why: "Writing findings to a file preserves them exactly, beyond what the context holds." },
      { t: "Run <code>/compact</code> once the session gets long.", why: "Compaction summarizes, so the specific details it needs may be lost." },
      { t: "Start a fresh session seeded with a summary of the decisions so far.", why: "Right when earlier context is stale. Here it's accurate but fading." }
    ]
  },
  {
    id: "h2-9", ts: "5.4", scenario: 2, holdout: true, family: "F56",
    stem: "To fix one bug, Claude reads entire 3,000-line files one after another and runs out of context before it reaches the bug. What fits best?",
    options: [
      { t: "Grep for the symbol first and read only the files that match.", ok: true, why: "Search narrowly first, and read only what's relevant." },
      { t: "Have Claude record its findings in a scratchpad file as it goes.", why: "Right for keeping findings across a long session. Here the reading is unfocused." },
      { t: "Delegate the investigation to a subagent and keep only its summary.", why: "Right for a broad survey. This is a targeted bug hunt." },
      { t: "Run <code>/compact</code> after the investigation to free up space.", why: "Right after a long investigation. It doesn't stop the wasteful reading." }
    ]
  },
  {
    id: "h2-10", ts: "1.6", scenario: 2, holdout: true, family: "F07",
    stem: "Claude reviews a 40-file pull request in one pass. It misses problems in the later files and contradicts itself about the same pattern in different files. What approach fits best?",
    options: [
      { t: "Have Claude write a plan, then implement it step by step against that plan.", why: "Right for building a known multi-step change. This is a review whose attention is spread too thin." },
      { t: "Review one file per pass, then run a final pass over cross-file consistency.", ok: true, why: "Per-file passes keep attention focused, and a separate pass catches what crosses files." },
      { t: "Make the change directly in one pass, because it's small and well understood.", why: "Right for a small, clear change. A 40-file review is neither." },
      { t: "Explore the codebase first, then decide the next steps from what turns up.", why: "Right when you don't yet know where to look. Here the files to review are known." }
    ]
  },
  {
    id: "h3-1", ts: "1.2", scenario: 3, holdout: true, family: "F08",
    stem: "The coordinator's initial split looks sound, but reports still miss things that only become visible once results arrive, such as a major study that several sources cite but nobody searched for. What change fits best?",
    options: [
      { t: "Have the coordinator split the topic into distinct subtopics before delegating.", why: "Right when the first split leaves parts of the question out. The split here is fine; the gaps appear later." },
      { t: "Have the coordinator check results against the question and re-delegate the gaps.", ok: true, why: "Evaluate what came back and send follow-up work for the gaps, so coverage improves as findings arrive." },
      { t: "Route all subagent output through the coordinator, not directly between subagents.", why: "Right when subagents talk to each other and coordination breaks. Here the issue is coverage." },
      { t: "Give each subagent only the tools that its role needs.", why: "Right when subagents misuse each other's tools. Here the issue is coverage." }
    ]
  },
  {
    id: "h3-2", ts: "1.3", scenario: 3, holdout: true, family: "F09",
    stem: "The coordinator merges subagent reports, but each report is free prose. The final report can't say which source supports which claim, or how recent it is. What change fits best?",
    options: [
      { t: "Put the earlier findings and their sources directly in the subagent's prompt.", why: "Right when a subagent never received the earlier results. Here the results arrive; their sources get lost." },
      { t: "Have subagents return structured results: claim, source URL and date for each.", ok: true, why: "Separating each claim from its source metadata lets the coordinator keep attribution through synthesis." },
      { t: "Spawn the independent searches in the same turn so they run in parallel.", why: "Right when independent work runs one after another. Here the issue is attribution." },
      { t: "Write the subagent's prompt as goals and quality criteria, not fixed steps.", why: "Right when rigid steps stop subagents adapting. Here the issue is the shape of what comes back." }
    ]
  },
  {
    id: "h3-3", ts: "1.6", scenario: 3, holdout: true, family: "F10",
    stem: "Most requests turn out to be quick factual questions that two or three searches answer. The multi-agent setup adds minutes of overhead and most of the cost. What design fits these requests best?",
    options: [
      { t: "Use a fixed pipeline: search, then analyze, then synthesize, in that order.", why: "Right when every request runs through the same stages. Three stages are still overhead for a two-search answer." },
      { t: "Let the coordinator choose the next subagent based on what the last one found.", why: "Right when findings change what to do next. These answers don't need that." },
      { t: "Run the searches for independent subtopics in parallel subagents.", why: "Right when there are several independent subtopics. A quick factual question has one." },
      { t: "Handle the whole request in a single agent with one context.", ok: true, why: "A small task doesn't need delegation; one agent is faster and cheaper here." }
    ]
  },
  {
    id: "h3-4", ts: "1.2", scenario: 3, holdout: true, family: "F11",
    stem: "Some reports take hours. The coordinator keeps finding “one more angle” and re-delegating long after the question has been answered well. What change fits best?",
    options: [
      { t: "Have subagents report to the coordinator, which decides what to pass on.", why: "Right when subagents talk directly and the coordinator loses track. Here the coordinator is the one that won't stop." },
      { t: "Have the coordinator check each claim's source before including it.", why: "Right when unsupported claims reach the report. Here the problem is open-ended looping." },
      { t: "Send a failed subtopic back to a subagent with a narrower query.", why: "Right when a subtopic came back empty. Here everything is answered; the coordinator just keeps going." },
      { t: "Give the coordinator a limit on research rounds before it must synthesize.", ok: true, why: "A bound on rounds forces synthesis once coverage is good enough." }
    ]
  },
  {
    id: "h3-5", ts: "1.3", scenario: 3, holdout: true, family: "F12",
    stem: "The coordinator's prompt tells it to delegate, but it does all the searching itself. Logs show the subagent-spawning tool never appears among its available tools. What change fits best?",
    options: [
      { t: "Add the Task (Agent) tool to the coordinator's <code>allowedTools</code>.", ok: true, why: "The coordinator can only spawn subagents if the Task tool (now called Agent) is available to it." },
      { t: "Include the earlier agent's complete findings in the subagent's prompt.", why: "Right when a subagent lacks earlier results. Here no subagent is ever spawned." },
      { t: "Define each subagent with its own description, prompt and tool list.", why: "Right when subagents are generic or overlap. Here none can be spawned at all." },
      { t: "Spawn the subagents in the same response so they run in parallel.", why: "Right when subagents run one after another. Here none run." }
    ]
  },
  {
    id: "h3-6", ts: "2.2", scenario: 3, holdout: true, family: "F44",
    stem: "A search subagent hits occasional rate-limit errors that clear within seconds. Each one goes to the coordinator, which re-plans the whole task. What fits best?",
    options: [
      { t: "Have the subagent retry transient failures itself and report only what it can't resolve.", ok: true, why: "Handle recoverable errors where they happen, and escalate only what the subagent can't fix." },
      { t: "Return the error to the coordinator with the query, what was tried and any partial results.", why: "Right for failures the subagent can't recover from. These clear in seconds." },
      { t: "Return an empty result marked as a successful search with no matches.", why: "Right when the search ran and found nothing. Here the search failed." },
      { t: "Return a permission error so the coordinator stops using that source.", why: "Right when access is denied. Rate limits are temporary." }
    ]
  },
  {
    id: "h3-7", ts: "2.3", scenario: 3, holdout: true, family: "F47",
    stem: "The synthesis agent often needs to confirm one date or figure. Each check goes back through the coordinator to the search agent, adding minutes per report. What fits best?",
    options: [
      { t: "Give the synthesis agent a narrow <code>verify_fact</code> tool for quick checks.", ok: true, why: "A scoped tool covers the common, simple check without a full round trip." },
      { t: "Send verification requests back through the coordinator to the search agent.", why: "That is the slow path here. It's right for larger follow-up research." },
      { t: "Remove the web-search tools from the document-analysis subagent.", why: "Right when an agent strays outside its role. Here the problem is latency." },
      { t: "Force the citation-formatting tool on the synthesis agent's final step.", why: "Right when the final output must follow a format. Here the problem is latency." }
    ]
  },
  {
    id: "h3-8", ts: "2.1", scenario: 3, holdout: true, family: "F48",
    stem: "<code>search_web</code> and <code>search_docs</code> both have the description “Searches for information.” The agent picks the wrong one about a third of the time. What fixes this?",
    options: [
      { t: "State each tool's scope in its description, and when to use the other.", ok: true, why: "The model chooses tools mainly from their descriptions; say what each covers and where each one's scope ends." },
      { t: "Rename the tools so that each name states what the tool is for.", why: "Right when names mislead. These names are already distinct; the descriptions are identical." },
      { t: "Add examples of the expected input format to the tool's description.", why: "Right when the input is malformed. Here the wrong tool is chosen." },
      { t: "Split the generic tool into separate tools, each with one narrow purpose.", why: "Right when one tool does several jobs. These are already separate." }
    ]
  },
  {
    id: "h3-9", ts: "5.6", scenario: 3, holdout: true, family: "F57",
    stem: "Two recent, reputable studies report different adoption rates. The report silently averages them into one figure. What fits best?",
    options: [
      { t: "Keep claim-to-source mappings through synthesis, with each source's date.", why: "Right when attribution is lost. Here the conflict is hidden." },
      { t: "Report conflicting figures side by side with their sources instead of picking one.", ok: true, why: "Preserve the conflict, with attribution, so readers can see the disagreement." },
      { t: "Label which findings are well established and which are contested.", why: "Right for the report as a whole. Here a specific conflict needs showing." },
      { t: "Have the synthesis agent re-check each claim against its cited source.", why: "Right when synthesis introduces errors. Both figures here are accurate." }
    ]
  },
  {
    id: "h3-10", ts: "5.3", scenario: 3, holdout: true, family: "F59",
    stem: "One of five subagents fails for good, because its source is offline all day. The coordinator abandons the whole report. What fits best?",
    options: [
      { t: "Have the subagent retry transient errors locally before reporting.", why: "Right for brief, transient faults. This source is down all day." },
      { t: "Report the failure type, the query and any partial results to the coordinator.", why: "Right when the coordinator lacks details. It already knows the source is down." },
      { t: "Continue with the other subagents and mark the gap in the final report.", ok: true, why: "Deliver what the other four found, and say clearly what's missing." },
      { t: "Distinguish “no results found” from “search failed” in what subagents return.", why: "Right when two kinds of result look the same. Here the failure is clear." }
    ]
  },
  {
    id: "h4-1", ts: "2.4", scenario: 4, holdout: true, family: "F49",
    stem: "The team's <code>.mcp.json</code> has a personal access token pasted in, so it can't be committed and each developer edits it by hand. What fixes this?",
    options: [
      { t: "Add the server to the project's <code>.mcp.json</code> and commit it.", why: "Right for sharing a server. The token still can't be committed." },
      { t: "Add the server in user scope so it's available in all of one person's projects.", why: "Right for a personal server. The team still needs a shared configuration." },
      { t: "Reference the token as <code>${GITHUB_TOKEN}</code> in <code>.mcp.json</code> instead of pasting it in.", ok: true, why: "Environment variable expansion keeps the secret out of the file, so the configuration can be shared." },
      { t: "Use the maintained community GitHub server rather than building a custom one.", why: "Right when a custom build duplicates an existing server. Here the issue is the secret." }
    ]
  },
  {
    id: "h4-2", ts: "2.4", scenario: 4, holdout: true, family: "F50",
    stem: "The team plans to spend two weeks building an MCP server for Jira. A maintained community server already covers everything they need. What fits best?",
    options: [
      { t: "Expose the documentation catalog as MCP resources.", why: "Right when Claude needs to browse what content exists. Here the question is build versus reuse." },
      { t: "Build a custom MCP server for the team's in-house deployment system.", why: "Right for in-house systems that no existing server covers. Jira is covered." },
      { t: "Use an existing, maintained community server for the standard integration.", ok: true, why: "Reuse a maintained server for a standard integration; build only what's unique." },
      { t: "Add the server to the project's <code>.mcp.json</code> so everyone gets it.", why: "Right for sharing a server. It doesn't settle whether to build one." }
    ]
  },
  {
    id: "h4-3", ts: "2.5", scenario: 4, holdout: true, family: "F52",
    stem: "An Edit fails because the target text appears in several places in the file. No surrounding text reliably picks out the right occurrence. What should Claude do?",
    options: [
      { t: "Use Grep to search file contents for the function name.", why: "Right for finding where text appears across files. Here the problem is editing one file." },
      { t: "Use Glob to find files by a name pattern such as <code>**/*.test.ts</code>.", why: "Right for finding files by name. Here the problem is editing one file." },
      { t: "Use Edit with a longer anchor that appears only once in the file.", why: "Right when a unique anchor exists. Here none does." },
      { t: "Read the whole file and write back the full corrected version.", ok: true, why: "When Edit can't target a unique match, rewriting the whole file is the reliable fallback." }
    ]
  },
  {
    id: "h4-4", ts: "2.4", scenario: 4, holdout: true, family: "F51",
    stem: "The team's MCP code-search tool is more accurate than Grep for this repository, but Claude keeps using Grep. The MCP tool's description reads “Search tool.” What fixes this?",
    options: [
      { t: "Commit the server configuration to the project's <code>.mcp.json</code>.", why: "Right when teammates don't get the server. They have it; Claude doesn't choose it." },
      { t: "Keep the server in local scope, for this one developer and this one project.", why: "Right for a personal server. The problem is tool selection." },
      { t: "Rewrite the MCP tool's description to say when it beats the built-ins.", ok: true, why: "Claude picks tools by their descriptions; a vague one loses to a familiar built-in." },
      { t: "Expose the read-only reference data as MCP resources rather than tools.", why: "Right when Claude needs to browse content. This is a search tool." }
    ]
  },
  {
    id: "h4-5", ts: "2.2", scenario: 4, holdout: true, family: "F45",
    stem: "An internal MCP tool throws an exception when a developer's query returns no tickets, and Claude reports that the tracker is broken. What should the tool do?",
    options: [
      { t: "Return a tool result with <code>isError: true</code> and a message saying what to fix.", why: "Right for invalid input. The query was valid and simply matched nothing." },
      { t: "Return an empty result set as a success when the query matches nothing.", ok: true, why: "No matches is a valid answer, not a failure." },
      { t: "Mark rate-limit failures as retryable so the client waits and tries again.", why: "Right for rate limits. Nothing was limited." },
      { t: "Return a JSON-RPC protocol error for a malformed request, such as an unknown tool.", why: "Right for malformed protocol messages. The request was well formed." }
    ]
  },
  {
    id: "h4-6", ts: "3.2", scenario: 4, holdout: true, family: "F22",
    stem: "A developer wants their own scaffolding workflow available in every repository they work in, without changing anything for their teammates. Where should it live?",
    options: [
      { t: "A skill in <code>~/.claude/skills/</code> on the developer's machine.", ok: true, why: "User-level skills follow one person across projects and aren't shared." },
      { t: "A skill in the repository's <code>.claude/skills/</code> directory.", why: "Right for a team workflow. It would only exist in one repository and affect teammates." },
      { t: "A section in the repository's CLAUDE.md that describes the steps.", why: "Right for always-on conventions. This is an on-demand workflow." },
      { t: "A <code>PostToolUse</code> hook that runs the steps after each edit.", why: "Right for something that must run after every edit. This runs when asked." }
    ]
  },
  {
    id: "h4-7", ts: "3.1", scenario: 4, holdout: true, family: "F19",
    stem: "Claude ignores one of the team's rules in a developer's session. The developer has edited several instruction files and isn't sure which of them Claude is actually reading. What's the best first step?",
    options: [
      { t: "Commit the conventions to the repository's root CLAUDE.md.", why: "Right when conventions live only on one person's machine. First find out what's loaded." },
      { t: "Split each topic into its own file and <code>@import</code> them from CLAUDE.md.", why: "Right when one CLAUDE.md has become hard to maintain. This is a diagnosis problem." },
      { t: "Run <code>/memory</code> to see which memory files this session has loaded.", ok: true, why: "See what's loaded before changing anything; the fix depends on which file is missing." },
      { t: "Add a CLAUDE.md in the <code>legacy/</code> directory with its own conventions.", why: "Right when one directory needs different rules. The problem here isn't known yet." }
    ]
  },
  {
    id: "h4-8", ts: "1.5", scenario: 4, holdout: true, family: "F13",
    stem: "Every ticket Claude files through the tracker tool must carry the “eng-tools” label. Claude leaves it off about one time in eight, even with an instruction in CLAUDE.md. What fits best?",
    options: [
      { t: "A <code>PreToolUse</code> hook that denies file writes outside the project directory.", why: "Right when an action must be blocked. Here the action is fine; its input needs a fix." },
      { t: "A <code>PostToolUse</code> hook that maps the internal API's responses onto one schema.", why: "Right when responses vary in shape. Here the problem is what goes in, not what comes back." },
      { t: "A <code>PreToolUse</code> hook that adds the required team label to the tool's input.", ok: true, why: "A pre-call hook can modify the input, so the label is there on every call." },
      { t: "A skill containing the team's release steps, which developers run on demand.", why: "Right for an on-demand workflow. A required field needs to be enforced on every call." }
    ]
  },
  {
    id: "h4-9", ts: "1.3", scenario: 4, holdout: true, family: "F14",
    stem: "After a long discussion about the CSV parser, a developer has Claude hand “write tests for the parser we discussed” to a subagent. The subagent writes tests for a different parser. What fixes this?",
    options: [
      { t: "Use the Explore subagent to search the codebase and return a summary.", why: "Right when exploration floods the main context. Here the subagent lacks the discussion." },
      { t: "Pass the relevant file paths and the decisions so far in the subagent's prompt.", ok: true, why: "A subagent starts without the conversation, so the specifics must be in its prompt." },
      { t: "Give the subagent read-only tools so it can't modify anything.", why: "Right when the subagent shouldn't change files. Here it needs to write tests." },
      { t: "Ask the subagent to return its findings in a fixed structured format.", why: "Right when the caller must parse results reliably. Here the subagent worked on the wrong target." }
    ]
  },
  {
    id: "h4-10", ts: "1.1", scenario: 4, holdout: true, family: "F15",
    stem: "Claude asks to read two files in one response. The internal tool's loop runs only the first request, and the next API call is rejected. What should change?",
    options: [
      { t: "Return a tool's error to Claude with <code>is_error</code> set so it can try another approach.", why: "Right when a tool failure ends the loop. Here a requested call never ran." },
      { t: "Check <code>stop_reason</code> to decide whether to run tools or return the answer.", why: "Right when the loop guesses completion from text. Here it mishandles a turn with two calls." },
      { t: "Run every <code>tool_use</code> block in a response and return all the results together.", ok: true, why: "Each <code>tool_use</code> needs a matching <code>tool_result</code>; return them all in the next user message." },
      { t: "Send the full message history, including tool results, with each request.", why: "Right when earlier turns go missing. Here the current turn's second call is the problem." }
    ]
  },
  {
    id: "h5-1", ts: "3.6", scenario: 5, holdout: true, family: "F27",
    stem: "The new CI job hangs until it times out. The logs show Claude waiting for input. What fixes this?",
    options: [
      { t: "Run Claude with the <code>-p</code> flag so that it runs non-interactively.", ok: true, why: "Without <code>-p</code>, Claude Code starts an interactive session and waits for input." },
      { t: "Use <code>--output-format json</code> with <code>--json-schema</code> for parseable output.", why: "Right when downstream scripts can't parse the output. Here nothing is produced." },
      { t: "Include the previous run's findings so only new issues are reported.", why: "Right when re-runs repeat findings. Here the job never finishes." },
      { t: "Run the review in a separate session from the one that generated the code.", why: "Right when the reviewer shares the author's blind spots. Here the job never finishes." }
    ]
  },
  {
    id: "h5-2", ts: "3.6", scenario: 5, holdout: true, family: "F28",
    stem: "Tests generated in CI ignore the team's fixture helpers and duplicate setup code in every file. The CI prompt doesn't mention the helpers anywhere. What fixes this?",
    options: [
      { t: "Pass the prior review's findings and ask only for new or unresolved issues.", why: "Right when re-runs repeat old findings. Here the problem is missing project context." },
      { t: "Generate the tests and review them in separate Claude sessions.", why: "Right when a session reviews its own work. Here the generator doesn't know the helpers exist." },
      { t: "Put the project's test conventions and fixture helpers in CLAUDE.md.", ok: true, why: "CI runs read CLAUDE.md, so project conventions there reach every generated test." },
      { t: "Validate the JSON output against the schema and fail the job if it's invalid.", why: "Right when output breaks downstream parsing. Here the tests are valid but ignore conventions." }
    ]
  },
  {
    id: "h5-3", ts: "3.6", scenario: 5, holdout: true, family: "F29",
    stem: "The session that generates code in CI then reviews its own output. It rarely finds problems that human reviewers later catch. What fits best?",
    options: [
      { t: "Have a separate session, without the generator's context, review the code.", ok: true, why: "A reviewer without the generator's reasoning doesn't share its blind spots." },
      { t: "Run the review overnight on a schedule instead of on every push.", why: "Right when cost matters more than fast feedback. Timing isn't the issue here." },
      { t: "Give the reviewer the PR description and linked issue as context.", why: "Right when the reviewer misreads intent. Here it's too close to the code it wrote." },
      { t: "Give the review job read-only tools so it can't change the branch.", why: "Right when the reviewer must not modify the branch. Here it misses issues." }
    ]
  },
  {
    id: "h5-4", ts: "3.5", scenario: 5, holdout: true, family: "F26",
    stem: "A new review prompt is about to go live on 300 repositories. Nobody has yet seen how it behaves on real diffs. What should happen first?",
    options: [
      { t: "Add a few examples of findings the team accepted and ones it rejected.", why: "Right when you know which judgments it gets wrong. Here nothing has been observed yet." },
      { t: "Add the team's testing and style conventions to the repository's CLAUDE.md.", why: "Right when the reviewer lacks project context. Here nobody knows how it behaves." },
      { t: "Try the prompt on a sample of past PRs and refine it before rollout.", ok: true, why: "Refine on a sample first; problems cost far less to fix before 300 repositories depend on it." },
      { t: "Split the prompt into separate review passes, one for each concern.", why: "Right when one concern crowds out others. That hasn't been observed." }
    ]
  },
  {
    id: "h5-5", ts: "4.1", scenario: 5, holdout: true, family: "F30",
    stem: "Developers now ignore every review comment because the “naming” category is wrong most of the time. The other categories are accurate. What's the best immediate step?",
    options: [
      { t: "Define which issue categories to report and which to skip, with an example of each.", why: "Right when the reviewer reports things the team doesn't want at all. Here one category is unreliable." },
      { t: "Turn off the noisiest category for now while its criteria are rewritten.", ok: true, why: "Removing the unreliable category restores trust in the accurate ones while its criteria are fixed." },
      { t: "Require each finding to cite the exact line and state its concrete impact.", why: "Right when findings are vague. These are specific, just wrong." },
      { t: "Add severity levels, with a written criterion for each level.", why: "Right when urgent and minor findings look alike. Here one category is wrong." }
    ]
  },
  {
    id: "h5-6", ts: "4.6", scenario: 5, holdout: true, family: "F32",
    stem: "Human reviewers spend equal time on all 40 findings per PR, though a handful are far shakier than the rest. The team wants human time spent where it matters most. What fits best?",
    options: [
      { t: "Review each file separately, then do one pass on cross-file interactions.", why: "Right when attention spreads thin over many files. Here the findings already exist." },
      { t: "Have a second, independent instance review without the first one's reasoning.", why: "Right when a reviewer checks its own work. Here the issue is where humans spend time." },
      { t: "Have the reviewer give a confidence for each finding to direct human attention.", ok: true, why: "Per-finding confidence lets humans check the uncertain findings first." },
      { t: "Review the whole diff in a single pass, with the PR description as context.", why: "Right for small diffs. It doesn't rank the findings." }
    ]
  },
  {
    id: "h5-7", ts: "4.2", scenario: 5, holdout: true, family: "F34",
    stem: "The reviewer handles clear-cut issues well but is inconsistent on borderline ones, such as whether an unchecked error in a test helper matters. What works best?",
    options: [
      { t: "Add two or three borderline findings as examples, with the reasoning for each.", ok: true, why: "Examples of the hard cases, with the reasoning, show how to judge the borderline." },
      { t: "Write explicit criteria for which categories to report and which to skip.", why: "Right when whole categories are unwanted. Here the problem is borderline judgment within one." },
      { t: "Show an example of the exact output structure for one finding.", why: "Right when the format varies. Here the judgment varies." },
      { t: "Add examples from each of the languages the reviewer covers.", why: "Right when quality differs by language. Here it differs by how clear-cut the case is." }
    ]
  },
  {
    id: "h5-8", ts: "4.5", scenario: 5, holdout: true, family: "F40",
    stem: "The team moved the pre-merge check to the Message Batches API to save 50%. Developers now wait hours for results before they can merge. What fits best?",
    options: [
      { t: "Use the Message Batches API for the nightly audit of every repository.", why: "Right for non-blocking work like nightly audits. A pre-merge check is blocking." },
      { t: "Keep synchronous calls for the pre-merge check that developers wait on.", ok: true, why: "Batches can take up to 24 hours; a check people wait on needs a synchronous response." },
      { t: "Refine the prompt on a sample first, then submit the full batch.", why: "Right before the first large run. The problem here is latency." },
      { t: "Resubmit only the failed requests, matched by their <code>custom_id</code>.", why: "Right after a batch with failures. The problem here is latency." }
    ]
  },
  {
    id: "h5-9", ts: "1.4", scenario: 5, holdout: true, family: "F16",
    stem: "Policy says no AI review may run on code that hasn't passed the secret scanner. The workflow sometimes starts both jobs at once, and the review occasionally reads a leaked key. What fixes this?",
    options: [
      { t: "Have the pipeline block the merge in code when the review reports a blocking issue.", why: "Right when findings are ignored at merge time. The problem here is what runs first." },
      { t: "Add explicit criteria to the review prompt for what counts as blocking.", why: "Right when the review misjudges severity. Here the order of steps is wrong." },
      { t: "Make the secret scan a required step that must pass before the review job starts.", ok: true, why: "A required prerequisite must be enforced in the pipeline, not left to timing." },
      { t: "Post findings as inline comments that cite the file and line.", why: "Right when findings are hard to act on. Here the review shouldn't run yet." }
    ]
  },
  {
    id: "h5-10", ts: "1.6", scenario: 5, holdout: true, family: "F17",
    stem: "Most pull requests touch two or three files. The multi-pass review takes six minutes each, single-pass reviews of diffs this size have been accurate, and the team wants fast feedback. What fits best?",
    options: [
      { t: "Review each changed file in its own pass, then one pass on cross-file interactions.", why: "Right for large diffs where attention spreads thin. Small diffs don't need it." },
      { t: "Review the whole diff in a single pass, with the PR description as context.", ok: true, why: "A small diff fits comfortably in one pass, which gives fast feedback without losing accuracy." },
      { t: "Run separate passes for security, performance and style.", why: "Right when one concern crowds out the others. That hasn't happened at this size." },
      { t: "Review only the files that changed since the last reviewed commit.", why: "Right when re-reviews repeat old findings. Here the problem is speed." }
    ]
  },
  {
    id: "h6-1", ts: "4.2", scenario: 6, holdout: true, family: "F35",
    stem: "One European supplier writes dates like 03/04/25, and the extractor reads them sometimes day-first and sometimes month-first. What works best?",
    options: [
      { t: "Add example documents in each layout, showing where each field is found.", why: "Right when layouts vary. Here one format is ambiguous." },
      { t: "Add an example of a document missing a field, with null as the output.", why: "Right when values are invented for missing fields. The date here is present." },
      { t: "Add an example that shows the reasoning for an ambiguous date.", ok: true, why: "Showing the reasoning (European supplier, so day first) teaches the model how to resolve the ambiguity." },
      { t: "Define each field precisely in the prompt, with its expected format.", why: "Right when the field's meaning is unclear. Here the format is known but read inconsistently." }
    ]
  },
  {
    id: "h6-2", ts: "4.3", scenario: 6, holdout: true, family: "F36",
    stem: "The document type isn't known in advance, and there's one extraction tool per type. Sometimes the model replies in plain text instead of calling any of them. What fixes this?",
    options: [
      { t: "Set <code>tool_choice</code> to <code>\"any\"</code> so a tool call is required.", ok: true, why: "Requiring some tool call guarantees structured output while letting the model pick the right schema. (Exam framing; see Exam vs. today for current model support.)" },
      { t: "Force one tool with <code>tool_choice: {\"type\": \"tool\", \"name\": …}</code>.", why: "Right when one specific tool must run. Here the right tool depends on the document." },
      { t: "Make the fields that may be absent nullable in the schema.", why: "Right when values are invented for absent fields. Here no tool is called." },
      { t: "Add an <code>\"other\"</code> enum value plus a free-text detail field.", why: "Right when real values fall outside the categories. Here no tool is called." }
    ]
  },
  {
    id: "h6-3", ts: "4.4", scenario: 6, holdout: true, family: "F38",
    stem: "Validation fails because <code>tax_id</code> is empty. Checking the source PDF shows the document never contains a tax ID, and two retries made no difference. What's the right next step?",
    options: [
      { t: "Retry, including the specific validation error in the follow-up request.", why: "Right when the value exists but came back in the wrong form. Retries can't find information that isn't there." },
      { t: "Stop retrying and send the document to human review.", ok: true, why: "When the information is missing from the source, a person must resolve it." },
      { t: "Extract both the stated total and a calculated total, and flag mismatches.", why: "Right for checking internal consistency. The problem here is a missing value." },
      { t: "Record a <code>detected_pattern</code> with each flag to see which ones reviewers dismiss.", why: "Right for learning from reviewer dismissals. This is a single missing value." }
    ]
  },
  {
    id: "h6-4", ts: "4.4", scenario: 6, holdout: true, family: "F39",
    stem: "Totals taken from the invoice summary box sometimes don't match the line items. Nobody notices until finance reconciles at month end. What fits best?",
    options: [
      { t: "Retry with the validation error and the original document in the follow-up.", why: "Right when a known error needs correcting. Here nothing detects the error." },
      { t: "Extract the line items, the stated total and a calculated total, then compare them.", ok: true, why: "Extracting both totals lets the pipeline catch inconsistencies on its own." },
      { t: "Make the field nullable so the model can report that a value is absent.", why: "Right when values are absent. Here they're present but inconsistent." },
      { t: "Record a <code>detected_pattern</code> with each flag to see which ones reviewers dismiss.", why: "Right for analyzing dismissals. Here the error goes unnoticed." }
    ]
  },
  {
    id: "h6-5", ts: "4.5", scenario: 6, holdout: true, family: "F41",
    stem: "A 50,000-document batch has finished: 600 requests errored and the rest succeeded. The team plans to rerun all 50,000. What fits best?",
    options: [
      { t: "Submit all 50,000 documents through the Message Batches API.", why: "That reprocesses 49,400 documents that already succeeded." },
      { t: "Resubmit only the failed documents, matched by their <code>custom_id</code>.", ok: true, why: "Rerun only what failed; <code>custom_id</code> ties each result to its document." },
      { t: "Run the prompt on a sample of a few hundred, refine it, then batch the rest.", why: "Right for an untested prompt. This one has already run." },
      { t: "Process documents synchronously as they arrive.", why: "Right when results are needed immediately. This is a bulk rerun." }
    ]
  },
  {
    id: "h6-6", ts: "4.6", scenario: 6, holdout: true, family: "F33",
    stem: "Extraction from 60-page contracts misses clauses that appear late in the document. Short contracts are extracted accurately. What fits best?",
    options: [
      { t: "Have a second instance, without the first one's reasoning, re-extract a sample to compare.", why: "Right when an extractor confirms its own errors. Here attention fades over a long document." },
      { t: "Have the model report confidence per field and send low-confidence fields to people.", why: "Right for directing human review. The missed clauses would still be missed." },
      { t: "Check that the totals add up, and retry with the error when they don't.", why: "Right for values a rule can check. Missing clauses aren't caught by arithmetic." },
      { t: "Split long documents into sections, extract from each, then merge the results.", ok: true, why: "Smaller passes keep attention on each section, and a merge step combines them." }
    ]
  },
  {
    id: "h6-7", ts: "4.1", scenario: 6, holdout: true, family: "F31",
    stem: "The extractor labels auto-renewal and notice-period clauses as “termination clauses.” The legal team means only clauses that allow early exit. What fixes this?",
    options: [
      { t: "Define exactly what counts as a “termination clause,” with included and excluded examples.", ok: true, why: "Explicit criteria with edge examples tell the model where the category's boundary is." },
      { t: "Make the field nullable, and return null when the document doesn't contain one.", why: "Right when values are invented for absent fields. Here a real clause is mislabeled." },
      { t: "Add a field where the model explains how it arrived at each value.", why: "Right when you need to audit reasoning. It won't change where the boundary is." },
      { t: "Require a page and section reference for every extracted value.", why: "Right when reviewers can't find the source. Here the category itself is misunderstood." }
    ]
  },
  {
    id: "h6-8", ts: "4.3", scenario: 6, holdout: true, family: "F37",
    stem: "Some contracts have no renewal date. In those cases the extractor fills in a plausible-looking date anyway. What fixes this?",
    options: [
      { t: "Make the fields that may be absent nullable in the schema.", ok: true, why: "If the schema requires a value, the model invents one; nullable lets it say “absent.”" },
      { t: "Add an <code>\"other\"</code> enum value with a free-text detail field.", why: "Right when real values fall outside the categories. Here there's no value at all." },
      { t: "Define the output with a strict JSON schema in the tool definition.", why: "Right for syntax errors. The output here is valid but invented." },
      { t: "Add a validation step that checks the values against business rules.", why: "Right for checkable rules. A plausible invented date passes most of them." }
    ]
  },
  {
    id: "h6-9", ts: "5.5", scenario: 6, holdout: true, family: "F60",
    stem: "Overall accuracy is 97%, so the team plans to stop human review entirely. Nobody has looked at accuracy by document type. What should happen first?",
    options: [
      { t: "Calibrate the confidence threshold on a labeled sample before relying on it.", why: "Right when confidence scores aren't yet tied to accuracy. The gap here is in how accuracy is measured." },
      { t: "Keep sampling high-confidence extractions for ongoing spot checks.", why: "Right after automation, to catch drift. First check what the 97% hides." },
      { t: "Route fields below the confidence threshold to human review.", why: "Right once thresholds are calibrated. First check where the errors are." },
      { t: "Break accuracy down by document type and field, not just overall.", ok: true, why: "An overall rate can hide document types that fail badly." }
    ]
  },
  {
    id: "h6-10", ts: "5.6", scenario: 6, holdout: true, family: "F58",
    stem: "Two invoices for the same order show different totals. The pipeline keeps whichever one it read last. What fits best?",
    options: [
      { t: "Store each value with its document, page and the quoted source text.", why: "Right when values can't be traced. Here two traceable values conflict." },
      { t: "Keep both values and flag the conflict for review, instead of choosing one.", ok: true, why: "Surface the conflict, with both values and their sources, instead of silently choosing." },
      { t: "Record the document version and date alongside each extracted value.", why: "Right when values change across versions. These are two different documents." },
      { t: "Route low-confidence values to a person for review.", why: "Right for uncertain values. Both values here were read clearly." }
    ]
  }
);
