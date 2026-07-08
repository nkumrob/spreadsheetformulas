import type { Metadata } from "next";
import { ExplainerClient } from "@/components/ExplainerClient";

export const metadata: Metadata = {
  title: "Formula Explainer — Understand Any Formula",
  description:
    "Paste an Excel or Google Sheets formula you inherited and get a piece-by-piece breakdown: what each function does, which cells are involved, and what to watch for.",
};

export default function ExplainFormulaPage() {
  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <p className="font-mono text-[13px] font-medium tracking-wide text-ledger">=TEXT(formula, "plain english")</p>
        <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">Explain this formula</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Inherited a spreadsheet full of formulas nobody remembers writing? Paste one and get a
          piece-by-piece breakdown from our tested function guide.
        </p>
      </header>
      <div className="mt-10">
        <ExplainerClient />
      </div>
    </div>
  );
}
