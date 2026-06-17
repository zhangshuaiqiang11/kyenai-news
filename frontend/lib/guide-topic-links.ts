import { getGuides } from "./guides";
import { slugify } from "./seo";

const TOPIC_GUIDE_OVERRIDES: Record<string, string> = {
  "openai codex vs claude code": "codex-vs-claude-code",
  "codex alternatives": "codex-vs-claude-code",
  "claude code alternatives": "codex-vs-claude-code",
  "ai coding agent comparison": "codex-vs-claude-code",
  "agents.md vs claude.md": "agents-md-vs-claude-md-cursorrules-copilot-instructions",
  "does github copilot read claude.md": "does-github-copilot-read-claude-md-support-matrix",
  "github copilot claude.md support": "does-github-copilot-read-claude-md-support-matrix",
  "copilot claude.md support matrix": "does-github-copilot-read-claude-md-support-matrix",
  ".github/copilot-instructions.md vs claude.md": "does-github-copilot-read-claude-md-support-matrix",
  ".github/copilot-instructions.md": "agents-md-vs-claude-md-cursorrules-copilot-instructions",
  ".cursor/rules mdc migration": "agents-md-vs-claude-md-cursorrules-copilot-instructions",
  "ai coding agent instruction files": "agents-md-vs-claude-md-cursorrules-copilot-instructions",
  "agents.md template": "agents-md-template-for-ai-coding-agents",
  "ai coding agent instructions template": "agents-md-template-for-ai-coding-agents",
  "codex agents.md example": "agents-md-template-for-ai-coding-agents",
  "agents.md examples": "agents-md-examples-codex-node-python-monorepos",
  "codex agents.md examples": "agents-md-examples-codex-node-python-monorepos",
  "agents.md node.js example": "agents-md-examples-codex-node-python-monorepos",
  "agents.md python example": "agents-md-examples-codex-node-python-monorepos",
  "agents.md monorepo example": "agents-md-examples-codex-node-python-monorepos",
  "repository instructions template": "agents-md-template-for-ai-coding-agents",
  "claude code subagents workflow": "claude-code-subagents-examples",
  "claude code sub-agents": "claude-code-subagents-examples",
  "ai coding subagents": "claude-code-subagents-examples",
  "mcp security": "secure-mcp-servers-ai-coding-agents",
  "mcp server security": "secure-mcp-servers-ai-coding-agents",
  "mcp authentication": "secure-mcp-servers-ai-coding-agents",
  "mcp permissions": "secure-mcp-servers-ai-coding-agents",
  "ai agent tool security": "secure-mcp-servers-ai-coding-agents",
  "loop engineering": "loop-engineering-ai-coding-agents",
  "agentic loop ai coding": "loop-engineering-ai-coding-agents",
  "cursor loop automation": "loop-engineering-ai-coding-agents",
  "claude code /loop scheduling": "loop-engineering-ai-coding-agents",
  "plan-execute-verify agent loop": "loop-engineering-ai-coding-agents",
  "loop engineering vs prompt engineering": "loop-engineering-ai-coding-agents",
  "how to design agent loops": "loop-engineering-ai-coding-agents",
  "gemini cli migration": "antigravity-cli-gemini-cli-migration",
  "antigravity cli": "antigravity-cli-gemini-cli-migration",
  "gemini cli transition": "antigravity-cli-gemini-cli-migration",
  "google coding agent cli": "antigravity-cli-gemini-cli-migration",
};

export function resolveIndexableGuideTopicHref(keyword: string, currentGuideSlug?: string): string | null {
  const normalized = keyword.trim().toLowerCase();
  const guides = getGuides();
  const overrideSlug = TOPIC_GUIDE_OVERRIDES[normalized];

  if (overrideSlug) {
    return overrideSlug === currentGuideSlug ? null : `/guides/${overrideSlug}`;
  }

  const guideByTitle = guides.find(
    (guide) => guide.slug !== currentGuideSlug && guide.title.trim().toLowerCase() === normalized,
  );
  if (guideByTitle) {
    return `/guides/${guideByTitle.slug}`;
  }

  const guideByKeyword = guides.find(
    (guide) =>
      guide.slug !== currentGuideSlug &&
      guide.secondaryKeywords.some((candidate) => candidate.trim().toLowerCase() === normalized),
  );
  if (guideByKeyword) {
    return `/guides/${guideByKeyword.slug}`;
  }

  const keywordSlug = slugify(keyword);
  const guideBySlug = guides.find((guide) => guide.slug !== currentGuideSlug && guide.slug === keywordSlug);
  if (guideBySlug) {
    return `/guides/${guideBySlug.slug}`;
  }

  return null;
}

export function resolveGuideTopicHref(keyword: string, currentGuideSlug?: string): string {
  return resolveIndexableGuideTopicHref(keyword, currentGuideSlug) || "/guides";
}
