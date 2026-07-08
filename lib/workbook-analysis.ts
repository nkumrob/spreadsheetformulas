import { read as readXlsx, write as writeXlsx, utils as xlsxUtils } from "xlsx";
import { HyperFormula, DetailedCellError } from "hyperformula";
import { ERROR_LINKS, ENGINE_MISSING, extractFunctions } from "./formula-check";

/**
 * Client-side workbook analysis (PRD Tool 15, lean tier). Everything here is
 * pure computation over an already-parsed workbook — no network, no storage.
 * The uploaded file never leaves the browser.
 */

export type CellValue = string | number | boolean | null;

export type SheetData = {
  name: string;
  values: CellValue[][];
  /** "="-prefixed formula per cell, or null. Same dimensions as values. */
  formulas: (string | null)[][];
  /** Excel number-format string per cell (e.g. "yyyy-mm-dd"), where present. */
  formats?: (string | null)[][];
};

export type ParsedWorkbook = { sheets: SheetData[] };

export type FindingKind =
  | "error-cell"
  | "number-as-text"
  | "extra-spaces"
  | "inconsistent-formula"
  | "stale-value"
  | "cannot-evaluate";

export type WorkbookFinding = {
  kind: FindingKind;
  sheet: string;
  cell: string;
  detail: string;
  formula?: string;
  link?: string;
};

export type WorkbookReport = {
  stats: { sheets: number; cells: number; formulas: number };
  findings: WorkbookFinding[];
};

