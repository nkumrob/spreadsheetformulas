"use client";

import { track } from "@/lib/analytics";

export function TemplateDownload({ file, slug }: { file: string; slug: string }) {
  return (
    <div>
      <a
        href={file}
        download
        onClick={() => track("template_download", { template: slug })}
        className="inline-flex items-center gap-2.5 rounded-lg bg-ledger px-5 py-3 text-[14.5px] font-semibold text-paper shadow-bar transition-colors hover:bg-ledger-deep"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1v9m0 0L4.5 6.5M8 10l3.5-3.5M2 13.5h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Download for Excel (.xlsx)
      </a>
      <p className="mt-2.5 text-[12.5px] text-ink-faint">
        Free, no sign-up. For Google Sheets: upload via File → Import — all formulas carry over.
      </p>
    </div>
  );
}
