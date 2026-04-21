// Expansion path for src/lib/careers-data.ts.
//
// O*NET Web Services: https://services.onetcenter.org/
//   - free for up to 20 req/day without a key, higher quotas with one
//   - register at https://services.onetcenter.org/developer
//   - auth: HTTP Basic (username = your O*NET account username, password = account password)
//
// BLS Occupational Employment and Wage Statistics (OEWS): https://www.bls.gov/oes/
//   - bulk flat files at https://www.bls.gov/oes/tables.htm
//   - maps on SOC code (our Career.soc field)
//
// This script fetches one occupation's summary from O*NET by SOC code and
// prints it in the shape expected by careers-data.ts. To onboard a new career,
// run:
//   ONET_USER=... ONET_PASS=... npx tsx scripts/fetch-onet.ts 15-1252
//
// The output still needs manual salary + outlook (pull from BLS) and hand-edited
// dayInLife / relatedMajorSlugs before adding to CAREERS[].

import { config } from "dotenv";
config({ path: ".env.local" });

const ONET_USER = process.env.ONET_USER;
const ONET_PASS = process.env.ONET_PASS;

async function fetchOccupation(soc: string) {
  if (!ONET_USER || !ONET_PASS) {
    console.error("Set ONET_USER and ONET_PASS in .env.local");
    process.exit(1);
  }

  const auth = Buffer.from(`${ONET_USER}:${ONET_PASS}`).toString("base64");
  const url = `https://services.onetcenter.org/ws/online/occupations/${soc}.00/summary/tasks`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "User-Agent": "kidtocollege-careers-ingest/0.1",
    },
  });

  if (!res.ok) {
    console.error(`O*NET request failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  return res.json();
}

async function main() {
  const soc = process.argv[2];
  if (!soc) {
    console.error("Usage: tsx scripts/fetch-onet.ts <SOC, e.g. 15-1252>");
    process.exit(1);
  }

  const data = await fetchOccupation(soc);
  console.log(JSON.stringify(data, null, 2));
}

main();
