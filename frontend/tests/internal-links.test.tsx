/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Home from "../pages";
import GuidesPage, { guidesPageSeo } from "../pages/guides";
import {
  INSTRUCTION_COMPARISON_GUIDE_SLUG,
  LOOP_ENGINEERING_GUIDE_SLUG,
  MCP_SECURITY_GUIDE_SLUG,
} from "../lib/guide-routes";
import { getGuide, getGuides } from "../lib/guides";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const approvedGuidePlacements = [
  [INSTRUCTION_COMPARISON_GUIDE_SLUG, "agents-md-template-for-ai-coding-agents"],
  [INSTRUCTION_COMPARISON_GUIDE_SLUG, "does-github-copilot-read-claude-md-support-matrix"],
  [INSTRUCTION_COMPARISON_GUIDE_SLUG, "agents-md-examples-codex-node-python-monorepos"],
  ["agents-md-template-for-ai-coding-agents", INSTRUCTION_COMPARISON_GUIDE_SLUG],
  ["agents-md-template-for-ai-coding-agents", "agents-md-examples-codex-node-python-monorepos"],
  ["codex-vs-claude-code", INSTRUCTION_COMPARISON_GUIDE_SLUG],
  ["claude-code-hooks-mcp-setup", INSTRUCTION_COMPARISON_GUIDE_SLUG],
  ["agent-governance-checklist-for-software-teams", MCP_SECURITY_GUIDE_SLUG],
  ["local-vs-cloud-ai-coding-agent", MCP_SECURITY_GUIDE_SLUG],
  [INSTRUCTION_COMPARISON_GUIDE_SLUG, LOOP_ENGINEERING_GUIDE_SLUG],
  ["loop-engineering-ai-coding-agents", INSTRUCTION_COMPARISON_GUIDE_SLUG],
  ["codex-vs-claude-code", LOOP_ENGINEERING_GUIDE_SLUG],
  ["loop-engineering-ai-coding-agents", "codex-vs-claude-code"],
  ["claude-code-subagents-examples", LOOP_ENGINEERING_GUIDE_SLUG],
  ["agent-governance-checklist-for-software-teams", LOOP_ENGINEERING_GUIDE_SLUG],
  ["loop-engineering-ai-coding-agents", MCP_SECURITY_GUIDE_SLUG],
  [MCP_SECURITY_GUIDE_SLUG, LOOP_ENGINEERING_GUIDE_SLUG],
] as const;

const privateSeoLabels = [
  "Primary keyword",
  "Demand",
  "Attackability",
  "KyenAI fit",
  "GSC query watchlist",
  "P0",
] as const;

afterEach(() => {
  cleanup();
});

function getGuideRouteData() {
  const guides = getGuides();
  const validSlugs = new Set(guides.map((guide) => guide.slug));
  const validHrefs = new Set(guides.map((guide) => `/guides/${guide.slug}`));

  return { guides, validSlugs, validHrefs };
}

function expectValidUniqueGuideLinks(
  container: HTMLElement,
  source: "homepage" | "guides-index",
  validHrefs: Set<string>,
) {
  const hrefs = within(container)
    .getAllByRole("link")
    .map((link) => {
      const href = link.getAttribute("href");
      expect(href).not.toBeNull();
      return href!;
    });

  expect(hrefs.every((href) => validHrefs.has(href))).toBe(true);
  expect(new Set(hrefs).size).toBe(hrefs.length);

  return hrefs.map((href) => `${source}::${href.slice("/guides/".length)}`);
}

