import { z } from "zod";

export const tableSchema = z.object({
  columns: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())).min(1),
  /** Zero-based index of the column to tint as the "result" column. */
  highlightColumn: z.number().int().min(0).optional(),
});

export type SampleTable = z.infer<typeof tableSchema>;

const gridCell = z.union([z.string(), z.number(), z.boolean(), z.null()]);

/**
 * Executable proof for a formula page (ticket layer-1 verification).
 * `sheets` holds raw grids (strings starting with "=" are formulas; dates as
 * "YYYY-MM-DD" strings). `expect` pins computed cell values, evaluated by the
 * HyperFormula engine in CI with the clock frozen to 2026-07-08.
 * `null` = engine can't verify this page (uses functions the engine lacks).
 */
export const verificationSchema = z.object({
  sheets: z.record(z.string(), z.array(z.array(gridCell)).min(1)),
  expect: z
    .array(
      z.object({
        cell: z.string().regex(/^(?:[A-Za-z0-9_]+!)?[A-Z]{1,3}[0-9]+$/),
        value: z.union([z.string(), z.number(), z.boolean()]),
      }),
    )
    .min(1),
});

export type Verification = z.infer<typeof verificationSchema>;

export const formulaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  kind: z.enum(["formula", "error-fix"]),
  title: z.string().min(8),
  seoTitle: z.string().min(8).max(70),
  description: z.string().min(40).max(170),
  category: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  /** Spreadsheet functions used, e.g. ["COUNTIFS"]. Drives search + the function chips. */
  functions: z.array(z.string()),
  keywords: z.array(z.string()),
  problem: z.string().min(40),
  quickFormula: z.string().startsWith("="),
  /** Platform-specific variants. sheetsFormula null = identical in both platforms. */
  excelFormula: z.string().startsWith("="),
  sheetsFormula: z.string().startsWith("=").nullable(),
  explanation: z.string().min(80),
  steps: z.array(z.object({ part: z.string(), meaning: z.string() })).min(1),
  whenToUse: z.string().min(40),
  commonMistakes: z.array(z.object({ mistake: z.string(), fix: z.string() })).min(2),
  sampleInput: tableSchema.nullable(),
  sampleOutput: tableSchema.nullable(),
  related: z.array(z.string()),
  lastReviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  published: z.boolean(),
  verification: verificationSchema.nullable().optional(),
});

export type Formula = z.infer<typeof formulaSchema>;
