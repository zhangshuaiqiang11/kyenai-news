import { describe, expect, it } from "vitest";

import { getIndexableCategoryNames } from "../lib/category-hubs";
import { buildCategoryPath } from "../lib/categories";
import { getGuides } from "../lib/guides";
import { seedArticles } from "../lib/seed";
import { buildSitemapEntries, isNoindexPath, renderSitemapXml, shouldIncludePathInSitemap } from "../lib/sitemap";

describe("sitemap helpers", () => {
  const resourcePaths = [
    "/resources/",
    "/resources/instruction-files/compatibility.json",
    "/resources/instruction-files/compatibility.csv",
    "/resources/instruction-files/AGENTS.md",
    "/resources/instruction-files/CLAUDE.md",
    "/resources/instruction-files/copilot-instructions.md",
    "/resources/instruction-files/cursor-project-rule.mdc",
    "/resources/instruction-files/benchmark-results.json",
    "/resources/mcp-security-review.md",
  ];
  const utilityNoindexPaths = [
    "/contact",
    "/sources",
    "/authors/editorial-automation-desk",
  ];
  const archiveNoindexPaths = [
    "/tags/claude-code",
    "/resources/mcp-security-review.md",
  ];

  it("keeps only indexable editorial URLs in the sitemap with truthful lastmod dates", () => {
    const entries = buildSitemapEntries(seedArticles);
    const locations = entries.map((entry) => entry.loc);
    const publishedArticles = seedArticles.filter((article) => article.status === "published");
    const guides = getGuides();
    const categories = Array.from(new Set(publishedArticles.map((article) => article.category)));
    const indexableCategories = new Set(getIndexableCategoryNames(publishedArticles));

    expect(locations).toContain("https://www.kyenai.com");
    expect(locations).toContain("https://www.kyenai.com/about");
    expect(locations).toContain("https://www.kyenai.com/editorial-policy");
    expect(locations).toContain("https://www.kyenai.com/entities");
    expect(locations).toContain("https://www.kyenai.com/guides");
    expect(entries.find((entry) => entry.loc.endsWith("/about"))?.lastmod).toBe("2026-06-06");
    expect(entries.find((entry) => entry.loc.endsWith("/editorial-policy"))?.lastmod).toBe("2026-06-06");
    expect(entries.find((entry) => entry.loc.endsWith("/entities"))?.lastmod).toBe("2026-06-18");

    for (const article of publishedArticles) {
      expect(locations).toContain(`https://www.kyenai.com/articles/${article.slug}`);
    }
    for (const guide of guides) {
      expect(locations).toContain(`https://www.kyenai.com/guides/${guide.slug}`);
    }
    for (const category of categories) {
      const categoryUrl = `https://www.kyenai.com${buildCategoryPath(category)}`;
      if (indexableCategories.has(category)) {
        expect(locations).toContain(categoryUrl);
      } else {
        expect(locations).not.toContain(categoryUrl);
      }
    }
    for (const noindexPath of utilityNoindexPaths) {
      expect(locations).not.toContain(`https://www.kyenai.com${noindexPath}`);
    }
    for (const resourcePath of resourcePaths) {
      expect(locations.some((location) => location.includes(resourcePath))).toBe(false);
    }
    expect(locations.some((loc) => loc.includes("/operations"))).toBe(false);
    expect(locations.some((loc) => loc.includes("/tags/"))).toBe(false);
    expect(entries.every((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod))).toBe(true);
    expect(new Set(locations).size).toBe(locations.length);
  });

  it("keeps utility, tag, and resource paths out of sitemap decisions", () => {
    for (const noindexPath of [...utilityNoindexPaths, ...archiveNoindexPaths]) {
      expect(isNoindexPath(noindexPath)).toBe(true);
      expect(shouldIncludePathInSitemap(noindexPath)).toBe(false);
      expect(shouldIncludePathInSitemap(`https://www.kyenai.com${noindexPath}?utm_source=test#section`)).toBe(false);
    }
    expect(shouldIncludePathInSitemap("/guides/secure-mcp-servers-ai-coding-agents")).toBe(true);
    expect(shouldIncludePathInSitemap("/articles/github-copilot-sdk-general-availability")).toBe(true);
  });

  it("adds a category hub only after it reaches the indexing gate", () => {
    const category = "AI Coding Agents";
    const template = seedArticles[0];
    const qualifyingArticles = Array.from({ length: 5 }, (_, index) => ({
      ...template,
      id: `category-gate-${index}`,
      slug: `category-gate-${index}`,
      category,
      status: "published" as const,
      updatedAt: `2026-06-${String(index + 10).padStart(2, "0")}`,
    }));
    const locations = buildSitemapEntries(qualifyingArticles).map((entry) => entry.loc);

    expect(getIndexableCategoryNames(qualifyingArticles)).toContain(category);
    expect(locations).toContain(`https://www.kyenai.com${buildCategoryPath(category)}`);
  });

  it("renders sitemap XML without utility or downloadable resource URLs", () => {
    const xml = renderSitemapXml(buildSitemapEntries(seedArticles.slice(0, 1)));

    expect(xml).toContain("<urlset");
    expect(xml).toContain("<lastmod>");
    expect(xml).toContain(`https://www.kyenai.com/articles/${seedArticles[0].slug}`);
    expect(xml).not.toContain("/operations");
    for (const noindexPath of utilityNoindexPaths) {
      expect(xml).not.toContain(noindexPath);
    }
    for (const resourcePath of resourcePaths) {
      expect(xml).not.toContain(resourcePath);
    }
  });
});
