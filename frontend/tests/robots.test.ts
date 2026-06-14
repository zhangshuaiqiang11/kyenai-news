import { describe, expect, it } from "vitest";

import { buildRobotsTxt } from "../lib/robots";

describe("robots helpers", () => {
  it("allows public pages, excludes operations, and points to the canonical sitemap", () => {
    const robots = buildRobotsTxt();

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Disallow: /operations");
    expect(robots).toContain("Disallow: /api/");
    expect(robots).not.toContain("Disallow: /tags");
    expect(robots).toContain("Sitemap: https://www.kyenai.com/sitemap.xml");
  });

  it("explicitly allows verified search and AI answer crawlers without exposing operational routes", () => {
    const robots = buildRobotsTxt();
    const allowedAgents = [
      "Googlebot",
      "Googlebot-Image",
      "GoogleOther",
      "Google-Extended",
      "Bingbot",
      "BingPreview",
      "OAI-SearchBot",
      "ChatGPT-User",
      "GPTBot",
      "PerplexityBot",
      "Perplexity-User",
      "ClaudeBot",
      "Claude-SearchBot",
      "Claude-User",
      "Bytespider",
    ];

    for (const agent of allowedAgents) {
      expect(robots).toContain(
        [`User-agent: ${agent}`, "Allow: /", "Disallow: /operations", "Disallow: /api/"].join("\n"),
      );
    }
  });

  it("does not invent unverified AI crawler names for platforms without public robots tokens", () => {
    const robots = buildRobotsTxt();

    expect(robots).toContain("Unknown or unpublished AI crawlers are covered by the open default group");
    expect(robots).toContain("Tencent Yuanbao");
    expect(robots).toContain("xAI Grok");
    expect(robots).toContain("Zhipu GLM");
    expect(robots).toContain("MiniMax");
    expect(robots).toContain("Doubao-specific");
    expect(robots).not.toContain("User-agent: YuanbaoBot");
    expect(robots).not.toContain("User-agent: GrokBot");
    expect(robots).not.toContain("User-agent: GLMBot");
    expect(robots).not.toContain("User-agent: MiniMaxBot");
    expect(robots).not.toContain("User-agent: DoubaoBot");
  });
});
