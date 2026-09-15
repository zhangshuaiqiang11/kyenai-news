import { describe, expect, it } from "vitest";

import {
  getArticleEditorialPolicy,
  getArticleEditorialTier,
} from "../lib/article-policy";
import { spacexCursorAcquisitionArticle } from "../lib/articles/spacex-cursor-acquisition";
import { seedArticles } from "../lib/seed";

describe("article editorial tiers", () => {
  it("reserves Tier A for the durable Cursor Enterprise decision asset", () => {
    const article = seedArticles.find((item) => item.slug === "cursor-enterprise-organizations-governance")!;

    expect(getArticleEditorialTier(article)).toBe("A");
    expect(getArticleEditorialPolicy(article).label).toMatch(/durable decision asset/i);
  });

  it("keeps the SpaceX update in the dated Tier B lane", () => {
    expect(getArticleEditorialTier(spacexCursorAcquisitionArticle)).toBe("B");
    expect(getArticleEditorialPolicy(spacexCursorAcquisitionArticle).expansionRule).toMatch(/dated update/i);
  });

  it("falls back to Tier C when source dates or credibility are missing", () => {
    const article = {
      ...seedArticles[0],
      slug: "unclassified-trend",
      sources: [{ ...seedArticles[0].sources[0], publishedAt: "", credibility: 2 }],
    };

    expect(getArticleEditorialTier(article)).toBe("C");
    expect(getArticleEditorialPolicy(article).expansionRule).toMatch(/no expansion/i);
  });
});
