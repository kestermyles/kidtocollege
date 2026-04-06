CREATE TABLE IF NOT EXISTS public.sam_answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  topic text,
  asked_count integer NOT NULL DEFAULT 1,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sam_answers_slug ON sam_answers(slug);
CREATE INDEX idx_sam_answers_published ON sam_answers(published) WHERE published = true;
