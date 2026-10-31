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
            { t: "Name what to report (bugs, security, stale comments) and what to skip (style, local conventions), with an example of each.", ok: true, why: "Explicit criteria define what counts. Confidence wording doesn't." },
            { t: "Strengthen the instruction to “report only issues you are extremely confident about.”", trap: "T9", why: "The same vague instruction, louder. It gives the model no criteria." },
            { t: "Have the model rate each finding from 1 to 10, then post only those rated 8 or higher, dropping the rest.", trap: "T4", why: "Uncalibrated self-ratings don't separate valuable findings from noise." },
            { t: "Switch the reviewer to a larger model that can judge which issues matter to the team.", trap: "T3", why: "The model doesn't know what the team considers low-value. Tell it." }
          ]
        },
        {
          id: "q08-2", ts: "4.1", scenario: 5,
          stem: "Your CI reviewer has five categories. “Naming suggestions” is wrong 70% of the time, and developers now dismiss even the security findings. Best immediate move?",
          options: [
            { t: "Temporarily disable the naming category while you refine its prompt.", ok: true, why: "Removing the high false-positive category restores trust in the others while you fix it." },
            { t: "Keep all five categories and prefix naming comments with “low confidence” so developers can skip them.", why: "Developers still wade through the noise, and trust in the other categories keeps eroding." },
            { t: "Add few-shot examples to all five categories at once, then measure the false-positive rate again.", why: "A broad change that takes time, while the noisy category keeps damaging trust today." },
            { t: "Require two independent review runs to agree on a finding before it's posted.", why: "A systematic false positive is often reproduced by both runs." }
          ]
        },
        {
          id: "q08-3", ts: "4.1", scenario: 5,
          stem: "The same kind of null-dereference is labeled “critical” in one PR and “minor” in another. How do you make severity consistent?",
          options: [
            { t: "Tell the model to be consistent when assigning severity across pull requests.", trap: "T9", why: "An exhortation with no definition of what each level means." },
            { t: "Define every severity level clearly, with a concrete code example for each.", ok: true, why: "Explicit criteria with examples remove the ambiguity behind the inconsistency." },
            { t: "Collapse the scale to two levels, blocking and non-blocking, so there's less room for disagreement.", why: "Fewer levels hide the ambiguity; borderline cases still flip between them." },
            { t: "Run the review three times and assign the median of the three severity labels.", why: "Averages the inconsistency instead of removing its cause, at three times the cost." }
          ]
        },
        {
          id: "q08-4", ts: "4.2", scenario: 1,
          stem: "Tool descriptions are clear, but for borderline requests (“my package says delivered but it isn't here”) the agent alternates between <code>lookup_order</code> and <code>open_claim</code>. What helps most?",
          options: [
            { t: "Add 2–4 few-shot examples of borderline requests, showing why one tool beats the other.", ok: true, why: "Examples that show the reasoning teach the judgment the descriptions can't." },
            { t: "Merge both into one <code>handle_delivery_issue</code> tool that decides internally whether to look up or open a claim.", trap: "T5", why: "Moves the ambiguity inside the tool without teaching which action fits." },
            { t: "Route any message containing “delivered” to <code>open_claim</code> with a keyword rule in front of the agent.", trap: "T2", why: "Keyword rules misfire on paraphrases and bypass the agent's judgment." },
            { t: "Set temperature to 0 so the agent's choice is more consistent for the same request.", why: "More consistent isn't more correct. It would tend to pick the same tool, right or wrong." }
          ]
        },
        {
          id: "q08-5", ts: "4.2", scenario: 6,
          stem: "Extraction of <code>study_sample_size</code> returns null for about 20% of papers. Inspection shows the value is present but sits in a methods-section table rather than in the prose. Best fix?",
          options: [
            { t: "Make <code>study_sample_size</code> required, so the model has to find a value in every paper.", why: "Forces values where none exist and creates fabrication pressure." },
            { t: "Add few-shot examples of correct extraction from papers that give the value in a methods table and in prose.", ok: true, why: "Examples of varied document structures fix the systematic miss." },
            { t: "Retry every null extraction once, with the same prompt and the full paper.", trap: "T6", why: "The same prompt fails the same way on the same structure." },
            { t: "Split each paper into single-paragraph chunks so the value is easier to spot in a smaller window.", why: "Tables are what's missed, and chunking can split a table from its caption." }
          ]
        },
        {
          id: "q08-6", ts: "4.6", scenario: 5,
          stem: "In a Claude Code session, Claude implements a feature and then reviews its own diff before you merge. It approves code with a race condition that a teammate later finds. Best change?",
          options: [
            { t: "Ask the same session to review “critically, as a skeptical senior engineer.”", trap: "T9", why: "The session still holds the reasoning that produced the code, so it shares its blind spots." },
            { t: "Turn on extended thinking for the self-review, so it reasons through each possible concurrency issue in more depth.", why: "More reasoning in the same context doesn't remove the anchoring on its own decisions." },
            { t: "Review with an independent instance that gets the diff and criteria but not the generator's reasoning.", ok: true, why: "An independent reviewer isn't anchored on the reasoning that produced the code." },
            { t: "Run the same self-review twice and merge the two lists of findings.", why: "Two passes from the same context share the same blind spots." }
          ]
        },
        {
          id: "q08-7", ts: "4.6", scenario: 5,
          stem: "Your review now runs per-file passes and then an integration pass across files. The integration pass keeps repeating the per-file passes' style and naming comments, doubling the noise developers see. What should change?",
          options: [
            { t: "Drop the integration pass and run longer, more detailed per-file passes instead.", why: "Loses cross-file checks entirely, which per-file passes can't do." },
            { t: "Scope the integration pass to cross-file concerns and give it the per-file findings.", ok: true, why: "Each pass needs its own focus; passing earlier findings prevents repetition." },
            { t: "Post only the integration pass's comments, since it sees every file.", why: "Throws away the per-file passes' more detailed local findings." },
            { t: "Before posting, drop any comment whose text exactly matches one from an earlier pass, keeping the first copy.", why: "Rephrased duplicates slip through. Fix the integration pass's scope." }
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
