import type { Formula } from "./schema";

/** Error fixes get their own /errors/ namespace; everything else lives under /formulas/. */
export function formulaPath(formula: Pick<Formula, "slug" | "kind">): string {
  return formula.kind === "error-fix" ? `/errors/${formula.slug}` : `/formulas/${formula.slug}`;
}

// Override with NEXT_PUBLIC_SITE_URL (e.g. a vercel.app preview) — canonicals,
// the sitemap, and OG URLs all follow it.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spreadsheetformulas.com";
export const SITE_NAME = "Spreadsheet Formulas";
