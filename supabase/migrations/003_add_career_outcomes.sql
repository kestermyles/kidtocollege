ALTER TABLE public.colleges
ADD COLUMN IF NOT EXISTS median_earnings_6yr integer,
ADD COLUMN IF NOT EXISTS median_earnings_10yr integer,
ADD COLUMN IF NOT EXISTS employment_rate numeric,
ADD COLUMN IF NOT EXISTS graduation_rate_4yr numeric,
ADD COLUMN IF NOT EXISTS loan_default_rate numeric,
ADD COLUMN IF NOT EXISTS scorecard_last_updated timestamptz;
