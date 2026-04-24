import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { getSeriesPosts } from "@/lib/blog-posts";

const SERIES_SLUG = "college-essay-guide-2026";
const SERIES_NAME = "The Complete Guide to Writing College Essays in 2026";
const SERIES_INTRO =
  "A 6-part series on writing college essays that actually sound like you — from understanding the prompts to avoiding the mistakes that make essays invisible.";

export const metadata: Metadata = {
  title: `${SERIES_NAME} | KidToCollege`,
  description: SERIES_INTRO,
  alternates: {
    canonical: `https://www.kidtocollege.com/blog/series/${SERIES_SLUG}`,
  },
  openGraph: {
    title: SERIES_NAME,
    description: SERIES_INTRO,
    type: "website",
  },
};

// Planned outline for the series — used as a fallback before all posts are published.
const OUTLINE: { part: number; title: string; excerpt: string; slug: string }[] = [
  {
    part: 1,
    title: "Common App Essay Prompts 2026–2027",
    excerpt: "The seven prompts, what they're really asking, and how to choose yours.",
    slug: "common-app-prompts-2026-2027",
  },
  {
    part: 2,
    title: "What Makes College Essays Actually Work",
    excerpt: "The fundamentals of strong vs weak essays — and what admissions officers actually care about.",
    slug: "what-makes-college-essays-work",
  },
  {
    part: 3,
    title: "Using AI for College Essays: Where's the Line?",
    excerpt: "AI can help — but there's a line between brainstorming and letting it write for you.",
    slug: "using-ai-for-college-essays",
  },
  {
    part: 4,
    title: "The Talk-First Method",
    excerpt: "How to write essays that sound like you by talking first, typing second.",
    slug: "talk-first-method-college-essays",
  },
  {
    part: 5,
    title: "Show Don't Tell (With Real Examples)",
    excerpt: "What this actually means and how to do it, with before/after examples.",
    slug: "show-dont-tell-college-essays",
  },
  {
    part: 6,
    title: "Common Mistakes That Make You Invisible",
    excerpt: "What to avoid and how to fix it when your essay sounds like everyone else's.",
    slug: "college-essay-mistakes-to-avoid",
  },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CollegeEssayGuideSeriesPage() {
  const published = getSeriesPosts(SERIES_SLUG);
  const publishedBySlug = new Map(published.map((p) => [p.slug, p]));

  const parts = OUTLINE.map((o) => {
    const post = publishedBySlug.get(o.slug);
    return {
      ...o,
      published: !!post,
      publishedDate: post?.publishedDate,
      // Prefer the BlogPost's own excerpt/intro if available.
      excerpt: post?.excerpt ?? post?.intro ?? o.excerpt,
      title: post?.title ?? o.title,
    };
  });

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <Link href="/blog" className="font-body text-sm text-navy/50 hover:text-gold mb-6 inline-block">
            &larr; Back to all guides
          </Link>
          <span className="font-mono-label text-xs uppercase tracking-wider text-gold">Series</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-2 mb-3">
            {SERIES_NAME}
          </h1>
          <p className="font-body text-lg text-navy/70 max-w-2xl mb-10">{SERIES_INTRO}</p>
        </FadeIn>

        <div className="space-y-4 mb-12">
          {parts.map((p) => {
            const body = (
              <>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <span className="font-mono-label text-[11px] uppercase tracking-wider text-gold">
                    Part {p.part} of {OUTLINE.length}
                  </span>
                  {p.publishedDate && (
                    <span className="font-mono-label text-[11px] text-navy/40">
                      {formatDate(p.publishedDate)}
                    </span>
                  )}
                  {!p.published && (
                    <span className="font-mono-label text-[11px] text-navy/40">Coming soon</span>
                  )}
                </div>
                <h2 className="font-display text-xl font-bold text-navy group-hover:text-gold transition-colors leading-snug mb-2">
                  {p.title}
                </h2>
                <p className="font-body text-sm text-navy/60 mb-3">{p.excerpt}</p>
                {p.published ? (
                  <span className="font-body text-sm text-gold font-medium">
                    Read Part {p.part} &rarr;
                  </span>
                ) : (
                  <span className="font-body text-sm text-navy/40">Publishing soon</span>
                )}
              </>
            );

            return p.published ? (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="ktc-card p-6 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {body}
              </Link>
            ) : (
              <div
                key={p.slug}
                className="ktc-card p-6 block group opacity-70"
              >
                {body}
              </div>
            );
          })}
        </div>

        <div className="ktc-card p-6 bg-cream border-none">
          <h3 className="font-display text-xl font-bold text-navy mb-3">Free tools to help</h3>
          <div className="space-y-2">
            <Link href="/essays" className="block font-body text-sm text-navy hover:text-gold">
              &rarr; Essay Coach — work through your drafts step by step
            </Link>
            <Link href="/coach/roadmap" className="block font-body text-sm text-navy hover:text-gold">
              &rarr; College Roadmap — see when to work on essays in your timeline
            </Link>
            <Link href="/" className="block font-body text-sm text-navy hover:text-gold">
              &rarr; Ask Sam — get brainstorming help from our AI coach
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
