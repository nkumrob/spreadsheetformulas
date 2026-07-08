import type { Formula } from "@/lib/schema";

export const highlightingFormulas: Formula[] = [
  {
    slug: "find-blanks",
    kind: "formula",
    title: "Find Blank Cells in a Column",
    seoTitle: "Find Blank Cells in Excel & Google Sheets",
    description:
      "Flag every empty cell in a column with a simple IF check, so missing entries stand out instead of hiding in the data.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["IF", "ISBLANK"],
    keywords: ["find blank cells", "empty cells", "missing data", "flag blanks", "isblank"],
    problem:
      "A column that should be fully filled in — emails, phone numbers, due dates — has gaps, and you need to find every row where the entry is missing.",
    quickFormula: '=IF(A2="","Blank","Filled")',
    excelFormula: '=IF(A2="","Blank","Filled")',
    sheetsFormula: null,
    explanation:
      "The formula tests whether A2 equals an empty string. Truly empty cells pass the test, and so do cells containing a formula that returns \"\" — which is exactly what you usually want, because both look blank on screen. Copy it down, then filter or sort the helper column to isolate every gap. This is more forgiving than ISBLANK: ISBLANK(A2) returns TRUE only for a genuinely empty cell, so a cell holding =IFERROR(VLOOKUP(...),\"\") counts as filled to ISBLANK even though it displays nothing. Use ISBLANK only when you specifically need to distinguish truly empty cells from formula-produced blanks.",
    steps: [
      { part: 'A2=""', meaning: "TRUE when the cell is empty or contains a formula that returns empty text." },
      { part: '"Blank"', meaning: "What to show for missing entries — easy to filter or count later." },
      { part: '"Filled"', meaning: "What to show when the cell has content." },
    ],
    whenToUse:
      "Use this before importing data anywhere, sending a mail merge, or building a report — any time a gap in the column means a failed email, a skipped payment, or an incomplete record.",
    commonMistakes: [
      {
        mistake: "Using ISBLANK on cells that contain formulas.",
        fix: 'ISBLANK returns FALSE for a cell whose formula returns "" — the cell looks empty but technically holds a formula. Test A2="" instead, which treats both truly empty cells and empty-text results as blank.',
      },
      {
        mistake: "Cells containing only a space slip through as Filled.",
        fix: 'A cell with " " in it isn\'t empty, but it looks blank. Catch those too with =IF(TRIM(A2)="","Blank","Filled").',
      },
      {
        mistake: "Checking the wrong thing when the cell shows a zero.",
        fix: 'A2="" is FALSE for a cell containing 0 — zero is a value, not a blank. If zeros should also count as missing, use =IF(OR(A2="",A2=0),"Blank","Filled").',
      },
    ],
    sampleInput: {
      columns: ["Employee", "Email"],
      rows: [
        ["Ana Torres", "ana@co.com"],
        ["Ben Okafor", ""],
        ["Cara Lim", "cara@co.com"],
        ["Dana Cruz", ""],
      ],
    },
    sampleOutput: {
      columns: ["Employee", "Email", "Result"],
      rows: [
        ["Ana Torres", "ana@co.com", "Filled"],
        ["Ben Okafor", "", "Blank"],
        ["Cara Lim", "cara@co.com", "Filled"],
        ["Dana Cruz", "", "Blank"],
      ],
      highlightColumn: 2,
    },
    related: ["count-blanks", "remove-extra-spaces", "find-missing-values"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Email", "Result"],
          ["ana@co.com", '=IF(A2="","Blank","Filled")'],
          [null, '=IF(A3="","Blank","Filled")'],
          ["cara@co.com", '=IF(A4="","Blank","Filled")'],
          [" ", '=IF(A5="","Blank","Filled")'],
          [" ", '=IF(TRIM(A6)="","Blank","Filled")'],
        ],
      },
      expect: [
        { cell: "B2", value: "Filled" },
        { cell: "B3", value: "Blank" },
        // A lone space slips through as Filled (documented mistake); TRIM catches it.
        { cell: "B5", value: "Filled" },
        { cell: "B6", value: "Blank" },
      ],
    },
  },
  {
    slug: "count-blanks",
    kind: "formula",
    title: "Count Blank Cells in a Range",
    seoTitle: "COUNTBLANK in Excel & Google Sheets",
    description:
      "Get a single number showing how many cells in a range are empty — a quick data-completeness check with COUNTBLANK.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["COUNTBLANK"],
    keywords: ["count blank cells", "countblank", "count empty cells", "missing entries", "data completeness"],
    problem:
      "You need to know how many entries are missing from a column — how many employees have no email on file, how many tasks have no due date — without scrolling through and counting gaps by hand.",
    quickFormula: "=COUNTBLANK(A2:A20)",
    excelFormula: "=COUNTBLANK(A2:A20)",
    sheetsFormula: null,
    explanation:
      "COUNTBLANK counts every cell in A2:A20 that is empty, including cells whose formula returns \"\" — anything that displays as blank. It's the complement of COUNTA, which counts non-empty cells, so COUNTBLANK plus COUNTA always equals the size of the range. That pairing gives you an instant completeness check: =COUNTA(A2:A20)/ROWS(A2:A20) is the percentage filled in. Cells containing a space or a zero are not counted as blank, because they hold a real value even if a space is invisible.",
    steps: [
      { part: "COUNTBLANK", meaning: "Counts cells that are empty or contain a formula returning empty text." },
      { part: "A2:A20", meaning: "The range to check. Keep it to your actual data rows — don't use the whole column." },
    ],
    whenToUse:
      "Use this at the top of any tracker as a live missing-data counter: unfilled emails before a mail merge, tasks without owners, invoices without dates. When the count hits zero, the dataset is ready.",
    commonMistakes: [
      {
        mistake: "Pointing it at a whole column and getting a huge number.",
        fix: "=COUNTBLANK(A:A) counts every empty row down to the bottom of the sheet — over a million in Excel. Limit the range to your data: =COUNTBLANK(A2:A20).",
      },
      {
        mistake: "Cells with a single space aren't counted as blank.",
        fix: 'A cell containing " " holds a value, so COUNTBLANK skips it even though it looks empty. Count those too with =SUMPRODUCT(--(TRIM(A2:A20)="")).',
      },
      {
        mistake: 'Expecting COUNTBLANK to ignore formulas that return "".',
        fix: 'It won\'t — a cell showing empty text counts as blank. If you need to count only truly empty cells (no formula at all), use =SUMPRODUCT(--ISBLANK(A2:A20)).',
      },
    ],
    sampleInput: {
      columns: ["Employee", "Phone"],
      rows: [
        ["Ana Torres", "555-0104"],
        ["Ben Okafor", ""],
        ["Cara Lim", "555-0317"],
        ["Dana Cruz", ""],
        ["Eli Ford", "555-0221"],
      ],
    },
    sampleOutput: {
      columns: ["Formula", "Result"],
      rows: [
        ["=COUNTBLANK(B2:B6)", "2"],
        ["=COUNTA(B2:B6)", "3"],
      ],
      highlightColumn: 1,
    },
    related: ["find-blanks", "count-if-status-complete", "calculate-completion-percentage"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Phone", "Result"],
          ["555-0104", "=COUNTBLANK(A2:A6)"],
          [null, "=COUNTA(A2:A6)"],
          ["555-0317", "=COUNTBLANK(A2:A7)"],
          [null],
          ["555-0221"],
          [" "],
        ],
      },
      expect: [
        { cell: "B2", value: 2 },
        // COUNTBLANK + COUNTA covers the whole range: 2 + 3 = 5 cells.
        { cell: "B3", value: 3 },
        // A7 holds a single space, so widening the range doesn't add a blank
        // (documented mistake: space-only cells aren't counted).
        { cell: "B4", value: 2 },
      ],
    },
  },
  {
    slug: "highlight-duplicates",
    kind: "formula",
    title: "Highlight Duplicate Values With Color",
    seoTitle: "Highlight Duplicates in Excel & Google Sheets",
    description:
      "Use a COUNTIF rule in conditional formatting to automatically color every cell whose value appears more than once.",
    category: "conditional-logic",
    difficulty: "intermediate",
    functions: ["COUNTIF"],
    keywords: ["highlight duplicates", "conditional formatting duplicates", "color duplicate cells", "duplicate values", "countif formatting rule"],
    problem:
      "You want duplicate entries to jump out visually — colored cells you can spot while scrolling — instead of adding a helper column and filtering for repeats.",
    quickFormula: "=COUNTIF($A$2:$A$20,A2)>1",
    excelFormula: "=COUNTIF($A$2:$A$20,A2)>1",
    sheetsFormula: null,
    explanation:
      "This formula doesn't go in a cell — it goes inside a conditional formatting rule, where it's evaluated once for every selected cell and colors the ones that return TRUE. COUNTIF($A$2:$A$20,A2) counts how many times each cell's value appears in the whole range; a count above 1 means duplicate, so every copy gets highlighted. In Excel: select A2:A20, then Home > Conditional Formatting > New Rule > \"Use a formula to determine which cells to format\", paste the formula, and pick a fill color. In Google Sheets: select A2:A20, then Format > Conditional formatting, set the condition to \"Custom formula is\", and paste the same formula. Write the formula from the perspective of the top-left cell of your selection (A2 here) — both apps adjust it automatically for every other cell.",
    steps: [
      { part: "$A$2:$A$20", meaning: "The full range to count within. The $ signs lock it so every cell counts against the same range." },
      { part: "A2", meaning: "The top-left cell of your selection, left relative so each cell checks its own value." },
      { part: ">1", meaning: "TRUE when the value appears more than once — that's what triggers the highlight." },
    ],
    whenToUse:
      "Use this on any column where repeats mean trouble: invoice numbers, employee IDs, email lists, booking references. The color updates live, so new duplicates light up the moment they're typed.",
    commonMistakes: [
      {
        mistake: "Locking the checked cell too: =COUNTIF($A$2:$A$20,$A$2)>1.",
        fix: "With $A$2 fully locked, every cell counts the first cell's value, so either everything highlights or nothing does. The range gets $ signs; the checked cell stays relative: =COUNTIF($A$2:$A$20,A2)>1.",
      },
      {
        mistake: "Writing the formula for the wrong starting cell.",
        fix: "The relative reference must match the top-left cell of the selected range. If your selection starts at A5, the rule is =COUNTIF($A$5:$A$23,A5)>1 — otherwise every highlight is shifted by a few rows.",
      },
      {
        mistake: "Pasting the formula into a cell instead of the rule box.",
        fix: "In a worksheet cell it just shows TRUE or FALSE. Open the conditional formatting dialog (Home > Conditional Formatting in Excel, Format > Conditional formatting in Sheets) and paste it there.",
      },
      {
        mistake: "Using a whole-column range and slowing the sheet down.",
        fix: "=COUNTIF(A:A,A2)>1 forces a full-column count for every cell and can make large sheets crawl, especially in Google Sheets. Limit the range to your data: $A$2:$A$20.",
      },
    ],
    sampleInput: {
      columns: ["Invoice #"],
      rows: [["INV-1041"], ["INV-1042"], ["INV-1041"], ["INV-1043"], ["INV-1042"]],
    },
    sampleOutput: {
      columns: ["Invoice #", "Rule Result"],
      rows: [
        ["INV-1041", "TRUE"],
        ["INV-1042", "TRUE"],
        ["INV-1041", "TRUE"],
        ["INV-1043", "FALSE"],
        ["INV-1042", "TRUE"],
      ],
      highlightColumn: 1,
    },
    related: ["count-duplicates", "remove-duplicates", "highlight-overdue-dates"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Invoice #", "Rule Result", "Locked-Cell Mistake"],
          ["INV-1041", "=COUNTIF($A$2:$A$6,A2)>1"],
          ["INV-1042", "=COUNTIF($A$2:$A$6,A3)>1"],
          ["INV-1041", "=COUNTIF($A$2:$A$6,A4)>1"],
          ["INV-1043", "=COUNTIF($A$2:$A$6,A5)>1", "=COUNTIF($A$2:$A$6,$A$2)>1"],
          ["INV-1042", "=COUNTIF($A$2:$A$6,A6)>1"],
        ],
      },
      expect: [
        { cell: "B2", value: true },
        { cell: "B4", value: true },
        { cell: "B5", value: false },
        { cell: "B6", value: true },
        // Documented mistake: fully locking the checked cell ($A$2) makes the
        // unique INV-1043 row highlight too, because it counts A2's value.
        { cell: "C5", value: true },
      ],
    },
  },
  {
    slug: "highlight-overdue-dates",
    kind: "formula",
    title: "Highlight Overdue Rows Automatically",
    seoTitle: "Highlight Overdue Dates in Excel & Google Sheets",
    description:
      "A conditional formatting rule that colors the whole row when a due date has passed and the task still isn't marked Complete.",
    category: "conditional-logic",
    difficulty: "intermediate",
    functions: ["AND", "TODAY"],
    keywords: ["highlight overdue", "conditional formatting dates", "past due highlight", "color overdue rows", "due date formatting"],
    problem:
      "Your task tracker has due dates and statuses, and you want overdue items to turn red automatically — the whole row, not just the date cell — without checking dates by hand every morning.",
    quickFormula: '=AND($B2<TODAY(),$C2<>"Complete")',
    excelFormula: '=AND($B2<TODAY(),$C2<>"Complete")',
    sheetsFormula: null,
    explanation:
      "This formula lives inside a conditional formatting rule applied to the whole table, say $A$2:$C$20. It returns TRUE — and triggers the highlight — only when both conditions hold: the due date in column B is before today, and the status in column C isn't Complete. The $ placement is what makes whole-row highlighting work: $B2 locks the column but not the row, so when the rule evaluates a cell in column A or C of row 2, it still checks B2's date and C2's status. Every cell in a row therefore gets the same TRUE/FALSE answer, and the entire row lights up together. Because TODAY() recalculates daily, rows turn red on their own the day after their deadline passes. Set it up via Home > Conditional Formatting > New Rule > \"Use a formula\" in Excel, or Format > Conditional formatting > \"Custom formula is\" in Google Sheets, with the full table selected.",
    steps: [
      { part: "$B2<TODAY()", meaning: "TRUE when the due date is before today. The $ locks column B so every cell in the row checks the same date." },
      { part: '$C2<>"Complete"', meaning: "TRUE when the status isn't Complete — finished tasks never highlight, however old." },
      { part: "AND(…)", meaning: "Both conditions must be TRUE: past due and still open." },
    ],
    whenToUse:
      "Use this on any tracker with deadlines: project tasks, invoices awaiting payment, contract renewals, license expirations. It turns the sheet into a self-updating early-warning system.",
    commonMistakes: [
      {
        mistake: "Forgetting the $ before the column letters.",
        fix: "With plain B2 and C2, the references shift as the rule moves across columns, so column A checks A2 and column C checks D2 — the highlighting looks random. Lock the columns: $B2 and $C2 (but leave the row number unlocked).",
      },
      {
        mistake: "Blank due dates get highlighted as overdue.",
        fix: 'An empty date cell counts as zero, and zero is before today, so rows with no deadline turn red. Exclude them: =AND($B2<>"",$B2<TODAY(),$C2<>"Complete").',
      },
      {
        mistake: "Dates stored as text never trigger the rule.",
        fix: "Text like \"07/03/2026\" can't be compared to TODAY(), so nothing highlights. Check with =ISNUMBER(B2) — if FALSE, convert the column to real dates (Data > Text to Columns in Excel, or Format > Number > Date in Sheets).",
      },
      {
        mistake: "Applying the rule to only one column and expecting full rows to color.",
        fix: "The rule only formats the cells it's applied to. Select the entire table range ($A$2:$C$20) before creating the rule, not just the date column.",
      },
    ],
    sampleInput: {
      columns: ["Task", "Due Date", "Status"],
      rows: [
        ["Send invoices", "2026-07-01", "Complete"],
        ["Update roster", "2026-07-03", "In Progress"],
        ["Q3 budget", "2026-07-15", "In Progress"],
        ["File report", "2026-06-28", "Not Started"],
      ],
    },
    sampleOutput: {
      columns: ["Task", "Due Date", "Rule Result"],
      rows: [
        ["Send invoices", "2026-07-01", "FALSE"],
        ["Update roster", "2026-07-03", "TRUE"],
        ["Q3 budget", "2026-07-15", "FALSE"],
        ["File report", "2026-06-28", "TRUE"],
      ],
      highlightColumn: 2,
    },
    related: ["flag-overdue-tasks", "calculate-days-overdue", "highlight-duplicates"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Task", "Due Date", "Status", "Rule Result"],
          ["Send invoices", "2026-07-01", "Complete", '=AND($B2<TODAY(),$C2<>"Complete")'],
          ["Update roster", "2026-07-03", "In Progress", '=AND($B3<TODAY(),$C3<>"Complete")'],
          ["Q3 budget", "2026-07-15", "In Progress", '=AND($B4<TODAY(),$C4<>"Complete")'],
          ["File report", "2026-06-28", "Not Started", '=AND($B5<TODAY(),$C5<>"Complete")'],
          ["No deadline", null, "In Progress", '=AND($B6<TODAY(),$C6<>"Complete")'],
          ["No deadline", null, "In Progress", '=AND($B7<>"",$B7<TODAY(),$C7<>"Complete")'],
        ],
      },
      expect: [
        // 2026-07-01 is past, but the task is Complete — no highlight.
        { cell: "D2", value: false },
        { cell: "D3", value: true },
        // 2026-07-15 is after the frozen TODAY() of 2026-07-08.
        { cell: "D4", value: false },
        { cell: "D5", value: true },
        // Documented mistake: a blank due date counts as zero, so it flags as
        // overdue; the $B7<>"" guard fixes it.
        { cell: "D6", value: true },
        { cell: "D7", value: false },
      ],
    },
  },
];
