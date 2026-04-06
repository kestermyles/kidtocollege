import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const DAILY_LIMIT = 50;

async function getSupabaseWithUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { supabase: null, userId: null };

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      set(_name: string, _value: string, _options: Record<string, unknown>) {},
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      remove(_name: string, _options: Record<string, unknown>) {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, userId: user?.id ?? null };
}

export async function POST(request: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser();
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mapsKey = process.env.GOOGLE_MAPS_KEY;
  if (!mapsKey) {
    return NextResponse.json({ error: "Maps not configured" }, { status: 500 });
  }

  const body = await request.json();
  const { origin, stops } = body;

  if (!origin || !stops || !Array.isArray(stops) || stops.length === 0) {
    return NextResponse.json(
      { error: "origin and stops[] required" },
      { status: 400 }
    );
  }

  // Rate limit: 50 requests/user/day
  const today = new Date().toISOString().split("T")[0];

  const { data: usage } = await supabase
    .from("api_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("date", today)
    .eq("api", "maps-embed")
    .single();

  if (usage && usage.count >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: "Daily limit reached. Try again tomorrow." },
      { status: 429 }
    );
  }

  // Increment usage counter
  await supabase.from("api_usage").upsert(
    {
      user_id: userId,
      date: today,
      api: "maps-embed",
      count: (usage?.count ?? 0) + 1,
    },
    { onConflict: "user_id,date,api" }
  );

  // Build Google Maps Embed API directions URL
  const destination = stops[stops.length - 1];
  const waypoints = stops.slice(0, -1);

  const params = new URLSearchParams({
    key: mapsKey,
    origin,
    destination,
    mode: "driving",
  });

  if (waypoints.length > 0) {
    params.set("waypoints", waypoints.join("|"));
  }

  const url = `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;

  return NextResponse.json({ url });
}
