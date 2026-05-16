// One-shot photo-backfill endpoint. Processes every college with a
// NULL photo_url until the queue empties, the time budget runs out,
// or Unsplash rate-limits us.
//
// Auth: same CRON_SECRET as the cron.
//   curl -H "Authorization: Bearer $CRON_SECRET" https://www.kidtocollege.com/api/admin/backfill-photos

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { COLLEGE_PHOTO_OVERRIDES } from "@/lib/college-photo-overrides";
import {
  resolveCollegePhoto,
  extractPhotoId,
  DEFAULT_PHOTO,
} from "@/lib/photo-strategy";

export const maxDuration = 300;

const DELAY_MS = 250;
const SAFETY_MARGIN_MS = 15_000;

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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  const start = Date.now();
  const budgetMs = (maxDuration - 5) * 1000;

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
  let rateLimited = false;
  const tallies = { official_site: 0, unsplash_campus: 0, category_fallback: 0, default: 0 };

  outer: while (Date.now() - start < budgetMs - SAFETY_MARGIN_MS) {
    let query = supabase
      .from("colleges")
      .select("slug, name, location, official_url")
      .is("photo_url", null)
      .order("name")
      .limit(100);
    if (overrideSlugs.length > 0) {
      query = query.not("slug", "in", `(${overrideSlugs.join(",")})`);
    }
    const { data: colleges } = await query;
    if (!colleges || colleges.length === 0) break;

    for (const college of colleges) {
      if (Date.now() - start >= budgetMs - SAFETY_MARGIN_MS) break outer;

      const city = (college.location ?? "").split(",")?.[0] ?? "";
      const resolution = await resolveCollegePhoto({
        slug: college.slug,
        name: college.name,
        city,
        officialUrl: college.official_url,
        unsplashApiKey: unsplashKey,
        existingPhotoIds,
      });

      if (resolution.rateLimited) {
        rateLimited = true;
        break outer;
      }

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
      await sleep(DELAY_MS);
    }
  }

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
    tallies,
    remaining: remaining ?? null,
    rateLimited,
    elapsedMs: Date.now() - start,
  });
}
