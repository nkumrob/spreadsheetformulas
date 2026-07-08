import type { Formula } from "@/lib/schema";

export const lifesaverFormulas: Formula[] = [
  {
    slug: "iferror-catch-formula-errors",
    kind: "formula",
    title: "Catch Any Formula Error With IFERROR",
    seoTitle: "IFERROR Formula: Catch Errors (Excel & Sheets)",
    description:
      "Wrap a risky calculation in IFERROR to swap any error for a fallback like 0 — keeping totals, charts, and reports working.",
    category: "conditional-logic",
    difficulty: "beginner",
    functions: ["IFERROR", "IFNA"],
    keywords: ["iferror", "hide div/0 error", "replace error with 0", "ifna vs iferror", "catch formula errors"],
    problem:
      "One order row has zero quantity, so your price-per-unit column shows #DIV/0! — which poisons the SUM at the bottom and makes the whole report look broken.",
    quickFormula: "=IFERROR(A2/B2,0)",
    excelFormula: "=IFERROR(A2/B2,0)",
    sheetsFormula: null,
    explanation:
      "IFERROR runs your calculation and, only if it fails, returns the fallback instead — and it catches every error type: #DIV/0!, #N/A, #VALUE!, #REF!, #NAME?, and #NUM!. Returning 0 is the popular fallback for numeric columns because a 0 flows cleanly into every SUM and running total below it, so one bad row no longer breaks the report. The trade-off is that a fallback 0 looks exactly like a real zero, so for columns people read directly, many prefer \"\" to keep missing data visible. When the only error you expect is a failed lookup, reach for IFNA instead — it catches #N/A but lets genuine bugs like #REF! stay loud. That selectivity is the point: IFERROR silences everything, including the errors you needed to see.",
    steps: [
      { part: "A2/B2", meaning: "The calculation to try. Any formula can go here — a division, a VLOOKUP, a percentage change." },
      { part: "0", meaning: 'What to show when it errors. Use 0 for columns that feed math, "" for display columns, or a label like "Check qty".' },
    ],
    whenToUse:
      "Use it where errors are expected and harmless: revenue per order when an order count can be zero, VLOOKUPs against a customer list that's still being filled in, month-over-month change when last month had no sales.",
    commonMistakes: [
      {
        mistake: "Wrapped the whole workbook in IFERROR and shipped wrong numbers.",
        fix: "IFERROR doesn't fix errors — it hides them. A broken reference or a mistyped range quietly becomes 0 and flows straight into your totals. Only wrap formulas where you know exactly why the error happens and the fallback is genuinely the right answer.",
      },
      {
        mistake: "Returning 0 when the data is actually missing.",
        fix: 'A fallback 0 keeps SUM working, but "no data yet" and "really zero" now look identical. If people read the column directly, return "" or "n/a" instead, and keep 0 only for columns that feed calculations.',
      },
      {
        mistake: "Using IFERROR when you only expect #N/A from a lookup.",
        fix: '=IFNA(VLOOKUP(D2,Prices!A:B,2,FALSE),0) handles the missing-item case but still surfaces a real #REF! or #VALUE! so you can fix it instead of averaging it away.',
      },
    ],
    sampleInput: {
      columns: ["Customer", "Revenue", "Orders"],
      rows: [
        ["Acme Co", "2400", "8"],
        ["Borealis", "1500", "0"],
        ["Cobalt", "960", "3"],
      ],
    },
    sampleOutput: {
      columns: ["Customer", "Revenue", "Orders", "Per Order"],
      rows: [
        ["Acme Co", "2400", "8", "300"],
        ["Borealis", "1500", "0", "0"],
        ["Cobalt", "960", "3", "320"],
      ],
      highlightColumn: 3,
    },
    related: ["fix-div0-error", "fix-na-error", "fix-value-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Customer", "Revenue", "Orders", "Per Order", "IFNA Demo"],
          ["Acme Co", 2400, 8, "=IFERROR(B2/C2,0)", '=IFNA(VLOOKUP("Zed",A2:B4,2,FALSE),0)'],
          ["Borealis", 1500, 0, "=IFERROR(B3/C3,0)", "=IFNA(B3/C3,0)"],
          ["Cobalt", 960, 3, "=IFERROR(B4/C4,0)", null],
        ],
      },
      expect: [
        { cell: "D2", value: 300 }, // working division untouched
        { cell: "D3", value: 0 }, // #DIV/0! caught → 0
        { cell: "D4", value: 320 },
        { cell: "E2", value: 0 }, // IFNA catches the failed lookup's #N/A
        { cell: "E3", value: "#DIV/0!" }, // …but passes a division error through
      ],
    },
  },
  {
    slug: "substitute-find-and-replace",
    kind: "formula",
    title: "Find and Replace Text With SUBSTITUTE",
    seoTitle: "SUBSTITUTE: Find and Replace (Excel & Sheets)",
    description:
      "SUBSTITUTE swaps every occurrence of one piece of text for another — strip dashes from phone numbers, drop currency symbols, or fix separators in bulk.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["SUBSTITUTE"],
    keywords: ["substitute formula", "find and replace formula", "remove dashes", "remove characters from cell", "replace text in cell"],
    problem:
      "Every phone number in the export has dashes, half the SKUs use the wrong separator, and manual Find & Replace means redoing the cleanup every time a new export lands.",
    quickFormula: '=SUBSTITUTE(A2,"-","")',
    excelFormula: '=SUBSTITUTE(A2,"-","")',
    sheetsFormula: null,
    explanation:
      "SUBSTITUTE scans the text in A2 for every occurrence of the first string and swaps in the second — replacing a dash with nothing simply deletes all the dashes. Because it's a formula, the cleanup re-runs itself whenever fresh data is pasted in, which is what makes it better than one-off Find & Replace for recurring exports. An optional fourth argument targets a single occurrence: =SUBSTITUTE(A2,\"-\",\"/\",2) changes only the second dash and leaves the rest alone. It matches by text, unlike its sibling REPLACE, which overwrites by character position — use REPLACE when you know where, SUBSTITUTE when you know what. And you can nest one inside another to make several swaps in one cell: =SUBSTITUTE(SUBSTITUTE(A2,\"$\",\"\"),\",\",\"\") strips both the currency symbol and the thousands comma.",
    steps: [
      { part: "A2", meaning: "The cell holding the text to clean." },
      { part: '"-"', meaning: "The text to find — case-sensitive, and it can be more than one character." },
      { part: '""', meaning: "The replacement. Empty text deletes every match; add a 4th argument like 2 to replace only the 2nd occurrence." },
    ],
    whenToUse:
      "Use it to strip dashes or spaces out of phone numbers and SKUs before matching them, swap separators in product codes, or remove currency symbols and thousands commas from amounts stored as text.",
    commonMistakes: [
      {
        mistake: "Expecting it to ignore case.",
        fix: 'SUBSTITUTE is case-sensitive: =SUBSTITUTE(A2,"usd","") leaves "USD" untouched. Match the exact casing, or normalize the text first with UPPER or LOWER.',
      },
      {
        mistake: "Reaching for SUBSTITUTE when you mean REPLACE.",
        fix: 'SUBSTITUTE finds text; REPLACE overwrites a position. To rewrite the first 3 characters whatever they are, use =REPLACE(A2,1,3,"+1"). To change every dash wherever it appears, use SUBSTITUTE.',
      },
      {
        mistake: "Treating the cleaned result as a number.",
        fix: 'SUBSTITUTE always returns text — SUM quietly skips a text "1250". Convert it: =VALUE(SUBSTITUTE(A2,"-","")) or multiply the result by 1.',
      },
    ],
    sampleInput: {
      columns: ["Customer", "Phone"],
      rows: [
        ["Ana Torres", "555-010-4477"],
        ["Ben Okafor", "555-268-9034"],
      ],
    },
    sampleOutput: {
      columns: ["Customer", "Phone", "Cleaned"],
      rows: [
        ["Ana Torres", "555-010-4477", "5550104477"],
        ["Ben Okafor", "555-268-9034", "5552689034"],
      ],
      highlightColumn: 2,
    },
    related: ["remove-extra-spaces", "split-text-by-delimiter", "extract-email-domain"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Raw", "Result"],
          ["555-010-4477", '=SUBSTITUTE(A2,"-","")'],
          ["SKU-100-EU", '=SUBSTITUTE(A3,"-","/",2)'],
          ["$1,250", '=SUBSTITUTE(SUBSTITUTE(A4,"$",""),",","")'],
        ],
      },
      expect: [
        { cell: "B2", value: "5550104477" }, // all dashes stripped
        { cell: "B3", value: "SKU-100/EU" }, // only the 2nd dash replaced
        { cell: "B4", value: "1250" }, // chained: $ then comma removed
      ],
    },
  },
  {
    slug: "extract-numbers-from-text",
    kind: "formula",
    title: "Extract Numbers From Messy Text",
    seoTitle: "Extract Numbers From Text (Excel & Google Sheets)",
    description:
      'Pull the digits out of entries like "Order #4521 (rush)" — one line of REGEXEXTRACT in Google Sheets, a dynamic-array digit filter in Excel 365.',
    category: "text-cleanup",
    difficulty: "advanced",
    functions: ["REGEXEXTRACT", "TEXTJOIN", "SEQUENCE", "MID", "LEN", "IFERROR"],
    keywords: ["extract numbers from text", "get digits from cell", "regexextract number", "pull order number from text", "remove letters from cell"],
    problem:
      'Order references arrive buried in free-typed text — "Order #4521 (rush)", "Invoice INV-0087" — and you need just the number so you can match it against another sheet.',
    quickFormula: '=TEXTJOIN("",TRUE,IFERROR(MID(A2,SEQUENCE(LEN(A2)),1)*1,""))',
    excelFormula: '=TEXTJOIN("",TRUE,IFERROR(MID(A2,SEQUENCE(LEN(A2)),1)*1,""))',
    sheetsFormula: '=REGEXEXTRACT(A2,"[0-9]+")',
    explanation:
      'In Google Sheets, REGEXEXTRACT returns the first unbroken run of digits it finds — the pattern [0-9]+ means "one or more digits in a row." What comes back is text, not a number, so multiply by 1 before comparing it to real numbers: =REGEXEXTRACT(A2,"[0-9]+")*1. Classic Excel has no regex functions, so the Excel version tests every character instead: SEQUENCE(LEN(A2)) counts positions 1 through the length of the text, MID grabs the character at each position, and multiplying by 1 keeps digits while turning everything else into an error. IFERROR swaps those errors for empty text, and TEXTJOIN glues the survivors back into one string — leaving only the digits. It looks intimidating, but it is a single copy-paste that handles any text you throw at it.',
    steps: [
      { part: "SEQUENCE(LEN(A2))", meaning: "Builds the list 1, 2, 3, … up to the length of the text — one entry per character." },
      { part: "MID(A2,…,1)", meaning: "Pulls out the single character at each of those positions." },
      { part: "*1", meaning: "Digits survive as numbers; letters, spaces, and symbols become #VALUE! errors." },
      { part: 'IFERROR(…,"")', meaning: "Replaces every errored (non-digit) character with empty text." },
      { part: 'TEXTJOIN("",TRUE,…)', meaning: "Glues what's left back together into one string of digits." },
    ],
    whenToUse:
      "Use it when order numbers, invoice IDs, or quantities are trapped inside notes and subject lines, and you need the bare number to look up against another sheet or add up in a report.",
    commonMistakes: [
      {
        mistake: "Treating the result as a number.",
        fix: 'Both formulas return text — a "4521" that SUM skips and that won\'t match a real 4521 in a lookup. Append *1 to convert (note it drops leading zeros, so "0087" becomes 87).',
      },
      {
        mistake: "Running the Excel formula in Excel 2019 or older.",
        fix: "SEQUENCE and dynamic arrays need Excel 365 or 2021 — older versions show #NAME?. Fall back to Flash Fill (Ctrl+E) or ask for the export with the number in its own column.",
      },
      {
        mistake: "Text with more than one number group.",
        fix: 'The two versions disagree: on "Ship 15 of 30", REGEXEXTRACT grabs only the first group (15), while the Excel digit filter merges everything into 1530. Check which number you actually want before trusting either.',
      },
    ],
    sampleInput: {
      columns: ["Order Note"],
      rows: [["Order #4521 (rush)"], ["Invoice INV-0087"], ["Ship 15 units"]],
    },
    sampleOutput: {
      columns: ["Order Note", "Number"],
      rows: [
        ["Order #4521 (rush)", "4521"],
        ["Invoice INV-0087", "0087"],
        ["Ship 15 units", "15"],
      ],
      highlightColumn: 1,
    },
    related: ["split-text-by-delimiter", "extract-email-domain", "fix-value-error"],
    lastReviewed: "2026-07-08",
    published: true,
    // REGEXEXTRACT is on the ENGINE_MISSING list, and a probe confirmed the
    // Excel 365 digit filter doesn't compute in HyperFormula either (SEQUENCE
    // arrays don't broadcast inside MID under the harness options — it
    // returns "" instead of "4521"). Both variants are hand-verified in
    // real Excel 365 and Google Sheets.
    verification: {
      sheets: {
        Sheet1: [
          ["Text", "Extracted"],
          ["Order #4521 (rush)", '=REGEXEXTRACT(A2,"[0-9]+")'],
          ["Invoice 88", '=REGEXEXTRACT(A3,"[0-9]+")*1'],
        ],
      },
      expect: [
        { cell: "B2", value: "4521" },
        { cell: "B3", value: 88 },
      ],
    },
  },
];
