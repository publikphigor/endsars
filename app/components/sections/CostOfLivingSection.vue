<script setup lang="ts">
import { timeSeries, naira, pct } from '~/utils/chart'

const { fuelPrice, inflation, costOfLiving } = useDatasets()

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const short = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(2, 4)}`

const label = (d: { year: number, month?: string }) => (d.month ? `${d.month.slice(0, 3)} ${d.year}` : String(d.year))
const petrol = fuelPrice.data
const pump = fuelPrice.pumpLagos.data
const petrolX = [...new Set([...petrol.map(label), ...pump.map(label)])]
  .sort((a, b) => {
    const key = (l: string) => {
      const [m, y] = l.includes(' ') ? l.split(' ') : ['Jan', l]
      return Number(y) * 12 + MONTHS.indexOf(m!)
    }
    return key(a) - key(b)
  })
const petrolOption = computed(() => timeSeries({
  x: petrolX,
  series: [
    { name: 'Official price to 2020, then NBS national average', data: petrolX.map(x => Math.round(petrol.find(d => label(d) === x)?.price ?? 0) || null), color: '#008751' },
    { name: 'NNPC pump price, Lagos', data: petrolX.map(x => pump.find(d => label(d) === x)?.price ?? null), color: '#0A0A0A' },
  ],
  format: naira,
}))

const annual = inflation.data
const annualOption = computed(() => timeSeries({
  x: annual.map(d => d.year),
  series: [{ name: 'Inflation', data: annual.map(d => d.value), type: 'bar' }],
  format: pct,
}))

const monthly = inflation.monthly.data
const monthlyOption = computed(() => timeSeries({
  x: monthly.map(d => short(d.month)),
  series: [
    { name: 'Headline', data: monthly.map(d => d.headline), color: '#0A0A0A' },
    { name: 'Food', data: monthly.map(d => d.food ?? null), color: '#008751' },
  ],
  format: pct,
  eras: false,
}))

const times = (a: number, b: number) => `${(b / a).toFixed(1)}×`
const jollof = costOfLiving.jollofIndex
const latestJollof = jollof.newBasis[jollof.newBasis.length - 1]!
</script>

<template>
  <UiSectionWrapper
    id="cost-of-living"
    title="The price of getting by"
    subtitle="Petrol cost ₦65 a litre in 2010. On 12 September 2026, NNPC stations in Lagos raised it to ₦1,375."
    image="/images/fuel.webp"
    image-alt="Linocut illustration of a long queue of cars and motorcycle taxis stretching away from a single petrol pump"
    lede="When President Tinubu said &quot;subsidy is gone&quot; on 29 May 2023, the petrol price was left to the market. By October 2023 the national average was ₦631 a litre, three times the December 2022 figure. Transport, food and rent followed. Inflation reached 34.8% in December 2024, then the statistics office changed how it measures prices. On the new measure, food inflation fell to 9% in January 2026 and climbed back to almost 20% by August."
  >
    <div class="space-y-16">
      <UiCallout source="Vanguard, 12 September 2026" :url="fuelPrice.latestPump.source">
        Between 21 August and 12 September 2026, Dangote Refinery raised its gantry price four times, from ₦1,165
        to {{ naira(fuelPrice.latestPump.dangoteGantry) }} a litre.
        <template #detail>
          Pump prices followed within days. NNPC stations in Lagos went to {{ naira(fuelPrice.latestPump.nnpcLagos) }},
          and some stations in Abuja passed ₦1,400.
        </template>
      </UiCallout>

      <UiChart
        :option="petrolOption"
        title="Petrol pump price"
        note="The NBS national average covers every state and runs above Lagos prices. Its latest figure is for May 2026 (₦1,596), so the black line carries NNPC's Lagos price to September."
        source="NBS Petrol Price Watch; NNPC prices reported by Vanguard"
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <UiChart
          :option="annualOption"
          title="Inflation by year, 2010 to 2024"
          note="Annual change in consumer prices. December 2024 alone hit 34.8%."
          source="World Bank (FP.CPI.TOTL.ZG); NBS"
          small
        />
        <UiChart
          :option="monthlyOption"
          title="Inflation by month since the 2025 rebasing"
          note="Year-on-year change on the new NBS measure. Food data is missing for some 2025 months."
          source="NBS CPI reports via Nairametrics, Premium Times and Tekedia (revised 2025 series)"
          small
        />
      </div>
      <p class="text-sm text-black-text/60 max-w-3xl -mt-8">
        {{ inflation.methodologyNote }}
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 class="text-lg font-semibold text-black">Cooking and generator fuel</h3>
          <p class="text-sm text-black-text/50 mt-1">National average prices, NBS</p>
          <table class="w-full text-sm mt-4">
            <thead>
              <tr class="border-b border-black/20 text-left text-black-text/50">
                <th class="py-2 pr-4 font-medium">Product</th>
                <th class="py-2 pr-4 font-medium">May 2023</th>
                <th class="py-2 pr-4 font-medium">Latest</th>
                <th class="py-2 font-medium text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in fuelPrice.otherFuels" :key="f.product" class="border-b border-black/5">
                <td class="py-3 pr-4 text-black">
                  {{ f.product }}
                  <UiCitation source="NBS Price Watch" :url="f.source" />
                </td>
                <td class="py-3 pr-4 text-black-text/70 tabular-nums">{{ naira(Math.round(f.before)) }}</td>
                <td class="py-3 pr-4 text-black tabular-nums">
                  {{ naira(Math.round(f.latest)) }}
                  <span class="block text-xs text-black-text/40">{{ f.latestDate }}</span>
                </td>
                <td class="py-3 text-right font-bold text-green tabular-nums">{{ times(f.before, f.latest) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-black">Food at the market</h3>
          <p class="text-sm text-black-text/50 mt-1">National average prices, NBS Selected Food Prices Watch</p>
          <table class="w-full text-sm mt-4">
            <thead>
              <tr class="border-b border-black/20 text-left text-black-text/50">
                <th class="py-2 pr-4 font-medium">Item</th>
                <th class="py-2 pr-4 font-medium">May 2023</th>
                <th class="py-2 pr-4 font-medium">Latest</th>
                <th class="py-2 font-medium text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in costOfLiving.foodPrices" :key="f.item" class="border-b border-black/5">
                <td class="py-3 pr-4 text-black">{{ f.item }}</td>
                <td class="py-3 pr-4 text-black-text/70 tabular-nums">{{ naira(Math.round(f.may2023)) }}</td>
                <td class="py-3 pr-4 text-black tabular-nums">
                  {{ naira(Math.round(f.latest)) }}
                  <span class="block text-xs text-black-text/40">{{ f.latestDate }}</span>
                </td>
                <td class="py-3 text-right font-bold text-green tabular-nums">{{ times(f.may2023, f.latest) }}</td>
              </tr>
            </tbody>
          </table>
          <p class="text-xs text-black-text/40 mt-3">
            We could not find an NBS price for 1kg of rice or a loaf of bread after October 2024.
          </p>
        </div>
      </div>

      <UiCallout source="SBM Intelligence, Jollof Index Q2 2026" url="https://sbmintelligence.substack.com/p/the-sbm-jollof-index-q2-2026-rebasing">
        A pot of jollof rice for a family of five cost {{ naira(jollof.firstReading.value) }} in July 2016.
        In June 2026 it cost {{ naira(latestJollof.value) }}.
        <template #detail>
          SBM Intelligence has priced the same family meal across Nigerian cities since 2016. It hit a record
          ₦30,435 in March 2026. SBM changed its ingredient basket in 2025, so readings before and after are not
          strictly comparable.
        </template>
      </UiCallout>
    </div>
  </UiSectionWrapper>
</template>
