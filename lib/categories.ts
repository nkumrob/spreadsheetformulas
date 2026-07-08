export type Category = {
  slug: string;
  name: string;
  /** The "cell address" used as the category's ledger mark, e.g. "A1". */
  cell: string;
  blurb: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "lookup-matching",
    name: "Lookup & Matching",
    cell: "A1",
    blurb: "Pull values from other tables, match records, and compare lists.",
  },
  {
    slug: "text-cleanup",
    name: "Text Cleanup",
    cell: "B2",
    blurb: "Split names, trim spaces, fix capitalization, and extract text.",
  },
  {
    slug: "dates-deadlines",
    name: "Dates & Deadlines",
    cell: "C3",
    blurb: "Overdue flags, days remaining, due dates, and date math.",
  },
  {
    slug: "counting-summarizing",
    name: "Counting & Summarizing",
    cell: "D4",
    blurb: "Count and sum with conditions, percentages, and running totals.",
  },
  {
    slug: "conditional-logic",
    name: "Conditional Logic",
    cell: "E5",
    blurb: "IF, IFS, AND, OR — build status flags and pass/fail rules.",
  },
  {
    slug: "error-fixes",
    name: "Error Fixes",
    cell: "F6",
    blurb: "#N/A, #VALUE!, #REF!, #DIV/0! — what they mean and how to fix them.",
  },
  {
    slug: "hr-training",
    name: "HR & Training",
    cell: "G7",
    blurb: "Tenure, headcount, time off, and people data.",
  },
  {
    slug: "finance-business",
    name: "Finance & Business",
    cell: "H8",
    blurb: "Budgets, variance, margins, commissions, and invoices.",
  },
  {
    slug: "small-business",
    name: "Small Business",
    cell: "I9",
    blurb: "Inventory, sales pipelines, customer lists, and expenses.",
  },
  {
    slug: "google-sheets",
    name: "Google Sheets",
    cell: "J10",
    blurb: "Sheets-specific functions: QUERY, ARRAYFORMULA, REGEX, and more.",
  },
  {
    slug: "excel",
    name: "Excel",
    cell: "K11",
    blurb: "Excel-specific features: LET, LAMBDA, Power Query, and dynamic arrays.",
  },
];

export function getCategory(slug: string): Category | null {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}
