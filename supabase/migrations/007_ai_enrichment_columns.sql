ALTER TABLE colleges
ADD COLUMN IF NOT EXISTS ai_acceptance_notes text,
ADD COLUMN IF NOT EXISTS ai_cost_after_aid text,
ADD COLUMN IF NOT EXISTS ai_scholarship_summary text,
ADD COLUMN IF NOT EXISTS ai_gpa_notes text,
ADD COLUMN IF NOT EXISTS ai_last_enriched timestamp with time zone,
ADD COLUMN IF NOT EXISTS ai_search_count integer DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_search_count(college_slug text)
RETURNS void AS $$
  UPDATE colleges
  SET ai_search_count = COALESCE(ai_search_count, 0) + 1
  WHERE slug = college_slug;
$$ LANGUAGE sql;
