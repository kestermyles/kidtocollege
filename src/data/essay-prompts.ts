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
  { id: "ca-1", number: 1, text: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.", wordLimit: 650 },
  { id: "ca-2", number: 2, text: "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?", wordLimit: 650 },
  { id: "ca-3", number: 3, text: "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?", wordLimit: 650 },
  { id: "ca-4", number: 4, text: "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?", wordLimit: 650 },
  { id: "ca-5", number: 5, text: "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.", wordLimit: 650 },
  { id: "ca-6", number: 6, text: "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?", wordLimit: 650 },
  { id: "ca-7", number: 7, text: "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design.", wordLimit: 650 },
];

export const COALITION_APP_PROMPTS: EssayPrompt[] = [
  { id: "coal-1", number: 1, text: "Tell a story from your life, describing an experience that either demonstrates your character or helped to shape it.", wordLimit: 650 },
  { id: "coal-2", number: 2, text: "What interests or excites you? How does it shape who you are now or who you might become in the future?", wordLimit: 650 },
  { id: "coal-3", number: 3, text: "Describe a time when you had a positive impact on others. What were the challenges? What were the rewards?", wordLimit: 650 },
  { id: "coal-4", number: 4, text: "Has there been a time when an idea or belief of yours was questioned? How did you respond? What did you learn?", wordLimit: 650 },
  { id: "coal-5", number: 5, text: "What success have you achieved or obstacle have you faced? What advice would you give a sibling or friend going through a similar experience?", wordLimit: 650 },
  { id: "coal-6", number: 6, text: "Submit an essay on a topic of your choice.", wordLimit: 650 },
];

export const QUESTBRIDGE_PROMPTS: EssayPrompt[] = [
  { id: "qb-1", number: 1, text: "Tell us about a person, place, or thing that has had a significant influence on your life.", wordLimit: 600 },
  { id: "qb-2", number: 2, text: "Describe a challenge you have faced and the process you went through to address it. What did you learn from the experience?", wordLimit: 600 },
  { id: "qb-3", number: 3, text: "What is a belief or ideal that you hold, and why do you believe in it?", wordLimit: 600 },
  { id: "qb-4", number: 4, text: "Tell us something about yourself that is not reflected elsewhere in your application.", wordLimit: 250 },
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
    college: "Howard University",
    slug: "howard-university",
    url: "https://howard.edu/admissions",
    prompts: [
      { id: "howard-1", text: "Howard University has a long history of producing leaders who impact the African American community and the world. How do you plan to contribute to Howard's legacy of leadership and service?", wordLimit: 500 },
    ],
  },
  {
    college: "Spelman College",
    slug: "spelman-college",
    url: "https://www.spelman.edu/admissions",
    prompts: [
      { id: "spelman-1", text: "Spelman College prepares women of African descent to make significant contributions to the world. How will your Spelman experience help you fulfill your purpose and serve your community?", wordLimit: 500 },
    ],
  },
  {
    college: "Morehouse College",
    slug: "morehouse-college",
    url: "https://www.morehouse.edu/admissions",
    prompts: [
      { id: "morehouse-1", text: "What does it mean to you to be a Morehouse Man, and how will you contribute to the legacy of Morehouse College?", wordLimit: 500 },
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
  {
    college: "University of Texas at Austin",
    slug: "ut-austin",
    url: "https://admissions.utexas.edu/apply/",
    prompts: [
      { id: "ut-1", text: "Discuss how your family, community background, or personal experiences have influenced the person you have become.", wordLimit: 500 },
    ],
  },
];

export const PROMPT_TIPS: Record<string, string[]> = {
  "ca-1": [
    "This is the 'identity' prompt \u2014 it works best when you focus on ONE specific aspect, not your whole life story.",
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
    "The best essays show you changed your mind \u2014 or at least deeply examined why you believe what you believe.",
    "Frame it as a journey of thinking, not a debate you won.",
  ],
  "ca-4": [
    "This is the newest prompt. Focus on a specific, concrete act of kindness \u2014 not a general thank-you to your parents.",
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
    "Show your learning process \u2014 how you go down rabbit holes, who you talk to, what resources you use.",
    "The best essays here reveal HOW you think, not just WHAT you think about.",
    "Obscure, specific interests often make more memorable essays than broad ones.",
  ],
  "ca-7": [
    "Use this only if none of the other prompts fit your best story. Don't pick it because it seems 'easier'.",
    "This is a great choice if you have a specific essay you've already written that you're proud of.",
    "The freedom can be a trap \u2014 give yourself constraints. Pick a moment, a person, or a question to anchor it.",
  ],
  "coal-1": [
    "Think about a moment that shaped who you are \u2014 not your entire biography.",
    "The best stories have a turning point. What changed during or after this experience?",
    "Use sensory details: what did you see, hear, feel? Make the reader experience it with you.",
  ],
  "coal-2": [
    "Go specific. 'I love science' is a topic. 'I spent three months trying to grow crystals in my closet' is a story.",
    "Show how this interest connects to your future \u2014 not just as a career, but as a way of seeing the world.",
  ],
  "coal-3": [
    "Honest impact > impressive impact. Helping one person in a real way is better than vague 'community service'.",
    "Don't forget the challenges \u2014 they make the story real and show resilience.",
  ],
  "qb-1": [
    "QuestBridge readers understand financial hardship \u2014 you don't need to prove you deserve help, just share your story.",
    "Focus on how this person/place/thing changed your perspective, not just what they did for you.",
    "Be specific and honest. QuestBridge values authenticity above all.",
  ],
  "qb-2": [
    "The challenge doesn't have to be dramatic \u2014 it should be real and personal.",
    "Show the process, not just the outcome. How did you think through the problem?",
  ],
};
