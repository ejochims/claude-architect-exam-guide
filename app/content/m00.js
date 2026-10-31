window.LESSONS.m00 = {
  cards: [
    { f: "Exam format?", b: "About 60 questions (unofficial count), 120 minutes, scaled 100–1000, pass at 720. 4 of 6 scenarios drawn. No penalty for guessing." },
    { f: "Four moves for reading a question?", b: "Find the evidence → name the root cause → classify the constraint (guarantee vs judgment) → pick the proportionate fix." },
    { f: "What does \u201cmost effective first step\u201d signal?", b: "The cheap, targeted fix for the root cause, not new infrastructure." }
  ],
  steps: [
    {
      kind: "read",
      title: "What you’re walking into",
      html: `
<p class="lede">The exam gives you <strong>120 minutes</strong> for roughly 60 scenario-based questions. Each has one best answer and three distractors written to tempt someone with partial experience. Results are a scaled score from 100 to 1,000, and you need <strong>720</strong> to pass. Unanswered questions count as wrong and there's no penalty for guessing, so answer everything.</p>
<div class="callout note"><div class="callout-label">Logistics, verified Oct 2026</div><p>Official: 120 minutes; scaled 100–1,000 with 720 to pass; $125 per attempt; open to Claude Partner Network members (free to join), booked through the Partner Academy and delivered by Pearson VUE; up to 4 attempts in 12 months; the certification is valid for 12 months. <strong>Unofficial:</strong> the 60-question count comes from third-party reports. <strong>Check before booking:</strong> the current certification FAQ mentions multiple-response questions, which the exam guide (v0.1) doesn't, and Anthropic may publish an updated guide. Sources: <a href="https://anthropic-partners.skilljar.com/page/faq-certifications" target="_blank" rel="noopener">certification FAQ</a>, <a href="https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification" target="_blank" rel="noopener">exam page</a>.</p></div>
<div class="callout key"><div class="callout-label">When to book</div><p>Book when three things are true: a cold first attempt at the Readiness Check scores 80% or more, with every domain at 70% or more; two mock exams a week apart score 80% or more; and the official practice exam scores 80% or more. Practice-question scores alone aren't enough, because you've seen those questions and their explanations.</p></div>
<p>Every question sits inside a production scenario. Your sitting draws <strong>4 of these 6</strong> at random, so you need all six:</p>
<div data-embed="scenarios"></div>
<p>Questions map to five weighted domains. Agentic architecture (27%) and Claude Code (20%, tied with prompt engineering) together make up almost half the exam:</p>
<div data-embed="weights"></div>
<div class="callout note"><div class="callout-label">About two minutes per question</div><p>That's enough time to reason, but not enough to rebuild the whole topic from memory. This course drills the reasoning patterns until they're automatic.</p></div>`
    },
    {
      kind: "read",
      title: "How to read a question",
      html: `
<p class="lede">Almost every question is the same shape: a symptom appears in production, and you choose the change that fixes it. Work through four moves:</p>
<ol class="moves">
  <li><strong>Find the evidence.</strong> The stem usually contains the diagnosis: a log excerpt, a percentage, which component succeeded. Read it as an engineer reads an incident report.</li>
  <li><strong>Name the root cause.</strong> Is it missing context, a bad interface (tool or schema), a vague prompt, or missing programmatic enforcement?</li>
  <li><strong>Classify the constraint.</strong> Does this behavior need a <em>guarantee</em> (money, identity, compliance, irreversible actions) or <em>good judgment</em> (tone, choosing among options)? Guarantees belong in code; judgment belongs in prompts, descriptions and examples.</li>
  <li><strong>Pick the proportionate fix.</strong> Prefer the lowest-effort change that removes the root cause. Watch the qualifier: <em>“most effective first step”</em> means the cheap targeted fix; <em>“most reliable”</em> for a hard rule means code.</li>
</ol>
<div class="callout key"><div class="callout-label">The one idea underneath everything</div><p>Ask where responsibility should live. The model is good at interpreting language, choosing among well-described options and synthesizing evidence. Code is responsible for permissions, thresholds, ordering, retries, validation and audit trails.</p></div>
<p class="small">You'll practice these patterns in the capstone (Module 14), once you've learned the material they're built from.</p>`
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "About 60 questions (unofficial count), 120 minutes, pass at 720 of 1000. Guess rather than skip.",
        "4 of 6 scenarios appear. Prepare all six.",
        "Read the stem as an incident report: evidence → root cause → constraint type → proportionate fix.",
        "Guarantees go in code; judgment goes in prompts, descriptions and examples.",
        "“First step” means the cheap fix that targets the root cause, not new infrastructure.",
        "Nine traps (you'll drill them in the capstone, Module 14): prompt-for-guarantee, over-built, bigger model, unreliable proxy, consolidate, hide/hammer errors, wrong component, invented feature, try-harder exhortations."
      ]
    }
  ]
};
