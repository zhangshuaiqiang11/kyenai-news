import type { Article, Guide, GuideEvidence } from "./types";

export type SourceLedgerType =
  | "Official documentation"
  | "Official announcement"
  | "Primary filing or record"
  | "Research paper or preprint"
  | "Standards or methodology"
  | "Independent reporting";

export type SourceLedgerStatus = "Current" | "Review due" | "Verification needed" | "Superseded";

export type SourceLedgerUsage = {
  kind: "Article" | "Guide";
  path: string;
  slug: string;
  title: string;
  passages: number | null;
  verifiedAt: string | null;
  nextReviewAt: string | null;
  status: SourceLedgerStatus;
  verificationConclusion: string | null;
  verificationChangeNote: string | null;
  note: string;
};

export type SourceLedgerEntry = {
  title: string;
  url: string;
  publisher: string;
  sourceType: SourceLedgerType;
  confidence: "High" | "Medium";
  publishedAt: string | null;
  lastVerifiedAt: string | null;
  nextReviewAt: string | null;
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
        verifiedAt: source.verifiedAt ? toDateOnly(source.verifiedAt) : null,
        nextReviewAt: null,
        status: "Verification needed",
        verificationConclusion: source.verificationConclusion || null,
        verificationChangeNote: source.verificationChangeNote || null,
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
        verifiedAt: source.verifiedAt ? toDateOnly(source.verifiedAt) : null,
        nextReviewAt: null,
        status: "Verification needed",
        verificationConclusion: source.verificationConclusion || null,
        verificationChangeNote: source.verificationChangeNote || null,
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
      const dateOrder = (right.lastVerifiedAt || "").localeCompare(left.lastVerifiedAt || "");
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
    verificationNeeded: entries.filter((entry) => entry.status === "Verification needed").length,
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
  const finalizedUsage = finalizeUsage(usage, reviewCadenceDays, asOfDate);
  const existing = entries.get(url);

  if (!existing) {
    entries.set(url, {
      title: source.title,
      url,
      publisher: source.publisher,
      sourceType,
      confidence: sourceType === "Independent reporting" || sourceType === "Research paper or preprint" ? "Medium" : "High",
      publishedAt: source.publishedAt || null,
      lastVerifiedAt: finalizedUsage.verifiedAt,
      nextReviewAt: finalizedUsage.nextReviewAt,
      reviewCadenceDays,
      status: finalizedUsage.status,
      supersededBy: null,
      usedBy: [finalizedUsage],
    });
    return;
  }

  if (!existing.publishedAt && source.publishedAt) existing.publishedAt = source.publishedAt;
  const existingUsage = existing.usedBy.find((candidate) => candidate.path === finalizedUsage.path);
  if (existingUsage) {
    existingUsage.passages = Math.max(existingUsage.passages || 0, finalizedUsage.passages || 0) || null;
    if (isLater(finalizedUsage.verifiedAt, existingUsage.verifiedAt)) {
      Object.assign(existingUsage, finalizedUsage);
    } else if (finalizedUsage.note.length > existingUsage.note.length) {
      existingUsage.note = finalizedUsage.note;
    }
  } else {
    existing.usedBy.push(finalizedUsage);
  }
}

function finalizeSourceEntry(entry: SourceLedgerEntry, asOfDate: string): SourceLedgerEntry {
  const usedBy = entry.usedBy.map((usage) => finalizeUsage(usage, entry.reviewCadenceDays, asOfDate));
  const verifiedDates = usedBy.flatMap((usage) => usage.verifiedAt ? [usage.verifiedAt] : []);
  const reviewDates = usedBy.flatMap((usage) => usage.nextReviewAt ? [usage.nextReviewAt] : []);
  const aggregateStatus: SourceLedgerStatus = entry.supersededBy
    ? "Superseded"
    : usedBy.some((usage) => usage.status === "Verification needed")
      ? "Verification needed"
      : usedBy.some((usage) => usage.status === "Review due")
        ? "Review due"
        : "Current";
  return {
    ...entry,
    lastVerifiedAt: verifiedDates.sort().at(-1) || null,
    nextReviewAt: reviewDates.sort()[0] || null,
    status: aggregateStatus,
    usedBy: usedBy.sort((left, right) => {
      return (right.verifiedAt || "").localeCompare(left.verifiedAt || "") || left.path.localeCompare(right.path);
    }),
  };
}

function finalizeUsage(
  usage: SourceLedgerUsage,
  reviewCadenceDays: number,
  asOfDate: string,
): SourceLedgerUsage {
  if (!usage.verifiedAt) {
    return { ...usage, nextReviewAt: null, status: "Verification needed" };
  }
  const nextReviewAt = addDays(usage.verifiedAt, reviewCadenceDays);
  return {
    ...usage,
    nextReviewAt,
    status: compareDates(asOfDate, nextReviewAt) > 0 ? "Review due" : "Current",
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

function isLater(left: string | null, right: string | null): boolean {
  return Boolean(left && (!right || compareDates(left, right) > 0));
}

function compareDates(left: string, right: string): number {
  return toDateOnly(left).localeCompare(toDateOnly(right));
}

function toDateOnly(value: string): string {
  return value.slice(0, 10);
}

function statusRank(status: SourceLedgerStatus): number {
  return status === "Verification needed" ? 0 : status === "Review due" ? 1 : status === "Current" ? 2 : 3;
}
