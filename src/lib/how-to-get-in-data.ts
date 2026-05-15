// School-specific "how to get into X" editorial content.
//
// Each entry adds a unique editorial angle on top of the data we
// already show on /college/[slug]. The page focuses exclusively
// on admissions strategy — not the school's general info — to keep
// the URL meaningfully distinct from the main college page
// (avoids doorway-page issues with search engines).

export interface HowToGetInEntry {
  slug: string;
  /** One-line hook for the H1 / OG description */
  hook: string;
  /** What makes this school distinctive in admissions */
  angle: string;
  /** Concrete steps unique to this school */
  steps: string[];
  /** Common mistakes that hurt applicants here */
  mistakes: string[];
  /** Encouragement / context for borderline applicants */
  borderline: string;
}

export const HOW_TO_GET_IN: HowToGetInEntry[] = [
  {
    slug: "harvard-university",
    hook: "How to get into Harvard: what an actually competitive application looks like",
    angle: "Harvard rejects 96% of applicants. The 4% who get in aren't 'better' than the 4% just below the line — they're better at being distinctive. Harvard wants depth and impact, not breadth. One thing you cared about for 4 years beats five clubs.",
    steps: [
      "Build one genuinely high-effort, multi-year project — research, business, art, athletics, activism — that demonstrably impacted other people. The 'spike' matters more than well-roundedness.",
      "Get a near-perfect GPA in the hardest curriculum your school offers. Harvard's median admit has 11+ APs/IBs with mostly 5s.",
      "Submit SAT 1500+ or ACT 34+. Test-optional is technically allowed but admit data shows submitters fare better at the top.",
      "Write essays that show how you think, not what you've done. The Common App + Harvard supplements give 5+ writing opportunities — use them to show range.",
      "Get teacher recs from teachers who have taught you a junior or senior year academic class. They need to write specifically, not just enthusiastically.",
    ],
    mistakes: [
      "Listing 12 activities at surface level. Harvard wants to see depth — pick 4-6 that mean something.",
      "Reusing the Common App essay for every supplement. Each Harvard supplement is graded on its own merit.",
      "Treating the alumni interview as a chance to brag. It's a chance to be likable.",
    ],
    borderline:
      "If your stats are at Harvard's median and you have one distinctive thing, you have a chance. If you're below the 25th percentile on test scores or GPA without a major hook (recruited athlete, first-gen + low income, recognized national achievement), the odds are very long. Pour your energy into Harvard's peer set (Yale, Princeton, MIT, Stanford) too.",
  },
  {
    slug: "stanford-university",
    hook: "How to get into Stanford: intellectual vitality matters more than raw stats",
    angle: "Stanford has rejected 1500 SAT, 4.0 GPA, multi-AP applicants for decades. They reward curiosity and originality over credentials. 'Intellectual vitality' is their actual stated value — show them a brain that does interesting things on its own time.",
    steps: [
      "Identify the thing you do that you'd do whether or not it was on a transcript. Make that thing the through-line of your application.",
      "Write supplements that demonstrate how you think when you're learning something new. The 'What 5 things matter to you' and roommate letter are not the same; treat them differently.",
      "Push your academic intensity beyond what your school offers — dual enrollment, summer programs at top universities, independent research.",
      "Aim for 1500+ SAT or 34+ ACT if applying test-required (most years it's test-flexible). Median admit is around 1530.",
      "Apply Restrictive Early Action if Stanford is your clear top choice — modest acceptance bump.",
    ],
    mistakes: [
      "Treating Stanford like a Harvard clone. They reward different things — quirk and intellectual hunger over polish and pedigree.",
      "Submitting work that feels generic. Stanford readers see a lot of essays about robotics and debate; if yours is one of them, the essay needs to be unmistakably yours.",
      "Underselling humanities interests. Stanford's English, history, and philosophy departments are world-class and admit students with humanities spikes too.",
    ],
    borderline:
      "Stanford's admit rate is the lowest in the country (under 4%) and not particularly correlated with stats above the median. If you're not a recruited athlete, donor legacy, or genuinely distinctive applicant, treat Stanford as a reach regardless of credentials. Spend most of your energy on schools where your admission chances are realistic.",
  },
  {
    slug: "massachusetts-institute-of-technology",
    hook: "How to get into MIT: the application format that lets the right kids in",
    angle: "MIT's application is the most unusual in the country. No Common App essay. Short answers only — under 250 words each. No interview unless you opt in. They built it this way because they wanted to see kids who actually do STEM, not kids who write polished essays about doing STEM.",
    steps: [
      "Do something hands-on, technical, and ambitious. Build a thing. Run an experiment. Write code that someone uses. MIT can tell the difference between 'I joined robotics club' and 'I redesigned the chassis from scratch.'",
      "Get math grades and test scores at the top. MIT median SAT math is 790-800. AMC/AIME/USAMO scores help if you have them.",
      "Make sure your application shows technical depth in one area, not surface across many. The short-answer format rewards specifics.",
      "Get a 'maker' teacher rec — someone who has seen you build, debug, or invent.",
      "Apply Early Action by Nov 1 if you're ready. Slight acceptance bump, no commitment.",
    ],
    mistakes: [
      "Padding short answers with vague hand-wavy passion language. MIT readers want technical specifics.",
      "Skipping the optional Maker Portfolio. If you've built anything, submit it.",
      "Treating MIT like a Harvard substitute. The school culture, application, and values are different.",
    ],
    borderline:
      "MIT is one of the few top schools where stats really do matter as a floor. If your SAT math is below 750 or you're not in the top 10% of your math class, you'll likely need an unmistakable technical achievement (research publication, IMO medal, founded company that ships product) to clear the bar.",
  },
  {
    slug: "yale-university",
    hook: "How to get into Yale: writing matters more than at peer schools",
    angle: "Yale's essays are the longest among the Ivies and weigh disproportionately in admissions. The 'Why Yale' supplement plus three additional 200-word responses give you 1500+ words to make a case. Most rejected applicants had strong stats — the difference was the writing.",
    steps: [
      "Treat the Yale supplements like a writing portfolio. Each one should have a different voice, angle, and topic.",
      "Show how you'll specifically use Yale — residential college life, distributive curriculum, specific professors. Generic 'I love the community' answers don't work here.",
      "Maintain a 3.95+ GPA in the toughest curriculum. Yale's admit median is among the highest in the country.",
      "SAT 1510+ / ACT 34+ remains the soft floor for non-hooked applicants.",
      "Apply Single-Choice Early Action if Yale is your clear first choice — meaningful acceptance bump for unhooked candidates.",
    ],
    mistakes: [
      "Treating the Yale supplements as a checkbox. They're the most-read part of your application.",
      "Underestimating the strength of Yale's humanities and arts programs — STEM-only applicants are slightly disadvantaged.",
      "Filing under 'social impact' if your activities don't show sustained commitment. Yale's readers can tell the difference between resume-building and genuine service.",
    ],
    borderline:
      "If your writing is the strongest part of your application, Yale is a better fit than Princeton or MIT. If your stats are at the median and you have a clear voice on paper, the supplements give you more room to differentiate than at peer schools.",
  },
  {
    slug: "princeton-university",
    hook: "How to get into Princeton: undergrad focus + the research culture",
    angle: "Princeton is the most undergraduate-focused Ivy. No medical or business school competing for faculty attention. Every applicant should understand and reference this — the senior thesis, junior independent work, and small-class culture are the actual differentiators. If you don't care about undergraduate research, Princeton isn't your school.",
    steps: [
      "Reference Princeton's undergraduate research culture specifically in the supplement. 'Senior thesis' and 'JP' (junior paper) are the keywords.",
      "Identify departments and faculty whose research aligns with yours and name them in essays.",
      "Maintain top stats: 3.95+ GPA in rigorous coursework, 1510+ SAT / 34+ ACT.",
      "Apply Single-Choice Early Action if Princeton is your clear #1 — 4-5% acceptance lift for unhooked applicants.",
      "Get a teacher rec from someone who saw you do original work (research project, capstone, independent study).",
    ],
    mistakes: [
      "Generic 'why Princeton' essays. Readers can spot a copy-pasted Ivy essay immediately.",
      "Listing graduate-level interests Princeton doesn't really offer (medicine, business, law).",
      "Ignoring the residential college system in your application. Princeton is one of the few schools where the residential college you'll join is part of admissions consideration.",
    ],
    borderline:
      "Princeton's biggest differentiator from Harvard and Yale is the financial aid: families under $100k pay nothing. If you're low-income or first-gen, your application gets read with that context. Princeton's diversity push is real and policy-backed.",
  },
  {
    slug: "ut-austin",
    hook: "How to get into UT Austin: the top 6% rule and what to do if you miss it",
    angle: "UT Austin admits 75% of its in-state class from the top 6% of Texas high school classes automatically. If you're a Texas resident in that band, you have a guaranteed seat (in 'a major', not necessarily your first-choice major). Everyone else competes for the remaining 25% holistically — and that gets very competitive, especially for engineering, business, and CS.",
    steps: [
      "If you're a Texas resident: confirm your rank by junior year. Top 6% = auto-admit. Then strategize for your major (engineering, business, CS, architecture, etc. have separate program admissions).",
      "If you're a Texas resident outside top 6%: build a strong holistic application. Test scores, essays, recs, and major-specific work all matter.",
      "If you're not a Texas resident: out-of-state admissions are far more competitive. ACT 33+/SAT 1450+, top-decile rank, and strong essays are typical.",
      "For competitive majors (McCombs Business, Cockrell Engineering, CS): apply directly to the major. Internal transfers later are very competitive.",
      "ApplyTexas or Common App — UT accepts both. Strong essays on the topic prompts are weighted heavily for non-auto-admit applicants.",
    ],
    mistakes: [
      "Assuming top-6% auto-admit gets you any major. It gets you 'into UT' — not into McCombs or Cockrell. Plan accordingly.",
      "Treating UT as a safety because of the auto-admit rule, then writing weak essays. Holistic-pool applicants need polished essays.",
      "Missing the Texas Application deadline (usually Dec 1, ahead of many other schools).",
    ],
    borderline:
      "If you're an out-of-state applicant: UT Austin is roughly as competitive as a top-30 private. Plan accordingly. If you're a Texas resident outside top 6%: strong essays + ECs + competitive test scores can absolutely get you in, but it's not automatic — apply broadly within Texas too.",
  },
  {
    slug: "university-of-california-berkeley",
    hook: "How to get into Berkeley: the UC PIQs and major-specific admissions",
    angle: "Berkeley uses the UC Personal Insight Questions — four 350-word responses chosen from eight prompts. Unlike the Common App essay, these are graded individually, and they're the single largest differentiator. Berkeley also admits to specific colleges (Engineering, Letters & Science, Haas, etc.), and EECS within Engineering is one of the toughest admits in the country.",
    steps: [
      "Pick your four PIQ prompts strategically. Each one should add a distinct angle on you — don't repeat themes.",
      "If applying for EECS or Haas, your application is read for that specific program. Major-specific experience matters.",
      "GPA: weighted UC GPA matters. Take the most rigorous coursework available and earn As. Median admit weighted GPA is 4.3+.",
      "Berkeley is test-blind. Don't worry about SAT/ACT — they won't be considered.",
      "Build a long-form, demonstrably impactful EC. Berkeley loves community engagement and activism alongside academic depth.",
    ],
    mistakes: [
      "Writing 4 PIQ responses that all hit the same themes. Each should reveal something different.",
      "Treating Letters & Science as 'easier in than EECS' and then trying to internally transfer to CS. The transfer process is competitive — declare CS at application if it's your goal.",
      "Underestimating the importance of California residency. Out-of-state Berkeley admits are roughly half the rate of in-state.",
    ],
    borderline:
      "If you're a California resident with 4.0+ weighted GPA and strong essays, Berkeley is a target. If you're out-of-state, it's a reach regardless of credentials. Berkeley's affirmative-action prohibition means race-conscious admission tools other top schools use aren't available here — applicants from underrepresented backgrounds should ensure their PIQs surface their context.",
  },
  {
    slug: "rice-university",
    hook: "How to get into Rice: residential colleges and the 'Owl Days' culture",
    angle: "Rice is small (around 4,000 undergrads), tight-knit, and unusually focused on undergraduate experience. The residential college system — every student is placed into one of 11 residential colleges for all four years — is fundamental to admissions. Rice wants students who will actually engage with the community, not just collect the credential.",
    steps: [
      "Visit Owl Days (admitted students weekend) if accepted — Rice tracks demonstrated interest carefully and visiting matters.",
      "Reference the residential college system specifically in your 'Why Rice' supplement. The system is a defining feature.",
      "Maintain top stats: 3.9+ GPA, 1500+ SAT / 33+ ACT. Acceptance rate has dropped under 10%.",
      "Apply Early Decision if Rice is your clear top choice — 20%+ acceptance rate vs single-digit RD.",
      "Get strong teacher recs that speak to your interest in genuine intellectual community.",
    ],
    mistakes: [
      "Treating Rice as a backup to Stanford or MIT. Rice tracks demonstrated interest; lukewarm applications are read as such.",
      "Writing supplements that could apply to any school. Rice wants specifics.",
      "Underestimating Rice's selectivity. Acceptance rate has dropped from 17% to under 9% in 5 years.",
    ],
    borderline:
      "Rice's Generous financial aid and small-school feel make it a strong match for high-stat students who'd rather not be at a 30,000-student research university. If you're choosing between Rice and an Ivy: visit both. The cultures are different.",
  },
  {
    slug: "duke-university",
    hook: "How to get into Duke: ED bump and the right kind of leadership",
    angle: "Duke's Early Decision acceptance rate is roughly 4x its Regular Decision rate. If Duke is your clear #1 and you have strong stats, ED is the single biggest lever you have. Duke wants leaders — but specifically leaders who built something or organized people, not student-council-style résumé leadership.",
    steps: [
      "Apply Early Decision if Duke is your top choice (binding). Acceptance rate ~20% ED vs ~5% RD.",
      "Maintain 3.95+ unweighted GPA in the most rigorous curriculum. Duke is one of the most demanding readers for academic rigor.",
      "1500+ SAT / 34+ ACT remains the unspoken floor.",
      "Build a leadership story that shows tangible impact: organizations you founded, projects you led to completion, communities you grew.",
      "Write a 'Why Duke' supplement that names specific programs, professors, traditions (Cameron Crazies, Bass Connections, etc.).",
    ],
    mistakes: [
      "Skipping ED if Duke is your top choice and you can afford to commit. ED is the single biggest factor in your favor.",
      "Generic leadership claims. Duke's readers want to see what you actually did, not titles you held.",
      "Underestimating Duke's basketball/athletic culture. School spirit is real here and it shows in admissions essays.",
    ],
    borderline:
      "Duke is one of the schools where ED really does change odds dramatically. If you can afford to commit and Duke is your clear top choice, ED applicants in the middle of the academic range have a real shot — especially with strong essays and a clear 'why Duke' story.",
  },
  {
    slug: "carnegie-mellon-university",
    hook: "How to get into CMU: separate-college admissions and program-specific competitiveness",
    angle: "CMU is uniquely structured: you apply directly to a specific college (School of Computer Science, College of Engineering, College of Fine Arts, etc.) and they admit separately. SCS is one of the toughest admits in the country (under 6%). Fine Arts requires portfolios or auditions. CMU's holistic admissions evaluate within each college, not against the whole applicant pool.",
    steps: [
      "Apply to the college that matches your strongest qualifications. SCS for CS, College of Engineering for engineering, etc.",
      "Build college-specific experience: code projects/research for SCS, portfolio for Fine Arts, audition prep for Drama, etc.",
      "Take the most rigorous coursework available, especially in the area you're applying to. CMU SCS expects multivariable calculus by senior year.",
      "Write supplements that specifically address your chosen college and program.",
      "Get teacher recs that align with your target college (math/CS teacher for SCS, art teacher for Fine Arts).",
    ],
    mistakes: [
      "Applying to a college that doesn't match your strongest profile, thinking 'I'll transfer in.' Internal transfers between CMU colleges are very difficult.",
      "Treating SCS like another tech-focused engineering school. It's not — SCS is its own thing.",
      "Sending a generic Common App without college-specific tailoring.",
    ],
    borderline:
      "If SCS feels out of reach: Information Systems (IS) in Heinz College or Computational Biology in Mellon College of Science are still excellent CS-adjacent programs with higher acceptance rates. CMU's interdisciplinary culture lets you take SCS courses regardless of admitting college.",
  },
];

export function getHowToGetIn(slug: string): HowToGetInEntry | undefined {
  return HOW_TO_GET_IN.find((e) => e.slug === slug);
}
