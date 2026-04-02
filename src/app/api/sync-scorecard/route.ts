import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchScorecardData } from "@/lib/collegeScorecard";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: Request) {
  // Simple auth check — only allow calls with a secret header
  const authHeader = request.headers.get("x-sync-secret");
  if (authHeader !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, key);

  const { data: colleges, error } = await supabase
    .from("colleges")
    .select("slug, name");

  if (error || !colleges) {
    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }

  let updated = 0;
  let failed = 0;

  for (const college of colleges) {
    const scorecard = await fetchScorecardData(college.name);

    if (!scorecard) {
      failed++;
      continue;
    }

    await supabase
      .from("colleges")
      .update({
        median_earnings_6yr: scorecard.medianEarnings6yr,
        median_earnings_10yr: scorecard.medianEarnings10yr,
        employment_rate: scorecard.employmentRate,
        graduation_rate_4yr: scorecard.graduationRate4yr,
        loan_default_rate: scorecard.loanDefaultRate,
        scorecard_last_updated: new Date().toISOString(),
      })
      .eq("slug", college.slug);

    updated++;
    // Rate limit: 1 request per second
    await new Promise((r) => setTimeout(r, 1000));
  }

  return NextResponse.json({ updated, failed, total: colleges.length });
}
