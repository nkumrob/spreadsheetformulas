"use client";

import { useEffect, useState } from "react";
import { FormulaBar } from "./FormulaBar";

type Platform = "excel" | "sheets";
const STORAGE_KEY = "sf-platform";

/**
 * Excel / Google Sheets variant switcher (ticket SF-013). Persists the
 * visitor's platform preference across pages via localStorage.
 */
export function PlatformTabs({
  excelFormula,
  sheetsFormula,
  slug,
}: {
  excelFormula: string;
  sheetsFormula: string | null;
  slug: string;
}) {
  const [platform, setPlatform] = useState<Platform>("excel");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "sheets" || saved === "excel") setPlatform(saved);
  }, []);

  if (sheetsFormula === null) {
    return (
      <div>
        <FormulaBar formula={excelFormula} slug={slug} />
        <p className="mt-2.5 flex items-center gap-2 text-[13px] text-ink-faint">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ledger" aria-hidden="true" />
          This formula works in both Excel and Google Sheets.
        </p>
      </div>
    );
  }

  function choose(next: Platform) {
    setPlatform(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <div>
      <div role="tablist" aria-label="Spreadsheet platform" className="mb-3 inline-flex rounded-md border border-rule bg-cream p-0.5">
        {(["excel", "sheets"] as const).map((option) => (
          <button
            key={option}
            role="tab"
            aria-selected={platform === option}
            onClick={() => choose(option)}
            className={`rounded-[5px] px-3.5 py-1 text-[13px] font-medium transition-colors ${
              platform === option ? "bg-white text-ink shadow-bar" : "text-ink-faint hover:text-ink-soft"
            }`}
          >
            {option === "excel" ? "Excel" : "Google Sheets"}
          </button>
        ))}
      </div>
      <FormulaBar formula={platform === "excel" ? excelFormula : sheetsFormula} slug={slug} />
    </div>
  );
}
