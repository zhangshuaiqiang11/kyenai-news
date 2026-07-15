import { afterEach, describe, expect, it, vi } from "vitest";

import { featuredArticles } from "../lib/articles/spacex-cursor-acquisition";
import { fromBackendArticle, getArticle, mergeCanonicalArticles, mergeFeaturedArticles, selectCanonicalArticle } from "../lib/api";
import { seedArticles } from "../lib/seed";

describe("API article mapping", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });
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

  it("keeps the richer curated article when backend content has the same version", () => {
    const curated = seedArticles.find((article) => article.slug === "cursor-enterprise-organizations-governance")!;
    const backendCopy = {
      ...curated,
      blocks: curated.blocks.slice(0, 2),
      sources: curated.sources.slice(0, 1),
      metaDescription: curated.summary,
    };

    const selected = selectCanonicalArticle(backendCopy, curated);

    expect(selected).toBe(curated);
    if (!selected) throw new Error("Expected a canonical article");
    expect(selected.sources).toHaveLength(3);
    expect(selected.blocks.some((block) => block.type === "fact_table")).toBe(true);
    expect(selected.blocks.filter((block) => block.type === "faq")).toHaveLength(2);
    expect(selected.blocks.some((block) => block.type === "source_note")).toBe(true);
    expect(selected.metaDescription).toBe(curated.metaDescription);
    expect(selected.entityIds).toEqual(["cursor"]);
  });

  it("allows a genuinely newer backend version to replace the curated record", () => {
    const curated = seedArticles[0];
    const newerBackend = { ...curated, title: "Newer backend edition", version: curated.version + 1 };

    expect(selectCanonicalArticle(newerBackend, curated)).toBe(newerBackend);
  });

  it("merges canonical article lists without duplicate slugs", () => {
    const curated = seedArticles.find((article) => article.slug === "cursor-enterprise-organizations-governance")!;
    const backendCopy = { ...curated, sources: curated.sources.slice(0, 1) };
    const merged = mergeCanonicalArticles([backendCopy], [curated]);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toBe(curated);
  });

  it("preserves a newer backend edition when merging a featured article", () => {
    const featured = featuredArticles[0];
    const newerBackend = { ...featured, title: "Newer SpaceX backend edition", version: featured.version + 1 };

    const merged = mergeFeaturedArticles([newerBackend]);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toBe(newerBackend);
  });

  it("allows getArticle to select a newer backend edition over featured content", async () => {
    const featured = featuredArticles[0];
    const backend = {
      id: featured.id,
      title: "Newer SpaceX backend edition",
      slug: featured.slug,
      summary: featured.summary,
      category: featured.category,
      tags: featured.tags,
      author_name: featured.authorName,
      status: featured.status,
      keywords: featured.keywords,
      entity_ids: featured.entityIds,
      blocks: featured.blocks.map((block) => ({
        id: block.id,
        type: block.type,
        content: block.content,
        source_ids: block.sourceIds,
      })),
      sources: featured.sources.map((source) => ({
        id: source.id,
        title: source.title,
        url: source.url,
        publisher: source.publisher,
        published_at: source.publishedAt,
        credibility: source.credibility,
      })),
      published_at: featured.publishedAt,
      updated_at: featured.updatedAt,
      version: featured.version + 1,
      meta_title: featured.metaTitle,
      meta_description: featured.metaDescription,
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => backend }));

    const selected = await getArticle(featured.slug);

    expect(selected?.title).toBe("Newer SpaceX backend edition");
    expect(selected?.version).toBe(featured.version + 1);
  });
});
