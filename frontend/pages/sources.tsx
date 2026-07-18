import Link from "next/link";

import { Layout } from "../components/Layout";
import { SeoHead } from "../components/SeoHead";
import { getArticles } from "../lib/api";
import { getGuides } from "../lib/guides";
import { buildBreadcrumbJsonLd, buildCanonicalUrl, buildCollectionPageJsonLd, formatDate } from "../lib/seo";
import { buildSourceLedger, getSourceLedgerCoverage, type SourceLedgerEntry } from "../lib/source-ledger";

export type SourcesPageProps = { sources: SourceLedgerEntry[] };

export default function SourcesPage({ sources }: SourcesPageProps) {
  const coverage = getSourceLedgerCoverage(sources);
  const description =
    "Verify the official documentation, announcements, primary records, standards, and reporting used by KyenAI guides and articles, with review dates, status, and page-level usage.";
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Source Ledger", path: "/sources" },
  ]);
  const collectionPageJsonLd = buildCollectionPageJsonLd({
    title: "KyenAI Source Ledger",
    description,
    path: "/sources",
  });
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "KyenAI source and verification ledger",
    url: buildCanonicalUrl("/sources"),
    numberOfItems: sources.length,
    itemListElement: sources.map((source, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: source.title,
        url: source.url,
        publisher: { "@type": "Organization", name: source.publisher },
      },
    })),
  };

  return (
    <Layout>
      <SeoHead title="Source & Verification Ledger" description={description} path="/sources">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      </SeoHead>
      <section className="listing-page sources-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Source Ledger</span>
        </nav>
        <h1>Source & Verification Ledger</h1>
        <p>
          Every entry shows who published the source, what kind of evidence it is, when KyenAI last checked it,
          when editorial review is due, and which guide or article relies on it. A review-due label is a maintenance
          signal—not a claim that the underlying source is false.
        </p>

        <section className="ledger-summary" aria-labelledby="ledger-summary-heading">
          <div>
            <p className="instruction-resource-eyebrow">Evidence coverage</p>
            <h2 id="ledger-summary-heading">One ledger for guides and articles</h2>
            <p>Product documentation is scheduled for review every 14 days; announcements and independent reporting every 30 days; standards and primary records every 90 days.</p>
          </div>
          <dl>
            <div><dt>Sources</dt><dd>{coverage.sources}</dd></div>
            <div><dt>Publishers</dt><dd>{coverage.publishers}</dd></div>
            <div><dt>Guides covered</dt><dd>{coverage.guides}</dd></div>
            <div><dt>Articles covered</dt><dd>{coverage.articles}</dd></div>
            <div><dt>Review due</dt><dd>{coverage.reviewDue}</dd></div>
            <div><dt>Superseded</dt><dd>{coverage.superseded}</dd></div>
          </dl>
        </section>

        <section className="answer-panel methodology-panel" aria-labelledby="source-ledger-method-heading">
          <h2 id="source-ledger-method-heading">How to read the ledger</h2>
          <p>
            High confidence means an official publisher or standards body owns the source. Medium confidence marks
            independent reporting that still needs direct attribution. “Last checked” comes from the substantive
            update date of the page using the source. “Next review” is KyenAI’s editorial schedule, not the source’s
            expiration date. A source remains visible if it is later superseded so readers can audit historical claims.
          </p>
        </section>

        <div className="source-card-grid">
          {sources.map((source) => (
            <article className="source-card" key={source.url}>
              <div className="source-card-labels">
                <span>{source.publisher}</span>
                <span data-status={source.status.toLowerCase().replace(" ", "-")}>{source.status}</span>
              </div>
              <h2><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></h2>
              <dl>
                <div><dt>Source type</dt><dd>{source.sourceType}</dd></div>
                <div><dt>Confidence</dt><dd>{source.confidence}</dd></div>
                <div><dt>Published</dt><dd>{source.publishedAt ? formatDate(source.publishedAt) : "Not recorded"}</dd></div>
                <div><dt>Last checked</dt><dd>{formatDate(source.lastVerifiedAt)}</dd></div>
                <div><dt>Next review</dt><dd>{formatDate(source.nextReviewAt)}</dd></div>
                <div><dt>Cadence</dt><dd>{source.reviewCadenceDays} days</dd></div>
                <div><dt>Superseded</dt><dd>{source.supersededBy ? "Yes" : "No record"}</dd></div>
              </dl>
              <div className="source-usage-list">
                <strong>Used by</strong>
                <ul>
                  {source.usedBy.map((usage) => (
                    <li key={usage.path}>
                      <Link href={usage.path}>{usage.title}</Link>
                      <span>{usage.kind} · checked {formatDate(usage.verifiedAt)}{usage.passages ? ` · ${usage.passages} cited passage${usage.passages === 1 ? "" : "s"}` : ""}</span>
                      <small>{usage.note}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const asOfDate = new Date().toISOString().slice(0, 10);
  return {
    props: {
      sources: buildSourceLedger(await getArticles(), getGuides(), asOfDate),
    },
    revalidate: 300,
  };
}
