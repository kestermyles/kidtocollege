"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import {
  calculateFitScore,
  rankColleges,
  type MatchableCollege,
  type MatchResult,
  type StudentProfile,
} from "@/lib/college-matching";

type Bucket = "safety" | "target" | "reach";

const COLLEGE_COLUMNS = [
  "slug",
  "name",
  "location",
  "state",
  "acceptance_rate",
  "avg_cost_instate",
  "avg_cost_outstate",
  "graduation_rate",
  "total_enrollment",
  "programs",
  "campus_setting",
  "median_earnings_6yr",
  "avg_grant_percentage",
  "meets_full_need",
  "merit_aid_available",
  "no_loan_threshold",
].join(", ");

const DEFAULT_PROFILE: StudentProfile = {
  gpa: 3.5,
  satScore: 1250,
  intendedMajor: "",
  stateResident: "",
  familyIncome: 85000,
  assets: 20000,
  numInHousehold: 4,
  numInCollege: 1,
  maxNetPrice: 25000,
  preferredSettings: [],
  preferredSize: [],
  preferredStates: [],
};

const BUCKET_COLORS: Record<Bucket, string> = {
  safety: "bg-emerald-100 text-emerald-800 border-emerald-200",
  target: "bg-gold/20 text-navy border-gold/40",
  reach: "bg-rose-100 text-rose-800 border-rose-200",
};

function formatUSD(n: number | null | undefined): string {
  if (n == null) return "—";
  return "$" + Math.round(n).toLocaleString();
}

