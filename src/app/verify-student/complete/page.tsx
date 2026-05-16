import { redirect } from "next/navigation";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase-server";
import { FadeIn } from "@/components/FadeIn";
import CompleteVerificationForm from "./CompleteVerificationForm";

export const metadata = {
  title: "Complete your student verification",
};

export const revalidate = 0;

// Server component: confirms user is signed in with a .edu email,
// looks up the college by domain, and renders the profile form.
export default async function CompleteVerificationPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/verify-student?error=not-signed-in");

  const email = user.email?.toLowerCase() ?? "";
  if (!email.endsWith(".edu")) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 px-4">
        <FadeIn>
          <div className="max-w-xl mx-auto ktc-card p-8 text-center">
            <h1 className="font-display text-2xl text-navy mb-3">
              That email isn&apos;t a .edu address
            </h1>
            <p className="font-body text-navy/70">
              You signed in with <strong>{email}</strong>, but our review
              system requires a school-issued .edu email. Sign out and try
              again with your university email.
            </p>
          </div>
        </FadeIn>
      </div>
    );
  }

  const domain = email.split("@")[1];

  // Lookup college by edu_domain. There can be more than one match for
  // multi-campus systems (e.g. uc system); we'll let the user pick.
  const supa = createServiceRoleClient();
  const { data: matches } = await supa
    .from("colleges")
    .select("slug, name, location")
    .eq("edu_domain", domain)
    .order("name");

  // Check if already verified
  const { data: existing } = await supa
    .from("verified_students")
    .select("id, college_slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    redirect(`/review/${existing.college_slug}/new`);
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 px-4">
        <FadeIn>
          <div className="max-w-xl mx-auto ktc-card p-8">
            <h1 className="font-display text-2xl text-navy mb-3">
              We don&apos;t recognize that school yet
            </h1>
            <p className="font-body text-navy/70 mb-4">
              Your email domain (<strong>{domain}</strong>) isn&apos;t mapped
              to a college in our database. This is usually because the
              school uses a different domain for email than for their
              website. Email us at{" "}
              <a
                href="mailto:hello@kidtocollege.com"
                className="text-gold hover:underline"
              >
                hello@kidtocollege.com
              </a>{" "}
              and we&apos;ll add it manually within 24 hours.
            </p>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4">
      <FadeIn>
        <div className="max-w-xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-navy mb-3">
            Verified! One more step.
          </h1>
          <p className="font-body text-navy/70 mb-6">
            Tell us a little about you so other students reading your
            review know who&apos;s talking. None of this is published
            literally — readers just see a handle like &ldquo;Junior,
            CS, &lsquo;26.&rdquo;
          </p>
          <CompleteVerificationForm
            email={email}
            schoolOptions={matches}
            userId={user.id}
          />
        </div>
      </FadeIn>
    </div>
  );
}
