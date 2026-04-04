<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
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
  MarkAreaComponentOption,
  MarkPointComponentOption,
} from 'echarts/components'

use([LineChart, GridComponent, TooltipComponent, MarkAreaComponent, MarkPointComponent, CanvasRenderer])

type ChartOption = ComposeOption<
  LineSeriesOption | GridComponentOption | TooltipComponentOption | MarkAreaComponentOption | MarkPointComponentOption
>

const { exchangeRate } = useDatasets()

const quarterlyData = exchangeRate.quarterlyData.data
const currentRate = exchangeRate.recentRates.cbnOfficial.rate

const categories = quarterlyData.map(d => `${d.year} ${d.quarter}`)
const values = quarterlyData.map(d => d.value)

const chartOption = computed<ChartOption>(() => ({
  backgroundColor: 'transparent',
  grid: {
    left: 60,
    right: 30,
    top: 40,
    bottom: 50,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#FFFFFF',
    borderColor: '#008751',
    borderWidth: 1,
    textStyle: { color: '#0A0A0A', fontFamily: 'Space Grotesk' },
    formatter(params: any) {
      const p = Array.isArray(params) ? params[0] : params
      return `<strong>${p.name}</strong><br/>₦${p.value.toLocaleString()} / USD`
    },
  },
  xAxis: {
    type: 'category',
    data: categories,
    axisLabel: {
      color: '#1A1A1A',
      fontFamily: 'Space Grotesk',
      fontSize: 11,
      interval: 7,
      rotate: 0,
      formatter(val: string) {
        return val.split(' ')[0] ?? ''
      },
    },
    axisLine: { lineStyle: { color: '#E0E0E0' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#1A1A1A',
      fontFamily: 'Space Grotesk',
      fontSize: 11,
      formatter(val: number) {
        return `₦${val.toLocaleString()}`
      },
    },
    splitLine: { lineStyle: { color: '#F0F0F0' } },
    axisLine: { show: false },
  },
  series: [
    {
      type: 'line',
      data: values,
      smooth: 0.3,
      symbol: 'none',
      lineStyle: { color: '#0A0A0A', width: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 135, 81, 0.4)' },
            { offset: 1, color: 'rgba(0, 135, 81, 0)' },
          ],
        },
      },
      markArea: {
        silent: true,
        data: [
          // PDP era (Jonathan): 2010 Q1 - 2015 Q2 (index 0 to 21)
          [
            {
              xAxis: '2010 Q1',
              itemStyle: { color: 'rgba(0, 0, 0, 0.03)' },
              label: { show: true, position: 'insideTop', color: '#00000040', fontSize: 10, fontFamily: 'Space Grotesk', formatter: 'PDP — Jonathan' },
            },
            { xAxis: '2015 Q2' },
          ],
          // APC Buhari era: 2015 Q3 - 2023 Q2
          [
            {
              xAxis: '2015 Q3',
              itemStyle: { color: 'rgba(0, 135, 81, 0.05)' },
              label: { show: true, position: 'insideTop', color: '#00875160', fontSize: 10, fontFamily: 'Space Grotesk', formatter: 'APC — Buhari' },
            },
            { xAxis: '2023 Q2' },
          ],
          // APC Tinubu era: 2023 Q3 - end
          [
            {
              xAxis: '2023 Q3',
              itemStyle: { color: 'rgba(0, 135, 81, 0.10)' },
              label: { show: true, position: 'insideTop', color: '#00875190', fontSize: 10, fontFamily: 'Space Grotesk', formatter: 'APC — Tinubu' },
            },
            { xAxis: categories[categories.length - 1] },
          ],
        ],
      } as any,
      markPoint: {
        symbol: 'circle',
        symbolSize: 8,
        label: {
          show: true,
          position: 'top',
          color: '#1A1A1A',
          fontSize: 10,
          fontFamily: 'Space Grotesk',
          distance: 12,
        },
        data: [
          {
            coord: [categories.indexOf('2016 Q3'), values[categories.indexOf('2016 Q3')]],
            name: 'Naira floated',
            value: 'Naira floated',
            itemStyle: { color: '#008751' },
          },
          {
            coord: [categories.indexOf('2023 Q3'), values[categories.indexOf('2023 Q3')]],
            name: 'Second float',
            value: '2nd float',
            itemStyle: { color: '#008751' },
          },
          {
            coord: [categories.indexOf('2024 Q1'), values[categories.indexOf('2024 Q1')]],
            name: 'Feb 2024 crash',
            value: 'Crash',
            itemStyle: { color: '#FF4444' },
          },
        ],
      } as any,
    },
  ],
}))
</script>

<template>
  <UiSectionWrapper
    id="naira"
    title="The Naira's Freefall"
    subtitle="From ₦150 to over ₦1,500 per dollar. The Nigerian naira has lost more than 90% of its value since 2015."
    :section-number="2"
  >
    <!-- Big stat -->
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :visible-once="{ opacity: 1, transition: { duration: 500 } }"
      class="mb-10"
    >
      <UiStatCard
        :value="`₦${currentRate.toLocaleString()} / $1`"
        label="Current CBN official rate (April 2026)"
        source="CBN"
        source-url="https://www.cbn.gov.ng/rates/ExchRateByCurrency.html"
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
