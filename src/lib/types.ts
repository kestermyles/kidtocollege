export interface WizardData {
  college: string;
  major: string;
  minor?: string;
  applicationYear: string;
  gpa: string;
  satScore?: string;
  activities: string[];
  otherSkills?: string;
  priorities: string[];
  budget: string;
  notes?: string;
  mode: "college" | "league";
}

export interface ScholarshipResult {
  name: string;
  amount: string;
  type: string;
  eligibility: string;
  deadline: string;
  url: string;
  why_this_student: string;
}

export interface PlaybookItem {
  title: string;
  description: string;
  action: string;
}

export interface BudgetBreakdown {
  tuition: string;
  room_board: string;
  books_living: string;
  total_sticker: string;
  estimated_net_after_aid: string;
  notes: string;
}

export interface CCGateway {
  community_colleges: string[];
  transfer_route_description: string;
  cost_comparison: string;
  transfer_success_rate: string;
}

export interface LiveLinks {
  admissions: string;
  financial_aid: string;
  program: string;
  scholarships: string;
}

export interface AIResearchResult {
  match_score: number;
  acceptance_rate: string;
  gpa_ranges: {
    minimum: string;
    mid_50_low: string;
    mid_50_high: string;
    average: string;
  };
  sat_ranges: {
    minimum: string;
    mid_50_low: string;
    mid_50_high: string;
    average: string;
  };
  scholarships: ScholarshipResult[];
  playbook: PlaybookItem[];
  insider_intel: string[];
  budget: BudgetBreakdown;
  cc_gateway: CCGateway;
  early_decision_advantage: string;
  essay_angles: string[];
  live_links: LiveLinks;
  recommended_colleges?: RecommendedCollege[];
}

export interface RecommendedCollege {
  name: string;
  reason: string;
  acceptance_rate: string;
  estimated_cost: string;
  scholarship_potential: string;
}

export interface College {
  slug: string;
  name: string;
  location: string;
  state: string;
  acceptance_rate: number | null;
  avg_cost_instate: number | null;
  avg_cost_outstate: number | null;
  graduation_rate: number | null;
  total_enrollment: number | null;
  photo_url: string | null;
  official_url?: string | null;
  programs: string[];
  last_updated: string;
  median_earnings_6yr?: number | null;
  median_earnings_10yr?: number | null;
  employment_rate?: number | null;
  graduation_rate_4yr?: number | null;
  loan_default_rate?: number | null;
  scorecard_last_updated?: string | null;
}

export interface SavedCollege {
  id: string;
  user_id: string;
  college_slug: string;
  college_name: string;
  user_notes: string | null;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  user_id: string;
  college_slug: string;
  college_name: string;
  item_type: string;
  item_label: string;
  deadline: string | null;
  status: "not-started" | "in-progress" | "done";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EssayDraft {
  id: string;
  user_id: string;
  draft_type: string;
  college_slug: string | null;
  content: string;
  ai_feedback: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface SearchRecord {
  id: string;
  college: string;
  major: string;
  created_at: string;
}

export interface Scholarship {
  id?: string;
  name: string;
  amount: string;
  type: string;
  eligibility: string;
  deadline: string;
  url: string;
  subject?: string;
  state?: string;
}
