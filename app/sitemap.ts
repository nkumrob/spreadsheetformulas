import type { MetadataRoute } from "next";
import { allFormulas } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import { formulaPath, SITE_URL } from "@/lib/paths";
import { TEMPLATES } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/formulas",
    "/errors",
    "/categories",
    "/search",
    "/templates",
    "/tools",
    "/tools/fix-formula",
    "/tools/explain-formula",
    "/tools/ai",
    "/how-we-test",
    ...TEMPLATES.map((t) => `/templates/${t.slug}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
  }));
  const categoryPages = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    changeFrequency: "weekly" as const,
  }));
  const contentPages = allFormulas.map((f) => ({
    url: `${SITE_URL}${formulaPath(f)}`,
    lastModified: f.lastReviewed,
    changeFrequency: "monthly" as const,
  }));
  return [...staticPages, ...categoryPages, ...contentPages];
}
