/**
 * Data fetching script for EndSARS Nigeria Governance Tracker
 *
 * Fetches latest data from World Bank API and other open sources.
 * Run: bun run scripts/fetch-data.ts
 *
 * For sources requiring API keys (ACLED), set environment variables:
 *   ACLED_API_KEY=your_key
 *   ACLED_EMAIL=your_email
 */

import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(import.meta.dir, "..", "data");
const TODAY = new Date().toISOString().split("T")[0];

interface WorldBankEntry {
  date: string;
  value: number | null;
}

interface WorldBankResponse {
  page: number;
  pages: number;
  per_page: number;
  total: number;
}

async function fetchWorldBank(
  indicator: string,
  startYear: number = 2010,
  endYear: number = new Date().getFullYear()
): Promise<{ year: number; value: number }[]> {
  const url = `https://api.worldbank.org/v2/country/NGA/indicator/${indicator}?format=json&date=${startYear}:${endYear}&per_page=50`;
  const res = await fetch(url);
  const json = (await res.json()) as [WorldBankResponse, WorldBankEntry[]];

  if (!json[1]) return [];

  return json[1]
    .filter((d) => d.value !== null)
    .map((d) => ({
      year: parseInt(d.date),
      value: Math.round(d.value! * 100) / 100,
    }))
    .sort((a, b) => a.year - b.year);
}

function saveJSON(filename: string, data: unknown) {
  const path = join(DATA_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`  Saved ${path}`);
}

function loadJSON(filename: string): any {
  const path = join(DATA_DIR, filename);
  return JSON.parse(readFileSync(path, "utf-8"));
}

async function fetchExchangeRateQuarterly() {
  console.log("Fetching quarterly exchange rates from fawazahmed0...");
  const existing = loadJSON("exchange-rate.json");

  // Update annual averages from World Bank
  const annualData = await fetchWorldBank("PA.NUS.FCRF");
  existing.annualAverages.data = annualData;

  // Fetch recent monthly rates from fawazahmed0 to update quarterly data
  const now = new Date();
  const startDate = new Date("2024-04-01");
  const months: { date: string; rate: number }[] = [];

  for (let d = new Date(startDate); d <= now; d.setMonth(d.getMonth() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateStr}/v1/currencies/usd.json`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = (await res.json()) as { usd: Record<string, number> };
      if (json.usd?.ngn) {
        months.push({ date: dateStr, rate: Math.round(json.usd.ngn * 100) / 100 });
      }
    } catch {
      // skip failed months
    }
  }

  // Aggregate to quarters
  const quarterMap = new Map<string, number[]>();
  for (const m of months) {
    const [y, mo] = m.date.split("-").map(Number);
    const q = Math.ceil(mo / 3);
    const key = `${y}-Q${q}`;
    if (!quarterMap.has(key)) quarterMap.set(key, []);
    quarterMap.get(key)!.push(m.rate);
  }

  // Update quarterly data entries from fawazahmed0
  for (const [key, rates] of quarterMap) {
    const [yearStr, quarter] = key.split("-");
    const year = parseInt(yearStr);
    const avg = Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100) / 100;
    const idx = existing.quarterlyData.data.findIndex(
      (d: any) => d.year === year && d.quarter === quarter
    );
    const entry = { year, quarter, value: avg, source: "fawazahmed0" };
    if (idx >= 0) {
      existing.quarterlyData.data[idx] = entry;
    } else {
      existing.quarterlyData.data.push(entry);
    }
  }

  existing.quarterlyData.data.sort(
    (a: any, b: any) => a.year - b.year || a.quarter.localeCompare(b.quarter)
  );

  saveJSON("exchange-rate.json", existing);
  console.log(`  Updated ${months.length} monthly rates, ${quarterMap.size} quarters`);
}

async function fetchInflation() {
  console.log("Fetching inflation data...");
  const data = await fetchWorldBank("FP.CPI.TOTL.ZG");
  const existing = loadJSON("inflation.json");
  existing.data = data;
  existing.sources[0].retrieved = TODAY;
  saveJSON("inflation.json", existing);
}

async function fetchDebt() {
  console.log("Fetching government debt data...");
  const data = await fetchWorldBank("DT.DOD.DECT.CD");
  const existing = loadJSON("government-debt.json");
  existing.data = data;
  existing.sources[0].retrieved = TODAY;
  saveJSON("government-debt.json", existing);
}

async function fetchPoverty() {
  console.log("Fetching poverty data...");
  const data = await fetchWorldBank("SI.POV.DDAY");
  const existing = loadJSON("poverty.json");
  existing.data = data;
  existing.sources[0].retrieved = TODAY;
  saveJSON("poverty.json", existing);
}

async function fetchCorruption() {
  console.log("Fetching corruption (WGI) data...");
  const data = await fetchWorldBank("CC.EST");
  const existing = loadJSON("corruption.json");
  existing.wgiData = data;
  existing.sources[0].retrieved = TODAY;
  saveJSON("corruption.json", existing);
}

async function fetchACLED() {
  const key = process.env.ACLED_API_KEY;
  const email = process.env.ACLED_EMAIL;

  if (!key || !email) {
    console.log(
      "Skipping ACLED (set ACLED_API_KEY and ACLED_EMAIL env vars)"
    );
    return;
  }

  console.log("Fetching ACLED violence data...");
  const existing = loadJSON("violence.json");
  const currentYear = new Date().getFullYear();

  for (let year = 2010; year <= currentYear; year++) {
    const url = `https://api.acleddata.com/acled/read?key=${key}&email=${email}&event_date=${year}-01-01|${year}-12-31&event_date_where=BETWEEN&iso=566&limit=0`;
    try {
      const res = await fetch(url);
      const json = (await res.json()) as { count: number; data: any[] };
      const fatalities = json.data?.reduce(
        (sum: number, e: any) => sum + (parseInt(e.fatalities) || 0),
        0
      );

      const yearEntry = existing.data.find((d: any) => d.year === year);
      if (yearEntry) {
        yearEntry.acled_events = json.count || json.data?.length || null;
        yearEntry.acled_fatalities = fatalities || null;
      }
    } catch (e) {
      console.log(`  Failed for ${year}: ${e}`);
    }
  }

  existing.sources[0].retrieved = TODAY;
  saveJSON("violence.json", existing);
}

async function main() {
  console.log(`\nFetching data (${TODAY})...\n`);

  await Promise.all([
    fetchExchangeRateQuarterly(),
    fetchInflation(),
    fetchDebt(),
    fetchPoverty(),
    fetchCorruption(),
  ]);

  await fetchACLED();

  console.log("\nDone. Manual data sources still needed:");
  console.log("  - Fuel prices: NBS e-Library reports");
  console.log("  - Budget: Budget Office Appropriation Acts");
  console.log("  - CPI scores: Transparency International annual reports");
  console.log(
    "  - Violence: ACLED API (set ACLED_API_KEY and ACLED_EMAIL)\n"
  );
}

main().catch(console.error);
