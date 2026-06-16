import { describe, expect, it } from "vitest";

import { buildCategoryPath } from "../lib/categories";
import { getGuides } from "../lib/guides";
import { shouldIndexCategory } from "../lib/indexation";
import { seedArticles } from "../lib/seed";
import { buildSitemapEntries, renderSitemapXml } from "../lib/sitemap";

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
  ];

  it("keeps only indexable editorial URLs in the sitemap with lastmod dates", () => {
    const entries = buildSitemapEntries(seedArticles);
    const locations = entries.map((entry) => entry.loc);
    const publishedArticles = seedArticles.filter((article) => article.status === "published");
    const categories = Array.from(new Set(publishedArticles.map((article) => article.category)));
    const guides = getGuides();

    expect(locations).toContain("https://www.kyenai.com");
    expect(locations).toContain("https://www.kyenai.com/about");
    expect(locations).toContain("https://www.kyenai.com/editorial-policy");
    expect(locations).toContain("https://www.kyenai.com/guides");

    for (const path of noindexPaths) {
      expect(locations).not.toContain(`https://www.kyenai.com${path}`);
    }

    for (const article of publishedArticles) {
      expect(locations).toContain(`https://www.kyenai.com/articles/${article.slug}`);
    }

    for (const category of categories) {
      const articleCount = publishedArticles.filter((article) => article.category === category).length;
      const categoryLocation = `https://www.kyenai.com${buildCategoryPath(category)}`;
      if (shouldIndexCategory(articleCount)) {
        expect(locations).toContain(categoryLocation);
      } else {
        expect(locations).not.toContain(categoryLocation);
      }
    }

    for (const guide of guides) {
      expect(locations).toContain(`https://www.kyenai.com/guides/${guide.slug}`);
    }
    const guideLocations = locations.filter((location) => location.startsWith("https://www.kyenai.com/guides/"));
    expect(guideLocations).toHaveLength(guides.length);
    expect(guideLocations).toEqual(guides.map((guide) => `https://www.kyenai.com/guides/${guide.slug}`));

    for (const resourcePath of resourcePaths) {
      expect(locations.some((location) => location.includes(resourcePath))).toBe(false);
    }
    expect(locations.some((loc) => loc.includes("/operations"))).toBe(false);
    expect(locations.some((loc) => loc.includes("/tags/"))).toBe(false);
    expect(entries.every((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod))).toBe(true);
    expect(new Set(locations).size).toBe(locations.length);
  });

  it("renders sitemap XML with canonical locations and lastmod", () => {
    const xml = renderSitemapXml(buildSitemapEntries(seedArticles.slice(0, 1)));

    expect(xml).toContain("<urlset");
    expect(xml).toContain("<lastmod>");
    expect(xml).toContain(`https://www.kyenai.com/articles/${seedArticles[0].slug}`);
    expect(xml).not.toContain("/operations");
    for (const path of noindexPaths) {
      expect(xml).not.toContain(path);
    }
    for (const resourcePath of resourcePaths) {
      expect(xml).not.toContain(resourcePath);
    }
  });
});
