# CLAUDE.md

## Project

**endsars.online** — Data-driven transparency platform documenting Nigerian governance failure from 2010 to present. Nuxt 4 + Vue 3 + TypeScript. Package manager: **Bun**.

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Dev server (localhost:3000)
bun run generate     # Static site generation (production)
bun run preview      # Preview static build
bun run fetch-data   # Refresh data from World Bank, fawazahmed0, etc.
```

## Stack

- **Framework**: Nuxt 4 (app/ directory convention), Vue 3, TypeScript
- **Styling**: TailwindCSS v4 (via @tailwindcss/vite), Space Grotesk font
- **Charts**: Apache ECharts via vue-echarts (tree-shaken, ClientOnly)
- **Animations**: @vueuse/motion (opacity-only, no position shifts)
- **SEO**: @nuxtjs/seo, JSON-LD, OG image 1200x630, llms.txt

## Colors

- Green: `#008751` (primary), `#006B40` (hover), `#00A86B` (accent)
- White: `#FFFFFF` (bg), `#F7F7F7` (alt sections), `#EFEFEF` (cards)
- Black: `#000000`, `#0A0A0A`, `#111111`, `#1A1A1A` (text shades only)
- **No gray. No gradients. Ever.**

## Directory Structure

```
app/
  pages/index.vue           # Single scroll page, all sections
  layouts/default.vue       # Shell: NavBar + slot
  components/
    ui/                     # NavBar, Logo, SectionWrapper, Citation, CountUp, StatCard
    sections/               # HeroSection, PowerSection, NairaSection, etc. (auto-imported as SectionsXxx)
  composables/              # useDatasets, useAdministration, useCountUp, useSources
  types/data.ts             # TypeScript interfaces for all JSON datasets
  utils/                    # colors, format, chartDefaults
  assets/css/main.css       # Tailwind theme tokens, chart container sizes
data/                       # 9 static JSON datasets (committed, sourced)
scripts/fetch-data.ts       # Automated data refresh script
public/                     # favicon.svg, og-image.png, robots.txt, llms.txt
```

## Data Rules

- Every data point **must** cite a credible source with URL
- Data lives in `data/*.json` — static, build-time bundled (no runtime API calls)
- Each JSON has a `sources` array with `name`, `url`, `retrieved` date
- Chart admin bands use "PDP — Jonathan", "APC — Buhari", "APC — Tinubu" labels
- All currencies must be labelled (NGN or USD)

## Chart Patterns

- Wrap in `<ClientOnly>` with `<template #fallback>` skeleton
- Import only needed ECharts modules (tree-shaking)
- Tooltips: white bg `#FFFFFF`, dark text `#0A0A0A`, green border
- Chart containers: `.chart-container` (380px) or `.chart-container-sm` (300px)
- Admin era bands on every time-series chart

## Animation Rules

- Max 1 v-motion per section (SectionWrapper handles title animation)
- Opacity-only transitions — **no y/x position offsets** (causes scroll fighting)
- No stagger delays
- Hero section: max 3 animations (logo, headline, stats)

## Component Naming

- Components in `sections/` are auto-imported as `SectionsXxxSection`
- Components in `ui/` are auto-imported as `UiXxx`
