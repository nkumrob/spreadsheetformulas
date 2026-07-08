import { HyperFormula, DetailedCellError } from "hyperformula";
import type { CellValue, ParsedWorkbook } from "./workbook-analysis";

/**
 * A live, editable workbook: HyperFormula holds the state, edits recompute
 * dependents instantly, and the whole thing can be snapshotted for export.
 * Runs entirely in the caller's process (browser or tests) — nothing leaves.
 */

export type CellView = {
  display: string;
  isFormula: boolean;
  isError: boolean;
  isNumber: boolean;
};

const ENGINE_OPTIONS = { licenseKey: "gpl-v3", dateFormats: ["YYYY-MM-DD", "MM/DD/YYYY"] };
const LITERALS = [
  { name: "TRUE", expression: "=TRUE()" },
  { name: "FALSE", expression: "=FALSE()" },
];

const EXCEL_EPOCH_MS = Date.UTC(1899, 11, 30);
const DAY_MS = 86_400_000;

function serialToIso(serial: number): string {
  return new Date(EXCEL_EPOCH_MS + Math.round(serial) * DAY_MS).toISOString().slice(0, 10);
}

function trimNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(6)));
}

export class WorkbookSession {
  private destroyed = false;

  private constructor(
    private hf: HyperFormula,
    private names: string[],
    private formats: Map<string, string>,
    private baseDims: Map<string, { rows: number; cols: number }>,
  ) {}

  private assertAlive(): void {
    if (this.destroyed) {
      throw new Error("WorkbookSession used after destroy() — open a new session instead.");
    }
  }

  static open(workbook: ParsedWorkbook): WorkbookSession {
    const sheets = Object.fromEntries(
      workbook.sheets.map((sheet) => [
        sheet.name,
        sheet.values.map((row, r) => row.map((value, c) => sheet.formulas[r][c] ?? value)),
      ]),
    );
    const hf = HyperFormula.buildFromSheets(sheets, ENGINE_OPTIONS, LITERALS);
    const formats = new Map<string, string>();
    const dims = new Map<string, { rows: number; cols: number }>();
    for (const sheet of workbook.sheets) {
      dims.set(sheet.name, { rows: sheet.values.length, cols: sheet.values[0]?.length ?? 0 });
      sheet.formats?.forEach((row, r) =>
        row.forEach((format, c) => {
          if (format) formats.set(`${sheet.name}:${r}:${c}`, format);
        }),
      );
    }
    return new WorkbookSession(hf, workbook.sheets.map((s) => s.name), formats, dims);
  }

  sheetNames(): string[] {
    return this.names;
  }

  /** Grid size to render: the data plus breathing room for new content. */
  dimensions(sheet: string): { rows: number; cols: number } {
    const base = this.baseDims.get(sheet) ?? { rows: 0, cols: 0 };
    const live = this.hf.getSheetDimensions(this.sheetId(sheet));
    return {
      rows: Math.max(base.rows, live.height) + 12,
      cols: Math.min(Math.max(base.cols, live.width) + 3, 60),
    };
  }

  private sheetId(sheet: string): number {
    this.assertAlive();
    return this.hf.getSheetId(sheet)!;
  }

  cellView(sheet: string, row: number, col: number): CellView {
    const address = { sheet: this.sheetId(sheet), row, col };
    const value = this.hf.getCellValue(address);
    const isFormula = this.hf.doesCellHaveFormula(address);
    if (value instanceof DetailedCellError) {
      return { display: value.value, isFormula, isError: true, isNumber: false };
    }
    if (value === null || value === "") {
      return { display: "", isFormula, isError: false, isNumber: false };
    }
    if (typeof value === "number") {
      const format = this.formats.get(`${sheet}:${row}:${col}`);
      if (format && /[ymd]/i.test(format) && !/[#0]/.test(format) && value > 0) {
        return { display: serialToIso(value), isFormula, isError: false, isNumber: false };
      }
      if (format && format.includes("%")) {
        return { display: `${trimNumber(value * 100)}%`, isFormula, isError: false, isNumber: true };
      }
      return { display: trimNumber(value), isFormula, isError: false, isNumber: true };
    }
    return { display: String(value), isFormula, isError: false, isNumber: false };
  }

  /** What belongs in the formula bar / edit box: the formula, or the raw value. */
  cellContent(sheet: string, row: number, col: number): string {
    const address = { sheet: this.sheetId(sheet), row, col };
    const formula = this.hf.getCellFormula(address);
    if (formula !== undefined) return formula;
    const value = this.hf.getCellValue(address);
    if (value === null) return "";
    if (value instanceof DetailedCellError) return "";
    return String(value);
  }

  setCell(sheet: string, row: number, col: number, input: string): void {
    const trimmed = input.trim();
    const address = { sheet: this.sheetId(sheet), row, col };
    let content: CellValue | string = trimmed;
    if (trimmed === "") content = null;
    else if (!trimmed.startsWith("=") && /^-?\d+(\.\d+)?$/.test(trimmed)) content = Number(trimmed);
    this.hf.setCellContents(address, [[content]]);
  }

  /** Current state (computed values + formulas + original formats) for export. */
  snapshot(): ParsedWorkbook {
    return {
      sheets: this.names.map((name) => {
        const id = this.sheetId(name);
        const { height, width } = this.hf.getSheetDimensions(id);
        const values: CellValue[][] = [];
        const formulas: (string | null)[][] = [];
        const formats: (string | null)[][] = [];
        for (let r = 0; r < height; r++) {
          const valueRow: CellValue[] = [];
          const formulaRow: (string | null)[] = [];
          const formatRow: (string | null)[] = [];
          for (let c = 0; c < width; c++) {
            const address = { sheet: id, row: r, col: c };
            const value = this.hf.getCellValue(address);
            valueRow.push(value instanceof DetailedCellError ? null : (value as CellValue));
            formulaRow.push(this.hf.getCellFormula(address) ?? null);
            formatRow.push(this.formats.get(`${name}:${r}:${c}`) ?? null);
          }
          values.push(valueRow);
          formulas.push(formulaRow);
          formats.push(formatRow);
        }
        return { name, values, formulas, formats };
      }),
    };
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.hf.destroy();
  }
}
