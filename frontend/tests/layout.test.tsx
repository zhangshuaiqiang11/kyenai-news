/** @vitest-environment jsdom */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Layout } from "../components/Layout";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

const originalBuildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP;
const originalLatestEditorialUpdate = process.env.NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE;

vi.mock("next/router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  if (originalBuildTimestamp === undefined) {
    delete process.env.NEXT_PUBLIC_BUILD_TIMESTAMP;
  } else {
    process.env.NEXT_PUBLIC_BUILD_TIMESTAMP = originalBuildTimestamp;
  }
  if (originalLatestEditorialUpdate === undefined) {
    delete process.env.NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE;
  } else {
    process.env.NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE = originalLatestEditorialUpdate;
  }
});

describe("Layout", () => {
  it("keeps the shared layout independent from the full content catalogs", () => {
    const testDirectory = dirname(fileURLToPath(import.meta.url));
    const layoutSource = readFileSync(resolve(testDirectory, "../components/Layout.tsx"), "utf8");
    const siteStatusSource = readFileSync(resolve(testDirectory, "../lib/site-status.ts"), "utf8");

    expect(layoutSource).not.toContain("../lib/freshness");
    expect(layoutSource).not.toContain("../lib/guides");
    expect(layoutSource).not.toContain("../lib/seed");
    expect(siteStatusSource).not.toMatch(/\b(?:import|require)\b/);
    expect(siteStatusSource).not.toContain("./freshness");
    expect(siteStatusSource).not.toContain("./guides");
    expect(siteStatusSource).not.toContain("./guide-expansion");
    expect(siteStatusSource).not.toContain("./seed");
    expect(siteStatusSource).toContain("NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE");
  });

  it("shows the editorial update derived into the build environment", () => {
    process.env.NEXT_PUBLIC_BUILD_TIMESTAMP = "2026-06-14T12:00:00.000Z";
    process.env.NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE = "2026-06-14";

    render(
      <Layout>
        <p>Public page</p>
      </Layout>,
    );

    expect(screen.getByText("Latest site update Jun 14, 2026")).toBeTruthy();
    expect(screen.queryByText(/Content updated/)).toBeNull();
    expect(screen.queryByText(/Jun 3, 2026 08:54 UTC/)).toBeNull();
    expect(screen.getByText("Editorial guardrails active")).toBeTruthy();
    expect(screen.queryByText("Self-optimizing guardrails on")).toBeNull();
  });

  it("does not show a site update label when all editorial dates are in the future", () => {
    process.env.NEXT_PUBLIC_BUILD_TIMESTAMP = "2026-06-13T23:59:59.000Z";
    process.env.NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE = "2026-06-14";

    const { container } = render(
      <Layout>
        <p>Public page</p>
      </Layout>,
    );

    expect(container.querySelectorAll(".status-strip > span")).toHaveLength(3);
    expect(screen.queryByText(/(?:Latest site update|Content updated)/)).toBeNull();
    expect(screen.queryByText(/1970/)).toBeNull();
  });

  it("does not show malformed editorial update values", () => {
    process.env.NEXT_PUBLIC_BUILD_TIMESTAMP = "2026-06-14T23:59:59.000Z";
    process.env.NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE = "2026-02-30";

    render(
      <Layout>
        <p>Public page</p>
      </Layout>,
    );

    expect(screen.queryByText(/Latest site update/)).toBeNull();
  });

  it("does not expose the robots-blocked operations route in public navigation", () => {
    render(
      <Layout>
        <p>Public page</p>
      </Layout>,
    );

    expect(screen.queryByRole("link", { name: "Operations" })).toBeNull();
  });
});
