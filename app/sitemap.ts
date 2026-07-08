import type { MetadataRoute } from "next";
import { allFormulas } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import { formulaPath, SITE_URL } from "@/lib/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/formulas", "/errors", "/categories", "/search"].map((path) => ({
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
