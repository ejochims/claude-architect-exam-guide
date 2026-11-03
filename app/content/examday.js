// Exam-day playbook (#exam-day): pacing, question technique and logistics, in one place.
// Facts marked "official" come from the Exam Guide v1.0 (July 2026), downloaded from the Partner Academy;
// "verified" ones from the certification FAQ cited in m00 (checked Oct 2026). Proctoring details vary by delivery method and change over time,
// so they're phrased as things to confirm in your Pearson VUE confirmation, not as rules.
window.EXAM_DAY = [
  { id: "facts", title: "The numbers", kind: "facts", items: [
    ["120 minutes", "of exam time. Plan for about 135 minutes of seat time, which includes check-in, instructions and a short survey (verified)."],
    ["60 questions", "Stated in the Exam Guide (official). That's 2 minutes per question."],
    ["4 of 6 scenarios", "Questions are grouped under scenarios drawn at random from the six in the blueprint."],
    ["Multiple choice and multiple response", "Both appear, and each item states how many responses to select (official)."],
    ["720 of 1,000 to pass", "Scaled 100–1,000 against a fixed standard set by subject-matter experts, not curved against other candidates. The report shows pass/fail, your scaled score and percent-correct per domain; the domain figures don't decide the result. The raw-to-scaled mapping isn't published, so no app can convert a percentage exactly (official)."],
    ["4 attempts in 12 months", "Rolling 12 months, fee per attempt. After a fail you wait 14 days, then 30, then 90 (official). The credential is valid 12 months; renewing on time is a free, non-proctored assessment, but a lapse means retaking the full exam."]
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
    ["Confirm the delivery details", "Online-proctored or test center, start time and time zone are in your Pearson VUE confirmation. Bring a valid, unexpired, government-issued photo ID whose name matches your registration exactly; to fix a name, email certifications-support@anthropic.com before scheduling (official)."],
    ["If you test online", "Run the system test on the exact computer and network you'll use, well before the day. Expect a room and desk check; clear the desk and plan to have no phone, notes or second screen within reach. Confirm the specifics in your confirmation email."],
    ["If you test at a center", "Plan to arrive early for check-in. Personal items usually go in a locker. Confirm the specifics in your confirmation email."],
    ["Rescheduling", "You can cancel or reschedule up to 24 hours before the appointment. Inside 24 hours, or a no-show, forfeits the fee (official)."],
    ["What you may have", "No phone, smart watch, headphones, notes or recording device. Scratch paper only if Pearson VUE provides it. Online, you stay in webcam view the whole time (official)."],
    ["The NDA", "You accept a confidentiality agreement before the first question; declining ends the session with no refund (official)."],
    ["Breaks", "Don't assume a scheduled break. Check your confirmation for whether breaks are allowed and whether the timer keeps running."],
    ["The night before and the morning of", "Sleep beats a last cram. Eat, arrive or log in early, and spend the first minute reading the instructions screen calmly."],
    ["After the exam", "Note which domains felt weakest while it's fresh. Your score report's per-domain percentages tell you where to focus if you need the retake, which is possible 14 days later."]
  ] }
];
