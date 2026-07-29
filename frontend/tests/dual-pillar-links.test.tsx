/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthorityPathPanel } from "../components/AuthorityPathPanel";
import ArticlePage from "../pages/articles/[slug]";
import GuidePage from "../pages/guides/[slug]";
import {
  AUTHORITY_PILLAR_PATH,
  COMMERCIAL_PILLAR_PATH,
  INSTRUCTION_CHECKER_PATH,
  RESEARCH_HUB_PATH,
  shouldShowArticleAuthorityPath,
  shouldShowArticleChecker,
  shouldShowGuideAuthorityPath,
  shouldShowGuideChecker,
} from "../lib/authority-paths";
import { getGuide, getInternalLinkedGuides } from "../lib/guides";
import { seedArticles } from "../lib/seed";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(cleanup);

describe("dual-pillar authority path", () => {
  it("renders descriptive crawlable links and omits a self-link", () => {
    render(<AuthorityPathPanel currentPath={COMMERCIAL_PILLAR_PATH} includeChecker />);

    expect(screen.queryByRole("link", { name: /compare Codex, Claude Code/i })).toBeNull();
    expect(
      screen.getByRole("link", { name: /verify AGENTS\.md, CLAUDE\.md/i }).getAttribute("href"),
    ).toBe(AUTHORITY_PILLAR_PATH);
    expect(
      screen.getByRole("link", { name: /datasets, templates, and security checklists/i }).getAttribute("href"),
    ).toBe(RESEARCH_HUB_PATH);
    expect(
      screen.getByRole("link", { name: /audit an instruction file/i }).getAttribute("href"),
    ).toBe(INSTRUCTION_CHECKER_PATH);
  });

  it("limits the shared path to relevant guides and preserves an unrelated guide", () => {
    const relevantGuideSlugs = [
      "ai-coding-agents-comparison",
      "agents-md-vs-claude-md-cursorrules-copilot-instructions",
      "codex-vs-claude-code",
      "codex-vs-github-copilot",
      "claude-code-alternatives",
      "local-vs-cloud-ai-coding-agent",
      "agent-governance-checklist-for-software-teams",
      "loop-engineering-ai-coding-agents",
    ];

    expect(relevantGuideSlugs.every(shouldShowGuideAuthorityPath)).toBe(true);
    expect(shouldShowGuideAuthorityPath("mcp-server-not-showing-tools")).toBe(false);
  });

  it("exposes the checker on six relevant guides and not on unrelated content", () => {
    const checkerGuideSlugs = [
      "agents-md-vs-claude-md-cursorrules-copilot-instructions",
      "agents-md-template-for-ai-coding-agents",
      "agents-md-examples-codex-node-python-monorepos",
      "does-github-copilot-read-claude-md-support-matrix",
      "agent-governance-checklist-for-software-teams",
      "claude-code-hooks-mcp-setup",
    ];

    expect(checkerGuideSlugs.every(shouldShowGuideChecker)).toBe(true);
    expect(shouldShowGuideChecker("spacex-cursor-acquisition-2026")).toBe(false);
  });

  it("bridges three relevant articles and adds the checker to two", () => {
    expect(shouldShowArticleAuthorityPath("openai-codex-plugins-sites-annotations")).toBe(true);
    expect(shouldShowArticleAuthorityPath("github-copilot-sdk-general-availability")).toBe(true);
    expect(shouldShowArticleAuthorityPath("claude-code-dynamic-workflows-parallel-subagents")).toBe(true);
    expect(shouldShowArticleChecker("openai-codex-plugins-sites-annotations")).toBe(true);
    expect(shouldShowArticleChecker("github-copilot-sdk-general-availability")).toBe(true);
    expect(shouldShowArticleChecker("claude-code-dynamic-workflows-parallel-subagents")).toBe(false);
    expect(shouldShowArticleAuthorityPath("spacex-cursor-acquisition-2026")).toBe(false);
  });

  it("renders the path through relevant page templates and omits it from unrelated pages", () => {
    const guide = getGuide("local-vs-cloud-ai-coding-agent")!;
    render(
      <GuidePage
        guide={guide}
        relatedGuides={getInternalLinkedGuides(guide)}
        relatedArticles={[]}
      />,
    );
    expect(screen.getByRole("heading", { name: /move from tool choice/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /compare Codex, Claude Code/i })).toBeTruthy();

    cleanup();

    const article = seedArticles.find(
      (candidate) => candidate.slug === "openai-codex-plugins-sites-annotations",
    )!;
    render(<ArticlePage article={article} relatedArticles={[]} relatedGuides={[]} />);
    expect(screen.getByRole("heading", { name: /move from tool choice/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /audit an instruction file/i })).toBeTruthy();

    cleanup();

    const unrelatedArticle = seedArticles.find(
      (candidate) => candidate.slug === "gpt-53-codex-long-running-agentic-coding",
    )!;
    render(<ArticlePage article={unrelatedArticle} relatedArticles={[]} relatedGuides={[]} />);
    expect(screen.queryByRole("heading", { name: /move from tool choice/i })).toBeNull();
  });
});
