import { featuredArticles } from "./articles/spacex-cursor-acquisition";
import { seedArticles } from "./seed";
import type { Article } from "./types";

type BackendArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  author_name: string;
  status: "draft" | "published" | "archived";
  keywords: string[];
  entity_ids?: string[];
  blocks: Array<{ id: string; type: Article["blocks"][number]["type"]; content: string; source_ids: string[] }>;
  sources: Array<{
    id: string;
    title: string;
    url: string;
    publisher: string;
    published_at: string;
    credibility: number;
  }>;
  published_at: string;
  updated_at: string;
  version: number;
  meta_title?: string;
  meta_description?: string;
};

const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles`, { next: { revalidate: 300 } as never });
    if (!response.ok) {
      return mergeFeaturedArticles(seedArticles);
    }
    const data = (await response.json()) as BackendArticle[];
    return mergeFeaturedArticles(mergeCanonicalArticles(data.map(fromBackendArticle), seedArticles));
  } catch {
    return mergeFeaturedArticles(seedArticles);
  }
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const curatedArticle = mergeFeaturedArticles(seedArticles).find((article) => article.slug === slug);

  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/${slug}`, { next: { revalidate: 300 } as never });
    if (response.ok) {
      return selectCanonicalArticle(
        fromBackendArticle((await response.json()) as BackendArticle),
        curatedArticle,
      );
    }
  } catch {
    return curatedArticle;
  }
  return curatedArticle;
}

export function selectCanonicalArticle(
  backendArticle: Article | undefined,
  curatedArticle: Article | undefined,
): Article | undefined {
  if (!backendArticle) return curatedArticle;
  if (!curatedArticle) return backendArticle;
  return backendArticle.version > curatedArticle.version ? backendArticle : curatedArticle;
}

export function mergeCanonicalArticles(
  backendArticles: Article[],
  curatedArticles: Article[] = seedArticles,
): Article[] {
  const curatedBySlug = new Map(curatedArticles.map((article) => [article.slug, article]));
  const merged = backendArticles.map((backendArticle) => {
    const curatedArticle = curatedBySlug.get(backendArticle.slug);
    if (curatedArticle) curatedBySlug.delete(backendArticle.slug);
    return selectCanonicalArticle(backendArticle, curatedArticle)!;
  });

  return [...merged, ...Array.from(curatedBySlug.values())];
}

export function mergeFeaturedArticles(articles: Article[]): Article[] {
  const articleBySlug = new Map(articles.map((article) => [article.slug, article]));
  const mergedFeatured = featuredArticles.map((featuredArticle) => {
    const existingArticle = articleBySlug.get(featuredArticle.slug);
    articleBySlug.delete(featuredArticle.slug);
    return selectCanonicalArticle(existingArticle, featuredArticle)!;
  });
  return [...mergedFeatured, ...articles.filter((article) => articleBySlug.has(article.slug))];
}

export function fromBackendArticle(article: BackendArticle): Article {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    summary: article.summary,
    category: article.category,
    tags: article.tags,
    authorName: article.author_name,
    status: article.status,
    keywords: article.keywords,
    entityIds: article.entity_ids || [],
    blocks: article.blocks.map((block) => ({
      id: block.id,
      type: block.type,
      content: block.content,
      sourceIds: block.source_ids,
    })),
    sources: article.sources.map((source) => ({
      id: source.id,
      title: source.title,
      url: source.url,
      publisher: source.publisher,
      publishedAt: source.published_at,
      credibility: source.credibility,
    })),
    publishedAt: article.published_at,
    updatedAt: article.updated_at,
    version: article.version,
    metaTitle: article.meta_title,
    metaDescription: article.meta_description,
  };
}
