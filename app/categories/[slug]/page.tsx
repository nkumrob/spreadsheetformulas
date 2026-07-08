import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { formulasByCategory } from "@/lib/content";
import { FormulaCard } from "@/components/FormulaCard";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getCategory(params.slug);
  if (!category) return {};
  return {
    title: `${category.name} Formulas`,
    description: `${category.blurb} Tested Excel and Google Sheets formulas with examples and plain-English explanations.`,
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategory(params.slug);
  if (!category) notFound();
  const formulas = formulasByCategory(category.slug);

  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-1.5 font-mono text-[12px] text-ink-faint">
          <li><Link href="/" className="hover:text-ink-soft">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/categories" className="hover:text-ink-soft">Categories</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-soft">{category.name}</li>
        </ol>
      </nav>
      <header className="max-w-prose">
        <span className="rounded border border-rule bg-cream px-2 py-0.5 font-mono text-[12px] font-medium text-ink-faint">
          {category.cell}
        </span>
        <h1 className="mt-4 font-display text-[44px] leading-tight text-ink">{category.name}</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{category.blurb}</p>
      </header>

      {formulas.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formulas.map((formula, i) => (
            <FormulaCard key={formula.slug} formula={formula} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-10 max-w-prose rounded-xl border border-dashed border-rule bg-cream/50 p-8 text-center">
          <p className="font-display text-[22px] text-ink">This ledger page is still blank.</p>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-soft">
            {category.name} formulas are being tested now. Browse{" "}
            <Link href="/formulas" className="font-medium text-ledger-deep hover:underline">
              all formulas
            </Link>{" "}
            in the meantime, or subscribe below to hear when they land.
          </p>
        </div>
      )}
    </div>
  );
}
