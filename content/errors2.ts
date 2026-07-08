import type { Formula } from "@/lib/schema";

export const errorFixes2: Formula[] = [
  {
    slug: "fix-name-error",
    kind: "error-fix",
    title: "Fix the #NAME? Error",
    seoTitle: "How to Fix #NAME? in Excel & Google Sheets",
    description:
      "#NAME? means the spreadsheet doesn't recognize something you typed — a misspelled function, text without quotes, or an undefined name.",
    category: "error-fixes",
    difficulty: "beginner",
    functions: ["VLOOKUP", "IF"],
    keywords: ["#name", "name error", "misspelled function", "vlookup not recognized", "formula not working", "unknown function"],
    problem:
      "You type a formula you've used a hundred times, press Enter, and get #NAME? instead of a result — the spreadsheet is acting like the function doesn't exist.",
    quickFormula: '=VLOOKUP(A2,Sheet2!A:B,2,FALSE)',
    excelFormula: '=VLOOKUP(A2,Sheet2!A:B,2,FALSE)',
    sheetsFormula: null,
    explanation:
      "#NAME? means the spreadsheet found a word in your formula it doesn't recognize. The most common cause is a typo in the function name — =VLOKUP instead of =VLOOKUP — because a misspelled function simply doesn't exist. The second is text without quotes: =IF(A2=High,1,0) makes the sheet hunt for a named range called High, fail, and error out. The third is a named range that was deleted or never defined. And in Excel specifically, a fourth: the function isn't available in your version — XLOOKUP, FILTER, and TEXTSPLIT need Excel 365 or 2021, so opening the file in Excel 2019 turns them into #NAME?. Read the formula character by character; the unrecognized word is your answer.",
    steps: [
      { part: "VLOOKUP", meaning: "Spelled exactly right. =VLOKUP or =VLOOOKUP is a nonexistent function, which is the #1 cause of #NAME?." },
      { part: '"FALSE" vs FALSE', meaning: "TRUE and FALSE need no quotes, but any text value does. =IF(A2=High,…) errors; =IF(A2=\"High\",…) works." },
      { part: "Named ranges", meaning: "If the formula uses a name like TaxRate, confirm it exists: Formulas > Name Manager in Excel, Data > Named ranges in Sheets." },
    ],
    whenToUse:
      "Run this checklist whenever #NAME? appears right after typing a new formula, pasting one from the web, or opening a 365 workbook in an older Excel version.",
    commonMistakes: [
      {
        mistake: "Typing text conditions without quotation marks.",
        fix: '=IF(A2=Complete,1,0) returns #NAME? because Complete looks like an undefined name. Quote it: =IF(A2="Complete",1,0).',
      },
      {
        mistake: "Using XLOOKUP, FILTER, or UNIQUE in Excel 2019 or earlier.",
        fix: "Those functions need Excel 365/2021. On older versions, rebuild with VLOOKUP or INDEX + MATCH, or upgrade.",
      },
      {
        mistake: "Wrapping the formula in IFERROR to hide the #NAME?.",
        fix: "#NAME? is never expected data — it's always a typo or missing definition. Fix the spelling; don't suppress it.",
      },
    ],
    sampleInput: {
      columns: ["Formula", "Result"],
      rows: [
        ['=VLOKUP(A2,Sheet2!A:B,2,FALSE)', "#NAME?"],
        ['=IF(B2=High,1,0)', "#NAME?"],
      ],
    },
    sampleOutput: {
      columns: ["Formula", "Result"],
      rows: [
        ['=VLOOKUP(A2,Sheet2!A:B,2,FALSE)', "Ana Torres"],
        ['=IF(B2="High",1,0)', "1"],
      ],
      highlightColumn: 1,
    },
    related: ["fix-na-error", "vlookup-exact-match", "xlookup-basic-example"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["ID", "Fixed", "Typo", "Status", "Quoted"],
          [
            "E-104",
            "=VLOOKUP(A2,Sheet2!A1:B2,2,FALSE)",
            "=VLOKUP(A2,Sheet2!A1:B2,2,FALSE)",
            "High",
            '=IF(D2="High",1,0)',
          ],
        ],
        Sheet2: [
          ["E-104", "Ana Torres"],
          ["E-221", "Ben Okafor"],
        ],
      },
      expect: [
        { cell: "B2", value: "Ana Torres" },
        { cell: "C2", value: "#NAME?" },
        { cell: "E2", value: 1 },
      ],
    },
  },
  {
    slug: "fix-spill-error",
    kind: "error-fix",
    title: "Fix the #SPILL! Error",
    seoTitle: "How to Fix #SPILL! in Excel & Google Sheets",
    description:
      "#SPILL! means a dynamic array formula needs room to expand but something is blocking it. Clear the cells in its way and it heals itself.",
    category: "error-fixes",
    difficulty: "intermediate",
    functions: ["UNIQUE", "FILTER", "SORT"],
    keywords: ["#spill", "spill error", "dynamic array blocked", "unique not working", "filter spill", "cells in the way"],
    problem:
      "A UNIQUE, FILTER, or SORT formula that should list multiple results shows #SPILL! instead — even though the formula itself is written correctly.",
    quickFormula: '=UNIQUE(A2:A20)',
    excelFormula: '=UNIQUE(A2:A20)',
    sheetsFormula: null,
    explanation:
      "Dynamic array functions like UNIQUE, FILTER, and SORT return many values from one formula, spilling them into the cells below and to the right. #SPILL! means that landing zone isn't empty — even one occupied cell in the way blocks the whole result. The occupant is often invisible: a lone space, an old note, or a leftover formula. In Excel, click the #SPILL! cell and a dashed border outlines the exact range the formula needs; find the non-empty cell inside it and clear it. The formula then spills instantly with no edits needed. A second cause is asking for more room than exists: =UNIQUE(A:A) on a whole column tries to spill a million rows, so reference a bounded range like A2:A20 instead.",
    steps: [
      { part: "UNIQUE(A2:A20)", meaning: "Returns every distinct value in the range, spilling one per row below the formula." },
      { part: "The spill range", meaning: "Click the #SPILL! cell — the dashed outline (Excel) shows exactly which cells must be empty. Clear whatever occupies them." },
      { part: "A2:A20, not A:A", meaning: "A bounded range keeps the spill a predictable size. Whole-column references can demand more rows than the sheet has room for." },
    ],
    whenToUse:
      "Expect #SPILL! whenever you drop a dynamic array formula into a sheet that already has content nearby — dashboards, shared trackers, or any column with stray notes below the data.",
    commonMistakes: [
      {
        mistake: "Deleting the formula and typing results by hand.",
        fix: "The formula is fine — its landing zone isn't. Clear the blocking cells (check for invisible spaces with =LEN) and the spill completes.",
      },
      {
        mistake: "Referencing an entire column like =UNIQUE(A:A).",
        fix: "That asks for up to a million spill rows and can also drag a header like \"Name\" into the results. Use =UNIQUE(A2:A20).",
      },
      {
        mistake: "A stray @ in front of the function.",
        fix: "=@UNIQUE(A2:A20) is the legacy implicit-intersection operator — it forces a single value instead of a spill. Remove the @.",
      },
    ],
    sampleInput: {
      columns: ["Name", "=UNIQUE(A2:A5)"],
      rows: [
        ["Ana Torres", "#SPILL!"],
        ["Ben Okafor", ""],
        ["Ana Torres", "old note"],
        ["Cara Lim", ""],
      ],
    },
    sampleOutput: {
      columns: ["Name", "=UNIQUE(A2:A5)"],
      rows: [
        ["Ana Torres", "Ana Torres"],
        ["Ben Okafor", "Ben Okafor"],
        ["Ana Torres", "Cara Lim"],
        ["Cara Lim", ""],
      ],
      highlightColumn: 1,
    },
    related: ["remove-duplicates", "fix-ref-error", "fix-name-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Customer", "Spill"],
          ["Acme", "=UNIQUE(A2:A5)"],
          ["Borealis", null],
          ["Acme", null],
          ["Cobalt", null],
        ],
      },
      expect: [
        { cell: "B2", value: "Acme" },
        { cell: "B3", value: "Borealis" },
        { cell: "B4", value: "Cobalt" },
      ],
    },
  },
  {
    slug: "fix-num-error",
    kind: "error-fix",
    title: "Fix the #NUM! Error",
    seoTitle: "How to Fix #NUM! in Excel & Google Sheets",
    description:
      "#NUM! means a calculation produced an impossible number — a negative square root, a result too large, or date math that runs backwards.",
    category: "error-fixes",
    difficulty: "intermediate",
    functions: ["SQRT", "IFERROR", "DATEDIF"],
    keywords: ["#num", "num error", "number too large", "negative square root", "irr not converging", "invalid number"],
    problem:
      "A formula that works on most rows returns #NUM! on a few — the math is valid in general, but something about those specific inputs makes it impossible.",
    quickFormula: '=IFERROR(SQRT(A2),"Check input")',
    excelFormula: '=IFERROR(SQRT(A2),"Check input")',
    sheetsFormula: null,
    explanation:
      "#NUM! means the math itself broke: the formula asked for a number that can't exist or can't be represented. The classic causes are taking the square root or logarithm of a negative number, a result beyond the spreadsheet's limits (=1000^1000 overflows), an iterative function like IRR or RATE failing to converge on an answer, or date arithmetic that runs backwards — DATEDIF with an end date before the start date returns #NUM!. So the fix starts with the input, not the formula: find which value is negative, swapped, or out of range and correct it at the source. Wrap in IFERROR only after you've confirmed the bad inputs are legitimate — for example, negative variances where a square root genuinely doesn't apply — because a blanket IFERROR will also hide the rows you'd want to catch.",
    steps: [
      { part: "SQRT(A2)", meaning: "The original calculation. It returns #NUM! whenever A2 is negative, because a real square root of a negative number doesn't exist." },
      { part: 'IFERROR(…, "Check input")', meaning: "Shows a pointed message instead of #NUM! — but only add this after confirming negative inputs are expected in your data." },
      { part: "IRR / RATE guesses", meaning: "If a financial function won't converge, supply a starting guess: =IRR(B2:B10,0.1) often resolves #NUM! instantly." },
    ],
    whenToUse:
      "Diagnose #NUM! whenever root, log, or power formulas hit negative or huge values, when IRR or RATE won't converge, or when date subtraction has start and end reversed.",
    commonMistakes: [
      {
        mistake: "Blanketing every row with IFERROR before diagnosing.",
        fix: "If A2 should never be negative, #NUM! just caught a data-entry error. Investigate first; suppress only inputs you've confirmed are legitimate.",
      },
      {
        mistake: "Swapped start and end dates in DATEDIF.",
        fix: '=DATEDIF(B2,A2,"D") errors when B2 is the later date. Put the earlier date first: =DATEDIF(A2,B2,"D").',
      },
      {
        mistake: "Treating a non-converging IRR as broken data.",
        fix: "IRR needs at least one negative and one positive cash flow, and sometimes a guess. Check the signs, then try =IRR(range,0.1).",
      },
    ],
    sampleInput: {
      columns: ["Value", "SQRT"],
      rows: [
        ["16", "4"],
        ["-9", "#NUM!"],
      ],
    },
    sampleOutput: {
      columns: ["Value", "Result"],
      rows: [
        ["16", "4"],
        ["-9", "Check input"],
      ],
      highlightColumn: 1,
    },
    related: ["fix-value-error", "fix-div0-error", "calculate-days-overdue"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Value", "SQRT", "Guarded"],
          [-4, "=SQRT(A2)", '=IFERROR(SQRT(A2),"Check input")'],
          [9, "=SQRT(A3)", '=IFERROR(SQRT(A3),"Check input")'],
        ],
      },
      expect: [
        { cell: "B2", value: "#NUM!" },
        { cell: "C2", value: "Check input" },
        { cell: "B3", value: 3 },
        { cell: "C3", value: 3 },
      ],
    },
  },
];
