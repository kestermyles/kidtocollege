import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      set(_n: string, _v: string, _o: Record<string, unknown>) {},
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      remove(_n: string, _o: Record<string, unknown>) {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { code } = body as { code: string };

  if (!code) {
    return NextResponse.json({ error: "Code required" }, { status: 400 });
  }

  // Look up the invite
  const { data: link } = await supabase
    .from("family_links")
    .select("*")
    .eq("invite_code", code.toUpperCase())
    .eq("status", "pending")
    .single();

  if (!link) {
    return NextResponse.json(
      { error: "Invalid or expired invite" },
      { status: 404 }
    );
  }

  // Fill in the missing side
  const updates: Record<string, unknown> = {
    status: "active",
    accepted_at: new Date().toISOString(),
  };

  if (!link.student_id) {
    updates.student_id = user.id;
  } else if (!link.parent_id) {
    updates.parent_id = user.id;
  }

  const { error } = await supabase
    .from("family_links")
    .update(updates)
    .eq("id", link.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
