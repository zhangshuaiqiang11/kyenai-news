import type { Article, Guide } from "./types";

export type ContentCluster = {
  slug: "agent-instructions" | "mcp" | "governance";
  title: string;
  description: string;
  intro: string[];
  guideSlugs: string[];
  articleSlugs: string[];
};

export const contentClusters: ContentCluster[] = [
  {
    slug: "agent-instructions",
    title: "Agent Instructions",
    description: "Evidence-backed guidance for AGENTS.md, CLAUDE.md, Copilot instructions, and Cursor rules.",
    intro: [
      "Choose repository instruction files by the tool surface that actually reads them. This cluster connects compatibility evidence, copyable templates, and dated product updates so a shared policy can stay useful without pretending every agent has the same discovery rules.",
      "Start with the support matrix, then adapt a template and verify it in the repository. Keep security boundaries, setup commands, and completion criteria explicit; keep tool-specific adapters short enough to review when a vendor changes its behavior.",
    ],
    guideSlugs: [
      "agents-md-vs-claude-md-cursorrules-copilot-instructions",
      "agents-md-template-for-ai-coding-agents",
      "agents-md-examples-codex-node-python-monorepos",
      "does-github-copilot-read-claude-md-support-matrix",
      "ai-coding-agent-instruction-file-adoption-report-2026",
    ],
    articleSlugs: [
      "github-copilot-vscode-agents-window-may-2026",
      "github-copilot-cli-rubber-duck-prompt-scheduling",
      "github-copilot-sdk-general-availability",
    ],
  },
  {
    slug: "mcp",
    title: "MCP",
    description: "Practical MCP discovery, setup, security, and tool-access evidence for coding agents.",
    intro: [
      "Model Context Protocol turns an agent into a client of external tools, which makes discovery and authorization part of the engineering problem. These pages cover the observable failure modes—connected but empty, filtered, stale, or never called—alongside authentication, least privilege, and revocation controls.",
      "Use the debugger guide for a minimal reproduction before changing configuration. Use the security guide and setup examples before granting credentials, network access, or write permissions to an agent workflow.",
    ],
    guideSlugs: [
      "secure-mcp-servers-ai-coding-agents",
      "mcp-server-not-showing-tools",
      "claude-code-hooks-mcp-setup",
    ],
    articleSlugs: [
      "openai-codex-plugins-sites-annotations",
      "visual-studio-agent-mode-mcp-general-availability",
      "jetbrains-acp-agent-registry",
    ],
  },
  {
    slug: "governance",
    title: "Governance",
    description: "Controls for approving, auditing, and operating AI coding agents in software teams.",
    intro: [
      "Agent governance is a capability and ownership question: which repositories, files, secrets, networks, and production-adjacent systems can an agent reach, and who can approve or revoke that access? This cluster turns those questions into checklists, policy boundaries, and evidence-backed enterprise updates.",
      "Pair the governance checklist with your instruction and MCP policies. Record approvals, verification commands, logs, and stop conditions so a team can explain what happened after an agent run instead of relying on a green-looking transcript.",
    ],
    guideSlugs: [
      "agent-governance-checklist-for-software-teams",
      "secure-mcp-servers-ai-coding-agents",
      "loop-engineering-ai-coding-agents",
      "claude-code-subagents-examples",
    ],
    articleSlugs: [
      "cursor-enterprise-organizations-governance",
      "claude-code-dynamic-workflows-parallel-subagents",
      "github-copilot-cloud-local-sandboxes-preview",
    ],
  },
];

export function getContentCluster(slug: string): ContentCluster | undefined {
  return contentClusters.find((cluster) => cluster.slug === slug);
}

export function getClusterGuides(cluster: ContentCluster, guides: Guide[]): Guide[] {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  return cluster.guideSlugs.flatMap((slug) => {
    const guide = bySlug.get(slug);
    return guide ? [guide] : [];
  });
}

export function getClusterArticles(cluster: ContentCluster, articles: Article[]): Article[] {
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  return cluster.articleSlugs.flatMap((slug) => {
    const article = bySlug.get(slug);
    return article?.status === "published" ? [article] : [];
  });
}
