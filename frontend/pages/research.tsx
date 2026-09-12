import Link from "next/link";

import { Layout } from "../components/Layout";
import { SeoHead } from "../components/SeoHead";
import { buildCanonicalUrl } from "../lib/seo";

const assets = [
  {
    id: "instruction-dataset",
    kind: "Dataset",
    label: "Original research dataset",
    title: "AI Coding Agent Instruction File Adoption Report — Q3 2026",
    description: "A bounded 400-file GitHub code-search sample with raw rows, methodology, manifest, BibTeX, CFF, and SHA-256 checksums.",
    page: "/guides/ai-coding-agent-instruction-file-adoption-report-2026",
    downloads: [
      ["CSV", "/resources/data/instruction-file-adoption-report-2026-q3.csv"],
      ["JSON", "/resources/data/instruction-file-adoption-report-2026-q3.json"],
      ["Methodology", "/resources/data/instruction-file-adoption-report-2026-q3-methodology.md"],
    ],
    version: "2026-Q3",
    license: "CC BY 4.0",
    dateModified: "2026-07-14",
  },
  {
    id: "spacex-cursor-status",
    kind: "Dataset",
    label: "Verified status tracker",
    title: "SpaceX–Cursor Deal Status Timeline",
    description: "A dated signed-versus-closed status record, primary filing links, next milestone, open questions, JSON, and CSV timeline.",
    page: "/articles/spacex-cursor-acquisition-2026",
    downloads: [
      ["Status JSON", "/resources/data/spacex-cursor-deal-status.json"],
      ["Timeline CSV", "/resources/data/spacex-cursor-deal-timeline.csv"],
      ["Review checklist", "/resources/cursor-change-of-control-review.md"],
    ],
    version: "1.2",
    license: "CC BY 4.0",
    dateModified: "2026-09-12",
  },
  {
    id: "loop-proof-pack",
    kind: "CreativeWork",
    label: "Engineering runbook",
    title: "Loop Engineering Proof-of-Done Pack",
    description: "A reusable outer-loop runbook with explicit done signals, budgets, evidence gates, stop rules, checklist, contract, and completed example.",
    page: "/guides/loop-engineering-ai-coding-agents",
    downloads: [
      ["Runbook", "/resources/loop-engineering/proof-of-done-runbook.md"],
      ["Checklist", "/resources/loop-engineering/proof-of-done-checklist.csv"],
      ["Example", "/resources/loop-engineering/proof-of-done-example.json"],
    ],
    version: "1.1.0",
    license: "CC BY 4.0",
    dateModified: "2026-07-30",
  },
  {
    id: "cursor-security",
    kind: "Dataset",
    label: "Enterprise security assessment",
    title: "Cursor Enterprise Security: 30 Administrator Controls",
    description: "A source-backed responsibility matrix and 30-control assessment covering identity, Privacy Mode, retention, models, repositories, MCP, sandbox, hooks, and logs.",
    page: "/articles/cursor-enterprise-organizations-governance",
    downloads: [
      ["PDF", "/resources/cursor-enterprise-security-controls.pdf"],
      ["CSV", "/resources/cursor-enterprise-security-controls.csv"],
      ["JSON", "/resources/cursor-enterprise-security-controls.json"],
    ],
    version: "1.2.0",
    license: "CC BY 4.0",
    dateModified: "2026-09-12",
  },
  {
    id: "agents-starter-pack",
    kind: "CreativeWork",
    label: "Open template package",
    title: "AGENTS.md Starter Pack",
    description: "Root, Node.js, Python, and monorepo templates with an example repository layout, version manifest, MIT license, and local verification command.",
    page: "/guides/agents-md-template-for-ai-coding-agents",
    downloads: [
      ["Complete ZIP", "/resources/instruction-files/kyenai-agents-md-starter-pack.zip"],
      ["Root template", "/resources/instruction-files/AGENTS.md"],
      ["Monorepo template", "/resources/instruction-files/AGENTS.monorepo.md"],
    ],
    version: "1.0.0",
    license: "MIT",
    dateModified: "2026-07-30",
  },
] as const;

export default function ResearchPage() {
  const path = "/research";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${buildCanonicalUrl(path)}#page`,
        name: "KyenAI Research and Resources",
        url: buildCanonicalUrl(path),
        description: "Versioned public datasets, security assessments, engineering runbooks, and AI coding agent templates with sources and citation guidance.",
        isPartOf: { "@id": `${buildCanonicalUrl("/")}#website` },
        mainEntity: { "@id": `${buildCanonicalUrl(path)}#resources` },
      },
      {
        "@type": "ItemList",
        "@id": `${buildCanonicalUrl(path)}#resources`,
        numberOfItems: assets.length,
        itemListElement: assets.map((asset, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": `${buildCanonicalUrl(path)}#${asset.id}` },
        })),
      },
      ...assets.map((asset) => ({
        "@type": asset.kind,
        "@id": `${buildCanonicalUrl(path)}#${asset.id}`,
        name: asset.title,
        description: asset.description,
        url: buildCanonicalUrl(asset.page),
        version: asset.version,
        license: asset.license,
        dateModified: asset.dateModified,
        creator: { "@type": "Organization", name: "KyenAI", url: buildCanonicalUrl("/") },
        distribution: asset.downloads.map(([name, contentUrl]) => ({
          "@type": "DataDownload",
          name,
          contentUrl: buildCanonicalUrl(contentUrl),
        })),
      })),
    ],
  };

  return (
    <Layout>
      <SeoHead
        title="AI Coding Agent Research, Datasets & Security Resources"
        description="Download KyenAI's versioned AI coding agent datasets, Loop Engineering runbook, Cursor security assessment, SpaceX–Cursor status tracker, and AGENTS.md templates."
        path={path}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      </SeoHead>
      <article className="research-page">
        <header className="research-hero">
          <p className="instruction-resource-eyebrow">Public research and reusable assets</p>
          <h1>KyenAI Research &amp; Resource Center</h1>
          <p>Download versioned data, assessment controls, runbooks, and templates. Every asset includes a canonical explanation page, source boundary, verification date, and citation path.</p>
          <div className="research-principles" aria-label="Research publishing principles">
            <span>Versioned</span><span>Source-backed</span><span>Downloadable</span><span>Human-verifiable</span>
          </div>
        </header>

        <section className="research-grid" aria-label="KyenAI public research assets">
          {assets.map((asset) => (
            <article id={asset.id} key={asset.id} className="research-card">
              <p className="instruction-resource-eyebrow">{asset.label}</p>
              <h2><Link href={asset.page}>{asset.title}</Link></h2>
              <p>{asset.description}</p>
              <dl>
                <div><dt>Version</dt><dd>{asset.version}</dd></div>
                <div><dt>License</dt><dd>{asset.license}</dd></div>
                <div><dt>Verified</dt><dd><time dateTime={asset.dateModified}>{asset.dateModified}</time></dd></div>
              </dl>
              <div className="research-downloads">
                {asset.downloads.map(([name, href]) => <a href={href} download key={href}>{name}</a>)}
              </div>
              <Link className="research-method-link" href={asset.page}>Read the evidence, method, and citation guidance →</Link>
            </article>
          ))}
        </section>

        <section className="research-citation-policy">
          <h2>How to cite KyenAI assets</h2>
          <p>Link to the canonical explanation page, include the asset title and version, preserve the verification or snapshot date, and repeat the stated limitation when quoting a statistic. Download URLs are stable files, but the canonical page carries context and future updates.</p>
        </section>
      </article>
    </Layout>
  );
}
