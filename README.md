# endsars.online

A data-driven transparency platform documenting Nigerian governance from 2010 to present. Every chart, every number, every claim is backed by data from credible international and Nigerian institutions.

**Live site**: [endsars.online](https://endsars.online)

## What This Project Tracks

| Category | Sources |
|----------|---------|
| Exchange Rate (NGN→USD) | Central Bank of Nigeria, World Bank, fawazahmed0 |
| Inflation (CPI) | World Bank, National Bureau of Statistics, IMF |
| Fuel Prices (PMS) | NBS, NNPC, PPPRA |
| Government Debt | Debt Management Office, World Bank, IMF |
| Federal Budget | Budget Office of the Federation, BudgIT |
| Violence & Kidnapping | ACLED, NHRC, CFR, TheCable, Sahara Reporters |
| Poverty | World Bank, NBS, UNDP |
| Corruption (CPI) | Transparency International, World Governance Indicators |
| Government Officials | Wikipedia (cross-referenced with official sources) |

All data covers **2010 to present**, spanning the Jonathan (PDP), Buhari (APC), and Tinubu (APC) administrations.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com) + Vue 3 + TypeScript
- **Styling**: TailwindCSS v4, Space Grotesk font (self-hosted)
- **Charts**: Apache ECharts via vue-echarts
- **Animations**: @vueuse/motion
- **SEO**: @nuxtjs/seo, JSON-LD, Open Graph
- **Package Manager**: [Bun](https://bun.sh)

## Getting Started

```bash
# Clone the repo
git clone git@github.com:publikphigor/endsars.git
cd endsars

# Install dependencies
bun install

# Start dev server
bun run dev
```

The site runs at `http://localhost:3000`.

## Project Structure

```
data/               # Static JSON datasets (9 files, all sourced)
scripts/            # Data fetching scripts
app/
  pages/            # Single index page (scroll-based storytelling)
  components/
    ui/             # Reusable UI: NavBar, Logo, Citation, CountUp, StatCard
    sections/       # Page sections: Hero, Power, Naira, Debt, etc.
  composables/      # useDatasets, useAdministration, useCountUp
  types/            # TypeScript interfaces for all datasets
  utils/            # Colors, formatting, ECharts defaults
  assets/css/       # Tailwind theme, fonts
public/             # Favicon, OG image, robots.txt, llms.txt
```

## Available Commands

```bash
bun run dev          # Development server (localhost:3000)
bun run build        # Production build
bun run generate     # Static site generation
bun run preview      # Preview production build
bun run fetch-data   # Refresh data from World Bank & other APIs
```

## Updating Data

Run `bun run fetch-data` to pull the latest data from:
- World Bank API (exchange rate, inflation, debt, poverty, corruption indicators)
- fawazahmed0/currency-api (quarterly exchange rates via jsDelivr CDN)

Some data requires manual updates:
- **Fuel prices**: NBS monthly PMS price reports
- **Budget**: Budget Office Appropriation Acts
- **Violence**: ACLED (requires free API key), NHRC reports, media sources
- **CPI scores**: Transparency International annual reports

## Contributing

Contributions are welcome. This project relies on accurate, well-sourced data.

### Data Contributions

1. **All data must come from credible sources** — government agencies (CBN, NBS, DMO, Budget Office), international institutions (World Bank, IMF, UNDP), or established research organizations (ACLED, Transparency International, BudgIT).
2. **Every data point must include a reference** — add a `source` URL and `retrieved` date in the dataset JSON.
3. **No unverified claims** — if a number cannot be attributed to a specific report or dataset, it should not be included.
4. **Cross-reference when possible** — use multiple sources to verify figures, especially for violence/kidnapping data which varies between methodologies.

### Code Contributions

1. Fork the repo and create a feature branch
2. Follow the existing patterns:
   - Components use `<script setup lang="ts">` with Composition API
   - Charts wrap `<VChart>` in `<ClientOnly>` with skeleton fallbacks
   - Colors: green (#008751), white (#FFFFFF), black shades only — no gray, no gradients
   - Animations: opacity-only (no position shifts)
3. Test with `bun run dev` and verify no SSR errors
4. Submit a PR with a clear description of what changed and why

### Reporting Issues

If you find inaccurate data, a broken source link, or missing information:
- Open an issue with the category (e.g., "Violence data for 2024")
- Include the correct data with a link to the credible source
- We'll verify and update

## Design Principles

- **Light mode only** — white backgrounds, black text, green accents
- **No gradients** — flat colors throughout
- **Every chart shows who was in power** — PDP/APC era bands on all time-series
- **Citations are non-blocking** — superscript numbers that link to sources, with hover tooltips
- **Performance first** — all data is static JSON bundled at build time, no runtime API calls
- **SEO optimized** — JSON-LD structured data, OG image, sitemap, llms.txt

## Data Sources

Full source list with links available on the site at [endsars.online/#sources](https://endsars.online/#sources).

Key sources include:
- [World Bank Open Data](https://data.worldbank.org) — Exchange rates, inflation, debt, poverty
- [Central Bank of Nigeria](https://www.cbn.gov.ng) — Official exchange rates
- [National Bureau of Statistics](https://nigerianstat.gov.ng) — CPI, fuel prices, crime survey
- [Debt Management Office](https://www.dmo.gov.ng) — Public debt profile
- [Budget Office of the Federation](https://budgetoffice.gov.ng) — Appropriation Acts
- [Transparency International](https://www.transparency.org) — Corruption Perceptions Index
- [ACLED](https://acleddata.com) — Armed conflict events and fatalities
- [NHRC](https://www.nigeriarights.gov.ng) — Human rights and violence reports

## License

This project is open source. Data is publicly sourced and cited. See individual dataset files in `data/` for specific source attributions.
