/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { InstructionFileChecker } from "../components/InstructionFileChecker";
import { buildWebApplicationJsonLd } from "../lib/seo";
import InstructionFileCheckerPage from "../pages/tools/instruction-file-checker";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(cleanup);

describe("instruction file checker page", () => {
  it("publishes an indexable, answer-first page with visible privacy and evidence", () => {
    render(<InstructionFileCheckerPage />);

    expect(document.title).toBe("AI Instruction File Checker: Audit AGENTS.md and CLAUDE.md | KyenAI");
    expect(document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      "https://www.kyenai.com/tools/instruction-file-checker",
    );
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Instruction File Checker");
    expect(screen.getByRole("heading", { name: "Direct answer" })).toBeTruthy();
    expect(screen.getByText(/content stays in your browser/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /load strong sample/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /compare instruction files/i }).getAttribute("href")).toContain(
      "/guides/agents-md-vs-claude-md",
    );
    expect(screen.getAllByRole("link", { name: /official documentation/i }).length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText("Instruction File Checker", { selector: '[aria-current="page"]' })).toBeTruthy();

    const applicationSchema = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map((node) => JSON.parse(node.textContent || "{}"))
      .find((value) => value["@type"] === "WebApplication");
    expect(applicationSchema).toEqual(expect.objectContaining({
      "@type": "WebApplication",
      applicationCategory: "DeveloperApplication",
      isAccessibleForFree: true,
      browserRequirements: "Requires JavaScript; all analysis runs locally in the browser.",
    }));
    expect(applicationSchema).not.toHaveProperty("aggregateRating");

    const breadcrumbSchema = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map((node) => JSON.parse(node.textContent || "{}"))
      .find((value) => value["@type"] === "BreadcrumbList");
    expect(breadcrumbSchema.itemListElement.map((item: { name: string }) => item.name)).toEqual([
      "Home",
      "Agent instructions",
      "Instruction File Checker",
    ]);
  });

  it("keeps exact environment options and samples aligned with the selected tool", () => {
    render(<InstructionFileChecker />);

    fireEvent.change(screen.getByLabelText("Tool"), { target: { value: "cursor" } });
    const surface = screen.getByLabelText("Surface") as HTMLSelectElement;
    expect(Array.from(surface.options).map((option) => option.value)).toEqual(["Cursor IDE", "Cursor CLI"]);
    expect((screen.getByLabelText("File path") as HTMLInputElement).value).toBe(".cursor/rules/project-guidance.mdc");

    fireEvent.click(screen.getByRole("button", { name: /load strong sample/i }));
    expect((screen.getByLabelText("Instruction content") as HTMLTextAreaElement).value).toContain("alwaysApply: true");
    fireEvent.click(screen.getByRole("button", { name: /audit instruction file/i }));
    expect(screen.getByRole("status").textContent).toContain("Strong");
  });

  it("loads a visible sample and renders deterministic findings", () => {
    render(<InstructionFileChecker />);

    fireEvent.click(screen.getByRole("button", { name: /load strong sample/i }));
    expect((screen.getByLabelText("Instruction content") as HTMLTextAreaElement).value).toContain("## Verification");

    fireEvent.click(screen.getByRole("button", { name: /audit instruction file/i }));
    expect(screen.getByRole("status").textContent).toMatch(/Strong|Good/);
    expect(screen.getByText("AGENTS.md", { selector: "code" })).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Instruction content"), {
      target: { value: "Please be helpful." },
    });
    fireEvent.click(screen.getByRole("button", { name: /audit instruction file/i }));
    expect(screen.getByText("Setup guidance is missing")).toBeTruthy();
    expect(screen.getByText("Verification commands are missing")).toBeTruthy();
  });

  it("builds truthful WebApplication schema without review claims", () => {
    const jsonLd = buildWebApplicationJsonLd({
      title: "AI Coding Agent Instruction File Checker",
      description: "Audit repository instruction files with deterministic browser-only checks.",
      path: "/tools/instruction-file-checker",
    });

    expect(jsonLd.url).toBe("https://www.kyenai.com/tools/instruction-file-checker");
    expect(jsonLd.name).toBe("AI Coding Agent Instruction File Checker");
    expect(jsonLd.publisher).toEqual(expect.objectContaining({ "@id": "https://www.kyenai.com#organization" }));
    expect(jsonLd).not.toHaveProperty("aggregateRating");
    expect(jsonLd).not.toHaveProperty("review");
  });
});
