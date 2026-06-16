import { describe, expect, it, vi } from "vitest";

import handler from "../pages/api/og";

describe("og image API", () => {
  it("returns parameterized SVG with escaped title text", () => {
    const chunks: string[] = [];
    const res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn((body: string) => {
        chunks.push(body);
      }),
    };

    handler({ query: { title: "Codex vs Claude Code <test>" } } as never, res as never);

    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "image/svg+xml; charset=utf-8");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(chunks[0]).toContain("Codex vs Claude Code &lt;test&gt;");
    expect(chunks[0]).toContain('width="1200"');
  });
});
