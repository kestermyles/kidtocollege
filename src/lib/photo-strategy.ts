// Photo-acquisition strategy for college pages.
//
// Tries three strategies in order:
//   1. Pull og:image / twitter:image from the college's own website.
//      Credit links back to the school's site.
//   2. Validated Unsplash search "[school name] campus" — accepts only
//      results whose metadata mentions the school's distinctive tokens
//      or city.
//   3. Category-varied fallback: each college's slug hashes to one of
//      several "close-up subject" queries (library books, study desk,
//      graduation cap, etc.) so two slugs don't end up with the same
//      generic image.

export interface PhotoResult {
  url: string
  creditName: string | null
  creditUrl: string | null
}

interface UnsplashPhoto {
  id: string
  alt_description: string | null
  description: string | null
  tags?: { title: string }[]
  urls: { regular: string }
  user: { name: string; links: { html: string } }
}

// -----------------------------------------------------------------------
// Strategy 1: og:image from the school's own site
// -----------------------------------------------------------------------

/**
 * Extracts the highest-quality preview image a college publishes on its
 * own homepage. Most US colleges set og:image / twitter:image to their
 * featured campus photo for social sharing — exactly what we want.
 *
 * Returns null when the site doesn't load, has no preview image, or the
 * image fails validation (wrong content-type, obviously a logo, etc.).
 */
export async function getOgImageFromCollegeSite(
  officialUrl: string,
  collegeName: string,
): Promise<PhotoResult | null> {
  try {
    const u = new URL(officialUrl)
    const res = await fetch(officialUrl, {
      // Many .edu sites refuse non-browser User-Agents.
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) return null
    const html = await res.text()
    const imgUrl = extractMetaImage(html)
    if (!imgUrl) return null

    // Resolve relative URLs against the school's domain
    const resolved = new URL(imgUrl, officialUrl).toString()
    if (!isPlausibleImageUrl(resolved)) return null
    // Skip obvious logo / favicon URLs
    if (/logo|favicon|icon-|-icon|brand-mark/i.test(resolved)) return null

    return {
      url: resolved,
      creditName: `${collegeName} website`,
      creditUrl: u.origin,
    }
  } catch {
    return null
  }
}

function extractMetaImage(html: string): string | null {
  // Look at og:image first, then twitter:image. Match attribute order
  // permissively (some sites put name= before content=, some after).
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m && m[1]) return m[1].trim()
  }
  return null
}

function isPlausibleImageUrl(url: string): boolean {
  // Accept anything with an image extension OR served from an image CDN
  // path. Many og:images are CMS URLs without an extension but with
  // /uploads/, /images/, /media/ in the path.
  return (
    /\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(url) ||
    /\/(uploads|images|media|wp-content|files|assets)\//i.test(url)
  )
}

// -----------------------------------------------------------------------
// Strategy 2: Validated Unsplash search "[name] campus"
// -----------------------------------------------------------------------

const STOPWORDS = new Set([
  "university", "college", "institute", "of", "the", "at", "and",
  "school", "academy", "state", "main", "campus", "tech", "technical",
  "north", "south", "east", "west", "saint", "st", "&",
])

function matchesCollegeOrCity(
  candidate: UnsplashPhoto,
  collegeName: string,
  city: string,
): boolean {
  const haystack = [
    candidate.alt_description,
    candidate.description,
    ...(candidate.tags ?? []).map((t) => t.title),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (!haystack) return false

  const tokens = collegeName
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 4 && !STOPWORDS.has(t))

  for (const t of tokens) {
    if (haystack.includes(t)) return true
  }
  if (city && city.length >= 4 && haystack.includes(city.toLowerCase())) {
    return true
  }
  return false
}

