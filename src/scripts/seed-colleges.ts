import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { COLLEGES_SEED } from "../lib/colleges-seed";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

async function seed() {
  console.log(`Seeding ${COLLEGES_SEED.length} colleges...`);

  // Check if official_url column exists
  const { error: colCheck } = await supabase
    .from("colleges")
    .select("official_url")
    .limit(1);

  const hasOfficialUrl = !colCheck?.message?.includes("official_url");
  if (!hasOfficialUrl) {
    console.log("Note: official_url column not found — stripping from seed data.");
    console.log("Run this SQL in Supabase to add it: ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS official_url text;");
  }

  const rows = COLLEGES_SEED.map((c) => {
    const row: Record<string, unknown> = {
      ...c,
      last_updated: new Date().toISOString(),
    };
    if (!hasOfficialUrl) {
      delete row.official_url;
    }
    return row;
  });

  const { data, error } = await supabase
    .from("colleges")
    .upsert(rows, { onConflict: "slug" })
    .select("slug");

  if (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }

  console.log(`Successfully upserted ${data.length} colleges.`);
}

seed();
