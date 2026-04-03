"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

interface FamilyLink {
  id: string;
  student_id: string | null;
  parent_id: string | null;
  inviter_id: string;
  invite_code: string;
  invitee_email: string | null;
  status: string;
}

interface SearchRecord {
  id: string;
  college: string;
  major: string;
  created_at: string;
}

interface ListItem {
  college_slug: string;
  colleges: { name: string } | null;
}

export default function FamilyPage() {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLink, setActiveLink] = useState<FamilyLink | null>(null);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [isStudent, setIsStudent] = useState(false);

  // Parent view data
  const [studentColleges, setStudentColleges] = useState<ListItem[]>([]);
  const [studentSearches, setStudentSearches] = useState<SearchRecord[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const [collegeCount, setCollegeCount] = useState(0);

  // Invite state
  const [inviteCode, setInviteCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const fetchFamilyData = useCallback(
    async (uid: string) => {
      const supabase = createClient();

      // Find active link
      const { data: links } = await supabase
        .from("family_links")
        .select("*")
        .eq("status", "active")
        .or(`student_id.eq.${uid},parent_id.eq.${uid}`)
        .limit(1);

      const link = links?.[0] as FamilyLink | undefined;

      if (link) {
        setActiveLink(link);
        const userIsStudent = link.student_id === uid;
        setIsStudent(userIsStudent);

        // Get partner email
        const partnerId = userIsStudent ? link.parent_id : link.student_id;
        if (partnerId) {
          const { data: partner } = await supabase
            .from("users")
            .select("email")
            .eq("id", partnerId)
            .single();
          if (partner) setPartnerEmail(partner.email);
        }

        // If viewer is parent, fetch student data
        if (!userIsStudent && link.student_id) {
          const studentId = link.student_id;

          // College list
          const { data: listData } = await supabase
            .from("college_lists")
            .select("id")
            .eq("user_id", studentId)
            .single();

          if (listData) {
            const { data: items, count } = await supabase
              .from("college_list_items")
              .select("college_slug, colleges(name)", { count: "exact" })
              .eq("list_id", listData.id);
            setStudentColleges((items as unknown as ListItem[]) || []);
            setCollegeCount(count || 0);
          }

          // Searches
          const { data: searches, count: sCount } = await supabase
            .from("searches")
            .select("id, college, major, created_at", { count: "exact" })
            .eq("user_id", studentId)
            .order("created_at", { ascending: false })
            .limit(3);
          setStudentSearches((searches as SearchRecord[]) || []);
          setSearchCount(sCount || 0);
        }
      }

      setLoading(false);
    },
    []
  );

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const signedIn = !!data.user;
      setIsSignedIn(signedIn);
      if (signedIn && data.user) {
        setUserId(data.user.id);
        fetchFamilyData(data.user.id);
      } else {
        setLoading(false);
      }
    });
  }, [fetchFamilyData]);

  async function generateInvite(role: "student" | "parent") {
    setInviteLoading(true);
    const res = await fetch("/api/family/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        initiated_by: role,
        invitee_email: inviteEmail || undefined,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setInviteCode(data.invite_code);
      setInviteUrl(data.invite_url);
    }
    setInviteLoading(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    await fetch("/api/family/disconnect", { method: "POST" });
    setActiveLink(null);
    setPartnerEmail("");
    setDisconnecting(false);
  }

  // Loading
  if (loading || isSignedIn === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  // Gate
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h1 className="font-display text-3xl font-bold text-navy mb-4">
            Family Access
          </h1>
          <p className="font-body text-navy/60 mb-8">
            Sign up to share your college research with your family — free.
          </p>
          <Link
            href="/auth/signup?next=/family"
            className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-all text-lg"
          >
            Create an account &rarr;
          </Link>
          <p className="font-body text-sm text-navy/40 mt-4">
            Already have an account?{" "}
            <Link href="/auth/signin?next=/family" className="text-gold hover:text-gold/80 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // MODE B — Active link
  if (activeLink) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
            Family Access
          </h1>

          {isStudent ? (
            // Student view
            <div>
              <div className="ktc-card p-6 mt-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-body text-navy">
                    Connected with{" "}
                    <span className="font-medium">{partnerEmail}</span>
                  </p>
                  <p className="font-body text-sm text-navy/50 mt-1">
                    Your parent can see your college list and research reports
                  </p>
                </div>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="font-body text-sm text-navy/40 hover:text-crimson transition-colors underline underline-offset-2"
                >
                  {disconnecting ? "Disconnecting..." : "Disconnect"}
                </button>
              </div>
            </div>
          ) : (
            // Parent view
            <div>
              <p className="font-body text-navy/60 mt-2 mb-8">
                Viewing{" "}
                <span className="font-medium text-navy">{partnerEmail}</span>
                &apos;s activity
              </p>

              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="ktc-card p-5 text-center">
                  <p className="font-mono-label text-gold text-2xl font-bold">
                    {collegeCount}
                  </p>
                  <p className="text-navy/60 text-sm font-body mt-1">
                    Colleges saved
                  </p>
                </div>
                <div className="ktc-card p-5 text-center">
                  <p className="font-mono-label text-gold text-2xl font-bold">
                    {searchCount}
                  </p>
                  <p className="text-navy/60 text-sm font-body mt-1">
                    Reports generated
                  </p>
                </div>
                <div className="ktc-card p-5 text-center">
                  <Link
                    href="/scholarships"
                    className="font-body text-sm text-gold hover:text-gold/80 underline"
                  >
                    See latest report
                  </Link>
                  <p className="text-navy/60 text-sm font-body mt-1">
                    Scholarships
                  </p>
                </div>
                <div className="ktc-card p-5 text-center">
                  <p className="font-mono-label text-navy/30 text-sm">
                    Coming soon
                  </p>
                  <p className="text-navy/60 text-sm font-body mt-1">
                    Checklist
                  </p>
                </div>
              </div>

              {/* Student's college list */}
              {studentColleges.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-bold text-navy mb-4">
                    College list
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {studentColleges.map((item) => (
                      <Link
                        key={item.college_slug}
                        href={`/college/${item.college_slug}`}
                        className="px-3 py-1.5 bg-cream text-navy text-sm font-body rounded-full border border-card hover:border-gold/40 transition-colors"
                      >
                        {item.colleges?.name || item.college_slug}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent reports */}
              {studentSearches.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-bold text-navy mb-4">
                    Recent reports
                  </h2>
                  <div className="space-y-3">
                    {studentSearches.map((s) => (
                      <Link
                        key={s.id}
                        href={`/results?searchId=${s.id}`}
                        className="ktc-card p-5 block hover:shadow-md transition-shadow"
                      >
                        <p className="font-body font-medium text-navy">
                          {s.college}
                        </p>
                        <p className="font-body text-sm text-navy/50">
                          {s.major} &middot;{" "}
                          {new Date(s.created_at).toLocaleDateString()}
                        </p>
                        <span className="text-gold text-sm font-body mt-1 inline-block">
                          View report &rarr;
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Disconnect */}
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="font-body text-sm text-navy/40 hover:text-crimson transition-colors underline underline-offset-2"
              >
                {disconnecting ? "Disconnecting..." : "Disconnect from this account"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MODE A — No link
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
          Family Access
        </h1>
        <p className="font-body text-navy/60 mb-10 max-w-2xl">
          Keep your family in the loop — share your college research, scholarship
          finds and progress. Either side can invite the other.
        </p>

        {/* Invite result */}
        {inviteCode && (
          <div className="ktc-card p-6 mb-8 bg-cream border-gold/30">
            <p className="font-body text-navy font-medium mb-3">
              Your invite link is ready
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <code className="font-mono text-lg text-gold bg-white px-4 py-2 rounded-md border border-card tracking-widest">
                {inviteCode}
              </code>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gold/10 hover:bg-gold/20 text-navy font-body text-sm rounded-md transition-colors"
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
            <p className="font-body text-xs text-navy/40 mt-3 break-all">
              {inviteUrl}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Student card */}
          <div className="ktc-card p-8">
            <h2 className="font-display text-xl font-bold text-navy mb-2">
              I&apos;m a student
            </h2>
            <p className="font-body text-navy/60 text-sm mb-6">
              Share your research and progress with a parent or guardian
            </p>
            <button
              onClick={() => generateInvite("student")}
              disabled={inviteLoading || !!inviteCode}
              className="w-full bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-all disabled:opacity-50 mb-4"
            >
              {inviteLoading ? "Generating..." : "Generate invite link"}
            </button>
            <div className="border-t border-card pt-4">
              <p className="font-body text-xs text-navy/40 mb-2">
                Or invite by email
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="parent@email.com"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60"
                />
                <button
                  onClick={() => generateInvite("student")}
                  disabled={!inviteEmail || inviteLoading}
                  className="px-4 py-2 bg-navy text-white font-body text-sm rounded-md hover:bg-navy/90 transition-colors disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Parent card */}
          <div className="ktc-card p-8">
            <h2 className="font-display text-xl font-bold text-navy mb-2">
              I&apos;m a parent
            </h2>
            <p className="font-body text-navy/60 text-sm mb-6">
              Connect with your student to follow their college journey
            </p>
            <div className="mb-4">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter invite code or paste link"
                className="w-full px-4 py-3 border border-gray-200 rounded-md font-body text-navy text-sm focus:outline-none focus:border-gold/60 mb-3 font-mono tracking-wider uppercase"
              />
              <Link
                href={`/family/join?code=${joinCode}`}
                className={`block w-full text-center bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-all ${
                  !joinCode ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                Connect
              </Link>
            </div>
            <div className="border-t border-card pt-4">
              <p className="font-body text-xs text-navy/40 mb-2">
                Or invite your student by email
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="student@email.com"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60"
                />
                <button
                  onClick={() => generateInvite("parent")}
                  disabled={!inviteEmail || inviteLoading}
                  className="px-4 py-2 bg-navy text-white font-body text-sm rounded-md hover:bg-navy/90 transition-colors disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="font-body text-xs text-navy/40 text-center">
          Either side can disconnect at any time. Parents get read-only access —
          students stay in control.
        </p>
      </div>
    </div>
  );
}
