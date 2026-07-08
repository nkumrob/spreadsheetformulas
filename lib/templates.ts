import type { SampleTable } from "./schema";

export type Template = {
  slug: string;
  name: string;
  file: string;
  description: string;
  whoFor: string;
  includedFormulas: { formula: string; does: string }[];
  preview: SampleTable;
  relatedFormulaSlugs: string[];
};

export const TEMPLATES: Template[] = [
  {
    slug: "sales-pipeline-tracker",
    name: "Sales Pipeline Tracker",
    file: "/templates/sales-pipeline-tracker.xlsx",
    description:
      "Track every deal by stage with probability-weighted values, open-pipeline and won totals — the whole funnel on one sheet.",
    whoFor: "Founders, sales teams, and freelancers who need a clear view of what's likely to close.",
    includedFormulas: [
      { formula: "=D2*E2", does: "Probability-weighted deal value" },
      { formula: '=SUMIFS(D2:D6,C2:C6,"<>Won",C2:C6,"<>Lost")', does: "Open pipeline total" },
      { formula: '=SUMIF(C2:C6,"Won",D2:D6)', does: "Revenue won this period" },
    ],
    preview: {
      columns: ["Deal", "Stage", "Value", "Probability", "Weighted"],
      rows: [
        ["Website rebuild", "Proposal", "12000", "60%", "7200"],
        ["Annual retainer", "Qualified", "30000", "35%", "10500"],
        ["Support contract", "Won", "15000", "100%", "15000"],
      ],
      highlightColumn: 4,
    },
    relatedFormulaSlugs: ["sum-if-multiple-conditions", "calculate-percentage-of-total", "calculate-weighted-average"],
  },
  {
    slug: "budget-tracker",
    name: "Budget Tracker",
    file: "/templates/budget-tracker.xlsx",
    description:
      "Budget vs. actual by category with variance in dollars and percent, plus totals — negative variance shows in red automatically.",
    whoFor: "Small business owners, team leads, and anyone managing a monthly or project budget.",
    includedFormulas: [
      { formula: "=C2-B2", does: "Variance in dollars" },
      { formula: '=IF(B2=0,"",(C2-B2)/B2)', does: "Variance percent, safe against empty budgets" },
      { formula: "=SUM(B2:B6)", does: "Category totals" },
    ],
    preview: {
      columns: ["Category", "Budget", "Actual", "Variance"],
      rows: [
        ["Payroll", "18000", "18450", "450"],
        ["Marketing", "3000", "2100", "-900"],
        ["Software", "900", "1140", "240"],
      ],
      highlightColumn: 3,
    },
    relatedFormulaSlugs: ["calculate-budget-variance", "sum-if-multiple-conditions", "calculate-percentage-change"],
  },
  {
    slug: "invoice-tracker",
    name: "Invoice Tracker",
    file: "/templates/invoice-tracker.xlsx",
    description:
      "Log invoices with automatic due dates from payment terms, days-overdue tracking, and an outstanding-balance summary.",
    whoFor: "Freelancers and small businesses keeping on top of who owes what.",
    includedFormulas: [
      { formula: "=C2+D2", does: "Due date from issue date + terms" },
      { formula: '=IF(G2="Paid",0,MAX(0,TODAY()-E2))', does: "Days overdue, zero once paid" },
      { formula: '=SUMIFS(F2:F5,G2:G5,"<>Paid")', does: "Total outstanding" },
    ],
    preview: {
      columns: ["Invoice #", "Client", "Due Date", "Status", "Days Overdue"],
      rows: [
        ["INV-001", "Acme Co", "2026-07-01", "Paid", "0"],
        ["INV-002", "Borealis LLC", "2026-07-10", "Sent", "0"],
        ["INV-003", "Cobalt Studio", "2026-07-08", "Sent", "0"],
      ],
      highlightColumn: 4,
    },
    relatedFormulaSlugs: ["calculate-invoice-due-date", "calculate-days-overdue", "sum-if-multiple-conditions"],
  },
  {
    slug: "project-task-tracker",
    name: "Project Task Tracker",
    file: "/templates/project-task-tracker.xlsx",
    description:
      "Tasks with owners, priorities, due dates, and a self-updating overdue flag — plus percent-complete and overdue counts for standups.",
    whoFor: "Team leads and project coordinators who need a tracker that maintains itself.",
    includedFormulas: [
      { formula: '=IF(AND(D2<TODAY(),E2<>"Complete"),"Overdue","On Track")', does: "Overdue flag per task" },
      { formula: '=COUNTIF(E2:E6,"Complete")/COUNTA(E2:E6)', does: "Percent complete" },
    ],
    preview: {
      columns: ["Task", "Owner", "Due Date", "Status", "Flag"],
      rows: [
        ["Send contract", "Ana Torres", "2026-06-28", "In Progress", "Overdue"],
        ["Book venue", "Ben Okafor", "2026-07-15", "In Progress", "On Track"],
        ["File permits", "Cara Lim", "2026-07-01", "Complete", "On Track"],
      ],
      highlightColumn: 4,
    },
    relatedFormulaSlugs: ["flag-overdue-tasks", "calculate-days-remaining", "calculate-completion-percentage"],
  },
  {
    slug: "job-application-tracker",
    name: "Job Application Tracker",
    file: "/templates/job-application-tracker.xlsx",
    description:
      "Track every application with stage, next step, and days-since-applied — so follow-ups never slip.",
    whoFor: "Job seekers running an organized search across many applications.",
    includedFormulas: [
      { formula: "=TODAY()-C2", does: "Days since you applied" },
      { formula: '=COUNTIF(D2:D5,"Interview")', does: "Count by stage" },
    ],
    preview: {
      columns: ["Company", "Role", "Stage", "Days Since Applied"],
      rows: [
        ["Acme Co", "Operations Analyst", "Interview", "26"],
        ["Borealis LLC", "HR Coordinator", "Applied", "18"],
        ["Cobalt Studio", "Office Manager", "Phone Screen", "13"],
      ],
      highlightColumn: 3,
    },
    relatedFormulaSlugs: ["track-job-applications", "calculate-days-overdue", "count-if-multiple-conditions"],
  },
];

export function getTemplate(slug: string): Template | null {
  return TEMPLATES.find((t) => t.slug === slug) ?? null;
}
