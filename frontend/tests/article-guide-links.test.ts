import { describe, expect, it } from "vitest";

import { getRelatedGuidesForArticle } from "../lib/article-guide-links";
import { seedArticles } from "../lib/seed";

describe("article to guide links", () => {
  it("reverses guide relatedArticleSlugs into article recommendations", () => {
    const article = seedArticles.find((item) => item.slug === "google-antigravity-cli-gemini-cli-transition");

    expect(article).toBeDefined();
    const guides = getRelatedGuidesForArticle(article!);

    expect(guides.map((guide) => guide.slug)).toContain("antigravity-cli-gemini-cli-migration");
    for (const guide of guides) {
      expect(guide.relatedArticleSlugs).toContain(article!.slug);
    }
  });

  it("returns unique indexable guide pages and respects the result limit", () => {
    const article = seedArticles.find((item) => item.slug === "claude-code-dynamic-workflows-parallel-subagents");

    expect(article).toBeDefined();
    const guides = getRelatedGuidesForArticle(article!, 2);
    const slugs = guides.map((guide) => guide.slug);

    expect(guides.length).toBeLessThanOrEqual(2);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every((slug) => slug.length > 0)).toBe(true);
  });
});
