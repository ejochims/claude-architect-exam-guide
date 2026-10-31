window.LESSONS.l02 = {
 "cards": [
  {
   "f": "Team conventions every session needs: where?",
   "b": "The project CLAUDE.md, committed to the repo."
  },
  {
   "f": "Conventions only for *.test.ts files spread across the repo?",
   "b": "A rule in .claude/rules/ with paths: [\"**/*.test.ts\"]."
  },
  {
   "f": "A shared MCP server that needs each developer's token?",
   "b": "Committed .mcp.json with \"${TOKEN}\" expansion; each developer sets the variable."
  }
 ],
 "steps": [
  {
   "kind": "read",
   "title": "The brief",
   "html": "<p class=\"lede\">Set up a repository so every developer's Claude Code follows team conventions, can run a shared workflow, reaches the issue tracker, and works the same way in CI. This lab pulls together Modules 5, 11 and 12.</p><svg viewBox=\"0 0 640 110\" role=\"img\" aria-label=\"Four configuration layers\" style=\"width:100%;height:auto;margin:8px 0 14px\"><rect x=\"10\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"76\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">CLAUDE.md</text><text x=\"76\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">always on</text><path d=\"M145 55 H161 M155 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"165\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--accent-soft);stroke:var(--accent)\"/><text x=\"232\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Rules</text><text x=\"232\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">by file path</text><path d=\"M300 55 H316 M310 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"320\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"386\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Skills</text><text x=\"386\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">on demand</text><path d=\"M455 55 H471 M465 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"475\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"542\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">.mcp.json</text><text x=\"542\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">shared tools</text></svg><h3>Requirements</h3><ul><li>Standards that apply to every task.</li><li>Testing conventions only when editing test files.</li><li>A <code>/pr-summary</code> workflow anyone can run.</li><li>A shared Jira MCP server without committing tokens.</li><li>A CI step that produces machine-readable output.</li></ul><h3>Done when</h3><p>A new teammate clones the repo and gets all of it without copying anything from someone else's machine.</p>"
  },
  {
   "kind": "widget",
   "title": "Design decisions",
   "intro": "Put each item where it belongs.",
   "widget": "sorter",
   "config": {
    "cats": [
     {
      "id": "md",
      "label": "Project CLAUDE.md"
     },
     {
      "id": "rule",
      "label": ".claude/rules/ with paths"
     },
     {
      "id": "skill",
      "label": "Skill"
     },
     {
      "id": "mcp",
      "label": ".mcp.json"
     },
     {
      "id": "user",
      "label": "~/.claude (personal)"
     }
    ],
    "items": [
     [
      "“Use the repository pattern for all data access.”",
      "md",
      "Applies to every task, for everyone."
     ],
     [
      "Conventions for *.test.ts files across all packages.",
      "rule",
      "A file pattern spread across directories: a path-scoped rule."
     ],
     [
      "A 12-step PR summary procedure people run on demand.",
      "skill",
      "On-demand workflow: load it only when invoked."
     ],
     [
      "The team's Jira server definition.",
      "mcp",
      "Project-scoped MCP config, committed and shared."
     ],
     [
      "Your preference for terse explanations.",
      "user",
      "Personal, not imposed on teammates."
     ],
     [
      "Terraform conventions for **/*.tf files.",
      "rule",
      "Loads only when Claude works on Terraform files."
     ]
    ]
   }
  },
  {
   "kind": "read",
   "title": "Build it: the files",
   "html": "<p class=\"lede\">Five small files cover the whole brief.</p><p><strong><code>CLAUDE.md</code></strong> (repo root):</p><pre class=\"code\"><code># Team standards\n- Use the repository pattern for all data access.\n- Run `npm test` before proposing a commit.\n@docs/architecture.md</code></pre><p><strong><code>.claude/rules/testing.md</code></strong>:</p><pre class=\"code\"><code>---\npaths: [&quot;**/*.test.ts&quot;, &quot;**/*.spec.ts&quot;]\n---\n- Use the fixtures in test/fixtures; don&#x27;t hand-build users or orders.\n- One behavior per test; name tests &quot;does X when Y&quot;.</code></pre><p><strong><code>.claude/skills/pr-summary/SKILL.md</code></strong>:</p><pre class=\"code\"><code>---\nname: pr-summary\ndescription: Summarize this branch&#x27;s changes as a pull request description.\nargument-hint: &quot;[base-branch]&quot;\n---\nCompare the current branch with $ARGUMENTS (default: main).\nWrite: what changed, why, how it was tested, and risks.</code></pre><p><strong><code>.mcp.json</code></strong> (the server package name is a placeholder):</p><pre class=\"code\"><code>{\n  &quot;mcpServers&quot;: {\n    &quot;jira&quot;: {\n      &quot;command&quot;: &quot;npx&quot;,\n      &quot;args&quot;: [&quot;-y&quot;, &quot;&lt;jira-mcp-server-package&gt;&quot;],\n      &quot;env&quot;: { &quot;JIRA_TOKEN&quot;: &quot;${JIRA_TOKEN}&quot; }\n    }\n  }\n}</code></pre><p><strong>CI step:</strong></p><pre class=\"code\"><code>git diff origin/main...HEAD | claude -p &quot;Review these changes for bugs and security issues&quot; \\\n  --output-format json &gt; review.json</code></pre><div class=\"callout today\"><div class=\"callout-label\">Try it for real (optional)</div><p>Create these files in a scratch repository, start <code>claude</code>, and check what loaded with <code>/context</code> (or <code>/memory</code>). Add <code>--json-schema</code> to the CI step when a script needs fixed fields. See the <a href=\"https://code.claude.com/docs/en/memory\" target=\"_blank\" rel=\"noopener\">memory</a>, <a href=\"https://code.claude.com/docs/en/skills\" target=\"_blank\" rel=\"noopener\">skills</a> and <a href=\"https://code.claude.com/docs/en/mcp\" target=\"_blank\" rel=\"noopener\">MCP</a> docs.</p></div>"
  },
  {
   "kind": "widget",
   "title": "Debug it",
   "intro": "Match each symptom to its cause.",
   "widget": "sorter",
   "config": {
    "cats": [
     {
      "id": "scope",
      "label": "Wrong scope"
     },
     {
      "id": "path",
      "label": "Rule path doesn't match"
     },
     {
      "id": "ctx",
      "label": "Always-loaded bloat"
     },
     {
      "id": "ci",
      "label": "CI invocation"
     }
    ],
    "items": [
     [
      "A new engineer's Claude ignores conventions that work for the tech lead.",
      "scope",
      "They're in the lead's ~/.claude/CLAUDE.md, not the project's."
     ],
     [
      "Testing conventions don't apply to tests in tests/api/.",
      "path",
      "The rule's paths only cover src/**."
     ],
     [
      "Every session is slow and Claude starts release steps during unrelated tasks.",
      "ctx",
      "A long procedure sits in CLAUDE.md; make it a skill."
     ],
     [
      "The CI job hangs until it times out.",
      "ci",
      "It runs interactive claude; use claude -p."
     ],
     [
      "The CI parser breaks when Claude rephrases findings.",
      "ci",
      "Use --output-format json with a --json-schema."
     ]
    ]
   }
  },
  {
   "kind": "recap",
   "title": "Recap",
   "points": [
    "Always-on standards: project CLAUDE.md. Personal ones: ~/.claude.",
    "File-pattern conventions: .claude/rules/ with paths.",
    "On-demand workflows: skills (or commands).",
    "Shared tools: .mcp.json with ${VAR} for secrets.",
    "CI: claude -p with --output-format json (and --json-schema)."
   ]
  }
 ]
};
