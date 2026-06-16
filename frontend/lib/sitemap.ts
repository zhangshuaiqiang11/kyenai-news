import { buildCategoryPath } from "./categories";
import { getGuides } from "./guides";
import { shouldIndexCategory, shouldIndexPath } from "./indexation";
import { buildCanonicalUrl } from "./seo";
import type { Article } from "./types";

export type SitemapEntry = {
  loc: string;
  lastmod: string;
};

export function buildSitemapEntries(articles: Article[]): SitemapEntry[] {
  const publishedArticles = articles.filter((article) => article.status === "published");
  const latestSiteUpdate = latestDate(publishedArticles.map((article) => article.updatedAt));
  const guides = getGuides();
  const categoryEntries = Array.from(new Set(publishedArticles.map((article) => article.category)))
    .sort()
    .map((category) => {
      const categoryArticles = publishedArticles.filter((article) => article.category === category);
      return {
        category,
        articleCount: categoryArticles.length,
        lastmod: latestDate(categoryArticles.map((article) => article.updatedAt)),
      };
    })
    .filter((category) => shouldIndexCategory(category.articleCount));

  const staticPaths = ["/", "/about", "/editorial-policy", "/guides"].filter(shouldIndexPath);

  return [
    ...staticPaths.map((path) => ({
      loc: buildCanonicalUrl(path),
      lastmod: path === "/guides" ? latestDate(guides.map((guide) => guide.updatedAt)) : latestSiteUpdate,
    })),
    ...guides.map((guide) => ({
      loc: buildCanonicalUrl(`/guides/${guide.slug}`),
      lastmod: toDateOnly(guide.updatedAt),
    })),
    ...publishedArticles.map((article) => ({
      loc: buildCanonicalUrl(`/articles/${article.slug}`),
      lastmod: toDateOnly(article.updatedAt),
    })),
    ...categoryEntries.map(({ category, lastmod }) => ({
      loc: buildCanonicalUrl(buildCategoryPath(category)),
      lastmod,
    })),
  ];
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => `  <url><loc>${escapeXml(entry.loc)}</loc><lastmod>${entry.lastmod}</lastmod></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function latestDate(values: string[]): string {
  const sorted = values.map((value) => new Date(value).getTime()).filter(Number.isFinite).sort((a, b) => b - a);
  if (sorted.length === 0) {
    return toDateOnly(new Date().toISOString());
  }
  return toDateOnly(new Date(sorted[0]).toISOString());
}

function toDateOnly(value: string): string {
  return value.slice(0, 10);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
