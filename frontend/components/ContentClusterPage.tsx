import Link from "next/link";

import { ArticleCard } from "./ArticleCard";
import { Layout } from "./Layout";
import { SeoHead } from "./SeoHead";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildGuideItemListJsonLd, buildItemListJsonLd } from "../lib/seo";
import { ARTICLE_REVIEW_OWNER } from "../lib/reviewer";
import type { ContentCluster } from "../lib/content-clusters";
import type { Article, Guide } from "../lib/types";

type Props = { cluster: ContentCluster; guides: Guide[]; articles: Article[] };

export function ContentClusterPage({ cluster, guides, articles }: Props) {
  const path = `/${cluster.slug}/`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: cluster.title, path }]);
  const collectionJsonLd = buildCollectionPageJsonLd({ title: cluster.title, description: cluster.description, path });
  const guideListJsonLd = buildGuideItemListJsonLd(guides, `${cluster.title} guides`, path);
  const articleListJsonLd = buildItemListJsonLd(articles, `${cluster.title} evidence updates`, path);

  return (
    <Layout>
      <SeoHead title={cluster.title} description={cluster.description} path={path}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideListJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleListJsonLd) }} />
      </SeoHead>
      <section className="listing-page">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{cluster.title}</span></nav>
        <h1>{cluster.title}</h1>
        <div className="category-overview">{cluster.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <section className="related-guides" aria-labelledby="cluster-guides-heading">
          <div className="section-heading"><div><h2 id="cluster-guides-heading">Core guides</h2><p>Start with durable decisions, then apply the implementation details.</p></div><Link href="/guides">All guides</Link></div>
          <div>{guides.map((guide) => <article key={guide.id}><span>{guide.pageType}</span><h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3><p>{guide.summary}</p></article>)}</div>
        </section>
        <section aria-labelledby="cluster-updates-heading">
          <div className="section-heading"><div><h2 id="cluster-updates-heading">Evidence updates</h2><p>Dated product changes connected to this operating decision.</p></div></div>
          <div className="article-list">{articles.map((article, index) => <ArticleCard article={article} index={index} key={article.id} />)}</div>
        </section>
        <aside className="resource-citation-note" aria-label="Human review boundary">
          <strong>Human reviewer: <a href={ARTICLE_REVIEW_OWNER.profileUrl} rel="noreferrer" target="_blank">{ARTICLE_REVIEW_OWNER.handle}</a></strong>
          <p>Cluster links are editorially reviewed for evidence scope. Vendor behavior and performance are not treated as tested unless a linked record says so.</p>
        </aside>
      </section>
    </Layout>
  );
}
