import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
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

  // Find active link where user is student or parent
  const { error } = await supabase
    .from("family_links")
    .update({ status: "revoked" })
    .eq("status", "active")
    .or(`student_id.eq.${user.id},parent_id.eq.${user.id}`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
