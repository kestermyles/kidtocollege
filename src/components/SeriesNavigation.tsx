import Link from "next/link";

interface SeriesNavigationProps {
  currentPart: number;
  totalParts: number;
  seriesTitle: string;
  seriesSlug: string;
  previousUrl?: string;
  previousTitle?: string;
  nextUrl?: string;
  nextTitle?: string;
}

export function SeriesNavigation({
  currentPart,
  totalParts,
  seriesTitle,
  seriesSlug,
  previousUrl,
  previousTitle,
  nextUrl,
  nextTitle,
}: SeriesNavigationProps) {
  const seriesHref = `/blog/series/${seriesSlug}`;
  const isFinal = currentPart === totalParts;

  return (
    <nav className="my-12 border-t border-b border-card py-8" aria-label="Series navigation">
      <div className="font-mono-label text-[11px] uppercase tracking-wider text-gold mb-1">
        {seriesTitle}
      </div>
      <div className="font-display text-base font-bold text-navy mb-5">
        Part {currentPart} of {totalParts}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {previousUrl && previousTitle ? (
          <Link
            href={previousUrl}
            className="ktc-card p-4 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="font-mono-label text-[11px] uppercase tracking-wider text-navy/40 mb-1">
              &larr; Previous
            </div>
            <div className="font-display text-sm font-bold text-navy group-hover:text-gold transition-colors leading-snug">
              {previousTitle}
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextUrl && nextTitle ? (
          <Link
            href={nextUrl}
            className="ktc-card p-4 block group hover:shadow-lg hover:-translate-y-0.5 transition-all sm:text-right"
          >
            <div className="font-mono-label text-[11px] uppercase tracking-wider text-navy/40 mb-1">
              Next &rarr;
            </div>
            <div className="font-display text-sm font-bold text-navy group-hover:text-gold transition-colors leading-snug">
              {nextTitle}
            </div>
          </Link>
        ) : isFinal ? (
          <Link
            href={seriesHref}
            className="ktc-card p-4 block group hover:shadow-lg hover:-translate-y-0.5 transition-all sm:text-right"
          >
            <div className="font-mono-label text-[11px] uppercase tracking-wider text-gold mb-1">
              Series complete
            </div>
            <div className="font-display text-sm font-bold text-navy group-hover:text-gold transition-colors leading-snug">
              View all parts &rarr;
            </div>
          </Link>
        ) : null}
      </div>

      <Link
        href={seriesHref}
        className="font-body text-sm text-gold hover:text-gold/80 font-medium"
      >
        View all {totalParts} parts &rarr;
      </Link>
    </nav>
  );
}
