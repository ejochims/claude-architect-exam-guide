# Study app

Interactive study path for the Claude Certified Architect – Foundations exam. It's published as a private claude.ai artifact.

- `index.html`: the shell, design tokens, router, progress engine and sync. The artifact platform wraps it in the document skeleton, so it has no `<html>`/`<head>` tags.
- `content/curriculum.js`: blueprint domains, task statements, scenarios, the module map, and the distractor traps.
- `content/mNN.js`: one lesson per module. Each lesson is a list of steps (`read`, `widget`, `quiz`, `recap`). Every quiz question carries a task-statement tag (`ts`) and per-option explanations, and wrong options can carry `trap` tags.
- `widgets.js`: interactive widgets (`WIDGETS`) and inline embeds (`EMBEDS`).

To add a module, create `content/mNN.js` registering `window.LESSONS.mNN`, add a `<script>` tag for it in `index.html`, and include the file in the artifact publish.
