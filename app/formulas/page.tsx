import type { Metadata } from "next";
import { allFormulas } from "@/lib/content";
import { FormulaCard } from "@/components/FormulaCard";

export const metadata: Metadata = {
  title: "All Formulas",
  description:
    "Browse every tested Excel and Google Sheets formula — lookups, dates, counting, text cleanup, and more, each with examples and plain-English explanations.",
};

export default function FormulasIndexPage() {
  const formulas = allFormulas.filter((f) => f.kind === "formula");

  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <p className="font-mono text-[13px] font-medium tracking-wide text-ledger">=COUNTA(formulas) → {formulas.length}</p>
        <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">All formulas</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Every formula is tested with sample data in both Excel and Google Sheets before it&apos;s published.
        </p>
      </header>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formulas.map((formula, i) => (
          <FormulaCard key={formula.slug} formula={formula} index={i} />
        ))}
      </div>
    </div>
  );
}
