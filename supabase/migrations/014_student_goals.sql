CREATE TABLE IF NOT EXISTS student_goals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  graduation_year integer,
  current_gpa decimal(3,2),
  sat_score integer,
  act_score integer,
  intended_major text,
  target_colleges jsonb DEFAULT '[]',
  application_strategy text CHECK (application_strategy IN ('EA','ED','RD','rolling')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS student_checklist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  task text NOT NULL,
  category text NOT NULL,
  due_date date,
  college_name text,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own goals" ON student_goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own checklist" ON student_checklist
  FOR ALL USING (auth.uid() = user_id);
