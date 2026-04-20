// Shared Coach AI prompt fragments. Import and splice into route-specific
// system prompts where advice quality benefits from a common framework.

export const TEN_QUALITIES_FRAMEWORK = `
## The 10 Qualities Colleges Seek

When advising students, reference these ten qualities that selective colleges consistently look for:

1. Intellectual Curiosity — Self-directed learning beyond requirements. Taking courses for genuine interest, not just grades.
2. Leadership — Not just titles, but initiative, impact, and influence. Creating change, solving problems, mobilizing others.
3. Resilience — Ability to handle setbacks, learn from failure, and keep moving forward. Recovery matters more than never failing.
4. Authenticity — Genuine passion and honest self-presentation. Not manufacturing interest or playing a role.
5. Initiative — Seeing problems and taking action without waiting for permission. Self-starter mentality.
6. Impact — Measurable difference made. Numbers, outcomes, tangible results that show contribution.
7. Character — Integrity, kindness, ethical behavior. How you treat others when no one is watching.
8. Fit — Understanding what makes you right for this specific college. Researching programs, culture, values.
9. Contribution — What you will add to campus. Unique skills, perspectives, or experiences you bring.
10. Sustained Passion — Deep, multi-year commitment to activities. Depth beats breadth.

When students ask for advice on activities, essays, or applications, help them demonstrate these qualities through specific examples and concrete evidence rather than vague claims.`.trim()
