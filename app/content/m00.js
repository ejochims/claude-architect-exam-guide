window.LESSONS.m00 = {
  cards: [
    { f: "Exam format?", b: "60 multiple-choice questions, 120 minutes, scaled 100–1000, pass at 720. 4 of 6 scenarios drawn. No penalty for guessing." },
    { f: "Four moves for reading a question?", b: "Find the evidence → name the root cause → classify the constraint (guarantee vs judgment) → pick the proportionate fix." },
    { f: "What does \u201cmost effective first step\u201d signal?", b: "The cheap, targeted fix for the root cause, not new infrastructure." },
    { f: "Name the nine traps.", b: "Prompt where code is needed; over-built first step; bigger model or window; unreliable proxy; consolidate everything; hide or hammer the error; fix the wrong component; feature that doesn't exist; just tell it to try harder." }
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
<p>Questions map to five weighted domains. The two heaviest, agentic architecture and Claude Code, make up almost half the exam:</p>
<div data-embed="weights"></div>
<div class="callout note"><div class="callout-label">Two minutes per question</div><p>That's enough time to reason, but not enough to rebuild the whole topic from memory. This course drills the reasoning patterns until they're automatic.</p></div>`
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
<div class="callout key"><div class="callout-label">The one idea underneath everything</div><p>Ask where responsibility should live. The model is good at interpreting language, choosing among well-described options and synthesizing evidence. Code is responsible for permissions, thresholds, ordering, retries, validation and audit trails.</p></div>`
    },
    {
      kind: "widget",
      title: "Know the nine traps",
      intro: "Distractors aren't random. Nearly all of them fall into nine recurring patterns. Learn to name the pattern and you can eliminate options in seconds.",
      widget: "trapSpotter"
    },
    {
      kind: "quiz",
      title: "Check your reasoning",
      questions: [
        {
          id: "q00-1", ts: "2.1",
          stem: "An IT-helpdesk agent's <code>get_account</code> tool takes an <code>account_id</code> such as <code>AC-00418822</code>. Its description is detailed, yet the agent often passes users' email addresses into <code>account_id</code>, and the calls fail. What is the most effective first step?",
          options: [
            { t: "Train a small classifier that rewrites emails into <code>account_id</code> values before each call reaches the backend.", trap: "T2", why: "New infrastructure before the cheap fix: tell the model what the parameter expects." },
            { t: "Describe the parameter's format, and say to call <code>find_account_by_email</code> first whenever only an email is known.", ok: true, why: "Parameter descriptions guide inputs too. State the format and how to get a valid ID." },
            { t: "Have the backend return a generic “invalid input” error so the agent learns from the failures.", trap: "T6", why: "A generic error doesn't say what's wrong or how to get the right value." },
            { t: "Upgrade to the most capable model, which infers ID formats from examples it has seen before.", trap: "T3", why: "No model can know your ID format unless you describe it." }
          ]
        },
        {
          id: "q00-2", ts: "4.3",
          stem: "A lease-abstraction pipeline extracts <code>renewal_notice_days</code>. When a lease doesn't mention notice, the output still contains a plausible number such as 60. The schema marks the field as a required integer. Which change fixes the root cause?",
          options: [
            { t: "Have the model add a confidence score to each field and drop values below 0.7.", trap: "T4", why: "An arbitrary threshold doesn't touch the cause: the schema forces a value to exist." },
            { t: "Make the field nullable and tell the model to return null when the lease doesn't state it.", ok: true, why: "A required field creates pressure to fabricate. Allow absence explicitly." },
            { t: "Run each extraction three times at temperature 0.7 and keep the value that at least two runs agree on.", trap: "T6", why: "Fabricated defaults are often consistent, so runs can agree on the same invented 60." },
            { t: "Switch to a model with a longer context window so it reads the whole lease, including the appendices.", trap: "T3", why: "The model isn't missing text; the value doesn't exist and the schema demands one." }
          ]
        },
        {
          id: "q00-3", ts: "3.6",
          stem: "Which of these is <strong>not</strong> a real Claude Code mechanism?",
          options: [
            { t: "<code>.claude/rules/</code> files whose <code>paths:</code> frontmatter loads conventions only for matching files", why: "Real. Path-scoped rules are explicitly on the exam (task statement 3.3)." },
            { t: "<code>claude -p</code> for one-shot, non-interactive runs in CI", why: "Real. <code>-p</code> (<code>--print</code>) runs once and exits, so pipelines don't hang." },
            { t: "Setting <code>CLAUDE_HEADLESS=true</code> so Claude Code stops waiting for input", ok: true, trap: "T8", why: "Invented. The documented mechanism is the <code>-p</code> flag. Invented flags and env vars are a common distractor." },
            { t: "<code>${GITHUB_TOKEN}</code> expansion inside a committed <code>.mcp.json</code>, keeping secrets out of the repo", why: "Real. It's how teams share MCP configuration without committing secrets." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "60 questions, 120 minutes, pass at 720 of 1000. Guess rather than skip.",
        "4 of 6 scenarios appear. Prepare all six.",
        "Read the stem as an incident report: evidence → root cause → constraint type → proportionate fix.",
        "Guarantees go in code; judgment goes in prompts, descriptions and examples.",
        "“First step” means the cheap fix that targets the root cause, not new infrastructure.",
        "Nine traps: prompt-for-guarantee, over-built, bigger model, unreliable proxy, consolidate, hide/hammer errors, wrong component, invented feature, try-harder exhortations."
      ]
    }
  ]
};
