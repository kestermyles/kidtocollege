import { redirect } from "next/navigation";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase-server";
import ModerationActions from "./ModerationActions";

export const metadata = {
  title: "Review moderation — Admin",
};

export const revalidate = 0;

const ADMIN_EMAIL = "kestermyles@gmail.com";

interface PendingReview {
  id: string;
  college_slug: string;
  college_name: string;
  edu_email: string;
  display_handle: string | null;
  year_in_school: number | null;
  intended_major: string | null;
  hometown_state: string | null;
  why_chose: string;
  biggest_positive_surprise: string;
  biggest_negative_surprise: string;
  who_thrives: string | null;
  who_shouldnt_come: string | null;
  one_thing_to_senior: string;
  created_at: string;
  status: string;
}

export default async function ReviewModerationPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/");

  const supa = createServiceRoleClient();

  // Pull all pending reviews with their verification + college info
  const { data: rows } = await supa
    .from("college_reviews")
    .select(
      `
      id,
      college_slug,
      why_chose,
      biggest_positive_surprise,
      biggest_negative_surprise,
      who_thrives,
      who_shouldnt_come,
      one_thing_to_senior,
      created_at,
      status,
      verified_students!inner (
        edu_email,
        display_handle,
        year_in_school,
        intended_major,
        hometown_state
      ),
      colleges!inner (
        name
      )
    `,
    )
    .in("status", ["pending", "approved"])
    .order("created_at", { ascending: false })
    .limit(200);

  const reviews: PendingReview[] = (rows ?? []).map((r) => {
    const v = (
      Array.isArray(r.verified_students)
        ? r.verified_students[0]
        : r.verified_students
    ) as Record<string, unknown>;
    const c = (
      Array.isArray(r.colleges) ? r.colleges[0] : r.colleges
    ) as Record<string, unknown>;
    return {
      id: r.id as string,
      college_slug: r.college_slug as string,
      college_name: (c?.name as string) ?? r.college_slug,
      edu_email: (v?.edu_email as string) ?? "",
      display_handle: (v?.display_handle as string | null) ?? null,
      year_in_school: (v?.year_in_school as number | null) ?? null,
      intended_major: (v?.intended_major as string | null) ?? null,
      hometown_state: (v?.hometown_state as string | null) ?? null,
      why_chose: r.why_chose as string,
      biggest_positive_surprise: r.biggest_positive_surprise as string,
      biggest_negative_surprise: r.biggest_negative_surprise as string,
      who_thrives: r.who_thrives as string | null,
      who_shouldnt_come: r.who_shouldnt_come as string | null,
      one_thing_to_senior: r.one_thing_to_senior as string,
      created_at: r.created_at as string,
      status: r.status as string,
    };
  });

  const pending = reviews.filter((r) => r.status === "pending");
  const approved = reviews.filter((r) => r.status === "approved");

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-navy mb-2">
          Review moderation
        </h1>
        <p className="font-body text-navy/60 mb-8">
          {pending.length} pending · {approved.length} approved (last 200)
        </p>

        {pending.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold text-navy mb-4">
              Pending ({pending.length})
            </h2>
            <div className="space-y-4">
              {pending.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-display text-xl font-bold text-navy mb-4">
            Approved ({approved.length})
          </h2>
          {approved.length === 0 ? (
            <p className="font-body text-navy/50">No approved reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {approved.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: PendingReview }) {
  return (
    <article className="ktc-card p-5">
      <header className="mb-3 pb-3 border-b border-card">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h3 className="font-display text-lg font-bold text-navy">
            {review.college_name}
          </h3>
          <span
            className={`font-mono-label text-xs uppercase tracking-wider px-2 py-0.5 rounded ${
              review.status === "approved"
                ? "bg-sage/20 text-sage"
                : "bg-gold/20 text-gold"
            }`}
          >
            {review.status}
          </span>
        </div>
        <p className="font-body text-xs text-navy/50 mt-1">
          {review.edu_email} · {review.display_handle ?? "(no handle)"} ·{" "}
          {review.intended_major ?? "(no major)"} ·{" "}
          {review.hometown_state ?? "—"} ·{" "}
          {new Date(review.created_at).toLocaleString()}
        </p>
      </header>

      <dl className="space-y-3 mb-4">
        <Field q="Why chose" a={review.why_chose} />
        <Field q="+ Surprise" a={review.biggest_positive_surprise} />
        <Field q="− Surprise" a={review.biggest_negative_surprise} />
        {review.who_thrives && <Field q="Who thrives" a={review.who_thrives} />}
        {review.who_shouldnt_come && (
          <Field q="Who shouldn't" a={review.who_shouldnt_come} />
        )}
        <Field q="One thing to senior" a={review.one_thing_to_senior} />
      </dl>

      <ModerationActions
        reviewId={review.id}
        currentStatus={review.status}
      />
    </article>
  );
}

function Field({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <dt className="font-mono-label text-[10px] uppercase tracking-wider text-navy/40">
        {q}
      </dt>
      <dd className="font-body text-sm text-navy/80 mt-0.5">{a}</dd>
    </div>
  );
}
