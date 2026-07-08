import type { Metadata } from "next";
import Link from "next/link";
import { allFormulas } from "@/lib/content";

export const metadata: Metadata = {
  title: "How We Test Formulas",
  description:
    "Every formula on this site is validated by a real spreadsheet calculation engine against its own sample data — here's exactly how, and what the badges mean.",
};

export default function HowWeTestPage() {
  const total = allFormulas.length;
  const engineVerified = allFormulas.filter((f) => f.verification).length;

  const steps = [
    {
      title: "Structural validation",
      body: "Every page is structured data, not free text. A schema gate checks each one at build time: the formula, both platform versions, sample input, expected output, and cross-links. A page with a missing piece cannot be published — the build fails.",
    },
    {
      title: "Engine execution",
      body: "Each page carries an executable verification block: its sample data and formula are loaded into a real spreadsheet calculation engine (HyperFormula), computed, and compared against pinned expected values — with the clock frozen so date formulas like TODAY() are tested deterministically. A wrong formula, or wrong sample data, fails our test suite before it can ship.",
    },
    {
      title: "The mistakes are tested too",
      body: "Where a page warns about a common mistake — \"blank due dates get flagged as overdue\" — we verify both halves: that the naive formula really does misbehave, and that the guarded version really doesn't.",
    },
    {
      title: "Human review for engine gaps",
      body: "A few functions can't run headlessly (QUERY's SQL dialect, LET, and live-data features like GOOGLEFINANCE). We've extended the engine with our own tested implementations of several others it lacked — UNIQUE, RANK, TEXTBEFORE/TEXTAFTER, and the REGEX family — each covered by its own unit tests. Those pages are marked Human-reviewed: checked by hand in Excel and Google Sheets, with the review date shown on the page.",
    },
    {
      title: "You are the last test",
      body: "Every page has a feedback control. \"This didn't work\" reports are tracked per page, and pages that accumulate them get re-reviewed. If we shipped something wrong, we want to know — and fix it visibly.",
    },
  ];

  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <p className="font-mono text-[13px] font-medium tracking-wide text-ledger">=ASSERT(formula, expected)</p>
        <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">How we test formulas</h1>
        <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
          AI formula generators hand you a formula and hope. Wrong formulas rarely announce
          themselves — they return numbers that look fine. So we don&apos;t ask you to trust us:
          every formula on this site is executed against its own sample data before it can be
          published, and the badge on each page tells you exactly how it was verified.
        </p>
        <p className="mt-4 font-mono text-[13.5px] text-ink-soft">
          Right now: <span className="font-semibold text-ledger-deep">{engineVerified} of {total}</span> pages
          engine-verified; the rest human-reviewed where the engine lacks the function.
        </p>
      </header>

      <ol className="mt-12 max-w-prose space-y-6">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-5 rounded-lg border border-rule bg-white p-6 shadow-bar">
            <span aria-hidden="true" className="font-display text-[28px] leading-none text-ledger">
              {i + 1}
            </span>
            <div>
              <h2 className="text-[16.5px] font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 max-w-prose rounded-lg border border-rule bg-cream/70 p-6">
        <h2 className="text-[15px] font-semibold text-ink">What the badges mean</h2>
        <dl className="mt-4 space-y-3 text-[14px]">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded border border-ledger/30 bg-ledger-tint/60 px-2 py-0.5 font-mono text-[12px] font-medium text-ledger-deep">
                ✓ Engine-verified
              </span>
            </dt>
            <dd className="text-ink-soft">Computed by a spreadsheet engine against the page&apos;s sample data in our test suite, on every build.</dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt className="shrink-0 font-mono text-[12px] text-ink-faint">Human-reviewed</dt>
            <dd className="text-ink-soft">Verified by hand in Excel and Google Sheets — used where the engine doesn&apos;t implement the function.</dd>
          </div>
        </dl>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-faint">
          One honest caveat: the engine is Excel-compatible, not Excel itself. For the rare edge
          where engines disagree, real-spreadsheet checks win — and your{" "}
          <Link href="/formulas" className="font-medium text-ledger-deep hover:underline">
            reports
          </Link>{" "}
          overrule everything.
        </p>
      </div>
    </div>
  );
}
