import type { Formula } from "@/lib/schema";

export const errorFixes: Formula[] = [
  {
    slug: "fix-na-error",
    kind: "error-fix",
    title: "Fix the #N/A Error",
    seoTitle: "How to Fix #N/A in Excel & Google Sheets",
    description:
      "#N/A means your lookup found no match. Here's why it happens — usually invisible spaces or missing values — and how to fix or handle it.",
    category: "error-fixes",
    difficulty: "beginner",
    functions: ["IFERROR", "VLOOKUP", "TRIM"],
    keywords: ["#n/a", "na error", "not available", "vlookup not working", "lookup no match", "iferror"],
    problem:
      "Your VLOOKUP, XLOOKUP, or MATCH returns #N/A even though you can see the value sitting right there in the lookup table.",
    quickFormula: '=IFERROR(VLOOKUP(A2,Sheet2!A:B,2,FALSE),"Not found")',
    excelFormula: '=IFERROR(VLOOKUP(A2,Sheet2!A:B,2,FALSE),"Not found")',
    sheetsFormula: null,
    explanation:
      "#N/A literally means \"no match found.\" Either the value genuinely isn't in the lookup column, or — far more often — it is there but doesn't match exactly: a trailing space, a number stored as text, or different capitalization of an ID. First diagnose which case you have. If missing values are expected and you just want a clean sheet, wrap the lookup in IFERROR to show a friendly message instead. But don't reach for IFERROR first — it hides real data problems as happily as expected ones.",
    steps: [
      { part: "VLOOKUP(A2,Sheet2!A:B,2,FALSE)", meaning: "The original lookup, unchanged." },
      { part: "IFERROR(…, \"Not found\")", meaning: "If the lookup errors, show \"Not found\" instead of #N/A." },
    ],
    whenToUse:
      "Use IFERROR when missing matches are legitimate — new records, optional data. Fix the underlying data instead when every value should have a match.",
    commonMistakes: [
      {
        mistake: "Invisible spaces in the lookup value or table.",
        fix: '"E-104 " won\'t match "E-104". Test with =TRIM(A2)=TRIM(Sheet2!A5), then clean both sides with TRIM.',
      },
      {
        mistake: "Numbers stored as text on one side.",
        fix: "The number 104 never matches the text \"104\". Convert with VALUE(), or multiply the text column by 1.",
      },
      {
        mistake: "Wrapping everything in IFERROR to make errors disappear.",
        fix: "IFERROR also hides typos and broken references. Diagnose first; suppress only expected misses.",
      },
    ],
    sampleInput: {
      columns: ["Lookup ID", "Result"],
      rows: [
        ["E-104", "Ana Torres"],
        ["E-999", "#N/A"],
      ],
    },
    sampleOutput: {
      columns: ["Lookup ID", "Result"],
      rows: [
        ["E-104", "Ana Torres"],
        ["E-999", "Not found"],
      ],
      highlightColumn: 1,
    },
    related: ["vlookup-exact-match", "xlookup-basic-example", "remove-extra-spaces"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Lookup ID", "Result"],
          ["E-104", '=IFERROR(VLOOKUP(A2,Sheet2!A1:B2,2,FALSE),"Not found")'],
          ["E-999", '=IFERROR(VLOOKUP(A3,Sheet2!A1:B2,2,FALSE),"Not found")'],
        ],
        Sheet2: [
          ["E-104", "Ana Torres"],
          ["E-221", "Ben Okafor"],
        ],
      },
      expect: [
        { cell: "B2", value: "Ana Torres" },
        { cell: "B3", value: "Not found" },
      ],
    },
  },
  {
    slug: "fix-value-error",
    kind: "error-fix",
    title: "Fix the #VALUE! Error",
    seoTitle: "How to Fix #VALUE! in Excel & Google Sheets",
    description:
      "#VALUE! means a formula got the wrong type of data — usually text where a number should be. Here's how to find the culprit cell and fix it.",
    category: "error-fixes",
    difficulty: "beginner",
    functions: ["VALUE", "ISNUMBER", "IFERROR"],
    keywords: ["#value", "value error", "wrong data type", "text instead of number", "cannot calculate"],
    problem:
      "A calculation that should be simple — a subtraction, a multiplication — returns #VALUE!, and the cells involved look perfectly normal.",
    quickFormula: "=ISNUMBER(B2)",
    excelFormula: "=ISNUMBER(B2)",
    sheetsFormula: null,
    explanation:
      "#VALUE! appears when a formula receives the wrong kind of data — most often text where it expected a number or date. The text can be invisible: a number with a stray space (\"42 \"), a date typed as \"July 8\", or an empty-looking cell that actually contains a space. The quick diagnostic is ISNUMBER: point it at each input cell, and the one that says FALSE is your culprit. Then fix the source — convert text numbers with VALUE(), re-enter text dates as real dates, and clear cells that hold lone spaces.",
    steps: [
      { part: "ISNUMBER(B2)", meaning: "Diagnostic: returns FALSE if B2 holds text pretending to be a number or date." },
      { part: "=VALUE(B2)", meaning: "Fix: converts a text number like \"42\" into the real number 42." },
    ],
    whenToUse:
      "Reach for this diagnosis whenever arithmetic or date math errors out right after importing or pasting data — imports are the number-one source of text-formatted numbers.",
    commonMistakes: [
      {
        mistake: "Fixing the formula when the data is the problem.",
        fix: "Rewriting the formula won't help if B2 holds text. Diagnose inputs with ISNUMBER first, then clean the data.",
      },
      {
        mistake: "A cell that looks empty but contains a space.",
        fix: 'Arithmetic on " " gives #VALUE!. Select the cell and press Delete, or check with =LEN(B2).',
      },
      {
        mistake: "Suppressing it with IFERROR and moving on.",
        fix: "=IFERROR(A2*B2,\"\") blanks the error but your totals are now silently missing rows. Fix the source data.",
      },
    ],
    sampleInput: {
      columns: ["Qty", "Price", "Total"],
      rows: [
        ["3", "4.50", "13.50"],
        ["2 ", "12.00", "#VALUE!"],
      ],
    },
    sampleOutput: {
      columns: ["Check", "Result"],
      rows: [
        ["=ISNUMBER(A2)", "TRUE"],
        ["=ISNUMBER(A3)", "FALSE"],
      ],
      highlightColumn: 1,
    },
    related: ["fix-na-error", "remove-extra-spaces", "calculate-days-overdue"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Qty", "IsNumber", "Fixed"],
          [3, "=ISNUMBER(A2)", null],
          ["x2", "=ISNUMBER(A3)", null],
          ["42", "=ISNUMBER(A4)", "=VALUE(A4)*2"],
        ],
      },
      expect: [
        { cell: "B2", value: true },
        { cell: "B3", value: false },
        { cell: "C4", value: 84 },
      ],
    },
  },
  {
    slug: "fix-ref-error",
    kind: "error-fix",
    title: "Fix the #REF! Error",
    seoTitle: "How to Fix #REF! in Excel & Google Sheets",
    description:
      "#REF! means a formula points at cells that no longer exist — usually after deleting rows or columns. Here's how to repair and prevent it.",
    category: "error-fixes",
    difficulty: "intermediate",
    functions: ["INDEX", "MATCH", "VLOOKUP"],
    keywords: ["#ref", "ref error", "broken reference", "deleted column", "deleted row", "invalid reference"],
    problem:
      "Formulas that worked yesterday now show #REF! — typically right after someone deleted a row, column, or sheet the formulas depended on.",
    quickFormula: "=INDEX(Data!C:C,MATCH(A2,Data!A:A,0))",
    excelFormula: "=INDEX(Data!C:C,MATCH(A2,Data!A:A,0))",
    sheetsFormula: null,
    explanation:
      "#REF! means the cells a formula referenced were deleted, so the reference itself is destroyed — you'll see it embedded in the formula, like =VLOOKUP(A2,#REF!,3,FALSE). There's nothing left to point at, so the fix is to restore or re-point. If the deletion just happened, undo (Ctrl+Z / Cmd+Z) brings everything back. Otherwise, edit the formula and rebuild the broken reference to where the data lives now. To prevent the next occurrence, prefer structures that survive deletion: INDEX + MATCH references the lookup and return columns directly, so deleting an unrelated column between them breaks nothing — unlike VLOOKUP's positional column number.",
    steps: [
      { part: "Undo first", meaning: "If the deletion is recent, Ctrl+Z restores the cells and every formula heals itself." },
      { part: "Find #REF! inside the formula", meaning: "The broken argument shows exactly which reference was destroyed — retype it to point at the data's new home." },
      { part: "INDEX + MATCH", meaning: "Prevention: names each column explicitly, so deleting other columns can't break the lookup." },
    ],
    whenToUse:
      "Follow this recovery path whenever #REF! appears after restructuring a sheet — and switch high-value lookups to INDEX + MATCH or XLOOKUP so the next cleanup doesn't break them.",
    commonMistakes: [
      {
        mistake: "Deleting whole columns to remove unwanted data.",
        fix: "Deleting the column destroys every reference into it. Clear the contents instead (Delete key), or hide the column.",
      },
      {
        mistake: "Copying a formula with relative references to a place they can't reach.",
        fix: "Pasting =A1-B1 into row 1's neighbor can push references off the sheet edge, causing #REF!. Anchor with $ before copying.",
      },
      {
        mistake: "Rebuilding the formula but keeping VLOOKUP's fragile column number.",
        fix: "The repaired VLOOKUP breaks again on the next column deletion. Rebuild with XLOOKUP or INDEX + MATCH instead.",
      },
    ],
    sampleInput: {
      columns: ["Formula", "Result"],
      rows: [["=VLOOKUP(A2,#REF!,3,FALSE)", "#REF!"]],
    },
    sampleOutput: {
      columns: ["Formula", "Result"],
      rows: [["=INDEX(Data!C:C,MATCH(A2,Data!A:A,0))", "Ana Torres"]],
      highlightColumn: 1,
    },
    related: ["index-match-lookup", "xlookup-basic-example", "fix-na-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["ID", "Name"],
          ["E-221", "=INDEX(Data!C1:C2,MATCH(A2,Data!A1:A2,0))"],
        ],
        Data: [
          ["E-104", "Sales", "Ana Torres"],
          ["E-221", "Finance", "Ben Okafor"],
        ],
      },
      expect: [{ cell: "B2", value: "Ben Okafor" }],
    },
  },
  {
    slug: "fix-div0-error",
    kind: "error-fix",
    title: "Fix the #DIV/0! Error",
    seoTitle: "How to Fix #DIV/0! in Excel & Google Sheets",
    description:
      "#DIV/0! means you divided by zero or by an empty cell. Guard the division with IF so averages and rates stay clean.",
    category: "error-fixes",
    difficulty: "beginner",
    functions: ["IF", "IFERROR"],
    keywords: ["#div/0", "divide by zero", "division error", "average error", "empty denominator"],
    problem:
      "A rate, average, or percentage column shows #DIV/0! — usually in rows where the denominator hasn't been filled in yet.",
    quickFormula: '=IF(B2=0,"",A2/B2)',
    excelFormula: '=IF(B2=0,"",A2/B2)',
    sheetsFormula: null,
    explanation:
      "Dividing by zero is undefined, and spreadsheets treat an empty cell as zero — so any division whose denominator is blank or 0 returns #DIV/0!. The clean fix is to check the denominator before dividing: IF(B2=0,\"\",A2/B2) shows an empty cell when there's nothing valid to divide by, and the real result otherwise. This is better than blanket IFERROR, which would also hide genuinely broken numerators. The same error appears in AVERAGEIF when no rows match the condition — guard those with COUNTIF first or IFERROR deliberately.",
    steps: [
      { part: "B2=0", meaning: "Checks the denominator. Blank cells count as 0, so this catches both." },
      { part: '""', meaning: "What to show when division isn't possible — an empty cell. Use 0 or \"–\" if you prefer." },
      { part: "A2/B2", meaning: "The real division, which now only runs when it's safe." },
    ],
    whenToUse:
      "Guard every division whose denominator comes from data entry — units sold, headcounts, response counts — since those columns inevitably have blank or zero rows.",
    commonMistakes: [
      {
        mistake: "Returning 0 when division was impossible.",
        fix: "A 0% rate and \"no data yet\" mean different things. Return \"\" or \"–\" so downstream averages aren't dragged down by fake zeros.",
      },
      {
        mistake: "Using IFERROR instead of checking the denominator.",
        fix: "IFERROR(A2/B2,\"\") also hides a #VALUE! from a text numerator. Guard the specific condition you expect: IF(B2=0,…).",
      },
    ],
    sampleInput: {
      columns: ["Revenue", "Units", "Per Unit"],
      rows: [
        ["2800", "140", "20.00"],
        ["1600", "0", "#DIV/0!"],
      ],
    },
    sampleOutput: {
      columns: ["Revenue", "Units", "Per Unit"],
      rows: [
        ["2800", "140", "20.00"],
        ["1600", "0", ""],
      ],
      highlightColumn: 2,
    },
    related: ["calculate-completion-percentage", "fix-value-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Revenue", "Units", "Guarded", "Naive"],
          [2800, 140, '=IF(B2=0,"",A2/B2)', "=A2/B2"],
          [1600, 0, '=IF(B3=0,"",A3/B3)', "=A3/B3"],
        ],
      },
      expect: [
        { cell: "C2", value: 20 },
        { cell: "D2", value: 20 },
        { cell: "C3", value: "" },
        { cell: "D3", value: "#DIV/0!" },
      ],
    },
  },
];
