import { buildCanonicalUrl } from "./seo";
import { getGuides } from "./guides";
import type { Article } from "./types";

export type SitemapEntry = {
  loc: string;
  lastmod: string;
};

export function buildSitemapEntries(articles: Article[]): SitemapEntry[] {
  const latestSiteUpdate = latestDate(articles.map((article) => article.updatedAt));
  const categories = Array.from(new Set(articles.map((article) => article.category))).sort();
  const guides = getGuides();

  return [
    { loc: buildCanonicalUrl("/"), lastmod: latestSiteUpdate },
    { loc: buildCanonicalUrl("/about"), lastmod: latestSiteUpdate },
    { loc: buildCanonicalUrl("/editorial-policy"), lastmod: latestSiteUpdate },
    { loc: buildCanonicalUrl("/contact"), lastmod: latestSiteUpdate },
    { loc: buildCanonicalUrl("/sources"), lastmod: latestSiteUpdate },
    { loc: buildCanonicalUrl("/entities"), lastmod: latestSiteUpdate },
    { loc: buildCanonicalUrl("/guides"), lastmod: latestDate(guides.map((guide) => guide.updatedAt)) },
    { loc: buildCanonicalUrl("/authors/editorial-automation-desk"), lastmod: latestSiteUpdate },
    ...guides.map((guide) => ({
      loc: buildCanonicalUrl(`/guides/${guide.slug}`),
      lastmod: toDateOnly(guide.updatedAt),
    })),
    ...articles
      .filter((article) => article.status === "published")
      .map((article) => ({
        loc: buildCanonicalUrl(`/articles/${article.slug}`),
        lastmod: toDateOnly(article.updatedAt),
      })),
    ...categories.map((category) => ({
      loc: buildCanonicalUrl(`/categories/${encodeURIComponent(category)}`),
      lastmod: latestDate(
        articles.filter((article) => article.category === category).map((article) => article.updatedAt)
      ),
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
