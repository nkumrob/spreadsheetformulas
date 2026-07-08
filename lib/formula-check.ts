/**
 * Deterministic formula checks (ticket SF-050) — the trust layer that runs
 * before any AI involvement. Pure functions, no external calls.
 */

export type Severity = "error" | "warning" | "info";

export type Finding = {
  id: string;
  severity: Severity;
  message: string;
  fix: string;
  correctedFormula?: string;
  link?: string;
};

export const ERROR_LINKS: Record<string, string> = {
  "#N/A": "/errors/fix-na-error",
  "#VALUE!": "/errors/fix-value-error",
  "#REF!": "/errors/fix-ref-error",
  "#DIV/0!": "/errors/fix-div0-error",
  "#NAME?": "/errors/fix-name-error",
  "#SPILL!": "/errors/fix-spill-error",
  "#NUM!": "/errors/fix-num-error",
  "#CYCLE!": "/errors/fix-circular-reference",
};

/** Functions the HyperFormula engine does not implement (probed against 3.3). */
export const ENGINE_MISSING = new Set([
  "LOOKUP", "AVERAGEIFS", "TEXTBEFORE", "TEXTAFTER", "TEXTSPLIT",
  "UNIQUE", "SORT", "RANK", "REGEXEXTRACT", "REGEXMATCH", "REGEXREPLACE", "QUERY",
  "LET", "XMATCH", "GOOGLEFINANCE", "SPARKLINE", "IMPORTRANGE", "CHOOSECOLS", "TOCOL",
]);

const KNOWN_FUNCTIONS = new Set([
  "ABS", "AND", "ARRAYFORMULA", "AVERAGE", "AVERAGEA", "AVERAGEIF", "AVERAGEIFS",
  "CEILING", "CHAR", "CHOOSE", "CLEAN", "COLUMN", "COLUMNS", "CONCAT", "CONCATENATE",
  "COUNT", "COUNTA", "COUNTBLANK", "COUNTIF", "COUNTIFS", "DATE", "DATEDIF", "DATEVALUE",
  "DAY", "DAYS", "EDATE", "EOMONTH", "EXACT", "FILTER", "FIND", "FLOOR", "HLOOKUP",
  "HOUR", "IF", "IFERROR", "IFNA", "IFS", "IMPORTRANGE", "INDEX", "INDIRECT", "INT",
  "ISBLANK", "ISERROR", "ISNUMBER", "ISTEXT", "LAMBDA", "LARGE", "LEFT", "LEN", "LET",
  "LOOKUP", "LOWER", "MATCH", "MAX", "MAXIFS", "MEDIAN", "MID", "MIN", "MINIFS",
  "MINUTE", "MOD", "MONTH", "NETWORKDAYS", "NOT", "NOW", "OFFSET", "OR", "PROPER",
  "QUERY", "RANK", "REGEXEXTRACT", "REGEXMATCH", "REGEXREPLACE", "REPLACE", "REPT",
  "RIGHT", "ROUND", "ROUNDDOWN", "ROUNDUP", "ROW", "ROWS", "SEARCH", "SECOND",
  "SEQUENCE", "SMALL", "SORT", "SORTBY", "SPLIT", "SQRT", "SUBSTITUTE", "SUBTOTAL",
  "SUM", "SUMIF", "SUMIFS", "SUMPRODUCT", "SWITCH", "TAKE", "TEXT", "TEXTAFTER",
  "TEXTBEFORE", "TEXTJOIN", "TEXTSPLIT", "TODAY", "TRANSPOSE", "TRIM", "TRUNC",
  "UNIQUE", "UPPER", "VALUE", "VLOOKUP", "WEEKDAY", "WORKDAY", "XLOOKUP", "XMATCH",
  "YEAR", "YEARFRAC",
]);

const SMART_QUOTES = /[“”‘’]/;

function normalizeSmartQuotes(text: string): string {
  return text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
}

/** Walk the formula skipping quoted strings; calls visit(char, index) outside quotes. */
function walkUnquoted(formula: string, visit: (char: string, index: number) => void): void {
  let inQuotes = false;
  for (let i = 0; i < formula.length; i++) {
    const char = formula[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes) visit(char, i);
  }
}

