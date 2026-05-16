// Helper for reading the program_earnings table. Each row is a
// (college, CIP4 program, credential level) tuple with median earnings
// 1 and 4 years post-graduation, sourced from College Scorecard's
// FieldOfStudyData.

import { createServiceRoleClient } from "@/lib/supabase-server";

export interface ProgramEarning {
  cip4: string;
  cip6: string;
  cipTitle: string;
  credentialLevel: number;
  credentialLabel: string;
  medianEarnings1yr: number | null;
  medianEarnings4yr: number | null;
  earningsCount1yr: number | null;
  earningsCount4yr: number | null;
}

/**
 * Returns bachelor's-level program earnings for a college, sorted by
 * earnings count desc (i.e. most-graduates-first). Returns empty array
 * if no data has been imported yet for that slug.
 */
export async function getProgramEarningsForSlug(
  slug: string,
  options: { limit?: number; credentialLevel?: number } = {},
): Promise<ProgramEarning[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return [];
  }
  const credentialLevel = options.credentialLevel ?? 3; // 3 = bachelor's
  const limit = options.limit ?? 8;
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("program_earnings")
      .select(
        "cip4, cip6, cip_title, credential_level, credential_label, median_earnings_1yr, median_earnings_4yr, earnings_count_1yr, earnings_count_4yr",
      )
      .eq("college_slug", slug)
      .eq("credential_level", credentialLevel)
      .neq("cip6", "000000")
      .order("earnings_count_1yr", { ascending: false, nullsFirst: false })
      .limit(limit);
    return (data ?? []).map((r: Record<string, unknown>) => ({
      cip4: r.cip4 as string,
      cip6: r.cip6 as string,
      cipTitle: r.cip_title as string,
      credentialLevel: r.credential_level as number,
      credentialLabel: r.credential_label as string,
      medianEarnings1yr: (r.median_earnings_1yr as number | null) ?? null,
      medianEarnings4yr: (r.median_earnings_4yr as number | null) ?? null,
      earningsCount1yr: (r.earnings_count_1yr as number | null) ?? null,
      earningsCount4yr: (r.earnings_count_4yr as number | null) ?? null,
    }));
  } catch {
    return [];
  }
}
