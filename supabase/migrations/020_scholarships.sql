-- Scholarships database + user saves
-- Replaces the hardcoded scholarships-data.ts seed as the source of truth.

CREATE TABLE IF NOT EXISTS public.scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  amount_text text NOT NULL,
  amount_min integer,
  amount_max integer,
  type text NOT NULL,
  subject text,
  state text,
  eligibility text NOT NULL,
  deadline_text text NOT NULL,
  deadline_month text,
  deadline_date date,
  url text NOT NULL,
  min_gpa numeric(3,2),
  majors text[] DEFAULT '{}',
  activities text[] DEFAULT '{}',
  essay_required boolean DEFAULT false,
  essay_prompts text[] DEFAULT '{}',
  source text DEFAULT 'curated',
  verified boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS scholarships_type_idx ON public.scholarships (type);
CREATE INDEX IF NOT EXISTS scholarships_state_idx ON public.scholarships (state);
CREATE INDEX IF NOT EXISTS scholarships_subject_idx ON public.scholarships (subject);
CREATE INDEX IF NOT EXISTS scholarships_deadline_month_idx ON public.scholarships (deadline_month);

CREATE TABLE IF NOT EXISTS public.saved_scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_slug text NOT NULL,
  status text NOT NULL DEFAULT 'saved'
    CHECK (status IN ('saved','applied','submitted','awarded','rejected')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, scholarship_slug)
);

CREATE INDEX IF NOT EXISTS saved_scholarships_user_idx
  ON public.saved_scholarships (user_id);

ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scholarships readable by anyone"
  ON public.scholarships FOR SELECT
  USING (true);

CREATE POLICY "users manage own scholarship saves"
  ON public.saved_scholarships FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
