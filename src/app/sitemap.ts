import { MetadataRoute } from "next";
import { COLLEGES_SEED } from "@/lib/colleges-seed";
import { STATE_AID_DATA } from "@/lib/state-aid-data";
import { MAJOR_PAGES } from "@/lib/major-pages-data";
import { blogPosts } from "@/lib/blog-posts";
import { BEST_COLLEGES_TOPICS } from "@/lib/best-colleges-data";
import { HOW_TO_GET_IN } from "@/lib/how-to-get-in-data";
import { createClient } from "@supabase/supabase-js";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.kidtocollege.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/scholarships`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/fafsa-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/coach`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/coach/checklist`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/coach/essay`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/coach/financial-aid`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/coach/interviews`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/coach/recommendations`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/coach/roadmap`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/coach/test-prep`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/international`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/my-chances`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/my-list`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/coach/merit-sweet-spot`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/coach/appeal-letter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/roadmap`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/essays`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/discover`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/deadlines`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/college-fairs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/financial-aid/calculator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/colleges`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/family`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/family/join`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Fetch all college slugs from Supabase with pagination
  let collegeSlugs: string[] = [];
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (sbUrl && sbKey) {
    try {
      const supabase = createClient(sbUrl, sbKey);
      let page = 0;
      const pageSize = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("colleges")
          .select("slug")
          .range(page * pageSize, (page + 1) * pageSize - 1);
        if (error) {
          console.error("[sitemap] Supabase fetch error:", error.message);
          break;
        }
        if (!data || data.length === 0) break;
        collegeSlugs.push(...data.map((c) => c.slug));
        if (data.length < pageSize) break;
        page++;
      }
    } catch (err) {
      console.error("[sitemap] Supabase connection error:", err);
    }
  }

  // Fall back to seed only if Supabase returned nothing
  if (collegeSlugs.length === 0) {
    console.log("[sitemap] Using seed data fallback for college slugs");
    collegeSlugs = COLLEGES_SEED.map((c) => c.slug);
  }

  console.log(`[sitemap] ${collegeSlugs.length} college pages in sitemap`);

  const collegePages: MetadataRoute.Sitemap = collegeSlugs.map((slug) => ({
    url: `${BASE_URL}/college/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const stateAidPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/financial-aid`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...STATE_AID_DATA.map((s) => ({
      url: `${BASE_URL}/financial-aid/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const majorPages: MetadataRoute.Sitemap = MAJOR_PAGES.map((m) => ({
    url: `${BASE_URL}/colleges/major/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...blogPosts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updatedDate),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const bestCollegesPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/best-colleges`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...BEST_COLLEGES_TOPICS.map((t) => ({
      url: `${BASE_URL}/best-colleges/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const howToPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/how-to-get-into`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...HOW_TO_GET_IN.map((e) => ({
      url: `${BASE_URL}/how-to-get-into/${e.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return [
    ...staticPages,
    ...collegePages,
    ...stateAidPages,
    ...majorPages,
    ...blogPages,
    ...bestCollegesPages,
    ...howToPages,
  ];
}
