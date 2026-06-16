import Link from "next/link";

import { Layout } from "../components/Layout";
import { SeoHead } from "../components/SeoHead";
import { getArticles } from "../lib/api";
import { getEntityCoverage, type BrandEntity } from "../lib/entities";
import { NOINDEX_FOLLOW_ROBOTS } from "../lib/indexation";
import { buildBreadcrumbJsonLd, buildCanonicalUrl } from "../lib/seo";
import type { Article } from "../lib/types";

type EntitiesPageProps = {
  articles: Article[];
  entities: BrandEntity[];
};

export default function EntitiesPage({ articles, entities }: EntitiesPageProps) {
  const articleBySlug = new Map(articles.map((article) => [article.slug, article]));
  const covered = entities.filter((entity) => entity.coverageStatus === "covered");
  const watchlisted = entities.filter((entity) => entity.coverageStatus === "watchlisted");
  const description =
    "Official brand and product entities referenced by KyenAI, with source links, coverage status, and non-endorsement boundaries.";
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Entity Ledger", path: "/entities" },
  ]);
  const entityListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI brand entity ledger",
    url: buildCanonicalUrl("/entities"),
    numberOfItems: entities.length,
    itemListElement: entities.map((entity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entity.name,
      url: `${buildCanonicalUrl("/entities")}#${entity.slug}`,
    })),
  };

  return (
    <Layout>
      <SeoHead
        title="Entity Ledger"
        description={description}
        path="/entities"
        robots={NOINDEX_FOLLOW_ROBOTS}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entityListJsonLd) }} />
      </SeoHead>
      <section className="listing-page entity-ledger">
        <h1>Entity Ledger</h1>
        <p>
          Official AI, coding, and search-platform entities referenced for market context. These mentions help readers
          and answer engines understand relationships without implying partnership, endorsement, certification, or ranking claims.
        </p>
        <section aria-labelledby="covered-entities-heading">
          <h2 id="covered-entities-heading">Covered Entities</h2>
          <div className="entity-card-grid">
            {covered.map((entity) => (
              <EntityCard articleBySlug={articleBySlug} entity={entity} key={entity.id} />
            ))}
          </div>
        </section>
        <section aria-labelledby="watchlisted-entities-heading">
          <h2 id="watchlisted-entities-heading">Watchlisted Entities</h2>
          <p>
            These brands are tracked for future relevance, but the portal does not attach them to an article until a
            credible source supports the specific claim.
          </p>
          <div className="entity-card-grid">
            {watchlisted.map((entity) => (
              <EntityCard articleBySlug={articleBySlug} entity={entity} key={entity.id} />
            ))}
          </div>
        </section>
      </section>
    </Layout>
  );
}

function EntityCard({ articleBySlug, entity }: { articleBySlug: Map<string, Article>; entity: BrandEntity }) {
  const coveredArticles = entity.coveredArticleSlugs
    .map((slug) => articleBySlug.get(slug))
    .filter((article): article is Article => Boolean(article));

  return (
    <article className="entity-card" id={entity.slug}>
      <span>{entity.kind === "Organization" ? "Organization" : "Product"}</span>
      <h3>
        <a href={entity.officialUrl} rel="noreferrer" target="_blank">{entity.name}</a>
      </h3>
      <p>{entity.relationship}</p>
      <dl>
        <div>
          <dt>Source</dt>
          <dd>Official</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{entity.coverageStatus === "covered" ? "Covered" : "Watchlisted"}</dd>
        </div>
      </dl>
      <p className="entity-disclosure">{entity.mentionPolicy}</p>
      {coveredArticles.length > 0 ? (
        <ul>
          {coveredArticles.map((article) => (
            <li key={article.id}>
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="entity-empty">No article claim is attached yet.</p>
      )}
    </article>
  );
}

export async function getStaticProps() {
  const articles = await getArticles();
  return {
    props: {
      articles,
      entities: getEntityCoverage(articles),
    },
    revalidate: 300,
  };
}
