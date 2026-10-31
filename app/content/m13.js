window.LESSONS.m13 = {
  cards: [
    { f: "Three valid escalation triggers?", b: "The customer explicitly asks for a human; policy is ambiguous or silent on the request (or an exception is needed); the agent can't make meaningful progress." },
    { f: "Customer demands a human for a simple issue. What does the agent do?", b: "Escalate immediately. Don't investigate first or try to talk them out of it." },
    { f: "Frustrated customer, simple issue, no request for a human?", b: "Acknowledge the frustration and offer the resolution. Escalate if they reiterate that they want a person." },
    { f: "Why not escalate on sentiment or self-rated confidence?", b: "Sentiment doesn't measure complexity, and raw self-rated confidence isn't calibrated to case difficulty. (Calibrated field-level confidence is fine for prioritizing human review: task 5.5.)" },
    { f: "Lookup returns three matching customers?", b: "Ask for an additional identifier. Never pick by heuristic." },
    { f: "97% overall accuracy. Safe to cut human review?", b: "Not yet. Check accuracy by document type and field first, then keep stratified random sampling of high-confidence output." },
    { f: "Two credible sources give different statistics?", b: "Keep both with attribution and annotate the conflict. Include dates so time differences aren't mistaken for contradictions." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: human attention is scarce",
      html: `
<p class="lede">Humans are the most expensive, most trusted part of the system. Route work to them when it changes the outcome: a customer's request, a policy gap, or a case the agent can't progress. A vague sense of difficulty isn't a trigger.</p>
<h3>When to escalate</h3>
<ul>
<li><strong>The customer explicitly asks for a human.</strong> Honor it immediately, without investigating first or trying to talk them out of it.</li>
<li><strong>Policy is ambiguous or silent</strong> on this specific request, or an exception is needed. A gap in policy isn't permission to improvise.</li>
<li><strong>The agent can't make meaningful progress.</strong></li>
</ul>
<p>Two situations look alike but are handled differently. A customer who <em>demands</em> a person gets one. A customer who is <em>frustrated</em> about a simple problem the agent can solve gets acknowledgement and an offer to fix it now, and is escalated if they say again that they want a person.</p>
<h3>Signals that don't work</h3>
<ul>
<li><strong>Sentiment.</strong> Anger isn't complexity. A furious customer with a tracking question is a simple case.</li>
<li><strong>Raw self-reported confidence</strong> (“rate yourself 1–10”) as a measure of case complexity. Uncalibrated, it doesn't reliably separate the cases the agent is mishandling from the ones it handles well, so it's a poor escalation trigger.</li>
</ul>
<p>The proportionate fix for miscalibrated escalation is <strong>explicit escalation criteria in the system prompt with few-shot examples</strong> of escalate versus resolve. Try that before building classifiers.</p>
<p>When a lookup returns <strong>several matching customers</strong>, ask for another identifier (email, order number, postal code). Never choose by heuristic.</p>`
    },
    {
      kind: "widget",
      title: "Triage the conversation",
      intro: "Choose what the support agent should do.",
      widget: "sorter",
      config: {
        cats: [{ id: "now", label: "Escalate now" }, { id: "resolve", label: "Resolve it" }, { id: "ask", label: "Ask for an identifier" }, { id: "gap", label: "Escalate: policy gap" }],
        items: [
          ["“I want to talk to a person.” The issue is a simple address change.", "now", "An explicit request is honored immediately."],
          ["“This is the third time my package is late!!” Tracking shows it arrives tomorrow; a delay credit is within policy.", "resolve", "Acknowledge the frustration and resolve. Escalate only if they ask again."],
          ["get_customer returns 3 accounts named “M. Okafor”.", "ask", "Request an email or order number. Never guess."],
          ["Customer wants the gift-wrap fee refunded because the wrapping was torn; policy covers product refunds only.", "gap", "Policy is silent on this request, so escalate rather than improvise."],
          ["Standard damaged-item replacement with photo evidence attached.", "resolve", "Clearly within policy. Escalating it lowers first-contact resolution."]
        ]
      }
    },
    {
      kind: "read",
      title: "Human review and confidence calibration",
      html: `
<p class="lede">For extraction at scale, the question is which outputs a human should check, and how you know the rest are safe.</p>
<ul>
<li><strong>Aggregate accuracy hides weak segments.</strong> 97% overall can include 80% on handwritten forms or one critical field. Validate accuracy <strong>by document type and by field</strong> before reducing review.</li>
<li><strong>Field-level confidence, calibrated.</strong> Have the model output a confidence for each field, then set review thresholds using a <strong>labeled validation set</strong>. Raw scores mean nothing until calibrated.</li>
<li><strong>Stratified random sampling.</strong> Even after automating, keep sampling high-confidence extractions across segments to measure error rates and catch new error patterns.</li>
<li><strong>Route the right items to people.</strong> Send low-confidence fields and ambiguous or contradictory source documents to reviewers first, so limited capacity goes where it matters.</li>
</ul>
<div class="callout note"><div class="callout-label">Confidence: when it's fine</div><p>Raw self-rated confidence as an <em>escalation trigger</em> is a trap. Field-level confidence <em>calibrated against labeled data</em> and used to <em>prioritize review</em> is good practice. The difference is calibration.</p></div>`
    },
    {
      kind: "widget",
      title: "What the 97% hides",
      intro: "Leadership wants to stop human review because overall accuracy is 97%. Break the number down.",
      widget: "segmentReveal"
    },
    {
      kind: "read",
      title: "Provenance across synthesis",
      html: `
<p class="lede">Every time findings are summarized, attribution is at risk. A synthesis that can't say where a claim came from can't be trusted or checked.</p>
<ul>
<li><strong>Structured claim–source mappings.</strong> Subagents output each claim with its source URL or document name, location and the relevant excerpt, and downstream agents must preserve and merge these mappings.</li>
<li><strong>Conflicts are information.</strong> When two credible sources disagree, keep both values with attribution and annotate the conflict. The analysis agent reports it; the coordinator decides how to reconcile it.</li>
<li><strong>Dates prevent false contradictions.</strong> “34% adoption” (2021) and “61% adoption” (2025) describe a trend, not a conflict, but only if publication or collection dates travel with the claims.</li>
<li><strong>Separate established from contested</strong> in the report, and keep the original sources' characterizations and methodological context.</li>
<li><strong>Render content by type</strong>: financial data as tables, news as prose, technical findings as structured lists.</li>
</ul>`
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q13-1", ts: "5.2", scenario: 1,
          stem: "A customer writes, “I need to speak to a human, please.” Their issue (updating a billing email) is something the agent can do in seconds. What should the agent do?",
          options: [
            { t: "Escalate to a human immediately.", ok: true, why: "Explicit requests for a human are honored right away." },
            { t: "Fix the email first, then offer a human if they still want one.", why: "This overrides the customer's explicit choice." },
            { t: "Explain that the agent can handle it, and only escalate if they insist twice.", why: "That's the pattern for frustration, not for an explicit request." },
            { t: "Ask diagnostic questions to prepare a better handoff.", why: "Investigating before honoring an explicit request delays them." }
          ]
        },
        {
          id: "q13-2", ts: "5.2", scenario: 1,
          stem: "A customer writes angrily that their order is late “AGAIN.” They haven't asked for a person. The agent can see the package arrives tomorrow and a delay credit is within policy. Best response?",
          options: [
            { t: "Escalate to a human right away, because the customer's sentiment is strongly negative.", trap: "T4", why: "Sentiment isn't complexity." },
            { t: "Acknowledge the frustration, give the arrival date and apply the credit; escalate if they ask for a person.", ok: true, why: "Resolve what's within capability, and keep the door open." },
            { t: "Respond neutrally with the tracking information only.", why: "This ignores both the frustration and the available remedy." },
            { t: "Ask them to rate their frustration from 1 to 10 first so the agent can calibrate its tone.", why: "Unhelpful friction." }
          ]
        },
        {
          id: "q13-3", ts: "5.2", scenario: 1,
          stem: "A customer asks to be reimbursed for a taxi they took because a delivery window was missed. Policy covers refunds and redelivery but says nothing about incidental expenses. What should the agent do?",
          options: [
            { t: "Deny it, since it isn't in policy.", why: "Silence in policy isn't a prohibition. A human should decide." },
            { t: "Approve a reasonable amount to keep the customer happy.", why: "This improvises policy with real money." },
            { t: "Escalate, because policy is silent on this specific request.", ok: true, why: "Policy gaps are a valid escalation trigger." },
            { t: "Offer redelivery and ignore the taxi request.", why: "This drops part of the request." }
          ]
        },
        {
          id: "q13-4", ts: "5.2", scenario: 1,
          stem: "<code>get_customer(\"Chris Lee\")</code> returns three accounts. The agent picks the one with the most recent order and processes a refund. What should it do instead?",
          options: [
            { t: "Ask the customer for an additional identifier (email, order number, postal code) before acting.", ok: true, why: "Multiple matches need clarification, not heuristic selection." },
            { t: "Pick the account with the highest lifetime value, since it's most likely the caller.", why: "Also a heuristic, and still a guess." },
            { t: "Process the refund on all three accounts to be safe.", why: "This creates financial errors." },
            { t: "Escalate every multiple-match case to a human.", why: "Overkill. One clarifying question resolves it." }
          ]
        },
        {
          id: "q13-5", ts: "5.2", scenario: 1,
          stem: "Which is the most appropriate escalation trigger for a support agent?",
          options: [
            { t: "The customer's sentiment score drops below a threshold.", trap: "T4", why: "Unreliable proxy." },
            { t: "The model's self-rated confidence falls below 6 out of 10.", trap: "T4", why: "Poorly calibrated." },
            { t: "The agent can't make meaningful progress after targeted attempts.", ok: true, why: "One of the blueprint's explicit triggers, alongside customer requests and policy gaps." },
            { t: "The conversation goes past 10 turns.", why: "Length doesn't measure need." }
          ]
        },
        {
          id: "q13-6", ts: "5.5", scenario: 6,
          stem: "An extraction pipeline is 97% accurate across 20,000 documents. Leadership proposes removing human review for high-confidence extractions. What should you do first?",
          options: [
            { t: "Check accuracy by document type and by field to confirm performance is consistent.", ok: true, why: "Aggregate accuracy can mask poor performance on specific types or fields." },
            { t: "Approve the change, since 97% is above the accuracy target.", why: "The aggregate may hide a 75% segment." },
            { t: "Raise the confidence threshold to 0.99 so only near-certain extractions skip review.", why: "This is uncalibrated, and still doesn't check segments." },
            { t: "Run the pipeline twice on the same documents and compare.", why: "Consistency isn't accuracy." }
          ]
        },
        {
          id: "q13-7", ts: "5.5", scenario: 6,
          stem: "You've automated high-confidence extractions. How do you keep measuring the error rate and detect new error patterns?",
          options: [
            { t: "Stratified random sampling of high-confidence extractions across document types and fields.", ok: true, why: "It measures ongoing error rates and surfaces novel patterns." },
            { t: "Review only the low-confidence extractions going forward.", why: "Errors in the high-confidence group go unseen." },
            { t: "Rely on downstream teams to report errors when they find them.", why: "This is reactive and biased." },
            { t: "Review the first 100 extractions each month.", why: "Not random and not stratified." }
          ]
        },
        {
          id: "q13-8", ts: "5.5", scenario: 6,
          stem: "Reviewers can check 300 of 5,000 daily extractions. How should you choose which ones?",
          options: [
            { t: "Send low calibrated field-confidence extractions, and ambiguous or contradictory sources, to reviewers first.", ok: true, why: "This puts limited capacity where errors are likeliest." },
            { t: "Pick a uniform random 300 so every extraction has an equal chance of review.", why: "Useful for measurement, but it wastes capacity on easy cases." },
            { t: "Review the 300 longest documents, since they're most likely to contain errors.", why: "Length is a weak proxy." },
            { t: "Review whatever the model flags using its raw self-reported confidence.", trap: "T4", why: "It must be calibrated against labeled data first." }
          ]
        },
        {
          id: "q13-9", ts: "5.6", scenario: 3,
          stem: "Two credible industry reports give different market-share figures for the same segment and year. What should the synthesis do?",
          options: [
            { t: "Pick the more recent report's figure.", why: "Both are the same year, and choosing hides the disagreement." },
            { t: "Average the two figures into one estimate.", why: "This invents a number neither source reports." },
            { t: "Include both, each with its source, and annotate the conflict.", ok: true, why: "Preserve the conflict and let the reader or coordinator weigh the sources." },
            { t: "Leave the figure out of the report entirely.", why: "This loses information the reader needs." }
          ]
        },
        {
          id: "q13-10", ts: "5.6", scenario: 3,
          stem: "The synthesis flagged “contradictory” telehealth adoption rates: 22% and 58%. They're from 2019 and 2024 studies. What upstream change prevents this?",
          options: [
            { t: "Require subagents to include publication or collection dates in their structured outputs.", ok: true, why: "Dates let synthesis read trends correctly instead of seeing contradictions." },
            { t: "Tell the synthesis agent to ignore sources older than a few years.", why: "This loses the trend." },
            { t: "Use only one source per statistic to avoid apparent contradictions.", why: "Arbitrary, and it loses corroboration." },
            { t: "Average the two rates to report a single adoption figure.", why: "Meaningless." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Escalate on an explicit request (immediately), on policy gaps or exceptions, and when no progress is possible.",
        "Frustrated but solvable: acknowledge, resolve, and escalate if they ask again.",
        "Sentiment and raw self-confidence are unreliable triggers. Use explicit criteria plus few-shot examples.",
        "Multiple matches: ask for another identifier.",
        "Validate by segment before cutting review; calibrate field confidence on labeled data; keep stratified sampling.",
        "Preserve claim–source mappings, annotate conflicts, carry dates, and separate established from contested findings."
      ]
    }
  ]
};
