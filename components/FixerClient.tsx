"use client";

import Link from "next/link";
import { useState } from "react";
import { checkFormula, type Finding } from "@/lib/formula-check";
import { track } from "@/lib/analytics";
import { FormulaInput } from "./FormulaInput";
import { FormulaBar } from "./FormulaBar";

const SEVERITY_STYLE: Record<Finding["severity"], { badge: string; label: string }> = {
  error: { badge: "bg-rust-tint text-rust", label: "problem" },
  warning: { badge: "bg-gold-tint text-gold", label: "risky" },
  info: { badge: "bg-ledger-tint text-ledger-deep", label: "note" },
};

const EXAMPLE = "=VLOOKUP(A2,Sheet2!A:B,2)";

export function FixerClient() {
  const [input, setInput] = useState("");
  const [findings, setFindings] = useState<Finding[] | null>(null);

  function run(formula: string) {
    setInput(formula);
    const results = checkFormula(formula);
    setFindings(results);
    track("tool_use", { tool: "fixer", findings: String(results.length) });
  }

  const best = findings?.find((f) => f.correctedFormula)?.correctedFormula;

  return (
    <div className="max-w-2xl">
      <FormulaInput
        value={input}
        onChange={(v) => {
          setInput(v);
          setFindings(null);
        }}
        label="Paste your formula"
        placeholder={`${EXAMPLE}   — or paste an error like #N/A`}
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => run(input)}
          disabled={!input.trim()}
          className="rounded-lg bg-ledger px-5 py-2.5 text-[14px] font-semibold text-paper transition-colors hover:bg-ledger-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Check formula
        </button>
        <button
          type="button"
          onClick={() => run(EXAMPLE)}
          className="text-[13px] font-medium text-ink-faint hover:text-ink-soft"
        >
          Try an example
        </button>
      </div>

      {findings !== null ? (
        <div className="mt-8" role="status" aria-live="polite">
          {findings.length === 0 ? (
            <div className="rounded-xl border border-ledger/30 bg-ledger-tint/50 p-6">
              <p className="text-[15px] font-semibold text-ledger-deep">
                ✓ No structural problems found.
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                The syntax checks out — balanced parentheses, straight quotes, known functions. If
                it still returns the wrong <em>result</em>, the issue is usually in the data:
                stray spaces, numbers stored as text, or ranges that don&apos;t line up. The{" "}
                <Link href="/tools/explain-formula" className="font-medium text-ledger-deep underline">
                  explainer
                </Link>{" "}
                can walk you through what each part does.
              </p>
            </div>
          ) : (
            <>
              <h2 className="mb-4 font-display text-[24px] text-ink">
                {findings.length} finding{findings.length === 1 ? "" : "s"}
              </h2>
              <ul className="space-y-3">
                {findings.map((finding, i) => {
                  const style = SEVERITY_STYLE[finding.severity];
                  return (
                    <li key={i} className="rounded-lg border border-rule bg-white p-5 shadow-bar">
                      <span className={`rounded px-1.5 py-0.5 font-mono text-[10.5px] font-medium ${style.badge}`}>
                        {style.label}
                      </span>
                      <p className="mt-2.5 text-[14.5px] font-medium leading-relaxed text-ink">
                        {finding.message}
                      </p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{finding.fix}</p>
                      {finding.link ? (
                        <Link href={finding.link} className="mt-2 inline-block text-[13.5px] font-medium text-ledger-deep hover:underline">
                          Read the full guide →
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              {best ? (
                <div className="mt-6">
                  <FormulaBar formula={best} slug="fixer-correction" label="Suggested correction" />
                </div>
              ) : null}
            </>
          )}
          <p className="mt-6 text-[12.5px] leading-relaxed text-ink-faint">
            These are structural checks — they catch syntax and common traps, not logic errors.
            Always verify the corrected formula against your own data before relying on it.
          </p>
        </div>
      ) : null}
    </div>
  );
}
