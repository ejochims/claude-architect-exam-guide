window.LESSONS.f01 = {
  cards: [
    { f: "What does the model know when it answers a request?", b: "Only what's in that request: the system prompt, the message history you send, and the tool definitions. Nothing carries over between calls." },
    { f: "Where does conversation memory live?", b: "In your code. It resends the history on every call. The model is stateless." },
    { f: "What is the context window?", b: "The maximum amount of text (measured in tokens) one request can hold: system prompt, tools, history and the new message together." },
    { f: "What is max_tokens?", b: "A cap on how much the model may write in this response. Hitting it truncates the answer (stop_reason \"max_tokens\")." },
    { f: "System prompt vs user message?", b: "The system prompt sets standing instructions and context for the whole conversation; user messages are the turn-by-turn input." },
    { f: "API vs SDK?", b: "The API is the HTTP endpoint (the Messages API). An SDK is a client library (Python, TypeScript…) that calls it for you." }
  ],
  steps: [
    {
      kind: "read",
      title: "First principle: a model call is a function",
      html: `
<p class="lede">Everything in this course rests on one fact: each call to Claude is like calling a function. You send a request, you get a response, and the model keeps nothing afterwards.</p>
<p>Your application talks to Claude through the <strong>Messages API</strong>, an HTTP endpoint. You authenticate with an API key and send JSON. Most teams use an <strong>SDK</strong> (a client library for Python, TypeScript and other languages) so they don't hand-write HTTP calls. Either way, the request has the same parts:</p>
<pre class="code"><code>{
  <span class="s">"model"</span>: <span class="s">"claude-…"</span>,            <span class="c"># which model answers</span>
  <span class="s">"max_tokens"</span>: <span class="k">1024</span>,             <span class="c"># cap on the length of the reply</span>
  <span class="s">"system"</span>: <span class="s">"You are a support agent for…"</span>,  <span class="c"># standing instructions</span>
  <span class="s">"messages"</span>: [                    <span class="c"># the conversation so far</span>
    {<span class="s">"role"</span>: <span class="s">"user"</span>, <span class="s">"content"</span>: <span class="s">"Where is order 1042?"</span>}
  ]
}</code></pre>
<p>Nothing persists on Anthropic's side between calls: the API processes each request on its own and doesn't store your conversation for the next one. That's what <em>stateless</em> means.</p>
<p>The response holds the model's output as a list of <strong>content blocks</strong> (text, or a request to use a tool) and a <code>stop_reason</code> that says why it stopped: it finished (<code>"end_turn"</code>), it wants a tool (<code>"tool_use"</code>), or it hit the length cap (<code>"max_tokens"</code>).</p>

<!-- ex:f01-response -->
<p><strong>What comes back.</strong> The response to that request looks like this. The reply sits in <code>content</code>, a list of blocks; here there's a single text block. This agent has no tools yet (F2 adds them), so it can't actually look the order up:</p>
<pre class="code"><code>{
  <span class="s">"id"</span>: <span class="s">"msg_01…"</span>,
  <span class="s">"type"</span>: <span class="s">"message"</span>,
  <span class="s">"role"</span>: <span class="s">"assistant"</span>,
  <span class="s">"content"</span>: [
    {<span class="s">"type"</span>: <span class="s">"text"</span>, <span class="s">"text"</span>: <span class="s">"I can't look up orders, but I can explain how tracking works."</span>}
  ],
  <span class="s">"stop_reason"</span>: <span class="s">"end_turn"</span>,                  <span class="c"># finished normally</span>
  <span class="s">"usage"</span>: {<span class="s">"input_tokens"</span>: <span class="k">48</span>, <span class="s">"output_tokens"</span>: <span class="k">17</span>}   <span class="c"># what you're billed for</span>
}</code></pre><svg viewBox="0 0 640 170" role="img" aria-label="Request goes into the model, response comes out, nothing is kept" style="width:100%;height:auto;margin:10px 0">
  <rect x="10" y="40" width="190" height="90" rx="12" style="fill:var(--sunk);stroke:var(--line)"/>
  <text x="105" y="70" text-anchor="middle" style="fill:var(--fg);font:600 15px var(--sans)">Request</text>
  <text x="105" y="94" text-anchor="middle" style="fill:var(--muted);font:13px var(--sans)">system + messages</text>
  <text x="105" y="113" text-anchor="middle" style="fill:var(--muted);font:13px var(--sans)">+ tool definitions</text>
  <rect x="245" y="40" width="150" height="90" rx="12" style="fill:var(--accent-soft);stroke:var(--accent)"/>
  <text x="320" y="80" text-anchor="middle" style="fill:var(--accent-ink);font:600 15px var(--sans)">Claude</text>
  <text x="320" y="102" text-anchor="middle" style="fill:var(--accent-ink);font:13px var(--sans)">keeps no memory</text>
  <rect x="440" y="40" width="190" height="90" rx="12" style="fill:var(--sunk);stroke:var(--line)"/>
  <text x="535" y="70" text-anchor="middle" style="fill:var(--fg);font:600 15px var(--sans)">Response</text>
  <text x="535" y="94" text-anchor="middle" style="fill:var(--muted);font:13px var(--sans)">content blocks</text>
  <text x="535" y="113" text-anchor="middle" style="fill:var(--muted);font:13px var(--sans)">+ stop_reason</text>
  <path d="M200 85 H240 M395 85 H435" style="stroke:var(--fg);stroke-width:2;fill:none"/>
  <path d="M232 79 l8 6 -8 6 M427 79 l8 6 -8 6" style="stroke:var(--fg);stroke-width:2;fill:none"/>
</svg>
<div class="callout key"><div class="callout-label">Why this matters</div><p>Because the model keeps nothing, <strong>your code is its memory</strong>. To continue a conversation you resend the whole history, including Claude's earlier replies as <code>"assistant"</code> messages. Every design question about agents, context and multi-agent systems comes back to this. (An <strong>agent</strong>, in this course, is a program that calls Claude in a loop, lets it choose tools to act with, and stops when Claude says the task is done. F2 builds one.)</p></div>
<!-- ex:f01-next-turn -->
<p><strong>The next turn.</strong> To ask a follow-up, you send everything again, with Claude's last reply included as an <code>assistant</code> message:</p>
<pre class="code"><code><span class="s">"messages"</span>: [
  {<span class="s">"role"</span>: <span class="s">"user"</span>, <span class="s">"content"</span>: <span class="s">"Where is order 1042?"</span>},
  {<span class="s">"role"</span>: <span class="s">"assistant"</span>, <span class="s">"content"</span>: <span class="s">"I can't look up orders, but…"</span>},   <span class="c"># resent by you</span>
  {<span class="s">"role"</span>: <span class="s">"user"</span>, <span class="s">"content"</span>: <span class="s">"OK. How long is your returns window?"</span>}  <span class="c"># the new message</span>
]</code></pre>`
    },
    {
      kind: "read",
      title: "Tokens, the context window and the system prompt",
      html: `
<p class="lede">Models read and write text in <strong>tokens</strong>, chunks of a few characters. Two limits follow from that.</p>
<ul>
<li><strong>The context window</strong> is the most a single request can hold: system prompt, tool definitions, the full message history and the new message together. Long conversations, long documents and verbose tool results all fill it.</li>
<li><strong><code>max_tokens</code></strong> caps the reply. If the model reaches it mid-answer, the response stops with <code>stop_reason: "max_tokens"</code>. That's truncation, not completion.</li>
</ul>
<p>A full window isn't the only risk. Even when everything fits, <strong>more context doesn't mean the model attends to all of it equally</strong>; facts buried in the middle of a long history are easier to miss. That's why later modules teach you to trim tool output and keep key facts in a structured block, rather than reach for a bigger window.</p>
<h3>Roles and the system prompt</h3>
<ul>
<li><strong>System prompt:</strong> standing instructions and context for the whole conversation, such as the agent's job, policies and output format.</li>
<li><strong><code>user</code> messages:</strong> what the person (or your program) sends each turn.</li>
<li><strong><code>assistant</code> messages:</strong> Claude's earlier replies, which you resend as history.</li>
<li>Roles alternate, user then assistant, and each message's <code>content</code> can be plain text or a list of <em>content blocks</em> (text, a tool request, a tool result), which F2 uses.</li>
</ul>
<p>A system prompt shapes behavior, but it's still text the model follows <em>probabilistically</em>: Claude writes its reply by choosing likely next words, and instructions make the desired behavior more likely without making it certain. Keep that in mind: when a rule must hold every time, the course will show you how to enforce it in code instead.</p>
<div class="callout note"><div class="callout-label">Out of scope</div><p>Tokenizer details, pricing math and prompt-caching mechanics are not tested. You only need the concepts above.</p></div>
<!-- ex:f01-blocks -->
<h3>Content blocks at a glance</h3>
<p>Once tools are involved, <code>content</code> becomes a list of typed blocks. Claude's reply can mix text with a tool request, and your next message carries the result, linked by its <code>id</code>:</p>
<pre class="code"><code><span class="c"># Claude's reply (role "assistant"), ending with stop_reason "tool_use"</span>
[
  {<span class="s">"type"</span>: <span class="s">"text"</span>, <span class="s">"text"</span>: <span class="s">"Let me check that order."</span>},
  {<span class="s">"type"</span>: <span class="s">"tool_use"</span>, <span class="s">"id"</span>: <span class="s">"toolu_01"</span>, <span class="s">"name"</span>: <span class="s">"get_order"</span>,
   <span class="s">"input"</span>: {<span class="s">"order_number"</span>: <span class="s">"A-1042"</span>}}
]

<span class="c"># Your next message (role "user")</span>
[
  {<span class="s">"type"</span>: <span class="s">"tool_result"</span>, <span class="s">"tool_use_id"</span>: <span class="s">"toolu_01"</span>,
   <span class="s">"content"</span>: <span class="s">"status: shipped; delivery: Friday"</span>}
]</code></pre>
<p>F2 walks through this exchange step by step.</p>`
    },
    {
      kind: "recap",
      title: "Recap",
      points: [
        "A Claude call is a stateless function: the request is everything the model knows.",
        "Your code is the memory: it resends the conversation history each time.",
        "The response is content blocks plus a stop_reason: end_turn, tool_use or max_tokens.",
        "The context window limits the whole request; max_tokens limits the reply.",
        "More context isn't evenly used: trim and structure rather than just add.",
        "The system prompt guides behavior probabilistically; hard rules need code."
      ]
    }
  ]
};
