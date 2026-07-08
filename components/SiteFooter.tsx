import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-paper">
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-page px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl leading-snug">
              Every formula <em className="text-ledger-bright">tested</em> before it&apos;s published.
            </p>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-paper/60">
              Plain-English explanations, real sample data, and both Excel and Google Sheets versions —
              so you can copy with confidence.
            </p>
            <div className="mt-6">
              <NewsletterForm variant="dark" />
            </div>
          </div>
          <nav aria-label="Categories">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/40">
              Popular categories
            </h2>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-[14px] text-paper/75 transition-colors hover:text-paper"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Site">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/40">Site</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/formulas" className="text-[14px] text-paper/75 hover:text-paper">All formulas</Link></li>
              <li><Link href="/errors" className="text-[14px] text-paper/75 hover:text-paper">Error fixes</Link></li>
              <li><Link href="/categories" className="text-[14px] text-paper/75 hover:text-paper">Categories</Link></li>
              <li><Link href="/search" className="text-[14px] text-paper/75 hover:text-paper">Search</Link></li>
            </ul>
          </nav>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <p className="font-mono text-[12px] text-paper/40">
            =TEXT(TODAY(),&quot;yyyy&quot;) → {new Date().getFullYear()} Spreadsheet Formulas
          </p>
          <p className="text-[12px] text-paper/40">
            Verify formulas against your own data before using them in important work.
          </p>
        </div>
      </div>
    </footer>
  );
}
