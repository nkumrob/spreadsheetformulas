import type { Metadata } from "next";
import { FixerClient } from "@/components/FixerClient";

export const metadata: Metadata = {
  title: "Formula Fixer — Check a Broken Formula",
  description:
    "Paste a broken Excel or Google Sheets formula and get instant checks for smart quotes, unbalanced parentheses, missing VLOOKUP arguments, and more.",
};

export default function FixFormulaPage() {
  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <p className="font-mono text-[13px] font-medium tracking-wide text-rust">=IFERROR(formula, fix_it)</p>
        <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">Fix my formula</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Paste a formula that errors or misbehaves. We run deterministic checks — real parsing,
          not AI guessing — for the mistakes that cause most broken formulas.
        </p>
      </header>
      <div className="mt-10">
        <FixerClient />
      </div>
    </div>
  );
}
