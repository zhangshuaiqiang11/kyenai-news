import type { Article, EvidenceSource } from "./types";

export type ArticleFilters = {
  query?: string;
  category?: string;
  source?: string;
};

export type ArticleSort = "newest" | "source-credibility" | "title";

export function filterArticles(articles: Article[], filters: ArticleFilters): Article[] {
  const query = normalize(filters.query || "");
  return articles.filter((article) => {
    const matchesQuery =
      !query ||
      normalize(
        [
          article.title,
          article.summary,
          article.category,
          article.tags.join(" "),
          article.keywords.join(" "),
          article.sources.map((source) => source.publisher).join(" "),
        ].join(" ")
      ).includes(query);
    const matchesCategory = !filters.category || article.category === filters.category;
    const matchesSource = !filters.source || article.sources.some((source) => source.publisher === filters.source);
    return matchesQuery && matchesCategory && matchesSource;
  });
}

export function sortArticles(articles: Article[], sort: ArticleSort): Article[] {
  const copy = [...articles];
  if (sort === "title") {
    return copy.sort((left, right) => left.title.localeCompare(right.title));
  }
  if (sort === "source-credibility") {
    return copy.sort((left, right) => maxCredibility(right) - maxCredibility(left));
  }
  return copy.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}

export function getCategoryCounts(articles: Article[]): Record<string, number> {
  return articles.reduce<Record<string, number>>((counts, article) => {
    counts[article.category] = (counts[article.category] || 0) + 1;
    return counts;
  }, {});
}

export function getAllSources(articles: Article[]): EvidenceSource[] {
  const byUrl = new Map<string, EvidenceSource>();
  for (const article of articles) {
    for (const source of article.sources) {
      byUrl.set(source.url, source);
    }
  }
  return Array.from(byUrl.values()).sort((left, right) => {
    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });
}

export function getPublishers(articles: Article[]): string[] {
  return Array.from(new Set(getAllSources(articles).map((source) => source.publisher))).sort();
}

function maxCredibility(article: Article): number {
  return Math.max(...article.sources.map((source) => source.credibility), 0);
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

