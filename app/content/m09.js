window.LESSONS.m09 = {
  cards: [
    { f: "Most reliable way to get schema-compliant structured output?", b: "Define an extraction tool whose input schema is your target schema, set tool_choice so it's called, and read tool_use.input." },
    { f: "What does a strict JSON schema NOT prevent?", b: "Semantic errors: line items that don't sum to the total, values in the wrong field, fabricated values." },
    { f: "A field may be absent from the source. Schema choice?", b: "Make it optional or nullable and instruct the model to return null, so it isn't pressured to fabricate." },
    { f: "Categories keep growing. Schema pattern?", b: "Enum plus \"other\" with a detail string. Add \"unclear\" for ambiguous cases." },
    { f: "What goes into a validation retry?", b: "The original document, the failed extraction, and the specific validation errors." },
    { f: "When won't a retry help?", b: "When the information isn't in the provided source (e.g. it's in a separate document). Retries only produce fabrications." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: syntax is not truth",
      html: `
<p class="lede">A schema can guarantee that <code>total</code> is a number. It can't guarantee that the number is right, or that the document mentioned a total at all. Separate the two problems.</p>
<h3>Syntax: use tool_use with a schema</h3>
<p>Define an extraction tool whose <code>input_schema</code> is the shape you want, make sure it gets called (<code>tool_choice</code>: <code>"any"</code> across several schemas, or a named tool for one), and read the <code>tool_use</code> input. On the exam, this is the most reliable way to get schema-compliant output, and it eliminates JSON syntax errors. Prompt-only “respond in JSON” does not.</p>
<div class="callout today"><div class="callout-label">Real world today</div><p>Today only <code>strict: true</code> on a tool, or structured outputs (<code>output_config.format</code>), <em>guarantees</em> schema-valid output; plain tool use is very reliable but not guaranteed. Forced <code>tool_choice</code> returns a 400 error on Claude Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1. The exam's answer remains tool use + JSON Schema + <code>tool_choice</code>. See <a href="#today">Exam vs. today</a>.</p></div>
<h3>Schema design shapes behavior</h3>
<ul>
<li><strong>Required fields create pressure to fabricate.</strong> If the source might not contain a value, make it optional or nullable and tell the model to return <code>null</code>.</li>
<li><strong>Use enum + <code>"other"</code> + a detail string</strong> for category sets that grow, and add <code>"unclear"</code> for genuinely ambiguous inputs.</li>
<li><strong>Put format normalization rules in the prompt</strong> (“dates as YYYY-MM-DD; currency as numbers without symbols”) to handle inconsistent source formatting alongside the strict schema.</li>
</ul>
<pre class="code"><code>{
  <span class="s">"vendor"</span>: {<span class="s">"type"</span>: <span class="s">"string"</span>},
  <span class="s">"po_number"</span>: {<span class="s">"type"</span>: [<span class="s">"string"</span>, <span class="s">"null"</span>]},           <span class="c">// may be absent</span>
  <span class="s">"category"</span>: {<span class="s">"enum"</span>: [<span class="s">"hardware"</span>, <span class="s">"software"</span>, <span class="s">"services"</span>, <span class="s">"other"</span>, <span class="s">"unclear"</span>]},
  <span class="s">"category_detail"</span>: {<span class="s">"type"</span>: [<span class="s">"string"</span>, <span class="s">"null"</span>]},     <span class="c">// filled when "other"</span>
  <span class="s">"stated_total"</span>: {<span class="s">"type"</span>: <span class="s">"number"</span>},
  <span class="s">"calculated_total"</span>: {<span class="s">"type"</span>: <span class="s">"number"</span>},               <span class="c">// sum of line items</span>
  <span class="s">"conflict_detected"</span>: {<span class="s">"type"</span>: <span class="s">"boolean"</span>}
}</code></pre>`
    },
    {
      kind: "read",
      title: "Semantics: validate, then retry with feedback",
      html: `
<p class="lede">Check meaning in code: totals sum, dates are in order, values sit in the right fields. When validation fails, retry <em>with the evidence</em>.</p>
<p>A useful retry sends three things: <strong>the original document, the failed extraction, and the specific validation errors</strong> (“line items sum to 1,180.00 but total is 1,280.00”). Retrying the same prompt unchanged mostly reproduces the same mistake.</p>
<p><strong>Know when retries can't help.</strong> They fix format mismatches and structural slips. They can't conjure information that isn't in the source. If the PO number lives in a separate purchase order you didn't provide, every retry is an invitation to invent one. Return <code>null</code>, flag it, or fetch the other document.</p>
<p><strong>Build self-checks into the schema.</strong> Extract <code>calculated_total</code> alongside <code>stated_total</code>, and add a <code>conflict_detected</code> flag for inconsistent sources. Then code can flag mismatches automatically.</p>
<p><strong>Close the loop.</strong> In review pipelines, add a <code>detected_pattern</code> field to each finding so that when developers dismiss findings you can see <em>which code constructs</em> generate false positives.</p>`
    },
    {
      kind: "widget",
      title: "Will a retry fix it?",
      intro: "Each extraction failed validation. Decide whether a retry with error feedback can fix it.",
      widget: "sorter",
      config: {
        cats: [{ id: "yes", label: "Retry helps" }, { id: "no", label: "Retry won't help" }],
        items: [
          ["Date returned as “March 3rd”; the schema wants YYYY-MM-DD.", "yes", "A format error. Feed back the rule and the bad value."],
          ["Contract renewal date is only in an amendment that wasn't provided.", "no", "The information is absent. Retries invite fabrication, so fetch the amendment or return null."],
          ["Shipping cost placed in the tax field.", "yes", "Wrong field placement is fixable with specific feedback."],
          ["Line items sum to $1,180 but the total extracted is $1,280, and the document itself shows both numbers.", "no", "The source is inconsistent. Flag conflict_detected and route to review rather than forcing agreement."],
          ["Array of strings returned as one comma-separated string.", "yes", "A structural slip. Feedback fixes it."],
          ["Customer signature status, but the scan's signature area is blank.", "no", "Nothing to extract. Return null or \"unclear\"."]
        ]
      }
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "q09-1", ts: "4.3", scenario: 6,
          stem: "A pipeline asks Claude to “respond only with valid JSON matching this schema.” About 1 in 200 responses fail to parse. What is the most reliable fix?",
          options: [
            { t: "Define an extraction tool with the schema as its input and force the call; read the tool_use input.", ok: true, why: "Schema-backed tool use eliminates syntax errors, while prompt-only JSON can't guarantee validity." },
            { t: "Add three examples of valid JSON output to the prompt.", trap: "T1", why: "This improves odds without a guarantee." },
            { t: "Repair broken JSON with a regex-based post-processor before parsing.", trap: "T6", why: "Fragile, and it treats the symptom." },
            { t: "Automatically retry any response that fails to parse.", trap: "T6", why: "This works eventually, but wastes calls when a guarantee exists." }
          ]
        },
        {
          id: "q09-2", ts: "4.3", scenario: 6,
          stem: "After switching to strict tool-use extraction, a teammate says “we no longer need validation code.” What's the right response?",
          options: [
            { t: "Agreed. Strict schemas guarantee the values are correct, so validation is redundant.", why: "They guarantee shape, not truth." },
            { t: "Syntax errors are gone, but semantic errors (totals that don't sum, values in the wrong field) still need validation.", ok: true, why: "Schema compliance and semantic correctness are different problems." },
            { t: "Validation is still needed, but only for the optional fields in the schema.", why: "Required fields can be wrong too." },
            { t: "Keep the validation code only until the team upgrades to a newer model.", trap: "T3", why: "Model capability doesn't change what a schema guarantees." }
          ]
        },
        {
          id: "q09-3", ts: "4.3", scenario: 6,
          stem: "<code>expense_category</code> is an enum of eight values. New expense types keep appearing and get forced into the nearest category. Best schema change?",
          options: [
            { t: "Add an \"other\" value plus a <code>category_detail</code> string, and \"unclear\" for ambiguous items.", ok: true, why: "This handles new categories without silent misfiling." },
            { t: "Change the field to free text so any category can be captured.", why: "This loses normalization for the eight known categories." },
            { t: "Add every category you can think of to the enum.", why: "You can't predict them all, and selection gets harder." },
            { t: "Make the field required so the model always has to choose a category.", why: "It already always chooses. That's the misfiling problem." }
          ]
        },
        {
          id: "q09-4", ts: "4.4", scenario: 6,
          stem: "Validation finds that 6% of extractions put invoice dates in DD/MM format instead of ISO. Retrying with the same prompt fixes almost none. Best retry design?",
          options: [
            { t: "Retry with the original document, the failed extraction and the specific validation error.", ok: true, why: "Specific feedback lets the model correct itself." },
            { t: "Retry up to five times with the same prompt and keep the first valid result.", trap: "T6", why: "Same input, same output." },
            { t: "Use a different, more capable model for the retries.", trap: "T3", why: "Feedback, not capability, is what's missing." },
            { t: "Convert the dates in code afterward and stop asking the model for ISO format.", why: "A reasonable complement, but the question asks about retry design, and feedback is the lever." }
          ]
        },
        {
          id: "q09-5", ts: "4.4", scenario: 6,
          stem: "<code>cost_center</code> fails validation on 9% of invoices. Investigation shows those invoices reference a cost center defined only in a separate internal allocation sheet that the pipeline doesn't send. What should you do?",
          options: [
            { t: "Retry the failed records with stronger, more specific error feedback.", why: "The information isn't in the input, so feedback can't create it." },
            { t: "Accept that retries can't help: return null and flag the record, or supply the allocation sheet.", ok: true, why: "Retries work for format and structure errors, not for absent information." },
            { t: "Make cost_center a required field so the model must always fill it.", why: "This forces fabrication." },
            { t: "Lower the validation threshold so these records pass.", why: "This accepts wrong data." }
          ]
        },
        {
          id: "q09-6", ts: "4.4", scenario: 5,
          stem: "Developers dismiss 40% of automated review findings, and you can't tell why. What change enables systematic analysis?",
          options: [
            { t: "Add a detected_pattern field naming the code construct behind each finding, then analyze dismissals by pattern.", ok: true, why: "Patterns reveal which constructs generate false positives so you can fix those criteria." },
            { t: "Require developers to write a free-text reason every time they dismiss a finding.", why: "This adds friction and gives unstructured data." },
            { t: "Lower the maximum number of findings posted per PR.", why: "Arbitrary caps don't diagnose anything." },
            { t: "Have the model self-rate each finding so low-rated ones can be hidden.", trap: "T4", why: "This doesn't explain dismissals." }
          ]
        },
        {
          id: "q09-7", ts: "4.3", scenario: 6,
          stem: "Source PDFs format amounts as “$1,280.50”, “1.280,50 EUR” and “USD 1280.5”. The schema says <code>amount: number</code>. Some values come back wrong by a factor of 1,000. What should you add?",
          options: [
            { t: "Add explicit normalization rules (decimal separators, currency codes) to the prompt alongside the schema.", ok: true, why: "The schema enforces type. Normalization rules handle inconsistent source formatting." },
            { t: "Change the amount field's type to a string so every source format is accepted as written.", why: "This pushes the problem downstream." },
            { t: "Automatically retry any extraction where the amount is over 10,000.", why: "A heuristic that misses errors and flags correct values." },
            { t: "Use a bigger model that understands international number formats.", trap: "T3", why: "Ambiguous formats need explicit rules." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "tool_use with a JSON schema is the reliable path to valid structure; read the tool_use input.",
        "Schemas guarantee syntax, never semantics. Validate meaning in code.",
        "Nullable fields prevent fabrication; enum + \"other\" + detail handles growth; \"unclear\" handles ambiguity.",
        "Add normalization rules to the prompt for messy source formats.",
        "Retry with the document + failed extraction + specific errors. Retries can't recover absent information.",
        "Build self-checks in (calculated vs stated total, conflict_detected) and add detected_pattern for feedback loops."
      ]
    }
  ]
};
