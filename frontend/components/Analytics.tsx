import Script from "next/script";

import { getValidGaId } from "../lib/analytics";

export function Analytics() {
  const gaId = getValidGaId();
  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
