import { describe, expect, it } from "vitest";

import { getPublishedArticles, isPublishedArticle } from "../lib/publication";
import { seedArticles } from "../lib/seed";

describe("public article publication boundaries", () => {
  it("allows only published articles into public collections", () => {
    const article = seedArticles[0];
    const records = [
      article,
      { ...article, id: "draft-record", slug: "draft-record", status: "draft" as const },
      { ...article, id: "archived-record", slug: "archived-record", status: "archived" as const },
    ];

    expect(getPublishedArticles(records).map((item) => item.id)).toEqual([article.id]);
    expect(isPublishedArticle(records[0])).toBe(true);
    expect(isPublishedArticle(records[1])).toBe(false);
    expect(isPublishedArticle(records[2])).toBe(false);
  });
});
