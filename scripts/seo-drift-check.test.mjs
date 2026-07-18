import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { test } from "node:test";

const origin = "https://www.kyenai.com";
const pageContracts = [
  ["/", "KyenAI | AI Coding Agent Templates & Security Playbooks", "Evidence-Backed Templates and Security Playbooks for AI Coding Agents"],
  ["/guides/agents-md-template-for-ai-coding-agents", "AGENTS.md Template for Codex", "AGENTS.md Template for Codex and Monorepos"],
  ["/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "AGENTS.md vs CLAUDE.md vs Copilot Instructions", "AGENTS.md vs CLAUDE.md vs Copilot Instructions"],
  ["/guides/secure-mcp-servers-ai-coding-agents", "MCP Server Security Checklist: 25 Controls", "MCP Server Security Checklist: 25 Controls"],
  ["/guides/mcp-server-not-showing-tools", "MCP Server Not Showing Tools? 8 Checks", "MCP Server Not Showing Tools? Diagnose tools/list in 8 Checks"],
  ["/guides/codex-vs-claude-code", "Codex vs Claude Code", "Codex vs Claude Code"],
  ["/guides/codex-vs-github-copilot", "Codex vs GitHub Copilot", "Codex vs GitHub Copilot"],
  ["/guides/ai-coding-agents-comparison", "AI Coding Agent Comparison", "AI Coding Agents Comparison"],
  ["/guides/claude-code-alternatives", "7 Claude Code Alternatives", "7 Claude Code Alternatives"],
  ["/guides/loop-engineering-ai-coding-agents", "What Is Loop Engineering?", "What Is Loop Engineering for AI Coding Agents?"],
  ["/guides/ai-coding-agent-instruction-file-adoption-report-2026", "AI Agent Instruction File Adoption", "AI Coding Agent Instruction File Adoption Report"],
  ["/tools/instruction-file-checker", "Instruction File Checker", "AI Coding Agent Instruction File Checker"],
  ["/sources", "Source & Verification Ledger", "Source & Verification Ledger"],
  ["/articles/spacex-cursor-acquisition-2026", "Did SpaceX Buy Cursor? $60B Deal Status & Timeline", "Did SpaceX Buy Cursor? $60B Deal Status and Timeline"],
];

function html(path, title, h1) {
  const canonical = path === "/" ? origin : new URL(path, origin).toString();
  return `<!doctype html><html><head><title>${title}</title>
    <meta name="description" content="A sufficiently detailed description for deterministic SEO regression testing across every important route.">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="A detailed Open Graph description used by the test fixture.">
    <meta property="og:url" content="${canonical}"><meta property="og:image" content="${origin}/og.png">
    <link rel="canonical" href="${canonical}">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script>
    </head><body><h1>${h1}</h1></body></html>`;
}

async function runCheck(baseUrl) {
  const child = spawn(process.execPath, ["scripts/seo-drift-check.mjs", "--base-url", baseUrl], {
    cwd: new URL("..", import.meta.url),
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => (stdout += chunk));
  child.stderr.setEncoding("utf8").on("data", (chunk) => (stderr += chunk));
  const [code] = await once(child, "close");
  return { code, stdout, stderr };
}

test("SEO drift check passes the known-good contract", async (t) => {
  const pages = new Map(pageContracts.map(([path, title, h1]) => [path, html(path, title, h1)]));
  const server = createServer((request, response) => {
    const path = new URL(request.url, "http://localhost").pathname;
    if (pages.has(path)) {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(pages.get(path));
      return;
    }
    if (path === "/robots.txt") {
      response.writeHead(200, { "content-type": "text/plain" });
      response.end(["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot"].map((crawler) => `User-agent: ${crawler}\nAllow: /`).join("\n") + `\nSitemap: ${origin}/sitemap.xml\n`);
      return;
    }
    if (path === "/sitemap.xml") {
      response.writeHead(200, { "content-type": "application/xml" });
      response.end(`<urlset>${pageContracts.map(([pagePath]) => `<url><loc>${pagePath === "/" ? origin : new URL(pagePath, origin)}</loc></url>`).join("")}</urlset>`);
      return;
    }
    if (path === "/llms.txt") {
      response.writeHead(200, { "content-type": "text/plain" });
      response.end(pageContracts.filter(([pagePath]) => pagePath.startsWith("/guides/")).map(([pagePath]) => new URL(pagePath, origin)).join("\n"));
      return;
    }
    response.writeHead(404).end();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => server.close());

  const address = server.address();
  const result = await runCheck(`http://127.0.0.1:${address.port}`);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  assert.equal(report.pagesChecked, 17);
  assert.equal(report.failures, 0);
});

test("SEO drift check fails on a missing canonical", async (t) => {
  const server = createServer((request, response) => {
    const path = new URL(request.url, "http://localhost").pathname;
    const contract = pageContracts.find(([pagePath]) => pagePath === path);
    if (contract) {
      response.writeHead(200, { "content-type": "text/html" });
      response.end(html(...contract).replace(/<link rel="canonical"[^>]+>/, ""));
      return;
    }
    response.writeHead(200, { "content-type": "text/plain" }).end("");
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => server.close());

  const address = server.address();
  const result = await runCheck(`http://127.0.0.1:${address.port}`);
  assert.equal(result.code, 1);
  assert.match(result.stdout, /canonical mismatch/);
});
