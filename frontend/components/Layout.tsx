import dynamic from "next/dynamic";
import Link from "next/link";

import { formatDate, SITE_NAME } from "../lib/seo";
import { getVisibleEditorialUpdate } from "../lib/site-status";

type LayoutProps = {
  children: React.ReactNode;
};

function SiteSearchPlaceholder() {
  return (
    <div className="site-search">
      <button
        aria-controls="site-search-panel"
        aria-expanded={false}
        aria-label="Search guides and articles"
        className="icon-button"
        type="button"
      >
        <IconSearch size={20} />
      </button>
    </div>
  );
}

const SiteSearch = dynamic(
  () => import("./SiteSearch").then(({ SiteSearch }) => SiteSearch),
  {
    ssr: false,
    loading: () => <SiteSearchPlaceholder />,
  },
);

type IconProps = {
  size: number;
};

function IconSearch({ size }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconBell({ size }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </svg>
  );
}

function IconShieldCheck({ size }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

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
        <div className="header-actions">
          <SiteSearch />
          <span aria-hidden="true">
            <IconBell size={20} />
          </span>
          <span aria-hidden="true" className="avatar">
            AK
          </span>
        </div>
      </header>
      <div className="status-strip" role="status">
        {latestEditorialUpdate ? (
          <span>Latest site update {formatDate(latestEditorialUpdate)}</span>
        ) : null}
        <span><IconShieldCheck size={16} /> Evidence-first</span>
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
