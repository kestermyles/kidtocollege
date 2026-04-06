import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  const questionId = req.nextUrl.searchParams.get("question_id")
  if (!questionId) {
    return NextResponse.json({ error: "question_id required" }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const svc = createClient(url, key)

  const { data } = await svc
    .from("community_answers")
    .select("body, created_at")
    .eq("question_id", questionId)
    .eq("is_sam", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (data) {
    return NextResponse.json({ answered: true, answer: data })
  }

  return NextResponse.json({ answered: false, answer: null })
}
