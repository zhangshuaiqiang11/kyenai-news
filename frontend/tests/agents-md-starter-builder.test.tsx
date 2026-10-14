/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AgentsMdStarterBuilder } from "../components/AgentsMdStarterBuilder";
import { getAgentsMdStarterDefaults, renderAgentsMdStarter } from "../lib/agents-md-starter-builder";
import { auditInstructionFile } from "../lib/instruction-file-audit";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

afterEach(cleanup);

describe("AGENTS.md starter builder", () => {
  it("renders a concise deterministic starter that passes the existing rule gate", () => {
    const input = getAgentsMdStarterDefaults("node", "Example app");
    const first = renderAgentsMdStarter(input);
    const second = renderAgentsMdStarter(input);
    const audit = auditInstructionFile({ tool: "codex", surface: "Codex", filePath: "AGENTS.md", content: first });

    expect(first).toBe(second);
    expect(first).toContain("Example app is a Node.js repository");
    expect(first).toContain("npm ci");
    expect(first).toContain("Report changed files, checks run, skipped checks, and remaining risks");
    expect(audit.grade).toBe("Strong");
    expect(first.split("\n").length).toBeLessThan(40);
  });

  it("keeps user values on one line and strips Markdown control delimiters", () => {
    const output = renderAgentsMdStarter({
      ...getAgentsMdStarterDefaults("python"),
      projectName: "Unsafe\n# heading <script>",
      testCommand: "pytest `tests`\nrm -rf /",
    });

    expect(output).toContain("Unsafe # heading script is a Python repository");
    expect(output).toContain("pytest tests rm -rf /");
    expect(output).not.toContain("<script>");
    expect(output).not.toContain("`tests`");
  });

  it.each([
    ["node", "npm ci", "npm test", "src/, tests/"],
    ["python", "uv sync", "pytest", "src/, tests/"],
    ["monorepo", "pnpm install --frozen-lockfile", "pnpm test", "apps/, packages/"],
  ] as const)("renders verified %s defaults", (stack, installCommand, testCommand, preferredPaths) => {
    const output = renderAgentsMdStarter(getAgentsMdStarterDefaults(stack));
    expect(output).toContain(`Install dependencies with \`${installCommand}\``);
    expect(output).toContain(`Run \`${testCommand}\``);
    expect(output).toContain(`Prefer edits in ${preferredPaths}`);
    expect(auditInstructionFile({ tool: "codex", surface: "Codex", filePath: "AGENTS.md", content: output }).grade)
      .toBe("Strong");
  });

  it("switches stack defaults, copies, downloads, and links to the full checker", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<AgentsMdStarterBuilder />);

    fireEvent.change(screen.getByLabelText("Repository type"), { target: { value: "python" } });
    expect((screen.getByLabelText("Install command") as HTMLInputElement).value).toBe("uv sync");
    expect(screen.getByLabelText("Generated AGENTS.md preview").textContent).toContain("pytest");
    expect(screen.getByRole("status").textContent).toMatch(/100\/100 · Strong/i);

    fireEvent.click(screen.getByRole("button", { name: /copy agents\.md/i }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Python repository"));

    const download = screen.getByRole("link", { name: /download agents\.md/i });
    expect(download.getAttribute("href")).toMatch(/^data:text\/markdown/);
    expect(download.getAttribute("download")).toBe("AGENTS.md");
    expect(screen.getByRole("link", { name: /open the full instruction checker/i }).getAttribute("href")).toBe(
      "/tools/instruction-file-checker",
    );
  });
});
