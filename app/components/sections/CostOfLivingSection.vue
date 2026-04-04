<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkPointComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { ComposeOption } from 'echarts/core'
import type { LineSeriesOption } from 'echarts/charts'
import type {
  GridComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  MarkAreaComponentOption,
  MarkPointComponentOption,
} from 'echarts/components'

use([LineChart, GridComponent, TooltipComponent, LegendComponent, MarkAreaComponent, MarkPointComponent, CanvasRenderer])

type ChartOption = ComposeOption<
  LineSeriesOption | GridComponentOption | TooltipComponentOption | LegendComponentOption | MarkAreaComponentOption | MarkPointComponentOption
>

const { inflation, fuelPrice } = useDatasets()

// Inflation annual data
const inflationData = inflation.data
const inflationYears = inflationData.map(d => d.year.toString())
const inflationValues = inflationData.map(d => d.value)

// Fuel price: extract one price per year (last entry for each year)
const fuelByYear = new Map<number, number>()
for (const entry of fuelPrice.data) {
  fuelByYear.set(entry.year, entry.price)
}

// Align fuel data to inflation years, fill gaps with previous value
const fuelValues: (number | null)[] = []
let lastFuelPrice = 0
for (const yearStr of inflationYears) {
  const year = parseInt(yearStr)
  if (fuelByYear.has(year)) {
    lastFuelPrice = fuelByYear.get(year)!
    fuelValues.push(lastFuelPrice)
  } else if (lastFuelPrice > 0) {
    fuelValues.push(lastFuelPrice)
  } else {
    fuelValues.push(null)
  }
}

const chartOption = computed<ChartOption>(() => ({
  backgroundColor: 'transparent',
  grid: {
    left: 55,
    right: 70,
    top: 50,
    bottom: 50,
  },
  legend: {
    top: 5,
    textStyle: { color: '#1A1A1A', fontFamily: 'Space Grotesk', fontSize: 12 },
    data: [
      { name: 'Inflation %', icon: 'roundRect' },
      { name: 'Fuel Price (₦/L)', icon: 'roundRect' },
    ],
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#FFFFFF',
    borderColor: '#008751',
    borderWidth: 1,
    textStyle: { color: '#0A0A0A', fontFamily: 'Space Grotesk' },
    formatter(params: any) {
      const items = Array.isArray(params) ? params : [params]
      let html = `<strong>${items[0].name}</strong>`
      for (const item of items) {
        if (item.value != null) {
          const color = item.seriesIndex === 0 ? '#0A0A0A' : '#008751'
          html += `<br/><span style="color:${color}">${item.seriesName}: ${item.seriesIndex === 0 ? item.value.toFixed(1) + '%' : '₦' + item.value.toLocaleString()}</span>`
        }
      }
      return html
    },
  },
  xAxis: {
    type: 'category',
    data: inflationYears,
    axisLabel: {
      color: '#1A1A1A',
      fontFamily: 'Space Grotesk',
      fontSize: 11,
    },
    axisLine: { lineStyle: { color: '#E0E0E0' } },
    axisTick: { show: false },
  },
  yAxis: [
    {
      type: 'value',
      name: 'Inflation %',
      nameTextStyle: { color: '#1A1A1A80', fontFamily: 'Space Grotesk', fontSize: 11 },
      axisLabel: {
        color: '#1A1A1A',
        fontFamily: 'Space Grotesk',
        fontSize: 11,
        formatter: '{value}%',
      },
      splitLine: { lineStyle: { color: '#F0F0F0' } },
      axisLine: { show: false },
    },
    {
      type: 'value',
      name: '₦/Litre',
      nameTextStyle: { color: '#00875180', fontFamily: 'Space Grotesk', fontSize: 11 },
      position: 'right',
      axisLabel: {
        color: '#008751',
        fontFamily: 'Space Grotesk',
        fontSize: 11,
        formatter(val: number) {
          return `₦${val.toLocaleString()}`
        },
      },
      splitLine: { show: false },
      axisLine: { show: false },
    },
  ],
  series: [
    {
      name: 'Inflation %',
      type: 'line',
      data: inflationValues,
      smooth: 0.3,
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { color: '#0A0A0A', width: 2 },
      itemStyle: { color: '#0A0A0A' },
      yAxisIndex: 0,
      markArea: {
        silent: true,
        data: [
          // PDP era
          [
            {
              xAxis: '2010',
              itemStyle: { color: 'rgba(0, 0, 0, 0.03)' },
              label: { show: true, position: 'insideTop', color: '#00000040', fontSize: 10, fontFamily: 'Space Grotesk', formatter: 'PDP — Jonathan' },
            },
            { xAxis: '2014' },
          ],
          // APC Buhari
          [
            {
              xAxis: '2015',
              itemStyle: { color: 'rgba(0, 135, 81, 0.05)' },
              label: { show: true, position: 'insideTop', color: '#00875160', fontSize: 10, fontFamily: 'Space Grotesk', formatter: 'APC — Buhari' },
            },
            { xAxis: '2022' },
          ],
          // APC Tinubu
          [
            {
              xAxis: '2023',
              itemStyle: { color: 'rgba(0, 135, 81, 0.10)' },
              label: { show: true, position: 'insideTop', color: '#00875190', fontSize: 10, fontFamily: 'Space Grotesk', formatter: 'APC — Tinubu' },
            },
            { xAxis: '2026' },
          ],
        ],
      } as any,
    },
    {
      name: 'Fuel Price (₦/L)',
      type: 'line',
      data: fuelValues,
      step: 'end',
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { color: '#008751', width: 2 },
      itemStyle: { color: '#008751' },
      yAxisIndex: 1,
      markPoint: {
        symbol: 'pin',
        symbolSize: 40,
        label: {
          show: true,
          color: '#FFFFFF',
          fontSize: 9,
          fontFamily: 'Space Grotesk',
          formatter: '!',
        },
        data: [
          {
            coord: [inflationYears.indexOf('2023'), fuelByYear.get(2023) || 537],
            name: 'Subsidy removed',
            value: 'Subsidy is gone',
            itemStyle: { color: '#008751' },
            label: {
              show: true,
              position: 'top',
              color: '#008751',
              fontSize: 10,
              fontFamily: 'Space Grotesk',
              formatter: '"Subsidy is gone"',
              distance: 15,
            },
          },
        ],
      } as any,
    },
  ],
}))
</script>

<template>
  <UiSectionWrapper
    id="cost-of-living"
    title="The Cost of Survival"
    subtitle="Inflation has spiralled while fuel prices have increased twentyfold. Nigerians pay more for everything."
    :section-number="3"
  >
    <!-- Big stat -->
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :visible-once="{ opacity: 1, transition: { duration: 500 } }"
      class="mb-10"
    >
      <UiStatCard
        value="₦65 → ₦1,330 per litre"
        label="Petrol price — 2010 vs March 2026"
        source="NBS / NNPC"
        source-url="https://nigerianstat.gov.ng"
      />
    </div>

    <!-- Chart -->
    <div>
      <ClientOnly>
        <VChart :option="chartOption" autoresize class="chart-container" />
        <template #fallback>
          <div class="chart-container animate-pulse bg-white-soft" />
        </template>
      </ClientOnly>
    </div>
  </UiSectionWrapper>
</template>
