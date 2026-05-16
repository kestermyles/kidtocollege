// One-shot photo-backfill endpoint. Processes every college with a
// NULL photo_url in chunks until either (a) the queue is empty, (b) the
// function approaches its time budget, or (c) Unsplash rate-limits us.
//
// Differs from /api/cron/enrich-photos:
//   - Not on a hourly schedule — runs only when triggered.
//   - Processes as many colleges as fit in maxDuration (vs MAX_PER_RUN).
//   - Honors Unsplash 429 responses by stopping and reporting remaining.
//
// Auth: same CRON_SECRET as the cron. Hit with:
//   curl -H "Authorization: Bearer $CRON_SECRET" https://www.kidtocollege.com/api/admin/backfill-photos

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { COLLEGE_PHOTO_OVERRIDES } from "@/lib/college-photo-overrides";

export const maxDuration = 300;

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80";
const DELAY_MS = 300;
// Stop assembling new batches when we've used this much of the time budget,
// leaving room to finish the in-flight college + DB write + return.
const SAFETY_MARGIN_MS = 15_000;

interface UnsplashPhoto {
  id: string;
  alt_description: string | null;
  description: string | null;
  tags?: { title: string }[];
  urls: { regular: string };
  user: { name: string; links: { html: string } };
}

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

  if (city && city.length >= 4 && haystack.includes(city.toLowerCase())) {
    return true;
  }

  return false;
}

interface PhotoResult {
  url: string;
  creditName: string | null;
  creditUrl: string | null;
}

async function getCollegePhoto(
  collegeName: string,
  city: string,
  apiKey: string,
  existingPhotoIds: Set<string>,
): Promise<{ photo: PhotoResult | null; rateLimited: boolean }> {
  const query = encodeURIComponent(`${collegeName} campus`);
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=5&orientation=landscape&client_id=${apiKey}`,
  );
  if (res.status === 403 || res.status === 429) {
    return { photo: null, rateLimited: true };
  }
  if (!res.ok) return { photo: null, rateLimited: false };
  const data = (await res.json()) as { results?: UnsplashPhoto[] };

  for (const candidate of data.results ?? []) {
    if (!candidate.urls?.regular) continue;
    if (existingPhotoIds.has(candidate.id)) continue;
    if (!matchesCollegeOrCity(candidate, collegeName, city)) continue;
    return {
      photo: {
        url: candidate.urls.regular,
        creditName: candidate.user?.name ?? null,
        creditUrl: candidate.user?.links?.html ?? null,
      },
      rateLimited: false,
    };
  }

  if (city) {
    const res2 = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        `${city} university campus`,
      )}&per_page=5&orientation=landscape&client_id=${apiKey}`,
    );
    if (res2.status === 403 || res2.status === 429) {
      return { photo: null, rateLimited: true };
    }
    if (!res2.ok) return { photo: null, rateLimited: false };
    const data2 = (await res2.json()) as { results?: UnsplashPhoto[] };
    for (const candidate of data2.results ?? []) {
      if (!candidate.urls?.regular) continue;
      if (existingPhotoIds.has(candidate.id)) continue;
      if (!matchesCollegeOrCity(candidate, collegeName, city)) continue;
      return {
        photo: {
          url: candidate.urls.regular,
          creditName: candidate.user?.name ?? null,
          creditUrl: candidate.user?.links?.html ?? null,
        },
        rateLimited: false,
      };
    }
  }

  return { photo: null, rateLimited: false };
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
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    return NextResponse.json({ error: "UNSPLASH_ACCESS_KEY not set" }, { status: 500 });
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  const start = Date.now();
  const budgetMs = (maxDuration - 5) * 1000;

  // Load all existing photo IDs once so we don't reassign duplicates.
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
  existingPhotoIds.delete(extractPhotoId(DEFAULT_PHOTO) ?? "");

  const overrideSlugs = Object.keys(COLLEGE_PHOTO_OVERRIDES);

  let processed = 0;
  let matched = 0;
  let fellBack = 0;
  let rateLimited = false;

  // Loop pulls colleges in batches of 100 NULL rows, processes each one,
  // until budget hits or queue empties.
  while (Date.now() - start < budgetMs - SAFETY_MARGIN_MS) {
    let query = supabase
      .from("colleges")
      .select("slug, name, location")
      .is("photo_url", null)
      .order("name")
      .limit(100);
    if (overrideSlugs.length > 0) {
      query = query.not("slug", "in", `(${overrideSlugs.join(",")})`);
    }
    const { data: colleges } = await query;
    if (!colleges || colleges.length === 0) break;

    for (const college of colleges) {
      if (Date.now() - start >= budgetMs - SAFETY_MARGIN_MS) break;

      const city = (college.location ?? "").split(",")?.[0] ?? "";
      const { photo, rateLimited: hit429 } = await getCollegePhoto(
        college.name,
        city,
        unsplashKey,
        existingPhotoIds,
      );

      if (hit429) {
        rateLimited = true;
        break;
      }

      if (photo) {
        const id = extractPhotoId(photo.url);
        if (id) existingPhotoIds.add(id);
        matched++;
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

    if (rateLimited) break;
  }

  // Report what's left.
  let query2 = supabase
    .from("colleges")
    .select("slug", { count: "exact", head: true })
    .is("photo_url", null);
  if (overrideSlugs.length > 0) {
    query2 = query2.not("slug", "in", `(${overrideSlugs.join(",")})`);
  }
  const { count: remaining } = await query2;

  return NextResponse.json({
    processed,
    matched,
    fellBack,
    remaining: remaining ?? null,
    rateLimited,
    elapsedMs: Date.now() - start,
  });
}
