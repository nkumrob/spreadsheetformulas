import type { Formula } from "@/lib/schema";

export const excelModernFormulas: Formula[] = [
  {
    slug: "filter-rows-by-condition",
    kind: "formula",
    title: "Filter Rows That Match a Condition",
    seoTitle: "FILTER Rows by Condition (Excel & Google Sheets)",
    description:
      "FILTER returns every row where a condition is true — a live, self-updating extract of the deals, orders, or invoices that match.",
    category: "excel",
    difficulty: "intermediate",
    functions: ["FILTER", "IFNA"],
    keywords: ["filter rows by condition", "filter function", "extract matching rows", "dynamic filter formula", "live filtered list"],
    problem:
      "Your deals table has hundreds of rows and you need just the ones over $1,000 — on another sheet, updating by itself as deals change, not a filtered copy that goes stale the moment someone edits the data.",
    quickFormula: '=FILTER(A2:C10,C2:C10>1000,"No matches")',
    excelFormula: '=FILTER(A2:C10,C2:C10>1000,"No matches")',
    sheetsFormula: "=FILTER(A2:C10,C2:C10>1000)",
    explanation:
      "FILTER returns every row of A2:C10 where the matching row of C2:C10 is over 1,000, spilling the results into the cells below and to the right — one formula, a whole live table that recalculates the moment the source data changes. The third argument is Excel's answer for the empty case: if no row passes, the cell shows \"No matches\" instead of an error. Google Sheets has FILTER too and the first two arguments work identically, but Sheets has no if-empty argument — it treats a third argument as another condition, and when nothing matches it returns #N/A instead. In Sheets, wrap the formula in IFNA to get the same friendly message: =IFNA(FILTER(A2:C10,C2:C10>1000),\"No matches\"). In Excel, FILTER needs 365 or 2021; older versions show #NAME?.",
    steps: [
      { part: "A2:C10", meaning: "The rows to return — all three columns come back for every matching row." },
      { part: "C2:C10>1000", meaning: "The condition, one TRUE/FALSE per row. It must span exactly the same rows as the source range." },
      { part: '"No matches"', meaning: "Excel only: what to show when nothing passes. Sheets doesn't accept this argument — use IFNA there instead." },
    ],
    whenToUse:
      "Use it for live extracts: open deals above a threshold, unpaid invoices, one customer's orders, every project task assigned to one owner — anywhere you'd otherwise re-filter and re-paste each week.",
    commonMistakes: [
      {
        mistake: "Condition and source ranges cover different rows.",
        fix: "=FILTER(A2:C10,C2:C9>1000) returns #VALUE! — the condition spans 8 rows, the source 9. Make both ranges start and end on the same rows.",
      },
      {
        mistake: "Something is sitting in the spill zone.",
        fix: "FILTER needs empty cells below and to the right for its results; even a stray space causes #SPILL!. Clear the landing area.",
      },
      {
        mistake: 'Passing "No matches" as the third argument in Google Sheets.',
        fix: 'Sheets reads it as a second condition and errors. Use =IFNA(FILTER(A2:C10,C2:C10>1000),"No matches") instead.',
      },
      {
        mistake: "#NAME? in Excel 2019 or earlier.",
        fix: "FILTER needs Excel 365 or 2021. On older versions there's no direct equivalent — use a helper column plus sorting, or upgrade.",
      },
    ],
    sampleInput: {
      columns: ["Deal", "Owner", "Value"],
      rows: [
        ["Acme Co", "Ana Torres", "2800"],
        ["Borealis", "Ben Okafor", "950"],
        ["Cobalt", "Cara Lim", "4100"],
        ["Dyna Ltd", "Dana Cruz", "700"],
        ["Everest", "Eli Ford", "1600"],
      ],
    },
    sampleOutput: {
      columns: ["Deal", "Owner", "Value"],
      rows: [
        ["Acme Co", "Ana Torres", "2800"],
        ["Cobalt", "Cara Lim", "4100"],
        ["Everest", "Eli Ford", "1600"],
      ],
      highlightColumn: 2,
    },
    related: ["pull-latest-record", "fix-spill-error", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    // The engine's FILTER requires source and condition arrays of identical
    // shape (no multi-column source with a one-column condition, no if-empty
    // argument), so it verifies the same filter one spilled column at a time.
    verification: {
      sheets: {
        Sheet1: [
          ["Deal", "Owner", "Value", "", "", ""],
          ["Acme Co", "Ana Torres", 2800, "", "=FILTER(A2:A6,C2:C6>1000)", "=FILTER(C2:C6,C2:C6>1000)"],
          ["Borealis", "Ben Okafor", 950, "", null, null],
          ["Cobalt", "Cara Lim", 4100, "", null, null],
          ["Dyna Ltd", "Dana Cruz", 700, "", null, null],
          ["Everest", "Eli Ford", 1600, "", null, null],
        ],
      },
      expect: [
        { cell: "E2", value: "Acme Co" },
        { cell: "E3", value: "Cobalt" },
        { cell: "E4", value: "Everest" },
        { cell: "F2", value: 2800 },
        { cell: "F3", value: 4100 },
        { cell: "F4", value: 1600 },
      ],
    },
  },
  {
    slug: "let-readable-formulas",
    kind: "formula",
    title: "Write Readable Formulas by Naming Values with LET",
    seoTitle: "LET Function: Readable Formulas (Excel & Sheets)",
    description:
      "LET names the moving parts of a formula — define SUM(B2:B10) once as total, then reuse it — so long formulas get readable and faster.",
    category: "excel",
    difficulty: "intermediate",
    functions: ["LET", "SUM", "COUNTA"],
    keywords: ["let function", "name values in formula", "readable formulas", "let excel", "simplify long formula"],
    problem:
      "A formula that repeats the same calculation two or three times is hard to read and easy to break — you edit one copy of the expression, forget the other, and the numbers silently drift apart.",
    quickFormula: "=LET(total,SUM(B2:B10),count,COUNTA(B2:B10),total/count)",
    excelFormula: "=LET(total,SUM(B2:B10),count,COUNTA(B2:B10),total/count)",
    sheetsFormula: null,
    explanation:
      "LET works in name/value pairs: total is defined as SUM(B2:B10), count as COUNTA(B2:B10), and the final argument is the calculation that uses them — total/count, the average order value. Each piece is computed once and reused by name, which makes long formulas dramatically easier to read and often faster, because the spreadsheet no longer recalculates the same expression several times. Names must start with a letter and can't look like a cell reference — dealTotal works, D1 doesn't. LET needs Excel 365 or Excel 2021; anything older shows #NAME?. Google Sheets added LET in 2023 with identical syntax, so current Sheets runs the exact same formula unchanged.",
    steps: [
      { part: "total,SUM(B2:B10)", meaning: "First pair: the name total now stands for the sum of the order values." },
      { part: "count,COUNTA(B2:B10)", meaning: "Second pair: count stands for how many orders there are. Add as many pairs as you need." },
      { part: "total/count", meaning: "The last argument is the result — the calculation, written with the names instead of repeated ranges." },
    ],
    whenToUse:
      "Use it whenever a formula repeats an expression — a lookup used in both an IF test and its result, one total feeding several ratios — or when a formula has grown too dense for the next person to follow.",
    commonMistakes: [
      {
        mistake: "Forgetting the final calculation.",
        fix: "=LET(total,SUM(B2:B10)) errors — LET needs pairs of name/value, then one last unpaired argument that produces the result.",
      },
      {
        mistake: "Naming a value like a cell reference.",
        fix: "=LET(Q1,SUM(B2:B10),Q1*2) fails because Q1 is a cell address. Use words: qtr1Total.",
      },
      {
        mistake: "#NAME? in older versions.",
        fix: "LET needs Excel 365/2021 (Google Sheets has had it since 2023). In Excel 2019 and earlier, the fallback is helper cells.",
      },
    ],
    sampleInput: {
      columns: ["Order", "Value"],
      rows: [
        ["Acme Co", "2800"],
        ["Borealis", "3200"],
        ["Cobalt", "3000"],
      ],
    },
    sampleOutput: {
      columns: ["Metric", "Result"],
      rows: [["Average order value", "3000"]],
      highlightColumn: 1,
    },
    related: ["calculate-weighted-average", "xlookup-basic-example", "fix-name-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: null, // LET is on ENGINE_MISSING — the engine doesn't implement it.
  },
  {
    slug: "sequence-generate-numbers",
    kind: "formula",
    title: "Generate Number Sequences with One Formula",
    seoTitle: "SEQUENCE Formula (Excel & Google Sheets)",
    description:
      "SEQUENCE spills a list of numbers from a single formula — row numbers, invoice numbers, or a date series with any start and step.",
    category: "excel",
    difficulty: "beginner",
    functions: ["SEQUENCE", "DATE"],
    keywords: ["sequence function", "number rows automatically", "generate numbers", "date series formula", "auto numbering"],
    problem:
      "You need numbered rows — invoice lines, order IDs, a 12-week date column for a project plan — and typing 1, 2, 3 then dragging the fill handle breaks the moment rows are added or removed.",
    quickFormula: "=SEQUENCE(10)",
    excelFormula: "=SEQUENCE(10)",
    sheetsFormula: null,
    explanation:
      "=SEQUENCE(10) spills the numbers 1 through 10 into the cells below — one formula owns the whole list, so there's nothing to re-drag when the list changes; edit the formula and it rebuilds. The full form is =SEQUENCE(rows,columns,start,step): =SEQUENCE(10,1,1001,1) numbers invoices from 1001, and =SEQUENCE(12,1,DATE(2026,7,6),7) makes twelve weekly dates starting 6 July — format those cells as dates. Dates work because spreadsheets store them as numbers, so a step of 7 is exactly one week. SEQUENCE needs Excel 365 or 2021; Google Sheets has it with the same arguments.",
    steps: [
      { part: "10", meaning: "How many rows to generate. =SEQUENCE(10) gives 1 through 10, one per row." },
      { part: "columns (optional)", meaning: "=SEQUENCE(2,5) fills 2 rows by 5 columns, counting across each row then down." },
      { part: "start, step (optional)", meaning: "Where to begin and how much to add each time: =SEQUENCE(10,1,1001,1) gives 1001 to 1010." },
    ],
    whenToUse:
      "Use it to number invoice lines and order rows, build a weekly date column for a project schedule, generate month numbers for a forecast, or feed a series into another formula without helper columns.",
    commonMistakes: [
      {
        mistake: "#SPILL! because the landing zone isn't empty.",
        fix: "SEQUENCE needs blank cells below (and to the right, for multiple columns). Clear everything in the range it's trying to fill.",
      },
      {
        mistake: "A date series shows numbers like 46199.",
        fix: "Those are date serial numbers without formatting. Select the spilled cells and apply a date format — the math is already right.",
      },
      {
        mistake: "#NAME? in Excel 2019 or earlier.",
        fix: "SEQUENCE needs Excel 365 or 2021. The old-Excel fallback is =ROW()-1 copied down, which renumbers itself when rows move.",
      },
    ],
    sampleInput: null,
    sampleOutput: {
      columns: ["=SEQUENCE(5)", "=SEQUENCE(5,1,1001,1)"],
      rows: [
        ["1", "1001"],
        ["2", "1002"],
        ["3", "1003"],
        ["4", "1004"],
        ["5", "1005"],
      ],
      highlightColumn: 0,
    },
    related: ["fix-spill-error", "calculate-running-total", "rank-values"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["=SEQUENCE(10)", "=SEQUENCE(10,1,1001,1)", "=SEQUENCE(3,1,DATE(2026,7,6),7)", '=TEXT(C3,"YYYY-MM-DD")'],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
      },
      expect: [
        { cell: "A1", value: 1 },
        { cell: "A5", value: 5 },
        { cell: "A10", value: 10 },
        { cell: "B1", value: 1001 },
        { cell: "B10", value: 1010 },
        { cell: "D1", value: "2026-07-20" },
      ],
    },
  },
  {
    slug: "sumproduct-conditional-math",
    kind: "formula",
    title: "Sum with Conditions and Math Using SUMPRODUCT",
    seoTitle: "SUMPRODUCT Conditional Sums (Excel & Sheets)",
    description:
      "Multiply TRUE/FALSE arrays and SUMPRODUCT adds only the matching rows — OR logic and row-by-row calculations that SUMIFS can't do.",
    category: "excel",
    difficulty: "advanced",
    functions: ["SUMPRODUCT"],
    keywords: ["sumproduct with condition", "sumproduct if", "or logic sum", "conditional sumproduct", "sum with multiple criteria or"],
    problem:
      "You need conditional totals with a twist SUMIFS can't handle — sum the deals matching this region OR that one, or multiply quantity by price row by row while filtering — without adding helper columns.",
    quickFormula: '=SUMPRODUCT((A2:A10="Sales")*(B2:B10))',
    excelFormula: '=SUMPRODUCT((A2:A10="Sales")*(B2:B10))',
    sheetsFormula: null,
    explanation:
      "The comparison (A2:A10=\"Sales\") produces one TRUE or FALSE per row, and multiplying by the values converts TRUE to 1 and FALSE to 0 — so non-matching rows contribute nothing. SUMPRODUCT then adds it all up: the total of column B for Sales rows only. This is the pre-SUMIFS workhorse, and it still does what SUMIFS can't: OR logic by adding conditions — ((A2:A10=\"Sales\")+(A2:A10=\"East\"))*B2:B10 — and calculations inside the sum, like units times price filtered by region, all in one cell. It works identically in every Excel version and in Google Sheets.",
    steps: [
      { part: '(A2:A10="Sales")', meaning: "One TRUE/FALSE per row — TRUE where the region is Sales." },
      { part: "*(B2:B10)", meaning: "Multiplying turns TRUE/FALSE into 1/0 and applies it to each value, zeroing out non-matching rows." },
      { part: "SUMPRODUCT(…)", meaning: "Adds the surviving values into a single total." },
    ],
    whenToUse:
      "Use it for OR-logic totals (Sales or East), sums that need per-row math (units × price by product line), computed conditions like month-of-date tests, or workbooks that must run on any Excel version.",
    commonMistakes: [
      {
        mistake: "Separating a condition with a comma instead of *.",
        fix: '=SUMPRODUCT((A2:A10="Sales"),B2:B10) returns 0 — the comma form doesn\'t convert TRUE/FALSE to numbers. Multiply the arrays, or coerce with a double minus: --(A2:A10="Sales").',
      },
      {
        mistake: "Ranges of different sizes.",
        fix: '=SUMPRODUCT((A2:A10="Sales")*(B2:B9)) returns #VALUE!. Every array must cover exactly the same rows.',
      },
      {
        mistake: "Text sitting in the value column.",
        fix: 'A cell holding "pending" makes the multiplication fail with #VALUE!. Clean the column, or check it with ISNUMBER first.',
      },
      {
        mistake: "Reaching for SUMPRODUCT when SUMIFS is enough.",
        fix: "For plain AND conditions, SUMIFS is faster and easier to read. Keep SUMPRODUCT for OR logic and in-formula math.",
      },
    ],
    sampleInput: {
      columns: ["Region", "Value"],
      rows: [
        ["Sales", "2800"],
        ["East", "950"],
        ["Sales", "4100"],
        ["Ops", "700"],
        ["Sales", "1600"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [
        ["Sales total", "8500"],
        ["Sales OR East total", "9450"],
      ],
      highlightColumn: 1,
    },
    related: ["sum-if-multiple-conditions", "calculate-weighted-average", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    // The formulas are correct as written in Excel and Sheets, but the engine
    // only evaluates range arithmetic inside ARRAYFORMULA, so the grid wraps
    // each SUMPRODUCT in ARRAYFORMULA — the math is otherwise verbatim.
    verification: {
      sheets: {
        Sheet1: [
          ["Region", "Amount", "Result"],
          ["Sales", 2800, '=ARRAYFORMULA(SUMPRODUCT((A2:A6="Sales")*(B2:B6)))'],
          ["East", 950, '=ARRAYFORMULA(SUMPRODUCT(((A2:A6="Sales")+(A2:A6="East"))*B2:B6))'],
          ["Sales", 4100, '=ARRAYFORMULA(SUMPRODUCT((A2:A6="Sales")*(B2:B6>2000)*B2:B6))'],
          ["Ops", 700, null],
          ["Sales", 1600, null],
        ],
      },
      expect: [
        { cell: "C2", value: 8500 },
        { cell: "C3", value: 9450 },
        { cell: "C4", value: 6900 },
      ],
    },
  },
  {
    slug: "switch-replace-nested-ifs",
    kind: "formula",
    title: "Replace Nested IFs with a Clean SWITCH",
    seoTitle: "SWITCH vs Nested IFs (Excel & Google Sheets)",
    description:
      "SWITCH checks one value against a list of exact matches and returns the first hit — flatter and far easier to edit than nested IFs.",
    category: "excel",
    difficulty: "beginner",
    functions: ["SWITCH", "IFS"],
    keywords: ["switch function", "replace nested if", "convert codes to labels", "switch vs ifs", "too many nested ifs"],
    problem:
      "Your pipeline export stores deal stages as single letters — L, Q, W — and translating them with nested IFs leaves you three parentheses deep in =IF(B2=\"L\",\"Lead\",IF(B2=\"Q\",… that nobody wants to edit.",
    quickFormula: '=SWITCH(B2,"L","Lead","Q","Qualified","W","Won","Unknown")',
    excelFormula: '=SWITCH(B2,"L","Lead","Q","Qualified","W","Won","Unknown")',
    sheetsFormula: null,
    explanation:
      "SWITCH takes the value once, then reads match/result pairs left to right: if B2 is L it returns Lead, Q returns Qualified, W returns Won. The lone final argument is the default — anything unmatched shows Unknown instead of erroring. Leave the default off and an unmatched value returns #N/A, so include one whenever the data can contain surprises. SWITCH only does exact matches; for range tests like B2>=90, use IFS, which takes condition/result pairs instead. SWITCH works in Excel 2019 and newer, and in any Google Sheets.",
    steps: [
      { part: "B2", meaning: "The value to test — written once, unlike nested IFs which repeat it in every branch." },
      { part: '"L","Lead"', meaning: "A match/result pair: if the value is exactly L, return Lead. Add as many pairs as you need." },
      { part: '"Unknown"', meaning: "A final unpaired argument is the default. Without it, anything unmatched returns #N/A." },
    ],
    whenToUse:
      "Use it to translate codes into labels — deal stages, order-status letters, shipping-method codes, region abbreviations — anywhere one value maps to one label by exact match.",
    commonMistakes: [
      {
        mistake: "No default on messy data.",
        fix: 'A stage typed as "X" returns #N/A when there\'s no default. End with a catch-all: …,"W","Won","Unknown").',
      },
      {
        mistake: "Using SWITCH for ranges.",
        fix: '=SWITCH(B2>=90,…) compares exact values, not conditions. For thresholds use =IFS(B2>=90,"High",B2>=50,"Medium",TRUE,"Low").',
      },
      {
        mistake: "#NAME? in Excel 2016 or earlier.",
        fix: "SWITCH arrived in Excel 2019. On older versions, fall back to nested IFs or a small VLOOKUP mapping table.",
      },
    ],
    sampleInput: {
      columns: ["Deal", "Stage"],
      rows: [
        ["Acme Co", "W"],
        ["Borealis", "L"],
        ["Cobalt", "Q"],
        ["Dyna Ltd", "X"],
      ],
    },
    sampleOutput: {
      columns: ["Deal", "Stage", "Label"],
      rows: [
        ["Acme Co", "W", "Won"],
        ["Borealis", "L", "Lead"],
        ["Cobalt", "Q", "Qualified"],
        ["Dyna Ltd", "X", "Unknown"],
      ],
      highlightColumn: 2,
    },
    related: ["create-pass-fail-status", "create-status-multiple-conditions", "fix-na-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Stage", "Label"],
          ["L", '=SWITCH(A2,"L","Lead","Q","Qualified","W","Won","Unknown")'],
          ["W", '=SWITCH(A3,"L","Lead","Q","Qualified","W","Won","Unknown")'],
          ["X", '=SWITCH(A4,"L","Lead","Q","Qualified","W","Won","Unknown")'],
          ["Q", '=SWITCH(A5,"L","Lead","Q","Qualified","W","Won")'],
          ["X", '=SWITCH(A6,"L","Lead","Q","Qualified","W","Won")'],
        ],
      },
      expect: [
        { cell: "B2", value: "Lead" },
        { cell: "B3", value: "Won" },
        { cell: "B4", value: "Unknown" },
        { cell: "B5", value: "Qualified" },
        { cell: "B6", value: "#N/A" }, // No default, no match — the documented failure mode.
      ],
    },
  },
  {
    slug: "pmt-loan-payment",
    kind: "formula",
    title: "Calculate a Monthly Loan Payment with PMT",
    seoTitle: "PMT: Loan Payment Formula (Excel & Google Sheets)",
    description:
      "PMT returns the fixed monthly payment on a loan from the rate, term, and amount — the fast answer to what a loan costs per month.",
    category: "finance-business",
    difficulty: "intermediate",
    functions: ["PMT", "ROUND"],
    keywords: ["loan payment formula", "pmt function", "monthly payment", "car loan calculator", "mortgage payment formula", "loan interest cost"],
    problem:
      "You're pricing a $25,000 equipment loan for the business — 6% a year over five years — and need the monthly payment before signing, plus what the loan really costs in interest.",
    quickFormula: "=PMT(6%/12,60,-25000)",
    excelFormula: "=PMT(6%/12,60,-25000)",
    sheetsFormula: null,
    explanation:
      "PMT takes the rate per period, the number of payments, and the loan amount, and returns the fixed payment that pays it off. Two rules do all the work: the rate and the term must share the same time unit — a 6% annual rate becomes 6%/12 per month, and five years becomes 60 monthly payments — and the loan amount goes in negative. That's the cash-flow sign convention: −25,000 is money paid out to you by the lender, so the payment comes back positive. Here that's $483.32 a month; multiply by 60 and subtract the principal and the loan costs $3,999.20 in interest. PMT works identically in every Excel version and in Google Sheets.",
    steps: [
      { part: "6%/12", meaning: "The rate per payment period — the annual rate divided by 12 for monthly payments, never the annual rate raw." },
      { part: "60", meaning: "The total number of payments: 5 years × 12 months." },
      { part: "-25000", meaning: "The loan amount, entered negative because it's cash you receive. That makes the payment show positive." },
    ],
    whenToUse:
      "Use it for equipment and vehicle loans, mortgage estimates, comparing lender offers side by side, or checking a quoted payment before signing. Payment × periods − principal gives the true interest cost.",
    commonMistakes: [
      {
        mistake: "Using the annual rate with monthly payments.",
        fix: "=PMT(6%,60,-25000) charges 6% per month and returns about $1,547 — roughly triple the real payment. Divide the annual rate by 12: 6%/12.",
      },
      {
        mistake: "The payment shows negative.",
        fix: "You entered the loan amount positive: =PMT(6%/12,60,25000) gives −483.32. Enter it as −25000, or wrap the whole formula in a minus.",
      },
      {
        mistake: "Term in years with a monthly rate.",
        fix: "=PMT(6%/12,5,-25000) computes just five payments at a monthly rate. Match the units: 5 years of monthly payments is 60.",
      },
    ],
    sampleInput: {
      columns: ["Input", "Value"],
      rows: [
        ["Loan amount", "25000"],
        ["Annual rate", "6%"],
        ["Term (months)", "60"],
      ],
    },
    sampleOutput: {
      columns: ["Result", "Amount"],
      rows: [
        ["Monthly payment", "483.32"],
        ["Total interest", "3999.20"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-budget-variance", "calculate-profit-margin", "calculate-percentage-change"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Payment", "Rounded", "Total interest"],
          ["=PMT(6%/12,60,-25000)", "=ROUND(PMT(6%/12,60,-25000),2)", "=ROUND(PMT(6%/12,60,-25000)*60-25000,2)"],
        ],
      },
      expect: [
        { cell: "A2", value: 483.32003824 },
        { cell: "B2", value: 483.32 },
        { cell: "C2", value: 3999.2 },
      ],
    },
  },
];
