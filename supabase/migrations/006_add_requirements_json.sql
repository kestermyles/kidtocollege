ALTER TABLE public.colleges
ADD COLUMN IF NOT EXISTS requirements_json jsonb;
