import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const { gpa, sat, act, state, major, savedColleges, specificCollege } = await req.json()
  if (!gpa || !state || !major) return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

  const client = new Anthropic()

  // If a specific college is provided, evaluate that first + similar colleges
  // Otherwise use saved colleges or defaults
  let collegeList: string[]
  let specificCollegeNote = ""

  if (specificCollege?.name) {
    collegeList = [specificCollege.name]
    specificCollegeNote = `\n\nThe student is specifically interested in ${specificCollege.name}. Evaluate this college first with extra detail — include its actual acceptance rate, cost of attendance, and any scholarships for ${major} students. Then suggest 3-5 similar colleges the student should also consider based on their profile.`
  } else if (savedColleges?.length > 0) {
    collegeList = savedColleges.slice(0, 8)
  } else {
    collegeList = ["University of Texas at Austin","Texas A&M University","University of California Los Angeles","University of Michigan","New York University","University of Florida"]
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `You are a college admissions expert with deep knowledge of US admission statistics.

Student profile:
- Unweighted GPA: ${gpa}
- SAT: ${sat || "not provided"}
- ACT: ${act || "not provided"}
- Home state: ${state}
- Intended major: ${major}

Colleges to evaluate:
${collegeList.map((c: string, i: number) => `${i + 1}. ${c}`).join("\n")}${specificCollegeNote}

For each college return:
- college: college name
- slug: URL slug (lowercase, hyphens only)
- likelihood: "Safety" | "Likely" | "Match" | "Reach"
- percentage: integer 0-95 (admission probability for this specific student)
- reasoning: 1-2 sentences citing actual median GPA/test ranges for that college
- tips: 2-3 specific actionable improvements (cite actual score targets, named programs, real deadlines)

Account for in-state advantage, major competitiveness, and holistic factors.

Respond ONLY with valid JSON, no markdown:
{"results":[{"college":"...","slug":"...","likelihood":"...","percentage":0,"reasoning":"...","tips":["...","..."]}]}`
    }]
  })

  const text = message.content.filter((b) => b.type === "text").map((b) => (b as { type: "text"; text: string }).text).join("")
  let parsed
  try { parsed = JSON.parse(text) } catch { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()) }
  return NextResponse.json(parsed)
}
