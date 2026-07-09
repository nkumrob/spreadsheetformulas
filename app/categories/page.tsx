import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { formulasByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Formula Categories",
  description:
    "Browse Excel and Google Sheets formulas by the problem you're solving: lookups, dates, counting, text cleanup, error fixes, HR, finance, and more.",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <h1 className="font-display text-[44px] leading-tight text-ink">Browse by problem</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Formulas are organized by what you&apos;re trying to do, not by function name — because
          nobody searches for &quot;SUMPRODUCT,&quot; they search for &quot;total by region.&quot;
        </p>
      </header>
      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2">
        {CATEGORIES.map((category) => {
          const count = formulasByCategory(category.slug).length;
          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex items-start gap-4 bg-white p-6 transition-colors hover:bg-ledger-tint/40"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 rounded border border-rule bg-cream px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink-faint group-hover:border-ledger/40 group-hover:text-ledger-deep"
              >
                {category.cell}
              </span>
              <span>
                <span className="block text-[17px] font-semibold text-ink group-hover:text-ledger-deep">
                  {category.name}
                </span>
                <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-soft">{category.blurb}</span>
                <span className="mt-2.5 block font-mono text-[11.5px] text-ink-faint">
                  {count > 0 ? `${count} formula${count === 1 ? "" : "s"}` : "coming soon"}
                </span>
              </span>
            </Link>
          );
        })}
        {/* Complete the mosaic's last row so no bare background shows through. */}
        {Array.from({ length: (2 - (CATEGORIES.length % 2)) % 2 }).map((_, i) => (
          <div key={`filler-${i}`} className="hidden items-center justify-center bg-white p-6 sm:flex">
            <Link href="/search" className="font-mono text-[12.5px] text-ink-faint transition-colors hover:text-ledger-deep">
              =SEARCH(everything) →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
