// One-shot endpoint: pulls College Scorecard program-level earnings
// (CIP4 × institution × credential level granularity) and stores in
// the program_earnings table. Requires migration 023 to have been run.
//
// Auth: same CRON_SECRET as the photo cron.
//   curl -H "Authorization: Bearer $CRON_SECRET" https://www.kidtocollege.com/api/admin/import-program-earnings
//
// Resumable: skips colleges that already have earnings rows for the
// configured data_year. Budgeted to ~5 min per run; will return early
// when out of time so a follow-up call picks up where it left off.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 300;

const DATA_YEAR = "2122";
const SAFETY_MARGIN_MS = 15_000;
const DELAY_MS = 400;
const BATCH_SIZE = 60;

const SCORECARD_API =
  "https://api.data.gov/ed/collegescorecard/v1/schools";

const CREDENTIAL_LABELS: Record<number, string> = {
  1: "Undergraduate Certificate",
  2: "Associate's",
  3: "Bachelor's",
  4: "Post-Baccalaureate Certificate",
  5: "Master's",
  6: "Doctoral",
  7: "First-Professional",
  8: "Graduate Certificate",
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface ScorecardProgram {
  code?: string;
  title?: string;
  credential?: { level?: number; title?: string };
  earnings?: {
    highest?: {
      "1_yr"?: { overall_median_earnings?: number; overall_count?: number };
      "4_yr"?: { overall_median_earnings?: number; overall_count?: number };
    };
  };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "COLLEGE_SCORECARD_API_KEY not set" },
      { status: 500 },
    );
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    );
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  const start = Date.now();
  const budgetMs = (maxDuration - 5) * 1000;

  // Find which slugs already have earnings rows for this data year.
  // PostgREST caps SELECTs at 1000 rows by default — paginate so `done`
  // captures every slug, not just the first 1000 rows of the table.
  const done = new Set<string>();
  {
    const PAGE = 1000;
    for (let offset = 0; ; offset += PAGE) {
      const { data: page } = await supabase
        .from("program_earnings")
        .select("college_slug")
        .eq("data_year", DATA_YEAR)
        .range(offset, offset + PAGE - 1);
      if (!page || page.length === 0) break;
      for (const r of page) {
        done.add((r as { college_slug: string }).college_slug);
      }
      if (page.length < PAGE) break;
    }
  }

  let processed = 0;
  let rowsInserted = 0;
  let scorecardMisses = 0;
  // Cursor pagination by slug — advances through the colleges table
  // regardless of whether items are already in `done`.
  let cursorSlug = "";

  outer: while (Date.now() - start < budgetMs - SAFETY_MARGIN_MS) {
    let query = supabase
      .from("colleges")
      .select("slug, name")
      .order("slug", { ascending: true })
      .limit(BATCH_SIZE);
    if (cursorSlug) {
      query = query.gt("slug", cursorSlug);
    }
    const { data: colleges } = await query;
    if (!colleges || colleges.length === 0) break;

    // Advance cursor to the last slug in this batch BEFORE filtering,
    // so already-done batches still move the cursor forward.
    cursorSlug = colleges[colleges.length - 1].slug;

    // Filter to ones not yet processed
    const queue = colleges.filter((c) => !done.has(c.slug));
    if (queue.length === 0) {
      // Whole batch already done — keep advancing the cursor.
      continue;
    }

    for (const college of queue) {
      if (Date.now() - start >= budgetMs - SAFETY_MARGIN_MS) break outer;

      // Query Scorecard by exact school name
      const params = new URLSearchParams({
        "school.name": college.name,
        fields: [
          "id",
          "school.name",
          "latest.programs.cip_4_digit",
        ].join(","),
        api_key: apiKey,
        per_page: "1",
      });

      let scorecardOk = false;
      try {
        const res = await fetch(`${SCORECARD_API}?${params}`);
        if (res.ok) {
          const json = (await res.json()) as {
            results?: Array<{
              "latest.programs.cip_4_digit"?: ScorecardProgram[];
            }>;
          };
          const programs = json.results?.[0]?.["latest.programs.cip_4_digit"];
          if (programs && programs.length > 0) {
            scorecardOk = true;
            const rows: Record<string, unknown>[] = [];
            for (const p of programs) {
              if (!p.code || !p.title) continue;
              const cip6 = p.code.padStart(6, "0");
              const cip4 = cip6.substring(0, 4);
              const credLevel = p.credential?.level ?? 0;
              if (!credLevel) continue;
              const e1 = p.earnings?.highest?.["1_yr"];
              const e4 = p.earnings?.highest?.["4_yr"];
              const e1Med = e1?.overall_median_earnings ?? null;
              const e4Med = e4?.overall_median_earnings ?? null;
              const e1Count = e1?.overall_count ?? null;
              const e4Count = e4?.overall_count ?? null;
              // Skip rows where neither earnings figure is present
              if (e1Med == null && e4Med == null) continue;
              rows.push({
                college_slug: college.slug,
                cip6,
                cip4,
                cip_title: p.title,
                credential_level: credLevel,
                credential_label:
                  p.credential?.title ?? CREDENTIAL_LABELS[credLevel] ?? "",
                median_earnings_1yr: e1Med,
                median_earnings_4yr: e4Med,
                earnings_count_1yr: e1Count,
                earnings_count_4yr: e4Count,
                data_year: DATA_YEAR,
              });
            }
            if (rows.length > 0) {
              const { error } = await supabase
                .from("program_earnings")
                .upsert(rows, {
                  onConflict: "college_slug,cip6,credential_level,data_year",
                });
              if (!error) rowsInserted += rows.length;
            }
          }
        }
      } catch {
        // Network/API errors are fine — try again on the next run
      }

      // Even if Scorecard had no programs, mark this slug "tried" with a
      // sentinel row so we don't hit the API forever
      if (!scorecardOk) {
        scorecardMisses++;
        await supabase.from("program_earnings").upsert(
          {
            college_slug: college.slug,
            cip6: "000000",
            cip4: "0000",
            cip_title: "(no data)",
            credential_level: 0,
            credential_label: "(no data)",
            median_earnings_1yr: null,
            median_earnings_4yr: null,
            earnings_count_1yr: null,
            earnings_count_4yr: null,
            data_year: DATA_YEAR,
          },
          { onConflict: "college_slug,cip6,credential_level,data_year" },
        );
      }

      done.add(college.slug);
      processed++;
      await sleep(DELAY_MS);
    }
  }

  const { count: remaining } = await supabase
    .from("colleges")
    .select("slug", { count: "exact", head: true });
  const totalDone = done.size;

  return NextResponse.json({
    processed,
    rowsInserted,
    scorecardMisses,
    totalDone,
    remainingColleges: (remaining ?? 0) - totalDone,
    elapsedMs: Date.now() - start,
  });
}
