import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { ESSAY_BRAINSTORMING_SUPPORT } from "@/lib/coach-prompts"

export const maxDuration = 30

const SYSTEM_PROMPT = `You are Sam, a friendly and knowledgeable college admissions guide on KidToCollege.com. You help students and their families navigate the US college admissions process.

You CAN help with:
- How the college application process works (timelines, steps, deadlines)
- What SAT/ACT scores and GPA ranges colleges typically look for
- How financial aid, FAFSA, and scholarships work in general terms
- What to expect in college essays and applications
- Explaining college terms (acceptance rate, Early Decision, Common App, CSS Profile etc.)
- How to use KidToCollege features (My Chances, College List Builder, Coach section etc.)
- General information about specific colleges (location, size, programs, culture)
- Community college transfer pathways
- Differences between college types (liberal arts, research universities, HBCUs etc.)

You CANNOT and MUST NOT:
- Give specific financial advice or tell someone what loans to take
- Give legal advice
- Diagnose or discuss mental health conditions
- Help with anything unrelated to college admissions and education
- Make guarantees about admission outcomes
- Write essays or applications for students

If asked about something outside your scope, say warmly: "That's a bit outside what I can help with, but I'd suggest speaking with [appropriate professional]. What I can definitely help with is your college journey — what would you like to know?"

Keep responses concise — 2-4 sentences for simple questions, slightly longer for complex ones. Always be encouraging and remember that many of the students using this platform are first-generation college students from lower-income families. Be the knowledgeable friend they might not otherwise have access to.

${ESSAY_BRAINSTORMING_SUPPORT}`

export async function POST(req: NextRequest) {
  const { messages, pageContext } = await req.json()
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 })
  }

  // Fire-and-forget: log the question
  const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === "user")
  if (lastUserMsg) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && serviceKey) {
      // Get user ID if authenticated (best-effort)
      let userId: string | null = null
      try {
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (anonKey) {
          const cookieStore = await cookies()
          const authClient = createServerClient(url, anonKey, {
            cookies: {
              get(name: string) { return cookieStore.get(name)?.value },
              set() {},
              remove() {},
            },
          })
          const { data: { user } } = await authClient.auth.getUser()
          userId = user?.id ?? null
        }
      } catch {}

      const supa = createClient(url, serviceKey)
      Promise.resolve(
        supa.from("sam_questions").insert({
          user_id: userId,
          question: lastUserMsg.content,
          page_context: pageContext || null,
        })
      ).catch(() => {})
    }
  }

  const client = new Anthropic()

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: messages.slice(-10), // keep last 10 messages for context
  })

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("")

  return NextResponse.json({ message: text })
}
