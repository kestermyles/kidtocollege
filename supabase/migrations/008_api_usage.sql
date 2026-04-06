CREATE TABLE IF NOT EXISTS public.api_usage (
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  api text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date, api)
);

ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own usage"
  ON public.api_usage FOR ALL
  USING (auth.uid() = user_id);
