import { HyperFormula, DetailedCellError } from "hyperformula";
import {
  analyzeWorkbook,
  formulaSignature,
  type CellValue,
  type ParsedWorkbook,
  type WorkbookFinding,
} from "./workbook-analysis";
import { ENGINE_MISSING, extractFunctions } from "./formula-check";

/** Finding kinds applyFixes knows how to repair deterministically. */
export const FIXABLE_KINDS = new Set(["number-as-text", "extra-spaces", "inconsistent-formula"]);

function decodeA1(cell: string): { r: number; c: number } | null {
  const match = /^([A-Z]+)([0-9]+)$/.exec(cell);
  if (!match) return null;
  let c = 0;
  for (const ch of match[1]) c = c * 26 + (ch.charCodeAt(0) - 64);
  return { r: Number(match[2]) - 1, c: c - 1 };
}

/** Shift relative row references in a formula by delta rows ($-anchored rows stay). */
function shiftFormulaRows(formula: string, delta: number): string {
  let out = "";
  let inQuotes = false;
  let i = 0;
  const pattern = /^(\$?)([A-Z]{1,3})(\$?)(\d+)(?![\dA-Z(])/;
  while (i < formula.length) {
    const char = formula[i];
    if (char === '"') inQuotes = !inQuotes;
    if (!inQuotes) {
      const match = pattern.exec(formula.slice(i));
      // Don't match mid-identifier (e.g. the "G10" in LOG10).
      const prev = i > 0 ? formula[i - 1] : "";
      if (match && !/[A-Z0-9_$]/.test(prev)) {
        const [whole, colAbs, col, rowAbs, row] = match;
        out += `${colAbs}${col}${rowAbs}${rowAbs ? row : Number(row) + delta}`;
        i += whole.length;
        continue;
      }
    }
    out += char;
    i += 1;
  }
  return out;
}

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
  /** True when showing the file's cached value because the engine can't run the formula. */
  isCached?: boolean;
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
    /** Original file values for formula cells, keyed "sheet:r:c" — the fallback
     *  when the engine can't evaluate a formula the file had already computed. */
    private cached: Map<string, { formula: string; value: CellValue }>,
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
    const cached = new Map<string, { formula: string; value: CellValue }>();
    for (const sheet of workbook.sheets) {
      dims.set(sheet.name, { rows: sheet.values.length, cols: sheet.values[0]?.length ?? 0 });
      sheet.formats?.forEach((row, r) =>
        row.forEach((format, c) => {
          if (format) formats.set(`${sheet.name}:${r}:${c}`, format);
        }),
      );
      sheet.formulas.forEach((row, r) =>
        row.forEach((formula, c) => {
          const value = sheet.values[r][c];
          if (formula && value !== null && !(typeof value === "string" && value.startsWith("#"))) {
            cached.set(`${sheet.name}:${r}:${c}`, { formula, value });
          }
        }),
      );
    }
    return new WorkbookSession(hf, workbook.sheets.map((s) => s.name), formats, dims, cached);
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
      // Engine can't run it, but the file already knew the answer: show that.
      const original = this.cached.get(`${sheet}:${row}:${col}`);
      if (original && this.hf.getCellFormula(address) === original.formula) {
        const view = this.renderValue(sheet, row, col, original.value, isFormula);
        return { ...view, isCached: true };
      }
      return { display: value.value, isFormula, isError: true, isNumber: false };
    }
    return this.renderValue(sheet, row, col, value as CellValue, isFormula);
  }

  private renderValue(sheet: string, row: number, col: number, value: CellValue, isFormula: boolean): CellView {
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
      if (format && /#,##0/.test(format)) {
        const decimals = /0\.00/.test(format) ? 2 : 0;
        const grouped = value.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        return {
          display: format.includes("$") ? `$${grouped}` : grouped,
          isFormula,
          isError: false,
          isNumber: true,
        };
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
    return this.buildSnapshot(false);
  }

  /**
   * Re-scan the LIVE workbook. Unlike snapshot() (which nulls error values so
   * exports stay clean), the analysis view keeps computed errors as their
   * error strings — otherwise a re-scan is blind to every error cell.
   * Engine-gap formulas (#NAME? from functions the engine lacks) are
   * reclassified as cannot-evaluate rather than blamed on the user.
   */
  scanFindings(): WorkbookFinding[] {
    return analyzeWorkbook(this.buildSnapshot(true)).findings.map((finding) => {
      if (
        finding.kind === "error-cell" &&
        finding.link === "/errors/fix-name-error" &&
        finding.formula &&
        extractFunctions(finding.formula).some((fn) => ENGINE_MISSING.has(fn))
      ) {
        return {
          ...finding,
          kind: "cannot-evaluate" as const,
          detail: `${finding.formula} uses a function our engine can't run — not checked, not necessarily wrong.`,
          link: undefined,
        };
      }
      return finding;
    });
  }

  private buildSnapshot(errorsAsStrings: boolean): ParsedWorkbook {
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
            if (value instanceof DetailedCellError) {
              const original = this.cached.get(`${name}:${r}:${c}`);
              const usable = original && this.hf.getCellFormula(address) === original.formula;
              valueRow.push(usable ? original.value : errorsAsStrings ? value.value : null);
            } else {
              valueRow.push(value as CellValue);
            }
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

  /**
   * Apply deterministic repairs for fixable findings: convert text numbers,
   * clean stray spaces, and rewrite pattern-breaking formulas to match their
   * column's dominant shape (row-shifted). Everything else is skipped.
   */
  applyFixes(findings: WorkbookFinding[]): { applied: number; skipped: number } {
    this.assertAlive();
    let applied = 0;
    let skipped = 0;

    for (const finding of findings) {
      const target = decodeA1(finding.cell);
      if (!target || !FIXABLE_KINDS.has(finding.kind)) {
        skipped += 1;
        continue;
      }
      const sheetId = this.hf.getSheetId(finding.sheet);
      if (sheetId === undefined) {
        skipped += 1;
        continue;
      }
      const address = { sheet: sheetId, row: target.r, col: target.c };

      if (finding.kind === "number-as-text") {
        const value = this.hf.getCellValue(address);
        const numeric = Number(String(value).trim());
        if (typeof value === "string" && Number.isFinite(numeric)) {
          this.hf.setCellContents(address, [[numeric]]);
          applied += 1;
        } else skipped += 1;
      } else if (finding.kind === "extra-spaces") {
        const value = this.hf.getCellValue(address);
        if (typeof value === "string") {
          this.hf.setCellContents(address, [[value.trim().replace(/\s{2,}/g, " ")]]);
          applied += 1;
        } else skipped += 1;
      } else {
        // inconsistent-formula: rewrite to the column's dominant pattern.
        const donor = this.findDominantDonor(finding.sheet, sheetId, target.c, target.r);
        if (donor) {
          this.hf.setCellContents(address, [[shiftFormulaRows(donor.formula, target.r - donor.row)]]);
          applied += 1;
        } else skipped += 1;
      }
    }
    return { applied, skipped };
  }

  /** The nearest cell in the column whose formula matches the dominant signature. */
  private findDominantDonor(
    sheet: string,
    sheetId: number,
    col: number,
    excludeRow: number,
  ): { row: number; formula: string } | null {
    const { rows } = this.baseDims.get(sheet) ?? { rows: this.hf.getSheetDimensions(sheetId).height };
    const entries: { row: number; formula: string; signature: string }[] = [];
    for (let r = 0; r < rows; r++) {
      if (r === excludeRow) continue;
      const formula = this.hf.getCellFormula({ sheet: sheetId, row: r, col });
      if (formula) entries.push({ row: r, formula, signature: formulaSignature(formula) });
    }
    if (entries.length === 0) return null;
    const counts = new Map<string, number>();
    for (const entry of entries) counts.set(entry.signature, (counts.get(entry.signature) ?? 0) + 1);
    const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const donor = entries
      .filter((e) => e.signature === dominant)
      .sort((a, b) => Math.abs(a.row - excludeRow) - Math.abs(b.row - excludeRow))[0];
    return { row: donor.row, formula: donor.formula };
  }

  /** Undo the last N operations (used to roll back a cleanup batch). */
  undo(steps: number): void {
    this.assertAlive();
    for (let i = 0; i < steps && this.hf.isThereSomethingToUndo(); i++) {
      this.hf.undo();
    }
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.hf.destroy();
  }
}
