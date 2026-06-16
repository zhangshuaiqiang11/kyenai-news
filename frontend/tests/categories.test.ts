import { describe, expect, it } from "vitest";

import { buildCategoryPath, buildCategorySlug, isCanonicalCategoryParam, resolveCategoryFromParam } from "../lib/categories";
import { seedArticles } from "../lib/seed";

describe("category helpers", () => {
  const categories = Array.from(new Set(seedArticles.map((article) => article.category)));

  it("builds kebab-case category slugs", () => {
    expect(buildCategorySlug("AI Coding Agents")).toBe("ai-coding-agents");
    expect(buildCategorySlug("IDE & CLI")).toBe("ide-cli");
    expect(buildCategorySlug("Security & Governance")).toBe("security-governance");
    expect(buildCategorySlug("Agent Workflows")).toBe("agent-workflows");
  });

  it("builds canonical category paths from display names", () => {
    expect(buildCategoryPath("AI Coding Agents")).toBe("/categories/ai-coding-agents");
    expect(buildCategoryPath("IDE & CLI")).toBe("/categories/ide-cli");
  });

  it("resolves legacy encoded category params to display names", () => {
    expect(resolveCategoryFromParam("AI%20Coding%20Agents", categories)).toBe("AI Coding Agents");
    expect(resolveCategoryFromParam("ide-cli", categories)).toBe("IDE & CLI");
  });

  it("flags non-canonical category params for redirect", () => {
    expect(isCanonicalCategoryParam("ai-coding-agents", "AI Coding Agents")).toBe(true);
    expect(isCanonicalCategoryParam("AI%20Coding%20Agents", "AI Coding Agents")).toBe(false);
  });
});
