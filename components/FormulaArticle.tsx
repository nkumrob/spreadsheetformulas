import Link from "next/link";
import type { Formula } from "@/lib/schema";
import { getCategory } from "@/lib/categories";
import { relatedFormulas } from "@/lib/content";
import { formulaPath } from "@/lib/paths";
import { FormulaBar } from "./FormulaBar";
import { PlatformTabs } from "./PlatformTabs";
import { SpreadsheetTable } from "./SpreadsheetTable";
import { FeedbackWidget } from "./FeedbackWidget";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-12 flex items-baseline gap-3 font-display text-[26px] text-ink">
      {children}
      <span className="h-px flex-1 translate-y-[-6px] bg-rule" aria-hidden="true" />
    </h2>
  );
}

export function FormulaArticle({ formula }: { formula: Formula }) {
  const category = getCategory(formula.category);
  const related = relatedFormulas(formula);
  const isError = formula.kind === "error-fix";

  return (
    <article className="mx-auto max-w-page px-5 pb-10 pt-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="reveal mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[12px] text-ink-faint">
          <li><Link href="/" className="hover:text-ink-soft">Home</Link></li>
          <li aria-hidden="true">/</li>
          {category ? (
            <>
              <li>
                <Link href={`/categories/${category.slug}`} className="hover:text-ink-soft">
                  {category.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
            </>
          ) : null}
          <li aria-current="page" className="text-ink-soft">{formula.title}</li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 max-w-prose">
          {/* Header — the answer lives above the fold */}
          <header className="reveal" style={{ animationDelay: "60ms" }}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded px-2 py-0.5 font-mono text-[11px] font-medium ${
                  isError ? "bg-rust-tint text-rust" : "bg-ledger-tint text-ledger-deep"
                }`}
              >
                {isError ? "error fix" : formula.difficulty}
              </span>
              {formula.functions.map((fn) => (
                <span key={fn} className="rounded border border-rule bg-white px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                  {fn}
                </span>
              ))}
            </div>
            <h1 className="font-display text-[40px] leading-[1.08] text-ink sm:text-[48px]">
              {formula.title}
            </h1>
            <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">{formula.problem}</p>
          </header>

          <div className="reveal mt-8" style={{ animationDelay: "140ms" }}>
            <FormulaBar formula={formula.quickFormula} slug={formula.slug} label="Quick formula" />
          </div>

          {/* Example */}
          {formula.sampleInput || formula.sampleOutput ? (
            <section aria-label="Example" className="reveal mt-10" style={{ animationDelay: "220ms" }}>
              <div className="grid gap-5 sm:grid-cols-2">
                {formula.sampleInput ? <SpreadsheetTable table={formula.sampleInput} caption="Sample input" /> : null}
                {formula.sampleOutput ? <SpreadsheetTable table={formula.sampleOutput} caption="Result" /> : null}
              </div>
            </section>
          ) : null}

          <section aria-labelledby="platforms">
            <SectionHeading><span id="platforms">Excel &amp; Google Sheets</span></SectionHeading>
            <PlatformTabs
              excelFormula={formula.excelFormula}
              sheetsFormula={formula.sheetsFormula}
              slug={formula.slug}
            />
          </section>

          <section aria-labelledby="how-it-works">
            <SectionHeading><span id="how-it-works">How it works</span></SectionHeading>
            <p className="text-[15.5px] leading-[1.75] text-ink-soft">{formula.explanation}</p>
            <dl className="mt-6 overflow-hidden rounded-lg border border-rule bg-white shadow-bar">
              {formula.steps.map((step, i) => (
                <div key={i} className={`grid gap-1 px-5 py-3.5 sm:grid-cols-[minmax(150px,38%)_1fr] sm:gap-5 ${i > 0 ? "border-t border-rule" : ""}`}>
                  <dt className="font-mono text-[13.5px] font-medium text-ledger-deep">{step.part}</dt>
                  <dd className="text-[14px] leading-relaxed text-ink-soft">{step.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="when-to-use">
            <SectionHeading><span id="when-to-use">When to use it</span></SectionHeading>
            <p className="text-[15.5px] leading-[1.75] text-ink-soft">{formula.whenToUse}</p>
          </section>

          <section aria-labelledby="mistakes">
            <SectionHeading><span id="mistakes">Common mistakes</span></SectionHeading>
            <ul className="space-y-4">
              {formula.commonMistakes.map((item, i) => (
                <li key={i} className="rounded-lg border border-rule bg-white p-5 shadow-bar">
                  <p className="flex gap-2.5 text-[14.5px] font-medium text-ink">
                    <span aria-hidden="true" className="mt-0.5 font-mono text-[13px] text-rust">✕</span>
                    {item.mistake}
                  </p>
                  <p className="mt-2 flex gap-2.5 text-[14px] leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="mt-0.5 font-mono text-[13px] text-ledger">✓</span>
                    <span>{item.fix}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-14 rounded-lg border border-rule bg-cream/70 p-6">
            <FeedbackWidget slug={formula.slug} />
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] text-ink-faint">
            {formula.verification ? (
              <span className="inline-flex items-center gap-1.5 rounded border border-ledger/30 bg-ledger-tint/60 px-2 py-0.5 font-medium text-ledger-deep">
                <span aria-hidden="true">✓</span> Engine-verified against the sample data above
              </span>
            ) : (
              <span>Human-reviewed</span>
            )}
            <span aria-hidden="true">·</span>
            <span>Last reviewed {formula.lastReviewed}</span>
          </p>
        </div>

        {/* Related rail */}
        <aside aria-label="Related formulas" className="lg:pt-16">
          {related.length > 0 ? (
            <div className="lg:sticky lg:top-20">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                Related formulas
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={formulaPath(r)}
                      className="group block rounded-lg border border-rule bg-white p-4 shadow-bar transition-all hover:border-ink-faint hover:shadow-lift"
                    >
                      <span className="block text-[14px] font-semibold leading-snug text-ink group-hover:text-ledger-deep">
                        {r.title}
                      </span>
                      <code className="mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12px] text-ink-faint">
                        {r.quickFormula}
                      </code>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
