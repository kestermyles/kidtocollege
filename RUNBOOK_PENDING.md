# Pending tasks runbook

Four things still need a human. Each section: what, why, exact paste-ready commands, how to verify. Tick boxes as you go.

---

## 1. Curate 6 Unsplash hero photos

- [ ] UT Austin
- [ ] Caltech
- [ ] UCLA (note: 2 slugs)
- [ ] UPenn
- [ ] Columbia

### Why

These six schools' Unsplash searches keep returning the wrong campus (Texas State Capitol, Drexel-Institute, USC, NYU Washington Square, etc.). The cron is pinned to a labeled fallback for them. To replace each with a real photo of the actual campus, drop a curated URL into the override map.

### Step 1 — Find an Unsplash photo for each school

For each school, go to https://unsplash.com/ and search:

- `university of texas austin campus`
- `california institute of technology pasadena`
- `ucla royce hall` (or `ucla janss steps`)
- `university of pennsylvania campus` (try "Penn Quad" or "College Hall Penn")
- `columbia university low library` (or `columbia morningside`)

Look for a landscape-oriented building/quad shot, **verify it's actually that campus** (Royce Hall is unmistakable for UCLA; the Beckman Institute domes for Caltech; College Hall for Penn; Low Library for Columbia; the UT Tower for UT Austin).

When you find a good one, click it. The URL in your browser will look like:
`https://unsplash.com/photos/aerial-photography-of-bridge-Z6t0iRT0E80`

The photo ID is the last bit (`Z6t0iRT0E80`). The direct image URL is:
`https://images.unsplash.com/photo-{id}?w=1600&q=80`

Also note the **photographer's name** and their **Unsplash profile URL** (e.g. `https://unsplash.com/@photographer-username`) — both are visible under the photo.

### Step 2 — Edit the override file

Open [src/lib/college-photo-overrides.ts](src/lib/college-photo-overrides.ts) and replace the `LABELED_FALLBACK` entries with real values. The block currently looks like:

```ts
export const COLLEGE_PHOTO_OVERRIDES: Record<string, CollegePhotoOverride> = {
  "ut-austin": LABELED_FALLBACK,
  "california-institute-of-technology": LABELED_FALLBACK,
  "ucla": LABELED_FALLBACK,
  "university-of-california-los-angeles": LABELED_FALLBACK,
  "university-of-pennsylvania": LABELED_FALLBACK,
  "columbia-university-in-the-city-of-new-york": LABELED_FALLBACK,
};
```

Replace each `LABELED_FALLBACK` with an inline object like:

```ts
"ut-austin": {
  url: "https://images.unsplash.com/photo-PHOTO_ID_HERE?w=1600&q=80",
  creditName: "Jane Photographer",
  creditUrl: "https://unsplash.com/@jane-photographer",
},
```

Do that for each of the six entries (the two UCLA entries can share the same photo).

### Step 3 — Deploy

```bash
cd ~/kidtocollege
git add src/lib/college-photo-overrides.ts
git commit -m "Curate hero photos for UT Austin, Caltech, UCLA, UPenn, Columbia"
git push
```

Vercel auto-deploys on push.

### Verify

After the deploy finishes (~2 min), open each in a browser:

- https://www.kidtocollege.com/college/ut-austin
- https://www.kidtocollege.com/college/california-institute-of-technology
- https://www.kidtocollege.com/college/ucla
- https://www.kidtocollege.com/college/university-of-pennsylvania
- https://www.kidtocollege.com/college/columbia-university-in-the-city-of-new-york

Each hero image should be the campus you chose. Credit line under it should match the photographer name.

---

## 2. Run migration 022 — checklist categories

- [ ] Migration ran successfully

### Why

The current `checklist_tasks.task_category` CHECK constraint blocks tagging tasks with `extracurriculars`, `leadership`, `service`, `experience`, `awards`, `recommendations` — the 6 categories the new gap-filling tasks need. Right now those tasks are squeezed into `planning`/`applications`. After this migration, they can be re-tagged properly.

### Step 1 — Open Supabase SQL editor

1. Go to https://supabase.com/dashboard/project/ebdrvxndupjjgfhxiuiu
2. Left sidebar → **SQL Editor**
3. Click **New query**

### Step 2 — Paste and run

Copy everything in the block below, paste into the editor, click **Run** (or hit Cmd+Enter):

```sql
ALTER TABLE checklist_tasks
  DROP CONSTRAINT IF EXISTS checklist_tasks_task_category_check;

ALTER TABLE checklist_tasks
  ADD CONSTRAINT checklist_tasks_task_category_check
  CHECK (task_category IN (
    'testing',
    'applications',
    'financial_aid',
    'visits',
    'essays',
    'planning',
    'extracurriculars',
    'leadership',
    'service',
    'experience',
    'awards',
    'recommendations'
  ));
```

You should see a "Success. No rows returned" message.

### Verify

In the same SQL editor, paste this and run:

```sql
SELECT pg_get_constraintdef(c.oid)
FROM pg_constraint c
JOIN pg_class t ON t.oid = c.conrelid
WHERE t.relname = 'checklist_tasks'
  AND c.conname = 'checklist_tasks_task_category_check';
```

The result should list all 12 categories. If you only see 6, the migration didn't apply — re-run step 2.

---

## 3. Run migration 023 + backfill program earnings

