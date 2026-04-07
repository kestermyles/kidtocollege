-- Add photographer attribution columns for Unsplash compliance
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS photo_credit_name text;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS photo_credit_url text;
