import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allFormulas, getFormula } from "@/lib/content";
import { SITE_URL } from "@/lib/paths";
import { FormulaArticle } from "@/components/FormulaArticle";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return allFormulas.filter((f) => f.kind === "formula").map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const formula = getFormula(params.slug);
  if (!formula || formula.kind !== "formula") return {};
  return {
    title: formula.seoTitle,
    description: formula.description,
    alternates: { canonical: `${SITE_URL}/formulas/${formula.slug}` },
  };
}

export default function FormulaPage({ params }: Props) {
  const formula = getFormula(params.slug);
  if (!formula || formula.kind !== "formula") notFound();

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: formula.title,
    description: formula.description,
    step: formula.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.part,
      text: step.meaning,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <FormulaArticle formula={formula} />
    </>
  );
}
