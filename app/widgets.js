// Interactive widgets and inline embeds. Each widget is (el, ctx) => void; ctx.done() records completion.
(function () {
  const h = (tag, attrs, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null) el.append(kid.nodeType ? kid : document.createTextNode(kid));
    return el;
  };
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const domainOf = id => window.BLUEPRINT.domains.find(d => d.id === id);

  // ---------- Embeds ----------
  const EMBEDS = {
    scenarios(el) {
      const list = h("div", { class: "scen-grid" });
      for (const s of window.BLUEPRINT.scenarios) {
        list.append(h("div", { class: "scen" },
          h("span", { class: "scen-n" }, String(s.n)),
          h("div", {},
            h("div", { class: "scen-name" }, s.name),
            h("div", { class: "chips" }, s.domains.map(d => h("span", { class: `chip dom-${d}` }, `D${domainOf(d).n}`))))));
      }
      el.append(list);
    },
    weights(el) {
      const wrap = h("div", { class: "weights" });
      for (const d of window.BLUEPRINT.domains) {
        wrap.append(h("div", { class: "weight-row" },
          h("span", { class: "weight-name" }, `D${d.n} · ${d.short}`),
          h("span", { class: "weight-track" }, h("span", { class: `weight-fill dom-bg-${d.id}`, style: `width:${d.weight / 27 * 100}%` })),
          h("span", { class: "weight-val" }, `${d.weight}%`)));
      }
      el.append(wrap);
    },
    statelessDiagram(el) {
      el.innerHTML = `
<figure class="diagram" aria-label="A Claude API call as a stateless function">
<svg viewBox="0 0 640 230" role="img">
  <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="svg-ink"/></marker></defs>
  <text x="20" y="22" class="svg-label">REQUEST (you build it every time)</text>
  <rect x="20" y="34" width="190" height="44" rx="8" class="svg-box"/><text x="36" y="61" class="svg-text">system prompt</text>
  <rect x="20" y="88" width="190" height="44" rx="8" class="svg-box"/><text x="36" y="115" class="svg-text">messages[ ] (full history)</text>
  <rect x="20" y="142" width="190" height="44" rx="8" class="svg-box"/><text x="36" y="169" class="svg-text">tools[ ] definitions</text>
  <path d="M214 110 H262" class="svg-line" marker-end="url(#arr)"/>
  <rect x="268" y="70" width="120" height="80" rx="14" class="svg-accent"/>
  <text x="328" y="106" text-anchor="middle" class="svg-text-strong">Claude</text>
  <text x="328" y="126" text-anchor="middle" class="svg-small">f(request)</text>
  <path d="M392 110 H440" class="svg-line" marker-end="url(#arr)"/>
  <text x="446" y="22" class="svg-label">RESPONSE</text>
  <rect x="446" y="60" width="176" height="44" rx="8" class="svg-box"/><text x="462" y="87" class="svg-text">content blocks</text>
  <rect x="446" y="114" width="176" height="44" rx="8" class="svg-box"/><text x="462" y="141" class="svg-mono">stop_reason</text>
  <path d="M534 162 V206 H115 V192" class="svg-dash" marker-end="url(#arr)"/>
  <text x="326" y="222" text-anchor="middle" class="svg-small">your code appends the response (and any tool results) and sends again</text>
</svg></figure>`;
    }
  };

  // ---------- Widgets ----------
  const WIDGETS = {};

  WIDGETS.trapSpotter = function (el, ctx) {
    const traps = window.TRAPS;
    const gallery = h("div", { class: "trap-grid" });
    for (const [id, t] of Object.entries(traps)) {
      const card = h("button", { class: "trap", type: "button", "aria-expanded": "false" },
        h("span", { class: "trap-id" }, id),
        h("span", { class: "trap-name" }, t.name),
        h("span", { class: "trap-tell" }, t.tell),
        h("span", { class: "trap-why" }, t.why));
      card.addEventListener("click", () => {
        const open = card.classList.toggle("open");
        card.setAttribute("aria-expanded", String(open));
      });
      gallery.append(card);
    }
    el.append(h("p", { class: "small" }, "Tap a card to see why that pattern is usually wrong."), gallery);

    const items = [
      ["Add to the system prompt: “You MUST verify the customer's identity before any refund.”", "T1"],
      ["Deploy a fine-tuned routing model to pick the right tool for each message.", "T2"],
      ["Move to a model with a much larger context window so the 14-file review gets full attention.", "T3"],
      ["Escalate to a human whenever the customer's sentiment score drops below −0.6.", "T4"],
      ["Have the subagent catch the timeout and return an empty result list marked as successful.", "T6"],
      ["Add the --batch flag so Claude Code runs without waiting for input.", "T8"],
      ["Give the synthesis agent every web-search tool so it never has to go back to the coordinator.", "T5"],
      ["The report skips whole subtopics, though every subagent succeeded, so improve the search agent's queries.", "T7"]
    ];
    const ids = Object.keys(traps);
    const quiz = h("div", { class: "spot" });
    let idx = 0, score = 0;
    const render = () => {
      quiz.innerHTML = "";
      if (idx >= items.length) {
        quiz.append(h("div", { class: "spot-done" },
          h("div", { class: "big-num" }, `${score}/${items.length}`),
          h("p", {}, score >= 6 ? "You can spot the patterns. They'll eliminate options fast on exam day." : "Review the cards above. You'll see these patterns again in every module."),
          h("button", { class: "btn ghost", type: "button", onclick: () => { idx = 0; score = 0; render(); } }, "Try again")));
        ctx.done();
        return;
      }
      const [text, answer] = items[idx];
      const others = ids.filter(i => i !== answer);
      const pick = [answer, others[(idx * 3) % others.length], others[(idx * 3 + 2) % others.length], others[(idx * 3 + 4) % others.length]];
      const choices = [...new Set(pick)].sort((a, b) => ((a.charCodeAt(1) * 7 + idx) % 11) - ((b.charCodeAt(1) * 7 + idx) % 11));
      const status = h("div", { class: "spot-feedback", "aria-live": "polite" });
      const btns = choices.map(c => h("button", {
        class: "opt", type: "button",
        onclick: (e) => {
          btns.forEach(b => b.disabled = true);
          const ok = c === answer;
          if (ok) score++;
          e.currentTarget.classList.add(ok ? "is-right" : "is-wrong");
          btns.find(b => b.dataset.id === answer).classList.add("is-right");
          status.innerHTML = `<strong>${ok ? "Correct." : "Not quite."}</strong> ${traps[answer].name}: ${traps[answer].why}`;
          status.append(h("button", { class: "btn small-btn", type: "button", onclick: () => { idx++; render(); } }, idx + 1 < items.length ? "Next" : "See score"));
        }
      }, traps[c].name));
      btns.forEach((b, i) => b.dataset.id = choices[i]);
      quiz.append(
        h("div", { class: "spot-head" }, h("span", { class: "eyebrow" }, `Name that trap · ${idx + 1} of ${items.length}`)),
        h("p", { class: "spot-text" }, text),
        h("div", { class: "opts" }, btns),
        status);
    };
    render();
    el.append(quiz);
  };

  WIDGETS.loopStepper = function (el, ctx) {
    const U = (text) => ({ role: "user", blocks: [{ type: "text", body: text }] });
    const steps = [
      {
        sent: [U("Order #4471 was due Tuesday. Where is it?")],
        resp: [{ type: "text", body: "Let me look that up for you." }, { type: "tool_use", body: 'lookup_order({"order_id": "4471"})' }],
        stop: "tool_use",
        choices: [
          { t: "Run lookup_order, append the result, call Claude again", ok: true, why: "stop_reason is \"tool_use\". The text is narration, not an answer." },
          { t: "Show “Let me look that up for you.” and stop", why: "Text in the response doesn't mean the turn is over. Claude asked for a tool in the same response." }
        ],
        appended: [
          { role: "assistant", blocks: [{ type: "text", body: "Let me look that up for you." }, { type: "tool_use", body: "lookup_order(…)" }] },
          { role: "user", blocks: [{ type: "tool_result", body: '{"status": "in_transit", "carrier": "UPS", "delay_reason": "weather", "new_eta": "Fri"}' }] }
        ]
      },
      {
        resp: [{ type: "text", body: "I'm done with the tracking lookup. Checking whether you qualify for a delay credit." }, { type: "tool_use", body: 'check_compensation({"order_id": "4471", "delay_days": 3})' }],
        stop: "tool_use",
        choices: [
          { t: "The text says “done”, so stop and reply", why: "This is the natural-language trap. “Done” here refers to one sub-step, and stop_reason says Claude still needs a tool." },
          { t: "Run check_compensation, append the result, call again", ok: true, why: "Branch on stop_reason only. It's \"tool_use\", so the loop continues." }
        ],
        appended: [
          { role: "assistant", blocks: [{ type: "text", body: "I'm done with the tracking lookup…" }, { type: "tool_use", body: "check_compensation(…)" }] },
          { role: "user", blocks: [{ type: "tool_result", body: '{"eligible": true, "credit_usd": 10}' }] }
        ]
      },
      {
        resp: [{ type: "text", body: "Your order #4471 was delayed by weather and now arrives Friday. I've added a $10 credit to your account for the trouble." }],
        stop: "end_turn",
        choices: [
          { t: "Call Claude once more in case there's more to do", why: "\"end_turn\" is the completion signal. Another call wastes tokens and may produce a redundant message." },
          { t: "Stop the loop and show the answer", ok: true, why: "stop_reason is \"end_turn\": Claude has finished its turn." }
        ]
      }
    ];
    let i = 0, history = [steps[0].sent[0]], answered = false, mistakes = 0;
    const root = h("div", { class: "loop" });
    el.append(root);

    const blockEl = (b) => h("div", { class: `blk blk-${b.type}` },
      h("span", { class: "blk-type" }, b.type), h("span", { class: b.type === "text" ? "blk-body" : "blk-body mono" }, b.body));
    const msgEl = (m, fresh) => h("div", { class: `msg msg-${m.role}${fresh ? " fresh" : ""}` },
      h("span", { class: "msg-role" }, m.role), h("div", { class: "msg-blocks" }, m.blocks.map(blockEl)));

    const render = (prevLen) => {
      root.innerHTML = "";
      const s = steps[i];
      const meter = h("div", { class: "loop-meter" },
        h("span", { class: "eyebrow" }, `Request ${i + 1} of ${steps.length}`),
        h("span", { class: "loop-count" }, `${history.length} message${history.length > 1 ? "s" : ""} sent`),
        h("span", { class: "loop-bar" }, h("span", { style: `width:${Math.min(100, history.length / 5 * 100)}%` })));
      const sent = h("div", { class: "loop-col" }, h("div", { class: "col-head" }, "messages[ ] sent"),
        history.map((m, k) => msgEl(m, prevLen != null && k >= prevLen)));
      const resp = h("div", { class: "loop-col" }, h("div", { class: "col-head" }, "Response"),
        h("div", { class: "msg msg-assistant" }, h("span", { class: "msg-role" }, "assistant"), h("div", { class: "msg-blocks" }, s.resp.map(blockEl))),
        h("div", { class: "stop" }, h("span", {}, "stop_reason"), h("code", { class: `stop-val stop-${s.stop}` }, `"${s.stop}"`)));
      const fb = h("div", { class: "loop-fb", "aria-live": "polite" });
      const btns = s.choices.map(c => h("button", {
        class: "opt", type: "button", onclick: (e) => {
          if (answered) return;
          if (!c.ok) { mistakes++; e.currentTarget.classList.add("is-wrong"); fb.innerHTML = `<strong>Not that.</strong> ${c.why}`; return; }
          answered = true;
          e.currentTarget.classList.add("is-right");
          btns.forEach(b => b.disabled = true);
          fb.innerHTML = `<strong>Right.</strong> ${c.why}`;
          const next = h("button", { class: "btn small-btn", type: "button" }, i < steps.length - 1 ? "Send the next request" : "See what happened");
          next.addEventListener("click", advance);
          fb.append(next);
        }
      }, c.t));
      root.append(meter, h("div", { class: "loop-cols" }, sent, resp),
        h("div", { class: "loop-q" }, h("p", { class: "q-lead" }, "What does your loop do next?"), h("div", { class: "opts" }, btns), fb));
    };
    const advance = () => {
      const s = steps[i];
      if (i === steps.length - 1) return finish();
      const before = history.length;
      history = history.concat(s.appended);
      i++; answered = false;
      render(before);
    };
    const finish = () => {
      root.innerHTML = "";
      root.append(h("div", { class: "loop-done" },
        h("div", { class: "big-num" }, "3 requests · 5 messages"),
        h("p", {}, "Every request resent the entire history. Claude never “remembered” the lookup. It reread it each time because your loop put it there. Continuing on \"tool_use\" and stopping on \"end_turn\" was the only logic needed."),
        mistakes ? h("p", { class: "small" }, `You picked a trap ${mistakes} time${mistakes > 1 ? "s" : ""}. Both traps are on the exam as distractors.`) : h("p", { class: "small" }, "No traps taken. Nice."),
        h("button", { class: "btn ghost", type: "button", onclick: () => { i = 0; history = [steps[0].sent[0]]; answered = false; mistakes = 0; render(); } }, "Run it again")));
      ctx.done();
    };
    render();
  };

  WIDGETS.complianceSim = function (el, ctx) {
    const N = 1000, COLS = 40, RATE = 0.008, AVG = 740;
    let mode = "prompt";
    const canvas = h("canvas", { class: "sim-canvas", width: "800", height: "500", "aria-label": "1,000 simulated conversations" });
    const stats = h("div", { class: "sim-stats", "aria-live": "polite" });
    const seg = h("div", { class: "seg", role: "radiogroup", "aria-label": "Enforcement" });
    const modes = [["prompt", "Prompt instruction"], ["hook", "PreToolUse hook"]];
    const segBtns = modes.map(([m, label]) => h("button", {
      type: "button", role: "radio", "aria-checked": String(m === mode), class: m === mode ? "on" : "",
      onclick: () => { mode = m; segBtns.forEach((b, k) => { b.classList.toggle("on", modes[k][0] === m); b.setAttribute("aria-checked", String(modes[k][0] === m)); }); draw([]); stats.innerHTML = ""; }
    }, label));
    seg.append(...segBtns);
    const run = h("button", { class: "btn", type: "button" }, "Run 1,000 conversations");
    const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    const draw = (cells, upto = N) => {
      const g = canvas.getContext("2d"), cw = canvas.width / COLS, rows = N / COLS, ch = canvas.height / rows;
      g.clearRect(0, 0, canvas.width, canvas.height);
      for (let k = 0; k < N; k++) {
        const x = (k % COLS) * cw + cw / 2, y = Math.floor(k / COLS) * ch + ch / 2;
        const c = k < upto ? cells[k] : null;
        g.beginPath();
        g.arc(x, y, c === "bad" ? cw * 0.42 : cw * 0.3, 0, Math.PI * 2);
        g.fillStyle = c === "bad" ? css("--bad") : c === "blocked" ? css("--d3") : c === "ok" ? css("--good-soft") : css("--line");
        g.fill();
      }
    };
    run.addEventListener("click", () => {
      const cells = Array.from({ length: N }, () => Math.random() < RATE ? (mode === "prompt" ? "bad" : "blocked") : "ok");
      const bad = cells.filter(c => c === "bad").length, blocked = cells.filter(c => c === "blocked").length;
      const finish = () => {
        draw(cells);
        stats.innerHTML = mode === "prompt"
          ? `<div><span class="stat-n bad">${bad}</span><span>refunds over the limit went through</span></div><div><span class="stat-n">$${(bad * AVG).toLocaleString()}</span><span>paid out without approval</span></div><div><span class="stat-n">~${Math.round(bad * 200).toLocaleString()}</span><span>per year at 200,000 conversations</span></div>`
          : `<div><span class="stat-n good">0</span><span>refunds over the limit went through</span></div><div><span class="stat-n blue">${blocked}</span><span>attempts blocked and redirected to a human</span></div><div><span class="stat-n">0</span><span>per year, at any volume</span></div>`;
        ctx.done();
      };
      if (reduceMotion()) return finish();
      let shown = 0;
      const tick = () => { shown = Math.min(N, shown + 40); draw(cells, shown); if (shown < N) requestAnimationFrame(tick); else finish(); };
      tick();
    });
    draw([]);
    el.append(h("div", { class: "sim-controls" }, seg, run), h("div", { class: "sim-frame" }, canvas),
      h("div", { class: "legend" },
        h("span", {}, h("i", { class: "dot dot-ok" }), "Handled within policy"),
        h("span", {}, h("i", { class: "dot dot-bad" }), "Limit violated"),
        h("span", {}, h("i", { class: "dot dot-blocked" }), "Blocked by hook")),
      stats,
      h("p", { class: "small" }, "Illustrative miss rate of 0.8% and an average refund of $740, not measured data. The point holds for any rate above zero."));
  };

  WIDGETS.hookPlayground = function (el, ctx) {
    let amount = 320, verified = true;
    const seen = new Set();
    const slider = h("input", { type: "range", min: "20", max: "2000", step: "10", value: String(amount), id: "hp-amount", "aria-label": "Refund amount" });
    const amtLabel = h("output", { for: "hp-amount", class: "hp-amt" });
    const verify = h("input", { type: "checkbox", id: "hp-verified", checked: true });
    const call = h("pre", { class: "code hp-call" });
    const stages = ["request", "gate", "hook", "tool"].map(k => h("div", { class: "stage", "data-k": k }));
    const result = h("div", { class: "hp-result", "aria-live": "polite" });
    const render = () => {
      amtLabel.textContent = `$${amount.toLocaleString()}`;
      call.innerHTML = `<code>process_refund({ <span class="s">"customer_id"</span>: ${verified ? '<span class="s">"C-20931"</span>' : '<span class="s">"Dana Whitfield"</span>'}, <span class="s">"amount"</span>: ${amount} })</code>`;
      const gateOk = verified, hookOk = amount <= 500;
      const outcome = !gateOk ? "gate" : !hookOk ? "hook" : "ok";
      seen.add(outcome);
      const set = (k, state, title, note) => {
        const s = stages.find(x => x.dataset.k === k);
        s.className = `stage ${state}`;
        s.innerHTML = `<div class="stage-title">${title}</div><div class="stage-note">${note}</div>`;
      };
      set("request", "pass", "Claude requests the tool", "model decision");
      set("gate", gateOk ? "pass" : "fail", "Prerequisite gate", gateOk ? "get_customer verified C-20931" : "no verified customer ID yet");
      set("hook", !gateOk ? "idle" : hookOk ? "pass" : "fail", "PreToolUse hook", !gateOk ? "not reached" : hookOk ? `$${amount} ≤ $500 limit` : `$${amount} > $500 limit`);
      set("tool", outcome === "ok" ? "pass" : "idle", "process_refund runs", outcome === "ok" ? "refund issued" : "never executes");
      result.className = `hp-result ${outcome === "ok" ? "ok" : "deny"}`;
      result.innerHTML = outcome === "ok"
        ? "<strong>Allowed.</strong> Both checks passed in code, so the tool runs."
        : outcome === "gate"
          ? "<strong>Denied by the gate.</strong> Claude receives: “Verify the customer with get_customer first.” It can't skip identity, however the request is phrased."
          : "<strong>Denied by the hook.</strong> Claude receives: “Refunds over $500 need approval. Use escalate_to_human.” The refund can't happen; the agent is pointed to the allowed path.";
      if (seen.size === 3) ctx.done();
    };
    slider.addEventListener("input", () => { amount = Number(slider.value); render(); });
    verify.addEventListener("change", () => { verified = verify.checked; render(); });
    el.append(
      h("div", { class: "hp-controls" },
        h("label", { class: "hp-field", for: "hp-amount" }, h("span", {}, "Refund amount"), slider, amtLabel),
        h("label", { class: "hp-check", for: "hp-verified" }, verify, h("span", {}, "get_customer returned a verified ID"))),
      call, h("div", { class: "pipeline" }, stages), result,
      h("p", { class: "small" }, "Try three cases: an allowed refund, an unverified customer, and an amount over $500."));
    render();
  };

  WIDGETS.promptOrCode = function (el, ctx) {
    const items = [
      ["Refunds over $500 require a manager's approval.", "code", "Financial limit. Enforce it with a tool-call hook or inside the tool itself."],
      ["Keep replies warm and under about 120 words.", "prompt", "Style. An occasional long reply costs little."],
      ["Verify identity before changing the email on an account.", "code", "Account takeover risk. A prerequisite gate blocks update_email until verification succeeds."],
      ["Ask one clarifying question when a request is ambiguous.", "prompt", "Judgment about language. Prompts and examples are the right tool."],
      ["Never show a full card number in a reply.", "code", "Compliance. Mask it in the tool result (PostToolUse) so the model never has it to repeat."],
      ["Suggest the loyalty program to repeat customers when relevant.", "prompt", "A missed upsell is a small cost. Guidance is enough."],
      ["Block DROP TABLE and rm -rf in the agent's shell tool.", "code", "Irreversible. A PreToolUse hook denies matching commands every time."],
      ["Map three backends' status codes to one enum before the agent reads them.", "code", "Mechanical transformation. PostToolUse normalization is deterministic and free."]
    ];
    let correct = 0, answered = 0;
    const list = h("div", { class: "poc" });
    const score = h("div", { class: "poc-score", "aria-live": "polite" });
    items.forEach(([text, ans, why]) => {
      const fb = h("div", { class: "poc-fb" });
      const row = h("div", { class: "poc-row" });
      const pick = (choice, btn) => {
        if (row.classList.contains("done")) return;
        row.classList.add("done");
        const ok = choice === ans;
        if (ok) correct++;
        answered++;
        btn.classList.add(ok ? "is-right" : "is-wrong");
        fb.innerHTML = `<strong>${ans === "code" ? "Code" : "Prompt"}.</strong> ${why}`;
        if (answered === items.length) {
          score.textContent = `${correct} of ${items.length} sorted correctly.`;
          ctx.done();
        }
      };
      const bp = h("button", { class: "pill-btn", type: "button" }, "Prompt");
      const bc = h("button", { class: "pill-btn", type: "button" }, "Code");
      bp.addEventListener("click", () => pick("prompt", bp));
      bc.addEventListener("click", () => pick("code", bc));
      row.append(h("p", { class: "poc-text" }, text), h("div", { class: "poc-btns" }, bp, bc), fb);
      list.append(row);
    });
    el.append(list, score);
  };

  window.WIDGETS = WIDGETS;
  window.EMBEDS = EMBEDS;
})();
