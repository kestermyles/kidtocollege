"use server";

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-20250514";

// ---------------------------------------------------------------------------
// Essay feedback
// ---------------------------------------------------------------------------

export async function getEssayFeedback(
  draft: string,
  draftType: string
): Promise<{ feedback: string }> {
  if (!draft.trim()) return { feedback: "Please enter your essay draft first." };

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: `You are a compassionate, expert college admissions essay coach. Your job is to help students improve THEIR writing — never rewrite for them. Be specific, encouraging, and honest. Reference the student's own words when giving feedback. Structure your response with clear sections: Strengths, Areas to Improve, Specific Suggestions, and Overall Impression.`,
    messages: [
      {
        role: "user",
        content: `Please review this ${draftType} essay draft and provide constructive feedback:\n\n${draft}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return { feedback: text };
}

// ---------------------------------------------------------------------------
// Mock interview feedback
// ---------------------------------------------------------------------------

export async function getMockInterviewFeedback(
  question: string,
  answer: string
): Promise<{ feedback: string; tips: string[] }> {
  if (!answer.trim())
    return { feedback: "Please type your answer first.", tips: [] };

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: `You are an expert college admissions interview coach. Evaluate the student's interview answer. Be encouraging but honest. Respond in JSON format with two keys: "feedback" (a detailed paragraph evaluating their answer) and "tips" (an array of 3-5 specific, actionable tips to improve).`,
    messages: [
      {
        role: "user",
        content: `Interview question: "${question}"\n\nStudent's answer: "${answer}"`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "{}";
  try {
    const parsed = JSON.parse(text);
    return {
      feedback: parsed.feedback || "",
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
    };
  } catch {
    return { feedback: text, tips: [] };
  }
}

// ---------------------------------------------------------------------------
// Brag sheet generator
// ---------------------------------------------------------------------------

export async function generateBragSheet(
  activities: string[],
  achievements: string
): Promise<{ bragSheet: string }> {
  if (activities.length === 0 && !achievements.trim())
    return { bragSheet: "Please add at least one activity or achievement." };

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: `You are an expert college counselor. Generate a well-organized "brag sheet" that a student can give to their recommenders. The brag sheet should be formatted in clear sections with bullet points and be ready to share. Include sections for: Academic Highlights, Extracurricular Activities, Leadership & Impact, Personal Qualities, and Goals. Extrapolate thoughtfully from what the student provides — highlight impact and growth.`,
    messages: [
      {
        role: "user",
        content: `Activities: ${activities.join(", ")}\n\nAdditional achievements and context: ${achievements}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return { bragSheet: text };
}

// ---------------------------------------------------------------------------
// Financial aid Q&A
// ---------------------------------------------------------------------------

export async function askFinancialAidQuestion(
  question: string
): Promise<{ answer: string }> {
  if (!question.trim())
    return { answer: "Please type a question about financial aid." };

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: `You are an expert college financial aid counselor with deep knowledge of FAFSA, CSS Profile, institutional aid, merit scholarships, appeals processes, and all aspects of paying for college. Give clear, accurate, actionable answers. When discussing deadlines or rules, note that these can change and advise verifying with official sources. Be warm and encouraging — many families find this process intimidating.`,
    messages: [
      {
        role: "user",
        content: question,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return { answer: text };
}
