"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/GoldButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC","Other",
];

const YEAR_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "First-year / Freshman" },
  { value: 2, label: "Sophomore" },
  { value: 3, label: "Junior" },
  { value: 4, label: "Senior" },
  { value: 5, label: "5th year / Grad student" },
  { value: 6, label: "Recent grad" },
];

export default function CompleteVerificationForm({
  email,
  schoolOptions,
  userId,
}: {
  email: string;
  schoolOptions: { slug: string; name: string; location: string | null }[];
  userId: string;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(schoolOptions[0]?.slug ?? "");
  const [year, setYear] = useState<number>(2);
  const [major, setMajor] = useState("");
  const [state, setState] = useState("");
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate a handle suggestion if user hasn't typed one
  const suggestedHandle =
    handle ||
    (major
      ? `${YEAR_OPTIONS.find((y) => y.value === year)?.label.split(" ")[0]}, ${major}`
      : "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email,
          collegeSlug: slug,
          yearInSchool: year,
          intendedMajor: major,
          hometownState: state,
          displayHandle: suggestedHandle,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Couldn't complete verification");
      }
      router.push(`/review/${slug}/new`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ktc-card p-6 space-y-5">
      <div>
        <label className="block font-body text-sm text-navy/70 mb-1">
          Your school
        </label>
        {schoolOptions.length === 1 ? (
          <div className="px-4 py-3 bg-cream rounded-md font-body text-sm text-navy">
            {schoolOptions[0].name}
          </div>
        ) : (
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-card rounded-md px-4 py-3 font-body text-sm text-navy bg-white"
          >
            {schoolOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name} {s.location ? `— ${s.location}` : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block font-body text-sm text-navy/70 mb-1">
          Year
        </label>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10))}
          className="w-full border border-card rounded-md px-4 py-3 font-body text-sm text-navy bg-white"
        >
          {YEAR_OPTIONS.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-body text-sm text-navy/70 mb-1">
          Major
        </label>
        <input
          type="text"
          required
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          placeholder="Computer Science, English, Undecided…"
          className="w-full border border-card rounded-md px-4 py-3 font-body text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"
        />
      </div>

      <div>
        <label className="block font-body text-sm text-navy/70 mb-1">
          Hometown state (optional)
        </label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full border border-card rounded-md px-4 py-3 font-body text-sm text-navy bg-white"
        >
          <option value="">Prefer not to say</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-body text-sm text-navy/70 mb-1">
          Public display handle (optional)
        </label>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder={suggestedHandle || "Junior, CS"}
          className="w-full border border-card rounded-md px-4 py-3 font-body text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"
        />
        <p className="font-body text-xs text-navy/50 mt-1.5">
          This is what readers see next to your review. Leave blank to use the
          suggestion above.
        </p>
      </div>

      {error && <p className="font-body text-sm text-crimson">{error}</p>}

      <GoldButton type="submit" disabled={loading} className="w-full">
        {loading ? <LoadingSpinner size="sm" /> : "Continue to write a review"}
      </GoldButton>
    </form>
  );
}
