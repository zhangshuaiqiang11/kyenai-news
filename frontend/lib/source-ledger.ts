import type { Article, Guide, GuideEvidence } from "./types";

export type SourceLedgerType =
  | "Official documentation"
  | "Official announcement"
  | "Primary filing or record"
  | "Research paper or preprint"
  | "Standards or methodology"
  | "Independent reporting";

export type SourceLedgerStatus = "Current" | "Review due" | "Superseded";

export type SourceLedgerUsage = {
  kind: "Article" | "Guide";
  path: string;
  slug: string;
  title: string;
  passages: number | null;
  verifiedAt: string;
  note: string;
};

export type SourceLedgerEntry = {
  title: string;
  url: string;
  publisher: string;
  sourceType: SourceLedgerType;
  confidence: "High" | "Medium";
  publishedAt: string | null;
  lastVerifiedAt: string;
  nextReviewAt: string;
  reviewCadenceDays: number;
  status: SourceLedgerStatus;
  supersededBy: string | null;
  usedBy: SourceLedgerUsage[];
};

const OFFICIAL_PUBLISHERS = new Set([
  "Aider",
  "Anthropic",
  "Cline",
  "Cursor",
  "GitHub",
  "Google",
  "Google for Developers",
  "JetBrains",
  "Kilo",
  "Microsoft",
  "MCP",
  "Model Context Protocol",
  "OpenAI",
  "OpenCode",
  "OWASP",
  "SpaceX",
  "xAI",
]);

const STANDARDS_PUBLISHERS = new Set(["AGENTS.md", "MCP", "NIST", "OWASP", "Model Context Protocol"]);

const PRIMARY_RECORD_PUBLISHERS = new Set(["SEC"]);

const RESEARCH_PUBLISHERS = new Set(["arXiv"]);

const DOCUMENTATION_HINT = /\b(api|cli|documentation|docs|guide|help|manual|overview|reference|security|specification|support)\b/i;

export function buildSourceLedger(
  articles: Article[],
  guides: Guide[],
  asOfDate: string,
): SourceLedgerEntry[] {
  const entries = new Map<string, SourceLedgerEntry>();

  for (const article of articles.filter((candidate) => candidate.status === "published")) {
    for (const source of article.sources) {
      const usage: SourceLedgerUsage = {
        kind: "Article",
        path: `/articles/${article.slug}`,
        slug: article.slug,
        title: article.title,
        passages: article.blocks.filter((block) => block.sourceIds.includes(source.id)).length,
        verifiedAt: toDateOnly(article.updatedAt),
        note: `Cited by ${article.category} coverage.`,
      };
      mergeSource(entries, {
        title: source.title,
        url: source.url,
        publisher: source.publisher,
        publishedAt: toDateOnly(source.publishedAt),
      }, usage, asOfDate);
    }
  }

  for (const guide of guides) {
    for (const source of guide.evidence) {
      const usage: SourceLedgerUsage = {
        kind: "Guide",
        path: `/guides/${guide.slug}`,
        slug: guide.slug,
        title: guide.title,
        passages: null,
        verifiedAt: toDateOnly(source.verifiedAt || guide.updatedAt),
        note: source.note,
      };
      mergeSource(entries, source, usage, asOfDate);
    }
  }

  return Array.from(entries.values())
    .map((entry) => finalizeSourceEntry(entry, asOfDate))
    .sort((left, right) => {
      const statusOrder = statusRank(left.status) - statusRank(right.status);
      if (statusOrder !== 0) return statusOrder;
      const dateOrder = right.lastVerifiedAt.localeCompare(left.lastVerifiedAt);
      return dateOrder || left.publisher.localeCompare(right.publisher) || left.title.localeCompare(right.title);
    });
}

export function getSourceLedgerCoverage(entries: SourceLedgerEntry[]) {
  const usages = entries.flatMap((entry) => entry.usedBy);
  return {
    sources: entries.length,
    publishers: new Set(entries.map((entry) => entry.publisher)).size,
    guides: new Set(usages.filter((usage) => usage.kind === "Guide").map((usage) => usage.slug)).size,
    articles: new Set(usages.filter((usage) => usage.kind === "Article").map((usage) => usage.slug)).size,
    reviewDue: entries.filter((entry) => entry.status === "Review due").length,
    superseded: entries.filter((entry) => entry.status === "Superseded").length,
  };
}

