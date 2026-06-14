/** @vitest-environment jsdom */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BenchmarkPanel } from "../components/BenchmarkPanel";
import GuidePage, { loadInstructionResources } from "../pages/guides/[slug]";
import GuidesPage, { getStaticProps as getGuidesStaticProps } from "../pages/guides";
import { getStaticProps as getHomeStaticProps } from "../pages";
import { getGuide, getGuides, getInternalLinkedGuides } from "../lib/guides";
import { buildFaqPageJsonLd, buildGuideFaqs, buildGuideJsonLd } from "../lib/seo";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

const privateGuideFields = [
  "priority",
  "primaryKeyword",
  "demandScore",
  "attackabilityScore",
  "fitScore",
  "gscWatchQueries",
] as const;

const privateScoringLabels = [
  "Primary keyword",
  "Demand",
  "Attackability",
  "KyenAI fit",
  "GSC query watchlist",
  "P0",
  "P1",
  "P2",
] as const;

const targetGuideSlugs = [
  "agents-md-vs-claude-md-cursorrules-copilot-instructions",
  "secure-mcp-servers-ai-coding-agents",
] as const;

vi.mock("next/router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("public guide SEO copy", () => {
  it("keeps the source-backed guide promise and excludes internal demand language from the homepage", () => {
    const testDirectory = dirname(fileURLToPath(import.meta.url));
    const homepageSource = readFileSync(resolve(testDirectory, "../pages/index.tsx"), "utf8");

    expect(homepageSource).toContain(
      "Compare Codex, Claude Code, Copilot, Cursor, and other AI coding agents with source-backed setup, security, migration, and workflow guides.",
    );
    expect(homepageSource).not.toMatch(/Search-demand-tested/i);
    expect(homepageSource).not.toMatch(/Validated demand pages/i);
    expect(homepageSource).not.toMatch(/Prioritized by real demand/i);
  });

  it("keeps editorial signals out of public guide data", () => {
    const serializedGuides = JSON.stringify(getGuides());

    for (const field of privateGuideFields) {
      expect.soft(serializedGuides, field).not.toContain(`"${field}"`);
    }
  });

  it("keeps internal SEO production notes out of reader-facing guide content", () => {
    const serializedGuides = JSON.stringify(getGuides());

    for (const internalPhrase of [
      "fast SEO page",
      "explicit migration demand",
      "published quickly",
      "pass relevance",
      "news cycle cools",
    ]) {
      expect.soft(serializedGuides, internalPhrase).not.toMatch(
        new RegExp(internalPhrase, "i"),
      );
    }
  });

  it("keeps editorial signals out of guide index page props", () => {
    const serializedProps = JSON.stringify(getGuidesStaticProps());

    for (const field of privateGuideFields) {
      expect.soft(serializedProps, field).not.toContain(`"${field}"`);
    }
  });

  it("keeps editorial signals out of homepage props", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const serializedProps = JSON.stringify(await getHomeStaticProps());

    for (const field of privateGuideFields) {
      expect.soft(serializedProps, field).not.toContain(`"${field}"`);
    }
  });

  it("keeps internal SEO planning fields out of the guide detail page", () => {
    const guide = getGuide("codex-vs-claude-code");

    expect(guide).toBeDefined();
    render(
      <GuidePage
        guide={guide!}
        relatedGuides={getInternalLinkedGuides(guide!)}
        relatedArticles={[]}
      />,
    );

    for (const internalLabel of [
      "Primary keyword",
      "Demand",
      "Attackability",
      "KyenAI fit",
      "GSC query watchlist",
      "P0",
    ]) {
      expect.soft(screen.queryAllByText(internalLabel), internalLabel).toHaveLength(0);
    }
    expect(screen.queryAllByText("Use this guide to")).toHaveLength(1);
    expect.soft(screen.queryAllByRole("heading", { name: /quick answer/i })).toHaveLength(1);
  });

  it.each(targetGuideSlugs)("keeps internal editorial fields and scoring labels out of %s public output", (slug) => {
    const guide = getGuide(slug);

    expect(guide).toBeDefined();
    const guideJsonLd = buildGuideJsonLd(guide!);
    const faqJsonLd = buildFaqPageJsonLd(buildGuideFaqs(guide!));
    const serializedPublicData = JSON.stringify({ guide, guideJsonLd, faqJsonLd });

    render(
      <GuidePage
        guide={guide!}
        relatedGuides={getInternalLinkedGuides(guide!)}
        relatedArticles={[]}
      />,
    );

    for (const field of privateGuideFields) {
      expect.soft(serializedPublicData, field).not.toContain(`"${field}"`);
    }
    for (const label of privateScoringLabels) {
      expect.soft(screen.queryAllByText(label, { exact: true }), label).toHaveLength(0);
    }

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    expect(canonical?.href).toBe(`https://www.kyenai.com/guides/${slug}`);

    const evidenceSection = screen.getByRole("heading", { name: "Evidence sources" }).closest("section");
    expect(evidenceSection).not.toBeNull();
    const visibleEvidenceUrls = within(evidenceSection!)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(visibleEvidenceUrls).toEqual(guide!.evidence.map((source) => source.url));
    expect(buildGuideJsonLd(guide!).citation).toEqual(visibleEvidenceUrls);
  });

  it("code-splits instruction resources without static component imports", () => {
    const testDirectory = dirname(fileURLToPath(import.meta.url));
    const guidePageSource = readFileSync(resolve(testDirectory, "../pages/guides/[slug].tsx"), "utf8");

    expect(guidePageSource).toContain('import dynamic from "next/dynamic"');
    expect(guidePageSource).toMatch(
      /dynamic\(\s*\(\)\s*=>\s*import\("\.\.\/\.\.\/components\/InstructionGuideResources"\)/,
    );
    expect(guidePageSource).toMatch(
      /dynamic\(\s*\(\)\s*=>\s*import\("\.\.\/\.\.\/components\/McpSecurityControls"\)/,
    );
    expect(guidePageSource).not.toMatch(
      /import\s+\{[^}]*InstructionCompatibilityMatrix[^}]*\}\s+from\s+["'][^"']+["']/,
    );
    expect(guidePageSource).not.toMatch(
      /import\s+\{[^}]*(BenchmarkPanel|InstructionScopeGuide|RepositoryTree|TemplateDownloads)[^}]*\}\s+from\s+["'][^"']+["']/,
    );
  });

  it("renders instruction resources in server HTML only for the instruction-file guide", async () => {
    const guide = getGuide("agents-md-vs-claude-md-cursorrules-copilot-instructions");

    expect(guide).toBeDefined();
    const relatedGuides = getInternalLinkedGuides(guide!);
    const InstructionResources = await loadInstructionResources();
    const resourceMarkup = renderToStaticMarkup(<InstructionResources />);

    expect(resourceMarkup).toContain("Instruction file compatibility");
    expect(resourceMarkup).toContain("Instruction scope guide");
    expect(resourceMarkup).toContain("Repository instruction tree");
    expect(resourceMarkup).toContain("Instruction template downloads");
    expect(resourceMarkup).toContain("Same-repository benchmark");
    expect(resourceMarkup).toContain("Not measured");
    expect(resourceMarkup).toContain("/resources/instruction-files/AGENTS.md");

    render(<GuidePage guide={guide!} relatedGuides={relatedGuides} relatedArticles={[]} />);
    await screen.findByRole("heading", { name: /instruction file compatibility/i });

    const answerPanel = screen.getByRole("heading", { name: /^quick answer$/i }).closest("section");
    expect(answerPanel?.textContent).toMatch(
      /GitHub Copilot support for CLAUDE\.md depends on the Copilot surface/i,
    );
    expect(answerPanel?.textContent).toMatch(/selected cloud-agent surfaces support it/i);
    expect(answerPanel?.textContent).toMatch(/many Copilot Chat, code-review, and CLI surfaces do not/i);
    expect(answerPanel?.textContent).toContain(".github/copilot-instructions.md");

    expect(screen.getByRole("heading", { name: /instruction file compatibility/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /instruction scope guide/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /repository instruction tree/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /instruction template downloads/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /same-repository benchmark/i })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /download/i })).toHaveLength(4);
    expect(screen.getAllByText(/\.cursor\/rules\//i, { selector: "code" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Not measured").length).toBeGreaterThan(0);
    const quickAnswerHeading = screen.getByRole("heading", { name: /^quick answer$/i });
    const compatibilityHeading = screen.getByRole("heading", { name: /instruction file compatibility/i });
    const articleHeading = screen.getByRole("heading", { name: /compatibility is a surface policy/i });
    expect(quickAnswerHeading.compareDocumentPosition(compatibilityHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(compatibilityHeading.compareDocumentPosition(articleHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    cleanup();

    const unrelatedGuide = getGuide("codex-vs-claude-code");
    expect(unrelatedGuide).toBeDefined();
    render(
      <GuidePage
        guide={unrelatedGuide!}
        relatedGuides={getInternalLinkedGuides(unrelatedGuide!)}
        relatedArticles={[]}
      />,
    );
    expect(screen.queryByRole("heading", { name: /instruction file compatibility/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /instruction template downloads/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /same-repository benchmark/i })).toBeNull();
  });

  it("keeps public benchmark JSON and visible benchmark status in agreement without zero or estimate claims", () => {
    const testDirectory = dirname(fileURLToPath(import.meta.url));
    const benchmarkResults = JSON.parse(
      readFileSync(
        resolve(testDirectory, "../public/resources/instruction-files/benchmark-results.json"),
        "utf8",
      ),
    ) as {
      status: string;
      runs: Array<{
        id: string;
        toolId: "openai-codex" | "claude-code" | "github-copilot" | "cursor";
        status: string;
        elapsedSeconds: number | null;
        measuredCostUsd: number | null;
        humanInterventions: number | null;
        filesChanged: number | null;
        verificationPassed: boolean | null;
      }>;
    };

    render(<BenchmarkPanel />);

    expect(benchmarkResults.status).toBe("Not measured");
    expect(benchmarkResults.runs).toHaveLength(4);
    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(benchmarkResults.runs.length);
    const expectedToolNames = {
      "openai-codex": "OpenAI Codex",
      "claude-code": "Claude Code",
      "github-copilot": "GitHub Copilot",
      cursor: "Cursor",
    } as const;
    expect(new Set(benchmarkResults.runs.map((run) => run.id)).size).toBe(
      benchmarkResults.runs.length,
    );
    expect(new Set(benchmarkResults.runs.map((run) => run.toolId)).size).toBe(
      benchmarkResults.runs.length,
    );

    benchmarkResults.runs.forEach((run, index) => {
      expect(run.status).toBe("not-measured");
      expect(run.elapsedSeconds).toBeNull();
      expect(run.measuredCostUsd).toBeNull();
      expect(run.humanInterventions).toBeNull();
      expect(run.filesChanged).toBeNull();
      expect(run.verificationPassed).toBeNull();

      expect(within(rows[index]).getByRole("rowheader").textContent).toBe(
        expectedToolNames[run.toolId],
      );
      const cells = within(rows[index]).getAllByRole("cell");
      expect(cells).toHaveLength(5);
      for (const cell of cells) {
        expect(cell.textContent).toBe("Not measured");
      }
    });

    const markup = document.body.textContent || "";
    expect(markup).not.toMatch(/\b0 seconds\b|\$0(?:\.00)?|\bestimated?\b/i);
  });

  it("keeps static resource downloads as ordinary links and out of guide JSON-LD", async () => {
    const instructionGuide = getGuide("agents-md-vs-claude-md-cursorrules-copilot-instructions");
    const mcpGuide = getGuide("secure-mcp-servers-ai-coding-agents");

    expect(instructionGuide).toBeDefined();
    expect(mcpGuide).toBeDefined();

    const InstructionResources = await loadInstructionResources();
    const resourceMarkup = renderToStaticMarkup(<InstructionResources />);
    const downloadPaths = [
      "/resources/instruction-files/AGENTS.md",
      "/resources/instruction-files/CLAUDE.md",
      "/resources/instruction-files/copilot-instructions.md",
      "/resources/instruction-files/cursor-project-rule.mdc",
    ];

    for (const path of downloadPaths) {
      expect(resourceMarkup).toContain(`href="${path}"`);
    }
    expect(resourceMarkup).not.toContain('type="application/ld+json"');

    const serializedSchemas = JSON.stringify([
      buildGuideJsonLd(instructionGuide!),
      buildFaqPageJsonLd(buildGuideFaqs(instructionGuide!)),
      buildGuideJsonLd(mcpGuide!),
      buildFaqPageJsonLd(buildGuideFaqs(mcpGuide!)),
    ]);
    expect(serializedSchemas).not.toContain("/resources/");
    expect(serializedSchemas).not.toMatch(/DataDownload|DigitalDocument|Dataset/);
  });

  it("uses audience-focused copy instead of SEO scoring on the guide index", () => {
    const guides = ["codex-vs-claude-code", "agents-md-template-for-ai-coding-agents"].map((slug) => {
      const guide = getGuide(slug);

      expect(guide, `${slug} should be present`).toBeDefined();
      return guide!;
    });

    render(<GuidesPage guides={guides} />);

    for (const internalLabel of ["Demand", "Attackability", "Fit", "P0"]) {
      expect.soft(screen.queryAllByText(internalLabel), internalLabel).toHaveLength(0);
    }

    const guideCards = screen.getAllByRole("article");
    expect.soft(guideCards).toHaveLength(2);
    for (const guideCard of guideCards) {
      expect.soft(within(guideCard).queryAllByText(/^Who it helps:$/i)).toHaveLength(1);
    }
  });
});
