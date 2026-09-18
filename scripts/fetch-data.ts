/**
 * Data refresh script for endsars.online
 *
 * Refreshes the series that come from open APIs:
 *   - CBN daily exchange rates (annual and quarterly averages)
 *   - World Bank indicators (inflation, external debt, poverty, WGI,
 *     electricity access, health, remittances)
 *
 * Everything else (NBS price watches, DMO debt, budgets, ACLED, SBM, Afrobarometer)
 * is updated by hand. See the "manual" list printed at the end.
 *
 * Run: bun run scripts/fetch-data.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(import.meta.dir, "..", "data");
const TODAY = new Date().toISOString().split("T")[0];

interface YearValue {
  year: number;
  value: number;
}

function loadJSON(filename: string): any {
  return JSON.parse(readFileSync(join(DATA_DIR, filename), "utf-8"));
}

function saveJSON(filename: string, data: unknown) {
  writeFileSync(join(DATA_DIR, filename), JSON.stringify(data, null, 2) + "\n");
  console.log(`  Saved ${filename}`);
}

function markRetrieved(dataset: any, urlFragment: string) {
  for (const s of dataset.sources ?? []) {
    if (s.url.includes(urlFragment)) s.retrieved = TODAY;
  }
}

async function fetchWorldBank(
  indicator: string,
  { from = 2010, decimals = 2, source }: { from?: number; decimals?: number; source?: number } = {},
): Promise<YearValue[]> {
  const to = new Date().getFullYear();
  const src = source ? `&source=${source}` : "";
  const url = `https://api.worldbank.org/v2/country/NGA/indicator/${indicator}?format=json&date=${from}:${to}&per_page=100${src}`;
  const res = await fetch(url);
  const json = (await res.json()) as [unknown, { date: string; value: number | null }[] | null];
  if (!json[1]) {
    console.log(`  No data for ${indicator}`);
    return [];
  }
  const f = 10 ** decimals;
  return json[1]
    .filter((d) => d.value !== null)
    .map((d) => ({ year: parseInt(d.date), value: Math.round(d.value! * f) / f }))
    .sort((a, b) => a.year - b.year);
}

/** Replace a series only when the API returned something, so a failed call never wipes data. */
function replaceIfAny<T>(current: T[], next: T[], label: string): T[] {
  if (!next.length) {
    console.log(`  Kept existing ${label}`);
    return current;
  }
  return next;
}

async function fetchExchangeRates() {
  console.log("CBN exchange rates...");
  const res = await fetch("https://www.cbn.gov.ng/api/GetAllExchangeRates");
  const rows = (await res.json()) as { currency: string; ratedate: string; centralrate: string }[];
  const usd = rows.filter((r) => r.currency.toUpperCase() === "US DOLLAR" && r.ratedate >= "2010-01-01");
  if (!usd.length) return console.log("  No CBN data; kept existing");

  const years = new Map<number, number[]>();
  const quarters = new Map<string, number[]>();
  for (const r of usd) {
    const rate = parseFloat(r.centralrate);
    if (!Number.isFinite(rate)) continue;
    const year = parseInt(r.ratedate.slice(0, 4));
    const q = `${year}-Q${Math.ceil(parseInt(r.ratedate.slice(5, 7)) / 3)}`;
    years.set(year, [...(years.get(year) ?? []), rate]);
    quarters.set(q, [...(quarters.get(q) ?? []), rate]);
  }
  const avg = (xs: number[]) => Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 100) / 100;
  const thisYear = new Date().getFullYear();
  const latest = usd.reduce((a, b) => (a.ratedate > b.ratedate ? a : b));

  const fx = loadJSON("exchange-rate.json");
  fx.annualAverages.data = [...years].sort(([a], [b]) => a - b).map(([year, xs]) => ({
    year,
    value: avg(xs),
    ...(year === thisYear ? { partial: true } : {}),
  }));
  fx.quarterlyData.data = [...quarters].sort(([a], [b]) => a.localeCompare(b)).map(([key, xs]) => {
    const [y, quarter] = key.split("-");
    return { year: parseInt(y), quarter, value: avg(xs), source: "CBN" };
  });
  fx.recentRates.cbnOfficial = {
    date: latest.ratedate,
    rate: Math.round(parseFloat(latest.centralrate) * 100) / 100,
    source: "CBN central rate",
  };
  markRetrieved(fx, "cbn.gov.ng");
  saveJSON("exchange-rate.json", fx);
  console.log("  The parallel-market rate (recentRates.openMarket) is manual.");
}

