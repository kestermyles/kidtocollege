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
  {
    slug: "brown-university",
    hook: "How to get into Brown: the Open Curriculum changes what readers look for",
    angle: "Brown has no general education requirements. Every class is taken because the student chose it. Admissions reads applications looking for self-directed learners who'd actually thrive without a checklist — not for AP-stacking valedictorians. Show them you're the kind of student who would invent your own curriculum.",
    steps: [
      "In supplements, name specific Brown courses, concentrations, and faculty — and explain why a school without distribution requirements is right for you, specifically.",
      "Build evidence of self-directed learning outside the classroom: independent reading projects, self-taught skills, a course you designed yourself.",
      "Maintain a top GPA in a curriculum that already shows breadth and depth chosen by you, not forced by the school.",
      "1500+ SAT or 34+ ACT remains the soft floor; Brown publishes admit-band data showing scores below 1450 are rare without a hook.",
      "Apply Early Decision if Brown is your clear top choice — meaningful acceptance bump (around 14% vs 5% RD).",
    ],
    mistakes: [
      "Generic 'Brown is amazing' supplements. The Open Curriculum essay is graded on whether you actually understand and want it.",
      "Treating the PLME (8-year BS/MD) as a backup to medical school. It's the most selective program at Brown — under 3% acceptance.",
      "Underestimating Brown's quirk. Readers like off-beat applicants and reward voice over polish.",
    ],
    borderline:
      "Brown rewards students who would genuinely use the Open Curriculum. If your essays show authentic curiosity across disciplines (not just one) and you can articulate why that matters, you punch above your stats. Treat the supplement as the single most important piece of your application.",
  },
  {
    slug: "dartmouth-college",
    hook: "How to get into Dartmouth: the D-Plan and small-school fit",
    angle: "Dartmouth is the smallest Ivy and the only one running on a quarter system with mandatory sophomore summer on campus (the D-Plan). Admissions filters hard for students who actually want a rural, undergraduate-focused, outdoorsy community — not students who put Dartmouth on the list because it's an Ivy.",
    steps: [
      "Address the D-Plan in your supplement. Show you've thought about how a four-quarter calendar with required summer residency works for your goals.",
      "Reference Dartmouth's small size, outdoor culture, and rural setting as features, not bugs. The wrong applicants treat 'Hanover, NH' as a downside.",
      "Maintain 3.9+ GPA and 1490+ SAT / 33+ ACT. Slight stat bump favored vs Brown/Yale.",
      "Apply Early Decision if Dartmouth is your top choice — acceptance rate roughly 4x RD.",
      "Get a teacher rec from someone who has taught small seminars or discussion-heavy courses — closer to how Dartmouth actually teaches.",
    ],
    mistakes: [
      "Listing Dartmouth alongside large research universities in 'why' essays. The fit signal is the opposite.",
      "Skipping Dartmouth visits if you can travel. Demonstrated interest is real here, especially for unhooked RD applicants.",
      "Treating 'rural' as something to overcome. Frame it correctly: it's why Dartmouth is what it is.",
    ],
    borderline:
      "Dartmouth is one of the schools where ED applicants in the middle of the stat band have a real shot — especially with clear fit signals. If you genuinely want a small undergraduate experience and can articulate that, your odds are meaningfully better than the headline 6% acceptance rate suggests.",
  },
  {
    slug: "cornell-university",
    hook: "How to get into Cornell: pick the right college and play to its strengths",
    angle: "Cornell has seven undergraduate colleges with separate admissions: Arts & Sciences, Engineering, Industrial & Labor Relations (ILR), Hotel Administration (Nolan), Human Ecology, Agriculture & Life Sciences (CALS), Architecture/Art/Planning (AAP). Acceptance rates range from 4% (AAP) to 17%+ (some CALS majors). Your college choice is the single biggest strategic decision.",
    steps: [
      "Pick the college that genuinely fits your interests AND maximizes your chances. CALS, Human Ecology, and ILR often have higher acceptance rates than Arts & Sciences for related majors.",
      "Write a 'Why this college at Cornell' supplement that names specific majors, faculty, and resources unique to that college. Generic answers get rejected.",
      "Maintain 3.95+ GPA; SAT 1500+ / ACT 34+ for the most competitive colleges (Engineering, Dyson, AAP).",
      "Apply Early Decision if Cornell is your top choice — meaningful bump, especially at lower-acceptance-rate colleges.",
      "Demonstrate fit through experience: ILR applicants should show interest in labor/policy, Hotelies should show hospitality work, CALS should show agriculture/life-science engagement.",
    ],
    mistakes: [
      "Applying to Engineering or Arts & Sciences because they 'sound prestigious' when your background fits CALS or Human Ecology better.",
      "Assuming you can internal-transfer easily after admission. It varies dramatically by college and major.",
      "Writing one generic 'Why Cornell' essay. Cornell's supplements are college-specific.",
    ],
    borderline:
      "Cornell is the Ivy where 'right-fit college' planning matters most. A student who'd be a marginal Arts & Sciences applicant can be a strong CALS or ILR applicant if their experiences align. Treat the college choice as a real strategic decision, not an afterthought.",
  },
  {
    slug: "columbia-university-in-the-city-of-new-york",
    hook: "How to get into Columbia: the Core Curriculum and New York City",
    angle: "Columbia has the most prescriptive curriculum in the Ivy League — the Core Curriculum requires every undergrad to take Lit Hum, CC, Art Hum, Music Hum, two semesters of writing, and frontiers of science. Applications that don't engage with the Core or with NYC specifically get filtered out fast.",
    steps: [
      "Address the Core Curriculum directly in your supplement. Read what the Core actually is; reference texts you'd be excited to study (Iliad, Plato, Marx, Woolf, etc.).",
      "Show why New York City — not just an 'urban setting' — matters to your interests. Specific neighborhoods, institutions, internship paths.",
      "Maintain 3.95+ GPA; 1510+ SAT / 34+ ACT. Columbia's published admit data is among the highest in the country.",
      "Apply Early Decision if Columbia is your top choice — acceptance rate roughly 11% ED vs 4% RD.",
      "Differentiate between Columbia College (CC), the School of Engineering (SEAS), and the School of General Studies. Most traditional undergrads apply to CC or SEAS.",
    ],
    mistakes: [
      "Treating Columbia as 'Harvard in New York.' The Core makes the curriculum fundamentally different.",
      "Generic NYC enthusiasm. 'I love New York' doesn't differentiate. Pick three specific things.",
      "Skipping engagement with humanities texts when applying to SEAS. SEAS students take Core requirements too.",
    ],
    borderline:
      "Columbia rewards applicants who genuinely engage with reading and writing across disciplines. If you can show love for the texts the Core covers, you stand out even among high-stat applicants. STEM-only applicants without humanities depth are at a real disadvantage here.",
  },
  {
    slug: "university-of-pennsylvania",
    hook: "How to get into Penn: pre-professional focus and the four schools",
    angle: "Penn is the most pre-professional Ivy. Four undergraduate schools (College of Arts & Sciences, Wharton, Engineering, Nursing) admit separately. Wharton is one of the toughest admits in the country (~5%) and admits with a strong pre-business signal. Penn rewards applicants who already know what they want to do and have evidence to back it up.",
    steps: [
      "Pick the school that matches your strongest pre-professional signal. Don't apply to Wharton hoping to 'figure it out' — you need a business story.",
      "Show concrete pre-professional engagement: Wharton applicants need business experience (internships, ventures, finance/economics work), Engineering needs research/build evidence, Nursing needs healthcare experience.",
      "Maintain 3.95+ GPA, 1500+ SAT / 34+ ACT.",
      "Apply Early Decision — meaningful acceptance bump and Penn explicitly rewards demonstrated interest.",
      "Reference Penn's interdisciplinary programs in supplements: Huntsman (Wharton + Arts), M&T (Engineering + Wharton), VIPER (Engineering + Energy Research) — even if you're not applying to them, knowing they exist shows you've researched Penn.",
    ],
    mistakes: [
      "Generic 'why Penn' that could apply to any Ivy. Penn's pre-professional culture is the differentiator.",
      "Applying to the College of Arts & Sciences with weak essays, thinking it's easier than Wharton. CAS is still highly competitive.",
      "Skipping ED if Penn is your clear top choice — ED is a 4x acceptance-rate factor here.",
    ],
    borderline:
      "Penn is one of the most ED-favoring top schools. If you can credibly commit and have a strong pre-professional story, ED applicants in the middle of the stat band have real chances — especially in CAS, Nursing, and Engineering.",
  },
  {
    slug: "university-of-chicago",
    hook: "How to get into UChicago: the supplemental essays are everything",
    angle: "UChicago's supplemental essays are famously unusual: the 'why UChicago' essay plus one of several long, philosophical, often-absurd prompts. They are not optional in any meaningful sense. Readers use them as the primary differentiator. Applicants who treat them seriously and play with ideas get rewarded. Polished, safe essays often get rejected.",
    steps: [
      "Treat the supplements like a portfolio. Pick the prompt that excites you most and go deep.",
      "Show genuine intellectual play. UChicago rewards weird ideas pursued seriously.",
      "Reference UChicago's quirks specifically: the Core, the Quads, scav hunt, the life of the mind language. Don't fake it — read about the school.",
      "Maintain 3.95+ GPA, 1510+ SAT / 34+ ACT. Median admit stats are at the top end of the country.",
      "Apply Early Action or Early Decision (UChicago offers both, plus ED2) — meaningful acceptance lift.",
    ],
    mistakes: [
      "Writing safe, polished supplements. UChicago is one of the few schools where 'playing it safe' actively hurts.",
      "Treating the unusual prompt as a joke. It's the most important essay in your application.",
      "Underestimating UChicago. Acceptance rate has dropped below 6% in 5 years.",
    ],
    borderline:
      "If you're a writer who likes ideas more than the school you're at, UChicago is the school where you can outperform your stats. The reverse is also true: if your stats are top-1% but you don't actually like thinking for its own sake, UChicago is harder to get into than your numbers suggest.",
  },
  {
    slug: "northwestern-university",
    hook: "How to get into Northwestern: ED, Medill, and the quarter system",
    angle: "Northwestern is one of the most ED-friendly top schools — roughly half the class fills in Early Decision. The school admits to specific colleges (Weinberg, McCormick, Medill, School of Communication, Bienen School of Music) and demonstrated interest plus program fit matter heavily. Medill (journalism) is particularly competitive and rewards specific journalism experience.",
    steps: [
      "Apply Early Decision if Northwestern is your top choice. Roughly 25% ED acceptance vs 7% RD.",
      "Show program-specific evidence: Medill applicants need real writing/journalism work, McCormick (engineering) needs build/research, School of Communication needs theatre/film/communication experience.",
      "Reference Northwestern's quarter system and how it fits your interests — typically lets students take more courses across more departments.",
      "Maintain 3.9+ GPA, 1500+ SAT / 33+ ACT.",
      "Visit if you can; Northwestern tracks demonstrated interest more than many top schools.",
    ],
    mistakes: [
      "Generic supplements. Northwestern is one of the schools where 'why us' has to be school-specific.",
      "Underestimating Medill's selectivity. It's effectively a top-10% acceptance rate within an already-selective school.",
      "Skipping ED if you can commit. Northwestern's ED is one of the biggest lever for admission.",
    ],
    borderline:
      "Northwestern's ED2 (yes, they have one) is another lever. If your top choice falls through in ED1 elsewhere, ED2 at Northwestern in January is a strong play. Stat band: applicants at the median have real chances ED, less so RD.",
  },
  {
    slug: "university-of-notre-dame",
    hook: "How to get into Notre Dame: Catholic identity is a real factor",
    angle: "Notre Dame is the most explicitly Catholic top US university. Roughly 80% of students identify as Catholic and the school's culture, mission, and admissions are deeply shaped by it. Non-Catholic applicants can absolutely get in (and many do), but applications that don't engage with Notre Dame's mission or community read as misaligned.",
    steps: [
      "Address Notre Dame's mission and community in your 'why' supplement. Service, faith, leadership for the common good — these aren't optional themes.",
      "Show service that's sustained, not resume-building. Catholic-school service trips, parish work, Habitat for Humanity, etc. matter.",
      "Maintain 3.9+ GPA, 1480+ SAT / 33+ ACT.",
      "Apply Restrictive Early Action — slight acceptance bump and Notre Dame respects demonstrated interest.",
      "Get a teacher recommendation that speaks to character and ethics, not just academic performance.",
    ],
    mistakes: [
      "Skipping engagement with Notre Dame's Catholic identity in essays. Even non-Catholic applicants need to show they understand the community they'd be joining.",
      "Treating Notre Dame like a backup to top private schools. The culture is different and admissions reads for fit.",
      "Underestimating the Mendoza College of Business — among the top business programs and competitive within Notre Dame.",
    ],
    borderline:
      "Notre Dame admissions are unusually fit-driven. Applicants with median stats who connect authentically with Notre Dame's mission have stronger odds than the headline 12% acceptance rate suggests. The reverse: high-stat applicants with no service or mission engagement underperform here.",
  },
  {
    slug: "vanderbilt-university",
    hook: "How to get into Vanderbilt: the unique scholarship culture and Southern Ivy positioning",
    angle: "Vanderbilt offers some of the most generous merit aid among top-25 US universities — Cornelius Vanderbilt, Ingram, and Chancellor's scholarships cover full tuition and beyond. Vanderbilt has marketed itself as a 'Southern Ivy' and admissions are now under 6%. The school rewards students who'd actually contribute to the residential, athletics-heavy, leadership-oriented culture.",
    steps: [
      "Apply Early Decision if Vanderbilt is your top choice. ED acceptance rate is roughly 4x RD.",
      "Apply for the merit scholarships (separate applications, December deadlines). Even applicants who don't win benefit — the additional essays surface leadership and impact.",
      "Maintain 3.9+ unweighted GPA, 1500+ SAT / 34+ ACT.",
      "Reference Vanderbilt's residential college system (Commons for first-years, Ingram Commons), Greek life, and Nashville location specifically.",
      "Show leadership through impact, not titles. Vanderbilt rewards applicants who built or organized something.",
    ],
    mistakes: [
      "Treating Vanderbilt as a backup to Duke. Vanderbilt is now harder to get into than several Ivies.",
      "Skipping the merit scholarship applications. Even unsuccessful applications strengthen your overall admissions essays.",
      "Generic Nashville enthusiasm. Specifics about the music scene, healthcare ecosystem, or political/legal Nashville matter.",
    ],
    borderline:
      "Vanderbilt is one of the few top-15 schools where applicants in the middle of the stat band can secure both admission AND substantial merit aid in one shot. If finances matter and you can write a strong leadership story, the Cornelius Vanderbilt Scholarship application is worth real effort.",
  },
  {
    slug: "university-of-southern-california",
    hook: "How to get into USC: the trojan family and major-specific admissions",
    angle: "USC admits to specific schools and programs — Marshall (business), Viterbi (engineering), Annenberg (communications), Thornton (music), Cinematic Arts, etc. Some of these (especially Cinematic Arts, Marshall World Bachelor, Iovine Academy) are far more competitive than the headline 12% rate. The 'Trojan family' marketing is real: alumni networking is one of USC's defining features.",
    steps: [
      "Apply directly to the school/program that matches your strongest work. USC respects depth over breadth.",
      "Show specific evidence for your target program: portfolio for Cinematic Arts, business work for Marshall, audition prep for Thornton.",
      "Maintain 3.9+ unweighted GPA, 1480+ SAT / 33+ ACT.",
      "Apply for USC's Presidential Scholarship and Trustee Scholarship — separate December deadline, half- to full-tuition awards.",
      "Reference USC's interdisciplinary minors (entertainment industry, screen studies, etc.) — they're a defining feature.",
    ],
    mistakes: [
      "Treating USC as 'UCLA's competitor.' The cultures and admissions are fundamentally different.",
      "Applying to Cinematic Arts without a strong creative portfolio. It's one of the toughest admits in the country (~3%).",
      "Skipping the December scholarship deadline. Even unsuccessful applications are reread for admissions and merit aid.",
    ],
    borderline:
      "USC is increasingly fit-and-program-driven. Applicants with median stats who present a clear creative or pre-professional story do well, especially in less-competitive schools. The reverse: high-stat undecided applicants without a clear angle struggle.",
  },
  {
    slug: "johns-hopkins-university",
    hook: "How to get into Johns Hopkins: research culture and pre-med calibration",
    angle: "Johns Hopkins is the original American research university. Undergraduate research is genuinely accessible, not just marketing. Hopkins is famously rigorous and famously pre-med-heavy. Applicants who can show real research experience or a clear non-pre-med intellectual identity stand out from the pre-med wave.",
    steps: [
      "If you've done research, document it specifically. Lab work, methods, outcomes, conferences. Hopkins admissions reads research seriously.",
      "If you're not pre-med, lean into that. Hopkins' humanities, writing seminars, and international studies programs are strong and admit specifically for those interests.",
      "Maintain 3.95+ GPA, 1510+ SAT / 34+ ACT.",
      "Apply Early Decision — Hopkins eliminated legacy preferences but still meaningfully rewards ED applicants.",
      "Get a science teacher recommendation that speaks specifically to your research/lab work (if applicable).",
    ],
    mistakes: [
      "Applying as 'pre-med' with no research or healthcare experience. Hopkins is the most-applied-to pre-med school; saying you want to be a doctor doesn't differentiate.",
      "Underestimating the rigor. Hopkins' grade deflation is real and admissions filters for students who can handle it.",
      "Generic 'I love Hopkins' essays. The Hopkins essay should reference specific research, faculty, or interdisciplinary programs.",
    ],
    borderline:
      "Hopkins is the school where 'I have research experience' actually moves the needle. If you've done meaningful lab work, Hopkins reads it more carefully than peer schools. Pure-stats applicants without research or pre-professional depth underperform here.",
  },
  {
    slug: "washington-university-in-st-louis",
    hook: "How to get into WashU: ED matters most and the 5 schools admit separately",
    angle: "WashU has the largest ED-vs-RD acceptance gap of any top-20 university — around 32% ED vs 9% RD. The school admits to five undergraduate divisions (Arts & Sciences, Olin Business, McKelvey Engineering, Sam Fox Art/Architecture, University College) and program fit matters. WashU is also unusually rigorous about demonstrated interest.",
    steps: [
      "Apply Early Decision if WashU is your top choice. The 3-4x ED bump is the largest among top private schools.",
      "Pick the right division. Olin Business and Sam Fox have separate admissions with portfolio/interview requirements.",
      "Maintain 3.9+ GPA, 1500+ SAT / 33+ ACT.",
      "Visit if possible; WashU tracks demonstrated interest more aggressively than many top private schools.",
      "Reference WashU's interdisciplinary culture, Beyond Boundaries program, and the actual residential life experience — specifics, not generic 'community' language.",
    ],
    mistakes: [
      "Applying RD when you could have committed ED. The acceptance rate difference is the single biggest factor in WashU admissions.",
      "Treating WashU as a backup. Admissions reads applications for genuine interest and rejects 'placeholder' apps even with strong stats.",
      "Skipping the supplemental essay. WashU's optional essay is read by admissions and treated as a fit signal.",
    ],
    borderline:
      "WashU ED is one of the highest-leverage applications in the country. Median-stats applicants who can commit ED have real chances. If you're not applying ED, your odds drop dramatically — plan accordingly.",
  },
  {
    slug: "emory-university",
    hook: "How to get into Emory: Oxford pathway and Atlanta's pre-med ecosystem",
    angle: "Emory has two undergraduate options: Emory College (the main campus) and Oxford College (a two-year residential start that automatically transitions to Emory College for junior/senior year). Oxford is a meaningful back door — lower acceptance rate threshold, smaller community, same Emory degree. Atlanta's healthcare ecosystem (CDC, Emory Healthcare, Grady) makes Emory one of the strongest pre-med environments anywhere.",
    steps: [
      "Apply to BOTH Emory College and Oxford College on the application — it's allowed and meaningfully increases admission odds.",
      "If pre-med, reference Atlanta's healthcare ecosystem specifically: CDC, Emory Healthcare, Grady, Children's Healthcare of Atlanta. Generic pre-med language doesn't differentiate.",
      "Maintain 3.9+ GPA, 1480+ SAT / 33+ ACT.",
      "Apply Early Decision (Emory has ED1 and ED2) — meaningful acceptance bump.",
      "Reference Emory's specific strengths: business (Goizueta), public health, religion, neuroscience.",
    ],
    mistakes: [
      "Applying only to Emory College when you'd accept Oxford. Apply to both — it costs nothing and meaningfully helps.",
      "Generic Atlanta enthusiasm. Specifics about Buckhead, Decatur, the BeltLine, or healthcare institutions matter.",
      "Underestimating Goizueta's business undergrad. It's one of the top undergraduate business programs and admits competitively.",
    ],
    borderline:
      "If you'd take Oxford College, the dual-apply option is one of the best back doors at any top-25 school. Median-stats applicants get Oxford admissions when Emory College itself is out of reach.",
  },
  {
    slug: "california-institute-of-technology",
    hook: "How to get into Caltech: small, brutal, and uncompromising on stats",
    angle: "Caltech admits roughly 250 students per class. Average admit has an SAT math of 800 and is in the top 1% of their class — Caltech is one of the few schools where stats are genuinely a floor, not a soft preference. The school is small (under 1,000 undergrads), grade-deflated, and unapologetically STEM-focused. If you don't already love math and physics for their own sake, Caltech isn't your school.",
    steps: [
      "Reach the math/science benchmark: SAT math 790-800, top-5% rank, multivariable calculus or beyond by senior year, AP scores of 5 in calc + at least one science.",
      "Show genuine STEM passion that exists outside school requirements: research, competitions (AMC, AIME, USAMO, USACO, IPhO, Olympiad), independent projects.",
      "Submit the optional 'why STEM' supplement seriously. Caltech wants intellectual fit, not just credentials.",
      "Get teacher recs from a math or science teacher who knows your work in depth.",
      "Apply Early Action — non-binding, small acceptance bump.",
    ],
    mistakes: [
      "Treating Caltech as MIT-but-smaller. The cultures are different; Caltech is more theoretical, more academically intense, and far less hands-on.",
      "Skipping the optional supplement. With Caltech's small class, every signal matters.",
      "Underestimating the stat floor. Below SAT math 750 with no national-level STEM achievement, the odds are very long.",
    ],
    borderline:
      "Caltech is one of the few schools where 'genuinely loves math' is the strongest hook. If you've done national-level math/science competition work or you've published research, Caltech reads that more seriously than any peer school. Pure-stats applicants without genuine STEM curiosity rarely get in.",
  },
  {
    slug: "tufts-university",
    hook: "How to get into Tufts: international relations heavy and quirky essays",
    angle: "Tufts is famous for international relations (Fletcher School), engineering with a humanities flavor, and intentionally quirky supplemental essays. The school positions itself between a top-tier research university and a small liberal arts college, and admits students who can articulate why that hybrid matters to them.",
    steps: [
      "Take the quirky 'Why Tufts' and 'short answer' essays seriously. They're the single biggest differentiator.",
      "If applying to International Relations: show specific engagement (model UN, language depth, international experience, policy interest).",
      "Maintain 3.9+ GPA, 1480+ SAT / 33+ ACT.",
      "Apply Early Decision (ED1 or ED2) — Tufts is one of the most ED-favoring top-30 schools.",
      "Reference specific Tufts traditions: Fletcher, the IR program, the Experimental College, the Cannon, dorms-as-castles culture.",
    ],
    mistakes: [
      "Writing safe supplements. Tufts explicitly rewards quirk and voice.",
      "Treating Tufts as a 'BU-level' school. Acceptance rate has dropped to around 9% and the medians have climbed.",
      "Generic international interest. The IR program admits students with specific regional/language/policy expertise.",
    ],
    borderline:
      "Tufts rewards strong writers and quirky thinkers more than most top-30 schools. If your stats are at the median and your essays have a distinctive voice, Tufts ED gives you a real shot.",
  },
  {
    slug: "georgetown-university",
    hook: "How to get into Georgetown: schools, Jesuit identity, and DC focus",
    angle: "Georgetown admits to four undergraduate schools (Georgetown College, Walsh School of Foreign Service, McDonough Business, NHS Health Studies) and they admit separately. School of Foreign Service is one of the most prestigious IR programs in the country. Georgetown is Jesuit, deeply DC-rooted, and policy-focused — applications that ignore those threads underperform.",
    steps: [
      "Pick the school that matches your strongest signal. SFS is competitive and rewards specific international/policy work.",
      "Reference Georgetown's Jesuit mission (cura personalis, men/women for others) in supplements — even non-Catholic applicants benefit from showing they understand the community.",
      "Show DC-specific interest: internship aspirations, policy interests, specific institutions you'd engage with.",
      "Maintain 3.9+ GPA, 1480+ SAT / 33+ ACT.",
      "Note: Georgetown does NOT use the Common App. You apply through Georgetown's own application — adds a slight friction filter that screens out resume-applicants.",
    ],
    mistakes: [
      "Skipping Georgetown's separate application thinking you'll just hit Common App. It's a real friction point.",
      "Generic 'I want to do international relations' essays. SFS readers see thousands; specifics about region, language, policy interest matter.",
      "Underestimating the school choice. Internal transfers between Georgetown schools are not easy.",
    ],
    borderline:
      "Georgetown is one of the few top schools that doesn't offer ED — restricted Early Action (no binding commitment). This means applicants don't get the dramatic ED bump seen elsewhere. Plan to compete in the regular pool with strong essays and clear school fit.",
  },
  {
    slug: "university-of-michigan-ann-arbor",
    hook: "How to get into Michigan: in-state vs out-of-state and Ross/Engineering admissions",
    angle: "Michigan admits roughly 50% of in-state applicants and around 15-18% of out-of-state. It's the canonical example of a 'public Ivy' where in-state vs out-of-state changes the admissions math dramatically. Ross School of Business and the College of Engineering admit separately and are more competitive than the headline numbers suggest.",
    steps: [
      "For in-state Michigan applicants: strong GPA in the rigorous curriculum + clear major fit. Acceptance rate around 50% — admission is realistic.",
      "For out-of-state applicants: treat Michigan as a reach. 3.9+ unweighted GPA, 1480+ SAT / 33+ ACT, strong essays.",
      "If applying to Ross or Engineering directly: program-specific evidence matters (business experience for Ross, build/research for Engineering).",
      "Apply Early Action by Nov 1 — non-binding, small acceptance bump.",
      "Reference Michigan's specific strengths: research output, residential learning communities, athletics culture, Ann Arbor itself.",
    ],
    mistakes: [
      "Out-of-state applicants treating Michigan as a safety. It isn't — admit rate for OOS is roughly the same as a top-30 private.",
      "Generic 'big state school energy' essays. Michigan's academic culture is more rigorous than the marketing suggests.",
      "Skipping Ross supplements. Ross admits in a separate pool and the essays matter.",
    ],
    borderline:
      "For in-state Michigan applicants with solid stats, Michigan is a target — plan accordingly. For OOS applicants, plan as if applying to a top-25 private and don't count on yield-rate factors helping you.",
  },
  {
    slug: "university-of-california-los-angeles",
    hook: "How to get into UCLA: PIQs, weighted GPA, and the residency divide",
    angle: "UCLA is the most-applied-to university in the United States — over 145,000 applications per year. Test-blind admissions. The four UC Personal Insight Questions (350 words each, choose from eight prompts) are the largest differentiator. In-state vs out-of-state is a huge factor: California residents have 4-5x the acceptance rate of out-of-state applicants.",
    steps: [
      "Pick your four PIQ prompts strategically — each should add a distinct dimension to your application.",
      "Aim for 4.3+ UC-weighted GPA. UCLA's admit median is among the highest in the UC system.",
      "Take the most rigorous UC-recognized courses. Honors, AP, IB count for weighting.",
      "If applying to a specific major (CS, business-econ, engineering), make sure your background supports it. Internal transfers to CS at UCLA are very competitive.",
      "Build a long-form, sustained extracurricular with demonstrable impact. UCLA values depth over breadth.",
    ],
    mistakes: [
      "Repeating themes across all four PIQs. Each should reveal something distinct.",
      "Out-of-state applicants treating UCLA as a target school. Without exceptional credentials, OOS admit rates are very low.",
      "Underestimating UCLA's CS. The CS program is among the most selective in the UC system — comparable to Berkeley EECS.",
    ],
    borderline:
      "UCLA is one of the schools where strong PIQ writing genuinely outweighs stat differences. Stat-median in-state applicants with distinctive PIQ responses do better than higher-stat applicants with generic essays. OOS applicants need exceptional credentials AND essays.",
  },
  {
    slug: "unc-chapel-hill",
    hook: "How to get into UNC: the 82% in-state rule and out-of-state competition",
    angle: "UNC is constitutionally required to admit at least 82% of its in-state class from North Carolina. This means out-of-state applicants compete for a tiny share of seats and acceptance rates for OOS are roughly 10% vs around 30% in-state. UNC also runs Carolina Covenant (full-need aid for families under 200% FPL) — one of the strongest financial aid programs at any public university.",
    steps: [
      "For in-state applicants: focus on top-5% NC class rank, strong essays, evidence of engagement with NC communities. Median admit GPA is high but achievable.",
      "For out-of-state applicants: aim for 3.95+ unweighted GPA, 1480+ SAT / 33+ ACT, and a distinctive non-stats hook.",
      "Apply Early Action by Oct 15 — non-binding, small acceptance bump, used by most admitted applicants.",
      "Reference UNC's specific strengths: Carolina Covenant, the Old Well traditions, the residential college system, specific programs (journalism, public health, business).",
      "If financially eligible, apply for the Morehead-Cain or Robertson Scholars programs — full-ride scholarships with separate fall deadlines.",
    ],
    mistakes: [
      "Out-of-state applicants treating UNC as a safety. The 10% OOS acceptance rate makes it a top-30 reach.",
      "Generic 'I love UNC' essays. The 'Why Carolina' supplement should reference specific NC connections, programs, or traditions.",
      "Missing the Morehead-Cain or Robertson deadlines (October). These are massive merit-aid opportunities.",
    ],
    borderline:
      "For in-state NC applicants in the median band, UNC is a strong target. For out-of-state applicants, treat UNC roughly like applying to Duke or Vanderbilt RD — credentials and writing both matter at the top tier.",
  },
  {
    slug: "university-of-virginia",
    hook: "How to get into UVA: ED bump, in-state edge, and the Honor Code culture",
    angle: "UVA is the rare public school with a major Early Decision bump — ED acceptance rates are roughly 2x Regular Decision. In-state applicants have meaningfully better odds than out-of-state. UVA's Honor Code, residential community, and Jefferson-era traditions are central to the culture and applications that engage with them outperform ones that don't.",
    steps: [
      "Apply Early Decision if UVA is your top choice. ED acceptance rate is roughly 30%+ vs 15%-ish RD.",
      "Reference UVA's Honor Code, the residential 'first-year on Grounds' experience, and specific traditions (lawn rooms, dorm-bonding, Cavalier sports).",
      "For in-state applicants: focus on top-decile rank, strong essays, evidence of engagement with Virginia communities.",
      "For out-of-state: aim for 3.9+ unweighted GPA, 1450+ SAT / 33+ ACT.",
      "Apply for the Jefferson Scholars Program if eligible — full-ride merit scholarship with separate fall deadlines.",
    ],
    mistakes: [
      "Skipping ED when UVA is your clear top choice. ED is one of the biggest factors in UVA admissions.",
      "Generic essays about 'historic Virginia.' Reference specific UVA-isms (the Lawn, the Rotunda, secret societies, the Honor Code).",
      "Underestimating the McIntire School of Commerce. Internal application during sophomore year is very competitive.",
    ],
    borderline:
      "UVA is one of the few public schools where ED really does move the needle. In-state applicants in the median band have strong chances ED; out-of-state applicants need stronger credentials but ED still helps materially.",
  },
  {
    slug: "georgia-tech",
    hook: "How to get into Georgia Tech: STEM-only mindset and the in-state ratio",
    angle: "Georgia Tech is one of the most STEM-focused top universities in the country — nearly every undergraduate major is engineering, computer science, business, design, or science. The school admits roughly 60% in-state and 40% out-of-state, with acceptance rates of about 35% in-state and 12% out-of-state. CS at Georgia Tech is one of the most selective CS programs in the country.",
    steps: [
      "For all applicants: show STEM passion that's specific. Robotics, programming projects, research, FIRST teams, USACO, etc.",
      "For in-state Georgia applicants: focus on top-decile rank, strong math/science grades, AP/IB rigor.",
      "For out-of-state applicants: 1500+ SAT / 33+ ACT (with strong math), 3.95+ unweighted GPA in the most rigorous curriculum.",
      "Apply Early Action 1 (in-state) or Early Action 2 (anyone) by the respective deadlines — meaningful acceptance bump for both.",
      "Reference Georgia Tech's specific programs: CS threads, co-op program, Living-Learning Communities, the Atlanta tech ecosystem.",
    ],
    mistakes: [
      "Applying to Georgia Tech as a generalist or a humanities-focused student. The school filters hard for STEM commitment.",
      "Skipping the co-op program in your essays. Georgia Tech's co-op is one of the largest in the country and a defining feature.",
      "Out-of-state applicants underestimating CS competitiveness. Tech CS is roughly as selective as CMU SCS for OOS applicants.",
    ],
    borderline:
      "Georgia Tech rewards applicants with deep technical work over polished essays. If you've built things, your application reads stronger than your stats suggest. The reverse: high-stat humanities-leaning students struggle here.",
  },
  {
    slug: "amherst-college",
    hook: "How to get into Amherst: the open curriculum and small-college fit",
    angle: "Amherst is one of the most academically rigorous small liberal arts colleges in the country — under 2,000 students, no general education requirements (only the major), and one of the top need-based financial aid programs anywhere. Amherst admits students who'd thrive in a college that demands they direct their own learning.",
    steps: [
      "Write a 'why Amherst' supplement that engages specifically with the open curriculum. Generic 'I like LACs' essays don't work.",
      "Reference specific Amherst features: the Five College Consortium (cross-registration with UMass-Amherst, Smith, Mt. Holyoke, Hampshire), the residential community, specific faculty or departments.",
      "Maintain 3.9+ GPA, 1480+ SAT / 33+ ACT.",
      "Apply Early Decision if Amherst is your top choice. ED acceptance rate is roughly 2-3x RD.",
      "Show sustained, independent intellectual interests. Amherst rewards genuine curiosity.",
    ],
    mistakes: [
      "Generic 'small school feel' essays. Amherst readers want specifics about the curriculum and community.",
      "Treating Amherst as a backup to an Ivy. Amherst is one of the most selective colleges in the country (~7% acceptance) and admissions reads applications for fit.",
      "Underestimating the Five College Consortium. Cross-registration is a real, used feature — reference it specifically.",
    ],
    borderline:
      "Amherst's need-based financial aid is among the most generous anywhere — no loans in aid packages. If you're low/middle-income with strong credentials, the cost story is dramatic. Apply for early QuestBridge match if eligible.",
  },
  {
    slug: "williams-college",
    hook: "How to get into Williams: tutorials and the rural New England intensity",
    angle: "Williams is consistently ranked the #1 liberal arts college in the country. The Oxford-style tutorial program (1-2 students working closely with a professor) is the school's defining academic feature, available across many departments. Williams is small (~2,000 students), rural (Williamstown, MA), and intellectually intense.",
    steps: [
      "Reference the tutorial program specifically in your supplement. It's Williams' single most distinctive academic feature.",
      "Show evidence you can engage in tutorial-style learning: independent reading, deep analytical writing, sustained focus on a topic.",
      "Maintain 3.95+ GPA, 1490+ SAT / 33+ ACT.",
      "Apply Early Decision if Williams is your top choice. ED bump is meaningful — 2-3x RD.",
      "Engage with the rural New England setting as a feature: outdoor culture, the residential community, the seasonal life.",
    ],
    mistakes: [
      "Generic 'I love LACs' essays. Williams supplements should reference the tutorials specifically.",
      "Treating the rural setting as a downside. The wrong applicants frame Williamstown as remote rather than intentional.",
      "Underestimating Williams' selectivity. Acceptance rate is around 8% and falling.",
    ],
    borderline:
      "Williams is one of the few schools where strong writing genuinely outperforms stats. If you can show analytical depth in your essays, your application reads stronger than your numbers. Williams' financial aid is also exceptional — no-loan policies for families under a high income threshold.",
  },
  {
    slug: "pomona-college",
    hook: "How to get into Pomona: the Claremont Consortium and California LAC niche",
    angle: "Pomona is the founding member of the Claremont Colleges — five undergraduate schools (Pomona, Claremont McKenna, Scripps, Pitzer, Harvey Mudd) sharing dining, libraries, and cross-registration. Pomona offers a small-school feel with consortium-scale resources. It's the most academically prestigious of the Claremonts and admissions are roughly 7%.",
    steps: [
      "Reference the Claremont Consortium specifically — cross-registration, shared resources, the multi-college community.",
      "Show interest in Pomona's open curriculum and breadth-of-study expectations.",
      "Maintain 3.9+ GPA, 1480+ SAT / 33+ ACT.",
      "Apply Early Decision if Pomona is your top choice. ED bump is meaningful.",
      "Engage with Pomona's distinctive features: residential life, Southern California setting, the Pomona-Pitzer athletic union, the relationship with the other Claremonts.",
    ],
    mistakes: [
      "Treating Pomona as 'Harvey Mudd for non-engineers.' The Claremonts have distinct cultures.",
      "Generic California-weather essays. Specifics about Pomona's community matter.",
      "Underestimating the Consortium's scale. Cross-registration is real and a defining feature.",
    ],
    borderline:
      "Pomona rewards applicants who'd actively use the consortium structure — students who want a small home college with big-school resources. If you can articulate that, your application stands out from generic 'I want a LAC' essays.",
  },
];

export function getHowToGetIn(slug: string): HowToGetInEntry | undefined {
  return HOW_TO_GET_IN.find((e) => e.slug === slug);
}
