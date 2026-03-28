"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { useRole } from "@/lib/role-context";
import { GoldButton } from "@/components/GoldButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { FadeIn } from "@/components/FadeIn";
import { StudentDashboard } from "./StudentDashboard";
import { ParentDashboard } from "./ParentDashboard";
import Link from "next/link";
import type {
  SavedCollege,
  ChecklistItem,
  EssayDraft,
  SearchRecord,
} from "@/lib/types";

interface CoachSession {
  id: string;
  section_slug: string;
  status: "started" | "completed";
  updated_at: string;
}

export default function AccountPage() {
  const supabase = createClient();
  const router = useRouter();
  const { role, loading: roleLoading } = useRole();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [coachSessions, setCoachSessions] = useState<CoachSession[]>([]);
  const [essays, setEssays] = useState<EssayDraft[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  const fetchData = useCallback(
    async (uid: string) => {
      setSectionsLoading(true);
      const now = new Date();
      const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const [searchRes, savedRes, coachRes, essayRes, checkRes] =
        await Promise.all([
          supabase
            .from("searches")
            .select("id, college, major, created_at")
            .eq("user_id", uid)
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("saved_colleges")
            .select("*")
            .eq("user_id", uid)
            .order("created_at", { ascending: false }),
          supabase
            .from("coach_sessions")
            .select("id, section_slug, status, updated_at")
            .eq("user_id", uid)
            .order("updated_at", { ascending: false }),
          supabase
            .from("essay_drafts")
            .select("*")
            .eq("user_id", uid)
            .order("updated_at", { ascending: false })
            .limit(5),
          supabase
            .from("checklist_items")
            .select("*")
            .eq("user_id", uid)
            .lte("deadline", in30)
            .neq("status", "done")
            .order("deadline", { ascending: true }),
        ]);

      setSearches((searchRes.data as SearchRecord[]) ?? []);
      setSavedColleges((savedRes.data as SavedCollege[]) ?? []);
      setCoachSessions((coachRes.data as CoachSession[]) ?? []);
      setEssays((essayRes.data as EssayDraft[]) ?? []);
      setChecklist((checkRes.data as ChecklistItem[]) ?? []);
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
      setUserRole(user.user_metadata?.role ?? "parent");
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

  function handleInvite() {
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
  }

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Role-adapted dashboards
  if (role === "student") {
    return (
      <StudentDashboard
        userId={userId}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />
    );
  }

  if (role === "parent") {
    return (
      <ParentDashboard
        userId={userId}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />
    );
  }

  // Fallback: original dashboard for users without a resolved role
  const COACH_SECTIONS = [
    { slug: "college-list-builder", label: "College List Builder" },
    { slug: "application-tracker", label: "Application Tracker" },
    { slug: "essay-workshop", label: "Essay Workshop" },
    { slug: "financial-aid", label: "Financial Aid" },
    { slug: "interview-prep", label: "Interview Prep" },
    { slug: "decision-day", label: "Decision Day" },
    { slug: "summer-prep", label: "Summer Prep" },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="mb-10">
            <h1 className="font-display text-3xl sm:text-4xl text-navy mb-2">
              Welcome back
            </h1>
            <p className="font-body text-navy/60">{userEmail}</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <FadeIn delay={0.05}>
            <div className="ktc-card p-6 h-full">
              <h2 className="font-display text-xl text-navy mb-4">
                Recent Searches
              </h2>
              {sectionsLoading ? (
                <LoadingSpinner size="sm" />
              ) : searches.length === 0 ? (
                <p className="font-body text-sm text-navy/50">
                  No searches yet.{" "}
                  <Link href="/search" className="text-gold hover:underline">
                    Start one
                  </Link>
                </p>
              ) : (
                <ul className="space-y-3">
                  {searches.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/results?id=${s.id}`}
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
          </FadeIn>

          {/* Saved Colleges */}
          <FadeIn delay={0.1}>
            <div className="ktc-card p-6 h-full">
              <h2 className="font-display text-xl text-navy mb-4">
                Saved Colleges
              </h2>
              {sectionsLoading ? (
                <LoadingSpinner size="sm" />
              ) : savedColleges.length === 0 ? (
                <p className="font-body text-sm text-navy/50">
                  No saved colleges yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {savedColleges.map((c) => (
                    <li
                      key={c.id}
                      className="p-3 rounded-md bg-cream/50"
                    >
                      <Link
                        href={`/college/${c.college_slug}`}
                        className="font-body text-sm font-medium text-navy hover:text-gold transition-colors"
                      >
                        {c.college_name}
                      </Link>
                      {c.user_notes && (
                        <p className="font-body text-xs text-navy/50 mt-1">
                          {c.user_notes}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FadeIn>

          {/* Coach Progress */}
          <FadeIn delay={0.15}>
            <div className="ktc-card p-6 h-full">
              <h2 className="font-display text-xl text-navy mb-4">
                Coach Progress
              </h2>
              {sectionsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <ul className="space-y-2">
                  {COACH_SECTIONS.map((section) => {
                    const session = coachSessions.find(
                      (s) => s.section_slug === section.slug
                    );
                    const status = session?.status;
                    return (
                      <li key={section.slug}>
                        <Link
                          href={`/coach/${section.slug}`}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-cream/50 transition-colors"
                        >
                          <span
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${
                              status === "completed"
                                ? "bg-sage"
                                : status === "started"
                                ? "bg-gold"
                                : "bg-navy/15"
                            }`}
                          />
                          <span className="font-body text-sm text-navy">
                            {section.label}
                          </span>
                          {status && (
                            <span className="ml-auto font-mono-label text-xs text-navy/40 capitalize">
                              {status}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </FadeIn>

          {/* Essay Drafts */}
          <FadeIn delay={0.2}>
            <div className="ktc-card p-6 h-full">
              <h2 className="font-display text-xl text-navy mb-4">
                Essay Drafts
              </h2>
              {sectionsLoading ? (
                <LoadingSpinner size="sm" />
              ) : essays.length === 0 ? (
                <p className="font-body text-sm text-navy/50">
                  No essay drafts yet.{" "}
                  <Link
                    href="/coach/essay-workshop"
                    className="text-gold hover:underline"
                  >
                    Start writing
                  </Link>
                </p>
              ) : (
                <ul className="space-y-3">
                  {essays.map((e) => (
                    <li
                      key={e.id}
                      className="p-3 rounded-md bg-cream/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-body text-sm font-medium text-navy">
                          {e.draft_type}
                        </span>
                        <span className="font-mono-label text-xs text-navy/40">
                          v{e.version}
                        </span>
                      </div>
                      <p className="font-body text-xs text-navy/50 mt-1 line-clamp-2">
                        {e.content.slice(0, 120)}
                        {e.content.length > 120 ? "..." : ""}
                      </p>
                      <span className="font-body text-xs text-navy/40 block mt-1">
                        {new Date(e.updated_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FadeIn>

          {/* Checklist — Due Soon */}
          <FadeIn delay={0.25}>
            <div className="ktc-card p-6 h-full">
              <h2 className="font-display text-xl text-navy mb-4">
                Due in Next 30 Days
              </h2>
              {sectionsLoading ? (
                <LoadingSpinner size="sm" />
              ) : checklist.length === 0 ? (
                <p className="font-body text-sm text-navy/50">
                  Nothing due soon. You&apos;re on track!
                </p>
              ) : (
                <ul className="space-y-3">
                  {checklist.map((item) => (
                    <li
                      key={item.id}
                      className="p-3 rounded-md bg-cream/50 flex items-start gap-3"
                    >
                      <span
                        className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          item.status === "in-progress"
                            ? "bg-gold"
                            : "bg-navy/15"
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="font-body text-sm text-navy block">
                          {item.item_label}
                        </span>
                        <span className="font-body text-xs text-navy/50">
                          {item.college_name}
                          {item.deadline && (
                            <>
                              {" "}
                              &middot; Due{" "}
                              {new Date(item.deadline).toLocaleDateString()}
                            </>
                          )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FadeIn>

          {/* Partner Invite */}
          <FadeIn delay={0.3}>
            <div className="ktc-card p-6 h-full">
              <h2 className="font-display text-xl text-navy mb-2">
                Invite Your {userRole === "student" ? "Parent" : "Student"}
              </h2>
              <p className="font-body text-sm text-navy/50 mb-4">
                Share access so you can collaborate on college planning.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 border border-card rounded-md px-4 py-2.5 font-body text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"
                />
                <GoldButton onClick={handleInvite} disabled={!inviteEmail}>
                  Invite
                </GoldButton>
              </div>
              {inviteSent && (
                <p className="font-body text-sm text-sage mt-2">
                  Invite sent! (placeholder)
                </p>
              )}
            </div>
          </FadeIn>

          {/* Account Settings */}
          <FadeIn delay={0.35}>
            <div className="ktc-card p-6 h-full">
              <h2 className="font-display text-xl text-navy mb-4">
                Account Settings
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
                    Role
                  </dt>
                  <dd className="font-body text-sm text-navy capitalize">
                    {userRole}
                  </dd>
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
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
