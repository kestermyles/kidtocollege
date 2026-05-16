import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase-server";

// POST /api/reviews/verify
// Creates the verified_students row after the user has signed in with
// a .edu magic link. The auth session is the trust source.
export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const email = user.email?.toLowerCase() ?? "";
  if (!email.endsWith(".edu")) {
    return NextResponse.json(
      { error: "Your account email must be a .edu address" },
      { status: 403 },
    );
  }

  let body: {
    collegeSlug?: string;
    yearInSchool?: number;
    intendedMajor?: string;
    hometownState?: string;
    displayHandle?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    collegeSlug,
    yearInSchool,
    intendedMajor,
    hometownState,
    displayHandle,
  } = body;
  if (!collegeSlug || !intendedMajor) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Re-verify the email domain matches the chosen college's edu_domain.
  const domain = email.split("@")[1];
  const supa = createServiceRoleClient();
  const { data: college } = await supa
    .from("colleges")
    .select("slug, edu_domain")
    .eq("slug", collegeSlug)
    .single();
  if (!college || college.edu_domain !== domain) {
    return NextResponse.json(
      { error: "Email domain doesn't match this school" },
      { status: 403 },
    );
  }

  const { error: insertError } = await supa.from("verified_students").upsert(
    {
      user_id: user.id,
      edu_email: email,
      college_slug: collegeSlug,
      year_in_school: yearInSchool ?? null,
      intended_major: intendedMajor.slice(0, 60),
      hometown_state: hometownState || null,
      display_handle: (displayHandle ?? "").slice(0, 40) || null,
    },
    { onConflict: "user_id,college_slug" },
  );

  if (insertError) {
    console.error("[verify] insert error:", insertError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
