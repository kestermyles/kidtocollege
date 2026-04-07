import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

const MAX_PER_RUN = 20;
const DELAY_MS = 800;

interface PhotoResult {
  url: string;
  creditName: string | null;
  creditUrl: string | null;
}

async function getCollegePhoto(
  collegeName: string,
  city: string,
  apiKey: string
): Promise<PhotoResult | null> {
  const query = encodeURIComponent(`${collegeName} campus`);
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&client_id=${apiKey}`
  );
  if (res.status === 403 || res.status === 429) return null;
  if (!res.ok) return null;
  const data = await res.json();
  const result = data.results?.[0];
  if (result?.urls?.regular) {
    return {
      url: result.urls.regular,
      creditName: result.user?.name ?? null,
      creditUrl: result.user?.links?.html ?? null,
    };
  }

  const res2 = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + " university campus")}&per_page=1&orientation=landscape&client_id=${apiKey}`
  );
  if (!res2.ok) return null;
  const data2 = await res2.json();
  const result2 = data2.results?.[0];
  if (result2?.urls?.regular) {
    return {
      url: result2.urls.regular,
      creditName: result2.user?.name ?? null,
      creditUrl: result2.user?.links?.html ?? null,
    };
  }
  return null;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
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

  const { data: colleges, count } = await supabase
    .from("colleges")
    .select("slug, name, location", { count: "exact" })
    .is("photo_url", null)
    .order("name")
    .limit(MAX_PER_RUN);

  if (!colleges || colleges.length === 0) {
    return NextResponse.json({ processed: 0, remaining: 0, message: "All colleges have photos" });
  }

  let processed = 0;
  const defaultPhoto = "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80";

  for (const college of colleges) {
    const city = college.location?.split(",")?.[0] ?? "";
    const photo = await getCollegePhoto(college.name, city, unsplashKey);

    await supabase
      .from("colleges")
      .update(
        photo
          ? {
              photo_url: photo.url,
              photo_credit_name: photo.creditName,
              photo_credit_url: photo.creditUrl,
            }
          : { photo_url: defaultPhoto }
      )
      .eq("slug", college.slug);

    processed++;
    await sleep(DELAY_MS);
  }

  const remaining = (count || 0) - processed;

  console.log(`[enrich-photos] Processed: ${processed}, Remaining: ${remaining}, Time: ${new Date().toISOString()}`);

  return NextResponse.json({ processed, remaining });
}
