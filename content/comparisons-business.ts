import type { Formula } from "@/lib/schema";

export const comparisonsBusinessFormulas: Formula[] = [
  {
    slug: "xlookup-vs-vlookup",
    kind: "formula",
    title: "XLOOKUP vs VLOOKUP: Which Lookup to Use",
    seoTitle: "XLOOKUP vs VLOOKUP in Excel & Google Sheets",
    description:
      "Both pull a matching value from another table — XLOOKUP does it with safer defaults. Here's when each one wins, and the traps when you switch.",
    category: "lookup-matching",
    difficulty: "intermediate",
    functions: ["XLOOKUP", "VLOOKUP"],
    keywords: ["xlookup vs vlookup", "difference between xlookup and vlookup", "which lookup to use", "replace vlookup", "xlookup or vlookup"],
    problem:
      "You need to pull a price, customer, or status from another table, and every guide shows two different formulas. Which lookup should you actually use — and does the old one still matter?",
    quickFormula: "=XLOOKUP(E2,A2:A5,C2:C5)",
    excelFormula: "=XLOOKUP(E2,A2:A5,C2:C5)",
    sheetsFormula: null,
    explanation:
      "XLOOKUP searches A2:A5 for the value in E2 and returns whatever sits in the same row of C2:C5 — the same answer =VLOOKUP(E2,A2:C5,3,FALSE) gives, with three fewer ways to get it wrong. Exact match is XLOOKUP's default, so there's no FALSE argument to forget; VLOOKUP without FALSE silently returns wrong values on unsorted data. XLOOKUP can look left — the return column can sit anywhere relative to the search column, while VLOOKUP only reads to the right of column one. And because XLOOKUP takes a return range instead of a counted column number, inserting a column never breaks it. The one reason VLOOKUP still matters: XLOOKUP needs Excel 2021/365 or Google Sheets, so files shared with older Excel still need VLOOKUP or INDEX+MATCH.",
    steps: [
      { part: "E2", meaning: "The value to find — a SKU, invoice number, or customer name." },
      { part: "A2:A5", meaning: "The column to search. Unlike VLOOKUP, it doesn't have to be the leftmost column." },
      { part: "C2:C5", meaning: "The column to return from — pointed at directly, no column counting." },
    ],
    whenToUse:
      "Default to XLOOKUP in Excel 2021+, Microsoft 365, and Google Sheets. Reach for VLOOKUP only when the file must open cleanly in Excel 2019 or older — where XLOOKUP shows #NAME?.",
    commonMistakes: [
      {
        mistake: "Adding FALSE to XLOOKUP out of VLOOKUP habit.",
        fix: 'XLOOKUP\'s fourth argument is the if-not-found value, not a match mode. =XLOOKUP(E2,A2:A5,C2:C5,FALSE) shows FALSE when there\'s no match. Use text there instead: =XLOOKUP(E2,A2:A5,C2:C5,"Not found").',
      },
      {
        mistake: "Keeping the column-number habit.",
        fix: "XLOOKUP wants a return range, not an index. =XLOOKUP(E2,A2:A5,3) fails — point at the column: =XLOOKUP(E2,A2:A5,C2:C5).",
      },
      {
        mistake: "Converting a shared workbook and breaking it for old-Excel users.",
        fix: "Anyone on Excel 2019 or older sees #NAME? on every XLOOKUP. If the file circulates outside your team, keep VLOOKUP with FALSE, or use INDEX+MATCH.",
      },
    ],
    sampleInput: {
      columns: ["SKU", "Product", "Price"],
      rows: [
        ["A-102", "Desk Lamp", "34"],
        ["A-205", "Office Chair", "189"],
        ["B-310", "Monitor Stand", "35"],
      ],
    },
    sampleOutput: {
      columns: ["Lookup", "XLOOKUP", "VLOOKUP"],
      rows: [
        ["B-310", "35", "35"],
        ["A-205", "189", "189"],
      ],
      highlightColumn: 1,
    },
    related: ["xlookup-basic-example", "vlookup-exact-match", "index-match-lookup", "vlookup-returns-wrong-value"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["SKU", "Product", "Price", null, "Lookup", "XLOOKUP", "VLOOKUP"],
          ["A-102", "Desk Lamp", 34, null, "B-310", "=XLOOKUP(E2,A2:A5,C2:C5)", "=VLOOKUP(E2,A2:C5,3,FALSE)"],
          ["A-205", "Office Chair", 189, null, "A-205", "=XLOOKUP(E3,A2:A5,C2:C5)", "=VLOOKUP(E3,A2:C5,3,FALSE)"],
          ["B-310", "Monitor Stand", 35, null, null, null, null],
          ["C-118", "Keyboard", 49, null, null, null, null],
        ],
      },
      expect: [
        { cell: "F2", value: 35 },
        { cell: "G2", value: 35 },
        { cell: "F3", value: 189 },
        { cell: "G3", value: 189 },
      ],
    },
  },
  {
    slug: "countif-vs-countifs",
    kind: "formula",
    title: "COUNTIF vs COUNTIFS: One Condition or Many",
    seoTitle: "COUNTIF vs COUNTIFS (Excel & Google Sheets)",
    description:
      "COUNTIF counts rows matching one condition; COUNTIFS handles any number — and works identically with one, so many people just always use COUNTIFS.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["COUNTIF", "COUNTIFS"],
    keywords: ["countif vs countifs", "difference between countif and countifs", "count with multiple criteria", "countifs one condition", "count orders by region"],
    problem:
      "You're counting rows in an order log — how many from the East region, then how many from East over $1,000 — and it's unclear whether you need COUNTIF, COUNTIFS, or both.",
    quickFormula: '=COUNTIFS(A2:A50,"East",B2:B50,">1000")',
    excelFormula: '=COUNTIFS(A2:A50,"East",B2:B50,">1000")',
    sheetsFormula: null,
    explanation:
      "COUNTIF takes exactly one range and one condition: =COUNTIF(A2:A50,\"East\") counts East orders and that's all it can do. COUNTIFS takes range/condition pairs — as many as you need — and only counts rows where every pair matches, so the formula above counts orders that are East AND over $1,000. With a single pair, COUNTIFS gives exactly the same answer as COUNTIF, which is why a common piece of advice is to just always use COUNTIFS: you never rewrite the formula when a second condition shows up. Both functions accept the same condition syntax — text, \">1000\", \"<>\", and wildcards like \"A*\".",
    steps: [
      { part: 'A2:A50,"East"', meaning: "First pair: the region column and the value it must equal." },
      { part: 'B2:B50,">1000"', meaning: "Second pair: the amount column and its condition. Operators go inside quotes." },
    ],
    whenToUse:
      "Use COUNTIFS for any conditional count in an order log, pipeline, or invoice list — one condition or five. COUNTIF only earns its place inside legacy formulas you're maintaining.",
    commonMistakes: [
      {
        mistake: "Stuffing a second condition into COUNTIF.",
        fix: '=COUNTIF(A2:A50,"East",B2:B50,">1000") is an error — COUNTIF stops at one condition. Switch the name to COUNTIFS; the pairs are already in the right order.',
      },
      {
        mistake: "Criteria ranges of different sizes.",
        fix: 'COUNTIFS(A2:A50,"East",B2:B999,">1000") returns #VALUE!. Every range must cover exactly the same rows.',
      },
      {
        mistake: "Expecting OR logic from the pairs.",
        fix: 'COUNTIFS conditions are AND — every one must hold. For East OR West, add two counts: =COUNTIF(A2:A50,"East")+COUNTIF(A2:A50,"West").',
      },
    ],
    sampleInput: {
      columns: ["Region", "Amount"],
      rows: [
        ["East", "1200"],
        ["West", "800"],
        ["East", "450"],
        ["East", "2000"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [
        ["East orders (COUNTIF)", "3"],
        ["East over $1,000 (COUNTIFS)", "2"],
      ],
      highlightColumn: 1,
    },
    related: ["count-if-multiple-conditions", "count-if-status-complete", "sum-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Region", "Amount", "COUNTIF", "COUNTIFS"],
          ["East", 1200, '=COUNTIF(A2:A5,"East")', '=COUNTIFS(A2:A5,"East",B2:B5,">1000")'],
          ["West", 800, null, '=COUNTIFS(A2:A5,"East")'],
          ["East", 450, null, null],
          ["East", 2000, null, null],
        ],
      },
      expect: [
        { cell: "C2", value: 3 },
        { cell: "D2", value: 2 },
        { cell: "D3", value: 3 },
      ],
    },
  },
  {
    slug: "sumif-vs-sumifs",
    kind: "formula",
    title: "SUMIF vs SUMIFS: The Argument-Order Trap",
    seoTitle: "SUMIF vs SUMIFS: Argument Order (Excel & Sheets)",
    description:
      "SUMIF puts the sum range LAST; SUMIFS puts it FIRST. That reversal is the single biggest source of broken conditional totals — here's both patterns.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["SUMIF", "SUMIFS"],
    keywords: ["sumif vs sumifs", "sumifs argument order", "sum range first or last", "difference between sumif and sumifs", "sum by region"],
    problem:
      "You total East region sales with SUMIF, then add a second condition, rearrange it into SUMIFS — and get zero or a #VALUE! error, because the two functions want their arguments in opposite orders.",
    quickFormula: '=SUMIFS(B2:B50,A2:A50,"East",B2:B50,">1000")',
    excelFormula: '=SUMIFS(B2:B50,A2:A50,"East",B2:B50,">1000")',
    sheetsFormula: null,
    explanation:
      "SUMIF reads: where to look, what to match, what to add — =SUMIF(A2:A50,\"East\",B2:B50) puts the sum range last. SUMIFS reverses it: the sum range comes FIRST, followed by range/condition pairs — =SUMIFS(B2:B50,A2:A50,\"East\"). Both of those return the identical East total; SUMIFS just keeps accepting more pairs, and every pair must match (AND logic). The reversal exists because SUMIF's sum range is optional while SUMIFS takes unlimited pairs, but the practical effect is that copying SUMIF's order into SUMIFS sums the wrong column or errors out. Standardizing on SUMIFS for every conditional total means one argument order to remember.",
    steps: [
      { part: "B2:B50", meaning: "The numbers to add — FIRST in SUMIFS, last in SUMIF." },
      { part: 'A2:A50,"East"', meaning: "First condition pair: region must equal East." },
      { part: 'B2:B50,">1000"', meaning: "Second pair: only orders over $1,000. Add more pairs as needed." },
    ],
    whenToUse:
      "Use it to total deals by region, invoices by customer, or hours by project — and the moment a boss adds \"but only over $1,000,\" you just append a pair instead of rewriting.",
    commonMistakes: [
      {
        mistake: "Porting SUMIF's argument order into SUMIFS.",
        fix: '=SUMIFS(A2:A50,"East",B2:B50) follows SUMIF\'s order and breaks — SUMIFS wants the sum range first: =SUMIFS(B2:B50,A2:A50,"East").',
      },
      {
        mistake: "Adding a second condition to SUMIF.",
        fix: "SUMIF physically can't take two conditions. Don't nest or chain it — switch to SUMIFS and move the sum range to the front.",
      },
      {
        mistake: "Sum range and criteria ranges of different sizes.",
        fix: '=SUMIFS(B2:B50,A2:A999,"East") returns #VALUE!. Every range must span exactly the same rows.',
      },
    ],
    sampleInput: {
      columns: ["Region", "Amount"],
      rows: [
        ["East", "1200"],
        ["West", "800"],
        ["East", "450"],
        ["East", "2000"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [
        ["East total (SUMIF or SUMIFS)", "3650"],
        ["East over $1,000 (SUMIFS)", "3200"],
      ],
      highlightColumn: 1,
    },
    related: ["sum-if-multiple-conditions", "count-if-multiple-conditions", "average-by-category"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Region", "Amount", "SUMIF", "SUMIFS"],
          ["East", 1200, '=SUMIF(A2:A5,"East",B2:B5)', '=SUMIFS(B2:B5,A2:A5,"East")'],
          ["West", 800, null, '=SUMIFS(B2:B5,A2:A5,"East",B2:B5,">1000")'],
          ["East", 450, null, null],
          ["East", 2000, null, null],
        ],
      },
      expect: [
        { cell: "C2", value: 3650 },
        { cell: "D2", value: 3650 },
        { cell: "D3", value: 3200 },
      ],
    },
  },
  {
    slug: "calculate-sales-tax",
    kind: "formula",
    title: "Calculate Sales Tax on an Order",
    seoTitle: "Sales Tax Formula (Excel & Google Sheets)",
    description:
      "Multiply the subtotal by the rate for the tax amount, or by one-plus-the-rate for the total — plus the formula that backs tax out of a total.",
    category: "small-business",
    difficulty: "beginner",
    functions: [],
    keywords: ["sales tax formula", "add tax in excel", "calculate tax on invoice", "total with tax", "remove tax from total", "pre-tax amount"],
    problem:
      "Your invoice sheet has order subtotals and you need the sales tax and the tax-included total for each one — say at an 8% rate — without a calculator on your desk.",
    quickFormula: "=B2*0.08",
    excelFormula: "=B2*0.08",
    sheetsFormula: null,
    explanation:
      "Multiplying the subtotal by the rate gives the tax itself: a $250 order at 8% owes $20. For the total in one step, multiply by one plus the rate — =B2*(1+0.08) gives $270, because 1 covers the original amount and 0.08 adds the tax on top. The reverse question comes up just as often: a card reader hands you a tax-included $270 and you need the pre-tax amount for your books. Divide by one plus the rate — =B2/(1+0.08) returns exactly $250. Subtracting 8% from the total does NOT work, because the 8% was charged on the smaller pre-tax amount, not on the total.",
    steps: [
      { part: "B2", meaning: "The order subtotal, before tax." },
      { part: "0.08", meaning: "The tax rate as a decimal — 8%. Better: put the rate in a cell and reference it as $E$1." },
    ],
    whenToUse:
      "Use it on invoice sheets, quote calculators, and daily sales logs — anywhere you charge tax on orders, or need to strip tax out of card-reader totals for bookkeeping.",
    commonMistakes: [
      {
        mistake: "Backing tax out of a total by subtracting the rate.",
        fix: "=B2*(1-0.08) on a $270 total gives $248.40, not the true $250 — the tax was 8% of the pre-tax amount, not of the total. Divide instead: =B2/(1+0.08).",
      },
      {
        mistake: "Typing the rate as 8 instead of 0.08.",
        fix: "=B2*8 charges 800% tax. Use the decimal (0.08) or the percent sign (8%) — both work.",
      },
      {
        mistake: "Hardcoding the rate into fifty formulas.",
        fix: "When the rate changes you'll edit every cell. Put 8% in one cell and reference it: =B2*$E$1. One edit updates the whole sheet.",
      },
    ],
    sampleInput: {
      columns: ["Order", "Subtotal"],
      rows: [
        ["INV-1042", "250.00"],
        ["INV-1043", "89.50"],
      ],
    },
    sampleOutput: {
      columns: ["Order", "Subtotal", "Tax (8%)", "Total"],
      rows: [
        ["INV-1042", "250.00", "20.00", "270.00"],
        ["INV-1043", "89.50", "7.16", "96.66"],
      ],
      highlightColumn: 3,
    },
    related: ["calculate-profit-margin", "calculate-invoice-due-date", "calculate-percentage-of-total"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Order", "Amount", "Tax", "Total"],
          ["INV-1042", 250, "=B2*0.08", "=B2*(1+0.08)"],
          ["INV-1043", 89.5, "=B3*0.08", "=B3*(1+0.08)"],
          ["Back out pre-tax", 270, "=B4/(1+0.08)", null],
        ],
      },
      expect: [
        { cell: "C2", value: 20 },
        { cell: "D2", value: 270 },
        { cell: "C3", value: 7.16 },
        { cell: "D3", value: 96.66 },
        { cell: "C4", value: 250 },
      ],
    },
  },
  {
    slug: "calculate-discount-price",
    kind: "formula",
    title: "Calculate a Discounted Price",
    seoTitle: "Discount Price Formula (Excel & Google Sheets)",
    description:
      "Multiply the price by one minus the percent-off to get the sale price — and see why a 20% then 10% discount is not 30% off.",
    category: "small-business",
    difficulty: "beginner",
    functions: [],
    keywords: ["discount formula", "percent off price", "sale price formula", "apply discount in excel", "stacked discounts"],
    problem:
      "You have a price list and a percent-off column — 25% off the desk lamp, 10% off the office chair — and need the sale price for every row of the quote.",
    quickFormula: "=B2*(1-C2)",
    excelFormula: "=B2*(1-C2)",
    sheetsFormula: null,
    explanation:
      "One minus the discount is the fraction of the price the customer still pays: 25% off means paying 75%, so an $80 lamp becomes 80 × 0.75 = $60. Keeping the percent-off in its own cell (C2) means one formula copies down the whole price list, with each row picking up its own discount. Format column C as a percentage so 25% is stored as 0.25 — the math depends on it. When discounts stack, they multiply rather than add: 20% off then an extra 10% off is =B2*(1-0.2)*(1-0.1), which leaves 72% of the price — a 28% total discount, not 30%, because the second discount applies to the already-reduced price.",
    steps: [
      { part: "B2", meaning: "The original price." },
      { part: "(1-C2)", meaning: "The fraction the customer pays — 1 minus the percent-off in C2 (25% → pays 75%)." },
    ],
    whenToUse:
      "Use it on quotes, promo price lists, and clearance sheets — anywhere each product carries its own percent-off and you need the final price the customer sees.",
    commonMistakes: [
      {
        mistake: "Adding stacked discounts together.",
        fix: "20% off then a 10% coupon is not 30% off. On $100: =B2*(1-0.2)*(1-0.1) gives $72, not $70 — the coupon applies to the already-discounted $80. Multiply the discounts, never add them.",
      },
      {
        mistake: "Entering the discount as 25 instead of 25%.",
        fix: "=B2*(1-25) multiplies the price by −24 and the quote goes negative. Store 25% (or 0.25) in the cell, then =B2*(1-C2) works.",
      },
      {
        mistake: "Computing the amount saved when you wanted the price.",
        fix: "=B2*C2 is the discount amount ($20 off), not the sale price. The customer pays =B2*(1-C2), or equivalently =B2-B2*C2.",
      },
    ],
    sampleInput: {
      columns: ["Item", "Price", "Discount"],
      rows: [
        ["Desk Lamp", "80.00", "25%"],
        ["Office Chair", "189.00", "10%"],
      ],
    },
    sampleOutput: {
      columns: ["Item", "Price", "Discount", "Sale Price"],
      rows: [
        ["Desk Lamp", "80.00", "25%", "60.00"],
        ["Office Chair", "189.00", "10%", "170.10"],
      ],
      highlightColumn: 3,
    },
    related: ["calculate-profit-margin", "calculate-percentage-change", "calculate-percentage-of-total"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Item", "Price", "Discount", "Sale Price"],
          ["Desk Lamp", 80, 0.25, "=B2*(1-C2)"],
          ["Office Chair", 189, 0.1, "=B3*(1-C3)"],
          ["Stacked 20% then 10%", 100, null, "=B4*(1-0.2)*(1-0.1)"],
        ],
      },
      expect: [
        { cell: "D2", value: 60 },
        { cell: "D3", value: 170.1 },
        { cell: "D4", value: 72 },
      ],
    },
  },
  {
    slug: "calculate-break-even-point",
    kind: "formula",
    title: "Calculate Your Break-Even Point",
    seoTitle: "Break-Even Point Formula (Excel & Google Sheets)",
    description:
      "Divide fixed costs by price minus variable cost per unit to find how many units you must sell before the business stops losing money.",
    category: "small-business",
    difficulty: "intermediate",
    functions: ["IF"],
    keywords: ["break even formula", "break even point in excel", "contribution margin", "units to break even", "fixed costs vs variable costs"],
    problem:
      "You know your monthly fixed costs, your selling price, and what each unit costs you to make or buy — and you need the number of sales where the business stops losing money.",
    quickFormula: "=B2/(C2-D2)",
    excelFormula: "=B2/(C2-D2)",
    sheetsFormula: null,
    explanation:
      "Price minus variable cost is the contribution margin — the slice of each sale left over after paying for that unit itself, which is the only money available to chip away at rent, salaries, and software. Selling a $50 lamp that costs $30 to make contributes $20; with $12,000 of fixed costs, you need 12,000 ÷ 20 = 600 lamps before the month turns profitable. Every sale past 600 drops that $20 straight into profit. Multiply the break-even units by the price (600 × $50 = $30,000) to get break-even revenue. If the price only just covers the variable cost, the margin is zero, the division blows up with #DIV/0! — and no volume of sales will ever cover your fixed costs.",
    steps: [
      { part: "B2", meaning: "Fixed costs for the period — rent, salaries, insurance: costs that don't change with volume." },
      { part: "C2", meaning: "Selling price per unit." },
      { part: "D2", meaning: "Variable cost per unit — materials, shipping, card fees. C2-D2 is the contribution margin." },
    ],
    whenToUse:
      "Use it when pricing a new product, sizing a monthly sales target, or checking whether a price cut still works — if the margin halves, the units needed to break even double.",
    commonMistakes: [
      {
        mistake: "Price equal to (or below) the variable cost.",
        fix: 'A zero margin gives #DIV/0!, and a negative one gives a meaningless negative answer. Guard it: =IF(C2<=D2,"No margin",B2/(C2-D2)) — and rethink the price.',
      },
      {
        mistake: "Using total variable costs instead of per-unit.",
        fix: "D2 must be the cost of ONE unit. Dividing fixed costs by price minus last month's entire cost of goods produces nonsense — divide that total by units sold first.",
      },
      {
        mistake: "Mixing time periods.",
        fix: "Monthly fixed costs give a monthly break-even; annual costs give an annual one. Pick one period for B2 and read the answer in the same period.",
      },
    ],
    sampleInput: {
      columns: ["Product", "Fixed Costs", "Price", "Unit Cost"],
      rows: [
        ["Desk Lamp", "12000", "50", "30"],
        ["Tote Bag", "9000", "40", "40"],
      ],
    },
    sampleOutput: {
      columns: ["Product", "Break-Even Units"],
      rows: [
        ["Desk Lamp", "600"],
        ["Tote Bag", "No margin"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-profit-margin", "calculate-budget-variance", "fix-div0-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Product", "Fixed", "Price", "Unit Cost", "Break-Even"],
          ["Desk Lamp", 12000, 50, 30, "=B2/(C2-D2)"],
          ["Tote Bag", 9000, 40, 40, '=IF(C3<=D3,"No margin",B3/(C3-D3))'],
          ["Unguarded zero margin", 9000, 40, 40, "=B4/(C4-D4)"],
        ],
      },
      expect: [
        { cell: "E2", value: 600 },
        { cell: "E3", value: "No margin" },
        { cell: "E4", value: "#DIV/0!" },
      ],
    },
  },
];
