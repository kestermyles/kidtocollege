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
// it isn't a real photo of that campus. Exported so this file can
// recommend it (in comments) as a safe fallback for unverified-source
// photos.
export const LABELED_FALLBACK: CollegePhotoOverride = {
  url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80",
  creditName: null,
  creditUrl: null,
};

// Curated hero photos for schools whose Unsplash search returned
// visually-wrong photos (UPenn → Drexel, UT Austin → State Capitol,
// UCLA → USC, Columbia → NYU). Files live at /public/college-hero/
// and override any DB photo_url at render time.
//
// LICENSING NOTE: photos sourced from Wikimedia Commons or any CC
// license MUST have creditName + creditUrl set to comply with the
// license. The credits below are placeholders — verify each photo's
// source and fill in proper attribution before relying on these
// commercially. If unsure of provenance, swap that entry back to
// LABELED_FALLBACK rather than risk a license violation.
export const COLLEGE_PHOTO_OVERRIDES: Record<string, CollegePhotoOverride> = {
  "ut-austin": {
    url: "/college-hero/ut-austin.jpg",
    creditName: null,
    creditUrl: null,
  },
  "california-institute-of-technology": {
    url: "/college-hero/california-institute-of-technology.jpg",
    creditName: null,
    creditUrl: null,
  },
  "ucla": {
    url: "/college-hero/ucla.jpg",
    creditName: null,
    creditUrl: null,
  },
  "university-of-california-los-angeles": {
    url: "/college-hero/university-of-california-los-angeles.jpg",
    creditName: null,
    creditUrl: null,
  },
  "university-of-pennsylvania": {
    url: "/college-hero/university-of-pennsylvania.jpg",
    creditName: null,
    creditUrl: null,
  },
  "columbia-university-in-the-city-of-new-york": {
    url: "/college-hero/columbia-university-in-the-city-of-new-york.jpg",
    creditName: null,
    creditUrl: null,
  },
};

export function getOverridePhoto(slug: string): CollegePhotoOverride | null {
  return COLLEGE_PHOTO_OVERRIDES[slug] ?? null;
}

export function isPhotoOverridden(slug: string): boolean {
  return slug in COLLEGE_PHOTO_OVERRIDES;
}
