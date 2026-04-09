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
    const {
      studentName,
      collegeName,
      currentOffer,
      reasons,
      details,
      competingOffer,
      requestedAmount,
    } = body as {
      studentName: string;
      collegeName: string;
      currentOffer: string;
      reasons: string[];
      details: string;
      competingOffer: string;
      requestedAmount: string;
    };

    if (!studentName || !collegeName || !currentOffer || !reasons?.length) {
      return NextResponse.json(
        { error: "Student name, college, current offer, and at least one reason are required" },
        { status: 400 }
      );
    }

    const anthropic = getClient();
    const studentCtx = await getStudentContext();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: `You are helping a family draft a financial aid appeal letter to a college. Write in a formal, factual, respectful tone. Focus on documented facts and specific circumstances. Do not use emotional language. Structure the letter as: (1) greeting, (2) statement of purpose, (3) specific changed circumstances or competing offer with facts, (4) specific request with dollar amount if provided, (5) professional closing. Keep it under 300 words. Add a note at the bottom: 'This is a draft generated for educational purposes. Review carefully, add your specific documentation, and verify all figures before sending.'${studentCtx ? ` ${studentCtx}` : ""}`,
      messages: [
        {
          role: "user",
          content: `Draft a financial aid appeal letter with these details:
- Student name: ${studentName}
- College: ${collegeName}
- Current aid offer: ${currentOffer}
- Reasons for appeal: ${reasons.join(", ")}
- Additional details: ${details || "None provided"}
- Competing offer: ${competingOffer || "None mentioned"}
- Requested amount: ${requestedAmount || "Not specified"}

Write the letter now.`,
        },
      ],
    });

    const block = response.content[0];
    const letter = block.type === "text" ? block.text : "";

    return NextResponse.json({ letter });
  } catch (err) {
    console.error("[appeal-letter API]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
