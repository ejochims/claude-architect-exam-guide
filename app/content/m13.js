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
<li><strong>Field-level confidence, calibrated.</strong> Have the model output a confidence for each field, then set review thresholds using a <strong>labeled validation set</strong>. Raw scores mean nothing until calibrated. Raw scores aren't probabilities until calibrated: a 0.9 may not mean 90% correct.</li>
<li><strong>Stratified random sampling.</strong> Even after automating, keep sampling high-confidence extractions across segments to measure error rates and catch new error patterns.</li>
<li><strong>Route the right items to people.</strong> Send low-confidence fields and ambiguous or contradictory source documents to reviewers first, so limited capacity goes where it matters.</li>
</ul>
<div class="callout note"><div class="callout-label">Confidence: when it's fine</div><p>Raw self-rated confidence as an <em>escalation trigger</em> is a trap. Field-level confidence <em>calibrated against labeled data</em> and used to <em>prioritize review</em> is good practice. The difference is calibration.</p></div>

<!-- panel:m13-calibration -->
<div class="callout key"><div class="callout-label">Calibration, worked (illustrative numbers)</div><ul style="margin:0;padding-left:18px"><li><strong>Label a sample.</strong> have people check 200 extracted fields by hand.</li><li><strong>Bucket by confidence.</strong> confidence 0.9 and above: 147 of 150 correct (98%); 0.8 to 0.9: 28 of 30 (93%); below 0.8: 12 of 20 (60%).</li><li><strong>Pick the threshold.</strong> if review must catch everything below 95% accuracy, route fields under 0.9 to people. Re-measure as documents change.</li><li><strong>Stratified sampling.</strong> sample separately inside each segment, such as document type or field, so rare segments are represented. One random sample is dominated by the common case and can hide a segment that fails badly.</li></ul></div>
<!-- ex:m13-routing -->
<h3>What a routed field looks like</h3>
<p>Each extracted value carries its confidence and its source, so a reviewer can check it quickly:</p>
<pre class="code"><code>{<span class="s">"field"</span>: <span class="s">"renewal_date"</span>, <span class="s">"value"</span>: <span class="s">"2027-01-31"</span>,
 <span class="s">"confidence"</span>: <span class="k">0.62</span>,                          <span class="c"># below the 0.80 threshold calibrated on labeled data</span>
 <span class="s">"source"</span>: {<span class="s">"doc"</span>: <span class="s">"MSA-2291.pdf"</span>, <span class="s">"page"</span>: <span class="k">14</span>,
            <span class="s">"quote"</span>: <span class="s">"renews automatically on 31 January 2027"</span>},
 <span class="s">"route"</span>: <span class="s">"human_review"</span>}</code></pre>`
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
</ul>
<!-- ex:m13-conflict -->
<h3>What preserved provenance looks like</h3>
<p>Each claim keeps its sources and dates through synthesis, and a conflict is shown, not averaged away:</p>
<pre class="code"><code>{<span class="s">"claim"</span>: <span class="s">"Share of hospitals using AI triage"</span>,
 <span class="s">"values"</span>: [
   {<span class="s">"value"</span>: <span class="s">"38%"</span>, <span class="s">"source"</span>: <span class="s">"HIMSS survey"</span>, <span class="s">"url"</span>: <span class="s">"https://…"</span>, <span class="s">"date"</span>: <span class="s">"2025-09"</span>},
   {<span class="s">"value"</span>: <span class="s">"52%"</span>, <span class="s">"source"</span>: <span class="s">"KLAS report"</span>,  <span class="s">"url"</span>: <span class="s">"https://…"</span>, <span class="s">"date"</span>: <span class="s">"2025-11"</span>}
 ],
 <span class="s">"status"</span>: <span class="s">"conflict"</span>}                        <span class="c"># report both, with attribution</span></code></pre>`
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q13-1", ts: "5.2", scenario: 1,
          stem: "A customer writes, “I need to speak to a human, please.” Their issue (updating a billing email) is something the agent can do in seconds. What should the agent do?",
          options: [
            { t: "Escalate to a human immediately.", ok: true, why: "Honor an explicit request for a human without investigating or resolving first." },
            { t: "Update the billing email first, since it takes seconds, then offer the transfer if they still want it.", why: "Overrides an explicit request. Speed doesn't change what the customer asked for." },
            { t: "Explain that the agent can handle this right now, and escalate only if they ask a second time.", why: "That's the approach for frustration, not for an explicit request for a person." },
            { t: "Ask a few diagnostic questions first, so the handoff to the human agent is more complete.", why: "Delays the transfer the customer explicitly asked for." }
          ]
        },
        {
          id: "q13-2", ts: "5.2", scenario: 1,
          stem: "A customer writes angrily that their order is late “AGAIN.” They haven't asked for a person. The agent can see the package arrives tomorrow and a delay credit is within policy. Best response?",
          options: [
            { t: "Escalate to a human right away, because the customer's sentiment is strongly negative.", trap: "T4", why: "Anger isn't complexity, and they haven't asked for a person." },
            { t: "Acknowledge the frustration, give the arrival date and apply the credit.", ok: true, why: "Resolve what's within the agent's ability while acknowledging how the customer feels." },
            { t: "Reply neutrally with the tracking link and arrival date, keeping the response short and factual.", why: "Ignores the frustration and misses the credit that's within policy." },
            { t: "Ask them to rate their frustration from 1 to 10 first, so the agent can match its tone.", why: "Adds friction and solves nothing." }
          ]
        },
        {
          id: "q13-3", ts: "5.2", scenario: 1,
          stem: "A customer asks to be reimbursed for a taxi they took because a delivery window was missed. Policy covers refunds and redelivery but says nothing about incidental expenses. What should the agent do?",
          options: [
            { t: "Deny it, since incidental expenses aren't listed among the covered remedies.", why: "Silence in the policy isn't a denial; a human should decide." },
            { t: "Approve a reasonable amount, such as up to $40, to keep the customer happy.", why: "Improvises policy the agent isn't authorized to set." },
            { t: "Escalate to a human, since policy covers refunds and redelivery but says nothing about expenses like this.", ok: true, why: "Policy gaps are a valid escalation trigger." },
            { t: "Offer redelivery, which policy covers, and leave the taxi request unaddressed.", why: "Ignores what the customer actually asked for." }
          ]
        },
        {
          id: "q13-4", ts: "5.2", scenario: 1,
          stem: "<code>get_customer(\"Chris Lee\")</code> returns three accounts. The agent picks the one with the most recent order and processes a refund. What should it do instead?",
          options: [
            { t: "Ask the customer for a second identifier like an email or order number and wait for it.", ok: true, why: "Multiple matches need clarification, not a heuristic choice." },
            { t: "Pick the account with the highest lifetime value, since that customer is the most likely caller.", why: "Still a guess, and wrong guesses act on someone else's account." },
            { t: "Pick the account whose location matches the caller's IP address and continue the refund.", why: "Another heuristic. Ask the customer instead." },
            { t: "Escalate every multiple-match case to a human agent, since identity is involved.", why: "Overkill. A clarifying question resolves it." }
          ]
        },
        {
          id: "q13-5", ts: "5.2", scenario: 1,
          stem: "Which is the most appropriate escalation trigger for a support agent?",
          options: [
            { t: "The customer's sentiment score drops below −0.6 on the analytics model.", trap: "T4", why: "Sentiment doesn't measure complexity." },
            { t: "The model's raw self-rated confidence in its answer falls below 6 out of 10.", trap: "T4", why: "Uncalibrated self-ratings don't track case difficulty." },
            { t: "The agent still can't make meaningful progress after a few focused attempts.", ok: true, why: "Inability to progress is a valid trigger, alongside explicit requests and policy gaps." },
            { t: "The conversation passes 10 turns without the customer confirming a resolution.", why: "Length doesn't measure difficulty; some complex cases take 20 productive turns." }
          ]
        },
        {
          id: "q13-6", ts: "5.5", scenario: 6,
          stem: "An extraction pipeline is 97% accurate across 20,000 documents. Leadership proposes removing human review for high-confidence extractions. What should you do first?",
          options: [
            { t: "Break the 97% down by document type and by field before deciding.", ok: true, why: "An aggregate can hide weak segments. Validate per segment before cutting review." },
            { t: "Approve the change, since 97% exceeds the 95% accuracy target agreed with leadership.", why: "97% overall can include 80% on one document type or critical field." },
            { t: "Raise the confidence threshold to 0.99 so only near-certain extractions skip review.", why: "A threshold isn't meaningful until confidence is calibrated and segments are checked." },
            { t: "Run the pipeline twice on the same 20,000 documents and compare the two sets of outputs.", why: "Measures consistency, not accuracy." }
          ]
        },
        {
          id: "q13-7", ts: "5.5", scenario: 6,
          stem: "You've automated high-confidence extractions. How do you keep measuring the error rate and detect new error patterns?",
          options: [
            { t: "Stratified random sampling of high-confidence extractions across document types and fields.", ok: true, why: "Measures error rates where review was removed and catches new error patterns." },
            { t: "Review only the low-confidence extractions from now on, since that's where errors concentrate.", why: "Never checks the automated, high-confidence stream." },
            { t: "Rely on downstream teams to report extraction errors through the existing ticket queue.", why: "Reactive, and many errors go unnoticed." },
            { t: "Review the first 100 extractions each month as a quick quality check.", why: "Not random or stratified, so it can miss whole segments." }
          ]
        },
        {
          id: "q13-8", ts: "5.5", scenario: 6,
          stem: "Reviewers can check 300 of 5,000 daily extractions. How should you choose which ones?",
          options: [
            { t: "Low calibrated field confidence, plus ambiguous or contradictory sources.", ok: true, why: "Calibrated confidence and source ambiguity route scarce reviewer time to likely errors." },
            { t: "A uniform random 300 each day, so every extraction has the same chance of being reviewed.", why: "Good for measuring error rates, but wastes scarce capacity on easy cases." },
            { t: "The 300 longest documents each day, since longer documents contain more fields to get wrong.", why: "Length is a weak proxy for error risk." },
            { t: "Whatever the model flags, using its raw self-reported confidence with a 0.5 cutoff.", trap: "T4", why: "Uncalibrated, the cutoff doesn't track actual error risk." }
          ]
        },
        {
          id: "q13-9", ts: "5.6", scenario: 3,
          stem: "Two credible industry reports give different market-share figures for the same segment and year. What should the synthesis do?",
          options: [
            { t: "Use the more recent report's figure, since newer data usually supersedes older data.", why: "Recency doesn't settle disagreement between credible sources for the same year." },
            { t: "Average the two figures and report the result as a single best estimate.", why: "Creates a number neither source supports." },
            { t: "Include both figures with their sources and add a note explaining the conflict.", ok: true, why: "Preserve conflicting values with attribution; don't resolve them arbitrarily." },
            { t: "Leave the figure out of the report to avoid presenting contradictory data.", why: "Hides information the reader needs." }
          ]
        },
        {
          id: "q13-10", ts: "5.6", scenario: 3,
          stem: "The synthesis flagged “contradictory” telehealth adoption rates: 22% and 58%. They're from 2019 and 2024 studies. What upstream change prevents this?",
          options: [
            { t: "Require subagents to include publication or collection dates in their structured outputs.", ok: true, why: "With dates attached, different time periods aren't mistaken for contradictions." },
            { t: "Tell the synthesis agent to discard any source older than three years before comparing figures.", why: "Throws away the trend the two figures show." },
            { t: "Allow only one source per statistic, so apparent contradictions can't arise.", why: "Hides real disagreements and reduces coverage." },
            { t: "Have the synthesis average the 22% and 58% rates into one adoption figure.", why: "Meaningless across different years." }
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
