import { describe, expect, it } from "vitest";

import { getArticleReviewNote, ARTICLE_REVIEW_OWNER } from "../lib/reviewer";
import { seedArticles } from "../lib/seed";

describe("article reviewer accountability", () => {
  it("identifies the accountable GitHub owner without claiming vendor-console testing", () => {
    const article = seedArticles.find((item) => item.slug === "cursor-enterprise-organizations-governance")!;
    const note = getArticleReviewNote(article);

    expect(ARTICLE_REVIEW_OWNER.handle).toBe("@zhangshuaiqiang11");
    expect(note.ownerUrl).toBe("https://github.com/zhangshuaiqiang11");
    expect(note.role).toMatch(/accountable/i);
    expect(note.boundary).toMatch(/no vendor-console testing is claimed/i);
    expect(note.testedBy).toMatch(/not claimed/i);
  });
});
