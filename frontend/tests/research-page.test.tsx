/** @vitest-environment jsdom */
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ResearchPage from "../pages/research";
import { buildLlmsTxt } from "../lib/llms";
import { buildSitemapEntries } from "../lib/sitemap";
import { seedArticles } from "../lib/seed";

(globalThis as typeof globalThis & { React: typeof React }).React = React;
vi.mock("next/head", () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("next/router", () => ({ useRouter: () => ({ push: vi.fn() }) }));
afterEach(cleanup);

describe("research resource center", () => {
  it("renders five versioned assets with direct downloads and citation guidance", () => {
    render(<ResearchPage />);
    expect(screen.getByRole("heading", { name: /KyenAI Research & Resource Center/i })).toBeTruthy();
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.getByRole("link", { name: /Complete ZIP/i }).getAttribute("href"))
      .toBe("/resources/instruction-files/kyenai-agents-md-starter-pack.zip");
    expect(screen.getByRole("link", { name: /PDF/i }).getAttribute("href"))
      .toBe("/resources/cursor-enterprise-security-controls.pdf");
    const schema = document.querySelector('script[type="application/ld+json"]')?.textContent || "";
    expect(schema).toContain('"CollectionPage"');
    expect(schema).toContain('"Dataset"');
    expect(schema).toContain('"CreativeWork"');
    expect(schema).toContain('"DataDownload"');
  });

  it("adds the indexable page to sitemap and AI crawler guidance", () => {
    const locations = buildSitemapEntries(seedArticles).map((entry) => entry.loc);
    expect(locations).toContain("https://www.kyenai.com/research");
    expect(buildLlmsTxt()).toContain("https://www.kyenai.com/research");
  });

  it("ships the versioned AGENTS.md ZIP package", () => {
    const root = fs.existsSync(path.resolve("public/resources"))
      ? path.resolve("public/resources")
      : path.resolve("frontend/public/resources");
    const zipPath = path.join(root, "instruction-files/kyenai-agents-md-starter-pack.zip");
    const zip = fs.readFileSync(zipPath);
    expect(zip.subarray(0, 2).toString()).toBe("PK");
    expect(zip.length).toBeGreaterThan(3_000);
  });
});
