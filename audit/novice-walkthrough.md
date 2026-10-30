# Novice walkthrough audit: study app m00–m13

Persona: a busy, technically literate solution engineer. I have used ChatGPT and Claude in a chat window. I have never called an LLM API, used tool calling, Claude Code, the Agent SDK, MCP or JSON Schema. I want this app to be the only thing I read before the Claude Certified Architect – Foundations exam.

Method: I read every step of every module in `MODULES` order (m00 → m13): read steps, the code of every widget and embed (to see what's on screen and what I'm asked to do), every quiz question with every option's explanation, recaps and flashcards. I did not open `exam-preparation-guide.md` or `docs/`. The app has no glossary, tooltip or term-definition feature (I checked `app.js` and `index.html`), so a term is "defined" only if a step before it explains it.

Step references are `mNN:i`, using the 0-based index into `window.LESSONS.mNN.steps`.

## Summary

_(Filled in after the last module.)_

## Issues by module

### m00 — How this exam thinks

Steps: 0 read "What you're walking into" · 1 read "How to read a question" · 2 widget `trapSpotter` · 3 quiz (3 Qs) · 4 recap.

- [MINOR] UNDEFINED-TERM m00:0 — The scenario and domain embeds name "Agentic Architecture & Orchestration", "Tool Design & MCP Integration", "Claude Code Configuration", "Multi-Agent Research System" and "Continuous Integration". None of these is explained, and nothing tells me "you aren't expected to know these yet". At this point I don't know whether Claude Code is a product, a feature or a coding style. — Add a short "map of the territory" box: one plain sentence each for the Claude API, tool use, agents and subagents, MCP, Claude Code and the Agent SDK, plus "every one of these gets its own module".
- [MAJOR] JUMP m00:1 — "Guarantees belong in code; judgment belongs in prompts, descriptions and examples" and "Code is responsible for permissions, thresholds, ordering, retries…" assume I picture an application wrapped around the model. From the chat window, "Claude" is the whole system, so I can't see where "code" would sit or how it could stop the model doing something. "Descriptions" (of what?) and "schema" also show up with no explanation. — Add a one-paragraph diagram first: your app (code) ↔ API ↔ model, with the model only able to *ask* for actions that your code carries out. That turns the "code vs prompt" split from a slogan into something I understand.
- [GOOD] m00:1 — The four moves (evidence → root cause → guarantee vs judgment → proportionate fix) and the "most effective first step" vs "most reliable" qualifier are clear, can be reused, and are worth keeping.
- [MAJOR] OVERLOAD m00:2 — The trap gallery shows nine patterns in one step, and the trap cards and the "name that trap" items use about 15 unexplained terms: system prompt, routing layer, context window, schema, subagent, coordinator, synthesis agent, sentiment score, `-p`, `--output-format json`, `--json-schema`, `.claude/rules/`, `.mcp.json`, `--batch`, `CLAUDE_HEADLESS`. I can only match the wording to the card text, not understand why each one is a trap. — Show the trap gallery here as a preview only ("you'll meet each one in its module"), then bring back each trap's quiz item at the end of the module that teaches the concept behind it.
- [MAJOR] NEEDS-OUTSIDE m00:2 — T8 "Feature that doesn't exist" asks me to tell real flags and files (`-p`, `.claude/rules/`, `.mcp.json`) from invented ones (`--batch`, `CLAUDE_HEADLESS`). With no Claude Code knowledge I can only guess or look it up. — Move the T8 item to after m11/m12, or label it "you'll be able to do this after Module 12".
- [MAJOR] QUIZ-UNFAIR m00:3 (q00-1) — This question assumes that the model "calls" named tools and that each tool has a written "description" that the model reads. Neither has been taught (tools arrive in m01/m02). I can pick the answer from common sense, but I don't know *why* descriptions are "the model's main signal". — Move it to the end of m02, or add one sentence on what a tool and a tool description are before the quiz.
- [MAJOR] QUIZ-UNFAIR m00:3 (q00-2) — "Lease-abstraction pipeline", "schema marks the field as a required integer" and "nullable" assume JSON Schema and structured extraction (m09). — Move it to m09, or replace it with a question that needs no schema knowledge.
- [MAJOR] QUIZ-UNFAIR m00:3 (q00-3) — "Which is not a real Claude Code mechanism?" uses `.claude/rules/`, `paths:` glob frontmatter, `claude -p`, `CLAUDE_HEADLESS` and `${GITHUB_TOKEN}` expansion in `.mcp.json`. At this point all of these are undefined (Claude Code, rules, glob, frontmatter, CI, environment-variable expansion, MCP). I can only guess, and the explanation points to "task statement 3.3", which I've never seen. — Move it to the end of m12.
- [MINOR] MISSING-WHY m00:0 — The page doesn't say what a "scaled score" of 720 means as a raw percentage, or how the 4-of-6 scenario draw affects preparation beyond "prepare all six". — Add one line: scaled scoring isn't a fixed percentage, so aim for about 80% on practice questions (the home screen already says this).
