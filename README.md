# endsars.online

What happened to Nigeria after the #EndSARS protests, told with public data from 2010 to today. The page follows one story, from the Lekki toll gate shooting on 20 October 2020 to the presidential election on 16 January 2027, and every number on it links to its source.

**Live site:** [endsars.online](https://endsars.online)

## What the page covers

| Chapter | Main sources |
|---|---|
| The five #EndSARS demands, protest and press freedom | Lagos judicial panel reporting, Amnesty International, RSF, Freedom House, CIVICUS |
| Who has held power | Official records, cross-checked with news reports |
| The naira | Central Bank of Nigeria daily rates, IMF |
| Prices: petrol, food, cooking fuel, inflation | NBS price watches and CPI, NNPC and Dangote prices, SBM Intelligence Jollof Index |
| Debt and the budget | Debt Management Office, Budget Office, IMF, World Bank |
| Poverty and hunger | World Bank, NBS, Cadre Harmonisé, WFP |
| Electricity | World Bank (Tracking SDG7, IEA data) |
| Health and schools | UN agencies via the World Bank, WHO, WAEC, UNICEF, MSF |
| Emigration ("japa") | UK Home Office, IRCC (Canada), NMC, Afrobarometer |
| Violence | ACLED, SBM Intelligence, NBS crime survey, IDMC |
| Corruption | Transparency International, World Bank governance indicators, court reporting |
| Elections and public opinion | INEC, International IDEA, Afrobarometer |

Every time-series chart is shaded by administration: Jonathan (PDP), Buhari (APC) and Tinubu (APC). The full source list, with links and retrieval dates, is at [endsars.online/#sources](https://endsars.online/#sources).

## Tech stack

- [Nuxt 4](https://nuxt.com), Vue 3 and TypeScript, generated as a static site
- Tailwind CSS v4 and Space Grotesk (self-hosted)
- Apache ECharts through vue-echarts
- @nuxtjs/seo for the sitemap, robots and structured data
- [Bun](https://bun.sh) as the package manager
- Hosted on Cloudflare Pages

## Running it locally

```bash
git clone git@github.com:publikphigor/endsars.git
cd endsars
bun install
bun run dev
```

The site runs at `http://localhost:3000`.

| Command | What it does |
|---|---|
| `bun run dev` | Development server |
| `bun run generate` | Builds the static site |
| `bun run preview` | Serves the built site |
| `bun run fetch-data` | Refreshes the series that come from open APIs |

## Project layout

```
data/                  JSON datasets, one per topic, each with its own sources list
scripts/fetch-data.ts  Refreshes CBN exchange rates and World Bank indicators
app/
  pages/index.vue      The single page, section order, SEO tags
  components/
    sections/          One component per chapter
    ui/                Chart, Callout, Citation, Illustration, SectionWrapper and friends
  utils/chart.ts       Shared chart builders with administration bands
  types/data.ts        Types for every dataset
public/                Illustrations, share image, llms.txt
```

## Updating the data

`bun run fetch-data` refreshes the CBN exchange rates and the World Bank series (inflation, external debt, poverty, governance indicators, electricity access, health, remittances). It prints a list of everything that still needs a manual update, such as:

- ACLED fatalities (monthly file on [HDX](https://data.humdata.org/dataset/nigeria-acled-conflict-data), summed by year)
- NBS petrol, fuel and food prices, and monthly inflation
- DMO public debt, which is published each quarter
- Appropriation Acts, SBM kidnap reports, IDMC displacement figures, TI's corruption index, UK and Canadian migration data

A few rules keep the data honest:

1. Every figure needs a named source, a link and a retrieval date in its JSON file.
2. Don't join series that measure different things. When a statistics office changes its method, say so on the chart.
3. If a number can't be traced to a specific report or dataset, leave it out.

## Deployment

Cloudflare Pages builds and deploys the site automatically:

- A merge to `main` deploys to [endsars.online](https://endsars.online).
- Pull requests from branches in this repo get their own preview link, posted on the PR by Cloudflare. Pull requests from forks are not built automatically.

There is nothing to deploy by hand. The build runs `bun install --frozen-lockfile && bun run generate` and publishes the `dist` folder.

## Contributing

Contributions are welcome, especially corrections to the data.

`main` is protected. Changes go through a pull request, and a PR needs an approving review before it can be merged. Force-pushes and branch deletion are blocked.

1. Fork the repo and create a branch.
2. Make your change and check it with `bun run dev`.
3. Open a pull request that says what changed and where the numbers come from.
4. A maintainer reviews the change and merges it.

When writing code, follow the patterns already in the repo:

- Build charts with `UiChart` and the helpers in `app/utils/chart.ts`, so every chart gets the administration bands.
- Use green (`#008751`), white and black only, with no grey and no gradients.
- Keep animations to opacity changes, with no movement.
- Write copy in plain language, with sentence-case headings and no em dashes.

## Reporting a wrong number

If a figure is wrong, out of date or has a broken source link, [open an issue](https://github.com/publikphigor/endsars/issues). Name the chart or section and include a link to the correct source.

## Security

To report a security problem, use [private vulnerability reporting](https://github.com/publikphigor/endsars/security/advisories/new) instead of a public issue. Secret scanning with push protection and Dependabot alerts are enabled on this repo.

## Illustrations

The illustrations are AI-generated. They are not photographs of real events.

## License

The code is released under the [MIT License](LICENSE). The data belongs to the organisations that published it. Each dataset in `data/` lists its sources.
