import { describe, expect, it } from "vitest";

import { fromBackendArticle } from "../lib/api";

describe("API article mapping", () => {
  it("maps backend entity IDs into the frontend article model", () => {
    const article = fromBackendArticle({
      id: "article-test",
      title: "OpenAI Codex Update",
      slug: "openai-codex-update",
      summary: "A sourced update about Codex.",
      category: "AI Coding Agents",
      tags: ["codex"],
      author_name: "Editorial Automation Desk",
      status: "published",
      keywords: ["OpenAI Codex"],
      entity_ids: ["openai", "chatgpt", "openai-codex"],
      blocks: [],
      sources: [],
      published_at: "2026-06-01T00:00:00Z",
      updated_at: "2026-06-02T00:00:00Z",
      version: 1,
    });

    expect(article.entityIds).toEqual(["openai", "chatgpt", "openai-codex"]);
  });
});
