import { getGuides } from "./guides";
import type { Article, Guide } from "./types";

const ARTICLE_GUIDE_OVERRIDES: Record<string, string[]> = {
  "spacex-cursor-acquisition-2026": [
    "codex-vs-claude-code",
    "agents-md-vs-claude-md-cursorrules-copilot-instructions",
    "loop-engineering-ai-coding-agents",
  ],
};

export function getRelatedGuidesForArticle(article: Article, limit = 3): Guide[] {
  const overrideSlugs = ARTICLE_GUIDE_OVERRIDES[article.slug] || [];

  return getGuides()
    .filter(
      (guide) =>
        overrideSlugs.includes(guide.slug) ||
        guide.relatedArticleSlugs.includes(article.slug),
    )
    .sort((a, b) => {
      const aOverrideIndex = overrideSlugs.indexOf(a.slug);
      const bOverrideIndex = overrideSlugs.indexOf(b.slug);
      if (aOverrideIndex >= 0 || bOverrideIndex >= 0) {
        if (aOverrideIndex < 0) return 1;
        if (bOverrideIndex < 0) return -1;
        return aOverrideIndex - bOverrideIndex;
      }

      const aUpdated = new Date(a.updatedAt).getTime();
      const bUpdated = new Date(b.updatedAt).getTime();
      return bUpdated - aUpdated || a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}
