"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoldButton } from "./GoldButton";

export function WizardPreview() {
  const router = useRouter();
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");

  const handleStart = () => {
    const params = new URLSearchParams();
    if (college) params.set("college", college);
    if (major) params.set("major", major);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="ktc-card p-8 md:p-10 max-w-2xl mx-auto">
      <h3 className="font-display text-2xl font-bold text-navy mb-2">
        Start your research
      </h3>
      <p className="text-navy/60 mb-6 font-body">
        Two questions. That&apos;s all it takes.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="wizard-college"
            className="block text-sm font-body font-medium text-navy mb-1"
          >
            Which college are you thinking about?
          </label>
          <input
            id="wizard-college"
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="e.g. University of Michigan"
            className="w-full px-4 py-3 border border-card rounded-md font-body text-navy placeholder:text-navy/30 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
          />
          <button
            onClick={() => {
              setCollege("");
              router.push("/search?mode=league");
            }}
            className="text-xs text-gold hover:text-gold/80 mt-1 font-body"
          >
            Not sure yet? Find the best colleges for your subject instead
          </button>
        </div>

        <div>
          <label
            htmlFor="wizard-major"
            className="block text-sm font-body font-medium text-navy mb-1"
          >
            What do you want to study?
          </label>
          <input
            id="wizard-major"
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="e.g. Computer Science, Nursing, Business"
            className="w-full px-4 py-3 border border-card rounded-md font-body text-navy placeholder:text-navy/30 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
          />
        </div>

        <GoldButton onClick={handleStart} size="lg" className="w-full mt-2">
          Let&apos;s go &rarr;
        </GoldButton>
      </div>
    </div>
  );
}
