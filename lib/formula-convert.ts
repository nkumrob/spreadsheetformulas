import { extractFunctions } from "./formula-check";

/**
 * Deterministic Excel ↔ Google Sheets formula conversion (PRD Tool 4).
 * Function-catalog driven: rename direct equivalents, rewrite structural
 * ones, and refuse (with guidance) where no clean equivalent exists —
 * never guess.
 */

export type Platform = "excel" | "sheets";

export type ConversionResult = {
  formula: string | null;
  changes: string[];
  warnings: string[];
  notes: string[];
};

const SHEETS_ONLY = new Set([
  "QUERY", "ARRAYFORMULA", "IMPORTRANGE", "GOOGLEFINANCE", "SPARKLINE", "SPLIT",
  "REGEXEXTRACT", "REGEXMATCH", "REGEXREPLACE", "COUNTUNIQUE", "IMPORTHTML", "IMPORTXML",
]);
const EXCEL_ONLY = new Set([
  "TEXTSPLIT", "TEXTBEFORE", "TEXTAFTER", "XMATCH", "LAMBDA", "PMT",
  "CHOOSECOLS", "TOCOL", "TAKE", "DROP", "BYROW", "BYCOL",
]);
const MODERN_SHARED: Record<string, string> = {
  XLOOKUP: "XLOOKUP needs Excel 2021/365; available in Google Sheets since 2022.",
  FILTER: "FILTER needs Excel 2021/365. Sheets' FILTER errors with #N/A on no match; Excel takes an if-empty argument.",
  UNIQUE: "UNIQUE needs Excel 2021/365.",
  SORT: "SORT needs Excel 2021/365 — and argument orders differ slightly between platforms.",
  SEQUENCE: "SEQUENCE needs Excel 2021/365.",
  LET: "LET needs Excel 2021/365; added to Google Sheets in 2023.",
  IFS: "IFS needs Excel 2019 or newer.",
  TEXTJOIN: "TEXTJOIN needs Excel 2019 or newer.",
  SWITCH: "SWITCH needs Excel 2019 or newer.",
};

/** Simple renames where the arguments carry over directly. */
const RENAMES: Record<Platform, Record<string, string>> = {
  sheets: { TEXTSPLIT: "SPLIT" },
  excel: { SPLIT: "TEXTSPLIT" },
};

/** Pattern rewrites: fn(args) → template with $ARGS or positional $1/$2. */
const REWRITES: Record<Platform, Record<string, { out: (args: string[]) => string; note: string }>> = {
  excel: {
    COUNTUNIQUE: {
      out: (args) => `ROWS(UNIQUE(${args.join(",")}))`,
      note: "COUNTUNIQUE(range) becomes ROWS(UNIQUE(range)) in Excel 365.",
    },
    ARRAYFORMULA: {
      out: (args) => args.join(","),
      note: "Excel 365 spills array results natively — the ARRAYFORMULA wrapper simply drops away.",
    },
  },
  sheets: {
    TEXTBEFORE: {
      out: (args) => (args.length === 2 ? `LEFT(${args[0]},FIND(${args[1]},${args[0]})-1)` : ""),
      note: "Sheets has no TEXTBEFORE — LEFT + FIND does the same for a single delimiter.",
    },
    TEXTAFTER: {
      out: (args) =>
        args.length === 2 ? `MID(${args[0]},FIND(${args[1]},${args[0]})+LEN(${args[1]}),9999)` : "",
      note: "Sheets has no TEXTAFTER — MID + FIND returns everything after the delimiter.",
    },
  },
};

/** No clean formula equivalent — explain the path instead. */
const DEAD_ENDS: Record<Platform, Record<string, string>> = {
  excel: {
    QUERY: "QUERY has no Excel equivalent — rebuild with FILTER + SORT (Excel 365), or a pivot table for grouping.",
    IMPORTRANGE: "IMPORTRANGE has no Excel formula equivalent — use a cross-workbook reference ('[Book.xlsx]Sheet'!A1) or Power Query.",
    GOOGLEFINANCE: "GOOGLEFINANCE has no Excel formula equivalent — use the built-in Stocks data type (Data → Stocks).",
    SPARKLINE: "SPARKLINE is a menu feature in Excel, not a formula: Insert → Sparklines.",
    REGEXEXTRACT: "Excel has no native regex — for simple cases use MID/FIND, or the digit-filter pattern on our extract-numbers-from-text page.",
    REGEXMATCH: "Excel has no native regex — approximate with ISNUMBER(SEARCH(...)), noting SEARCH is not a real pattern match.",
    REGEXREPLACE: "Excel has no native regex — chain SUBSTITUTE calls for fixed strings.",
    IMPORTHTML: "No Excel formula equivalent — use Power Query's From Web.",
    IMPORTXML: "No Excel formula equivalent — use Power Query's From Web.",
  },
  sheets: {
    LAMBDA: "Google Sheets supports LAMBDA too, but named-function setups differ — recreate via Data → Named functions.",
    PMT: "PMT exists in Sheets with identical arguments — no conversion needed.",
    CHOOSECOLS: "Sheets has CHOOSECOLS since 2023 — usually no conversion needed; verify your Sheets version.",
  },
};

