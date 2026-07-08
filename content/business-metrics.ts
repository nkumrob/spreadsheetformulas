import type { Formula } from "@/lib/schema";

export const businessMetricsFormulas: Formula[] = [
  {
    slug: "calculate-percentage-of-total",
    kind: "formula",
    title: "Calculate Each Item's Percentage of the Total",
    seoTitle: "Percentage of Total Formula (Excel & Sheets)",
    description:
      "Divide each row by the grand total with an anchored SUM to see what share each category, product, or region contributes.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["SUM"],
    keywords: ["percentage of total", "percent of grand total", "share of total", "contribution", "breakdown"],
    problem:
      "You have amounts by category — spend, revenue, headcount — and need each row expressed as a share of the total, so 2,500 becomes \"50% of everything.\"",
    quickFormula: "=B2/SUM($B$2:$B$6)",
    excelFormula: "=B2/SUM($B$2:$B$6)",
    sheetsFormula: null,
    explanation:
      "Each row's value is divided by the same grand total. The $ signs are the whole trick: $B$2:$B$6 is an absolute reference, so when you copy the formula down, the numerator moves row by row while the denominator stays locked on the full range. Format the column as a percentage and the shares appear — and they always add up to 100%, which makes this the fastest sanity check on any breakdown.",
    steps: [
      { part: "B2", meaning: "This row's value — moves as you copy the formula down." },
      { part: "SUM($B$2:$B$6)", meaning: "The grand total. The $ anchors keep it fixed on every row." },
    ],
    whenToUse:
      "Use it for any \"what share of the whole\" question: spend by category, revenue by product, tickets by team, survey answers by option.",
    commonMistakes: [
      {
        mistake: "Forgetting the $ anchors on the total.",
        fix: "=B2/SUM(B2:B6) breaks when copied down — the total range shifts and the shares are wrong. Anchor it: SUM($B$2:$B$6).",
      },
      {
        mistake: "The column shows 0.5 instead of 50%.",
        fix: "The math is fine; the cell just isn't formatted. Apply the percentage number format.",
      },
      {
        mistake: "Shares don't add to 100%.",
        fix: "The total range is missing rows or includes extras. Make the SUM range match exactly the rows you're dividing.",
      },
    ],
    sampleInput: {
      columns: ["Category", "Spend"],
      rows: [
        ["Payroll", "2500"],
        ["Marketing", "1500"],
        ["Software", "1000"],
      ],
    },
    sampleOutput: {
      columns: ["Category", "Spend", "% of Total"],
      rows: [
        ["Payroll", "2500", "50%"],
        ["Marketing", "1500", "30%"],
        ["Software", "1000", "20%"],
      ],
      highlightColumn: 2,
    },
    related: ["calculate-completion-percentage", "sum-if-multiple-conditions", "calculate-percentage-change"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Category", "Spend", "Share"],
          ["Payroll", 2500, "=B2/SUM($B$2:$B$4)"],
          ["Marketing", 1500, "=B3/SUM($B$2:$B$4)"],
          ["Software", 1000, "=B4/SUM($B$2:$B$4)"],
        ],
      },
      expect: [
        { cell: "C2", value: 0.5 },
        { cell: "C3", value: 0.3 },
        { cell: "C4", value: 0.2 },
      ],
    },
  },
  {
    slug: "calculate-weighted-average",
    kind: "formula",
    title: "Calculate a Weighted Average",
    seoTitle: "Weighted Average Formula (Excel & Sheets)",
    description:
      "SUMPRODUCT divided by SUM gives an average where big items count more — the correct math for average price, blended rates, and scores.",
    category: "counting-summarizing",
    difficulty: "intermediate",
    functions: ["SUMPRODUCT", "SUM"],
    keywords: ["weighted average", "average price", "blended rate", "sumproduct average", "weighted score"],
    problem:
      "A plain average treats every row equally — but selling 1 unit at $189 and 100 units at $4.50 shouldn't average to $96.75. You need each value weighted by how much it matters.",
    quickFormula: "=SUMPRODUCT(B2:B4,C2:C4)/SUM(C2:C4)",
    excelFormula: "=SUMPRODUCT(B2:B4,C2:C4)/SUM(C2:C4)",
    sheetsFormula: null,
    explanation:
      "SUMPRODUCT multiplies each value by its weight and adds the results — price × units for every row, summed. Dividing by the total of the weights turns that back into an average where heavy rows pull harder. With prices 10, 20, 30 and units 1, 3, 6, the weighted average is (10 + 60 + 180) ÷ 10 = 25 — versus a plain AVERAGE of 20, which pretends one unit of each was sold.",
    steps: [
      { part: "SUMPRODUCT(B2:B4,C2:C4)", meaning: "Multiplies each value by its weight, then sums: value₁×weight₁ + value₂×weight₂ + …" },
      { part: "/SUM(C2:C4)", meaning: "Divides by the total weight, converting the weighted sum into an average." },
    ],
    whenToUse:
      "Use it whenever rows differ in importance: average selling price weighted by units, blended interest rates weighted by balance, assessment scores weighted by credit, cost per unit across warehouses.",
    commonMistakes: [
      {
        mistake: "Using plain AVERAGE on per-row rates.",
        fix: "AVERAGE ignores volume, so small rows distort the result. If each row has a quantity, you almost always want the weighted version.",
      },
      {
        mistake: "Value and weight ranges are different sizes.",
        fix: "SUMPRODUCT(B2:B4,C2:C9) returns #VALUE!. Both ranges must cover exactly the same rows.",
      },
      {
        mistake: "Weights that sum to zero.",
        fix: "An empty weight column gives #DIV/0!. Guard it: =IF(SUM(C2:C4)=0,\"\",SUMPRODUCT(B2:B4,C2:C4)/SUM(C2:C4)).",
      },
    ],
    sampleInput: {
      columns: ["Product", "Price", "Units"],
      rows: [
        ["Notebook", "10", "1"],
        ["Stapler", "20", "3"],
        ["Monitor", "30", "6"],
      ],
    },
    sampleOutput: {
      columns: ["Metric", "Result"],
      rows: [
        ["Weighted avg price", "25"],
        ["Plain AVERAGE (wrong here)", "20"],
      ],
      highlightColumn: 1,
    },
    related: ["average-by-category", "sum-if-multiple-conditions", "fix-div0-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Product", "Price", "Units", "Result"],
          ["Notebook", 10, 1, "=SUMPRODUCT(B2:B4,C2:C4)/SUM(C2:C4)"],
          ["Stapler", 20, 3, null],
          ["Monitor", 30, 6, null],
        ],
      },
      expect: [{ cell: "D2", value: 25 }],
    },
  },
  {
    slug: "calculate-years-between-dates",
    kind: "formula",
    title: "Calculate Years Between Two Dates",
    seoTitle: "Years Between Dates: DATEDIF (Excel & Sheets)",
    description:
      "DATEDIF returns completed years between two dates — the standard way to compute age, tenure, or account lifetime from a start date.",
    category: "dates-deadlines",
    difficulty: "beginner",
    functions: ["DATEDIF", "TODAY"],
    keywords: ["years between dates", "calculate age", "tenure", "datedif", "years of service", "account age"],
    problem:
      "You have a start date — a birthdate, hire date, contract start, account creation — and need how many full years have passed since.",
    quickFormula: '=DATEDIF(B2,TODAY(),"Y")',
    excelFormula: '=DATEDIF(B2,TODAY(),"Y")',
    sheetsFormula: null,
    explanation:
      "DATEDIF measures the gap between two dates in the unit you pick: \"Y\" for completed years, \"M\" for completed months, \"D\" for days. It counts anniversaries, not calendar years — someone who started 15 March 2019 has 7 completed years on 8 July 2026, but someone who started 1 September 2020 has 5, because their sixth anniversary hasn't arrived yet. Excel accepts DATEDIF in every version but hides it from the function autocomplete — it's a documented leftover from Lotus 1-2-3, and it works.",
    steps: [
      { part: "B2", meaning: "The start date — must be earlier than the end date." },
      { part: "TODAY()", meaning: "The end date. Swap in any cell to measure between two fixed dates." },
      { part: '"Y"', meaning: 'Completed years. Use "M" for months, "D" for days, "YM" for months beyond the last full year.' },
    ],
    whenToUse:
      "Use it for age from a birthdate, employee tenure, customer lifetime, equipment age, or contract duration — anywhere \"how many full years\" is the question.",
    commonMistakes: [
      {
        mistake: "Start and end dates reversed.",
        fix: "DATEDIF(TODAY(),B2,\"Y\") with a past date returns #NUM!. The earlier date goes first.",
      },
      {
        mistake: 'Expecting "Y" to subtract calendar years.',
        fix: "2019 to 2026 isn't automatically 7 — it's 6 until the anniversary passes. That's usually what you want for age and tenure; if you truly want calendar-year subtraction, use =YEAR(A2)-YEAR(B2).",
      },
      {
        mistake: "Typing it and finding no autocomplete in Excel.",
        fix: "DATEDIF doesn't appear in Excel's function list, but it calculates fine once entered. It's not a typo.",
      },
    ],
    sampleInput: {
      columns: ["Name", "Start Date"],
      rows: [
        ["Ana Torres", "2019-03-15"],
        ["Ben Okafor", "2020-09-01"],
      ],
    },
    sampleOutput: {
      columns: ["Name", "Years"],
      rows: [
        ["Ana Torres", "7"],
        ["Ben Okafor", "5"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-days-overdue", "calculate-days-remaining", "calculate-invoice-due-date"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Name", "Start", "Years"],
          ["Ana Torres", "2019-03-15", '=DATEDIF(B2,TODAY(),"Y")'],
          ["Ben Okafor", "2020-09-01", '=DATEDIF(B3,TODAY(),"Y")'],
        ],
      },
      expect: [
        { cell: "C2", value: 7 },
        { cell: "C3", value: 5 },
      ],
    },
  },
  {
    slug: "average-by-category",
    kind: "formula",
    title: "Calculate an Average by Category",
    seoTitle: "AVERAGEIF: Average by Category (Excel & Sheets)",
    description:
      "AVERAGEIF averages only the rows matching a condition — average deal size per region, spend per vendor, hours per project.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["AVERAGEIF"],
    keywords: ["average by category", "averageif", "average by group", "average deal size", "conditional average"],
    problem:
      "One column holds categories — regions, vendors, projects — and another holds numbers. You need the average for just one category, not the whole column.",
    quickFormula: '=AVERAGEIF(A:A,"Sales",C:C)',
    excelFormula: '=AVERAGEIF(A:A,"Sales",C:C)',
    sheetsFormula: null,
    explanation:
      "AVERAGEIF scans column A for rows equal to Sales and averages the matching rows' values from column C — everything else is ignored. The arguments read: where to look, what to match, what to average. For multiple conditions at once (region AND quarter), step up to AVERAGEIFS, which takes the average range first and then range/condition pairs, mirroring SUMIFS.",
    steps: [
      { part: "A:A", meaning: "The category column to test." },
      { part: '"Sales"', meaning: "The category to match. Point at a cell instead to make it reusable: E2." },
      { part: "C:C", meaning: "The numbers to average for matching rows." },
    ],
    whenToUse:
      "Use it for per-group metrics: average deal size by region, average order value by customer type, average hours by project. For a full table of every category at once, a pivot table is usually faster.",
    commonMistakes: [
      {
        mistake: "No rows match the condition.",
        fix: 'AVERAGEIF returns #DIV/0! when nothing matches — a typo like "Sale" is the usual cause. Wrap with IFERROR if empty categories are expected.',
      },
      {
        mistake: "Averaging a column that holds text numbers.",
        fix: "Cells like \"3,000\" stored as text are skipped silently, shifting the average. Check with ISNUMBER and convert with VALUE.",
      },
    ],
    sampleInput: {
      columns: ["Region", "Deal", "Value"],
      rows: [
        ["Sales", "Acme Co", "2800"],
        ["East", "Borealis", "4000"],
        ["Sales", "Cobalt", "3200"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [["Average Sales deal", "3000"]],
      highlightColumn: 1,
    },
    related: ["calculate-weighted-average", "count-if-multiple-conditions", "fix-div0-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Region", "Deal", "Value"],
          ["Sales", "Acme Co", 2800],
          ["East", "Borealis", 4000],
          ["Sales", "Cobalt", 3200],
          ["Result", '=AVERAGEIF(A2:A4,"Sales",C2:C4)', null],
        ],
      },
      expect: [{ cell: "B5", value: 3000 }],
    },
  },
  {
    slug: "count-unique-values",
    kind: "formula",
    title: "Count Unique Values in a Column",
    seoTitle: "Count Unique Values (Excel & Google Sheets)",
    description:
      "How many different customers, products, or codes does a column contain? One formula per platform — plus the classic that works everywhere.",
    category: "counting-summarizing",
    difficulty: "intermediate",
    functions: ["COUNTIF", "SUMPRODUCT", "UNIQUE", "COUNTUNIQUE"],
    keywords: ["count unique", "count distinct", "unique values", "how many different", "distinct count"],
    problem:
      "A column lists repeated entries — customer names on orders, SKUs on transactions — and you need how many *different* ones there are, not how many rows.",
    quickFormula: "=SUMPRODUCT(1/COUNTIF(A2:A7,A2:A7))",
    excelFormula: "=ROWS(UNIQUE(A2:A7))",
    sheetsFormula: "=COUNTUNIQUE(A2:A7)",
    explanation:
      "The universal version is a classic trick: COUNTIF(A2:A7,A2:A7) counts how often each entry appears, and 1 divided by that count makes every copy of an entry contribute a fraction summing to exactly 1 — three Acmes contribute ⅓ + ⅓ + ⅓. SUMPRODUCT adds the fractions, giving the number of distinct entries. The modern platforms have cleaner answers: Excel 365 spills the distinct list with UNIQUE and counts it with ROWS; Google Sheets has a dedicated COUNTUNIQUE.",
    steps: [
      { part: "COUNTIF(A2:A7,A2:A7)", meaning: "For every row, how many times its value appears in the range." },
      { part: "1/…", meaning: "Turns each group of duplicates into fractions that total exactly 1." },
      { part: "SUMPRODUCT(…)", meaning: "Adds the fractions — the result is the count of distinct values." },
    ],
    whenToUse:
      "Use it for distinct customers in an order log, different products sold this month, unique error codes in an export — any \"how many different X\" question.",
    commonMistakes: [
      {
        mistake: "A blank cell anywhere in the range.",
        fix: "COUNTIF of a blank is 0, and 1/0 blows up the whole formula with #DIV/0!. Restrict the range to filled rows, or use =SUMPRODUCT((A2:A7<>\"\")/COUNTIF(A2:A7,A2:A7&\"\")).",
      },
      {
        mistake: "Counting rows when you meant distinct values.",
        fix: "COUNTA counts every filled row including duplicates. If Acme ordered three times, COUNTA says 3; a unique count says 1.",
      },
      {
        mistake: "Using UNIQUE in Excel 2019 or older.",
        fix: "UNIQUE needs Excel 365/2021 — older versions show #NAME?. Fall back to the SUMPRODUCT version, which works everywhere.",
      },
    ],
    sampleInput: {
      columns: ["Customer"],
      rows: [["Acme Co"], ["Borealis"], ["Acme Co"], ["Cobalt"], ["Borealis"], ["Acme Co"]],
    },
    sampleOutput: {
      columns: ["Metric", "Result"],
      rows: [
        ["Rows (COUNTA)", "6"],
        ["Unique customers", "3"],
      ],
      highlightColumn: 1,
    },
    related: ["remove-duplicates", "count-duplicates", "fix-div0-error"],
    lastReviewed: "2026-07-08",
    published: true,
    // The SUMPRODUCT/COUNTIF variant is correct in Excel & Sheets but our
    // engine evaluates COUNTIF(range,range) as a scalar, so the engine
    // verifies the COUNTUNIQUE equivalent instead.
    verification: {
      sheets: {
        Sheet1: [
          ["Customer", "Unique"],
          ["Acme Co", "=COUNTUNIQUE(A2:A7)"],
          ["Borealis", null],
          ["Acme Co", null],
          ["Cobalt", null],
          ["Borealis", null],
          ["Acme Co", null],
        ],
      },
      expect: [{ cell: "B2", value: 3 }],
    },
  },
];
