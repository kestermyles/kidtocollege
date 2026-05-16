// Read-side helper for the verified-student reviews system.

import { createServiceRoleClient } from "@/lib/supabase-server";

export interface CollegeReview {
  id: string;
  whyChose: string;
  biggestPositiveSurprise: string;
  biggestNegativeSurprise: string;
  whoThrives: string | null;
  whoShouldntCome: string | null;
  oneThingToSenior: string;
  helpfulCount: number;
  approvedAt: string;
  // From the verified_students join
  displayHandle: string | null;
  yearInSchool: number | null;
  intendedMajor: string | null;
  hometownState: string | null;
}

const YEAR_LABELS: Record<number, string> = {
  1: "First-year",
  2: "Sophomore",
  3: "Junior",
  4: "Senior",
  5: "5th year",
  6: "Recent grad",
};

/**
 * Returns approved reviews for a college, most recent first.
 */
export async function getApprovedReviewsForSlug(
  slug: string,
  limit = 10,
): Promise<CollegeReview[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return [];
  }
  try {
    const supa = createServiceRoleClient();
    const { data, error } = await supa
      .from("college_reviews")
      .select(
        `
        id,
        why_chose,
        biggest_positive_surprise,
        biggest_negative_surprise,
        who_thrives,
        who_shouldnt_come,
        one_thing_to_senior,
        helpful_count,
        approved_at,
        verified_students!inner (
          display_handle,
          year_in_school,
          intended_major,
          hometown_state
        )
      `,
      )
      .eq("college_slug", slug)
      .eq("status", "approved")
      .order("approved_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((r) => {
      const v = (
        Array.isArray(r.verified_students)
          ? r.verified_students[0]
          : r.verified_students
      ) as {
        display_handle: string | null;
        year_in_school: number | null;
        intended_major: string | null;
        hometown_state: string | null;
      } | undefined;
      return {
        id: r.id as string,
        whyChose: r.why_chose as string,
        biggestPositiveSurprise: r.biggest_positive_surprise as string,
        biggestNegativeSurprise: r.biggest_negative_surprise as string,
        whoThrives: (r.who_thrives as string | null) ?? null,
        whoShouldntCome: (r.who_shouldnt_come as string | null) ?? null,
        oneThingToSenior: r.one_thing_to_senior as string,
        helpfulCount: (r.helpful_count as number) ?? 0,
        approvedAt: r.approved_at as string,
        displayHandle: v?.display_handle ?? null,
        yearInSchool: v?.year_in_school ?? null,
        intendedMajor: v?.intended_major ?? null,
        hometownState: v?.hometown_state ?? null,
      };
    });
  } catch {
    return [];
  }
}

export function formatReviewerByline(review: CollegeReview): string {
  if (review.displayHandle) return review.displayHandle;
  const parts: string[] = [];
  if (review.yearInSchool && YEAR_LABELS[review.yearInSchool]) {
    parts.push(YEAR_LABELS[review.yearInSchool]);
  }
  if (review.intendedMajor) parts.push(review.intendedMajor);
  if (review.hometownState) parts.push(`from ${review.hometownState}`);
  return parts.length > 0 ? parts.join(", ") : "Verified student";
}
