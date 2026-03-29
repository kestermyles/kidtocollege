import { NextResponse, NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";
import type { WizardData } from "@/lib/types";

// ---------------------------------------------------------------------------
// Rate limiting: max 3 requests per IP per hour
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

function validate(data: WizardData): string | null {
  if (!data.college?.trim() && !data.major?.trim()) {
    return "College or major is required.";
  }
  const maxLen = 500;
  for (const [key, val] of Object.entries(data)) {
    if (typeof val === "string" && val.length > maxLen) {
      return `Field "${key}" exceeds ${maxLen} characters.`;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Supabase check
// ---------------------------------------------------------------------------

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ---------------------------------------------------------------------------
// POST /api/research/start
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "You have reached the limit of 3 reports per hour. Please try again later.",
        },
        { status: 429 }
      );
    }

    const data: WizardData = await request.json();

    // Validate input
    const validationError = validate(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    let searchId = crypto.randomUUID();

    // Save search to Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceRoleClient();
        const { data: searchRow, error: searchErr } = await supabase
          .from("searches")
          .insert({
            college: data.college,
            major: data.major,
            minor: data.minor || null,
            application_year: data.applicationYear || null,
            gpa: data.gpa || null,
            sat_score: data.satScore || null,
            activities: data.activities || [],
            other_skills: data.otherSkills || null,
            priorities: data.priorities || [],
            budget: data.budget || null,
            notes: data.notes || null,
          })
          .select("id")
          .single();

        if (!searchErr && searchRow) {
          searchId = searchRow.id;
        } else {
          console.warn("[/api/research/start] Search insert failed:", searchErr?.message);
        }
      } catch (dbErr) {
        console.warn("[/api/research/start] Supabase error:", dbErr);
      }
    }

    // Fire background AI call (fire and forget)
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    fetch(`${baseUrl}/api/research/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchId, wizardData: data }),
    }).catch((err) =>
      console.error("[/api/research/start] Failed to fire background run:", err)
    );

    // Return immediately with searchId
    return NextResponse.json({ searchId });
  } catch (err) {
    console.error("[/api/research/start] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
