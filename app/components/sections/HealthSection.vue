<script setup lang="ts">
import { timeSeries, pct } from '~/utils/chart'

const { healthEducation: h } = useDatasets()

const mmOption = computed(() => timeSeries({
  x: h.maternalMortality.map(d => d.year),
  series: [{ name: 'Maternal deaths per 100,000 live births', data: h.maternalMortality.map(d => d.ratio) }],
  min: 0,
}))

const spendOption = computed(() => timeSeries({
  x: h.healthSpendShare.map(d => d.year),
  series: [{ name: 'Health, % of government spending', data: h.healthSpendShare.map(d => d.value), type: 'bar' }],
  format: pct,
  min: 0,
  max: 16,
  markLine: { value: h.abujaTarget, label: 'Abuja target: 15%' },
}))

const waecOption = computed(() => timeSeries({
  x: h.waec.map(d => d.year),
  series: [{ name: 'Five credits including English and maths', data: h.waec.map(d => d.value), type: 'bar', labels: true }],
  format: v => `${Math.round(v)}%`,
  min: 0,
  max: 100,
}))

const strikeDays = h.asuuStrikes.reduce((sum, s) => sum + s.days, 0)
const latestLife = h.lifeExpectancy[h.lifeExpectancy.length - 1]!
const latestU5 = h.under5[h.under5.length - 1]!
</script>

<template>
  <UiSectionWrapper
    id="health"
    title="Hospitals and classrooms"
    highlight="Hospitals"
    :subtitle="`Nigeria accounts for about ${h.maternalShareGlobal}% of all maternal deaths in the world.`"
    image="/images/school.webp"
    image-alt="Linocut illustration of an empty rural classroom with wooden benches, a blank chalkboard and a small pair of sandals by the door"
    lede="About 75,000 Nigerian women died from pregnancy or childbirth in 2023, the most of any country. Almost one child in nine dies before turning five, a rate that has barely moved since 2015. Government puts about 4% of its spending into health, against the 15% African leaders promised in Abuja in 2001. In schools, the share of students passing WAEC with five credits including English and maths has fallen three years in a row."
  >
    <div class="space-y-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UiStatCard
          :value="`${latestLife.value.toFixed(1)} years`"
          :label="`Life expectancy at birth in ${latestLife.year}`"
          source="World Bank"
          source-url="https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=NG"
        />
        <UiStatCard
          :value="h.under5Deaths2024.toLocaleString()"
          :label="`Children who died before age five in 2024 (${latestU5.value} per 1,000 births)`"
          source="UN IGME via World Bank"
          source-url="https://data.worldbank.org/indicator/SH.DYN.MORT?locations=NG"
        />
        <UiStatCard
          :value="`${h.outOfSchool.value} million`"
          label="Children out of school, the highest number in the world"
          source="UNICEF, via P.M. News (May 2026)"
          source-url="https://pmnewsnigeria.com/2026/05/03/nigeria-tops-global-list-with-18-3-million-out-of-school-children-unicef/"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <UiChart
          :option="mmOption"
          title="Maternal mortality"
          note="Deaths per 100,000 live births. Modelled UN estimates, 2010 to 2023."
          source="UN MMEIG via World Bank (SH.STA.MMRT)"
          small
        />
        <UiChart
          :option="spendOption"
          title="Health's share of government spending"
          note="Domestic government health spending as a share of all government spending."
          source="WHO Global Health Expenditure Database via World Bank"
          small
        />
      </div>

      <UiCallout source="MSF, July 2025" url="https://www.msf.org/mobilisation-needed-avoid-further-deaths-malnutrition-northern-nigeria">
        In the first half of 2025, {{ h.malnutrition.katsinaDeaths2025H1 }} children died of malnutrition in
        Médecins Sans Frontières facilities in Katsina State alone.
        <template #detail>
          MSF treated more than 300,000 malnourished children across seven northern states in 2024. It blamed part of the
          crisis on aid cuts, particularly from the United States and the United Kingdom.
        </template>
      </UiCallout>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div class="lg:col-span-3">
          <UiChart
            :option="waecOption"
            title="WAEC pass rate"
            :note="`Share of school candidates with five credits including English and maths. The first 2025 release showed ${h.waec2025FirstRelease}%; WAEC withdrew it after a marking error.`"
            source="WAEC results as reported by Vanguard, Channels TV, Guardian and Leadership"
            small
          />
        </div>
        <div class="lg:col-span-2">
          <h3 class="text-lg font-semibold text-black">University strikes</h3>
          <p class="text-sm text-black-text/50 mt-1">
            ASUU has spent {{ strikeDays }} days on strike since 2013, more than two academic years.
          </p>
          <table class="w-full text-sm mt-4">
            <tbody>
              <tr v-for="s in h.asuuStrikes" :key="s.from" class="border-b border-black/5">
                <td class="py-2.5 pr-4 text-black-text/70">{{ s.from }} to {{ s.to }}</td>
                <td class="py-2.5 text-right font-bold text-black tabular-nums">{{ s.days }} days</td>
              </tr>
            </tbody>
          </table>
          <p class="text-xs text-black-text/40 mt-3">
            Earlier strikes in 2010 to 2012 are left out because their end dates are unclear.
            <UiCitation source="NUC; FIJ" url="https://www.nuc.edu.ng/asuu-suspends-eight-months-strike/" />
          </p>
        </div>
      </div>
    </div>
  </UiSectionWrapper>
</template>