export default function MatchesClient() {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [colleges, setColleges] = useState<MatchableCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [bucketFilter, setBucketFilter] = useState<Bucket | "all">("all");
  const [onlyProgramMatch, setOnlyProgramMatch] = useState(false);

  const loadProfile = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: goals } = await supabase
      .from("student_goals")
      .select("current_gpa, sat_score, act_score, intended_major")
      .eq("user_id", user.id)
      .maybeSingle();

    if (goals) {
      setProfile((p) => ({
        ...p,
        gpa: goals.current_gpa ?? p.gpa,
        satScore: goals.sat_score ?? p.satScore,
        actScore: goals.act_score ?? p.actScore,
        intendedMajor: goals.intended_major ?? p.intendedMajor,
      }));
    }
  }, []);

  const loadColleges = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("colleges")
      .select(COLLEGE_COLUMNS)
      .not("acceptance_rate", "is", null)
      .limit(400);
    setColleges((data as unknown as MatchableCollege[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();
    loadColleges();
  }, [loadProfile, loadColleges]);

  const ranked: MatchResult[] = useMemo(() => {
    if (!colleges.length) return [];
    return rankColleges(profile, colleges, {
      requireProgramMatch: onlyProgramMatch,
      buckets: bucketFilter === "all" ? undefined : [bucketFilter],
      limit: 60,
    });
  }, [profile, colleges, onlyProgramMatch, bucketFilter]);

  const counts = useMemo(() => {
    const all = colleges.map((c) => calculateFitScore(profile, c));
    return {
      safety: all.filter((r) => r.bucket === "safety").length,
      target: all.filter((r) => r.bucket === "target").length,
      reach: all.filter((r) => r.bucket === "reach").length,
    };
  }, [profile, colleges]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="font-mono-label text-xs uppercase tracking-wider text-gold">
            Your Matches
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-2 mb-2">
            Colleges ranked for <span className="italic text-gold">you</span>
          </h1>
          <p className="font-body text-navy/60 max-w-2xl">
            Financial fit (40%), admission odds (30%), program match (20%), and culture fit (10%). No generic rankings.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <Panel title="Your profile">
              <NumberField label="GPA" step={0.01} max={4} min={0} value={profile.gpa} onChange={(v) => setProfile({ ...profile, gpa: v })} />
              <NumberField label="SAT" step={10} max={1600} min={400} value={profile.satScore ?? 0} onChange={(v) => setProfile({ ...profile, satScore: v || undefined })} />
              <TextField label="Intended major" value={profile.intendedMajor ?? ""} onChange={(v) => setProfile({ ...profile, intendedMajor: v })} placeholder="e.g. Computer Science" />
              <TextField label="Home state" value={profile.stateResident ?? ""} onChange={(v) => setProfile({ ...profile, stateResident: v.toUpperCase().slice(0, 2) })} placeholder="CA" />
            </Panel>

            <Panel title="Your budget">
              <NumberField label="Max net price / yr" step={1000} value={profile.maxNetPrice ?? 0} onChange={(v) => setProfile({ ...profile, maxNetPrice: v })} />
              <NumberField label="Family income" step={1000} value={profile.familyIncome} onChange={(v) => setProfile({ ...profile, familyIncome: v })} />
              <NumberField label="Assets" step={1000} value={profile.assets} onChange={(v) => setProfile({ ...profile, assets: v })} />
              <NumberField label="Household size" step={1} min={1} value={profile.numInHousehold} onChange={(v) => setProfile({ ...profile, numInHousehold: v })} />
            </Panel>

            <Panel title="Filters">
              <label className="flex items-center gap-2 text-sm font-body text-navy">
                <input
                  type="checkbox"
                  checked={onlyProgramMatch}
                  onChange={(e) => setOnlyProgramMatch(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Only schools offering my major
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["all", "safety", "target", "reach"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBucketFilter(b)}
                    className={`px-3 py-1 rounded-full text-xs font-body border capitalize transition-colors ${
                      bucketFilter === b
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-navy/60 border-gray-200 hover:border-navy/40"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Portfolio balance">
              <div className="grid grid-cols-3 text-center">
                <Stat label="Safety" value={counts.safety} />
                <Stat label="Target" value={counts.target} />
                <Stat label="Reach" value={counts.reach} />
              </div>
            </Panel>
          </aside>

          {/* Results */}
          <main>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
              </div>
            ) : ranked.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
                <p className="font-body text-navy/60 mb-2">No matches yet.</p>
                <p className="font-body text-navy/40 text-sm">Try loosening your filters or lowering your budget constraint.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ranked.map((r) => (
                    <MatchCard key={r.college.slug} result={r} />
                  ))}
                </div>
                <Link
                  href="/my-chances"
                  className="block mt-8 p-4 rounded-lg bg-gold/10 border border-gold/30 hover:border-gold transition-colors"
                >
                  <p className="font-body text-sm font-semibold text-navy">Need tips on a specific college?</p>
                  <p className="font-body text-xs text-navy/60 mt-0.5">
                    My Chances gives AI-driven admission tips for one school at a time &rarr;
                  </p>
                </Link>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ktc-card p-5">
      <h3 className="font-display text-sm font-bold text-navy mb-4 uppercase tracking-wide">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-body text-navy/60 mb-1">{label}</span>
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        step={step}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60"
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-body text-navy/60 mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-mono-label text-gold text-xl font-bold">{value}</div>
      <div className="text-xs font-body text-navy/50">{label}</div>
    </div>
  );
}

function MatchCard({ result }: { result: MatchResult }) {
  const { college, fitScore, breakdown, estimatedNetPrice, admissionChance, bucket, reasons } = result;
  return (
    <Link
      href={`/college/${college.slug}`}
      className="ktc-card p-5 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="font-display text-base font-bold text-navy group-hover:text-gold transition-colors leading-tight">
            {college.name}
          </h3>
          <p className="font-body text-xs text-navy/50 mt-0.5">{college.location}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono-label text-2xl font-bold text-gold leading-none">{fitScore}</div>
          <div className="text-[10px] font-body uppercase tracking-wider text-navy/40">fit</div>
        </div>
      </div>

      <span className={`inline-block text-xs font-body font-medium px-2 py-0.5 rounded-full border capitalize mb-3 ${BUCKET_COLORS[bucket]}`}>
        {bucket} · {Math.round(admissionChance * 100)}% chance
      </span>

      <div className="grid grid-cols-4 gap-1 mb-3">
        <ScoreBar label="$" value={breakdown.financial} />
        <ScoreBar label="GPA" value={breakdown.academic} />
        <ScoreBar label="Maj" value={breakdown.program} />
        <ScoreBar label="Cul" value={breakdown.culture} />
      </div>

      <div className="flex items-center justify-between text-xs font-body text-navy/60 mb-3">
        <span>Est. net price <span className="font-medium text-navy">{formatUSD(estimatedNetPrice)}</span>/yr</span>
        {college.graduation_rate != null && (
          <span>Grad rate <span className="font-medium text-navy">{college.graduation_rate}%</span></span>
        )}
      </div>

      {reasons.length > 0 && (
        <ul className="flex flex-wrap gap-1">
          {reasons.slice(0, 3).map((r) => (
            <li key={r} className="text-[11px] font-body text-navy/60 bg-card/60 rounded px-2 py-0.5">
              {r}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 75 ? "bg-emerald-500" : value >= 50 ? "bg-gold" : value >= 25 ? "bg-orange-400" : "bg-rose-400";
  return (
    <div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${Math.max(4, value)}%` }} />
      </div>
      <div className="text-[10px] font-body text-navy/40 mt-0.5 text-center">{label}</div>
    </div>
  );
}
