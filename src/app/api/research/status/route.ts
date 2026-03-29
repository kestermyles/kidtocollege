import { NextResponse, NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET(request: NextRequest) {
  const searchId = request.nextUrl.searchParams.get("searchId");

  if (!searchId) {
    return NextResponse.json({ status: "error", error: "searchId required" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ status: "pending" });
  }

  try {
    const supabase = createServiceRoleClient();
    const { data: resultRow } = await supabase
      .from("results")
      .select("id")
      .eq("search_id", searchId)
      .limit(1)
      .single();

    if (resultRow) {
      return NextResponse.json({ status: "complete", resultId: resultRow.id });
    }

    return NextResponse.json({ status: "pending" });
  } catch {
    return NextResponse.json({ status: "pending" });
  }
}
