import type { Formula } from "./schema";
import { getCategory } from "./categories";

export type SearchDoc = {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  kind: Formula["kind"];
  functions: string[];
  /** Lowercased seoTitle — used to detect "this page is THE tutorial for term X". */
  seoTitle: string;
  /** token -> weight */
  tokens: Record<string, number>;
};

export type SearchResult = Pick<
  SearchDoc,
  "slug" | "title" | "description" | "categoryName" | "kind" | "functions"
> & { score: number };

const WEIGHTS = { title: 6, functions: 6, keywords: 3, category: 2, body: 1 };

/**
 * Lowercase and split into tokens. Error values like "#N/A" and "#DIV/0!"
 * are collapsed to plain tokens ("na", "div0") so users can type them any way.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/#([a-z0-9/]+)!?/g, (_, name: string) => ` ${name.replace(/\//g, "")} `)
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t.length > 1 || /[0-9]/.test(t));
}

function addTokens(bag: Record<string, number>, text: string, weight: number): void {
  // Weights accumulate across fields (deduped within a field): a page carrying a
  // term in its functions AND keywords AND description is the dedicated tutorial
  // for that term, and should outrank pages that merely use it once.
  for (const token of new Set(tokenize(text))) {
    bag[token] = (bag[token] ?? 0) + weight;
  }
}

export function buildSearchIndex(formulas: Formula[]): SearchDoc[] {
  return formulas
    .filter((f) => f.published)
    .map((f) => {
      const tokens: Record<string, number> = {};
      addTokens(tokens, f.title, WEIGHTS.title);
      addTokens(tokens, f.functions.join(" "), WEIGHTS.functions);
      addTokens(tokens, f.keywords.join(" "), WEIGHTS.keywords);
      const categoryName = getCategory(f.category)?.name ?? f.category;
      addTokens(tokens, categoryName, WEIGHTS.category);
      addTokens(tokens, `${f.description} ${f.problem}`, WEIGHTS.body);
      return {
        slug: f.slug,
        title: f.title,
        description: f.description,
        category: f.category,
        categoryName,
        kind: f.kind,
        functions: f.functions,
        seoTitle: f.seoTitle.toLowerCase(),
        tokens,
      };
    });
}

const STOPWORDS = new Set(["how", "to", "do", "the", "in", "a", "an", "my", "is", "of", "for", "with", "i"]);

export function searchFormulas(index: SearchDoc[], query: string): SearchResult[] {
  const queryTokens = tokenize(query).filter((t) => !STOPWORDS.has(t));
  if (queryTokens.length === 0) return [];

  const results: SearchResult[] = [];
  for (const doc of index) {
    let score = 0;
    let matched = 0;
    const titleTokens = new Set(tokenize(doc.title));
    for (const q of queryTokens) {
      let best = doc.tokens[q] ?? 0;
      if (best === 0) {
        // Prefix match: "count" should hit "countifs".
        for (const [token, weight] of Object.entries(doc.tokens)) {
          if (token.startsWith(q) && weight > best) best = weight * 0.6;
        }
      }
      if (best > 0) {
        matched += 1;
        score += best;
        if (titleTokens.has(q)) score += 1;
        // The page whose PRIMARY function this is beats pages that merely use it,
        // and the dedicated tutorial (seoTitle leads with the term) beats both.
        if (doc.functions[0]?.toLowerCase() === q) score += 3;
        if (doc.seoTitle.startsWith(q)) score += 4;
      }
    }
    if (matched === 0) continue;
    // Reward covering the whole query; a doc matching all tokens beats partials.
    score *= matched / queryTokens.length;
    if (matched === queryTokens.length) score += 4;
    results.push({
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      categoryName: doc.categoryName,
      kind: doc.kind,
      functions: doc.functions,
      score,
    });
  }

  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
