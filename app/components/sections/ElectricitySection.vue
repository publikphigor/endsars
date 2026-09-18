<script setup lang="ts">
import { timeSeries, rankedBars, pct } from '~/utils/chart'

const { electricity } = useDatasets()

const access = electricity.access
const accessOption = computed(() => timeSeries({
  x: access.map(d => d.year),
  series: [{ name: 'Share of people with electricity', data: access.map(d => d.value) }],
  format: pct,
  min: 0,
  max: 100,
}))

const use = electricity.perCapita2023
const useOption = computed(() => rankedBars(
  use.map(d => d.country),
  use.map(d => d.kwh),
  v => `${Math.round(v).toLocaleString()} kWh`,
  'Nigeria',
))
</script>

<template>
  <UiSectionWrapper
    id="grid"
    title="The lights are still off"
    :subtitle="`About ${electricity.withoutPower2024.nigeria_m} million Nigerians had no electricity in 2024, more than in any other country.`"
    image="/images/power.webp"
    image-alt="Linocut illustration of dark apartment blocks at night, with a single petrol generator smoking on the street and a cable running into the building"
    lede="Access has crept up, from 48% of people in 2010 to 62.5% in 2024. The people who are connected get very little. The average Nigerian used 144 kilowatt-hours of electricity in 2023, less than in 2015. The average Ghanaian used almost four times as much. Homes and businesses that can afford it run generators, which is why the price of diesel and petrol reaches into everything."
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <UiChart
        :option="accessOption"
        title="Access to electricity"
        note="Share of the population with an electricity connection. Survey-based, so it moves unevenly from year to year."
        source="World Bank (EG.ELC.ACCS.ZS), Tracking SDG7"
        small
      />
      <UiChart
        :option="useOption"
        title="Electricity used per person, 2023"
        note="Kilowatt-hours per person per year."
        source="World Bank (EG.USE.ELEC.KH.PC), IEA data"
        small
      />
    </div>
    <p class="text-xs text-black-text/40 mt-8 max-w-3xl">
      People without electricity are calculated by endsars.online from World Bank access rates and population
      figures. By the same method, the Democratic Republic of Congo had {{ electricity.withoutPower2024.drc_m }} million.
    </p>
  </UiSectionWrapper>
</template>
