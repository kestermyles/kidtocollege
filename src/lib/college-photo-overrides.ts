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

// Generic "no specific campus image" fallback. Renders with the
// "Generic campus image" badge on the college page so the user knows
// it isn't a real photo of that campus.
const LABELED_FALLBACK: CollegePhotoOverride = {
  url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80",
  creditName: null,
  creditUrl: null,
};

// Schools whose Unsplash search keeps returning visually-wrong photos
// (e.g. UPenn → Drexel-Institute, UT Austin → Texas State Capitol,
// UCLA → USC, Columbia → Washington Square / NYU). The city-name
// validation in photo-strategy.ts catches most cases, but for these
// the wrong subject is heavily tagged with the same city words and
// keeps slipping through. Pin them to the labeled fallback until we
// can hand-pick verified URLs.
//
// To replace with a real photo, swap LABELED_FALLBACK for an
// explicit { url, creditName, creditUrl } object.
export const COLLEGE_PHOTO_OVERRIDES: Record<string, CollegePhotoOverride> = {
  "ut-austin": LABELED_FALLBACK,
  "california-institute-of-technology": LABELED_FALLBACK,
  "ucla": LABELED_FALLBACK,
  "university-of-california-los-angeles": LABELED_FALLBACK,
  "university-of-pennsylvania": LABELED_FALLBACK,
  "columbia-university-in-the-city-of-new-york": LABELED_FALLBACK,
};

export function getOverridePhoto(slug: string): CollegePhotoOverride | null {
  return COLLEGE_PHOTO_OVERRIDES[slug] ?? null;
}

export function isPhotoOverridden(slug: string): boolean {
  return slug in COLLEGE_PHOTO_OVERRIDES;
}
