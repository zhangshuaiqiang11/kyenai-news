import { describe, expect, it } from "vitest";

import handler from "../pages/api/guide-md";

function createResponse() {
  const headers = new Map<string, string>();
  return {
    headers,
    statusCode: 0,
    body: "",
    setHeader(name: string, value: string) {
      headers.set(name.toLowerCase(), value);
      return this;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    send(body: string) {
      this.body = body;
      return this;
    },
    json(body: unknown) {
      this.body = JSON.stringify(body);
      return this;
    },
  };
}

describe("guide Markdown API", () => {
  it.each(["GET", "HEAD"])("serves %s with noindex and canonical HTTP headers", (method) => {
    const response = createResponse();
    handler(
      {
        method,
        query: { slug: "loop-engineering-ai-coding-agents" },
      } as never,
      response as never,
    );

    expect(response.statusCode).toBe(200);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, follow");
    expect(response.headers.get("link")).toBe(
      '<https://www.kyenai.com/guides/loop-engineering-ai-coding-agents>; rel="canonical"',
    );
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    if (method === "HEAD") {
      expect(response.body).toBe("");
    } else {
      expect(response.body).toContain("# What Is Loop Engineering");
    }
  });

  it("advertises both supported methods", () => {
    const response = createResponse();
    handler({ method: "POST", query: {} } as never, response as never);

    expect(response.statusCode).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD");
  });

  it("exposes citation and integrity links in the adoption report Markdown", () => {
    const response = createResponse();
    handler(
      {
        method: "GET",
        query: { slug: "ai-coding-agent-instruction-file-adoption-report-2026" },
      } as never,
      response as never,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain("## Dataset citation and verification");
    expect(response.body).toContain("This release has no DOI");
    expect(response.body).toContain("instruction-file-adoption-report-2026-q3-citation.bib");
    expect(response.body).toContain("instruction-file-adoption-report-2026-q3-sha256.txt");
    expect(response.body).toContain("instruction-file-adoption-report-2026-q3-generator.mjs");
  });
});
