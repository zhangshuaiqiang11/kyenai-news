import Script from "next/script";
import { useEffect } from "react";

import { getCurrentPagePath, getValidGaId, resourceIdFromHref, trackGrowthEvent } from "../lib/analytics";

export function Analytics() {
  const gaId = getValidGaId();
  useEffect(() => {
    if (!gaId) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      const resourceId = target ? resourceIdFromHref(target.getAttribute("href") ?? target.href) : null;
      if (!resourceId) return;
      trackGrowthEvent("resource_download_click", {
        page_path: getCurrentPagePath(),
        resource_id: resourceId,
      });
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [gaId]);

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
