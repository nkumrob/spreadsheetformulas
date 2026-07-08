import { HyperFormula } from "hyperformula";
import { describe, expect, it } from "vitest";
import "@/lib/engine-extensions";

function compute(cells: (string | number | null)[][]): (string | number | boolean | null)[][] {
  const hf = HyperFormula.buildFromArray(cells, { licenseKey: "gpl-v3" });
  const out = hf.getSheetValues(0) as (string | number | boolean | null)[][];
  hf.destroy();
  return out;
}

describe("engine extension pack — functions HyperFormula lacks, implemented to platform semantics", () => {
  it("REGEXEXTRACT returns the first match, capture group, or #N/A", () => {
    const [[a, b, c]] = compute([
      ['=REGEXEXTRACT("Order #4521 (rush)","[0-9]+")', '=REGEXEXTRACT("ana@acme.com","@(.+)$")', '=REGEXEXTRACT("no digits","[0-9]+")'],
    ]);
    expect(a).toBe("4521");
    expect(b).toBe("acme.com");
    expect(String(c)).toContain("#N/A");
  });

  it("REGEXMATCH returns booleans", () => {
    const [[a, b]] = compute([['=REGEXMATCH("ana@gmail.com","@gmail\\.com$")', '=REGEXMATCH("ana@acme.com","@gmail\\.com$")']]);
    expect(a).toBe(true);
    expect(b).toBe(false);
  });

  it("REGEXREPLACE replaces all matches with group support", () => {
    const [[a]] = compute([['=REGEXREPLACE("a1b22c333","[0-9]+","#")']]);
    expect(a).toBe("a#b#c#");
  });

  it("TEXTBEFORE and TEXTAFTER split on the first delimiter, #N/A when absent", () => {
    const [[a, b, c]] = compute([
      ['=TEXTBEFORE("Ana Torres"," ")', '=TEXTAFTER("Ana Torres"," ")', '=TEXTBEFORE("Cher"," ")'],
    ]);
    expect(a).toBe("Ana");
    expect(b).toBe("Torres");
    expect(String(c)).toContain("#N/A");
  });

  it("RANK matches RANK.EQ semantics: descending default, ties share rank, missing value errors", () => {
    const grid = compute([
      [40, "=RANK(A1,$A$1:$A$4)", "=RANK(A1,$A$1:$A$4,1)"],
      [10, "=RANK(A2,$A$1:$A$4)", null],
      [40, "=RANK(A3,$A$1:$A$4)", null],
      [25, '=RANK(99,$A$1:$A$4)', null],
    ]);
    expect(grid[0][1]).toBe(1); // 40 is (joint) largest
    expect(grid[2][1]).toBe(1); // tie shares rank 1
    expect(grid[1][1]).toBe(4); // 10 is smallest of 4
    expect(grid[0][2]).toBe(3); // ascending: 40 ranks 3rd (ties share)
    expect(String(grid[3][1])).toContain("#N/A");
  });

  it("UNIQUE spills distinct values preserving first-seen order", () => {
    const grid = compute([
      ["Acme", "=UNIQUE(A1:A5)"],
      ["Borealis", null],
      ["Acme", null],
      ["Cobalt", null],
      ["Borealis", null],
    ]);
    expect([grid[0][1], grid[1][1], grid[2][1]]).toEqual(["Acme", "Borealis", "Cobalt"]);
    expect(grid[3][1] ?? null).toBeNull();
  });

  it("invalid regex returns #VALUE!, never throws", () => {
    const [[a]] = compute([['=REGEXMATCH("x","[unclosed")']]);
    expect(String(a)).toContain("#VALUE!");
  });
});
