-- Master list of grade-level checklist tasks. Publicly readable; seeded, not user-editable.
CREATE TABLE IF NOT EXISTS public.checklist_tasks (
  task_id text PRIMARY KEY,
  grade_level text NOT NULL CHECK (grade_level IN ('9','10','11','12','summer-before-12')),
  task_category text NOT NULL CHECK (task_category IN ('testing','applications','financial_aid','visits','essays','planning')),
  task_title text NOT NULL,
  task_description text NOT NULL,
  ideal_completion_month integer CHECK (ideal_completion_month BETWEEN 1 AND 12),
  reminder_days_before integer,
  priority text NOT NULL CHECK (priority IN ('critical','important','recommended')),
  related_tool_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_checklist_tasks_grade ON public.checklist_tasks(grade_level);
CREATE INDEX IF NOT EXISTS idx_checklist_tasks_priority ON public.checklist_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_checklist_tasks_month ON public.checklist_tasks(ideal_completion_month);

-- Per-user completion tracking for master checklist tasks.
CREATE TABLE IF NOT EXISTS public.student_checklist_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id text NOT NULL REFERENCES public.checklist_tasks(task_id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  reminder_sent boolean NOT NULL DEFAULT false,
  reminder_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_checklist_progress_user ON public.student_checklist_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_checklist_progress_reminder ON public.student_checklist_progress(reminder_sent, completed) WHERE reminder_sent = false AND completed = false;

-- RLS
ALTER TABLE public.checklist_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_checklist_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Checklist tasks are publicly readable"
  ON public.checklist_tasks FOR SELECT
  USING (true);

CREATE POLICY "Users manage own checklist progress"
  ON public.student_checklist_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Seed data: grade-level tasks extracted from roadmap transcript.
INSERT INTO public.checklist_tasks
  (task_id, grade_level, task_category, task_title, task_description, ideal_completion_month, reminder_days_before, priority, related_tool_url)
VALUES
  -- 9th grade
  ('9-gpa-foundation', '9', 'planning', 'Build a strong GPA foundation',
   'Freshman grades count. It is much easier to build a strong GPA from the start than to recover a low one later. Treat every class as part of your college application.',
   NULL, NULL, 'important', '/roadmap'),
  ('9-understand-gpa-weighting', '9', 'planning', 'Understand weighted vs unweighted GPA',
   'Many high schools report both a weighted and unweighted GPA. Find out how your school calculates each and which classes qualify for weighting (typically AP, Honors, and sometimes world language).',
   9, 14, 'recommended', '/roadmap'),
  ('9-choose-rigorous-classes', '9', 'planning', 'Choose rigorous classes for next year',
   'Course selection for sophomore year usually happens in spring. Choose the most rigorous courses you can realistically handle — colleges want to see you challenged yourself.',
   3, 21, 'important', '/roadmap'),
  ('9-explore-extracurriculars', '9', 'planning', 'Explore extracurricular activities',
   'Try a range of clubs, sports, volunteering, or passion projects. Freshman year is the time to explore broadly so you can commit deeply in later years.',
   NULL, NULL, 'important', NULL),
  ('9-find-meaningful-involvement', '9', 'planning', 'Find activities with leadership potential',
   'Honor roll alone is not a differentiator. Look for activities where you can eventually take on leadership, deepen involvement, or pursue a genuine passion project.',
   NULL, NULL, 'important', NULL),

  -- 10th grade
  ('10-maintain-gpa', '10', 'planning', 'Maintain a strong GPA',
   'It is much easier to maintain a strong GPA than fix a weak one. Sophomore year grades carry into the transcript colleges see.',
   NULL, NULL, 'important', '/roadmap'),
  ('10-continue-rigor', '10', 'planning', 'Continue challenging coursework',
   'Pick up AP or Honors classes where you can. Course rigor is one of the most important admission factors at selective schools.',
   3, 21, 'important', '/roadmap'),
  ('10-deepen-extracurriculars', '10', 'planning', 'Deepen extracurricular involvement',
   'Narrow from exploration to commitment. Start moving toward leadership roles, sustained projects, or visible impact in one or two activities.',
   NULL, NULL, 'important', NULL),
  ('10-take-psat', '10', 'testing', 'Take the PSAT for practice',
   'Sophomore PSAT does not count for National Merit but is excellent practice. Sit the real test in October to build testing stamina.',
   10, 21, 'important', '/roadmap'),
  ('10-start-college-research', '10', 'planning', 'Start informal college research',
   'Browse colleges, read about majors, and notice what appeals to you. Nothing formal yet — just start forming preferences (size, location, vibe).',
   NULL, NULL, 'recommended', '/search'),

  -- 11th grade (critical year)
  ('11-psat-nmsq', '11', 'testing', 'Take the PSAT/NMSQT (National Merit qualifier)',
   'Junior year PSAT is the one that counts for National Merit Scholarship. Offered in October — register through your counselor.',
   10, 21, 'critical', '/roadmap'),
  ('11-register-sat-act', '11', 'testing', 'Register for the SAT or ACT',
   'Register early for your target test date. Aim to take your first real SAT or ACT by March or April of junior year.',
   1, 14, 'critical', NULL),
  ('11-practice-test-winter', '11', 'testing', 'Take a full-length practice test over winter break',
   'A timed, full-length practice test over winter break builds endurance and exposes weak areas before your first official sitting.',
   12, 14, 'important', NULL),
  ('11-take-sat-act-spring', '11', 'testing', 'Take your first official SAT or ACT',
   'First real sitting in March or April gives you time to retake if needed before senior year starts.',
   3, 21, 'critical', NULL),
  ('11-retake-sat-act', '11', 'testing', 'Retake SAT or ACT in May or June if needed',
   'As soon as you get your first scores, decide if a retake is worth it. The goal is to be done with testing before senior year begins.',
   5, 21, 'important', NULL),
  ('11-build-college-list', '11', 'planning', 'Build a broad college list (10-20 schools)',
   'Start wide. Include reach, target, and safety schools. You will narrow to 5-7 over the summer. Use admission chances and fit to guide.',
   2, 14, 'critical', '/my-list'),
  ('11-schedule-visits', '11', 'visits', 'Schedule college visits in spring',
   'Spring of junior year is ideal for visits — but only when classes are in session. Avoid summer, winter break, spring break, and dead week.',
   3, 21, 'important', NULL),
  ('11-research-scholarships', '11', 'financial_aid', 'Research scholarship opportunities',
   'Many scholarships have junior-year deadlines or require early preparation. Start building a list of opportunities you qualify for.',
   NULL, NULL, 'important', '/scholarships'),
  ('11-maintain-junior-gpa', '11', 'planning', 'Maintain strong grades through junior year',
   'Junior year grades are the most recent full year colleges see. Do not let test prep or visits pull your GPA down.',
   NULL, NULL, 'critical', '/roadmap'),

  -- Summer before 12th
  ('sum12-request-rec-letters', 'summer-before-12', 'applications', 'Request letters of recommendation',
   'Ask teachers in person, ideally in a 10-minute meeting. Ask before they leave for summer. Bring your resume and a short note on why you are asking them specifically.',
   6, 14, 'critical', NULL),
  ('sum12-narrow-college-list', 'summer-before-12', 'planning', 'Narrow college list to 5-7 schools',
   'Commit to a balanced final list: reach, target, and safety schools you would genuinely attend. You cannot write great essays for 15 schools.',
   7, 14, 'critical', '/my-list'),
  ('sum12-review-common-app-prompts', 'summer-before-12', 'essays', 'Review Common App essay prompts',
   'The prompts are published in the spring. Read them over summer so your brain can work on them before you sit to write.',
   6, 14, 'important', NULL),
  ('sum12-brainstorm-essays', 'summer-before-12', 'essays', 'Brainstorm essay topics and stories',
   'The best essays are stories only you can tell. List moments, interests, and turning points before you choose a prompt.',
   7, 14, 'important', '/essays'),
  ('sum12-request-unofficial-transcript', 'summer-before-12', 'applications', 'Request an unofficial transcript',
   'Get an unofficial transcript from your counselor to check for errors and have on hand while completing applications.',
   7, 14, 'important', NULL),
  ('sum12-create-college-email', 'summer-before-12', 'applications', 'Create a dedicated college application email',
   'Use a clean, professional address (firstname.lastname@) for all applications, portals, and communications. Keeps things organized and avoids spam.',
   6, 14, 'important', NULL),
  ('sum12-draft-resume', 'summer-before-12', 'applications', 'Draft a resume or activity list',
   'Lead every activity description with impact: what you did, what changed, numbers where possible. You will reuse this across applications.',
   7, 14, 'important', NULL),
  ('sum12-take-visits', 'summer-before-12', 'visits', 'Take college visits if not done in spring',
   'If you missed spring visits, try to visit before apps are due. Note: summer campuses feel empty — use virtual tours and info sessions as a backup.',
   7, 21, 'important', NULL),
  ('sum12-organize-folder', 'summer-before-12', 'applications', 'Create an organized folder for application materials',
   'One digital folder for everything: transcripts, test scores, essays, recommendation info, deadlines. Future-you will thank present-you.',
   6, 14, 'recommended', NULL),

  -- 12th grade fall
  ('12-create-portal-accounts', '12', 'applications', 'Create accounts on all application portals',
   'Common App opens August 1. Create accounts on Common App, Coalition, and any school-specific portals immediately so you can start adding schools.',
   8, 14, 'critical', NULL),
  ('12-complete-essays', '12', 'essays', 'Complete all essays and short answers',
   'Budget one major essay per week. Each school has its own supplementals — do not underestimate the short-answer volume.',
   9, 21, 'critical', '/essays'),
  ('12-submit-applications', '12', 'applications', 'Submit applications by each deadline',
   'Watch Early Decision (usually Nov 1), Early Action (Nov 1 or Nov 15), and Regular Decision (Jan 1 or Jan 15) deadlines. Each school is different — track them individually.',
   11, 21, 'critical', '/deadlines'),
  ('12-track-portal-status', '12', 'applications', 'Track application status in each portal',
   'After submitting, most schools send portal login for tracking. Check email. Verify transcripts, test scores, and rec letters arrived.',
   11, 14, 'important', NULL),
  ('12-request-official-transcript', '12', 'applications', 'Request official transcript sent to colleges',
   'Your counselor or registrar sends this directly. Request at least 2-3 weeks before each application deadline.',
   10, 21, 'critical', NULL),
  ('12-send-test-scores', '12', 'testing', 'Send official SAT or ACT score reports',
   'Score reports come from College Board (SAT) or ACT.org — not your school. Some schools self-report; check each school policy.',
   10, 14, 'critical', NULL),
  ('12-submit-rec-letters', '12', 'applications', 'Ensure recommendation letters are submitted',
   'Recs are submitted by teachers directly through the portal. Check that each recommender received the invitation and submitted before the deadline.',
   10, 14, 'critical', NULL),
  ('12-complete-fafsa', '12', 'financial_aid', 'Complete the FAFSA',
   'FAFSA opens October 1. Complete it even if your family has high income — some merit aid requires it, and tax data imports automatically now.',
   10, 14, 'critical', '/fafsa-guide'),
  ('12-apply-scholarships', '12', 'financial_aid', 'Apply for scholarships',
   'Scholarship deadlines are scattered through senior year. Apply to every scholarship you qualify for — small awards add up.',
   9, 14, 'important', '/scholarships'),

  -- 12th grade spring
  ('12-review-acceptances', '12', 'applications', 'Review acceptance letters',
   'Decisions arrive through March. Read each acceptance letter carefully for financial aid details, deadlines, and next steps.',
   3, 14, 'critical', NULL),
  ('12-compare-aid-packages', '12', 'financial_aid', 'Compare financial aid packages',
   'Aid packages are the real cost. Compare grants vs loans, work-study, and net price side by side — not just tuition.',
   3, 14, 'critical', '/financial-aid'),
  ('12-use-net-cost-estimator', '12', 'financial_aid', 'Estimate four-year total cost',
   'Project full four-year cost including room, board, books, travel, and personal expenses — not just the advertised price.',
   3, 14, 'important', '/net-cost-estimator'),
  ('12-make-final-decision', '12', 'planning', 'Make your final college decision',
   'National decision deadline is typically May 1. Visit accepted schools if you can before deciding.',
   5, 21, 'critical', NULL),
  ('12-submit-enrollment-deposit', '12', 'planning', 'Submit enrollment deposit',
   'Deposit secures your spot. Usually non-refundable and due by May 1. Only deposit at one school.',
   5, 14, 'critical', NULL),
  ('12-housing-application', '12', 'planning', 'Complete housing applications',
   'Housing applications often open right after you deposit. Earlier applications generally get better placement.',
   5, 14, 'important', NULL),
  ('12-register-orientation', '12', 'planning', 'Register for orientation',
   'Orientation is where you register for first-semester classes. Popular sessions fill fast — register as soon as your college opens registration.',
   6, 14, 'important', NULL)
ON CONFLICT (task_id) DO NOTHING;
