import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { breadcrumbsLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Why I Built KidToCollege — A Parent's Story",
  description:
    "I'm a British parent who moved to Texas and found myself baffled by the cost of US college. I built KidToCollege so every family has the tools wealthy families have always had — for free.",
  alternates: { canonical: "https://www.kidtocollege.com/about" },
};

const breadcrumbs = breadcrumbsLd([
  { label: "Home", path: "/" },
  { label: "About" },
]);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <span className="font-mono-label text-xs uppercase tracking-wider text-gold">
            A note from the founder
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-3 mb-8 leading-tight">
            I built this because I needed it myself.
          </h1>
          <div className="font-body text-navy/80 space-y-5 leading-relaxed text-lg">
            <p>
              I&apos;m Kester. I&apos;m a parent, I&apos;m British, and a few years ago I
              moved my family from the UK to Texas. My son&apos;s in marching band,
              his college applications are around the corner, and somewhere along
              the way I realized I had no idea what I was doing.
            </p>
            <p>
              In the UK, the cost of university is roughly a tenth of what
              it is here. The application process is shorter. The vocabulary
              is different. The first time someone told me a private college
              counselor could cost $15,000, I genuinely thought they were
              joking. They weren&apos;t.
            </p>
            <p>
              The deeper I dug, the more I noticed two systems running in
              parallel. Families who can pay $15,000 get a person who answers
              their texts, reads their essays, walks them through financial
              aid, picks target schools that fit, and quietly knows which
              scholarships their kid is auto-qualified for. Families who
              can&apos;t pay get a school counselor with 350 other students,
              a stack of PDFs, and Google.
            </p>
            <p>
              The information is&nbsp;
              <em>all out there</em>. Common Data Sets are public. FAFSA is
              public. Scholarship databases exist. The College Scorecard has
              earnings data. But you have to know what to look for, where it
              lives, and how to read it. That&apos;s what the $15,000 buys —
              not secret information, just a guide who has done it before.
            </p>
            <p>
              So I started building one for myself. A roadmap that knew where
              I was. A research report that pulled the right numbers. A
              scholarship finder that actually surfaced the ones our family
              qualified for. The more I built, the more obvious it became
              that every other parent I talked to was in the same boat — just
              quieter about it.
            </p>
            <p>
              KidToCollege is that tool, opened up. Everything a $15,000
              counselor does — research, essay help, deadlines, scholarships,
              the awkward financial aid math — for free, for any family that
              wants it.
            </p>
            <p className="font-medium text-navy">
              No paywalls. No premium tier. We don&apos;t sell your personal data
              to advertisers or brokers — full details are in the{" "}
              <Link
                href="/privacy"
                className="text-gold underline underline-offset-2 hover:text-gold/80"
              >
                privacy policy
              </Link>
              .
            </p>
            <p className="text-navy/70">
              If it helps you, that&apos;s the whole point. If something&apos;s
              broken or you wish it did something it doesn&apos;t, tell me — I
              read everything that comes in.
            </p>
            <p className="text-navy/60 italic pt-2">
              — Kester
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-card">
            <p className="font-body text-sm text-navy/60 mb-4">
              Start where it makes sense for your family:
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/my-chances"
                className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors"
              >
                See your chances &rarr;
              </Link>
              <Link
                href="/scholarships"
                className="bg-white hover:bg-cream text-navy font-body font-medium px-6 py-3 rounded-md transition-colors border border-card"
              >
                Find scholarships
              </Link>
              <Link
                href="/roadmap"
                className="bg-white hover:bg-cream text-navy font-body font-medium px-6 py-3 rounded-md transition-colors border border-card"
              >
                See the roadmap
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
