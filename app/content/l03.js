window.LESSONS.l03 = {
 "cards": [
  {
   "f": "A field may be absent from the document. Schema?",
   "b": "Make it nullable (or optional) and tell the model to return null rather than guess."
  },
  {
   "f": "When does a validation retry help?",
   "b": "When the information is in the document and the model misformatted or misread it. Not when the information is missing."
  },
  {
   "f": "How do you match batch results to inputs?",
   "b": "custom_id on every request. Results aren't in order."
  }
 ],
 "steps": [
  {
   "kind": "read",
   "title": "The brief",
   "html": "<p class=\"lede\">Build a pipeline that extracts invoice data into a fixed schema, validates it, retries what can be fixed, routes the rest to people, and runs at scale through the Batch API. This lab pulls together Modules 8, 9, 10 and 13.</p><svg viewBox=\"0 0 640 110\" role=\"img\" aria-label=\"Documents are extracted, validated, then retried or sent to review\" style=\"width:100%;height:auto;margin:8px 0 14px\"><rect x=\"10\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"76\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Documents</text><text x=\"76\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">invoices</text><path d=\"M145 55 H161 M155 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"165\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--accent-soft);stroke:var(--accent)\"/><text x=\"232\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Extract</text><text x=\"232\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">tool + schema</text><path d=\"M300 55 H316 M310 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"320\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"386\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Validate</text><text x=\"386\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">code checks</text><path d=\"M455 55 H471 M465 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"475\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"542\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Retry or review</text><text x=\"542\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">targeted</text></svg><h3>Requirements</h3><ul><li>A schema with required, nullable and enum-with-other fields.</li><li>Code that checks totals and formats.</li><li>Retries that include the specific error.</li><li>Conflicts flagged for human review.</li><li>Bulk runs through the Batch API, matched by <code>custom_id</code>.</li></ul><h3>Done when</h3><p>No field is ever invented to satisfy the schema, every retry carries the error that triggered it, and nothing is retried when the information simply isn't there.</p>"
  },
  {
   "kind": "widget",
   "title": "Design decisions",
   "intro": "How should each field or check be handled?",
   "widget": "sorter",
   "config": {
    "cats": [
     {
      "id": "req",
      "label": "Required field"
     },
     {
      "id": "null",
      "label": "Nullable field"
     },
     {
      "id": "enum",
      "label": "Enum + other"
     },
     {
      "id": "code",
      "label": "Validate in code"
     }
    ],
    "items": [
     [
      "invoice_number: every invoice has one.",
      "req",
      "Always present, so required is safe."
     ],
     [
      "po_number: only some invoices reference a PO.",
      "null",
      "Often absent; null avoids fabrication."
     ],
     [
      "payment_terms: NET30, NET60, plus whatever else appears.",
      "enum",
      "Standard values plus \"other\" and a detail string."
     ],
     [
      "Line items must sum to the stated total.",
      "code",
      "A semantic rule the schema can't express."
     ],
     [
      "invoice_date must be ISO 8601.",
      "code",
      "State it in the prompt, then check it deterministically."
     ]
    ]
   }
  },
  {
   "kind": "read",
   "title": "Build it: extract, validate, retry, batch",
   "html": "<p class=\"lede\">The schema guarantees the shape; your code checks the meaning.</p><pre class=\"code\"><code>EXTRACT = {\n  &quot;name&quot;: &quot;record_invoice&quot;,\n  &quot;description&quot;: &quot;Record the fields of one invoice exactly as stated in it.&quot;,\n  &quot;strict&quot;: True,                                  # schema-valid input, guaranteed; strict needs additionalProperties False\n  &quot;input_schema&quot;: {\n    &quot;type&quot;: &quot;object&quot;, &quot;additionalProperties&quot;: False,\n    &quot;required&quot;: [&quot;invoice_number&quot;, &quot;po_number&quot;, &quot;payment_terms&quot;, &quot;line_items&quot;, &quot;stated_total&quot;],\n    &quot;properties&quot;: {\n      &quot;invoice_number&quot;: {&quot;type&quot;: &quot;string&quot;},\n      &quot;po_number&quot;: {&quot;type&quot;: [&quot;string&quot;, &quot;null&quot;]},    # null when the invoice has none\n      &quot;payment_terms&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;enum&quot;: [&quot;NET30&quot;, &quot;NET60&quot;, &quot;other&quot;]},\n      &quot;line_items&quot;: {&quot;type&quot;: &quot;array&quot;, &quot;items&quot;: {&quot;type&quot;: &quot;object&quot;,\n          &quot;additionalProperties&quot;: False, &quot;required&quot;: [&quot;amount&quot;],\n          &quot;properties&quot;: {&quot;amount&quot;: {&quot;type&quot;: &quot;number&quot;}}}},\n      &quot;stated_total&quot;: {&quot;type&quot;: &quot;number&quot;}}}}\n\ndef problems(rec):\n    found = []\n    if abs(sum(i[&quot;amount&quot;] for i in rec[&quot;line_items&quot;]) - rec[&quot;stated_total&quot;]) &gt; 0.01:\n        found.append(&quot;line_items do not sum to stated_total&quot;)\n    return found\n\n# Retry with the document, the failed extraction and the exact error.\n# If the same error persists (e.g. an illegible scan), stop and route to review.\n\nbatch = client.messages.batches.create(requests=[\n    {&quot;custom_id&quot;: doc_id, &quot;params&quot;: {&quot;model&quot;: &quot;claude-sonnet-5-5&quot;, &quot;max_tokens&quot;: 2048,\n        &quot;tools&quot;: [EXTRACT],\n        &quot;tool_choice&quot;: {&quot;type&quot;: &quot;tool&quot;, &quot;name&quot;: &quot;record_invoice&quot;},  # exam framing\n        &quot;messages&quot;: [{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: text}]}}\n    for doc_id, text in documents])</code></pre><ul><li><strong>Exam framing:</strong> structured output comes from tool use with a JSON schema and <code>tool_choice</code> forcing the call. <strong>Today:</strong> <code>strict: true</code> guarantees the schema, and forced tool choice returns 400 on some current models (see <a href=\"#today\">Exam vs. today</a>).</li><li>Refine the prompt on a sample with synchronous calls before you batch.</li></ul><div class=\"callout today\"><div class=\"callout-label\">Try it for real (optional)</div><p>Run it on ten invoices you have permission to use, deliberately include one without a PO number, and confirm it comes back <code>null</code>. See the <a href=\"https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use\" target=\"_blank\" rel=\"noopener\">strict tool use</a> and <a href=\"https://platform.claude.com/docs/en/build-with-claude/batch-processing\" target=\"_blank\" rel=\"noopener\">batch</a> docs.</p></div>"
  },
  {
   "kind": "widget",
   "title": "Debug it",
   "intro": "Will a retry with error feedback fix it?",
   "widget": "sorter",
   "config": {
    "cats": [
     {
      "id": "retry",
      "label": "Retry with the error"
     },
     {
      "id": "no",
      "label": "Retry won't help"
     }
    ],
    "items": [
     [
      "Dates came back as DD/MM; the document shows the locale.",
      "retry",
      "The information is there; the format was wrong."
     ],
     [
      "A total is illegible on a low-quality scan.",
      "no",
      "The information isn't recoverable; flag it for review."
     ],
     [
      "The cost center is defined only in a sheet the pipeline doesn't send.",
      "no",
      "Supply the sheet or return null and flag it."
     ],
     [
      "The amount was read as 1280 instead of 1.280,50 EUR.",
      "retry",
      "Add normalization rules and retry with the specific error."
     ]
    ]
   }
  },
  {
   "kind": "recap",
   "title": "Recap",
   "points": [
    "Required only when always present; nullable when it may be absent.",
    "Enum + other + detail for growing category sets.",
    "Validate meaning in code; retry with the specific error.",
    "Don't retry missing information: flag it.",
    "Batch with custom_id after refining on a sample."
   ]
  }
 ]
};
