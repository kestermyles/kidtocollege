"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { COLLEGE_DEADLINES, type CollegeDeadline } from "@/lib/college-deadlines";

function parseDeadline(dateStr: string): Date | null {
  if (!dateStr || dateStr === "Rolling") return null;
  const current = new Date();
  const year = current.getMonth() >= 7 ? current.getFullYear() : current.getFullYear();
  const parsed = new Date(`${dateStr} ${year}`);
  if (isNaN(parsed.getTime())) return null;
  // If date is in the past, it's likely next cycle
  if (parsed < current) parsed.setFullYear(parsed.getFullYear() + 1);
  return parsed;
}

function daysUntil(dateStr: string): number | null {
  const d = parseDeadline(dateStr);
  if (!d) return null;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ dateStr }: { dateStr: string | null }) {
  if (!dateStr) return <span className="text-navy/30 text-xs">N/A</span>;
  if (dateStr === "Rolling")
    return <span className="text-sage text-xs font-medium">Rolling</span>;

  const days = daysUntil(dateStr);
  if (days === null) return <span className="text-xs">{dateStr}</span>;

  const color =
    days < 30 ? "text-crimson" : days < 60 ? "text-gold" : "text-sage";

  return (
    <div>
      <span className="text-xs text-navy/70 block">{dateStr}</span>
      <span className={`text-xs font-medium ${color}`}>
        {days <= 0 ? "Passed" : `${days} days`}
      </span>
    </div>
  );
}

export default function DeadlinesPage() {
  const [myColleges, setMyColleges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        fetch("/api/list")
          .then((r) => r.json())
          .then((d) => {
            if (d.items) {
              const slugs = d.items.map((i: { college_slug: string }) => i.college_slug);
              setMyColleges(slugs);
              if (slugs.length > 0) setShowAll(false);
            }
          })
          .catch(() => {});
      }
      setLoading(false);
    });
  }, []);

  const myDeadlines = COLLEGE_DEADLINES.filter((d) =>
    myColleges.includes(d.slug)
  );
  const displayDeadlines = showAll ? COLLEGE_DEADLINES : myDeadlines;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
            Application Deadlines
          </h1>
          <p className="font-body text-navy/60">
            {myColleges.length > 0
              ? `Showing deadlines for ${myDeadlines.length} colleges on your list`
              : "Add colleges to your list to see personalized deadlines"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowAll(false)}
            className={`px-4 py-2 rounded-full text-sm font-body font-medium border transition-all ${
              !showAll
                ? "bg-gold text-navy border-gold"
                : "bg-white text-navy/60 border-gray-200"
            }`}
          >
            My colleges ({myDeadlines.length})
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`px-4 py-2 rounded-full text-sm font-body font-medium border transition-all ${
              showAll
                ? "bg-gold text-navy border-gold"
                : "bg-white text-navy/60 border-gray-200"
            }`}
          >
            All top 50 colleges
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
          </div>
        ) : displayDeadlines.length === 0 ? (
          <div className="ktc-card p-10 text-center">
            <p className="font-body text-navy/50 text-lg mb-4">
              No colleges on your list yet
            </p>
            <Link
              href="/colleges"
              className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors"
            >
              Browse colleges &rarr;
            </Link>
          </div>
        ) : (
          <div className="ktc-card overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-card bg-cream/50">
                  <th className="px-4 py-3 text-left font-mono-label text-xs text-navy/60 uppercase tracking-wider">
                    College
                  </th>
                  <th className="px-4 py-3 text-left font-mono-label text-xs text-navy/60 uppercase tracking-wider">
                    ED
                  </th>
                  <th className="px-4 py-3 text-left font-mono-label text-xs text-navy/60 uppercase tracking-wider">
                    EA
                  </th>
                  <th className="px-4 py-3 text-left font-mono-label text-xs text-navy/60 uppercase tracking-wider">
                    Regular
                  </th>
                  <th className="px-4 py-3 text-left font-mono-label text-xs text-navy/60 uppercase tracking-wider">
                    FAFSA
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayDeadlines.map((d: CollegeDeadline) => (
                  <tr key={d.slug} className="border-b border-card last:border-b-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/college/${d.slug}`}
                        className="font-body text-sm font-medium text-navy hover:text-gold transition-colors"
                      >
                        {d.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <DeadlineBadge dateStr={d.ed} />
                    </td>
                    <td className="px-4 py-3">
                      <DeadlineBadge dateStr={d.ea} />
                    </td>
                    <td className="px-4 py-3">
                      <DeadlineBadge dateStr={d.rd} />
                    </td>
                    <td className="px-4 py-3">
                      <DeadlineBadge dateStr={d.fafsa} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs font-body text-navy/40 mt-4">
          Deadlines are for the 2026-2027 application cycle. Always verify
          directly with each college.
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/colleges" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors">Browse colleges</Link>
          <Link href="/essays" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors">Essay prompts</Link>
          <Link href="/roadmap" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors">Your roadmap</Link>
        </div>
      </div>
    </div>
  );
}
