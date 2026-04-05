import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import { blogPosts, getBlogPost } from "@/lib/blog-posts";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `https://www.kidtocollege.com/blog/${slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.h1,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate,
    author: { "@type": "Organization", name: "KidToCollege Editorial Team" },
    publisher: { "@type": "Organization", name: "KidToCollege", url: "https://kidtocollege.com" },
    url: `https://www.kidtocollege.com/blog/${slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.kidtocollege.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.kidtocollege.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://www.kidtocollege.com/blog/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <article className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            {/* Breadcrumb */}
            <nav className="font-mono-label text-xs uppercase tracking-wider text-navy/40 mb-6">
              <Link href="/" className="hover:text-navy/60 transition-colors">Home</Link>
              {" / "}
              <Link href="/blog" className="hover:text-navy/60 transition-colors">Blog</Link>
              {" / "}
              <span className="text-navy/60">{post.title.slice(0, 40)}...</span>
            </nav>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono-label text-xs text-navy/40">{post.readTime}</span>
              <span className="text-navy/20">|</span>
              <span className="font-mono-label text-xs text-navy/40">
                Updated {new Date(post.updatedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4 leading-tight">
              {post.h1}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-cream text-navy/60 text-xs font-body rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Intro */}
            <p className="font-body text-lg text-navy/80 leading-relaxed mb-10">
              {post.intro}
            </p>
          </FadeIn>

          {/* Sections */}
          {post.sections.map((section, i) => (
            <div key={i}>
              <FadeIn>
                <section className="mb-10">
                  <h2 className="font-display text-2xl font-bold text-navy mb-4">
                    {section.h2}
                  </h2>
                  <div className="font-body text-navy/80 leading-relaxed whitespace-pre-line">
                    {section.body}
                  </div>
                </section>
              </FadeIn>

              {/* CTA after section 2 */}
              {i === 1 && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 mb-10 text-center">
                  <p className="font-body font-medium text-navy mb-3">
                    Where do you stand?
                  </p>
                  <Link
                    href="/my-chances"
                    className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors"
                  >
                    Check your admission chances free &rarr;
                  </Link>
                </div>
              )}

              {/* CTA after section 4 */}
              {i === 3 && (
                <div className="bg-sage/10 border border-sage/20 rounded-lg p-6 mb-10 text-center">
                  <p className="font-body font-medium text-navy mb-3">
                    Don&apos;t leave money on the table
                  </p>
                  <Link
                    href="/scholarships"
                    className="inline-block bg-sage hover:bg-sage/90 text-white font-body font-medium px-6 py-3 rounded-md transition-colors"
                  >
                    Find scholarships you qualify for &rarr;
                  </Link>
                </div>
              )}
            </div>
          ))}

          {/* Bottom links */}
          <div className="flex flex-wrap gap-3 mb-12 pt-6 border-t border-card">
            <Link href="/financial-aid/calculator" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors">Net price calculator</Link>
            <Link href="/coach" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors">The Coach</Link>
            <Link href="/essays" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors">Essay prompts</Link>
          </div>

          {/* Related posts */}
          <div>
            <h2 className="font-display text-xl font-bold text-navy mb-4">
              Related guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="ktc-card p-4 block group hover:shadow-md transition-all"
                >
                  <h3 className="font-body text-sm font-medium text-navy group-hover:text-gold transition-colors leading-tight mb-1">
                    {r.title}
                  </h3>
                  <span className="font-mono-label text-xs text-navy/40">
                    {r.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
