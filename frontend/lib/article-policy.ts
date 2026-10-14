import type { Article } from "./types";

export type ArticleEditorialTier = "A" | "B" | "C";

export type ArticleEditorialPolicy = {
  tier: ArticleEditorialTier;
  label: string;
  purpose: string;
  publicationRule: string;
  reviewCadence: string;
  expansionRule: string;
};

const TIER_POLICIES: Record<ArticleEditorialTier, ArticleEditorialPolicy> = {
  A: {
    tier: "A",
    label: "Tier A — durable decision asset",
    purpose: "Evergreen, source-backed guidance that helps a reader make a security, governance, or procurement decision.",
    publicationRule: "Publish only when the visible answer, cited sources, and evidence boundary are complete.",
    reviewCadence: "Review before every material change and at least every 14 days while the underlying product policy can change.",
    expansionRule: "May receive supporting guides and internal links when each new claim adds distinct evidence or a reproducible check.",
  },
  B: {
    tier: "B",
    label: "Tier B — dated source-backed update",
    purpose: "A time-bound product, company, or ecosystem update that records what changed and what remains unconfirmed.",
    publicationRule: "Anchor the article to a dated primary or official source and separate confirmed facts from interpretation.",
    reviewCadence: "Review on source change, correction, or material announcement; otherwise check at least every 30 days while the topic is active.",
    expansionRule: "Use as supporting evidence for durable guides; do not turn a dated update into evergreen advice without new evidence.",
  },
  C: {
    tier: "C",
    label: "Tier C — supporting or experimental coverage",
    purpose: "Generic release, changelog, trend, or fallback coverage that does not yet earn a durable decision page.",
    publicationRule: "Keep the evidence boundary explicit and do not imply broad adoption, hands-on testing, or a ranking outcome.",
    reviewCadence: "Review before any expansion, repeated refresh, or internal-link promotion.",
    expansionRule: "No expansion without unique evidence, a clear reader task, and accountable editorial review.",
  },
};

/** Explicit overrides protect the pages that carry the site's highest editorial responsibility. */
export const ARTICLE_EDITORIAL_TIER_OVERRIDES: Record<string, ArticleEditorialTier> = {
  "cursor-enterprise-organizations-governance": "A",
  "spacex-cursor-acquisition-2026": "B",
};

function isDatedSourceBacked(article: Article): boolean {
  return article.sources.length > 0 && article.sources.every((source) => {
    return Boolean(source.publishedAt) && source.credibility >= 4;
  });
}

export function getArticleEditorialTier(article: Article): ArticleEditorialTier {
  const override = ARTICLE_EDITORIAL_TIER_OVERRIDES[article.slug];
  if (override) return override;
  return isDatedSourceBacked(article) ? "B" : "C";
}

export function getArticleEditorialPolicy(article: Article): ArticleEditorialPolicy {
  return TIER_POLICIES[getArticleEditorialTier(article)];
}

export function getArticleEditorialPolicyByTier(tier: ArticleEditorialTier): ArticleEditorialPolicy {
  return TIER_POLICIES[tier];
}
