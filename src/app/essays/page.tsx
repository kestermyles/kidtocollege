"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  COMMON_APP_PROMPTS,
  SUPPLEMENTAL_PROMPTS,
  PROMPT_TIPS,
  type EssayPrompt,
} from "@/data/essay-prompts";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function PromptCard({
  prompt,
  source,
  sourceUrl,
}: {
  prompt: EssayPrompt;
  source: string;
  sourceUrl: string;
}) {
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
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I had trouble connecting. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function openChat() {
    setShowChat(true);
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Let's brainstorm for this prompt. Tell me a bit about yourself — what's one thing that comes to mind when you read this? Don't overthink it, just share what surfaces first.`,
        },
      ]);
    }
  }

  return (
    <div className="ktc-card p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        {prompt.number && (
          <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center font-mono text-xs font-bold text-gold flex-shrink-0">
            {prompt.number}
          </span>
        )}
        <span className="ml-auto px-2.5 py-0.5 rounded-full bg-navy/5 font-mono-label text-xs text-navy/50 flex-shrink-0">
          {prompt.wordLimit} words
        </span>
      </div>

      <p className="font-body text-navy/80 text-sm leading-relaxed mb-4">
        {prompt.text}
      </p>

      <div className="flex flex-wrap gap-2 mb-2">
        {tips.length > 0 && (
          <button
            onClick={() => setShowTips(!showTips)}
            className="px-3 py-1.5 rounded-md text-xs font-body font-medium border border-gray-200 text-navy/60 hover:border-gold/40 transition-colors"
          >
            {showTips ? "Hide tips" : "Coaching tips"}
          </button>
        )}
        <button
          onClick={openChat}
          className="px-3 py-1.5 rounded-md text-xs font-body font-medium bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 transition-colors"
        >
          Brainstorm with AI
        </button>
      </div>

      {/* Tips */}
      {showTips && tips.length > 0 && (
        <div className="mt-4 bg-cream rounded-lg p-4">
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 font-body text-xs text-navy/70"
              >
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat */}
      {showChat && (
        <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-navy text-white"
                      : "bg-white text-navy border border-gray-100"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Share your thoughts..."
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="bg-gold hover:bg-gold/90 text-navy text-xs font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-navy/30 mt-3">
        Source:{" "}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-navy/50"
        >
          {source}
        </a>
      </p>
    </div>
  );
}

export default function EssaysPage() {
  const [tab, setTab] = useState<"common" | "supplemental">("common");
  const [selectedCollege, setSelectedCollege] = useState(
    SUPPLEMENTAL_PROMPTS[0].slug
  );

  const collegeData = SUPPLEMENTAL_PROMPTS.find(
    (c) => c.slug === selectedCollege
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
            Essay Prompts &amp; Coach
          </h1>
          <p className="font-body text-navy/60">
            Real prompts. AI coaching. Write essays that sound like you.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setTab("common")}
            className={`flex-1 py-2.5 rounded-md text-sm font-body font-medium transition-colors ${
              tab === "common"
                ? "bg-white text-navy shadow-sm"
                : "text-navy/50 hover:text-navy/70"
            }`}
          >
            Common App
          </button>
          <button
            onClick={() => setTab("supplemental")}
            className={`flex-1 py-2.5 rounded-md text-sm font-body font-medium transition-colors ${
              tab === "supplemental"
                ? "bg-white text-navy shadow-sm"
                : "text-navy/50 hover:text-navy/70"
            }`}
          >
            Supplementals
          </button>
        </div>

        {/* Common App */}
        {tab === "common" && (
          <div className="space-y-4">
            {COMMON_APP_PROMPTS.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                source="commonapp.org"
                sourceUrl="https://www.commonapp.org/apply/essay-prompts"
              />
            ))}
          </div>
        )}

        {/* Supplementals */}
        {tab === "supplemental" && (
          <div>
            <div className="mb-6">
              <label className="font-body text-sm font-medium text-navy block mb-2">
                Select a college
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60 bg-white"
              >
                {SUPPLEMENTAL_PROMPTS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.college}
                  </option>
                ))}
              </select>
            </div>

            {collegeData && (
              <div className="space-y-4">
                {collegeData.prompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    source={`${collegeData.college} admissions`}
                    sourceUrl={collegeData.url}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom links */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/coach/essay"
            className="px-5 py-2.5 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors"
          >
            Essay Feedback Tool
          </Link>
          <Link
            href="/coach"
            className="px-5 py-2.5 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors"
          >
            The Coach
          </Link>
        </div>
      </div>
    </div>
  );
}
