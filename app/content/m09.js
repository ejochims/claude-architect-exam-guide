window.LESSONS.m09 = {
  cards: [
    { f: "Most reliable way to get schema-compliant structured output?", b: "Define an extraction tool whose input schema is your target schema, set tool_choice so it's called, and read tool_use.input. (Exam answer. Today strict: true or structured outputs guarantee the schema.)" },
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
<p>Define an extraction tool whose <code>input_schema</code> is the shape you want, make sure it gets called (<code>tool_choice</code>: <code>"any"</code> across several schemas, or a named tool for one), and read the <code>tool_use</code> input. On the exam, this is the most reliable way to get schema-compliant output and avoid JSON syntax errors. (A strict guarantee takes <code>strict: true</code> or structured outputs; see the note below.) Prompt-only “respond in JSON” does not.</p>
<div class="callout today"><div class="callout-label">Real world today</div><p>Today only <code>strict: true</code> on a tool, or structured outputs (<code>output_config.format</code>), <em>guarantees</em> schema-valid output; plain tool use is very reliable but not guaranteed. Forced <code>tool_choice</code> returns a 400 error on Claude Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1. The exam's answer remains tool use + JSON Schema + <code>tool_choice</code>. See <a href="#today">Exam vs. today</a>.</p></div>
<h3>Schema design shapes behavior</h3>
<ul>
<li><strong>Required fields create pressure to fabricate.</strong> If the source might not contain a value, make it optional or nullable and tell the model to return <code>null</code>.</li>
<li><strong>Use enum + <code>"other"</code> + a detail string</strong> for category sets that grow, and add <code>"unclear"</code> for genuinely ambiguous inputs.</li>
<li><strong>Put format normalization rules in the prompt</strong> (“dates as YYYY-MM-DD; currency as numbers without symbols”) to handle inconsistent source formatting alongside the strict schema.</li>
</ul>
<pre class="code"><code>{
  <span class="s">"vendor"</span>: {<span class="s">"type"</span>: <span class="s">"string"</span>},
  <span class="s">"po_number"</span>: {<span class="s">"type"</span>: [<span class="s">"string"</span>, <span class="s">"null"</span>]},           <span class="c"># may be absent</span>
  <span class="s">"category"</span>: {<span class="s">"enum"</span>: [<span class="s">"hardware"</span>, <span class="s">"software"</span>, <span class="s">"services"</span>, <span class="s">"other"</span>, <span class="s">"unclear"</span>]},
  <span class="s">"category_detail"</span>: {<span class="s">"type"</span>: [<span class="s">"string"</span>, <span class="s">"null"</span>]},     <span class="c"># filled when "other"</span>
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
<p><strong>Close the loop.</strong> In review pipelines, add a <code>detected_pattern</code> field to each finding so that when developers dismiss findings you can see <em>which code constructs</em> generate false positives.</p>
<!-- ex:m09-retry -->
<h3>In code: retry with the specific error</h3>
<p>Your code validates what Claude extracted. If a check fails and the information is in the document, send back exactly what failed:</p>
<pre class="code"><code>data = tool_use_block.input                       <span class="c"># what Claude extracted</span>
errors = validate(data)                           <span class="c"># schema + business rules, in your code</span>
<span class="k">if</span> errors <span class="k">and</span> attempts &lt; <span class="k">2</span>:
    messages += [
        {<span class="s">"role"</span>: <span class="s">"assistant"</span>, <span class="s">"content"</span>: response.content},
        {<span class="s">"role"</span>: <span class="s">"user"</span>, <span class="s">"content"</span>: [{
            <span class="s">"type"</span>: <span class="s">"tool_result"</span>, <span class="s">"tool_use_id"</span>: tool_use_block.id, <span class="s">"is_error"</span>: <span class="k">True</span>,
            <span class="s">"content"</span>: <span class="s">"Validation failed: invoice_date 'March 3rd' must be YYYY-MM-DD; "</span>
                       <span class="s">"line items sum to 412.50 but total is 421.50. Re-check the document."</span>,
        }]},
    ]
elif errors:
    send_to_human_review(document, errors)        <span class="c"># retries can't find what isn't there</span></code></pre>`
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
            { t: "Use an extraction tool whose input schema is the target shape, and force the call.", ok: true, why: "Exam framing: schema-shaped tool input eliminates JSON syntax errors. (Today, strict tools or structured outputs guarantee it; see Exam vs. today.)" },
            { t: "Add three complete examples of valid JSON output to the prompt.", trap: "T1", why: "Lowers the failure rate but can't guarantee parseable output." },
            { t: "Repair broken responses with a JSON post-processor that fixes quotes, commas and unbalanced brackets before parsing.", trap: "T6", why: "Patches symptoms and can silently produce wrong structures." },
            { t: "Retry automatically, up to three times, whenever a response fails to parse.", trap: "T6", why: "Usually works eventually, but costs more and still has no guarantee." }
          ]
        },
        {
          id: "q09-2", ts: "4.3", scenario: 6,
          stem: "After switching to strict tool-use extraction, a teammate says “we no longer need validation code.” What's the right response?",
          options: [
            { t: "Agreed. A strict schema guarantees the values are correct, so validation is redundant.", why: "A schema guarantees shape, not truth." },
            { t: "Syntax errors are gone, but semantic errors such as totals that don't sum still need validation.", ok: true, why: "Schemas remove syntax errors, not semantic or factual ones." },
            { t: "Keep validation, but only for optional fields, since required fields are now guaranteed to be filled correctly.", why: "Required fields can be filled with wrong values. They're guaranteed present, not correct." },
            { t: "Keep the validation until the team upgrades to a newer model, which makes it unnecessary.", trap: "T3", why: "No model makes semantic validation unnecessary." }
          ]
        },
        {
          id: "q09-3", ts: "4.3", scenario: 6,
          stem: "<code>expense_category</code> is an enum of eight values. New expense types keep appearing and get forced into the nearest category. Best schema change?",
          options: [
            { t: "Add an <code>\"other\"</code> value with a <code>category_detail</code> string, plus <code>\"unclear\"</code>.", ok: true, why: "Enum + other + detail handles new categories without forcing a wrong match." },
            { t: "Change <code>expense_category</code> to free text so any new category can be captured as written.", why: "Loses the consistency that downstream reporting depends on." },
            { t: "Add every category you can think of to the enum, reviewing the list each quarter for new expense types.", why: "The list is never complete, and meanwhile new types are still forced into the nearest bucket." },
            { t: "Make the field required, so the model must always commit to one of the eight categories.", why: "It's already forced to choose, and that's the problem." }
          ]
        },
        {
          id: "q09-4", ts: "4.4", scenario: 6,
          stem: "Validation finds that 6% of extractions put invoice dates in a local format instead of ISO 8601. Invoices come from 30 countries, and dates such as 03/04/2026 can't be converted safely without knowing the document's locale. Retrying with the same prompt fixes almost none. What's the best retry design?",
          options: [
            { t: "Retry with the original document, the failed extraction and the exact validation error that it triggered.", ok: true, why: "Targeted feedback lets the model fix the error using the document's context, which code can't infer." },
            { t: "Retry up to five times with the same prompt and keep the first result that passes validation.", trap: "T6", why: "The same prompt repeats the same mistake. Retries need new information." },
            { t: "Convert the dates in code after extraction, assuming DD/MM unless the day exceeds 12.", why: "Guesses the locale, so 03/04 gets silently converted wrong for half the countries." },
            { t: "Route the retries to a more capable model, keeping the original prompt unchanged.", trap: "T3", why: "Without the error, a different model has no reason to change its answer." }
          ]
        },
        {
          id: "q09-5", ts: "4.4", scenario: 6,
          stem: "<code>cost_center</code> fails validation on 9% of invoices. Investigation shows those invoices reference a cost center defined only in a separate internal allocation sheet that the pipeline doesn't send. What should you do?",
          options: [
            { t: "Retry the failed records with more specific error feedback naming the expected cost-center format.", why: "Retries can't help when the information isn't in the input." },
            { t: "Accept that retries can't help here: return null and flag the record, or send the allocation sheet along with it.", ok: true, why: "Retries fix format errors, not missing information. Supply the source or flag it." },
            { t: "Make <code>cost_center</code> a required field so the model always provides a value.", why: "Forces fabrication of values that aren't in the document." },
            { t: "Relax the validation rule for <code>cost_center</code> so these 9% of records can pass.", why: "Hides the problem and lets bad data downstream." }
          ]
        },
        {
          id: "q09-6", ts: "4.4", scenario: 5,
          stem: "Developers dismiss 40% of automated review findings, and you can't tell why. What change enables systematic analysis?",
          options: [
            { t: "Add a <code>detected_pattern</code> field to each finding and analyze dismissals by pattern.", ok: true, why: "Structured metadata makes dismissal patterns measurable." },
            { t: "Require developers to type a free-text reason, in a required field, each time they dismiss a finding.", why: "Adds friction, and free text is hard to analyze at scale." },
            { t: "Cap the reviewer at five findings per PR so developers see fewer to dismiss.", why: "Reduces volume without telling you which findings are wrong." },
            { t: "Have the model self-rate each finding so low-rated ones can be hidden from developers.", trap: "T4", why: "Uncalibrated self-ratings don't explain why findings are dismissed." }
          ]
        },
        {
          id: "q09-7", ts: "4.3", scenario: 6,
          stem: "Source PDFs format amounts as “$1,280.50”, “1.280,50 EUR” and “USD 1280.5”. The schema says <code>amount: number</code>. Some values come back wrong by a factor of 1,000. What should you add?",
          options: [
            { t: "Add normalization rules for separators and currency codes to the prompt.", ok: true, why: "The schema enforces the type; the prompt has to specify how to interpret mixed source formats." },
            { t: "Change <code>amount</code> to a string, so every source format is captured exactly as written and parsed downstream.", why: "Pushes the parsing problem downstream instead of solving it." },
            { t: "Retry any extraction whose amount exceeds 10,000, with the same prompt.", trap: "T6", why: "An arbitrary threshold misses some errors, and the same prompt repeats them." },
            { t: "Use a larger model that understands international number formats.", trap: "T3", why: "Without explicit rules, any model can misread “1.280,50”." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "tool_use with a JSON schema is the exam's reliable path to valid structure (today strict: true guarantees it); read the tool_use input.",
        "Schemas guarantee syntax, never semantics. Validate meaning in code.",
        "Nullable fields prevent fabrication; enum + \"other\" + detail handles growth; \"unclear\" handles ambiguity.",
        "Add normalization rules to the prompt for messy source formats.",
        "Retry with the document + failed extraction + specific errors. Retries can't recover absent information.",
        "Build self-checks in (calculated vs stated total, conflict_detected) and add detected_pattern for feedback loops."
      ]
    }
  ]
};
