<script setup lang="ts">
import { timeSeries, naira, usd } from '~/utils/chart'

const { exchangeRate, costOfLiving, economy } = useDatasets()

const quarters = exchangeRate.quarterlyData.data
const latest = exchangeRate.recentRates

const rateOption = computed(() => {
  const option = timeSeries({
    x: quarters.map(d => `${d.year} ${d.quarter}`),
    series: [{ name: 'Naira per dollar', data: quarters.map(d => Math.round(d.value)) }],
    format: naira,
  })
  option.xAxis.axisLabel = {
    ...option.xAxis.axisLabel,
    interval: 7,
    formatter: (v: string) => v.slice(0, 4),
  } as any
  return option
})

const wage = costOfLiving.minimumWage
const wageOption = computed(() => timeSeries({
  x: wage.map(d => `${d.year === 2026 ? 'Today' : d.year}: ₦${d.naira.toLocaleString()}`),
  series: [{ name: 'Monthly minimum wage in US dollars', data: wage.map(d => d.usd), type: 'bar', labels: true }],
  format: usd,
  eras: false,
}))

const gdp = economy.gdpPerCapita
const gdpOption = computed(() => timeSeries({
  x: gdp.map(d => d.year),
  series: [{ name: 'GDP per person (USD)', data: gdp.map(d => d.value), type: 'bar' }],
  format: usd,
}))
</script>

<template>
  <UiSectionWrapper
    id="naira"
    title="The naira lost most of its value"
    highlight="naira"
    subtitle="A dollar cost ₦196.50 at the official rate in May 2015. On 17 September 2026 it cost ₦1,330.78."
    image="/images/naira.webp"
    image-alt="Linocut illustration of two hands counting a thick bundle of banknotes beside a small bag of rice on a market table"
    lede="The naira fell in two big steps. The first came in June 2016, when the central bank stopped holding the rate fixed. The second came in June 2023, when the new government merged the official and market rates and the naira lost more than a quarter of its value in five days. It has recovered a little since late 2024, but a dollar still costs almost seven times what it did in 2015."
  >
    <div class="space-y-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UiStatCard value="₦196.50" label="Per dollar, last CBN quote before Buhari took office (May 2015)" source="CBN" source-url="https://www.cbn.gov.ng/rates/ExchRateByCurrency.html" />
        <UiStatCard value="₦461.06" label="Per dollar, last CBN quote before Tinubu took office (May 2023)" source="CBN" source-url="https://www.cbn.gov.ng/rates/ExchRateByCurrency.html" />
        <UiStatCard
          :value="naira(latest.cbnOfficial.rate)"
          :label="`Per dollar on 17 September 2026. Street rate about ${naira(latest.openMarket.rate)}.`"
          source="CBN; Vanguard (street rate)"
          source-url="https://www.vanguardngr.com/2026/09/dollar-to-naira-exchange-rate-today-september-17-2026/"
        />
      </div>

      <UiChart
        :option="rateOption"
        title="Official exchange rate, naira per US dollar"
        note="Quarterly average of the CBN's daily central rate, 2010 to September 2026."
        source="Central Bank of Nigeria. Averages calculated by endsars.online."
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <UiChart
            :option="wageOption"
            title="The minimum wage, in dollars"
            note="Each new minimum wage converted at the CBN rate on the day it was signed."
            source="Channels TV (signing dates); CBN (exchange rates)"
            small
          />
          <p class="text-black-text/70 mt-6 leading-relaxed">
            The ₦18,000 minimum wage of 2011 bought about 277 litres of petrol. Today's ₦70,000 buys about 44 litres
            at the national average price.
            <UiCitation source="NBS Petrol Price Watch, May 2026" url="https://www.premiumtimesng.com/business/business-news/890568-nigerias-petrol-price-climbs-to-%E2%82%A61596-per-litre-in-may-nbs.html" />
          </p>
        </div>
        <UiChart
          :option="gdpOption"
          title="Income per person, in dollars"
          note="GDP per person at current prices. It fell from $4,363 in 2014 to $1,084 in 2024."
          source="IMF World Economic Outlook (consistent with the 2025 GDP rebasing)"
          small
        />
      </div>
    </div>
  </UiSectionWrapper>
</template>
