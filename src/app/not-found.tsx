import Link from "next/link";

const QUICK_LINKS = [
  { href: "/search", label: "Find a College" },
  { href: "/financial-aid", label: "Financial Aid" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/fafsa-guide", label: "FAFSA Guide" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-mono-label text-xs uppercase tracking-wider text-gold mb-4">
          404
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">
          We couldn&apos;t find that page
        </h1>
        <p className="font-body text-navy/60 mb-10">
          The page you&apos;re looking for may have moved or doesn&apos;t exist.
          Try searching for a college or use one of the links below.
        </p>

        {/* Search box */}
        <form action="/search" method="get" className="max-w-md mx-auto mb-12">
          <div className="flex gap-3">
            <input
              type="text"
              name="college"
              placeholder="Search for a college..."
              className="flex-1 px-4 py-3 border border-card rounded-md font-body text-navy placeholder:text-navy/30 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            />
            <button
              type="submit"
              className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 justify-center">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
