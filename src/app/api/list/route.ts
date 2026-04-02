import { NextResponse, NextRequest } from "next/server";
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

// GET — fetch user's list with college data
export async function GET() {
  const { supabase, userId } = await getSupabaseWithUser();
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get or create list
  let { data: list } = await supabase
    .from("college_lists")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!list) {
    const { data: newList } = await supabase
      .from("college_lists")
      .insert({ user_id: userId })
      .select()
      .single();
    list = newList;
  }

  if (!list) {
    return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
  }

  // Get items with college data
  const { data: items } = await supabase
    .from("college_list_items")
    .select("*, colleges(name, location, state, acceptance_rate, photo_url)")
    .eq("list_id", list.id)
    .order("added_at", { ascending: true });

  return NextResponse.json({ list, items: items || [] });
}

// POST — add a college
export async function POST(request: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser();
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { collegeSlug, category } = body;

  if (!collegeSlug) {
    return NextResponse.json({ error: "collegeSlug required" }, { status: 400 });
  }

  // Get or create list
  let { data: list } = await supabase
    .from("college_lists")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!list) {
    const { data: newList } = await supabase
      .from("college_lists")
      .insert({ user_id: userId })
      .select("id")
      .single();
    list = newList;
  }

  if (!list) {
    return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
  }

  const { data: item, error } = await supabase
    .from("college_list_items")
    .upsert(
      {
        list_id: list.id,
        college_slug: collegeSlug,
        category: category || "unknown",
      },
      { onConflict: "list_id,college_slug" }
    )
    .select("*, colleges(name, location, state, acceptance_rate, photo_url)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item });
}

// PATCH — update category, status, or notes
export async function PATCH(request: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser();
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { itemId, category, applicationStatus, notes } = body;

  if (!itemId) {
    return NextResponse.json({ error: "itemId required" }, { status: 400 });
  }

  // Verify ownership
  const { data: item } = await supabase
    .from("college_list_items")
    .select("list_id, college_lists!inner(user_id)")
    .eq("id", itemId)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!item || (item.college_lists as any)?.user_id !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  if (category !== undefined) updates.category = category;
  if (applicationStatus !== undefined) updates.application_status = applicationStatus;
  if (notes !== undefined) updates.notes = notes;

  const { error } = await supabase
    .from("college_list_items")
    .update(updates)
    .eq("id", itemId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE — remove a college
export async function DELETE(request: NextRequest) {
  const { supabase, userId } = await getSupabaseWithUser();
  if (!supabase || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json({ error: "itemId required" }, { status: 400 });
  }

  // Verify ownership
  const { data: item } = await supabase
    .from("college_list_items")
    .select("list_id, college_lists!inner(user_id)")
    .eq("id", itemId)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!item || (item.college_lists as any)?.user_id !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await supabase.from("college_list_items").delete().eq("id", itemId);

  return NextResponse.json({ ok: true });
}
