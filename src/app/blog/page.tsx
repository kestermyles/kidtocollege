import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "College Admissions Blog: Free Guides for Students & Families",
  description:
    "Expert guides on college admissions, scholarships, FAFSA, essays, and financial aid. Free, practical advice for students and families.",
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
            Guides &amp; Articles
          </h1>
          <p className="font-body text-navy/60 mb-10">
            Practical guides on college admissions, scholarships, essays, and
            financial aid — researched, clear, and free.
          </p>
        </FadeIn>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="ktc-card p-6 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy group-hover:text-gold transition-colors mb-2 leading-tight">
                    {post.title}
                  </h2>
                  <p className="font-body text-sm text-navy/60 mb-3 line-clamp-2">
                    {post.intro}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-cream text-navy/50 text-xs font-body rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="font-mono-label text-xs text-navy/40 block">
                    {post.readTime}
                  </span>
                  <span className="font-mono-label text-xs text-navy/30 block mt-1">
                    {new Date(post.updatedDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
