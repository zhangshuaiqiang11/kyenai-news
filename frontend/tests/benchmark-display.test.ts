import { describe, expect, it } from "vitest";

import {
  getVisibleBenchmarkColumns,
  hasAnyMeasuredBenchmarkData,
} from "../lib/benchmark-display";
import type { BenchmarkRun } from "../lib/types";

const baseRun: BenchmarkRun = {
  id: "instruction-drift-fix-001-cursor",
  toolId: "cursor",
  toolVersion: null,
  status: "not-measured",
  metricSource: "unavailable",
  elapsedSeconds: null,
  measuredCostUsd: null,
  humanInterventions: null,
  filesChanged: null,
  verificationPassed: null,
  evidenceUrl: null,
  limitations: [],
};

describe("benchmark display helpers", () => {
  it("treats all-null runs as unmeasured", () => {
    expect(hasAnyMeasuredBenchmarkData([baseRun])).toBe(false);
    expect(getVisibleBenchmarkColumns([baseRun])).toEqual([]);
  });

  it("shows only columns with at least one measured value", () => {
    const runs: BenchmarkRun[] = [
      { ...baseRun, verificationPassed: true, elapsedSeconds: 42 },
      {
        ...baseRun,
        id: "instruction-drift-fix-001-openai-codex",
        toolId: "openai-codex",
        verificationPassed: false,
      },
    ];

    expect(hasAnyMeasuredBenchmarkData(runs)).toBe(true);
    expect(getVisibleBenchmarkColumns(runs).map((column) => column.key)).toEqual([
      "verificationPassed",
      "elapsedSeconds",
    ]);
  });
});
