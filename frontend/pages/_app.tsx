import type { AppProps, NextWebVitalsMetric } from "next/app";
import Head from "next/head";

import { Analytics } from "../components/Analytics";

import "../styles/globals.css";
import "../styles/seo-hubs.css";

declare global {
  interface Window {
    gtag?: (command: "event" | "config" | "js", name: string, params?: Record<string, unknown>) => void;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Analytics />
      <Component {...pageProps} />
    </>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtag = typeof window !== "undefined" ? window.gtag : undefined;

  if (!gaId || !gtag) {
    return;
  }

  const value = metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value);
  gtag("event", metric.name, {
    event_category: "Web Vitals",
    event_label: metric.id,
    non_interaction: true,
    value,
  });
}
