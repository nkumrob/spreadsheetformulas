import type { Formula } from "@/lib/schema";

export const comparisons2Formulas: Formula[] = [
  {
    slug: "index-match-vs-xlookup",
    kind: "formula",
    title: "INDEX MATCH vs XLOOKUP: Which Lookup to Use",
    seoTitle: "INDEX MATCH vs XLOOKUP in Excel & Google Sheets",
    description:
      "Use XLOOKUP when you have it — INDEX MATCH remains the answer for older Excel and true two-way row-and-column lookups. Both verified side by side below.",
    category: "lookup-matching",
    difficulty: "intermediate",
    functions: ["XLOOKUP", "INDEX", "MATCH"],
    keywords: ["index match vs xlookup", "difference between index match and xlookup", "two way lookup", "index match or xlookup", "lookup for old excel"],
    problem:
      "You've outgrown VLOOKUP and every guide splits between two upgrades — the classic INDEX MATCH combo and the newer XLOOKUP. Which one should your team standardize on?",
    quickFormula: "=XLOOKUP(E2,A2:A5,C2:C5)",
    excelFormula: "=XLOOKUP(E2,A2:A5,C2:C5)",
    sheetsFormula: null,
    explanation:
      "Both formulas do the same job: find E2 in column A, return the same row from column C — and both can look left, survive inserted columns, and skip VLOOKUP's column counting. XLOOKUP does it in one readable function with exact match as the default and a built-in if-not-found argument, so it should be your default in Excel 2021/365 and Google Sheets. INDEX MATCH earns its keep in two cases. First, compatibility: it works in every Excel ever shipped, so files that circulate to Excel 2019 or older need it (XLOOKUP shows #NAME? there). Second, true two-way lookups: =INDEX(B2:C5,MATCH(E2,A2:A5,0),MATCH(\"Price\",B1:C1,0)) finds the row AND the column by name — one INDEX with two MATCHes, which is cleaner than nesting two XLOOKUPs.",
    steps: [
      { part: "E2", meaning: "The value to find — a SKU, name, or invoice number." },
      { part: "A2:A5", meaning: "The column to search. INDEX MATCH splits this into MATCH(E2,A2:A5,0)." },
      { part: "C2:C5", meaning: "The column to return from. INDEX MATCH wraps it: =INDEX(C2:C5,MATCH(...))." },
    ],
    whenToUse:
      "Standardize on XLOOKUP for everyday lookups in modern Excel and Google Sheets. Keep INDEX MATCH for workbooks shared with Excel 2019 or older, and for two-way lookups where both the row and the column are found by name.",
    commonMistakes: [
      {
        mistake: "MATCH without the 0 third argument.",
        fix: "=INDEX(C2:C5,MATCH(E2,A2:A5)) defaults to approximate match and silently returns wrong rows on unsorted data. Always close with 0: MATCH(E2,A2:A5,0).",
      },
      {
        mistake: "INDEX and MATCH ranges starting on different rows.",
        fix: "MATCH(E2,A2:A5,0) with INDEX(C1:C4,...) is off by one — MATCH returns a position, not a row number. Both ranges must cover exactly the same rows.",
      },
      {
        mistake: "Shipping XLOOKUP to old-Excel users.",
        fix: "Excel 2019 and older shows #NAME? on every XLOOKUP. If the file leaves your team, use INDEX MATCH — it works everywhere, all the way back.",
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
      columns: ["Lookup", "XLOOKUP", "INDEX MATCH"],
      rows: [
        ["B-310", "35", "35"],
        ["A-205", "189", "189"],
      ],
      highlightColumn: 1,
    },
    related: ["xlookup-vs-vlookup", "index-match-lookup", "xlookup-basic-example"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["SKU", "Product", "Price", null, "Lookup", "XLOOKUP", "INDEX MATCH", "Two-Way"],
          ["A-102", "Desk Lamp", 34, null, "B-310", "=XLOOKUP(E2,A2:A5,C2:C5)", "=INDEX(C2:C5,MATCH(E2,A2:A5,0))", '=INDEX(B2:C5,MATCH("A-205",A2:A5,0),MATCH("Price",B1:C1,0))'],
          ["A-205", "Office Chair", 189, null, "A-205", "=XLOOKUP(E3,A2:A5,C2:C5)", "=INDEX(C2:C5,MATCH(E3,A2:A5,0))", null],
          ["B-310", "Monitor Stand", 35, null, null, null, null, null],
          ["C-118", "Keyboard", 49, null, null, null, null, null],
        ],
      },
      expect: [
        { cell: "F2", value: 35 },
        { cell: "G2", value: 35 },
        { cell: "F3", value: 189 },
        { cell: "G3", value: 189 },
        { cell: "H2", value: 189 },
      ],
    },
  },
  {
    slug: "sumifs-vs-sumproduct",
    kind: "formula",
    title: "SUMIFS vs SUMPRODUCT: When Each One Wins",
    seoTitle: "SUMIFS vs SUMPRODUCT (Excel & Google Sheets)",
    description:
      "SUMIFS wins for plain AND conditions; switch to SUMPRODUCT when you need OR logic or a calculation inside the condition.",
    category: "counting-summarizing",
    difficulty: "intermediate",
    functions: ["SUMIFS", "SUMPRODUCT"],
    keywords: ["sumifs vs sumproduct", "difference between sumifs and sumproduct", "sum with or condition", "conditional sum formula", "sumproduct with criteria"],
    problem:
      "You're totaling an order log — East orders over $1,000 is easy, but then someone asks for East OR West, and your SUMIFS has no way to say \"or\". Which function does what?",
    quickFormula: '=SUMIFS(B2:B50,A2:A50,"East",B2:B50,">1000")',
    excelFormula: '=SUMIFS(B2:B50,A2:A50,"East",B2:B50,">1000")',
    sheetsFormula: null,
    explanation:
      "SUMIFS is the default for conditional totals: sum range first, then range/condition pairs, every pair must match (AND logic). It's fast, readable, and the conditions are plain text like \"East\" and \">1000\". Its limit is exactly that AND: the pairs can't express East OR West, and a condition can't do math on the fly. SUMPRODUCT works differently — each comparison like (A2:A50=\"East\") produces an array of 1s and 0s, and multiplying arrays is AND while adding them is OR. So =SUMPRODUCT(((A2:A50=\"East\")+(A2:A50=\"West\"))*B2:B50) totals both regions in one formula, and conditions can contain arithmetic, like flagging rows where quantity times price exceeds a threshold. The verified grid below shows both computing the identical AND total, plus the OR total only SUMPRODUCT can do.",
    steps: [
      { part: "B2:B50", meaning: "The amounts to add — SUMIFS always takes the sum range first." },
      { part: 'A2:A50,"East"', meaning: "First condition pair: region must equal East." },
      { part: 'B2:B50,">1000"', meaning: "Second pair, ANDed with the first. For OR, switch to SUMPRODUCT and add the comparisons." },
    ],
    whenToUse:
      "Reach for SUMIFS for every straightforward conditional total in a sales log or budget. Bring in SUMPRODUCT when a condition needs OR logic, arithmetic (units × price), or comparisons between two columns.",
    commonMistakes: [
      {
        mistake: "Adding overlapping conditions in SUMPRODUCT's OR.",
        fix: "(A2:A50=\"East\")+(B2:B50>1000) counts East rows over $1,000 twice, because both tests return 1 for the same row. OR-ing works cleanly when the conditions can't both be true (East/West); otherwise cap it: =SUMPRODUCT(((A2:A50=\"East\")+(B2:B50>1000)>0)*B2:B50).",
      },
      {
        mistake: "Trying to write OR inside SUMIFS pairs.",
        fix: 'SUMIFS pairs are always AND. For East OR West, either add two SUMIFS — =SUMIFS(B2:B50,A2:A50,"East")+SUMIFS(B2:B50,A2:A50,"West") — or use one SUMPRODUCT.',
      },
      {
        mistake: "Text hiding in SUMPRODUCT's number column.",
        fix: "One \"TBD\" in the amount column makes the multiplication return #VALUE!. SUMIFS quietly skips text; with SUMPRODUCT, clean the column or wrap the amounts in a guard first.",
      },
    ],
    sampleInput: {
      columns: ["Region", "Amount"],
      rows: [
        ["East", "1200"],
        ["West", "800"],
        ["East", "450"],
        ["North", "2000"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [
        ["East over $1,000 (both agree)", "1200"],
        ["East OR West (SUMPRODUCT only)", "2450"],
      ],
      highlightColumn: 1,
    },
    related: ["sumif-vs-sumifs", "sumproduct-conditional-math", "calculate-weighted-average"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      // Engine note: HyperFormula needs range arithmetic wrapped in ARRAYFORMULA
      // to evaluate as arrays; in real Excel/Sheets the page formulas work bare.
      sheets: {
        Sheet1: [
          ["Region", "Amount", "SUMIFS", "SUMPRODUCT"],
          ["East", 1200, '=SUMIFS(B2:B5,A2:A5,"East",B2:B5,">1000")', '=SUMPRODUCT(ARRAYFORMULA((A2:A5="East")*(B2:B5>1000)*B2:B5))'],
          ["West", 800, null, '=SUMPRODUCT(ARRAYFORMULA(((A2:A5="East")+(A2:A5="West"))*B2:B5))'],
          ["East", 450, null, null],
          ["North", 2000, null, null],
        ],
      },
      expect: [
        { cell: "C2", value: 1200 },
        { cell: "D2", value: 1200 },
        { cell: "D3", value: 2450 },
      ],
    },
  },
  {
    slug: "iferror-vs-ifna",
    kind: "formula",
    title: "IFERROR vs IFNA: Which Errors to Catch",
    seoTitle: "IFERROR vs IFNA in Excel & Google Sheets",
    description:
      "IFNA only catches #N/A — perfect for lookups; IFERROR hides every error, including the typos and broken refs you need to see. Default to IFNA.",
    category: "conditional-logic",
    difficulty: "intermediate",
    functions: ["IFNA", "IFERROR", "VLOOKUP"],
    keywords: ["iferror vs ifna", "difference between iferror and ifna", "catch na error only", "vlookup error handling", "hide na in vlookup"],
    problem:
      "Your lookup column shows #N/A for names that aren't on the list, and you want \"Not on list\" instead — but you've heard wrapping everything in IFERROR can hide real problems. Which wrapper is safe?",
    quickFormula: '=IFNA(VLOOKUP(D2,A2:B10,2,FALSE),"Not on list")',
    excelFormula: '=IFNA(VLOOKUP(D2,A2:B10,2,FALSE),"Not on list")',
    sheetsFormula: null,
    explanation:
      "IFNA is the surgical option: it replaces only #N/A — the error lookups return when the value genuinely isn't there — and lets every other error through untouched. That matters because #NAME? means you misspelled the function, #REF! means a deleted column, and #DIV/0! means broken math; those are bugs to fix, not results to relabel. IFERROR replaces all of them with your fallback, so a typo like =IFERROR(VLOKUP(...),\"Not on list\") quietly reports every row as \"Not on list\" and nobody notices the formula is broken. The verified grid below shows the difference directly: both handle a missing name identically, but feed them a divide-by-zero and IFNA passes the #DIV/0! through while IFERROR papers over it. Use IFERROR only when you've deliberately decided any failure should show the fallback.",
    steps: [
      { part: "VLOOKUP(D2,A2:B10,2,FALSE)", meaning: "The lookup that returns #N/A when D2 isn't in column A." },
      { part: '"Not on list"', meaning: "Shown only for #N/A. Any other error still surfaces, so real bugs stay visible." },
    ],
    whenToUse:
      "Wrap IFNA around VLOOKUP, XLOOKUP, INDEX MATCH, and MATCH anywhere a missing value is normal — new customers, unmapped SKUs. Save IFERROR for the rare cell where every possible error genuinely means the same fallback.",
    commonMistakes: [
      {
        mistake: "Blanket IFERROR around every formula.",
        fix: "IFERROR turns a misspelled function or a deleted column into your innocent-looking fallback text, workbook-wide. Wrap lookups in IFNA instead, and fix non-#N/A errors at the source.",
      },
      {
        mistake: "Expecting IFNA to catch #VALUE! or #DIV/0!.",
        fix: "IFNA passes those straight through — by design. If a lookup shows #VALUE!, the problem is inside the lookup (wrong argument types), not a missing value. Fix the formula rather than switching to IFERROR.",
      },
      {
        mistake: 'Using "" as the fallback and breaking downstream math.',
        fix: 'IFNA(...,"") leaves invisible empty text that COUNTA still counts and arithmetic chokes on. Prefer a visible label like "Not on list", or 0 when the column feeds a SUM.',
      },
    ],
    sampleInput: {
      columns: ["Name", "Bonus"],
      rows: [
        ["Ana Torres", "500"],
        ["Ben Okafor", "350"],
        ["Cara Lim", "425"],
      ],
    },
    sampleOutput: {
      columns: ["Input", "IFNA", "IFERROR"],
      rows: [
        ["Ben Okafor", "350", "350"],
        ["Zed", "Not on list", "Not on list"],
        ["500/0", "#DIV/0!", "Not on list"],
      ],
      highlightColumn: 1,
    },
    related: ["iferror-catch-formula-errors", "fix-na-error", "fix-div0-error"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Name", "Bonus", null, "Lookup", "IFNA", "IFERROR"],
          ["Ana Torres", 500, null, "Ben Okafor", '=IFNA(VLOOKUP(D2,A2:B4,2,FALSE),"Not on list")', '=IFERROR(VLOOKUP(D2,A2:B4,2,FALSE),"Not on list")'],
          ["Ben Okafor", 350, null, "Zed", '=IFNA(VLOOKUP(D3,A2:B4,2,FALSE),"Not on list")', '=IFERROR(VLOOKUP(D3,A2:B4,2,FALSE),"Not on list")'],
          ["Cara Lim", 425, null, "Div by zero", '=IFNA(B2/0,"Not on list")', '=IFERROR(B2/0,"Not on list")'],
        ],
      },
      expect: [
        { cell: "E2", value: 350 },
        { cell: "F2", value: 350 },
        { cell: "E3", value: "Not on list" },
        { cell: "F3", value: "Not on list" },
        { cell: "E4", value: "#DIV/0!" },
        { cell: "F4", value: "Not on list" },
      ],
    },
  },
  {
    slug: "count-vs-counta-vs-countblank",
    kind: "formula",
    title: "COUNT vs COUNTA vs COUNTBLANK: Which to Use",
    seoTitle: "COUNT vs COUNTA vs COUNTBLANK (Excel & Sheets)",
    description:
      "COUNT tallies numbers only, COUNTA anything non-empty, and COUNTBLANK the gaps — three answers from the same column, verified on one grid.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["COUNT", "COUNTA", "COUNTBLANK"],
    keywords: ["count vs counta", "counta vs countblank", "count non empty cells", "count blank cells", "difference between count and counta"],
    problem:
      "Your responses column mixes numbers, text like \"pending\", and empty cells — and you need to know how many amounts came in, how many rows have anything at all, and how many are still missing.",
    quickFormula: "=COUNTA(A2:A50)",
    excelFormula: "=COUNTA(A2:A50)",
    sheetsFormula: null,
    explanation:
      "The three functions answer three different questions about the same range. COUNT only tallies cells holding numbers (including dates, which are stored as numbers) — text like \"pending\" is invisible to it. COUNTA counts every cell with anything in it: numbers, text, even an error value. COUNTBLANK counts the truly empty cells. On a column containing 250, an empty cell, \"pending\", 180, and another empty cell, they return 2, 3, and 2 respectively — and COUNTA plus COUNTBLANK equals the total rows, a handy sanity check. The classic confusion is running COUNT on a text column, getting 0, and concluding the data vanished; the data is fine, you just asked for numbers.",
    steps: [
      { part: "COUNTA", meaning: "Counts every non-empty cell — the \"how many rows are filled in\" answer." },
      { part: "A2:A50", meaning: "The same range works in all three: =COUNT(A2:A50) for numbers, =COUNTBLANK(A2:A50) for gaps." },
    ],
    whenToUse:
      "COUNTA for how many survey responses or orders exist, COUNT for how many have a numeric amount, COUNTBLANK to find how many entries are still missing before a deadline.",
    commonMistakes: [
      {
        mistake: "COUNT on a text column returning 0.",
        fix: "COUNT only sees numbers, so a column of names returns 0 even when full. Count entries with =COUNTA(A2:A50) instead.",
      },
      {
        mistake: "A single space defeating COUNTBLANK.",
        fix: 'A cell holding just " " looks empty but isn\'t — COUNTA counts it and COUNTBLANK skips it. Clear phantom spaces (Ctrl+H, replace " " with nothing) before trusting the numbers.',
      },
      {
        mistake: 'Formulas returning "" muddying both counts.',
        fix: 'A formula result of "" is counted by COUNTA (there is a formula in the cell) and by COUNTBLANK (the value is empty), so the two can overlap. For data columns, prefer real blanks or a visible label over "".',
      },
    ],
    sampleInput: {
      columns: ["Response"],
      rows: [["250"], [""], ["pending"], ["180"], [""]],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [
        ["Numeric amounts (COUNT)", "2"],
        ["Filled-in rows (COUNTA)", "3"],
        ["Missing (COUNTBLANK)", "2"],
      ],
      highlightColumn: 1,
    },
    related: ["count-blanks", "countif-vs-countifs", "count-if-status-complete"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Response", "COUNT", "COUNTA", "COUNTBLANK"],
          [250, "=COUNT(A2:A6)", "=COUNTA(A2:A6)", "=COUNTBLANK(A2:A6)"],
          [null, null, null, null],
          ["pending", null, null, null],
          [180, null, null, null],
          [null, null, null, null],
        ],
      },
      expect: [
        { cell: "B2", value: 2 },
        { cell: "C2", value: 3 },
        { cell: "D2", value: 2 },
      ],
    },
  },
  {
    slug: "search-vs-find",
    kind: "formula",
    title: "SEARCH vs FIND: When Case Sensitivity Matters",
    seoTitle: "SEARCH vs FIND in Excel & Google Sheets",
    description:
      "SEARCH ignores case and accepts wildcards, so it's the everyday choice; FIND is for exact-case matches — and errors with #VALUE! on a case miss.",
    category: "text-cleanup",
    difficulty: "intermediate",
    functions: ["SEARCH", "FIND"],
    keywords: ["search vs find", "difference between search and find", "case sensitive text search", "find text position in cell", "wildcards in search"],
    problem:
      "You're locating \"lamp\" inside product names to split or flag them, but half your data says \"Lamp\" and half says \"lamp\" — and your formula keeps throwing #VALUE! on rows that clearly contain the word.",
    quickFormula: '=SEARCH("lamp",A2)',
    excelFormula: '=SEARCH("lamp",A2)',
    sheetsFormula: null,
    explanation:
      "Both functions return the character position where text is first found — in \"Desk Lamp - Black\", the word starts at position 6 — and both return #VALUE! when it isn't found at all. The difference is what counts as found. SEARCH is case-insensitive: \"lamp\" matches \"Lamp\", \"LAMP\", and \"lamp\" alike, which is what messy real-world data needs. FIND is case-sensitive: =FIND(\"lamp\",A2) on \"Desk Lamp\" returns #VALUE! because the capital L doesn't match — the single most common surprise with these functions. SEARCH also accepts wildcards (? for one character, * for any run), so =SEARCH(\"l?mp\",A2) matches lamp and limp; FIND treats ? and * as literal characters. Default to SEARCH, and reach for FIND only when capitalization is the point — like telling product code \"AB\" from \"ab\".",
    steps: [
      { part: '"lamp"', meaning: "The text to locate. SEARCH matches any capitalization; FIND requires an exact-case match." },
      { part: "A2", meaning: "The cell to look inside. The result is the position (a number), or #VALUE! if absent." },
    ],
    whenToUse:
      "Use SEARCH to locate a word before splitting with LEFT/MID, or to flag rows containing a keyword regardless of typing. Use FIND when case is meaningful — distinguishing \"IT\" the department from \"it\" the word.",
    commonMistakes: [
      {
        mistake: "Using FIND on mixed-case data.",
        fix: '=FIND("lamp",A2) fails with #VALUE! on "Desk Lamp" — the capital L is a miss. Switch to =SEARCH("lamp",A2), which returns 6 on the same cell.',
      },
      {
        mistake: "Using the raw result as a yes/no flag.",
        fix: 'SEARCH returns a position or #VALUE!, never TRUE/FALSE. Wrap it: =ISNUMBER(SEARCH("lamp",A2)) gives a clean TRUE or FALSE for filtering and IF tests.',
      },
      {
        mistake: "Searching for a literal ? or * with SEARCH.",
        fix: 'SEARCH treats ? and * as wildcards, so =SEARCH("*",A2) matches everything. Escape with a tilde — =SEARCH("~*",A2) — or use FIND, which takes them literally.',
      },
    ],
    sampleInput: {
      columns: ["Product"],
      rows: [["Desk Lamp - Black"], ["USB lamp cable"]],
    },
    sampleOutput: {
      columns: ["Formula", "Result"],
      rows: [
        ['=SEARCH("lamp",A2)', "6"],
        ['=FIND("lamp",A2)', "#VALUE!"],
        ['=FIND("Lamp",A2)', "6"],
      ],
      highlightColumn: 1,
    },
    related: ["extract-first-name", "substitute-find-and-replace", "fix-value-error"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Product", "SEARCH", "FIND lower", "FIND exact", "Wildcard"],
          ["Desk Lamp - Black", '=SEARCH("lamp",A2)', '=FIND("lamp",A2)', '=FIND("Lamp",A2)', '=SEARCH("l?mp",A2)'],
        ],
      },
      expect: [
        { cell: "B2", value: 6 },
        { cell: "C2", value: "#VALUE!" },
        { cell: "D2", value: 6 },
        { cell: "E2", value: 6 },
      ],
    },
  },
  {
    slug: "concatenate-vs-textjoin",
    kind: "formula",
    title: "CONCATENATE vs TEXTJOIN: Which Way to Combine Text",
    seoTitle: "CONCATENATE vs TEXTJOIN (Excel & Google Sheets)",
    description:
      "TEXTJOIN takes the delimiter once and can skip blanks; CONCATENATE makes you glue every piece by hand — use TEXTJOIN wherever your Excel has it.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["TEXTJOIN", "CONCATENATE"],
    keywords: ["concatenate vs textjoin", "difference between concatenate and textjoin", "join text with delimiter", "combine cells with comma", "skip blanks when joining"],
    problem:
      "You need one cell listing every attendee separated by commas, but some rows are empty — and your combining formula either means typing the separator twenty times or produces \"Ana, Ben, , Cara\" with stray commas.",
    quickFormula: '=TEXTJOIN(", ",TRUE,A2:A5)',
    excelFormula: '=TEXTJOIN(", ",TRUE,A2:A5)',
    sheetsFormula: null,
    explanation:
      "TEXTJOIN was built for exactly this job: give it the delimiter once, tell it whether to skip empty cells, and hand it a whole range. With TRUE in the second argument, the blank row disappears cleanly — \"Ana, Ben, Cara\" — while FALSE keeps a slot for it and produces the double-comma artifact. CONCATENATE predates both ideas: it has no delimiter argument and can't accept a range as a list, so joining four cells with commas means writing every piece by hand — =CONCATENATE(A2,\", \",A3,\", \",A4,\", \",A5) — and blanks still leave stray separators. TEXTJOIN needs Excel 2019/365 or Google Sheets; that version requirement is the only reason CONCATENATE (or the & operator) still appears in new formulas.",
    steps: [
      { part: '", "', meaning: "The delimiter, written once — a comma-space here, or CHAR(10) for line breaks." },
      { part: "TRUE", meaning: "Skip empty cells, so blanks don't leave double commas. FALSE keeps them." },
      { part: "A2:A5", meaning: "The range to join — no typing each cell. CONCATENATE can't do this." },
    ],
    whenToUse:
      "Use TEXTJOIN for attendee lists, address lines from optional parts (unit, street, city), tag lists, and email strings — anywhere the source column has gaps or more than three pieces.",
    commonMistakes: [
      {
        mistake: "Passing a range to CONCATENATE.",
        fix: '=CONCATENATE(A2:A5) doesn\'t join the list the way you\'d hope — CONCATENATE wants individual pieces. Use =TEXTJOIN(", ",TRUE,A2:A5), or list each cell separately if you\'re stuck on old Excel.',
      },
      {
        mistake: "Forgetting the second argument and getting stray commas.",
        fix: '=TEXTJOIN(", ",FALSE,A2:A5) keeps a slot for every blank: "Ana, Ben, , Cara". Set it to TRUE to skip empties.',
      },
      {
        mistake: "TEXTJOIN showing #NAME? for a colleague.",
        fix: "TEXTJOIN needs Excel 2019/365 or Google Sheets — Excel 2016 and older doesn't have it. For files that circulate widely, fall back to & with manual separators.",
      },
    ],
    sampleInput: {
      columns: ["Attendee"],
      rows: [["Ana"], ["Ben"], [""], ["Cara"]],
    },
    sampleOutput: {
      columns: ["Formula", "Result"],
      rows: [
        ['=TEXTJOIN(", ",TRUE,A2:A5)', "Ana, Ben, Cara"],
        ['=TEXTJOIN(", ",FALSE,A2:A5)', "Ana, Ben, , Cara"],
        ['=CONCATENATE(A2,", ",A3)', "Ana, Ben"],
      ],
      highlightColumn: 1,
    },
    related: ["combine-first-and-last-name", "split-text-by-delimiter", "extract-first-name"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Attendee", "Skip blanks", "Keep blanks", "CONCATENATE"],
          ["Ana", '=TEXTJOIN(", ",TRUE,A2:A5)', '=TEXTJOIN(", ",FALSE,A2:A5)', '=CONCATENATE(A2,", ",A3)'],
          ["Ben", null, null, null],
          [null, null, null, null],
          ["Cara", null, null, null],
        ],
      },
      expect: [
        { cell: "B2", value: "Ana, Ben, Cara" },
        { cell: "C2", value: "Ana, Ben, , Cara" },
        { cell: "D2", value: "Ana, Ben" },
      ],
    },
  },
  {
    slug: "today-vs-now",
    kind: "formula",
    title: "TODAY vs NOW: Which Date Function to Use",
    seoTitle: "TODAY vs NOW in Excel & Google Sheets",
    description:
      "TODAY returns just the date; NOW adds clock time that breaks date comparisons — use TODAY for deadlines, NOW only when the hour matters.",
    category: "dates-deadlines",
    difficulty: "beginner",
    functions: ["TODAY", "NOW", "INT"],
    keywords: ["today vs now", "difference between today and now", "current date formula", "date without time", "formula updates every day"],
    problem:
      "You're building a deadline tracker and need the current date for days-remaining math — but the two \"current time\" functions give different answers, and one of them keeps producing fractions like 1.5 days.",
    quickFormula: "=TODAY()",
    excelFormula: "=TODAY()",
    sheetsFormula: null,
    explanation:
      "Spreadsheets store dates as day counts and times as fractions of a day. TODAY() returns just the day number — midnight, effectively — while NOW() returns the same day plus the current clock time, so at noon NOW() sits exactly 0.5 above TODAY(). That fraction is why NOW breaks date math: a due date of July 10 minus TODAY() on July 8 gives a clean 2 days, but minus NOW() at noon gives 1.5. Equality tests fail the same way — a date cell never equals NOW() except at the exact stored second, while =INT(NOW()) strips the time and equals TODAY() again. Both functions are volatile: they recalculate every time the sheet changes or reopens, which is what you want for a live tracker and exactly wrong for a permanent timestamp.",
    steps: [
      { part: "TODAY()", meaning: "The current date with no time — safe for subtraction, comparison, and overdue flags. No arguments, but the parentheses are required." },
      { part: "NOW()", meaning: "Date plus clock time, for the rare formula where the hour matters. INT(NOW()) strips the time back off." },
    ],
    whenToUse:
      "Use TODAY for days-until-due, overdue flags, and aging invoices. Use NOW when hours matter — same-day SLA timers or a \"last refreshed\" display — never in whole-day arithmetic.",
    commonMistakes: [
      {
        mistake: "Using NOW() in whole-day math.",
        fix: "=B2-NOW() returns fractional days that drift as the day goes on — 1.5 at noon, 1.2 by evening. Use =B2-TODAY() for stable whole numbers.",
      },
      {
        mistake: "Expecting TODAY() to freeze as a timestamp.",
        fix: "Both functions recalculate — tomorrow, every TODAY() moves. For a permanent \"entered on\" date, press Ctrl+; (Cmd+; on Mac) to stamp a static date, or paste the cell as a value.",
      },
      {
        mistake: "Typing TODAY without parentheses.",
        fix: "=TODAY gives #NAME? — it's a function, not a keyword. Always =TODAY(), with nothing between the parentheses.",
      },
    ],
    sampleInput: {
      columns: ["Task", "Due"],
      rows: [
        ["Invoice run", "2026-07-10"],
        ["Renewal", "2026-07-08"],
      ],
    },
    sampleOutput: {
      columns: ["Task", "Days Left (=B2-TODAY())"],
      rows: [
        ["Invoice run", "2"],
        ["Renewal", "0"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-days-remaining", "calculate-days-overdue", "flag-overdue-tasks"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      // Clock frozen to 2026-07-08 12:00 in CI, so NOW() = TODAY() + 0.5 exactly.
      sheets: {
        Sheet1: [
          ["Task", "Due", "Days Left", "NOW Gap"],
          ["Invoice run", "2026-07-10", "=B2-TODAY()", "=B2-NOW()"],
          ["Checks", "=NOW()>=TODAY()", "=INT(NOW())=TODAY()", '=TEXT(TODAY(),"YYYY-MM-DD")'],
        ],
      },
      expect: [
        { cell: "C2", value: 2 },
        { cell: "D2", value: 1.5 },
        { cell: "B3", value: true },
        { cell: "C3", value: true },
        { cell: "D3", value: "2026-07-08" },
      ],
    },
  },
  {
    slug: "vlookup-vs-hlookup",
    kind: "formula",
    title: "VLOOKUP vs HLOOKUP: Which One Fits Your Table",
    seoTitle: "VLOOKUP vs HLOOKUP in Excel & Google Sheets",
    description:
      "VLOOKUP reads tables that run down the page — nearly all of them; reach for HLOOKUP only when your headers run across the top.",
    category: "lookup-matching",
    difficulty: "beginner",
    functions: ["VLOOKUP", "HLOOKUP"],
    keywords: ["vlookup vs hlookup", "difference between vlookup and hlookup", "horizontal lookup", "lookup across a row", "hlookup example"],
    problem:
      "One of your tables lists products down the rows; another lays months across the columns with sales underneath. You need to pull a value from each, and V-something or H-something is the question.",
    quickFormula: "=VLOOKUP(E2,A2:C5,3,FALSE)",
    excelFormula: "=VLOOKUP(E2,A2:C5,3,FALSE)",
    sheetsFormula: null,
    explanation:
      "The letters say it all: VLOOKUP searches Vertically down the first column of a table and returns from a column you count rightward; HLOOKUP searches Horizontally across the first row and returns from a row you count downward. They're the same function rotated 90 degrees — same exact-match FALSE argument, same counting logic, same #N/A on a miss. Since most real data is arranged vertically (one record per row), VLOOKUP covers the vast majority of lookups; HLOOKUP exists for the layouts where labels run across the top, like months in a budget or quarters in a forecast. If you're on Excel 2021/365 or Google Sheets, XLOOKUP replaces both — it doesn't care which direction the data runs — but the V/H pair still matters in older files.",
    steps: [
      { part: "E2", meaning: "The value to find — searched down column A by VLOOKUP, across row 1 by HLOOKUP." },
      { part: "A2:C5", meaning: "The table. VLOOKUP searches its first COLUMN; HLOOKUP searches its first ROW." },
      { part: "3", meaning: "Count 3 columns rightward for VLOOKUP; in HLOOKUP the same number counts rows downward." },
      { part: "FALSE", meaning: "Exact match — required in both, or unsorted data returns wrong values silently." },
    ],
    whenToUse:
      "VLOOKUP for the everyday case: price lists, employee rosters, order logs with one record per row. HLOOKUP for wide layouts — pulling February's number from a budget where months run across the top.",
    commonMistakes: [
      {
        mistake: "Counting columns when HLOOKUP wants rows.",
        fix: "The third argument flips meaning: in =HLOOKUP(\"Feb\",F1:H2,2,FALSE), the 2 means second ROW of the range, not second column. Count in the direction the lookup travels.",
      },
      {
        mistake: "Leaving off FALSE in either function.",
        fix: "Both default to approximate match and silently return wrong values on unsorted data. Always close with FALSE: =VLOOKUP(E2,A2:C5,3,FALSE).",
      },
      {
        mistake: "Fighting a wide layout with HLOOKUP everywhere.",
        fix: "If you're constantly HLOOKUP-ing a huge wide table, the layout is the problem — one record per row is easier to filter, sort, and total. Paste Special → Transpose flips it, then VLOOKUP takes over.",
      },
    ],
    sampleInput: {
      columns: ["Month", "Jan", "Feb", "Mar"],
      rows: [["Sales", "1200", "1500", "900"]],
    },
    sampleOutput: {
      columns: ["Formula", "Result"],
      rows: [
        ['=VLOOKUP("A-205",A2:C5,3,FALSE)', "189"],
        ['=HLOOKUP("Feb",F1:H2,2,FALSE)', "1500"],
      ],
      highlightColumn: 1,
    },
    related: ["vlookup-exact-match", "xlookup-vs-vlookup", "index-match-lookup"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      // One sheet, both orientations: vertical product table in A:C,
      // horizontal month table in F1:H2.
      sheets: {
        Sheet1: [
          ["SKU", "Product", "Price", null, "Month", "Jan", "Feb", "Mar"],
          ["A-102", "Desk Lamp", 34, null, "Sales", 1200, 1500, 900],
          ["A-205", "Office Chair", 189, null, "VLOOKUP", '=VLOOKUP("A-205",A2:C5,3,FALSE)', null, null],
          ["B-310", "Monitor Stand", 35, null, "HLOOKUP", '=HLOOKUP("Feb",F1:H2,2,FALSE)', null, null],
          ["C-118", "Keyboard", 49, null, null, null, null, null],
        ],
      },
      expect: [
        { cell: "F3", value: 189 },
        { cell: "F4", value: 1500 },
      ],
    },
  },
  {
    slug: "if-vs-ifs",
    kind: "formula",
    title: "IF vs IFS: When to Stop Nesting",
    seoTitle: "IF vs IFS in Excel & Google Sheets",
    description:
      "IFS reads as flat condition-result pairs, best for three or more tiers with a TRUE catch-all; nested IF still wins for one either/or and pre-2019 Excel.",
    category: "conditional-logic",
    difficulty: "beginner",
    functions: ["IFS", "IF"],
    keywords: ["if vs ifs", "difference between if and ifs", "nested if alternative", "ifs catch all", "multiple conditions formula"],
    problem:
      "Your commission tiers started as one IF, grew to three nested IFs with a tail of parentheses, and now nobody on the team can safely edit the formula. Is IFS the fix, and what changes?",
    quickFormula: '=IFS(B2>=90,"Gold",B2>=75,"Silver",TRUE,"Bronze")',
    excelFormula: '=IFS(B2>=90,"Gold",B2>=75,"Silver",TRUE,"Bronze")',
    sheetsFormula: null,
    explanation:
      "A nested IF buries each new tier one level deeper — =IF(B2>=90,\"Gold\",IF(B2>=75,\"Silver\",\"Bronze\")) — and every added tier adds a parenthesis to balance at the end. IFS flattens the same logic into condition/result pairs read left to right, stopping at the first condition that's true. That stop-at-first-true rule does the range work for you: by the time IFS tests B2>=75, the >=90 case is already handled, so the pair order IS the logic — biggest threshold first. The one behavioral difference: nested IF's final else is built in, while IFS has none — if no condition matches, it returns #N/A. The fix is the TRUE catch-all as the last pair, which always matches and acts as the else. Both formulas produce identical tiers on the verified grid below. IFS needs Excel 2019/365 or Google Sheets; a single either/or is still cleaner as plain IF.",
    steps: [
      { part: 'B2>=90,"Gold"', meaning: "First pair, tested first — put the biggest threshold at the front." },
      { part: 'B2>=75,"Silver"', meaning: "Only reached when the Gold test failed, so it means 75 to 89." },
      { part: 'TRUE,"Bronze"', meaning: "The catch-all else. Without it, anything below 75 returns #N/A." },
    ],
    whenToUse:
      "Use IFS for commission tiers, grade bands, shipping brackets, and status labels — anywhere three or more outcomes stack. Keep plain IF for two-outcome checks like pass/fail or overdue/on-time.",
    commonMistakes: [
      {
        mistake: "No catch-all, so unmatched rows show #N/A.",
        fix: 'IFS has no built-in else. =IFS(B2>=90,"Gold",B2>=75,"Silver") returns #N/A for a 60. End with TRUE,"Bronze" to catch everything left.',
      },
      {
        mistake: "Thresholds in the wrong order.",
        fix: 'IFS stops at the first true pair. =IFS(B2>=75,"Silver",B2>=90,"Gold",...) traps a 92 at Silver because >=75 matched first. Order pairs from the strictest condition down.',
      },
      {
        mistake: "Shipping IFS to Excel 2016 users.",
        fix: "IFS needs Excel 2019/365 or Google Sheets — older versions show #NAME?. For files that circulate widely, keep the nested IF; the logic is identical.",
      },
    ],
    sampleInput: {
      columns: ["Rep", "Score"],
      rows: [
        ["Ana Torres", "92"],
        ["Ben Okafor", "80"],
        ["Cara Lim", "61"],
      ],
    },
    sampleOutput: {
      columns: ["Rep", "Tier (IFS = nested IF)"],
      rows: [
        ["Ana Torres", "Gold"],
        ["Ben Okafor", "Silver"],
        ["Cara Lim", "Bronze"],
      ],
      highlightColumn: 1,
    },
    related: ["create-pass-fail-status", "create-status-multiple-conditions", "switch-replace-nested-ifs"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Rep", "Score", "IFS", "Nested IF"],
          ["Ana Torres", 92, '=IFS(B2>=90,"Gold",B2>=75,"Silver",TRUE,"Bronze")', '=IF(B2>=90,"Gold",IF(B2>=75,"Silver","Bronze"))'],
          ["Ben Okafor", 80, '=IFS(B3>=90,"Gold",B3>=75,"Silver",TRUE,"Bronze")', '=IF(B3>=90,"Gold",IF(B3>=75,"Silver","Bronze"))'],
          ["Cara Lim", 61, '=IFS(B4>=90,"Gold",B4>=75,"Silver",TRUE,"Bronze")', '=IF(B4>=90,"Gold",IF(B4>=75,"Silver","Bronze"))'],
          ["No catch-all", 61, '=IFS(B5>=90,"Gold",B5>=75,"Silver")', null],
        ],
      },
      expect: [
        { cell: "C2", value: "Gold" },
        { cell: "D2", value: "Gold" },
        { cell: "C3", value: "Silver" },
        { cell: "D3", value: "Silver" },
        { cell: "C4", value: "Bronze" },
        { cell: "D4", value: "Bronze" },
        { cell: "C5", value: "#N/A" },
      ],
    },
  },
];
