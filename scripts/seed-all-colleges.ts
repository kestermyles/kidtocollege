import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const API_KEY = process.env.COLLEGE_SCORECARD_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SCORECARD_API = "https://api.data.gov/ed/collegescorecard/v1/schools";

if (!API_KEY) {
  console.error("COLLEGE_SCORECARD_API_KEY not set in .env.local");
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Supabase env vars not set");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatAcceptanceRate(rate: number | null): number | null {
  if (rate == null) return null;
  return Math.round(rate * 1000) / 10; // e.g. 0.654 -> 65.4
}

interface ScorecardSchool {
  "school.name": string;
  "school.city": string;
  "school.state": string;
  "school.school_url": string | null;
  "school.ownership": number; // 1=public, 2=private nonprofit, 3=private for-profit
  "latest.admissions.admission_rate.overall": number | null;
  "latest.cost.tuition.in_state": number | null;
  "latest.cost.tuition.out_of_state": number | null;
  "latest.student.size": number | null;
  "latest.completion.rate_suppressed.four_year": number | null;
  "latest.earnings.10_yrs_after_entry.median": number | null;
  "latest.earnings.6_yrs_after_entry.median": number | null;
  "latest.repayment.3_yr_default_rate": number | null;
  "latest.employment.employed_2_yrs_after_completion.rate_suppressed": number | null;
}

async function fetchPage(page: number): Promise<{ results: ScorecardSchool[]; total: number }> {
  const fields = [
    "school.name",
    "school.city",
    "school.state",
    "school.school_url",
    "school.ownership",
    "latest.admissions.admission_rate.overall",
    "latest.cost.tuition.in_state",
    "latest.cost.tuition.out_of_state",
    "latest.student.size",
    "latest.completion.rate_suppressed.four_year",
    "latest.earnings.10_yrs_after_entry.median",
    "latest.earnings.6_yrs_after_entry.median",
    "latest.repayment.3_yr_default_rate",
    "latest.employment.employed_2_yrs_after_completion.rate_suppressed",
  ].join(",");

  const params = new URLSearchParams({
    "school.degrees_awarded.predominant": "3", // 4-year institutions
    "school.operating": "1", // currently operating
    fields,
    api_key: API_KEY!,
    per_page: "100",
    page: page.toString(),
  });

  const res = await fetch(`${SCORECARD_API}?${params}`);
  if (!res.ok) {
    throw new Error(`Scorecard API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return {
    results: data.results || [],
    total: data.metadata?.total || 0,
  };
}

function schoolToRow(school: ScorecardSchool) {
  const name = school["school.name"];
  const slug = slugify(name);
  const city = school["school.city"];
  const state = school["school.state"];

  let officialUrl = school["school.school_url"];
  if (officialUrl && !officialUrl.startsWith("http")) {
    officialUrl = `https://${officialUrl}`;
  }

  return {
    slug,
    name,
    location: `${city}, ${state}`,
    state,
    acceptance_rate: formatAcceptanceRate(
      school["latest.admissions.admission_rate.overall"]
    ),
    avg_cost_instate: school["latest.cost.tuition.in_state"],
    avg_cost_outstate: school["latest.cost.tuition.out_of_state"],
    graduation_rate: school["latest.completion.rate_suppressed.four_year"]
      ? Math.round(school["latest.completion.rate_suppressed.four_year"] * 1000) / 10
      : null,
    total_enrollment: school["latest.student.size"],
    official_url: officialUrl,
    programs: [] as string[],
    last_updated: new Date().toISOString(),
    // Scorecard career outcomes
    median_earnings_10yr: school["latest.earnings.10_yrs_after_entry.median"],
    median_earnings_6yr: school["latest.earnings.6_yrs_after_entry.median"],
    graduation_rate_4yr: school["latest.completion.rate_suppressed.four_year"],
    employment_rate:
      school["latest.employment.employed_2_yrs_after_completion.rate_suppressed"],
    loan_default_rate: school["latest.repayment.3_yr_default_rate"],
    scorecard_last_updated: new Date().toISOString(),
  };
}

async function main() {
  console.log("Fetching 4-year institutions from College Scorecard...\n");

  // First request to get total count
  const firstPage = await fetchPage(0);
  const total = firstPage.total;
  const totalPages = Math.ceil(total / 100);
  console.log(`Total institutions: ${total} (${totalPages} pages)\n`);

  let inserted = 0;
  let skipped = 0;
  const seenSlugs = new Set<string>();

  for (let page = 0; page < totalPages; page++) {
    const { results } = page === 0 ? firstPage : await fetchPage(page);

    const rows = [];
    for (const school of results) {
      const row = schoolToRow(school);

      // Skip duplicate slugs (different campuses with same name)
      if (seenSlugs.has(row.slug)) {
        skipped++;
        continue;
      }
      seenSlugs.add(row.slug);
      rows.push(row);
    }

    if (rows.length > 0) {
      const { error } = await supabase
        .from("colleges")
        .upsert(rows, { onConflict: "slug", ignoreDuplicates: false });

      if (error) {
        console.error(`  Error on page ${page}:`, error.message);
      } else {
        inserted += rows.length;
      }
    }

    const progress = Math.min(((page + 1) * 100), total);
    console.log(
      `  Page ${page + 1}/${totalPages} — ${progress}/${total} processed (${rows.length} upserted, ${skipped} skipped total)`
    );

    // Rate limit: small delay between pages
    if (page < totalPages - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`\nDone!`);
  console.log(`  Total processed: ${seenSlugs.size}`);
  console.log(`  Duplicates skipped: ${skipped}`);
  console.log(`  Upserted: ${inserted}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
