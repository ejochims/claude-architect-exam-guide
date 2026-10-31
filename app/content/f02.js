window.LESSONS.f02 = {
  cards: [
    { f: "Who executes a client tool: Claude or your code?", b: "Your code. Claude only asks, with a tool_use block naming the tool and its input; your code runs it and sends back a tool_result." },
    { f: "What links a tool_result to its request?", b: "tool_use_id: it must match the id of the tool_use block it answers." },
    { f: "What three things make up a tool definition?", b: "name, description (how Claude decides when to use it) and input_schema (a JSON Schema for its arguments)." },
    { f: "In JSON Schema, what do required and enum do?", b: "required lists properties that must be present; enum restricts a value to a fixed set." },
    { f: "How do you let a schema field be absent from the source?", b: "Leave it out of required, or allow null (\"type\": [\"string\", \"null\"]), and tell the model to return null rather than guess." },
    { f: "How does a tool report failure back to Claude?", b: "With a tool_result whose is_error is true and a message saying what went wrong, so the model can adapt." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: the model can only ask",
      html: `
<p class="lede">Claude produces text. It can't look up an order, query a database or send an email on its own. <strong>Tool use</strong> is the contract that lets it ask your code to do those things, in a form your code can parse reliably.</p>
<p>Before tool use, developers asked models to “reply in JSON” or to write commands in a special format, then parsed the text and hoped. A typo broke the parser, and the model had no standard way to learn what happened. Tool use replaces that with three structured pieces: a <strong>tool definition</strong> you send, a <strong><code>tool_use</code></strong> block Claude returns, and a <strong><code>tool_result</code></strong> you send back.</p>
<h3>A tool definition</h3>
<pre class="code"><code>{
  <span class="s">"name"</span>: <span class="s">"get_order"</span>,
  <span class="s">"description"</span>: <span class="s">"Look up one order by its number. Returns status, items and delivery date. Use when the customer gives an order number."</span>,
  <span class="s">"input_schema"</span>: {
    <span class="s">"type"</span>: <span class="s">"object"</span>,
    <span class="s">"properties"</span>: {
      <span class="s">"order_number"</span>: {<span class="s">"type"</span>: <span class="s">"string"</span>, <span class="s">"description"</span>: <span class="s">"e.g. A-1042"</span>}
    },
    <span class="s">"required"</span>: [<span class="s">"order_number"</span>]
  }
}</code></pre>
<p>The <strong>description</strong> is how Claude decides <em>when</em> to use the tool, so it matters as much as the code behind it. Module 2 is about writing it well.</p>
<h3>JSON Schema in two minutes</h3>
<p><code>input_schema</code> is written in <strong>JSON Schema</strong>, a standard way to describe the shape of JSON data:</p>
<ul>
<li><code>"type"</code>: <code>"object"</code>, <code>"string"</code>, <code>"number"</code>, <code>"integer"</code>, <code>"boolean"</code>, <code>"array"</code>, or <code>"null"</code>. A list such as <code>["string", "null"]</code> allows either.</li>
<li><code>"properties"</code>: the fields of an object, each with its own schema.</li>
<li><code>"required"</code>: which properties must be present.</li>
<li><code>"enum"</code>: a fixed set of allowed values, such as <code>["refund", "exchange", "other"]</code>.</li>
</ul>
<p>The same tool-and-schema mechanism is also how you get <strong>structured output</strong>: define a tool whose schema is the shape you want, and read the arguments Claude fills in (Module 9).</p>`
    },
    {
      kind: "read",
      title: "One round trip, end to end",
      html: `
<p class="lede">Here is the whole exchange for “Where is order A-1042?”. It takes two requests.</p>
<svg viewBox="0 0 640 300" role="img" aria-label="Tool use round trip between your code, Claude, and the order system" style="width:100%;height:auto;margin:6px 0 14px">
  <text x="90" y="22" text-anchor="middle" style="fill:var(--fg);font:600 14px var(--sans)">Your code</text>
  <text x="320" y="22" text-anchor="middle" style="fill:var(--accent-ink);font:600 14px var(--sans)">Claude</text>
  <text x="550" y="22" text-anchor="middle" style="fill:var(--fg);font:600 14px var(--sans)">Order system</text>
  <path d="M90 32 V290 M320 32 V290 M550 32 V290" style="stroke:var(--line);stroke-width:2;stroke-dasharray:4 5"/>
  <path d="M90 60 H312" style="stroke:var(--fg);stroke-width:2"/><path d="M304 54 l8 6 -8 6" style="stroke:var(--fg);stroke-width:2;fill:none"/>
  <text x="200" y="52" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">① request: question + tools</text>
  <path d="M320 105 H98" style="stroke:var(--accent);stroke-width:2"/><path d="M106 99 l-8 6 8 6" style="stroke:var(--accent);stroke-width:2;fill:none"/>
  <text x="205" y="97" text-anchor="middle" style="fill:var(--accent-ink);font:12.5px var(--sans)">② tool_use: get_order(A-1042)</text>
  <path d="M90 150 H542" style="stroke:var(--fg);stroke-width:2"/><path d="M534 144 l8 6 -8 6" style="stroke:var(--fg);stroke-width:2;fill:none"/>
  <text x="320" y="142" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">③ your code calls the real system</text>
  <path d="M550 185 H98" style="stroke:var(--fg);stroke-width:2"/><path d="M106 179 l-8 6 8 6" style="stroke:var(--fg);stroke-width:2;fill:none"/>
  <text x="320" y="177" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">status: shipped, arrives Friday</text>
  <path d="M90 230 H312" style="stroke:var(--fg);stroke-width:2"/><path d="M304 224 l8 6 -8 6" style="stroke:var(--fg);stroke-width:2;fill:none"/>
  <text x="200" y="222" text-anchor="middle" style="fill:var(--muted);font:12.5px var(--sans)">④ request: history + tool_result</text>
  <path d="M320 275 H98" style="stroke:var(--accent);stroke-width:2"/><path d="M106 269 l-8 6 8 6" style="stroke:var(--accent);stroke-width:2;fill:none"/>
  <text x="205" y="267" text-anchor="middle" style="fill:var(--accent-ink);font:12.5px var(--sans)">⑤ “It arrives Friday.” end_turn</text>
</svg>
<p><strong>② Claude's response</strong> ends with <code>stop_reason: "tool_use"</code> and contains a block like this:</p>
<pre class="code"><code>{<span class="s">"type"</span>: <span class="s">"tool_use"</span>, <span class="s">"id"</span>: <span class="s">"toolu_01"</span>, <span class="s">"name"</span>: <span class="s">"get_order"</span>,
 <span class="s">"input"</span>: {<span class="s">"order_number"</span>: <span class="s">"A-1042"</span>}}</code></pre>
<p><strong>④ Your next request</strong> resends the history, adds Claude's reply as an <code>assistant</code> message, then a <code>user</code> message carrying the result:</p>
<pre class="code"><code>{<span class="s">"role"</span>: <span class="s">"user"</span>, <span class="s">"content"</span>: [
  {<span class="s">"type"</span>: <span class="s">"tool_result"</span>, <span class="s">"tool_use_id"</span>: <span class="s">"toolu_01"</span>,
   <span class="s">"content"</span>: <span class="s">"status: shipped; delivery: Friday"</span>}
]}</code></pre>
<p>If the lookup fails, send the <code>tool_result</code> with <code>"is_error": true</code> and a message saying what went wrong, so Claude can retry, ask the customer, or explain.</p>
<div class="callout key"><div class="callout-label">Hold on to this</div><p>Claude decides <em>which</em> tool to call and with what input. <strong>Your code decides whether and how it runs.</strong> That split is why later modules put hard rules (refund limits, identity checks) in code that sits between the request and the real system.</p></div>
<p>Repeat steps ②–④ until Claude answers with <code>"end_turn"</code> and you have an <strong>agent loop</strong>. That's Module 1.</p>`
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "Tool use is a typed contract: a definition you send, a tool_use block back, a tool_result you return.",
        "Claude asks; your code executes. That's where enforcement can live.",
        "A tool definition is name + description + input_schema; the description drives selection.",
        "JSON Schema basics: type, properties, required, enum, and null for 'may be absent'.",
        "tool_result answers a specific tool_use_id; is_error tells Claude the call failed.",
        "Loop until stop_reason is end_turn and you've built an agent."
      ]
    }
  ]
};
