export const NOINDEX_FOLLOW_ROBOTS = "noindex,follow";

export const MIN_INDEXABLE_CATEGORY_ARTICLES = 3;

const alwaysNoindexPaths = new Set([
  "/contact",
  "/sources",
  "/entities",
  "/authors/editorial-automation-desk",
]);

export function shouldIndexPath(path: string): boolean {
  const normalizedPath = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return !alwaysNoindexPaths.has(normalizedPath);
}

export function shouldIndexCategory(articleCount: number): boolean {
  return articleCount >= MIN_INDEXABLE_CATEGORY_ARTICLES;
}
