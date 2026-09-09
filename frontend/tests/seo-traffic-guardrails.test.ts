import { describe, expect, it } from "vitest";

import { spacexCursorAcquisitionArticle } from "../lib/articles/spacex-cursor-acquisition";
import { getGuide } from "../lib/guides";
import { seedArticles } from "../lib/seed";

const protectedGuides = [
  {
    slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
    title: "AGENTS.md vs CLAUDE.md vs Copilot Instructions: Which File Should You Use?",
    metaTitle: "AGENTS.md vs CLAUDE.md vs Copilot Instructions",
    publishedAt: "2026-06-14",
    updatedAt: "2026-09-08",
  },
  {
    slug: "agents-md-template-for-ai-coding-agents",
    title: "AGENTS.md Template for Codex and Monorepos",
    metaTitle: "AGENTS.md Template for Codex: Node.js, Python & Monorepos",
    publishedAt: "2026-06-14",
    updatedAt: "2026-09-08",
  },
  {
    slug: "loop-engineering-ai-coding-agents",
    title: "What Is Loop Engineering for AI Coding Agents?",
    metaTitle: "What Is Loop Engineering? Addy Osmani, AI Agent Loops, Stop Rules",
    publishedAt: "2026-06-15",
    updatedAt: "2026-07-30",
  },
] as const;

const protectedArticles = [
  {
    slug: "spacex-cursor-acquisition-2026",
    title: "Did SpaceX Buy Cursor? $60B Deal Status and Timeline",
    metaTitle: "SpaceX–Cursor Deal Status (July 2026): Signed, Not Closed",
    publishedAt: "2026-06-16T10:35:00Z",
    updatedAt: "2026-07-30",
  },
  {
    slug: "cursor-enterprise-organizations-governance",
    title: "Cursor Enterprise Security: Governance, Privacy Mode, and Agent Permissions",
    metaTitle: "Cursor Enterprise Security: Governance, Privacy Mode, Agent Permissions",
    publishedAt: "2026-06-03T09:00:00Z",
    updatedAt: "2026-09-08T00:00:00Z",
  },
] as const;

describe("current-traffic SEO guardrails", () => {
  it.each(protectedGuides)(
    "keeps the existing URL, title, and freshness fields for $slug",
    ({ slug, ...expected }) => {
      const guide = getGuide(slug);

      expect(guide).toBeDefined();
      expect(guide).toMatchObject({ slug, ...expected });
      expect(`/guides/${guide!.slug}`).toBe(`/guides/${slug}`);
    },
  );

  it.each(protectedArticles)(
    "keeps the existing URL, title, and freshness fields for $slug",
    ({ slug, ...expected }) => {
      const article = [spacexCursorAcquisitionArticle, ...seedArticles].find(
        (candidate) => candidate.slug === slug,
      );

      expect(article).toBeDefined();
      expect(article).toMatchObject({ slug, ...expected });
      expect(`/articles/${article!.slug}`).toBe(`/articles/${slug}`);
    },
  );
});
