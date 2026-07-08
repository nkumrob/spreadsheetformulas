import { describe, expect, it } from "vitest";
import { convertFormula, detectPlatform } from "@/lib/formula-convert";

describe("detectPlatform", () => {
  it("spots platform-exclusive functions", () => {
    expect(detectPlatform('=QUERY(A:D,"select A")')).toBe("sheets");
    expect(detectPlatform("=ARRAYFORMULA(A2:A*B2:B)")).toBe("sheets");
    expect(detectPlatform('=TEXTSPLIT(A2,",")')).toBe("excel");
    expect(detectPlatform("=SUM(A1:A10)")).toBe("either");
  });
});

describe("convertFormula — deterministic Excel ↔ Sheets translation", () => {
  it("renames direct equivalents", () => {
    const toSheets = convertFormula('=TEXTSPLIT(A2,",")', "sheets");
    expect(toSheets.formula).toBe('=SPLIT(A2,",")');
    expect(toSheets.changes.some((c) => c.includes("TEXTSPLIT"))).toBe(true);

    const toExcel = convertFormula('=SPLIT(A2,",")', "excel");
    expect(toExcel.formula).toBe('=TEXTSPLIT(A2,",")');
  });

  it("rewrites structural equivalents", () => {
    expect(convertFormula("=COUNTUNIQUE(A2:A20)", "excel").formula).toBe("=ROWS(UNIQUE(A2:A20))");
    // ARRAYFORMULA wrapper drops away — Excel spills natively.
    expect(convertFormula("=ARRAYFORMULA(B2:B10*C2:C10)", "excel").formula).toBe("=B2:B10*C2:C10");
    expect(convertFormula("=TEXTBEFORE(A2,\" \")", "sheets").formula).toBe('=LEFT(A2,FIND(" ",A2)-1)');
  });

  it("warns on functions with no clean equivalent instead of guessing", () => {
    const result = convertFormula('=QUERY(A:D,"select A where D > 100")', "excel");
    expect(result.formula).toBeNull();
    expect(result.warnings.some((w) => w.includes("FILTER"))).toBe(true);

    const finance = convertFormula('=GOOGLEFINANCE("NASDAQ:AAPL","price")', "excel");
    expect(finance.formula).toBeNull();
    expect(finance.warnings.some((w) => w.toLowerCase().includes("stocks"))).toBe(true);
  });

  it("adds version notes for shared modern functions", () => {
    const result = convertFormula("=XLOOKUP(E2,A:A,B:B)", "excel");
    expect(result.formula).toBe("=XLOOKUP(E2,A:A,B:B)");
    expect(result.notes.some((n) => n.includes("365") || n.includes("2021"))).toBe(true);
  });

  it("passes through universal formulas unchanged with a same-in-both note", () => {
    const result = convertFormula('=SUMIFS(C:C,A:A,"Sales")', "sheets");
    expect(result.formula).toBe('=SUMIFS(C:C,A:A,"Sales")');
    expect(result.changes).toHaveLength(0);
  });

  it("never touches quoted strings during renames", () => {
    const result = convertFormula('=SPLIT(A2,"SPLIT(")', "excel");
    expect(result.formula).toBe('=TEXTSPLIT(A2,"SPLIT(")');
  });

  it("handles junk gracefully", () => {
    expect(convertFormula("hello", "excel").formula).toBeNull();
    expect(convertFormula("", "sheets").formula).toBeNull();
  });
});
