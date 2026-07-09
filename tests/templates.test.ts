import { existsSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/templates";
import { getFormula } from "@/lib/content";

describe("template library integrity (SF-041/042/087)", () => {
  it("ships all five launch templates", () => {
    expect(TEMPLATES).toHaveLength(5);
  });

  it("every template file exists in public/", () => {
    for (const template of TEMPLATES) {
      const path = join(__dirname, "..", "public", template.file);
      expect(existsSync(path), `${template.file} missing — run scripts/build_templates.py`).toBe(true);
    }
  });

  it("every related formula slug resolves to a published page", () => {
    for (const template of TEMPLATES) {
      for (const slug of template.relatedFormulaSlugs) {
        expect(getFormula(slug), `${template.slug} → ${slug}`).not.toBeNull();
      }
    }
  });

  it("previews are rectangular", () => {
    for (const template of TEMPLATES) {
      for (const row of template.preview.rows) {
        expect(row.length).toBe(template.preview.columns.length);
      }
    }
  });
});

describe("proof sheets (SEO Engine 4)", () => {
  it("every engine-verified page has a downloadable proof sheet", async () => {
    const { allFormulas } = await import("@/lib/content");
    for (const formula of allFormulas) {
      if (!formula.verification) continue;
      const path = join(__dirname, "..", "public", "proofs", `${formula.slug}.xlsx`);
      expect(existsSync(path), `${formula.slug} proof missing — run npx tsx scripts/build-proof-sheets.ts`).toBe(true);
    }
  });
});
