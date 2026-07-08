import type { Formula } from "@/lib/schema";

export const text2Formulas: Formula[] = [
  {
    slug: "extract-last-name",
    kind: "formula",
    title: "Extract the Last Name from a Full Name",
    seoTitle: "Extract Last Name in Excel & Google Sheets",
    description:
      "Pull \"Torres\" out of \"Ana Torres\" — a universal MID + FIND version, plus cleaner one-liners for Excel 365 and Google Sheets.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["MID", "FIND", "TEXTAFTER", "REGEXEXTRACT"],
    keywords: ["extract last name", "split full name", "surname formula", "last word", "separate names"],
    problem:
      "A column holds full names like \"Ana Torres\" and you need just the last names — to sort a roster alphabetically, match against HR records, or fill a separate surname field.",
    quickFormula: '=MID(A2,FIND(" ",A2)+1,100)',
    excelFormula: '=TEXTAFTER(A2," ")',
    sheetsFormula: '=REGEXEXTRACT(A2,"\\S+$")',
    explanation:
      "The universal version works everywhere: FIND locates the first space, and MID grabs everything starting one character after it — the 100 is just \"plenty of characters,\" so the rest of the name comes through. In Excel 365, TEXTAFTER(A2,\" \") reads more naturally and does the same thing. Google Sheets' REGEXEXTRACT(A2,\"\\S+$\") behaves slightly differently: it grabs only the final word. That matters for multi-word surnames — \"Ana de la Cruz\" gives \"de la Cruz\" with MID or TEXTAFTER, but only \"Cruz\" with the regex. Pick the behavior that matches your data.",
    steps: [
      { part: 'FIND(" ",A2)', meaning: "Finds the position of the first space — in \"Ana Torres\" that's 4." },
      { part: "+1", meaning: "Steps forward one character so the space itself is skipped." },
      { part: "MID(A2, …, 100)", meaning: "Returns up to 100 characters from that point: \"Torres\". 100 is simply \"more than enough\"." },
    ],
    whenToUse:
      "Use this to sort contact lists by surname, split imported names into separate columns, or match people against a system that stores last names on their own. Pair it with extract-first-name to fully split a name column.",
    commonMistakes: [
      {
        mistake: "Single-word names return #VALUE!.",
        fix: 'FIND fails when there\'s no space. Guard it: =IFERROR(MID(A2,FIND(" ",A2)+1,100),A2) returns the whole name instead.',
      },
      {
        mistake: "Multi-word surnames come back wrong.",
        fix: "\"Ana de la Cruz\" yields \"de la Cruz\" with MID or TEXTAFTER but only \"Cruz\" with REGEXEXTRACT(A2,\"\\S+$\"). Decide which your data needs — there's no formula that reliably knows where a compound surname starts.",
      },
      {
        mistake: "Middle names end up in the result.",
        fix: 'The MID version returns everything after the FIRST space, so "Mary Jane Watson" gives "Jane Watson". To get only the final word in Excel 365, use =TEXTAFTER(A2," ",-1), which splits at the LAST space.',
      },
    ],
    sampleInput: {
      columns: ["Full Name"],
      rows: [["Ana Torres"], ["Ben Okafor"], ["Cara Lim"]],
    },
    sampleOutput: {
      columns: ["Full Name", "Last Name"],
      rows: [
        ["Ana Torres", "Torres"],
        ["Ben Okafor", "Okafor"],
        ["Cara Lim", "Lim"],
      ],
      highlightColumn: 1,
    },
    related: ["extract-first-name", "combine-first-and-last-name", "remove-extra-spaces"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Full Name", "Last Name"],
          ["Ana Torres", '=MID(A2,FIND(" ",A2)+1,100)'],
          ["Ben Okafor", '=MID(A3,FIND(" ",A3)+1,100)'],
          ["Ana de la Cruz", '=MID(A4,FIND(" ",A4)+1,100)'],
          ["Cher", '=IFERROR(MID(A5,FIND(" ",A5)+1,100),A5)'],
        ],
      },
      expect: [
        { cell: "B2", value: "Torres" },
        { cell: "B3", value: "Okafor" },
        { cell: "B4", value: "de la Cruz" },
        { cell: "B5", value: "Cher" },
      ],
    },
  },
  {
    slug: "extract-email-domain",
    kind: "formula",
    title: "Extract the Domain from an Email Address",
    seoTitle: "Extract Email Domain in Excel & Google Sheets",
    description:
      "Pull \"acme.com\" out of \"ana@acme.com\" with MID and FIND — perfect for grouping contacts by company.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["MID", "FIND"],
    keywords: ["extract email domain", "split email", "text after @", "company from email", "domain formula"],
    problem:
      "You have a column of email addresses and need just the part after the @ — to group signups by company, spot personal Gmail addresses in a B2B list, or count contacts per organization.",
    quickFormula: '=MID(A2,FIND("@",A2)+1,100)',
    excelFormula: '=MID(A2,FIND("@",A2)+1,100)',
    sheetsFormula: null,
    explanation:
      "FIND locates the position of the @ sign, and MID returns everything starting one character after it — the +1 skips the @ itself, and 100 just means \"take up to 100 characters,\" which is longer than any real domain. Because every valid email has exactly one @, this is one of the most reliable text extractions there is, and it works identically in Excel and Google Sheets. In Excel 365 you can also write =TEXTAFTER(A2,\"@\") for the same result.",
    steps: [
      { part: 'FIND("@",A2)', meaning: "Finds the position of the @ — in \"ana@acme.com\" that's 4." },
      { part: "+1", meaning: "Steps past the @ so it isn't included in the result." },
      { part: "MID(A2, …, 100)", meaning: "Returns up to 100 characters from that point: \"acme.com\"." },
    ],
    whenToUse:
      "Use this to segment a signup list by company, filter out free-mail domains like gmail.com from a lead list, or build a domain column you can point COUNTIF at to see contacts per organization.",
    commonMistakes: [
      {
        mistake: "Cells without an @ return #VALUE!.",
        fix: 'FIND errors when the @ is missing — a blank cell or a name typed where an email should be. Guard it: =IFERROR(MID(A2,FIND("@",A2)+1,100),"").',
      },
      {
        mistake: "Trailing spaces sneak into the domain.",
        fix: '"ana@acme.com " keeps its invisible space, so acme.com won\'t match acme.com elsewhere. Wrap the source: =MID(TRIM(A2),FIND("@",TRIM(A2))+1,100).',
      },
    ],
    sampleInput: {
      columns: ["Email"],
      rows: [["ana@acme.com"], ["ben@northline.io"], ["cara@acme.com"]],
    },
    sampleOutput: {
      columns: ["Email", "Domain"],
      rows: [
        ["ana@acme.com", "acme.com"],
        ["ben@northline.io", "northline.io"],
        ["cara@acme.com", "acme.com"],
      ],
      highlightColumn: 1,
    },
    related: ["extract-last-name", "remove-extra-spaces", "split-text-by-delimiter"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Email", "Domain"],
          ["ana@acme.com", '=MID(A2,FIND("@",A2)+1,100)'],
          ["ben@northline.io", '=MID(A3,FIND("@",A3)+1,100)'],
          ["not-an-email", '=MID(A4,FIND("@",A4)+1,100)'],
          ["not-an-email", '=IFERROR(MID(A5,FIND("@",A5)+1,100),"")'],
        ],
      },
      expect: [
        { cell: "B2", value: "acme.com" },
        { cell: "B3", value: "northline.io" },
        { cell: "B4", value: "#VALUE!" },
        { cell: "B5", value: "" },
      ],
    },
  },
  {
    slug: "capitalize-names",
    kind: "formula",
    title: "Capitalize Names Properly",
    seoTitle: "Capitalize Names with PROPER in Excel & Sheets",
    description:
      "PROPER turns \"ana torres\" or \"ANA TORRES\" into \"Ana Torres\" — the one-function fix for shouty or lowercase imports.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["PROPER"],
    keywords: ["capitalize names", "proper case", "title case", "fix uppercase", "lowercase to capital"],
    problem:
      "An export dumped every name in ALL CAPS or all lowercase, and you need them looking human again — \"Ana Torres\", not \"ANA TORRES\" — before they go into a mail merge or a report.",
    quickFormula: "=PROPER(A2)",
    excelFormula: "=PROPER(A2)",
    sheetsFormula: null,
    explanation:
      "PROPER capitalizes the first letter of every word and lowercases the rest, so \"ANA TORRES\" and \"ana torres\" both become \"Ana Torres\". It treats anything that isn't a letter as a word boundary, which is exactly right for ordinary first-and-last names. It works identically in Excel and Google Sheets. The catch: names with internal capitals don't follow the one-capital-per-word rule — \"McDonald\" comes out as \"Mcdonald\" and \"van der Berg\" as \"Van Der Berg\" — so a small manual pass over unusual surnames is still wise.",
    steps: [
      { part: "PROPER(A2)", meaning: "Capitalizes the first letter of each word in A2 and lowercases everything else." },
    ],
    whenToUse:
      "Use this after any import that arrives in the wrong case — CRM exports, badge-printer files, form submissions — before names appear in emails, letters, or printed reports. Combine with TRIM for a full name cleanup: =PROPER(TRIM(A2)).",
    commonMistakes: [
      {
        mistake: "McDonald becomes Mcdonald and DiCaprio becomes Dicaprio.",
        fix: "PROPER only knows one capital per word, so internal capitals are lost — and O'BRIEN becomes O'Brien only because the apostrophe counts as a word break. Filter for names containing Mc, Mac, or Di and fix those few by hand.",
      },
      {
        mistake: "Codes and acronyms in the same column get mangled.",
        fix: 'PROPER turns "HR-2026-ID" into "Hr-2026-Id". Only apply it to columns that are purely names, not mixed text.',
      },
      {
        mistake: "Editing the original column directly.",
        fix: "You can't wrap a cell in a formula in place. Add a helper column with =PROPER(A2), then copy it and Paste Special → Values over the original.",
      },
    ],
    sampleInput: {
      columns: ["Raw Name"],
      rows: [["ANA TORRES"], ["ben okafor"], ["CARA lim"]],
    },
    sampleOutput: {
      columns: ["Raw Name", "Fixed"],
      rows: [
        ["ANA TORRES", "Ana Torres"],
        ["ben okafor", "Ben Okafor"],
        ["CARA lim", "Cara Lim"],
      ],
      highlightColumn: 1,
    },
    related: ["remove-extra-spaces", "combine-first-and-last-name", "extract-first-name"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Raw Name", "Fixed"],
          ["ANA TORRES", "=PROPER(A2)"],
          ["ben okafor", "=PROPER(A3)"],
          ["o'brien", "=PROPER(A4)"],
          ["MCDONALD", "=PROPER(A5)"],
        ],
      },
      expect: [
        { cell: "B2", value: "Ana Torres" },
        { cell: "B3", value: "Ben Okafor" },
        // Apostrophe counts as a word break, so the B is capitalized — as the page claims.
        { cell: "B4", value: "O'Brien" },
        // Internal capitals are lost — the exact pitfall the page warns about.
        { cell: "B5", value: "Mcdonald" },
      ],
    },
  },
  {
    slug: "split-text-by-delimiter",
    kind: "formula",
    title: "Split Text into Columns by a Delimiter",
    seoTitle: "Split Text by Delimiter in Excel & Google Sheets",
    description:
      "Break \"Ana,Sales,Chicago\" into separate columns with one formula — TEXTSPLIT in Excel 365, SPLIT in Google Sheets.",
    category: "text-cleanup",
    difficulty: "intermediate",
    functions: ["TEXTSPLIT", "SPLIT", "TRIM"],
    keywords: ["split text", "text to columns formula", "split by comma", "delimiter", "separate values"],
    problem:
      "One column holds several values jammed together — \"Ana,Sales,Chicago\" — and you need each piece in its own column, without manually running Text to Columns every time the data updates.",
    quickFormula: '=TEXTSPLIT(A2,",")',
    excelFormula: '=TEXTSPLIT(A2,",")',
    sheetsFormula: '=SPLIT(A2,",")',
    explanation:
      "This is a case where the two platforms genuinely use different functions for the same job. Excel 365's TEXTSPLIT(A2,\",\") breaks the text at every comma and spills each piece into its own column to the right. Google Sheets' SPLIT(A2,\",\") does the same — with one quirk: SPLIT treats EACH character of the delimiter as a separate split point unless you add FALSE as a third argument, so SPLIT(A2,\", \") splits on commas AND spaces. Both are formulas, so unlike the manual Text to Columns tool, the results update automatically when the source changes. Neither exists in Excel 2019 or older — see the mistakes for the fallback.",
    steps: [
      { part: "A2", meaning: "The cell holding the combined text." },
      { part: '","', meaning: "The delimiter to split at. Use \";\", \"|\", or \" \" for other separators." },
      { part: "spilled result", meaning: "Each piece lands in its own column automatically — leave the cells to the right empty." },
    ],
    whenToUse:
      "Use this on exported CSV-style fields, tag lists, and \"City, State\" columns — anywhere one cell holds several values and the data refreshes often enough that manual Text to Columns becomes a chore.",
    commonMistakes: [
      {
        mistake: "Pieces come back with stray leading spaces.",
        fix: '"Ana, Sales, Chicago" splits into " Sales" and " Chicago". In Excel wrap it: =TRIM(TEXTSPLIT(A2,",")). In Sheets, =ARRAYFORMULA(TRIM(SPLIT(A2,",",FALSE))) trims every piece.',
      },
      {
        mistake: "TEXTSPLIT returns #NAME? in older Excel.",
        fix: "TEXTSPLIT is Excel 365 only. In Excel 2019 or earlier, use Data → Text to Columns, or extract pieces with TEXTBEFORE-style FIND and MID formulas.",
      },
      {
        mistake: "#SPILL! appears instead of the split values.",
        fix: "Something is sitting in the cells the result needs to spill into. Clear the columns to the right of the formula.",
      },
    ],
    sampleInput: {
      columns: ["Combined"],
      rows: [["Ana,Sales,Chicago"], ["Ben,Finance,Denver"], ["Cara,Ops,Austin"]],
    },
    sampleOutput: {
      columns: ["Name", "Dept", "City"],
      rows: [
        ["Ana", "Sales", "Chicago"],
        ["Ben", "Finance", "Denver"],
        ["Cara", "Ops", "Austin"],
      ],
      highlightColumn: 0,
    },
    related: ["extract-first-name", "extract-email-domain", "remove-extra-spaces"],
    lastReviewed: "2026-07-08",
    published: true,
    // TEXTSPLIT is not implemented by the HyperFormula engine (engine-gap exemption).
    verification: null,
  },
];
