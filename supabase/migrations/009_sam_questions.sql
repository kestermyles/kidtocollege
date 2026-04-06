CREATE TABLE sam_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  question text NOT NULL,
  asked_at timestamptz DEFAULT now(),
  page_context text
);

CREATE INDEX idx_sam_questions_asked_at ON sam_questions(asked_at DESC);
