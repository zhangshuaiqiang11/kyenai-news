/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ArticlePage from "../pages/articles/[slug]";
import GuidePage from "../pages/guides/[slug]";
import { getGuide, getGuides, getInternalLinkedGuides } from "../lib/guides";
import { getGuideEditorialSignals } from "../lib/guide-editorial";
import { seedArticles } from "../lib/seed";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => cleanup());

const broadHubSlug = "ai-coding-config-files-guide";
const comparisonSlug = "agents-md-vs-claude-md-cursorrules-copilot-instructions";
const templateSlug = "agents-md-template-for-ai-coding-agents";
const copilotSlug = "does-github-copilot-read-claude-md-support-matrix";

function renderGuide(slug: string) {
  const guide = getGuide(slug);
  expect(guide, `Missing guide: ${slug}`).toBeDefined();
  return {
    guide: guide!,
    view: render(
      <GuidePage guide={guide!} relatedGuides={getInternalLinkedGuides(guide!)} relatedArticles={[]} />,
    ),
  };
}

function headingPosition(name: RegExp | string) {
  const heading = screen.getByRole("heading", { name });
  return heading;
}

describe("Guide CTR optimization contract", () => {
  it("publishes the AI coding config files broad hub with indexable SEO essentials", () => {
    const { guide } = renderGuide(broadHubSlug);

    expect(guide.title).toMatch(/AI Coding Config Files Guide/i);
    expect(guide.metaTitle).toMatch(/AI Coding Config Files/i);
    expect(guide.metaDescription).toMatch(/AGENTS\.md/i);
    expect(guide.metaDescription).toMatch(/Copilot|Cursor/i);

    expect(document.title).toBe(`${guide.metaTitle} | KyenAI`);
    expect(document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content).toBe(
      guide.metaDescription,
    );
    expect(document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      `https://www.kyenai.com/guides/${broadHubSlug}`,
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/AI Coding Config Files Guide/i);
    expect(screen.getByRole("heading", { name: /^quick answer$/i })).toBeTruthy();
    expect(guide.sections[0]?.heading).toBe("Quick answer");
  });

  it.each([
    [comparisonSlug, /instruction file compatibility/i],
    [templateSlug, /AGENTS\.md template previews/i],
    [copilotSlug, /CLAUDE\.md support matrix by surface/i],
  ] as const)(
    "puts the above-fold decision/action before the resource for %s",
    async (slug, resourceHeading) => {
      const { guide } = renderGuide(slug);
      expect(
        guide.decisionTablePlacement === "above-fold" || Boolean(guide.primaryAction),
        `${slug} must opt into an above-fold decision table or primary action`,
      ).toBe(true);

      const quickAnswer = headingPosition(/^quick answer$/i);
      const decisionOrAction = guide.decisionTablePlacement === "above-fold"
        ? headingPosition(guide.decisionTable.title)
        : headingPosition(/^start here$/i);
      const resource = await screen.findByRole("heading", { name: resourceHeading });

      expect(quickAnswer.compareDocumentPosition(decisionOrAction) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(decisionOrAction.compareDocumentPosition(resource) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    },
  );

  it("keeps the main instruction-file comparison mapped to the exact copilot-instructions.md phrase", () => {
    const guide = getGuide(comparisonSlug);

    expect(guide).toBeDefined();
    expect(JSON.stringify(guide)).toContain("copilot-instructions.md");
    expect(guide!.secondaryKeywords).toContain(".github/copilot-instructions.md");
  });

  it("keeps Cursor Enterprise retention copy cautious and free of an invented default duration", () => {
    const article = seedArticles.find((candidate) => candidate.slug === "cursor-enterprise-organizations-governance");

    expect(article).toBeDefined();
    expect(article!.title).toMatch(/Cursor Enterprise Data Retention .* Security/i);
    expect(article!.metaTitle).toMatch(/Cursor Data Retention .* Enterprise Security/i);

    const articleCopy = JSON.stringify(article);
    expect(articleCopy).toMatch(/verify|exception|unknown|no universal/i);
    expect(articleCopy).not.toMatch(/(?:default|standard|guaranteed)[^.!?]{0,80}\b\d+\s*(?:days?|hours?|weeks?)\b/i);

    render(<ArticlePage article={article!} relatedArticles={[]} relatedGuides={[]} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(article!.title);
    expect(document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content).not.toMatch(
      /default retention[^.!?]{0,80}\b\d+\s*(?:days?|hours?|weeks?)\b/i,
    );
  });

  it("does not assign the same primary intent owner keyword to multiple guides", () => {
    const owners = getGuides()
      .map((guide) => {
        const signals = getGuideEditorialSignals(guide.slug) as (ReturnType<typeof getGuideEditorialSignals> & {
          intentOwner?: string;
        }) | undefined;
        return signals?.intentOwner?.trim().toLowerCase() || signals?.primaryKeyword.trim().toLowerCase();
      })
      .filter((owner): owner is string => Boolean(owner));

    expect(owners.length).toBeGreaterThan(0);
    expect(new Set(owners).size).toBe(owners.length);
  });
});
