import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { allFormulas, formulasByCategory, recentFormulas } from "@/lib/content";
import { formulaPath } from "@/lib/paths";
import { FormulaCard } from "@/components/FormulaCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { HeroSearch } from "@/components/HeroSearch";
import { TEMPLATES } from "@/lib/templates";

const POPULAR_PROBLEMS = [
  "compare two columns",
  "fix #N/A",
  "count overdue tasks",
  "split full name",
  "completion percentage",
  "remove extra spaces",
];

export default function HomePage() {
  const errorPages = allFormulas.filter((f) => f.kind === "error-fix").slice(0, 4);
  const featured = recentFormulas(6).filter((f) => f.kind === "formula");
  const categoriesWithContent = CATEGORIES.filter((c) => formulasByCategory(c.slug).length > 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule">
        <div className="bg-grid grid-fade absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-page px-5 pb-20 pt-20 sm:pt-28">
          <p className="reveal font-mono text-[13px] font-medium tracking-wide text-ledger">
            =SOLVE(problem, faster)
          </p>
          <h1
            className="reveal mt-5 max-w-3xl font-display text-[52px] leading-[1.02] text-ink sm:text-[76px]"
            style={{ animationDelay: "80ms" }}
          >
            Solve spreadsheet problems, <em className="text-ledger">faster.</em>
          </h1>
          <p
            className="reveal mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft"
            style={{ animationDelay: "160ms" }}
          >
            Find, fix, and understand Excel and Google Sheets formulas for real work — every one
            tested with sample data and explained in plain English.
          </p>
          <div className="reveal mt-9 max-w-xl" style={{ animationDelay: "240ms" }}>
            <HeroSearch />
          </div>
          <div className="reveal mt-5 flex flex-wrap items-center gap-4" style={{ animationDelay: "300ms" }}>
            <Link
              href="/tools/fix-formula"
              className="text-[14px] font-semibold text-ink underline decoration-rust decoration-2 underline-offset-4 transition-colors hover:text-rust"
            >
              Fix my formula
            </Link>
            <Link
              href="/tools/explain-formula"
              className="text-[14px] font-semibold text-ink underline decoration-ledger decoration-2 underline-offset-4 transition-colors hover:text-ledger-deep"
            >
              Explain a formula
            </Link>
            <Link
              href="/templates"
              className="text-[14px] font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-gold"
            >
              Get a template
            </Link>
          </div>
          <div className="reveal mt-6 flex flex-wrap items-center gap-2" style={{ animationDelay: "320ms" }}>
            <span className="text-[12.5px] text-ink-faint">Try:</span>
            {POPULAR_PROBLEMS.map((problem) => (
              <Link
                key={problem}
                href={`/search?q=${encodeURIComponent(problem)}`}
                className="rounded-full border border-rule bg-white px-3 py-1 text-[12.5px] text-ink-soft shadow-bar transition-colors hover:border-ledger hover:text-ledger-deep"
              >
                {problem}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section aria-label="Why trust these formulas" className="border-b border-rule bg-cream/60">
        <div className="mx-auto grid max-w-page gap-6 px-5 py-8 sm:grid-cols-3">
          {[
            ["Tested, not generated", "Every formula is executed against real sample data before publishing."],
            ["Plain English", "Each argument explained — no jargon walls, no guesswork."],
            ["Both platforms", "Excel and Google Sheets versions, with the differences called out."],
          ].map(([title, body]) => (
            <div key={title} className="flex gap-3">
              <span aria-hidden="true" className="mt-1 font-mono text-[13px] font-bold text-ledger">✓</span>
              <div>
                <h2 className="text-[14.5px] font-semibold text-ink">{title}</h2>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-page px-5 pb-7">
          <Link href="/how-we-test" className="text-[13px] font-medium text-ledger-deep hover:underline">
            Read exactly how we test →
          </Link>
        </div>
      </section>

      {/* Featured formulas */}
      <section aria-labelledby="featured" className="mx-auto max-w-page px-5 pt-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <h2 id="featured" className="font-display text-[32px] text-ink">
            Start with the <em className="text-ledger">workhorses</em>
          </h2>
          <Link href="/formulas" className="whitespace-nowrap text-[14px] font-medium text-ledger-deep hover:underline">
            All formulas →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((formula, i) => (
            <FormulaCard key={formula.slug} formula={formula} index={i} />
          ))}
        </div>
      </section>

      {/* Error fixes */}
      <section aria-labelledby="errors" className="mx-auto max-w-page px-5 pt-16">
        <div className="rounded-xl border border-rule bg-white p-7 shadow-bar sm:p-9">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="errors" className="font-display text-[30px] text-ink">
                Staring at an <em className="text-rust">#ERROR!</em> right now?
              </h2>
              <p className="mt-2 text-[14.5px] text-ink-soft">
                What each error actually means, and the fix — not just a formula to hide it.
              </p>
            </div>
            <Link href="/errors" className="whitespace-nowrap text-[14px] font-medium text-ledger-deep hover:underline">
              All error fixes →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {errorPages.map((page) => (
              <Link
                key={page.slug}
                href={formulaPath(page)}
                className="group rounded-lg border border-rule bg-paper p-4 transition-all hover:-translate-y-0.5 hover:border-rust/50 hover:shadow-lift"
              >
                <code className="font-mono text-[15px] font-semibold text-rust">
                  {page.title.replace("Fix the ", "").replace(" Error", "")}
                </code>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section aria-labelledby="templates" className="mx-auto max-w-page px-5 pt-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 id="templates" className="font-display text-[32px] text-ink">
              Skip the blank grid
            </h2>
            <p className="mt-2 text-[14.5px] text-ink-soft">
              Trackers with the formulas already wired in — download, replace the sample rows, done.
            </p>
          </div>
          <Link href="/templates" className="whitespace-nowrap text-[14px] font-medium text-ledger-deep hover:underline">
            All templates →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {TEMPLATES.slice(0, 3).map((template) => (
            <Link
              key={template.slug}
              href={`/templates/${template.slug}`}
              className="group flex flex-col rounded-lg border border-rule bg-white p-6 shadow-bar transition-all hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-lift"
            >
              <h3 className="text-[16px] font-semibold leading-snug text-ink group-hover:text-ledger-deep">
                {template.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-ink-soft">
                {template.description}
              </p>
              <span className="mt-auto pt-4 font-mono text-[12px] text-ink-faint">.xlsx · free</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section aria-labelledby="categories" className="mx-auto max-w-page px-5 pt-16">
        <h2 id="categories" className="mb-7 font-display text-[32px] text-ink">
          Browse by problem
        </h2>
        <div className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const count = formulasByCategory(category.slug).length;
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group flex items-start gap-4 bg-white p-5 transition-colors hover:bg-ledger-tint/40"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 rounded border border-rule bg-cream px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink-faint group-hover:border-ledger/40 group-hover:text-ledger-deep"
                >
                  {category.cell}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-ink group-hover:text-ledger-deep">
                    {category.name}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                    {category.blurb}
                  </span>
                  <span className="mt-2 block font-mono text-[11.5px] text-ink-faint">
                    {count > 0 ? `${count} formula${count === 1 ? "" : "s"}` : "coming soon"}
                  </span>
                </span>
              </Link>
            );
          })}
          {/* Complete the mosaic's last row so no bare background shows through. */}
          {Array.from({ length: (3 - (CATEGORIES.length % 3)) % 3 }).map((_, i) => (
            <div key={`lg-filler-${i}`} className="hidden items-center justify-center bg-white p-5 lg:flex">
              {i === 0 ? (
                <Link href="/search" className="font-mono text-[12.5px] text-ink-faint transition-colors hover:text-ledger-deep">
                  =SEARCH(everything) →
                </Link>
              ) : null}
            </div>
          ))}
          {Array.from({ length: (2 - (CATEGORIES.length % 2)) % 2 }).map((_, i) => (
            <div key={`sm-filler-${i}`} className="hidden bg-white p-5 sm:block lg:hidden" />
          ))}
        </div>
        <p className="mt-4 font-mono text-[12px] text-ink-faint">
          {categoriesWithContent.length} of {CATEGORIES.length} categories live · new formulas added weekly
        </p>
      </section>

      {/* Newsletter */}
      <section aria-labelledby="newsletter" className="mx-auto max-w-page px-5 pt-20">
        <div className="rule-t rule-total flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="newsletter" className="font-display text-[30px] text-ink">
              One useful formula in your inbox.
            </h2>
            <p className="mt-2 text-[14.5px] text-ink-soft">
              Tested formulas, templates, and fixes — about twice a month. No filler.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
