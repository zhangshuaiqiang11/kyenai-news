/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ArticlePage from "../pages/articles/[slug]";
import { getVisibleArticleFaqs } from "../lib/article-faqs";
import { getRelatedGuidesForArticle } from "../lib/article-guide-links";
import { mergeFeaturedArticles } from "../lib/api";
import { spacexCursorAcquisitionArticle } from "../lib/articles/spacex-cursor-acquisition";
import { buildSitemapEntries } from "../lib/sitemap";
import { buildArticleJsonLd, buildFaqPageJsonLd, countArticleWords } from "../lib/seo";
import { seedArticles } from "../lib/seed";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => cleanup());

describe("SpaceX Cursor acquisition article", () => {
  it("keeps the deal status precise and source-backed", () => {
    const article = spacexCursorAcquisitionArticle;
    const visibleText = [article.summary, ...article.blocks.map((block) => block.content)].join(" ");

    expect(article.slug).toBe("spacex-cursor-acquisition-2026");
    expect(article.status).toBe("published");
    expect(article.publishedAt).toContain("2026-06-16");
    expect(article.sources.map((source) => source.publisher)).toEqual([
      "Reuters",
      "Axios",
      "Financial Times",
    ]);
    expect(visibleText).toMatch(/signed acquisition agreement/i);
    expect(visibleText).toMatch(/not a completed closing|has not yet closed|closing still pending/i);
    expect(visibleText).toMatch(/all-stock/i);
    expect(visibleText).toMatch(/third quarter of 2026/i);
    expect(countArticleWords(article)).toBeGreaterThanOrEqual(850);
  });

  it("uses the authored FAQ for visible content and FAQPage schema", () => {
    const faqs = getVisibleArticleFaqs(spacexCursorAcquisitionArticle);
    const faqJsonLd = buildFaqPageJsonLd(faqs);

    expect(faqs).toHaveLength(5);
    expect(faqs[0].question).toBe("Has SpaceX completed its acquisition of Cursor?");
    expect(faqs[0].answer).toMatch(/still pending closing/i);
    expect(faqJsonLd.mainEntity).toHaveLength(5);
    expect(faqJsonLd.mainEntity[0].acceptedAnswer.text).toBe(faqs[0].answer);
  });

  it("publishes citations and article metadata in JSON-LD", () => {
    const articleJsonLd = buildArticleJsonLd(spacexCursorAcquisitionArticle);

    expect(articleJsonLd["@type"]).toBe("NewsArticle");
    expect(articleJsonLd.datePublished).toBe(spacexCursorAcquisitionArticle.publishedAt);
    expect(articleJsonLd.dateModified).toBe(spacexCursorAcquisitionArticle.updatedAt);
    expect(articleJsonLd.citation).toEqual(
      spacexCursorAcquisitionArticle.sources.map((source) => source.url),
    );
    expect(articleJsonLd.url).toBe(
      "https://www.kyenai.com/articles/spacex-cursor-acquisition-2026",
    );
  });

  it("merges the article into public collections without creating duplicates", () => {
    const merged = mergeFeaturedArticles([
      ...seedArticles,
      { ...spacexCursorAcquisitionArticle, title: "Stale backend copy" },
    ]);
    const matches = merged.filter(
      (article) => article.slug === spacexCursorAcquisitionArticle.slug,
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].title).toBe(spacexCursorAcquisitionArticle.title);
    expect(merged[0].slug).toBe(spacexCursorAcquisitionArticle.slug);
  });

  it("adds the article to the sitemap and unlocks the qualified AI coding hub", () => {
    const articles = mergeFeaturedArticles(seedArticles);
    const locations = buildSitemapEntries(articles).map((entry) => entry.loc);

    expect(locations).toContain(
      "https://www.kyenai.com/articles/spacex-cursor-acquisition-2026",
    );
    expect(locations).toContain("https://www.kyenai.com/categories/ai-coding-agents");
  });

  it("connects the acquisition news to durable comparison and governance guides", () => {
    const relatedGuides = getRelatedGuidesForArticle(spacexCursorAcquisitionArticle);

    expect(relatedGuides.map((guide) => guide.slug)).toEqual([
      "codex-vs-claude-code",
      "agent-governance-checklist-for-software-teams",
    ]);
  });

  it("renders the guide-style structure, evidence sources, and authored FAQ once", () => {
    const relatedGuides = getRelatedGuidesForArticle(spacexCursorAcquisitionArticle);
    render(
      <ArticlePage
        article={spacexCursorAcquisitionArticle}
        relatedArticles={[]}
        relatedGuides={relatedGuides}
      />,
    );

    expect(screen.getByRole("heading", { name: spacexCursorAcquisitionArticle.title })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /deal status: signed, not yet closed/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /kyenai view/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /questions this update answers/i })).toBeTruthy();
    expect(screen.getAllByText("Has SpaceX completed its acquisition of Cursor?")).toHaveLength(1);

    const evidenceSection = screen.getByRole("heading", { name: /evidence sources/i }).closest("section");
    expect(evidenceSection).not.toBeNull();
    const evidenceLinks = within(evidenceSection!).getAllByRole("link");
    expect(evidenceLinks.map((link) => link.getAttribute("href"))).toEqual(
      spacexCursorAcquisitionArticle.sources.map((source) => source.url),
    );

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    expect(canonical?.href).toBe(
      "https://www.kyenai.com/articles/spacex-cursor-acquisition-2026",
    );
  });
});
