"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TranscriptEntry {
  role: "interviewer" | "student";
  text: string;
}

interface FeedbackReport {
  score: number;
  strengths: string[];
  improvements: string[];
  quotes: { quote: string; note: string }[];
  betterAnswers: { question: string; original: string; suggested: string }[];
}

type Phase = "setup" | "interview" | "feedback";

const DEFAULT_QUESTIONS = [
  "Tell me about yourself and what led you to apply here.",
  "Why {college} specifically?",
  "What do you want to study and why?",
  "Tell me about a challenge you've overcome.",
  "What will you contribute to our campus community?",
  "Where do you see yourself in 10 years?",
  "Do you have any questions for me?",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VoiceInterview() {
  const [phase, setPhase] = useState<Phase>("setup");

  // Setup state
  const [college, setCollege] = useState("");
  const [interviewType, setInterviewType] = useState("Alumni interview");
  const [duration, setDuration] = useState(20);

  // Interview state
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);

  // Feedback state
  const [feedback, setFeedback] = useState<FeedbackReport | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const questionBank = useRef<string[]>([]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, liveText]);

  // Timer
  useEffect(() => {
    if (phase === "interview" && !isPaused) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, [phase, isPaused]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ------- Speech Synthesis -------
  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      utter.pitch = 1.0;
      // Try to find a natural voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) =>
        v.name.includes("Samantha") ||
        v.name.includes("Google UK English Female") ||
        v.name.includes("Karen") ||
        (v.lang.startsWith("en") && v.name.includes("Female"))
      );
      if (preferred) utter.voice = preferred;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => { setIsSpeaking(false); resolve(); };
      utter.onerror = () => { setIsSpeaking(false); resolve(); };
      window.speechSynthesis.speak(utter);
    });
  }, []);

  // ------- Speech Recognition -------
  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalText = "";

    recognition.onresult = (event: Event) => {
      const e = event as unknown as { resultIndex: number; results: { isFinal: boolean; 0: { transcript: string } }[] };
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalText += e.results[i][0].transcript + " ";
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setLiveText(finalText + interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setLiveText("");
  }, []);

  const stopListening = useCallback((): string => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    const captured = liveText.trim();
    setLiveText("");
    return captured;
  }, [liveText]);

  // ------- AI Brain -------
  const getAIResponse = useCallback(async (fullTranscript: string, qIdx: number) => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/coach/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "next-question",
          college,
          interviewType,
          transcript: fullTranscript,
          currentQuestionIndex: qIdx,
          questionBank: questionBank.current,
        }),
      });
      const data = await res.json();
      return data.response || questionBank.current[qIdx] || "Thank you for that answer.";
    } catch {
      return questionBank.current[qIdx] || "Tell me more about that.";
    } finally {
      setAiLoading(false);
    }
  }, [college, interviewType]);

  // ------- Interview Flow -------
  const startInterview = async () => {
    const questions = DEFAULT_QUESTIONS.map((q) =>
      q.replace("{college}", college || "this college")
    );
    questionBank.current = questions;
    setTranscript([]);
    setCurrentQIdx(0);
    setElapsed(0);
    setPhase("interview");

    const intro = `Hi, I'm your interviewer today. We'll spend about ${duration} minutes together. Let's begin. ${questions[0]}`;
    setTranscript([{ role: "interviewer", text: intro }]);
    await speak(intro);
    startListening();
  };

  const submitAnswer = async () => {
    const answer = stopListening();
    if (!answer) { startListening(); return; }

    const newTranscript: TranscriptEntry[] = [
      ...transcript,
      { role: "student", text: answer },
    ];
    setTranscript(newTranscript);

    const nextIdx = currentQIdx + 1;

    // Check if interview should end
    if (nextIdx >= questionBank.current.length || elapsed >= duration * 60) {
      const closing = "Thank you so much for your time today. It was really great speaking with you. Best of luck with your application!";
      setTranscript([...newTranscript, { role: "interviewer", text: closing }]);
      await speak(closing);
      endInterview([...newTranscript, { role: "interviewer", text: closing }]);
      return;
    }

    // Get AI's next line
    const fullText = newTranscript.map((t) => `${t.role}: ${t.text}`).join("\n");
    const aiResponse = await getAIResponse(fullText, nextIdx);
    setTranscript([...newTranscript, { role: "interviewer", text: aiResponse }]);
    setCurrentQIdx(nextIdx);
    await speak(aiResponse);
    startListening();
  };

  const endInterview = async (finalTranscript?: TranscriptEntry[]) => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    if (timerRef.current) clearInterval(timerRef.current);
    window.speechSynthesis?.cancel();
    setIsListening(false);
    setIsSpeaking(false);
    setPhase("feedback");
    setFeedbackLoading(true);

    const t = finalTranscript || transcript;
    const fullText = t.map((e) => `${e.role}: ${e.text}`).join("\n");

    try {
      const res = await fetch("/api/coach/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "feedback",
          college,
          interviewType,
          transcript: fullText,
          currentQuestionIndex: 0,
          questionBank: questionBank.current,
        }),
      });
      const data = await res.json();
      setFeedback(data);
    } catch {
      setFeedback({
        score: 7,
        strengths: ["You showed up and practiced — that alone puts you ahead"],
        improvements: ["Try the interview again to improve"],
        quotes: [],
        betterAnswers: [],
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  // ------- SETUP PHASE -------
  if (phase === "setup") {
    return (
      <div className="ktc-card p-6 md:p-8 max-w-lg mx-auto">
        <h3 className="font-display text-xl font-bold text-navy mb-1">
          AI Voice Interview
        </h3>
        <p className="font-body text-sm text-navy/50 mb-6">
          Practice a realistic college interview with our AI interviewer using your microphone.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
              College
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. Harvard, MIT, UCLA..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
              Interview type
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
            >
              <option>Alumni interview</option>
              <option>Admissions officer</option>
              <option>Scholarship panel</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono-label text-navy/60 mb-1 uppercase tracking-wider">
              Duration
            </label>
            <div className="flex gap-2">
              {[10, 20, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2 rounded-md font-body text-sm transition-all border ${
                    duration === d
                      ? "bg-gold/15 border-gold text-navy font-medium"
                      : "border-gray-200 text-navy/50 hover:border-gold/40"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startInterview}
            disabled={!college.trim()}
            className="w-full mt-4 px-6 py-4 bg-gold hover:bg-gold/90 text-navy font-body font-medium rounded-md text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start interview
          </button>
        </div>
      </div>
    );
  }

  // ------- INTERVIEW PHASE -------
  if (phase === "interview") {
    const progress = Math.min((currentQIdx / questionBank.current.length) * 100, 100);
    return (
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="font-mono-label text-sm text-navy/60">{formatTime(elapsed)}</span>
            <span className="font-body text-xs text-navy/40">
              Q{currentQIdx + 1}/{questionBank.current.length}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-4 py-2 text-sm font-body border border-gray-200 rounded-md text-navy/60 hover:border-gold transition-colors"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={() => endInterview()}
              className="px-4 py-2 text-sm font-body bg-crimson/10 border border-crimson/20 rounded-md text-crimson hover:bg-crimson/20 transition-colors"
            >
              End Interview
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main area */}
          <div className="lg:col-span-2 flex flex-col items-center">
            {/* Status */}
            <div className="text-center mb-8">
              {isSpeaking && (
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gold rounded-full animate-pulse"
                        style={{
                          height: `${16 + Math.random() * 24}px`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="font-body text-sm text-navy/50 mt-2">Interviewer is speaking...</p>
                </div>
              )}
              {aiLoading && (
                <p className="font-body text-sm text-navy/40 animate-pulse">Thinking...</p>
              )}
            </div>

            {/* Microphone button */}
            <button
              onClick={isListening ? submitAnswer : startListening}
              disabled={isSpeaking || aiLoading || isPaused}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 ${
                isListening
                  ? "bg-gold shadow-lg shadow-gold/30 scale-110"
                  : "bg-navy hover:bg-navy/80"
              }`}
            >
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-gold animate-ping opacity-30" />
              )}
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                {isListening ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                )}
              </svg>
            </button>
            <p className="font-body text-xs text-navy/40 mt-3">
              {isListening ? "Tap to submit your answer" : isSpeaking ? "Listening to interviewer..." : "Tap to start speaking"}
            </p>

            {/* Live text */}
            {liveText && (
              <div className="mt-6 w-full max-w-md p-4 bg-cream rounded-lg border border-gray-200">
                <p className="font-body text-sm text-navy/70 italic">{liveText}</p>
              </div>
            )}
          </div>

          {/* Transcript panel */}
          <div className="ktc-card p-4 max-h-[500px] overflow-y-auto">
            <h4 className="font-mono-label text-xs text-navy/40 uppercase tracking-wider mb-3">
              Transcript
            </h4>
            <div className="space-y-3">
              {transcript.map((entry, i) => (
                <div key={i}>
                  <span className={`font-mono-label text-[10px] uppercase tracking-wider ${
                    entry.role === "interviewer" ? "text-gold" : "text-sage"
                  }`}>
                    {entry.role === "interviewer" ? "Interviewer" : "You"}
                  </span>
                  <p className="font-body text-sm text-navy/70 mt-0.5">{entry.text}</p>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------- FEEDBACK PHASE -------
  return (
    <div className="max-w-3xl mx-auto">
      {feedbackLoading ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gold rounded-full animate-spin mx-auto mb-6" />
          <h3 className="font-display text-xl font-bold text-navy mb-2">
            Analyzing your interview...
          </h3>
          <p className="font-body text-sm text-navy/50">
            Our AI is reviewing your answers and preparing personalized feedback.
          </p>
        </div>
      ) : feedback ? (
        <div className="space-y-6">
          {/* Score */}
          <div className="ktc-card p-6 text-center">
            <p className="font-mono-label text-xs text-navy/40 uppercase tracking-wider mb-2">
              Overall Score
            </p>
            <p className="font-display text-6xl font-bold text-gold">{feedback.score}</p>
            <p className="font-body text-sm text-navy/50 mt-1">out of 10</p>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="ktc-card p-5">
              <h4 className="font-display text-lg font-bold text-navy mb-3">Strengths</h4>
              <ul className="space-y-2">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                    <span className="font-body text-sm text-navy/70">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ktc-card p-5">
              <h4 className="font-display text-lg font-bold text-navy mb-3">Areas to improve</h4>
              <ul className="space-y-2">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="font-body text-sm text-navy/70">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quotes */}
          {feedback.quotes.length > 0 && (
            <div className="ktc-card p-5">
              <h4 className="font-display text-lg font-bold text-navy mb-3">Key moments</h4>
              <div className="space-y-4">
                {feedback.quotes.map((q, i) => (
                  <div key={i} className="border-l-2 border-gold pl-4">
                    <p className="font-body text-sm text-navy italic">&ldquo;{q.quote}&rdquo;</p>
                    <p className="font-body text-xs text-sage mt-1">{q.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Better answers */}
          {feedback.betterAnswers.length > 0 && (
            <div className="ktc-card p-5">
              <h4 className="font-display text-lg font-bold text-navy mb-3">Stronger answer suggestions</h4>
              <div className="space-y-4">
                {feedback.betterAnswers.map((ba, i) => (
                  <div key={i} className="bg-cream rounded-lg p-4">
                    <p className="font-body text-xs text-navy/50 mb-1">Q: {ba.question}</p>
                    <p className="font-body text-sm text-navy/60 mb-2">Your answer: {ba.original}</p>
                    <p className="font-body text-sm text-sage font-medium">Try: {ba.suggested}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <button
              onClick={() => { setPhase("setup"); setFeedback(null); setTranscript([]); }}
              className="px-6 py-3 bg-gold hover:bg-gold/90 text-navy font-body font-medium rounded-md transition-colors"
            >
              Practice again
            </button>
            <Link
              href="/coach"
              className="px-6 py-3 border border-gray-200 text-navy font-body rounded-md hover:border-gold transition-colors"
            >
              Back to Coach
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
