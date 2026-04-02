-- User's saved college list
CREATE TABLE IF NOT EXISTS public.college_lists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  gpa numeric(3,2),
  sat_score integer,
  act_score integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Individual colleges on a user's list
CREATE TABLE IF NOT EXISTS public.college_list_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id uuid REFERENCES public.college_lists(id) ON DELETE CASCADE NOT NULL,
  college_slug text REFERENCES public.colleges(slug) NOT NULL,
  category text CHECK (category IN ('reach', 'target', 'safety', 'unknown')),
  notes text,
  application_status text CHECK (application_status IN (
    'researching', 'planning_to_apply', 'applied',
    'accepted', 'rejected', 'waitlisted', 'enrolled'
  )) DEFAULT 'researching',
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(list_id, college_slug)
);

-- RLS
ALTER TABLE public.college_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own list"
  ON public.college_lists FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own list items"
  ON public.college_list_items FOR ALL
  USING (
    list_id IN (
      SELECT id FROM public.college_lists
      WHERE user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_college_lists_user ON public.college_lists(user_id);
CREATE INDEX idx_college_list_items_list ON public.college_list_items(list_id);

-- Auto-update timestamp
CREATE TRIGGER college_lists_updated_at
  BEFORE UPDATE ON public.college_lists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
