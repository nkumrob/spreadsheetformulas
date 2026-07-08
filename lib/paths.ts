import type { Formula } from "./schema";

/** Error fixes get their own /errors/ namespace; everything else lives under /formulas/. */
export function formulaPath(formula: Pick<Formula, "slug" | "kind">): string {
  return formula.kind === "error-fix" ? `/errors/${formula.slug}` : `/formulas/${formula.slug}`;
}

export const SITE_URL = "https://spreadsheetformulas.com";
export const SITE_NAME = "Spreadsheet Formulas";