describe("contextual internal links", () => {
  it("renders fixed homepage next steps even when no priority guides are supplied", () => {
    const { validHrefs } = getGuideRouteData();
    render(<Home articles={[]} guides={[]} />);

    const playbooks = screen.getByRole("heading", { name: "Practical playbooks" }).closest("section");
    expect(playbooks).not.toBeNull();
    const nextSteps = within(playbooks!).getByLabelText("Recommended guide starting points");

    const instructionLink = within(nextSteps).getByRole("link", {
      name: "Compare instruction files by tool and surface",
    });
    const securityLink = within(nextSteps).getByRole("link", {
      name: "Review the MCP security checklist",
    });
    const loopLink = within(nextSteps).getByRole("link", {
      name: "Design loop engineering for AI coding agents",
    });

    expectValidUniqueGuideLinks(nextSteps, "homepage", validHrefs);
    expect(instructionLink.getAttribute("href")).toBe(`/guides/${INSTRUCTION_COMPARISON_GUIDE_SLUG}`);
    expect(securityLink.getAttribute("href")).toBe(`/guides/${MCP_SECURITY_GUIDE_SLUG}`);
    expect(loopLink.getAttribute("href")).toBe(`/guides/${LOOP_ENGINEERING_GUIDE_SLUG}`);
    expect(instructionLink.closest("p")?.textContent).toMatch(
      /before choosing the adapters your team will maintain/i,
    );
    expect(securityLink.closest("p")?.textContent).toMatch(
      /before granting credentials, network access, or write permissions/i,
    );
    expect(loopLink.closest("p")?.textContent).toMatch(
      /before scaling Automations or \/loop schedules/i,
    );

    for (const label of privateSeoLabels) {
      expect(screen.queryByText(label)).toBeNull();
    }
  });

  it("renders compact featured paths above the guide grid with contextual reasons", () => {
    const { guides, validHrefs } = getGuideRouteData();
    render(<GuidesPage guides={guides} />);

    expect(guidesPageSeo.title).toBe("AI Coding Agent Decision Guides: AGENTS.md, Codex, MCP");
    expect(guidesPageSeo.description).toContain("compare Codex and Claude Code");
    expect(
      screen.getByRole("heading", {
        name: "AI Coding Agent Guides",
        level: 1,
      }),
    ).toBeTruthy();

    const featuredPaths = screen.getByRole("heading", { name: "Featured starting paths" }).closest("section");
    expect(featuredPaths).not.toBeNull();

    const instructionLink = within(featuredPaths!).getByRole("link", {
      name: /Choose repository instruction files/i,
    });
    const codexLink = within(featuredPaths!).getByRole("link", {
      name: /Compare Codex and Claude Code/i,
    });
    const securityLink = within(featuredPaths!).getByRole("link", {
      name: /Set boundaries for MCP access/i,
    });
    const loopLink = within(featuredPaths!).getByRole("link", {
      name: /Design durable agent loops/i,
    });
    const guideGrid = document.querySelector(".guide-grid");

    // Featured paths and the full grid have different navigation roles, so cross-block repeats are intentional.
    expectValidUniqueGuideLinks(featuredPaths!, "guides-index", validHrefs);
    expect(instructionLink.getAttribute("href")).toBe(`/guides/${INSTRUCTION_COMPARISON_GUIDE_SLUG}`);
    expect(codexLink.getAttribute("href")).toBe("/guides/codex-vs-claude-code");
    expect(securityLink.getAttribute("href")).toBe(`/guides/${MCP_SECURITY_GUIDE_SLUG}`);
    expect(loopLink.getAttribute("href")).toBe(`/guides/${LOOP_ENGINEERING_GUIDE_SLUG}`);
    expect(instructionLink.textContent).toMatch(/before standardizing guidance/i);
    expect(codexLink.textContent).toMatch(/same-task test protocol/i);
    expect(securityLink.textContent).toMatch(/before enabling an MCP server/i);
    expect(loopLink.textContent).toMatch(/what is loop engineering/i);
    expect(loopLink.textContent).toMatch(/act-observe-reason cycles/i);
    expect(
      featuredPaths!.compareDocumentPosition(guideGrid!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    for (const label of privateSeoLabels) {
      expect(screen.queryByText(label)).toBeNull();
    }
  });

  it("renders the four guide tracks with crawlable links and reading order", () => {
    const { guides, validHrefs } = getGuideRouteData();
    render(<GuidesPage guides={guides} />);

    const centers = screen.getByRole("heading", { name: "Guide tracks" }).closest("section");
    expect(centers).not.toBeNull();

    expect(within(centers!).getByRole("heading", { name: "Instruction files" })).toBeTruthy();
    expect(within(centers!).getByRole("heading", { name: "Agent loops" })).toBeTruthy();
    expect(within(centers!).getByRole("heading", { name: "MCP and security" })).toBeTruthy();
    expect(within(centers!).getByRole("heading", { name: "Comparisons and migrations" })).toBeTruthy();
    expect(within(centers!).getAllByText("Recommended reading order")).toHaveLength(4);
    expect(centers!.textContent).toMatch(/Beginner entry:/);
    expect(centers!.textContent).toMatch(/Advanced page:/);

    const hrefs = expectValidUniqueGuideLinks(centers!, "guides-index", validHrefs);
    expect(hrefs).toHaveLength(13);
    expect(hrefs).toEqual(
      expect.arrayContaining([
        `guides-index::${INSTRUCTION_COMPARISON_GUIDE_SLUG}`,
        "guides-index::agents-md-template-for-ai-coding-agents",
        "guides-index::agents-md-examples-codex-node-python-monorepos",
        "guides-index::does-github-copilot-read-claude-md-support-matrix",
        `guides-index::${LOOP_ENGINEERING_GUIDE_SLUG}`,
        "guides-index::claude-code-subagents-examples",
        "guides-index::agent-mode-vs-chat-mode-in-ide",
        `guides-index::${MCP_SECURITY_GUIDE_SLUG}`,
        "guides-index::claude-code-hooks-mcp-setup",
        "guides-index::agent-governance-checklist-for-software-teams",
        "guides-index::codex-vs-claude-code",
        "guides-index::local-vs-cloud-ai-coding-agent",
        "guides-index::antigravity-cli-gemini-cli-migration",
      ]),
    );
  });

  it.each(approvedGuidePlacements)(
    "preserves the %s to %s guide relation",
    (sourceSlug, targetSlug) => {
      const { guides, validSlugs } = getGuideRouteData();
      const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
      const guide = guideBySlug.get(sourceSlug);
      const link = guide?.internalLinks.find((candidate) => candidate.slug === targetSlug);

      expect(validSlugs.has(sourceSlug), `${sourceSlug} should exist`).toBe(true);
      expect(validSlugs.has(targetSlug), `${targetSlug} should exist`).toBe(true);
      expect(link, `${sourceSlug} should link to ${targetSlug}`).toBeDefined();
      expect(link?.anchor.trim().length).toBeGreaterThan(4);
      expect(link?.reason.trim().length).toBeGreaterThan(30);
    },
  );

  it("computes every required landing and guide-to-guide placement from rendered links and guide data", () => {
    const { guides, validHrefs } = getGuideRouteData();
    const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
    const guidePlacements = approvedGuidePlacements.flatMap(([sourceSlug, targetSlug]) => {
      const link = guideBySlug
        .get(sourceSlug)
        ?.internalLinks.find((candidate) => candidate.slug === targetSlug);
      return link ? [`${sourceSlug}::${link.slug}`] : [];
    });

    render(<Home articles={[]} guides={[]} />);
    const nextSteps = screen.getByLabelText("Recommended guide starting points");
    const homepagePlacements = expectValidUniqueGuideLinks(nextSteps, "homepage", validHrefs);
    cleanup();

    render(<GuidesPage guides={guides} />);
    const featuredPaths = screen.getByRole("heading", { name: "Featured starting paths" }).closest("section");
    expect(featuredPaths).not.toBeNull();
    const guidesIndexPlacements = expectValidUniqueGuideLinks(featuredPaths!, "guides-index", validHrefs);

    const actualRequiredPlacements = [
      ...guidePlacements,
      ...homepagePlacements,
      ...guidesIndexPlacements,
    ];
    expect(actualRequiredPlacements).toHaveLength(approvedGuidePlacements.length + 7);
    expect(new Set(actualRequiredPlacements).size).toBe(actualRequiredPlacements.length);

    for (const guide of guides) {
      const linkedSlugs = guide.internalLinks.map((link) => link.slug);
      expect(new Set(linkedSlugs).size, guide.slug).toBe(linkedSlugs.length);
    }

    const serializedGuides = JSON.stringify(guides);
    for (const field of [
      "priority",
      "primaryKeyword",
      "demandScore",
      "attackabilityScore",
      "fitScore",
      "gscWatchQueries",
    ]) {
      expect(serializedGuides).not.toContain(`"${field}"`);
    }

    expect(getGuide(INSTRUCTION_COMPARISON_GUIDE_SLUG)?.internalLinks.map((link) => link.slug)).toContain(
      "agents-md-template-for-ai-coding-agents",
    );
  });
});
