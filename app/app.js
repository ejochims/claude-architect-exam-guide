// App engine: state + sync, derived progress, views (path, lessons, practice, drills, mock exam, flashcards, blueprint), router.
(function () {
  const B = window.BLUEPRINT, MODS = window.MODULES, L = window.LESSONS, TRAPS = window.TRAPS, BANK = window.BANK || [], TODAY = window.EXAM_VS_TODAY || [], GLOSS = window.GLOSSARY || [], PRINC = window.PRINCIPLES || [], PTHEMES = window.PRINCIPLE_THEMES || [];
  const app = document.getElementById("app");
  const KEY = "cca-study-progress-v1";
  const blank = () => ({ v: 1, updatedAt: 0, steps: {}, answers: {}, first: {}, widgets: {}, last: null, cards: {}, mocks: [], mock: null, readiness: null });

  // ---------- State and sync ----------
  let state = blank(), remoteRef = null, saveTimer = null, saving = false, dirty = false;
  try { const raw = localStorage.getItem(KEY); if (raw) state = Object.assign(blank(), JSON.parse(raw)); } catch (e) {}
  // First attempts drive readiness. Older saves only kept the latest answer, so seed from it once.
  const seedFirst = s => { if (!Object.keys(s.first || {}).length) s.first = Object.fromEntries(Object.entries(s.answers || {}).map(([id, a]) => [id, { ok: a.ok, at: a.at, seeded: true }])); return s; };
  seedFirst(state);

  const syncEl = document.getElementById("sync");
  const setSync = (cls, label) => { syncEl.className = `sync ${cls}`; syncEl.querySelector("span").textContent = label; };

  function touch() {
    state.updatedAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    if (remoteRef) { dirty = true; clearTimeout(saveTimer); saveTimer = setTimeout(flush, 1200); }
  }
  async function flush() {
    if (!remoteRef || saving || !dirty) return;
    saving = true; dirty = false; setSync("saving", "Saving…");
    try { await remoteRef.set(JSON.parse(JSON.stringify(state))); setSync("synced", "Synced"); }
    catch (e) { setSync("", "This device"); }
    saving = false;
    if (dirty) flush();
  }
  const later = (x, y, k = "at") => !x ? y : !y ? x : (x[k] || 0) >= (y[k] || 0) ? x : y;
  function merge(a, b) {
    const out = blank();
    out.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
    for (const k of ["steps", "widgets"]) out[k] = Object.assign({}, b[k] || {}, a[k] || {});
    for (const k of ["answers", "cards"]) {
      const m = Object.assign({}, b[k] || {});
      for (const [id, v] of Object.entries(a[k] || {})) m[id] = later(v, m[id]);
      out[k] = m;
    }
    const fm = Object.assign({}, b.first || {});
    for (const [id, v] of Object.entries(a.first || {})) fm[id] = !fm[id] || (v.at || 0) < (fm[id].at || 0) ? v : fm[id];
    out.first = fm;
    // The Readiness Check counts once: keep the earliest attempt from either device.
    out.readiness = !a.readiness ? b.readiness || null : !b.readiness ? a.readiness : a.readiness.at <= b.readiness.at ? a.readiness : b.readiness;
    out.last = later(a.last, b.last);
    const seen = new Map();
    for (const r of [...(a.mocks || []), ...(b.mocks || [])]) seen.set(r.startedAt, r);
    out.mocks = [...seen.values()].sort((x, y) => y.at - x.at).slice(0, 10);
    const m = later(a.mock, b.mock, "startedAt");
    out.mock = m && !seen.has(m.startedAt) ? m : null;
    return out;
  }
  async function initSync() {
    if (!window.claude || !window.claude.use) return;
    try {
      const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
      if (!db || !user) return;
      const uid = await user.id();
      if (!uid) return;
      remoteRef = db.doc(`data/users/${uid}/progress`);
      remoteRef.onSnapshot(snap => {
        const remote = snap.exists ? snap.data() : null;
        const merged = remote ? merge(state, remote) : state;
        const changedLocal = JSON.stringify(merged) !== JSON.stringify(state);
        const needsPush = !remote || JSON.stringify(merged) !== JSON.stringify(merge(blank(), remote));
        state = merged;
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
        if (needsPush && state.updatedAt) { dirty = true; flush(); }
        else if (!saving) setSync("synced", "Synced");
        const r = route();
        if (changedLocal && !r.lesson && !r.drill && r.page !== "mock" && r.page !== "cards") render();
      }, () => { remoteRef = null; setSync("", "This device"); });
    } catch (e) { remoteRef = null; }
  }

  // ---------- Content index ----------
  const ALLQ = [];
  for (const m of MODS) if (L[m.id]) L[m.id].steps.forEach(s => (s.questions || []).forEach(q => ALLQ.push(Object.assign({ module: m.id }, q))));
  for (const q of BANK) ALLQ.push(Object.assign({ module: (MODS.find(m => m.tasks.includes(q.ts)) || {}).id }, q));
  // Holdout items are sequestered from lessons, drills, mocks and readiness; they're for a one-time Readiness Check.
  const QUESTIONS = ALLQ.filter(q => !q.holdout), HOLDOUT = ALLQ.filter(q => q.holdout);
  const QBYID = Object.fromEntries(ALLQ.map(q => [q.id, q]));
  const CARDS = [];
  for (const m of MODS) if (L[m.id]) (L[m.id].cards || []).forEach((c, i) => CARDS.push({ id: `${m.id}:${i}`, module: m, f: c.f, b: c.b }));

  // ---------- Helpers ----------
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const domOfTask = t => B.domains.find(d => t.startsWith(d.n + "."));
  const taskChip = t => `<span class="chip dom-${domOfTask(t).id}" title="${esc(B.tasks[t])}">${t}</span>`;
  const daysLeft = () => Math.max(0, Math.ceil((new Date(B.examDate + "T23:59:59") - new Date()) / 86400000));
  const ready = id => !!L[id];
  const hashStr = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const shuffle = (arr, rand = Math.random) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const optionOrder = q => shuffle(q.options.map((_, i) => i), rng(hashStr(q.id)));
  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    document.body.append(t); setTimeout(() => t.remove(), 2400);
  }
  const fmtDate = ts => new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  // Anthropic doesn't publish its raw-to-scaled mapping, so scores are shown as percentages with a 95% Wilson interval.
  const wilson = (k, n) => { if (!n) return [0, 0]; const z = 1.96, p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d; return [Math.max(0, c - h), Math.min(1, c + h)]; };
  const BAR = 0.8; // practice bar from audit/readiness-review.md, not an official cut score
  const recordFirst = (id, ok) => { if (!state.first[id]) state.first[id] = { ok, at: Date.now() }; };

  // ---------- Derived progress ----------
  function taskMastery() {
    const per = {};
    for (const q of QUESTIONS) {
      const t = (per[q.ts] = per[q.ts] || { total: 0, right: 0, tried: 0 });
      t.total++;
      const a = state.first[q.id];
      if (a) { t.tried++; if (a.ok) t.right++; }
    }
    return per;
  }
  function domainStats() {
    const tm = taskMastery();
    return B.domains.map(d => {
      const tasks = Object.keys(B.tasks).filter(t => t.startsWith(d.n + "."));
      const right = tasks.reduce((a, t) => a + (tm[t] ? tm[t].right : 0), 0), tried = tasks.reduce((a, t) => a + (tm[t] ? tm[t].tried : 0), 0);
      const started = tasks.filter(t => tm[t] && tm[t].tried).length;
      return { ...d, tasks, right, tried, mastery: tried ? right / tried : 0, started };
    });
  }
  // Domain-weighted first-attempt accuracy over the domains you've practiced.
  const readiness = () => { const ds = domainStats().filter(d => d.tried), w = ds.reduce((a, d) => a + d.weight, 0); return w ? ds.reduce((a, d) => a + d.weight * d.mastery, 0) / w : 0; };
  const modProgress = id => !L[id] ? 0 : L[id].steps.filter((_, i) => state.steps[`${id}:${i}`]).length / L[id].steps.length;
  function nextUp() {
    if (state.last && L[state.last.m] && modProgress(state.last.m) < 1) return { m: state.last.m, s: state.last.s };
    for (const m of MODS) if (L[m.id] && modProgress(m.id) < 1) {
      const s = L[m.id].steps.findIndex((_, i) => !state.steps[`${m.id}:${i}`]);
      return { m: m.id, s: Math.max(0, s) };
    }
    return null;
  }
  function weakest(n) {
    const tm = taskMastery();
    return Object.keys(B.tasks).filter(t => tm[t] && tm[t].tried).map(t => {
      const d = domOfTask(t), s = tm[t];
      return { t, d, pct: s.right / s.tried, gap: d.weight * (1 - s.right / s.tried), mod: MODS.find(m => m.tasks.includes(t)) };
    }).sort((a, b) => b.gap - a.gap).slice(0, n);
  }
  const DAY = 86400000, BOX_DAYS = [0, 1, 3, 7, 14, 30];
  const isDue = c => { const s = state.cards[c.id]; return !s || s.d <= Date.now(); };
  const dueCount = () => CARDS.filter(isDue).length;

  // ---------- Question card ----------
  // Multiple-response items (type "multi") key several options and are scored all-or-nothing:
  // the answer is right only if the selected set equals the keyed set. Their choice is an array of option indices.
  const isMulti = q => q.type === "multi";
  const keyCount = q => q.options.filter(o => o.ok).length;
  const isRight = (q, c) => c == null ? false : isMulti(q)
    ? Array.isArray(c) && c.length === keyCount(q) && c.every(i => q.options[i] && q.options[i].ok)
    : !!(q.options[c] && q.options[c].ok);
  const chose = (a, k) => a && (Array.isArray(a.choice) ? a.choice.includes(k) : a.choice === k);
  // mode "learn": reveal on answer, remembers prior answer. "drill": fresh each time, reveal on answer. "exam": select only.
  function questionCard(q, { n, total, mode = "learn", selected, onSelect, onAnswered } = {}) {
    const card = document.createElement("div"); card.className = "q";
    const scen = q.scenario ? B.scenarios.find(s => s.n === q.scenario) : null;
    const order = optionOrder(q);
    const multi = isMulti(q), need = keyCount(q);
    let local = null;
    let pick = multi ? (Array.isArray(selected) ? selected.slice() : []) : null;
    const answer = choice => {
      const rec = { ok: isRight(q, choice), choice, at: Date.now() };
      state.answers[q.id] = rec; recordFirst(q.id, rec.ok); if (mode === "drill") local = rec;
      touch(); draw(); onAnswered && onAnswered(rec);
    };
    const draw = () => {
      const a = mode === "learn" ? state.answers[q.id] : mode === "drill" ? local : null;
      card.innerHTML = `<div class="q-meta"><span class="eyebrow">Question ${n} of ${total}</span>${multi ? `<span class="chip multi-chip">Select ${need}</span>` : ""}${mode !== "exam" ? taskChip(q.ts) : ""}${scen && mode !== "exam" ? `<span class="chip">${esc(scen.name)}</span>` : ""}</div>
        <p class="q-stem">${q.stem}</p><div class="opts" role="${multi ? "group" : mode === "exam" ? "radiogroup" : "group"}"></div>`;
      const opts = card.querySelector(".opts");
      order.forEach((k, pos) => {
        const o = q.options[k];
        const b = document.createElement("button"); b.type = "button"; b.className = "opt";
        const revealed = !!a;
        const on = multi ? pick.includes(k) : mode === "exam" && selected === k;
        if (multi && !revealed) { b.setAttribute("role", "checkbox"); b.setAttribute("aria-checked", String(on)); if (on) b.classList.add("is-sel"); }
        else if (mode === "exam") { b.setAttribute("role", "radio"); b.setAttribute("aria-checked", String(on)); if (on) b.classList.add("is-sel"); }
        if (revealed) { b.disabled = true; if (o.ok) b.classList.add("is-right"); else if (chose(a, k)) b.classList.add("is-wrong"); if (multi && o.ok && !chose(a, k)) b.classList.add("is-missed"); }
        b.innerHTML = `<span class="letter">${"ABCDEF"[pos]}</span><span class="opt-body">${o.t}${revealed ? `<span class="opt-why">${o.why}</span>${o.trap && !o.ok ? `<span class="trap-badge">Trap: ${esc(TRAPS[o.trap].name)}</span>` : ""}` : ""}</span>`;
        b.addEventListener("click", () => {
          if (mode === "learn" && state.answers[q.id]) return;
          if (mode === "drill" && local) return;
          if (multi) {
            pick = pick.includes(k) ? pick.filter(x => x !== k) : pick.length < need ? [...pick, k] : pick;
            if (mode === "exam") { onSelect && onSelect(pick.length ? pick.slice() : null); }
            draw(); return;
          }
          if (mode === "exam") { selected = k; onSelect && onSelect(k); draw(); return; }
          answer(k);
        });
        opts.append(b);
      });
      if (multi && !a) {
        const bar = document.createElement("div"); bar.className = "multi-bar";
        bar.innerHTML = `<span class="small">${pick.length} of ${need} selected</span>`;
        if (mode !== "exam") {
          const sub = document.createElement("button"); sub.type = "button"; sub.className = "btn"; sub.textContent = "Check answer";
          sub.disabled = pick.length !== need;
          sub.addEventListener("click", () => { if (pick.length === need) answer(pick.slice().sort((x, y) => x - y)); });
          bar.append(sub);
        }
        card.append(bar);
      }
      if (a) {
        const res = document.createElement("div"); res.className = `q-res ${a.ok ? "ok" : "no"}`;
        res.innerHTML = `<span>${a.ok ? "Correct" : multi ? "Not this time. Scoring is all-or-nothing: every keyed option, and only those. The explanations show why." : "Not this time. The explanations show why."}</span>`;
        if (mode === "learn") {
          const again = document.createElement("button"); again.className = "linkbtn"; again.type = "button"; again.textContent = "Try again";
          again.addEventListener("click", () => { delete state.answers[q.id]; pick = multi ? [] : null; touch(); draw(); });
          res.append(again);
        }
        card.append(res);
      }
    };
    draw();
    return card;
  }

  // ---------- Views ----------
  function viewPath() {
    const r = readiness(), pct = Math.round(r * 100), C = 2 * Math.PI * 40;
    const next = nextUp(), nm = next && MODS.find(m => m.id === next.m);
    const dstats = domainStats();
    const answered = QUESTIONS.filter(q => state.first[q.id]).length;
    const weak = weakest(1)[0];
    const lastMock = state.mocks[0];
    app.innerHTML = `
<section class="hero">
  <div>
    <div class="eyebrow">Claude Certified Architect – Foundations</div>
    <h1>Exam-ready by <em>December 31</em></h1>
    <p>Three foundation lessons, fourteen modules that build from first principles to exam judgment, and four hands-on labs, mapped to every task statement in the official blueprint. No other material needed.</p>
  </div>
  <div class="goal">
    <svg class="ring" viewBox="0 0 100 100" aria-label="Estimated readiness ${pct}%"><circle class="track" cx="50" cy="50" r="40"/><circle class="val" cx="50" cy="50" r="40" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - r)}"/><text x="50" y="58" text-anchor="middle">${pct}%</text></svg>
    <div>
      <div class="goal-v">${daysLeft()} days</div><div class="goal-k">to your Dec 31 goal</div>
      <div class="goal-v">${pct}% ready</div><div class="goal-k">First-attempt accuracy on the ${answered} practice questions you've tried, weighted by domain. Retries don't count. Practice scores alone don't justify booking: book when a cold Readiness Check and the official practice exam both clear 80%.</div>
    </div>
  </div>
</section>
${nm ? `<section class="cont">
  <div><div class="eyebrow">${modProgress(nm.id) > 0 ? "Continue" : "Start here"} · Module ${nm.n}</div><h2>${esc(nm.title)}</h2><p>${esc(L[nm.id].steps[next.s].title)}</p></div>
  <a class="btn" href="#${nm.id}-${next.s + 1}">${modProgress(nm.id) > 0 ? "Resume" : "Begin"} →</a>
</section>` : `<section class="cont"><div><div class="eyebrow">All modules complete</div><h2>Switch to exam practice</h2><p>Drill your weakest scenarios, then sit a full timed mock exam.</p></div><a class="btn" href="#practice">Practice →</a></section>`}
<section class="quick">
  <a class="qk" href="#practice"><span class="qk-n">${answered}<small>/${QUESTIONS.length}</small></span><span class="qk-l">practice questions answered</span></a>
  <a class="qk" href="#cards"><span class="qk-n">${dueCount()}</span><span class="qk-l">flashcards due today</span></a>
  <a class="qk" href="${lastMock ? "#mock-result" : "#mock"}"><span class="qk-n">${lastMock ? Math.round((lastMock.wpct ?? lastMock.pct) * 100) + "%" : "–"}</span><span class="qk-l">${lastMock ? `last mock score (${fmtDate(lastMock.at)})` : "no mock exam yet"}</span></a>
  ${weak ? `<a class="qk" href="#${weak.mod.id}"><span class="qk-n">${weak.t}</span><span class="qk-l">weakest area: ${esc(B.tasks[weak.t])} (${Math.round(weak.pct * 100)}%)</span></a>` : `<a class="qk" href="#blueprint"><span class="qk-n">30</span><span class="qk-l">task statements on the blueprint</span></a>`}
</section>
<div class="sec-head"><h2>Domains</h2><span class="small">mastery across all task statements</span></div>
<section class="domains">
  ${dstats.map(d => `<div class="dom">
    <div class="dom-top"><span class="dom-n chip dom-${d.id}">D${d.n}</span><span class="dom-w">${d.weight}%</span></div>
    <div class="dom-name">${esc(d.short)}</div>
    <div class="bar"><span class="dom-bg-${d.id}" style="width:${Math.round(d.mastery * 100)}%"></span></div>
    <div class="dom-meta">${Math.round(d.mastery * 100)}% · ${d.started}/${d.tasks.length} tasks practiced</div>
  </div>`).join("")}
</section>
<div class="sec-head"><h2>Study path</h2><span class="small">${MODS.reduce((s, m) => s + m.minutes, 0) / 60 | 0}h ${MODS.reduce((s, m) => s + m.minutes, 0) % 60}m total</span></div>
<section class="path">
  ${MODS.map(m => {
    const p = modProgress(m.id), isReady = ready(m.id);
    const status = !isReady ? `<span class="status soon">Coming soon</span>` : p >= 1 ? `<span class="status done">Done</span>` : p > 0 ? `<span class="status prog">In progress</span>` : `<span class="status new">Start</span>`;
    const inner = `<span class="mod-n">${m.n}</span>
      <span><span class="mod-title">${esc(m.title)}</span><p class="mod-p">${esc(m.principle)}</p><span class="chips">${m.tasks.map(taskChip).join("") || '<span class="chip">exam strategy</span>'}</span></span>
      <span class="mod-side">${status}<span>${m.minutes} min</span>${isReady && p > 0 && p < 1 ? `<span class="mini"><span style="width:${p * 100}%"></span></span>` : ""}</span>`;
    return isReady ? `<a class="mod ready" href="#${m.id}">${inner}</a>` : `<div class="mod soon">${inner}</div>`;
  }).join("")}
</section>`;
  }

  function pageHead(eyebrow, title, sub) {
    return `<a class="crumb" href="#path">← Study path</a>
<div class="read page-head"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div>`;
  }

  function viewGlossary() {
    const modOf = id => MODS.find(m => m.id === id);
    app.innerHTML = `${pageHead("Glossary", "Every term in one place", "Each entry links to the lesson that explains it.")}
<input id="gq" class="sel" type="search" placeholder="Search terms" aria-label="Search terms" style="width:100%;margin-bottom:16px">
<div class="bp-rows" id="gl"></div>`;
    const list = document.getElementById("gl");
    const draw = q => { const t = q.trim().toLowerCase(); list.innerHTML = GLOSS.filter(([k, , d]) => !t || (k + " " + d).toLowerCase().includes(t)).sort((a, b) => a[0].localeCompare(b[0])).map(([k, id, d]) => { const m = modOf(id); return `<div class="bp-row"><span><strong>${esc(k)}</strong><br><span class="small">${esc(d)}</span></span><span class="bp-mod">${m ? `<a href="#${m.id}">Module ${m.n} →</a>` : ""}</span></div>`; }).join("") || `<p class="small">No matching terms.</p>`; };
    document.getElementById("gq").addEventListener("input", e => draw(e.target.value));
    draw("");
  }
  // Principles: the design beliefs behind the right answers. Search, filter by theme, or collapse to rules only.
  let princState = { q: "", theme: "", compact: false };
  function viewPrinciples() {
    const modFor = ts => ts ? MODS.find(m => m.tasks.includes(ts)) : null;
    app.innerHTML = `${pageHead("Principles", "How the exam thinks", `${PRINC.length} design beliefs behind the right answers, in one place. Each says why it holds, the tempting wrong answer it beats, and where it's taught. Collapse to rules only for a quick pass before a mock.`)}
<div class="read"><div class="pr-tools">
<input id="pq" class="sel" type="search" placeholder="Search principles" aria-label="Search principles" value="${esc(princState.q)}">
<select id="pt" class="sel" aria-label="Theme" style="flex:0 1 240px"><option value="">All themes</option>${PTHEMES.map(t => `<option value="${t.id}"${princState.theme === t.id ? " selected" : ""}>${esc(t.name)}</option>`).join("")}</select>
<label><input type="checkbox" id="pc"${princState.compact ? " checked" : ""}> Rules only</label></div>
<div id="pl"></div></div>`;
    const list = document.getElementById("pl");
    const draw = () => {
      const t = princState.q.trim().toLowerCase();
      const hit = p => (!princState.theme || p.theme === princState.theme) && (!t || [p.rule, p.why, p.wrong, p.ts || "", p.trap ? TRAPS[p.trap].name : ""].join(" ").toLowerCase().includes(t));
      list.className = princState.compact ? "compact" : "";
      const html = PTHEMES.map(th => {
        const ps = PRINC.filter(p => p.theme === th.id && hit(p));
        if (!ps.length) return "";
        return `<div class="pr-theme"><h2>${esc(th.name)}</h2><p>${esc(th.blurb)}</p></div>` + ps.map(p => {
          const m = modFor(p.ts);
          return `<div class="pr-card" id="pr-${p.id}"><p class="pr-rule">${esc(p.rule)}</p><p class="pr-why">${esc(p.why)}</p>
<p class="pr-wrong"><span class="pr-label">Beats</span>${esc(p.wrong)}</p>
<div class="pr-meta">${p.ts ? taskChip(p.ts) : ""}${p.trap ? `<span class="trap-badge" title="${esc(TRAPS[p.trap].tell)}">Trap: ${esc(TRAPS[p.trap].name)}</span>` : ""}${m ? `<a href="#${m.id}">Module ${m.n} →</a>` : ""}</div></div>`;
        }).join("");
      }).join("");
      list.innerHTML = html || `<p class="small">No matching principles.</p>`;
    };
    document.getElementById("pq").addEventListener("input", e => { princState.q = e.target.value; draw(); });
    document.getElementById("pt").addEventListener("change", e => { princState.theme = e.target.value; draw(); });
    document.getElementById("pc").addEventListener("change", e => { princState.compact = e.target.checked; draw(); });
    draw();
  }
  function viewToday() {
    app.innerHTML = `${pageHead("Exam vs. today", "Answer the exam in its own terms", "The exam blueprint was written before some product changes. On the exam, choose the blueprint's answer. At work, use what ships today. Every row links to the official source.")}
<div class="bp-rows">${TODAY.map(r => `<div class="panel" style="margin-bottom:14px">
  <h3 style="margin:0 0 6px">${esc(r.topic)} <span class="small mono">${esc(r.ts)}</span></h3>
  <p><strong>Exam:</strong> ${esc(r.exam)}</p>
  <p><strong>Today:</strong> ${esc(r.today)}</p>
  <p class="small"><a href="${esc(r.src)}" target="_blank" rel="noopener">Source</a></p></div>`).join("")}</div>`;
  }
  function viewBlueprint() {
    const tm = taskMastery();
    const modFor = t => MODS.filter(m => m.tasks.includes(t));
    app.innerHTML = `${pageHead("Official exam blueprint", "30 task statements", "Everything the exam can ask about. Each percentage is your share of correct answers across that task's practice questions; a dash means you haven't practiced it yet.")}
<p class="small" style="margin-bottom:18px">Some blueprint terms predate current Claude products. See <a href="#today">Exam vs. today</a> for the differences and which answer the exam expects.</p>
${B.domains.map(d => `<section class="bp-dom">
  <h2><span class="chip dom-${d.id}">D${d.n}</span>${esc(d.name)} <span class="small">${d.weight}% of the exam</span></h2>
  <div class="bp-rows">
  ${Object.keys(B.tasks).filter(t => t.startsWith(d.n + ".")).map(t => {
    const s = tm[t], mods = modFor(t);
    const pct = s && s.tried ? Math.round(s.right / s.total * 100) + "%" : "–";
    return `<div class="bp-row"><span class="mono">${t}</span><span>${esc(B.tasks[t])} <span class="small">· ${s ? s.total : 0} questions</span></span>
      <span class="bp-mod">${mods.map(m => `<a href="#${m.id}">Module ${m.n} →</a>`).join("<br>")}</span>
      <span class="bp-pct">${pct}</span></div>`;
  }).join("")}
  </div></section>`).join("")}
<section class="read" style="margin-top:34px">
  <h2 style="font-size:19px;margin-bottom:8px">Out of scope</h2>
  <p class="small">The official guide says these will not appear. Don't spend study time on them.</p>
  <ul class="oos"><li>Fine-tuning or training models</li><li>API auth, billing, account management</li><li>Deploying or hosting MCP servers</li><li>Model internals, training, weights</li><li>Constitutional AI, RLHF, safety training</li><li>Embeddings and vector databases</li><li>Computer use</li><li>Vision</li><li>Streaming and server-sent events</li><li>Rate limits, quotas, pricing math</li><li>OAuth and key rotation</li><li>Cloud-provider configuration</li><li>Benchmarks and model comparisons</li><li>Prompt-caching details</li><li>Tokenization specifics</li></ul>
</section>`;
  }

  function viewLesson(id, stepIdx) {
    const mod = MODS.find(m => m.id === id), steps = L[id].steps;
    const i = Math.min(Math.max(stepIdx, 0), steps.length - 1), step = steps[i];
    state.last = { m: id, s: i, at: Date.now() }; touch();
    app.innerHTML = `
<div class="read">
  <a class="crumb" href="#path">← Study path</a>
  <header class="l-head">
    <div class="eyebrow">Module ${mod.n} · ${mod.minutes} min</div>
    <h1>${esc(mod.title)}</h1>
    <p class="l-principle">${esc(mod.principle)}</p>
    <div class="chips">${mod.tasks.map(t => taskChip(t) + `<span class="small" style="margin-right:8px">${esc(B.tasks[t])}</span>`).join("")}</div>
  </header>
  <div class="steps" role="tablist" aria-label="Lesson steps">${steps.map((s, k) => `<button type="button" role="tab" aria-selected="${k === i}" aria-label="Step ${k + 1}: ${esc(s.title)}" title="${esc(s.title)}" class="${k === i ? "cur" : state.steps[`${id}:${k}`] ? "done" : ""}" data-go="${k}"></button>`).join("")}</div>
  <div class="step-meta"><span>Step ${i + 1} of ${steps.length}</span><span>${{ read: "Read", widget: "Interactive", quiz: "Practice", recap: "Recap" }[step.kind]}</span></div>
  <article class="step" id="step"></article>
  <nav class="l-nav" aria-label="Step navigation">
    <button class="btn ghost" type="button" id="prev" ${i === 0 ? "disabled" : ""}>← Back</button>
    <button class="btn accent" type="button" id="next">${i === steps.length - 1 ? "Finish module" : "Continue →"}</button>
  </nav>
</div>`;
    const el = document.getElementById("step");
    el.append(Object.assign(document.createElement("h2"), { textContent: step.title }));
    if (step.kind === "read") {
      const p = document.createElement("div"); p.className = "prose"; p.innerHTML = step.html; el.append(p);
      p.querySelectorAll("[data-embed]").forEach(n => window.EMBEDS[n.dataset.embed] && window.EMBEDS[n.dataset.embed](n));
    } else if (step.kind === "widget") {
      const intro = document.createElement("p"); intro.className = "widget-intro"; intro.textContent = step.intro;
      const panel = document.createElement("div"); panel.className = "panel";
      el.append(intro, panel);
      window.WIDGETS[step.widget](panel, { done: () => { const k = `${id}:${i}`; if (!state.widgets[k]) { state.widgets[k] = Date.now(); touch(); } } }, step.config);
    } else if (step.kind === "quiz") {
      const wrap = document.createElement("div"); wrap.className = "qs";
      step.questions.forEach((q, n) => wrap.append(questionCard(q, { n: n + 1, total: step.questions.length })));
      el.append(wrap);
    } else if (step.kind === "recap") {
      const ol = document.createElement("ol"); ol.className = "recap";
      ol.innerHTML = step.points.map(p => `<li>${esc(p)}</li>`).join("");
      el.append(ol);
    }
    const go = k => { location.hash = `#${id}-${k + 1}`; };
    app.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => go(Number(b.dataset.go))));
    document.getElementById("prev").addEventListener("click", () => go(i - 1));
    document.getElementById("next").addEventListener("click", () => {
      state.steps[`${id}:${i}`] = Date.now(); touch();
      if (i < steps.length - 1) go(i + 1);
      else {
        const nextMod = MODS.find(m => m.n === mod.n + 1 && ready(m.id));
        location.hash = nextMod ? `#${nextMod.id}` : "#practice";
        toast(`Module ${mod.n} complete`);
      }
    });
  }

  function viewPractice() {
    const by = n => QUESTIONS.filter(q => q.scenario === n);
    const weak = weakest(5);
    const running = state.mock;
    app.innerHTML = `${pageHead("Practice", "Exam practice", `${QUESTIONS.length} original questions across all six scenarios. Drills give feedback after every answer; the mock exam doesn't, like the real one.`)}
<section class="mock-card">
  <div>
    <div class="eyebrow">Full mock exam</div>
    <h2>${running ? "Exam in progress" : "60 questions · 120 minutes · 4 random scenarios"}</h2>
    <p>${running ? `${Object.keys(running.ans).length} of ${running.qids.length} answered. The timer keeps running while you're away.` : "Questions are grouped by scenario as on the real exam. At the end you'll see a domain-weighted score with its 95% range, and every explanation."}</p>
  </div>
  <a class="btn" href="#mock">${running ? "Resume exam" : "Start mock exam"} →</a>
</section>
${HOLDOUT.length ? `<section class="mock-card">
  <div>
    <div class="eyebrow">Readiness Check</div>
    <h2>${state.readiness ? `Taken ${fmtDate(state.readiness.at)}: ${Math.round(state.readiness.pct * 100)}%` : `${HOLDOUT.length} unseen questions · one attempt`}</h2>
    <p>${state.readiness ? "Your one cold attempt. Review it against the booking bar." : "Questions held back from every lesson, drill and mock. Take it once, when you think you're ready."}</p>
  </div>
  <a class="btn ghost" href="#readiness">${state.readiness ? "See result" : "About the check"} →</a>
</section>` : ""}
${state.mocks.length ? `<div class="sec-head"><h2>Mock history</h2><a class="small" href="#mock-result">Latest review →</a></div>
<div class="hist">${state.mocks.map(m => `<div class="hist-row"><span>${fmtDate(m.at)}</span><span class="mono">${m.correct}/${m.total}</span><span class="bar"><span style="width:${(m.wpct ?? m.pct) * 100}%;background:${(m.wpct ?? m.pct) >= BAR ? "var(--good)" : "var(--bad)"}"></span></span><span class="hist-s ${(m.wpct ?? m.pct) >= BAR ? "pass" : "fail"}">${Math.round((m.wpct ?? m.pct) * 100)}%</span></div>`).join("")}</div>` : ""}
<div class="sec-head" style="margin-top:34px"><h2>Scenario drills</h2><span class="small">the exam draws 4 of these 6</span></div>
<section class="drills">
  ${B.scenarios.map(s => {
    const qs = by(s.n), tried = qs.filter(q => state.answers[q.id]), right = tried.filter(q => state.answers[q.id].ok);
    return `<a class="drill" href="#drill-${s.n}">
      <span class="drill-n">${s.n}</span>
      <span class="drill-name">${esc(s.name)}</span>
      <span class="chips">${s.domains.map(d => `<span class="chip dom-${d}">D${B.domains.find(x => x.id === d).n}</span>`).join("")}</span>
      <span class="bar"><span style="width:${qs.length ? right.length / qs.length * 100 : 0}%;background:var(--accent)"></span></span>
      <span class="small">${right.length}/${qs.length} correct · ${qs.length - tried.length} unanswered</span>
    </a>`;
  }).join("")}
</section>
<div class="sec-head" style="margin-top:34px"><h2>Weakest areas</h2><span class="small">biggest weighted gaps among tasks you've practiced</span></div>
${weak.length ? `<div class="bp-rows">${weak.map(w => `<div class="bp-row"><span class="mono">${w.t}</span><span>${esc(B.tasks[w.t])}</span><span class="bp-mod"><a href="#${w.mod.id}">Module ${w.mod.n} →</a></span><span class="bp-pct">${Math.round(w.pct * 100)}%</span></div>`).join("")}</div>` : `<p class="small">Answer some questions first. Your weakest task statements will show up here.</p>`}`;
  }

  let drill = null;
  function viewDrill(n) {
    const s = B.scenarios.find(x => x.n === n);
    if (!drill || drill.n !== n) {
      const qs = QUESTIONS.filter(q => q.scenario === n);
      const un = shuffle(qs.filter(q => !state.answers[q.id])), wrong = shuffle(qs.filter(q => state.answers[q.id] && !state.answers[q.id].ok)), ok = shuffle(qs.filter(q => state.answers[q.id] && state.answers[q.id].ok));
      drill = { n, order: [...un, ...wrong, ...ok].map(q => q.id), i: 0, right: 0, answered: 0 };
    }
    const d = drill;
    if (d.i >= d.order.length) {
      app.innerHTML = `${pageHead(`Scenario ${n} drill`, esc(s.name))}
<div class="read"><div class="panel"><div class="big-num">${d.right}/${d.answered} correct</div><p class="small">Drill complete. Every answer counts toward your readiness score.</p>
<div class="row-btns"><button class="btn" type="button" id="again">Drill again</button><a class="btn ghost" href="#practice">Back to practice</a></div></div></div>`;
      document.getElementById("again").addEventListener("click", () => { drill = null; viewDrill(n); });
      return;
    }
    const q = QBYID[d.order[d.i]];
    app.innerHTML = `${pageHead(`Scenario ${n} drill`, esc(s.name))}
<div class="read"><div class="drill-bar"><span class="bar"><span style="width:${d.i / d.order.length * 100}%;background:var(--accent)"></span></span><span class="small">${d.right} correct so far</span></div><div id="dq"></div>
<nav class="l-nav"><a class="btn ghost" href="#practice">End drill</a><button class="btn accent" type="button" id="dnext" disabled>Next →</button></nav></div>`;
    const nextBtn = document.getElementById("dnext");
    document.getElementById("dq").append(questionCard(q, { n: d.i + 1, total: d.order.length, mode: "drill", onAnswered: rec => { d.answered++; if (rec.ok) d.right++; nextBtn.disabled = false; nextBtn.focus(); } }));
    nextBtn.addEventListener("click", () => { d.i++; viewDrill(n); window.scrollTo(0, 0); });
  }

  let ticker = null;
  function startMock(kind = "mock") {
    if (kind === "readiness") {
      const scen = B.scenarios.map(s => s.n);
      state.mock = { kind, startedAt: Date.now(), qids: scen.flatMap(n => HOLDOUT.filter(q => q.scenario === n).map(q => q.id)), ans: {}, flags: {}, scen, cur: 0 };
      return touch();
    }
    const scen = shuffle(B.scenarios.map(s => s.n)).slice(0, 4).sort((a, b) => a - b);
    // Meet the blueprint's domain weights exactly (27/18/20/20/15% of 60). Draw from the 4 scenarios first;
    // if they can't fill a domain's quota, borrow that domain's items from the other scenarios.
    const inDraw = shuffle(QUESTIONS.filter(q => scen.includes(q.scenario)));
    const outside = shuffle(QUESTIONS.filter(q => q.scenario && !scen.includes(q.scenario)));
    // Never two members of one option family in a sitting: they share options and would cue each other.
    const picked = new Set(), fams = new Set();
    for (const d of B.domains) {
      const need = Math.round(d.weight * 0.6), ofD = q => domOfTask(q.ts).id === d.id;
      let n = 0;
      for (const q of [...inDraw.filter(ofD), ...outside.filter(ofD)]) {
        if (n === need) break;
        if (q.family && fams.has(q.family)) continue;
        picked.add(q); if (q.family) fams.add(q.family); n++;
      }
    }
    const order = [...scen, ...B.scenarios.map(s => s.n).filter(n => !scen.includes(n))];
    const qids = order.flatMap(n => [...picked].filter(q => q.scenario === n).map(q => q.id));
    const borrowed = [...new Set([...picked].filter(q => !scen.includes(q.scenario)).map(q => q.scenario))];
    state.mock = { startedAt: Date.now(), qids, ans: {}, flags: {}, scen, borrowed, cur: 0 };
    touch();
  }
  function submitMock() {
    const m = state.mock; if (!m) return;
    let correct = 0; const dom = {}, wrong = [], multi = [0, 0];
    for (const id of m.qids) {
      const q = QBYID[id]; if (!q) continue;
      const d = domOfTask(q.ts).id; dom[d] = dom[d] || [0, 0]; dom[d][1]++;
      const c = m.ans[id];
      const ok = isRight(q, c);
      if (isMulti(q)) { multi[1]++; if (ok) multi[0]++; }
      if (ok) { correct++; dom[d][0]++; } else wrong.push([id, c == null ? -1 : c]);
      if (c != null) { state.answers[id] = { ok, choice: c, at: Date.now() }; recordFirst(id, ok); }
    }
    const total = m.qids.length, pct = correct / total;
    // Weight each domain's accuracy by its blueprint share, so scores compare across scenario draws.
    const present = B.domains.filter(d => dom[d.id]), wsum = present.reduce((a, d) => a + d.weight, 0);
    const wpct = wsum ? present.reduce((a, d) => a + d.weight * dom[d.id][0] / dom[d.id][1], 0) / wsum : 0;
    const rec = { kind: m.kind || "mock", at: Date.now(), startedAt: m.startedAt, correct, total, pct, wpct, ci: wilson(correct, total), scen: m.scen, dom, wrong, multi, mins: Math.round((Date.now() - m.startedAt) / 60000) };
    if (rec.kind === "readiness") state.readiness = rec; else state.mocks = [rec, ...state.mocks].slice(0, 10);
    state.mock = null; touch();
    location.hash = rec.kind === "readiness" ? "#readiness" : "#mock-result";
  }
  function viewReadiness() {
    if (state.readiness) return viewMockResult(state.readiness);
    if (state.mock) { location.hash = "#mock"; return; }
    app.innerHTML = `${pageHead("Readiness Check", "One cold attempt", `${HOLDOUT.length} questions you've never seen, 10 from each scenario, weighted like the exam. It's the app's best signal of exam readiness, so it only counts once.`)}
<div class="read"><div class="panel">
<ul class="rules"><li>Take it once, after you've finished the modules and practice. Your first attempt is the one that counts; it can't be reset.</li><li>120-minute timer, no feedback until you submit, unanswered questions count as wrong.</li><li>The booking bar is 80% overall with every domain at 70% or more. At ${HOLDOUT.length} questions, a score of 80% has a 95% range of about 68–88%, so treat it as one signal alongside your mocks and the official practice exam.</li></ul>
<button class="btn accent" type="button" id="rbegin">Begin the Readiness Check</button></div></div>`;
    document.getElementById("rbegin").addEventListener("click", () => { startMock("readiness"); location.hash = "#mock"; });
  }
  function viewMock() {
    if (!state.mock) {
      app.innerHTML = `${pageHead("Mock exam", "Full mock exam", "Modeled on the real exam: about 60 questions (the count is unofficial), 120 minutes, 4 of the 6 scenarios chosen at random, no feedback until you submit. Most questions have one best answer; a few are multiple-response (\"Select 2\"), scored all-or-nothing, as on the real exam.")}
<div class="read"><div class="panel">
<ul class="rules"><li>The timer starts when you begin and keeps running if you leave the page.</li><li>The 60 questions always match the blueprint's domain weights. If the four drawn scenarios can't fill a domain's share, a few questions come from another scenario.</li><li>You can move between questions, change answers and flag questions to revisit.</li><li>Unanswered questions count as wrong. There's no penalty for guessing.</li><li>You get a domain-weighted percentage with a 95% range, not a scaled score. Anthropic doesn't publish how raw scores map to the 720 pass mark, and it varies by exam form. The practice bar is 80%.</li></ul>
<button class="btn accent" type="button" id="begin">Begin the exam</button></div></div>`;
      document.getElementById("begin").addEventListener("click", () => { startMock(); viewMock(); });
      return;
    }
    const m = state.mock, LIMIT = 120 * 60000;
    const i = Math.min(m.cur || 0, m.qids.length - 1), q = QBYID[m.qids[i]];
    const s = B.scenarios.find(x => x.n === q.scenario);
    app.innerHTML = `<div class="exam-bar"><span class="eyebrow">${m.kind === "readiness" ? "Readiness Check · " : ""}Scenario ${s.n} · ${esc(s.name)}</span><span class="timer" id="timer"></span></div>
<div class="read"><div id="mq"></div>
<div class="exam-nav"><button class="btn ghost" type="button" id="mprev" ${i === 0 ? "disabled" : ""}>← Previous</button>
<button class="btn ghost" type="button" id="mflag">${m.flags[q.id] ? "Unflag" : "Flag for review"}</button>
<button class="btn" type="button" id="mnext">${i === m.qids.length - 1 ? "Review and submit" : "Next →"}</button></div>
<div class="palette" aria-label="Question palette">${m.qids.map((id, k) => `<button type="button" data-k="${k}" class="${k === i ? "cur " : ""}${m.ans[id] != null ? "ans " : ""}${m.flags[id] ? "flag" : ""}" aria-label="Question ${k + 1}${m.ans[id] != null ? ", answered" : ""}${m.flags[id] ? ", flagged" : ""}">${k + 1}</button>`).join("")}</div>
<div class="submit-box" id="sbox"><p><strong>${Object.keys(m.ans).length} of ${m.qids.length}</strong> answered${Object.keys(m.flags).length ? `, ${Object.keys(m.flags).length} flagged` : ""}.</p><button class="btn accent" type="button" id="msubmit">Submit exam</button><span id="sconfirm"></span></div></div>`;
    document.getElementById("mq").append(questionCard(q, { n: i + 1, total: m.qids.length, mode: "exam", selected: m.ans[q.id], onSelect: k => { if (k == null) delete m.ans[q.id]; else m.ans[q.id] = k; touch(); const pb = app.querySelector(`.palette [data-k="${i}"]`); pb && pb.classList.toggle("ans", k != null); } }));
    const go = k => { m.cur = k; touch(); viewMock(); window.scrollTo(0, 0); };
    document.getElementById("mprev").addEventListener("click", () => go(i - 1));
    document.getElementById("mnext").addEventListener("click", () => i < m.qids.length - 1 ? go(i + 1) : document.getElementById("sbox").scrollIntoView({ behavior: "smooth" }));
    document.getElementById("mflag").addEventListener("click", () => { if (m.flags[q.id]) delete m.flags[q.id]; else m.flags[q.id] = 1; touch(); viewMock(); });
    app.querySelectorAll(".palette [data-k]").forEach(b => b.addEventListener("click", () => go(Number(b.dataset.k))));
    document.getElementById("msubmit").addEventListener("click", e => {
      const un = m.qids.length - Object.keys(m.ans).length;
      const c = document.getElementById("sconfirm");
      if (!c.dataset.armed && un > 0) { c.dataset.armed = "1"; c.innerHTML = ` <span class="small">${un} unanswered. Click submit again to finish anyway.</span>`; return; }
      submitMock();
    });
    const timerEl = document.getElementById("timer");
    const tick = () => {
      if (!state.mock) return clearInterval(ticker);
      const left = LIMIT - (Date.now() - state.mock.startedAt);
      if (left <= 0) { clearInterval(ticker); toast("Time's up. Exam submitted."); submitMock(); return; }
      const mm = Math.floor(left / 60000), ss = Math.floor(left % 60000 / 1000);
      timerEl.textContent = `${mm}:${String(ss).padStart(2, "0")} left`;
      timerEl.classList.toggle("low", left < 10 * 60000);
    };
    clearInterval(ticker); tick(); ticker = setInterval(tick, 1000);
  }
  function viewMockResult(r = state.mocks[0]) {
    if (!r) { location.hash = "#mock"; return; }
    const w = r.wpct ?? r.pct, ci = r.ci || wilson(r.correct, r.total), pass = w >= BAR;
    const ready = r.kind === "readiness", domOk = B.domains.every(d => !r.dom[d.id] || r.dom[d.id][0] / r.dom[d.id][1] >= 0.7);
    const verdict = ready
      ? `<strong class="${r.pct >= BAR && domOk ? "pass" : "fail"}">${r.pct >= BAR && domOk ? "Meets" : "Doesn't yet meet"} the app's booking bar</strong> (80% overall and every domain at 70% or more). Before booking, also confirm two mocks at 80% a week apart and the official practice exam.`
      : `<strong class="${pass ? "pass" : "fail"}">${pass ? "At or above" : "Below"} the 80% practice bar.</strong> Mock questions overlap with ones you've practiced, so treat this as an upper bound.`;
    app.innerHTML = `${pageHead(`${ready ? "Readiness Check" : "Mock exam"} · ${fmtDate(r.at)}`, `${Math.round((ready ? r.pct : w) * 100)}% <span class="score-of">${ready ? "first attempt" : "domain-weighted"}</span>`, `${r.correct} of ${r.total} correct (${Math.round(r.pct * 100)}% raw, 95% range ${Math.round(ci[0] * 100)}–${Math.round(ci[1] * 100)}%) in ${r.mins} minutes.${r.multi && r.multi[1] ? ` Multiple-response: ${r.multi[0]} of ${r.multi[1]} correct.` : ""} ${verdict}`)}
<div class="sec-head"><h2>By domain</h2></div>
<div class="bp-rows">${B.domains.map(d => { const v = r.dom[d.id]; if (!v) return ""; return `<div class="bp-row"><span class="chip dom-${d.id}">D${d.n}</span><span>${esc(d.name)}</span><span class="bar"><span class="dom-bg-${d.id}" style="width:${v[0] / v[1] * 100}%"></span></span><span class="bp-pct">${v[0]}/${v[1]}</span></div>`; }).join("")}</div>
<div class="sec-head" style="margin-top:30px"><h2>Review missed questions</h2><span class="small">${r.wrong.length} to review</span></div>
<div class="read qs" id="missed"></div>
<div class="row-btns" style="margin-top:24px"><a class="btn" href="#practice">Back to practice</a></div>`;
    const box = document.getElementById("missed");
    r.wrong.forEach(([id, c], k) => {
      const q = QBYID[id]; if (!q) return;
      const saved = state.answers[id];
      state.answers[id] = { ok: false, choice: c, at: saved ? saved.at : Date.now() };
      const card = questionCard(q, { n: k + 1, total: r.wrong.length });
      if (saved) state.answers[id] = saved; else delete state.answers[id];
      card.querySelector(".q-res")?.remove();
      if (c === -1) card.querySelector(".q-meta").insertAdjacentHTML("beforeend", `<span class="chip">unanswered</span>`);
      box.append(card);
    });
  }

  let deck = null;
  function viewCards() {
    const filter = deck ? deck.filter : "all";
    if (!deck || deck.done) {
      const pool = CARDS.filter(c => (filter === "all" || c.module.id === filter) && isDue(c));
      deck = { filter, queue: shuffle(pool).map(c => c.id), flipped: false, seen: 0, done: false };
    }
    const byId = Object.fromEntries(CARDS.map(c => [c.id, c]));
    const mastered = CARDS.filter(c => (state.cards[c.id] || {}).b >= 4).length;
    const cur = byId[deck.queue[0]];
    app.innerHTML = `${pageHead("Flashcards", "Spaced review", `${dueCount()} due · ${CARDS.length} cards · ${mastered} mastered. Cards you know come back after 1, 3, 7, 14 and 30 days; cards you miss come back this session.`)}
<div class="read">
<label class="small" for="deckf">Deck</label>
<select id="deckf" class="sel"><option value="all">All modules</option>${MODS.filter(m => (L[m.id] || {}).cards).map(m => `<option value="${m.id}" ${filter === m.id ? "selected" : ""}>Module ${m.n}: ${esc(m.title)}</option>`).join("")}</select>
${cur ? `<div class="flash ${deck.flipped ? "flipped" : ""}" id="flash" tabindex="0" role="button" aria-label="Flashcard. Press space to reveal.">
  <div class="flash-meta"><span class="eyebrow">Module ${cur.module.n} · ${esc(cur.module.title)}</span><span class="small">${deck.queue.length} left</span></div>
  <div class="flash-f">${esc(cur.f)}</div>
  ${deck.flipped ? `<div class="flash-b">${esc(cur.b)}</div>` : `<div class="flash-hint small">Tap or press space to reveal</div>`}
</div>
${deck.flipped ? `<div class="row-btns flash-btns"><button class="btn ghost" type="button" id="again">Again <kbd>1</kbd></button><button class="btn accent" type="button" id="got">Got it <kbd>2</kbd></button></div>` : ""}`
  : `<div class="panel" style="margin-top:16px"><div class="big-num">All caught up</div><p class="small">No cards due${filter === "all" ? "" : " in this deck"}. ${deck.seen ? `You reviewed ${deck.seen} cards.` : ""} Come back tomorrow, or study ahead below.</p><button class="btn ghost" type="button" id="ahead">Study all cards in this deck now</button></div>`}
</div>`;
    document.getElementById("deckf").addEventListener("change", e => { deck = { filter: e.target.value, done: true }; viewCards(); });
    const flip = () => { if (!deck.flipped) { deck.flipped = true; viewCards(); } };
    const rate = ok => {
      const id = deck.queue.shift(), s = state.cards[id] || { b: 0 };
      const b = ok ? Math.min(5, (s.b || 0) + 1) : 1;
      state.cards[id] = { b, d: ok ? Date.now() + BOX_DAYS[b] * DAY : Date.now(), at: Date.now() };
      if (!ok) deck.queue.push(id);
      deck.seen++; deck.flipped = false; touch(); viewCards();
    };
    const f = document.getElementById("flash");
    if (f) { f.addEventListener("click", flip); f.focus({ preventScroll: true }); }
    document.getElementById("again")?.addEventListener("click", () => rate(false));
    document.getElementById("got")?.addEventListener("click", () => rate(true));
    document.getElementById("ahead")?.addEventListener("click", () => { deck = { filter, queue: shuffle(CARDS.filter(c => filter === "all" || c.module.id === filter)).map(c => c.id), flipped: false, seen: 0 }; viewCards(); });
    document.onkeydown = e => {
      if (route().page !== "cards" || !deck.queue.length || e.target.tagName === "SELECT") return;
      if (e.key === " " && !deck.flipped) { e.preventDefault(); flip(); }
      else if (deck.flipped && e.key === "1") rate(false);
      else if (deck.flipped && e.key === "2") rate(true);
    };
  }

  // ---------- Router ----------
  function route() {
    const h = location.hash.replace(/^#/, "");
    const m = h.match(/^([fml]\d\d)(?:-(\d+))?$/);
    if (m && L[m[1]]) {
      let s;
      if (m[2]) s = Number(m[2]) - 1;
      else { s = L[m[1]].steps.findIndex((_, i) => !state.steps[`${m[1]}:${i}`]); if (s < 0) s = 0; }
      return { lesson: m[1], step: s };
    }
    const d = h.match(/^drill-([1-6])$/);
    if (d) return { drill: Number(d[1]), page: "practice" };
    if (["blueprint", "today", "glossary", "principles", "practice", "mock", "mock-result", "readiness", "cards"].includes(h)) return { page: h };
    return { page: "path" };
  }
  function render() {
    const r = route();
    clearInterval(ticker); document.onkeydown = null;
    const navKey = ["mock", "mock-result", "readiness"].includes(r.page) ? "practice" : r.page === "today" ? "blueprint" : r.page;
    document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", !r.lesson && a.dataset.nav === navKey));
    // On narrow screens the nav scrolls sideways; keep the active link in view.
    const onLink = document.querySelector(".nav a.on"), navEl = onLink && onLink.parentElement;
    if (navEl && navEl.scrollWidth > navEl.clientWidth) navEl.scrollLeft = Math.max(0, onLink.offsetLeft - navEl.offsetLeft - (navEl.clientWidth - onLink.offsetWidth) / 2);
    if (r.lesson) viewLesson(r.lesson, r.step);
    else if (r.drill) viewDrill(r.drill);
    else if (r.page === "blueprint") viewBlueprint();
    else if (r.page === "today") viewToday();
    else if (r.page === "glossary") viewGlossary();
    else if (r.page === "principles") viewPrinciples();
    else if (r.page === "practice") viewPractice();
    else if (r.page === "mock") viewMock();
    else if (r.page === "mock-result") viewMockResult();
    else if (r.page === "readiness") viewReadiness();
    else if (r.page === "cards") viewCards();
    else viewPath();
  }
  window.addEventListener("hashchange", () => { if (!location.hash.startsWith("#drill-")) drill = null; render(); window.scrollTo(0, 0); });
  render();
  if (window.claude && window.claude.use) initSync(); else window.addEventListener("load", initSync, { once: true });
})();
