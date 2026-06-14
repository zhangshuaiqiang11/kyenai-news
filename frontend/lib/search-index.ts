import { getGuides } from "./guides";
import { seedArticles } from "./seed";

export type SearchResult = {
  href: string;
  label: "Guide" | "Article";
  title: string;
  summary: string;
  keywords: string[];
  priority: number;
};

export type SearchSite = (query: string) => SearchResult[];

const searchIndex: SearchResult[] = [
  ...getGuides().map((guide) => ({
    href: `/guides/${guide.slug}`,
    label: "Guide" as const,
    title: guide.title,
    summary: guide.summary,
    keywords: [...guide.secondaryKeywords, guide.intent, guide.pageType],
    priority: 2,
  })),
  ...seedArticles
    .filter((article) => article.status === "published")
    .map((article) => ({
      href: `/articles/${article.slug}`,
      label: "Article" as const,
      title: article.title,
      summary: article.summary,
      keywords: [...article.tags, ...article.keywords, article.category],
      priority: 1,
    })),
];

export const searchSite: SearchSite = (query) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return [];
  }

  return searchIndex
    .map((item) => ({ item, score: scoreResult(item, normalizedQuery) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || right.item.priority - left.item.priority)
    .slice(0, 6)
    .map((entry) => entry.item);
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function scoreResult(result: SearchResult, normalizedQuery: string): number {
  const title = normalize(result.title);
  const summary = normalize(result.summary);
  const keywords = normalize(result.keywords.join(" "));
  const haystack = `${title} ${summary} ${keywords}`;

  if (!haystack.includes(normalizedQuery)) {
    return 0;
  }

  let score = result.priority;
  if (title.includes(normalizedQuery)) {
    score += 8;
  }
  if (keywords.includes(normalizedQuery)) {
    score += 4;
  }
  if (summary.includes(normalizedQuery)) {
    score += 2;
  }
  return score;
}
