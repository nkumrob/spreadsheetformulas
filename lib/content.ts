import { formulaSchema, type Formula } from "./schema";
import { lookupFormulas } from "@/content/lookup";
import { countingFormulas } from "@/content/counting";
import { dateFormulas, textFormulas } from "@/content/dates-text";
import { errorFixes } from "@/content/errors";
import { duplicatesBlanksFormulas } from "@/content/duplicates-blanks";
import { highlightingFormulas } from "@/content/highlighting";
import { dates2Formulas } from "@/content/dates2";
import { summarizingFormulas } from "@/content/summarizing";
import { text2Formulas } from "@/content/text2";
import { logicFormulas } from "@/content/logic";
import { financeFormulas } from "@/content/finance";
import { businessFormulas } from "@/content/business";
import { hrFormulas } from "@/content/hr";
import { hr2Formulas } from "@/content/hr2";
import { errorFixes2 } from "@/content/errors2";
import { errorFixes3 } from "@/content/errors3";

const raw: Formula[] = [
  ...lookupFormulas,
  ...countingFormulas,
  ...dateFormulas,
  ...textFormulas,
  ...duplicatesBlanksFormulas,
  ...highlightingFormulas,
  ...dates2Formulas,
  ...summarizingFormulas,
  ...text2Formulas,
  ...logicFormulas,
  ...financeFormulas,
  ...businessFormulas,
  ...hrFormulas,
  ...hr2Formulas,
  ...errorFixes,
  ...errorFixes2,
  ...errorFixes3,
];

// Validate at module load so bad content fails the build, not the page render.
for (const entry of raw) {
  const result = formulaSchema.safeParse(entry);
  if (!result.success) {
    throw new Error(`Invalid formula content "${entry.slug}": ${JSON.stringify(result.error.issues, null, 2)}`);
  }
}

const slugs = new Set<string>();
for (const entry of raw) {
  if (slugs.has(entry.slug)) throw new Error(`Duplicate formula slug: ${entry.slug}`);
  slugs.add(entry.slug);
}

export const allFormulas: Formula[] = raw.filter((f) => f.published);

export function getFormula(slug: string): Formula | null {
  return allFormulas.find((f) => f.slug === slug) ?? null;
}

export function formulasByCategory(categorySlug: string): Formula[] {
  return allFormulas.filter((f) => f.category === categorySlug);
}

export function relatedFormulas(formula: Formula): Formula[] {
  return formula.related.map((slug) => getFormula(slug)).filter((f): f is Formula => f !== null);
}

/** Newest-reviewed first — drives the "recently added" homepage rail. */
export function recentFormulas(count: number): Formula[] {
  return [...allFormulas].sort((a, b) => b.lastReviewed.localeCompare(a.lastReviewed)).slice(0, count);
}
