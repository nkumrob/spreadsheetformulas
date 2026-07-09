"use client";

import Link from "next/link";
import { useState } from "react";
import { explainFormula, type Explanation } from "@/lib/formula-explain";
import { checkFormula, type Finding } from "@/lib/formula-check";
import { track } from "@/lib/analytics";
import { FormulaInput } from "./FormulaInput";

const EXAMPLE = '=IFERROR(INDEX($B$2:$B$100,MATCH(E2,$A$2:$A$100,0)),"")';

type Result = { explanation: Explanation | null; findings: Finding[] } | null;

export function ExplainerClient() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result>(null);

  function run(formula: string) {
    setInput(formula);
    setResult({ explanation: explainFormula(formula), findings: checkFormula(formula) });
    track("tool_use", { tool: "explainer" });
  }

  return (
    <div className="max-w-2xl">
      <FormulaInput
        value={input}
        onChange={(v) => {
          setInput(v);
          setResult(null);
        }}
        label="Paste the formula you inherited"
        placeholder={EXAMPLE}
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => run(input)}
          disabled={!input.trim()}
          className="rounded-lg bg-ledger px-5 py-2.5 text-[14px] font-semibold text-paper transition-colors hover:bg-ledger-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Explain formula
        </button>
        <button type="button" onClick={() => run(EXAMPLE)} className="text-[13px] font-medium text-ink-faint hover:text-ink-soft">
          Try an example
        </button>
      </div>

      {result !== null ? (
        <div className="mt-8 space-y-8" role="status" aria-live="polite">
          {result.explanation === null ? (
            <div className="rounded-xl border border-rule bg-cream/60 p-6">
              <p className="text-[15px] font-medium text-ink">
                That doesn&apos;t look like a formula — formulas start with <code className="font-mono">=</code>.
              </p>
              <p className="mt-2 text-[14px] text-ink-soft">
                Paste the whole cell contents, including the equals sign.
              </p>
            </div>
          ) : (
            <>
              {result.explanation.outer ? (
                <section>
                  <h2 className="mb-3 font-display text-[24px] text-ink">Piece by piece</h2>
                  <p className="mb-4 text-[14.5px] leading-relaxed text-ink-soft">
                    The outermost function is{" "}
                    <code className="rounded bg-ledger-tint px-1.5 py-0.5 font-mono text-[13px] font-medium text-ledger-deep">
                      {result.explanation.outer.name}
                    </code>{" "}
                    — {result.explanation.outer.what}
                  </p>
                  <dl className="overflow-hidden rounded-lg border border-rule bg-white shadow-bar">
                    {result.explanation.outer.args.map((arg, i) => (
                      <div
                        key={i}
                        className={`grid gap-1 px-5 py-3.5 sm:grid-cols-[minmax(160px,42%)_1fr] sm:gap-5 ${i > 0 ? "border-t border-rule" : ""}`}
                      >
                        <dt className="break-all font-mono text-[13px] font-medium text-ledger-deep">{arg.value}</dt>
                        <dd className="text-[14px] leading-relaxed text-ink-soft">{arg.hint}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}

              {result.explanation.functions.length > 0 ? (
                <section>
                  <h2 className="mb-3 font-display text-[24px] text-ink">Functions involved</h2>
                  <ul className="space-y-2.5">
                    {result.explanation.functions.map((fn) => (
                      <li key={fn.name} className="flex gap-3 text-[14.5px] leading-relaxed">
                        <code className="mt-0.5 h-fit shrink-0 rounded bg-cream px-1.5 py-0.5 font-mono text-[12.5px] font-medium text-ink">
                          {fn.name}
                        </code>
                        <span className="text-ink-soft">{fn.what}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {result.explanation.references.length > 0 ? (
                <section>
                  <h2 className="mb-3 font-display text-[24px] text-ink">Cells involved</h2>
                  <div className="flex flex-wrap gap-2">
                    {result.explanation.references.map((ref) => (
                      <code key={ref} className="rounded border border-rule bg-white px-2 py-1 font-mono text-[12.5px] text-ink-soft shadow-bar">
                        {ref}
                      </code>
                    ))}
                  </div>
                  <p className="mt-2.5 text-[12.5px] text-ink-faint">
                    $ signs lock a reference so it doesn&apos;t shift when the formula is copied.
                  </p>
                </section>
              ) : null}

              {result.explanation.notes.length > 0 || result.findings.length > 0 ? (
                <section>
                  <h2 className="mb-3 font-display text-[24px] text-ink">Worth knowing</h2>
                  <ul className="space-y-2.5">
                    {result.explanation.notes.map((note, i) => (
                      <li key={`n${i}`} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-soft">
                        <span aria-hidden="true" className="mt-0.5 font-mono text-[12px] text-gold">→</span>
                        {note}
                      </li>
                    ))}
                    {result.findings.map((finding, i) => (
                      <li key={`f${i}`} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-soft">
                        <span aria-hidden="true" className="mt-0.5 font-mono text-[12px] text-rust">!</span>
                        <span>
                          {finding.message}{" "}
                          {finding.link ? (
                            <Link href={finding.link} className="font-medium text-ledger-deep hover:underline">
                              Guide →
                            </Link>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <p className="text-[12.5px] leading-relaxed text-ink-faint">
                This is a structural explanation from our function guide — it describes what the
                pieces do, not whether the logic fits your data. To see it run against real
                numbers,{" "}
                <Link href="/tools/analyze-workbook" className="font-medium text-ledger-deep hover:underline">
                  open your spreadsheet
                </Link>
                .
              </p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
