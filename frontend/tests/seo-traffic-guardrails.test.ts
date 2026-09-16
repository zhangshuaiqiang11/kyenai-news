import { describe, expect, it } from "vitest";

import { spacexCursorAcquisitionArticle } from "../lib/articles/spacex-cursor-acquisition";
import { getGuide } from "../lib/guides";
import { seedArticles } from "../lib/seed";

const protectedGuides = [
  {
    slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
    title: "AGENTS.md vs copilot-instructions.md: Which File Should You Use?",
    metaTitle: "AGENTS.md vs Copilot Instructions vs CLAUDE.md vs Cursor Rules (2026)",
    publishedAt: "2026-06-14",
    updatedAt: "2026-09-08",
  },
  {
    slug: "agents-md-template-for-ai-coding-agents",
    title: "AGENTS.md Template for Codex, Node.js, Python & Monorepos",
    metaTitle: "AGENTS.md Template for Codex: Node.js, Python & Monorepos",
    publishedAt: "2026-06-14",
    updatedAt: "2026-09-08",
  },
  {
    slug: "loop-engineering-ai-coding-agents",
    title: "Loop Engineering for AI Coding Agents: Stop Rules & Verification",
    metaTitle: "Loop Engineering for AI Coding Agents: Stop Rules & Verification",
    publishedAt: "2026-06-15",
    updatedAt: "2026-09-15",
  },
] as const;

const protectedArticles = [
  {
    slug: "spacex-cursor-acquisition-2026",
    title: "Did SpaceX Buy Cursor? $60B Deal Status and Timeline",
    metaTitle: "Did SpaceX Buy Cursor? Official Aug. 14, 2026 SEC Closing",
    publishedAt: "2026-06-16T10:35:00Z",
    updatedAt: "2026-09-15",
  },
  {
    slug: "cursor-enterprise-organizations-governance",
    title: "Cursor Enterprise Data Retention & Security: What Admins Must Verify",
    metaTitle: "Cursor Data Retention & Enterprise Security: Privacy Mode, ZDR",
    publishedAt: "2026-06-03T09:00:00Z",
    updatedAt: "2026-09-15T00:00:00Z",
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
