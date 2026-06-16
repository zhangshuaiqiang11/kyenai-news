import { getGuides } from "./guides";
import type { Article, Guide } from "./types";

export function getRelatedGuidesForArticle(article: Article, limit = 3): Guide[] {
  return getGuides()
    .filter((guide) => guide.relatedArticleSlugs.includes(article.slug))
    .sort((a, b) => {
      const aUpdated = new Date(a.updatedAt).getTime();
      const bUpdated = new Date(b.updatedAt).getTime();
      return bUpdated - aUpdated || a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}
