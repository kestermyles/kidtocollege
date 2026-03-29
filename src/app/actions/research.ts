"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { cacheResult } from "@/lib/result-cache";
import type { WizardData, AIResearchResult } from "@/lib/types";

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
  }
  return new Anthropic({ apiKey });
}

const MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 4096;
const MAX_RETRIES = 2;
const CACHE_TTL_HOURS = 24;

// TODO: Implement rate limiting per IP or user.
// Consider using an in-memory store (e.g. Map with sliding window)
// or a Redis-backed solution for production deployments.

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildCacheKey(college: string, major: string): string {
  return `${college.toLowerCase().trim()}::${major.toLowerCase().trim()}`;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SYSTEM_PROMPT = `CRITICAL: Your entire response must be a single raw JSON object. Do not use markdown. Do not use code fences. Do not write any text before or after the JSON. Start your response with { and end with }. Be concise — limit each text field to 2 sentences maximum. Limit scholarships array to 8 items. Limit playbook array to 6 items. Limit insider_intel array to 5 items. Limit essay_angles array to 4 items.

You are a specialist college admissions counselor with deep, institution-specific knowledge. Produce a comprehensive research report for the student and their family.

Be entirely specific to the named college and entered major. Research as a specialist who knows this institution inside out. Find every funding source — merit scholarships, need-based grants, departmental awards, outside scholarships. Families leave money unclaimed every year; surface it all. Cover what the family hasn't considered — transfer pathways, community-college gateway options, lesser-known programs, early-decision advantages, essay angles. Be positive — focus on what the student CAN do. Surface inclusive options as standard — first-generation resources, multicultural programs, veteran benefits — without requiring the user to ask.

Return valid JSON matching this exact interface:

{ "match_score": number, "acceptance_rate": string, "gpa_ranges": { "minimum": string, "mid_50_low": string, "mid_50_high": string, "average": string }, "sat_ranges": { "minimum": string, "mid_50_low": string, "mid_50_high": string, "average": string }, "scholarships": [{ "name": string, "amount": string, "type": string, "eligibility": string, "deadline": string, "url": string, "why_this_student": string }], "playbook": [{ "title": string, "description": string, "action": string }], "insider_intel": [string], "budget": { "tuition": string, "room_board": string, "books_living": string, "total_sticker": string, "estimated_net_after_aid": string, "notes": string }, "cc_gateway": { "community_colleges": [string], "transfer_route_description": string, "cost_comparison": string, "transfer_success_rate": string }, "early_decision_advantage": string, "essay_angles": [string], "live_links": { "admissions": string, "financial_aid": string, "program": string, "scholarships": string } }`;

function buildUserPrompt(data: WizardData): string {
  const lines: string[] = [
    `College: ${data.college}`,
    `Major: ${data.major}`,
  ];

  if (data.minor) lines.push(`Minor: ${data.minor}`);
  if (data.applicationYear) lines.push(`Application year: ${data.applicationYear}`);
  if (data.gpa) lines.push(`GPA: ${data.gpa}`);
  if (data.satScore) lines.push(`SAT score: ${data.satScore}`);
  if (data.activities?.length) lines.push(`Activities: ${data.activities.join(", ")}`);
  if (data.otherSkills) lines.push(`Other skills / context: ${data.otherSkills}`);
  if (data.priorities?.length) lines.push(`Priorities: ${data.priorities.join(", ")}`);
  if (data.budget) lines.push(`Family budget situation: ${data.budget}`);
  if (data.notes) lines.push(`Additional notes from the family: ${data.notes}`);

  lines.push(
    "",
    "Produce the full AIResearchResult JSON for this student. Be thorough — this is the only research they will see."
  );

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// AI call with retry
// ---------------------------------------------------------------------------

async function callAnthropic(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const anthropic = getAnthropicClient();
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      const block = response.content[0];
      if (block.type === "text") {
        return block.text;
      }
      throw new Error("Unexpected response block type from Anthropic API");
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        await delay(1000 * Math.pow(2, attempt)); // 1s, 2s
      }
    }
  }

  throw lastError;
}

function repairTruncatedJSON(text: string): string {
  // Try to close any open strings, arrays, and objects
  let repaired = text;
  // If it ends mid-string, close the string
  const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    repaired += '"';
  }
  // Count open/close braces and brackets
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  for (let i = 0; i < repaired.length; i++) {
    const ch = repaired[i];
    if (ch === '"' && (i === 0 || repaired[i - 1] !== "\\")) {
      inString = !inString;
    }
    if (!inString) {
      if (ch === "{") openBraces++;
      else if (ch === "}") openBraces--;
      else if (ch === "[") openBrackets++;
      else if (ch === "]") openBrackets--;
    }
  }
  // Close open brackets and braces
  for (let i = 0; i < openBrackets; i++) repaired += "]";
  for (let i = 0; i < openBraces; i++) repaired += "}";
  return repaired;
}

async function runResearch(data: WizardData): Promise<AIResearchResult> {
  const raw = await callAnthropic(SYSTEM_PROMPT, buildUserPrompt(data));
  console.log("[runResearch] Raw AI response length:", raw.length);

  // Strip potential markdown fences the model might add despite instructions
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  // First attempt: parse as-is
  try {
    return JSON.parse(cleaned) as AIResearchResult;
  } catch {
    // Second attempt: try to repair truncated JSON
    console.log("[runResearch] First parse failed, attempting JSON repair...");
    try {
      const repaired = repairTruncatedJSON(cleaned);
      return JSON.parse(repaired) as AIResearchResult;
    } catch (parseErr) {
      console.error("[runResearch] JSON parse error after repair:", parseErr);
      console.error("[runResearch] Response tail:", cleaned.slice(-200));
      throw new Error(
        "The AI returned an invalid response. Please try your search again."
      );
    }
  }
}

