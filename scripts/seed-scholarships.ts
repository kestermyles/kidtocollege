import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { scholarships as SEED } from "../src/lib/scholarships-data";
import { parseAmount, parseDeadlineMonth } from "../src/lib/scholarship-matching";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

async function main() {
  console.log(`Seeding ${SEED.length} scholarships...`);

  const rows = SEED.map((s) => {
    const { min, max } = parseAmount(s.amount);
    const month = parseDeadlineMonth(s.deadline);
    return {
      slug: slugify(s.name),
      name: s.name,
      amount_text: s.amount,
      amount_min: min,
      amount_max: max,
      type: s.type,
      subject: s.subject ?? null,
      state: s.state ?? null,
      eligibility: s.eligibility,
      deadline_text: s.deadline,
      deadline_month: month,
      deadline_date: null,
      url: s.url,
      min_gpa: null,
      majors: [],
      activities: [],
      essay_required: false,
      essay_prompts: [],
      source: "curated",
      verified: true,
    };
  });

  const { error } = await supabase
    .from("scholarships")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Upsert failed:", error);
    process.exit(1);
  }
  console.log(`Upserted ${rows.length} scholarships.`);
}

main();
