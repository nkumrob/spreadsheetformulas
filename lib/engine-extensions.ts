import {
  CellError,
  EmptyValue,
  ErrorType,
  FunctionArgumentType,
  FunctionPlugin,
  HyperFormula,
  SimpleRangeValue,
} from "hyperformula";

/**
 * Extension pack: functions HyperFormula lacks, implemented to documented
 * Excel/Google Sheets semantics and registered globally. Importing this
 * module (side effect) upgrades every engine the app builds — the editor,
 * the verification harness, and the analyzer.
 *
 * Deliberately NOT implemented: QUERY (a SQL dialect), LET (parser-level),
 * IMPORTRANGE/GOOGLEFINANCE (external data), SPARKLINE (visual).
 */

type Ast = Parameters<FunctionPlugin["evaluateAst"]>[0];
type State = Parameters<FunctionPlugin["evaluateAst"]>[1];
// Function-call AST nodes carry args; the exported Ast union doesn't narrow them.
type ProcedureAst = Ast & { args: Ast[] };

function safeRegex(pattern: string): RegExp | CellError {
  try {
    return new RegExp(pattern);
  } catch {
    return new CellError(ErrorType.VALUE, "Invalid regular expression.");
  }
}

class SpreadsheetFormulasPlugin extends FunctionPlugin {
  static implementedFunctions = {
    REGEXEXTRACT: {
      method: "regexextract",
      parameters: [
        { argumentType: FunctionArgumentType.STRING },
        { argumentType: FunctionArgumentType.STRING },
      ],
    },
    REGEXMATCH: {
      method: "regexmatch",
      parameters: [
        { argumentType: FunctionArgumentType.STRING },
        { argumentType: FunctionArgumentType.STRING },
      ],
    },
    REGEXREPLACE: {
      method: "regexreplace",
      parameters: [
        { argumentType: FunctionArgumentType.STRING },
        { argumentType: FunctionArgumentType.STRING },
        { argumentType: FunctionArgumentType.STRING },
      ],
    },
    TEXTBEFORE: {
      method: "textbefore",
      parameters: [
        { argumentType: FunctionArgumentType.STRING },
        { argumentType: FunctionArgumentType.STRING },
      ],
    },
    TEXTAFTER: {
      method: "textafter",
      parameters: [
        { argumentType: FunctionArgumentType.STRING },
        { argumentType: FunctionArgumentType.STRING },
      ],
    },
    RANK: {
      method: "rank",
      parameters: [
        { argumentType: FunctionArgumentType.NUMBER },
        { argumentType: FunctionArgumentType.RANGE },
        { argumentType: FunctionArgumentType.NUMBER, defaultValue: 0, optionalArg: true },
      ],
    },
    UNIQUE: {
      method: "unique",
      sizeOfResultArrayMethod: "uniqueArraySize",
      parameters: [{ argumentType: FunctionArgumentType.RANGE }],
    },
  };

  regexextract(ast: Ast, state: State) {
    return this.runFunction((ast as ProcedureAst).args, state, this.metadata("REGEXEXTRACT"), (text: string, pattern: string) => {
      const regex = safeRegex(pattern);
      if (regex instanceof CellError) return regex;
      const match = regex.exec(text);
      if (!match) return new CellError(ErrorType.NA, "No match found.");
      return match[1] ?? match[0];
    });
  }

  regexmatch(ast: Ast, state: State) {
    return this.runFunction((ast as ProcedureAst).args, state, this.metadata("REGEXMATCH"), (text: string, pattern: string) => {
      const regex = safeRegex(pattern);
      if (regex instanceof CellError) return regex;
      return regex.test(text);
    });
  }

  regexreplace(ast: Ast, state: State) {
    return this.runFunction(
      (ast as ProcedureAst).args,
      state,
      this.metadata("REGEXREPLACE"),
      (text: string, pattern: string, replacement: string) => {
        const regex = safeRegex(pattern);
        if (regex instanceof CellError) return regex;
        return text.replace(new RegExp(regex.source, "g"), replacement);
      },
    );
  }

  textbefore(ast: Ast, state: State) {
    return this.runFunction((ast as ProcedureAst).args, state, this.metadata("TEXTBEFORE"), (text: string, delimiter: string) => {
      const index = text.indexOf(delimiter);
      if (index === -1) return new CellError(ErrorType.NA, "Delimiter not found.");
      return text.slice(0, index);
    });
  }

  textafter(ast: Ast, state: State) {
    return this.runFunction((ast as ProcedureAst).args, state, this.metadata("TEXTAFTER"), (text: string, delimiter: string) => {
      const index = text.indexOf(delimiter);
      if (index === -1) return new CellError(ErrorType.NA, "Delimiter not found.");
      return text.slice(index + delimiter.length);
    });
  }

  rank(ast: Ast, state: State) {
    return this.runFunction(
      (ast as ProcedureAst).args,
      state,
      this.metadata("RANK"),
      (value: number, range: SimpleRangeValue, order: number) => {
        const numbers: number[] = [];
        for (const cell of range.valuesFromTopLeftCorner()) {
          if (typeof cell === "number") numbers.push(cell);
        }
        if (!numbers.includes(value)) return new CellError(ErrorType.NA, "Value not in range.");
        const better = numbers.filter((n) => (order === 0 ? n > value : n < value)).length;
        return better + 1;
      },
    );
  }

  unique(ast: Ast, state: State) {
    return this.runFunction((ast as ProcedureAst).args, state, this.metadata("UNIQUE"), (range: SimpleRangeValue) => {
      // Declared spill size must match exactly, so pad the tail with blanks —
      // visually identical to a real UNIQUE spill.
      const rows = this.uniqueRows(range);
      const width = range.size.width;
      const height = range.size.height;
      while (rows.length < height) rows.push(new Array(width).fill(EmptyValue));
      return SimpleRangeValue.onlyValues(rows);
    });
  }

  uniqueArraySize(ast: Ast, state: State) {
    const value = this.evaluateAst((ast as ProcedureAst).args[0], state);
    if (value instanceof SimpleRangeValue) return value.size;
    return SimpleRangeValue.onlyValues([[EmptyValue]]).size;
  }

  private uniqueRows(range: SimpleRangeValue): SimpleRangeValue["data"] {
    const seen = new Set<string>();
    const out: SimpleRangeValue["data"] = [];
    for (const row of range.data) {
      const key = JSON.stringify(row);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(row);
      }
    }
    return out;
  }
}

const TRANSLATIONS = Object.fromEntries(
  Object.keys(SpreadsheetFormulasPlugin.implementedFunctions).map((name) => [name, name]),
);

let registered = false;
if (!registered) {
  HyperFormula.registerFunctionPlugin(SpreadsheetFormulasPlugin, { enGB: TRANSLATIONS });
  registered = true;
}

/** Functions this pack adds to the engine (used to keep ENGINE_MISSING honest). */
export const EXTENSION_FUNCTIONS = Object.keys(SpreadsheetFormulasPlugin.implementedFunctions);
