import { GetServerSideProps } from "next";

import { buildLlmsTxt } from "../lib/llms";

export default function LlmsTxt() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(buildLlmsTxt());
  res.end();
  return { props: {} };
};