async function fetchWorldBankSeries() {
  console.log("World Bank indicators...");

  const inflation = loadJSON("inflation.json");
  inflation.data = replaceIfAny(inflation.data, await fetchWorldBank("FP.CPI.TOTL.ZG"), "inflation");
  markRetrieved(inflation, "FP.CPI.TOTL.ZG");
  saveJSON("inflation.json", inflation);

  const debt = loadJSON("government-debt.json");
  const ext = await fetchWorldBank("DT.DOD.DECT.CD", { decimals: 1 });
  debt.externalDebt.data = replaceIfAny(
    debt.externalDebt.data,
    ext.map((d) => ({ year: d.year, valueUSD: d.value })),
    "external debt",
  );
  markRetrieved(debt, "DT.DOD.DECT.CD");
  saveJSON("government-debt.json", debt);

  const poverty = loadJSON("poverty.json");
  poverty.internationalPovertyLine.data = replaceIfAny(
    poverty.internationalPovertyLine.data,
    await fetchWorldBank("SI.POV.DDAY"),
    "international poverty line",
  );
  poverty.undernourishment = replaceIfAny(poverty.undernourishment, await fetchWorldBank("SN.ITK.DEFC.ZS", { decimals: 1 }), "undernourishment");
  markRetrieved(poverty, "SI.POV.DDAY");
  saveJSON("poverty.json", poverty);

  const corruption = loadJSON("corruption.json");
  corruption.wgiData.data = replaceIfAny(corruption.wgiData.data, await fetchWorldBank("GOV_WGI_CC.EST", { source: 3 }), "WGI control of corruption");
  corruption.wgiData.ruleOfLaw = replaceIfAny(corruption.wgiData.ruleOfLaw, await fetchWorldBank("GOV_WGI_RL.EST", { source: 3 }), "WGI rule of law");
  markRetrieved(corruption, "worldwide-governance-indicators");
  saveJSON("corruption.json", corruption);

  const electricity = loadJSON("electricity.json");
  electricity.access = replaceIfAny(electricity.access, await fetchWorldBank("EG.ELC.ACCS.ZS", { decimals: 1 }), "electricity access");
  markRetrieved(electricity, "EG.ELC.ACCS.ZS");
  saveJSON("electricity.json", electricity);

  const health = loadJSON("health-education.json");
  const mmr = await fetchWorldBank("SH.STA.MMRT", { decimals: 0 });
  const deaths = await fetchWorldBank("SH.MMR.DTHS", { decimals: 0 });
  if (mmr.length) {
    health.maternalMortality = mmr.map((d) => ({
      year: d.year,
      ratio: d.value,
      deaths: deaths.find((x) => x.year === d.year)?.value ?? null,
    }));
  }
  health.under5 = replaceIfAny(health.under5, await fetchWorldBank("SH.DYN.MORT", { decimals: 1 }), "under-5 mortality");
  health.lifeExpectancy = replaceIfAny(health.lifeExpectancy, await fetchWorldBank("SP.DYN.LE00.IN"), "life expectancy");
  health.healthSpendShare = replaceIfAny(health.healthSpendShare, await fetchWorldBank("SH.XPD.GHED.GE.ZS"), "health spending share");
  for (const code of ["SH.STA.MMRT", "SH.DYN.MORT", "SP.DYN.LE00.IN", "SH.XPD.GHED.GE.ZS"]) markRetrieved(health, code);
  saveJSON("health-education.json", health);

  const economy = loadJSON("economy.json");
  const remit = await fetchWorldBank("BX.TRF.PWKR.CD.DT", { decimals: 0 });
  economy.remittances = replaceIfAny(
    economy.remittances,
    remit.map((d) => ({ year: d.year, value: Math.round(d.value / 1e7) / 100 })),
    "remittances",
  );
  markRetrieved(economy, "BX.TRF.PWKR.CD.DT");
  saveJSON("economy.json", economy);
}

async function main() {
  console.log(`\nRefreshing data (${TODAY})\n`);
  await Promise.all([fetchExchangeRates(), fetchWorldBankSeries()]);

  console.log(`
Done. Update these by hand:
  - ACLED fatalities: download the monthly political violence file from
    https://data.humdata.org/dataset/nigeria-acled-conflict-data and sum by year (data/violence.json -> acled)
  - Petrol, diesel, LPG, kerosene, food prices: NBS Price Watch reports (fuel-price.json, cost-of-living.json)
  - Monthly inflation: NBS CPI release (inflation.json -> monthly)
  - Public debt: DMO quarterly release (government-debt.json -> yearEnd, totalPublicDebt)
  - Budget: Appropriation Acts (budget.json)
  - Kidnapping: SBM Intelligence annual report (violence.json -> kidnapping)
  - IDPs: IDMC on HDX (violence.json -> idps)
  - CPI: Transparency International each February (corruption.json -> cpiData)
  - Press freedom and Freedom House: accountability.json
  - UK visas and Canada PR: japa.json
`);
}

main().catch(console.error);
