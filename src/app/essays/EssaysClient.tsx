"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  COMMON_APP_PROMPTS,
  COALITION_APP_PROMPTS,
  QUESTBRIDGE_PROMPTS,
  SUPPLEMENTAL_PROMPTS,
  PROMPT_TIPS,
  type EssayPrompt,
} from "@/data/essay-prompts";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type Tab = "common" | "coalition" | "questbridge" | "supplemental";

const TABS: { key: Tab; label: string }[] = [
  { key: "common", label: "Common App" },
  { key: "coalition", label: "Coalition App" },
  { key: "questbridge", label: "QuestBridge" },
  { key: "supplemental", label: "Supplementals" },
];

function PromptCard({ prompt, source, sourceUrl }: { prompt: EssayPrompt; source: string; sourceUrl: string }) {
  const [showTips, setShowTips] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const tips = PROMPT_TIPS[prompt.id] || [];

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/essay-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, promptText: prompt.text }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I had trouble connecting. Try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function openChat() {
    setShowChat(true);
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Let's brainstorm for this prompt. Tell me a bit about yourself \u2014 what's one thing that comes to mind when you read this? Don't overthink it, just share what surfaces first." }]);
    }
  }

  return (
    <div className="ktc-card p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        {prompt.number && (
          <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center font-mono text-xs font-bold text-gold flex-shrink-0">{prompt.number}</span>
        )}
        <span className="ml-auto px-2.5 py-0.5 rounded-full bg-navy/5 font-mono-label text-xs text-navy/50 flex-shrink-0">{prompt.wordLimit} words</span>
      </div>
      <p className="font-body text-navy/80 text-sm leading-relaxed mb-4">{prompt.text}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {tips.length > 0 && (
          <button onClick={() => setShowTips(!showTips)} className="px-3 py-1.5 rounded-md text-xs font-body font-medium border border-gray-200 text-navy/60 hover:border-gold/40 transition-colors">
            {showTips ? "Hide tips" : "Coaching tips"}
          </button>
        )}
        <button onClick={openChat} className="px-3 py-1.5 rounded-md text-xs font-body font-medium bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 transition-colors">
          Brainstorm with AI
        </button>
      </div>

      {showTips && tips.length > 0 && (
        <div className="mt-4 bg-cream rounded-lg p-4">
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 font-body text-xs text-navy/70">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showChat && (
        <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${m.role === "user" ? "bg-navy text-white" : "bg-white text-navy border border-gray-100"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage(input)} placeholder="Share your thoughts..." className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gold/40" />
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} className="bg-gold hover:bg-gold/90 text-navy text-xs font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-40">Send</button>
          </div>
        </div>
      )}

      <p className="text-xs text-navy/30 mt-3">
        Source: <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-navy/50">{source}</a>
      </p>
    </div>
  );
}

