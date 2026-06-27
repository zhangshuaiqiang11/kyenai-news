/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AuthorPage from "../pages/authors/[slug]";
import CategoryPage from "../pages/categories/[category]";
import ContactPage from "../pages/contact";
import EntitiesPage from "../pages/entities";
import SourcesPage from "../pages/sources";
import TagPage from "../pages/tags/[tag]";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => cleanup());

function expectRobots(value: string | null) {
  expect(document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content || null).toBe(value);
}

describe("page indexing metadata", () => {
  it("noindexes utility and archive pages while keeping their links crawlable", () => {
    const pages = [
      <ContactPage key="contact" />,
      <CategoryPage
        key="category"
        category="AI Coding Agents"
        articles={[]}
        guides={[]}
        indexable={false}
        overview={["Category overview."]}
      />,
      <TagPage key="tag" tag="Claude Code" tagSlug="claude-code" articles={[]} />,
    ];

    for (const page of pages) {
      const view = render(page);
      expectRobots("noindex,follow");
      view.unmount();
    }
  });

  it("keeps public trust ledgers indexable", () => {
    for (const page of [
      <EntitiesPage key="entities" articles={[]} entities={[]} />,
      <SourcesPage key="sources" sources={[]} />,
      <AuthorPage key="author" articles={[]} />,
    ]) {
      const view = render(page);
      expectRobots(null);
      view.unmount();
    }
  });

  it("removes the noindex directive when a category hub passes its gate", () => {
    render(
      <CategoryPage
        category="AI Coding Agents"
        articles={[]}
        guides={[]}
        indexable
        overview={["Qualified category overview."]}
      />,
    );

    expectRobots(null);
  });
});
