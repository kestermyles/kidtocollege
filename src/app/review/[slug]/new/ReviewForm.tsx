"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/GoldButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface QuestionDef {
  field: string;
  label: string;
  helper: string;
  required: boolean;
  maxLength: number;
}

const QUESTIONS: QuestionDef[] = [
  {
    field: "why_chose",
    label: "Why did you choose this school?",
    helper:
      "Be specific — financial aid, a program, a campus visit feeling, recruited for a team, etc.",
    required: true,
    maxLength: 500,
  },
  {
    field: "biggest_positive_surprise",
    label: "Biggest positive surprise once you got there?",
    helper:
      "Something you didn't expect that turned out to be a major plus.",
    required: true,
    maxLength: 500,
  },
  {
    field: "biggest_negative_surprise",
    label: "Biggest negative surprise?",
    helper:
      "The hardest part. Things prospective students should hear but rarely do.",
    required: true,
    maxLength: 500,
  },
  {
    field: "one_thing_to_senior",
    label:
      "If you could tell one thing to a high school senior considering this school, what would it be?",
    helper: "The single sentence you wish you'd heard at age 17.",
    required: true,
    maxLength: 300,
  },
  {
    field: "who_thrives",
    label: "Who thrives here? (optional)",
    helper: "Type of student / personality / interests.",
    required: false,
    maxLength: 300,
  },
  {
    field: "who_shouldnt_come",
    label: "Who shouldn't come here? (optional)",
    helper:
      "Just as helpful — students who'd be unhappy. Be specific without being mean.",
    required: false,
    maxLength: 300,
  },
];

export default function ReviewForm({
  slug,
  collegeName,
  verifiedStudentId,
}: {
  slug: string;
  collegeName: string;
  verifiedStudentId: string;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setAnswer(field: string, value: string) {
    setAnswers((a) => ({ ...a, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side: required fields present
    for (const q of QUESTIONS) {
      if (q.required && !(answers[q.field] ?? "").trim()) {
        setError(`Please answer: ${q.label}`);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          verifiedStudentId,
          answers,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Couldn't submit review");
      }
      router.push(`/review/${slug}/thanks`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {QUESTIONS.map((q) => {
        const value = answers[q.field] ?? "";
        const remaining = q.maxLength - value.length;
        return (
          <div key={q.field} className="ktc-card p-5">
            <label className="block font-body text-base font-medium text-navy mb-1">
              {q.label}
              {q.required && <span className="text-crimson ml-1">*</span>}
            </label>
            <p className="font-body text-sm text-navy/60 mb-3">{q.helper}</p>
            <textarea
              value={value}
              onChange={(e) =>
                setAnswer(q.field, e.target.value.slice(0, q.maxLength))
              }
              rows={4}
              className="w-full border border-card rounded-md px-3 py-2 font-body text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition resize-y"
              placeholder={q.required ? "Required" : "Optional but valuable"}
            />
            <p
              className={`mt-1 text-xs font-body text-right ${remaining < 50 ? "text-crimson" : "text-navy/40"}`}
            >
              {remaining} characters left
            </p>
          </div>
        );
      })}

      {error && (
        <div className="ktc-card p-4 border-crimson/40 bg-crimson/5">
          <p className="font-body text-sm text-crimson">{error}</p>
        </div>
      )}

      <div className="ktc-card p-5 bg-cream">
        <p className="font-body text-sm text-navy/70 leading-relaxed">
          <strong>What happens next:</strong> we review your submission for
          spam/abuse (usually within 24 hours), then publish it on the{" "}
          {collegeName} page. Your name is never published — readers see only
          your handle (e.g. &ldquo;Junior, CS, &lsquo;26&rdquo;).
        </p>
      </div>

      <GoldButton type="submit" disabled={loading} className="w-full">
        {loading ? <LoadingSpinner size="sm" /> : "Submit review"}
      </GoldButton>
    </form>
  );
}
