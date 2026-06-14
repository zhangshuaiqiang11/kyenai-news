import { describe, expect, it } from "vitest";

import { buildRssFeedXml } from "../lib/feed";
import { seedArticles } from "../lib/seed";

describe("RSS feed helpers", () => {
  it("renders a canonical RSS feed for recent published articles", () => {
    const xml = buildRssFeedXml(seedArticles);
    const firstArticle = seedArticles.find((article) => article.status === "published") || seedArticles[0];

    expect(xml).toContain("<rss version=\"2.0\"");
    expect(xml).toContain("<title>KyenAI</title>");
    expect(xml).toContain("<link>https://www.kyenai.com</link>");
    expect(xml).toContain(`<title>${firstArticle.title}</title>`);
    expect(xml).toContain(`<link>https://www.kyenai.com/articles/${firstArticle.slug}</link>`);
    expect(xml).toContain(`<guid isPermaLink=\"true\">https://www.kyenai.com/articles/${firstArticle.slug}</guid>`);
    expect(xml).toContain("<pubDate>");
    expect(xml).toContain("<dc:creator>Editorial Automation Desk</dc:creator>");
    expect(xml).toContain(firstArticle.sources[0].publisher);
    expect(xml).not.toContain("/operations");
  });
});
