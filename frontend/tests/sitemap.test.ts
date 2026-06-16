import { describe, expect, it } from "vitest";

import { buildSitemapEntries, isNoindexPath, renderSitemapXml, shouldIncludePathInSitemap } from "../lib/sitemap";
import { seedArticles } from "../lib/seed";
import { getGuides } from "../lib/guides";

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
  const noindexPaths = [
    "/contact",
    "/sources",
    "/entities",
    "/authors/editorial-automation-desk",
    "/categories/ai-coding-agents",
    "/categories/agent-workflows",
    "/categories/ide-cli",
    "/categories/security-governance",
  ];

  it("keeps only indexable editorial URLs in the sitemap with lastmod dates", () => {
    const entries = buildSitemapEntries(seedArticles);
    const locations = entries.map((entry) => entry.loc);
    const publishedArticles = seedArticles.filter((article) => article.status === "published");
    const guides = getGuides();

    expect(locations).toContain("https://www.kyenai.com");
    expect(locations).toContain("https://www.kyenai.com/about");
    expect(locations).toContain("https://www.kyenai.com/editorial-policy");
    expect(locations).toContain("https://www.kyenai.com/guides");
    for (const article of publishedArticles) {
      expect(locations).toContain(`https://www.kyenai.com/articles/${article.slug}`);
    }
    for (const guide of guides) {
      expect(locations).toContain(`https://www.kyenai.com/guides/${guide.slug}`);
    }
    const guideLocations = locations.filter((location) => location.startsWith("https://www.kyenai.com/guides/"));
    expect(guideLocations).toHaveLength(guides.length);
    expect(guideLocations).toEqual(guides.map((guide) => `https://www.kyenai.com/guides/${guide.slug}`));
    for (const noindexPath of noindexPaths) {
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

  it("keeps noindex utility and archive paths out of sitemap decisions", () => {
    for (const noindexPath of noindexPaths) {
      expect(isNoindexPath(noindexPath)).toBe(true);
      expect(shouldIncludePathInSitemap(noindexPath)).toBe(false);
      expect(shouldIncludePathInSitemap(`https://www.kyenai.com${noindexPath}?utm_source=test#section`)).toBe(false);
    }
    expect(shouldIncludePathInSitemap("/guides/secure-mcp-servers-ai-coding-agents")).toBe(true);
    expect(shouldIncludePathInSitemap("/articles/github-copilot-sdk-general-availability")).toBe(true);
  });

  it("renders sitemap XML with canonical locations and lastmod", () => {
    const xml = renderSitemapXml(buildSitemapEntries(seedArticles.slice(0, 1)));

    expect(xml).toContain("<urlset");
    expect(xml).toContain("<lastmod>");
    expect(xml).toContain(`https://www.kyenai.com/articles/${seedArticles[0].slug}`);
    expect(xml).not.toContain("/operations");
    for (const noindexPath of noindexPaths) {
      expect(xml).not.toContain(noindexPath);
    }
    for (const resourcePath of resourcePaths) {
      expect(xml).not.toContain(resourcePath);
    }
  });
});
