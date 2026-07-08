import type { Formula } from "@/lib/schema";

export const logicFormulas: Formula[] = [
  {
    slug: "create-pass-fail-status",
    kind: "formula",
    title: "Create a Pass/Fail Status Column",
    seoTitle: "Pass/Fail Formula for Excel & Google Sheets",
    description:
      "Turn a score column into clear Pass or Fail labels with a single IF — the simplest and most-used conditional formula there is.",
    category: "conditional-logic",
    difficulty: "beginner",
    functions: ["IF"],
    keywords: ["pass fail formula", "if statement", "score threshold", "grade formula", "conditional text"],
    problem:
      "You have a column of test scores or metrics and need a column beside it that plainly says Pass or Fail based on a cutoff, instead of making readers do the math in their heads.",
    quickFormula: '=IF(B2>=70,"Pass","Fail")',
    excelFormula: '=IF(B2>=70,"Pass","Fail")',
    sheetsFormula: null,
    explanation:
      "IF checks one condition and returns one of two results. Here it asks whether the score in B2 is at least 70: if yes, the cell shows Pass; otherwise it shows Fail. The >= means the cutoff itself passes — a score of exactly 70 is a Pass. Swap the 70 for any threshold, or point it at a cell like $E$1 that holds the cutoff so you can change it in one place. It works identically in Excel and Google Sheets, and it's the foundation nearly every status column is built on.",
    steps: [
      { part: "B2>=70", meaning: "The test: is the score 70 or higher? >= means \"greater than or equal to\"." },
      { part: '"Pass"', meaning: "What to show when the test is true." },
      { part: '"Fail"', meaning: "What to show when the test is false." },
    ],
    whenToUse:
      "Use this for training scores, quality checks, sales quotas, attendance thresholds — any place a number needs to become a plain yes/no verdict people can scan, filter, and count.",
    commonMistakes: [
      {
        mistake: "Scores exactly at the cutoff fail.",
        fix: "Using > instead of >= makes 70 a Fail. Write B2>=70 if the threshold itself should pass.",
      },
      {
        mistake: "Blank cells show Fail.",
        fix: 'An empty B2 isn\'t >= 70, so it fails. Guard it: =IF(B2="","",IF(B2>=70,"Pass","Fail")) leaves blanks blank.',
      },
      {
        mistake: "The threshold is buried in dozens of copies of the formula.",
        fix: "Hard-coding 70 means editing every cell when the cutoff changes. Put it in one cell and reference it: =IF(B2>=$E$1,\"Pass\",\"Fail\").",
      },
    ],
    sampleInput: {
      columns: ["Name", "Score"],
      rows: [
        ["Ana Torres", "88"],
        ["Ben Okafor", "64"],
        ["Cara Lim", "70"],
      ],
    },
    sampleOutput: {
      columns: ["Name", "Status"],
      rows: [
        ["Ana Torres", "Pass"],
        ["Ben Okafor", "Fail"],
        ["Cara Lim", "Pass"],
      ],
      highlightColumn: 1,
    },
    related: ["create-status-multiple-conditions", "flag-overdue-tasks", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Name", "Score", "Status"],
          ["Ana Torres", 88, '=IF(B2>=70,"Pass","Fail")'],
          ["Ben Okafor", 64, '=IF(B3>=70,"Pass","Fail")'],
          // Boundary case: exactly at the cutoff passes because of >=.
          ["Cara Lim", 70, '=IF(B4>=70,"Pass","Fail")'],
        ],
      },
      expect: [
        { cell: "C2", value: "Pass" },
        { cell: "C3", value: "Fail" },
        { cell: "C4", value: "Pass" },
      ],
    },
  },
  {
    slug: "create-status-multiple-conditions",
    kind: "formula",
    title: "Create a Status with Multiple Conditions",
    seoTitle: "Multi-Condition Status with IFS (Excel & Sheets)",
    description:
      "Grade scores into Excellent, Pass, or Fail with IFS — cleaner than nested IFs, with a TRUE catch-all so nothing slips through.",
    category: "conditional-logic",
    difficulty: "intermediate",
    functions: ["IFS", "IF"],
    keywords: ["ifs formula", "multiple conditions", "nested if", "tiered status", "grading formula"],
    problem:
      "Two labels aren't enough — you need scores sorted into three or more tiers, like Excellent, Pass, and Fail, without building a tangle of nested IF statements.",
    quickFormula: '=IFS(B2>=90,"Excellent",B2>=70,"Pass",TRUE,"Fail")',
    excelFormula: '=IFS(B2>=90,"Excellent",B2>=70,"Pass",TRUE,"Fail")',
    sheetsFormula: null,
    explanation:
      "IFS takes pairs of condition-and-result and returns the result of the FIRST condition that's true, checking left to right. A score of 95 hits B2>=90 and stops at Excellent; an 80 fails that test but passes B2>=70, so it's a Pass. The final pair, TRUE,\"Fail\", is the catch-all: TRUE is always true, so anything that survived the earlier tests lands there. Without it, a 50 would return #N/A, because IFS errors when no condition matches. Order matters — conditions must run from strictest to loosest. IFS works in Google Sheets and in Excel 2019 or newer.",
    steps: [
      { part: 'B2>=90,"Excellent"', meaning: "First test. 90 and up returns Excellent and stops checking." },
      { part: 'B2>=70,"Pass"', meaning: "Only reached when the score is below 90. 70–89 returns Pass." },
      { part: 'TRUE,"Fail"', meaning: "The catch-all. TRUE always matches, so everything below 70 returns Fail instead of #N/A." },
    ],
    whenToUse:
      "Use this for grading scales, tiered commission bands, risk ratings, and service-level buckets — anywhere a number maps to three or more labels and readability matters.",
    commonMistakes: [
      {
        mistake: "Some cells return #N/A.",
        fix: "IFS errors when no condition matches. Always end with TRUE and a default result: …,TRUE,\"Fail\").",
      },
      {
        mistake: "Everything above 70 shows Pass, never Excellent.",
        fix: 'Conditions run in order, so putting B2>=70 first swallows the 90s too. List the strictest condition first: =IFS(B2>=90,"Excellent",B2>=70,"Pass",TRUE,"Fail").',
      },
      {
        mistake: "IFS returns #NAME? in older Excel.",
        fix: 'IFS needs Excel 2019 or newer. In Excel 2016 and earlier, nest IFs instead: =IF(B2>=90,"Excellent",IF(B2>=70,"Pass","Fail")).',
      },
    ],
    sampleInput: {
      columns: ["Name", "Score"],
      rows: [
        ["Ana Torres", "94"],
        ["Ben Okafor", "58"],
        ["Cara Lim", "76"],
      ],
    },
    sampleOutput: {
      columns: ["Name", "Rating"],
      rows: [
        ["Ana Torres", "Excellent"],
        ["Ben Okafor", "Fail"],
        ["Cara Lim", "Pass"],
      ],
      highlightColumn: 1,
    },
    related: ["create-pass-fail-status", "flag-overdue-tasks", "fix-na-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Name", "Score", "Rating"],
          ["Ana Torres", 94, '=IFS(B2>=90,"Excellent",B2>=70,"Pass",TRUE,"Fail")'],
          // Catch-all case: below both thresholds lands on TRUE,"Fail".
          ["Ben Okafor", 58, '=IFS(B3>=90,"Excellent",B3>=70,"Pass",TRUE,"Fail")'],
          ["Cara Lim", 76, '=IFS(B4>=90,"Excellent",B4>=70,"Pass",TRUE,"Fail")'],
          // Boundary case: exactly 90 hits the first condition.
          ["Dana Cruz", 90, '=IFS(B5>=90,"Excellent",B5>=70,"Pass",TRUE,"Fail")'],
        ],
      },
      expect: [
        { cell: "C2", value: "Excellent" },
        { cell: "C3", value: "Fail" },
        { cell: "C4", value: "Pass" },
        { cell: "C5", value: "Excellent" },
      ],
    },
  },
  {
    slug: "find-highest-value-by-category",
    kind: "formula",
    title: "Find the Highest Value in a Category",
    seoTitle: "MAXIFS: Highest Value by Category (Excel & Sheets)",
    description:
      "MAXIFS returns the largest number that matches a condition — like the biggest deal in the Sales department — in one formula.",
    category: "counting-summarizing",
    difficulty: "intermediate",
    functions: ["MAXIFS"],
    keywords: ["maxifs", "max with condition", "highest value by group", "max if", "largest per category"],
    problem:
      "You have amounts in one column and categories in another, and you need the highest amount for one specific category — the top Sales deal, the latest date per person, the max score per team.",
    quickFormula: '=MAXIFS(C:C,A:A,"Sales")',
    excelFormula: '=MAXIFS(C:C,A:A,"Sales")',
    sheetsFormula: null,
    explanation:
      "MAXIFS scans the amounts in column C but only considers rows where column A says Sales, then returns the largest of those. The range to maximize comes first, followed by pairs of criteria range and criteria — and you can add more pairs to narrow further, like MAXIFS(C:C,A:A,\"Sales\",B:B,\"Ana Torres\") for one person's best deal. Point the criteria at a cell instead of typing it — =MAXIFS(C:C,A:A,E2) — and the formula becomes a reusable lookup. It works in Google Sheets and Excel 2019 or newer; when nothing matches, it returns 0 rather than an error.",
    steps: [
      { part: "C:C", meaning: "The numbers to find the maximum of — the Amount column." },
      { part: "A:A", meaning: "The column to test — the Department column." },
      { part: '"Sales"', meaning: "The category that rows must match. A cell reference like E2 works too." },
    ],
    whenToUse:
      "Use this for the biggest deal per department, the top score per team, or the most recent date per employee (dates are numbers, so MAXIFS finds the latest one). Pair it with a list of categories to build a one-line leaderboard.",
    commonMistakes: [
      {
        mistake: "MAXIFS returns #NAME? in older Excel.",
        fix: "MAXIFS needs Excel 2019 or newer. In Excel 2016 and earlier, use the array formula =MAX(IF(A:A=\"Sales\",C:C)) entered with Ctrl+Shift+Enter.",
      },
      {
        mistake: "It returns 0 and you assume something's broken.",
        fix: "0 means no rows matched — often a spelling or trailing-space mismatch between your criteria and the category column. TRIM the category column and check the exact wording.",
      },
      {
        mistake: "The ranges are different sizes.",
        fix: "MAXIFS errors if the max range and criteria range don't cover the same rows. Use whole columns (C:C and A:A) or identical row spans (C2:C100 and A2:A100).",
      },
    ],
    sampleInput: {
      columns: ["Dept", "Rep", "Amount"],
      rows: [
        ["Sales", "Ana Torres", "8200"],
        ["Finance", "Ben Okafor", "9100"],
        ["Sales", "Cara Lim", "6400"],
        ["Sales", "Dana Cruz", "7500"],
      ],
    },
    sampleOutput: {
      columns: ["Category", "Highest Amount"],
      rows: [["Sales", "8200"]],
      highlightColumn: 1,
    },
    related: ["find-lowest-value-by-category", "sum-if-multiple-conditions", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        // Formulas live in column E so the whole-column C:C / A:A references
        // don't include the formula cells themselves (that would be #CYCLE!).
        Sheet1: [
          ["Dept", "Rep", "Amount", null, '=MAXIFS(C:C,A:A,"Sales")'],
          ["Sales", "Ana Torres", 8200, null, '=MAXIFS(C:C,A:A,"Finance")'],
          // No matching rows returns 0, not an error — as the page explains.
          ["Finance", "Ben Okafor", 9100, null, '=MAXIFS(C:C,A:A,"Ops")'],
          ["Sales", "Cara Lim", 6400, null, null],
          ["Sales", "Dana Cruz", 7500, null, null],
        ],
      },
      expect: [
        { cell: "E1", value: 8200 },
        { cell: "E2", value: 9100 },
        { cell: "E3", value: 0 },
      ],
    },
  },
  {
    slug: "find-lowest-value-by-category",
    kind: "formula",
    title: "Find the Lowest Value in a Category",
    seoTitle: "MINIFS: Lowest Value by Category (Excel & Sheets)",
    description:
      "MINIFS returns the smallest number that matches a condition — the cheapest quote, the earliest date, the lowest score per group.",
    category: "counting-summarizing",
    difficulty: "intermediate",
    functions: ["MINIFS"],
    keywords: ["minifs", "min with condition", "lowest value by group", "min if", "smallest per category"],
    problem:
      "You have amounts in one column and categories in another, and you need the lowest amount for one specific category — the smallest Sales deal, the cheapest supplier quote, the earliest deadline per project.",
    quickFormula: '=MINIFS(C:C,A:A,"Sales")',
    excelFormula: '=MINIFS(C:C,A:A,"Sales")',
    sheetsFormula: null,
    explanation:
      "MINIFS is the mirror image of MAXIFS: it scans the amounts in column C, keeps only the rows where column A says Sales, and returns the smallest of those. The range to minimize comes first, then pairs of criteria range and criteria — add more pairs to narrow further, like MINIFS(C:C,A:A,\"Sales\",C:C,\">0\") to ignore zero rows. Because dates are numbers, MINIFS also finds the EARLIEST date per category, which makes it handy for \"next deadline per project\" columns. It works in Google Sheets and Excel 2019 or newer, and returns 0 when nothing matches.",
    steps: [
      { part: "C:C", meaning: "The numbers to find the minimum of — the Amount column." },
      { part: "A:A", meaning: "The column to test — the Department column." },
      { part: '"Sales"', meaning: "The category that rows must match. A cell reference like E2 works too." },
    ],
    whenToUse:
      "Use this to find the cheapest quote per supplier, the lowest score per team, or the earliest due date per project. Combined with MAXIFS you can show each category's full range in two columns.",
    commonMistakes: [
      {
        mistake: "Zeros or blanks drag the minimum down to 0.",
        fix: 'Unfilled amount cells count as 0. Exclude them with a second condition: =MINIFS(C:C,A:A,"Sales",C:C,">0").',
      },
      {
        mistake: "MINIFS returns #NAME? in older Excel.",
        fix: "MINIFS needs Excel 2019 or newer. In Excel 2016 and earlier, use the array formula =MIN(IF(A:A=\"Sales\",C:C)) entered with Ctrl+Shift+Enter.",
      },
      {
        mistake: "It returns 0 because the criteria never matches.",
        fix: "A spelling difference or trailing space in the category column means no rows qualify. TRIM the column and match the exact wording — or reference a cell that holds the category.",
      },
    ],
    sampleInput: {
      columns: ["Dept", "Rep", "Amount"],
      rows: [
        ["Sales", "Ana Torres", "8200"],
        ["Finance", "Ben Okafor", "9100"],
        ["Sales", "Cara Lim", "6400"],
        ["Sales", "Dana Cruz", "7500"],
      ],
    },
    sampleOutput: {
      columns: ["Category", "Lowest Amount"],
      rows: [["Sales", "6400"]],
      highlightColumn: 1,
    },
    related: ["find-highest-value-by-category", "sum-if-multiple-conditions", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        // Formulas live in column E so the whole-column C:C / A:A references
        // don't include the formula cells themselves (that would be #CYCLE!).
        Sheet1: [
          ["Dept", "Rep", "Amount", null, '=MINIFS(C:C,A:A,"Sales")'],
          ["Sales", "Ana Torres", 8200, null, '=MINIFS(C:C,A:A,"Sales",C:C,">0")'],
          ["Finance", "Ben Okafor", 9100, null, '=MINIFS(C:C,A:A,"Finance")'],
          ["Sales", "Cara Lim", 6400, null, null],
          ["Sales", "Dana Cruz", 7500, null, null],
          // The zero row drags the plain MINIFS down to 0 — the pitfall
          // from commonMistakes; the ">0" second condition excludes it.
          ["Sales", "Evan Reed", 0, null, null],
        ],
      },
      expect: [
        { cell: "E1", value: 0 },
        { cell: "E2", value: 6400 },
        { cell: "E3", value: 9100 },
      ],
    },
  },
];
