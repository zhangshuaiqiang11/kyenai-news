import type { BenchmarkRun } from "./types";

export type BenchmarkMetricKey =
  | "verificationPassed"
  | "elapsedSeconds"
  | "measuredCostUsd"
  | "humanInterventions"
  | "filesChanged";

export type BenchmarkMetricColumn = {
  key: BenchmarkMetricKey;
  label: string;
  format: (run: BenchmarkRun) => string;
};

const formatSuccess = (run: BenchmarkRun) => {
  if (run.verificationPassed === null) {
    return "Not measured";
  }

  return run.verificationPassed ? "Passed" : "Did not pass";
};

const formatElapsed = (run: BenchmarkRun) =>
  run.elapsedSeconds === null ? "Not measured" : `${run.elapsedSeconds} seconds`;

const formatCost = (run: BenchmarkRun) =>
  run.measuredCostUsd === null ? "Not measured" : `$${run.measuredCostUsd.toFixed(2)}`;

const formatCount = (value: number | null) =>
  value === null ? "Not measured" : value.toLocaleString("en-US");

export const benchmarkMetricColumns: BenchmarkMetricColumn[] = [
  { key: "verificationPassed", label: "Success", format: formatSuccess },
  { key: "elapsedSeconds", label: "Elapsed time", format: formatElapsed },
  { key: "measuredCostUsd", label: "Measured cost", format: formatCost },
  {
    key: "humanInterventions",
    label: "Human interventions",
    format: (run) => formatCount(run.humanInterventions),
  },
  {
    key: "filesChanged",
    label: "Files changed",
    format: (run) => formatCount(run.filesChanged),
  },
];

export function runHasMeasuredMetric(run: BenchmarkRun, key: BenchmarkMetricKey): boolean {
  return run[key] !== null;
}

export function hasAnyMeasuredBenchmarkData(runs: BenchmarkRun[]): boolean {
  return runs.some((run) => benchmarkMetricColumns.some((column) => runHasMeasuredMetric(run, column.key)));
}

export function getVisibleBenchmarkColumns(runs: BenchmarkRun[]): BenchmarkMetricColumn[] {
  if (!hasAnyMeasuredBenchmarkData(runs)) {
    return [];
  }

  return benchmarkMetricColumns.filter((column) =>
    runs.some((run) => runHasMeasuredMetric(run, column.key)),
  );
}
