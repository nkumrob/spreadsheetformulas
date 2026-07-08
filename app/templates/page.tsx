import type { Metadata } from "next";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Free Spreadsheet Templates",
  description:
    "Free Excel and Google Sheets templates with working formulas built in: sales pipelines, budgets, invoices, project tasks, and job applications.",
};

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <p className="font-mono text-[13px] font-medium tracking-wide text-ledger">=DOWNLOAD(tracker, ready_to_use)</p>
        <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">Templates</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Working spreadsheets, not blank grids — every template ships with tested formulas,
          sample data, and a summary block. Download, replace the sample rows, done.
        </p>
      </header>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((template) => (
          <Link
            key={template.slug}
            href={`/templates/${template.slug}`}
            className="group flex flex-col rounded-lg border border-rule bg-white p-6 shadow-bar transition-all hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-lift"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-ledger-tint">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="#166B4A" strokeWidth="1.6" />
                <path d="M1.5 6h13M6 1.5v13" stroke="#166B4A" strokeWidth="1.6" />
              </svg>
            </div>
            <h2 className="text-[16.5px] font-semibold leading-snug text-ink group-hover:text-ledger-deep">
              {template.name}
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{template.description}</p>
            <span className="mt-auto pt-4 text-[13px] font-medium text-ledger-deep">
              Preview &amp; download →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
