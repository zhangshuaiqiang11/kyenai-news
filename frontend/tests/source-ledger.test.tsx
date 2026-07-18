/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getGuides } from "../lib/guides";
import { seedArticles } from "../lib/seed";
import { buildSourceLedger, getSourceLedgerCoverage, type SourceLedgerEntry } from "../lib/source-ledger";
import type { Article, Guide } from "../lib/types";
import SourcesPage from "../pages/sources";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => cleanup());

describe("source verification ledger", () => {
  it("covers every guide and every sourced published article", () => {
    const guides = getGuides();
    const entries = buildSourceLedger(seedArticles, guides, "2026-07-19");
    const coverage = getSourceLedgerCoverage(entries);
    const sourcedPublishedArticles = seedArticles.filter(
      (article) => article.status === "published" && article.sources.length > 0,
    );

    expect(entries.length).toBeGreaterThan(0);
    expect(coverage.guides).toBe(guides.length);
    expect(coverage.articles).toBe(sourcedPublishedArticles.length);
    expect(coverage.publishers).toBeGreaterThan(0);
  });

  it("normalizes duplicate URLs and assigns a deterministic review status", () => {
    const article: Article = {
      ...seedArticles[0],
      id: "ledger-article",
      slug: "ledger-article",
      title: "Ledger article",
      status: "published",
      updatedAt: "2026-07-01T12:00:00Z",
      sources: [{
        id: "openai-api",
        title: "OpenAI API reference",
        url: "https://platform.openai.com/docs/api-reference?utm_source=ledger#models",
        publisher: "OpenAI",
        publishedAt: "2026-06-01",
        credibility: 0.99,
      }],
      blocks: [{ id: "fact", type: "paragraph", content: "Verified fact.", sourceIds: ["openai-api"] }],
    };
    const guide: Guide = {
      ...getGuides()[0],
      id: "ledger-guide",
      slug: "ledger-guide",
      title: "Ledger guide",
      updatedAt: "2026-07-10T09:00:00Z",
      evidence: [{
        title: "OpenAI API reference",
        url: "https://platform.openai.com/docs/api-reference?utm_medium=guide",
        publisher: "OpenAI",
        note: "Confirms the supported API surface.",
      }],
    };

    const entries = buildSourceLedger([article], [guide], "2026-07-25");

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      url: "https://platform.openai.com/docs/api-reference",
      sourceType: "Official documentation",
      confidence: "High",
      lastVerifiedAt: "2026-07-10",
      nextReviewAt: "2026-07-24",
      reviewCadenceDays: 14,
      status: "Review due",
    });
    expect(entries[0].usedBy).toHaveLength(2);
    expect(entries[0].usedBy.find((usage) => usage.kind === "Article")?.passages).toBe(1);
  });

  it("distinguishes regulatory records from independent reporting", () => {
    const article: Article = {
      ...seedArticles[0],
      id: "filing-article",
      slug: "filing-article",
      title: "Filing article",
      status: "published",
      updatedAt: "2026-07-19",
      sources: [{
        id: "sec-filing",
        title: "Issuer Form 8-K",
        url: "https://www.sec.gov/Archives/example.htm",
        publisher: "SEC",
        publishedAt: "2026-07-01",
        credibility: 1,
      }],
      blocks: [{ id: "filing", type: "paragraph", content: "Filing fact.", sourceIds: ["sec-filing"] }],
    };

    const [entry] = buildSourceLedger([article], [], "2026-07-19");

    expect(entry).toMatchObject({
      sourceType: "Primary filing or record",
      confidence: "High",
      reviewCadenceDays: 90,
    });
  });

  it("renders coverage, verification metadata, usage links, and ItemList schema", () => {
    const source: SourceLedgerEntry = {
      title: "Model Context Protocol specification",
      url: "https://modelcontextprotocol.io/specification",
      publisher: "Model Context Protocol",
      sourceType: "Standards or methodology",
      confidence: "High",
      publishedAt: null,
      lastVerifiedAt: "2026-07-19",
      nextReviewAt: "2026-10-17",
      reviewCadenceDays: 90,
      status: "Current",
      supersededBy: null,
      usedBy: [{
        kind: "Guide",
        path: "/guides/secure-mcp-servers-ai-coding-agents",
        slug: "secure-mcp-servers-ai-coding-agents",
        title: "MCP Server Security Checklist",
        passages: null,
        verifiedAt: "2026-07-19",
        note: "Defines the protocol security model.",
      }],
    };

    render(<SourcesPage sources={[source]} />);

    expect(screen.getByRole("heading", { level: 1, name: "Source & Verification Ledger" })).toBeTruthy();
    expect(screen.getByText("Standards or methodology")).toBeTruthy();
    expect(screen.getByText("90 days")).toBeTruthy();
    expect(screen.getByRole("link", { name: "MCP Server Security Checklist" }).getAttribute("href"))
      .toBe("/guides/secure-mcp-servers-ai-coding-agents");
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toContain("BreadcrumbList");
    expect(Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .some((node) => node.textContent?.includes('"@type":"ItemList"'))).toBe(true);
  });
});
