window.LESSONS.f04 = {
  cards: [
    { f: "In one sentence, what does a language model do when it answers?", b: "It writes one token at a time, each chosen as a likely continuation of everything in the request. It looks nothing up unless a tool result or document is in its context." },
    { f: "Why does a model state things that aren't true (“hallucinate”)?", b: "It produces plausible text, and a plausible value is still text. When the information isn't in its context, or a required field demands a value, it fills the gap. Fix the gap: supply the source, allow null, validate in code." },
    { f: "What does temperature change, and what doesn't it change?", b: "It changes how much the output varies between runs. It doesn't make an answer correct or an instruction guaranteed: at 0 you get the same mistake every time." },
    { f: "What is fine-tuning, and why is it rarely the exam's answer?", b: "Training a model further on your own examples, which changes the model itself. It's out of scope for the exam, slow and costly, and the blueprint's fixes (context, descriptions, examples, schemas, code) come first." },
    { f: "What is RAG, in one line?", b: "Retrieval-augmented generation: search your documents for passages related to the question, often with embeddings in a vector database, and put them in the prompt. It's a way of supplying context, and out of scope by name." },
    { f: "What does extended thinking add, and what can't it add?", b: "It lets the model reason before it answers, which helps on hard problems. It can't add information that's missing from context, and it doesn't make a same-session review independent." },
    { f: "Prompt caching and streaming: what do they change?", b: "Cost and speed only. Caching makes a repeated prompt prefix cheaper and faster; streaming delivers the reply as it's written. Neither changes what the model knows or decides." },
    { f: "What does idempotent mean, and why does it matter for retries?", b: "Running the operation twice has the same effect as running it once. A retry after a timeout is only safe if the tool is idempotent, or you'd issue a second refund." },
    { f: "What is Pydantic?", b: "A Python library for declaring a data shape as a class and validating data against it. It's one way to write the validation code that runs after extraction, and its error messages are what you send back in a retry." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: a model writes likely text",
      html: `
<p class="lede">F1 treated the model as a function: a request goes in, a response comes out. This lesson opens the function just far enough to explain three things the rest of the course relies on: why instructions are followed only <em>most</em> of the time, why models invent values, and why several popular fixes don't fix either.</p>
<h3>How it was made</h3>
<p>A language model is a very large mathematical function with billions of adjustable numbers, called <strong>weights</strong>. During <strong>training</strong>, it's shown enormous amounts of text and adjusted, over and over, to get better at one task: given the text so far, predict the next token. When training ends the weights are frozen. Two consequences follow:</p>
<ul>
<li><strong>It knows nothing after its training cutoff</strong>, and nothing about your company, unless you put that information in the request.</li>
<li><strong>It doesn't learn from your conversations.</strong> Calling the API never changes the weights. That's the deeper reason behind F1's rule that your code is the memory.</li>
</ul>
<h3>How it answers</h3>
<p>To reply, the model reads the whole request and produces a probability for every possible next token. One is picked, added to the text, and the process repeats until the reply is finished. Everything Claude writes, including a <code>tool_use</code> block, is produced this way.</p>
<div class="callout key"><div class="callout-label">Why this matters</div><ul style="margin:0;padding-left:18px">
<li><strong>Instructions shift probabilities.</strong> “Never refund over $500” makes the wrong tokens unlikely. It doesn't make them impossible. That's Module 3's whole argument.</li>
<li><strong>Plausible isn't the same as true.</strong> The model has no separate store of facts that it checks. If the answer isn't in its context, the likeliest continuation is still a confident, well-formed sentence.</li>
<li><strong>Better input beats harder asking.</strong> Because the reply is a continuation of the request, the reliable way to change it is to change what's in the request: context, tool descriptions, examples, a schema.</li>
</ul></div>
<h3>Hallucination, precisely</h3>
<p>People call an invented answer a <strong>hallucination</strong>. It helps to name the three situations that produce one, because each has a different fix:</p>
<div class="table-wrap"><table>
<thead><tr><th>Cause</th><th>Example</th><th>Fix</th><th>Module</th></tr></thead>
<tbody>
<tr><td>The information isn't in context</td><td>Asked for an order status with no lookup tool</td><td>Supply it: a tool, a document, a case-facts block</td><td>1, 7</td></tr>
<tr><td>The output format demands a value</td><td>A required <code>renewal_date</code> on a contract that has none</td><td>Allow <code>null</code>, and say when to use it</td><td>9</td></tr>
<tr><td>The source was read wrongly</td><td>Shipping cost placed in the tax field</td><td>Validate in code, then retry with the specific error</td><td>9</td></tr>
</tbody></table></div>
<p>Notice that none of the fixes is “tell it not to hallucinate.” That instruction adds no information.</p>
<h3>Temperature</h3>
<p><strong>Temperature</strong> is a setting that controls how the next token is picked. At 0 the most likely token is nearly always chosen, so repeated runs give nearly the same output. Higher values pick less likely tokens more often, so runs vary more.</p>
<p>What it doesn't do matters more here. Temperature changes <em>variation</em>, not <em>correctness</em>. If a vague tool description makes the wrong tool the likeliest choice, temperature 0 chooses the wrong tool every time. And a rule followed 99.5% of the time doesn't become a guarantee at any temperature.</p>
<div class="callout today"><div class="callout-label">Real world today</div><p>Recent Claude models no longer accept a custom temperature: the API rejects the parameter. You control behavior through the prompt, tools and schemas. An option that says “lower the temperature” was never the root-cause fix, and today it often isn't available at all.</p></div>
<h3>Extended thinking</h3>
<p><strong>Extended thinking</strong> (today usually <em>adaptive</em> thinking) lets the model reason through a problem before it writes its answer. It helps on hard, multi-step reasoning. It has two limits the exam cares about:</p>
<ul>
<li>It can't supply information that's missing from context. Thinking longer about a PO number that isn't in the document doesn't find it.</li>
<li>It doesn't make a review independent. A session that wrote code and then thinks hard about that code is still anchored to its own reasoning (Module 8).</li>
</ul>`
    },
    {
      kind: "read",
      title: "Fixes the exam doesn't want, and how to recognize them",
      html: `
<p class="lede">The official guide lists topics that won't be examined, and the full list is on the <a href="#blueprint">Blueprint</a> page. You won't be asked how they work. You still need one sentence on each, because an answer option can name one, and you have to see why it doesn't address the problem in the question.</p>
<p>The test is the same every time: <strong>does this change what the model knows, what it's allowed to do, or neither?</strong> The blueprint's answers change the first two. Most of the terms below change neither, or change them at far greater cost than the proportionate fix.</p>
<div class="table-wrap"><table>
<thead><tr><th>Term</th><th>What it is</th><th>Why it's rarely the answer here</th></tr></thead>
<tbody>
<tr><td><strong>Fine-tuning</strong></td><td>Training a model further on your own examples, producing a changed model</td><td>Slow, costly, and it changes the model when the fault is in the request. Out of scope. It's Module 0's “over-built first step.”</td></tr>
<tr><td><strong>RAG</strong> (retrieval-augmented generation)</td><td>Search your documents for passages related to the question and add them to the prompt</td><td>It's a legitimate way to supply context, but the machinery is out of scope. If a handful of known facts must survive, a case-facts block is the proportionate fix.</td></tr>
<tr><td><strong>Embeddings</strong> and <strong>vector databases</strong></td><td>An embedding turns text into a list of numbers so that similar meanings sit close together; a vector database stores them and finds the nearest ones. They're how RAG searches.</td><td>Out of scope. New infrastructure, when the question usually asks for a first step.</td></tr>
<tr><td><strong>A larger model</strong> or <strong>context window</strong></td><td>More capacity</td><td>Capacity doesn't repair a vague description, a required field or a missing rule (trap T3).</td></tr>
<tr><td><strong>Temperature 0</strong></td><td>Less variation between runs</td><td>Consistent isn't correct, and it isn't guaranteed.</td></tr>
<tr><td><strong>Extended thinking</strong></td><td>Reasoning before answering</td><td>Adds no missing information and no independence.</td></tr>
<tr><td><strong>Prompt caching</strong></td><td>A repeated prompt prefix (a long system prompt, a big document) is stored briefly so later requests reuse it at lower cost and latency</td><td>The model sees exactly the same content either way. It's a cost lever; details are out of scope.</td></tr>
<tr><td><strong>Streaming</strong></td><td>The reply is delivered piece by piece as it's written</td><td>Changes how output arrives, not what it says. Out of scope.</td></tr>
</tbody></table></div>
<div class="callout key"><div class="callout-label">One honest caveat</div><p>None of these is a bad idea in general. Teams use RAG, caching and streaming every day, and fine-tuning has its place. On this exam they lose because the question describes a specific fault, and a cheaper change removes it. When two options would both work, the exam wants the one that targets the root cause at the lowest cost.</p></div>
<h3>Three terms the questions use without stopping to explain</h3>
<ul>
<li><strong>Rate limit.</strong> An API's cap on how many requests or tokens you may send in a period. Going over returns an error (HTTP 429). It's a <em>transient</em> failure in Module 4's terms: wait and retry with backoff. The numbers are out of scope.</li>
<li><strong>Idempotent.</strong> An operation is idempotent if running it twice has the same effect as running it once. Reading an order is. “Refund $40” is not, unless the tool recognizes a repeat, usually from a unique request ID sent with the call. It matters whenever a tool times out: you don't know whether it ran, so a retry is safe only if the tool is idempotent. If it isn't, the tool should report an uncertain state so the agent checks before trying again.</li>
<li><strong>Pydantic.</strong> A Python library for declaring a data shape as a class and validating data against it. You may see it named next to JSON Schema. It's one way to write Module 9's validation code: Pydantic checks the record, and its error messages are the specific feedback you send back in a retry. It can also generate the JSON Schema for a tool's <code>input_schema</code>.</li>
</ul>
<pre class="code"><code><span class="k">from</span> pydantic <span class="k">import</span> BaseModel, model_validator

<span class="k">class</span> Invoice(BaseModel):
    vendor: str
    po_number: str | None            <span class="c"># may be absent: null is allowed</span>
    line_items: list[float]
    stated_total: float

    @model_validator(mode=<span class="s">"after"</span>)
    <span class="k">def</span> totals_agree(self):          <span class="c"># a semantic check no schema can express</span>
        <span class="k">if</span> abs(sum(self.line_items) - self.stated_total) &gt; <span class="k">0.01</span>:
            <span class="k">raise</span> ValueError(<span class="s">"line_items do not sum to stated_total"</span>)
        <span class="k">return</span> self

Invoice(**tool_use_block.input)      <span class="c"># raises a ValidationError that says exactly what failed</span></code></pre>
<p class="small">You only need to read this: the class is the schema, the decorated function is a validation rule, and the error it raises is what goes back to Claude.</p>`
    },
    {
      kind: "widget",
      title: "What does it actually change?",
      intro: "Sort each change by what it really affects. The blueprint's answers sit in the first and last columns.",
      widget: "sorter",
      config: {
        cats: [
          { id: "know", label: "What the model knows or reads" },
          { id: "vary", label: "Run-to-run variation" },
          { id: "cost", label: "Cost or speed only" },
          { id: "code", label: "What's possible (code)" }
        ],
        items: [
          ["Add the customer's verified order details to the request as a case-facts block.", "know", "It puts information in context, where the model can use it."],
          ["Set temperature to 0.", "vary", "Outputs repeat more closely. A wrong choice repeats too."],
          ["Turn on prompt caching for a 6,000-token system prompt.", "cost", "The model reads the same prompt. Later requests just cost less and start faster."],
          ["Deny process_refund over $500 in a PreToolUse hook.", "code", "The call can't go through, whatever the model decides."],
          ["Rewrite two overlapping tool descriptions so each says when to use the other.", "know", "Descriptions are what the model reads to choose a tool."],
          ["Stream the reply to the chat window.", "cost", "The customer sees words sooner. The words are the same."],
          ["Send overnight extractions through the Message Batches API.", "cost", "Half the price for work nothing is waiting on. The output is unchanged."],
          ["Retrieve the three most relevant policy passages and add them to the prompt.", "know", "That's RAG: a way of supplying context. The idea is sound; the machinery is out of scope."],
          ["Validate that line items sum to the stated total before saving the record.", "code", "A check in your code runs every time."],
          ["Make renewal_date nullable and say to return null when the contract is silent.", "know", "The schema and instruction the model reads no longer demand an invented value."]
        ]
      }
    },
    {
      kind: "quiz",
      title: "Check your understanding",
      questions: [
        {
          id: "qf4-1", ts: "4.3", scenario: 6,
          stem: "A contract-extraction schema marks <code>governing_law</code> as a required string. For contracts that never name a jurisdiction, the output still contains a plausible one. A teammate says the model is “hallucinating” and offers four fixes. Which one removes the cause?",
          options: [
            { t: "Fine-tune the model on a few hundred correctly extracted contracts, so it learns your format.", trap: "T2", why: "Fine-tuning changes the model, but the schema still demands a string when the contract has none. It's also far more work than the fault calls for." },
            { t: "Set temperature to 0, so the model stops producing varied or invented values.", why: "Temperature controls variation between runs. At 0 you get the same plausible jurisdiction every time." },
            { t: "Allow <code>null</code> for the field, and say to return it when the contract is silent.", ok: true, why: "The required field is what forces a value. Once null is allowed and explained, the pressure to invent one is gone." },
            { t: "Move to a larger model, which is less prone to inventing values for missing fields.", trap: "T3", why: "Any model must supply a string when the schema requires one. Capacity doesn't change the schema." }
          ]
        },
        {
          id: "qf4-2", ts: "1.5", scenario: 1,
          stem: "Policy says no account may be closed without a completed identity check. The rule is in the system prompt in capitals, and logs show 0.4% of closures still skip the check. Which change makes the rule hold?",
          options: [
            { t: "A <code>PreToolUse</code> hook that denies <code>close_account</code> until this session has a verified identity.", ok: true, why: "A hook is code that runs on every call, so the closure is impossible without the check. Its deny reason can tell Claude to verify first." },
            { t: "Turn on extended thinking, so the model reasons through the policy before each tool call.", why: "Thinking improves reasoning, but the model still chooses the call. A rule with account consequences needs a guarantee, not better odds." },
            { t: "Lower the temperature to 0, so the model follows the instruction the same way every time.", why: "Less variation isn't a guarantee. The skipped check can simply become the consistent behavior for some inputs." },
            { t: "Fine-tune on transcripts where the identity check was done, so the habit is built into the model.", trap: "T2", why: "A trained habit is still a probability. It costs far more than a hook and guarantees less." }
          ]
        },
        {
          id: "qf4-3", ts: "5.1", scenario: 1,
          stem: "After about 30 turns of progressive summarization, a support agent can no longer state the exact credit ($184.60) it promised the customer. Which fix is proportionate?",
          options: [
            { t: "Store every turn as embeddings in a vector database, and retrieve the most similar turns for each reply.", trap: "T2", why: "Retrieval could work, but it's new infrastructure for a few values you already know matter, and a similarity search can still miss the turn." },
            { t: "Enable prompt caching on the conversation, so earlier turns are kept at full fidelity.", why: "Caching lowers the cost of resending an identical prefix. It doesn't change what's in the request, and the summary has already dropped the amount." },
            { t: "Use a model with a larger context window, so summarization is no longer needed.", trap: "T3", why: "It postpones the problem, costs more every turn, and facts in a long history are still easy to miss." },
            { t: "Keep amounts, dates and commitments in a case-facts block sent with every request.", ok: true, why: "The specifics live outside the summarized history, so summarizing can't blur them." }
          ]
        },
        {
          id: "qf4-4", ts: "4.6", scenario: 5,
          stem: "In CI, Claude writes a database migration and then reviews it in the same session. It approves a script that drops a column another service still reads. Which change gives the strongest review?",
          options: [
            { t: "Have the same session review the migration again with extended thinking turned on.", why: "It reasons longer from the same context, so it's still anchored to the reasoning that produced the script." },
            { t: "Run the same-session review three times at a higher temperature, and keep any issue found twice.", why: "The wording varies between runs, but every run starts from the same anchored context." },
            { t: "Give the diff and the review criteria to a separate instance that never saw the reasoning.", ok: true, why: "An independent instance has nothing to defend. It judges the diff against the criteria alone." },
            { t: "Stream the review output, so a developer can interrupt as soon as something looks wrong.", why: "Streaming changes when the text arrives, not what the review finds. And nobody is watching a CI run." }
          ]
        },
        {
          id: "qf4-5", ts: "2.1", scenario: 4,
          stem: "An agent has two tools, <code>search_wiki</code> (“Searches docs”) and <code>search_tickets</code> (“Searches items”), and chooses between them almost at random. What should you try first?",
          options: [
            { t: "Index both tools' documentation for retrieval, and inject the closest passages before each call.", trap: "T2", why: "That builds a retrieval system to deliver what two better descriptions would say directly." },
            { t: "Fine-tune the model on logged calls that were labeled with the correct tool.", trap: "T2", why: "Training a model to compensate for two vague descriptions is the most expensive possible first step." },
            { t: "Set temperature to 0, so the tool selection stops varying between runs.", why: "Selection would be consistent, but nothing in either description says which tool is right, so it would be consistently arbitrary." },
            { t: "Rewrite both descriptions: what each covers, example queries, and when to use the other.", ok: true, why: "The model chooses from descriptions. These two don't distinguish the tools, so fix the input that causes the bad choice." }
          ]
        }
      ]
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "A model writes one likely token at a time from what's in the request. Its weights are frozen: it doesn't learn from your calls.",
        "Instructions shift probabilities, which is why hard rules need code.",
        "Invented values come from missing context, a format that demands a value, or a misread source. Fix that cause.",
        "Temperature changes variation, not correctness. Extended thinking adds reasoning, not information or independence.",
        "Fine-tuning, RAG, embeddings, caching and streaming are out of scope. Know one line on each so you can rule them out.",
        "Ask of every option: does it change what the model knows, what it's allowed to do, or neither?",
        "Idempotent means safe to run twice. A retry after a timeout is only safe when the tool is."
      ]
    }
  ]
};
