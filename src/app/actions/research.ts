"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createServiceRoleClient } from "@/lib/supabase-server";
import type { WizardData, AIResearchResult } from "@/lib/types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 4000;
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

const SYSTEM_PROMPT = `You are a specialist college admissions counselor with deep, institution-specific knowledge.

Your task is to produce a comprehensive research report for a student and their family. Follow these principles:

1. BE ENTIRELY SPECIFIC to the named college and entered major. Never give generic advice — reference the actual institution, its programs, its financial aid office, its deadlines, its culture.
2. Research as a specialist counsellor who KNOWS this institution inside out.
3. Find EVERY funding source — merit scholarships, need-based grants, departmental awards, outside scholarships that commonly go to students at this school. Families leave money unclaimed every year; surface it.
4. Cover what the family HASN'T considered yet — transfer pathways, community-college gateway options, lesser-known programs, early-decision advantages, essay angles.
5. Be positive — focus on what the student CAN do. Frame challenges as opportunities.
6. Surface inclusive options as standard for ALL users — first-generation resources, accessibility services, multicultural programs, LGBTQ+ support, veteran benefits — without requiring the user to ask.
7. Return ONLY valid JSON matching the AIResearchResult interface. No markdown, no commentary, no code fences — just the raw JSON object.

The AIResearchResult interface:
{
  match_score: number;            // 0-100 how well the student fits
  acceptance_rate: string;
  gpa_ranges: { minimum: string; mid_50_low: string; mid_50_high: string; average: string };
  sat_ranges: { minimum: string; mid_50_low: string; mid_50_high: string; average: string };
  scholarships: Array<{ name: string; amount: string; type: string; eligibility: string; deadline: string; url: string; why_this_student: string }>;
  playbook: Array<{ title: string; description: string; action: string }>;
  insider_intel: string[];
  budget: { tuition: string; room_board: string; books_living: string; total_sticker: string; estimated_net_after_aid: string; notes: string };
  cc_gateway: { community_colleges: string[]; transfer_route_description: string; cost_comparison: string; transfer_success_rate: string };
  early_decision_advantage: string;
  essay_angles: string[];
  live_links: { admissions: string; financial_aid: string; program: string; scholarships: string };
}`;

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

async function runResearch(data: WizardData): Promise<AIResearchResult> {
  const raw = await callAnthropic(SYSTEM_PROMPT, buildUserPrompt(data));

  // Strip potential markdown fences the model might add despite instructions
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as AIResearchResult;
  } catch {
    throw new Error(
      "The AI returned an invalid response. Please try your search again."
    );
  }
}

// ---------------------------------------------------------------------------
// submitSearch
// ---------------------------------------------------------------------------

export async function submitSearch(
  data: WizardData
): Promise<{ searchId: string; resultId: string } | { error: string }> {
  try {
    const supabase = createServiceRoleClient();
    const cacheKey = buildCacheKey(data.college, data.major);

    // 1. Save the search
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

    if (searchErr) {
      console.error("[submitSearch] Search insert error:", searchErr);
      throw new Error("Failed to save your search. Please try again.");
    }
    const searchId: string = searchRow.id;

    // 2. Check for cached result within 24 hours
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

    // 3. No cache — run the AI research
    const result = await runResearch(data);

    // 4. Save result
    const { data: resultRow, error: resultErr } = await supabase
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

    if (resultErr) {
      console.error("[submitSearch] Result insert error:", resultErr);
      throw new Error("Failed to save your report. Please try again.");
    }

    return { searchId, resultId: resultRow.id };
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

    // Save Q&A to database
    const supabase = createServiceRoleClient();
    await supabase.from("questions").insert({
      search_id: searchId,
      question,
      answer: parsed.answer,
    });

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
