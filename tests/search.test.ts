import { describe, expect, it } from "vitest";
import { buildSearchIndex, searchFormulas } from "@/lib/search";
import { allFormulas } from "@/lib/content";

const index = buildSearchIndex(allFormulas);

function topSlugs(query: string, n = 3): string[] {
  return searchFormulas(index, query)
    .slice(0, n)
    .map((r) => r.slug);
}

describe("search relevance (PRD §11 queries)", () => {
  it("finds pages by plain-English problem", () => {
    expect(topSlugs("compare two columns")).toContain("compare-two-columns");
    expect(topSlugs("split full name")).toContain("extract-first-name");
    expect(topSlugs("remove spaces")).toContain("remove-extra-spaces");
  });

  it("finds pages by function name", () => {
    expect(topSlugs("xlookup")).toContain("xlookup-basic-example");
    expect(topSlugs("countifs")).toContain("count-if-multiple-conditions");
  });

  it("finds pages by error type", () => {
    expect(topSlugs("fix #N/A")).toContain("fix-na-error");
    expect(topSlugs("#DIV/0!")).toContain("fix-div0-error");
  });

  it("finds pages by use case", () => {
    expect(topSlugs("training completion percentage")).toContain("calculate-completion-percentage");
    expect(topSlugs("overdue tasks")).toContain("flag-overdue-tasks");
  });

  it("returns empty for gibberish, never throws", () => {
    expect(searchFormulas(index, "zzqxv plumbus")).toEqual([]);
    expect(searchFormulas(index, "")).toEqual([]);
    expect(searchFormulas(index, "   ")).toEqual([]);
  });

  it("ranks title matches above keyword-only matches", () => {
    const results = searchFormulas(index, "vlookup exact match");
    expect(results[0]?.slug).toBe("vlookup-exact-match");
  });
});
