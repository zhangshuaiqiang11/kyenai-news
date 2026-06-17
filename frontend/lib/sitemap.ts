import { getIndexableCategoryNames } from "./category-hubs";
import { buildCategoryPath } from "./categories";
import { getGuides } from "./guides";
import { buildCanonicalUrl } from "./seo";
import type { Article } from "./types";

export type SitemapEntry = {
  loc: string;
  lastmod: string;
};

const staticPageDates = {
  "/about": "2026-06-06",
  "/editorial-policy": "2026-06-06",
  "/entities": "2026-06-18",
} as const;

export const noindexUtilityPaths = [
  "/contact",
  "/sources",
  "/authors/editorial-automation-desk",
] as const;

export const noindexPathPrefixes = ["/tags/", "/resources/"] as const;

export function shouldIncludePathInSitemap(path: string): boolean {
  return !isNoindexPath(path);
}

export function isNoindexPath(path: string): boolean {
  const cleanPath = normalizePath(path);
  return (
    noindexUtilityPaths.includes(cleanPath as (typeof noindexUtilityPaths)[number]) ||
    noindexPathPrefixes.some((prefix) => cleanPath.startsWith(prefix))
  );
}

export function buildSitemapEntries(articles: Article[]): SitemapEntry[] {
  const publishedArticles = articles.filter((article) => article.status === "published");
  const guides = getGuides();
  const latestContentUpdate = latestDate([
    ...publishedArticles.map((article) => article.updatedAt),
    ...guides.map((guide) => guide.updatedAt),
  ]);
  const indexableCategories = getIndexableCategoryNames(publishedArticles);

  return [
    { loc: buildCanonicalUrl("/"), lastmod: latestContentUpdate },
    ...Object.entries(staticPageDates).map(([path, lastmod]) => ({ loc: buildCanonicalUrl(path), lastmod })),
    { loc: buildCanonicalUrl("/guides"), lastmod: latestDate(guides.map((guide) => guide.updatedAt)) },
    ...guides.map((guide) => ({
      loc: buildCanonicalUrl(`/guides/${guide.slug}`),
      lastmod: toDateOnly(guide.updatedAt),
    })),
    ...publishedArticles.map((article) => ({
      loc: buildCanonicalUrl(`/articles/${article.slug}`),
      lastmod: toDateOnly(article.updatedAt),
    })),
    ...indexableCategories.map((category) => ({
      loc: buildCanonicalUrl(buildCategoryPath(category)),
      lastmod: latestDate(
        publishedArticles.filter((article) => article.category === category).map((article) => article.updatedAt),
      ),
    })),
  ].filter((entry) => shouldIncludePathInSitemap(new URL(entry.loc).pathname));
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

function normalizePath(path: string): string {
  const pathname = path.startsWith("http") ? new URL(path).pathname : path;
  const cleanPath = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return cleanPath || "/";
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
