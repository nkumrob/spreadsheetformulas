import { extractFunctions } from "./formula-check";

/**
 * Rule-based formula explainer (SF-051, basic tier). No AI involved:
 * a curated knowledge base + structural parsing. Honest about limits —
 * unknown functions are labeled as such rather than guessed at.
 */

export type ExplainedArg = { value: string; hint: string };

export type Explanation = {
  functions: { name: string; what: string }[];
  outer: { name: string; what: string; args: ExplainedArg[] } | null;
  references: string[];
  notes: string[];
};

type FunctionInfo = { what: string; argHints?: string[] };

const GUIDE: Record<string, FunctionInfo> = {
  IF: {
    what: "Tests a condition and returns one value when it's true, another when it's false.",
    argHints: ["The condition being tested", "Returned when the condition is TRUE", "Returned when the condition is FALSE"],
  },
  IFS: { what: "Checks conditions in order and returns the value for the first one that's true." },
  AND: { what: "Returns TRUE only when every condition inside it is true." },
  OR: { what: "Returns TRUE when at least one condition inside it is true." },
  NOT: { what: "Flips TRUE to FALSE and vice versa." },
  IFERROR: {
    what: "Runs the first argument; if it produces any error, returns the fallback instead.",
    argHints: ["The calculation to attempt", "What to show if that calculation errors"],
  },
  IFNA: {
    what: "Like IFERROR, but only catches #N/A — other errors still surface.",
    argHints: ["The calculation to attempt", "What to show if it returns #N/A"],
  },
  VLOOKUP: {
    what: "Looks for a value in the first column of a table and returns a value from another column of the matching row.",
    argHints: [
      "The value to look up",
      "The table to search — only its first column is searched",
      "Which column of the table to return (1 = first)",
      "FALSE = exact match (recommended); TRUE/omitted = approximate",
    ],
  },
  XLOOKUP: {
    what: "Searches one range for a value and returns the matching position from another range. Exact match by default.",
    argHints: [
      "The value to look up",
      "The column/row to search",
      "The column/row to return values from",
      "Shown when there's no match (optional)",
      "Match mode (optional)",
      "Search direction: -1 searches last-to-first (optional)",
    ],
  },
  INDEX: {
    what: "Returns the value at a given position within a range.",
    argHints: ["The range to pull from", "Which row position to return", "Which column position (optional)"],
  },
  MATCH: {
    what: "Finds the position of a value within a range — usually feeding that position to INDEX.",
    argHints: ["The value to find", "The range to search", "0 = exact match (almost always what you want)"],
  },
  SUM: { what: "Adds up all the numbers in the range." },
  SUMIF: { what: "Adds values where a single condition is met.", argHints: ["Range to test", "The condition", "Range to sum (optional)"] },
  SUMIFS: {
    what: "Adds values where every condition is met. The sum range comes first, then range/condition pairs.",
    argHints: ["The values to add up", "First range to test", "Condition for that range"],
  },
  COUNT: { what: "Counts cells containing numbers." },
  COUNTA: { what: "Counts cells that aren't empty." },
  COUNTBLANK: { what: "Counts empty cells in the range." },
  COUNTIF: { what: "Counts cells matching one condition.", argHints: ["Range to test", "The condition"] },
  COUNTIFS: { what: "Counts rows where every range/condition pair is satisfied at once." },
  AVERAGEIF: { what: "Averages values where a condition is met." },
  AVERAGEIFS: { what: "Averages values where every condition is met." },
  MAX: { what: "Returns the largest number in the range." },
  MIN: { what: "Returns the smallest number in the range." },
  MAXIFS: { what: "Returns the largest value among rows meeting the conditions." },
  MINIFS: { what: "Returns the smallest value among rows meeting the conditions." },
  TODAY: { what: "Today's date. Recalculates every day the file opens." },
  NOW: { what: "The current date and time." },
  DATE: { what: "Builds a date from year, month, day numbers.", argHints: ["Year", "Month", "Day"] },
  EDATE: { what: "Shifts a date by whole months.", argHints: ["Start date", "Months to add (negative subtracts)"] },
  EOMONTH: { what: "The last day of the month, offset by a number of months." },
  WORKDAY: { what: "A date a given number of business days away, skipping weekends." },
  NETWORKDAYS: { what: "Counts business days between two dates." },
  DATEDIF: { what: "The difference between two dates in days, months, or years." },
  TEXT: { what: "Formats a number or date as text using a format code.", argHints: ["The value", 'The format, e.g. "yyyy-mm" or "0.0%"'] },
  LEFT: { what: "Keeps a number of characters from the start of the text.", argHints: ["The text", "How many characters"] },
  RIGHT: { what: "Keeps a number of characters from the end of the text." },
  MID: { what: "Extracts characters from the middle of text.", argHints: ["The text", "Starting position", "How many characters"] },
  FIND: { what: "The position of one text inside another (case-sensitive). Errors if not found.", argHints: ["What to find", "Where to look"] },
  SEARCH: { what: "Like FIND, but case-insensitive and allows wildcards." },
  LEN: { what: "The number of characters in the text." },
  TRIM: { what: "Removes leading/trailing spaces and collapses doubled spaces." },
  PROPER: { what: "Capitalizes The First Letter Of Each Word." },
  UPPER: { what: "Converts text to UPPERCASE." },
  LOWER: { what: "Converts text to lowercase." },
  SUBSTITUTE: { what: "Replaces occurrences of one text with another.", argHints: ["The text", "What to replace", "Replacement"] },
  TEXTJOIN: { what: "Joins values with a separator; can skip blanks.", argHints: ["Separator", "TRUE = skip empty cells", "Values to join"] },
  TEXTBEFORE: { what: "Everything before a delimiter (Excel 365)." },
  TEXTAFTER: { what: "Everything after a delimiter (Excel 365)." },
  TEXTSPLIT: { what: "Splits text into cells by a delimiter (Excel 365)." },
  SPLIT: { what: "Splits text into cells by a delimiter (Google Sheets)." },
  CONCATENATE: { what: "Joins text values together — the & operator does the same." },
  VALUE: { what: "Converts a number stored as text into a real number." },
  ISNUMBER: { what: "TRUE if the cell holds a real number — the standard #VALUE! diagnostic." },
  ISBLANK: { what: "TRUE if the cell is truly empty (a formula returning \"\" doesn't count)." },
  UNIQUE: { what: "Returns the list with duplicates removed, spilling into the cells below." },
  FILTER: { what: "Returns only the rows matching a condition, spilling into place." },
  SORT: { what: "Returns the range sorted, spilling into place." },
  RANK: { what: "The rank of a number within a list.", argHints: ["The value", "The list", "0 = largest first, 1 = smallest first"] },
  ROUND: { what: "Rounds a number to a set number of decimal places." },
  SUMPRODUCT: { what: "Multiplies ranges together and sums the results — a flexible conditional calculator." },
  REGEXEXTRACT: { what: "Extracts text matching a regular expression (Google Sheets)." },
  REGEXMATCH: { what: "TRUE if the text matches a regular expression (Google Sheets)." },
  REGEXREPLACE: { what: "Replaces text matching a regular expression (Google Sheets)." },
  QUERY: { what: "Runs a SQL-like query over a range (Google Sheets)." },
  ARRAYFORMULA: { what: "Applies a formula across a whole range at once (Google Sheets)." },
  LET: { what: "Names intermediate values so long formulas read like steps (Excel 365)." },
  LAMBDA: { what: "Defines a reusable custom function (Excel 365)." },
  MOD: { what: "The remainder after division." },
  ABS: { what: "The absolute (positive) value." },
  SQRT: { what: "The square root. Negative inputs give #NUM!." },
  CHAR: { what: "The character for a character code — CHAR(160) is the non-breaking space." },
  LOOKUP: { what: "A legacy lookup; LOOKUP(2,1/(range=value),results) retrieves the last match." },
};

