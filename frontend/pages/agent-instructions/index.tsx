import { GetStaticProps } from "next";

import { ContentClusterPage } from "../../components/ContentClusterPage";
import { getArticles } from "../../lib/api";
import { getClusterArticles, getClusterGuides, getContentCluster } from "../../lib/content-clusters";
import { getGuides } from "../../lib/guides";

export default ContentClusterPage;

export const getStaticProps: GetStaticProps = async () => {
  const cluster = getContentCluster("agent-instructions")!;
  return { props: { cluster, guides: getClusterGuides(cluster, getGuides()), articles: getClusterArticles(cluster, await getArticles()) }, revalidate: 300 };
};
