import { describe, expect, it } from "vitest";
import { checkFormula, extractFunctions } from "@/lib/formula-check";

function ids(input: string): string[] {
  return checkFormula(input).map((f) => f.id);
}

describe("checkFormula — deterministic trust layer (SF-050)", () => {
  it("passes a clean formula with no findings", () => {
    expect(checkFormula('=IF(AND(B2<TODAY(),C2<>"Complete"),"Overdue","On Track")')).toEqual([]);
  });

  it("flags a missing leading equals sign", () => {
    expect(ids('SUM(A1:A10)')).toContain("missing-equals");
  });

  it("flags smart quotes and offers a corrected formula", () => {
    const findings = checkFormula('=IF(A2=B2,“Match”,“Mismatch”)');
    const smart = findings.find((f) => f.id === "smart-quotes");
    expect(smart).toBeDefined();
    expect(smart?.correctedFormula).toBe('=IF(A2=B2,"Match","Mismatch")');
  });

  it("flags unbalanced parentheses", () => {
    expect(ids("=SUM(A1:A10")).toContain("unbalanced-parens");
    expect(ids("=SUM(A1:A10))")).toContain("unbalanced-parens");
    // Parens inside quoted text must not count.
    expect(ids('=IF(A2="(open)","yes","no")')).not.toContain("unbalanced-parens");
  });

  it("flags VLOOKUP without the exact-match argument and corrects it (PRD journey 2)", () => {
    const findings = checkFormula("=VLOOKUP(A2,Sheet2!A:B,2)");
    const vlookup = findings.find((f) => f.id === "vlookup-approx");
    expect(vlookup).toBeDefined();
    expect(vlookup?.correctedFormula).toBe("=VLOOKUP(A2,Sheet2!A:B,2,FALSE)");
    // A 4-argument VLOOKUP is fine.
    expect(ids("=VLOOKUP(A2,Sheet2!A:B,2,FALSE)")).not.toContain("vlookup-approx");
  });

  it("recognizes error values and links their fix pages", () => {
    const findings = checkFormula("=A2/B2 #DIV/0!");
    const err = findings.find((f) => f.id === "error-value");
    expect(err?.link).toBe("/errors/fix-div0-error");
    expect(checkFormula("#N/A")[0]?.link).toBe("/errors/fix-na-error");
  });

  it("flags semicolon argument separators", () => {
    expect(ids('=IF(A2>10;"High";"Low")')).toContain("semicolon-separators");
  });

  it("flags unknown function names as possible #NAME? causes", () => {
    const findings = checkFormula("=VLOKUP(A2,B:C,2,FALSE)");
    expect(findings.find((f) => f.id === "unknown-function")?.message).toContain("VLOKUP");
    expect(ids("=XLOOKUP(A2,B:B,C:C)")).not.toContain("unknown-function");
  });

  it("handles empty and junk input without throwing", () => {
    expect(checkFormula("")).toEqual([]);
    expect(checkFormula("   ")).toEqual([]);
    expect(() => checkFormula("((((")).not.toThrow();
  });
});

describe("extractFunctions", () => {
  it("extracts unique function names in order of appearance", () => {
    expect(extractFunctions('=IFERROR(INDEX(B:B,MATCH(E2,A:A,0)),"")')).toEqual([
      "IFERROR",
      "INDEX",
      "MATCH",
    ]);
  });

  it("ignores cell references and text", () => {
    expect(extractFunctions('=A2&" "&B2')).toEqual([]);
  });
});
