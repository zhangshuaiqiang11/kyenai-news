import { describe, expect, it } from "vitest";

import {
  MIN_INDEXABLE_CATEGORY_ARTICLES,
  shouldIndexCategory,
  shouldIndexPath,
} from "../lib/indexation";

describe("indexation policy", () => {
  it("excludes utility pages while keeping trust pages indexable", () => {
    expect(shouldIndexPath("/contact")).toBe(false);
    expect(shouldIndexPath("/sources")).toBe(false);
    expect(shouldIndexPath("/entities")).toBe(false);
    expect(shouldIndexPath("/authors/editorial-automation-desk")).toBe(false);
    expect(shouldIndexPath("/about")).toBe(true);
    expect(shouldIndexPath("/editorial-policy")).toBe(true);
  });

  it("indexes category hubs only after they reach the minimum depth", () => {
    expect(shouldIndexCategory(MIN_INDEXABLE_CATEGORY_ARTICLES - 1)).toBe(false);
    expect(shouldIndexCategory(MIN_INDEXABLE_CATEGORY_ARTICLES)).toBe(true);
  });
});
