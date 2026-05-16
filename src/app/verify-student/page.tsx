"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { GoldButton } from "@/components/GoldButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";

export default function VerifyStudentPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validation: must be a .edu address
    const lower = email.trim().toLowerCase();
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.edu$/.test(lower)) {
      setError("That doesn't look like a .edu email. Please use your school-issued address.");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.auth.signInWithOtp({
      email: lower,
      options: {
        emailRedirectTo: `https://www.kidtocollege.com/auth/callback?next=/verify-student/complete`,
      },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-20">
        <FadeIn>
          <div className="ktc-card max-w-md w-full text-center p-8">
            <h1 className="font-display text-2xl text-navy mb-4">
              Check your school inbox
            </h1>
            <p className="font-body text-navy/70">
              We sent a verification link to{" "}
              <strong className="text-navy">{email}</strong>. Click it to
              continue and tell us about your school.
            </p>
            <p className="font-body text-sm text-navy/50 mt-4">
              The link expires in 1 hour. Check spam if it doesn&apos;t
              arrive in a minute.
            </p>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-24 pb-12">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-3">
            Share your honest take
          </h1>
          <p className="font-body text-lg text-navy/70 mb-8 leading-relaxed">
            You&apos;re a current college student and you have things to say
            about your school that prospective students need to hear. We
            verify you with your .edu email so families can trust what they
            read — and that&apos;s it. No data shared with your school. No
            advertisers. Free forever.
          </p>

          <div className="ktc-card p-6 mb-6">
            <h2 className="font-display text-lg font-bold text-navy mb-4">
              Why this matters
            </h2>
            <ul className="space-y-3 font-body text-sm text-navy/80">
              <li className="flex gap-3">
                <span className="text-gold font-bold">✦</span>
                <span>
                  Most college review sites get gamed — schools or
                  promotional teams plant positive reviews. We require a
                  working .edu email so the reviews are from people
                  actually enrolled.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">✦</span>
                <span>
                  Your name is never published. You pick a display handle
                  like &ldquo;Junior, CS, &lsquo;26&rdquo; — that&apos;s
                  what readers see.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">✦</span>
                <span>
                  Five short structured questions, not a 1,000-word essay.
                  Including: &ldquo;who shouldn&apos;t come here?&rdquo;
                  We want honest, not flattering.
                </span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="ktc-card p-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-body text-sm text-navy/70 mb-1"
              >
                Your .edu email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-card rounded-md px-4 py-3 font-body text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"
                placeholder="you@yourschool.edu"
              />
              <p className="font-body text-xs text-navy/50 mt-1.5">
                We&apos;ll send a one-time verification link to that inbox.
              </p>
            </div>

            {error && <p className="font-body text-sm text-crimson">{error}</p>}

            <GoldButton type="submit" disabled={loading} className="w-full">
              {loading ? <LoadingSpinner size="sm" /> : "Send verification link"}
            </GoldButton>
          </form>

          <p className="mt-6 font-body text-sm text-center text-navy/60">
            Not a current college student?{" "}
            <Link href="/" className="text-gold hover:underline font-medium">
              Back to KidToCollege
            </Link>
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
