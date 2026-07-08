import { describe, expect, it } from "vitest";
import { allFormulas, getFormula } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import { formulaSchema } from "@/lib/schema";

const categorySlugs = new Set(CATEGORIES.map((c) => c.slug));
const formulaSlugs = new Set(allFormulas.map((f) => f.slug));

describe("formula content integrity", () => {
  it("every entry passes the schema", () => {
    for (const formula of allFormulas) {
      const result = formulaSchema.safeParse(formula);
      expect(result.success, `${formula.slug}: ${JSON.stringify(result.error?.issues)}`).toBe(true);
    }
  });

  it("slugs are unique", () => {
    expect(formulaSlugs.size).toBe(allFormulas.length);
  });

  it("every category reference resolves", () => {
    for (const formula of allFormulas) {
      expect(categorySlugs.has(formula.category), `${formula.slug} → ${formula.category}`).toBe(true);
    }
  });

  it("every related-formula slug resolves", () => {
    for (const formula of allFormulas) {
      for (const related of formula.related) {
        expect(formulaSlugs.has(related), `${formula.slug} → related ${related}`).toBe(true);
        expect(related).not.toBe(formula.slug);
      }
    }
  });

  it("platform variants are consistent", () => {
    for (const formula of allFormulas) {
      if (formula.sheetsFormula) {
        expect(formula.sheetsFormula).not.toBe(formula.excelFormula);
      }
    }
  });

  it("sample tables are rectangular", () => {
    for (const formula of allFormulas) {
      for (const table of [formula.sampleInput, formula.sampleOutput]) {
        if (!table) continue;
        const width = table.columns.length;
        for (const row of table.rows) {
          expect(row.length, `${formula.slug} has a ragged table row`).toBe(width);
        }
      }
    }
  });

  it("getFormula returns entries by slug and null for misses", () => {
    const first = allFormulas[0];
    expect(getFormula(first.slug)?.title).toBe(first.title);
    expect(getFormula("does-not-exist")).toBeNull();
  });
});
