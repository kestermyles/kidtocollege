# Outreach playbook — seeding the first 20 verified reviews

The verified-reviews feature is built but empty. Until ~10 reviews exist across a handful of well-known schools, the section will look dead and hurt trust more than help. This playbook gets you to the seeded state in ~7 days through real outreach. No fakes.

## The math

- Target: **20 verified reviews across ~6-8 schools** (so each featured school has 2-3 reviews)
- Realistic reply rate from warm contacts: **40-60%**
- So you need to contact: **40-50 people**
- Time: **30 min/day for one week**

## Who to contact

In rough priority order (highest yield first):

1. **Your network's college-age kids.** Friends with juniors/seniors in college. Easiest yes — they trust you, kids will help dad's friend.
2. **Your own personal college contacts.** UT Austin alumni you know, professional contacts who teach at colleges, etc.
3. **Your kid's friends at college.** If applicable. Word-of-mouth from a peer is more credible than from a parent.
4. **Local high-school college counselors.** A counselor can blast 30+ recent graduates with one email.
5. **LinkedIn 2nd-degree connections at target universities.** Pull a search like "UT Austin junior" or "Harvard student" in your network.

## The email/text template

Keep it short. Three sentences max. Don't sell.

### Version A — for friends-of-friends college students (warmest)

> Hi [name], my dad's friend Kester runs a free site for first-gen college families — kidtocollege.com. He's trying to help kids make better college decisions, and he needs honest 5-minute reviews from current students. Would you write one about [school name]? Link: https://www.kidtocollege.com/verify-student — takes about 5 mins, your name is never published. Thanks!

### Version B — direct ask to college students you know

> Hey [name], I'm building a free college info site for middle-income and first-gen families — no ads, no data selling. We need honest reviews from current students to actually help families decide. 5 mins, 5 short questions, your name stays anonymous. Mind helping out? https://www.kidtocollege.com/verify-student — would mean a lot.

### Version C — to a high-school counselor (formal)

> Subject: Quick favor for a free college info site for first-gen families
>
> Hi [name],
>
> I run KidToCollege.com, a free college admissions resource for middle-income and first-gen families. There are no ads, we don't sell data, and the site is built to give families an honest take rather than the marketing version.
>
> We've just launched a verified-reviews feature where current college students share their experience — verified with .edu email, fully anonymous, structured around the questions that actually matter ("biggest negative surprise," "who shouldn't come here"). The point is to counter the recruited-blurb reviews families get elsewhere.
>
> We're seeding the launch. Would you be willing to share the link with your recent graduates who are now in college? It takes 5 minutes and helps the next class of students at your school.
>
> Link: https://www.kidtocollege.com/verify-student
>
> Happy to share more about the project if helpful. Thanks for considering it.
>
> — Kester
> KidToCollege.com

### Version D — LinkedIn DM (cold but warm-ish)

> Hi [name] — I saw you're at [school]. I'm building a free college-info site for middle-income families (no ads, no data selling) and we need honest 5-minute reviews from current students. 5 short questions, name stays anonymous. Mind being one of our first 20 reviewers? https://www.kidtocollege.com/verify-student

## Tracking spreadsheet

Create a Google Sheet with these columns. (Or import this CSV.)

```csv
Name,School,Contact method,Date sent,Replied?,Wrote review?,Notes
,,,,,,
```

**Critical fields to track:**
- **School** — distribute across 6-8 different schools so no one school looks like a planted cluster
- **Contact method** — text > email > LinkedIn DM in reply rate
- **Date sent** — wait 5 days before sending a polite follow-up
- **Replied? / Wrote review?** — closes the feedback loop so you know your hit rate

## Target school distribution

Aim for these schools first (highest search volume, biggest visitor impact when first reviews land):

| School | Why prioritize |
|---|---|
| UT Austin | Home turf, your network is densest here |
| Harvard / Stanford / MIT | High-traffic pages, even 1-2 reviews dramatically improve the look |
| University of Michigan | High-volume out-of-state applicants want honest takes |
| Northwestern | Underseved by review sites |
| UCLA / Berkeley | Huge in-state applicant pools |
| Vanderbilt / Duke / Notre Dame | Mid-Tier elite — families paying $80K+ want honest signals |

Don't try to cover all 2,900 schools. Concentrated coverage on famous schools drives more page-impression value than spread.

## Follow-up cadence

- **Day 0**: send initial message
- **Day 5**: polite follow-up if no response — "totally understand if too busy, just wanted to bump in case it got buried"
- **Day 10**: drop. Move on. Don't be the guy who pesters.

## After 10 reviews exist

Once you have ~10 approved reviews across 5+ schools:
1. **Move the review section higher on the college page** (currently right above net-price calculator)
2. **Add a "We have N verified reviews" callout on /college-mental-health and other index pages**
3. **Pitch to college subreddits** (r/college, school-specific subs) — be transparent: "I'm building a non-EAB college review site, would love feedback / first reviewers." Some subreddits will help; some will kick you out. Try the bigger generic ones first.
4. **Quiet ProductHunt launch** — gets you a small initial spike of curious students.

## Incentive option (if outreach is slow)

If by day 5 you've sent 40 messages and have <5 reviews submitted, add a $5 Amazon credit incentive:

> P.S. for the first 20 verified reviewers, I'm sending a $5 Amazon gift card as a thank-you for the time. Just reply with your email after submitting.

$100 budget, 20 reviews, $5 per review = honest cost-per-content. Don't bias the content — pay for the labor, not the sentiment.

## Anti-pattern: do not

- **Fake reviews.** One round destroys the feature's value permanently.
- **Pay for positive reviews.** Pay for labor (time to write), period.
- **Ghostwrite for someone else "in their voice."** Even if they consent.
- **Add reviews before the .edu verification flow is live.** Anything you add manually won't have a verified_students row and will show as broken.

## Status check

Once reviews start coming in, check moderation queue at:
**https://www.kidtocollege.com/admin/reviews**

Pending reviews need approval before they're visible. Approve within 24 hours to keep contributors warm (they'll check back, and seeing their review live increases the chance they tell a friend).
