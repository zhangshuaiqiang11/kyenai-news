import Link from "next/link";

import { InstructionFileChecker } from "../../components/InstructionFileChecker";
import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import { INSTRUCTION_COMPARISON_GUIDE_HREF } from "../../lib/guide-routes";
import { instructionDocumentationSources, instructionResourceVerifiedAt } from "../../lib/instruction-resources";
import { buildBreadcrumbJsonLd, buildWebApplicationJsonLd, formatDate } from "../../lib/seo";

const pagePath = "/tools/instruction-file-checker";
const title = "AI Instruction File Checker: Audit AGENTS.md and CLAUDE.md";
const description =
  "Audit AGENTS.md, CLAUDE.md, Copilot instructions, and Cursor rules for setup, tests, scope, safety, file-path support, and maintainability.";

export default function InstructionFileCheckerPage() {
  const applicationJsonLd = buildWebApplicationJsonLd({
    title: "AI Coding Agent Instruction File Checker",
    description,
    path: pagePath,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Agent instructions", path: INSTRUCTION_COMPARISON_GUIDE_HREF },
    { name: "Instruction File Checker", path: pagePath },
  ]);

  const documentationLinks = [
    ["OpenAI Codex official documentation", instructionDocumentationSources.codex],
    ["Anthropic Claude Code official documentation", instructionDocumentationSources.claude],
    ["GitHub Copilot official documentation", instructionDocumentationSources.copilotSupport],
    ["Cursor official documentation", instructionDocumentationSources.cursor],
  ] as const;

  return (
    <Layout>
      <SeoHead title={title} description={description} path={pagePath}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </SeoHead>
      <article className="article-page instruction-checker-page">
        <header className="article-header">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={INSTRUCTION_COMPARISON_GUIDE_HREF}>Agent instructions</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Instruction File Checker</span>
          </nav>
          <p className="instruction-resource-eyebrow">Browser-only developer utility</p>
          <h1>AI Coding Agent Instruction File Checker</h1>
          <p>
            Audit an <code>AGENTS.md</code>, <code>CLAUDE.md</code>, Copilot instruction file, or Cursor project rule for compatibility, executable setup, verification, scope, safety, and maintainability.
          </p>
          <div className="checker-trust-row" aria-label="Tool facts">
            <span>Free</span>
            <span>No sign-in</span>
            <span>No file upload</span>
            <span>Evidence checked {formatDate(instructionResourceVerifiedAt)}</span>
          </div>
        </header>

        <InstructionFileChecker />

        <section className="answer-panel" aria-labelledby="checker-direct-answer-heading">
          <h2 id="checker-direct-answer-heading">Direct answer</h2>
          <p>
            A useful instruction file names its scope and exact setup and verification commands. It also defines safety boundaries and completion expectations.
          </p>
          <p>
            This checker scores those visible signals and verifies the selected file path against a dated product-and-environment matrix. It does not use AI or send your text to a server.
          </p>
        </section>

        <section className="checker-explanation" aria-labelledby="checker-scoring-heading">
          <h2 id="checker-scoring-heading">How the score works</h2>
          <p>
            The score starts at 100 and applies fixed deductions across compatibility, operability, scope, safety, verification, and maintainability. A secret-shaped value or unconditional destructive command creates an error; missing commands, unclear scope, placeholders, and oversized files create targeted warnings. The same input always returns the same result.
          </p>
          <div className="checker-method-grid">
            <div>
              <h3>What it can catch</h3>
              <p>Missing repository commands, weak scope, unsupported paths, unresolved placeholders, secret patterns, hidden bidirectional text, conflicting package managers, invalid Cursor frontmatter, and dangerous shell or Git instructions.</p>
            </div>
            <div>
              <h3>What still needs review</h3>
              <p>Whether commands are accurate, permissions match your threat model, nested files conflict, and the chosen agent follows every rule in practice.</p>
            </div>
          </div>
        </section>

        <section className="checker-resources" aria-labelledby="checker-resources-heading">
          <h2 id="checker-resources-heading">Compare, download, and verify</h2>
          <div className="checker-resource-grid">
            <div>
              <h3>Choose the right file</h3>
              <p>Surface support differs across Codex, Claude Code, Copilot, and Cursor.</p>
              <Link href={INSTRUCTION_COMPARISON_GUIDE_HREF}>Compare instruction files by tool and surface</Link>
            </div>
            <div>
              <h3>Start from a maintained template</h3>
              <p>Replace every example command with one that exists in your repository.</p>
              <a href="/resources/instruction-files/AGENTS.md" download>Download the AGENTS.md template</a>
              <a href="/resources/instruction-files/CLAUDE.md" download>Download the CLAUDE.md template</a>
            </div>
            <div>
              <h3>Use the structured data</h3>
              <p>Review or reuse the compatibility records with their current verification date.</p>
              <a href="/resources/instruction-files/compatibility.json">Open compatibility JSON</a>
              <a href="/resources/instruction-files/compatibility.csv">Open compatibility CSV</a>
            </div>
          </div>
        </section>

        <section className="checker-evidence" aria-labelledby="checker-evidence-heading">
          <h2 id="checker-evidence-heading">Official evidence</h2>
          <p>Path compatibility was checked against first-party publisher documentation on {formatDate(instructionResourceVerifiedAt)}. Product support can change; recheck the source before a migration.</p>
          <ul>
            {documentationLinks.map(([label, href]) => (
              <li key={href}><a href={href} rel="noreferrer">{label}</a></li>
            ))}
          </ul>
        </section>
      </article>
    </Layout>
  );
}
