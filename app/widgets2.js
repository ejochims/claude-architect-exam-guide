// Bespoke widgets for modules 2, 6, 7, 10, 12 and 13.
(function () {
  const W = window.WIDGETS;
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
  const seg = (options, current, onPick, label) => {
    const wrap = h("div", { class: "seg", role: "radiogroup", "aria-label": label });
    const btns = options.map(([id, text]) => h("button", { type: "button", role: "radio", "aria-checked": String(id === current), class: id === current ? "on" : "" }, text));
    btns.forEach((b, k) => b.addEventListener("click", () => {
      btns.forEach((x, j) => { x.classList.toggle("on", j === k); x.setAttribute("aria-checked", String(j === k)); });
      onPick(options[k][0]);
    }));
    wrap.append(...btns);
    return wrap;
  };
  const toggle = (id, label, checked, onChange) => {
    const input = h("input", { type: "checkbox", id, checked: checked || false });
    input.addEventListener("change", () => onChange(input.checked));
    return h("label", { class: "hp-check", for: id }, input, h("span", { html: label }));
  };

  // ---------- Module 2: tool_choice playground ----------
  W.toolChoice = function (el, ctx) {
    const scenarios = {
      a: { label: "Unknown document type", desc: "Three extraction tools (invoice, receipt, contract). Every document must come back as structured data.", best: "any" },
      b: { label: "Metadata first", desc: "extract_metadata must run before any enrichment tool, every time.", best: "tool" },
      c: { label: "General assistant", desc: "A help assistant that sometimes needs to look something up, and often just answers.", best: "auto" }
    };
    const verdicts = {
      a: { auto: "Claude may answer in prose instead of calling a tool. No guarantee of structured output.", any: "Claude must call one of the three tools and picks the one that fits the document.", tool: "Forces extract_invoice even for receipts and contracts: the wrong schema for two of three types.", none: "Tools are disabled. You get prose." },
      b: { auto: "Claude might start with an enrichment tool, or skip tools.", any: "A tool call is guaranteed, but not which one.", tool: "Forces extract_metadata on this turn. Enrichment happens in follow-up turns.", none: "No tool can run." },
      c: { auto: "Claude decides whether a tool is needed, which is what a general assistant wants.", any: "Forces a tool call even when the user just says thanks.", tool: "Forces one specific tool on every turn.", none: "Claude can never look anything up." }
    };
    const code = { auto: '{"type": "auto"}', any: '{"type": "any"}', tool: '{"type": "tool", "name": "extract_metadata"}', none: '{"type": "none"}' };
    let sc = "a", choice = "auto";
    const solved = new Set();
    const desc = h("p", { class: "tc-desc" });
    const codeEl = h("pre", { class: "code" });
    const out = h("div", { class: "hp-result", "aria-live": "polite" });
    const score = h("p", { class: "small" });
    const render = () => {
      const s = scenarios[sc];
      desc.textContent = s.desc;
      codeEl.innerHTML = `<code>tool_choice = ${code[choice]}</code>`;
      const ok = choice === s.best;
      if (ok) solved.add(sc);
      out.className = `hp-result ${ok ? "ok" : "deny"}`;
      out.innerHTML = `<strong>${ok ? "Best fit." : "Not the best fit."}</strong> ${verdicts[sc][choice]}`;
      score.textContent = `Best setting found for ${solved.size} of 3 situations.`;
      if (solved.size === 3) ctx.done();
    };
    el.append(
      h("div", { class: "tc-row" }, h("span", { class: "eyebrow" }, "Situation"), seg(Object.entries(scenarios).map(([k, v]) => [k, v.label]), sc, v => { sc = v; render(); }, "Situation")),
      desc,
      h("div", { class: "tc-row" }, h("span", { class: "eyebrow" }, "tool_choice"), seg([["auto", "auto"], ["any", "any"], ["tool", "named tool"], ["none", "none"]], choice, v => { choice = v; render(); }, "tool_choice")),
      codeEl, out, score);
    render();
  };

  // ---------- Module 6: what each agent's context contains ----------
  W.contextViewer = function (el, ctx) {
    let task = false, pass = false, parallel = false;
    const out = h("div", {});
    const seen = new Set();
    const render = () => {
      out.innerHTML = "";
      const agents = [];
      agents.push({ name: "Coordinator", ctx: ["System prompt: research coordinator", "User: “How are hospitals adopting AI scribes?”", `allowedTools: [${task ? '"Task", ' : ""}"Read"]`], note: task ? "Plans subtopics and spawns subagents." : "Writes “I'll ask the search agent…” but has no Task tool, so nothing is spawned." });
      if (task) {
        agents.push({ name: "Search subagent", ctx: ["AgentDefinition: web search specialist", "Prompt: “Find 2024–2026 adoption data for AI scribes in US hospitals. Return claim, URL, date.”"], note: "Returns 9 findings with URLs and dates." });
        agents.push({ name: "Document subagent", ctx: ["AgentDefinition: PDF analyst", "Prompt: “Analyze the 3 attached health-system reports for adoption metrics.”"], note: "Returns 6 findings with document name and page." });
        agents.push({ name: "Synthesis subagent", ctx: pass
          ? ["AgentDefinition: report writer", "Prompt: goal + quality criteria", "15 findings as JSON: {claim, source_url | document, page, date}"]
          : ["AgentDefinition: report writer", "Prompt: “Synthesize the research findings into a report.”"],
          note: pass ? "Writes a cited report from the findings it was given." : "Has never seen the findings. It writes generic text with no citations, or asks for the data." });
      }
      const grid = h("div", { class: "cv-grid" }, agents.map(a => h("div", { class: "cv-card" },
        h("div", { class: "cv-name" }, a.name),
        h("div", { class: "cv-label" }, "Context window"),
        h("ul", { class: "cv-ctx" }, a.ctx.map(c => h("li", {}, c))),
        h("div", { class: "cv-note" }, a.note))));
      let verdict, ok = false;
      if (!task) verdict = "No subagents run. The coordinator can only describe a delegation.";
      else if (!pass) verdict = "Subagents ran, but synthesis received none of their output. Subagents don't inherit the coordinator's conversation: findings must be in the prompt.";
      else { ok = true; verdict = `Cited report produced. Research phase took ${parallel ? "about 40 seconds (both subagents in one response)" : "about 80 seconds (one Task call per turn, run one after another)"}.`; }
      const key = `${task}${pass}${parallel}`;
      seen.add(key);
      out.append(grid, h("div", { class: `hp-result ${ok ? "ok" : "deny"}` }, h("strong", {}, ok ? "Works. " : "Broken. "), verdict));
      if (seen.has("truetruetrue")) ctx.done();
    };
    el.append(
      h("div", { class: "cv-toggles" },
        toggle("cv-task", 'Coordinator <code>allowedTools</code> includes <code>"Task"</code>', task, v => { task = v; render(); }),
        toggle("cv-pass", "Coordinator passes findings in the synthesis prompt", pass, v => { pass = v; render(); }),
        toggle("cv-par", "Emit both research Task calls in one response", parallel, v => { parallel = v; render(); })),
      out, h("p", { class: "small" }, "Turn on all three to get a cited report in the shortest time."));
    render();
  };

  // ---------- Module 7: context budget ----------
  W.contextBudget = function (el, ctx) {
    let turns = 24, trim = false, facts = false, summarize = false;
    const out = h("div", {});
    const touched = new Set();
    const render = () => {
      const SYS = 1500, TURN = 450, TOOL = trim ? 180 : 2600, FACTS = facts ? 220 : 0;
      const keep = summarize ? Math.min(turns, 6) : turns;
      const older = turns - keep;
      const summary = summarize && older > 0 ? 700 : 0;
      const hist = keep * TURN, tools = keep * TOOL + (summarize ? 0 : 0);
      const total = SYS + FACTS + summary + hist + tools;
      const LIMIT = 100000;
      const parts = [["System", SYS, "var(--faint)"], ["Case facts", FACTS, "var(--good)"], ["Summary", summary, "var(--d4)"], ["Turns", hist, "var(--d3)"], ["Tool output", tools, "var(--accent)"]].filter(p => p[1] > 0);
      const lost = summarize && older > 0 && !facts && turns > 6;
      out.innerHTML = "";
      out.append(
        h("div", { class: "cb-bar", role: "img", "aria-label": `Context used: ${total.toLocaleString()} tokens` }, parts.map(([n, v, c]) => h("span", { style: `width:${Math.min(100, v / LIMIT * 100)}%;background:${c}`, title: `${n}: ${v.toLocaleString()}` }))),
        h("div", { class: "legend" }, parts.map(([n, v, c]) => h("span", {}, h("i", { class: "dot", style: `background:${c}` }), `${n} ${v.toLocaleString()}`))),
        h("div", { class: "sim-stats" },
          h("div", {}, h("span", { class: `stat-n ${total > LIMIT ? "bad" : ""}` }, total.toLocaleString()), h("span", {}, `tokens sent on turn ${turns} (budget shown: 100,000)`)),
          h("div", {}, h("span", { class: "stat-n" }, `${Math.round(tools / Math.max(1, total) * 100)}%`), h("span", {}, "of context is tool output")),
          h("div", {}, h("span", { class: `stat-n ${lost ? "bad" : "good"}` }, lost ? "Lost" : "Exact"), h("span", {}, lost ? "“$247.83 refund on #8812 by Friday” became “discussed a refund”" : "the refund amount, order number and promised date"))));
      if (trim && facts && summarize) ctx.done();
    };
    const slider = h("input", { type: "range", min: "2", max: "40", value: String(turns), id: "cb-turns", "aria-label": "Conversation turns" });
    const lbl = h("output", { class: "hp-amt", for: "cb-turns" }, String(turns));
    slider.addEventListener("input", () => { turns = Number(slider.value); lbl.textContent = String(turns); render(); });
    el.append(
      h("label", { class: "hp-field", for: "cb-turns" }, h("span", {}, "Turns so far"), slider, lbl),
      h("div", { class: "cv-toggles" },
        toggle("cb-trim", "Trim each order lookup from 40+ fields to the 5 that matter", trim, v => { trim = v; render(); }),
        toggle("cb-sum", "Summarize turns older than the last 6", summarize, v => { summarize = v; render(); }),
        toggle("cb-facts", "Keep a case-facts block outside the summary", facts, v => { facts = v; render(); })),
      out, h("p", { class: "small" }, "Token counts are illustrative. Turn on summarization without case facts to see what goes missing."));
    render();
  };

  // ---------- Module 10: batch cadence calculator ----------
  W.slaCalc = function (el, ctx) {
    let sla = 30, post = 2, cad = 6;
    const out = h("div", {});
    const mk = (id, label, min, max, val, on) => {
      const s = h("input", { type: "range", min: String(min), max: String(max), value: String(val), id });
      const o = h("output", { class: "hp-amt", for: id }, `${val}h`);
      s.addEventListener("input", () => { o.textContent = `${s.value}h`; on(Number(s.value)); render(); });
      return h("label", { class: "hp-field", for: id }, h("span", {}, label), s, o);
    };
    const tried = new Set();
    const render = () => {
      const worst = cad + 24 + post, max = sla - 24 - post, ok = worst <= sla;
      tried.add(ok ? "ok" : "bad");
      const pct = v => `${v / Math.max(worst, sla) * 100}%`;
      out.innerHTML = "";
      out.append(
        h("div", { class: "sla-track" },
          h("span", { class: "sla-seg wait", style: `width:${pct(cad)}` }, `wait ${cad}h`),
          h("span", { class: "sla-seg batch", style: `width:${pct(24)}` }, "batch up to 24h"),
          post ? h("span", { class: "sla-seg post", style: `width:${pct(post)}` }, `${post}h`) : null,
          h("span", { class: "sla-line", style: `left:${pct(sla)}` }, h("span", {}, `SLA ${sla}h`))),
        h("div", { class: `hp-result ${ok ? "ok" : "deny"}` },
          h("strong", {}, ok ? "Meets the SLA. " : "Misses the SLA. "),
          `Worst case: a record arrives just after a submission, waits ${cad}h, takes up to 24h in the batch, then ${post}h of post-processing = ${worst}h. `,
          max >= 1 ? `The longest safe interval is ${max}h.` : "No interval works: the SLA is too tight for the batch API. Use synchronous calls."));
      if (tried.size === 2) ctx.done();
    };
    el.append(mk("sla-h", "Results due within", 26, 72, sla, v => sla = v), mk("sla-p", "Post-processing", 0, 8, post, v => post = v), mk("sla-c", "Submit a batch every", 1, 24, cad, v => cad = v), out,
      h("p", { class: "small" }, "Find one setting that meets the SLA and one that misses it."));
    render();
  };

  // ---------- Module 12: CI command builder ----------
  W.ciBuilder = function (el, ctx) {
    const opts = { p: false, json: false, schema: false, prior: false, md: false, fresh: false };
    const out = h("div", {});
    const render = () => {
      const cmd = ["claude", opts.p ? "-p" : null, `"Review this PR${opts.prior ? ". Prior findings: $(cat prior.json). Report only new or unaddressed issues." : "."}"`, opts.json ? "--output-format json" : null, opts.schema ? "--json-schema \"$(cat findings.schema.json)\"" : null].filter(Boolean).join(" ");
      const lines = [
        [opts.p, "Runs non-interactively and exits", "Hangs waiting for interactive input"],
        [opts.json, "Machine-readable JSON output", "Free text the pipeline must scrape"],
        [opts.schema, "Findings match a schema you can post as inline comments", "Field names and shape vary run to run"],
        [opts.prior, "Re-runs report only new or still-open issues", "Every push re-posts the same comments"],
        [opts.md, "Review criteria and test standards come from the project CLAUDE.md", "Claude guesses what your team cares about"],
        [opts.fresh, "Reviewer is an independent session, not the one that wrote the code", "Same session reviews its own reasoning and misses its own mistakes"]
      ];
      out.innerHTML = "";
      out.append(h("pre", { class: "code" }, h("code", {}, cmd)),
        h("ul", { class: "ci-list" }, lines.map(([on, good, bad]) => h("li", { class: on ? "ok" : "no" }, on ? good : bad))));
      if (Object.values(opts).every(Boolean)) ctx.done();
    };
    const t = (k, label) => toggle(`ci-${k}`, label, opts[k], v => { opts[k] = v; render(); });
    el.append(h("div", { class: "cv-toggles" },
      t("p", "<code>-p</code> (print mode)"), t("json", "<code>--output-format json</code>"), t("schema", "<code>--json-schema</code>"),
      t("prior", "Include prior review findings"), t("md", "Review criteria in project <code>CLAUDE.md</code>"), t("fresh", "Review in a separate session from generation")), out);
    render();
  };

  // ---------- Module 13: aggregate vs segment accuracy ----------
  W.segmentReveal = function (el, ctx) {
    const shown = new Set();
    const body = h("div", { class: "seg-body" });
    const data = {
      type: [["Typed invoices", 99.1, 6200], ["Email receipts", 98.4, 2900], ["Handwritten forms", 78.4, 900]],
      field: [["Total amount", 99.6], ["Invoice date", 99.2], ["Vendor name", 99.4], ["PO number", 98.8], ["Tax ID", 88.0]]
    };
    const table = (rows, unit) => h("div", { class: "seg-table" }, rows.map(([n, v, c]) => h("div", { class: "seg-r" },
      h("span", {}, n), h("span", { class: "bar" }, h("span", { style: `width:${v}%;background:${v < 90 ? "var(--bad)" : "var(--good)"}` })),
      h("span", { class: `seg-v ${v < 90 ? "bad" : ""}` }, `${v}%`), c ? h("span", { class: "small" }, `${c.toLocaleString()} ${unit}`) : null)));
    const render = () => {
      body.innerHTML = "";
      body.append(h("div", { class: "big-num" }, "97.0% accurate overall"), h("p", { class: "small" }, "10,000 extracted documents last quarter. The proposal: stop human review of high-confidence extractions. (Illustrative numbers; accuracy here means the share of extracted fields that are correct.)"));
      if (shown.has("type")) body.append(h("h4", {}, "By document type"), table(data.type, "docs"));
      if (shown.has("field")) body.append(h("h4", {}, "By field"), table(data.field));
      if (shown.size === 2) {
        body.append(h("div", { class: "hp-result deny" }, h("strong", {}, "The 97% hid two problems. "), "Handwritten forms and the tax ID field are far below the bar. Automate segment by segment, and keep reviewing a stratified random sample of high-confidence output to catch new error patterns."));
        ctx.done();
      }
    };
    const b1 = h("button", { class: "btn ghost", type: "button" }, "Break down by document type");
    const b2 = h("button", { class: "btn ghost", type: "button" }, "Break down by field");
    b1.addEventListener("click", () => { shown.add("type"); render(); });
    b2.addEventListener("click", () => { shown.add("field"); render(); });
    el.append(body, h("div", { class: "seg-btns" }, b1, b2));
    render();
  };
})();
