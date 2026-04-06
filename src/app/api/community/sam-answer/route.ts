import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

export const maxDuration = 30

const SYSTEM = `You are Sam, a college admissions advisor on KidToCollege.com. Help students and families with college admissions, financial aid, scholarships, and applications. Be helpful, specific, and encouraging. Write in clear paragraphs, avoid excessive bullet points. Keep answers under 400 words.`

export async function POST(req: NextRequest) {
  const { question_id, title, body } = await req.json()

  if (!question_id || !title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const svc = createClient(url, key)

  // Verify question exists
  const { data: q } = await svc
    .from("community_questions")
    .select("id")
    .eq("id", question_id)
    .single()

  if (!q) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 })
  }

  const userMessage = body ? `${title}\n\n${body}` : title

  const client = new Anthropic()
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 600,
    system: SYSTEM,
    messages: [{ role: "user", content: userMessage }],
  })

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("")

  await svc.from("community_answers").insert({
    question_id,
    body: text,
    user_id: null,
    is_sam: true,
  })

  return NextResponse.json({ ok: true })
}
