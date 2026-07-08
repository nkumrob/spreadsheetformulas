import type { Metadata } from "next";
import { ConverterClient } from "@/components/ConverterClient";

export const metadata: Metadata = {
  title: "Excel ↔ Google Sheets Formula Converter",
  description:
    "Convert formulas between Excel and Google Sheets: direct renames like TEXTSPLIT↔SPLIT, structural rewrites, version warnings, and honest guidance where no equivalent exists.",
};

export default function ConvertFormulaPage() {
  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <p className="font-mono text-[13px] font-medium tracking-wide text-ledger">=CONVERT(formula, platform)</p>
        <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">Excel ↔ Sheets converter</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Moving a workbook between platforms? Paste a formula and get the equivalent — renames
          like TEXTSPLIT↔SPLIT, rewrites like COUNTUNIQUE→ROWS(UNIQUE()), version requirements
          flagged, and a straight answer when no equivalent exists instead of a guess.
        </p>
      </header>
      <div className="mt-10 pb-4">
        <ConverterClient />
      </div>
    </div>
  );
}
