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

  // Generate basic suggested questions (no AI call to keep it fast)
  const suggestedQuestions = [
    `What merit scholarships does ${college} offer for ${major} students?`,
    `What is the typical financial aid package at ${college}?`,
    `How can I strengthen my application to ${college}?`,
    `What career outcomes do ${major} graduates from ${college} typically see?`,
    `Are there research or internship opportunities for ${major} students?`,
    `What makes a standout essay for ${college} admissions?`,
  ];

  return NextResponse.json({ result, college, major, suggestedQuestions });
}