function mergeSource(
  entries: Map<string, SourceLedgerEntry>,
  source: Pick<GuideEvidence, "title" | "url" | "publisher"> & { publishedAt?: string | null },
  usage: SourceLedgerUsage,
  asOfDate: string,
) {
  const url = normalizeSourceUrl(source.url);
  const sourceType = classifySource(source.publisher, source.title, url);
  const reviewCadenceDays = reviewCadenceFor(sourceType);
  const existing = entries.get(url);

  if (!existing) {
    entries.set(url, {
      title: source.title,
      url,
      publisher: source.publisher,
      sourceType,
      confidence: sourceType === "Independent reporting" || sourceType === "Research paper or preprint" ? "Medium" : "High",
      publishedAt: source.publishedAt || null,
      lastVerifiedAt: usage.verifiedAt,
      nextReviewAt: addDays(usage.verifiedAt, reviewCadenceDays),
      reviewCadenceDays,
      status: compareDates(asOfDate, addDays(usage.verifiedAt, reviewCadenceDays)) > 0 ? "Review due" : "Current",
      supersededBy: null,
      usedBy: [usage],
    });
    return;
  }

  existing.lastVerifiedAt = latestDate(existing.lastVerifiedAt, usage.verifiedAt);
  existing.nextReviewAt = addDays(existing.lastVerifiedAt, existing.reviewCadenceDays);
  if (!existing.publishedAt && source.publishedAt) existing.publishedAt = source.publishedAt;
  const existingUsage = existing.usedBy.find((candidate) => candidate.path === usage.path);
  if (existingUsage) {
    existingUsage.passages = Math.max(existingUsage.passages || 0, usage.passages || 0) || null;
    existingUsage.verifiedAt = latestDate(existingUsage.verifiedAt, usage.verifiedAt);
    if (usage.note.length > existingUsage.note.length) existingUsage.note = usage.note;
  } else {
    existing.usedBy.push(usage);
  }
}

function finalizeSourceEntry(entry: SourceLedgerEntry, asOfDate: string): SourceLedgerEntry {
  const nextReviewAt = addDays(entry.lastVerifiedAt, entry.reviewCadenceDays);
  return {
    ...entry,
    nextReviewAt,
    status: entry.supersededBy
      ? "Superseded"
      : compareDates(asOfDate, nextReviewAt) > 0
        ? "Review due"
        : "Current",
    usedBy: [...entry.usedBy].sort((left, right) => {
      return right.verifiedAt.localeCompare(left.verifiedAt) || left.path.localeCompare(right.path);
    }),
  };
}

function classifySource(publisher: string, title: string, url: string): SourceLedgerType {
  if (PRIMARY_RECORD_PUBLISHERS.has(publisher)) return "Primary filing or record";
  if (RESEARCH_PUBLISHERS.has(publisher)) return "Research paper or preprint";
  if (STANDARDS_PUBLISHERS.has(publisher)) return "Standards or methodology";
  if (!OFFICIAL_PUBLISHERS.has(publisher)) return "Independent reporting";
  if (DOCUMENTATION_HINT.test(title) || /\/(docs|documentation|help|reference|security)(\/|$)/i.test(url)) {
    return "Official documentation";
  }
  return "Official announcement";
}

function reviewCadenceFor(sourceType: SourceLedgerType): number {
  if (sourceType === "Official documentation") return 14;
  if (
    sourceType === "Standards or methodology" ||
    sourceType === "Primary filing or record" ||
    sourceType === "Research paper or preprint"
  ) return 90;
  return 30;
}

function normalizeSourceUrl(value: string): string {
  const url = new URL(value);
  url.hash = "";
  const searchParamKeys: string[] = [];
  url.searchParams.forEach((_parameterValue, key) => searchParamKeys.push(key));
  for (const key of searchParamKeys) {
    if (key.toLowerCase().startsWith("utm_")) url.searchParams.delete(key);
  }
  const normalized = url.toString();
  return normalized.endsWith("/") && url.pathname !== "/" ? normalized.slice(0, -1) : normalized;
}

function addDays(value: string, days: number): string {
  const date = new Date(`${toDateOnly(value)}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function latestDate(left: string, right: string): string {
  return compareDates(left, right) >= 0 ? toDateOnly(left) : toDateOnly(right);
}

function compareDates(left: string, right: string): number {
  return toDateOnly(left).localeCompare(toDateOnly(right));
}

function toDateOnly(value: string): string {
  return value.slice(0, 10);
}

function statusRank(status: SourceLedgerStatus): number {
  return status === "Review due" ? 0 : status === "Current" ? 1 : 2;
}