- [ ] Migration 023 ran successfully
- [ ] First backfill run completed
- [ ] Backfill repeated until `remainingColleges` near zero

### Why

Adds a `program_earnings` table that stores median earnings 1 year and 4 years after graduation, broken down by major (CIP4 code) and credential level. After import, every college page gets an "Earnings by major" table — the single biggest decision-helping data point College Scorecard publishes.

### Step 1 — Run the migration

Supabase dashboard → SQL Editor → New query. Paste and **Run**:

```sql
CREATE TABLE IF NOT EXISTS program_earnings (
  id BIGSERIAL PRIMARY KEY,
  college_slug TEXT NOT NULL REFERENCES colleges(slug) ON DELETE CASCADE,
  cip6 TEXT NOT NULL,
  cip4 TEXT NOT NULL,
  cip_title TEXT NOT NULL,
  credential_level INT NOT NULL,
  credential_label TEXT NOT NULL,
  median_earnings_1yr INT,
  median_earnings_4yr INT,
  earnings_count_1yr INT,
  earnings_count_4yr INT,
  data_year TEXT NOT NULL DEFAULT '2122',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (college_slug, cip6, credential_level, data_year)
);

CREATE INDEX IF NOT EXISTS idx_program_earnings_slug ON program_earnings(college_slug);
CREATE INDEX IF NOT EXISTS idx_program_earnings_cip4 ON program_earnings(cip4);
CREATE INDEX IF NOT EXISTS idx_program_earnings_credential ON program_earnings(credential_level);
```

### Step 2 — Trigger the first backfill run

In your terminal (replace `YOUR_CRON_SECRET` with the real value — it's in Vercel → Project Settings → Environment Variables, look for `CRON_SECRET`):

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://www.kidtocollege.com/api/admin/import-program-earnings
```

After ~5 minutes you'll get a JSON response like:

```json
{
  "processed": 700,
  "rowsInserted": 12450,
  "scorecardMisses": 80,
  "totalDone": 700,
  "remainingColleges": 2225,
  "elapsedMs": 285000
}
```

### Step 3 — Repeat until done

Re-run the same `curl` command. Each run picks up where the last one stopped. Repeat until `remainingColleges` is close to 0 (some schools just don't have Scorecard data — those get a sentinel row and won't be retried).

A complete backfill of 2,900 colleges typically takes 5-7 runs of the curl command.

### Verify

After the first run, open any well-known college page and scroll down. You should see a new "Earnings by major" section listing programs with their median earnings. Try:

- https://www.kidtocollege.com/college/harvard-university
- https://www.kidtocollege.com/college/the-university-of-texas-at-austin
- https://www.kidtocollege.com/college/university-of-michigan-ann-arbor

If the section isn't appearing on schools you know should have data, check the count in Supabase:

```sql
SELECT COUNT(*) FROM program_earnings WHERE cip6 != '000000';
```

Should be in the tens of thousands after a full backfill.

---

## 4. Add Resend MX record in GoDaddy

- [ ] Record added in GoDaddy
- [ ] Verified in Resend dashboard

### Why

Resend (the transactional email service) needs DNS records on your domain to send mail from `@kidtocollege.com` addresses without it going to spam. Until these are set, transactional emails (signup confirmations, password resets, etc.) either fail or land in junk.

### Step 1 — Get the exact records from Resend

1. Go to https://resend.com/domains
2. Click on `kidtocollege.com`
3. You'll see a table of DNS records to add — typically:
   - 1 × MX record
   - 1 × TXT record (SPF)
   - 1 × TXT record (DKIM, with a long key value)
   - Optionally 1 × TXT record (DMARC)

Keep this Resend tab open — you'll copy values from it.

### Step 2 — Add records in GoDaddy

1. Go to https://dcc.godaddy.com/manage/dns
2. Find `kidtocollege.com` and click **DNS**
3. For each record Resend showed you, click **Add New Record** and fill it in:

**Important — what to put in the "Name" / "Host" field:**

Resend usually displays records with full hostnames like `send.kidtocollege.com`. GoDaddy expects the **subdomain only** in the Name field — strip the `.kidtocollege.com` suffix off when pasting.

So if Resend says:
- Hostname: `send.kidtocollege.com`

In GoDaddy enter:
- Name: `send`

The most common gotcha: pasting `send.kidtocollege.com` into GoDaddy's Name field creates a record for `send.kidtocollege.com.kidtocollege.com`. Always strip the apex domain.

For an apex-domain record (where Resend shows the hostname as just `kidtocollege.com`), use `@` in the GoDaddy Name field.

### Step 3 — Wait + verify

Save each record in GoDaddy. DNS propagation usually takes 5-30 min but can take up to 48 hours.

Back in Resend's domain page, click **Verify DNS Records** every few minutes until all records turn green. You'll get an email from Resend once the domain is fully verified.

### Verify it works end-to-end

Once verified, trigger a transactional email — easiest is to log out of KidToCollege and request a password reset for your account. The email should arrive in your inbox (not spam) within 30 seconds, with the From address showing `@kidtocollege.com`.

---

## When everything's green

After all four sections are checked:
- Photos look right on all 6 famous-school college pages
- New checklist tasks can be re-tagged with `extracurriculars`, `leadership`, etc. (separate small task — say the word and I'll update them)
- Every college page with Scorecard data shows an "Earnings by major" section
- Password reset / signup emails land in inbox, not spam

Anything goes wrong, ping me with the error message and which step you're on.
