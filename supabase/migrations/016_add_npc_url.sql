-- Add npc_url column and seed official Net Price Calculator links for top schools.
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS npc_url text;

COMMENT ON COLUMN public.colleges.npc_url IS 'URL to the college''s official Net Price Calculator.';

-- Ivy League + elite privates. Each UPDATE uses slug IN (...) to tolerate
-- naming variants between Scorecard-synced rows and hand-entered seed data
-- (e.g. "mit" vs "massachusetts-institute-of-technology").
UPDATE public.colleges SET npc_url = 'https://npc.fas.harvard.edu/'
  WHERE slug = 'harvard-university';
UPDATE public.colleges SET npc_url = 'https://admission.princeton.edu/cost-aid/financial-aid/estimator'
  WHERE slug = 'princeton-university';
UPDATE public.colleges SET npc_url = 'https://netprice.yale.edu/'
  WHERE slug = 'yale-university';
UPDATE public.colleges SET npc_url = 'https://www.brown.edu/admission/undergraduate/cost-aid/financial-aid/net-price-calculator'
  WHERE slug = 'brown-university';
UPDATE public.colleges SET npc_url = 'https://www.columbia.edu/financial-aid/net-price-calculator'
  WHERE slug = 'columbia-university';
UPDATE public.colleges SET npc_url = 'https://www.dartmouth.edu/admissions/cost-aid/net-price-calculator'
  WHERE slug = 'dartmouth-college';
UPDATE public.colleges SET npc_url = 'https://www.cornell.edu/tuition-aid/financial-aid/cost/net-price-calculator'
  WHERE slug = 'cornell-university';
UPDATE public.colleges SET npc_url = 'https://www.upenn.edu/financialaid/net-price-calculator'
  WHERE slug IN ('university-of-pennsylvania', 'upenn');

UPDATE public.colleges SET npc_url = 'https://financialaid.stanford.edu/undergrad/how/calculator/'
  WHERE slug = 'stanford-university';
UPDATE public.colleges SET npc_url = 'https://financialaid.mit.edu/cost/estimator/'
  WHERE slug IN ('mit', 'massachusetts-institute-of-technology');
UPDATE public.colleges SET npc_url = 'https://www.caltech.edu/financial-aid/net-price-calculator'
  WHERE slug IN ('caltech', 'california-institute-of-technology');
UPDATE public.colleges SET npc_url = 'https://npc.collegeboard.org/student/app/duke'
  WHERE slug = 'duke-university';
UPDATE public.colleges SET npc_url = 'https://admission.northwestern.edu/cost-aid/net-price-calculator'
  WHERE slug = 'northwestern-university';
UPDATE public.colleges SET npc_url = 'https://admission.jhu.edu/cost-aid/net-price-calculator'
  WHERE slug = 'johns-hopkins-university';
UPDATE public.colleges SET npc_url = 'https://npc.collegeboard.org/student/app/uchicago'
  WHERE slug = 'university-of-chicago';

-- Public flagships. Use slug IN (...) for known seed variants.
UPDATE public.colleges SET npc_url = 'https://financialaid.berkeley.edu/cost-attendance/net-price-calculator'
  WHERE slug IN ('uc-berkeley', 'university-of-california-berkeley');
UPDATE public.colleges SET npc_url = 'https://www.financialaid.ucla.edu/net-price-calculator'
  WHERE slug IN ('ucla', 'university-of-california-los-angeles');
UPDATE public.colleges SET npc_url = 'https://finaid.umich.edu/estimate/'
  WHERE slug IN ('university-of-michigan', 'university-of-michigan-ann-arbor');
UPDATE public.colleges SET npc_url = 'https://studentaid.unc.edu/cost-calculator/'
  WHERE slug IN ('unc-chapel-hill', 'university-of-north-carolina-at-chapel-hill');
UPDATE public.colleges SET npc_url = 'https://admission.gatech.edu/cost-aid/net-price-calculator'
  WHERE slug IN ('georgia-tech', 'georgia-institute-of-technology');
UPDATE public.colleges SET npc_url = 'https://financialaid.virginia.edu/net-price-calculator'
  WHERE slug = 'university-of-virginia';
UPDATE public.colleges SET npc_url = 'https://npc.collegeboard.org/student/app/wisc'
  WHERE slug = 'university-of-wisconsin-madison';
UPDATE public.colleges SET npc_url = 'https://financialaid.illinois.edu/net-price-calculator'
  WHERE slug IN ('university-of-illinois-at-urbana-champaign', 'university-of-illinois-urbana-champaign');
UPDATE public.colleges SET npc_url = 'https://npc.collegeboard.org/student/app/washington'
  WHERE slug = 'university-of-washington';

-- After running: SELECT slug, name, npc_url FROM public.colleges WHERE npc_url IS NOT NULL;
-- to verify how many rows got populated.
