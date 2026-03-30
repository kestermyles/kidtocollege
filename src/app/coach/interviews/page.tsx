"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { GoldButton } from "@/components/GoldButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getMockInterviewFeedback } from "@/app/actions/coach";
import { VoiceInterview } from "@/components/VoiceInterview";

const INTERVIEW_SCHOOLS = [
  "Harvard, Yale, Princeton, and most Ivies use alumni interviews.",
  "Georgetown conducts evaluative interviews on campus.",
  "MIT offers optional but strongly recommended interviews.",
  "Many liberal arts colleges (Wesleyan, Bowdoin, Colby) offer informational interviews.",
  "Large public universities generally do not interview, with exceptions for honors programs.",
];

const COMMON_QUESTIONS = [
  {
    q: "Tell me about yourself.",
    guidance:
      "Do not recite your resume. Share 2-3 things that define who you are outside of grades. Be genuine and specific.",
  },
  {
    q: "Why are you interested in this college?",
    guidance:
      "Show that you have done your research. Name specific programs, professors, traditions, or values that resonate with you personally.",
  },
  {
    q: "What is your biggest strength?",
    guidance:
      "Pick one strength and illustrate it with a brief, specific story. Do not list multiple qualities.",
  },
  {
    q: "What is your biggest weakness or challenge?",
    guidance:
      "Be honest but show growth. Describe a real challenge and what you learned or how you are working on it.",
  },
  {
    q: "Tell me about an extracurricular activity that matters to you.",
    guidance:
      "Go deep, not wide. Explain why this activity matters, what you contribute, and how it has shaped you.",
  },
  {
    q: "What would you contribute to our campus community?",
    guidance:
      "Think beyond your resume. What perspective, energy, or initiative would you bring?",
  },
  {
    q: "What do you do for fun?",
    guidance:
      "Be yourself. Genuine answers are memorable. Whether it is cooking, hiking, or building Lego sets — own it.",
  },
  {
    q: "Who has influenced you the most?",
    guidance:
      "Choose someone specific and explain how they changed how you think, not just what they taught you.",
  },
  {
    q: "Is there anything else you would like us to know?",
    guidance:
      "Use this to share something not in your application, or to reinforce your central narrative.",
  },
  {
    q: "Do you have any questions for me?",
    guidance:
      "Always have 2-3 questions ready. Ask about the interviewer's experience, campus culture, or something specific to the school.",
  },
];

const QUESTIONS_TO_ASK = [
  "What was your favourite thing about your time at [college]?",
  "How would you describe the academic culture — collaborative or competitive?",
  "What surprised you most about the school?",
  "How did your experience there shape your career?",
  "Is there anything you wish you had known before you started?",
];

