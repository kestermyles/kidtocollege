import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { cacheResult } from "@/lib/result-cache";
import type { WizardData, AIResearchResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

const MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 4096;
const MAX_RETRIES = 2;

const SYSTEM_PROMPT = `CRITICAL: For all URLs in scholarship url fields and live_links: only use real verified URLs you are certain exist and are currently live. If uncertain about any URL, use a Google search URL instead in this format: https://www.google.com/search?q=SCHOLARSHIP+NAME+apply — never invent or guess URLs.

CRITICAL: Your entire response must be a single raw JSON object. Do not use markdown. Do not use code fences. Do not write any text before or after the JSON. Start your response with { and end with }. Be concise — limit each text field to 2 sentences maximum. Limit scholarships array to 8 items. Limit playbook array to 6 items. Limit insider_intel array to 5 items. Limit essay_angles array to 4 items. Limit recommended_colleges to 3 items.

You are a specialist college admissions counselor with deep, institution-specific knowledge. Produce a comprehensive research report for the student and their family.

Be entirely specific to the named college and entered major. Research as a specialist who knows this institution inside out. Find every funding source — merit scholarships, need-based grants, departmental awards, outside scholarships. Families leave money unclaimed every year; surface it all. Cover what the family hasn't considered — transfer pathways, community-college gateway options, lesser-known programs, early-decision advantages, essay angles. Be positive — focus on what the student CAN do. Surface inclusive options as standard — first-generation resources, multicultural programs, veteran benefits — without requiring the user to ask.

IMPORTANT: All cost figures must represent TOTAL annual cost of attendance including tuition, room and board, books, personal expenses and transport — never tuition alone. When showing estimated_net_after_aid, this must also be total cost of attendance after all grants and scholarships are applied, not just tuition after aid.

Return valid JSON matching this exact interface:

{ "match_score": number, "acceptance_rate": string, "gpa_ranges": { "minimum": string, "mid_50_low": string, "mid_50_high": string, "average": string }, "sat_ranges": { "minimum": string, "mid_50_low": string, "mid_50_high": string, "average": string }, "scholarships": [{ "name": string, "amount": string, "type": string, "eligibility": string, "deadline": string, "url": string, "why_this_student": string }], "playbook": [{ "title": string, "description": string, "action": string }], "insider_intel": [string], "budget": { "tuition": string, "room_board": string, "books_living": string, "total_sticker": string, "estimated_net_after_aid": string, "notes": string }, "cc_gateway": { "community_colleges": [string], "transfer_route_description": string, "cost_comparison": string, "transfer_success_rate": string }, "early_decision_advantage": string, "essay_angles": [string], "live_links": { "admissions": string, "financial_aid": string, "program": string, "scholarships": string }, "recommended_colleges": [{ "name": string, "reason": string, "acceptance_rate": string, "estimated_cost": string, "scholarship_potential": string }] }

recommended_colleges: suggest 3 colleges that are a strong fit for this student based on their GPA, budget and priorities.

When discussing career outcomes and return on investment for this college and major combination, include: typical starting salaries for this major, industries that recruit from this school, and whether the degree is considered strong ROI for the cost. Frame this in terms of years to break even on the investment versus not attending college.`;

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildUserPrompt(data: WizardData): string {
  const lines: string[] = [`College: ${data.college}`, `Major: ${data.major}`];
  if (data.minor) lines.push(`Minor: ${data.minor}`);
  if (data.applicationYear) lines.push(`Application year: ${data.applicationYear}`);
  if (data.gpa) lines.push(`GPA: ${data.gpa}`);
  if (data.satScore) lines.push(`SAT score: ${data.satScore}`);
  if (data.activities?.length) lines.push(`Activities: ${data.activities.join(", ")}`);
  if (data.otherSkills) lines.push(`Other skills / context: ${data.otherSkills}`);
  if (data.priorities?.length) lines.push(`Priorities: ${data.priorities.join(", ")}`);
  if (data.budget) lines.push(`Family budget situation: ${data.budget}`);
  if (data.notes) lines.push(`Additional notes from the family: ${data.notes}`);
  lines.push("", "Produce the full AIResearchResult JSON for this student.");
  return lines.join("\n");
}

function repairTruncatedJSON(text: string): string {
  let repaired = text;
  const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) repaired += '"';
  let openBraces = 0, openBrackets = 0, inString = false;
  for (let i = 0; i < repaired.length; i++) {
    const ch = repaired[i];
    if (ch === '"' && (i === 0 || repaired[i - 1] !== "\\")) inString = !inString;
    if (!inString) {
      if (ch === "{") openBraces++;
      else if (ch === "}") openBraces--;
      else if (ch === "[") openBrackets++;
      else if (ch === "]") openBrackets--;
    }
  }
  for (let i = 0; i < openBrackets; i++) repaired += "]";
  for (let i = 0; i < openBraces; i++) repaired += "}";
  return repaired;
}

function buildCacheKey(college: string, major: string): string {
  return `${college.toLowerCase().trim()}::${major.toLowerCase().trim()}`;
}

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function POST(request: Request) {
  try {
    const { searchId, wizardData: data } = (await request.json()) as {
      searchId: string;
      wizardData: WizardData;
    };
    console.log("[/api/research/run] START for:", data.college, data.major, "searchId:", searchId);

    // Call Anthropic
    const anthropic = getAnthropicClient();
    let lastError: unknown;
    let rawResponse = "";

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await anthropic.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildUserPrompt(data) }],
        });
        const block = response.content[0];
        if (block.type === "text") {
          rawResponse = block.text;
          break;
        }
        throw new Error("Unexpected response block type");
      } catch (err) {
        lastError = err;
        if (attempt < MAX_RETRIES) await delay(1000 * Math.pow(2, attempt));
      }
    }

    if (!rawResponse) throw lastError;

    console.log("[/api/research/run] AI response length:", rawResponse.length);

    // Parse JSON
    const cleaned = rawResponse
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    let result: AIResearchResult;
    try {
      result = JSON.parse(cleaned);
    } catch {
      result = JSON.parse(repairTruncatedJSON(cleaned));
    }

    // Save result to Supabase
    const cacheKey = buildCacheKey(data.college, data.major);
    let resultId = crypto.randomUUID();

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceRoleClient();
        const { data: resultRow } = await supabase
          .from("results")
          .insert({
            search_id: searchId,
            cache_key: cacheKey,
            match_score: result.match_score ?? null,
            raw_ai_response: result,
            scholarships_json: result.scholarships ?? null,
            playbook_json: result.playbook ?? null,
            budget_json: result.budget ?? null,
            cc_gateway_json: result.cc_gateway ?? null,
          })
          .select("id")
          .single();

        if (resultRow) {
          resultId = resultRow.id;
          console.log("[/api/research/run] SUCCESS saved resultId:", resultId);
        }
      } catch (dbErr) {
        console.warn("[/api/research/run] Failed to save result:", dbErr);
      }
    }

    // Always cache in memory as fallback
    cacheResult(resultId, result, data.college, data.major);

    return NextResponse.json({ resultId, searchId });
  } catch (err) {
    console.error("[/api/research/run] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
