import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const SITE_URL = "https://www.kidtocollege.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${SITE_URL}${next}`);
      }
    } catch (err) {
      console.error("[auth/callback] Error:", err);
    }
  }

  return NextResponse.redirect(`${SITE_URL}/auth/signin?error=auth_callback_failed`);
}
