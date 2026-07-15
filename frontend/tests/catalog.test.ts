import { describe, expect, it } from "vitest";

import { filterArticles, getAllSources, getCategoryCounts, sortArticles, toArticleSummary } from "../lib/catalog";
import { seedArticles } from "../lib/seed";

describe("catalog helpers", () => {
  it("filters articles by query and category", () => {
    const articles = filterArticles(seedArticles, {
      query: "codex",
      category: "AI Coding Agents",
    });

    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((article) => article.category === "AI Coding Agents")).toBe(true);
    expect(articles.some((article) => article.title.includes("Codex"))).toBe(true);
  });

  it("sorts articles by newest update first", () => {
    const sorted = sortArticles(seedArticles, "newest");

    expect(new Date(sorted[0].updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(sorted[1].updatedAt).getTime()
    );
  });

  it("builds category counts and unique source lists", () => {
    const counts = getCategoryCounts(seedArticles);
    const sources = getAllSources(seedArticles);

    expect(counts["AI Coding Agents"]).toBeGreaterThanOrEqual(3);
    expect(new Set(sources.map((source) => source.url)).size).toBe(sources.length);
  });

  it("includes current international AI agent updates with source evidence", () => {
    const expectedSlugs = [
      "github-copilot-sdk-general-availability",
      "visual-studio-agent-mode-mcp-general-availability",
      "jetbrains-acp-agent-registry",
    ];

    for (const slug of expectedSlugs) {
      const article = seedArticles.find((item) => item.slug === slug);

      expect(article).toBeDefined();
      expect(article?.status).toBe("published");
      expect(article?.sources.length).toBeGreaterThanOrEqual(1);
      expect(article?.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
      expect(article?.blocks.some((block) => block.type === "fact_table")).toBe(true);
      expect(article?.blocks.some((block) => block.type === "source_note")).toBe(true);
    }
  });

  it("projects homepage article summaries without full article blocks or editorial-only detail fields", () => {
    const summary = toArticleSummary(seedArticles[0]);
    const serialized = JSON.stringify(summary);

    expect(summary.title).toBe(seedArticles[0].title);
    expect(summary.sources).toEqual(seedArticles[0].sources);
    expect(serialized).not.toContain('"blocks"');
    expect(serialized).not.toContain('"authorName"');
    expect(serialized).not.toContain('"metaDescription"');
    expect(serialized.length).toBeLessThan(JSON.stringify(seedArticles[0]).length / 2);
  });
});
