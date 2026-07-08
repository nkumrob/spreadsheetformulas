import type { Formula } from "@/lib/schema";

export const dates2Formulas: Formula[] = [
  {
    slug: "calculate-days-remaining",
    kind: "formula",
    title: "Calculate Days Remaining Until a Due Date",
    seoTitle: "Days Until Due Formula for Excel & Google Sheets",
    description:
      "Subtract today from the due date to count down the days left — clamped to zero so past-due items don't show negative numbers.",
    category: "dates-deadlines",
    difficulty: "beginner",
    functions: ["TODAY", "MAX"],
    keywords: ["days remaining", "days until due", "countdown", "days left", "deadline countdown"],
    problem:
      "You have a due-date column and want a countdown next to each item — how many days are left before it's due, with anything already past due showing zero.",
    quickFormula: "=MAX(0,B2-TODAY())",
    excelFormula: "=MAX(0,B2-TODAY())",
    sheetsFormula: null,
    explanation:
      "Dates in spreadsheets are numbers, so B2-TODAY() gives the number of days between the due date and today. When the due date is still ahead, that's a positive count of days remaining. Once the date passes, the subtraction goes negative — so MAX(0, …) clamps it and overdue items simply show 0. The countdown refreshes automatically every day the file is opened, because TODAY() always returns the current date. Note the order: it's the mirror image of a days-overdue formula, which subtracts the other way.",
    steps: [
      { part: "B2", meaning: "The due date." },
      { part: "-TODAY()", meaning: "Subtracts today. Positive = days still left, negative = already past due." },
      { part: "MAX(0, …)", meaning: "Shows 0 instead of a negative number once the deadline has passed." },
    ],
    whenToUse:
      "Use this for renewal reminders, project countdowns, contract expirations, and warranty windows — anywhere \"how long do I have?\" drives the next action.",
    commonMistakes: [
      {
        mistake: "The result displays as a date like 1/7/1900 instead of a number.",
        fix: "The cell inherited date formatting from the column. Change the cell's number format to Number or General.",
      },
      {
        mistake: "Overdue items show 0, hiding how late they are.",
        fix: "MAX(0, …) deliberately flattens overdue items. If you need to see lateness too, add a separate days-overdue column with =MAX(0,TODAY()-B2).",
      },
      {
        mistake: "Due dates are text, not real dates.",
        fix: "Subtraction fails with #VALUE! if B2 holds text like \"July 15\". Convert with DATEVALUE or re-enter as a proper date.",
      },
    ],
    sampleInput: {
      columns: ["Task", "Due Date"],
      rows: [
        ["Book venue", "2026-07-15"],
        ["Send contract", "2026-07-20"],
        ["File permits", "2026-07-01"],
      ],
    },
    sampleOutput: {
      columns: ["Task", "Days Remaining"],
      rows: [
        ["Book venue", "7"],
        ["Send contract", "12"],
        ["File permits", "0"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-days-overdue", "flag-overdue-tasks", "calculate-invoice-due-date"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Task", "Due Date", "Days Remaining"],
          ["Book venue", "2026-07-15", "=MAX(0,B2-TODAY())"],
          ["Send contract", "2026-07-20", "=MAX(0,B3-TODAY())"],
          ["File permits", "2026-07-01", "=MAX(0,B4-TODAY())"],
        ],
      },
      expect: [
        { cell: "C2", value: 7 },
        { cell: "C3", value: 12 },
        { cell: "C4", value: 0 },
      ],
    },
  },
  {
    slug: "calculate-percentage-change",
    kind: "formula",
    title: "Calculate Percentage Change Between Two Values",
    seoTitle: "Percentage Change Formula in Excel & Sheets",
    description:
      "Measure growth or decline between two numbers with (new-old)/old, formatted as a percent — the standard month-over-month math.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["IF"],
    keywords: ["percentage change", "percent increase", "growth rate", "month over month", "percent difference"],
    problem:
      "You have last period's number and this period's number side by side, and you need to show the change as a percentage — up 15%, down 10% — for a report or dashboard.",
    quickFormula: "=(B2-A2)/A2",
    excelFormula: "=(B2-A2)/A2",
    sheetsFormula: null,
    explanation:
      "Percentage change is always (new minus old) divided by old. The subtraction gives the raw change, and dividing by the starting value expresses that change relative to where you began — which is what makes it a percentage rather than just a difference. The formula returns a decimal like 0.15, so format the cell as a percentage to display 15%. Increases come out positive and decreases negative, so the sign tells the story at a glance. The one hard edge: when the old value is zero, the division fails with #DIV/0!, because growth from nothing is mathematically undefined.",
    steps: [
      { part: "B2-A2", meaning: "The raw change: new value minus old value." },
      { part: "/A2", meaning: "Divides by the old value, turning the change into a proportion of the start." },
      { part: "Format as %", meaning: "The result is a decimal (0.15). Apply percentage formatting to show 15%." },
    ],
    whenToUse:
      "Use this for month-over-month sales, year-over-year budgets, price changes, and any before/after comparison where \"how much did it move, relatively?\" matters.",
    commonMistakes: [
      {
        mistake: "#DIV/0! appears when the old value is zero.",
        fix: 'Guard the division: =IF(A2=0,"",(B2-A2)/A2) shows a blank instead. Don\'t substitute 100% — growth from zero is undefined, not 100%.',
      },
      {
        mistake: "The result shows 0.15 instead of 15%.",
        fix: "The formula returns a decimal. Format the cell as a percentage (Format → Number → Percent) rather than multiplying by 100 in the formula.",
      },
      {
        mistake: "Old and new values are swapped.",
        fix: "=(A2-B2)/B2 measures the change backwards and flips the sign. Always subtract the old value from the new one, then divide by the old.",
      },
    ],
    sampleInput: {
      columns: ["Person", "June", "July"],
      rows: [
        ["Ana Torres", "8000", "9200"],
        ["Ben Okafor", "5000", "4500"],
        ["Cara Lim", "0", "1200"],
      ],
    },
    sampleOutput: {
      columns: ["Person", "June", "July", "Change"],
      rows: [
        ["Ana Torres", "8000", "9200", "15%"],
        ["Ben Okafor", "5000", "4500", "-10%"],
        ["Cara Lim", "0", "1200", "#DIV/0!"],
      ],
      highlightColumn: 3,
    },
    related: ["calculate-completion-percentage", "calculate-budget-variance", "fix-div0-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["June", "July", "Change"],
          [8000, 9200, "=(B2-A2)/A2"],
          [5000, 4500, "=(B3-A3)/A3"],
          [0, 1200, "=(B4-A4)/A4"],
        ],
      },
      expect: [
        { cell: "C2", value: 0.15 },
        { cell: "C3", value: -0.1 },
        { cell: "C4", value: "#DIV/0!" },
      ],
    },
  },
  {
    slug: "summarize-by-month",
    kind: "formula",
    title: "Sum Values for a Single Month",
    seoTitle: "Sum by Month with SUMIFS in Excel & Sheets",
    description:
      "Total every transaction that falls inside one month by bracketing SUMIFS between the first of the month and the first of the next.",
    category: "counting-summarizing",
    difficulty: "intermediate",
    functions: ["SUMIFS", "DATE"],
    keywords: ["sum by month", "sumifs date range", "monthly total", "sum between dates", "month summary"],
    problem:
      "Your sheet logs transactions with a date and an amount, and you need the total for one specific month — July's revenue, June's expenses — without manually filtering.",
    quickFormula: '=SUMIFS(C:C,B:B,">="&DATE(2026,7,1),B:B,"<"&DATE(2026,8,1))',
    excelFormula: '=SUMIFS(C:C,B:B,">="&DATE(2026,7,1),B:B,"<"&DATE(2026,8,1))',
    sheetsFormula: null,
    explanation:
      "SUMIFS adds up column C only for rows whose date in column B passes both conditions: on or after July 1, and strictly before August 1. Those two bounds bracket the month exactly — every date in July qualifies, nothing outside it does. Using \"<\" the first of the next month is the reliable upper bound: it catches July 31 no matter what, and even handles dates that carry hidden times like July 31 2:00 PM, which \"<=\" July 31 would miss. Building the bounds with DATE(2026,7,1) instead of typing \"7/1/2026\" keeps the formula immune to regional date-format differences.",
    steps: [
      { part: "C:C", meaning: "The amounts to add up." },
      { part: 'B:B,">="&DATE(2026,7,1)', meaning: "Dates on or after July 1. The & glues the operator to the date." },
      { part: 'B:B,"<"&DATE(2026,8,1)', meaning: "Dates strictly before August 1 — the clean upper bound for July." },
    ],
    whenToUse:
      "Use this for monthly revenue and expense totals, board-report summaries, and budget-vs-actual sheets. Point the DATE arguments at cells to make the month switchable from a dropdown.",
    commonMistakes: [
      {
        mistake: 'Forgetting the & and writing ">=DATE(2026,7,1)" inside the quotes.',
        fix: 'Everything inside the quotes is treated as literal text, so the date never evaluates. Keep the operator quoted and glue the date on: ">="&DATE(2026,7,1).',
      },
      {
        mistake: 'Using "<="&DATE(2026,7,31) as the upper bound.',
        fix: 'This misses any July 31 entry that carries a time, since 7/31 2:00 PM is greater than 7/31 0:00. Use "<"&DATE(2026,8,1) instead — it always covers the full last day.',
      },
      {
        mistake: "Dates in column B are text, so the total comes back 0.",
        fix: "SUMIFS can't compare text to a real date. Check with =ISNUMBER(B2) — if FALSE, convert the column with DATEVALUE or re-enter proper dates.",
      },
    ],
    sampleInput: {
      columns: ["Invoice", "Date", "Amount"],
      rows: [
        ["INV-101", "2026-06-28", "1200"],
        ["INV-102", "2026-07-03", "800"],
        ["INV-103", "2026-07-21", "1500"],
        ["INV-104", "2026-08-02", "950"],
      ],
    },
    sampleOutput: {
      columns: ["Month", "Total"],
      rows: [["July 2026", "2300"]],
      highlightColumn: 1,
    },
    related: ["sum-if-multiple-conditions", "group-dates-by-month", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Invoice", "Date", "Amount", null, "July Total", "June Total"],
          ["INV-101", "2026-06-28", 1200, null, '=SUMIFS(C2:C5,B2:B5,">="&DATE(2026,7,1),B2:B5,"<"&DATE(2026,8,1))', '=SUMIFS(C2:C5,B2:B5,">="&DATE(2026,6,1),B2:B5,"<"&DATE(2026,7,1))'],
          ["INV-102", "2026-07-03", 800, null, null, null],
          ["INV-103", "2026-07-21", 1500, null, null, null],
          ["INV-104", "2026-08-02", 950, null, null, null],
        ],
      },
      expect: [
        { cell: "E2", value: 2300 },
        { cell: "F2", value: 1200 },
      ],
    },
  },
  {
    slug: "group-dates-by-month",
    kind: "formula",
    title: "Group Dates by Month with a Helper Column",
    seoTitle: "Group Dates by Month in Excel & Google Sheets",
    description:
      "Turn each date into a \"2026-07\" label with TEXT so you can pivot, sort, and subtotal by month — the setup step behind every monthly report.",
    category: "dates-deadlines",
    difficulty: "beginner",
    functions: ["TEXT"],
    keywords: ["group by month", "month from date", "pivot by month", "month column", "text yyyy-mm"],
    problem:
      "You have a long list of dated transactions and want to roll them up by month — but a pivot table or SUMIF needs a month column to group on, and the raw dates are all different days.",
    quickFormula: '=TEXT(B2,"yyyy-mm")',
    excelFormula: '=TEXT(B2,"yyyy-mm")',
    sheetsFormula: null,
    explanation:
      "TEXT converts the date into a label using a format code — \"yyyy-mm\" turns 2026-07-21 into \"2026-07\". Every date in the same month produces the identical label, which is exactly what pivot tables, SUMIF, and COUNTIF need to group on. Putting the year first is the trick: \"2026-07\" sorts chronologically even though it's text, whereas month names like \"Jul\" sort alphabetically (Apr, Aug, Dec…). These format codes work identically in Excel and Google Sheets, so the formula travels between platforms without changes.",
    steps: [
      { part: "B2", meaning: "The date to label." },
      { part: '"yyyy-mm"', meaning: "The format code: four-digit year, dash, two-digit month — so months sort in calendar order." },
    ],
    whenToUse:
      "Add this helper column before building a pivot table, a SUMIF-per-month summary, or a monthly chart. Pair it with SUMIF(month column, \"2026-07\", amounts) for instant monthly totals.",
    commonMistakes: [
      {
        mistake: 'Using a month-only code like "mmm" and getting alphabetical order.',
        fix: '"Jul\" and "Aug" sort as text: Apr, Aug, Dec… Lead with the year — "yyyy-mm" — and the labels sort chronologically and keep different years separate.',
      },
      {
        mistake: "Treating the result as a date.",
        fix: "TEXT returns text, so date math and date filters won't work on it. Keep the original date column for calculations and use this column only for grouping.",
      },
      {
        mistake: "The formula returns the date unchanged or errors.",
        fix: "B2 is probably text, not a real date. Check with =ISNUMBER(B2) — if FALSE, convert the column with DATEVALUE first.",
      },
    ],
    sampleInput: {
      columns: ["Invoice", "Date"],
      rows: [
        ["INV-101", "2026-06-28"],
        ["INV-102", "2026-07-03"],
        ["INV-103", "2026-07-21"],
      ],
    },
    sampleOutput: {
      columns: ["Invoice", "Date", "Month"],
      rows: [
        ["INV-101", "2026-06-28", "2026-06"],
        ["INV-102", "2026-07-03", "2026-07"],
        ["INV-103", "2026-07-21", "2026-07"],
      ],
      highlightColumn: 2,
    },
    related: ["summarize-by-month", "count-if-multiple-conditions", "sum-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Invoice", "Date", "Month"],
          ["INV-101", "2026-06-28", '=TEXT(B2,"yyyy-mm")'],
          ["INV-102", "2026-07-03", '=TEXT(B3,"yyyy-mm")'],
          ["INV-103", "2026-07-21", '=TEXT(B4,"yyyy-mm")'],
        ],
      },
      expect: [
        { cell: "C2", value: "2026-06" },
        { cell: "C3", value: "2026-07" },
        { cell: "C4", value: "2026-07" },
      ],
    },
  },
];
