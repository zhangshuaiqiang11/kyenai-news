import { buildArticleFaqs, type FaqItem } from "./seo";
import type { Article } from "./types";

export function getVisibleArticleFaqs(article: Article): FaqItem[] {
  const authoredFaqs = article.blocks
    .filter((block) => block.type === "faq")
    .map((block) => {
      const [question, ...answerParts] = block.content.split("\n");
      return {
        question: question.trim(),
        answer: answerParts.join("\n").trim(),
      };
    })
    .filter((faq) => faq.question.length > 0 && faq.answer.length > 0);

  return authoredFaqs.length > 0 ? authoredFaqs : buildArticleFaqs(article);
}
