import { describe, expect, it } from "vitest";
import { explainFormula } from "@/lib/formula-explain";

describe("explainFormula — rule-based explainer (SF-051 basic tier)", () => {
  it("explains the PRD journey-4 formula", () => {
    const result = explainFormula('=IFERROR(INDEX($B$2:$B$100,MATCH(E2,$A$2:$A$100,0)),"")');
    expect(result).not.toBeNull();
    expect(result!.functions.map((f) => f.name)).toEqual(["IFERROR", "INDEX", "MATCH"]);
    expect(result!.outer?.name).toBe("IFERROR");
    expect(result!.outer?.args).toHaveLength(2);
    expect(result!.references).toContain("$B$2:$B$100");
    expect(result!.references).toContain("E2");
  });

  it("breaks the outer function into top-level arguments with hints", () => {
    const result = explainFormula("=VLOOKUP(A2,Sheet2!A:B,2,FALSE)");
    expect(result!.outer?.name).toBe("VLOOKUP");
    expect(result!.outer?.args.map((a) => a.value)).toEqual(["A2", "Sheet2!A:B", "2", "FALSE"]);
    expect(result!.outer?.args[0].hint.toLowerCase()).toContain("look");
  });

  it("splits arguments at top level only, respecting nesting and quotes", () => {
    const result = explainFormula('=IF(AND(B2<TODAY(),C2<>"Complete"),"Overdue","On Track")');
    expect(result!.outer?.args.map((a) => a.value)).toEqual([
      'AND(B2<TODAY(),C2<>"Complete")',
      '"Overdue"',
      '"On Track"',
    ]);
  });

  it("describes unknown functions gracefully", () => {
    const result = explainFormula("=FOO(A1)");
    expect(result!.functions[0].what).toContain("not in our guide");
  });

  it("returns null for input that is not a formula", () => {
    expect(explainFormula("hello world")).toBeNull();
    expect(explainFormula("")).toBeNull();
  });

  it("handles a bare arithmetic formula with no functions", () => {
    const result = explainFormula("=(B2-A2)/A2");
    expect(result).not.toBeNull();
    expect(result!.functions).toEqual([]);
    expect(result!.references).toEqual(expect.arrayContaining(["B2", "A2"]));
  });
});
