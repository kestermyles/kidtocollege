import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { COLLEGE_PHOTO_OVERRIDES } from "@/lib/college-photo-overrides";
import {
  resolveCollegePhoto,
  extractPhotoId,
  DEFAULT_PHOTO,
} from "@/lib/photo-strategy";

export const maxDuration = 300;

const MAX_PER_RUN = 500;
const DELAY_MS = 300;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }
  const supabase = createClient(url, key);

  // Build the set of photo IDs (Unsplash-style) already in use.
  // Photos sourced from college websites don't follow the Unsplash photo-<id>
  // format and won't be in this set — but they're also less likely to collide.
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
  let query = supabase
    .from("colleges")
    .select("slug, name, location, official_url", { count: "exact" })
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
  const tallies = { official_site: 0, unsplash_campus: 0, category_fallback: 0, default: 0 };

  for (const college of colleges) {
    const city = (college.location ?? "").split(",")?.[0] ?? "";
    const resolution = await resolveCollegePhoto({
      slug: college.slug,
      name: college.name,
      city,
      officialUrl: college.official_url,
      unsplashApiKey: unsplashKey,
      existingPhotoIds,
    });

    if (resolution.photo) {
      const id = extractPhotoId(resolution.photo.url);
      if (id) existingPhotoIds.add(id);
      await supabase
        .from("colleges")
        .update({
          photo_url: resolution.photo.url,
          photo_credit_name: resolution.photo.creditName,
          photo_credit_url: resolution.photo.creditUrl,
        })
        .eq("slug", college.slug);
      tallies[resolution.source]++;
    }

    processed++;
    if (resolution.rateLimited) break;
    await sleep(DELAY_MS);
  }

  const remaining = (count || 0) - processed;
  console.log(
    `[enrich-photos] processed=${processed} ` +
      `official=${tallies.official_site} ` +
      `unsplash_campus=${tallies.unsplash_campus} ` +
      `fallback=${tallies.category_fallback} ` +
      `default=${tallies.default} ` +
      `remaining=${remaining}`,
  );

  return NextResponse.json({ processed, tallies, remaining });
}
