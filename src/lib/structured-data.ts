// Helpers for generating JSON-LD structured data.

const SITE_URL = "https://www.kidtocollege.com";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

/**
 * Generate a BreadcrumbList JSON-LD object.
 * The last item is treated as the current page (no path needed).
 *
 * Example:
 *   breadcrumbsLd([
 *     { label: "Home", path: "/" },
 *     { label: "Colleges", path: "/colleges" },
 *     { label: "University of Texas at Austin" }
 *   ])
 */
export function breadcrumbsLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.path ? { item: `${SITE_URL}${it.path}` } : {}),
    })),
  };
}

/**
 * Inline <script> JSON-LD tag for use in server components.
 * Returns a stringified object ready to drop into dangerouslySetInnerHTML.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data);
}
