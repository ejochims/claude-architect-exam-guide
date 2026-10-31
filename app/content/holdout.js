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
      { t: "Raise <code>max_tokens</code>, and continue the turn when <code>stop_reason</code> is <code>max_tokens</code>.", ok: true, why: "<code>max_tokens</code> means the reply was truncated, not finished. Give it room and continue instead of returning a partial answer." }
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
      { t: "Set <code>tool_choice</code> to <code>\"any\"</code> so the model must call one of the extraction tools.", ok: true, why: "Requiring some tool call guarantees structured output while letting the model pick the right schema. (Exam framing; see Exam vs. today for current model support.)" },
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
