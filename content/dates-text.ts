import type { Formula } from "@/lib/schema";

export const dateFormulas: Formula[] = [
  {
    slug: "calculate-days-overdue",
    kind: "formula",
    title: "Calculate Days Overdue",
    seoTitle: "Days Overdue Formula for Excel & Google Sheets",
    description:
      "Subtract the due date from today to see how many days late each item is — clamped to zero so future dates don't go negative.",
    category: "dates-deadlines",
    difficulty: "beginner",
    functions: ["TODAY", "MAX"],
    keywords: ["days overdue", "days late", "past due", "date difference", "aging"],
    problem:
      "You have a due-date column and need to see, for each row, how many days late it is — with items that aren't due yet showing zero instead of a negative number.",
    quickFormula: "=MAX(0,TODAY()-B2)",
    excelFormula: "=MAX(0,TODAY()-B2)",
    sheetsFormula: null,
    explanation:
      "Dates in spreadsheets are numbers, so TODAY()-B2 gives the number of days between today and the due date in B2. When the due date has passed, that's a positive number of days overdue. When the due date is still ahead, the subtraction goes negative — so MAX(0, …) clamps it: anything not yet due simply shows 0. The value updates every day the file is opened, because TODAY() always returns the current date.",
    steps: [
      { part: "TODAY()", meaning: "Today's date. Recalculates automatically every day." },
      { part: "-B2", meaning: "Subtracts the due date. Positive = overdue, negative = still ahead." },
      { part: "MAX(0, …)", meaning: "Shows 0 instead of a negative number for items not yet due." },
    ],
    whenToUse:
      "Use this for aging reports, overdue invoices, late tasks, and expired certifications — anywhere \"how late is it?\" matters more than a yes/no flag.",
    commonMistakes: [
      {
        mistake: "The result displays as a date like 1/14/1900 instead of a number.",
        fix: "The cell inherited date formatting. Change the cell's number format to Number or General.",
      },
      {
        mistake: "Due dates are text, not real dates.",
        fix: "Subtraction fails with #VALUE! if B2 holds text like \"July 8\". Convert with DATEVALUE or re-enter as a proper date.",
      },
    ],
    sampleInput: {
      columns: ["Task", "Due Date"],
      rows: [
        ["Send contract", "2026-06-28"],
        ["Book venue", "2026-07-15"],
        ["File permits", "2026-07-01"],
      ],
    },
    sampleOutput: {
      columns: ["Task", "Days Overdue"],
      rows: [
        ["Send contract", "10"],
        ["Book venue", "0"],
        ["File permits", "7"],
      ],
      highlightColumn: 1,
    },
    related: ["flag-overdue-tasks", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "flag-overdue-tasks",
    kind: "formula",
    title: "Flag Overdue Tasks Automatically",
    seoTitle: "Overdue Task Flag Formula (Excel & Sheets)",
    description:
      "Mark a task Overdue when its due date has passed and it isn't complete, using IF with AND — the backbone of every tracker.",
    category: "dates-deadlines",
    difficulty: "beginner",
    functions: ["IF", "AND", "TODAY"],
    keywords: ["overdue flag", "task tracker", "late tasks", "status formula", "due date status"],
    problem:
      "Your tracker has a due date and a status column, and you want a third column that automatically says Overdue when the date has passed and the work isn't done.",
    quickFormula: '=IF(AND(B2<TODAY(),C2<>"Complete"),"Overdue","On Track")',
    excelFormula: '=IF(AND(B2<TODAY(),C2<>"Complete"),"Overdue","On Track")',
    sheetsFormula: null,
    explanation:
      "AND checks two things at once: the due date in B2 is before today, and the status in C2 is not Complete. Only when both are true does IF return Overdue; otherwise it returns On Track. Completed tasks never show as overdue no matter how old their due date, and future-dated tasks stay On Track. The flag updates itself daily because TODAY() recalculates.",
    steps: [
      { part: "B2<TODAY()", meaning: "Is the due date in the past?" },
      { part: 'C2<>"Complete"', meaning: "Is the status anything other than Complete? <> means \"not equal\"." },
      { part: "AND(…)", meaning: "Both conditions must be true for the task to count as overdue." },
      { part: '"Overdue","On Track"', meaning: "What to show when overdue, and what to show otherwise." },
    ],
    whenToUse:
      "Use this as the status engine in project trackers, training compliance sheets, and invoice logs — then point conditional formatting or COUNTIF at the flag column.",
    commonMistakes: [
      {
        mistake: "Blank due dates get flagged as overdue.",
        fix: 'A blank date is treated as 0, which is always in the past. Guard it: =IF(B2="","",IF(AND(B2<TODAY(),C2<>"Complete"),"Overdue","On Track")).',
      },
      {
        mistake: "Status values don't exactly match \"Complete\".",
        fix: "\"Completed\" or \"complete \" (trailing space) won't match. Standardize the status column with a dropdown.",
      },
    ],
    sampleInput: {
      columns: ["Task", "Due Date", "Status"],
      rows: [
        ["Send contract", "2026-06-28", "In Progress"],
        ["Book venue", "2026-07-15", "In Progress"],
        ["File permits", "2026-07-01", "Complete"],
      ],
    },
    sampleOutput: {
      columns: ["Task", "Flag"],
      rows: [
        ["Send contract", "Overdue"],
        ["Book venue", "On Track"],
        ["File permits", "On Track"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-days-overdue", "count-if-multiple-conditions", "calculate-completion-percentage"],
    lastReviewed: "2026-07-08",
    published: true,
  },
];

export const textFormulas: Formula[] = [
  {
    slug: "extract-first-name",
    kind: "formula",
    title: "Extract the First Name from a Full Name",
    seoTitle: "Extract First Name in Excel & Google Sheets",
    description:
      "Split \"Ana Torres\" into just \"Ana\" — a universal LEFT + FIND version, plus the cleaner modern formulas for Excel 365 and Google Sheets.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["LEFT", "FIND", "TEXTBEFORE", "REGEXEXTRACT"],
    keywords: ["extract first name", "split full name", "split names", "first word", "separate names"],
    problem:
      "A column holds full names like \"Ana Torres\" and you need just the first names — for a mail merge greeting, a signup list, or matching against another system.",
    quickFormula: '=LEFT(A2,FIND(" ",A2)-1)',
    excelFormula: '=TEXTBEFORE(A2," ")',
    sheetsFormula: '=REGEXEXTRACT(A2,"^[^ ]+")',
    explanation:
      "The universal version works everywhere: FIND locates the first space in the name, and LEFT keeps everything before it — the -1 stops it from including the space itself. In Excel 365, TEXTBEFORE(A2,\" \") does the same thing more readably. In Google Sheets, REGEXEXTRACT(A2,\"^[^ ]+\") grabs the first run of non-space characters. All three return the first word, so \"Mary Jane Watson\" yields \"Mary\" — middle names stay behind.",
    steps: [
      { part: 'FIND(" ",A2)', meaning: "Finds the position of the first space — in \"Ana Torres\" that's 4." },
      { part: "-1", meaning: "Steps back one character so the space isn't included." },
      { part: "LEFT(A2, …)", meaning: "Keeps that many characters from the start: \"Ana\"." },
    ],
    whenToUse:
      "Use this to build greeting columns, split imported contact lists, or normalize names before matching two systems. Pair it with an extract-last-name column to fully split names.",
    commonMistakes: [
      {
        mistake: "Single-word names return #VALUE!.",
        fix: 'FIND fails when there\'s no space. Guard it: =IFERROR(LEFT(A2,FIND(" ",A2)-1),A2) returns the whole name instead.',
      },
      {
        mistake: "Names have leading spaces from an import.",
        fix: '" Ana Torres" returns an empty first name. Wrap the source in TRIM: =LEFT(TRIM(A2),FIND(" ",TRIM(A2))-1).',
      },
    ],
    sampleInput: {
      columns: ["Full Name"],
      rows: [["Ana Torres"], ["Ben Okafor"], ["Cara Lim"]],
    },
    sampleOutput: {
      columns: ["Full Name", "First Name"],
      rows: [
        ["Ana Torres", "Ana"],
        ["Ben Okafor", "Ben"],
        ["Cara Lim", "Cara"],
      ],
      highlightColumn: 1,
    },
    related: ["combine-first-and-last-name", "remove-extra-spaces"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "remove-extra-spaces",
    kind: "formula",
    title: "Remove Extra Spaces from Text",
    seoTitle: "Remove Extra Spaces in Excel & Google Sheets",
    description:
      "TRIM strips leading, trailing, and doubled spaces that break lookups and comparisons — the first fix for any imported data.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["TRIM", "SUBSTITUTE"],
    keywords: ["remove spaces", "trim", "extra spaces", "clean data", "whitespace", "lookup not matching"],
    problem:
      "Values that look identical refuse to match — because \"Ana Torres \" has an invisible trailing space. Imported and copy-pasted data is full of them.",
    quickFormula: "=TRIM(A2)",
    excelFormula: "=TRIM(A2)",
    sheetsFormula: null,
    explanation:
      "TRIM removes all spaces from the start and end of the text, and collapses any run of multiple spaces in the middle down to a single space. \"  Ana   Torres \" becomes \"Ana Torres\". It's the standard first step when cleaning imported data, and the most common cure for lookups that mysteriously return #N/A on values that look right. One caveat: web data often contains non-breaking spaces (character 160), which TRIM ignores — see the mistakes below.",
    steps: [
      { part: "TRIM(A2)", meaning: "Strips edge spaces and collapses internal runs of spaces to one." },
    ],
    whenToUse:
      "Run TRIM over any pasted or imported text before using it in lookups, comparisons, or deduplication. Add a clean column, TRIM everything, then paste it back as values.",
    commonMistakes: [
      {
        mistake: "TRIM \"doesn't work\" on data copied from the web.",
        fix: "That's usually a non-breaking space, which TRIM won't remove. Use =TRIM(SUBSTITUTE(A2,CHAR(160),\" \")).",
      },
      {
        mistake: "Trimming in place and deleting the original column too soon.",
        fix: "The TRIM column still references the original. Copy the trimmed column and Paste Special → Values before deleting the source.",
      },
    ],
    sampleInput: {
      columns: ["Raw"],
      rows: [["  Ana Torres "], ["Ben  Okafor"], [" Cara Lim"]],
    },
    sampleOutput: {
      columns: ["Raw", "Cleaned"],
      rows: [
        ["  Ana Torres ", "Ana Torres"],
        ["Ben  Okafor", "Ben Okafor"],
        [" Cara Lim", "Cara Lim"],
      ],
      highlightColumn: 1,
    },
    related: ["extract-first-name", "compare-two-columns", "fix-na-error"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "combine-first-and-last-name",
    kind: "formula",
    title: "Combine First and Last Names",
    seoTitle: "Combine First & Last Name in Excel & Sheets",
    description:
      "Join name columns into one full-name column with & or TEXTJOIN — including the trick that avoids stray spaces when a cell is blank.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["TEXTJOIN", "CONCAT"],
    keywords: ["combine names", "concatenate", "join columns", "merge cells text", "full name"],
    problem:
      "First and last names live in separate columns, but your mail merge, export, or report needs one \"Full Name\" column.",
    quickFormula: '=A2&" "&B2',
    excelFormula: '=A2&" "&B2',
    sheetsFormula: null,
    explanation:
      "The & operator glues text together, so A2&\" \"&B2 joins the first name, a space, and the last name. It's the fastest way to combine two columns. When some cells might be empty — a missing middle name, say — TEXTJOIN is smarter: =TEXTJOIN(\" \",TRUE,A2,B2,C2) joins everything with single spaces and the TRUE tells it to skip blanks entirely, so you never get doubled spaces.",
    steps: [
      { part: "A2", meaning: "The first name." },
      { part: '&" "&', meaning: "Glues a literal space between the parts." },
      { part: "B2", meaning: "The last name." },
    ],
    whenToUse:
      "Use & for a quick two-column join. Switch to TEXTJOIN when combining three or more parts, or when any part might be blank.",
    commonMistakes: [
      {
        mistake: "Forgetting the space between names.",
        fix: '=A2&B2 produces "AnaTorres". Always include the separator: =A2&" "&B2.',
      },
      {
        mistake: "Blank middle columns create double spaces.",
        fix: '=A2&" "&B2&" "&C2 leaves two spaces when B2 is empty. Use =TEXTJOIN(" ",TRUE,A2,B2,C2) to skip blanks.',
      },
    ],
    sampleInput: {
      columns: ["First", "Last"],
      rows: [
        ["Ana", "Torres"],
        ["Ben", "Okafor"],
      ],
    },
    sampleOutput: {
      columns: ["First", "Last", "Full Name"],
      rows: [
        ["Ana", "Torres", "Ana Torres"],
        ["Ben", "Okafor", "Ben Okafor"],
      ],
      highlightColumn: 2,
    },
    related: ["extract-first-name", "remove-extra-spaces"],
    lastReviewed: "2026-07-08",
    published: true,
  },
];
