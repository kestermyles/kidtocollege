import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase-server";

const ADMIN_EMAIL = "kestermyles@gmail.com";

const ALLOWED_STATUSES = new Set(["approved", "rejected", "spam", "pending"]);

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { reviewId?: string; status?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const { reviewId, status, reason } = body;
  if (!reviewId || !status || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supa = createServiceRoleClient();
  const update: Record<string, unknown> = {
    status,
    rejection_reason: status === "rejected" || status === "spam" ? reason ?? null : null,
    approved_at: status === "approved" ? new Date().toISOString() : null,
  };
  const { error } = await supa
    .from("college_reviews")
    .update(update)
    .eq("id", reviewId);
  if (error) {
    console.error("[moderate] update error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
