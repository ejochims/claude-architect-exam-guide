window.LESSONS.m14 = {
  cards: [
    { f: "Name the nine traps.", b: "Prompt where code is needed; over-built first step; bigger model or window; unreliable proxy; consolidate everything; hide or hammer the error; fix the wrong component; feature that doesn't exist; just tell it to try harder." },
    { f: "Before booking, what must be true?", b: "A cold Readiness Check at 80% or more with every domain at 70% or more, two mocks at 80% a week apart, and the official practice exam at 80% or more." }
  ],
  steps: [
    {
      kind: "read",
      title: "Think like the exam",
      html: `
<p class="lede">You've now seen every domain. This capstone turns that knowledge into exam technique: spotting the distractor that sounds right for the wrong reason.</p>
<p>Use the four moves from Module 0 on every question: find the evidence in the stem, name the root cause, decide whether the behavior needs a <em>guarantee</em> (code) or <em>judgment</em> (prompt, description, examples), then pick the proportionate fix. Most wrong answers fail one of those moves in a recognizable way. Those patterns are the nine traps you'll sort next.</p>
<div class="callout key"><div class="callout-label">Before you book</div><p>When the traps feel automatic, take a full <a href="#mock">mock exam</a>, then the one-time <a href="#readiness">Readiness Check</a>. Book when the Readiness Check is at 80% or more with every domain at 70% or more, two mocks a week apart are at 80% or more, and the official practice exam is at 80% or more.</p></div>`
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
            { t: "Make the field nullable and tell the model to return null whenever the lease doesn't state it.", ok: true, why: "A required field creates pressure to fabricate. Allow absence explicitly." },
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
        "Evidence → root cause → guarantee or judgment → proportionate fix.",
        "Nine traps: prompt-for-guarantee, over-built, bigger model, unreliable proxy, consolidate, hide/hammer errors, wrong component, invented feature, try-harder exhortations.",
        "Next: a mock exam, then the Readiness Check, then the official practice exam."
      ]
    }
  ]
};
