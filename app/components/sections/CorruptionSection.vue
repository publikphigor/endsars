<script setup lang="ts">
import { timeSeries, compact } from '~/utils/chart'

const { corruption } = useDatasets()

const cpi = corruption.cpiData.data.filter(d => d.year >= 2012)
const latestCPI = cpi[cpi.length - 1]!
const worstRank = cpi.reduce((a, b) => (b.rank > a.rank ? b : a))
const latestWGI = corruption.wgiData.data[corruption.wgiData.data.length - 1]!

const cpiOption = computed(() => {
  const option = timeSeries({
    x: cpi.map(d => d.year),
    series: [
      { name: 'Nigeria', data: cpi.map(d => d.score) },
      { name: 'Global average (43)', data: cpi.map(() => 43), color: '#0A0A0A', dashed: true },
      { name: 'Sub-Saharan Africa average (33)', data: cpi.map(() => 33), color: '#0A0A0A66', dashed: true },
    ],
    min: 0,
    max: 60,
  })
  ;(option.tooltip as any).formatter = (params: any) => {
    const items = Array.isArray(params) ? params : [params]
    const row = cpi[items[0].dataIndex]!
    return `<strong>${row.year}</strong><br/>Score: ${row.score} out of 100<br/>Rank: ${row.rank} of ${row.totalCountries}`
  }
  option.series.slice(1).forEach((s: any) => { s.symbol = 'none' })
  return option
})

const efcc = corruption.efccConvictions.data
const efccOption = computed(() => {
  const option = timeSeries({
    x: efcc.map(d => d.year),
    series: [{ name: 'EFCC convictions', data: efcc.map(d => d.value), type: 'bar' }],
  })
  option.yAxis.axisLabel.formatter = compact as any
  return option
})
</script>

<template>
  <UiSectionWrapper
    id="corruption"
    title="Many cases, few verdicts"
    highlight="verdicts"
    :subtitle="`Nigeria scored ${latestCPI.score} out of 100 on Transparency International's 2025 corruption index, ranking ${latestCPI.rank}th of ${latestCPI.totalCountries}. The score has barely moved since 2012.`"
    lede="Every administration since 2010 has promised to fight corruption, and each has produced headline cases. Very few of the biggest ones have ended in a conviction that stuck. Trials run for a decade, charges are dropped, convictions are overturned on appeal, and in 2022 two jailed former governors were pardoned. The table below follows cases from all three presidencies."
    dark
  >
    <div class="space-y-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UiStatCard
          :value="`${latestCPI.score} / 100`"
          :label="`Corruption Perceptions Index 2025, below the sub-Saharan average of 33`"
          source="Transparency International"
          source-url="https://www.transparency.org/en/cpi/2025"
        />
        <UiStatCard
          :value="`${worstRank.rank}th`"
          :label="`Worst rank, reached in ${worstRank.year} (of ${worstRank.totalCountries} countries)`"
          source="Transparency International"
          source-url="https://en.wikipedia.org/wiki/List_of_countries_by_Corruption_Perceptions_Index"
        />
        <UiStatCard
          :value="latestWGI.value.toFixed(2)"
          :label="`World Bank control of corruption score, ${latestWGI.year} (scale of -2.5 to 2.5). Below zero every year since 2010.`"
          source="World Bank Worldwide Governance Indicators"
          source-url="https://www.worldbank.org/en/publication/worldwide-governance-indicators"
        />
      </div>

      <UiChart
        :option="cpiOption"
        title="Corruption Perceptions Index"
        note="Score out of 100; higher means less corrupt. Starts in 2012, when TI moved to its current scale."
        source="Transparency International"
      />

      <div>
        <h3 class="text-lg font-semibold text-black">Where the big cases stand</h3>
        <p class="text-sm text-black-text/50 mt-1">Amounts are alleged unless a court has ruled. Status as of September 2026.</p>
        <div class="overflow-x-auto mt-6">
          <table class="w-full text-sm min-w-[640px]">
            <thead>
              <tr class="border-b border-black/20 text-left text-black-text/50">
                <th class="py-2 pr-4 font-medium">Case</th>
                <th class="py-2 pr-4 font-medium">Term</th>
                <th class="py-2 pr-4 font-medium">Amount</th>
                <th class="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in corruption.cases" :key="c.case" class="border-b border-black/5 align-top">
                <td class="py-3 pr-4 font-semibold text-black">{{ c.case }}</td>
                <td class="py-3 pr-4 text-black-text/60 whitespace-nowrap">{{ c.era }}</td>
                <td class="py-3 pr-4 text-black-text/80">{{ c.amount }}</td>
                <td class="py-3 text-black-text/70">{{ c.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-black-text/40 mt-3">
          Sources: BusinessDay (January 2026), Premium Times, CNBC Africa, Channels TV, Vanguard, Sahara Reporters. Full
          links in the sources section below.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <UiChart
          :option="efccOption"
          title="EFCC convictions"
          note="All offences, by year. No reliable figure was found for 2017."
          source="EFCC figures via TheCable and Punch"
          small
        />
        <p class="text-black-text/70 leading-relaxed lg:pt-10">
          The anti-graft agency's conviction count has climbed from about 100 a year to more than 4,000. Most of those
          convictions are for online fraud. The politically connected cases in the table above are still in court
          years later.
          <UiCitation source="Punch, April 2026" url="https://punchng.com/efcc-records-over-20000-convictions-in-12-years/" />
        </p>
      </div>
    </div>
  </UiSectionWrapper>
</template>
