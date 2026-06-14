import { buildCanonicalUrl, buildMetaDescription, SITE_NAME } from "./seo";
import type { Article } from "./types";

const FEED_DESCRIPTION =
  "Evidence-led AI coding agent news and source-backed optimization updates from KyenAI.";

export function buildRssFeedXml(articles: Article[]): string {
  const items = articles
    .filter((article) => article.status === "published")
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
    .slice(0, 20)
    .map(renderRssItem)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${buildCanonicalUrl("/")}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(latestTimestamp(articles)).toUTCString()}</lastBuildDate>
    <atom:link href="${buildCanonicalUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

function renderRssItem(article: Article): string {
  const url = buildCanonicalUrl(`/articles/${article.slug}`);
  const source = article.sources[0];

  return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <description>${escapeXml(buildMetaDescription(article))}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${url}</guid>
      <dc:creator>${escapeXml(article.authorName)}</dc:creator>
      <category>${escapeXml(article.category)}</category>${
        source ? `\n      <source url="${escapeXml(source.url)}">${escapeXml(source.publisher)}</source>` : ""
      }
    </item>`;
}

function latestTimestamp(articles: Article[]): string {
  const timestamps = articles
    .filter((article) => article.status === "published")
    .map((article) => new Date(article.updatedAt).getTime())
    .filter(Number.isFinite)
    .sort((left, right) => right - left);

  return new Date(timestamps[0] || Date.now()).toISOString();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
