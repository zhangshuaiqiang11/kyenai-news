/** @vitest-environment jsdom */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SiteSearch } from "../components/SiteSearch";

const pushMock = vi.fn();

vi.mock("next/router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

afterEach(() => {
  cleanup();
  pushMock.mockClear();
});

describe("SiteSearch", () => {
  it("does not statically bundle the full guide and article catalogs", () => {
    const testDirectory = dirname(fileURLToPath(import.meta.url));
    const searchSource = readFileSync(resolve(testDirectory, "../components/SiteSearch.tsx"), "utf8");

    expect(searchSource).not.toContain('from "../lib/guides"');
    expect(searchSource).not.toContain('from "../lib/seed"');
  });

  it("clears a failed search-index load so the next open can retry", () => {
    const testDirectory = dirname(fileURLToPath(import.meta.url));
    const searchSource = readFileSync(resolve(testDirectory, "../components/SiteSearch.tsx"), "utf8");

    expect(searchSource).toContain(".catch(");
    expect(searchSource).toContain("searchModulePromise = null");
    expect(searchSource).toContain("Search is temporarily unavailable");
  });

  it("recovers when the first search-index load fails and the next open succeeds", async () => {
    const loadSearch = vi.fn()
      .mockRejectedValueOnce(new Error("chunk unavailable"))
      .mockResolvedValueOnce((query: string) => query.toLowerCase().includes("antigravity")
        ? [{
            href: "/guides/antigravity-cli-gemini-cli-migration",
            label: "Guide" as const,
            title: "Antigravity CLI migration from Gemini CLI",
            summary: "Migration guide",
            keywords: ["Antigravity"],
            priority: 2,
          }]
        : []);

    render(<SiteSearch loadSearch={loadSearch} />);

    fireEvent.click(screen.getByLabelText("Search guides and articles"));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search guides and articles" }), {
      target: { value: "Antigravity" },
    });
    expect(await screen.findByText("Search is temporarily unavailable. Close and try again.")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Close search"));
    fireEvent.click(screen.getByLabelText("Search guides and articles"));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search guides and articles" }), {
      target: { value: "Antigravity" },
    });

    expect(await screen.findByText("Antigravity CLI migration from Gemini CLI")).toBeTruthy();
    expect(loadSearch).toHaveBeenCalledTimes(2);
  });

  it("searches guide pages from the header entry point", async () => {
    render(<SiteSearch />);

    fireEvent.click(screen.getByLabelText("Search guides and articles"));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search guides and articles" }), {
      target: { value: "Antigravity" },
    });

    expect(await screen.findByText("Antigravity CLI migration from Gemini CLI")).toBeTruthy();
    expect(screen.getAllByText("Guide").length).toBeGreaterThanOrEqual(1);
  });

  it("searches source-backed article pages too", async () => {
    render(<SiteSearch />);

    fireEvent.click(screen.getByLabelText("Search guides and articles"));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search guides and articles" }), {
      target: { value: "Copilot SDK" },
    });

    expect(await screen.findByText("GitHub Copilot SDK Reaches General Availability")).toBeTruthy();
    expect(screen.getAllByText("Article").length).toBeGreaterThanOrEqual(1);
  });

  it("shows an empty state for unmatched searches", async () => {
    render(<SiteSearch />);

    fireEvent.click(screen.getByLabelText("Search guides and articles"));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search guides and articles" }), {
      target: { value: "zzzzzz" },
    });

    expect(await screen.findByText("No matching guides or articles yet.")).toBeTruthy();
  });

  it("submits the first result from the search box", async () => {
    render(<SiteSearch />);

    fireEvent.click(screen.getByLabelText("Search guides and articles"));
    const input = screen.getByRole("searchbox", { name: "Search guides and articles" });
    fireEvent.change(input, {
      target: { value: "Antigravity" },
    });
    await screen.findByText("Antigravity CLI migration from Gemini CLI");
    fireEvent.submit(input.closest("form") as HTMLFormElement);

    expect(pushMock).toHaveBeenCalledWith("/guides/antigravity-cli-gemini-cli-migration");
  });
});
