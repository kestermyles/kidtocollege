import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

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
    const { gpa, sat, colleges } = body as {
      gpa: string;
      sat: string;
      colleges: { name: string; slug: string }[];
    };

    if (!gpa || !colleges?.length) {
      return NextResponse.json(
        { error: "GPA and at least one college are required" },
        { status: 400 }
      );
    }

    const anthropic = getClient();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: `You are a college admissions data analyst. Given a student's GPA and optional SAT score, assess where they fall in the admitted student profile for each college listed. Use your knowledge of published Common Data Set information, IPEDS data, and publicly available admissions statistics.

Return ONLY valid JSON — no markdown, no code fences. Start with { and end with }.

For each college, determine the student's tier:
- "top10": Student's stats put them in roughly the top 10% of admitted students
- "top25": Student's stats put them in roughly the top 25% (merit sweet spot)
- "mid50": Student's stats are in the middle 50% of admitted students
- "bottom25": Student's stats are in the bottom 25% of admitted students
- "unavailable": You don't have reliable data for this college

Base your assessment primarily on GPA if no SAT is provided. If SAT is provided, weight both factors. Be realistic and conservative in your assessments.`,
      messages: [
        {
          role: "user",
          content: `Student profile:
- GPA range: ${gpa}
- SAT score: ${sat || "Not provided"}

Assess this student's position at each of these colleges:
${colleges.map((c) => `- ${c.name}`).join("\n")}

Return this exact JSON structure:
{
  "results": [
    {
      "name": "College Name",
      "slug": "college-slug",
      "tier": "top10" | "top25" | "mid50" | "bottom25" | "unavailable",
      "sat_mid50": "e.g. 1200-1400 or null if unknown",
      "gpa_avg": "e.g. 3.5 or null if unknown",
      "reasoning": "One sentence explaining the assessment"
    }
  ]
}

Use the exact college names and slugs provided. Return one result per college.`,
        },
      ],
    });

    const block = response.content[0];
    const raw = block.type === "text" ? block.text : "{}";
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    try {
      return NextResponse.json(JSON.parse(cleaned));
    } catch {
      return NextResponse.json(
        { error: "Failed to parse assessment" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[merit-sweet-spot API]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
