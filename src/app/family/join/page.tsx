"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function FamilyJoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center pt-28">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
        </div>
      }
    >
      <FamilyJoinContent />
    </Suspense>
  );
}

function FamilyJoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviterEmail, setInviterEmail] = useState("");
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const signedIn = !!data.user;
      setIsSignedIn(signedIn);

      if (signedIn && code) {
        // Look up the invite
        supabase
          .from("family_links")
          .select("*, users!family_links_inviter_id_fkey(email)")
          .eq("invite_code", code.toUpperCase())
          .eq("status", "pending")
          .single()
          .then(({ data: link }) => {
            if (link) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const inviter = link.users as any;
              setInviterEmail(inviter?.email || "a family member");
            } else {
              setError(
                "This invite link has already been used or has expired."
              );
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, [code]);

  async function handleAccept() {
    setAccepting(true);
    const res = await fetch("/api/family/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (res.ok) {
      router.push("/family");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setAccepting(false);
    }
  }

  // Loading
  if (loading || isSignedIn === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h1 className="font-display text-3xl font-bold text-navy mb-4">
            Family Access
          </h1>
          <p className="font-body text-navy/60 mb-8">
            Sign in to connect with your family on KidToCollege
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/auth/signin?next=/family/join?code=${code}`}
              className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-all"
            >
              Sign in
            </Link>
            <Link
              href={`/auth/signup?next=/family/join?code=${code}`}
              className="bg-white hover:bg-cream text-navy font-body font-medium px-8 py-4 rounded-md transition-all border border-card"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h1 className="font-display text-2xl font-bold text-navy mb-4">
            Invite not found
          </h1>
          <p className="font-body text-navy/60 mb-8">{error}</p>
          <Link
            href="/family"
            className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-all"
          >
            Go to Family Access
          </Link>
        </div>
      </div>
    );
  }

  // Valid invite — show accept prompt
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-xl mx-auto px-6 text-center">
        <h1 className="font-display text-3xl font-bold text-navy mb-4">
          Family invite
        </h1>
        <div className="ktc-card p-8 mb-6">
          <p className="font-body text-navy text-lg mb-6">
            Connect with{" "}
            <span className="font-medium">{inviterEmail}</span> on
            KidToCollege?
          </p>
          <p className="font-body text-sm text-navy/50 mb-8">
            You&apos;ll be able to share college research, lists, and progress.
            Either side can disconnect at any time.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-3 rounded-md transition-all disabled:opacity-50"
            >
              {accepting ? "Connecting..." : "Accept"}
            </button>
            <Link
              href="/family"
              className="bg-white hover:bg-cream text-navy font-body font-medium px-8 py-3 rounded-md transition-all border border-card"
            >
              Decline
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
