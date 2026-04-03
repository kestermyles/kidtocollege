import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

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
  const { initiated_by, invitee_email } = body as {
    initiated_by: "student" | "parent";
    invitee_email?: string;
  };

  const inviteCode = randomBytes(4).toString("hex").toUpperCase();

  const row: Record<string, unknown> = {
    inviter_id: user.id,
    invite_code: inviteCode,
    status: "pending",
  };

  if (initiated_by === "student") {
    row.student_id = user.id;
  } else {
    row.parent_id = user.id;
  }

  if (invitee_email) {
    row.invitee_email = invitee_email;
  }

  const { error } = await supabase.from("family_links").insert(row);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    invite_url: `https://www.kidtocollege.com/family/join?code=${inviteCode}`,
    invite_code: inviteCode,
  });
}
