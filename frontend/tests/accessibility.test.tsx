/** @vitest-environment jsdom */
import axe from "axe-core";
import React from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ArticleExplorer } from "../components/ArticleExplorer";
import { BenchmarkPanel } from "../components/BenchmarkPanel";
import { InstructionCompatibilityMatrix } from "../components/InstructionCompatibilityMatrix";
import { Layout } from "../components/Layout";
import { McpSecurityControls } from "../components/McpSecurityControls";
import { SiteSearch } from "../components/SiteSearch";
import { SignalPanel } from "../components/SignalPanel";
import { seedArticles } from "../lib/seed";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

afterEach(cleanup);

async function expectNoAxeViolations(container: HTMLElement, options?: { enableRegion?: boolean }) {
  const results = await axe.run(container, {
    rules: {
      "color-contrast": { enabled: false },
      region: { enabled: options?.enableRegion ?? false },
    },
  });

  expect(results.violations).toEqual([]);
}

describe("accessibility", () => {
  it("keeps the shared layout free of axe violations", async () => {
    const { container } = render(
      <Layout>
        <h1>Accessibility audit page</h1>
        <p>Representative public content shell.</p>
      </Layout>,
    );

    await expectNoAxeViolations(container, { enableRegion: true });
  });

  it("keeps the article explorer filters free of axe violations", async () => {
    const { container } = render(<ArticleExplorer articles={seedArticles.slice(0, 6)} />);

    await expectNoAxeViolations(container);
  });

  it("keeps the site search entry point free of axe violations", async () => {
    const { container } = render(<SiteSearch loadSearch={async () => () => []} />);

    await expectNoAxeViolations(container);
  });

  it("keeps instruction resource tables free of axe violations", async () => {
    const { container } = render(
      <>
        <InstructionCompatibilityMatrix />
        <BenchmarkPanel />
      </>,
    );

    await expectNoAxeViolations(container);
  });

  it("keeps MCP security resource tables free of axe violations", async () => {
    const { container } = render(<McpSecurityControls />);

    await expectNoAxeViolations(container);
  });

  it("keeps the signal panel free of axe violations", async () => {
    const { container } = render(<SignalPanel />);

    await expectNoAxeViolations(container);
  });
});
