"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, GraduationCap } from "lucide-react";
import { COLLEGES_SEED } from "@/lib/colleges-seed";
import type { WizardData } from "@/lib/types";

/* ───────────── constants ───────────── */

const APPLICATION_YEARS = ["2026", "2027", "2028", "2029"];

const GPA_OPTIONS = [
  "4.0",
  "3.5–3.9",
  "3.0–3.4",
  "2.5–2.9",
  "Below 2.5",
  "Not sure yet",
];

const ACTIVITIES = [
  "Football",
  "Soccer",
  "Basketball",
  "Baseball",
  "Swimming",
  "Track & Field",
  "Volleyball",
  "Tennis",
  "Golf",
  "Wrestling",
  "Drama & Theater",
  "Band & Orchestra",
  "Choir",
  "Dance",
  "Visual Arts",
  "Photography",
  "Film & Video",
  "Podcasting",
  "Writing & Journalism",
  "Coding & Robotics",
  "Debate & Speech",
  "Math Olympiad",
  "Science Club",
  "Chess",
  "FFA & Agriculture",
  "Culinary Arts",
  "Fashion & Design",
  "Community Service",
  "Student Government",
  "Entrepreneurship",
  "Volunteering",
  "ROTC & Military",
  "Faith & Ministry",
  "Gaming & Esports",
];

const PRIORITIES = [
  "Maximum scholarship money",
  "Best program reputation",
  "Stay close to home",
  "Division I sports",
  "Research opportunities",
  "Strong internship pipeline",
  "Campus life & dorms",
  "Small class sizes",
  "Diversity & inclusion",
  "High graduation rate",
  "Community college route",
  "Online or hybrid options",
];

const BUDGET_OPTIONS = [
  "Under $15K",
  "$15K–$30K",
  "$30K–$50K",
  "$50K+",
  "Let scholarships decide",
];

const TOTAL_STEPS = 4;

/* ───────────── animation variants ───────────── */

const stepVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
  }),
};

/* ───────────── sub-components ───────────── */

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-2 mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
            i < step ? "bg-gold" : "bg-navy/10"
          }`}
        />
      ))}
    </div>
  );
}

function Pill({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-4 py-2 rounded-full font-body text-sm transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        selected
          ? "bg-gold text-navy border-gold font-medium"
          : "bg-white text-navy/70 border-card hover:border-gold/50"
      }`}
    >
      {label}
    </button>
  );
}

