import { describe, expect, it } from "vitest";

import { toGuideSummary } from "../lib/guide-summary";
import { getGuides } from "../lib/guides";

describe("guide summaries", () => {
  it("keeps listing payloads below the Next.js large-page-data threshold", () => {
    const summaries = getGuides().map(toGuideSummary);
    const allowedKeys = ["audience", "id", "pageType", "slug", "summary", "title", "updatedAt"];

    expect(Object.keys(summaries[0]).sort()).toEqual(allowedKeys);
    expect(JSON.stringify({ guides: summaries }).length).toBeLessThan(25_000);
  });
});