/** Unique function names in order of appearance, ignoring cell refs and quoted text. */
export function extractFunctions(formula: string): string[] {
  let unquoted = "";
  walkUnquoted(normalizeSmartQuotes(formula), (char) => {
    unquoted += char;
  });
  const seen: string[] = [];
  for (const match of unquoted.matchAll(/([A-Za-z][A-Za-z0-9.]*)\s*\(/g)) {
    const name = match[1].toUpperCase();
    if (!seen.includes(name)) seen.push(name);
  }
  return seen;
}

/** Count top-level arguments of the call whose "(" sits at openParen. */
function countArgs(formula: string, openParen: number): number | null {
  let depth = 0;
  let args = 1;
  let inQuotes = false;
  for (let i = openParen; i < formula.length; i++) {
    const char = formula[i];
    if (char === '"') inQuotes = !inQuotes;
    if (inQuotes) continue;
    if (char === "(") depth++;
    else if (char === ")") {
      depth--;
      if (depth === 0) return args;
    } else if ((char === "," || char === ";") && depth === 1) args++;
  }
  return null; // Unclosed — the paren check reports it.
}

export function checkFormula(rawInput: string): Finding[] {
  const input = rawInput.trim();
  if (!input) return [];

  const findings: Finding[] = [];

  // Standalone error value pasted in ("what does #N/A mean?") or embedded in the formula.
  for (const [errorValue, link] of Object.entries(ERROR_LINKS)) {
    if (input.toUpperCase().includes(errorValue)) {
      findings.push({
        id: "error-value",
        severity: "info",
        message: `This contains ${errorValue} — a spreadsheet error value, not part of a working formula.`,
        fix: `See the full guide to diagnosing and fixing ${errorValue}.`,
        link,
      });
      break;
    }
  }

  const looksLikeFormula = /[A-Za-z]/.test(input) && input !== input.toUpperCase().match(/^#.*$/)?.[0];
  if (!input.startsWith("=") && looksLikeFormula && /\(/.test(input)) {
    findings.push({
      id: "missing-equals",
      severity: "error",
      message: "The formula doesn't start with an equals sign, so the cell will show it as plain text.",
      fix: "Add = at the start.",
      correctedFormula: `=${normalizeSmartQuotes(input)}`,
    });
  }

  if (SMART_QUOTES.test(input)) {
    findings.push({
      id: "smart-quotes",
      severity: "error",
      message:
        "This contains curly “smart quotes” — usually from pasting out of Word, email, or a website. Spreadsheets only accept straight quotes.",
      fix: "Replace every curly quote with a straight quote.",
      correctedFormula: normalizeSmartQuotes(input),
    });
  }

  const normalized = normalizeSmartQuotes(input);

  let open = 0;
  let close = 0;
  walkUnquoted(normalized, (char) => {
    if (char === "(") open++;
    if (char === ")") close++;
  });
  if (open !== close) {
    findings.push({
      id: "unbalanced-parens",
      severity: "error",
      message: `Unbalanced parentheses: ${open} opening vs ${close} closing.`,
      fix:
        open > close
          ? `Add ${open - close} closing parenthesis${open - close === 1 ? "" : "es"} — usually at the very end.`
          : `Remove ${close - open} extra closing parenthesis${close - open === 1 ? "" : "es"}.`,
    });
  }

  let semicolons = 0;
  let commas = 0;
  walkUnquoted(normalized, (char) => {
    if (char === ";") semicolons++;
    if (char === ",") commas++;
  });
  if (semicolons > 0 && commas === 0) {
    findings.push({
      id: "semicolon-separators",
      severity: "warning",
      message:
        "Arguments are separated with semicolons. That's the European locale style — US-locale Excel and Google Sheets expect commas.",
      fix: "If your spreadsheet expects commas, replace the semicolons (or keep them if your regional settings use them).",
      correctedFormula: (() => {
        let out = "";
        let inQuotes = false;
        for (const char of normalized) {
          if (char === '"') inQuotes = !inQuotes;
          out += !inQuotes && char === ";" ? "," : char;
        }
        return out;
      })(),
    });
  }

  // VLOOKUP calls with only 3 arguments default to approximate match.
  const vlookupPattern = /VLOOKUP\s*\(/gi;
  for (const match of normalized.matchAll(vlookupPattern)) {
    const openParen = match.index! + match[0].length - 1;
    const args = countArgs(normalized, openParen);
    if (args === 3) {
      // Insert ,FALSE before the closing paren of this specific call.
      let depth = 0;
      let inQuotes = false;
      let closeIndex = -1;
      for (let i = openParen; i < normalized.length; i++) {
        const char = normalized[i];
        if (char === '"') inQuotes = !inQuotes;
        if (inQuotes) continue;
        if (char === "(") depth++;
        if (char === ")") {
          depth--;
          if (depth === 0) {
            closeIndex = i;
            break;
          }
        }
      }
      findings.push({
        id: "vlookup-approx",
        severity: "warning",
        message:
          "This VLOOKUP has no exact-match argument, so it defaults to approximate match — which silently returns wrong values on unsorted data.",
        fix: "Add FALSE as the fourth argument to force an exact match.",
        correctedFormula:
          closeIndex > -1
            ? `${normalized.slice(0, closeIndex)},FALSE${normalized.slice(closeIndex)}`
            : undefined,
        link: "/formulas/vlookup-exact-match",
      });
      break;
    }
  }

  for (const name of extractFunctions(normalized)) {
    if (!KNOWN_FUNCTIONS.has(name)) {
      findings.push({
        id: "unknown-function",
        severity: "warning",
        message: `${name} isn't a function we recognize — if the spreadsheet shows #NAME?, this is why.`,
        fix: "Check the spelling, or confirm the function exists in your Excel version / Google Sheets.",
        link: "/errors/fix-name-error",
      });
    }
  }

  return findings;
}
