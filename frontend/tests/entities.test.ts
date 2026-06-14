import { describe, expect, it } from "vitest";

import { brandEntities, getArticleEntities } from "../lib/entities";
import { buildArticleJsonLd } from "../lib/seo";
import { seedArticles } from "../lib/seed";
import { buildSitemapEntries } from "../lib/sitemap";

describe("brand entity ledger", () => {
  it("tracks requested AI brands as sourced entities without implying endorsement", () => {
    const requiredNames = [
      "OpenAI",
      "ChatGPT",
      "Anthropic",
      "Claude Code",
      "Microsoft",
      "GitHub",
      "GitHub Copilot",
      "Google",
      "Gemini",
      "Grok",
      "xAI",
    ];

    for (const name of requiredNames) {
      const entity = brandEntities.find((item) => item.name === name);

      expect(entity, `${name} should be present`).toBeDefined();
      expect(entity?.officialUrl).toMatch(/^https:\/\//);
      expect(entity?.mentionPolicy.toLowerCase()).toContain("not an endorsement");
      expect(entity?.sourceType).toBe("official");
    }
  });

  it("attaches only vetted entity references to articles and Article JSON-LD mentions", () => {
    const openAiArticle = seedArticles.find((article) => article.slug === "openai-codex-plugins-sites-annotations");
    const claudeArticle = seedArticles.find((article) => article.slug === "claude-code-dynamic-workflows-parallel-subagents");

    expect(openAiArticle).toBeDefined();
    expect(claudeArticle).toBeDefined();

    const openAiEntities = getArticleEntities(openAiArticle!);
    const claudeEntities = getArticleEntities(claudeArticle!);

    expect(openAiEntities.map((entity) => entity.name)).toEqual(expect.arrayContaining(["OpenAI", "ChatGPT"]));
    expect(claudeEntities.map((entity) => entity.name)).toEqual(expect.arrayContaining(["Anthropic", "Claude Code"]));
    expect([...openAiEntities, ...claudeEntities].every((entity) => entity.officialUrl.startsWith("https://"))).toBe(true);

    const jsonLd = buildArticleJsonLd(openAiArticle!);
    expect(jsonLd.mentions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ "@type": "Organization", name: "OpenAI", sameAs: "https://openai.com/" }),
        expect.objectContaining({ "@type": "SoftwareApplication", name: "ChatGPT", sameAs: "https://chatgpt.com/" }),
      ])
    );
  });

  it("keeps the public entity ledger indexable in the sitemap", () => {
    const entries = buildSitemapEntries(seedArticles);

    expect(entries.map((entry) => entry.loc)).toContain("https://www.kyenai.com/entities");
  });
});
