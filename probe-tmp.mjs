import { HyperFormula } from "hyperformula";

const OPTS = { licenseKey: "gpl-v3", dateFormats: ["YYYY-MM-DD", "MM/DD/YYYY"] };

function run(name, grid, cells) {
  try {
    const hf = HyperFormula.buildFromSheets({ Sheet1: grid }, OPTS, [
      { name: "TRUE", expression: "=TRUE()" },
      { name: "FALSE", expression: "=FALSE()" },
    ]);
    for (const c of cells) {
      const addr = hf.simpleCellAddressFromString(`Sheet1!${c}`, 0);
      const v = hf.getCellValue(addr);
      console.log(name, c, "=>", JSON.stringify(v));
    }
    hf.destroy();
  } catch (e) {
    console.log(name, "THREW:", e.message);
  }
}

// FILTER single column, equal shapes
run("FILTER-1col", [
  ["Deal", "Value", ""],
  ["Acme Co", 2800, "=FILTER(A2:A6,B2:B6>1000)"],
  ["Borealis", 950, null],
  ["Cobalt", 4100, null],
  ["Dyna Ltd", 700, null],
  ["Everest", 1600, null],
], ["C2", "C3", "C4", "C5"]);

run("FILTER-1col-AF", [
  ["Deal", "Value", ""],
  ["Acme Co", 2800, "=ARRAYFORMULA(FILTER(A2:A6,B2:B6>1000))"],
  ["Borealis", 950, null],
  ["Cobalt", 4100, null],
  ["Dyna Ltd", 700, null],
  ["Everest", 1600, null],
], ["C2", "C3", "C4", "C5"]);

// FILTER values column by itself
run("FILTER-values", [
  ["Deal", "Value", ""],
  ["Acme Co", 2800, "=FILTER(B2:B6,B2:B6>1000)"],
  ["Borealis", 950, null],
  ["Cobalt", 4100, null],
  ["Dyna Ltd", 700, null],
  ["Everest", 1600, null],
], ["C2", "C3", "C4", "C5"]);

// SUMPRODUCT wrapped in ARRAYFORMULA
run("SUMPRODUCT-AF", [
  ["Region", "Amount", "Result"],
  ["Sales", 2800, '=ARRAYFORMULA(SUMPRODUCT((A2:A6="Sales")*(B2:B6)))'],
  ["East", 950, '=ARRAYFORMULA(SUMPRODUCT(((A2:A6="Sales")+(A2:A6="East"))*B2:B6))'],
  ["Sales", 4100, '=ARRAYFORMULA(SUMPRODUCT((A2:A6="Sales")*(B2:B6>2000)*B2:B6))'],
  ["Ops", 700, null],
  ["Sales", 1600, null],
], ["C2", "C3", "C4"]);

// SEQUENCE with dates: invoice numbering + date series
run("SEQ-dates", [
  ["=SEQUENCE(3,1,DATE(2026,7,1),7)", "=TEXT(A1,\"YYYY-MM-DD\")"],
  [null, null],
  [null, null],
], ["A1", "A2", "A3", "B1"]);
