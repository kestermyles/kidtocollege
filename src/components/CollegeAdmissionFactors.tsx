import { unstable_noStore as noStore } from "next/cache"
import { createServiceRoleClient } from "@/lib/supabase-server"

const FACTOR_LABELS: Record<string, string> = {
  gpa: "GPA",
  class_rank: "Class Rank",
  test_scores: "Test Scores",
  recommendation: "Recommendations",
  extracurriculars: "Extracurriculars",
  first_generation: "First Generation",
  geographic_residence: "Geographic Diversity",
  state_residency: "State Residency",
  volunteer_work: "Volunteer Work",
  work_experience: "Work Experience",
  talent_ability: "Talent / Ability",
  character_personal: "Character",
  alumni_relation: "Legacy",
  racial_ethnic_status: "Racial / Ethnic Status",
}

export async function CollegeAdmissionFactors({ slug }: { slug: string }) {
  noStore()
  const svc = createServiceRoleClient()

  const { data: factors } = await svc
    .from("college_admission_factors")
    .select("factor, weight")
    .eq("college_slug", slug)
    .in("weight", ["very_important", "important"])
    .order("weight", { ascending: true })

  if (!factors || factors.length === 0) return null

  const veryImportant = factors.filter((f) => f.weight === "very_important")
  const important = factors.filter((f) => f.weight === "important")

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
          What they weigh most
        </h2>
        <div className="flex flex-wrap gap-2">
          {veryImportant.map((f) => (
            <span
              key={f.factor}
              className="bg-navy text-white text-xs font-body px-2 py-1 rounded-full"
            >
              {FACTOR_LABELS[f.factor] || f.factor}
            </span>
          ))}
          {important.map((f) => (
            <span
              key={f.factor}
              className="border border-navy text-navy text-xs font-body px-2 py-1 rounded-full"
            >
              {FACTOR_LABELS[f.factor] || f.factor}
            </span>
          ))}
        </div>
        <p className="text-xs text-navy/40 font-body mt-3">
          Source: Common Data Set
        </p>
      </div>
    </section>
  )
}
