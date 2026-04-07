"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
  "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VT","VA","WA","WV","WI","WY",
];

const PAGE_SIZE = 24;

interface CollegeRow {
  slug: string;
  name: string;
  location: string;
  state: string;
  acceptance_rate: number | null;
  avg_cost_instate: number | null;
}

export default function CollegesBrowsePage() {
  const [colleges, setColleges] = useState<CollegeRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [filterGreek, setFilterGreek] = useState(false);
  const [filterD1, setFilterD1] = useState(false);
  const [filterSetting, setFilterSetting] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("colleges")
      .select("slug, name, location, state, acceptance_rate, avg_cost_instate", {
        count: "exact",
      })
      .order("total_enrollment", { ascending: false, nullsFirst: false })
      .order("name", { ascending: true })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (search.length >= 2) {
      query = query.ilike("name", `%${search}%`);
    }
    if (stateFilter) {
      query = query.eq("state", stateFilter);
    }
    if (filterGreek) {
      query = query.eq("has_greek_life", true);
    }
    if (filterD1) {
      query = query.eq("has_d1_sports", true);
    }
    if (filterSetting) {
      query = query.eq("campus_setting", filterSetting);
    }

    const { data, count } = await query;
    setColleges((data as CollegeRow[]) || []);
    setTotal(count || 0);
    setLoading(false);
  }, [page, search, stateFilter, filterGreek, filterD1, filterSetting]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [search, stateFilter, filterGreek, filterD1, filterSetting]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-navy mb-2">
            Browse All Colleges
          </h1>
          <p className="font-body text-navy/60">
            {total.toLocaleString()} colleges across the United States
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-200 rounded-md font-body text-navy text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
          />
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-md font-body text-navy text-sm focus:outline-none focus:border-gold/60 bg-white"
          >
            <option value="">All states</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filterSetting}
            onChange={(e) => setFilterSetting(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg font-body text-sm text-navy/70 focus:outline-none focus:ring-2 focus:ring-gold/30 bg-white"
          >
            <option value="">All settings</option>
            <option value="Urban">Urban</option>
            <option value="Suburban">Suburban</option>
            <option value="Rural">Rural</option>
            <option value="College Town">College Town</option>
          </select>
          <button
            onClick={() => setFilterGreek(!filterGreek)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
              filterGreek
                ? "text-white bg-navy border-navy"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            Greek life
          </button>
          <button
            onClick={() => setFilterD1(!filterD1)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
              filterD1
                ? "text-white bg-navy border-navy"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            D1 Sports
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-navy/50 text-lg mb-2">
              No colleges found
            </p>
            <p className="font-body text-navy/40 text-sm">
              Try a different search or filter
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {colleges.map((c) => (
                <Link
                  key={c.slug}
                  href={`/college/${c.slug}`}
                  className="ktc-card p-4 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <h3 className="font-display text-base font-bold text-navy group-hover:text-gold transition-colors mb-1 leading-tight">
                    {c.name}
                  </h3>
                  <p className="font-body text-sm text-navy/50 mb-3">
                    {c.location}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-body text-navy/40">
                    {c.acceptance_rate != null && (
                      <span>
                        <span className="font-medium text-navy/60">
                          {c.acceptance_rate}%
                        </span>{" "}
                        acceptance
                      </span>
                    )}
                    {c.avg_cost_instate != null && (
                      <span>
                        <span className="font-medium text-navy/60">
                          ${c.avg_cost_instate.toLocaleString()}
                        </span>{" "}
                        in-state
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  &larr; Previous
                </button>
                <span className="font-body text-sm text-navy/50 px-4">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
