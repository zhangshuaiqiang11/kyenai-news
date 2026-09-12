/** @vitest-environment jsdom */
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ArticlePage from "../pages/articles/[slug]";
import { getVisibleArticleFaqs } from "../lib/article-faqs";
import { getRelatedGuidesForArticle } from "../lib/article-guide-links";
import { mergeFeaturedArticles } from "../lib/api";
import { spacexCursorAcquisitionArticle } from "../lib/articles/spacex-cursor-acquisition";
import { buildSitemapEntries } from "../lib/sitemap";
import { buildArticleGraphJsonLd, buildArticleJsonLd, buildFaqPageJsonLd, countArticleWords } from "../lib/seo";
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
      "SEC",
      "SEC",
      "Cursor",
      "Reuters",
      "Axios",
      "Financial Times",
    ]);
    expect(visibleText).toMatch(/signed (?:all-stock )?merger agreement|signed acquisition agreement/i);
    expect(visibleText).toMatch(/Form 8-K/i);
    expect(visibleText).toMatch(/merger became effective|wholly owned subsidiary/i);
    expect(visibleText).toMatch(/all-stock/i);
    expect(visibleText).toMatch(/August 14, 2026/i);
    expect(countArticleWords(article)).toBeGreaterThanOrEqual(850);
  });

  it("uses the authored FAQ for visible content and FAQPage schema", () => {
    const faqs = getVisibleArticleFaqs(spacexCursorAcquisitionArticle);
    const faqJsonLd = buildFaqPageJsonLd(faqs);

    expect(faqs).toHaveLength(6);
    expect(faqs[0].question).toBe("Has SpaceX completed its acquisition of Cursor?");
    expect(faqs[0].answer).toMatch(/became effective|wholly owned subsidiary/i);
    expect(faqJsonLd.mainEntity).toHaveLength(6);
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
    expect(articleJsonLd).toMatchObject({
      hasPart: {
        "@id": "https://www.kyenai.com/articles/spacex-cursor-acquisition-2026#deal-status-dataset",
      },
    });
  });

  it("adds a source-linked Dataset node for the status and timeline downloads", () => {
    const article = spacexCursorAcquisitionArticle;
    const graph = buildArticleGraphJsonLd(article, [
      { name: "Home", path: "/" },
      { name: article.category, path: "/categories/ai-coding-agents" },
      { name: article.title, path: `/articles/${article.slug}` },
    ], getVisibleArticleFaqs(article));
    const dataset = graph["@graph"].find((node) => node["@type"] === "Dataset");

    expect(dataset).toBeDefined();
    expect(dataset?.distribution).toHaveLength(2);
    expect(JSON.stringify(dataset)).toContain("spacex-cursor-deal-status.json");
    expect(JSON.stringify(dataset)).toContain("spacex-cursor-deal-timeline.csv");
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
      "agents-md-vs-claude-md-cursorrules-copilot-instructions",
      "loop-engineering-ai-coding-agents",
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
    expect(screen.getByRole("heading", { name: /deal status: closed/i })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /current spacex-cursor deal status/i })).toBeTruthy();
    expect(screen.getByText(/product collaboration is separate evidence from the legal closing record/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /download status json/i }).getAttribute("href")).toBe(
      "/resources/data/spacex-cursor-deal-status.json",
    );
    expect(screen.getByRole("link", { name: /download team checklist/i }).getAttribute("href")).toBe(
      "/resources/cursor-change-of-control-review.md",
    );
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

  it("renders passage-level source links from each block's source IDs", () => {
    const cursorArticle = seedArticles.find(
      (article) => article.slug === "cursor-enterprise-organizations-governance",
    )!;
    render(<ArticlePage article={cursorArticle} relatedArticles={[]} relatedGuides={[]} />);

    const citationGroups = screen.getAllByLabelText("Sources for this passage");
    expect(citationGroups.length).toBeGreaterThanOrEqual(4);
    expect(
      within(citationGroups[0]).getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual(cursorArticle.sources.map((source) => source.url));
  });

  it("keeps the public status resources aligned with the visible verification record", () => {
    const resourcesDir = fs.existsSync(path.resolve("public/resources"))
      ? path.resolve("public/resources")
      : path.resolve("frontend/public/resources");
    const status = JSON.parse(
      fs.readFileSync(path.join(resourcesDir, "data/spacex-cursor-deal-status.json"), "utf8"),
    );
    const timeline = fs
      .readFileSync(path.join(resourcesDir, "data/spacex-cursor-deal-timeline.csv"), "utf8")
      .trim()
      .split("\n");
    const checklist = fs.readFileSync(
      path.join(resourcesDir, "cursor-change-of-control-review.md"),
      "utf8",
    );

    expect(status.as_of).toBe("2026-09-12");
    expect(status.status).toBe("closed");
    expect(status.page_url).toContain(spacexCursorAcquisitionArticle.slug);
    expect(timeline).toHaveLength(6);
    expect(timeline[0]).toBe("date,event,status,evidence_url");
    expect(checklist).toContain("Closing publicly confirmed");
    expect(checklist).toContain("not legal advice");
  });
});