export async function getValidatedUnsplashCampus(
  collegeName: string,
  city: string,
  apiKey: string,
  existingPhotoIds: Set<string>,
): Promise<{ photo: PhotoResult | null; rateLimited: boolean }> {
  const query = encodeURIComponent(`${collegeName} campus`)
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=10&orientation=landscape&client_id=${apiKey}`,
  )
  if (res.status === 403 || res.status === 429) {
    return { photo: null, rateLimited: true }
  }
  if (!res.ok) return { photo: null, rateLimited: false }
  const data = (await res.json()) as { results?: UnsplashPhoto[] }
  for (const candidate of data.results ?? []) {
    if (!candidate.urls?.regular) continue
    if (existingPhotoIds.has(candidate.id)) continue
    if (!matchesCollegeOrCity(candidate, collegeName, city)) continue
    return {
      photo: {
        url: candidate.urls.regular,
        creditName: candidate.user?.name ?? null,
        creditUrl: candidate.user?.links?.html ?? null,
      },
      rateLimited: false,
    }
  }
  return { photo: null, rateLimited: false }
}

// -----------------------------------------------------------------------
// Strategy 3: Category-varied close-up fallback
// -----------------------------------------------------------------------

// Each query targets a distinct "college life" close-up subject. The
// college's slug deterministically maps to one category so two slugs
// don't compete for the same photo pool, and dedup tracking ensures no
// two colleges within a category share an image.
const FALLBACK_CATEGORIES: string[] = [
  "open library book stack",
  "university graduation cap textbook",
  "study desk laptop coffee cup",
  "vintage library reading room shelves",
  "classroom whiteboard chalkboard",
  "academic notebook fountain pen handwriting",
  "backpack books wooden bench",
  "ivy covered brick wall college",
  "campus quad autumn trees pathway",
  "old college brick building gothic",
  "library bookshelves wood ladder",
  "graduation diploma rolled scroll",
]

function hashStringToInt(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export async function getCategoryFallback(
  slug: string,
  apiKey: string,
  existingPhotoIds: Set<string>,
): Promise<{ photo: PhotoResult | null; rateLimited: boolean }> {
  const startIdx = hashStringToInt(slug) % FALLBACK_CATEGORIES.length
  // Try the slug's category first, then rotate through the rest. The
  // rotation ensures we exhaust subject variety before giving up.
  for (let i = 0; i < FALLBACK_CATEGORIES.length; i++) {
    const category = FALLBACK_CATEGORIES[(startIdx + i) % FALLBACK_CATEGORIES.length]
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(category)}&per_page=20&orientation=landscape&client_id=${apiKey}`,
    )
    if (res.status === 403 || res.status === 429) {
      return { photo: null, rateLimited: true }
    }
    if (!res.ok) continue
    const data = (await res.json()) as { results?: UnsplashPhoto[] }
    for (const candidate of data.results ?? []) {
      if (!candidate.urls?.regular) continue
      if (existingPhotoIds.has(candidate.id)) continue
      return {
        photo: {
          url: candidate.urls.regular,
          creditName: candidate.user?.name ?? null,
          creditUrl: candidate.user?.links?.html ?? null,
        },
        rateLimited: false,
      }
    }
  }
  return { photo: null, rateLimited: false }
}

// -----------------------------------------------------------------------
// Compose all three strategies
// -----------------------------------------------------------------------

export interface PhotoResolution {
  source: "official_site" | "unsplash_campus" | "category_fallback" | "default"
  photo: PhotoResult | null
  rateLimited: boolean
}

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"

export function defaultPhotoResult(): PhotoResult {
  return {
    url: DEFAULT_PHOTO,
    creditName: null,
    creditUrl: null,
  }
}

export async function resolveCollegePhoto(args: {
  slug: string
  name: string
  city: string
  officialUrl: string | null
  unsplashApiKey: string
  existingPhotoIds: Set<string>
}): Promise<PhotoResolution> {
  // 1. The school's own site.
  if (args.officialUrl) {
    const og = await getOgImageFromCollegeSite(args.officialUrl, args.name)
    if (og) return { source: "official_site", photo: og, rateLimited: false }
  }

  // 2. Validated Unsplash "[name] campus" search.
  const u = await getValidatedUnsplashCampus(
    args.name,
    args.city,
    args.unsplashApiKey,
    args.existingPhotoIds,
  )
  if (u.rateLimited) return { source: "category_fallback", photo: null, rateLimited: true }
  if (u.photo) return { source: "unsplash_campus", photo: u.photo, rateLimited: false }

  // 3. Category-varied close-up fallback.
  const c = await getCategoryFallback(
    args.slug,
    args.unsplashApiKey,
    args.existingPhotoIds,
  )
  if (c.rateLimited) return { source: "category_fallback", photo: null, rateLimited: true }
  if (c.photo) return { source: "category_fallback", photo: c.photo, rateLimited: false }

  // 4. Last resort: the labeled default.
  return { source: "default", photo: defaultPhotoResult(), rateLimited: false }
}

export function extractPhotoId(url: string | null): string | null {
  if (!url) return null
  const m = url.match(/photo-([a-z0-9-]+)/)
  return m ? m[1] : null
}

export { DEFAULT_PHOTO }
