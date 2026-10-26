import type { Article } from "./types";
import { getArticleEditorialPolicy } from "./article-policy";

export const ARTICLE_REVIEW_OWNER = {
  handle: "@zhangshuaiqiang11",
  profileUrl: "https://github.com/zhangshuaiqiang11",
  role: "Accountable KyenAI editor",
} as const;

export type ArticleReviewNote = {
  ownerHandle: string;
  ownerUrl: string;
  role: string;
  scope: string;
  boundary: string;
  testedBy: string;
};

export function getArticleReviewNote(article: Article): ArticleReviewNote {
  const policy = getArticleEditorialPolicy(article);
  return {
    ownerHandle: ARTICLE_REVIEW_OWNER.handle,
    ownerUrl: ARTICLE_REVIEW_OWNER.profileUrl,
    role: ARTICLE_REVIEW_OWNER.role,
    scope: `${policy.label}. ${policy.reviewCadence}`,
    boundary: "Review scope is the listed evidence and visible article claims; no vendor-console testing is claimed unless a page links to a direct test record.",
    testedBy: "Not claimed — no direct vendor-console test record is linked on this page.",
  };
}
