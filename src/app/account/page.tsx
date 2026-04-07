"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import Link from "next/link";
import type { SavedCollege, SearchRecord } from "@/lib/types";
import StudentProfileCard from "@/components/account/StudentProfileCard";

const QUICK_LINKS = [
  { href: "/my-chances", label: "My Chances", desc: "Check your admission odds" },
  { href: "/my-list", label: "My College List", desc: "Build your reach/target/safety list" },
  { href: "/coach", label: "The Coach", desc: "Essays, test prep, interviews" },
  { href: "/colleges", label: "Browse Colleges", desc: "Explore all 3,000+ colleges" },
  { href: "/family", label: "Family Access", desc: "Share progress with your family" },
];

export default function AccountPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  const fetchData = useCallback(
    async (uid: string) => {
      setSectionsLoading(true);

      const [searchRes, savedRes] = await Promise.all([
        supabase
          .from("searches")
          .select("id, college, major, created_at")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("saved_colleges")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false }),
      ]);

      setSearches((searchRes.data as SearchRecord[]) ?? []);
      setSavedColleges((savedRes.data as SavedCollege[]) ?? []);
      setSectionsLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/signin");
        return;
      }
      setUserEmail(user.email ?? "");
      setUserId(user.id);
      setLoading(false);
      fetchData(user.id);
    }
    init();
  }, [supabase, router, fetchData]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div>
          <div className="mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
              Your college dashboard
            </h1>
            <p className="font-body text-navy/60">{userEmail}</p>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="ktc-card p-4 block group hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <h3 className="font-body text-sm font-medium text-navy group-hover:text-gold transition-colors mb-1">
                  {link.label}
                </h3>
                <p className="font-body text-xs text-navy/40">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <div>
            <div className="ktc-card p-6 h-full">
              <h2 className="font-display text-xl font-bold text-navy mb-4">
                Recent Reports
              </h2>
              {sectionsLoading ? (
                <LoadingSpinner size="sm" />
              ) : searches.length === 0 ? (
                <div>
                  <p className="font-body text-sm text-navy/50 mb-3">
                    No research reports yet.
                  </p>
                  <Link
                    href="/search"
                    className="font-body text-sm text-gold hover:text-gold/80 font-medium"
                  >
                    Run your first college report &rarr;
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {searches.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/results?searchId=${s.id}`}
                        className="block p-3 rounded-md bg-cream/50 hover:bg-cream transition-colors"
                      >
                        <span className="font-body text-sm font-medium text-navy">
                          {s.college}
                        </span>
                        <span className="font-body text-xs text-navy/50 block">
                          {s.major} &middot;{" "}
                          {new Date(s.created_at).toLocaleDateString()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Saved Colleges */}
          <div>
            <div className="ktc-card p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-navy">
                  Saved Colleges
                </h2>
                {savedColleges.length > 0 && (
                  <Link
                    href="/my-list"
                    className="font-body text-xs text-gold hover:text-gold/80"
                  >
                    View list &rarr;
                  </Link>
                )}
              </div>
              {sectionsLoading ? (
                <LoadingSpinner size="sm" />
              ) : savedColleges.length === 0 ? (
                <div>
                  <p className="font-body text-sm text-navy/50 mb-3">
                    No saved colleges yet.
                  </p>
                  <Link
                    href="/colleges"
                    className="font-body text-sm text-gold hover:text-gold/80 font-medium"
                  >
                    Browse colleges &rarr;
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {savedColleges.map((c) => (
                    <Link
                      key={c.id}
                      href={`/college/${c.college_slug}`}
                      className="px-3 py-1.5 bg-cream text-navy text-sm font-body rounded-full border border-card hover:border-gold/40 transition-colors"
                    >
                      {c.college_name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <div className="ktc-card p-6 h-full">
              <h2 className="font-display text-xl font-bold text-navy mb-4">
                Account
              </h2>
              <dl className="space-y-3 mb-6">
                <div>
                  <dt className="font-body text-xs text-navy/40 uppercase tracking-wider">
                    Email
                  </dt>
                  <dd className="font-body text-sm text-navy">{userEmail}</dd>
                </div>
                <div>
                  <dt className="font-body text-xs text-navy/40 uppercase tracking-wider">
                    Account ID
                  </dt>
                  <dd className="font-mono-label text-xs text-navy/50">
                    {userId.slice(0, 8)}...
                  </dd>
                </div>
              </dl>
              <button
                onClick={handleSignOut}
                className="font-body text-sm text-crimson hover:underline transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Student Profile */}
        <div className="mt-6">
          <StudentProfileCard />
        </div>
      </div>
    </div>
  );
}
