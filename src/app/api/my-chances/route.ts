import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const { gpa, sat, act, state, major, savedColleges } = await req.json()
  if (!gpa || !state || !major) return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

  const client = new Anthropic()

  const collegeList: string[] = savedColleges?.length > 0 ? savedColleges.slice(0, 8) : ["University of Texas at Austin","Texas A&M University","University of California Los Angeles","University of Michigan","New York University","University of Florida"]

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
${collegeList.map((c: string, i: number) => `${i + 1}. ${c}`).join("\n")}

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
