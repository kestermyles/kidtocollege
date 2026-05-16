// Curated hero photos for flagship/priority schools. The Unsplash cron
// often picks up a city landmark or random match for big-name colleges
// (e.g. UT Austin used to render the Texas State Capitol). Entries here
// take precedence over the DB photo_url at render time, AND tell the
// photo-enrichment cron to skip the slug entirely.
//
// To curate a school: pick an Unsplash photo of the actual campus,
// add the entry below with proper attribution. Photos should be
// landscape-friendly hero shots — buildings, quads, campus skyline.

export interface CollegePhotoOverride {
  url: string;
  creditName: string | null;
  creditUrl: string | null;
}

// Safe fallback: a generic campus library shot. Used until a proper
// hand-picked photo for each priority school is committed.
const FALLBACK = {
  url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80",
  creditName: null,
  creditUrl: null,
};

export const COLLEGE_PHOTO_OVERRIDES: Record<string, CollegePhotoOverride> = {
  // The "Nebraska Love Library" cluster — 5+ schools were all sharing
  // the same brick-and-stone library photo (actually Love Library at
  // U Nebraska–Lincoln). Forcing fallback until curated photos sourced.
  "ut-austin": FALLBACK,
  "columbia-university-in-the-city-of-new-york": FALLBACK,
  "texas-am-university": FALLBACK,
  "rice-university": FALLBACK,
  "university-of-pennsylvania": FALLBACK,

  // The "BYU mountain" duplicate — Duke and Johns Hopkins both got an
  // aerial of Utah's Y Mountain. Both schools are flat-state Eastern.
  "duke-university": FALLBACK,
  "johns-hopkins-university": FALLBACK,

  // The "Vanderbilt/WashU night aerial" duplicate — anonymous night
  // shot, neither shows Kirkland Hall (Vandy) or Brookings Hall (WashU).
  "washington-university-in-st-louis": FALLBACK,

  // Cross-school mismatches identified by visual audit:
  // UCLA was showing USC's VKC globe tower + DTLA skyline.
  "ucla": FALLBACK,
  "university-of-california-los-angeles": FALLBACK,

  // Caltech was showing an East-Asian-style modernist high-rise + stadium.
  "california-institute-of-technology": FALLBACK,

  // Michigan was showing Soviet-style apartment blocks at night.
  "university-of-michigan-ann-arbor": FALLBACK,

  // String-collision failures (Unsplash search matched on substring):
  // U Wisconsin-Madison → got JMU (James MADISON University) Wilson Hall.
  "university-of-wisconsin-madison": FALLBACK,

  // Boston College → got Boston University Metcalf Center (signage visible).
  "boston-college": FALLBACK,

  // U Florida → got snow-covered Cornell (cross-school swap).
  "university-of-florida": FALLBACK,

  // Howard → got UW Seattle Allen/Suzzallo Library.
  "howard-university": FALLBACK,
};

export function getOverridePhoto(slug: string): CollegePhotoOverride | null {
  return COLLEGE_PHOTO_OVERRIDES[slug] ?? null;
}

export function isPhotoOverridden(slug: string): boolean {
  return slug in COLLEGE_PHOTO_OVERRIDES;
}
