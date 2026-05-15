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
  // UT Austin — Unsplash defaults to the Texas State Capitol dome (not
  // on campus).
  "ut-austin": FALLBACK,

  // Columbia — Unsplash returns Washington Square Park, which is NYU's
  // territory, not Columbia (whose campus is uptown at Morningside Heights).
  "columbia-university-in-the-city-of-new-york": FALLBACK,

  // Texas A&M — Unsplash returns what looks like the Houses of Parliament
  // in London. Not in College Station, TX.
  "texas-am-university": FALLBACK,

  // Rice — Unsplash returns a suburban-looking scene with a giant cross
  // (appears to be a Christian school). Rice is in Houston with iconic
  // neo-Byzantine architecture, not that.
  "rice-university": FALLBACK,

  // Penn — Unsplash returns a candid winter snowstorm street photo with
  // a stranger walking. Not a campus hero shot.
  "university-of-pennsylvania": FALLBACK,
};

export function getOverridePhoto(slug: string): CollegePhotoOverride | null {
  return COLLEGE_PHOTO_OVERRIDES[slug] ?? null;
}

export function isPhotoOverridden(slug: string): boolean {
  return slug in COLLEGE_PHOTO_OVERRIDES;
}
