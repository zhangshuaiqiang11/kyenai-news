export const COMMERCIAL_PILLAR_PATH = "/guides/ai-coding-agents-comparison";
export const AUTHORITY_PILLAR_PATH =
  "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions";
export const RESEARCH_HUB_PATH = "/research";
export const INSTRUCTION_CHECKER_PATH = "/tools/instruction-file-checker";

const GUIDE_AUTHORITY_PATH_SLUGS = new Set([
  "ai-coding-agents-comparison",
  "agents-md-vs-claude-md-cursorrules-copilot-instructions",
  "agents-md-template-for-ai-coding-agents",
  "agents-md-examples-codex-node-python-monorepos",
  "does-github-copilot-read-claude-md-support-matrix",
  "ai-coding-agent-instruction-file-adoption-report-2026",
  "codex-vs-claude-code",
  "codex-vs-github-copilot",
  "claude-code-alternatives",
  "local-vs-cloud-ai-coding-agent",
  "agent-mode-vs-chat-mode-in-ide",
  "agent-governance-checklist-for-software-teams",
  "loop-engineering-ai-coding-agents",
]);

const GUIDE_CHECKER_SLUGS = new Set([
  "agents-md-vs-claude-md-cursorrules-copilot-instructions",
  "agents-md-template-for-ai-coding-agents",
  "agents-md-examples-codex-node-python-monorepos",
  "does-github-copilot-read-claude-md-support-matrix",
  "agent-governance-checklist-for-software-teams",
  "claude-code-hooks-mcp-setup",
]);

const ARTICLE_AUTHORITY_PATH_SLUGS = new Set([
  "openai-codex-plugins-sites-annotations",
  "github-copilot-sdk-general-availability",
  "claude-code-dynamic-workflows-parallel-subagents",
]);

const ARTICLE_CHECKER_SLUGS = new Set([
  "openai-codex-plugins-sites-annotations",
  "github-copilot-sdk-general-availability",
]);

export function shouldShowGuideAuthorityPath(slug: string): boolean {
  return GUIDE_AUTHORITY_PATH_SLUGS.has(slug);
}

export function shouldShowGuideChecker(slug: string): boolean {
  return GUIDE_CHECKER_SLUGS.has(slug);
}

export function shouldShowArticleAuthorityPath(slug: string): boolean {
  return ARTICLE_AUTHORITY_PATH_SLUGS.has(slug);
}

export function shouldShowArticleChecker(slug: string): boolean {
  return ARTICLE_CHECKER_SLUGS.has(slug);
}
