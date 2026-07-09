import type { Metadata } from "next";
import { WorkbookAnalyzer } from "@/components/WorkbookAnalyzer";

export const metadata: Metadata = {
  title: "Open & Repair Excel Files Online Free — Nothing Uploaded",
  description:
    "Upload an Excel or CSV file and it opens right in your browser: edit cells, fix formulas, watch everything recompute live, and download the repaired file. Nothing is uploaded to a server.",
};

export default function AnalyzeWorkbookPage() {
  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <p className="font-mono text-[13px] font-medium tracking-wide text-ledger">=OPEN(your_spreadsheet)</p>
        <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">Open &amp; fix your spreadsheet</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Your file opens here as a live, editable grid. Problem cells are highlighted — errors,
          stale values, numbers stored as text, formulas that break their column&apos;s pattern.
          Click any cell to inspect its formula, edit it, watch dependents recompute instantly,
          and download the repaired .xlsx when you&apos;re done.
        </p>
      </header>
      <div className="mt-10 pb-4">
        <WorkbookAnalyzer />
      </div>
    </div>
  );
}
