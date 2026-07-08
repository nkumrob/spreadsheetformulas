import type { Formula } from "@/lib/schema";

export const errorFixes3: Formula[] = [
  {
    slug: "fix-circular-reference",
    kind: "error-fix",
    title: "Fix a Circular Reference",
    seoTitle: "How to Fix Circular References in Excel & Google Sheets",
    description:
      "A circular reference means a formula depends on its own cell, directly or through a chain. Here's how to find the loop and break it.",
    category: "error-fixes",
    difficulty: "intermediate",
    functions: ["SUM"],
    keywords: ["circular reference", "circular dependency", "formula refers to itself", "excel circular warning", "sheets circular error"],
    problem:
      "Excel warns about a circular reference or Google Sheets shows a circular dependency error, and a total that should be simple now shows 0 or refuses to calculate.",
    quickFormula: '=SUM(A2:A10)',
    excelFormula: '=SUM(A2:A10)',
    sheetsFormula: null,
    explanation:
      "A circular reference means a formula's answer depends on itself — the spreadsheet can't finish calculating because the result keeps changing the input. The classic case is putting =SUM(A2:A11) in cell A11: the range includes the total's own cell, so the sum feeds itself. The fix is to end the range one row earlier: =SUM(A2:A10). Loops can also be indirect — A1 refers to B1, which refers back to A1 — which is harder to spot by eye. Excel points you straight to the culprit under Formulas > Error Checking > Circular References, and Google Sheets names the offending cell in its error message. Excel's iterative calculation setting can silence the warning, but it's almost never the right fix — it makes the loop \"converge\" instead of removing it, hiding a structural mistake.",
    steps: [
      { part: "SUM(A2:A10)", meaning: "The corrected range stops at row 10, so the total in A11 no longer includes itself." },
      { part: "Formulas > Error Checking > Circular References", meaning: "Excel lists every cell in the loop — click each one to trace and break the chain." },
      { part: "Sheets error message", meaning: "Google Sheets shows #REF! with \"Circular dependency detected\" and names the cell — start your trace there." },
    ],
    whenToUse:
      "Trace and break the loop whenever the circular warning appears — most often after extending a SUM range over its own total row, or copying formulas into a totals row.",
    commonMistakes: [
      {
        mistake: "Including the total's own cell in the SUM range.",
        fix: "=SUM(A2:A11) placed in A11 sums itself. Stop the range one row above the formula: =SUM(A2:A10).",
      },
      {
        mistake: "Turning on iterative calculation to make the warning go away.",
        fix: "Iteration forces the loop to settle on a number, but the structural error remains and results drift silently. Remove the loop instead.",
      },
      {
        mistake: "Only checking the cell that shows the warning.",
        fix: "In a chain like A1 → B1 → A1, either cell can trigger it. Use Excel's Circular References list to see every link in the loop.",
      },
    ],
    sampleInput: {
      columns: ["Cell", "Formula", "Result"],
      rows: [["A11", '=SUM(A2:A11)', "#REF!"]],
    },
    sampleOutput: {
      columns: ["Cell", "Formula", "Result"],
      rows: [["A11", '=SUM(A2:A10)', "4250"]],
      highlightColumn: 2,
    },
    related: ["fix-ref-error", "calculate-running-total", "fix-na-error"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "fix-formula-parse-error",
    kind: "error-fix",
    title: "Fix the Formula Parse Error in Google Sheets",
    seoTitle: "Fix the Formula Parse Error in Google Sheets",
    description:
      "Google Sheets' formula parse error means the formula's punctuation is broken — wrong separators, smart quotes, or a missing parenthesis.",
    category: "error-fixes",
    difficulty: "beginner",
    functions: ["IF"],
    keywords: ["formula parse error", "google sheets parse error", "smart quotes formula", "semicolon vs comma", "#error", "mismatched parentheses"],
    problem:
      "Google Sheets rejects your formula with \"Formula parse error\" the moment you press Enter — often a formula you copied from a website, an email, or another spreadsheet.",
    quickFormula: '=IF(A2>10,"High","Low")',
    excelFormula: '=IF(A2>10,"High","Low")',
    sheetsFormula: null,
    explanation:
      "A formula parse error means Google Sheets can't read the formula's punctuation — the logic never even runs. The most common culprit in pasted formulas is smart quotes: word processors and websites convert straight quotes (\") into curly ones (“ ”), which Sheets treats as ordinary text, not string delimiters. Retype the quotes inside Sheets and the error vanishes. Second is locale: spreadsheets set to many European locales separate arguments with semicolons, so =IF(A2>10;\"High\";\"Low\") is correct there and a parse error in a comma locale — match your spreadsheet's setting under File > Settings. The rest is bookkeeping: every opening parenthesis needs a closing one, and every opening quote needs its partner. Sheets highlights matching pairs as you click through the formula, which makes the missing one easy to spot.",
    steps: [
      { part: '"High" and "Low"', meaning: "Straight quotes typed in Sheets. Curly quotes “High” pasted from a document cause the parse error." },
      { part: "The commas", meaning: "Argument separators for US-style locales. If your locale uses semicolons, write =IF(A2>10;\"High\";\"Low\") instead." },
      { part: "IF( … )", meaning: "One opening parenthesis, one closing. Click inside the formula and Sheets highlights each matching pair." },
    ],
    whenToUse:
      "Check punctuation first whenever a pasted formula fails instantly — formulas copied from blogs, emails, or Word documents almost always carry smart quotes or the wrong separators.",
    commonMistakes: [
      {
        mistake: "Pasting a formula with curly smart quotes from a website or document.",
        fix: 'Delete each “ ” and retype " directly in the formula bar. Paste into a plain-text editor first if the formula is long.',
      },
      {
        mistake: "Mixing comma and semicolon separators across locales.",
        fix: "A formula written for a semicolon locale fails in a comma locale and vice versa. Check File > Settings > Locale and match it.",
      },
      {
        mistake: "A missing closing quote or parenthesis in a nested formula.",
        fix: 'Count the pairs: =IF(A2>10,"High,"Low") is missing the quote after High. Sheets\' pair highlighting shows where the trail goes cold.',
      },
    ],
    sampleInput: {
      columns: ["Formula", "Result"],
      rows: [
        ['=IF(A2>10,“High”,“Low”)', "#ERROR!"],
        ['=IF(A2>10,"High,"Low")', "#ERROR!"],
      ],
    },
    sampleOutput: {
      columns: ["Formula", "Result"],
      rows: [
        ['=IF(A2>10,"High","Low")', "High"],
        ['=IF(A2>10,"High","Low")', "High"],
      ],
      highlightColumn: 1,
    },
    related: ["fix-name-error", "fix-value-error", "fix-na-error"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "vlookup-returns-wrong-value",
    kind: "error-fix",
    title: "VLOOKUP Returns the Wrong Value",
    seoTitle: "VLOOKUP Returns Wrong Value? Fix It in Excel & Sheets",
    description:
      "No error, just wrong data — VLOOKUP quietly returns the wrong value when FALSE is missing, the column number shifts, or keys are duplicated.",
    category: "error-fixes",
    difficulty: "intermediate",
    functions: ["VLOOKUP", "XLOOKUP", "COUNTIF"],
    keywords: ["vlookup wrong value", "vlookup wrong result", "vlookup approximate match", "vlookup false argument", "vlookup wrong column", "duplicate lookup values"],
    problem:
      "Your VLOOKUP calculates without complaint, but spot-checking reveals it's pulling the wrong person's data — the most dangerous failure because nothing looks broken.",
    quickFormula: '=VLOOKUP(A2,Sheet2!$A:$C,3,FALSE)',
    excelFormula: '=VLOOKUP(A2,Sheet2!$A:$C,3,FALSE)',
    sheetsFormula: null,
    explanation:
      "A wrong value is worse than an error code, because nothing flags it — the report just ships with bad data. The top cause is omitting the fourth argument: without FALSE, VLOOKUP does an approximate match, which assumes the lookup column is sorted and happily returns the nearest smaller value from unsorted data. Always write FALSE (or 0) for exact match. Second, the column number counts positions inside the table range, so inserting or deleting a column in the lookup table silently shifts what column 3 means — your formula now returns the neighboring column. Third, when the lookup column contains duplicate keys, VLOOKUP returns only the first match and ignores the rest, which looks correct until you compare against the second record. Check for duplicates with =COUNTIF(Sheet2!A:A,A2) — anything above 1 means your \"match\" is really a coin flip that always lands on the first row.",
    steps: [
      { part: "A2", meaning: "The value to look up — an ID, email, or name." },
      { part: "Sheet2!$A:$C", meaning: "The lookup table, anchored with $ so the range doesn't drift when the formula is copied down." },
      { part: "3", meaning: "Return the 3rd column of the table. Recount this after anyone inserts or deletes columns in the table." },
      { part: "FALSE", meaning: "Exact match. Omit it and VLOOKUP switches to approximate match, returning near-misses from unsorted data." },
    ],
    whenToUse:
      "Audit these three causes whenever lookup results fail a spot check, after columns are inserted into the lookup table, or when the lookup column may contain duplicate IDs.",
    commonMistakes: [
      {
        mistake: "Leaving off the FALSE argument.",
        fix: "=VLOOKUP(A2,$A:$C,3) approximate-matches and returns the nearest smaller value on unsorted data. Add FALSE: =VLOOKUP(A2,$A:$C,3,FALSE).",
      },
      {
        mistake: "Trusting the column number after the table changed.",
        fix: "Inserting a column inside $A:$C shifts what position 3 holds. Recount, or switch to XLOOKUP, which names the return column and can't shift.",
      },
      {
        mistake: "Assuming duplicates are handled.",
        fix: "VLOOKUP only ever returns the first match. Test with =COUNTIF(Sheet2!A:A,A2)>1, then dedupe the table or make keys unique before trusting results.",
      },
    ],
    sampleInput: {
      columns: ["ID", "=VLOOKUP(A2,$A:$C,3)"],
      rows: [
        ["E-104", "Dana Cruz"],
        ["E-201", "Ben Okafor"],
      ],
    },
    sampleOutput: {
      columns: ["ID", "=VLOOKUP(A2,$A:$C,3,FALSE)"],
      rows: [
        ["E-104", "Ana Torres"],
        ["E-201", "Cara Lim"],
      ],
      highlightColumn: 1,
    },
    related: ["vlookup-exact-match", "xlookup-basic-example", "index-match-lookup", "fix-na-error"],
    lastReviewed: "2026-07-08",
    published: true,
  },
];
