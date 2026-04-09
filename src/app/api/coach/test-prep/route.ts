import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getStudentContext } from "@/lib/student-context";

export const runtime = "nodejs";
export const maxDuration = 60;

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
  return new Anthropic({ apiKey });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const anthropic = getClient();
    const studentCtx = await getStudentContext();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: `You are an expert SAT/ACT test prep strategist. Create a personalized study plan. Return ONLY valid JSON — no markdown, no code fences. Start with { and end with }.${studentCtx ? ` ${studentCtx}` : ""}`,
      messages: [
        {
          role: "user",
          content: `Create a test prep study plan for this student:
- PSAT score: ${body.psatScore || "N/A"}
- Current SAT score: ${body.currentScore || "Not taken yet"}
- Target SAT score: ${body.targetScore || "1200+"}
- Test date: ${body.testDate || "3 months away"}
- Math grade: ${body.mathGrade || "N/A"}
- Reading grade: ${body.readingGrade || "N/A"}
- Writing grade: ${body.writingGrade || "N/A"}
- Weak areas: ${(body.weakAreas || []).join(", ") || "Not specified"}
- Study hours per week: ${body.studyHours || "3-5hrs"}

Return this exact JSON:
{
  "score_gap": number,
  "weeks_available": number,
  "weekly_study_plan": [{"week": number, "focus": string, "tasks": [string], "hours": number}],
  "weak_area_resources": [{"area": string, "khan_academy_url": string, "description": string, "estimated_hours": number}],
  "score_prediction": {"conservative": number, "realistic": number, "optimistic": number},
  "key_tips": [string],
  "milestone_checkpoints": [{"week": number, "target_score": number, "assessment": string}]
}

Limit weekly_study_plan to the number of weeks available. Limit key_tips to 5. Be specific and actionable.`,
        },
      ],
    });

    const block = response.content[0];
    const raw = block.type === "text" ? block.text : "{}";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    try {
      return NextResponse.json(JSON.parse(cleaned));
    } catch {
      return NextResponse.json({ error: "Failed to parse study plan" }, { status: 500 });
    }
  } catch (err) {
    console.error("[test-prep API]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
