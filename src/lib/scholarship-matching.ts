import type { StudentProfile } from "./college-matching";

export interface ScholarshipRow {
  slug: string;
  name: string;
  amount_text: string;
  amount_min: number | null;
  amount_max: number | null;
  type: string;
  subject: string | null;
  state: string | null;
  eligibility: string;
  deadline_text: string;
  deadline_month: string | null;
  deadline_date: string | null;
  url: string;
  min_gpa: number | null;
  majors: string[] | null;
  activities: string[] | null;
  essay_required: boolean;
  essay_prompts: string[] | null;
  source: string;
  verified: boolean;
}

export interface ScholarshipMatchResult {
  scholarship: ScholarshipRow;
  score: number;
  reasons: string[];
  blocked: boolean;
}

const SUBJECT_SYNONYMS: Record<string, string[]> = {
  stem: ["computer science", "engineering", "biology", "mathematics", "environmental science", "physics", "chemistry"],
  arts: ["art & design", "film & media", "english / literature"],
  business: ["business", "economics"],
  leadership: ["political science"],
  faith: [],
  military: [],
  vocational: [],
  agriculture: [],
  gaming: [],
};

function majorMatchesSubject(major: string | undefined, subject: string | null): boolean {
  if (!major || !subject) return false;
  const m = major.toLowerCase();
  const s = subject.toLowerCase();
  if (s === "any") return true;
  const bucket = SUBJECT_SYNONYMS[s] ?? [];
  return bucket.some((b) => m.includes(b) || b.includes(m));
}

export function scoreScholarship(
  profile: StudentProfile,
  s: ScholarshipRow
): ScholarshipMatchResult {
  const reasons: string[] = [];
  let score = 50;
  let blocked = false;

  if (s.min_gpa != null) {
    if (profile.gpa >= s.min_gpa) {
      reasons.push(`Meets GPA minimum (${s.min_gpa})`);
      score += 10;
    } else {
      blocked = true;
      reasons.push(`Below GPA minimum (${s.min_gpa})`);
    }
  }

  if (s.state && profile.stateResident) {
    if (s.state.toUpperCase() === profile.stateResident.toUpperCase()) {
      reasons.push(`Open to ${s.state} residents`);
      score += 25;
    } else {
      blocked = true;
      reasons.push(`Restricted to ${s.state}`);
    }
  } else if (!s.state) {
    score += 5;
  }

  if (s.majors && s.majors.length > 0 && profile.intendedMajor) {
    const m = profile.intendedMajor.toLowerCase();
    const hit = s.majors.some((x) => x.toLowerCase() === m || x.toLowerCase().includes(m));
    if (hit) {
      reasons.push(`Targets ${profile.intendedMajor} students`);
      score += 20;
    }
  } else if (majorMatchesSubject(profile.intendedMajor, s.subject)) {
    reasons.push(`Aligns with your major`);
    score += 10;
  }

  if (s.type === "federal" || s.type === "need-based") {
    if (profile.familyIncome < 75000) {
      reasons.push("Strong need-based fit");
      score += 15;
    }
  }

  if (s.amount_max != null && s.amount_max >= 10000) {
    reasons.push(`Up to $${s.amount_max.toLocaleString()}`);
    score += 5;
  }

  if (blocked) score = 0;
  score = Math.max(0, Math.min(100, score));

  return { scholarship: s, score, reasons, blocked };
}

export function rankScholarships(
  profile: StudentProfile,
  scholarships: ScholarshipRow[]
): ScholarshipMatchResult[] {
  return scholarships
    .map((s) => scoreScholarship(profile, s))
    .filter((r) => !r.blocked)
    .sort((a, b) => b.score - a.score);
}

export function parseAmount(text: string): { min: number | null; max: number | null } {
  const nums = text.match(/[\d,]+/g);
  if (!nums) return { min: null, max: null };
  const parsed = nums
    .map((n) => parseInt(n.replace(/,/g, ""), 10))
    .filter((n) => !isNaN(n) && n > 0);
  if (parsed.length === 0) return { min: null, max: null };
  return { min: Math.min(...parsed), max: Math.max(...parsed) };
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function parseDeadlineMonth(text: string): string | null {
  const lower = text.toLowerCase();
  for (const m of MONTHS) {
    if (lower.includes(m.toLowerCase())) return m;
  }
  return null;
}
