import { readFileSync } from "fs";
import { join } from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  analyzeWorkbook,
  parseWorkbook,
  recomputeFindings,
  testFormula,
  type ParsedWorkbook,
} from "@/lib/workbook-analysis";

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 8, 12, 0, 0));
});

afterAll(() => vi.useRealTimers());

function loadTemplate(name: string): ParsedWorkbook {
  const buffer = readFileSync(join(__dirname, "..", "public", "templates", name));
  return parseWorkbook(buffer);
}

describe("parseWorkbook — real .xlsx files", () => {
  it("extracts values and formulas from our own templates", () => {
    const wb = loadTemplate("training-compliance-tracker.xlsx");
    expect(wb.sheets).toHaveLength(1);
    const sheet = wb.sheets[0];
    expect(sheet.name).toBe("Training Tracker");
    expect(sheet.values[1][0]).toBe("Ana Torres");
    // Row 2 (index 1), column G (index 6) holds the overdue flag formula, "=" prefixed.
    expect(sheet.formulas[1][6]).toBe('=IF(AND(E2<TODAY(),F2<>"Complete"),"Overdue","On Track")');
  });
});

const SYNTHETIC: ParsedWorkbook = {
  sheets: [
    {
      name: "Sheet1",
      values: [
        ["Item", "Qty", "Price", "Total"],
        ["Notebook", 3, 4.5, 13.5],
        ["Stapler", "2 ", 12, "#VALUE!"],
        ["Monitor", 2, 189, 999],
        ["  Desk Lamp", 1, 34, 34],
      ],
      formulas: [
        [null, null, null, null],
        [null, null, null, "=B2*C2"],
        [null, null, null, "=B3*C3"],
        [null, null, null, "=B4*C4"],
        [null, null, null, "=B5*C5"],
      ],
    },
  ],
};

describe("analyzeWorkbook — static health scan", () => {
  const report = analyzeWorkbook(SYNTHETIC);

  it("counts sheets, cells, and formulas", () => {
    expect(report.stats.sheets).toBe(1);
    expect(report.stats.formulas).toBe(4);
  });

  it("flags error cells and links their fix pages", () => {
    const finding = report.findings.find((f) => f.kind === "error-cell");
    expect(finding?.cell).toBe("D3");
    expect(finding?.link).toBe("/errors/fix-value-error");
  });

  it("flags numbers stored as text", () => {
    const finding = report.findings.find((f) => f.kind === "number-as-text");
    expect(finding?.cell).toBe("B3");
  });

  it("flags text with stray spaces", () => {
    const finding = report.findings.find((f) => f.kind === "extra-spaces");
    expect(finding?.cell).toBe("A5");
  });
});

describe("analyzeWorkbook — inconsistent formula detection", () => {
  it("flags the one formula in a column that differs from the pattern", () => {
    const wb: ParsedWorkbook = {
      sheets: [
        {
          name: "S",
          values: [
            ["A", "B", "C"],
            [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 30],
          ],
          formulas: [
            [null, null, null],
            [null, null, "=A2+B2"], [null, null, "=A3+B3"], [null, null, "=A4+B4"],
            [null, null, "=A5+B5"], [null, null, "=A6*B6"],
          ],
        },
      ],
    };
    const findings = analyzeWorkbook(wb).findings.filter((f) => f.kind === "inconsistent-formula");
    expect(findings).toHaveLength(1);
    expect(findings[0].cell).toBe("C6");
  });
});

describe("recomputeFindings — engine recompute vs stored values", () => {
  it("flags stored values that no longer match what the formula computes", () => {
    const findings = recomputeFindings(SYNTHETIC);
    const stale = findings.find((f) => f.kind === "stale-value");
    expect(stale?.cell).toBe("D4"); // stored 999, computes 378
  });

  it("does not flag matching values, volatile formulas, or engine gaps as stale", () => {
    const wb: ParsedWorkbook = {
      sheets: [
        {
          name: "S",
          values: [[2, 4, 8, "old", "x"]],
          formulas: [[null, "=A1*2", "=A1*4", "=TODAY()-A1", "=RANK(A1,A1:B1)"]],
        },
      ],
    };
    const findings = recomputeFindings(wb);
    expect(findings.find((f) => f.kind === "stale-value")).toBeUndefined();
    const gap = findings.find((f) => f.kind === "cannot-evaluate");
    expect(gap?.cell).toBe("E1");
  });
});

describe("testFormula — run a user formula against their workbook", () => {
  it("evaluates in the context of the chosen sheet", () => {
    const result = testFormula(SYNTHETIC, "Sheet1", "=SUM(C2:C5)");
    expect(result).toEqual({ ok: true, value: 239.5 });
  });

  it("returns error values rather than throwing", () => {
    const result = testFormula(SYNTHETIC, "Sheet1", "=1/0");
    expect(result).toEqual({ ok: false, error: "#DIV/0!" });
  });

  it("rejects non-formulas", () => {
    expect(testFormula(SYNTHETIC, "Sheet1", "hello").ok).toBe(false);
  });
});
