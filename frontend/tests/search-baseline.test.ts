import { describe, expect, it } from "vitest";

import {
  historicalSearchBaseline,
  latestControlBaseline,
  octoberObservationBaseline,
  priorityPageBaselines,
  prioritySearchTargets,
  searchBaselineScope,
  searchBaselineSnapshots,
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
    expect(prioritySearchTargets).toHaveLength(34);
    expect(prioritySearchTargets.filter((target) => target.observedQueryMetric === null)
      .every((target) => target.mappingBasis === "editorial-target")).toBe(true);
    expect(prioritySearchTargets.some((target) => target.observedQueryMetric === null)).toBe(true);
    expect(prioritySearchTargets.filter((target) => target.observedQueryMetric !== null)
      .every((target) => target.observedQueryMetric?.dimension === "query" && target.mappingBasis === "observed-query")).toBe(true);
  });

  it("does not confuse the Cursor page average with its target query", () => {
    const page = priorityPageBaselines["/articles/cursor-enterprise-organizations-governance"];
    const query = prioritySearchTargets.find((target) => target.query === "cursor enterprise security");

    expect(page.averagePosition).toBe(11.18);
    expect(query?.observedQueryMetric?.averagePosition).toBe(42.36);
  });

  it("keeps the historical cohort and latest control window as separate snapshots", () => {
    expect(searchBaselineSnapshots).toHaveLength(3);
    expect(historicalSearchBaseline.baselineId).not.toBe(latestControlBaseline.baselineId);
    expect(historicalSearchBaseline.windowEnd).toBe("2026-09-09");
    expect(historicalSearchBaseline.returnedRowCount).toBe(1000);
    expect(historicalSearchBaseline.rowCountDimension).toBe("query");
    expect(latestControlBaseline.windowStart).toBe("2026-08-19");
    expect(latestControlBaseline.windowEnd).toBe("2026-09-15");
    expect(latestControlBaseline.metrics).toBeNull();
    expect(latestControlBaseline.returnedRowCount).toBe(932);
    expect(latestControlBaseline.rowCountDimension).toBe("query");
    expect(latestControlBaseline.releaseId).toBeNull();
    expect(latestControlBaseline.hasQueryPageDimension).toBe(false);
    expect(octoberObservationBaseline).toMatchObject({
      windowStart: "2026-09-13",
      windowEnd: "2026-10-10",
      exportedAt: "2026-10-13",
      releaseId: "81f7530",
      productionReleaseDate: "2026-09-16",
      returnedRowCount: null,
      rowCountDimension: null,
      metricDimension: "date",
      hasQueryPageDimension: false,
      metrics: { clicks: 34, impressions: 6456, averagePosition: 9.5066 },
      dimensionRowCounts: {
        date: 28,
        query: 255,
        page: 37,
        country: 121,
        device: 3,
        "search-appearance": 0,
      },
    });
    expect(octoberObservationBaseline.limitations.join(" ")).toContain("No Query x Page");
  });

  it("corrects ownership without claiming Query x Page attribution", () => {
    const examples = prioritySearchTargets.find((target) => target.query === "agents.md node.js example");
    const monorepo = prioritySearchTargets.find((target) => target.query === "agents.md monorepo template");
    const cursor = prioritySearchTargets.find((target) => target.query === "cursor enterprise security");
    const loop = prioritySearchTargets.find((target) => target.query === "loop engineering");

    expect(examples?.path).toBe("/guides/agents-md-examples-codex-node-python-monorepos");
    expect(examples?.intent).toBe("examples");
    expect(monorepo?.path).toBe("/guides/agents-md-examples-codex-node-python-monorepos");
    expect(monorepo?.intent).toBe("examples");
    expect(cursor?.cluster).toBe("cursor-governance");
    expect(loop?.intent).toBe("workflow");
    expect(prioritySearchTargets.every((target) => target.mappingBasis !== "query-page-confirmed")).toBe(true);
    expect(new Set(prioritySearchTargets.map((target) => target.query)).size).toBe(prioritySearchTargets.length);
    expect(prioritySearchTargets.every((target) => target.path.startsWith("/"))).toBe(true);
  });
});
