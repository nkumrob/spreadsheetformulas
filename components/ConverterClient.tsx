"use client";

import { useState } from "react";
import { convertFormula, detectPlatform, type ConversionResult, type Platform } from "@/lib/formula-convert";
import { track } from "@/lib/analytics";
import { FormulaInput } from "./FormulaInput";
import { FormulaBar } from "./FormulaBar";

const EXAMPLE = '=TEXTSPLIT(A2,",")';

export function ConverterClient() {
  const [input, setInput] = useState("");
  const [target, setTarget] = useState<Platform>("sheets");
  const [result, setResult] = useState<ConversionResult | null>(null);

  function run(formula: string, to: Platform) {
    setInput(formula);
    setTarget(to);
    setResult(convertFormula(formula, to));
    track("tool_use", { tool: "converter", target: to });
  }

  const source = detectPlatform(input);
  const suggestion: Platform | null =
    source === "sheets" && target === "sheets" ? "excel" : source === "excel" && target === "excel" ? "sheets" : null;

  return (
    <div className="max-w-2xl">
      <FormulaInput
        value={input}
        onChange={(v) => {
          setInput(v);
          setResult(null);
        }}
        label="Paste the formula to convert"
        placeholder={EXAMPLE}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div role="radiogroup" aria-label="Convert to" className="inline-flex rounded-md border border-rule bg-cream p-0.5">
          {(["excel", "sheets"] as const).map((option) => (
            <button
              key={option}
              role="radio"
              aria-checked={target === option}
              onClick={() => {
                setTarget(option);
                setResult(null);
              }}
              className={`rounded-[5px] px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                target === option ? "bg-white text-ink shadow-bar" : "text-ink-faint hover:text-ink-soft"
              }`}
            >
              → {option === "excel" ? "Excel" : "Google Sheets"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => run(input, target)}
          disabled={!input.trim()}
          className="rounded-lg bg-ledger px-5 py-2.5 text-[14px] font-semibold text-paper transition-colors hover:bg-ledger-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Convert
        </button>
        <button type="button" onClick={() => run(EXAMPLE, "sheets")} className="text-[13px] font-medium text-ink-faint hover:text-ink-soft">
          Try an example
        </button>
      </div>
      {suggestion ? (
        <p className="mt-2 text-[12.5px] text-ink-faint">
          This looks like a {source === "sheets" ? "Google Sheets" : "Excel"} formula — did you mean{" "}
          <button type="button" onClick={() => run(input, suggestion)} className="font-medium text-ledger-deep hover:underline">
            convert to {suggestion === "excel" ? "Excel" : "Google Sheets"}
          </button>
          ?
        </p>
      ) : null}

      {result !== null ? (
        <div className="mt-8 space-y-5" role="status" aria-live="polite">
          {result.formula ? (
            <FormulaBar
              formula={result.formula}
              slug="converter-output"
              label={`${target === "excel" ? "Excel" : "Google Sheets"} version`}
            />
          ) : null}
          {result.changes.length > 0 ? (
            <ul className="space-y-1.5">
              {result.changes.map((change, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-soft">
                  <span aria-hidden="true" className="mt-0.5 font-mono text-[12px] font-bold text-ledger">→</span>
                  {change}
                </li>
              ))}
            </ul>
          ) : null}
          {result.warnings.map((warning, i) => (
            <div key={i} className="rounded-lg border border-gold/40 bg-gold-tint/60 px-4 py-3 text-[14px] leading-relaxed text-ink-soft">
              {warning}
            </div>
          ))}
          {result.notes.map((note, i) => (
            <p key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-faint">
              <span aria-hidden="true" className="mt-0.5 font-mono text-[11px]">ℹ</span>
              {note}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
