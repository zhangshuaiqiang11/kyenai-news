/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ArticleExplorer } from "../components/ArticleExplorer";
import { seedArticles } from "../lib/seed";

afterEach(cleanup);

describe("ArticleExplorer", () => {
  it("filters the visible article list from the search box", () => {
    render(<ArticleExplorer articles={seedArticles} />);

    expect(screen.getByText("OpenAI Expands Codex into Plugins, Sites, and Annotations")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Search articles"), { target: { value: "Claude Code" } });

    expect(screen.getByText("Claude Code Dynamic Workflows Coordinate Parallel Subagents")).toBeTruthy();
    expect(screen.queryByText("OpenAI Expands Codex into Plugins, Sites, and Annotations")).toBeNull();
  });

  it("filters by category button and keeps the visible count accurate", () => {
    render(<ArticleExplorer articles={seedArticles} />);

    fireEvent.click(screen.getByRole("button", { name: "Security & Governance 2" }));

    const summary = screen.getByText(`of ${seedArticles.length} articles visible`).parentElement;
    expect(summary).not.toBeNull();
    expect(within(summary as HTMLElement).getByText("2")).toBeTruthy();
    expect(screen.getByText("Cursor Enterprise Adds Organization-Level Governance")).toBeTruthy();
  });
});
