export interface EssayPrompt {
  id: string;
  number?: number;
  text: string;
  wordLimit: number;
}

export interface CollegePrompts {
  college: string;
  slug: string;
  url: string;
  prompts: EssayPrompt[];
}

export const COMMON_APP_PROMPTS: EssayPrompt[] = [
  {
    id: "ca-1",
    number: 1,
    text: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
    wordLimit: 650,
  },
  {
    id: "ca-2",
    number: 2,
    text: "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
    wordLimit: 650,
  },
  {
    id: "ca-3",
    number: 3,
    text: "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
    wordLimit: 650,
  },
  {
    id: "ca-4",
    number: 4,
    text: "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
    wordLimit: 650,
  },
  {
    id: "ca-5",
    number: 5,
    text: "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
    wordLimit: 650,
  },
  {
    id: "ca-6",
    number: 6,
    text: "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
    wordLimit: 650,
  },
  {
    id: "ca-7",
    number: 7,
    text: "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design.",
    wordLimit: 650,
  },
];

export const SUPPLEMENTAL_PROMPTS: CollegePrompts[] = [
  {
    college: "MIT",
    slug: "mit",
    url: "https://mitadmissions.org/apply/",
    prompts: [
      { id: "mit-1", text: "We know you lead a busy life, full of activities, many of which are required of you. Tell us about something you do simply for the pleasure of it.", wordLimit: 100 },
      { id: "mit-2", text: "Although you may not yet know what you want to study, describe an intellectual experience that has meant the most to you.", wordLimit: 100 },
    ],
  },
  {
    college: "Stanford University",
    slug: "stanford-university",
    url: "https://admission.stanford.edu/apply/",
    prompts: [
      { id: "stanford-1", text: "What is the most significant challenge that society faces today?", wordLimit: 250 },
      { id: "stanford-2", text: "How did you spend your last two summers?", wordLimit: 250 },
      { id: "stanford-3", text: "What historical moment or event do you wish you could have witnessed?", wordLimit: 250 },
    ],
  },
  {
    college: "Harvard University",
    slug: "harvard-university",
    url: "https://college.harvard.edu/admissions/apply/",
    prompts: [
      { id: "harvard-1", text: "Harvard has long recognized the importance of enrolling a diverse student body. How will the life experiences, perspectives, and skills that you bring enhance the Harvard community?", wordLimit: 650 },
    ],
  },
  {
    college: "University of Pennsylvania",
    slug: "university-of-pennsylvania",
    url: "https://admissions.upenn.edu/apply/",
    prompts: [
      { id: "upenn-1", text: "How will you explore community at Penn? Consider how Penn will help shape your perspective and identity, and how your identity and perspective will help shape Penn.", wordLimit: 250 },
    ],
  },
  {
    college: "Columbia University",
    slug: "columbia-university",
    url: "https://undergrad.admissions.columbia.edu/apply/",
    prompts: [
      { id: "columbia-1", text: "Why are you interested in attending Columbia University?", wordLimit: 150 },
      { id: "columbia-2", text: "List a few words or phrases that describe your ideal college community.", wordLimit: 150 },
    ],
  },
  {
    college: "Yale University",
    slug: "yale-university",
    url: "https://admissions.yale.edu/apply/",
    prompts: [
      { id: "yale-1", text: "What inspires you?", wordLimit: 250 },
    ],
  },
];

export const PROMPT_TIPS: Record<string, string[]> = {
  "ca-1": [
    "This is the 'identity' prompt — it works best when you focus on ONE specific aspect, not your whole life story.",
    "Show, don't tell. Instead of saying 'I'm passionate about music', describe a specific moment that reveals it.",
    "The best essays here surprise the reader. What would someone NOT guess about you from the rest of your application?",
    "Avoid cliches: immigration stories and sports injuries can work, but only if you go deeper than the surface narrative.",
  ],
  "ca-2": [
    "The failure itself is less important than your response to it. Spend 30% on what happened, 70% on what changed.",
    "Choose a real setback, not a humble-brag ('I worked too hard'). Admissions officers can tell the difference.",
    "Show growth, not just recovery. How did this experience change how you think or act going forward?",
    "Academic failures (a bad grade, rejected from a program) work well because they're relatable and specific.",
  ],
  "ca-3": [
    "This prompt rewards intellectual curiosity. What belief did you hold that turned out to be more complicated?",
    "Avoid hot-button political topics unless you can show genuine nuance and openness to other perspectives.",
    "The best essays show you changed your mind — or at least deeply examined why you believe what you believe.",
    "Frame it as a journey of thinking, not a debate you won.",
  ],
  "ca-4": [
    "This is the newest prompt. Focus on a specific, concrete act of kindness — not a general thank-you to your parents.",
    "The 'surprising' part is key. What gratitude caught you off guard? What did you learn about yourself from it?",
    "Show how this experience changed your behaviour or outlook, not just how it made you feel.",
  ],
  "ca-5": [
    "Pick a specific moment, not a gradual process. When exactly did the realisation click?",
    "The 'personal growth' should be genuine, not performed. What actually shifted inside you?",
    "Small moments often make better essays than big achievements. A conversation > winning a trophy.",
  ],
  "ca-6": [
    "This is the 'nerd out' prompt. Write about something you genuinely love learning about, not something that sounds impressive.",
    "Show your learning process — how you go down rabbit holes, who you talk to, what resources you use.",
    "The best essays here reveal HOW you think, not just WHAT you think about.",
    "Obscure, specific interests often make more memorable essays than broad ones.",
  ],
  "ca-7": [
    "Use this only if none of the other prompts fit your best story. Don't pick it because it seems 'easier'.",
    "This is a great choice if you have a specific essay you've already written that you're proud of.",
    "The freedom can be a trap — give yourself constraints. Pick a moment, a person, or a question to anchor it.",
  ],
};
