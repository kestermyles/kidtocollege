import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function run() {
  // Test if column exists by trying to select it
  const { error } = await supabase
    .from("colleges")
    .select("official_url")
    .limit(1);

  if (error?.message?.includes("official_url")) {
    console.log("Column official_url does not exist. Please add it via the Supabase SQL editor:");
    console.log("ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS official_url text;");
    console.log("\nThe seed script will still run — official_url will be ignored until the column is added.");
  } else {
    console.log("Column official_url exists (or query succeeded). Ready to seed.");
  }
}

run();
