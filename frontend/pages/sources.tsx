import { Layout } from "../components/Layout";
import { SeoHead } from "../components/SeoHead";
import { getArticles } from "../lib/api";
import { getAllSources } from "../lib/catalog";
import { buildBreadcrumbJsonLd, buildCanonicalUrl, formatDate } from "../lib/seo";
import type { EvidenceSource } from "../lib/types";

type SourcesPageProps = {
  sources: EvidenceSource[];
};

export default function SourcesPage({ sources }: SourcesPageProps) {
  const description =
    "The KyenAI source ledger lists official changelogs, vendor blogs, and documentation pages used as evidence for every published article.";
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Source Ledger", path: "/sources" },
  ]);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "KyenAI Source Ledger",
    url: buildCanonicalUrl("/sources"),
    numberOfItems: sources.length,
    itemListElement: sources.map((source, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: source.title,
      url: source.url,
    })),
  };

  return (
    <Layout>
      <SeoHead title="Source Ledger" description={description} path="/sources" robots="noindex,follow">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      </SeoHead>
      <section className="listing-page sources-page">
        <h1>Source Ledger</h1>
        <p>Official and high-confidence sources used by the portal's content automation guardrails.</p>
        <div className="source-card-grid">
          {sources.map((source) => (
            <article className="source-card" key={source.url}>
              <span>{source.publisher}</span>
              <h2><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></h2>
              <dl>
                <div><dt>Published</dt><dd>{formatDate(source.publishedAt)}</dd></div>
                <div><dt>Credibility</dt><dd>{source.credibility}/5</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const articles = await getArticles();
  return {
    props: {
      sources: getAllSources(articles),
    },
    revalidate: 300,
  };
}
