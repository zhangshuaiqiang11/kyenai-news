/** @vitest-environment jsdom */
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CursorEnterpriseSecurityControls } from "../components/CursorEnterpriseSecurityControls";
import {
  cursorEnterpriseResponsibilityMatrix,
  cursorEnterpriseSecurityControls,
  cursorEnterpriseSecurityDownloads,
} from "../lib/cursor-enterprise-security-resource";

(globalThis as typeof globalThis & { React: typeof React }).React = React;
afterEach(cleanup);

describe("Cursor Enterprise security assessment", () => {
  it("publishes exactly 30 source-bounded controls and a responsibility matrix", () => {
    expect(cursorEnterpriseSecurityControls).toHaveLength(30);
    expect(cursorEnterpriseResponsibilityMatrix).toHaveLength(5);
    expect(cursorEnterpriseSecurityControls.every((control) =>
      control.owner && control.verificationMethod && control.passCriteria &&
      control.contractOrConsoleCheck && control.sourceUrls.length > 0,
    )).toBe(true);
    expect(new Set(cursorEnterpriseSecurityControls.map((control) => control.id)).size).toBe(30);
    expect(cursorEnterpriseSecurityControls.some((control) => control.claimBasis === "official-public")).toBe(true);
    expect(cursorEnterpriseSecurityControls.some((control) => control.claimBasis === "kyenai-recommendation")).toBe(true);
  });

  it("server-renders the 30-row checklist and all downloads", () => {
    render(<CursorEnterpriseSecurityControls />);
    const table = screen.getByRole("table", { name: /30 cursor enterprise security controls/i });
    expect(within(table).getAllByRole("row")).toHaveLength(31);
    for (const [name, href] of Object.entries(cursorEnterpriseSecurityDownloads)) {
      const link = screen.getByRole("link", { name: new RegExp(name, "i") });
      expect(link.getAttribute("href")).toBe(href);
      expect(link.hasAttribute("download")).toBe(true);
    }
    expect(document.body.textContent).toMatch(/contract or console verification/i);
  });

  it("ships aligned JSON CSV Markdown and PDF editions", () => {
    const root = fs.existsSync(path.resolve("public/resources"))
      ? path.resolve("public/resources")
      : path.resolve("frontend/public/resources");
    const json = JSON.parse(fs.readFileSync(path.join(root, "cursor-enterprise-security-controls.json"), "utf8"));
    const csv = fs.readFileSync(path.join(root, "cursor-enterprise-security-controls.csv"), "utf8").trim().split("\n");
    const markdown = fs.readFileSync(path.join(root, "cursor-enterprise-security-review.md"), "utf8");
    const pdf = fs.readFileSync(path.join(root, "cursor-enterprise-security-controls.pdf"));

    expect(json.controlCount).toBe(30);
    expect(json.version).toBe("1.1.0");
    expect(json.verifiedAt).toBe("2026-09-08");
    expect(csv).toHaveLength(31);
    expect(markdown).toContain("30 Administrator Controls");
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(20_000);
  });
});
