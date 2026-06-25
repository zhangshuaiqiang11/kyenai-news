import Head from "next/head";
import type { ReactNode } from "react";

import { buildCanonicalUrl, buildPageSeo } from "../lib/seo";

type SeoHeadProps = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  robots?: string;
  ogImage?: string;
  children?: ReactNode;
};

export function SeoHead({ title, description, path, type, robots, ogImage, children }: SeoHeadProps) {
  const seo = buildPageSeo({ title, description, path, type });
  const imageUrl = ogImage || seo.ogImage;

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {robots ? <meta name="robots" content={robots} /> : null}
      <link rel="canonical" href={seo.canonical} />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="512x512" href="/icon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="alternate" type="application/rss+xml" title="KyenAI RSS Feed" href={buildCanonicalUrl("/feed.xml")} />
      <link rel="alternate" type="text/plain" title="KyenAI llms.txt" href={buildCanonicalUrl("/llms.txt")} />
      <meta property="og:title" content={seo.openGraph.title} />
      <meta property="og:description" content={seo.openGraph.description} />
      <meta property="og:type" content={seo.openGraph.type} />
      <meta property="og:url" content={seo.openGraph.url} />
      <meta property="og:site_name" content={seo.openGraph.siteName} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content={seo.twitter.card} />
      <meta name="twitter:title" content={seo.twitter.title} />
      <meta name="twitter:description" content={seo.twitter.description} />
      <meta name="twitter:image" content={imageUrl} />
      {children}
    </Head>
  );
}
