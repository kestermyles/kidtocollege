"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
  "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VT","VA","WA","WV","WI","WY",
];

interface Fair {
  name: string;
  date: string;
  city: string;
  state: string;
  venue: string;
  url: string;
  type: "NACAC" | "Regional" | "Virtual";
}

const FAIRS: Fair[] = [
  { name: "NACAC National College Fair — Houston", date: "2026-09-12", city: "Houston", state: "TX", venue: "George R. Brown Convention Center", url: "https://www.nacacnet.org/college-fairs/", type: "NACAC" },
  { name: "NACAC National College Fair — Boston", date: "2026-09-26", city: "Boston", state: "MA", venue: "Boston Convention & Exhibition Center", url: "https://www.nacacnet.org/college-fairs/", type: "NACAC" },
  { name: "NACAC National College Fair — Chicago", date: "2026-10-03", city: "Chicago", state: "IL", venue: "Navy Pier", url: "https://www.nacacnet.org/college-fairs/", type: "NACAC" },
  { name: "NACAC National College Fair — Los Angeles", date: "2026-10-10", city: "Los Angeles", state: "CA", venue: "Los Angeles Convention Center", url: "https://www.nacacnet.org/college-fairs/", type: "NACAC" },
  { name: "NACAC National College Fair — Washington DC", date: "2026-10-17", city: "Washington", state: "DC", venue: "Walter E. Washington Convention Center", url: "https://www.nacacnet.org/college-fairs/", type: "NACAC" },
  { name: "NACAC National College Fair — Atlanta", date: "2026-10-24", city: "Atlanta", state: "GA", venue: "Georgia World Congress Center", url: "https://www.nacacnet.org/college-fairs/", type: "NACAC" },
  { name: "NACAC National College Fair — Denver", date: "2026-11-07", city: "Denver", state: "CO", venue: "Colorado Convention Center", url: "https://www.nacacnet.org/college-fairs/", type: "NACAC" },
  { name: "NACAC Virtual College Fair — Fall", date: "2026-10-20", city: "Online", state: "", venue: "Virtual", url: "https://www.nacacnet.org/college-fairs/", type: "Virtual" },
  { name: "NACAC Virtual College Fair — Spring", date: "2027-03-15", city: "Online", state: "", venue: "Virtual", url: "https://www.nacacnet.org/college-fairs/", type: "Virtual" },
  { name: "TACAC College Fair — Dallas/Fort Worth", date: "2026-09-19", city: "Dallas", state: "TX", venue: "Irving Convention Center", url: "https://www.tacac.org", type: "Regional" },
  { name: "TACAC College Fair — Austin", date: "2026-09-26", city: "Austin", state: "TX", venue: "Palmer Events Center", url: "https://www.tacac.org", type: "Regional" },
  { name: "TACAC College Fair — San Antonio", date: "2026-10-03", city: "San Antonio", state: "TX", venue: "Henry B. Gonzalez Convention Center", url: "https://www.tacac.org", type: "Regional" },
  { name: "WACAC College Fair — San Francisco", date: "2026-09-20", city: "San Francisco", state: "CA", venue: "Moscone Center", url: "https://www.wacac.org", type: "Regional" },
  { name: "NEACAC College Fair — New York", date: "2026-10-14", city: "New York", state: "NY", venue: "Jacob K. Javits Convention Center", url: "https://www.neacac.org", type: "Regional" },
  { name: "SACAC College Fair — Charlotte", date: "2026-10-08", city: "Charlotte", state: "NC", venue: "Charlotte Convention Center", url: "https://www.sacac.org", type: "Regional" },
  { name: "IACAC College Fair — Chicago Suburbs", date: "2026-09-27", city: "Rosemont", state: "IL", venue: "Donald E. Stephens Convention Center", url: "https://www.iacac.org", type: "Regional" },
  { name: "PACAC College Fair — Philadelphia", date: "2026-10-11", city: "Philadelphia", state: "PA", venue: "Pennsylvania Convention Center", url: "https://www.pacac.org", type: "Regional" },
  { name: "SACAC College Fair — Miami", date: "2026-10-22", city: "Miami", state: "FL", venue: "Miami Beach Convention Center", url: "https://www.sacac.org", type: "Regional" },
  { name: "Performing & Visual Arts College Fair — Virtual", date: "2026-11-14", city: "Online", state: "", venue: "Virtual", url: "https://www.nacacnet.org/college-fairs/", type: "Virtual" },
  { name: "STEM College Fair — Virtual", date: "2027-01-25", city: "Online", state: "", venue: "Virtual", url: "https://www.nacacnet.org/college-fairs/", type: "Virtual" },
];

export default function CollegeFairsPage() {
  const [stateFilter, setStateFilter] = useState("");

  const now = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    let list = [...FAIRS].sort((a, b) => a.date.localeCompare(b.date));
    if (stateFilter) {
      list = list.filter((f) => f.state === stateFilter || f.type === "Virtual");
    }
    return list;
  }, [stateFilter]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
            College Fairs 2026–2027
          </h1>
          <p className="font-body text-navy/60">
            Meet admissions officers face-to-face. NACAC national fairs, regional
            events, and virtual options.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 mb-8">
          <p className="text-sm text-amber-900">
            <strong>Dates and venues are estimated</strong> based on typical annual schedules. Always verify at{" "}
            <a href="https://www.nacacattend.org" target="_blank" rel="noopener noreferrer" className="underline font-medium">nacacattend.org</a>{" "}
            before attending.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-8 items-center">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-md font-body text-navy text-sm focus:outline-none focus:border-gold/60 bg-white"
          >
            <option value="">All locations</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="font-body text-sm text-navy/40">
            {filtered.length} events
          </span>
        </div>

        {/* Fair cards */}
        <div className="space-y-4">
          {filtered.map((fair, i) => {
            const isPast = fair.date < now;
            return (
              <div
                key={`${fair.name}-${i}`}
                className={`ktc-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
                  isPast ? "opacity-50" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-body font-medium text-navy text-sm">
                      {fair.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        fair.type === "NACAC"
                          ? "bg-gold/15 text-gold"
                          : fair.type === "Virtual"
                          ? "bg-sage/15 text-sage"
                          : "bg-navy/10 text-navy/60"
                      }`}
                    >
                      {fair.type}
                    </span>
                  </div>
                  <p className="font-body text-xs text-navy/50">
                    {fair.venue}
                    {fair.city && ` — ${fair.city}, ${fair.state}`}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-mono-label text-xs text-navy/60">
                    {new Date(fair.date + "T12:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </span>
                  <a
                    href={fair.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold text-sm font-body font-medium hover:text-gold/80"
                  >
                    Details &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>


        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/coach"
            className="px-5 py-2.5 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors"
          >
            The Coach
          </Link>
          <Link
            href="/deadlines"
            className="px-5 py-2.5 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors"
          >
            Application Deadlines
          </Link>
        </div>
      </div>
    </div>
  );
}
