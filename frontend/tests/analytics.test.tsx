/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Analytics } from "../components/Analytics";
import { getValidGaId } from "../lib/analytics";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/script", () => ({
  default: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <script {...props}>{children}</script>
  ),
}));

const originalGaId = process.env.NEXT_PUBLIC_GA_ID;

afterEach(() => {
  cleanup();
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
});
