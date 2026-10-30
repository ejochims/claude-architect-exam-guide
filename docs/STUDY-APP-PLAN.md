# Plan: Audit of this repo + interactive study app for Claude Certified Architect – Foundations

_Audit date: 2026-10-30. Goal: pass the exam before 2026-12-31 (about 9 weeks)._

---

## 1. What the exam actually tests (ground truth)

The source of truth is Anthropic's **Certification Exam Guide** (8-page PDF distributed through Anthropic Academy / Skilljar). It defines:

| Domain | Weight | Task statements |
|---|---|---|
| D1 Agentic Architecture & Orchestration | **27%** | 1.1 agentic loops · 1.2 coordinator–subagent · 1.3 subagent invocation & context passing · 1.4 enforcement & handoff · 1.5 Agent SDK hooks · 1.6 task decomposition · 1.7 sessions: resume & fork |
| D2 Tool Design & MCP Integration | 18% | 2.1 tool descriptions & boundaries · 2.2 structured MCP errors · 2.3 tool distribution & `tool_choice` · 2.4 MCP servers in Claude Code · 2.5 built-in tools |
| D3 Claude Code Configuration & Workflows | **20%** | 3.1 CLAUDE.md hierarchy · 3.2 slash commands & skills · 3.3 path-specific rules · 3.4 plan mode vs direct execution · 3.5 iterative refinement · 3.6 CI/CD |
| D4 Prompt Engineering & Structured Output | **20%** | 4.1 explicit criteria / false positives · 4.2 few-shot · 4.3 `tool_use` + JSON Schema · 4.4 validation–retry loops · 4.5 batch processing · 4.6 multi-pass & independent review |
| D5 Context Management & Reliability | 15% | 5.1 long-conversation context · 5.2 escalation & ambiguity · 5.3 multi-agent error propagation · 5.4 large-codebase exploration · 5.5 human review & confidence calibration · 5.6 provenance & uncertainty |

**Format.** 60 multiple-choice questions, 120 minutes, one best answer plus three plausible distractors, no penalty for guessing, scaled score 100–1000, **pass = 720**. Each sitting draws **4 of 6 scenarios**: (1) Customer Support Resolution Agent, (2) Code Generation with Claude Code, (3) Multi-Agent Research System, (4) Developer Productivity with Claude, (5) Claude Code for CI, (6) Structured Data Extraction.

**Explicitly out of scope:** fine-tuning, auth/billing, MCP hosting/infra, model internals, RLHF/Constitutional AI, embeddings/vector DBs, computer use, vision, streaming/SSE, rate limits/pricing math, cloud-provider config, benchmarks, prompt-caching details, tokenization.

**Logistics to verify yourself (third-party sources, Oct 2026):** about $125 per attempt; registration through Anthropic Partner Academy (Pearson VUE) appears limited to employees of **Claude Partner Network** organizations, with a work email. Confirm with your partner/alliances team that Salesforce is enrolled and that you can get a seat.

---

## 2. Audit of the existing guide

`exam-preparation-guide.md` has about 1,700 lines and 12 topical sections. The writing is clear, scenario-oriented, and teaches "where responsibility should live," which is the exam's central idea. However, it was written **before the official blueprint was public**, so it's organized by topic rather than by the 30 task statements, and it has gaps and a few errors.

### 2a. Factual errors that would cost points (fix first)

| # | Guide says | Reality / exam says | Impact |
|---|---|---|---|
| E1 | "There is no `.claude/rules/` with YAML frontmatter… treat it as not how Claude Code works." (§10) | `.claude/rules/*.md` with `paths:` glob frontmatter **is** a real, explicitly tested mechanism (TS 3.1, 3.3). It's the right answer when conventions span directories (e.g., `**/*.test.tsx`). | **High.** It teaches you to reject a correct answer. |
| E2 | MCP scope precedence "project > local > user" (§7) | Claude Code docs: **local > project > user** (then plugins, then claude.ai connectors). | Medium |
| E3 | Batch SLA example: 30h SLA, 24h batch, "6h buffer" → 6h cadence (§12) | The arithmetic is inconsistent (6 + 24 + 6 = 36). The exam's own framing gives a **4-hour** cadence for a 30h SLA. The rule: cadence ≤ SLA − 24h − processing buffer. | Medium |
| E4 | Mentions `MultiEdit`; treats `output_config.format` as co-equal to tool use | The exam's canonical answer for guaranteed structured output is **`tool_use` + JSON Schema + `tool_choice`**. Keep `output_config.format` as a footnote. | Low |

### 2b. Coverage gaps vs. the 30 task statements

These are my estimates from reading the guide against each task statement.

