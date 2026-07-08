import type { Formula } from "@/lib/schema";

export const duplicatesBlanksFormulas: Formula[] = [
  {
    slug: "find-missing-values",
    kind: "formula",
    title: "Find Values Missing From Another List",
    seoTitle: "Find Missing Values Between Two Lists in Excel & Sheets",
    description:
      "Check every value in one list against another and flag the ones that don't appear anywhere in the second list.",
    category: "lookup-matching",
    difficulty: "beginner",
    functions: ["IF", "COUNTIF"],
    keywords: ["find missing values", "compare two lists", "not in list", "missing from list", "reconcile lists"],
    problem:
      "You have two lists — say, everyone who was invited and everyone who registered — and you need to know which names from the first list never show up in the second.",
    quickFormula: '=IF(COUNTIF(B:B,A2)=0,"Missing","In list")',
    excelFormula: '=IF(COUNTIF(B:B,A2)=0,"Missing","In list")',
    sheetsFormula: null,
    explanation:
      "COUNTIF(B:B,A2) counts how many times the value in A2 appears anywhere in column B. If that count is zero, the value never appears in the second list, so the formula returns Missing; any count of one or more returns In list. Copy the formula down and every value in column A gets checked. Unlike a row-by-row comparison, this works even when the two lists are sorted differently or have different lengths, because it searches the entire column rather than the matching row.",
    steps: [
      { part: "COUNTIF(B:B,A2)", meaning: "Counts how many times the value in A2 appears anywhere in column B." },
      { part: "=0", meaning: "TRUE when the value was never found — that's what makes it missing." },
      { part: '"Missing"', meaning: "What to show when the value doesn't exist in the other list." },
      { part: '"In list"', meaning: "What to show when the value appears at least once." },
    ],
    whenToUse:
      "Use this when reconciling any two lists: invitees vs. registrants, last month's customers vs. this month's, payroll vs. the HR roster, or orders placed vs. orders shipped.",
    commonMistakes: [
      {
        mistake: "Checking the lists in only one direction.",
        fix: "This formula finds A-values missing from B. To find B-values missing from A, add a second column with =IF(COUNTIF(A:A,B2)=0,\"Missing\",\"In list\").",
      },
      {
        mistake: "Hidden spaces make matching values look missing.",
        fix: '"Ana Torres " with a trailing space won\'t match "Ana Torres". Clean both columns with TRIM first, or compare on =IF(COUNTIF(B:B,TRIM(A2))=0,"Missing","In list").',
      },
      {
        mistake: "Comparing numbers stored as text against real numbers.",
        fix: "COUNTIF treats the text \"104\" and the number 104 as different values. Convert one side — multiply the text column by 1, or use Data > Text to Columns — so both are the same type.",
      },
    ],
    sampleInput: {
      columns: ["Invited (A)", "Registered (B)"],
      rows: [
        ["Ana Torres", "Ana Torres"],
        ["Ben Okafor", "Cara Lim"],
        ["Cara Lim", "Eli Ford"],
        ["Dana Cruz", "Dana Cruz"],
      ],
    },
    sampleOutput: {
      columns: ["Invited (A)", "Result"],
      rows: [
        ["Ana Torres", "In list"],
        ["Ben Okafor", "Missing"],
        ["Cara Lim", "In list"],
        ["Dana Cruz", "In list"],
      ],
      highlightColumn: 1,
    },
    related: ["compare-two-columns", "count-duplicates", "vlookup-exact-match"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Invited (A)", "Registered (B)", "Result"],
          ["Ana Torres", "Ana Torres", '=IF(COUNTIF(B2:B5,A2)=0,"Missing","In list")'],
          ["Ben Okafor", "Cara Lim", '=IF(COUNTIF(B2:B5,A3)=0,"Missing","In list")'],
          ["Cara Lim", "Eli Ford", '=IF(COUNTIF(B2:B5,A4)=0,"Missing","In list")'],
          ["Dana Cruz", "Dana Cruz", '=IF(COUNTIF(B2:B5,A5)=0,"Missing","In list")'],
          [
            "Cara Lim ",
            null,
            '=IF(COUNTIF(B2:B5,A6)=0,"Missing","In list")',
            '=IF(COUNTIF(B2:B5,TRIM(A6))=0,"Missing","In list")',
          ],
        ],
      },
      expect: [
        { cell: "C2", value: "In list" },
        { cell: "C3", value: "Missing" },
        { cell: "C5", value: "In list" },
        // Trailing space hides the match (documented mistake); TRIM fixes it.
        { cell: "C6", value: "Missing" },
        { cell: "D6", value: "In list" },
      ],
    },
  },
  {
    slug: "remove-duplicates",
    kind: "formula",
    title: "Remove Duplicates and Keep One of Each",
    seoTitle: "Remove Duplicates in Excel & Google Sheets with UNIQUE",
    description:
      "Get a clean list with each value appearing exactly once, without deleting anything from your original data.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["UNIQUE"],
    keywords: ["remove duplicates", "unique values", "dedupe list", "distinct values", "clean up list"],
    problem:
      "Your list has the same names, emails, or codes repeated — from merged exports or double entry — and you need a version where each value appears only once.",
    quickFormula: "=UNIQUE(A2:A20)",
    excelFormula: "=UNIQUE(A2:A20)",
    sheetsFormula: null,
    explanation:
      "UNIQUE looks through A2:A20 and returns each distinct value once, in the order it first appears. The results spill automatically into the cells below the formula, so you type it in one cell and get the whole deduplicated list. Your original data is untouched — the formula builds a live copy, which updates itself whenever the source changes. UNIQUE requires Excel 365 or Excel 2021; it works in all versions of Google Sheets. In older Excel, use Data > Remove Duplicates instead (copy your data first, since that tool deletes rows permanently).",
    steps: [
      { part: "UNIQUE", meaning: "Returns each distinct value from the range exactly once." },
      { part: "A2:A20", meaning: "The range to deduplicate. Use A2:B20 to dedupe whole rows across two columns." },
    ],
    whenToUse:
      "Use this to build a clean master list from messy data: distinct customer names from an order log, departments from an employee export, or products from a sales sheet — especially as the source list for a dropdown or a summary report.",
    commonMistakes: [
      {
        mistake: "Getting #NAME? because your Excel version is too old.",
        fix: "UNIQUE only exists in Excel 365 and Excel 2021. In older Excel, select the data and use Data > Remove Duplicates — but copy the column first, because that tool deletes the duplicate rows permanently instead of building a separate list.",
      },
      {
        mistake: "Getting #SPILL! because cells below the formula aren't empty.",
        fix: "UNIQUE needs empty cells below it to spill the results into. Clear anything in the way, or move the formula to an empty column.",
      },
      {
        mistake: "Duplicates survive because of trailing spaces or inconsistent typing.",
        fix: '"Ana Torres" and "Ana Torres " count as different values, so both survive. Trim before deduplicating: =UNIQUE(TRIM(A2:A20)) in Excel 365, or =ARRAYFORMULA(UNIQUE(TRIM(A2:A20))) in Google Sheets.',
      },
      {
        mistake: "Deleting the original column and breaking the formula.",
        fix: "UNIQUE is a live reference, not a copy. If you want to delete the source data, first copy the UNIQUE results and use Paste Special > Values to freeze them.",
      },
    ],
    sampleInput: {
      columns: ["Department"],
      rows: [["Sales"], ["Finance"], ["Sales"], ["Ops"], ["Finance"]],
    },
    sampleOutput: {
      columns: ["Unique Departments"],
      rows: [["Sales"], ["Finance"], ["Ops"]],
      highlightColumn: 0,
    },
    related: ["count-duplicates", "highlight-duplicates", "remove-extra-spaces"],
    lastReviewed: "2026-07-08",
    published: true,
    // UNIQUE is not implemented by the HyperFormula verification engine.
    verification: null,
  },
  {
    slug: "count-duplicates",
    kind: "formula",
    title: "Count How Many Times Each Value Appears",
    seoTitle: "Count Duplicates in Excel & Google Sheets",
    description:
      "Put a count next to every row showing how many times its value appears in the column — any count above 1 means it's a duplicate.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["COUNTIF"],
    keywords: ["count duplicates", "how many times", "duplicate check", "occurrences in column", "find repeated values"],
    problem:
      "You suspect a list has duplicate entries — the same email, invoice number, or employee ID entered more than once — and you want to see exactly which values repeat and how often.",
    quickFormula: "=COUNTIF(A:A,A2)",
    excelFormula: "=COUNTIF(A:A,A2)",
    sheetsFormula: null,
    explanation:
      "COUNTIF(A:A,A2) counts how many cells in column A contain the same value as A2. Copy it down and every row shows its own occurrence count: a 1 means the value is unique, and anything greater than 1 means it's a duplicate. Every copy of a duplicate shows the same count — three copies of the same email all show 3. To turn the number into a plain label, wrap it in IF: =IF(COUNTIF(A:A,A2)>1,\"Duplicate\",\"Unique\"). The comparison ignores case, so ANA@CO.COM and ana@co.com count as the same value.",
    steps: [
      { part: "A:A", meaning: "The whole column to search. Use $A$2:$A$20 to limit it to your data range." },
      { part: "A2", meaning: "The value to count — the cell in this row. It stays relative so each row counts its own value." },
    ],
    whenToUse:
      "Use this before deduplicating any list you care about: invoice registers, email lists, employee IDs, order numbers. Seeing the counts first tells you how bad the problem is and which values to investigate before deleting anything.",
    commonMistakes: [
      {
        mistake: "Expecting only the second occurrence to be flagged.",
        fix: "Every copy of a duplicate gets the same count, including the first. To flag only the repeats and keep the first occurrence clean, use an expanding range: =IF(COUNTIF($A$2:A2,A2)>1,\"Duplicate\",\"\"). It counts only from the top down to the current row.",
      },
      {
        mistake: "The range shifts when you copy the formula down.",
        fix: "If you use a limited range like A2:A20 without dollar signs, it slides to A3:A21 on the next row and the counts go wrong. Lock it: =COUNTIF($A$2:$A$20,A2).",
      },
      {
        mistake: "Trailing spaces hide duplicates.",
        fix: '"Ben Okafor" and "Ben Okafor " count as different values, so real duplicates show a count of 1. Clean the column with TRIM first, or add a helper column of =TRIM(A2) and count that instead.',
      },
    ],
    sampleInput: {
      columns: ["Email"],
      rows: [
        ["ana@co.com"],
        ["ben@co.com"],
        ["ana@co.com"],
        ["cara@co.com"],
        ["ana@co.com"],
      ],
    },
    sampleOutput: {
      columns: ["Email", "Count"],
      rows: [
        ["ana@co.com", "3"],
        ["ben@co.com", "1"],
        ["ana@co.com", "3"],
        ["cara@co.com", "1"],
        ["ana@co.com", "3"],
      ],
      highlightColumn: 1,
    },
    related: ["remove-duplicates", "highlight-duplicates", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Email", "Count", "Repeats Only"],
          ["ana@co.com", "=COUNTIF($A$2:$A$6,A2)", '=IF(COUNTIF($A$2:A2,A2)>1,"Duplicate","")'],
          ["ben@co.com", "=COUNTIF($A$2:$A$6,A3)", '=IF(COUNTIF($A$2:A3,A3)>1,"Duplicate","")'],
          ["ana@co.com", "=COUNTIF($A$2:$A$6,A4)", '=IF(COUNTIF($A$2:A4,A4)>1,"Duplicate","")'],
          ["cara@co.com", "=COUNTIF($A$2:$A$6,A5)", '=IF(COUNTIF($A$2:A5,A5)>1,"Duplicate","")'],
          ["ana@co.com", "=COUNTIF($A$2:$A$6,A6)", '=IF(COUNTIF($A$2:A6,A6)>1,"Duplicate","")'],
        ],
      },
      expect: [
        { cell: "B2", value: 3 },
        { cell: "B3", value: 1 },
        { cell: "B6", value: 3 },
        // Expanding range flags only the repeats — first copy stays clean.
        { cell: "C2", value: "" },
        { cell: "C4", value: "Duplicate" },
        { cell: "C6", value: "Duplicate" },
      ],
    },
  },
  {
    slug: "count-if-status-complete",
    kind: "formula",
    title: "Count Rows With a Specific Status",
    seoTitle: "COUNTIF by Status in Excel & Google Sheets",
    description:
      "Count how many rows in a status column say Complete — or any other exact text — with a single COUNTIF formula.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["COUNTIF"],
    keywords: ["countif status", "count complete tasks", "count by text", "count cells with word", "task tracker count"],
    problem:
      "You have a tracker with a status column — Complete, In Progress, Not Started — and you need a live count of how many rows have reached a particular status.",
    quickFormula: '=COUNTIF(C2:C20,"Complete")',
    excelFormula: '=COUNTIF(C2:C20,"Complete")',
    sheetsFormula: null,
    explanation:
      "COUNTIF scans C2:C20 and counts every cell whose entire contents equal \"Complete\". The match ignores case — complete, COMPLETE, and Complete all count — but it must be the whole cell, so \"Complete (late)\" is not counted. The count updates automatically as statuses change, which makes this the standard building block for dashboard summary rows. To count each status, point the criteria at a cell instead of hard-coding the text: =COUNTIF($C$2:$C$20,E2) with the status names listed in column E.",
    steps: [
      { part: "C2:C20", meaning: "The status column to scan. Lock it as $C$2:$C$20 if you'll copy the formula." },
      { part: '"Complete"', meaning: "The exact text to count. Not case-sensitive, but the whole cell must match." },
    ],
    whenToUse:
      "Use this for the summary section of any tracker: tasks completed, tickets closed, orders shipped, invoices marked Paid. Pair it with a total count to compute a completion percentage.",
    commonMistakes: [
      {
        mistake: "The count is lower than expected because of inconsistent status text.",
        fix: 'Cells with "Completed", "complete " (trailing space), or "Done" won\'t match "Complete". Standardize the column with a dropdown (Data Validation), or catch variations with a wildcard: =COUNTIF(C2:C20,"Complet*").',
      },
      {
        mistake: "Counting cells that merely contain the word, not equal it.",
        fix: 'COUNTIF matches the entire cell. If your statuses have notes like "Complete - reviewed", use wildcards on both sides: =COUNTIF(C2:C20,"*Complete*").',
      },
      {
        mistake: "Hard-coding the status text in every summary formula.",
        fix: "Type the status names in cells and reference them: =COUNTIF($C$2:$C$20,E2). One formula copies down for every status, and renaming a status only needs one edit.",
      },
    ],
    sampleInput: {
      columns: ["Task", "Owner", "Status"],
      rows: [
        ["Send invoices", "Ana Torres", "Complete"],
        ["Update roster", "Ben Okafor", "In Progress"],
        ["Q3 budget", "Cara Lim", "Complete"],
        ["File report", "Dana Cruz", "Not Started"],
      ],
    },
    sampleOutput: {
      columns: ["Status", "Count"],
      rows: [
        ["Complete", "2"],
        ["In Progress", "1"],
        ["Not Started", "1"],
      ],
      highlightColumn: 1,
    },
    related: ["count-if-multiple-conditions", "calculate-completion-percentage", "sum-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Task", "Owner", "Status", null, "Count"],
          ["Send invoices", "Ana Torres", "Complete", null, '=COUNTIF(C2:C6,"Complete")'],
          ["Update roster", "Ben Okafor", "In Progress", null, '=COUNTIF(C2:C6,"Complet*")'],
          ["Q3 budget", "Cara Lim", "Complete"],
          ["File report", "Dana Cruz", "Not Started"],
          ["Archive files", "Eli Ford", "Completed"],
        ],
      },
      expect: [
        // "Completed" is not counted — the whole cell must match (documented mistake).
        { cell: "E2", value: 2 },
        // Wildcard variant catches "Completed" too.
        { cell: "E3", value: 3 },
      ],
    },
  },
];
