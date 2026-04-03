-- Family linking between student and parent accounts
CREATE TABLE IF NOT EXISTS public.family_links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  inviter_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  invite_code text UNIQUE NOT NULL,
  invitee_email text,
  status text NOT NULL CHECK (status IN ('pending', 'active', 'revoked')) DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);

-- RLS
ALTER TABLE public.family_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own family links"
  ON public.family_links FOR SELECT
  USING (auth.uid() = student_id OR auth.uid() = parent_id OR auth.uid() = inviter_id);

CREATE POLICY "Users can insert family links"
  ON public.family_links FOR INSERT
  WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their own family links"
  ON public.family_links FOR UPDATE
  USING (auth.uid() = student_id OR auth.uid() = parent_id OR auth.uid() = inviter_id);

-- Allow anyone to read pending invites by code (for join page)
CREATE POLICY "Anyone can read pending invites by code"
  ON public.family_links FOR SELECT
  USING (status = 'pending');

-- Indexes
CREATE INDEX idx_family_links_student ON public.family_links(student_id);
CREATE INDEX idx_family_links_parent ON public.family_links(parent_id);
CREATE INDEX idx_family_links_code ON public.family_links(invite_code);
