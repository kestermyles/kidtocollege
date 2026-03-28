export interface RoleCopy {
  wizardTitle: string;
  wizardCollege: string;
  wizardMajor: string;
  wizardActivities: string;
  dashboardTitle: string;
  searchCta: string;
  coachIntro: string;
  essayLabel: string;
  checklistDesc: string;
  savedLabel: string;
}

const parentCopy: RoleCopy = {
  wizardTitle: "Tell us about your student",
  wizardCollege: "Which college are you thinking about?",
  wizardMajor: "What does your kid want to study?",
  wizardActivities: "Pick everything that applies \u2014 every interest counts",
  dashboardTitle: "Your family\u2019s college dashboard",
  searchCta: "Find your college",
  coachIntro: "Your personal college counsellor. Free.",
  essayLabel: "This is their essay. We just help them make it great.",
  checklistDesc: "Track your student\u2019s progress",
  savedLabel: "Saved colleges",
};

const studentCopy: RoleCopy = {
  wizardTitle: "Let\u2019s find your college",
  wizardCollege: "Which college are you thinking about?",
  wizardMajor: "What do you want to study?",
  wizardActivities: "Pick everything that applies \u2014 every interest counts",
  dashboardTitle: "Your college dashboard",
  searchCta: "Find my college",
  coachIntro: "Your personal college coach. Free.",
  essayLabel: "This is your essay. We just help you make it great.",
  checklistDesc: "Track your progress",
  savedLabel: "My colleges",
};

export function getRoleCopy(role: "parent" | "student" | null): RoleCopy {
  if (role === "student") return studentCopy;
  return parentCopy;
}
