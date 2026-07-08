import type { Formula } from "@/lib/schema";

export const hr2Formulas: Formula[] = [
  {
    slug: "calculate-attendance-percentage",
    kind: "formula",
    title: "Calculate an Attendance Percentage",
    seoTitle: "Attendance Percentage Formula (Excel & Sheets)",
    description:
      "Divide sessions attended by sessions scheduled to get an attendance rate, with a guard so empty schedules don't throw #DIV/0!.",
    category: "hr-training",
    difficulty: "beginner",
    functions: ["IF"],
    keywords: [
      "attendance percentage",
      "attendance rate formula",
      "sessions attended over scheduled",
      "divide by zero attendance",
      "training attendance",
    ],
    problem:
      "You track sessions attended and sessions scheduled per person, and you need an attendance rate for each row — without errors for people who had nothing scheduled yet.",
    quickFormula: "=B2/C2",
    excelFormula: "=B2/C2",
    sheetsFormula: null,
    explanation:
      "Attendance rate is just attended divided by scheduled: =B2/C2 returns 0.8 when someone made 8 of 10 sessions. The result is a decimal, so format the cell as a percentage to display 80% instead of 0.8 — don't multiply by 100 and type a % sign yourself. The catch is rows where nothing was scheduled: dividing by zero returns #DIV/0!, which then pollutes any average built on the column. Guard it with =IF(C2=0,\"\",B2/C2), which shows a blank for zero-schedule rows — and because AVERAGE ignores blanks and text, your overall attendance average stays honest.",
    steps: [
      { part: "B2", meaning: "Sessions attended — the numerator." },
      { part: "C2", meaning: "Sessions scheduled — the denominator. Format the result as a percentage." },
      { part: '=IF(C2=0,"",B2/C2)', meaning: "The guarded version: shows a blank instead of #DIV/0! when nothing was scheduled." },
    ],
    whenToUse:
      "Use this for training attendance, meeting participation, shift attendance, or class registers — anywhere you compare showed-up against was-expected, person by person.",
    commonMistakes: [
      {
        mistake: "Not guarding the zero denominator.",
        fix: 'A new hire with 0 scheduled sessions produces #DIV/0!. Use =IF(C2=0,"",B2/C2) so the row stays blank until sessions exist.',
      },
      {
        mistake: "Multiplying by 100 and formatting as a percentage.",
        fix: "That shows 8000% instead of 80%. Do one or the other: keep =B2/C2 and apply percentage formatting.",
      },
      {
        mistake: "Averaging the percentage column to get a team rate.",
        fix: "That weights everyone equally regardless of schedule size. For a true team rate, divide the totals: =SUM(B2:B11)/SUM(C2:C11).",
      },
    ],
    sampleInput: {
      columns: ["Employee", "Attended", "Scheduled"],
      rows: [
        ["Ana Torres", "8", "10"],
        ["Ben Okafor", "10", "10"],
        ["Cara Lim", "6", "8"],
        ["Dana Cruz", "0", "0"],
      ],
    },
    sampleOutput: {
      columns: ["Employee", "Attendance"],
      rows: [
        ["Ana Torres", "80%"],
        ["Ben Okafor", "100%"],
        ["Cara Lim", "75%"],
        ["Dana Cruz", ""],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-completion-percentage", "fix-div0-error", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "calculate-average-score-by-group",
    kind: "formula",
    title: "Calculate an Average Score by Group",
    seoTitle: "AVERAGEIF: Average Scores by Group or Team",
    description:
      "Use AVERAGEIF to average only the scores belonging to one group — like a department's assessment results — in Excel and Google Sheets.",
    category: "hr-training",
    difficulty: "beginner",
    functions: ["AVERAGEIF", "AVERAGEIFS"],
    keywords: [
      "averageif",
      "average by group",
      "average score by department",
      "conditional average",
      "team average formula",
    ],
    problem:
      "Assessment scores for the whole company sit in one list, and you need the average for just one group — how did Sales score, compared with Finance or Ops?",
    quickFormula: '=AVERAGEIF(A:A,"Sales",C:C)',
    excelFormula: '=AVERAGEIF(A:A,"Sales",C:C)',
    sheetsFormula: null,
    explanation:
      "AVERAGEIF looks down column A for rows that say Sales and averages the matching values from column C — everyone else is ignored. The argument order is criteria range, criteria, then the range to average, and rows where the score cell is empty are left out of the math rather than counted as zero. For more than one condition — Sales scores on one specific module, say — switch to AVERAGEIFS: =AVERAGEIFS(C:C,A:A,\"Sales\",B:B,\"Safety 101\"). Watch the order flip: AVERAGEIFS puts the average range first. One caveat: if no row matches your criteria, both functions return #DIV/0!, because averaging zero values means dividing by zero.",
    steps: [
      { part: "A:A", meaning: "The group column to test — departments, teams, or managers." },
      { part: '"Sales"', meaning: "The group to match. Point this at a cell (like E2) to fill down one row per group." },
      { part: "C:C", meaning: "The scores to average. Only rows where column A says Sales are included." },
    ],
    whenToUse:
      "Use this to compare groups on any metric: assessment scores by department, satisfaction ratings by location, handle times by team. A small summary table with one AVERAGEIF per group beats eyeballing the raw list.",
    commonMistakes: [
      {
        mistake: "Getting #DIV/0! when the group has no rows.",
        fix: 'A typo like "Slaes" or a not-yet-hired-into department matches nothing, so there is nothing to average. Fix the spelling, or wrap it: =IFERROR(AVERAGEIF(A:A,"Sales",C:C),"").',
      },
      {
        mistake: "Using AVERAGEIF argument order with AVERAGEIFS.",
        fix: 'AVERAGEIF ends with the average range; AVERAGEIFS starts with it: =AVERAGEIFS(C:C,A:A,"Sales",B:B,"Safety 101"). Mixing them up averages the wrong column or errors out.',
      },
      {
        mistake: "Scores stored as text.",
        fix: "Text cells are skipped, so the average is computed from fewer rows than you think. Check that scores right-align in their cells, and convert numbers stored as text.",
      },
    ],
    sampleInput: {
      columns: ["Department", "Employee", "Score"],
      rows: [
        ["Sales", "Ana Torres", "88"],
        ["Finance", "Ben Okafor", "92"],
        ["Sales", "Cara Lim", "76"],
        ["Sales", "Dana Cruz", "90"],
        ["Ops", "Eli Ford", "81"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [["Sales average score", "84.67"]],
      highlightColumn: 1,
    },
    related: ["sum-if-multiple-conditions", "count-if-multiple-conditions", "fix-div0-error"],
    lastReviewed: "2026-07-08",
    published: true,
  },
];
