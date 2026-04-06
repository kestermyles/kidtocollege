CREATE TABLE community_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  body text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  view_count integer DEFAULT 0,
  is_sam_seeded boolean DEFAULT false
);

CREATE TABLE community_answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id uuid REFERENCES community_questions(id) ON DELETE CASCADE,
  body text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_sam boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE community_upvotes (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  answer_id uuid REFERENCES community_answers(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, answer_id)
);

CREATE INDEX ON community_questions (created_at DESC);
CREATE INDEX ON community_answers (question_id, created_at ASC);

-- RLS
ALTER TABLE community_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_upvotes ENABLE ROW LEVEL SECURITY;

-- community_questions: SELECT open to all, INSERT requires auth
CREATE POLICY "Anyone can read questions"
  ON community_questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert questions"
  ON community_questions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- community_answers: SELECT open to all, INSERT requires auth
CREATE POLICY "Anyone can read answers"
  ON community_answers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert answers"
  ON community_answers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- community_upvotes: SELECT open, INSERT/DELETE requires own user_id
CREATE POLICY "Anyone can read upvotes"
  ON community_upvotes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own upvotes"
  ON community_upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own upvotes"
  ON community_upvotes FOR DELETE USING (auth.uid() = user_id);
