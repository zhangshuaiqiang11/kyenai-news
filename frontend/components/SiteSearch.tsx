import Link from "next/link";
import { useRouter } from "next/router";
import { Search, X } from "lucide-react";
import React, { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import type { SearchSite } from "../lib/search-index";

let searchModulePromise: Promise<typeof import("../lib/search-index")> | null = null;

type SiteSearchProps = {
  loadSearch?: () => Promise<SearchSite>;
};

export function SiteSearch({ loadSearch = loadDefaultSearch }: SiteSearchProps = {}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchSite, setSearchSite] = useState<SearchSite | null>(null);
  const [searchLoadFailed, setSearchLoadFailed] = useState(false);

  const results = useMemo(() => {
    return searchSite ? searchSite(query) : [];
  }, [query, searchSite]);

  function openSearch() {
    setIsOpen(true);
    setSearchLoadFailed(false);
    if (!searchSite) {
      void loadSearch().then((loadedSearch) => {
        setSearchSite(() => loadedSearch);
      }).catch(() => {
        setSearchLoadFailed(true);
      });
    }
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function closeSearch() {
    setIsOpen(false);
    setQuery("");
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (triggerRef.current?.contains(target) || inputRef.current?.closest(".site-search-panel")?.contains(target)) {
        return;
      }

      closeSearch();
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  function navigateTo(destination: string) {
    closeSearch();
    void router.push(destination);
  }

  function submitFirstResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!results[0]) {
      return;
    }

    navigateTo(results[0].href);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      closeSearch();
      return;
    }

    if (event.key === "Enter") {
      const firstResult = searchSite?.(event.currentTarget.value)[0];
      if (firstResult) {
        event.preventDefault();
        navigateTo(firstResult.href);
      }
    }
  }

  return (
    <div className="site-search">
      <button
        aria-controls="site-search-panel"
        aria-expanded={isOpen}
        aria-label="Search guides and articles"
        className="icon-button"
        onClick={openSearch}
        ref={triggerRef}
        type="button"
      >
        <Search aria-hidden="true" size={20} />
      </button>
      {isOpen ? (
        <div className="site-search-panel" id="site-search-panel" role="search" aria-label="Site search">
          <form className="site-search-input-row" onSubmit={submitFirstResult}>
            <Search aria-hidden="true" size={18} />
            <input
              aria-label="Search guides and articles"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search AGENTS.md, MCP, Antigravity..."
              ref={inputRef}
              type="search"
              value={query}
            />
            <button aria-label="Close search" className="icon-button" onClick={closeSearch} type="button">
              <X aria-hidden="true" size={18} />
            </button>
          </form>
          <div aria-live="polite" className="site-search-results">
            {query.trim() ? (
              searchLoadFailed ? (
                <p>Search is temporarily unavailable. Close and try again.</p>
              ) : !searchSite ? (
                <p>Loading search index...</p>
              ) : results.length > 0 ? (
                results.map((result) => (
                  <Link
                    href={result.href}
                    key={result.href}
                    onClick={(event) => {
                      event.preventDefault();
                      navigateTo(result.href);
                    }}
                  >
                    <span>{result.label}</span>
                    <strong>{result.title}</strong>
                    <small>{result.summary}</small>
                  </Link>
                ))
              ) : (
                <p>No matching guides or articles yet.</p>
              )
            ) : (
              <p>Search the current AI coding agent guides and source-backed articles.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

async function loadDefaultSearch(): Promise<SearchSite> {
  searchModulePromise ||= import("../lib/search-index");

  try {
    const module = await searchModulePromise;
    return module.searchSite;
  } catch (error) {
    searchModulePromise = null;
    throw error;
  }
}