export function detectPlatform(formula: string): Platform | "either" {
  const functions = extractFunctions(formula);
  if (functions.some((f) => SHEETS_ONLY.has(f))) return "sheets";
  if (functions.some((f) => EXCEL_ONLY.has(f))) return "excel";
  return "either";
}

/** Replace a function's whole call fn(args) using a rewrite template, quote-safe. */
function rewriteCall(formula: string, name: string, build: (args: string[]) => string): string | null {
  const pattern = new RegExp(`${name}\\s*\\(`, "i");
  let inQuotes = false;
  for (let i = 0; i < formula.length; i++) {
    if (formula[i] === '"') inQuotes = !inQuotes;
    if (inQuotes) continue;
    const slice = formula.slice(i);
    const match = pattern.exec(slice);
    if (!match || match.index !== 0) continue;
    const prev = i > 0 ? formula[i - 1] : "";
    if (/[A-Z0-9_.]/i.test(prev)) continue;
    // Collect the balanced argument list.
    const open = i + match[0].length - 1;
    let depth = 0;
    let quoted = false;
    const args: string[] = [];
    let current = "";
    for (let j = open; j < formula.length; j++) {
      const char = formula[j];
      if (char === '"') quoted = !quoted;
      if (!quoted) {
        if (char === "(") {
          depth++;
          if (depth === 1) continue;
        } else if (char === ")") {
          depth--;
          if (depth === 0) {
            if (current.trim()) args.push(current.trim());
            const replacement = build(args);
            if (!replacement) return null;
            return formula.slice(0, i) + replacement + formula.slice(j + 1);
          }
        } else if (char === "," && depth === 1) {
          args.push(current.trim());
          current = "";
          continue;
        }
      }
      if (depth >= 1) current += char;
    }
    return null; // Unbalanced — leave to the checker.
  }
  return null;
}

/** Quote-safe whole-word function rename. */
function renameFunction(formula: string, from: string, to: string): string {
  let out = "";
  let inQuotes = false;
  let i = 0;
  while (i < formula.length) {
    const char = formula[i];
    if (char === '"') inQuotes = !inQuotes;
    if (!inQuotes && formula.slice(i, i + from.length + 1).toUpperCase() === `${from}(`) {
      const prev = i > 0 ? formula[i - 1] : "";
      if (!/[A-Z0-9_.]/i.test(prev)) {
        out += `${to}(`;
        i += from.length + 1;
        continue;
      }
    }
    out += char;
    i += 1;
  }
  return out;
}

export function convertFormula(rawInput: string, target: Platform): ConversionResult {
  const input = rawInput.trim();
  const result: ConversionResult = { formula: null, changes: [], warnings: [], notes: [] };
  if (!input.startsWith("=")) {
    result.warnings.push("Formulas start with = — paste the whole cell contents.");
    return result;
  }

  let formula = input;
  const functions = extractFunctions(formula);

  // Dead ends first: if any function can't cross over, explain and stop.
  for (const fn of functions) {
    const deadEnd = DEAD_ENDS[target][fn];
    const crossesOver = target === "excel" ? SHEETS_ONLY.has(fn) : EXCEL_ONLY.has(fn);
    if (deadEnd && crossesOver && !RENAMES[target][fn] && !REWRITES[target][fn]) {
      result.warnings.push(deadEnd);
    }
  }
  if (result.warnings.length > 0) return result;

  for (const fn of functions) {
    const rename = RENAMES[target][fn];
    if (rename) {
      formula = renameFunction(formula, fn, rename);
      result.changes.push(`${fn} → ${rename}`);
      continue;
    }
    const rewrite = REWRITES[target][fn];
    if (rewrite) {
      const rewritten = rewriteCall(formula, fn, rewrite.out);
      if (rewritten) {
        formula = rewritten;
        result.changes.push(rewrite.note);
      } else {
        result.warnings.push(`${fn} uses a form we can't convert automatically — ${rewrite.note}`);
        return result;
      }
    }
  }

  for (const fn of extractFunctions(formula)) {
    if (MODERN_SHARED[fn]) result.notes.push(MODERN_SHARED[fn]);
  }
  if (result.changes.length === 0 && result.notes.length === 0) {
    result.notes.push("This formula is identical in Excel and Google Sheets.");
  }

  result.formula = formula;
  return result;
}
