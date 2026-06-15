import Link from "next/link";
import { Bell, ShieldCheck } from "lucide-react";

import { formatDate, SITE_NAME } from "../lib/seo";
import { getVisibleEditorialUpdate } from "../lib/site-status";
import { SiteSearch } from "./SiteSearch";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const latestEditorialUpdate = getVisibleEditorialUpdate();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
          {SITE_NAME}
        </Link>
        <nav className="main-nav" aria-label="Primary navigation">
          <Link href="/guides">Guides</Link>
          <Link href="/categories/AI%20Coding%20Agents">AI Agents</Link>
          <Link href="/categories/IDE%20%26%20CLI">IDE & CLI</Link>
          <Link href="/categories/Security%20%26%20Governance">Governance</Link>
          <Link href="/sources">Sources</Link>
          <Link href="/entities">Entities</Link>
          <Link href="/editorial-policy">Editorial</Link>
        </nav>
        <div className="header-actions" aria-label="Portal status">
          <SiteSearch />
          <Bell aria-hidden="true" size={20} />
          <span className="avatar">AK</span>
        </div>
      </header>
      <div className="status-strip">
        {latestEditorialUpdate ? (
          <span>Latest site update {formatDate(latestEditorialUpdate)}</span>
        ) : null}
        <span><ShieldCheck aria-hidden="true" size={16} /> Evidence-first</span>
        <span>Cited sources visible</span>
        <span>Editorial guardrails active</span>
      </div>
      <main id="main-content">{children}</main>
      <footer className="site-footer" aria-label="Footer">
        <Link href="/about">About</Link>
        <Link href="/guides">Guides</Link>
        <Link href="/entities">Entities</Link>
        <Link href="/editorial-policy">Methodology</Link>
        <Link href="/contact">Contact</Link>
        <span>© 2026 {SITE_NAME}</span>
      </footer>
    </>
  );
}
