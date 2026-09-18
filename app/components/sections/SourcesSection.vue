<script setup lang="ts">
const datasets = useDatasets();

interface SourceGroup {
  category: string;
  sources: {
    name: string;
    url: string;
    retrieved?: string;
    note?: string;
  }[];
}

const groups: [string, { sources: SourceGroup["sources"] }][] = [
  ["#EndSARS, protest and elections", datasets.accountability],
  ["Exchange rate", datasets.exchangeRate],
  ["Fuel prices", datasets.fuelPrice],
  ["Inflation", datasets.inflation],
  ["Wages and food prices", datasets.costOfLiving],
  ["Debt", datasets.governmentDebt],
  ["Federal budget", datasets.budget],
  ["GDP and remittances", datasets.economy],
  ["Poverty and hunger", datasets.poverty],
  ["Electricity", datasets.electricity],
  ["Health and education", datasets.healthEducation],
  ["Emigration", datasets.japa],
  ["Violence and security", datasets.violence],
  ["Corruption", datasets.corruption],
  ["Government officials", datasets.governmentOfficials],
];

const sourceGroups = computed<SourceGroup[]>(() =>
  groups.map(([category, d]) => ({
    category,
    sources: d.sources.map((s) => ({ name: s.name, url: s.url, retrieved: s.retrieved, note: s.note })),
  })),
);
</script>

<template>
  <UiSectionWrapper
    id="sources"
    title="Sources and method"
    highlight="Sources"
    subtitle="Every number on this page links back to where it came from."
    dark
  >
    <div class="space-y-12">
      <!-- Methodology -->
      <div class="max-w-3xl">
        <h3 class="text-lg font-semibold text-black mb-3">How we worked</h3>
        <div class="space-y-3 text-sm text-black-text/70 leading-relaxed">
          <p>
            We use official statistics (CBN, NBS, DMO, the Budget Office), international bodies (World Bank, IMF,
            UN agencies) and independent monitors (ACLED, SBM Intelligence, Transparency International, Afrobarometer).
            Where we used a news report, it is because the report quotes an official release we could not open directly.
          </p>
          <p>
            Some figures are our own arithmetic on public data, such as yearly ACLED totals, CBN exchange rate averages,
            UK visa totals and Afrobarometer percentages. Those are labelled "calculated by endsars.online" and the
            underlying data is linked. We do not join series that measure different things. When a statistics office
            changed its method, as the NBS did for inflation in 2025, we say so on the chart.
          </p>
          <p>
            Some things we could not source well enough to publish: a police-to-population ratio, the number of
            officers convicted over #EndSARS, yearly counts of national grid collapses, and deaths broken down by armed
            group. They are left out on purpose.
          </p>
          <p>The illustrations on this site are AI-generated. They are not photographs of real events.</p>
        </div>
      </div>

      <!-- Source groups -->
      <div class="space-y-8">
        <div v-for="group in sourceGroups" :key="group.category">
          <h3
            class="text-base font-semibold text-black mb-3 border-b border-black/10 pb-2"
          >
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
                {{ source.note }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Last updated -->
      <div class="text-xs text-black-text/40 border-t border-black/10 pt-4">
        <p>Last updated: 18 September 2026</p>
      </div>
    </div>
  </UiSectionWrapper>
</template>
