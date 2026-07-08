import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { getFormula } from "@/lib/content";
import { formulaPath } from "@/lib/paths";
import { SpreadsheetTable } from "@/components/SpreadsheetTable";
import { TemplateDownload } from "@/components/TemplateDownload";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const template = getTemplate(params.slug);
  if (!template) return {};
  return {
    title: `${template.name} — Free Template`,
    description: template.description,
  };
}

export default function TemplatePage({ params }: Props) {
  const template = getTemplate(params.slug);
  if (!template) notFound();
  const related = template.relatedFormulaSlugs
    .map((slug) => getFormula(slug))
    .filter((f): f is NonNullable<typeof f> => f !== null);

  return (
    <article className="mx-auto max-w-page px-5 pt-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-1.5 font-mono text-[12px] text-ink-faint">
          <li><Link href="/" className="hover:text-ink-soft">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/templates" className="hover:text-ink-soft">Templates</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-soft">{template.name}</li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 max-w-prose">
          <h1 className="font-display text-[40px] leading-[1.08] text-ink sm:text-[48px]">{template.name}</h1>
          <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">{template.description}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-faint">
            <span className="font-semibold text-ink-soft">Made for:</span> {template.whoFor}
          </p>

          <div className="mt-8">
            <TemplateDownload file={template.file} slug={template.slug} />
          </div>

          <section className="mt-12" aria-label="Preview">
            <SpreadsheetTable table={template.preview} caption="What's inside (sample rows)" />
          </section>

          <section className="mt-12" aria-labelledby="included">
            <h2 id="included" className="mb-4 flex items-baseline gap-3 font-display text-[26px] text-ink">
              Formulas built in
              <span className="h-px flex-1 translate-y-[-6px] bg-rule" aria-hidden="true" />
            </h2>
            <dl className="overflow-hidden rounded-lg border border-rule bg-white shadow-bar">
              {template.includedFormulas.map((item, i) => (
                <div key={i} className={`grid gap-1 px-5 py-3.5 lg:grid-cols-[minmax(240px,55%)_1fr] lg:gap-5 ${i > 0 ? "border-t border-rule" : ""}`}>
                  <dt className="break-all font-mono text-[13px] font-medium text-ledger-deep">{item.formula}</dt>
                  <dd className="text-[14px] leading-relaxed text-ink-soft">{item.does}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside aria-label="Related tutorials" className="lg:pt-14">
          {related.length > 0 ? (
            <div className="lg:sticky lg:top-20">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                Learn the formulas inside
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((formula) => (
                  <li key={formula.slug}>
                    <Link
                      href={formulaPath(formula)}
                      className="group block rounded-lg border border-rule bg-white p-4 shadow-bar transition-all hover:border-ink-faint hover:shadow-lift"
                    >
                      <span className="block text-[14px] font-semibold leading-snug text-ink group-hover:text-ledger-deep">
                        {formula.title}
                      </span>
                      <code className="mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12px] text-ink-faint">
                        {formula.quickFormula}
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
