import type { Metadata } from "next";
import { WorkbookAnalyzer } from "@/components/WorkbookAnalyzer";

export const metadata: Metadata = {
  title: "Spreadsheet Health Check — Analyze Your Workbook",
  description:
    "Upload an Excel or CSV file and get an instant health report: error cells, stale values, numbers stored as text, and inconsistent formulas. Your file never leaves your browser.",
};

export default function AnalyzeWorkbookPage() {
  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <p className="font-mono text-[13px] font-medium tracking-wide text-ledger">=CHECKUP(your_spreadsheet)</p>
        <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">Spreadsheet health check</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Drop in a workbook and get an instant report: error cells with fix guides, saved values
          that no longer match their formulas, numbers stored as text, formulas that quietly
          differ from the rest of their column — then test new formulas against your real data.
        </p>
      </header>
      <div className="mt-10 pb-4">
        <WorkbookAnalyzer />
      </div>
    </div>
  );
}
