"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { submitSearch } from "@/app/actions/research";
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
  initialMode = "college",
}: WizardProps) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showMinor, setShowMinor] = useState(false);

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
      const result = await submitSearch(form);
      if ("error" in result) {
        setErrorMsg(result.error);
        setSubmitting(false);
        return;
      }
      router.push(`/results?id=${result.resultId}`);
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

  const renderStep1 = () => (
    <div className="space-y-5">
      <div>
        <label htmlFor="college" className="block text-sm font-body font-medium text-navy mb-1">
          Which college are you thinking about?
        </label>
        <input
          id="college"
          type="text"
          value={form.college}
          onChange={(e) => update("college", e.target.value)}
          placeholder="e.g. University of Michigan"
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => {
            update("college", "");
            update("mode", "league");
          }}
          className="text-xs text-gold hover:text-gold/80 mt-1 font-body"
        >
          Not sure yet? Find the best colleges for your subject instead
        </button>
      </div>

      <div>
        <label htmlFor="major" className="block text-sm font-body font-medium text-navy mb-1">
          What does your kid want to study?
        </label>
        <input
          id="major"
          type="text"
          value={form.major}
          onChange={(e) => update("major", e.target.value)}
          placeholder="e.g. Computer Science, Nursing, Business"
          className={inputCls}
        />
      </div>

      {!showMinor ? (
        <button
          type="button"
          onClick={() => setShowMinor(true)}
          className="text-xs text-navy/50 hover:text-navy/70 font-body underline underline-offset-2"
        >
          + Second major or minor?
        </button>
      ) : (
        <div>
          <label htmlFor="minor" className="block text-sm font-body font-medium text-navy mb-1">
            Second major or minor
          </label>
          <input
            id="minor"
            type="text"
            value={form.minor ?? ""}
            onChange={(e) => update("minor", e.target.value)}
            placeholder="e.g. Psychology, Data Science"
            className={inputCls}
          />
        </div>
      )}

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
    2: "About your student",
    3: "What makes your kid them",
    4: "What matters most",
  };

  const RENDERERS: Record<number, () => React.JSX.Element> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
  };

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
