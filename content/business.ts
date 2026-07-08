import type { Formula } from "@/lib/schema";

export const businessFormulas: Formula[] = [
  {
    slug: "calculate-inventory-reorder-status",
    kind: "formula",
    title: "Flag Inventory Items That Need Reordering",
    seoTitle: "Inventory Reorder Formula (Excel & Google Sheets)",
    description:
      "Compare stock on hand to each item's reorder point with IF, so low items flag themselves as Reorder the moment counts drop.",
    category: "small-business",
    difficulty: "beginner",
    functions: ["IF"],
    keywords: [
      "inventory reorder point",
      "low stock alert",
      "stock level formula",
      "reorder status",
      "inventory tracker",
    ],
    problem:
      "You track stock counts in a sheet, and each item has a reorder point — but nothing tells you when a count drops below it, so you find out when you run out.",
    quickFormula: '=IF(B2<=C2,"Reorder","OK")',
    excelFormula: '=IF(B2<=C2,"Reorder","OK")',
    sheetsFormula: null,
    explanation:
      "IF checks a condition and returns one value when it's true, another when it's false. Here it compares stock on hand (B2) to the reorder point (C2): at or below the point, the row says Reorder; otherwise OK. Using <= rather than < matters — the reorder point is the level at which you act, so hitting it exactly should trigger the flag. Because the formula recalculates whenever counts change, the status column stays current without anyone checking it.",
    steps: [
      { part: "B2<=C2", meaning: "The test: is stock on hand at or below the reorder point?" },
      { part: '"Reorder"', meaning: "What to show when the test is true — time to order." },
      { part: '"OK"', meaning: "What to show otherwise. Both text values need quotes." },
    ],
    whenToUse:
      "Use this on any stock list: retail inventory, office supplies, spare parts, packaging materials. Add conditional formatting on the status column so Reorder rows turn red and jump out.",
    commonMistakes: [
      {
        mistake: "Using < instead of <=.",
        fix: "With =IF(B2<C2,...), an item sitting exactly at its reorder point shows OK. The reorder point is the trigger level, so use <= to flag it.",
      },
      {
        mistake: "Comparing stock counts stored as text.",
        fix: 'Numbers stored as text (often left-aligned) compare as text, giving wrong answers. Convert the column to real numbers, or the test "9"<="50" fails.',
      },
      {
        mistake: "One reorder point hardcoded for every item.",
        fix: "=IF(B2<=20,...) treats fast and slow movers the same. Keep a reorder point per item in its own column and reference it, as this formula does.",
      },
    ],
    sampleInput: {
      columns: ["Item", "On Hand", "Reorder Point"],
      rows: [
        ["Boxes", "40", "50"],
        ["Tape", "120", "60"],
        ["Labels", "55", "55"],
      ],
    },
    sampleOutput: {
      columns: ["Item", "Status"],
      rows: [
        ["Boxes", "Reorder"],
        ["Tape", "OK"],
        ["Labels", "Reorder"],
      ],
      highlightColumn: 1,
    },
    related: ["create-pass-fail-status", "count-if-multiple-conditions", "flag-overdue-tasks"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Item", "On Hand", "Reorder Point", "Status"],
          ["Boxes", 40, 50, '=IF(B2<=C2,"Reorder","OK")'],
          ["Tape", 120, 60, '=IF(B3<=C3,"Reorder","OK")'],
          ["Labels", 55, 55, '=IF(B4<=C4,"Reorder","OK")'],
        ],
      },
      expect: [
        { cell: "D2", value: "Reorder" },
        { cell: "D3", value: "OK" },
        { cell: "D4", value: "Reorder" },
      ],
    },
  },
  {
    slug: "calculate-sales-commission",
    kind: "formula",
    title: "Calculate Sales Commission With a Flat or Tiered Rate",
    seoTitle: "Sales Commission Formula (Excel & Google Sheets)",
    description:
      "Multiply sales by the commission rate for flat payouts, or nest IF to apply tiered rates that rise with performance.",
    category: "small-business",
    difficulty: "beginner",
    functions: ["IF"],
    keywords: [
      "sales commission formula",
      "commission calculator",
      "tiered commission",
      "commission rate",
      "sales payout",
    ],
    problem:
      "Every month you calculate what each rep earned in commission, and doing it by hand — especially when rates change at sales thresholds — invites disputes and mistakes.",
    quickFormula: "=B2*C2",
    excelFormula: "=B2*C2",
    sheetsFormula: null,
    explanation:
      "For a flat commission, multiply sales (B2) by the rate (C2) — keep the rate in its own column so changing it never means editing formulas. For tiered plans where the rate depends on the sales total, nest IF: =B2*IF(B2>=50000,0.08,IF(B2>=25000,0.06,0.04)) pays 8% at $50,000 and up, 6% from $25,000, and 4% below that. IF checks the conditions top to bottom and stops at the first true one, which is why the highest threshold must come first. Note this version applies one rate to the whole amount — a rep crossing a tier gets the better rate on everything, so payouts jump at the thresholds.",
    steps: [
      { part: "B2", meaning: "The rep's total sales for the period." },
      { part: "*C2", meaning: "Times the commission rate — store 5% as 0.05 or format the cell as a percent." },
    ],
    whenToUse:
      "Use this for monthly commission runs, sales contests, referral payouts, or any pay-for-performance calculation. A visible formula the whole team can check prevents payout disputes.",
    commonMistakes: [
      {
        mistake: "Entering the rate as 5 instead of 5% or 0.05.",
        fix: "=B2*5 pays five times the sale. Enter the rate as 0.05, or type 5% so the spreadsheet stores it correctly.",
      },
      {
        mistake: "Ordering tiered IF conditions from lowest to highest.",
        fix: "=IF(B2>=25000,0.06,IF(B2>=50000,0.08,0.04)) never reaches the 8% tier — a $60,000 rep matches >=25000 first. Test the highest threshold first: =B2*IF(B2>=50000,0.08,IF(B2>=25000,0.06,0.04)).",
      },
      {
        mistake: "Expecting the tiered formula to pay each rate only on the slice above its threshold.",
        fix: "This version applies one rate to the full amount, so payouts jump at thresholds. If your plan pays marginal rates per bracket (like tax brackets), that needs a different, additive formula.",
      },
    ],
    sampleInput: {
      columns: ["Rep", "Sales", "Rate"],
      rows: [
        ["Ana Torres", "30000", "0.05"],
        ["Ben Okafor", "52000", "0.05"],
        ["Cara Lim", "18000", "0.05"],
      ],
    },
    sampleOutput: {
      columns: ["Rep", "Commission"],
      rows: [
        ["Ana Torres", "1500"],
        ["Ben Okafor", "2600"],
        ["Cara Lim", "900"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-profit-margin", "create-status-multiple-conditions", "sum-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Rep", "Sales", "Rate", "Flat", "Tiered"],
          ["Ana Torres", 30000, 0.05, "=B2*C2", "=B2*IF(B2>=50000,0.08,IF(B2>=25000,0.06,0.04))"],
          ["Ben Okafor", 52000, 0.05, "=B3*C3", "=B3*IF(B3>=50000,0.08,IF(B3>=25000,0.06,0.04))"],
          ["Cara Lim", 50000, 0.05, null, "=B4*IF(B4>=50000,0.08,IF(B4>=25000,0.06,0.04))"],
        ],
      },
      expect: [
        { cell: "D2", value: 1500 },
        { cell: "D3", value: 2600 },
        { cell: "E2", value: 1800 },
        { cell: "E3", value: 4160 },
        { cell: "E4", value: 4000 },
      ],
    },
  },
  {
    slug: "track-job-applications",
    kind: "formula",
    title: "Track Job Applications by Status With COUNTIF",
    seoTitle: "Job Application Tracker Formulas (Excel & Sheets)",
    description:
      "Count how many applications sit at each stage — Applied, Interview, Offer, Rejected — with COUNTIF on your tracker's status column.",
    category: "small-business",
    difficulty: "beginner",
    functions: ["COUNTIF"],
    keywords: [
      "job application tracker",
      "count by status",
      "job search spreadsheet",
      "application pipeline",
      "countif status",
    ],
    problem:
      "You're tracking a job search in a sheet with Company, Role, Date, and Status columns — and you want a live summary of how many applications are at each stage without counting rows by hand.",
    quickFormula: '=COUNTIF(D:D,"Interview")',
    excelFormula: '=COUNTIF(D:D,"Interview")',
    sheetsFormula: null,
    explanation:
      "COUNTIF scans the status column (D) and counts every cell that says Interview. Using the whole column D:D means new applications are counted the moment you add a row — no range to update. Repeat the formula with \"Applied\", \"Offer\", and \"Rejected\" to build a small dashboard above or beside the tracker, and each number updates itself as you change statuses. The match ignores case, so \"interview\" and \"Interview\" both count — but a different word or a stray space won't.",
    steps: [
      { part: "D:D", meaning: "The whole Status column — new rows are included automatically." },
      { part: '"Interview"', meaning: "The status to count. Swap in Applied, Offer, or Rejected for the other stages." },
    ],
    whenToUse:
      "Use this for any pipeline you track in rows: your own job search, candidates you're hiring, sales leads, or grant applications. A stage-count summary shows at a glance where things are stalling.",
    commonMistakes: [
      {
        mistake: "Statuses typed inconsistently — \"Interview\", \"interviewing\", \"Intv\".",
        fix: "COUNTIF only counts exact matches, so variants vanish from your totals. Add a dropdown (data validation) on the Status column so every row uses the same labels.",
      },
      {
        mistake: "Trailing spaces hiding matches.",
        fix: '"Interview " (with a space) is not "Interview". If a count looks low, check for stray spaces or use =COUNTIF(D:D,"Interview*") to catch them.',
      },
      {
        mistake: "Putting the summary in the same column it counts.",
        fix: 'If the summary cell containing the word "Interview" sits in column D, COUNTIF(D:D,...) counts it too. Keep summary formulas in a different column or a separate summary block.',
      },
    ],
    sampleInput: {
      columns: ["Company", "Role", "Date", "Status"],
      rows: [
        ["Northwind", "Analyst", "2026-06-12", "Interview"],
        ["Acme Co", "Project Mgr", "2026-06-20", "Applied"],
        ["Globex", "Analyst", "2026-06-25", "Interview"],
        ["Initech", "Designer", "2026-07-01", "Rejected"],
      ],
    },
    sampleOutput: {
      columns: ["Stage", "Count"],
      rows: [
        ["Interview", "2"],
        ["Applied", "1"],
        ["Rejected", "1"],
      ],
      highlightColumn: 1,
    },
    related: ["count-if-status-complete", "calculate-completion-percentage", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Company", "Role", "Date", "Status"],
          ["Northwind", "Analyst", "2026-06-12", "Interview"],
          ["Acme Co", "Project Mgr", "2026-06-20", "Applied"],
          ["Globex", "Analyst", "2026-06-25", "Interview"],
          ["Initech", "Designer", "2026-07-01", "Rejected"],
          ["Interview count", '=COUNTIF(D2:D5,"Interview")', '=COUNTIF(D2:D5,"Applied")', '=COUNTIF(D2:D5,"Rejected")'],
        ],
      },
      expect: [
        { cell: "B6", value: 2 },
        { cell: "C6", value: 1 },
        { cell: "D6", value: 1 },
      ],
    },
  },
];
