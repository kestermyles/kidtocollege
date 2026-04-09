import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getStudentContext } from "@/lib/student-context";

export const runtime = "nodejs";
export const maxDuration = 30;

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
  return new Anthropic({ apiKey });
}

// POST /api/coach/interview — get next interviewer response
export async function POST(request: Request) {
  try {
    const {
      action,
      college,
      interviewType,
      transcript,
      currentQuestionIndex,
      questionBank,
    } = await request.json();

    const anthropic = getClient();
    const studentCtx = await getStudentContext();

    if (action === "next-question") {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 200,
        system: `You are a warm, professional college interviewer conducting a ${interviewType} interview for ${college}. You have a list of planned questions but you can deviate naturally. Keep responses to 1-2 sentences. Sound conversational, not robotic. If the student said something interesting, ask one brief follow-up before moving to the next planned question. Never use markdown.${studentCtx ? ` ${studentCtx}` : ""}`,
        messages: [
          {
            role: "user",
            content: `Interview transcript so far:\n${transcript}\n\nPlanned questions remaining: ${JSON.stringify(questionBank.slice(currentQuestionIndex))}\n\nBased on the student's last answer, either ask the next planned question or ask one natural follow-up. Respond with ONLY the interviewer's next line of dialogue.`,
          },
        ],
      });

      const block = response.content[0];
      const text = block.type === "text" ? block.text : "";
      return NextResponse.json({ response: text });
    }

    if (action === "feedback") {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        system: `You are an expert college admissions interview coach. Analyze the student's interview performance and provide constructive, encouraging feedback. Return ONLY valid JSON with no markdown or code fences.`,
        messages: [
          {
            role: "user",
            content: `This was a ${interviewType} interview for ${college}.\n\nFull transcript:\n${transcript}\n\nReturn this exact JSON structure:\n{"score": number 1-10, "strengths": ["strength1", "strength2", "strength3"], "improvements": ["improvement1", "improvement2", "improvement3"], "quotes": [{"quote": "exact quote from student", "note": "coaching note"}], "betterAnswers": [{"question": "the question asked", "original": "summary of their answer", "suggested": "a stronger answer approach"}]}`,
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
        return NextResponse.json({ score: 7, strengths: ["Good effort"], improvements: ["Practice more"], quotes: [], betterAnswers: [] });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[interview API] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
