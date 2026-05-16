import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { createServiceRoleClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Thanks for your review",
};

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReviewThanksPage({ params }: PageProps) {
  const { slug } = await params;
  const supa = createServiceRoleClient();
  const { data: college } = await supa
    .from("colleges")
    .select("name")
    .eq("slug", slug)
    .single();
  const name = college?.name ?? "your school";

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4">
      <FadeIn>
        <div className="max-w-xl mx-auto ktc-card p-8 text-center">
          <div className="font-display text-5xl mb-4">✓</div>
          <h1 className="font-display text-2xl text-navy mb-3">
            Submitted. Thank you.
          </h1>
          <p className="font-body text-navy/70 mb-6">
            We&apos;ll review your submission for spam/abuse — usually
            within 24 hours — then publish it on the {name} page. We
            don&apos;t edit for sentiment. Your name stays private.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/college/${slug}`}
              className="px-5 py-3 bg-gold hover:bg-gold/90 text-navy font-body font-medium rounded-md transition-colors text-sm"
            >
              View {name} page
            </Link>
            <Link
              href="/"
              className="px-5 py-3 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white"
            >
              Back to KidToCollege
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
