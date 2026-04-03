"use client";

import Link from "next/link";

export function LeagueRedirectInput() {
  return (
    <div className="max-w-md mx-auto">
      <label
        htmlFor="league-major"
        className="block text-sm font-body font-medium text-navy mb-2"
      >
        What do you want to study?
      </label>
      <div className="flex gap-3">
        <input
          id="league-major"
          type="text"
          placeholder="Enter a subject..."
          className="flex-1 px-4 py-3 border border-card rounded-md font-body text-navy placeholder:text-navy/30 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
          readOnly
          onFocus={(e) => {
            e.target.blur();
            window.location.href = "/search?mode=league";
          }}
        />
        <Link
          href="/search?mode=league"
          className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors whitespace-nowrap"
        >
          Search
        </Link>
      </div>
    </div>
  );
}
