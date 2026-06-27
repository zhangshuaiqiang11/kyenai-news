import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import { getGlossaryTerm, getGlossaryTerms, type GlossaryTerm } from "../../lib/glossary";
import {
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "../../lib/seo";

type GlossaryTermPageProps = {
  term: GlossaryTerm;
};

export default function GlossaryTermPage({ term }: GlossaryTermPageProps) {
  const canonical = buildCanonicalUrl(`/glossary/${term.slug}`);
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
    { name: term.term, path: `/glossary/${term.slug}` },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems, false);
  const definedTermNode = {
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    url: canonical,
    inDefinedTermSet: buildCanonicalUrl("/glossary"),
  };
  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      stripContext(buildOrganizationJsonLd(false)),
      stripContext(buildWebsiteJsonLd(false)),
      breadcrumbJsonLd,
      definedTermNode,
    ],
  };

  return (
    <Layout>
      <SeoHead title={`${term.term} | KyenAI`} description={term.definition} path={`/glossary/${term.slug}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />
      </SeoHead>
      <article className="article-page glossary-term-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/glossary">Glossary</Link>
          <span aria-hidden="true">/</span>
          <span>{term.term}</span>
        </nav>
        <h1>{term.term}</h1>
        <p className="lead">{term.definition}</p>
        <section>
          <h2>Detailed definition</h2>
          <p>{term.longDefinition}</p>
        </section>
        {term.related.length > 0 ? (
          <section>
            <h2>Related guides</h2>
            <ul className="guide-checklist">
              {term.related.map((href) => (
                <li key={href}>
                  <Link href={href}>{href}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </Layout>
  );
}

function stripContext(node: Record<string, unknown>): Record<string, unknown> {
  const { "@context": _context, ...rest } = node;
  return rest;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getGlossaryTerms().map((term) => ({ params: { slug: term.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<GlossaryTermPageProps> = async ({ params }) => {
  const term = getGlossaryTerm(String(params?.slug || ""));
  if (!term) {
    return { notFound: true };
  }
  return {
    props: { term },
    revalidate: 300,
  };
};
