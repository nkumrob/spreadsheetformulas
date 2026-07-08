import { HyperFormula, DetailedCellError } from "hyperformula";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { allFormulas } from "@/lib/content";

/**
 * Layer-1 verification: every formula page's `verification` block is executed
 * by a real spreadsheet engine and compared against pinned expectations.
 * The clock is frozen so TODAY()-dependent pages are deterministic.
 */

export const FROZEN_TODAY = new Date(2026, 6, 8, 12, 0, 0); // 2026-07-08

/** Functions HyperFormula does not implement (probed at setup). Pages whose
 *  formulas use one of these may declare `verification: null`. */
const ENGINE_MISSING = new Set([
  "LOOKUP", "AVERAGEIFS", "TEXTBEFORE", "TEXTAFTER", "TEXTSPLIT",
  "UNIQUE", "SORT", "RANK", "REGEXEXTRACT", "QUERY",
]);

/** Pages exempt for reasons other than a missing function — each needs a reason. */
const EXEMPT: Record<string, string> = {};

const ENGINE_OPTIONS = {
  licenseKey: "gpl-v3",
  dateFormats: ["YYYY-MM-DD", "MM/DD/YYYY"],
} as const;

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FROZEN_TODAY);
});

afterAll(() => {
  vi.useRealTimers();
});

describe("verification coverage", () => {
  it("every formula page is engine-verified, engine-exempt, or explicitly excused", () => {
    for (const formula of allFormulas.filter((f) => f.kind === "formula")) {
      if (formula.verification) continue;
      if (formula.slug in EXEMPT) continue;
      const usesMissing = formula.functions.some((fn) => ENGINE_MISSING.has(fn));
      expect(
        formula.verification === null && usesMissing,
        `${formula.slug}: no verification block, no engine-gap exemption (functions: ${formula.functions.join(",")})`,
      ).toBe(true);
    }
  });

  it("null verifications are only used where the engine genuinely lacks support", () => {
    for (const formula of allFormulas) {
      if (formula.verification !== null) continue;
      if (formula.slug in EXEMPT) continue;
      expect(
        formula.functions.some((fn) => ENGINE_MISSING.has(fn)),
        `${formula.slug} claims engine gap but all its functions are supported`,
      ).toBe(true);
    }
  });
});

describe("engine execution", () => {
  const verified = allFormulas.filter((f) => f.verification);

  it("has verification blocks to run", () => {
    expect(verified.length).toBeGreaterThan(0);
  });

  for (const formula of verified) {
    it(`${formula.slug}`, () => {
      const { sheets, expect: expectations } = formula.verification!;
      const hf = HyperFormula.buildFromSheets(
        Object.fromEntries(Object.entries(sheets).map(([name, grid]) => [name, grid])),
        ENGINE_OPTIONS,
        // HyperFormula lacks Excel's bare TRUE/FALSE literals — alias them so
        // page formulas run verbatim, exactly as written for Excel/Sheets.
        [
          { name: "TRUE", expression: "=TRUE()" },
          { name: "FALSE", expression: "=FALSE()" },
        ],
      );
      const firstSheet = Object.keys(sheets)[0];

      for (const { cell, value } of expectations) {
        const ref = cell.includes("!") ? cell : `${firstSheet}!${cell}`;
        const address = hf.simpleCellAddressFromString(ref, 0);
        expect(address, `${formula.slug}: bad cell ref ${cell}`).not.toBeNull();
        const actual = hf.getCellValue(address!);

        if (typeof value === "string" && value.startsWith("#")) {
          // Expected spreadsheet error value, e.g. "#DIV/0!".
          expect(actual).toBeInstanceOf(DetailedCellError);
          expect((actual as DetailedCellError).value, `${formula.slug} ${cell}`).toBe(value);
        } else if (typeof value === "number") {
          expect(actual, `${formula.slug} ${cell}: expected number, got ${JSON.stringify(actual)}`).toBeTypeOf("number");
          expect(actual as number, `${formula.slug} ${cell}`).toBeCloseTo(value, 9);
        } else {
          expect(actual, `${formula.slug} ${cell}`).toBe(value);
        }
      }
      hf.destroy();
    });
  }
});
