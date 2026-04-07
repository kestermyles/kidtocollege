CREATE TABLE IF NOT EXISTS college_admission_factors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  college_slug text REFERENCES colleges(slug) ON DELETE CASCADE,
  factor text NOT NULL,
  weight text CHECK (weight IN ('very_important','important','considered','not_considered')),
  source text DEFAULT 'cds',
  cds_year integer,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(college_slug, factor, cds_year)
);

CREATE TABLE IF NOT EXISTS college_your_in (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  college_slug text REFERENCES colleges(slug) ON DELETE CASCADE UNIQUE,
  headline text,
  angles jsonb,
  generated_at timestamptz DEFAULT now(),
  model_used text DEFAULT 'claude-sonnet-4-5'
);

CREATE INDEX ON college_admission_factors (college_slug);
CREATE INDEX ON college_your_in (college_slug);