export default function EssaysPage() {
  const [tab, setTab] = useState<Tab>("common");
  const [selectedCollege, setSelectedCollege] = useState(SUPPLEMENTAL_PROMPTS[0].slug);

  const collegeData = SUPPLEMENTAL_PROMPTS.find((c) => c.slug === selectedCollege);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">Essay Prompts &amp; Coach</h1>
          <p className="font-body text-navy/60">Real prompts from every major application. AI coaching to help you find your voice.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-md text-xs sm:text-sm font-body font-medium transition-colors whitespace-nowrap px-2 ${
                tab === t.key ? "bg-white text-navy shadow-sm" : "text-navy/50 hover:text-navy/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Common App */}
        {tab === "common" && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="font-body text-xs text-navy/40">2026&ndash;27 prompts &middot; 650 word limit &middot; Source: commonapp.org</p>
            </div>
            {COMMON_APP_PROMPTS.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} source="commonapp.org" sourceUrl="https://www.commonapp.org/apply/essay-prompts" />
            ))}
          </div>
        )}

        {/* Coalition App */}
        {tab === "coalition" && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="font-body text-xs text-navy/40">2026&ndash;27 prompts &middot; 500&ndash;650 word limit &middot; Source: coalitionforcollegeaccess.org</p>
              <div className="mt-2 bg-sage/10 border border-sage/20 rounded-lg px-4 py-3">
                <p className="font-body text-xs text-sage">Used by 150+ colleges including many HBCUs and Hispanic-Serving Institutions. If your colleges accept Coalition, this is a great option.</p>
              </div>
            </div>
            {COALITION_APP_PROMPTS.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} source="coalitionforcollegeaccess.org" sourceUrl="https://www.coalitionforcollegeaccess.org/essays" />
            ))}
          </div>
        )}

        {/* QuestBridge */}
        {tab === "questbridge" && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="font-body text-xs text-navy/40">Word limits vary (250&ndash;600 words) &middot; Source: questbridge.org</p>
              <div className="mt-2 bg-gold/10 border border-gold/30 rounded-lg px-4 py-3">
                <p className="font-body text-sm text-navy">
                  <strong>QuestBridge is free</strong> and can earn you a full scholarship worth $250,000+. If your family earns under $65,000/year, you should apply.{" "}
                  <a href="https://www.questbridge.org" target="_blank" rel="noopener noreferrer" className="text-gold underline">Learn more &rarr;</a>
                </p>
              </div>
            </div>
            {QUESTBRIDGE_PROMPTS.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} source="questbridge.org" sourceUrl="https://www.questbridge.org" />
            ))}
          </div>
        )}

        {/* Supplementals */}
        {tab === "supplemental" && (
          <div>
            <div className="mb-6">
              <label className="font-body text-sm font-medium text-navy block mb-2">Select a college</label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60 bg-white"
              >
                {SUPPLEMENTAL_PROMPTS.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.college}</option>
                ))}
              </select>
            </div>
            {collegeData && (
              <div className="space-y-4">
                {collegeData.prompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} source={`${collegeData.college} admissions`} sourceUrl={collegeData.url} />
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-navy/30 mt-8 text-center">
          Prompts sourced from official application websites. Always verify current prompts before submitting.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/coach/essay" className="px-5 py-2.5 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors">Essay Feedback Tool</Link>
          <Link href="/coach" className="px-5 py-2.5 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors">The Coach</Link>
        </div>

        {/* ===== Writing Authentically in the AI Age ===== */}
        <section className="mt-16 pt-12 border-t border-card">
          <span className="font-mono-label text-xs uppercase tracking-wider text-gold">Voice</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mt-2 mb-4">
            Writing authentically in the AI age
          </h2>
          <p className="font-body text-navy/70 leading-relaxed mb-8">
            AI writing tools exist. ChatGPT, Claude, Gemini. They&apos;re free, they&apos;re good at
            generating text, and students are using them. There&apos;s a line between using AI as a
            brainstorming tool and letting it write your essay. One helps. One hurts.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="ktc-card p-5 border-l-4 border-l-sage">
              <h3 className="font-display text-base font-bold text-navy mb-3">
                Appropriate AI use
              </h3>
              <ul className="space-y-2 font-body text-sm text-navy/70">
                <li className="flex gap-2"><span className="text-sage shrink-0">&rarr;</span>Brainstorming essay topics</li>
                <li className="flex gap-2"><span className="text-sage shrink-0">&rarr;</span>Understanding what prompts are asking</li>
                <li className="flex gap-2"><span className="text-sage shrink-0">&rarr;</span>Grammar and clarity checking</li>
                <li className="flex gap-2"><span className="text-sage shrink-0">&rarr;</span>Getting unstuck on structure</li>
                <li className="flex gap-2"><span className="text-sage shrink-0">&rarr;</span>Asking for feedback on clarity</li>
              </ul>
            </div>
            <div className="ktc-card p-5 border-l-4 border-l-crimson">
              <h3 className="font-display text-base font-bold text-navy mb-3">
                Inappropriate AI use
              </h3>
              <ul className="space-y-2 font-body text-sm text-navy/70">
                <li className="flex gap-2"><span className="text-crimson shrink-0">&times;</span>Writing full drafts for you</li>
                <li className="flex gap-2"><span className="text-crimson shrink-0">&times;</span>Generating paragraphs</li>
                <li className="flex gap-2"><span className="text-crimson shrink-0">&times;</span>Heavy rewriting that removes your voice</li>
                <li className="flex gap-2"><span className="text-crimson shrink-0">&times;</span>Fabricating or embellishing experiences</li>
                <li className="flex gap-2"><span className="text-crimson shrink-0">&times;</span>Creating content you didn&apos;t write</li>
              </ul>
            </div>
          </div>

          <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 mb-6">
            <h3 className="font-display text-base font-bold text-navy mb-3">
              Why your voice matters
            </h3>
            <p className="font-body text-sm text-navy/80 leading-relaxed mb-3">
              Admissions officers can often tell when an essay has been AI-assisted. Not always
              through detection software - more often through pattern recognition. When you&apos;ve
              read thousands of essays, you notice overly polished prose that doesn&apos;t match the
              rest of the application.
            </p>
            <p className="font-body text-sm text-navy/80 leading-relaxed">
              Even if you never get caught, there&apos;s a bigger problem: an AI-written essay
              doesn&apos;t tell admissions officers who you are. It tells them who AI thinks you
              should sound like. Which is generic, polished, and forgettable.
            </p>
          </div>

          <div className="ktc-card bg-cream p-6">
            <h3 className="font-display text-base font-bold text-navy mb-2">
              The talk-first method
            </h3>
            <p className="font-body text-sm text-navy/70 mb-4">
              The best way to write an essay that sounds like you? Talk first, type second.
            </p>
            <ol className="space-y-3 font-body text-sm text-navy/80">
              <li className="flex gap-3">
                <span className="font-mono-label text-gold font-bold shrink-0">01</span>
                <span><strong>Pick your topic.</strong> You don&apos;t need an outline - just know what you want to write about.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono-label text-gold font-bold shrink-0">02</span>
                <span><strong>Record yourself.</strong> Open your phone&apos;s voice recorder.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono-label text-gold font-bold shrink-0">03</span>
                <span><strong>Pretend you&apos;re telling a friend.</strong> Not an admissions officer - someone who knows you.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono-label text-gold font-bold shrink-0">04</span>
                <span><strong>Talk for 5-10 minutes.</strong> Don&apos;t stop, don&apos;t edit yourself, just tell the story.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono-label text-gold font-bold shrink-0">05</span>
                <span><strong>Transcribe it.</strong> Your phone can do this automatically.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono-label text-gold font-bold shrink-0">06</span>
                <span><strong>That&apos;s your first draft.</strong> Clean up the &ldquo;um&rdquo;s, fix grammar, but keep the structure.</span>
              </li>
            </ol>
            <Link
              href="/blog/series/college-essay-guide-2026"
              className="inline-block mt-5 font-body text-sm text-gold font-medium hover:text-gold/80"
            >
              Read the full 6-part essay guide &rarr;
            </Link>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="mt-16 pt-12 border-t border-card">
          <span className="font-mono-label text-xs uppercase tracking-wider text-gold">FAQ</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mt-2 mb-6">
            Questions students actually ask
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Can I use AI tools like ChatGPT for my college essay?",
                a: "AI can help with brainstorming topics, understanding prompts, and checking grammar - but it shouldn't write your essay. Use AI to explore ideas and get unstuck, not to generate paragraphs or full drafts. Admissions officers can often spot AI-generated content, and even if they can't, an AI-written essay doesn't reveal who you actually are. Your essay needs to sound like you, not like a polished AI assistant.",
              },
              {
                q: "How do I make sure my essay sounds like me and not AI?",
                a: "Read it out loud. If you stumble over words you'd never say in conversation, change them. If it sounds like something you'd read in a textbook instead of something you'd say to a friend, you've over-edited. Try the talk-first method: record yourself telling the story to a friend, transcribe it, then clean it up. That captures your actual voice better than typing from scratch.",
              },
              {
                q: "What does 'show don't tell' actually mean?",
                a: "Instead of saying 'I was nervous,' show what nervous looked like: 'My note cards were damp from holding them too tight.' Instead of 'I learned responsibility,' show the moment: 'I checked the freezer door three times because I couldn't remember if I'd locked it.' Specific sensory details (what you saw, heard, felt) make your story real and uniquely yours.",
              },
              {
                q: "My life is boring. What can I write about?",
                a: "You don't need to have climbed Everest or survived a tragedy. Strong essays have been written about working a register at a hardware store, teaching a younger sibling to tie their shoes, failing a driver's test twice, and keeping a composition notebook in a grandfather's truck. The topic matters less than the honesty and specificity of how you tell the story. What moments from your actual life do you still think about? Start there.",
              },
            ].map((item) => (
              <details key={item.q} className="ktc-card p-5 group">
                <summary className="font-display text-base font-bold text-navy cursor-pointer list-none flex items-start justify-between gap-3">
                  <span>{item.q}</span>
                  <span className="font-mono-label text-gold text-sm mt-1 transition-transform group-open:rotate-45 shrink-0">+</span>
                </summary>
                <p className="font-body text-sm text-navy/70 leading-relaxed mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ===== Essay Voice Check ===== */}
        <section className="mt-16 pt-12 border-t border-card">
          <span className="font-mono-label text-xs uppercase tracking-wider text-gold">Self-check</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mt-2 mb-3">
            Essay voice check
          </h2>
          <p className="font-body text-navy/60 mb-6">
            Use this checklist to make sure your essay sounds like you:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "The voice test",
                items: [
                  "If I read this out loud, does it sound like me talking to a friend?",
                  "Would someone who knows me well recognize this as my writing?",
                  "Am I using words I'd actually say in conversation?",
                ],
              },
              {
                title: "The specificity test",
                items: [
                  "Could another student have written this exact essay?",
                  "Have I included details only I would know?",
                  "Did I name specific moments, not general experiences?",
                ],
              },
              {
                title: "The honesty test",
                items: [
                  "Did I write this myself, or did AI write significant portions?",
                  "Am I telling the truth about what happened?",
                  "Am I being authentic, or trying to sound impressive?",
                ],
              },
              {
                title: "The story test",
                items: [
                  "Does this show what happened, not just tell about it?",
                  "Have I explained what I learned or how I grew?",
                  "Does the essay answer the prompt?",
                ],
              },
            ].map((group) => (
              <div key={group.title} className="ktc-card p-5">
                <h3 className="font-display text-base font-bold text-navy mb-3">{group.title}</h3>
                <ul className="space-y-2">
                  {group.items.map((q) => (
                    <li key={q}>
                      <label className="flex items-start gap-2 font-body text-sm text-navy/80 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 accent-gold rounded border-gray-300 shrink-0"
                        />
                        <span>{q}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="font-body text-sm text-navy/50 mt-6">
            If you checked all boxes, you&apos;re on the right track. If you hesitated on any,
            that&apos;s where to focus your revision.
          </p>
        </section>
      </div>
    </div>
  );
}
