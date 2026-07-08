import type { Formula } from "@/lib/schema";

export const hrFormulas: Formula[] = [
  {
    slug: "count-training-completed-by-department",
    kind: "formula",
    title: "Count Completed Training by Department",
    seoTitle: "Count Training Completions by Department (Excel)",
    description:
      "Use COUNTIFS to count how many people in one department have completed a training module, in Excel and Google Sheets.",
    category: "hr-training",
    difficulty: "beginner",
    functions: ["COUNTIFS"],
    keywords: [
      "count training completed",
      "training by department",
      "countifs department status",
      "compliance count",
      "training tracker",
    ],
    problem:
      "Your training tracker has one row per employee with their department and a status column, and leadership wants a per-department number: how many people in Sales have finished?",
    quickFormula: '=COUNTIFS(B:B,"Sales",D:D,"Complete")',
    excelFormula: '=COUNTIFS(B:B,"Sales",D:D,"Complete")',
    sheetsFormula: null,
    explanation:
      "COUNTIFS counts rows where every condition is true at once: column B says Sales and column D says Complete. Because both conditions must hold on the same row, a Finance employee marked Complete is not counted, and a Sales employee still In Progress is not counted either. Whole-column references like B:B keep working as new hires are added to the bottom of the tracker. Text matching ignores case, so \"complete\" and \"Complete\" both count — but extra spaces or different labels like \"Done\" do not.",
    steps: [
      { part: 'B:B,"Sales"', meaning: "First condition: the Department column must equal Sales." },
      { part: 'D:D,"Complete"', meaning: "Second condition: the Status column must equal Complete. Both must be true on the same row." },
    ],
    whenToUse:
      "Use this for any per-group completion count: safety training by department, onboarding steps by location, certification status by team. Point the first condition at a cell (like F1) to build a small summary table with one row per department.",
    commonMistakes: [
      {
        mistake: "Hardcoding the department in every summary cell.",
        fix: 'Type department names in a column and reference them: =COUNTIFS(B:B,F2,D:D,"Complete"). One formula fills down for every department.',
      },
      {
        mistake: "Status labels are inconsistent — \"Complete\", \"Completed\", \"Done\".",
        fix: "COUNTIFS only counts exact matches, so variants silently disappear from your count. Standardize the status column with a dropdown (data validation).",
      },
      {
        mistake: "Condition ranges are different sizes.",
        fix: "B2:B50 paired with D2:D99 returns #VALUE!. Use whole columns (B:B, D:D) or make every range cover the same rows.",
      },
    ],
    sampleInput: {
      columns: ["Employee", "Department", "Module", "Status"],
      rows: [
        ["Ana Torres", "Sales", "Safety 101", "Complete"],
        ["Ben Okafor", "Finance", "Safety 101", "Complete"],
        ["Cara Lim", "Sales", "Safety 101", "In Progress"],
        ["Dana Cruz", "Sales", "Safety 101", "Complete"],
        ["Eli Ford", "Ops", "Safety 101", "Not Started"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [["Sales completions", "2"]],
      highlightColumn: 1,
    },
    related: ["count-if-multiple-conditions", "calculate-completion-percentage", "flag-overdue-tasks"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "count-overdue-training-by-manager",
    kind: "formula",
    title: "Count Overdue Training by Manager",
    seoTitle: "Count Overdue Training per Manager in Excel",
    description:
      "Use COUNTIFS with TODAY to count each manager's direct reports whose training is past its due date and still not complete.",
    category: "hr-training",
    difficulty: "intermediate",
    functions: ["COUNTIFS", "TODAY"],
    keywords: [
      "overdue training count",
      "training past due date",
      "countifs before today",
      "training by manager",
      "compliance escalation",
    ],
    problem:
      "You need to escalate overdue training to the right manager — for each manager, count how many of their people have a due date in the past and a status that still isn't Complete.",
    quickFormula: '=COUNTIFS(C:C,"Ben Okafor",E:E,"<"&TODAY(),D:D,"<>Complete")',
    excelFormula: '=COUNTIFS(C:C,"Ben Okafor",E:E,"<"&TODAY(),D:D,"<>Complete")',
    sheetsFormula: null,
    explanation:
      "This COUNTIFS stacks three conditions that must all be true on the same row: the manager column matches Ben Okafor, the due date is earlier than today, and the status is anything except Complete. Dates are numbers under the hood, so \"<\"&TODAY() means \"before today\" — the operator sits in quotes and is joined to TODAY() with &, because TODAY() inside quotes would be treated as plain text. The \"<>Complete\" condition uses the not-equal operator, so In Progress and Not Started rows both count. Because TODAY() recalculates every day, the count updates itself as deadlines pass.",
    steps: [
      { part: 'C:C,"Ben Okafor"', meaning: "Condition 1: the Manager column must equal Ben Okafor." },
      { part: 'E:E,"<"&TODAY()', meaning: "Condition 2: the due date must be before today. The & joins the < operator to the live TODAY() value." },
      { part: 'D:D,"<>Complete"', meaning: "Condition 3: the status must NOT be Complete — <> means not equal." },
    ],
    whenToUse:
      "Use this to build an escalation table with one row per manager, so weekly compliance emails show exactly who owns the overdue items. The same pattern counts overdue invoices by owner or expired certifications by supervisor.",
    commonMistakes: [
      {
        mistake: "Writing the date condition as \"<TODAY()\".",
        fix: 'Inside quotes, TODAY() is just text and matches nothing. Concatenate it: "<"&TODAY().',
      },
      {
        mistake: "Forgetting the status condition.",
        fix: "Counting only past-due dates also counts people who finished before the deadline. Add D:D,\"<>Complete\" so finished training never shows as overdue.",
      },
      {
        mistake: "Due dates are text, not real dates.",
        fix: "If dates were pasted as text, the < comparison silently fails and the count is 0. Check that dates right-align (or use ISNUMBER) and re-enter or convert them.",
      },
    ],
    sampleInput: {
      columns: ["Employee", "Manager", "Status", "Due Date"],
      rows: [
        ["Ana Torres", "Ben Okafor", "In Progress", "2026-06-15"],
        ["Cara Lim", "Ben Okafor", "Complete", "2026-06-15"],
        ["Dana Cruz", "Ben Okafor", "Not Started", "2026-06-30"],
        ["Eli Ford", "Cara Lim", "In Progress", "2026-06-20"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [["Overdue under Ben Okafor", "2"]],
      highlightColumn: 1,
    },
    related: ["flag-overdue-tasks", "calculate-days-overdue", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
  },
  {
    slug: "build-skills-matrix-formula",
    kind: "formula",
    title: "Build a Skills Matrix With Counting Formulas",
    seoTitle: "Skills Matrix Formulas for Excel & Google Sheets",
    description:
      "Use COUNTIFS to count how many people meet a skill level in a skills matrix, and AVERAGEIFS to see the average level per skill.",
    category: "hr-training",
    difficulty: "intermediate",
    functions: ["COUNTIFS", "AVERAGEIFS"],
    keywords: [
      "skills matrix formula",
      "count skill level",
      "competency matrix",
      "countifs skill rating",
      "team capability gap",
    ],
    problem:
      "Your team's skills live in a simple list — one row per person per skill, rated 1 to 5 — and you need matrix-style answers: how many people are at level 3 or above in Excel, and where are the gaps?",
    quickFormula: '=COUNTIFS(B:B,"Excel",C:C,">=3")',
    excelFormula: '=COUNTIFS(B:B,"Excel",C:C,">=3")',
    sheetsFormula: null,
    explanation:
      "The trick to a skills matrix is keeping the data as a flat list — Person, Skill, Level — and letting formulas do the pivoting. COUNTIFS counts rows where column B names the skill and column C holds a level of 3 or more; the comparison operator goes in quotes because it is text to the formula. Point the skill at a cell instead of hardcoding it and one formula fills down for every skill in your matrix. For depth rather than headcount, AVERAGEIFS uses the same condition pattern: =AVERAGEIFS(C:C,B:B,\"Excel\") returns the average level for that skill, which makes weak spots obvious at a glance.",
    steps: [
      { part: 'B:B,"Excel"', meaning: "First condition: the Skill column must equal Excel." },
      { part: 'C:C,">=3"', meaning: "Second condition: the Level column must be 3 or higher. Operators like >= go in quotes." },
    ],
    whenToUse:
      "Use this to spot coverage gaps before they bite: how many people can run payroll, cover the CRM, or lead safety audits at a proficient level. If only one person clears the bar on a critical skill, you have a single point of failure.",
    commonMistakes: [
      {
        mistake: "Writing the level condition without quotes: C:C,>=3.",
        fix: 'Comparison operators must be quoted text: C:C,">=3". To compare against a cell, concatenate: ">="&F1.',
      },
      {
        mistake: "Storing the matrix as a wide grid instead of a flat list.",
        fix: "A person-by-skill grid looks nice but is hard to count across. Keep raw data as one row per person per skill, then build the display grid with COUNTIFS.",
      },
      {
        mistake: "Levels entered as text like \"Level 3\" or \"3 - Proficient\".",
        fix: 'The \">=3\" comparison needs plain numbers. Keep the Level column as 1–5 and put labels in a separate legend.',
      },
    ],
    sampleInput: {
      columns: ["Person", "Skill", "Level"],
      rows: [
        ["Ana Torres", "Excel", "4"],
        ["Ben Okafor", "Excel", "2"],
        ["Cara Lim", "Excel", "3"],
        ["Dana Cruz", "Payroll", "5"],
        ["Eli Ford", "Excel", "5"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [["Excel at level 3+", "3"]],
      highlightColumn: 1,
    },
    related: ["count-if-multiple-conditions", "sum-if-multiple-conditions", "calculate-completion-percentage"],
    lastReviewed: "2026-07-08",
    published: true,
  },
];
