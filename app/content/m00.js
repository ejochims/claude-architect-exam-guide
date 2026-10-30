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
<p class="lede">The exam is 60 multiple-choice questions in 120 minutes. Each has one best answer and three distractors written to tempt someone with partial experience. You need a scaled score of <strong>720 out of 1000</strong>. Wrong answers cost nothing extra, so never leave a question blank.</p>
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
          stem: "An internal IT-helpdesk agent often calls <code>reset_password</code> when users ask to unlock their account, instead of <code>unlock_account</code>. Both tools have one-line descriptions. What is the <strong>most effective first step</strong>?",
          options: [
            { t: "Train a lightweight intent classifier on past tickets that selects the tool before Claude sees the request.", trap: "T2", why: "This might work eventually, but it builds infrastructure before trying the cheap fix that targets the cause: thin descriptions." },
            { t: "Rewrite both descriptions to state what each does, the inputs it expects, example requests, and when to use it instead of the other.", ok: true, why: "Descriptions are the model's main signal for choosing a tool. Two one-liners give it nothing to tell the tools apart. This is the proportionate root-cause fix." },
            { t: "Merge both into a single <code>manage_account_access</code> tool with an <code>action</code> parameter so Claude no longer has to choose between them.", trap: "T5", why: "Consolidation just moves the same ambiguity into a parameter, and it's a bigger change than a first step warrants." },
            { t: "Upgrade to the most capable model available so it can infer the right tool from the tool names and the user's wording.", trap: "T3", why: "A stronger model still has nothing to go on when the interface doesn't distinguish the tools." }
          ]
        },
        {
          id: "q00-2", ts: "4.3",
          stem: "A lease-abstraction pipeline extracts <code>renewal_notice_days</code>. When a lease doesn't mention notice, the output still contains a plausible number such as 60. The schema marks the field as a required integer. Which change fixes the root cause?",
          options: [
            { t: "Ask the model to add a confidence score for each field and discard values below 0.7.", trap: "T4", why: "Self-reported confidence is poorly calibrated, and the model is under pressure to produce a value at all. That's the actual cause." },
            { t: "Make the field nullable and instruct the model to return <code>null</code> when the lease doesn't state it.", ok: true, why: "A required field forces the model to fill it. Allowing null removes the pressure to fabricate. This is a schema-design fix at the root cause." },
            { t: "Run each extraction three times and keep the majority value.", trap: "T6", why: "Voting over a fabricated value gives you a consistently fabricated value. Retries can't recover information the document doesn't contain." },
            { t: "Switch to a model with a longer context window so it reads the whole lease.", trap: "T3", why: "The model isn't missing the clause. The clause doesn't exist, and the schema demands a number anyway." }
          ]
        },
        {
          id: "q00-3", ts: "3.6",
          stem: "Which of these is <strong>not</strong> a real Claude Code mechanism?",
          options: [
            { t: "<code>.claude/rules/</code> files with <code>paths:</code> glob frontmatter that load conventions only for matching files", why: "Real. Path-scoped rules are explicitly on the exam (task statement 3.3)." },
            { t: "<code>claude -p</code> for non-interactive runs in CI", why: "Real. <code>-p</code> (<code>--print</code>) runs once and exits, so pipelines don't hang." },
            { t: "Setting <code>CLAUDE_HEADLESS=true</code> to stop Claude Code waiting for input", ok: true, trap: "T8", why: "Invented. The documented mechanism is the <code>-p</code> flag. Invented flags and env vars are a common distractor." },
            { t: "<code>${GITHUB_TOKEN}</code> environment-variable expansion inside <code>.mcp.json</code>", why: "Real. It's how teams share MCP configuration without committing secrets." }
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
