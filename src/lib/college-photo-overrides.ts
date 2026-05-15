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

export const COLLEGE_PHOTO_OVERRIDES: Record<string, CollegePhotoOverride> = {
  // UT Austin — Unsplash search defaults to the Texas Capitol dome which
  // isn't on campus. Falling back to the generic campus image until a
  // hand-picked UT Tower shot is added.
  "ut-austin": {
    url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80",
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
