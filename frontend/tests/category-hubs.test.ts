import { describe, expect, it } from "vitest";

import {
  getCategoryGuides,
  getCategoryHub,
  getIndexableCategoryNames,
  shouldIndexCategoryHub,
} from "../lib/category-hubs";
import { seedArticles } from "../lib/seed";

describe("category hub indexing", () => {
  const categories = ["AI Coding Agents", "IDE & CLI", "Agent Workflows", "Security & Governance"];

  it.each(categories)("provides original overview copy and core guides for %s", (category) => {
    const hub = getCategoryHub(category);
    const wordCount = hub?.overview.join(" ").match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?/g)?.length || 0;

    expect(hub).toBeDefined();
    expect(wordCount).toBeGreaterThanOrEqual(hub!.minimumOverviewWords);
    expect(getCategoryGuides(category).length).toBeGreaterThan(0);
  });

  it("does not count drafts toward the category indexing gate", () => {
    const category = "AI Coding Agents";
    const template = seedArticles[0];
    const drafts = Array.from({ length: 8 }, (_, index) => ({
      ...template,
      id: `draft-category-${index}`,
      slug: `draft-category-${index}`,
      category,
      status: "draft" as const,
    }));

    expect(shouldIndexCategoryHub(category, drafts)).toBe(false);
    expect(getIndexableCategoryNames(drafts)).not.toContain(category);
  });

  it("unlocks a category after enough published coverage exists", () => {
    const category = "AI Coding Agents";
    const template = seedArticles[0];
    const articles = Array.from({ length: 5 }, (_, index) => ({
      ...template,
      id: `published-category-${index}`,
      slug: `published-category-${index}`,
      category,
      status: "published" as const,
    }));

    expect(shouldIndexCategoryHub(category, articles)).toBe(true);
    expect(getIndexableCategoryNames(articles)).toContain(category);
  });

  it("keeps unknown category archives noindex", () => {
    expect(getCategoryHub("Unmapped Topic")).toBeUndefined();
    expect(getCategoryGuides("Unmapped Topic")).toEqual([]);
    expect(shouldIndexCategoryHub("Unmapped Topic", seedArticles)).toBe(false);
  });
});
