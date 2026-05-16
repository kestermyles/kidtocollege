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

// The override map is now nearly empty. The three-tier photo strategy
// (school-site og:image → validated Unsplash → category-varied close-up
// fallback) handles most of what this map used to protect against. Add
// an entry here ONLY when:
//   - The cron is producing something visually wrong AND
//   - The school's own site doesn't yield a usable og:image AND
//   - You want to force a specific URL instead of category fallback.
export const COLLEGE_PHOTO_OVERRIDES: Record<string, CollegePhotoOverride> = {
  // (intentionally empty — let the strategy do its job)
};

export function getOverridePhoto(slug: string): CollegePhotoOverride | null {
  return COLLEGE_PHOTO_OVERRIDES[slug] ?? null;
}

export function isPhotoOverridden(slug: string): boolean {
  return slug in COLLEGE_PHOTO_OVERRIDES;
}
