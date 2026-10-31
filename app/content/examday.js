// Exam-day playbook (#exam-day): pacing, question technique and logistics, in one place.
// Facts marked "verified" come from the official certification FAQ and Partner Academy pages already
// cited in m00 (checked Oct 2026). Proctoring details vary by delivery method and change over time,
// so they're phrased as things to confirm in your Pearson VUE confirmation, not as rules.
window.EXAM_DAY = [
  { id: "facts", title: "The numbers", kind: "facts", items: [
    ["120 minutes", "of exam time. Plan for about 135 minutes of seat time, which includes check-in, instructions and a short survey (verified)."],
    ["About 60 questions", "The count is from third-party sources, not official. That's about 2 minutes per question."],
    ["4 of 6 scenarios", "Questions are grouped under scenarios drawn at random from the six in the blueprint."],
    ["Multiple choice and multiple response", "The official FAQ says the exams use both. Multiple-response questions tell you how many to pick (verified wording: “scenario-based multiple response”)."],
    ["720 of 1,000 to pass", "Scaled score from 100 to 1,000. The raw-to-scaled mapping isn't published, so no app can convert a percentage exactly (verified)."],
    ["4 attempts in 12 months", "The certification is valid for 12 months. Retake waiting periods aren't stated in the sources checked; read them in the Partner Academy before booking."]
  ] },
  { id: "pace", title: "Pacing plan", kind: "steps", items: [
    ["First pass: about 90 seconds a question", "Answer everything you can decide quickly. If you're still torn after 2 minutes, pick your best guess, flag it and move on. A guess is always better than a blank."],
    ["Checkpoint at the halfway mark", "Around question 30 you should have about 60 minutes left. If you have less, shorten your reading of the scenario text, not the question."],
    ["Second pass: the flagged questions", "Expect to have 20–30 minutes. Re-read only the question and the deciding constraint; your first reading of the scenario still holds."],
    ["Last 5 minutes", "Make sure nothing is unanswered. Change an answer only when you can name the specific reason, such as a constraint you misread."]
  ] },
  { id: "read", title: "Reading a scenario question", kind: "steps", items: [
    ["Read the question line first", "Know what's being asked (the cause? the first step? the best fix?) before reading the setup."],
    ["Find the deciding constraint", "Most options describe something that's good practice somewhere. One fact in the stem (a stakes level, a latency need, “must always”, a team versus personal need) decides which one fits here."],
    ["Name the domain", "Is this about the loop, tools, Claude Code config, prompting or reliability? It tells you which principles apply."],
    ["Match the question's verb", "“Most likely cause” wants a diagnosis; “first step” wants the cheapest effective move; “most reliable” usually wants code over prompt."]
  ] },
  { id: "elim", title: "Eliminating options", kind: "steps", items: [
    ["Strike the trap patterns", "Prompt where code is needed, an over-built first step, a bigger model or window, an unreliable proxy (sentiment, raw confidence), consolidating everything, hiding or hammering errors, fixing the wrong component, invented features, and “just try harder”. The Principles page lists each with examples."],
    ["Prefer the proportionate root-cause fix", "Between two options that would both work, the exam usually wants the smaller change that addresses the cause."],
    ["Check scope and authority", "If the agent is allowed to resolve it, resolving beats escalating; if a rule must always hold, enforcement beats instruction."],
    ["Beware the true-but-irrelevant option", "A correct statement that doesn't address this scenario's problem is still wrong."]
  ] },
  { id: "multi", title: "Multiple-response questions", kind: "steps", items: [
    ["Pick exactly the number asked", "“Select TWO” means two. Treat scoring as all-or-nothing unless told otherwise: one wrong pick costs the whole question."],
    ["Judge each option on its own", "Ask of each: is this right for this scenario? Don't pick a pair because they sound good together."],
    ["Expect one true-but-irrelevant distractor", "Often one option is good practice that doesn't address what the stem asks. Two options that fix different stated problems are a common correct pair."],
    ["Practice them", "The app's 15 multiple-response questions appear in drills and mocks, and the “Select 2” chip marks them."]
  ] },
  { id: "logistics", title: "Before and on exam day", kind: "check", items: [
    ["The week before", "Take your Readiness Check and the official practice exam (see your Study plan). Re-read the Principles page in “Rules only” mode. Stop adding new material in the last two days."],
    ["Confirm the delivery details", "Online-proctored or test center, start time and time zone, and the ID requirements are in your Pearson VUE confirmation. The name on your ID must match your registration."],
    ["If you test online", "Run the system test on the exact computer and network you'll use, well before the day. Expect a room and desk check; clear the desk and plan to have no phone, notes or second screen within reach. Confirm the specifics in your confirmation email."],
    ["If you test at a center", "Plan to arrive early for check-in. Personal items usually go in a locker. Confirm the specifics in your confirmation email."],
    ["Breaks", "Don't assume a scheduled break. Check your confirmation for whether breaks are allowed and whether the timer keeps running."],
    ["The night before and the morning of", "Sleep beats a last cram. Eat, arrive or log in early, and spend the first minute reading the instructions screen calmly."],
    ["After the exam", "Note which domains felt weakest while it's fresh, in case you need a retake."]
  ] }
];
