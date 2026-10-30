window.LESSONS.m08 = {
  cards: [
    { f: "Why doesn't “only report high-confidence findings” fix false positives?", b: "It's a general exhortation. Precision comes from specific categorical criteria: what to report and what to skip." },
    { f: "One review category is mostly noise and developers ignore all comments. Move?", b: "Temporarily disable the high-false-positive category to restore trust while you improve its prompt." },
    { f: "How many few-shot examples, and what should they show?", b: "2–4 targeted examples for the ambiguous cases, showing the reasoning for why one option was chosen over plausible alternatives." },
    { f: "Why is self-review in the same session weak?", b: "The model keeps its generation reasoning and is less likely to question it. Use an independent instance without that context." },
    { f: "Large multi-file review gives inconsistent, shallow results. Fix?", b: "Per-file passes for local issues plus a separate integration pass for cross-file data flow." },
    { f: "Severity labels are inconsistent. Fix?", b: "Define explicit severity criteria with a concrete code example for each level." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: specific beats general",
      html: `
<p class="lede">“Be conservative” and “only report high-confidence issues” sound like they should cut noise. They barely move precision, because they don't tell the model <em>which</em> findings matter.</p>
<p>Compare two instructions for a review bot:</p>
<pre class="code"><code><span class="c"># Vague</span>
<span class="s">Check that comments are accurate. Be conservative.</span>

<span class="c"># Explicit</span>
<span class="s">Flag a comment only when the behavior it claims contradicts what the code
does (e.g. "returns sorted list" but the function never sorts).
Do not flag wording, grammar, or comments that are merely incomplete.</span></code></pre>
<p>Write <strong>categorical criteria</strong> for what to report (bugs, security, contradicting comments) and what to skip (minor style, accepted local patterns, speculative performance advice). For severity, define each level with a <strong>concrete code example</strong>.</p>
<div class="callout key"><div class="callout-label">Trust is shared across categories</div><p>When one category produces mostly false positives, developers start ignoring <em>all</em> the bot's comments, including the accurate ones. Temporarily disable the noisy category to restore trust while you improve its prompt.</p></div>`
    },
    {
      kind: "widget",
      title: "Report or skip?",
      intro: "Criteria: report bugs, security issues, and comments that contradict the code. Skip style, accepted local patterns and speculative performance advice.",
      widget: "sorter",
      config: {
        cats: [{ id: "report", label: "Report" }, { id: "skip", label: "Skip" }],
        items: [
          ["SQL query built by concatenating a request parameter.", "report", "Injection risk: security."],
          ["Loop variable named i instead of index.", "skip", "Style."],
          ["Docstring says “raises on empty input”; the code returns None.", "report", "The comment contradicts the behavior."],
          ["Uses forEach where the team usually writes for…of.", "skip", "An accepted local pattern."],
          ["Payment total uses floating-point arithmetic for currency.", "report", "A correctness bug with money."],
          ["“This might be slow at scale” with no evidence.", "skip", "Speculative performance advice."],
          ["Comment is accurate but could be worded more clearly.", "skip", "Wording, not a contradiction."]
        ]
      }
    },
    {
      kind: "read",
      title: "Few-shot examples and review architecture",
      html: `
<p class="lede">When detailed instructions still produce inconsistent output, examples are the most effective lever.</p>
<ul>
<li><strong>2–4 targeted examples</strong> aimed at the <em>ambiguous</em> cases, not the easy ones.</li>
<li><strong>Show the reasoning</strong>: why this action and not the plausible alternative. That lets the model generalize to new cases instead of copying the examples.</li>
<li><strong>Show the output format</strong> (location, issue, severity, suggested fix) to get consistent structure.</li>
<li><strong>Show acceptable patterns next to real issues</strong> to cut false positives.</li>
<li><strong>In extraction, show varied document structures</strong> (inline citations vs. bibliographies, tables vs. prose) to fix empty or fabricated fields.</li>
</ul>
<h3>Who reviews, and how much at once</h3>
<div class="mech" style="grid-template-columns:repeat(2,minmax(0,1fr))">
<div><span class="tag">Independent</span><h4>A second instance</h4><p>A session that generated code keeps its reasoning and tends to defend it. An independent instance without that context catches more than “review your work carefully” or extended thinking in the same session.</p></div>
<div><span class="tag">Multi-pass</span><h4>Per file, then integration</h4><p>One pass over 20 files spreads attention thin: some files get depth, others get skimmed, and findings contradict each other. Review each file for local issues, then run a separate pass on cross-file data flow.</p></div>
</div>
<p>A verification pass can also have the model report a confidence level with each finding. That's useful for <strong>routing</strong> findings to human review, once the thresholds have been calibrated (Module 13).</p>`
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q08-1", ts: "4.1", scenario: 5,
          stem: "An automated reviewer posts many low-value comments. Adding “Only report issues you are highly confident about” barely changed the volume. What should you do?",
          options: [
            { t: "List which categories to report (bugs, security, contradicted comments) and which to skip (style, local conventions).", ok: true, why: "Specific criteria improve precision; confidence exhortations don't." },
            { t: "Strengthen the wording to “only report issues you are extremely confident about.”", trap: "T9", why: "This is still a general instruction." },
            { t: "Have the model self-rate each finding from 1 to 10 and drop anything below 8.", trap: "T4", why: "Uncalibrated self-ratings don't measure validity." },
            { t: "Switch to a larger model that can better judge which issues matter.", trap: "T3", why: "The criteria are missing, not the capability." }
          ]
        },
        {
          id: "q08-2", ts: "4.1", scenario: 5,
          stem: "Your CI reviewer has five categories. “Naming suggestions” is wrong 70% of the time, and developers now dismiss even the security findings. Best immediate move?",
          options: [
            { t: "Temporarily disable the naming category while you refine its prompt.", ok: true, why: "Removing the noise restores trust in the accurate categories right away." },
            { t: "Keep everything and add a disclaimer to naming comments.", why: "The noise remains and trust keeps eroding." },
            { t: "Add more few-shot examples to all categories at once.", why: "This doesn't target the category destroying trust, and it's slower." },
            { t: "Require two reviewer runs to agree before posting anything.", why: "This suppresses true positives and doesn't fix the cause." }
          ]
        },
        {
          id: "q08-3", ts: "4.1", scenario: 5,
          stem: "The same kind of null-dereference is labeled “critical” in one PR and “minor” in another. How do you make severity consistent?",
          options: [
            { t: "Define each severity level explicitly, with a concrete code example per level.", ok: true, why: "Explicit criteria plus examples anchor the classification." },
            { t: "Tell the model to be consistent when assigning severity.", trap: "T9", why: "A general exhortation doesn't define the levels." },
            { t: "Reduce to two severity levels so there's less room to disagree.", why: "This hides the inconsistency rather than fixing it." },
            { t: "Run the review three times and average the severity labels.", why: "Averaging noisy labels gives noisy labels." }
          ]
        },
        {
          id: "q08-4", ts: "4.2", scenario: 1,
          stem: "Tool descriptions are clear, but for borderline requests (“my package says delivered but it isn't here”) the agent alternates between <code>lookup_order</code> and <code>open_claim</code>. What helps most?",
          options: [
            { t: "Add 2–4 few-shot examples of borderline requests that show the reasoning for choosing one tool over the other.", ok: true, why: "Examples teach judgment on ambiguous cases, and the reasoning helps the model generalize." },
            { t: "Merge <code>lookup_order</code> and <code>open_claim</code> into one tool that handles both.", trap: "T5", why: "The actions differ, so merging loses that distinction." },
            { t: "Build a keyword router that sends any message containing “delivered” to open_claim.", trap: "T2", why: "Brittle infrastructure before trying examples." },
            { t: "Lower the temperature to zero so the agent always makes the same choice.", why: "This makes the behavior deterministic but not correct." }
          ]
        },
        {
          id: "q08-5", ts: "4.2", scenario: 6,
          stem: "Extraction of <code>study_sample_size</code> returns null for about 20% of papers. Inspection shows the value is present but sits in a methods-section table rather than in the prose. Best fix?",
          options: [
            { t: "Make the field required so the model has to find a value in every paper.", why: "This forces fabrication when the value is genuinely absent." },
            { t: "Add few-shot examples of correct extraction from papers with the value in a table and in prose.", ok: true, why: "Examples of varied document structures fix this kind of miss." },
            { t: "Retry every null extraction using the same prompt.", trap: "T6", why: "The same prompt misses the same way." },
            { t: "Chunk each paper into single paragraphs so the value is easier to find.", why: "This may split the table from its context." }
          ]
        },
        {
          id: "q08-6", ts: "4.6", scenario: 5,
          stem: "In a Claude Code session, Claude implements a feature and then reviews its own diff before you merge. It approves code with a race condition that a teammate later finds. Best change?",
          options: [
            { t: "Ask the same session to “review critically, as a skeptic.”", trap: "T9", why: "The session still has its generation reasoning." },
            { t: "Turn on extended thinking for the self-review so it reasons more thoroughly.", why: "More reasoning in the same context still anchors on its earlier choices." },
            { t: "Review with an independent Claude instance that has the diff and criteria but not the generator's reasoning.", ok: true, why: "Independent review avoids the self-review blind spot." },
            { t: "Run the same self-review twice and merge the findings.", why: "The same bias, twice." }
          ]
        },
        {
          id: "q08-7", ts: "4.6", scenario: 5,
          stem: "A PR renames <code>customerId</code> to <code>accountId</code> in a producer service but not in two consumers. The single-pass review of all 22 changed files gave detailed local feedback but missed the mismatch. What structure catches it?",
          options: [
            { t: "Per-file passes for local issues, plus a separate integration pass focused on cross-file data flow.", ok: true, why: "Cross-file contracts need their own focused pass." },
            { t: "One longer single pass over all 22 files with a larger output limit.", trap: "T3", why: "The problem is diluted attention, not output length." },
            { t: "Require developers to split PRs into batches of fewer than 5 files.", why: "This shifts the burden and still misses cross-PR contracts." },
            { t: "Only flag issues that appear in at least two of three identical review runs.", why: "Consensus voting suppresses intermittent true positives." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Categorical criteria (report X, skip Y) beat “be conservative” or “high confidence only.”",
        "Define severity levels with concrete code examples.",
        "A noisy category erodes trust in all of them. Disable it temporarily while you fix it.",
        "Use 2–4 few-shot examples on the ambiguous cases, with reasoning, a format demonstration and varied structures.",
        "Self-review is weak; use an independent instance.",
        "Large reviews: per-file passes plus a cross-file integration pass."
      ]
    }
  ]
};
