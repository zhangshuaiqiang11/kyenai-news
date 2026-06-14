import { GetServerSideProps } from "next";

import { getArticles } from "../lib/api";
import { buildSitemapEntries, renderSitemapXml } from "../lib/sitemap";

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const articles = await getArticles();
  const body = renderSitemapXml(buildSitemapEntries(articles));

  res.setHeader("Content-Type", "application/xml");
  res.write(body);
  res.end();
  return { props: {} };
};
