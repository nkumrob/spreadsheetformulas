import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allFormulas, getFormula } from "@/lib/content";
import { SITE_URL } from "@/lib/paths";
import { FormulaArticle } from "@/components/FormulaArticle";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return allFormulas.filter((f) => f.kind === "error-fix").map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const page = getFormula(params.slug);
  if (!page || page.kind !== "error-fix") return {};
  return {
    title: page.seoTitle,
    description: page.description,
    alternates: { canonical: `${SITE_URL}/errors/${page.slug}` },
  };
}

export default function ErrorFixPage({ params }: Props) {
  const page = getFormula(params.slug);
  if (!page || page.kind !== "error-fix") notFound();
  return <FormulaArticle formula={page} />;
}