// ---------------------------------------------------------------------------
// submitSearch
// ---------------------------------------------------------------------------

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function submitSearch(
  data: WizardData
): Promise<{ searchId: string; resultId: string } | { error: string }> {
  try {
    const cacheKey = buildCacheKey(data.college, data.major);
    const dbAvailable = isSupabaseConfigured();

    let searchId = crypto.randomUUID();
    let resultId = crypto.randomUUID();

    // Try Supabase if configured — but don't let DB errors block the AI call
    if (dbAvailable) {
      try {
        const supabase = createServiceRoleClient();

        const { data: searchRow, error: searchErr } = await supabase
          .from("searches")
          .insert({
            college: data.college,
            major: data.major,
            minor: data.minor || null,
            application_year: data.applicationYear || null,
            gpa: data.gpa || null,
            sat_score: data.satScore || null,
            activities: data.activities || [],
            other_skills: data.otherSkills || null,
            priorities: data.priorities || [],
            budget: data.budget || null,
            notes: data.notes || null,
            cache_key: cacheKey,
          })
          .select("id")
          .single();

        if (!searchErr && searchRow) {
          searchId = searchRow.id;

          const cutoff = new Date(
            Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000
          ).toISOString();

          const { data: cachedRows } = await supabase
            .from("results")
            .select("id")
            .eq("cache_key", cacheKey)
            .gte("created_at", cutoff)
            .order("created_at", { ascending: false })
            .limit(1);

          if (cachedRows && cachedRows.length > 0) {
            return { searchId, resultId: cachedRows[0].id };
          }
        } else {
          console.warn("[submitSearch] DB insert failed, continuing without DB:", searchErr?.message);
        }
      } catch (dbErr) {
        console.warn("[submitSearch] Supabase error, continuing without DB:", dbErr);
      }
    }

    // Run the AI research
    const result = await runResearch(data);

    // Try to save to DB, but don't block on failure
    if (dbAvailable) {
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
        }
      } catch (dbErr) {
        console.warn("[submitSearch] Failed to save result to DB:", dbErr);
      }
    }

    // Always cache in memory as fallback
    cacheResult(resultId, result, data.college, data.major);

    return { searchId, resultId };
  } catch (err) {
    console.error("[submitSearch] Error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { error: message };
  }
}

// ---------------------------------------------------------------------------
// askQuestion
// ---------------------------------------------------------------------------

export async function askQuestion(params: {
  searchId: string;
  question: string;
  context: AIResearchResult;
  college: string;
  major: string;
}): Promise<{ answer: string; suggestedQuestions: string[] } | { error: string }> {
  try {
    const { searchId, question, context, college, major } = params;

    const systemPrompt = `You are a specialist college admissions counselor. The student is researching ${college} for a ${major} major.

You have already produced a full research report for them (provided as JSON context). Now answer their follow-up question with the same institution-specific depth.

Be positive, specific, and actionable. If you don't know something for certain, say so and suggest where they can find the answer.

After your answer, suggest 3 follow-up questions the student might want to ask. Return your response as JSON:
{
  "answer": "Your detailed answer here...",
  "suggestedQuestions": ["Question 1?", "Question 2?", "Question 3?"]
}

Return ONLY valid JSON. No markdown, no commentary, no code fences.`;

    const userPrompt = `Research context:\n${JSON.stringify(context)}\n\nStudent's question: ${question}`;

    const raw = await callAnthropic(systemPrompt, userPrompt);
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed: { answer: string; suggestedQuestions: string[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("The AI returned an invalid response. Please try again.");
    }

    // Save Q&A to database (skip if Supabase not configured)
    if (isSupabaseConfigured()) {
      const supabase = createServiceRoleClient();
      await supabase.from("questions").insert({
        search_id: searchId,
        question,
        answer: parsed.answer,
      });
    }

    return parsed;
  } catch (err) {
    console.error("[askQuestion] Error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { error: message };
  }
}

// ---------------------------------------------------------------------------
// generateSuggestedQuestions
// ---------------------------------------------------------------------------

export async function generateSuggestedQuestions(
  college: string,
  major: string,
  result: AIResearchResult
): Promise<string[]> {
  try {
    const systemPrompt = `You are a specialist college admissions counselor. Given a research report for a student considering ${college} with a ${major} major, generate 6 insightful follow-up questions the student or family should ask.

Questions should be specific to the college and major, covering areas like:
- Financial aid strategy
- Application timing and deadlines
- Campus life and fit
- Career outcomes for this major
- Lesser-known opportunities
- How to strengthen their candidacy

Return ONLY a JSON array of 6 question strings. No markdown, no commentary, no code fences.`;

    const userPrompt = `Research report:\n${JSON.stringify(result)}`;

    const raw = await callAnthropic(systemPrompt, userPrompt);
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const questions: string[] = JSON.parse(cleaned);

    if (!Array.isArray(questions)) {
      throw new Error("Expected an array of questions");
    }

    return questions.slice(0, 6);
  } catch (err) {
    console.error("[generateSuggestedQuestions] Error:", err);
    // Return sensible defaults so the UI is never empty
    return [
      `What merit scholarships does ${college} offer for ${major} students?`,
      `What is the typical financial aid package at ${college}?`,
      `How can I strengthen my application to ${college}?`,
      `What career outcomes do ${major} graduates from ${college} typically see?`,
      `Are there research or internship opportunities for ${major} students?`,
      `What makes a standout essay for ${college} admissions?`,
    ];
  }
}
