import type { Article } from "./types";

export function isPublishedArticle(article: Article): boolean {
  return article.status === "published";
}

export function getPublishedArticles(articles: Article[]): Article[] {
  return articles.filter(isPublishedArticle);
}