| Domain | Est. coverage | Missing or thin |
|---|---|---|
| D1 (27%) | ~55% | **Agentic loop and `stop_reason`** (`tool_use` vs `end_turn`) plus termination anti-patterns: absent. `Task` tool, `allowedTools` must include `"Task"`, parallel spawning via multiple Task calls in **one** response, `AgentDefinition`, coordinator iterative-refinement loop, overly narrow decomposition, `fork_session`, `--resume <name>`. |
| D2 (18%) | ~80% | `${ENV_VAR}` expansion in `.mcp.json`; prefer community MCP servers (e.g., Jira) over custom ones; "all servers' tools available at once"; tool-rename fixes for overlap; keyword-sensitive system-prompt wording that overrides tool descriptions. |
| D3 (20%) | ~40% | **Skills** (`.claude/skills/*/SKILL.md`, `context: fork`, `allowed-tools`, `argument-hint`) and **skills vs CLAUDE.md**: absent. **CI flags** (`-p`, `--output-format json`, `--json-schema`): absent. Explore subagent; `.claude/commands/` project vs `~/.claude/commands/` user; re-review that reports only new issues; providing existing tests to avoid duplicates. Rules: wrong (E1). |
| D4 (20%) | ~75% | Batch **does not support multi-turn tool calling** inside a request; refine prompts on a sample before batching; "be conservative" doesn't improve precision; temporarily disabling high-false-positive categories; 2–4 targeted few-shot examples that show the reasoning. |
| D5 (15%) | ~70% | **Lost-in-the-middle** and position-aware ordering; a persistent **"case facts" block**; `/compact`; crash-recovery **manifests**; coverage-gap annotations in synthesis; why sentiment and self-reported confidence are poor escalation proxies; aggregate accuracy hiding per-segment failure. |

### 2c. Exam terminology vs. today's product

The blueprint was written in early 2026, and Claude Code has moved since then. Answer with **exam terminology**, but know the current reality. The app will show these as "Real world today" callouts.

| Exam says | Current Claude Code (Oct 2026) |
|---|---|
| `Task` tool spawns subagents | Renamed **`Agent`** in v2.1.63; `Task(...)` still works as an alias |
| `.claude/commands/` for slash commands | Commands are **merged into skills**; both create `/name`, and skills are recommended for new work |
| Skill `allowed-tools` "restricts" tools | Now **pre-approves** listed tools for that turn; restriction is done via `disallowed-tools` / agent `tools` |
| Hub-and-spoke: coordinator routes everything | Still the recommended pattern, but subagents *can* now nest (up to 3 levels by default) |

### 2d. Content to trim (out of scope)

Prompt-caching detail, the deep `output_config.format` operational notes, and pricing arithmetic beyond "50% off" can be cut or collapsed.

---

## 3. The study app: product design

### Principles
1. **First principles before features.** Every lesson starts from one invariant (e.g., "the model is a stateless, probabilistic function; only code is deterministic") and derives the exam answer from it.
2. **Organized by dependency, mapped to the blueprint.** Lessons follow the order you need to *understand* things; every lesson is tagged with the task statements it covers, so coverage is provable.
3. **Learn the distractor patterns.** Most wrong answers fall into about 8 recurring traps: prompt-instead-of-code, over-engineering on a "first step" question, bigger context window, self-reported confidence, sentiment, consolidate-everything, retry-everything, blame-the-downstream-agent. The app names them and drills them.
4. **Busy-professional format.** 10–15 minute lessons, mobile-friendly, resumable, with a readiness score that tells you what to study next.

### Curriculum (13 modules, ~14 hours total)

