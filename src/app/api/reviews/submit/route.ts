import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase-server";

const REQUIRED_FIELDS = [
  "why_chose",
  "biggest_positive_surprise",
  "biggest_negative_surprise",
  "one_thing_to_senior",
] as const;
const OPTIONAL_FIELDS = ["who_thrives", "who_shouldnt_come"] as const;
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS] as const;

const FIELD_MAX_LENGTH: Record<(typeof ALL_FIELDS)[number], number> = {
  why_chose: 500,
  biggest_positive_surprise: 500,
  biggest_negative_surprise: 500,
  one_thing_to_senior: 300,
  who_thrives: 300,
  who_shouldnt_come: 300,
};

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: {
    slug?: string;
    verifiedStudentId?: string;
    answers?: Record<string, string>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { slug, verifiedStudentId, answers } = body;
  if (!slug || !verifiedStudentId || !answers) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supa = createServiceRoleClient();

  // Confirm verified_students row belongs to this user + slug
  const { data: verification } = await supa
    .from("verified_students")
    .select("id, user_id, college_slug")
    .eq("id", verifiedStudentId)
    .single();
  if (
    !verification ||
    verification.user_id !== user.id ||
    verification.college_slug !== slug
  ) {
    return NextResponse.json(
      { error: "Verification doesn't match" },
      { status: 403 },
    );
  }

  // Build the insert payload, truncating each field to its max length
  const insertPayload: Record<string, unknown> = {
    college_slug: slug,
    verified_student_id: verifiedStudentId,
    status: "pending",
  };
  for (const f of ALL_FIELDS) {
    const raw = (answers[f] ?? "").trim();
    if (REQUIRED_FIELDS.includes(f as (typeof REQUIRED_FIELDS)[number]) && !raw) {
      return NextResponse.json(
        { error: `Missing required field: ${f}` },
        { status: 400 },
      );
    }
    insertPayload[f] = raw ? raw.slice(0, FIELD_MAX_LENGTH[f]) : null;
  }

  const { error: insertError } = await supa
    .from("college_reviews")
    .insert(insertPayload);

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "You've already submitted a review for this school" },
        { status: 409 },
      );
    }
    console.error("[submit] insert error:", insertError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
