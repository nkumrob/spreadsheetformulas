import type { Formula } from "@/lib/schema";

export const countingFormulas: Formula[] = [
  {
    slug: "count-if-multiple-conditions",
    kind: "formula",
    title: "Count Rows That Meet Multiple Conditions",
    seoTitle: "COUNTIFS: Count With Multiple Conditions",
    description:
      "Use COUNTIFS to count rows matching several conditions at once — like overdue tasks in one department — in Excel and Google Sheets.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["COUNTIFS"],
    keywords: ["countifs", "count with conditions", "count overdue by department", "multiple criteria"],
    problem:
      "You need a count that depends on more than one thing at once — how many tasks are both assigned to Sales and overdue, or how many employees in one location finished training.",
    quickFormula: '=COUNTIFS(A2:A20,"Sales",C2:C20,"Overdue")',
    excelFormula: '=COUNTIFS(A2:A20,"Sales",C2:C20,"Overdue")',
    sheetsFormula: null,
    explanation:
      "COUNTIFS counts rows where every condition is true at the same time. Here it counts rows where column A says Sales and column C says Overdue. Conditions come in pairs — a range, then the value it must match — and you can add up to 127 pairs. Text matching ignores case, and you can use comparison operators in quotes, like \">100\" or \"<\"&TODAY() for dates before today.",
    steps: [
      { part: 'A2:A20,"Sales"', meaning: "First condition: column A must equal Sales." },
      { part: 'C2:C20,"Overdue"', meaning: "Second condition: column C must equal Overdue. Both must be true." },
    ],
    whenToUse:
      "Use COUNTIFS whenever a count has an \"and\" in it: status and department, region and month, score above X and below Y.",
    commonMistakes: [
      {
        mistake: "Ranges are different sizes.",
        fix: "A2:A20 with C2:C99 returns #VALUE!. Every condition range must cover the same rows.",
      },
      {
        mistake: "Writing comparison operators without quotes.",
        fix: 'Conditions like >100 must be quoted: ">100". To compare against a cell, concatenate: ">"&F1.',
      },
      {
        mistake: "Needing OR logic instead of AND.",
        fix: 'COUNTIFS is AND-only. For "Sales OR Marketing", add two COUNTIFS together.',
      },
    ],
    sampleInput: {
      columns: ["Department", "Task", "Status"],
      rows: [
        ["Sales", "Q3 forecast", "Overdue"],
        ["Finance", "Close books", "Complete"],
        ["Sales", "Pipeline review", "Overdue"],
        ["Sales", "CRM cleanup", "Complete"],
        ["Ops", "Vendor audit", "Overdue"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [["Sales tasks overdue", "2"]],
      highlightColumn: 1,
    },
    related: ["sum-if-multiple-conditions", "calculate-completion-percentage", "flag-overdue-tasks"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Department", "Task", "Status"],
          ["Sales", "Q3 forecast", "Overdue"],
          ["Finance", "Close books", "Complete"],
          ["Sales", "Pipeline review", "Overdue"],
          ["Sales", "CRM cleanup", "Complete"],
          ["Ops", "Vendor audit", "Overdue"],
          ["Result", '=COUNTIFS(A2:A6,"Sales",C2:C6,"Overdue")', null],
        ],
      },
      expect: [{ cell: "B7", value: 2 }],
    },
  },
  {
    slug: "sum-if-multiple-conditions",
    kind: "formula",
    title: "Sum Values That Meet Multiple Conditions",
    seoTitle: "SUMIFS: Sum With Multiple Conditions",
    description:
      "Use SUMIFS to total only the rows that match your conditions — like sales for one region above a threshold — in Excel and Google Sheets.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["SUMIFS"],
    keywords: ["sumifs", "sum with conditions", "conditional sum", "sum by category", "total by region"],
    problem:
      "You need a total that only includes certain rows — revenue for one region, spend in one category, hours for one project — instead of summing the whole column.",
    quickFormula: '=SUMIFS(C2:C20,A2:A20,"Sales",B2:B20,">100")',
    excelFormula: '=SUMIFS(C2:C20,A2:A20,"Sales",B2:B20,">100")',
    sheetsFormula: null,
    explanation:
      "SUMIFS adds up values from C2:C20, but only for rows where column A equals Sales and column B is greater than 100. Note the argument order: the range to sum comes first, then the condition pairs. This is the reverse of the older SUMIF, which puts the sum range last — a regular source of confusion.",
    steps: [
      { part: "C2:C20", meaning: "The values to add up. This range comes first in SUMIFS." },
      { part: 'A2:A20,"Sales"', meaning: "Condition 1: column A must equal Sales." },
      { part: 'B2:B20,">100"', meaning: "Condition 2: column B must be greater than 100. Operators go in quotes." },
    ],
    whenToUse:
      "Use SUMIFS for any conditional total: revenue by rep, expenses by month, quantities by warehouse. For a full breakdown by every category at once, a pivot table is usually better.",
    commonMistakes: [
      {
        mistake: "Putting the sum range last, like SUMIF.",
        fix: "SUMIFS takes the sum range first. Mixing up the order sums the wrong column or errors out.",
      },
      {
        mistake: "Summing a range that contains text.",
        fix: "Text cells are silently treated as zero. Check the sum column holds real numbers, not numbers stored as text.",
      },
    ],
    sampleInput: {
      columns: ["Region", "Units", "Revenue"],
      rows: [
        ["Sales", "140", "2800"],
        ["Sales", "80", "1600"],
        ["East", "200", "4000"],
        ["Sales", "150", "3000"],
      ],
    },
    sampleOutput: {
      columns: ["Question", "Result"],
      rows: [["Sales revenue, units > 100", "5800"]],
      highlightColumn: 1,
    },
    related: ["count-if-multiple-conditions", "calculate-completion-percentage"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Region", "Units", "Revenue"],
          ["Sales", 140, 2800],
          ["Sales", 80, 1600],
          ["East", 200, 4000],
          ["Sales", 150, 3000],
          ["Result", '=SUMIFS(C2:C5,A2:A5,"Sales",B2:B5,">100")', null],
        ],
      },
      expect: [{ cell: "B6", value: 5800 }],
    },
  },
  {
    slug: "calculate-completion-percentage",
    kind: "formula",
    title: "Calculate a Completion Percentage",
    seoTitle: "Completion Percentage Formula (Excel & Sheets)",
    description:
      "Divide completed items by total items with COUNTIF and COUNTA to get a live completion rate for tasks, training, or projects.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["COUNTIF", "COUNTA"],
    keywords: [
      "completion percentage",
      "percent complete",
      "training completion",
      "progress tracker",
      "compliance rate",
    ],
    problem:
      "You have a status column and need one number at the top of the sheet: what percentage of tasks, people, or training modules are complete?",
    quickFormula: '=COUNTIF(C2:C11,"Complete")/COUNTA(C2:C11)',
    excelFormula: '=COUNTIF(C2:C11,"Complete")/COUNTA(C2:C11)',
    sheetsFormula: null,
    explanation:
      "COUNTIF counts how many cells in the status column say Complete. COUNTA counts how many status cells are filled in at all. Dividing one by the other gives the completion rate — format the cell as a percentage to display it as 70% rather than 0.7. Because both counts are live, the percentage updates itself as statuses change.",
    steps: [
      { part: 'COUNTIF(C2:C11,"Complete")', meaning: "Counts the rows marked Complete." },
      { part: "COUNTA(C2:C11)", meaning: "Counts all non-empty status cells — the denominator." },
      { part: "/", meaning: "Divides completed by total. Format the result as a percentage." },
    ],
    whenToUse:
      "Use this for any progress metric: training compliance, project task completion, survey response rates, onboarding checklists.",
    commonMistakes: [
      {
        mistake: "Using COUNTA over a whole column that includes the header.",
        fix: "COUNTA counts the header text too, deflating your percentage. Start the range below the header, or subtract 1.",
      },
      {
        mistake: "Statuses are inconsistent — \"Complete\", \"complete \", \"Done\".",
        fix: "COUNTIF misses variants with stray spaces or different labels. Standardize the status column with a dropdown (data validation).",
      },
      {
        mistake: "Denominator includes rows that shouldn't count.",
        fix: 'If some rows are Not Required, exclude them: =COUNTIF(C2:C11,"Complete")/COUNTIFS(C2:C11,"<>Not Required").',
      },
    ],
    sampleInput: {
      columns: ["Employee", "Module", "Status"],
      rows: [
        ["Ana Torres", "Safety 101", "Complete"],
        ["Ben Okafor", "Safety 101", "In Progress"],
        ["Cara Lim", "Safety 101", "Complete"],
        ["Dana Cruz", "Safety 101", "Complete"],
        ["Eli Ford", "Safety 101", "Not Started"],
      ],
    },
    sampleOutput: {
      columns: ["Metric", "Result"],
      rows: [["Completion rate", "60%"]],
      highlightColumn: 1,
    },
    related: ["count-if-multiple-conditions", "flag-overdue-tasks", "fix-div0-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Employee", "Status"],
          ["Ana Torres", "Complete"],
          ["Ben Okafor", "In Progress"],
          ["Cara Lim", "Complete"],
          ["Dana Cruz", "Complete"],
          ["Eli Ford", "Not Started"],
          ["Rate", "=COUNTIF(B2:B6,\"Complete\")/COUNTA(B2:B6)"],
        ],
      },
      expect: [{ cell: "B7", value: 0.6 }],
    },
  },
];
