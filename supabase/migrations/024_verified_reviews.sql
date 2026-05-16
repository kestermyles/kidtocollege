-- Verified-student review system. Two new tables + one column on colleges.
--
-- The trust contract: only people who can receive email at a .edu address
-- whose domain matches a college's official domain can write reviews of
-- that college. Magic-link verification gates the verified_students row.
-- One review per (student, college) pair, period.
--
-- Run order: this migration must run AFTER 023.

-- 1. edu_domain on colleges — used to map a .edu email to a school.
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS edu_domain TEXT;
CREATE INDEX IF NOT EXISTS idx_colleges_edu_domain ON colleges(edu_domain);

-- Populate edu_domain by parsing official_url. Strips protocol, www.,
-- and trailing path. Only fills rows where official_url ends in .edu —
-- skips colleges with .com / .org / international official URLs since
-- those need hand-curated edu_domain values.
UPDATE colleges
SET edu_domain = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(official_url, '^https?://(www\.)?', ''),
    '/.*$', ''
  )
)
WHERE edu_domain IS NULL
  AND official_url IS NOT NULL
  AND official_url ~ '\.edu(/|$|\?)';

-- 2. verified_students — one row per (auth user, college) verified pair.
-- The user_id is the standard Supabase Auth user id. We trust that
-- supabase.auth.signInWithOtp confirmed the user owns the email.
CREATE TABLE IF NOT EXISTS verified_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  edu_email TEXT NOT NULL,
  college_slug TEXT NOT NULL REFERENCES colleges(slug) ON DELETE CASCADE,
  display_handle TEXT,
  year_in_school INT CHECK (year_in_school BETWEEN 1 AND 6),
  intended_major TEXT,
  hometown_state TEXT,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, college_slug),
  UNIQUE (edu_email)
);

CREATE INDEX IF NOT EXISTS idx_verified_students_user ON verified_students(user_id);
CREATE INDEX IF NOT EXISTS idx_verified_students_slug ON verified_students(college_slug);

-- 3. college_reviews — structured Q&A from a verified student. Five
-- required fields, two optional. Moderation status starts pending.
CREATE TABLE IF NOT EXISTS college_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_slug TEXT NOT NULL REFERENCES colleges(slug) ON DELETE CASCADE,
  verified_student_id UUID NOT NULL REFERENCES verified_students(id) ON DELETE CASCADE,
  -- Required
  why_chose TEXT NOT NULL,
  biggest_positive_surprise TEXT NOT NULL,
  biggest_negative_surprise TEXT NOT NULL,
  one_thing_to_senior TEXT NOT NULL,
  -- Optional
  who_thrives TEXT,
  who_shouldnt_come TEXT,
  -- Moderation
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  rejection_reason TEXT,
  helpful_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  UNIQUE (verified_student_id, college_slug)
);

CREATE INDEX IF NOT EXISTS idx_reviews_slug_status ON college_reviews(college_slug, status);
CREATE INDEX IF NOT EXISTS idx_reviews_status_created ON college_reviews(status, created_at DESC);
