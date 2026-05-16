-- Migration 022: Expand checklist_tasks.task_category to include
-- profile-building areas beyond the original process-only set.
--
-- The original constraint allowed: testing, applications, financial_aid,
-- visits, essays, planning. This is admissions-process-oriented.
--
-- New categories added (run this migration to enable):
--   extracurriculars  — clubs, depth-building, activity refinement
--   leadership        — running for positions, leading projects
--   service           — sustained community service, volunteer leadership
--   experience        — jobs, internships, summer programs, research
--   awards            — academic competitions, honor societies, recognition
--   recommendations   — building teacher relationships, asking for letters

ALTER TABLE checklist_tasks
  DROP CONSTRAINT IF EXISTS checklist_tasks_task_category_check;

ALTER TABLE checklist_tasks
  ADD CONSTRAINT checklist_tasks_task_category_check
  CHECK (task_category IN (
    'testing',
    'applications',
    'financial_aid',
    'visits',
    'essays',
    'planning',
    'extracurriculars',
    'leadership',
    'service',
    'experience',
    'awards',
    'recommendations'
  ));
