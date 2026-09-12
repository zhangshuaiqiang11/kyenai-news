import { describe, expect, it } from "vitest";

import { mergeFeaturedArticles } from "../lib/api";
import { seedArticles } from "../lib/seed";
import { buildDefaultUrlList } from "../pages/api/indexnow";
import { validateIndexNowUrls } from "../lib/indexnow";

describe("IndexNow default URL list", () => {
  it("includes published articles and the instruction-file checker", () => {
    const urls = buildDefaultUrlList(mergeFeaturedArticles(seedArticles));

    expect(urls).toContain("https://www.kyenai.com/articles/spacex-cursor-acquisition-2026");
    expect(urls).toContain("https://www.kyenai.com/articles/cursor-enterprise-organizations-governance");
    expect(urls).toContain("https://www.kyenai.com/tools/instruction-file-checker");
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("IndexNow URL validation", () => {
  it("accepts only canonical KyenAI HTTPS URLs and removes fragments and duplicates", () => {
    const result = validateIndexNowUrls([
      "https://www.kyenai.com/guides#answer",
      "https://www.kyenai.com/guides",
    ]);

    expect(result.errors).toEqual([]);
    expect(result.urls).toEqual(["https://www.kyenai.com/guides"]);
  });

  it("rejects off-site and non-HTTPS submissions", () => {
    const result = validateIndexNowUrls([
      "https://example.com/spam",
      "http://www.kyenai.com/guides",
      "not-a-url",
    ]);

    expect(result.urls).toEqual([]);
    expect(result.errors).toHaveLength(3);
  });
});
