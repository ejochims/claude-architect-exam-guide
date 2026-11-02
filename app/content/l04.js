window.LESSONS.l04 = {
 "cards": [
  {
   "f": "A subagent knows only what?",
   "b": "What the coordinator passes in its prompt: goal, constraints, relevant findings and the output format."
  },
  {
   "f": "How do parallel subagents start?",
   "b": "The coordinator issues several subagent (Task) calls in one response."
  },
  {
   "f": "A subagent partly fails. What does it return?",
   "b": "Partial results plus each failure with its type and what was tried, so the coordinator can decide."
  }
 ],
 "steps": [
  {
   "kind": "read",
   "title": "The brief",
   "html": "<p class=\"lede\">Build a research system: a coordinator that splits a question across search and analysis subagents, then synthesizes a cited report, and copes when parts fail. This lab pulls together Modules 4, 6, 7 and 13.</p><svg viewBox=\"0 0 640 110\" role=\"img\" aria-label=\"Coordinator delegates to subagents, synthesis writes the report, coverage check loops back\" style=\"width:100%;height:auto;margin:8px 0 14px\"><rect x=\"10\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"76\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Coordinator</text><text x=\"76\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">plans, routes</text><path d=\"M145 55 H161 M155 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"165\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--accent-soft);stroke:var(--accent)\"/><text x=\"232\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Subagents</text><text x=\"232\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">search, analyze</text><path d=\"M300 55 H316 M310 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"320\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"386\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Synthesis</text><text x=\"386\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">cited report</text><path d=\"M455 55 H471 M465 50 l6 5 -6 5\" style=\"stroke:var(--fg);stroke-width:2;fill:none\"/><rect x=\"475\" y=\"20\" width=\"133\" height=\"70\" rx=\"10\" style=\"fill:var(--sunk);stroke:var(--line)\"/><text x=\"542\" y=\"50\" text-anchor=\"middle\" style=\"fill:var(--fg);font:600 13.5px var(--sans)\">Coverage check</text><text x=\"542\" y=\"70\" text-anchor=\"middle\" style=\"fill:var(--muted);font:12px var(--sans)\">gaps → redo</text></svg><h3>Requirements</h3><ul><li>Decompose by scope, so subagents don't overlap.</li><li>Run independent subagents in parallel.</li><li>Pass structured findings with their sources.</li><li>Report partial failures with context.</li><li>Check coverage against the brief and re-delegate gaps.</li></ul><h3>Done when</h3><p>Every claim in the report traces to a source, gaps are either filled or labeled, and one failed source doesn't silently shrink the report.</p>"
  },
  {
   "kind": "widget",
   "title": "Design decisions",
   "intro": "Who should own each responsibility?",
   "widget": "sorter",
   "config": {
    "cats": [
     {
      "id": "coord",
      "label": "Coordinator"
     },
     {
      "id": "sub",
      "label": "Subagent"
     },
     {
      "id": "synth",
      "label": "Synthesis"
     }
    ],
    "items": [
     [
      "Split the question into non-overlapping subtopics.",
      "coord",
      "Decomposition is the coordinator's job."
     ],
     [
      "Retry a search that timed out once.",
      "sub",
      "Handle transient errors locally; escalate only what can't be resolved."
     ],
     [
      "Decide whether to proceed without 3 inaccessible documents.",
      "coord",
      "It sees the whole brief and the alternatives."
     ],
     [
      "Keep each claim linked to its source and date.",
      "synth",
      "Preserve provenance through the final report."
     ],
     [
      "Re-delegate when the report has nothing on a topic the user asked about.",
      "coord",
      "The iterative refinement loop."
     ]
    ]
   }
  },
  {
   "kind": "read",
   "title": "Build it: coordinator and subagents",
   "html": "<p class=\"lede\">A sketch with the Claude Agent SDK: define the subagents, give the coordinator the subagent tool, and specify what comes back.</p><pre class=\"code\"><code>from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition\n\noptions = ClaudeAgentOptions(\n    allowed_tools=[&quot;Task&quot;],          # exam framing; current SDKs call it Agent\n    agents={\n        &quot;searcher&quot;: AgentDefinition(\n            description=&quot;Finds sources on one assigned subtopic.&quot;,\n            prompt=(&quot;Return JSON records: claim, source_url, publication_date, excerpt. &quot;\n                    &quot;For any query that fails, return the query, the error type and what you tried.&quot;),\n            tools=[&quot;WebSearch&quot;, &quot;WebFetch&quot;]),\n        &quot;analyst&quot;: AgentDefinition(\n            description=&quot;Analyzes documents the coordinator assigns.&quot;,\n            prompt=&quot;Return structured findings with the document name and page for each.&quot;,\n            tools=[&quot;Read&quot;]),\n    })\n\nasync for message in query(prompt=COORDINATOR_BRIEF, options=options):\n    print(message)</code></pre><ul><li><strong><code>COORDINATOR_BRIEF</code></strong> tells it to partition subtopics, launch independent subagents in one response, check coverage against the question, and re-delegate gaps before synthesis.</li><li><strong>Subagents return structured records</strong>, so synthesis can keep each claim's source, date and exact wording.</li></ul><div class=\"callout today\"><div class=\"callout-label\">Try it for real (optional)</div><p>Option names in the Agent SDK change between versions; check the <a href=\"https://code.claude.com/docs/en/agent-sdk/subagents\" target=\"_blank\" rel=\"noopener\">subagents docs</a> before running this sketch.</p></div>"
  },
  {
   "kind": "read",
   "title": "Part 2: survive long runs and crashes",
   "html": "\n<p class=\"lede\">A research run can take hours and dozens of subagent calls. Two things from Module 7 keep it reliable: facts that never get summarized away, and a record of progress on disk.</p>\n<pre class=\"code\"><code>import json, pathlib\n\n# Case facts: sent with every coordinator turn, outside the summarized history.\nCASE_FACTS = {\"question\": QUESTION, \"deadline\": \"2026-11-15\",\n              \"subtopics\": [\"visual art\", \"music\", \"writing\", \"film\"]}\n\n# Manifest: written after each subagent finishes, read on restart.\nMANIFEST = pathlib.Path(\"out/manifest.json\")\n\ndef record(subtopic, status, output_file):\n    m = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}\n    m[subtopic] = {\"status\": status, \"output\": output_file}\n    MANIFEST.write_text(json.dumps(m, indent=2))\n\ndef remaining():\n    m = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}\n    return [s for s in CASE_FACTS[\"subtopics\"] if m.get(s, {}).get(\"status\") != \"done\"]</code></pre>\n<ul>\n<li><strong>Findings go to files, not the conversation.</strong> Each subagent writes its claim–source records to its output file. The coordinator reads summaries, which keeps its own context small.</li>\n<li><strong>Summarize a phase before the next one.</strong> Give the synthesis subagents a short summary of what was found and what's missing, not the raw transcripts.</li>\n<li><strong>Restart from the manifest.</strong> After a crash, delegate only <code>remaining()</code>. Nothing finished is redone.</li>\n<li><strong>Branch, don't overwrite.</strong> To try a second synthesis approach, fork the session (<code>ClaudeAgentOptions(resume=session_id, fork_session=True)</code>, Module 12) so the first one stays intact.</li>\n<li><strong>Annotate coverage.</strong> The report says which subtopics are well supported and which have gaps from failed sources (Module 13).</li>\n</ul>"
  },
  {
   "kind": "widget",
   "title": "Debug it",
   "intro": "Where does each problem start?",
   "widget": "sorter",
   "config": {
    "cats": [
     {
      "id": "decomp",
      "label": "Decomposition"
     },
     {
      "id": "pass",
      "label": "Context passing"
     },
     {
      "id": "err",
      "label": "Error propagation"
     },
     {
      "id": "prov",
      "label": "Provenance"
     }
    ],
    "items": [
     [
      "Every subagent did well, but the report covers only one corner of the topic.",
      "decomp",
      "The coordinator's subtopics were too narrow."
     ],
     [
      "Synthesis writes fluent text with no citations.",
      "pass",
      "Findings reached it as prose, without sources."
     ],
     [
      "Topics silently vanish when a source is unreachable.",
      "err",
      "Failures come back as empty results, not structured errors."
     ],
     [
      "The report states “30% savings” where the source said “up to 30% in pilots.”",
      "prov",
      "Qualifiers were lost; carry the exact excerpt."
     ],
     [
      "Three subagents return 70% overlapping results.",
      "decomp",
      "Each got the same broad prompt; partition the scope."
     ]
    ]
   }
  },
  {
   "kind": "recap",
   "title": "Recap",
   "points": [
    "Partition scope; launch independent subagents together.",
    "Pass goals, constraints and structured findings explicitly.",
    "Return partial results plus structured failures.",
    "Check coverage and re-delegate gaps.",
    "Preserve source, date and exact wording through synthesis."
   ]
  }
 ]
};
