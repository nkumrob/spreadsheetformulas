import type { Metadata } from "next";
import { allFormulas } from "@/lib/content";
import { FormulaCard } from "@/components/FormulaCard";

export const metadata: Metadata = {
  title: "Fix Spreadsheet Errors",
  description:
    "What #N/A, #VALUE!, #REF!, and #DIV/0! actually mean — and how to fix them properly in Excel and Google Sheets instead of just hiding them.",
};

export default function ErrorsIndexPage() {
  const pages = allFormulas.filter((f) => f.kind === "error-fix");

  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <p className="font-mono text-[13px] font-medium tracking-wide text-rust">=IFERROR(panic, read_this)</p>
        <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">Error fixes</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Spreadsheet errors are messages, not mysteries. Each guide explains what the error means,
          the usual causes, and the proper fix — not just an IFERROR to sweep it under the rug.
        </p>
      </header>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page, i) => (
          <FormulaCard key={page.slug} formula={page} index={i} />
        ))}
      </div>
    </div>
  );
}
