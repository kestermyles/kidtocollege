import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TEN_QUALITIES_FRAMEWORK } from "@/lib/coach-prompts";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages, promptText } = await req.json();
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const client = new Anthropic();

  const systemPrompt = `You are a college essay coach helping a student write a compelling, authentic college application essay. You are coaching them on this prompt: "${promptText || "a college application essay"}"

Your approach:
- Ask questions to help them discover their story
- Never write the essay for them — guide them to find their own voice and angle
- Help them find specific, concrete moments rather than general statements
- Push them away from cliches and toward authentic, surprising details
- Keep responses concise and conversational (2-4 sentences)
- If they share a draft, give specific, actionable feedback
- Remind them of the word limit when relevant

${TEN_QUALITIES_FRAMEWORK}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 500,
    system: systemPrompt,
    messages: messages.slice(-10),
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return NextResponse.json({ message: text });
}
