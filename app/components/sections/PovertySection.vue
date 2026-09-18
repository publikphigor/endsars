<script setup lang="ts">
import { timeSeries, pct } from '~/utils/chart'

const { poverty, accountability } = useDatasets()

const national = poverty.nationalPovertyLine.data
const povertyOption = computed(() => {
  const option = timeSeries({
    x: national.map(d => d.year),
    series: [{ name: 'Below the national poverty line', data: national.map(d => d.value), type: 'bar', labels: true }],
    format: pct,
    min: 0,
    max: 80,
  })
  option.series[0]!.data = national.map(d => ({
    value: d.value,
    itemStyle: { color: d.projection ? '#00875166' : '#008751', borderRadius: [2, 2, 0, 0] },
  })) as any
  return option
})

const hunger = poverty.foodInsecurity.data
const hungerOption = computed(() => {
  const option = timeSeries({
    x: hunger.map(d => d.year),
    series: [{ name: 'People in food crisis or worse (millions)', data: hunger.map(d => d.value), type: 'bar', labels: true }],
    format: v => `${v}m`,
  })
  option.tooltip.valueFormatter = undefined as any
  ;(option.tooltip as any).formatter = (params: any) => {
    const p = Array.isArray(params) ? params[0] : params
    const row = hunger[p.dataIndex]!
    return `<strong>${row.year}</strong><br/>${row.value} million people<br/><span style="color:#0A0A0A99">${row.states} states analysed</span>`
  }
  return option
})

const mpi = poverty.multidimensionalPoverty
const latestUnder = poverty.undernourishment[poverty.undernourishment.length - 1]!
</script>

<template>
  <UiSectionWrapper
    id="poverty"
    title="Most Nigerians are now poor"
    subtitle="The World Bank estimates that 63% of Nigerians lived below the national poverty line in 2025. In 2019 the figure was 40%."
    image="/images/market.webp"
    image-alt="Linocut illustration of a market trader seen from behind, sitting before bowls of garri, beans and tomatoes, most only half full"
    lede="The World Bank says about 7 million more Nigerians fell below the poverty line in 2025 alone. Poor households spend up to 70% of what they earn on food, so the price of garri and beans decides how they live. In the 2026 lean season, 36 million people were projected to face a food crisis or worse."
  >
    <div class="space-y-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UiStatCard
          value="133 million"
          :label="`Nigerians who were poor across health, schooling and living standards in 2022 (${mpi.value}%)`"
          source="NBS Multidimensional Poverty Index 2022"
          :source-url="mpi.source"
        />
        <UiStatCard
          :value="`${accountability.wentHungry2024}%`"
          label="Adults who went without enough food at least once in the past year (2024)"
          source="Afrobarometer Round 10, calculated by endsars.online"
          source-url="https://www.afrobarometer.org/survey-resource/nigeria-round-10-data-2024/"
        />
        <UiStatCard
          :value="`${latestUnder.value}%`"
          :label="`Nigerians undernourished in ${latestUnder.year}, up from ${poverty.undernourishment[0]!.value}% in ${poverty.undernourishment[0]!.year}`"
          source="FAO via World Bank"
          source-url="https://data.worldbank.org/indicator/SN.ITK.DEFC.ZS?locations=NG"
        />
      </div>

      <UiChart
        :option="povertyOption"
        title="Share of Nigerians below the national poverty line"
        note="Solid bars are household survey years (2019 and 2023). Lighter bars are World Bank projections, revised in April 2026."
        source="World Bank, Nigeria Development Update (April 2026)"
      />

      <UiChart
        :option="hungerOption"
        title="People facing a food crisis in the lean season"
        note="Cadre Harmonisé Phase 3 or worse, June to August projections. Coverage grew from 8 states in 2016 to 28 in 2026, so part of the rise is wider counting."
        source="Cadre Harmonisé via HDX, summed by endsars.online; WFP"
      />
    </div>
  </UiSectionWrapper>
</template>
