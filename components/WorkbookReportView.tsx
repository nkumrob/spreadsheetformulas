"use client";

import Link from "next/link";
import { useState } from "react";
import type { FindingKind, ParsedWorkbook, TestResult, WorkbookFinding, WorkbookReport } from "@/lib/workbook-analysis";
import { FormulaInput } from "./FormulaInput";

const GROUPS: { kind: FindingKind; title: string; tone: "rust" | "gold" | "ink" }[] = [
  { kind: "error-cell", title: "Error cells", tone: "rust" },
  { kind: "stale-value", title: "Stored values that don't match their formulas", tone: "gold" },
  { kind: "inconsistent-formula", title: "Formulas that break their column's pattern", tone: "gold" },
  { kind: "number-as-text", title: "Numbers stored as text", tone: "ink" },
  { kind: "extra-spaces", title: "Text with stray spaces", tone: "ink" },
  { kind: "cannot-evaluate", title: "Couldn't be checked by our engine", tone: "ink" },
];

const TONE_STYLES = {
  rust: "bg-rust-tint text-rust",
  gold: "bg-gold-tint text-gold",
  ink: "bg-cream text-ink-soft",
};

const SHOW_LIMIT = 12;

export function WorkbookReportView({
  name,
  workbook,
  report,
  recompute,
  onTestFormula,
}: {
  name: string;
  workbook: ParsedWorkbook;
  report: WorkbookReport;
  recompute: WorkbookFinding[];
  onTestFormula: (wb: ParsedWorkbook, sheet: string, formula: string) => TestResult;
}) {
  const all = [...report.findings, ...recompute];
  const [sheet, setSheet] = useState(workbook.sheets[0].name);
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);

  return (
    <div className="mt-10" aria-live="polite">
      {/* Stats ribbon */}
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-rule pb-4">
        <h2 className="font-display text-[26px] text-ink">{name}</h2>
        <p className="font-mono text-[12.5px] text-ink-faint tabular">
          {report.stats.sheets} sheet{report.stats.sheets === 1 ? "" : "s"} · {report.stats.cells} cells ·{" "}
          {report.stats.formulas} formulas · {all.length} finding{all.length === 1 ? "" : "s"}
        </p>
      </div>

      {all.length === 0 ? (
        <div className="mt-6 rounded-xl border border-ledger/30 bg-ledger-tint/50 p-6">
          <p className="text-[15px] font-semibold text-ledger-deep">✓ No problems found.</p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            No error cells, no stale values, no text-formatted numbers, and every formula matched
            its column&apos;s pattern. Test a new formula against this data below.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {GROUPS.map((group) => {
            const findings = all.filter((f) => f.kind === group.kind);
            if (findings.length === 0) return null;
            return (
              <section key={group.kind} aria-label={group.title}>
                <h3 className="mb-3 flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                  <span className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-medium tabular ${TONE_STYLES[group.tone]}`}>
                    {findings.length}
                  </span>
                  {group.title}
                </h3>
                <ul className="space-y-2">
                  {findings.slice(0, SHOW_LIMIT).map((finding, i) => (
                    <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-rule bg-white px-4 py-2.5 shadow-bar">
                      <code className="shrink-0 rounded bg-cream px-1.5 py-0.5 font-mono text-[11.5px] font-medium text-ink">
                        {finding.sheet}!{finding.cell}
                      </code>
                      <span className="min-w-0 flex-1 break-words text-[13.5px] leading-relaxed text-ink-soft">
                        {finding.detail}
                      </span>
                      {finding.link ? (
                        <Link href={finding.link} className="shrink-0 text-[13px] font-medium text-ledger-deep hover:underline">
                          Fix guide →
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {findings.length > SHOW_LIMIT ? (
                  <p className="mt-2 font-mono text-[12px] text-ink-faint">
                    +{findings.length - SHOW_LIMIT} more in {group.title.toLowerCase()}
                  </p>
                ) : null}
              </section>
            );
          })}
        </div>
      )}

      {/* Formula tester against their data */}
      <section aria-label="Test a formula against this workbook" className="mt-12">
        <h3 className="mb-2 font-display text-[24px] text-ink">Test a formula against this data</h3>
        <p className="mb-4 text-[14px] leading-relaxed text-ink-soft">
          Reference your real cells — e.g. <code className="font-mono text-[13px]">=COUNTIF(C2:C100,&quot;Complete&quot;)</code> —
          and see the computed result instantly.
        </p>
        {workbook.sheets.length > 1 ? (
          <label className="mb-3 flex items-center gap-2 text-[13.5px] text-ink-soft">
            Sheet:
            <select
              value={sheet}
              onChange={(e) => {
                setSheet(e.target.value);
                setResult(null);
              }}
              className="rounded-md border border-rule bg-white px-2.5 py-1.5 text-[13.5px] text-ink shadow-bar"
            >
              {workbook.sheets.map((s) => (
                <option key={s.name}>{s.name}</option>
              ))}
            </select>
          </label>
        ) : null}
        <FormulaInput
          value={formula}
          onChange={(v) => {
            setFormula(v);
            setResult(null);
          }}
          label="Your formula"
          placeholder='=COUNTIF(C2:C100,"Complete")'
        />
        <button
          type="button"
          onClick={() => setResult(onTestFormula(workbook, sheet, formula))}
          disabled={!formula.trim()}
          className="mt-4 rounded-lg bg-ledger px-5 py-2.5 text-[14px] font-semibold text-paper transition-colors hover:bg-ledger-deep disabled:opacity-40"
        >
          Run it
        </button>
        {result !== null ? (
          <div role="status" className="mt-5">
            {result.ok ? (
              <div className="flex items-center gap-3 rounded-lg border border-ledger/30 bg-ledger-tint/50 px-4 py-3">
                <span className="font-display text-lg italic leading-none text-ledger" aria-hidden="true">=</span>
                <code className="font-mono text-[16px] font-semibold text-ledger-deep">
                  {result.value === null || result.value === "" ? "(blank)" : String(result.value)}
                </code>
              </div>
            ) : (
              <div className="rounded-lg border border-rust/30 bg-rust-tint/60 px-4 py-3">
                <code className="font-mono text-[14.5px] font-semibold text-rust">{result.error}</code>
                <p className="mt-1.5 text-[13px] text-ink-soft">
                  Stuck? Run it through the{" "}
                  <Link href="/tools/fix-formula" className="font-medium text-ledger-deep hover:underline">
                    Formula Fixer
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        ) : null}
      </section>

      <p className="mt-10 text-[12.5px] leading-relaxed text-ink-faint">
        Checks run in an Excel-compatible engine in your browser. A clean report means no
        structural problems were found — always sanity-check results against numbers you know.
        Cells marked &quot;couldn&apos;t be checked&quot; use functions the engine doesn&apos;t support; they are not necessarily wrong.
      </p>
    </div>
  );
}
