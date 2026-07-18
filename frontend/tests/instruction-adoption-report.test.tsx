/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { InstructionAdoptionReport } from "../components/InstructionAdoptionReport";

afterEach(cleanup);

describe("InstructionAdoptionReport", () => {
  it("renders dated counts, honest sampling language, and downloadable data", () => {
    render(<InstructionAdoptionReport />);

    expect(screen.getAllByText(/158,592/)).toHaveLength(2);
    expect(screen.getByText(/file-match count, not a count of adopting repositories/i)).toBeTruthy();
    expect(screen.getByText(/first 100 best matches per query/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /Download raw CSV/i }).getAttribute("href")).toBe(
      "/resources/data/instruction-file-adoption-report-2026-q3.csv",
    );
    expect(screen.getByRole("link", { name: /Download JSON/i }).getAttribute("href")).toBe(
      "/resources/data/instruction-file-adoption-report-2026-q3.json",
    );
  });

  it("renders all four query rows and methodology limitations", () => {
    render(<InstructionAdoptionReport />);

    expect(screen.getAllByRole("row")).toHaveLength(5);
    expect(screen.getByRole("rowheader", { name: /AGENTS.md/i })).toBeTruthy();
    expect(screen.getByRole("rowheader", { name: /CLAUDE.md/i })).toBeTruthy();
    expect(screen.getByRole("rowheader", { name: /copilot-instructions.md/i })).toBeTruthy();
    expect(screen.getByRole("rowheader", { name: /Cursor MDC rules/i })).toBeTruthy();
    expect(screen.getByText(/best-match ordering and are not statistically representative/i)).toBeTruthy();
  });
});
