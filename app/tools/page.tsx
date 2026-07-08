import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Spreadsheet Tools",
  description:
    "Free tools for Excel and Google Sheets: check a broken formula, get a plain-English explanation, and join the waitlist for AI-powered formula generation.",
};

const TOOLS = [
  {
    href: "/tools/fix-formula",
    mark: "=FIX()",
    name: "Formula Fixer",
    blurb:
      "Paste a broken formula. Deterministic checks catch smart quotes, unbalanced parentheses, missing exact-match arguments, and locale separators — with a corrected formula to copy.",
    live: true,
  },
  {
    href: "/tools/explain-formula",
    mark: "=EXPLAIN()",
    name: "Formula Explainer",
    blurb:
      "Inherited a mystery formula? Get a piece-by-piece breakdown: what each function does, which cells it touches, and what to watch out for.",
    live: true,
  },
  {
    href: "/tools/analyze-workbook",
    mark: "=CHECKUP()",
    name: "Spreadsheet Health Check",
    blurb:
      "Upload a workbook for an instant report: error cells, stale values, numbers stored as text, inconsistent formulas — then test formulas against your real data. The file never leaves your browser.",
    live: true,
  },
  {
    href: "/tools/convert-formula",
    mark: "=CONVERT()",
    name: "Excel ↔ Sheets Converter",
    blurb:
      "Moving between platforms? Get the equivalent formula — direct renames, structural rewrites, version warnings, and honest dead-ends instead of guesses.",
    live: true,
  },
  {
    href: "/tools/ai",
    mark: "=AI()",
    name: "AI Formula Generator",
    blurb:
      "Describe your problem in plain English, get a working formula with assumptions and sample data. In development — every output tested against our formula library.",
    live: false,
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <h1 className="font-display text-[44px] leading-tight text-ink">Tools</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Free, no sign-up. Built on real parsing and a tested function guide — the same trust
          standard as our formula pages.
        </p>
      </header>
      <div className="mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col rounded-lg border border-rule bg-white p-6 shadow-bar transition-all hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <code className="font-mono text-[13px] font-medium text-ledger">{tool.mark}</code>
              {!tool.live ? (
                <span className="rounded bg-gold-tint px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-gold">
                  waitlist
                </span>
              ) : null}
            </div>
            <h2 className="mt-3 text-[17px] font-semibold text-ink group-hover:text-ledger-deep">{tool.name}</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{tool.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
