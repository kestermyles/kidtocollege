-- Add NPC calculation columns to colleges table
ALTER TABLE colleges
ADD COLUMN IF NOT EXISTS avg_grant_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS meets_full_need BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS merit_aid_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS no_loan_threshold INTEGER;

-- Add comments
COMMENT ON COLUMN colleges.avg_grant_percentage IS 'Average percentage of demonstrated need met by institutional grants';
COMMENT ON COLUMN colleges.meets_full_need IS 'Whether college commits to meeting 100% of demonstrated financial need';
COMMENT ON COLUMN colleges.no_loan_threshold IS 'Family income threshold below which college replaces loans with grants';

-- Update top schools with no-loan policies
UPDATE colleges SET
  avg_grant_percentage = 100,
  meets_full_need = true,
  no_loan_threshold = 75000
WHERE slug IN ('harvard-university', 'stanford-university', 'princeton-university', 'yale-university', 'massachusetts-institute-of-technology');

-- Update other Ivies and top privates
UPDATE colleges SET
  avg_grant_percentage = 95,
  meets_full_need = true
WHERE slug IN ('columbia-university', 'duke-university', 'university-of-pennsylvania', 'brown-university', 'dartmouth-college', 'cornell-university', 'northwestern-university', 'vanderbilt-university');

-- Show results
SELECT slug, name, avg_grant_percentage, meets_full_need, no_loan_threshold
FROM colleges
WHERE avg_grant_percentage IS NOT NULL
ORDER BY avg_grant_percentage DESC;
