import type { Article } from "./types";

export type BrandEntityKind = "Organization" | "SoftwareApplication";
export type BrandCoverageStatus = "covered" | "watchlisted";

export type BrandEntity = {
  id: string;
  name: string;
  slug: string;
  kind: BrandEntityKind;
  officialUrl: string;
  sourceType: "official";
  relationship: string;
  mentionPolicy: string;
  coverageStatus: BrandCoverageStatus;
  coveredArticleSlugs: string[];
};

const MENTION_POLICY =
  "Mentioned for factual market context only; not an endorsement, partnership, certification, or sponsorship claim.";

export const brandEntities: BrandEntity[] = [
  {
    id: "openai",
    name: "OpenAI",
    slug: "openai",
    kind: "Organization",
    officialUrl: "https://openai.com/",
    sourceType: "official",
    relationship: "AI lab and vendor behind Codex, GPT models, and ChatGPT.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    slug: "chatgpt",
    kind: "SoftwareApplication",
    officialUrl: "https://chatgpt.com/",
    sourceType: "official",
    relationship: "OpenAI conversational product watched as part of the broader AI assistant ecosystem.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "openai-codex",
    name: "OpenAI Codex",
    slug: "openai-codex",
    kind: "SoftwareApplication",
    officialUrl: "https://openai.com/codex/",
    sourceType: "official",
    relationship: "OpenAI coding-agent product covered when official Codex updates affect engineering workflows.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    slug: "anthropic",
    kind: "Organization",
    officialUrl: "https://www.anthropic.com/",
    sourceType: "official",
    relationship: "AI lab and vendor behind Claude and Claude Code.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "claude-code",
    name: "Claude Code",
    slug: "claude-code",
    kind: "SoftwareApplication",
    officialUrl: "https://claude.com/product/claude-code",
    sourceType: "official",
    relationship: "Anthropic coding-agent product monitored for workflow, orchestration, and developer tooling changes.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    slug: "microsoft",
    kind: "Organization",
    officialUrl: "https://www.microsoft.com/",
    sourceType: "official",
    relationship: "Platform and software company connected to GitHub, Bing, Visual Studio Code, and developer tooling.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "github",
    name: "GitHub",
    slug: "github",
    kind: "Organization",
    officialUrl: "https://github.com/",
    sourceType: "official",
    relationship: "Developer platform monitored for Copilot, VS Code, CLI, and agentic development updates.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    slug: "github-copilot",
    kind: "SoftwareApplication",
    officialUrl: "https://github.com/features/copilot",
    sourceType: "official",
    relationship: "GitHub AI coding product covered when official updates affect IDE, CLI, sandbox, or governance behavior.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "visual-studio-code",
    name: "Visual Studio Code",
    slug: "visual-studio-code",
    kind: "SoftwareApplication",
    officialUrl: "https://code.visualstudio.com/",
    sourceType: "official",
    relationship: "Microsoft code editor referenced when agent workflows land inside VS Code.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "google",
    name: "Google",
    slug: "google",
    kind: "Organization",
    officialUrl: "https://www.google.com/",
    sourceType: "official",
    relationship: "Search and AI platform company monitored for Gemini, Antigravity, and search-quality guidance.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "gemini",
    name: "Gemini",
    slug: "gemini",
    kind: "SoftwareApplication",
    officialUrl: "https://gemini.google.com/",
    sourceType: "official",
    relationship: "Google AI assistant and model family referenced when official developer workflow updates depend on Gemini tooling.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "cursor",
    name: "Cursor",
    slug: "cursor",
    kind: "SoftwareApplication",
    officialUrl: "https://cursor.com/",
    sourceType: "official",
    relationship: "AI code editor monitored for enterprise controls, agent permissions, and governance features.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "microsoft-bing",
    name: "Microsoft Bing",
    slug: "microsoft-bing",
    kind: "SoftwareApplication",
    officialUrl: "https://www.bing.com/webmasters/",
    sourceType: "official",
    relationship: "Search platform and webmaster data source used for Bing visibility and indexing workflows.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "covered",
    coveredArticleSlugs: [],
  },
  {
    id: "xai",
    name: "xAI",
    slug: "xai",
    kind: "Organization",
    officialUrl: "https://x.ai/",
    sourceType: "official",
    relationship: "AI company behind Grok; watchlisted for future AI coding and search-answer coverage when evidence supports it.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "watchlisted",
    coveredArticleSlugs: [],
  },
  {
    id: "grok",
    name: "Grok",
    slug: "grok",
    kind: "SoftwareApplication",
    officialUrl: "https://x.ai/grok",
    sourceType: "official",
    relationship: "xAI assistant watchlisted for AI answer, coding, and search-grounded workflow relevance.",
    mentionPolicy: MENTION_POLICY,
    coverageStatus: "watchlisted",
    coveredArticleSlugs: [],
  },
];

const entityById = new Map(brandEntities.map((entity) => [entity.id, entity]));

export function getArticleEntities(article: Article): BrandEntity[] {
  const explicitIds = article.entityIds || [];
  const inferredIds = inferEntityIds(article);
  const ids = explicitIds.length > 0 ? explicitIds : inferredIds;

  return Array.from(new Set(ids))
    .map((id) => entityById.get(id))
    .filter((entity): entity is BrandEntity => Boolean(entity));
}

export function getEntityCoverage(articles: Article[]): BrandEntity[] {
  return brandEntities.map((entity) => {
    const coveredArticleSlugs = articles
      .filter((article) => getArticleEntities(article).some((item) => item.id === entity.id))
      .map((article) => article.slug)
      .sort();

    return {
      ...entity,
      coveredArticleSlugs,
      coverageStatus: coveredArticleSlugs.length > 0 ? "covered" : entity.coverageStatus,
    };
  });
}

function inferEntityIds(article: Article): string[] {
  const haystack = [
    article.title,
    article.summary,
    article.category,
    ...article.tags,
    ...article.keywords,
    ...article.sources.map((source) => source.publisher),
  ]
    .join(" ")
    .toLowerCase();

  return brandEntities
    .filter((entity) => haystack.includes(entity.name.toLowerCase()))
    .map((entity) => entity.id);
}