| # | Module (first principle) | Task statements | Key interactive widget |
|---|---|---|---|
| 0 | How this exam thinks: scenarios, "best/first step," distractor anatomy | — | Distractor-pattern spotter |
| 1 | The model is stateless → **the agentic loop** | 1.1, 5.1 (history) | Step-through loop simulator (`stop_reason` → tool → `tool_result`) |
| 2 | Tools are the model's interface → **descriptions decide selection** | 2.1, 2.3, 2.5 | "Fix the tool description" lab; `tool_choice` playground; Grep-vs-Glob picker |
| 3 | Prompts are probabilistic, code is deterministic → **hooks & gates** | 1.4, 1.5 | "Prompt or hook?" sorter; prerequisite-gate flow diagram |
| 4 | Failures are information → **structured errors & propagation** | 2.2, 5.3 | Error classifier (transient / validation / business / permission / empty-success) |
| 5 | Integrate once, use everywhere → **MCP** | 2.4 | Config builder: `.mcp.json` vs `~/.claude.json`, env expansion, tool vs resource |
| 6 | Context isolation is a feature → **multi-agent orchestration** | 1.2, 1.3, 1.6 | Coordinator/subagent diagram showing what each context window contains |
| 7 | Attention is finite → **context management** | 5.1, 5.4 | Context-window visualizer: bloat, trimming, lost-in-the-middle, case-facts block |
| 8 | Specific beats general → **prompting for precision** | 4.1, 4.2, 4.6 | False-positive tuner; self-review vs independent-review demo |
| 9 | Syntax ≠ semantics → **structured extraction** | 4.3, 4.4 | Schema designer (nullable, enum + other); "will retry help?" judge |
| 10 | Latency is a requirement → **batch processing** | 4.5 | Batch SLA cadence calculator; failure resubmission by `custom_id` |
| 11 | Configuration is code → **Claude Code setup** | 3.1, 3.2, 3.3, 3.4, 3.5 | "Where does this file go?" file-tree game (CLAUDE.md / rules / skills / commands) |
| 12 | Automation needs determinism → **CI/CD & sessions** | 3.6, 1.7 | Pipeline builder (`-p`, `--output-format json`, `--json-schema`); resume vs fork vs fresh decision tree |
| 13 | Humans are a scarce resource → **escalation, review, provenance** | 5.2, 5.5, 5.6 | Escalation triage sim; stratified-sampling explainer; claim–source mapping builder |

Every lesson uses the same shape: **First principle → Mechanism (diagram) → Interactive → How the exam frames it (traps) → 3–5 check questions with explanations → Real world today callout → 60-second recap card.**

### Practice engine
- **Original question bank, ~180 questions**, each tagged with task statement, scenario, and distractor pattern. Nothing is copied from the official sample or practice questions.
- **Scenario drills**: one per official scenario, 10–15 questions each.
- **Mock exam**: 4 random scenarios, 60 questions, 120-minute timer, estimated scaled score, and a per-domain breakdown.
- **Spaced-repetition flashcards** built from each lesson's recap.
- **Readiness dashboard**: mastery per task statement, weighted by domain %, plus a "study next" recommendation.

### Look & feel
An Anthropic-*inspired* design language: warm ivory/cream backgrounds, clay/terracotta accent, deep slate text, serif display headings with a clean sans for body, generous whitespace, subtle motion, and a full dark mode. **No Anthropic logo or wordmark, and the site is clearly labeled as an independent study guide**, because it's unofficial and shouldn't look official.

### Technical approach
- **Stack:** no build step. Plain HTML/CSS/JS; lessons, questions and widgets live in `/app/content/*.js` and `/app/widgets.js`, so content can be edited without touching the engine. Inline SVG and canvas for diagrams; no backend.
- **Location:** a new `/app` folder in this repo; the markdown guide stays as the long-form companion.
- **Hosting:** publish as a private claude.ai Artifact (opens on phone and laptop, no infra) and optionally GitHub Pages.
- **Progress:** synced across devices through the artifact's private per-user store, with a local browser copy as a fallback.

---

## 4. Execution phases

| Phase | Deliverable | Review checkpoint |
|---|---|---|
| **P1: Fix and map** ✅ | Fix E1–E4 in the guide; add the missing content from §2b; add a task-statement coverage matrix; add the "exam vs today" table | You skim the diff |
| **P2: Shell + 3 pilot lessons** ✅ | App shell, design system, progress tracking, Modules 0, 1, and 3 with widgets and questions | **You try it on your phone** and give feedback on tone, depth, and design before scaling |
| **P3: Full curriculum** | Modules 2 and 4–13 with all widgets | Spot-check 2 modules |
| **P4: Practice engine** | Question bank (~180), scenario drills, mock exam, flashcards, readiness dashboard | Take one mock exam |
| **P5: Verify and ship** | Fact-check every claim against current docs and the blueprint; check mobile, accessibility, and dark mode; publish | Final link |

## 5. Suggested study schedule (Nov 1 – Dec 31)

| Weeks | Focus | Time |
|---|---|---|
| 1–2 | Modules 0–4 (D1/D2 core, plus the #1 concept: prompt vs code) | 30 min/day |
| 3–4 | Modules 5–9 | 30 min/day |
| 5–6 | Modules 10–13, plus a scenario drill for each | 30–45 min/day |
| 7 | Mock exam #1 → targeted remediation from the dashboard → official practice exam | 3–4 h |
| 8 | Mock exam #2 (aim for an estimated score above 800 for margin), then **book the exam** | 3 h |
| 9 | Buffer and sit the exam | — |

Optional but high-value: a 2–3 hour hands-on weekend. Configure a toy repo with CLAUDE.md, `.claude/rules/`, a skill, and `.mcp.json`, and run `claude -p --output-format json`. Domain 3 is 20% of the exam, and hands-on recall beats reading.
