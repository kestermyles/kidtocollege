"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export function AddToListButton({ collegeSlug }: { collegeSlug: string }) {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [onList, setOnList] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const signedIn = !!data.user;
      setIsSignedIn(signedIn);
      if (signedIn) {
        fetch("/api/list")
          .then((r) => r.json())
          .then((d) => {
            if (d.items?.some((i: { college_slug: string }) => i.college_slug === collegeSlug)) {
              setOnList(true);
            }
          })
          .catch(() => {});
      }
    });
  }, [collegeSlug]);

  async function handleAdd() {
    if (!isSignedIn) return;
    setAdding(true);
    const res = await fetch("/api/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeSlug, category: "unknown" }),
    });
    if (res.ok) {
      setOnList(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
    setAdding(false);
  }

  if (isSignedIn === null) return null;

  if (!isSignedIn) {
    return (
      <Link
        href={`/auth/signup?next=/my-list`}
        className="inline-flex items-center gap-2 font-body text-sm px-6 py-3 rounded-md border border-card text-navy hover:border-gold hover:text-gold transition-all"
      >
        Add to My List
      </Link>
    );
  }

  if (onList) {
    return (
      <div className="relative">
        <Link
          href="/my-list"
          className="inline-flex items-center gap-2 font-body text-sm font-medium px-6 py-3 rounded-md bg-sage/10 text-sage border border-sage/30 transition-all"
        >
          ✓ On your list
        </Link>
        {showToast && (
          <div className="absolute top-full mt-2 left-0 bg-navy text-white font-body text-xs px-3 py-2 rounded-md shadow-lg whitespace-nowrap z-10">
            Added to your list{" "}
            <Link href="/my-list" className="text-gold underline">
              View →
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={adding}
      className="inline-flex items-center gap-2 font-body text-sm font-medium px-6 py-3 rounded-md border border-card text-navy hover:border-gold hover:text-gold transition-all disabled:opacity-50"
    >
      {adding ? "Adding..." : "Add to My List"}
    </button>
  );
}
