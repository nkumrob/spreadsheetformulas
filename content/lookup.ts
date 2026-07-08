import type { Formula } from "@/lib/schema";

export const lookupFormulas: Formula[] = [
  {
    slug: "compare-two-columns",
    kind: "formula",
    title: "Compare Two Columns and Find Differences",
    seoTitle: "Compare Two Columns in Excel & Google Sheets",
    description:
      "Compare two columns row by row and flag matches and mismatches with a simple IF formula that works in Excel and Google Sheets.",
    category: "lookup-matching",
    difficulty: "beginner",
    functions: ["IF", "COUNTIF"],
    keywords: ["compare columns", "find differences", "match two lists", "duplicate check", "mismatch"],
    problem:
      "You have two columns of data — say, an old email list and a new one — and you need to know which rows match and which don't, without eyeballing hundreds of rows.",
    quickFormula: '=IF(A2=B2,"Match","Mismatch")',
    excelFormula: '=IF(A2=B2,"Match","Mismatch")',
    sheetsFormula: null,
    explanation:
      "The formula checks whether the value in A2 equals the value in B2. If they're identical, it returns Match; otherwise it returns Mismatch. Copy it down the column and every row gets checked automatically. The comparison is not case-sensitive — \"ana@co.com\" and \"ANA@co.com\" count as a match. If you need to find values from column A that appear anywhere in column B (not just the same row), use =IF(COUNTIF(B:B,A2)>0,\"In list\",\"Missing\") instead.",
    steps: [
      { part: "A2=B2", meaning: "Compares the two cells in this row. Returns TRUE when they're equal." },
      { part: '"Match"', meaning: "What to show when the comparison is TRUE." },
      { part: '"Mismatch"', meaning: "What to show when the comparison is FALSE." },
    ],
    whenToUse:
      "Use this when reconciling two versions of the same list: exported data vs. a master file, last month's roster vs. this month's, or system A vs. system B.",
    commonMistakes: [
      {
        mistake: "Comparing rows when you actually need to compare whole lists.",
        fix: 'Row-by-row comparison breaks if the lists are sorted differently. Use =COUNTIF(B:B,A2)>0 to check if a value exists anywhere in the other column.',
      },
      {
        mistake: "Hidden spaces make identical-looking values mismatch.",
        fix: 'Wrap both sides in TRIM: =IF(TRIM(A2)=TRIM(B2),"Match","Mismatch").',
      },
      {
        mistake: "Expecting a case-sensitive comparison.",
        fix: 'The = operator ignores case. Use EXACT for a case-sensitive check: =IF(EXACT(A2,B2),"Match","Mismatch").',
      },
    ],
    sampleInput: {
      columns: ["Old Email", "New Email"],
      rows: [
        ["ana@co.com", "ana@co.com"],
        ["ben@co.com", "ben@corp.com"],
        ["cara@co.com", "cara@co.com"],
        ["dev@co.com", "devon@co.com"],
      ],
    },
    sampleOutput: {
      columns: ["Old Email", "New Email", "Result"],
      rows: [
        ["ana@co.com", "ana@co.com", "Match"],
        ["ben@co.com", "ben@corp.com", "Mismatch"],
        ["cara@co.com", "cara@co.com", "Match"],
        ["dev@co.com", "devon@co.com", "Mismatch"],
      ],
      highlightColumn: 2,
    },
    related: ["vlookup-exact-match", "count-if-multiple-conditions", "remove-extra-spaces"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "vlookup-exact-match",
    kind: "formula",
    title: "VLOOKUP with an Exact Match",
    seoTitle: "VLOOKUP Exact Match in Excel & Google Sheets",
    description:
      "Look up a value in another table and return the matching result — with the FALSE argument that stops VLOOKUP returning wrong answers.",
    category: "lookup-matching",
    difficulty: "beginner",
    functions: ["VLOOKUP"],
    keywords: ["vlookup", "lookup table", "exact match", "false argument", "pull data from another sheet"],
    problem:
      "You have an ID, name, or code in one table and need to pull matching details — a price, a department, an email — from another table.",
    quickFormula: "=VLOOKUP(E2,A2:B10,2,FALSE)",
    excelFormula: "=VLOOKUP(E2,A2:B10,2,FALSE)",
    sheetsFormula: null,
    explanation:
      "VLOOKUP searches the first column of the range A2:B10 for the value in E2. When it finds an exact match, it returns the value from the 2nd column of that range. The FALSE at the end is critical: it forces an exact match. Without it, VLOOKUP assumes your data is sorted and returns the nearest smaller value — which silently produces wrong answers on unsorted data.",
    steps: [
      { part: "E2", meaning: "The value you're looking up — an ID, a name, a SKU." },
      { part: "A2:B10", meaning: "The lookup table. VLOOKUP only searches its first column (A)." },
      { part: "2", meaning: "Which column of the table to return — column B is the 2nd column of A2:B10." },
      { part: "FALSE", meaning: "Require an exact match. Never omit this on unsorted data." },
    ],
    whenToUse:
      "Use VLOOKUP when the value you're matching on sits to the left of the value you want returned. If it sits to the right, use XLOOKUP or INDEX + MATCH instead.",
    commonMistakes: [
      {
        mistake: "Omitting the FALSE argument.",
        fix: "VLOOKUP defaults to approximate match and returns wrong values on unsorted data. Always add FALSE for exact matching.",
      },
      {
        mistake: "Counting the return column from column A of the sheet instead of the first column of your range.",
        fix: "The column number is relative to the lookup range. In VLOOKUP(E2,C2:F10,2,FALSE), column 2 is D, not B.",
      },
      {
        mistake: "The lookup range shifts when you copy the formula down.",
        fix: "Lock the table with absolute references: =VLOOKUP(E2,$A$2:$B$10,2,FALSE).",
      },
    ],
    sampleInput: {
      columns: ["Product", "Price"],
      rows: [
        ["Notebook", "4.50"],
        ["Stapler", "12.00"],
        ["Monitor", "189.00"],
        ["Desk Lamp", "34.00"],
      ],
    },
    sampleOutput: {
      columns: ["Lookup", "Result"],
      rows: [
        ["Monitor", "189.00"],
        ["Stapler", "12.00"],
      ],
      highlightColumn: 1,
    },
    related: ["xlookup-basic-example", "index-match-lookup", "fix-na-error"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "xlookup-basic-example",
    kind: "formula",
    title: "XLOOKUP: The Modern Lookup Formula",
    seoTitle: "How to Use XLOOKUP in Excel & Google Sheets",
    description:
      "XLOOKUP replaces VLOOKUP with a simpler, safer lookup: exact match by default, looks in any direction, and has a built-in not-found message.",
    category: "lookup-matching",
    difficulty: "beginner",
    functions: ["XLOOKUP"],
    keywords: ["xlookup", "vlookup replacement", "lookup left", "not found", "modern lookup"],
    problem:
      "You want to look up a value and return a match from another column — without VLOOKUP's fragile column counting, its wrong-by-default approximate matching, or its inability to look left.",
    quickFormula: '=XLOOKUP(E2,A2:A10,B2:B10,"Not found")',
    excelFormula: '=XLOOKUP(E2,A2:A10,B2:B10,"Not found")',
    sheetsFormula: null,
    explanation:
      "XLOOKUP searches A2:A10 for the value in E2 and returns the value in the same position from B2:B10. If there's no match, it returns \"Not found\" instead of an #N/A error. Because the lookup column and return column are separate arguments, the return column can be anywhere — left or right of the lookup column — and inserting new columns never breaks the formula. Exact match is the default, so there's no FALSE argument to forget.",
    steps: [
      { part: "E2", meaning: "The value to find." },
      { part: "A2:A10", meaning: "The column to search." },
      { part: "B2:B10", meaning: "The column to return values from. Must be the same size as the search column." },
      { part: '"Not found"', meaning: "Optional: what to show when there's no match, instead of #N/A." },
    ],
    whenToUse:
      "Use XLOOKUP as your default lookup in Excel 2021+, Microsoft 365, and Google Sheets. Fall back to INDEX + MATCH only when you must support Excel 2019 or older.",
    commonMistakes: [
      {
        mistake: "Search and return ranges are different sizes.",
        fix: "A2:A10 with B2:B99 returns #VALUE!. Both ranges must cover the same rows.",
      },
      {
        mistake: "Using it in a workbook others open in old Excel.",
        fix: "XLOOKUP needs Excel 2021 or Microsoft 365. For older versions, use INDEX + MATCH.",
      },
    ],
    sampleInput: {
      columns: ["Employee", "Department"],
      rows: [
        ["Ana Torres", "Sales"],
        ["Ben Okafor", "Finance"],
        ["Cara Lim", "Operations"],
      ],
    },
    sampleOutput: {
      columns: ["Lookup", "Result"],
      rows: [
        ["Ben Okafor", "Finance"],
        ["Dana Cruz", "Not found"],
      ],
      highlightColumn: 1,
    },
    related: ["vlookup-exact-match", "index-match-lookup", "fix-na-error"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "index-match-lookup",
    kind: "formula",
    title: "INDEX + MATCH Lookup",
    seoTitle: "INDEX MATCH in Excel & Google Sheets",
    description:
      "The classic flexible lookup: MATCH finds the row, INDEX returns the value. Works in every Excel version and looks in any direction.",
    category: "lookup-matching",
    difficulty: "intermediate",
    functions: ["INDEX", "MATCH"],
    keywords: ["index match", "lookup left", "vlookup alternative", "two-way lookup"],
    problem:
      "You need a lookup that works in every Excel version, can return values from a column to the left of the lookup column, and doesn't break when columns are inserted.",
    quickFormula: "=INDEX(B2:B10,MATCH(E2,A2:A10,0))",
    excelFormula: "=INDEX(B2:B10,MATCH(E2,A2:A10,0))",
    sheetsFormula: null,
    explanation:
      "MATCH(E2,A2:A10,0) finds which row of A2:A10 contains the value in E2 — the 0 means exact match. INDEX(B2:B10, …) then returns the value at that same row position in B2:B10. Because the two ranges are independent, the return column can be anywhere relative to the lookup column, and inserting columns between them changes nothing.",
    steps: [
      { part: "MATCH(E2,A2:A10,0)", meaning: "Finds the position of E2 within A2:A10. Returns a row number like 3." },
      { part: "0", meaning: "Exact match. Always use 0 unless your data is sorted and you want nearest-match." },
      { part: "INDEX(B2:B10, …)", meaning: "Returns the value at that position from the return column." },
    ],
    whenToUse:
      "Use INDEX + MATCH when you need compatibility with older Excel versions, or a two-way lookup by pairing two MATCHes — one for the row, one for the column.",
    commonMistakes: [
      {
        mistake: "Omitting the 0 in MATCH.",
        fix: "MATCH defaults to approximate match, which returns wrong positions on unsorted data. Always specify 0 for exact match.",
      },
      {
        mistake: "INDEX and MATCH ranges start on different rows.",
        fix: "If MATCH searches A2:A10, INDEX must return from B2:B10 — not B1:B10 — or every result is shifted by one row.",
      },
    ],
    sampleInput: {
      columns: ["Employee ID", "Name"],
      rows: [
        ["E-104", "Ana Torres"],
        ["E-221", "Ben Okafor"],
        ["E-317", "Cara Lim"],
      ],
    },
    sampleOutput: {
      columns: ["Lookup", "Result"],
      rows: [["E-221", "Ben Okafor"]],
      highlightColumn: 1,
    },
    related: ["xlookup-basic-example", "vlookup-exact-match", "fix-na-error"],
    lastReviewed: "2026-07-08",
    published: true,
  },
];
