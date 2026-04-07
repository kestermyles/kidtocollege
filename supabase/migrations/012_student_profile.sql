-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  sat_total integer,
  act_score integer,
  gpa numeric(3,2),
  home_zip text,
  city text,
  state_abbr text,
  high_school text,
  grad_year integer,
  first_choice_college text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add columns if profiles table already existed without them
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state_abbr text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS high_school text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS grad_year integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_choice_college text;

-- College outcomes table
CREATE TABLE IF NOT EXISTS public.college_outcomes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  college_slug text,
  college_name text,
  outcome text CHECK (outcome IN (
    'applied','accepted','waitlisted','deferred','rejected','enrolled'
  )),
  app_year integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, college_slug, app_year)
);

ALTER TABLE public.college_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own outcomes" ON public.college_outcomes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
