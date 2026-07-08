import { describe, expect, it } from "vitest";
import { WorkbookSession } from "@/lib/workbook-session";
import { exportWorkbook, parseWorkbook, type ParsedWorkbook } from "@/lib/workbook-analysis";

const WORKBOOK: ParsedWorkbook = {
  sheets: [
    {
      name: "Sheet1",
      values: [
        ["Item", "Qty", "Price", "Total"],
        ["Notebook", 3, 4.5, 13.5],
        ["Stapler", 2, 12, 24],
      ],
      formulas: [
        [null, null, null, null],
        [null, null, null, "=B2*C2"],
        [null, null, null, "=B3*C3"],
      ],
    },
  ],
};

describe("WorkbookSession — live editing", () => {
  it("shows computed values for formula cells", () => {
    const session = WorkbookSession.open(WORKBOOK);
    expect(session.cellView("Sheet1", 1, 3).display).toBe("13.5");
    expect(session.cellView("Sheet1", 1, 3).isFormula).toBe(true);
    session.destroy();
  });

  it("recomputes dependents when a value is edited", () => {
    const session = WorkbookSession.open(WORKBOOK);
    session.setCell("Sheet1", 1, 1, "5"); // Qty 3 → 5
    expect(session.cellView("Sheet1", 1, 3).display).toBe("22.5");
    session.destroy();
  });

  it("accepts new formulas in empty cells and clears cells", () => {
    const session = WorkbookSession.open(WORKBOOK);
    session.setCell("Sheet1", 3, 3, "=SUM(D2:D3)");
    expect(session.cellView("Sheet1", 3, 3).display).toBe("37.5");
    session.setCell("Sheet1", 3, 3, "");
    expect(session.cellView("Sheet1", 3, 3).display).toBe("");
    session.destroy();
  });

  it("serializes cell content for the formula bar", () => {
    const session = WorkbookSession.open(WORKBOOK);
    expect(session.cellContent("Sheet1", 1, 3)).toBe("=B2*C2");
    expect(session.cellContent("Sheet1", 1, 0)).toBe("Notebook");
    expect(session.cellContent("Sheet1", 3, 0)).toBe("");
    session.destroy();
  });

  it("surfaces errors as error strings", () => {
    const session = WorkbookSession.open(WORKBOOK);
    session.setCell("Sheet1", 3, 0, "=1/0");
    const view = session.cellView("Sheet1", 3, 0);
    expect(view.display).toBe("#DIV/0!");
    expect(view.isError).toBe(true);
    session.destroy();
  });

  it("formats date serials using the original number format", () => {
    const dated: ParsedWorkbook = {
      sheets: [
        {
          name: "S",
          values: [[45000]],
          formulas: [[null]],
          formats: [["yyyy-mm-dd"]],
        },
      ],
    };
    const session = WorkbookSession.open(dated);
    expect(session.cellView("S", 0, 0).display).toBe("2023-03-15");
    session.destroy();
  });

  it("snapshots current state including edits", () => {
    const session = WorkbookSession.open(WORKBOOK);
    session.setCell("Sheet1", 1, 1, "5");
    const snapshot = session.snapshot();
    expect(snapshot.sheets[0].values[1][1]).toBe(5);
    expect(snapshot.sheets[0].values[1][3]).toBe(22.5);
    expect(snapshot.sheets[0].formulas[1][3]).toBe("=B2*C2");
    session.destroy();
  });
});

describe("exportWorkbook — .xlsx round trip", () => {
  it("edits survive export and re-parse, formulas intact", () => {
    const session = WorkbookSession.open(WORKBOOK);
    session.setCell("Sheet1", 1, 1, "5");
    const bytes = exportWorkbook(session.snapshot());
    session.destroy();

    const reparsed = parseWorkbook(bytes);
    const sheet = reparsed.sheets[0];
    expect(sheet.name).toBe("Sheet1");
    expect(sheet.values[1][1]).toBe(5);
    expect(sheet.values[1][3]).toBe(22.5);
    expect(sheet.formulas[1][3]).toBe("=B2*C2");
  });
});

describe("scanFindings — re-scan sees the live workbook (rescan bug)", () => {
  it("reports an error cell introduced by editing", () => {
    const session = WorkbookSession.open(WORKBOOK);
    session.setCell("Sheet1", 9, 0, "=1/0");
    const findings = session.scanFindings();
    const error = findings.find((f) => f.kind === "error-cell");
    expect(error?.cell).toBe("A10");
    expect(error?.link).toBe("/errors/fix-div0-error");
    session.destroy();
  });

  it("clears the finding once the cell is fixed", () => {
    const session = WorkbookSession.open(WORKBOOK);
    session.setCell("Sheet1", 9, 0, "=1/0");
    session.setCell("Sheet1", 9, 0, "=D2/B2");
    expect(session.scanFindings().filter((f) => f.kind === "error-cell")).toHaveLength(0);
    session.destroy();
  });

  it("labels engine-gap formulas as cannot-evaluate, not user errors", () => {
    const session = WorkbookSession.open(WORKBOOK);
    session.setCell("Sheet1", 9, 0, "=RANK(B2,B2:B3)");
    const findings = session.scanFindings();
    expect(findings.find((f) => f.cell === "A10")?.kind).toBe("cannot-evaluate");
    session.destroy();
  });
});

describe("engine-gap cells fall back to the file's cached value", () => {
  const GAP_WORKBOOK: ParsedWorkbook = {
    sheets: [
      {
        name: "S",
        values: [
          ["Score", "Rank"],
          [88, 2],
          [95, 1],
        ],
        formulas: [
          [null, null],
          [null, "=RANK(A2,$A$2:$A$3)"],
          [null, "=RANK(A3,$A$2:$A$3)"],
        ],
      },
    ],
  };

  it("displays the cached value instead of #NAME?", () => {
    const session = WorkbookSession.open(GAP_WORKBOOK);
    const view = session.cellView("S", 1, 1);
    expect(view.display).toBe("2");
    expect(view.isCached).toBe(true);
    expect(view.isError).toBe(false);
    session.destroy();
  });

  it("stops using the cached value once the cell is edited", () => {
    const session = WorkbookSession.open(GAP_WORKBOOK);
    session.setCell("S", 1, 1, "=A2*2");
    const view = session.cellView("S", 1, 1);
    expect(view.display).toBe("176");
    expect(view.isCached).toBeFalsy();
    session.destroy();
  });

  it("exports the cached value alongside the formula", () => {
    const session = WorkbookSession.open(GAP_WORKBOOK);
    const bytes = exportWorkbook(session.snapshot());
    session.destroy();
    const reparsed = parseWorkbook(bytes);
    expect(reparsed.sheets[0].values[1][1]).toBe(2);
    expect(reparsed.sheets[0].formulas[1][1]).toBe("=RANK(A2,$A$2:$A$3)");
  });
});

describe("number-format display", () => {
  it("renders thousands and currency formats readably", () => {
    const wb: ParsedWorkbook = {
      sheets: [
        {
          name: "S",
          values: [[18450.5, 1250]],
          formulas: [[null, null]],
          formats: [["#,##0", '"$"#,##0.00']],
        },
      ],
    };
    const session = WorkbookSession.open(wb);
    expect(session.cellView("S", 0, 0).display).toBe("18,451");
    expect(session.cellView("S", 0, 1).display).toBe("$1,250.00");
    session.destroy();
  });
});
