<script setup lang="ts">
const datasets = useDatasets()

interface SourceGroup {
  category: string
  sources: {
    name: string
    url: string
    retrieved?: string
    note?: string
  }[]
}

const sourceGroups = computed<SourceGroup[]>(() => [
  {
    category: 'Exchange Rate',
    sources: datasets.exchangeRate.sources.map((s) => ({
      name: s.name,
      url: s.url,
      retrieved: s.retrieved,
      note: s.note,
    })),
  },
  {
    category: 'Inflation',
    sources: datasets.inflation.sources.map((s) => ({
      name: s.name,
      url: s.url,
      retrieved: s.retrieved,
      note: s.note,
    })),
  },
  {
    category: 'Government Debt',
    sources: datasets.governmentDebt.sources.map((s) => ({
      name: s.name,
      url: s.url,
      retrieved: s.retrieved,
      note: s.note,
    })),
  },
  {
    category: 'Federal Budget',
    sources: datasets.budget.sources.map((s) => ({
      name: s.name,
      url: s.url,
      retrieved: s.retrieved,
      note: s.note,
    })),
  },
  {
    category: 'Fuel Prices',
    sources: datasets.fuelPrice.sources.map((s) => ({
      name: s.name,
      url: s.url,
      retrieved: s.retrieved,
      note: s.note,
    })),
  },
  {
    category: 'Poverty',
    sources: datasets.poverty.sources.map((s) => ({
      name: s.name,
      url: s.url,
      retrieved: s.retrieved,
      note: s.note,
    })),
  },
  {
    category: 'Corruption',
    sources: datasets.corruption.sources.map((s) => ({
      name: s.name,
      url: s.url,
      note: s.note,
    })),
  },
  {
    category: 'Violence & Security',
    sources: datasets.violence.sources.map((s) => ({
      name: s.name,
      url: s.url,
      note: s.note,
    })),
  },
  {
    category: 'Government Officials',
    sources: datasets.governmentOfficials.sources.map((s) => ({
      name: s.name,
      url: s.url,
      retrieved: s.retrieved,
      note: s.note,
    })),
  },
])
</script>

<template>
  <UiSectionWrapper
    id="sources"
    title="Sources & Methodology"
    subtitle="Every data point on this site is traceable to a credible source."
    :section-number="9"
    dark
  >
    <div class="space-y-12">
      <!-- Methodology -->
      <div class="max-w-3xl">
        <h3 class="text-lg font-semibold text-green mb-3">Methodology</h3>
        <p class="text-sm text-black-text/70 leading-relaxed">
          All data presented on this site is sourced from credible international institutions
          (World Bank, IMF, Transparency International, ACLED), Nigerian government agencies
          (CBN, NBS, Budget Office, DMO), and respected civil society organizations (BudgIT,
          TheCable, SBM Intelligence). Where official data is unavailable, we use World Bank
          modelled estimates or projections and clearly label them as such. Historical CPI scores
          prior to 2012 have been converted from the 0-10 scale to the current 0-100 scale for
          consistency.
        </p>
        <p class="text-sm text-black-text/70 leading-relaxed mt-3">
          Violence data for 2010-2022 is sourced from media reports and human rights organizations.
          Granular event-level data from ACLED requires API access (registration at
          developer.acleddata.com). The NBS Crime Experience Survey (2024) reports significantly
          higher figures than media-tracked datasets, reflecting underreporting in public records.
        </p>
      </div>

      <!-- Source groups -->
      <div class="space-y-8">
        <div
          v-for="group in sourceGroups"
          :key="group.category"
        >
          <h3 class="text-base font-semibold text-green mb-3 border-b border-black/10 pb-2">
            {{ group.category }}
          </h3>
          <ul class="space-y-2">
            <li
              v-for="source in group.sources"
              :key="source.url"
              class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
            >
              <a
                :href="source.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-black hover:text-green transition-colors duration-150"
              >
                {{ source.name }}
                <span class="text-green ml-1">&nearr;</span>
              </a>
              <span v-if="source.retrieved" class="text-xs text-black-text/40">
                Retrieved {{ source.retrieved }}
              </span>
              <span v-if="source.note" class="text-xs text-black-text/40">
                &mdash; {{ source.note }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Last updated -->
      <div class="text-xs text-black-text/40 border-t border-black/10 pt-4">
        <p>Last updated: April 4, 2026</p>
      </div>
    </div>
  </UiSectionWrapper>
</template>
