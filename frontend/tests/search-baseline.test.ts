import { describe, expect, it } from "vitest";

import {
  priorityPageBaselines,
  prioritySearchTargets,
  searchBaselineScope,
  siteSearchBaseline,
} from "../lib/search-baseline";

describe("search growth baseline", () => {
  it("preserves the exported scope and site totals", () => {
    expect(searchBaselineScope).toMatchObject({
      startDate: "2026-06-10",
      endDate: "2026-09-09",
      hasQueryPageDimension: false,
    });
    expect(siteSearchBaseline).toMatchObject({ clicks: 97, impressions: 25271, ctr: 0.0038 });
  });

  it("keeps page metrics separate from editorial query mappings", () => {
    expect(Object.keys(priorityPageBaselines)).toHaveLength(8);
    expect(prioritySearchTargets).toHaveLength(30);
    expect(prioritySearchTargets.every((target) => target.mappingBasis === "editorial-target")).toBe(true);
    expect(prioritySearchTargets.some((target) => target.observedQueryMetric === null)).toBe(true);
    expect(prioritySearchTargets.filter((target) => target.observedQueryMetric !== null)
      .every((target) => target.observedQueryMetric?.dimension === "query")).toBe(true);
  });

  it("does not confuse the Cursor page average with its target query", () => {
    const page = priorityPageBaselines["/articles/cursor-enterprise-organizations-governance"];
    const query = prioritySearchTargets.find((target) => target.query === "cursor enterprise security");

    expect(page.averagePosition).toBe(11.18);
    expect(query?.observedQueryMetric?.averagePosition).toBe(42.36);
  });
});
