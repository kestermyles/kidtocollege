import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  rankScholarships,
  type ScholarshipRow,
} from "@/lib/scholarship-matching";
import type { StudentProfile } from "@/lib/college-matching";

export const runtime = "nodejs";

async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {},
      remove() {},
    },
  });
}

export async function GET(req: NextRequest) {
  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const state = searchParams.get("state");
  const subject = searchParams.get("subject");
  const deadlineMonth = searchParams.get("deadline_month");
  const matchForMe = searchParams.get("match") === "1";

  let query = supabase.from("scholarships").select("*").order("amount_max", {
    ascending: false,
    nullsFirst: false,
  });

  if (type) query = query.eq("type", type);
  if (state) query = query.eq("state", state);
  if (subject) query = query.eq("subject", subject);
  if (deadlineMonth) query = query.eq("deadline_month", deadlineMonth);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []) as unknown as ScholarshipRow[];

  if (!matchForMe) {
    return NextResponse.json({ scholarships: rows });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ scholarships: rows });

  const { data: goals } = await supabase
    .from("student_goals")
    .select("current_gpa, sat_score, act_score, intended_major")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!goals) return NextResponse.json({ scholarships: rows });

  const profile: StudentProfile = {
    gpa: goals.current_gpa ?? 3.5,
    satScore: goals.sat_score ?? undefined,
    actScore: goals.act_score ?? undefined,
    intendedMajor: goals.intended_major ?? undefined,
    stateResident: searchParams.get("home_state") ?? undefined,
    familyIncome: Number(searchParams.get("income")) || 85000,
    assets: 20000,
    numInHousehold: 4,
    numInCollege: 1,
  };

  const ranked = rankScholarships(profile, rows);
  return NextResponse.json({
    scholarships: ranked.map((r) => ({
      ...r.scholarship,
      match_score: r.score,
      match_reasons: r.reasons,
    })),
  });
}
