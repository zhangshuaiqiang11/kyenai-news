import type { Guide, GuideSummary } from "./types";

export function toGuideSummary(guide: Guide): GuideSummary {
  return {
    id: guide.id,
    title: guide.title,
    slug: guide.slug,
    summary: guide.summary,
    pageType: guide.pageType,
    audience: guide.audience,
    updatedAt: guide.updatedAt,
  };
}
