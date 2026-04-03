import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"

export const maxDuration = 30

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Check cache first
  const { data: cached } = await supabase
    .from("colleges")
    .select("requirements_json")
    .eq("slug", slug)
    .single()

  if (cached?.requirements_json) {
    return NextResponse.json(cached.requirements_json)
  }

  // Get college name
  const { data: college } = await supabase
    .from("colleges")
    .select("name, state")
    .eq("slug", slug)
    .single()

  if (!college) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const client = new Anthropic()
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 800,
    messages: [{
      role: "user",
      content: `For ${college.name} in ${college.state}, provide factual application requirements. Respond ONLY with valid JSON, no markdown:
{
  "deadline_regular": "e.g. January 15",
  "deadline_early": "e.g. November 1 (Early Action)" or null,
  "accepts_common_app": true or false,
  "essays_required": number,
  "essay_notes": "brief description of essay requirements",
  "test_policy": "Required" or "Test Optional" or "Test Free",
  "letters_of_rec": number,
  "application_fee": number or null,
  "has_interview": true or false,
  "extra_requirements": "any unusual requirements, or null"
}`
    }]
  })

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map(b => b.text)
    .join("")

  let requirements
  try { requirements = JSON.parse(text) }
  catch { requirements = JSON.parse(text.replace(/```json|```/g, "").trim()) }

  // Cache it
  await supabase
    .from("colleges")
    .update({ requirements_json: requirements })
    .eq("slug", slug)

  return NextResponse.json(requirements)
}
