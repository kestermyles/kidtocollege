"use client";

import { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StudyPlan {
  score_gap: number;
  weeks_available: number;
  weekly_study_plan: { week: number; focus: string; tasks: string[]; hours: number }[];
  weak_area_resources: { area: string; khan_academy_url: string; description: string; estimated_hours: number }[];
  score_prediction: { conservative: number; realistic: number; optimistic: number };
  key_tips: string[];
  milestone_checkpoints: { week: number; target_score: number; assessment: string }[];
}

interface ScoreEntry {
  date: string;
  score: number;
  type: string;
}

const SAT_WEAK = ["Reading Comprehension", "Writing & Grammar", "Math No Calculator", "Math Calculator"];
const ACT_WEAK = ["English", "Math", "Reading", "Science", "Writing"];
const GRADES = ["A", "B", "C", "D", "Struggling"];

const selectCls =
  "w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white";
const inputCls =
  "w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TestPrepPlanner() {
  // Diagnostic inputs
  const [psatScore, setPsatScore] = useState("");
  const [currentScore, setCurrentScore] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [testDate, setTestDate] = useState("3 months");
  const [mathGrade, setMathGrade] = useState("");
  const [readingGrade, setReadingGrade] = useState("");
  const [writingGrade, setWritingGrade] = useState("");
  const [weakAreas, setWeakAreas] = useState<Set<string>>(new Set());
  const [studyHours, setStudyHours] = useState("3-5hrs");

  // Plan & loading
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Score tracker
  const [scoreLog, setScoreLog] = useState<ScoreEntry[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newScore, setNewScore] = useState("");
  const [newType, setNewType] = useState("SAT");

  // PSAT auto-calculate
  const handlePsatChange = (val: string) => {
    setPsatScore(val);
    const num = parseInt(val, 10);
    if (num >= 320 && num <= 1520) {
      const predicted = Math.min(Math.round(num * 1.05), 1600);
      setCurrentScore(String(predicted));
    }
  };

  const toggleWeak = (area: string) => {
    setWeakAreas((prev) => {
      const next = new Set(prev);
      if (next.has(area)) next.delete(area);
      else next.add(area);
      return next;
    });
  };

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/coach/test-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          psatScore,
          currentScore,
          targetScore,
          testDate,
          mathGrade,
          readingGrade,
          writingGrade,
          weakAreas: Array.from(weakAreas),
          studyHours,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const addScoreEntry = () => {
    if (!newDate || !newScore) return;
    setScoreLog((prev) => [
      ...prev,
      { date: newDate, score: parseInt(newScore, 10), type: newType },
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewDate("");
    setNewScore("");
  };

  // ===================== DIAGNOSTIC FORM =====================
  if (!plan) {
    return (
      <div className="space-y-8">
        {/* Score inputs */}
        <div className="ktc-card p-6">
          <h3 className="font-display text-lg font-bold text-navy mb-4">Your scores</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                PSAT score (optional)
              </label>
              <input
                type="number"
                min={320}
                max={1520}
                value={psatScore}
                onChange={(e) => handlePsatChange(e.target.value)}
                placeholder="320–1520"
                className={inputCls}
              />
              {psatScore && parseInt(psatScore, 10) >= 320 && (
                <p className="text-xs text-sage font-body mt-1">
                  Predicted SAT: ~{Math.min(Math.round(parseInt(psatScore, 10) * 1.05), 1600)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                Current SAT score
              </label>
              <input
                type="number"
                min={400}
                max={1600}
                value={currentScore}
                onChange={(e) => setCurrentScore(e.target.value)}
                placeholder="400–1600 or leave blank"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                Target SAT score
              </label>
              <input
                type="number"
                min={400}
                max={1600}
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                placeholder="e.g. 1300"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                Test date
              </label>
              <select value={testDate} onChange={(e) => setTestDate(e.target.value)} className={selectCls}>
                <option value="1 month">1 month away</option>
                <option value="2 months">2 months away</option>
                <option value="3 months">3 months away</option>
                <option value="6 months">6 months away</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-navy/40 font-body mt-3">
            Your PSAT score is the most accurate predictor of your SAT starting point.
          </p>
        </div>

        {/* School grades */}
        <div className="ktc-card p-6">
          <h3 className="font-display text-lg font-bold text-navy mb-4">School performance</h3>
          <p className="font-body text-sm text-navy/50 mb-4">How are you doing in these subjects at school?</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Math", val: mathGrade, set: setMathGrade },
              { label: "Reading / English", val: readingGrade, set: setReadingGrade },
              { label: "Writing", val: writingGrade, set: setWritingGrade },
            ].map((item) => (
              <div key={item.label}>
                <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
                  {item.label}
                </label>
                <select value={item.val} onChange={(e) => item.set(e.target.value)} className={selectCls}>
                  <option value="">Select...</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Weak areas */}
        <div className="ktc-card p-6">
          <h3 className="font-display text-lg font-bold text-navy mb-4">Weak areas</h3>
          <p className="font-body text-sm text-navy/50 mb-4">Select all that apply</p>
          <div className="mb-4">
            <p className="font-mono-label text-xs text-navy/40 uppercase tracking-wider mb-2">SAT sections</p>
            <div className="flex flex-wrap gap-2">
              {SAT_WEAK.map((area) => (
                <label
                  key={area}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-body cursor-pointer transition-all border ${
                    weakAreas.has(area)
                      ? "bg-gold/15 border-gold text-navy font-medium"
                      : "bg-white border-gray-200 text-navy/60 hover:border-gold/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={weakAreas.has(area)}
                    onChange={() => toggleWeak(area)}
                    className="sr-only"
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono-label text-xs text-navy/40 uppercase tracking-wider mb-2">ACT sections</p>
            <div className="flex flex-wrap gap-2">
              {ACT_WEAK.map((area) => (
                <label
                  key={area}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-body cursor-pointer transition-all border ${
                    weakAreas.has(area)
                      ? "bg-gold/15 border-gold text-navy font-medium"
                      : "bg-white border-gray-200 text-navy/60 hover:border-gold/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={weakAreas.has(area)}
                    onChange={() => toggleWeak(area)}
                    className="sr-only"
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Study hours */}
        <div className="ktc-card p-6">
          <h3 className="font-display text-lg font-bold text-navy mb-4">Study hours per week</h3>
          <div className="flex flex-wrap gap-2">
            {["1-3hrs", "3-5hrs", "5-10hrs", "10+hrs"].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setStudyHours(h)}
                className={`px-4 py-2 rounded-md font-body text-sm transition-all border ${
                  studyHours === h
                    ? "bg-gold/15 border-gold text-navy font-medium"
                    : "border-gray-200 text-navy/50 hover:border-gold/40"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        {error && (
          <div className="p-4 rounded-md bg-crimson/10 border border-crimson/20">
            <p className="text-sm font-body text-crimson">{error}</p>
          </div>
        )}

        <button
          onClick={generatePlan}
          disabled={loading}
          className="w-full px-8 py-4 bg-gold hover:bg-gold/90 text-navy font-body font-medium rounded-md text-lg transition-all disabled:opacity-50"
        >
          {loading ? "Building your study plan..." : "Build my study plan"}
        </button>
      </div>
    );
  }

  // ===================== PLAN DISPLAY =====================
  return (
    <div className="space-y-8">
      {/* Score gap bar */}
      <div className="ktc-card p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-mono-label text-xs text-navy/40 uppercase tracking-wider">Current</p>
            <p className="font-display text-2xl font-bold text-navy">{currentScore || "—"}</p>
          </div>
          <div className="flex-1 mx-6">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gold rounded-full transition-all duration-1000"
                style={{
                  width: `${
                    currentScore && targetScore
                      ? Math.min(
                          ((parseInt(currentScore, 10) - 400) / (parseInt(targetScore, 10) - 400)) * 100,
                          100
                        )
                      : 30
                  }%`,
                }}
              />
            </div>
            <p className="text-center font-mono-label text-xs text-navy/40 mt-1">
              Gap: {plan.score_gap} points &middot; {plan.weeks_available} weeks
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono-label text-xs text-navy/40 uppercase tracking-wider">Target</p>
            <p className="font-display text-2xl font-bold text-gold">{targetScore || "—"}</p>
          </div>
        </div>
      </div>

      {/* Score predictions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Conservative", val: plan.score_prediction.conservative, color: "text-navy/70" },
          { label: "Realistic", val: plan.score_prediction.realistic, color: "text-gold" },
          { label: "Optimistic", val: plan.score_prediction.optimistic, color: "text-sage" },
        ].map((p) => (
          <div key={p.label} className="ktc-card p-4 text-center">
            <p className="font-mono-label text-[10px] text-navy/40 uppercase tracking-wider">{p.label}</p>
            <p className={`font-display text-2xl font-bold ${p.color}`}>{p.val}</p>
          </div>
        ))}
      </div>

      {/* Key tips */}
      {plan.key_tips.length > 0 && (
        <div className="ktc-card p-6">
          <h3 className="font-display text-lg font-bold text-navy mb-3">Key tips</h3>
          <ul className="space-y-2">
            {plan.key_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                <span className="font-body text-sm text-navy/70">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weekly study plan */}
      <div className="ktc-card p-6">
        <h3 className="font-display text-lg font-bold text-navy mb-6">Week-by-week plan</h3>
        <div className="space-y-0">
          {plan.weekly_study_plan.map((week, i) => (
            <div key={i} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center flex-shrink-0">
                  <span className="font-mono-label text-xs text-gold font-bold">{week.week}</span>
                </div>
                {i < plan.weekly_study_plan.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                )}
              </div>
              {/* Content */}
              <div className="pb-6 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-body text-sm font-medium text-navy">{week.focus}</h4>
                  <span className="font-mono-label text-[10px] text-navy/40">{week.hours}h</span>
                </div>
                <ul className="space-y-1">
                  {week.tasks.map((task, j) => (
                    <li key={j} className="font-body text-xs text-navy/60 pl-2 border-l border-gray-200">
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak area resources */}
      {plan.weak_area_resources.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-bold text-navy mb-4">Resources for your weak areas</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {plan.weak_area_resources.map((r, i) => (
              <div key={i} className="ktc-card p-5">
                <h4 className="font-body text-sm font-medium text-navy mb-1">{r.area}</h4>
                <p className="font-body text-xs text-navy/60 mb-3">{r.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono-label text-[10px] text-navy/40">{r.estimated_hours}h estimated</span>
                  <a
                    href={r.khan_academy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs text-gold hover:text-gold/80 font-medium"
                  >
                    Start on Khan Academy &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestone checkpoints */}
      {plan.milestone_checkpoints.length > 0 && (
        <div className="ktc-card p-6">
          <h3 className="font-display text-lg font-bold text-navy mb-4">Milestone checkpoints</h3>
          <div className="space-y-3">
            {plan.milestone_checkpoints.map((m, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-cream rounded-lg">
                <span className="font-mono-label text-xs text-gold font-bold min-w-[60px]">
                  Week {m.week}
                </span>
                <div className="flex-1">
                  <p className="font-body text-sm text-navy">{m.assessment}</p>
                </div>
                <span className="font-display text-lg font-bold text-navy">{m.target_score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Khan Academy CTA */}
      <div className="border-2 border-gold rounded-lg p-6 bg-amber-50">
        <h3 className="font-display text-lg font-bold text-navy mb-2">
          Get your official diagnostic
        </h3>
        <p className="font-body text-sm text-navy/60 mb-4">
          Khan Academy&apos;s free SAT prep (built with College Board) will pinpoint your exact
          weak areas in 45 minutes. Come back and update your scores here as you improve.
        </p>
        <a
          href="https://www.khanacademy.org/sat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors"
        >
          Start official diagnostic &rarr;
        </a>
      </div>

      {/* Score tracker */}
      <div className="ktc-card p-6">
        <h3 className="font-display text-lg font-bold text-navy mb-4">Score tracker</h3>
        <p className="font-body text-xs text-navy/50 mb-4">
          Log your practice test scores to track progress over time.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy outline-none focus:border-gold"
          />
          <input
            type="number"
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
            placeholder="Score"
            min={400}
            max={1600}
            className="w-24 px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy outline-none focus:border-gold"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy outline-none focus:border-gold bg-white"
          >
            <option>SAT</option>
            <option>ACT</option>
            <option>PSAT</option>
            <option>Practice</option>
          </select>
          <button
            onClick={addScoreEntry}
            disabled={!newDate || !newScore}
            className="px-4 py-2 bg-gold hover:bg-gold/90 text-navy font-body text-sm font-medium rounded-md disabled:opacity-50 transition-colors"
          >
            Add
          </button>
        </div>
        {scoreLog.length > 0 ? (
          <div className="space-y-2">
            {scoreLog.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-cream rounded">
                <span className="font-mono-label text-xs text-navy/40 min-w-[80px]">{entry.date}</span>
                <span className="font-mono-label text-xs text-navy/40 min-w-[50px]">{entry.type}</span>
                <span className="font-display text-base font-bold text-navy">{entry.score}</span>
                {i > 0 && (
                  <span className={`font-mono-label text-xs ${entry.score > scoreLog[i - 1].score ? "text-sage" : entry.score < scoreLog[i - 1].score ? "text-crimson" : "text-navy/30"}`}>
                    {entry.score > scoreLog[i - 1].score ? "+" : ""}{entry.score - scoreLog[i - 1].score}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-xs text-navy/30 text-center py-4">
            No scores logged yet. Take a practice test and add your score.
          </p>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={() => setPlan(null)}
        className="text-sm font-body text-navy/40 hover:text-navy/60 transition-colors"
      >
        &larr; Start over with new inputs
      </button>
    </div>
  );
}
