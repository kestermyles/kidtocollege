// Inline net-price approximation. The fuller `./npc-calculator` module is
// WIP locally and not yet committed — this fallback keeps the build green
// until it lands.
interface CollegeAidProfile {
  costOfAttendance: number;
  avgGrantPercentage: number;
  meetsFullNeed: boolean;
  meritAidAvailable: boolean;
  noLoanThreshold?: number;
}
interface NPCInput {
  familyIncome: number;
  assets: number;
  gpa: number;
  satScore?: number;
  numInHousehold: number;
  numInCollege: number;
  stateResident?: string;
}
function simulateNPC(input: NPCInput, aid: CollegeAidProfile): { netPrice: number } {
  const sticker = aid.costOfAttendance;
  const grantPct = Math.max(0, Math.min(80, aid.avgGrantPercentage)) / 100;
  const needBased = sticker * grantPct;
  const incomeTilt = input.familyIncome < 60000 ? 0.2 : input.familyIncome < 120000 ? 0.1 : 0;
  const meritBoost = aid.meritAidAvailable && input.gpa >= 3.7 ? 0.08 : 0;
  const totalAid = Math.min(sticker, needBased + sticker * (incomeTilt + meritBoost));
  return { netPrice: Math.max(0, Math.round(sticker - totalAid)) };
}

export interface StudentProfile {
  gpa: number;
  satScore?: number;
  actScore?: number;
  intendedMajor?: string;
  stateResident?: string;

  familyIncome: number;
  assets: number;
  numInHousehold: number;
  numInCollege: number;
  maxNetPrice?: number;

  preferredSettings?: string[];
  preferredSize?: ("small" | "medium" | "large")[];
  preferredStates?: string[];
}

export interface MatchableCollege {
  slug: string;
  name: string;
  location: string;
  state: string;
  acceptance_rate: number | null;
  avg_cost_instate: number | null;
  avg_cost_outstate: number | null;
  graduation_rate: number | null;
  total_enrollment: number | null;
  programs: string[] | null;
  campus_setting?: string[] | null;
  median_earnings_6yr?: number | null;
  avg_grant_percentage?: number | null;
  meets_full_need?: boolean | null;
  merit_aid_available?: boolean | null;
  no_loan_threshold?: number | null;
}

export interface ScoreBreakdown {
  financial: number;
  academic: number;
  program: number;
  culture: number;
}

export interface MatchResult {
  college: MatchableCollege;
  fitScore: number;
  breakdown: ScoreBreakdown;
  estimatedNetPrice: number | null;
  admissionChance: number;
  bucket: "safety" | "target" | "reach";
  programMatched: boolean;
  reasons: string[];
}

export const WEIGHTS = {
  financial: 40,
  academic: 30,
  program: 20,
  culture: 10,
} as const;

function normalizedSAT(profile: StudentProfile): number | undefined {
  if (profile.satScore) return profile.satScore;
  if (profile.actScore) return Math.round(profile.actScore * 40 + 160);
  return undefined;
}

export function calculateAdmissionChance(
  profile: StudentProfile,
  college: MatchableCollege
): number {
  const accept = college.acceptance_rate;
  if (accept == null) return 0.5;

  const acceptPct = accept > 1 ? accept / 100 : accept;

  const sat = normalizedSAT(profile);
  const satStrength = sat ? Math.max(0, Math.min(1, (sat - 1000) / 600)) : 0.5;
  const gpaStrength = Math.max(0, Math.min(1, (profile.gpa - 2.5) / 1.5));
  const studentStrength = (satStrength + gpaStrength) / 2;

  const selectivity = 1 - acceptPct;
  const adjusted = acceptPct + (studentStrength - 0.5) * selectivity;

  return Math.max(0.02, Math.min(0.98, adjusted));
}

function bucketFromChance(chance: number): "safety" | "target" | "reach" {
  if (chance >= 0.7) return "safety";
  if (chance >= 0.3) return "target";
  return "reach";
}

function getSticker(profile: StudentProfile, college: MatchableCollege): number | null {
  const inState =
    profile.stateResident &&
    college.state &&
    profile.stateResident.toUpperCase() === college.state.toUpperCase();
  if (inState && college.avg_cost_instate != null) return college.avg_cost_instate;
  return college.avg_cost_outstate ?? college.avg_cost_instate;
}

function toAidProfile(profile: StudentProfile, college: MatchableCollege): CollegeAidProfile | null {
  const sticker = getSticker(profile, college);
  if (sticker == null) return null;
  return {
    costOfAttendance: sticker,
    avgGrantPercentage: college.avg_grant_percentage ?? 40,
    meetsFullNeed: college.meets_full_need ?? false,
    meritAidAvailable: college.merit_aid_available ?? true,
    noLoanThreshold: college.no_loan_threshold ?? undefined,
  };
}

function scoreFinancial(
  profile: StudentProfile,
  college: MatchableCollege
): { score: number; netPrice: number | null } {
  const aidProfile = toAidProfile(profile, college);
  if (!aidProfile) return { score: 50, netPrice: null };

  const npcInput: NPCInput = {
    familyIncome: profile.familyIncome,
    assets: profile.assets,
    gpa: profile.gpa,
    satScore: profile.satScore,
    numInHousehold: profile.numInHousehold,
    numInCollege: profile.numInCollege,
    stateResident: profile.stateResident,
  };
  const npc = simulateNPC(npcInput, aidProfile);

  const budget = profile.maxNetPrice;
  let score: number;
  if (budget && budget > 0) {
    score = npc.netPrice <= budget ? 100 : Math.max(0, 100 * (budget / npc.netPrice));
  } else {
    const ratio = npc.netPrice / aidProfile.costOfAttendance;
    score = Math.max(0, Math.min(100, 100 * (1 - ratio * 0.9)));
  }
  return { score, netPrice: npc.netPrice };
}

