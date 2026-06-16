import { slugify } from "./seo";

export function buildCategorySlug(category: string): string {
  return slugify(category);
}

export function buildCategoryPath(category: string): string {
  return `/categories/${buildCategorySlug(category)}`;
}

export function resolveCategoryFromParam(param: string, knownCategories: string[]): string | null {
  const decoded = decodeURIComponent(param);

  if (knownCategories.includes(decoded)) {
    return decoded;
  }

  return knownCategories.find((category) => buildCategorySlug(category) === param || buildCategorySlug(category) === decoded) ?? null;
}

export function isCanonicalCategoryParam(param: string, category: string): boolean {
  return param === buildCategorySlug(category);
}
