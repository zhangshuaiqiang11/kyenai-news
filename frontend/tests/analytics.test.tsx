/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Analytics } from "../components/Analytics";
import { getValidGaId, resourceIdFromHref, trackGrowthEvent } from "../lib/analytics";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/script", () => ({
  default: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <script {...props}>{children}</script>
  ),
}));

const originalGaId = process.env.NEXT_PUBLIC_GA_ID;

afterEach(() => {
  cleanup();
  delete window.gtag;
  if (originalGaId === undefined) delete process.env.NEXT_PUBLIC_GA_ID;
  else process.env.NEXT_PUBLIC_GA_ID = originalGaId;
});

describe("GA4 configuration", () => {
  it("accepts real measurement IDs and rejects placeholders or malformed values", () => {
    expect(getValidGaId("G-ABC1234XYZ")).toBe("G-ABC1234XYZ");
    expect(getValidGaId(" G-ABC1234XYZ ")).toBe("G-ABC1234XYZ");
    expect(getValidGaId("G-XXXXXXXXXX")).toBeNull();
    expect(getValidGaId("GA-12345")).toBeNull();
    expect(getValidGaId("")).toBeNull();
  });

  it("does not load Google scripts for the documented placeholder", () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-XXXXXXXXXX";
    const { container } = render(<Analytics />);

    expect(container.querySelector("script")).toBeNull();
    expect(container.innerHTML).toBe("");
  });

  it("loads GA4 only for a syntactically valid measurement ID", () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-ABC1234XYZ";
    const { container } = render(<Analytics />);

    expect(container.querySelector('script[src*="G-ABC1234XYZ"]')).not.toBeNull();
    expect(container.textContent).toContain("gtag('config', 'G-ABC1234XYZ'");
  });

  it("tracks only approved identifiers and never sends content", () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-ABC1234XYZ";
    const gtag = vi.fn();
    window.gtag = gtag;

    expect(trackGrowthEvent("tool_use", {
      page_path: "/tools/instruction-file-checker",
      tool_id: "instruction_file_checker",
      action_id: "audit",
    })).toBe(true);
    expect(trackGrowthEvent("tool_use", {
      page_path: "/tools/instruction-file-checker?content=secret",
      tool_id: "instruction_file_checker",
    })).toBe(false);
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("secret");
  });

  it("fails closed when analytics is blocked without breaking the caller", () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-ABC1234XYZ";
    window.gtag = vi.fn(() => {
      throw new Error("blocked");
    });

    expect(trackGrowthEvent("tool_use", {
      page_path: "/tools/instruction-file-checker",
      tool_id: "instruction_file_checker",
    })).toBe(false);
  });

  it("records a resource click after user action without query parameters", () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-ABC1234XYZ";
    const gtag = vi.fn();
    window.gtag = gtag;
    const { container } = render(
      <>
        <Analytics />
        <a href="/resources/template.md?token=private" onClick={(event) => event.preventDefault()}>Download</a>
      </>,
    );

    expect(gtag).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector("a")!);

    expect(gtag).toHaveBeenCalledWith("event", "resource_download_click", expect.objectContaining({
      resource_id: "/resources/template.md",
    }));
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("token");
    expect(resourceIdFromHref("https://example.com/resources/template.md")).toBeNull();
  });
});
