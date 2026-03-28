# KidToCollege

AI-powered college research and application coaching platform that helps students and families navigate the path from high school to higher education.

## Mission

Make college planning accessible, transparent, and personalized for every student -- regardless of background, budget, or experience with the admissions process.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL + Row Level Security + Auth)
- **AI:** Anthropic Claude API
- **Animation:** Framer Motion
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- A Supabase project (free tier works)
- An Anthropic API key

### Installation

```bash
git clone https://github.com/your-org/kidtocollege.git
cd kidtocollege
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | Yes |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for sitemap, OG tags) | Yes |

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration file to create all tables and RLS policies:
   ```bash
   # Copy the migration SQL from supabase/migrations/ and run it
   # in the Supabase SQL Editor, or use the Supabase CLI:
   npx supabase db push
   ```
3. Enable auth providers in the Supabase dashboard under **Authentication > Providers**:
   - Email/Password (enabled by default)
   - Google OAuth (optional)

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    layout.tsx            # Root layout with navbar, footer
    search/               # College search wizard
    results/              # AI research results
    college/[slug]/       # Individual college pages
    compare/              # Side-by-side college comparison
    scholarships/         # Scholarship finder
    coach/                # Coaching hub
      checklist/          # Application checklist tracker
      essay/              # Essay writing assistant
      financial-aid/      # Financial aid guidance
      interviews/         # Interview preparation
      recommendations/    # Recommendation letter guidance
      roadmap/            # Application timeline
      test-prep/          # SAT/ACT test prep
    account/              # User dashboard
    auth/                 # Login/signup flows
    sitemap.ts            # Dynamic sitemap
    robots.ts             # robots.txt
  lib/
    types.ts              # Shared TypeScript interfaces
    colleges-seed.ts      # Seed data for 30+ colleges
    scholarships-data.ts  # Scholarship dataset
    supabase-browser.ts   # Supabase client (browser)
    supabase-server.ts    # Supabase client (server)
  components/             # Shared UI components
```

## Key Features

- **AI College Research Engine** -- Enter your profile and get a personalized report with match scores, scholarship recommendations, budget breakdowns, and insider tips
- **College Search Wizard** -- 4-step guided flow to find the right schools
- **Side-by-Side Compare** -- Compare up to 4 colleges on key metrics
- **Scholarship Finder** -- Filterable database of scholarships
- **Application Coach** -- 7 modules covering essays, interviews, recommendations, test prep, financial aid, checklists, and timelines
- **Saved Colleges & Checklists** -- Track your target schools and application progress
- **Community College Pathways** -- Transfer route information and cost comparisons
- **Responsive Design** -- Mobile-first, accessible UI

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add the environment variables listed above in the Vercel dashboard
4. Deploy -- Vercel auto-detects Next.js and configures the build

### Other Platforms

Any platform that supports Next.js 14 will work. Ensure you set all required environment variables.

## License

TBD
