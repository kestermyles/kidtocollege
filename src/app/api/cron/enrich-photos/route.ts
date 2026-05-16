import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { COLLEGE_PHOTO_OVERRIDES } from "@/lib/college-photo-overrides";

export const maxDuration = 60;

const MAX_PER_RUN = 20;
const DELAY_MS = 800;

// Fallback when no validated match exists. The slug-override system
// renders this as a labeled generic on the college page rather than
// pretending it's a campus-specific photo.
const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80";

interface PhotoResult {
  url: string;
  creditName: string | null;
  creditUrl: string | null;
}

interface UnsplashPhoto {
  id: string;
  alt_description: string | null;
  description: string | null;
  tags?: { title: string }[];
  urls: { regular: string };
  user: { name: string; links: { html: string } };
}

/**
 * Loose match: does the candidate description / tag set plausibly relate
 * to the college name or its city? Returns true on any signal — we'd
 * rather accept a slightly imperfect match than fall back to a generic
 * for every result.
 */
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
    .toLowerCase();

  if (!haystack) return false;

  // Pick distinctive tokens from the college name — drop the noise
  // ("University", "College", "of", "the", "at"). A 2-letter "UC"
  // alone is too weak; require 4+ chars for a single-word check.
  const STOPWORDS = new Set([
    "university", "college", "institute", "of", "the", "at", "and",
    "school", "academy", "state", "main", "campus", "tech", "technical",
    "north", "south", "east", "west", "saint", "st", "&",
  ]);
  const tokens = collegeName
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 4 && !STOPWORDS.has(t));

  for (const t of tokens) {
    if (haystack.includes(t)) return true;
  }

  // Last-resort: city match. A correctly-tagged Boston shot for a
  // Boston school is OK; a generic "library" stock photo is not.
  if (city && city.length >= 4) {
    if (haystack.includes(city.toLowerCase())) return true;
  }

  return false;
}

/**
 * Fetch up to 5 candidates from Unsplash and return the first one that:
 *   1. Has plausibly relevant metadata (matchesCollegeOrCity)
 *   2. Is NOT already in the existing-URLs set (no dupes)
 *
 * Returns null if no candidate passes — caller should fall back to the
 * default photo rather than guessing.
 */
async function getCollegePhoto(
  collegeName: string,
  city: string,
  apiKey: string,
  existingPhotoIds: Set<string>,
): Promise<PhotoResult | null> {
  const query = encodeURIComponent(`${collegeName} campus`);
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=5&orientation=landscape&client_id=${apiKey}`,
  );
  if (res.status === 403 || res.status === 429) return null;
  if (!res.ok) return null;
  const data = (await res.json()) as { results?: UnsplashPhoto[] };

  for (const candidate of data.results ?? []) {
    if (!candidate.urls?.regular) continue;
    if (existingPhotoIds.has(candidate.id)) continue;
    if (!matchesCollegeOrCity(candidate, collegeName, city)) continue;
    return {
      url: candidate.urls.regular,
      creditName: candidate.user?.name ?? null,
      creditUrl: candidate.user?.links?.html ?? null,
    };
  }

  // Fallback search by city — but still validate against the city name
  // so a "[city] university campus" search doesn't grab unrelated stock.
  if (city) {
    const res2 = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        `${city} university campus`,
      )}&per_page=5&orientation=landscape&client_id=${apiKey}`,
    );
    if (!res2.ok) return null;
    const data2 = (await res2.json()) as { results?: UnsplashPhoto[] };
    for (const candidate of data2.results ?? []) {
      if (!candidate.urls?.regular) continue;
      if (existingPhotoIds.has(candidate.id)) continue;
      if (!matchesCollegeOrCity(candidate, collegeName, city)) continue;
      return {
        url: candidate.urls.regular,
        creditName: candidate.user?.name ?? null,
        creditUrl: candidate.user?.links?.html ?? null,
      };
    }
  }

  return null;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function extractPhotoId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/photo-([a-z0-9-]+)/);
  return m ? m[1] : null;
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    return NextResponse.json({ error: "UNSPLASH_ACCESS_KEY not set" }, { status: 500 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(url, key);

  // Build the set of photo IDs already used by other colleges so we
  // never assign a duplicate. Pull all current photo_urls in one go.
  const existingPhotoIds = new Set<string>();
  {
    const { data: allPhotos } = await supabase
      .from("colleges")
      .select("photo_url")
      .not("photo_url", "is", null);
    for (const row of allPhotos ?? []) {
      const id = extractPhotoId((row as { photo_url: string }).photo_url);
      if (id) existingPhotoIds.add(id);
    }
  }
  // The default fallback photo IS allowed to repeat — it's an explicit
  // "no specific photo found" signal, rendered with a label by the
  // override system on each college page.
  existingPhotoIds.delete(extractPhotoId(DEFAULT_PHOTO) ?? "");

  const overrideSlugs = Object.keys(COLLEGE_PHOTO_OVERRIDES);
  let query = supabase
    .from("colleges")
    .select("slug, name, location", { count: "exact" })
    .is("photo_url", null)
    .order("name")
    .limit(MAX_PER_RUN);
  if (overrideSlugs.length > 0) {
    query = query.not("slug", "in", `(${overrideSlugs.join(",")})`);
  }
  const { data: colleges, count } = await query;

  if (!colleges || colleges.length === 0) {
    return NextResponse.json({ processed: 0, remaining: 0, message: "All colleges have photos" });
  }

  let processed = 0;
  let fellBack = 0;

  for (const college of colleges) {
    const city = college.location?.split(",")?.[0] ?? "";
    const photo = await getCollegePhoto(
      college.name,
      city,
      unsplashKey,
      existingPhotoIds,
    );

    if (photo) {
      // Reserve this photo ID so this run doesn't double-assign it.
      const id = extractPhotoId(photo.url);
      if (id) existingPhotoIds.add(id);
    } else {
      fellBack++;
    }

    await supabase
      .from("colleges")
      .update(
        photo
          ? {
              photo_url: photo.url,
              photo_credit_name: photo.creditName,
              photo_credit_url: photo.creditUrl,
            }
          : {
              photo_url: DEFAULT_PHOTO,
              photo_credit_name: null,
              photo_credit_url: null,
            },
      )
      .eq("slug", college.slug);

    processed++;
    await sleep(DELAY_MS);
  }

  const remaining = (count || 0) - processed;

  console.log(
    `[enrich-photos] Processed: ${processed} (fell back: ${fellBack}), Remaining: ${remaining}, Time: ${new Date().toISOString()}`,
  );

  return NextResponse.json({ processed, fellBack, remaining });
}