function Tag({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-md font-body text-sm transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        selected
          ? "bg-gold/15 text-navy border-gold font-medium"
          : "bg-white text-navy/60 border-card hover:border-gold/40"
      }`}
    >
      {label}
    </button>
  );
}

/* ───────────── main wizard ───────────── */

interface WizardProps {
  initialCollege?: string;
  initialMajor?: string;
  initialMode?: "college" | "league";
}

export function Wizard({
  initialCollege = "",
  initialMajor = "",
  initialMode = "league",
}: WizardProps) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const [form, setForm] = useState<WizardData>({
    college: initialCollege,
    major: initialMajor,
    minor: "",
    applicationYear: "",
    gpa: "",
    satScore: "",
    activities: [],
    otherSkills: "",
    priorities: [],
    budget: "",
    notes: "",
    mode: initialMode,
  });
  const [selectedMajors, setSelectedMajors] = useState<Set<string>>(
    initialMajor ? new Set([initialMajor]) : new Set()
  );

  // College autocomplete state
  const [collegeQuery, setCollegeQuery] = useState(initialCollege);
  const [collegeResolved, setCollegeResolved] = useState(!!initialCollege);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const collegeDropdownRef = useRef<HTMLDivElement>(null);

  const collegeMatches =
    collegeQuery.length >= 2
      ? COLLEGES_SEED.filter((c) =>
          c.name.toLowerCase().includes(collegeQuery.toLowerCase())
        ).slice(0, 8)
      : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        collegeDropdownRef.current &&
        !collegeDropdownRef.current.contains(e.target as Node)
      ) {
        setShowCollegeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* helpers */

  const update = useCallback(
    <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleInArray = useCallback(
    (key: "activities" | "priorities", value: string) => {
      setForm((prev) => {
        const arr = prev[key];
        return {
          ...prev,
          [key]: arr.includes(value)
            ? arr.filter((v) => v !== value)
            : [...arr, value],
        };
      });
    },
    [],
  );

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      // Clean up form before submitting
      const cleanedForm = {
        ...form,
        major: form.major.trim(),
        college: form.college.trim(),
      };

      // If college was typed but not resolved from our database, add a note
      if (
        cleanedForm.mode === "college" &&
        cleanedForm.college &&
        !collegeResolved
      ) {
        cleanedForm.notes = [
          cleanedForm.notes,
          `[Note: "${cleanedForm.college}" was typed manually and may not be the official name. Please interpret loosely and use the full official college name in the report.]`,
        ]
          .filter(Boolean)
          .join(" ");
      }

      const res = await fetch("/api/research/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedForm),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        setErrorMsg(result.error || `Server error (${res.status})`);
        setSubmitting(false);
        return;
      }
      // Redirect immediately — report generates in background
      router.push(`/results?searchId=${result.searchId}`);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  };

  /* shared input class */
  const inputCls =
    "w-full px-4 py-3 border border-card rounded-md font-body text-navy placeholder:text-navy/30 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors";

  /* ───── step renderers ───── */

  const QUICK_MAJORS = [
    "Nursing", "Computer Science", "Business", "Engineering", "Pre-Med",
    "Psychology", "Education", "Criminal Justice", "Data Science", "Marketing",
  ];

  const syncMajorFromPills = useCallback((pills: Set<string>) => {
    setForm((prev) => ({ ...prev, major: Array.from(pills).join(", ") }));
  }, []);

  const toggleMajorPill = (name: string) => {
    setSelectedMajors((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      syncMajorFromPills(next);
      return next;
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Mode cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            update("mode", "league");
            update("college", "");
            setCollegeQuery("");
            setCollegeResolved(false);
          }}
          className={`text-left p-6 rounded-lg transition-all duration-200 ${
            form.mode === "league"
              ? "border-2 border-gold bg-amber-50 shadow-sm"
              : "border border-gray-200 bg-white hover:shadow-md hover:border-gray-300"
          }`}
        >
          <Compass className={`w-8 h-8 mb-3 ${form.mode === "league" ? "text-gold" : "text-navy/40"}`} />
          <span className="font-body font-medium text-navy block text-sm">
            Help me find the right college
          </span>
          <span className="font-body text-xs text-navy/50 mt-1 block">
            We&apos;ll recommend the best colleges for your profile, budget and goals
          </span>
        </button>
        <button
          type="button"
          onClick={() => update("mode", "college")}
          className={`text-left p-6 rounded-lg transition-all duration-200 ${
            form.mode === "college"
              ? "border-2 border-gold bg-amber-50 shadow-sm"
              : "border border-gray-200 bg-white hover:shadow-md hover:border-gray-300"
          }`}
        >
          <GraduationCap className={`w-8 h-8 mb-3 ${form.mode === "college" ? "text-gold" : "text-navy/40"}`} />
          <span className="font-body font-medium text-navy block text-sm">
            I already have a college in mind
          </span>
          <span className="font-body text-xs text-navy/50 mt-1 block">
            Research a specific college in depth
          </span>
        </button>
      </div>

      {/* College input with autocomplete — only when "college" mode */}
      {form.mode === "college" && (
        <div>
          <label htmlFor="college" className="block text-sm font-body font-medium text-navy mb-1">
            Which college are you considering?
          </label>
          <div className="relative" ref={collegeDropdownRef}>
            <input
              id="college"
              type="text"
              value={collegeQuery}
              onChange={(e) => {
                const val = e.target.value;
                setCollegeQuery(val);
                update("college", val);
                setCollegeResolved(false);
                setShowCollegeDropdown(true);
              }}
              onFocus={() => {
                if (collegeQuery.length >= 2) setShowCollegeDropdown(true);
              }}
              placeholder="e.g. University of Texas at Austin"
              className={inputCls}
              autoComplete="off"
            />
            {showCollegeDropdown && collegeMatches.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {collegeMatches.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => {
                      setCollegeQuery(c.name);
                      update("college", c.name);
                      setCollegeResolved(true);
                      setShowCollegeDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 font-body text-sm text-navy hover:bg-cream transition-colors"
                  >
                    {c.name}
                    <span className="text-navy/40 ml-2 text-xs">
                      {c.location}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {collegeQuery.length >= 2 &&
            collegeMatches.length === 0 &&
            !collegeResolved && (
              <p className="text-xs font-body text-navy/40 mt-1">
                No exact match — no problem. We&apos;ll research this college for
                you.
              </p>
            )}
        </div>
      )}

      {/* Subject input with multi-select pills */}
      <div>
        <label htmlFor="major" className="block text-sm font-body font-medium text-navy mb-1">
          What subject(s) interest you?
        </label>
        <input
          id="major"
          type="text"
          value={form.major}
          onChange={(e) => {
            update("major", e.target.value);
            setSelectedMajors(new Set());
          }}
          placeholder="e.g. Computer Science, Nursing..."
          className={inputCls}
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_MAJORS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMajorPill(m)}
              className={`px-3 py-1 rounded-full text-xs font-body transition-all border ${
                selectedMajors.has(m)
                  ? "bg-gold/15 border-gold text-navy font-medium"
                  : "border-gray-200 text-navy/50 hover:border-gold/40"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={goNext}
        disabled={!form.major}
        className="w-full mt-2 px-8 py-4 text-lg bg-gold hover:bg-gold/90 text-navy font-body font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Let&apos;s go &rarr;
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-body font-medium text-navy mb-3">
          What year are they applying?
        </p>
        <div className="flex flex-wrap gap-2">
          {APPLICATION_YEARS.map((yr) => (
            <Pill
              key={yr}
              label={yr}
              selected={form.applicationYear === yr}
              onToggle={() =>
                update("applicationYear", form.applicationYear === yr ? "" : yr)
              }
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-body font-medium text-navy mb-3">
          Current GPA?
        </p>
        <div className="flex flex-wrap gap-2">
          {GPA_OPTIONS.map((g) => (
            <Pill
              key={g}
              label={g}
              selected={form.gpa === g}
              onToggle={() => update("gpa", form.gpa === g ? "" : g)}
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="sat" className="block text-sm font-body font-medium text-navy mb-1">
          SAT or ACT score?
        </label>
        <input
          id="sat"
          type="text"
          value={form.satScore ?? ""}
          onChange={(e) => update("satScore", e.target.value)}
          placeholder="Skip if not taken yet"
          className={inputCls}
        />
      </div>

      <button
        type="button"
        onClick={goNext}
        className="w-full mt-2 px-8 py-4 text-lg bg-gold hover:bg-gold/90 text-navy font-body font-medium rounded-md transition-all duration-200"
      >
        Keep going &rarr;
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <p className="text-sm font-body text-navy/60 mb-1">
        Pick everything that applies — every interest counts
      </p>
      <div className="flex flex-wrap gap-2">
        {ACTIVITIES.map((a) => (
          <Tag
            key={a}
            label={a}
            selected={form.activities.includes(a)}
            onToggle={() => toggleInArray("activities", a)}
          />
        ))}
      </div>

      <div>
        <label htmlFor="otherSkills" className="block text-sm font-body font-medium text-navy mb-1">
          Anything else? A hobby, a talent, a passion?
        </label>
        <input
          id="otherSkills"
          type="text"
          value={form.otherSkills ?? ""}
          onChange={(e) => update("otherSkills", e.target.value)}
          placeholder="e.g. Plays cello, builds drones, speaks Mandarin"
          className={inputCls}
        />
      </div>

      <button
        type="button"
        onClick={goNext}
        className="w-full mt-2 px-8 py-4 text-lg bg-gold hover:bg-gold/90 text-navy font-body font-medium rounded-md transition-all duration-200"
      >
        Nearly there &rarr;
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-body font-medium text-navy mb-3">
          What matters most?
        </p>
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map((p) => (
            <Tag
              key={p}
              label={p}
              selected={form.priorities.includes(p)}
              onToggle={() => toggleInArray("priorities", p)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-body font-medium text-navy mb-3">
          Budget per year?
        </p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((b) => (
            <Pill
              key={b}
              label={b}
              selected={form.budget === b}
              onToggle={() => update("budget", form.budget === b ? "" : b)}
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-body font-medium text-navy mb-1">
          Anything else we should know?
        </label>
        <input
          id="notes"
          type="text"
          value={form.notes ?? ""}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="First-generation student, military family, transferring — anything helpful"
          className={inputCls}
        />
      </div>

      {errorMsg && (
        <div className="p-4 rounded-md bg-crimson/10 border border-crimson/20">
          <p className="text-sm font-body text-crimson">{errorMsg}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full mt-2 px-8 py-5 text-lg bg-gold hover:bg-gold/90 text-navy font-body font-bold rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Building your report \u2014 this takes about 60 seconds..." : "Build my college report \u2192"}
      </button>
    </div>
  );

  const STEP_TITLES: Record<number, string> = {
    1: "Let\u2019s start with the basics",
    2: "Academic profile",
    3: "Activities & interests",
    4: "What matters most",
  };

  const RENDERERS: Record<number, () => React.JSX.Element> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
  };

  if (submitting) {
    return <LoadingScreen />;
  }

  return (
    <div className="ktc-card p-8 md:p-10 max-w-2xl mx-auto">
      <ProgressBar step={step} />

      {/* back button */}
      {step > 1 && (
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-navy/50 hover:text-navy font-body mb-4 transition-colors"
        >
          <span aria-hidden="true">&larr;</span> Back
        </button>
      )}

      <h3 className="font-display text-2xl font-bold text-navy mb-1">
        {STEP_TITLES[step]}
      </h3>
      <p className="text-navy/50 font-body text-sm mb-6">
        Step {step} of {TOTAL_STEPS}
      </p>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {RENDERERS[step]()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 90;
        }
        return prev + 1.5;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="ktc-card p-8 md:p-10 max-w-2xl mx-auto text-center py-16">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-8" />

      <h3 className="font-display text-2xl font-bold text-navy mb-3">
        Building your college report...
      </h3>

      <p className="font-body text-navy/60 max-w-md mx-auto mb-8">
        Our AI is researching scholarships, admissions data, and building your
        personal playbook. This typically takes 60–90 seconds — please keep
        this page open.
      </p>

      <div className="max-w-xs mx-auto">
        <div className="h-2 bg-navy/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-mono-label text-xs text-navy/30 mt-2">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
