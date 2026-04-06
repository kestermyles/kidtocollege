import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export const maxDuration = 10

const PAGES: Record<string, string> = {
  search: "Find a College (/search)",
  college: "our college pages (/colleges)",
  compare: "Compare Colleges (/compare)",
  scholarship: "Scholarships (/scholarships)",
  fafsa: "FAFSA Guide (/fafsa-guide)",
  "financial aid": "Financial Aid (/financial-aid)",
  coach: "The Coach (/coach)",
  essay: "Essay Coach (/essays)",
  roadmap: "Your Roadmap (/roadmap)",
  "my list": "My College List (/my-colleges)",
  "my chances": "My Chances (/my-chances)",
  deadline: "Deadlines (/deadlines)",
  calculator: "Net Price Calculator (/financial-aid/calculator)",
  account: "your Account page (/account)",
}

export async function POST(req: NextRequest) {
  const { title, body } = await req.json()
  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 })
  }

  const client = new Anthropic()
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 10,
    messages: [
      {
        role: "user",
        content: `Does this question ask how to navigate or use the KidToCollege website itself (e.g. where to find a feature, how to use a tool on the site)? Answer only YES or NO.\n\nQuestion: ${title}${body ? `\n${body}` : ""}`,
      },
    ],
  })

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("")
    .trim()
    .toUpperCase()

  const isSiteNavigation = text.startsWith("YES")

  let suggestion: string | undefined
  if (isSiteNavigation) {
    const combined = `${title} ${body || ""}`.toLowerCase()
    for (const [keyword, page] of Object.entries(PAGES)) {
      if (combined.includes(keyword)) {
        suggestion = `Looks like you're asking about ${page}. You can find it in the navigation bar at the top of the page.`
        break
      }
    }
    if (!suggestion) {
      suggestion = "It looks like you're asking about a site feature. Try the navigation menu at the top — or ask Sam directly using the chat button in the bottom right."
    }
  }

  return NextResponse.json({ isSiteNavigation, suggestion })
}
