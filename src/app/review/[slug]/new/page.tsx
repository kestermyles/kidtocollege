import { redirect } from "next/navigation";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase-server";
import { FadeIn } from "@/components/FadeIn";
import ReviewForm from "./ReviewForm";

export const metadata = {
  title: "Write a verified review",
};

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WriteReviewPage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/verify-student");

  const supa = createServiceRoleClient();

  // Confirm the user has a verified_students row for this school.
  const { data: verification } = await supa
    .from("verified_students")
    .select("id, college_slug, display_handle, year_in_school, intended_major")
    .eq("user_id", user.id)
    .eq("college_slug", slug)
    .maybeSingle();
  if (!verification) redirect("/verify-student/complete");

  // Confirm college exists + get name for display
  const { data: college } = await supa
    .from("colleges")
    .select("name, location")
    .eq("slug", slug)
    .single();
  if (!college) redirect("/colleges");

  // Existing review? Don't allow a second submission.
  const { data: existingReview } = await supa
    .from("college_reviews")
    .select("id, status")
    .eq("verified_student_id", verification.id)
    .eq("college_slug", slug)
    .maybeSingle();

  if (existingReview) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 px-4">
        <FadeIn>
          <div className="max-w-xl mx-auto ktc-card p-8 text-center">
            <h1 className="font-display text-2xl text-navy mb-3">
              You&apos;ve already submitted a review for {college.name}
            </h1>
            <p className="font-body text-navy/70">
              Status: <strong>{existingReview.status}</strong>. We allow one
              review per verified student per school. Email{" "}
              <a
                href="mailto:hello@kidtocollege.com"
                className="text-gold hover:underline"
              >
                hello@kidtocollege.com
              </a>{" "}
              if you need to update it.
            </p>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4">
      <FadeIn>
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-3">
            Tell prospective students about {college.name}
          </h1>
          <p className="font-body text-navy/70 mb-6 leading-relaxed">
            Five short questions. Be honest — the goal is to help a 17-year-old
            you don&apos;t know make a better decision than they would without
            you. We moderate reviews for spam/abuse but never for sentiment.
          </p>
          <ReviewForm
            slug={slug}
            collegeName={college.name}
            verifiedStudentId={verification.id}
          />
        </div>
      </FadeIn>
    </div>
  );
}
