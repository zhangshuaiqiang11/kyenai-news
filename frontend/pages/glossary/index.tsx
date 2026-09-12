import Link from "next/link";

import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import { getGlossaryTerms } from "../../lib/glossary";
import {
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
  buildCollectionPageJsonLd,
} from "../../lib/seo";

export default function GlossaryIndexPage() {
  const terms = getGlossaryTerms();
  const description =
    "Glossary of AI coding agent terminology used across KyenAI guides, including loop engineering and AI coding agent definitions.";
  const canonical = buildCanonicalUrl("/glossary");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
  ]);
  const collectionPageJsonLd = buildCollectionPageJsonLd({
    title: "Glossary",
    description,
    path: "/glossary",
  });
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "KyenAI Glossary",
    url: canonical,
    numberOfItems: terms.length,
    itemListElement: terms.map((term, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: term.term,
      url: buildCanonicalUrl(`/glossary/${term.slug}`),
    })),
  };

  return (
    <Layout>
      <SeoHead title="Glossary" description={description} path="/glossary">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      </SeoHead>
      <section className="listing-page glossary-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Glossary</span>
        </nav>
        <h1>Glossary</h1>
        <p>
          Plain-language definitions for the AI coding agent terms used across KyenAI guides, including
          loop engineering and what counts as an AI coding agent. Each entry links to the related guides
          where the term is applied in practice.
        </p>
        <div className="source-card-grid">
          {terms.map((term) => (
            <article className="source-card" key={term.slug}>
              <span>Definition</span>
              <h2>
                <Link href={`/glossary/${term.slug}`}>{term.term}</Link>
              </h2>
              <p>{term.definition}</p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