export default function InterviewsPage() {
  const [selectedQuestion, setSelectedQuestion] = useState(
    COMMON_QUESTIONS[0].q
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleMockInterview() {
    setLoading(true);
    setFeedback("");
    setTips([]);
    try {
      const result = await getMockInterviewFeedback(selectedQuestion, answer);
      setFeedback(result.feedback);
      setTips(result.tips);
    } catch {
      setFeedback("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              Interviews
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Walk in confident. Walk out memorable.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              Most students dread college interviews. With the right preparation,
              they become your advantage. Practice here until you feel ready.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Which colleges */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Which colleges use interviews?
            </h2>
            <ul className="space-y-3">
              {INTERVIEW_SCHOOLS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span className="font-body text-navy/70 text-[15px] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-body text-navy/50 text-sm mt-4 italic">
              Always check your specific school&apos;s admissions page. Interview
              availability can vary by location and year.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Types */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-8">
              Types of interviews
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                type: "Alumni interview",
                desc: "Conducted by a graduate in your area. Usually conversational and informational. Most common type.",
              },
              {
                type: "Admissions officer interview",
                desc: "Conducted by a staff member. More evaluative. Common at smaller colleges and Georgetown.",
              },
              {
                type: "Group interview",
                desc: "You and several other applicants discuss a topic. Tests collaboration and listening skills.",
              },
              {
                type: "Portfolio/creative review",
                desc: "For art, architecture, or design programs. You present and discuss your work.",
              },
            ].map((item, i) => (
              <FadeIn key={item.type} delay={i * 0.06}>
                <div className="ktc-card p-5">
                  <h3 className="font-body font-medium text-navy mb-1">
                    {item.type}
                  </h3>
                  <p className="font-body text-navy/60 text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Common Questions */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-8">
              10 common questions with guidance
            </h2>
          </FadeIn>
          <div className="space-y-6">
            {COMMON_QUESTIONS.map((item, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div className="border-b border-card pb-6 last:border-b-0">
                  <h3 className="font-body font-medium text-navy mb-1">
                    {i + 1}. &ldquo;{item.q}&rdquo;
                  </h3>
                  <p className="font-body text-navy/60 text-sm">
                    {item.guidance}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Questions to ask */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Questions to ask your interviewer
            </h2>
            <p className="font-body text-navy/60 mb-6">
              Having thoughtful questions shows genuine interest. Here are some
              strong options:
            </p>
          </FadeIn>
          <ul className="space-y-3">
            {QUESTIONS_TO_ASK.map((q, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                  <span className="font-body text-navy/70 text-[15px] italic">
                    &ldquo;{q}&rdquo;
                  </span>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* How to prepare */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              How to prepare
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Research the school deeply.</strong> Read the website, attend virtual events, talk to current students if possible.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Practice out loud.</strong> Thinking about answers is not the same as saying them. Practice with a family member or use our AI mock interview below.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Prepare 3-4 stories.</strong> Stories about challenges, growth, passions, and impact. You can adapt them to fit most questions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Be conversational, not rehearsed.</strong> Know your key points but do not memorize scripts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Dress one step above casual.</strong> Business casual is the sweet spot. No need for a suit.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Virtual vs in-person */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-8">
              Virtual vs in-person
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6">
            <FadeIn delay={0.05}>
              <div className="ktc-card p-6">
                <h3 className="font-display text-xl font-bold text-navy mb-4">Virtual</h3>
                <ul className="space-y-2 font-body text-navy/70 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Test your camera, mic, and internet beforehand
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Use a clean, well-lit background
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Look at the camera, not the screen, when speaking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Close all other tabs and notifications
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Have a glass of water nearby
                  </li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="ktc-card p-6">
                <h3 className="font-display text-xl font-bold text-navy mb-4">In-person</h3>
                <ul className="space-y-2 font-body text-navy/70 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Arrive 5-10 minutes early
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Bring a copy of your resume or activity list (optional but helpful)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Firm handshake, eye contact, genuine smile
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Usually held at a coffee shop or on campus
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Offer to buy the interviewer&apos;s coffee (polite gesture)
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Follow up */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Follow up
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Send a thank-you email within 24 hours. Keep it brief, sincere,
                and specific — reference something you discussed. This is not a
                formality; it leaves a lasting impression.
              </p>
              <div className="ktc-card p-6 mt-4">
                <p className="font-mono-label text-xs text-sage uppercase tracking-wider mb-3">
                  Sample structure
                </p>
                <ul className="space-y-2 text-sm text-navy/60">
                  <li>1. Thank them for their time</li>
                  <li>2. Reference a specific moment from the conversation</li>
                  <li>3. Reaffirm your interest in the college</li>
                  <li>4. Wish them well — keep it warm and human</li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* AI Voice Interview */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <p className="font-mono-label text-gold text-xs tracking-widest uppercase mb-2">
              Live AI Interview
            </p>
            <h2 className="font-display text-3xl font-bold text-navy mb-2">
              Practice with your voice
            </h2>
            <p className="font-body text-navy/60 mb-8">
              Our AI interviewer will ask you questions, listen to your answers
              through your microphone, and give you real-time feedback. It&apos;s
              the closest thing to a real interview you can get from home.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <VoiceInterview />
          </FadeIn>
        </div>
      </section>

      {/* AI Text Mock Interview */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p className="font-mono-label text-sage text-xs tracking-widest uppercase mb-2">
              AI mock interview
            </p>
            <h2 className="font-display text-3xl font-bold text-navy mb-2">
              Practice your answers
            </h2>
            <p className="font-body text-navy/60 mb-8">
              Select a question, type your answer as if you were speaking to an
              interviewer, and get instant feedback.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="ktc-card p-6 md:p-8">
              <div className="mb-4">
                <label className="font-body text-sm text-navy/60 mb-2 block">
                  Interview question
                </label>
                <select
                  value={selectedQuestion}
                  onChange={(e) => {
                    setSelectedQuestion(e.target.value);
                    setFeedback("");
                    setTips([]);
                  }}
                  className="w-full font-body text-sm border border-card rounded-md px-3 py-2 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
                >
                  {COMMON_QUESTIONS.map((cq) => (
                    <option key={cq.q} value={cq.q}>
                      {cq.q}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer as if you were speaking to the interviewer..."
                rows={8}
                className="w-full font-body text-[15px] text-navy border border-card rounded-md p-4 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 resize-y leading-relaxed placeholder:text-navy/30"
              />

              <div className="flex justify-end mt-4">
                <GoldButton
                  onClick={handleMockInterview}
                  disabled={loading || answer.trim().length < 20}
                >
                  {loading ? "Evaluating..." : "Get feedback"}
                </GoldButton>
              </div>

              {loading && (
                <div className="mt-6">
                  <LoadingSpinner />
                </div>
              )}

              {feedback && !loading && (
                <div className="mt-6 space-y-4">
                  <div className="p-6 bg-cream rounded-md border border-card">
                    <h3 className="font-display text-lg font-bold text-navy mb-3">
                      Feedback
                    </h3>
                    <p className="font-body text-navy/75 text-[15px] leading-relaxed">
                      {feedback}
                    </p>
                  </div>
                  {tips.length > 0 && (
                    <div className="p-6 bg-white rounded-md border border-card">
                      <h3 className="font-display text-lg font-bold text-navy mb-3">
                        Tips to improve
                      </h3>
                      <ul className="space-y-2">
                        {tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                            <span className="font-body text-navy/70 text-sm">
                              {tip}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Bottom nav */}
      <section className="py-16 bg-white border-t border-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6">
              Continue coaching
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/coach/recommendations" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Recommendations
              </Link>
              <Link href="/coach/essay" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                The Essay
              </Link>
              <Link href="/coach/financial-aid" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Financial Aid
              </Link>
              <Link href="/coach" className="font-body text-sm bg-gold/10 border border-gold/30 rounded-md px-5 py-2.5 text-navy hover:bg-gold/20 transition-colors">
                All Coach sections
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