const CELL_REF = /(?:'[^']+'|[A-Za-z_][A-Za-z0-9_]*)?!?\$?[A-Z]{1,3}\$?[0-9]*(?::\$?[A-Z]{1,3}\$?[0-9]*)?/g;

function isReference(token: string): boolean {
  return /^(?:(?:'[^']+'|[A-Za-z_][A-Za-z0-9_]*)!)?\$?[A-Z]{1,3}(?:\$?[0-9]+)?(?::\$?[A-Z]{1,3}(?:\$?[0-9]+)?)?$/.test(
    token,
  );
}

/** Split the argument list of the outermost function at top-level commas/semicolons. */
function splitTopLevelArgs(body: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let inQuotes = false;
  let current = "";
  for (const char of body) {
    if (char === '"') inQuotes = !inQuotes;
    if (!inQuotes) {
      if (char === "(") depth++;
      if (char === ")") depth--;
      if ((char === "," || char === ";") && depth === 0) {
        args.push(current.trim());
        current = "";
        continue;
      }
    }
    current += char;
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function extractReferences(formula: string): string[] {
  // Strip quoted strings first so text like "A2" isn't picked up.
  let unquoted = "";
  let inQuotes = false;
  for (const char of formula) {
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes) unquoted += char;
  }
  const found = new Set<string>();
  for (const match of unquoted.matchAll(CELL_REF)) {
    const token = match[0];
    if (token && isReference(token) && /[0-9:]/.test(token)) found.add(token);
  }
  return [...found];
}

export function explainFormula(rawInput: string): Explanation | null {
  const input = rawInput.trim();
  if (!input.startsWith("=") || input.length < 2) return null;

  const body = input.slice(1);
  const functionNames = extractFunctions(input);

  const functions = functionNames.map((name) => ({
    name,
    what: GUIDE[name]?.what ?? `${name} is not in our guide yet — check the spelling if you see #NAME?.`,
  }));

  // Outer function breakdown: formula must be exactly OUTER(...)
  let outer: Explanation["outer"] = null;
  const outerMatch = body.match(/^([A-Za-z][A-Za-z0-9.]*)\s*\(/);
  if (outerMatch && body.endsWith(")")) {
    const name = outerMatch[1].toUpperCase();
    const inner = body.slice(outerMatch[0].length, -1);
    const info = GUIDE[name];
    const args = splitTopLevelArgs(inner).map((value, i) => ({
      value,
      hint: info?.argHints?.[i] ?? `Argument ${i + 1}`,
    }));
    outer = {
      name,
      what: info?.what ?? "Not in our guide yet.",
      args,
    };
  }

  const notes: string[] = [];
  if (functionNames.includes("IFERROR") || functionNames.includes("IFNA")) {
    notes.push("Errors are being caught and replaced — make sure that's hiding expected misses, not real data problems.");
  }
  if (functionNames.includes("VLOOKUP") && !/FALSE|,\s*0\s*\)/i.test(input)) {
    notes.push("This VLOOKUP may be using approximate match — add FALSE as the last argument for exact matching.");
  }
  if (functionNames.includes("TODAY") || functionNames.includes("NOW")) {
    notes.push("This result changes over time: TODAY()/NOW() recalculate whenever the sheet does.");
  }

  return { functions, outer, references: extractReferences(input), notes };
}
