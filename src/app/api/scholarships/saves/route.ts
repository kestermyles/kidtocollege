import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

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
      set() {},
      remove() {},
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, userId: user?.id ?? null };
}

export async function GET() {
  const { supabase, userId } = await getSupabaseWithUser();
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabase
    .from("saved_scholarships")
    .select("scholarship_slug, status, notes, created_at")
    .eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saves: data });
}

export async function POST(req: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser();
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body.scholarship_slug) {
    return NextResponse.json({ error: "scholarship_slug required" }, { status: 400 });
  }
  const { error } = await supabase.from("saved_scholarships").upsert(
    {
      user_id: userId,
      scholarship_slug: body.scholarship_slug,
      status: body.status ?? "saved",
      notes: body.notes ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,scholarship_slug" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser();
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("scholarship_slug");
  if (!slug) return NextResponse.json({ error: "scholarship_slug required" }, { status: 400 });
  const { error } = await supabase
    .from("saved_scholarships")
    .delete()
    .eq("user_id", userId)
    .eq("scholarship_slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
