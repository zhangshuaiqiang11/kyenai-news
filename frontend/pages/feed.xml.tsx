import { GetServerSideProps } from "next";

import { getArticles } from "../lib/api";
import { buildRssFeedXml } from "../lib/feed";

export default function Feed() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const articles = await getArticles();

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.write(buildRssFeedXml(articles));
  res.end();
  return { props: {} };
};
