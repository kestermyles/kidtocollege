export const ACTIVITIES = [
  "Building things",
  "Helping people",
  "Solving puzzles",
  "Creating art",
  "Understanding how things work",
  "Writing/storytelling",
  "Leading teams",
  "Working with numbers",
  "Being outdoors",
  "Researching ideas",
];

export const WORK_STYLES = [
  "Alone and focused",
  "In a small team",
  "With lots of people",
  "Mix of both",
];

export const IMPACTS = [
  "Help individuals directly",
  "Build products/companies",
  "Advance human knowledge",
  "Create culture/art",
  "Protect the environment",
  "Serve my community",
  "Generate wealth",
  "Solve global problems",
];

export interface MajorResult {
  name: string;
  description: string;
  slug: string;
}

const MAJOR_DB: (MajorResult & { signals: string[] })[] = [
  { name: "Computer Science", slug: "computer-science", description: "Design software, build apps, and solve problems with code. One of the highest-demand degrees in the US.", signals: ["Building things", "Solving puzzles", "Working with numbers", "Alone and focused", "Build products/companies"] },
  { name: "Engineering", slug: "engineering", description: "Apply math and science to design, build, and improve everything from bridges to biomedical devices.", signals: ["Building things", "Understanding how things work", "Solving puzzles", "Working with numbers", "Solve global problems"] },
  { name: "Business / Entrepreneurship", slug: "business", description: "Learn how organizations work, from marketing to finance to management. Versatile and in demand.", signals: ["Leading teams", "Working with numbers", "With lots of people", "Build products/companies", "Generate wealth"] },
  { name: "Nursing / Pre-Med", slug: "nursing", description: "Care for people directly. Nursing offers immediate impact; pre-med is the path to becoming a doctor.", signals: ["Helping people", "Understanding how things work", "In a small team", "Help individuals directly", "Serve my community"] },
  { name: "Psychology", slug: "psychology", description: "Understand how people think, feel, and behave. Leads to counselling, research, UX design, and more.", signals: ["Helping people", "Researching ideas", "Solving puzzles", "Help individuals directly", "Advance human knowledge"] },
  { name: "Environmental Science", slug: "environmental-science", description: "Study ecosystems, climate, and conservation. Increasingly critical career path.", signals: ["Being outdoors", "Researching ideas", "Understanding how things work", "Protect the environment", "Solve global problems"] },
  { name: "Communications / Media", slug: "communications", description: "Tell stories, create content, manage brands. Covers journalism, PR, film, and digital media.", signals: ["Writing/storytelling", "Creating art", "With lots of people", "Create culture/art", "Build products/companies"] },
  { name: "Education", slug: "education", description: "Become a teacher or education leader. Shape the next generation directly.", signals: ["Helping people", "Leading teams", "With lots of people", "Help individuals directly", "Serve my community"] },
  { name: "Political Science / Public Policy", slug: "political-science", description: "Study government, law, and policy. Path to law school, government, nonprofits, and advocacy.", signals: ["Leading teams", "Researching ideas", "Writing/storytelling", "Serve my community", "Solve global problems"] },
  { name: "Data Science / Statistics", slug: "data-science", description: "Extract insights from data. Combines math, coding, and real-world problem solving.", signals: ["Working with numbers", "Solving puzzles", "Alone and focused", "Advance human knowledge", "Build products/companies"] },
  { name: "Art & Design", slug: "art-design", description: "Visual art, graphic design, UX/UI, architecture. Turn creativity into a career.", signals: ["Creating art", "Building things", "Alone and focused", "Create culture/art", "Build products/companies"] },
  { name: "Biology / Biotech", slug: "biology", description: "Study life at every scale — from molecules to ecosystems. Gateway to medicine, research, and biotech.", signals: ["Understanding how things work", "Researching ideas", "Being outdoors", "Advance human knowledge", "Help individuals directly"] },
  { name: "Criminal Justice", slug: "criminal-justice", description: "Study law enforcement, courts, and corrections. Leads to careers in policing, law, social work.", signals: ["Helping people", "Solving puzzles", "Leading teams", "Serve my community", "Help individuals directly"] },
  { name: "Economics / Finance", slug: "economics", description: "Understand markets, money, and decision-making. High-earning career paths in finance, consulting, policy.", signals: ["Working with numbers", "Solving puzzles", "Researching ideas", "Generate wealth", "Solve global problems"] },
  { name: "English / Creative Writing", slug: "english", description: "Master language, literature, and storytelling. Strong foundation for law, publishing, and content.", signals: ["Writing/storytelling", "Researching ideas", "Alone and focused", "Create culture/art", "Advance human knowledge"] },
];

export function scoreMajors(
  activities: string[],
  workStyle: string,
  impacts: string[]
): MajorResult[] {
  const allSignals = [...activities, workStyle, ...impacts];

  const scored = MAJOR_DB.map((major) => {
    const score = major.signals.filter((s) => allSignals.includes(s)).length;
    return { ...major, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 5).filter((m) => m.score > 0).map(({ name, description, slug }) => ({ name, description, slug }));
}
