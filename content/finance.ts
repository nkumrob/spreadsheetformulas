import type { Formula } from "@/lib/schema";

export const financeFormulas: Formula[] = [
  {
    slug: "calculate-budget-variance",
    kind: "formula",
    title: "Calculate Budget Variance in Dollars and Percent",
    seoTitle: "Budget Variance Formula (Excel & Google Sheets)",
    description:
      "Subtract budget from actual to get variance in dollars, then divide by budget to get variance percent for any line item.",
    category: "finance-business",
    difficulty: "beginner",
    functions: [],
    keywords: [
      "budget variance",
      "budget vs actual",
      "variance percentage",
      "over budget formula",
      "actual minus budget",
    ],
    problem:
      "You have a budget column and an actual column, and you need to see how far off each line item is — in dollars and as a percentage — so the misses stand out.",
    quickFormula: "=B2-A2",
    excelFormula: "=B2-A2",
    sheetsFormula: null,
    explanation:
      "With budget in column A and actual in column B, actual minus budget gives the variance in dollars. Divide that by the budget — =(B2-A2)/A2 — and format as a percentage to see how big the miss is relative to what you planned. The sign tells a different story depending on the line: for an expense line, a positive variance means you overspent; for a revenue line, positive means you beat plan. That's why finance teams often label the column \"Over/(Under)\" rather than \"Good/Bad\" — the number is neutral, the interpretation depends on the line.",
    steps: [
      { part: "B2", meaning: "The actual amount — what really happened." },
      { part: "-A2", meaning: "Minus the budgeted amount. Positive = actual came in above budget." },
      { part: "(B2-A2)/A2", meaning: "The same variance divided by budget — format as a percentage." },
    ],
    whenToUse:
      "Use this on any budget-vs-actual report: monthly department spend, project budgets, revenue plans, event costs. Pair the dollar variance with the percent so a $500 miss on a $1,000 line doesn't hide next to a $500 miss on a $100,000 line.",
    commonMistakes: [
      {
        mistake: "Subtracting in the wrong order.",
        fix: "=A2-B2 flips every sign, so overspending looks like savings. Stick to actual minus budget (=B2-A2) and keep it consistent across the sheet.",
      },
      {
        mistake: "Reading positive as good on every line.",
        fix: "Positive variance on an expense line means you spent MORE than planned. Only on revenue lines does positive mean you're ahead. Label the report so readers know which is which.",
      },
      {
        mistake: "Dividing by actual instead of budget for the percent.",
        fix: "=(B2-A2)/B2 measures against what happened, not what you planned. Variance percent should use budget as the base: =(B2-A2)/A2.",
      },
      {
        mistake: "A budget of zero breaks the percentage.",
        fix: 'Dividing by a zero budget returns #DIV/0!. Guard it: =IF(A2=0,"",(B2-A2)/A2).',
      },
    ],
    sampleInput: {
      columns: ["Line Item", "Budget", "Actual"],
      rows: [
        ["Travel", "5000", "6200"],
        ["Software", "3000", "2750"],
        ["Contractors", "2000", "2400"],
      ],
    },
    sampleOutput: {
      columns: ["Line Item", "Variance", "Variance %"],
      rows: [
        ["Travel", "1200", "24%"],
        ["Software", "-250", "-8%"],
        ["Contractors", "400", "20%"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-profit-margin", "calculate-percentage-change", "fix-div0-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Budget", "Actual", "Variance", "Variance %", "Guarded %"],
          [5000, 6200, "=B2-A2", "=(B2-A2)/A2", '=IF(A2=0,"",(B2-A2)/A2)'],
          [2000, 2400, "=B3-A3", "=(B3-A3)/A3", null],
          [0, 500, "=B4-A4", null, '=IF(A4=0,"",(B4-A4)/A4)'],
        ],
      },
      expect: [
        { cell: "C2", value: 1200 },
        { cell: "D2", value: 0.24 },
        { cell: "C3", value: 400 },
        { cell: "D3", value: 0.2 },
        { cell: "E4", value: "" },
      ],
    },
  },
  {
    slug: "calculate-profit-margin",
    kind: "formula",
    title: "Calculate Profit Margin From Revenue and Cost",
    seoTitle: "Profit Margin Formula (Excel & Google Sheets)",
    description:
      "Divide profit by revenue to get profit margin — the share of every sale you actually keep — and avoid mixing it up with markup.",
    category: "finance-business",
    difficulty: "beginner",
    functions: [],
    keywords: [
      "profit margin formula",
      "gross margin",
      "margin percentage",
      "margin vs markup",
      "profit percentage",
    ],
    problem:
      "You know what each product costs and what it sells for, and you need the margin — what share of each sale is profit — to compare products or check pricing.",
    quickFormula: "=(B2-A2)/B2",
    excelFormula: "=(B2-A2)/B2",
    sheetsFormula: null,
    explanation:
      "With cost in column A and revenue in column B, revenue minus cost is your profit, and dividing by revenue turns it into a margin — the fraction of each sale you keep. Format the cell as a percentage: a $200 sale with a $120 cost shows 40%, meaning 40 cents of every dollar is profit. The denominator is what makes it a margin: dividing by revenue answers \"what share of the sale is profit,\" while dividing by cost answers a different question (markup). Margin can never exceed 100%, so if you see 150%, you've computed markup by mistake.",
    steps: [
      { part: "B2-A2", meaning: "Profit: revenue minus cost. The parentheses make this happen first." },
      { part: "/B2", meaning: "Divide by revenue — margin is profit as a share of the sale." },
    ],
    whenToUse:
      "Use margin to compare profitability across products, quote jobs, set pricing floors, or track gross margin month over month. It's the number investors and lenders expect when they ask about profitability.",
    commonMistakes: [
      {
        mistake: "Confusing margin with markup.",
        fix: "Margin divides by revenue: =(B2-A2)/B2. Markup divides by cost: =(B2-A2)/A2. A $120 cost sold at $200 is a 40% margin but a 67% markup — quoting one when someone expects the other misprices the deal.",
      },
      {
        mistake: "Trying to hit a target margin by adding it as markup.",
        fix: "Adding 40% to cost (=A2*1.4) does NOT give a 40% margin. To price for a target margin, divide: =A2/(1-0.4).",
      },
      {
        mistake: "Revenue of zero returns #DIV/0!.",
        fix: 'Free samples or unsold items break the division. Guard it: =IF(B2=0,"",(B2-A2)/B2).',
      },
    ],
    sampleInput: {
      columns: ["Product", "Cost", "Revenue"],
      rows: [
        ["Desk", "120", "200"],
        ["Chair", "45", "60"],
        ["Lamp", "18", "30"],
      ],
    },
    sampleOutput: {
      columns: ["Product", "Margin"],
      rows: [
        ["Desk", "40%"],
        ["Chair", "25%"],
        ["Lamp", "40%"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-budget-variance", "calculate-percentage-change", "fix-div0-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Cost", "Revenue", "Margin", "Guarded"],
          [120, 200, "=(B2-A2)/B2", null],
          [45, 60, "=(B3-A3)/B3", null],
          [10, 0, null, '=IF(B4=0,"",(B4-A4)/B4)'],
        ],
      },
      expect: [
        { cell: "C2", value: 0.4 },
        { cell: "C3", value: 0.25 },
        { cell: "D4", value: "" },
      ],
    },
  },
  {
    slug: "calculate-invoice-due-date",
    kind: "formula",
    title: "Calculate an Invoice Due Date From Payment Terms",
    seoTitle: "Invoice Due Date Formula (Excel & Google Sheets)",
    description:
      "Add your payment terms to the invoice date — like =B2+30 for net-30 — to get due dates that update automatically.",
    category: "finance-business",
    difficulty: "beginner",
    functions: ["EDATE", "WORKDAY"],
    keywords: [
      "invoice due date",
      "net 30 formula",
      "add days to date",
      "payment terms",
      "due date calculator",
    ],
    problem:
      "Every invoice you send has payment terms like net 30, and you're typing due dates by hand — which means typos, wrong months, and missed follow-ups.",
    quickFormula: "=B2+30",
    excelFormula: "=B2+30",
    sheetsFormula: null,
    explanation:
      "Dates in spreadsheets are just numbers counting days, so adding 30 to an invoice date lands exactly 30 calendar days later — month lengths and year rollovers are handled for you. For terms measured in months rather than days, use =EDATE(B2,1) to jump to the same day next month. If your terms are 30 business days, =WORKDAY(B2,30) skips weekends (and holidays if you list them in a range as a third argument). If the result shows a number like 46234 instead of a date, the cell just needs a date format.",
    steps: [
      { part: "B2", meaning: "The invoice date. Must be a real date, not text." },
      { part: "+30", meaning: "Adds 30 calendar days. Use 15, 45, or 60 to match your terms." },
    ],
    whenToUse:
      "Use this on invoice trackers, accounts receivable aging sheets, and payment reminder lists. Pair it with TODAY() to flag which invoices are past due right now.",
    commonMistakes: [
      {
        mistake: "The invoice date is text, not a real date.",
        fix: 'Adding 30 to text like "July 1" returns #VALUE!. Re-enter it as a date (right-aligned by default) or convert with DATEVALUE first.',
      },
      {
        mistake: 'Using =B2+"1 month" logic by adding 30 to everything.',
        fix: "Thirty days is not one month — Feb 1 + 30 lands in early March. For month-based terms, use =EDATE(B2,1), which handles short months correctly.",
      },
      {
        mistake: "Counting weekends when terms are business days.",
        fix: "=B2+30 counts every calendar day. For 30 business days, use =WORKDAY(B2,30) — add a holiday range as the third argument to skip those too.",
      },
      {
        mistake: "The result displays as a serial number.",
        fix: "A result like 46234 is correct — the cell is just formatted as a number. Change the cell format to Date.",
      },
    ],
    sampleInput: {
      columns: ["Invoice", "Invoice Date", "Terms"],
      rows: [
        ["INV-1042", "2026-07-01", "Net 30"],
        ["INV-1043", "2026-07-06", "Net 30"],
      ],
    },
    sampleOutput: {
      columns: ["Invoice", "Due Date"],
      rows: [
        ["INV-1042", "2026-07-31"],
        ["INV-1043", "2026-08-05"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-days-overdue", "flag-overdue-tasks", "calculate-days-remaining"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Invoice", "Invoice Date", "Due Date", "Due Text"],
          ["INV-1042", "2026-06-01", "=B2+30", '=TEXT(C2,"yyyy-mm-dd")'],
          ["INV-1043", "2026-07-06", "=B3+30", '=TEXT(C3,"yyyy-mm-dd")'],
          ["INV-1044", "2026-01-31", "=EDATE(B4,1)", '=TEXT(C4,"yyyy-mm-dd")'],
        ],
      },
      expect: [
        { cell: "D2", value: "2026-07-01" },
        { cell: "D3", value: "2026-08-05" },
        { cell: "D4", value: "2026-02-28" },
      ],
    },
  },
];
