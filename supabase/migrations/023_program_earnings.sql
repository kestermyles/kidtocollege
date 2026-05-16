-- Program-level earnings data from College Scorecard's FieldOfStudyData
-- file (CIP6 × institution × credential level granularity). Lets a college
-- page show "Earnings 1-year after graduation by major", which is the
-- single biggest decision-affecting data point the Scorecard publishes.
--
-- Source file: https://collegescorecard.ed.gov/data/ — FieldOfStudyData
-- latest year (currently 2122_PP — academic year 2021-22 grads,
-- earnings tracked through 2022 and 2025 IRS data).
--
-- Populated by /api/admin/import-program-earnings (one-shot import).

CREATE TABLE IF NOT EXISTS program_earnings (
  id BIGSERIAL PRIMARY KEY,
  college_slug TEXT NOT NULL REFERENCES colleges(slug) ON DELETE CASCADE,
  cip6 TEXT NOT NULL,
  cip4 TEXT NOT NULL,
  cip_title TEXT NOT NULL,
  -- 1=undergrad cert, 2=associate, 3=bachelor, 5=master, 6=doctoral, 7=first-prof, 8=grad cert
  credential_level INT NOT NULL,
  credential_label TEXT NOT NULL,
  -- IRS-derived median wages
  median_earnings_1yr INT,
  median_earnings_4yr INT,
  -- Count of completers used to compute the median (privacy-suppressed if < 30)
  earnings_count_1yr INT,
  earnings_count_4yr INT,
  data_year TEXT NOT NULL DEFAULT '2122',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (college_slug, cip6, credential_level, data_year)
);

CREATE INDEX IF NOT EXISTS idx_program_earnings_slug ON program_earnings(college_slug);
CREATE INDEX IF NOT EXISTS idx_program_earnings_cip4 ON program_earnings(cip4);
CREATE INDEX IF NOT EXISTS idx_program_earnings_credential ON program_earnings(credential_level);
