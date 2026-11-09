window.LESSONS.m09 = {
  revised: "2026-11-05",
  cards: [
    { f: "Why add detected_pattern to each review finding?", b: "So you can see which code patterns produce the findings developers dismiss, and tune or turn off those checks." },
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
      title: "Start here: what structured extraction is",
      html: `
<p class="lede">Structured extraction turns a messy document (a PDF invoice, a claim form, an email) into a clean record your systems can use: the right fields, the right types, and values that are actually true. Claude does the reading. Your design makes the result trustworthy.</p>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><p>Think of turning an inbound email or a scanned form into a Case or a custom-object record with every field filled correctly, the job Document AI or an Agentforce action does. The <strong>schema</strong> is your object definition: fields, data types, picklists, which fields are required. Everything in this module maps onto choices you already make when you design an object.</p></div>
<h3>The pipeline</h3>
<div class="flow" aria-label="Extraction pipeline">
<span class="box">Document</span><span class="arr">→</span>
<span class="box">Claude + extraction tool (your schema)</span><span class="arr">→</span>
<span class="box">tool_use input = a draft record (JSON)</span><span class="arr">→</span>
<span class="box">Your validation code</span><span class="arr">→</span>
<span class="box">Save · retry with the error · or send to a human</span>
</div>
<p>Thousands of documents a night usually go through the Batch API (Module 10), and low-confidence records go to a human review queue (Module 13). This module covers the middle: getting a well-formed draft record, then deciding whether to trust it.</p>
<h3>Two different guarantees</h3>
<div class="table-wrap"><table>
<thead><tr><th>Guarantee</th><th>Question</th><th>What provides it</th></tr></thead>
<tbody>
<tr><td><strong>Shape (syntax)</strong></td><td>Is every field present, with the right type and an allowed value?</td><td>The schema, enforced by <code>tool_use</code></td></tr>
<tr><td><strong>Truth (semantics)</strong></td><td>Are the values correct, consistent, and actually in the document?</td><td>Your validation code, retries with feedback, and human review</td></tr>
</tbody></table></div>
<p>Nearly every exam question here is about mixing these two up: assuming a perfect schema means a correct record, or retrying a problem that's really missing information.</p>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><p>A Number field stops someone saving "about twelve hundred". It can't stop them typing 1,280 when the invoice says 1,208. Field types give you shape. Validation rules, duplicate rules and an approval queue give you truth. Extraction works the same way.</p></div>`
    },
    {
      kind: "read",
      title: "How tool_use enforces the shape, step by step",
      html: `
<p class="lede">The reliable way to get structured output is to define a "tool" whose input <em>is</em> your record, and make Claude call it. You never actually run the tool; you just read what Claude filled in.</p>
<p><strong>1. You send the document plus a tool whose <code>input_schema</code> is your record definition:</strong></p>
<pre class="code"><code>tools = [{
  "name": "record_invoice",
  "description": "Record the fields of one supplier invoice.",
  "input_schema": {
    "type": "object",
    "properties": {
      "vendor":          {"type": "string"},
      "invoice_date":    {"type": "string", "description": "YYYY-MM-DD"},
      "po_number":       {"type": ["string", "null"]},   <span class="c"># may be absent: allow null</span>
      "stated_total":    {"type": "number"},
      "category":        {"enum": ["hardware", "software", "services", "other", "unclear"]},
      "category_detail": {"type": ["string", "null"]}    <span class="c"># filled when category is "other"</span>
    },
    "required": ["vendor", "invoice_date", "stated_total", "category"]
  }
}]
tool_choice = {"type": "tool", "name": "record_invoice"}   <span class="c"># must call this tool</span></code></pre>
<p><strong>2. Claude answers with a <code>tool_use</code> block</strong> (and <code>stop_reason: "tool_use"</code>):</p>
<pre class="code"><code>{"type": "tool_use", "name": "record_invoice",
 "input": {"vendor": "Northwind Supply", "invoice_date": "2026-10-14",
           "po_number": null, "stated_total": 1280.50,
           "category": "hardware", "category_detail": null}}</code></pre>
<p><strong>3. Your code takes <code>input</code> as the draft record</strong> and validates it. That's the end of the extraction; there's no tool to execute.</p>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><p>The tool is like an invocable action or a flow with typed input variables. Claude has to fill a form whose fields, types and picklists you defined. Asking in the prompt to "respond only in JSON" is like asking a user to type JSON into a long text area: it usually works, sometimes doesn't, and nothing checks it. That's why the exam prefers <code>tool_use</code> over prompt-only JSON.</p></div>
<h3>Choosing <code>tool_choice</code></h3>
<div class="table-wrap"><table>
<thead><tr><th>Situation</th><th>Setting</th></tr></thead>
<tbody>
<tr><td>One schema, and it must be filled (or a step that must run first, like <code>extract_metadata</code>)</td><td>Named tool: <code>{"type": "tool", "name": "…"}</code></td></tr>
<tr><td>Several schemas (invoice, receipt, contract) and the document type is unknown</td><td><code>{"type": "any"}</code>: a tool call is guaranteed, and Claude picks the matching schema</td></tr>
<tr><td>Claude may answer in prose instead</td><td><code>{"type": "auto"}</code>: no guarantee, so it's wrong for an extraction pipeline</td></tr>
</tbody></table></div>
<div class="callout today"><div class="callout-label">Real world today</div><p>On the exam, forcing the tool with <code>tool_choice</code> is the reliable answer. Today the strict guarantee comes from <code>strict: true</code> on the tool or from structured outputs, and some current models reject a forced <code>tool_choice</code>. The design ideas in this module (shape vs. truth, nullable fields, validation and retry) don't change either way.</p></div>`
    },
    {
      kind: "read",
      title: "Designing the schema like an object model",
      html: `
<p class="lede">Schema choices change Claude's behavior, just as field settings change how people fill in a page layout.</p>
<h3>Required vs. nullable: the "N/A" problem</h3>
<p>Make a field required on a page layout when reps often don't have the information, and you get "N/A", "TBD" and 01/01/1900 in your data. A model behaves the same way. If <code>renewal_date</code> is required and the contract never states one, Claude produces a plausible date. That's fabrication caused by your schema. The fix is to make the field <strong>nullable</strong> and say in the prompt: "return null when the document doesn't state it."</p>
<h3>Enums are restricted picklists</h3>
<ul>
<li><strong>Known, stable values:</strong> an <code>enum</code>, like a restricted picklist.</li>
<li><strong>Values that keep growing:</strong> add <code>"other"</code> plus a free-text <code>*_detail</code> field, the classic "Other (please specify)". New types get captured honestly instead of being forced into the nearest bucket.</li>
<li><strong>Genuinely ambiguous inputs:</strong> add <code>"unclear"</code>, and route those records to review rather than letting the model guess.</li>
</ul>
<h3>Normalization rules belong in the prompt</h3>
<p>Sources write "Mar 3", "03/03/26" and "3 March 2026". The schema can say <code>string</code>; it can't say which convention to use. Put a short data standard in the prompt: dates as YYYY-MM-DD, amounts as plain numbers with no currency symbol, country as an ISO code. It's the data dictionary you'd give a data-entry team.</p>
<h3>Build the self-check into the record</h3>
<p>Extract <code>calculated_total</code> (the sum of the line items) alongside <code>stated_total</code> (the printed total), plus a <code>conflict_detected</code> flag. Code can then compare them automatically.</p>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><p>This is a roll-up summary sitting next to a manually entered total, with a formula field that flags when they disagree.</p></div>
<div class="table-wrap"><table>
<thead><tr><th>Weak schema</th><th>Better schema</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>renewal_date</code>: required string</td><td>Nullable, and "return null if not stated"</td><td>Removes the pressure to invent a date</td></tr>
<tr><td><code>category</code>: enum of 6, forced choice</td><td>The 6 values plus <code>"other"</code> + <code>category_detail</code>, plus <code>"unclear"</code></td><td>New and ambiguous cases are recorded, not misfiled</td></tr>
<tr><td><code>total</code> only</td><td><code>stated_total</code> + <code>calculated_total</code> + <code>conflict_detected</code></td><td>Inconsistencies flag themselves</td></tr>
</tbody></table></div>`
    },
    {
      kind: "read",
      title: "Validation and retry: how a good error message works",
      html: `
<p class="lede">With <code>tool_use</code>, the shape is handled. What's left is checking meaning, and deciding what to do when a check fails.</p>
<h3>Two kinds of error</h3>
<ul>
<li><strong>Syntax errors:</strong> a missing required field, text where a number belongs, a value outside the enum. <code>tool_use</code> with a strict schema eliminates these.</li>
<li><strong>Semantic errors:</strong> valid types, wrong meaning. Line items don't add up to the total; shipping landed in the tax field; the due date is before the invoice date; a date sits in a string field in the wrong format. No schema can express these, so your code checks them after extraction.</li>
</ul>
<div class="callout sf"><div class="callout-label">If you know Salesforce</div><p>The schema is your field types. The semantic checks are your validation rules: cross-field logic such as "close date can't be before created date," evaluated after the data comes in.</p></div>
<h3>Retry with the error, not "try again"</h3>
<p>A good validation rule doesn't just say "save failed"; it says <em>what</em> is wrong and <em>where</em>. A good retry does the same. Send three things back to Claude:</p>
<ol class="moves">
<li>the original document;</li>
<li>the failed extraction;</li>
<li>the specific error, for example "line items sum to 1,180.00 but stated_total is 1,280.00; re-read the line items."</li>
</ol>
<p>Repeating the same prompt unchanged mostly reproduces the same mistake.</p>
<h3>When a retry can't help</h3>
<p>Retries fix <strong>format and structure</strong> problems. They can't create information that <strong>isn't in the input</strong>. If the PO number only exists on a separate purchase order you never sent, each retry is an invitation to invent one. It's like asking a rep three times for a number they don't have: eventually they'll make one up. The right moves are to return <code>null</code> and flag the record, to fetch and supply the missing document, or to send the record to a human.</p>
<div class="table-wrap"><table>
<thead><tr><th>Failure</th><th>Retry with feedback?</th></tr></thead>
<tbody>
<tr><td>Date as "March 3rd" when the standard is YYYY-MM-DD</td><td>Yes: a format error</td></tr>
<tr><td>Shipping cost placed in the tax field</td><td>Yes: a structural error</td></tr>
<tr><td>Extracted line items don't sum to the extracted total, though the document's own numbers agree</td><td>Yes: an extraction mistake the error message points to</td></tr>
<tr><td>The document's own printed numbers disagree with each other</td><td>No: flag <code>conflict_detected</code> and route to review</td></tr>
<tr><td>The value lives in another document you didn't provide</td><td>No: return null, or supply the document</td></tr>
</tbody></table></div>`
    },
    {
      kind: "widget",
      title: "Who catches it?",
      intro: "For each problem, decide what catches or fixes it: the schema itself, your validation code (and a retry with the error), or a human or more input.",
      widget: "sorter",
      config: {
        cats: [{ id: "schema", label: "The schema (tool_use)" }, { id: "code", label: "Validation code + retry" }, { id: "human", label: "A human or more input" }],
        items: [
          ["Total came back as the text \"about 1,200\" in a number field.", "schema", "A type mismatch. The schema enforced by tool_use prevents it."],
          ["The required vendor field is missing from the output.", "schema", "Required fields are part of the shape the schema guarantees."],
          ["Category came back as \"Hardware\" when the enum only allows \"hardware\".", "schema", "Out-of-enum values are a syntax problem a strict schema rules out."],
          ["Extracted line items sum to $1,180, but the extracted total is $1,280.", "code", "Valid types, wrong meaning. calculated_total vs stated_total catches it, and a retry quoting the mismatch fixes it."],
          ["The due date extracted is earlier than the invoice date.", "code", "A cross-field rule, like a validation rule. Check it in code, then retry with the specific error."],
          ["The PO number exists only on a separate purchase order you didn't send.", "human", "The information isn't in the input. Return null and flag it, or supply the document."],
          ["A handwritten scan where the amount is illegible.", "human", "No retry can read what isn't legible. Return null or \"unclear\" and route to review."]
        ]
      }
    },
    {
      kind: "read", key: "6",
      title: "In code: the retry, and closing the loop",
      html: `
<p class="lede">Here is the retry from the previous step as code, plus one more field that lets you learn from your reviewers.</p>
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
      kind: "widget", key: "7",
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
      kind: "quiz", key: "8",
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
      kind: "recap", key: "9",
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
