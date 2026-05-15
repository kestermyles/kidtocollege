import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import {
  CAREERS,
  getCareerBySlug,
  OUTLOOK_LABELS,
  type Career,
} from "@/lib/careers-data";
import { getMajorBySlug, MAJOR_PAGES } from "@/lib/major-pages-data";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { COLLEGES_SEED } from "@/lib/colleges-seed";

export const revalidate = 86400;

export function generateStaticParams() {
  return CAREERS.map((c) => ({ slug: c.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = getCareerBySlug(slug);
  if (!career) return {};
  return {
    title: `${career.title}: Salary, Outlook & Majors That Lead Here`,
    description: `Median salary $${Math.round(career.medianSalary / 1000)}K, ${career.outlookPct > 0 ? "+" : ""}${career.outlookPct}% growth by 2032. ${career.shortDescription}`,
    alternates: {
      canonical: `https://www.kidtocollege.com/careers/${slug}`,
    },
  };
}

type CollegeRow = {
  slug: string;
  name: string;
  location: string;
  acceptance_rate: number | null;
};

async function fetchColleges(career: Career): Promise<CollegeRow[]> {
  const keywords = career.relatedMajorSlugs
    .map((s) => MAJOR_PAGES.find((m) => m.slug === s)?.keywords ?? [])
    .flat();
  if (keywords.length === 0) return [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createServiceRoleClient();
      const { data } = await supabase
        .from("colleges")
        .select("slug, name, location, acceptance_rate")
        .overlaps("programs", keywords)
        .order("total_enrollment", { ascending: false, nullsFirst: false })
        .limit(12);
      if (data && data.length > 0) return data as CollegeRow[];
    } catch {
      // fall through
    }
  }

  const lower = keywords.map((k) => k.toLowerCase());
  return COLLEGES_SEED.filter((c) =>
    c.programs?.some((p) => lower.some((k) => p.toLowerCase().includes(k)))
  )
    .slice(0, 12)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      location: c.location,
      acceptance_rate: c.acceptance_rate,
    }));
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const career = getCareerBySlug(slug);
  if (!career) notFound();

  const outlook = OUTLOOK_LABELS[career.outlookLabel];
  const colleges = await fetchColleges(career);

  const salaryRange = career.salaryP90 - career.salaryP10;
  const medianPos =
    salaryRange === 0 ? 50 : ((career.medianSalary - career.salaryP10) / salaryRange) * 100;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="font-mono-label text-xs uppercase tracking-wider text-navy/40 mb-6">
          <Link href="/" className="hover:text-navy/70 transition-colors">Home</Link>
          {" / "}
          <Link href="/careers" className="hover:text-navy/70 transition-colors">Careers</Link>
          {" / "}
          <span className="text-navy/60">{career.title}</span>
        </nav>

        <FadeIn>
          <span className="font-mono-label text-xs uppercase tracking-wider text-gold">Career</span>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-navy leading-tight mt-2 mb-4">
            {career.title}
          </h1>
          <p className="font-body text-lg text-navy/70 max-w-3xl mb-10">
            {career.shortDescription}
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="ktc-card p-5">
            <div className="text-[10px] font-mono-label uppercase tracking-wider text-navy/40">Median salary</div>
            <div className="font-mono-label text-3xl font-bold text-gold mt-1">${Math.round(career.medianSalary / 1000)}K</div>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/30 to-gold rounded-full" />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-navy rounded-full"
                style={{ left: `${Math.max(0, Math.min(100, medianPos))}%`, transform: "translate(-50%, -50%)" }}
              />
            </div>
            <div className="flex justify-between text-xs font-body text-navy/50 mt-1.5">
              <span>${Math.round(career.salaryP10 / 1000)}K</span>
              <span>${Math.round(career.salaryP90 / 1000)}K</span>
            </div>
          </div>

          <div className="ktc-card p-5">
            <div className="text-[10px] font-mono-label uppercase tracking-wider text-navy/40">2022&ndash;2032 outlook</div>
            <div className="font-mono-label text-3xl font-bold text-navy mt-1">
              {career.outlookPct > 0 ? "+" : ""}{career.outlookPct}%
            </div>
            <span className={`inline-block mt-2 text-xs font-body font-medium px-2 py-0.5 rounded-full border ${outlook.color}`}>
              {outlook.label}
            </span>
            {career.growthNote && (
              <p className="mt-2 text-xs font-body text-navy/60">{career.growthNote}</p>
            )}
          </div>

          <div className="ktc-card p-5">
            <div className="text-[10px] font-mono-label uppercase tracking-wider text-navy/40">Education</div>
            <div className="font-body text-sm text-navy mt-2 leading-snug">{career.educationRequired}</div>
            <a
              href={`https://www.onetonline.org/link/summary/${career.soc}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs font-body text-gold hover:underline"
            >
              O*NET SOC {career.soc} &rarr;
            </a>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-navy mb-4">A day in the life</h2>
          <ul className="space-y-2">
            {career.dayInLife.map((d, i) => (
              <li key={i} className="flex gap-3 font-body text-navy/75">
                <span className="font-mono-label text-gold font-bold shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-navy mb-4">What you&apos;ll actually do</h2>
          <ul className="space-y-2">
            {career.topTasks.map((t, i) => (
              <li key={i} className="flex gap-3 font-body text-navy/75">
                <span className="text-gold shrink-0">&rarr;</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-navy mb-4">Majors that lead here</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {career.relatedMajorSlugs.map((m) => {
              const major = getMajorBySlug(m);
              if (!major) return null;
              return (
                <Link
                  key={m}
                  href={`/colleges/major/${m}`}
                  className="ktc-card p-4 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="font-display text-base font-bold text-navy group-hover:text-gold transition-colors mb-1">
                    {major.label}
                  </div>
                  <div className="text-xs font-body text-navy/50 line-clamp-2">{major.careerPaths}</div>
                </Link>
              );
            })}
          </div>
        </section>

        {colleges.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-navy mb-4">
              Top colleges for this path
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {colleges.map((c) => (
                <Link
                  key={c.slug}
                  href={`/college/${c.slug}`}
                  className="ktc-card p-4 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="font-display text-sm font-bold text-navy group-hover:text-gold transition-colors leading-tight">
                    {c.name}
                  </div>
                  <div className="text-xs font-body text-navy/50 mt-1">{c.location}</div>
                  {c.acceptance_rate != null && (
                    <div className="text-xs font-body text-navy/40 mt-1">{c.acceptance_rate}% acceptance</div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="p-6 rounded-lg bg-gold/10 border border-gold/30">
          <h3 className="font-display text-lg font-bold text-navy mb-1">See how you stack up</h3>
          <p className="font-body text-sm text-navy/70 mb-4">
            Get your personalized match score for colleges strong in this path.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/matches`}
              className="px-5 py-2.5 bg-gold text-navy rounded-md font-body text-sm font-medium hover:bg-gold/90 transition-colors"
            >
              My Matches &rarr;
            </Link>
            <Link
              href={`/scholarships?match=1`}
              className="px-5 py-2.5 border border-gold/40 text-navy rounded-md font-body text-sm font-medium hover:bg-gold/10 transition-colors"
            >
              Find scholarships
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
