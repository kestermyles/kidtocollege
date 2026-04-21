"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CAREERS,
  OUTLOOK_LABELS,
  ALL_MAJOR_SLUGS,
  type Career,
  type OutlookLabel,
} from "@/lib/careers-data";
import { MAJOR_PAGES, getMajorBySlug } from "@/lib/major-pages-data";

const SALARY_BANDS = [
  { label: "Any", min: 0, max: Infinity },
  { label: "Under $60K", min: 0, max: 60000 },
  { label: "$60K – $100K", min: 60000, max: 100000 },
  { label: "$100K – $150K", min: 100000, max: 150000 },
  { label: "$150K+", min: 150000, max: Infinity },
];

const OUTLOOKS: OutlookLabel[] = ["much-faster", "faster", "average", "slower", "declining"];

function formatSalary(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export default function CareersClient({ initialMajor = "" }: { initialMajor?: string }) {
  const [search, setSearch] = useState("");
  const [majorFilter, setMajorFilter] = useState(initialMajor);
  const [bandIdx, setBandIdx] = useState(0);
  const [outlookFilter, setOutlookFilter] = useState<OutlookLabel | "">("");

  const majors = useMemo(
    () =>
      ALL_MAJOR_SLUGS.map((s) => {
        const page = MAJOR_PAGES.find((m) => m.slug === s);
        return { slug: s, label: page?.label ?? s };
      }).sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  const filtered = useMemo(() => {
    const band = SALARY_BANDS[bandIdx];
    const q = search.trim().toLowerCase();
    return CAREERS.filter((c) => {
      if (q && !c.title.toLowerCase().includes(q) && !c.shortDescription.toLowerCase().includes(q)) return false;
      if (majorFilter && !c.relatedMajorSlugs.includes(majorFilter)) return false;
      if (c.medianSalary < band.min || c.medianSalary > band.max) return false;
      if (outlookFilter && c.outlookLabel !== outlookFilter) return false;
      return true;
    });
  }, [search, majorFilter, bandIdx, outlookFilter]);

  const clearAll = () => {
    setSearch("");
    setMajorFilter("");
    setBandIdx(0);
    setOutlookFilter("");
  };

  const hasFilters = search || majorFilter || bandIdx > 0 || outlookFilter;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="font-mono-label text-xs uppercase tracking-wider text-gold">Career Explorer</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-2 mb-2">
            What can you <span className="italic text-gold">do</span> with a degree?
          </h1>
          <p className="font-body text-navy/60 max-w-2xl">
            Real BLS salary data and 10-year outlook for {CAREERS.length}+ careers — tied to the majors that lead there.
          </p>
        </div>

        <div className="ktc-card p-4 sm:p-6 mb-8">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Software, nurse, architect…"
                className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">Major</label>
              <select
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy bg-white focus:outline-none focus:border-gold/60"
              >
                <option value="">All majors</option>
                {majors.map((m) => (
                  <option key={m.slug} value={m.slug}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">Median salary</label>
              <select
                value={bandIdx}
                onChange={(e) => setBandIdx(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy bg-white focus:outline-none focus:border-gold/60"
              >
                {SALARY_BANDS.map((b, i) => (
                  <option key={i} value={i}>{b.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">Outlook</label>
              <select
                value={outlookFilter}
                onChange={(e) => setOutlookFilter(e.target.value as OutlookLabel | "")}
                className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy bg-white focus:outline-none focus:border-gold/60"
              >
                <option value="">Any outlook</option>
                {OUTLOOKS.map((o) => (
                  <option key={o} value={o}>{OUTLOOK_LABELS[o].label}</option>
                ))}
              </select>
            </div>
            {hasFilters && (
              <button onClick={clearAll} className="px-4 py-2 text-sm font-body text-crimson hover:text-crimson/80 transition-colors">
                Clear all
              </button>
            )}
          </div>
        </div>

        {majorFilter && (
          <div className="mb-6 p-4 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-between gap-4">
            <p className="font-body text-sm text-navy">
              Showing careers related to <strong>{getMajorBySlug(majorFilter)?.label ?? majorFilter}</strong>.
            </p>
            <Link
              href={`/colleges/major/${majorFilter}`}
              className="font-body text-sm text-navy underline underline-offset-2 hover:text-gold whitespace-nowrap"
            >
              Best colleges for this major &rarr;
            </Link>
          </div>
        )}

        <p className="text-sm font-body text-navy/60 mb-4">
          Showing {filtered.length} of {CAREERS.length} careers
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
            <p className="font-body text-navy/60 mb-2">No careers match your filters.</p>
            <button onClick={clearAll} className="text-gold hover:text-gold/80 font-body text-sm font-medium">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => <CareerCard key={c.slug} career={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function CareerCard({ career }: { career: Career }) {
  const outlook = OUTLOOK_LABELS[career.outlookLabel];
  return (
    <Link
      href={`/careers/${career.slug}`}
      className="ktc-card p-5 block group hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <h3 className="font-display text-base font-bold text-navy group-hover:text-gold transition-colors leading-tight mb-1">
        {career.title}
      </h3>
      <p className="font-body text-sm text-navy/60 mb-4 flex-1">{career.shortDescription}</p>

      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono-label text-2xl font-bold text-gold leading-none">
          ${Math.round(career.medianSalary / 1000)}K
        </span>
        <span className="text-[10px] font-body uppercase tracking-wider text-navy/40">median / yr</span>
      </div>
      <div className="text-xs font-body text-navy/50 mb-3">
        Range: {formatSalary(career.salaryP10)} – {formatSalary(career.salaryP90)}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        <span className={`text-[11px] font-body font-medium px-2 py-0.5 rounded-full border ${outlook.color}`}>
          {career.outlookPct > 0 ? "+" : ""}{career.outlookPct}% by 2032
        </span>
      </div>

      <div className="text-xs font-body text-navy/50">
        {career.educationRequired}
      </div>
    </Link>
  );
}
