# Claims remediation status (2026-10-31)

Every non-CORRECT row in `claims-log.csv` with its outcome. **Method:** guide rows were fixed one by one (see `consistency.md`). For the app, every row still matching current text was reviewed and patched in batches 1, 4 and 10, and the rest were changed by the item rewrites. App statuses below are assigned by verdict class and were not re-verified row by row by an independent reviewer.

Statuses: **fixed** (wording corrected), **flagged** (exam framing kept and marked with a "Real world today" note, an exam-framing why, or the Exam vs. today page), **accepted** (exam guidance with no official source to contradict it; kept as written), **open**.
**Totals:** accepted: 10, fixed: 90, flagged: 89, open (S3, guide): 52. The remaining guide items are S3 wording issues in the secondary companion guide; the app, the primary study path, has none open.


| Claim | Sev | Verdict | Location | Status |
|---|---|---|---|---|
| D1-006 | S3 | WRONG | app/content/m01.js:14 m01:0 | fixed |
| D1-009 | S3 | WRONG | app/content/m01.js:19 m01:0 | fixed |
| D1-036 | S2 | WRONG | app/content/m01.js:112 q01-4 | fixed |
| D1-048 | S3 | UNVERIFIABLE | app/content/m03.js:14 m03:0 | accepted |
| D1-059 | S2 | WRONG | app/content/m03.js:46-48 m03:2 | fixed |
| D1-079 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:3 m06:c0 | flagged |
| D1-080 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:4 m06:c1 | flagged |
| D1-081 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:5 m06:c2 | flagged |
| D1-085 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:15 m06:0 | flagged |
| D1-086 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:15 m06:0 | flagged |
| D1-088 | S3 | EXAM-FRAMING | app/content/m06.js:19 m06:0 | flagged |
| D1-089 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:19 m06:0 | flagged |
| D1-091 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:21 m06:0 | flagged |
| D1-098 | S3 | EXAM-FRAMING | app/content/m06.js:37 m06:2 | flagged |
| D1-101 | S1 | WRONG | app/content/m06.js:60 q06-1 | fixed |
| D1-102 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:61 q06-1 | flagged |
| D1-104 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:70 q06-2 | flagged |
| D1-107 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:80 q06-3 | flagged |
| D1-109 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:83 q06-3 | flagged |
| D1-115 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:142 m06:recap | flagged |
| D1-116 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:143 m06:recap | flagged |
| D1-117 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m06.js:144 m06:recap | flagged |
| D1-157 | S1 | WRONG | app/content/curriculum.js:78 TRAPS.T4 | fixed |
| D1-158 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/curriculum.js:79 TRAPS.T5 | flagged |
| D1-165 | S3 | WRONG | app/widgets.js:140-160 loopStepper | fixed |
| D1-178 | S2 | EXAM-FRAMING-UNFLAGGED | app/widgets2.js:77 contextViewer | flagged |
| D1-179 | S3 | ILLUSTRATIVE-UNLABELED | app/widgets2.js:79-80 contextViewer | fixed |
| D1-180 | S2 | EXAM-FRAMING-UNFLAGGED | app/widgets2.js:93 contextViewer | flagged |
| D1-181 | S3 | ILLUSTRATIVE-UNLABELED | app/widgets2.js:94 contextViewer | fixed |
| D1-182 | S2 | EXAM-FRAMING-UNFLAGGED | app/widgets2.js:104 contextViewer | flagged |
| D1-196 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1107 §8 | fixed |
| D1-198 | S2 | WRONG | exam-preparation-guide.md:1109 §8 | fixed |
| D1-200 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1129 §8 | fixed |
| D1-202 | S1 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1133 §8 | fixed |
| D1-204 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1135 §8 | fixed |
| D1-205 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1136 §8 | fixed |
| D1-210 | S1 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1157 §8 | fixed |
| D1-211 | S2 | WRONG | exam-preparation-guide.md:1157 §8 | fixed |
| D1-214 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1165 §8 | open (S3, guide) |
| D1-218 | S3 | ILLUSTRATIVE-UNLABELED | exam-preparation-guide.md:1211 §8 | open (S3, guide) |
| D1-224 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1854 §13 | fixed |
| D1-225 | S1 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1855 §13 | fixed |
| D1-232 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1879 §13 | fixed |
| D1-234 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1887 §13 | fixed |
| D1-235 | S1 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1887 §13 | fixed |
| D2-003 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:5 m02:c2 | flagged |
| D2-004 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:6 m02:c3 | flagged |
| D2-006 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:8 m02:c5 | flagged |
| D2-007 | S3 | WRONG | app/content/m02.js:15 m02:0 | fixed |
| D2-011 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:35 m02:0 | flagged |
| D2-013 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:43 m02:1 | flagged |
| D2-017 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:54-55 m02:1 | flagged |
| D2-019 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:50-57 m02:1 | flagged |
| D2-020 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:69 m02:3 | flagged |
| D2-024 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:77 m02:3 | flagged |
| D2-027 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:88-96 m02:4 (sorter) | flagged |
| D2-029 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:110 q02-1 | flagged |
| D2-033 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:136-141 q02-4 | flagged |
| D2-036 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:146-151 q02-5 | flagged |
| D2-039 | S3 | UNVERIFIABLE | app/content/m02.js:166 q02-7 | accepted |
| D2-040 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:169 q02-7 | flagged |
| D2-042 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:183 m02:6 recap | flagged |
| D2-043 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m02.js:184 m02:6 recap | flagged |
| D2-044 | S2 | EXAM-FRAMING-UNFLAGGED | app/widgets2.js:32-68 WIDGETS.toolChoice | flagged |
| D2-045 | S3 | WRONG | app/widgets2.js:42,47,40 WIDGETS.toolCho | fixed |
| D2-047 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m00.js:49 q00-1 | flagged |
| D2-049 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m04.js:4 m04:c1 | flagged |
| D2-053 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m04.js:17-24 m04:0 | flagged |
| D2-057 | S3 | WRONG | app/content/m04.js:48 m04:1 (sorter) | fixed |
| D2-060 | S3 | UNVERIFIABLE | app/content/m04.js:92 q04-2 | accepted |
| D2-071 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m05.js:4 m05:c1; 61-65 m05:2 | flagged |
| D2-074 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m05.js:7 m05:c4 | flagged |
| D2-080 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m05.js:24 m05:0 | flagged |
| D2-086 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m05.js:40 m05:1 | flagged |
| D2-093 | S3 | WRONG | app/content/m05.js:106 q05-2 | fixed |
| D2-096 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m05.js:122-127 q05-4 | flagged |
| D2-098 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m05.js:142-147 q05-6 | flagged |
| D2-100 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/bank.js:67-74 b4-1 | flagged |
| D2-101 | S3 | WRONG | app/content/bank.js:71 b4-1 | fixed |
| D2-104 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/bank.js:107-114 b4-5 | flagged |
| D2-107 | S3 | WRONG | app/content/bank.js:133 b4-7 | fixed |
| D2-113 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:156-161 §2 | fixed |
| D2-116 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:188-190 §2 | fixed |
| D2-122 | S3 | UNVERIFIABLE | exam-preparation-guide.md:256 §2 | open (S3, guide) |
| D2-125 | S3 | UNVERIFIABLE | exam-preparation-guide.md:270-285 §2 | open (S3, guide) |
| D2-126 | S3 | UNVERIFIABLE | exam-preparation-guide.md:289-297 §2 | open (S3, guide) |
| D2-127 | S3 | UNVERIFIABLE | exam-preparation-guide.md:303 §2 | open (S3, guide) |
| D2-133 | S1 | OUTDATED | exam-preparation-guide.md:366 §3 | fixed |
| D2-135 | S1 | OUTDATED | exam-preparation-guide.md:369-371 §3 | fixed |
| D2-138 | S3 | ILLUSTRATIVE-UNLABELED | exam-preparation-guide.md:385 §3 | open (S3, guide) |
| D2-141 | S3 | UNVERIFIABLE | exam-preparation-guide.md:403 §3 | open (S3, guide) |
| D2-145 | S3 | WRONG | exam-preparation-guide.md:927 §7 | open (S3, guide) |
| D2-146 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:931 §7 | fixed |
| D2-152 | S3 | WRONG | exam-preparation-guide.md:964 §7 | open (S3, guide) |
| D2-154 | S1 | OUTDATED | exam-preparation-guide.md:972 §7 | fixed |
| D2-156 | S1 | OUTDATED | exam-preparation-guide.md:975 §7 | fixed |
| D2-164 | S3 | OUTDATED | exam-preparation-guide.md:1002-1012 §7 | open (S3, guide) |
| D2-165 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1016 §7 | fixed |
| D2-168 | S3 | OUTDATED | exam-preparation-guide.md:1021 §7 | open (S3, guide) |
| D2-171 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1760 §13 | fixed |
| D2-174 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1769 §13 | fixed |
| D2-178 | S1 | OUTDATED | exam-preparation-guide.md:1785 §13 | fixed |
| D2-180 | S1 | OUTDATED | exam-preparation-guide.md:1839 §13 | fixed |
| D2-182 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1843 §13 | fixed |
| D2-183 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1862-1863 §13 | fixed |
| D2-185 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1865 §13 | fixed |
| D3-002 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:4 m11:c1 | flagged |
| D3-004 | S3 | EXAM-FRAMING | app/content/m11.js:6 m11:c3 | flagged |
| D3-006 | S3 | EXAM-FRAMING | app/content/m11.js:7 m11:c4 | flagged |
| D3-007 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:7 m11:c4 | flagged |
| D3-010 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:10 m11:c7 | flagged |
| D3-016 | S3 | EXAM-FRAMING | app/content/m11.js:26 m11:0 | flagged |
| D3-018 | S3 | OUTDATED | app/content/m11.js:18-28 m11:0 | fixed |
| D3-021 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:32 m11:0 | flagged |
| D3-028 | S3 | EXAM-FRAMING | app/content/m11.js:57 m11:1 | flagged |
| D3-029 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:58 m11:1 | flagged |
| D3-030 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:59 m11:1 | flagged |
| D3-036 | S1 | EXAM-FRAMING | app/content/m11.js:74 m11:2 | flagged |
| D3-042 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:93 m11:3 | flagged |
| D3-045 | S3 | UNVERIFIABLE | app/content/m11.js:96 m11:3 | accepted |
| D3-052 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:146 q11-3 | flagged |
| D3-054 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:156 q11-4 | flagged |
| D3-057 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:173 q11-6 | flagged |
| D3-065 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m11.js:216 m11:recap | flagged |
| D3-066 | S3 | EXAM-FRAMING | app/content/m11.js:218 m11:recap | flagged |
| D3-077 | S3 | WRONG | app/content/m12.js:25 m12:0 | fixed |
| D3-102 | S3 | UNVERIFIABLE | app/widgets2.js:187 ciBuilder | accepted |
| D3-106 | S2 | UNVERIFIABLE | app/content/m00.js:3 m00:c0 | accepted |
| D3-108 | S2 | UNVERIFIABLE | app/content/m00.js:13 m00:0 | accepted |
| D3-110 | S3 | WRONG | app/content/m00.js:16 m00:0 | fixed |
| D3-111 | S3 | UNVERIFIABLE | app/content/m00.js:18 m00:0 | accepted |
| D3-116 | S2 | UNVERIFIABLE | app/content/m00.js:79-80 m00:recap | accepted |
| D3-120 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/bank.js:8 b2-1 | flagged |
| D3-125 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/bank.js:28 b2-3 | flagged |
| D3-127 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/bank.js:30 b2-3 | flagged |
| D3-131 | S3 | UNVERIFIABLE | app/content/bank.js:48 b2-5 | accepted |
| D3-144 | S2 | OUTDATED | exam-preparation-guide.md:29-37 | fixed |
| D3-146 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1328-1336 | fixed |
| D3-163 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1428 | fixed |
| D3-170 | S3 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1478 | open (S3, guide) |
| D3-171 | S3 | EXAM-FRAMING | exam-preparation-guide.md:1484-1485 | open (S3, guide) |
| D3-176 | S3 | EXAM-FRAMING | exam-preparation-guide.md:1507 | open (S3, guide) |
| D3-177 | S1 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1508 | fixed |
| D3-179 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1512 | fixed |
| D3-188 | S2 | WRONG | exam-preparation-guide.md:1547 | fixed |
| D3-190 | S2 | WRONG | exam-preparation-guide.md:1549 | fixed |
| D3-191 | S3 | WRONG | exam-preparation-guide.md:1550 | open (S3, guide) |
| D3-195 | S2 | WRONG | exam-preparation-guide.md:1582 | fixed |
| D3-196 | S3 | OUTDATED | exam-preparation-guide.md:1583 | open (S3, guide) |
| D3-197 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1593 | open (S3, guide) |
| D3-201 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1620 | open (S3, guide) |
| D3-204 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1640 | open (S3, guide) |
| D3-205 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1642 | open (S3, guide) |
| D3-206 | S3 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1644 | open (S3, guide) |
| D3-207 | S3 | ILLUSTRATIVE-UNLABELED | exam-preparation-guide.md:1660 | open (S3, guide) |
| D3-211 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1876 | fixed |
| D3-216 | S3 | EXAM-FRAMING | exam-preparation-guide.md:1882 | open (S3, guide) |
| D3-217 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1883 | fixed |
| D3-221 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1887 | fixed |
| D4-003 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m08.js:5 m08:c2 | flagged |
| D4-013 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m08.js:51 m08:2 | flagged |
| D4-017 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m08.js:59 m08:2 | flagged |
| D4-023 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m08.js:102 q08-4 | flagged |
| D4-024 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m08.js:103 q08-4 | flagged |
| D4-025 | S3 | WRONG | app/content/m08.js:105 q08-4 | fixed |
| D4-028 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m08.js:123 q08-6 | flagged |
| D4-030 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m08.js:144-149 m08:4 recap | flagged |
| D4-031 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m09.js:3 m09:c0 | flagged |
| D4-038 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/m09.js:17 m09:0 | flagged |
| D4-039 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m09.js:17 m09:0 | flagged |
| D4-049 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m09.js:69 q09-1 | flagged |
| D4-057 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m09.js:141 m09:4 recap | flagged |
| D4-061 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m10.js:5 m10:c2 | flagged |
| D4-068 | S1 | EXAM-FRAMING-UNFLAGGED | app/content/m10.js:23 m10:0 | flagged |
| D4-072 | S3 | EXAM-FRAMING-UNFLAGGED | app/content/m10.js:29 m10:0 | flagged |
| D4-077 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m10.js:49 m10:2 sorter | flagged |
| D4-081 | S3 | WRONG | app/content/m10.js:81 q10-3 | fixed |
| D4-084 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m10.js:93 q10-4 | flagged |
| D4-085 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m10.js:94 q10-4 | flagged |
| D4-089 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m10.js:125-130 m10:4 recap | flagged |
| D4-091 | S3 | EXAM-FRAMING-UNFLAGGED | app/widgets2.js:165-169 slaCalc | flagged |
| D4-101 | S3 | OUTDATED | app/content/bank.js:214 b5-7 | fixed |
| D4-110 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:58-67 §1 | fixed |
| D4-111 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:71-76 §1 | fixed |
| D4-112 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:78 §1 | fixed |
| D4-113 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:80 §1 | fixed |
| D4-114 | S3 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:84-88 §1 | open (S3, guide) |
| D4-117 | S3 | UNVERIFIABLE | exam-preparation-guide.md:90 §1 | open (S3, guide) |
| D4-119 | S2 | OUTDATED | exam-preparation-guide.md:96 §1 | fixed |
| D4-120 | S3 | UNVERIFIABLE | exam-preparation-guide.md:103 §1 | open (S3, guide) |
| D4-121 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:114 §1 | fixed |
| D4-122 | S3 | WRONG | exam-preparation-guide.md:135 §1 | open (S3, guide) |
| D4-128 | S2 | WRONG | exam-preparation-guide.md:460 §4 | fixed |
| D4-130 | S3 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:464 §4 | open (S3, guide) |
| D4-134 | S3 | OUTDATED | exam-preparation-guide.md:503 §4 | open (S3, guide) |
| D4-136 | S3 | WRONG | exam-preparation-guide.md:533-540 §4 | open (S3, guide) |
| D4-145 | S1 | WRONG | exam-preparation-guide.md:607 §4 | fixed |
| D4-151 | S3 | UNVERIFIABLE | exam-preparation-guide.md:814 §6 | open (S3, guide) |
| D4-155 | S3 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:845 §6 | open (S3, guide) |
| D4-158 | S3 | UNVERIFIABLE | exam-preparation-guide.md:862 §6 | open (S3, guide) |
| D4-159 | S3 | UNVERIFIABLE | exam-preparation-guide.md:887-891 §6 | open (S3, guide) |
| D4-160 | S2 | OUTDATED | exam-preparation-guide.md:895-900 §6 | fixed |
| D4-161 | S2 | OUTDATED | exam-preparation-guide.md:902 §6 | fixed |
| D4-175 | S3 | WRONG | exam-preparation-guide.md:1718 §12 | open (S3, guide) |
| D4-177 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1724 §12 | fixed |
| D4-179 | S3 | WRONG | exam-preparation-guide.md:1733 §12 | open (S3, guide) |
| D4-184 | S2 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1760 §13 | fixed |
| D4-185 | S2 | OUTDATED | exam-preparation-guide.md:1761 §13 | fixed |
| D4-190 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1825-1826 §13 | open (S3, guide) |
| D5-005 | S2 | EXAM-FRAMING-UNFLAGGED | app/content/m07.js:7 m07:c4 | flagged |
| D5-009 | S3 | ILLUSTRATIVE-UNLABELED | app/content/m07.js:19 m07:0 | fixed |
| D5-024 | S3 | WRONG | app/content/m07.js:58 q07-1 (opt A, T3) | fixed |
| D5-029 | S3 | WRONG | app/content/m07.js:90 q07-4 (opt C) | fixed |
| D5-037 | S2 | WRONG | app/content/m13.js:6 m13:c3 | fixed |
| D5-041 | S2 | WRONG | app/content/m13.js:16 m13:0 | fixed |
| D5-047 | S2 | WRONG | app/content/m13.js:27 m13:0 | fixed |
| D5-051 | S3 | WRONG | app/content/m13.js:43 (sorter) | fixed |
| D5-053 | S3 | WRONG | app/content/m13.js:55 m13:2 | fixed |
| D5-056 | S3 | WRONG | app/content/m13.js:59 m13:2 (callout) | fixed |
| D5-057 | S3 | ILLUSTRATIVE-UNLABELED | app/widgets2.js:207-233 (segmentReveal) | fixed |
| D5-063 | S3 | WRONG | app/content/m13.js:90 q13-1 (opt C why) | fixed |
| D5-080 | S3 | WRONG | app/content/m04.js:58-65 m04:2 | fixed |
| D5-087 | S3 | WRONG | app/content/m04.js:135 q04-6 (opt D why) | fixed |
| D5-094 | S1 | WRONG | app/content/curriculum.js:78 T4 (tell) | fixed |
| D5-095 | S2 | WRONG | app/content/curriculum.js:78 T4 (why) | fixed |
| D5-096 | S2 | WRONG | app/content/m00.js:57 q00-2 (opt, T4) [c | fixed |
| D5-106 | S3 | UNVERIFIABLE | exam-preparation-guide.md:643 §5 | open (S3, guide) |
| D5-110 | S3 | UNVERIFIABLE | exam-preparation-guide.md:696-701 §5 | open (S3, guide) |
| D5-111 | S3 | UNVERIFIABLE | exam-preparation-guide.md:703 §5 | open (S3, guide) |
| D5-116 | S3 | UNVERIFIABLE | exam-preparation-guide.md:731 §5 | open (S3, guide) |
| D5-120 | S3 | OUTDATED | exam-preparation-guide.md:759 §5 | open (S3, guide) |
| D5-122 | S3 | UNVERIFIABLE | exam-preparation-guide.md:771 §5 | open (S3, guide) |
| D5-127 | S3 | EXAM-FRAMING-UNFLAGGED | exam-preparation-guide.md:1519 §10 | open (S3, guide) |
| D5-135 | S3 | WRONG | exam-preparation-guide.md:1237 §9 | open (S3, guide) |
| D5-136 | S2 | WRONG | exam-preparation-guide.md:1238 §9 | fixed |
| D5-143 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1288-1292 §9 | open (S3, guide) |
| D5-146 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1307 §9 | open (S3, guide) |
| D5-150 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1808 §13 | open (S3, guide) |
| D5-152 | S3 | WRONG | exam-preparation-guide.md:1813 §13 | open (S3, guide) |
| D5-154 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1825 §13 | open (S3, guide) |
| D5-155 | S3 | UNVERIFIABLE | exam-preparation-guide.md:1826 §13 | open (S3, guide) |
