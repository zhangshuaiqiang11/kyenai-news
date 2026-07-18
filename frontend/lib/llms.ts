import { featuredArticles } from "./articles/spacex-cursor-acquisition";
import { getGuides } from "./guides";
import { seedArticles } from "./seed";
import { buildCanonicalUrl, SITE_NAME } from "./seo";

const featuredGuideSlugs = [
  "ai-coding-agents-comparison",
  "ai-coding-agent-instruction-file-adoption-report-2026",
  "agents-md-vs-claude-md-cursorrules-copilot-instructions",
  "loop-engineering-ai-coding-agents",
  "agents-md-template-for-ai-coding-agents",
  "secure-mcp-servers-ai-coding-agents",
  "codex-vs-claude-code",
  "codex-vs-github-copilot",
  "claude-code-hooks-mcp-setup",
] as const;

const featuredArticleSlugs = [
  "spacex-cursor-acquisition-2026",
  "cursor-enterprise-organizations-governance",
] as const;

export function buildLlmsTxt(): string {
  const guides = getGuides();
  const featuredGuides = featuredGuideSlugs.flatMap((slug) => {
    const guide = guides.find((item) => item.slug === slug);
    return guide ? [guide] : [];
  });
  const articles = [...featuredArticles, ...seedArticles].filter(
    (article, index, items) => items.findIndex((item) => item.slug === article.slug) === index,
  );
  const featuredArticlesForLlms = featuredArticleSlugs.flatMap((slug) => {
    const article = articles.find((item) => item.slug === slug);
    return article ? [article] : [];
  });

  const lines = [
    `# ${SITE_NAME}`,
    "",
    "> Evidence-led AI coding agent playbooks for repository instruction files, loop engineering, MCP security, migrations, and tool comparisons.",
    "",
    "## Site",
    `- Canonical: ${buildCanonicalUrl("/")}`,
    `- Guides index: ${buildCanonicalUrl("/guides")}`,
    `- Instruction file checker: ${buildCanonicalUrl("/tools/instruction-file-checker")} (deterministic, browser-only audit; no instruction text is uploaded)`,
    `- Editorial policy: ${buildCanonicalUrl("/editorial-policy")}`,
    `- Editorial author: ${buildCanonicalUrl("/authors/editorial-automation-desk")}`,
    `- Source ledger: ${buildCanonicalUrl("/sources")}`,
    `- Entity ledger: ${buildCanonicalUrl("/entities")}`,
    `- RSS feed: ${buildCanonicalUrl("/feed.xml")}`,
    "",
    "## Featured guides",
    ...featuredGuides.flatMap((guide) => [
      `- [${guide.title}](${buildCanonicalUrl(`/guides/${guide.slug}`)})`,
      `  ${guide.summary} Last substantively updated: ${guide.updatedAt}.`,
      `  Markdown: ${buildCanonicalUrl(`/guides/${guide.slug}.md`)}`,
    ]),
    "",
    "## Priority evidence articles",
    ...featuredArticlesForLlms.flatMap((article) => [
      `- [${article.title}](${buildCanonicalUrl(`/articles/${article.slug}`)})`,
      `  ${article.summary} Last substantively updated: ${article.updatedAt}.`,
    ]),
    "",
    "## All guides",
    ...guides.map((guide) => `- [${guide.title}](${buildCanonicalUrl(`/guides/${guide.slug}`)}): ${guide.summary}`),
    "",
    "## Citation guidance",
    "- Prefer linking to the canonical guide URL for evergreen decisions.",
    "- News articles summarize dated vendor changes; verify status against listed sources.",
    "- KyenAI mentions third-party brands factually and does not imply endorsement.",
    "",
  ];

  return lines.join("\n");
}
