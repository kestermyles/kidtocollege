import { NextResponse, NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { getCachedResult } from "@/lib/result-cache";
import type { AIResearchResult } from "@/lib/types";

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  let result: AIResearchResult | null = null;
  let college = "";
  let major = "";

  // Try Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceRoleClient();
      const { data: row } = await supabase
        .from("results")
        .select("*, searches(college, major)")
        .eq("id", id)
        .single();

      if (row) {
        result = row.raw_ai_response as AIResearchResult;
        const search = row.searches as unknown as { college: string; major: string } | null;
        college = search?.college ?? "";
        major = search?.major ?? "";
      }
    } catch {
      // Fall through to memory cache
    }
  }

  // Try memory cache
  if (!result) {
    const cached = getCachedResult(id);
    if (cached) {
      result = cached.result;
      college = cached.college;
      major = cached.major;
    }
  }

  if (!result) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Generate basic suggested questions — keep under 60 chars each
  const colleges = college.split(",").map((c: string) => c.trim()).filter(Boolean);
  const isMulti = colleges.length > 1;
  const shortName = isMulti ? "these colleges" : (colleges[0] || "this college");

  const suggestedQuestions = [
    `What merit scholarships are available for ${major}?`,
    `What's the typical aid package at ${shortName}?`,
    `How can I strengthen my application?`,
    `What career outcomes do ${major} graduates see?`,
    `Are there research or internship opportunities?`,
    `What makes a standout admissions essay?`,
  ];

  return NextResponse.json({ result, college, major, suggestedQuestions });
}