function scoreAcademic(profile: StudentProfile, college: MatchableCollege): number {
  const chance = calculateAdmissionChance(profile, college);
  const fitDistance = Math.abs(chance - 0.5);
  const shape = 1 - fitDistance * 0.8;
  return Math.round(shape * 100);
}

function scoreProgram(profile: StudentProfile, college: MatchableCollege): { score: number; matched: boolean } {
  const target = profile.intendedMajor?.trim().toLowerCase();
  if (!target) return { score: 60, matched: false };
  const programs = (college.programs ?? []).map((p) => p.toLowerCase());
  if (programs.length === 0) return { score: 50, matched: false };
  const exact = programs.some((p) => p === target);
  if (exact) return { score: 100, matched: true };
  const partial = programs.some((p) => p.includes(target) || target.includes(p));
  return partial ? { score: 80, matched: true } : { score: 20, matched: false };
}

function scoreCulture(profile: StudentProfile, college: MatchableCollege): number {
  let score = 60;
  let applied = 0;

  if (profile.preferredStates?.length) {
    applied++;
    if (profile.preferredStates.map((s) => s.toUpperCase()).includes(college.state.toUpperCase())) {
      score += 20;
    } else {
      score -= 10;
    }
  }

  if (profile.preferredSettings?.length && college.campus_setting?.length) {
    applied++;
    const overlap = college.campus_setting.some((cs) =>
      profile.preferredSettings!.some((ps) => ps.toLowerCase() === cs.toLowerCase())
    );
    score += overlap ? 20 : -10;
  }

  if (profile.preferredSize?.length && college.total_enrollment != null) {
    applied++;
    const size =
      college.total_enrollment < 5000
        ? "small"
        : college.total_enrollment < 15000
          ? "medium"
          : "large";
    score += profile.preferredSize.includes(size) ? 20 : -10;
  }

  if (applied === 0) return 60;
  return Math.max(0, Math.min(100, score));
}

export function calculateFitScore(
  profile: StudentProfile,
  college: MatchableCollege
): MatchResult {
  const financial = scoreFinancial(profile, college);
  const academic = scoreAcademic(profile, college);
  const program = scoreProgram(profile, college);
  const culture = scoreCulture(profile, college);

  const breakdown: ScoreBreakdown = {
    financial: Math.round(financial.score),
    academic,
    program: program.score,
    culture,
  };

  const fitScore = Math.round(
    (breakdown.financial * WEIGHTS.financial +
      breakdown.academic * WEIGHTS.academic +
      breakdown.program * WEIGHTS.program +
      breakdown.culture * WEIGHTS.culture) /
      100
  );

  const chance = calculateAdmissionChance(profile, college);
  const bucket = bucketFromChance(chance);

  const reasons: string[] = [];
  if (breakdown.financial >= 80) reasons.push("Strong financial fit");
  else if (breakdown.financial < 40) reasons.push("Likely over budget");
  if (program.matched) reasons.push(`Offers ${profile.intendedMajor}`);
  if (bucket === "safety") reasons.push("Safety school");
  else if (bucket === "reach") reasons.push("Reach school");
  if (college.meets_full_need) reasons.push("Meets 100% of demonstrated need");
  if (
    college.no_loan_threshold &&
    profile.familyIncome < college.no_loan_threshold
  ) {
    reasons.push("No-loan aid policy");
  }

  return {
    college,
    fitScore,
    breakdown,
    estimatedNetPrice: financial.netPrice,
    admissionChance: chance,
    bucket,
    programMatched: program.matched,
    reasons,
  };
}

export interface RankOptions {
  limit?: number;
  minScore?: number;
  requireProgramMatch?: boolean;
  buckets?: ("safety" | "target" | "reach")[];
}

export function rankColleges(
  profile: StudentProfile,
  colleges: MatchableCollege[],
  opts: RankOptions = {}
): MatchResult[] {
  const results = colleges
    .map((c) => calculateFitScore(profile, c))
    .filter((r) => (opts.minScore == null ? true : r.fitScore >= opts.minScore))
    .filter((r) => (opts.requireProgramMatch ? r.programMatched : true))
    .filter((r) => (opts.buckets?.length ? opts.buckets.includes(r.bucket) : true))
    .sort((a, b) => b.fitScore - a.fitScore);
  return opts.limit ? results.slice(0, opts.limit) : results;
}

export function balancedList(
  profile: StudentProfile,
  colleges: MatchableCollege[],
  counts: { safety: number; target: number; reach: number } = { safety: 3, target: 4, reach: 3 }
): MatchResult[] {
  const ranked = rankColleges(profile, colleges);
  const pick = (bucket: "safety" | "target" | "reach", n: number) =>
    ranked.filter((r) => r.bucket === bucket).slice(0, n);
  return [...pick("safety", counts.safety), ...pick("target", counts.target), ...pick("reach", counts.reach)];
}
