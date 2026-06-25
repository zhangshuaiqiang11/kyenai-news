export type ArticleBlock = {
  id: string;
  type: "paragraph" | "heading" | "fact_table" | "faq" | "source_note";
  content: string;
  sourceIds: string[];
};

export type EvidenceSource = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  publishedAt: string;
  credibility: number;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  authorName: string;
  status: "draft" | "published" | "archived";
  keywords: string[];
  entityIds?: string[];
  blocks: ArticleBlock[];
  sources: EvidenceSource[];
  publishedAt: string;
  updatedAt: string;
  version: number;
  metaTitle?: string;
  metaDescription?: string;
};

export type SearchSignal = {
  label: string;
  value: string;
  change: string;
  direction: "up" | "down";
  source: string;
  confidence: "High" | "Medium" | "Low";
};

export type GuideSection = {
  heading: string;
  body: string[];
};

export type GuideActionStep = {
  title: string;
  body: string;
};

export type GuideTable = {
  title: string;
  intro: string;
  columns: string[];
  rows: {
    label: string;
    values: string[];
  }[];
};

export type GuidePitfall = {
  title: string;
  fix: string;
};

export type GuideEvidence = {
  title: string;
  url: string;
  publisher: string;
  note: string;
};

export type GuideInternalLink = {
  slug: string;
  anchor: string;
  reason: string;
};

export type SupportStatus = "documented" | "legacy" | "observed" | "unsupported" | "unknown";

export type ToolInstructionSupport = {
  id: string;
  toolId: "openai-codex" | "claude-code" | "github-copilot" | "cursor";
  toolName: string;
  path: string;
  status: SupportStatus;
  scopes: Array<"repository" | "nested-directory" | "path-specific" | "organization" | "user">;
  surfaces: string[];
  priority: string;
  nesting: string;
  recommendation: string;
  sourceUrl?: string;
  publisher?: string;
  verifiedAt: string;
};

export type InstructionTemplate = {
  id: string;
  title: string;
  targetPath: string;
  downloadName: string;
  purpose: string;
  applicableToolIds: ToolInstructionSupport["toolId"][];
  body: string;
  cautions: string[];
};

export type BenchmarkRun = {
  id: string;
  toolId: ToolInstructionSupport["toolId"];
  toolVersion: string | null;
  status: "not-measured" | "completed" | "failed";
  metricSource: "measured" | "unavailable";
  elapsedSeconds: number | null;
  measuredCostUsd: number | null;
  humanInterventions: number | null;
  filesChanged: number | null;
  verificationPassed: boolean | null;
  evidenceUrl: string | null;
  limitations: string[];
};

export type GuideResourceId =
  | "instruction-files"
  | "mcp-security"
  | "agents-md-template"
  | "claude-code-setup"
  | "loop-engineering";

export type Guide = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  intent: string;
  audience: string;
  pageType: string;
  secondaryKeywords: string[];
  sections: GuideSection[];
  recommendedPlay: string[];
  decisionTable: GuideTable;
  actionSteps: GuideActionStep[];
  pitfalls: GuidePitfall[];
  internalLinks: GuideInternalLink[];
  checklist: string[];
  evidence: GuideEvidence[];
  relatedArticleSlugs: string[];
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
  resourceIds?: GuideResourceId[];
};

export type GuideEditorialSignals = {
  priority: "P0" | "P1" | "P2";
  primaryKeyword: string;
  demandScore: number;
  attackabilityScore: number;
  fitScore: number;
  gscWatchQueries: string[];
  gscBaseline?: {
    clicks: number;
    impressions: number;
    ctr: number;
    averagePosition: number;
  };
  emergencyPriority?: number;
};