const MAX_ROWS = 2000;
const MAX_COLS = 100;
const VOLATILE = /\b(TODAY|NOW|RAND|RANDBETWEEN)\s*\(/i;

function cellAddress(row: number, col: number): string {
  return xlsxUtils.encode_cell({ r: row, c: col });
}

/** Parse an .xlsx/.csv ArrayBuffer or Buffer into plain grids. */
export function parseWorkbook(data: ArrayBuffer | Uint8Array): ParsedWorkbook {
  const workbook = readXlsx(data, { type: "array", sheetStubs: true, cellNF: true });
  const sheets: SheetData[] = [];

  for (const name of workbook.SheetNames) {
    const ws = workbook.Sheets[name];
    if (!ws["!ref"]) continue;
    const range = xlsxUtils.decode_range(ws["!ref"]);
    const rows = Math.min(range.e.r + 1, MAX_ROWS);
    const cols = Math.min(range.e.c + 1, MAX_COLS);

    const values: CellValue[][] = [];
    const formulas: (string | null)[][] = [];
    const formats: (string | null)[][] = [];
    for (let r = 0; r < rows; r++) {
      const valueRow: CellValue[] = [];
      const formulaRow: (string | null)[] = [];
      const formatRow: (string | null)[] = [];
      for (let c = 0; c < cols; c++) {
        const cell = ws[cellAddress(r, c)];
        if (!cell) {
          valueRow.push(null);
          formulaRow.push(null);
          formatRow.push(null);
          continue;
        }
        // Error cells: surface the display string ("#DIV/0!"), not the code.
        if (cell.t === "e") valueRow.push(cell.w ?? "#ERROR!");
        else if (cell.t === "z") valueRow.push(null);
        else valueRow.push(cell.v ?? null);
        formulaRow.push(cell.f ? `=${cell.f}` : null);
        formatRow.push(cell.z && cell.z !== "General" ? String(cell.z) : null);
      }
      values.push(valueRow);
      formulas.push(formulaRow);
      formats.push(formatRow);
    }
    sheets.push({ name, values, formulas, formats });
  }

  return { sheets };
}

const NUMBER_AS_TEXT = /^\s*-?\d+(\.\d+)?\s*$/;

/** Strip row numbers from references so copies of one formula share a signature. */
function formulaSignature(formula: string): string {
  return formula.replace(/(\$?[A-Z]{1,3})\$?\d+/g, "$1");
}

export function analyzeWorkbook(workbook: ParsedWorkbook): WorkbookReport {
  const findings: WorkbookFinding[] = [];
  let cells = 0;
  let formulaCount = 0;

  for (const sheet of workbook.sheets) {
    for (let r = 0; r < sheet.values.length; r++) {
      for (let c = 0; c < sheet.values[r].length; c++) {
        const value = sheet.values[r][c];
        const formula = sheet.formulas[r][c];
        if (value === null && formula === null) continue;
        cells++;
        if (formula) formulaCount++;
        const address = cellAddress(r, c);

        if (typeof value === "string") {
          const errorValue = Object.keys(ERROR_LINKS).find((e) => value.toUpperCase() === e);
          if (errorValue) {
            findings.push({
              kind: "error-cell",
              sheet: sheet.name,
              cell: address,
              detail: `${errorValue} error${formula ? ` from ${formula}` : ""}`,
              formula: formula ?? undefined,
              link: ERROR_LINKS[errorValue],
            });
            continue;
          }
          if (!formula && NUMBER_AS_TEXT.test(value)) {
            findings.push({
              kind: "number-as-text",
              sheet: sheet.name,
              cell: address,
              detail: `"${value}" is text, not a number — math and lookups against it will misbehave.`,
            });
          } else if (!formula && (value !== value.trim() || /\s{2,}/.test(value))) {
            findings.push({
              kind: "extra-spaces",
              sheet: sheet.name,
              cell: address,
              detail: `"${value}" has stray spaces — a classic cause of failed lookups. TRIM fixes it.`,
            });
          }
        }
      }
    }

    // Inconsistent formulas: within a column, a formula whose shape differs
    // from the dominant pattern (the row-47-is-different problem).
    const colCount = sheet.values[0]?.length ?? 0;
    for (let c = 0; c < colCount; c++) {
      const entries: { row: number; signature: string; formula: string }[] = [];
      for (let r = 0; r < sheet.formulas.length; r++) {
        const formula = sheet.formulas[r]?.[c];
        if (formula) entries.push({ row: r, signature: formulaSignature(formula), formula });
      }
      if (entries.length < 4) continue;
      const counts = new Map<string, number>();
      for (const entry of entries) counts.set(entry.signature, (counts.get(entry.signature) ?? 0) + 1);
      const [dominant, dominantCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
      if (dominantCount / entries.length < 0.75) continue;
      for (const entry of entries) {
        if (entry.signature !== dominant) {
          findings.push({
            kind: "inconsistent-formula",
            sheet: sheet.name,
            cell: cellAddress(entry.row, c),
            detail: `${entry.formula} doesn't match the pattern used by the other ${dominantCount} formulas in this column.`,
            formula: entry.formula,
          });
        }
      }
    }
  }

  return {
    stats: { sheets: workbook.sheets.length, cells, formulas: formulaCount },
    findings,
  };
}

const ENGINE_OPTIONS = { licenseKey: "gpl-v3", dateFormats: ["YYYY-MM-DD", "MM/DD/YYYY"] };
const LITERALS = [
  { name: "TRUE", expression: "=TRUE()" },
  { name: "FALSE", expression: "=FALSE()" },
];

function buildEngine(workbook: ParsedWorkbook): HyperFormula {
  const sheets = Object.fromEntries(
    workbook.sheets.map((sheet) => [
      sheet.name,
      sheet.values.map((row, r) => row.map((value, c) => sheet.formulas[r][c] ?? value)),
    ]),
  );
  return HyperFormula.buildFromSheets(sheets, ENGINE_OPTIONS, LITERALS);
}

/** Recompute every formula and compare against the stored value. */
export function recomputeFindings(workbook: ParsedWorkbook): WorkbookFinding[] {
  const findings: WorkbookFinding[] = [];
  let hf: HyperFormula;
  try {
    hf = buildEngine(workbook);
  } catch {
    return findings; // Engine couldn't load the workbook at all — skip this layer.
  }

  for (const sheet of workbook.sheets) {
    const sheetId = hf.getSheetId(sheet.name)!;
    for (let r = 0; r < sheet.formulas.length; r++) {
      for (let c = 0; c < sheet.formulas[r].length; c++) {
        const formula = sheet.formulas[r][c];
        if (!formula) continue;
        const stored = sheet.values[r][c];
        const computed = hf.getCellValue({ sheet: sheetId, row: r, col: c });
        const address = cellAddress(r, c);

        if (computed instanceof DetailedCellError) {
          const storedIsError = typeof stored === "string" && stored.startsWith("#");
          const usesMissing = extractFunctions(formula).some((fn) => ENGINE_MISSING.has(fn));
          if (!storedIsError && (usesMissing || computed.value === "#NAME?")) {
            findings.push({
              kind: "cannot-evaluate",
              sheet: sheet.name,
              cell: address,
              detail: `${formula} uses a function our engine can't run — not checked, not necessarily wrong.`,
              formula,
            });
          }
          continue;
        }

        // Stale check: skip volatile formulas, cells with no cached value, and
        // stored error values (already reported as error-cell findings — and the
        // engine's type coercion is looser than Excel's, so it may "fix" them).
        if (stored === null || VOLATILE.test(formula)) continue;
        if (typeof stored === "string" && stored.startsWith("#")) continue;
        const matches =
          typeof computed === "number" && typeof stored === "number"
            ? Math.abs(computed - stored) <= Math.max(1e-6, Math.abs(stored) * 1e-6)
            : String(computed) === String(stored);
        if (!matches) {
          findings.push({
            kind: "stale-value",
            sheet: sheet.name,
            cell: address,
            detail: `Shows ${JSON.stringify(stored)} but the formula computes ${JSON.stringify(computed)} — the saved value is out of date or was overwritten.`,
            formula,
          });
        }
      }
    }
  }

  hf.destroy();
  return findings;
}

/** Serialize a (possibly edited) workbook back to .xlsx bytes for download. */
export function exportWorkbook(workbook: ParsedWorkbook): Uint8Array {
  const out = xlsxUtils.book_new();
  for (const sheet of workbook.sheets) {
    const ws: Record<string, unknown> = {};
    let maxRow = 0;
    let maxCol = 0;
    for (let r = 0; r < sheet.values.length; r++) {
      for (let c = 0; c < sheet.values[r].length; c++) {
        const value = sheet.values[r][c];
        const formula = sheet.formulas[r]?.[c] ?? null;
        if (value === null && !formula) continue;
        maxRow = Math.max(maxRow, r);
        maxCol = Math.max(maxCol, c);
        const cell: Record<string, unknown> = {};
        if (formula) cell.f = formula.slice(1);
        if (typeof value === "number") {
          cell.v = value;
          cell.t = "n";
        } else if (typeof value === "boolean") {
          cell.v = value;
          cell.t = "b";
        } else if (typeof value === "string" && value !== "") {
          cell.v = value;
          cell.t = "s";
        } else if (!formula) {
          continue;
        }
        const format = sheet.formats?.[r]?.[c];
        if (format) cell.z = format;
        ws[cellAddress(r, c)] = cell;
      }
    }
    ws["!ref"] = `A1:${cellAddress(maxRow, maxCol)}`;
    xlsxUtils.book_append_sheet(out, ws, sheet.name.slice(0, 31));
  }
  return writeXlsx(out, { type: "array", bookType: "xlsx" }) as Uint8Array;
}

export type TestResult = { ok: true; value: CellValue } | { ok: false; error: string };

/** Evaluate a user formula in the context of one of their sheets. */
export function testFormula(workbook: ParsedWorkbook, sheetName: string, formula: string): TestResult {
  const trimmed = formula.trim();
  if (!trimmed.startsWith("=")) {
    return { ok: false, error: "Formulas start with = — paste the whole cell contents." };
  }
  const sheet = workbook.sheets.find((s) => s.name === sheetName);
  if (!sheet) return { ok: false, error: "Sheet not found." };

  let hf: HyperFormula;
  try {
    hf = buildEngine(workbook);
  } catch {
    return { ok: false, error: "This workbook couldn't be loaded into the formula engine." };
  }

  try {
    const sheetId = hf.getSheetId(sheetName)!;
    // Scratch cell safely outside the used range.
    const target = { sheet: sheetId, row: sheet.values.length + 2, col: 0 };
    hf.setCellContents(target, [[trimmed]]);
    const value = hf.getCellValue(target);
    if (value instanceof DetailedCellError) {
      return { ok: false, error: value.value };
    }
    return { ok: true, value: value as CellValue };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not evaluate." };
  } finally {
    hf.destroy();
  }
}
