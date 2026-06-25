import { getGuides } from "./guides";
import { buildCanonicalUrl, SITE_NAME } from "./seo";

const featuredGuideSlugs = [
  "agents-md-vs-claude-md-cursorrules-copilot-instructions",
  "loop-engineering-ai-coding-agents",
  "agents-md-template-for-ai-coding-agents",
  "secure-mcp-servers-ai-coding-agents",
  "codex-vs-claude-code",
  "claude-code-hooks-mcp-setup",
] as const;

export function buildLlmsTxt(): string {
  const guides = getGuides();
  const featuredGuides = featuredGuideSlugs.flatMap((slug) => {
    const guide = guides.find((item) => item.slug === slug);
    return guide ? [guide] : [];
  });

  const lines = [
    `# ${SITE_NAME}`,
    "",
    "> Evidence-led AI coding agent playbooks for repository instruction files, loop engineering, MCP security, migrations, and tool comparisons.",
    "",
    "## Site",
    `- Canonical: ${buildCanonicalUrl("/")}`,
    `- Guides index: ${buildCanonicalUrl("/guides")}`,
    `- Editorial policy: ${buildCanonicalUrl("/editorial-policy")}`,
    `- Entity ledger: ${buildCanonicalUrl("/entities")}`,
    `- RSS feed: ${buildCanonicalUrl("/feed.xml")}`,
    "",
    "## Featured guides",
    ...featuredGuides.flatMap((guide) => [
      `- [${guide.title}](${buildCanonicalUrl(`/guides/${guide.slug}`)})`,
      `  ${guide.summary}`,
    ]),
    "",
    "## All guides",
    ...guides.map((guide) => `- ${buildCanonicalUrl(`/guides/${guide.slug}`)}`),
    "",
    "## Citation guidance",
    "- Prefer linking to the canonical guide URL for evergreen decisions.",
    "- News articles summarize dated vendor changes; verify status against listed sources.",
    "- KyenAI mentions third-party brands factually and does not imply endorsement.",
    "",
  ];

  return lines.join("\n");
}
