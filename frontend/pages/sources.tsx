import { Layout } from "../components/Layout";
import { SeoHead } from "../components/SeoHead";
import { getArticles } from "../lib/api";
import { getAllSources } from "../lib/catalog";
import { getPublishedArticles } from "../lib/publication";
import { buildBreadcrumbJsonLd, buildCanonicalUrl, formatDate } from "../lib/seo";
import type { EvidenceSource } from "../lib/types";

type SourceUsage = EvidenceSource & { usedBy: Array<{ slug: string; title: string; passages: number }> };

type SourcesPageProps = { sources: SourceUsage[] };

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
      <SeoHead title="Source Ledger" description={description} path="/sources">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      </SeoHead>
      <section className="listing-page sources-page">
        <h1>Source Ledger</h1>
        <p>
          Official and high-confidence sources used by the portal's content automation guardrails. This page is
          indexable so readers, search crawlers, and AI answer systems can verify the evidence trail behind KyenAI
          guides and updates.
        </p>
        <div className="source-card-grid">
          {sources.map((source) => (
            <article className="source-card" key={source.url}>
              <span>{source.publisher}</span>
              <h2><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></h2>
              <dl>
                <div><dt>Published</dt><dd>{formatDate(source.publishedAt)}</dd></div>
                <div><dt>Credibility</dt><dd>{source.credibility}/5</dd></div>
              </dl>
              {source.usedBy.length > 0 ? (
                <div>
                  <strong>Used by</strong>
                  <ul>
                    {source.usedBy.map((article) => (
                      <li key={article.slug}>
                        <Link href={`/articles/${article.slug}`}>{article.title}</Link>{" "}
                        <small>({article.passages} cited passage{article.passages === 1 ? "" : "s"})</small>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const articles = getPublishedArticles(await getArticles());
  return {
    props: {
      sources: getAllSources(articles).map((source) => ({
        ...source,
        usedBy: articles.flatMap((article) => {
          const passages = article.blocks.filter((block) => block.sourceIds.includes(source.id)).length;
          return article.sources.some((candidate) => candidate.id === source.id || candidate.url === source.url)
            ? [{ slug: article.slug, title: article.title, passages }]
            : [];
        }),
      })),
    },
    revalidate: 300,
  };
}
import Link from "next/link";
