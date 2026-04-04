<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([LineChart, GridComponent, TooltipComponent, LegendComponent, MarkLineComponent, CanvasRenderer])

const { corruption } = useDatasets()

const cpiData = corruption.cpiData.data
const wgiData = corruption.wgiData.data

// Latest CPI entry
const latestCPI = cpiData[cpiData.length - 1]!

// Average WGI value
const avgWGI = (wgiData.reduce((sum, d) => sum + d.value, 0) / wgiData.length).toFixed(2)

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis' as const,
    backgroundColor: '#FFFFFF',
    borderColor: '#008751',
    borderWidth: 1,
    textStyle: { color: '#0A0A0A', fontFamily: 'Space Grotesk' },
    formatter(params: any) {
      const items = Array.isArray(params) ? params : [params]
      const year = items[0].name
      const entry = cpiData.find((d) => String(d.year) === year)
      let html = `<strong>${year}</strong><br/>`
      items.forEach((item: any) => {
        if (item.value !== undefined && item.value !== null) {
          html += `<span style="color:${item.color}">●</span> ${item.seriesName}: <strong>${item.value}</strong><br/>`
        }
      })
      if (entry) {
        html += `<span style="color:#0A0A0A66">Rank: ${entry.rank} of ${entry.totalCountries}</span>`
      }
      return html
    },
  },
  legend: {
    data: ['Nigeria CPI', 'Global Average', 'Sub-Saharan Africa Average'],
    textStyle: { color: '#1A1A1A', fontFamily: 'Space Grotesk', fontSize: 11 },
    top: 0,
    itemGap: 16,
  },
  grid: {
    left: 48,
    right: 24,
    top: 44,
    bottom: 40,
  },
  xAxis: {
    type: 'category' as const,
    data: cpiData.map((d) => String(d.year)),
    axisLine: { lineStyle: { color: '#E0E0E0' } },
    axisLabel: { color: '#1A1A1A', fontFamily: 'Space Grotesk' },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value' as const,
    min: 0,
    max: 60,
    axisLine: { show: false },
    axisLabel: { color: '#1A1A1A', fontFamily: 'Space Grotesk' },
    splitLine: { lineStyle: { color: '#F0F0F0' } },
  },
  series: [
    {
      name: 'Nigeria CPI',
      type: 'line',
      data: cpiData.map((d) => d.score),
      lineStyle: { color: '#008751', width: 3 },
      itemStyle: { color: '#008751' },
      symbol: 'circle',
      symbolSize: 6,
      emphasis: { itemStyle: { borderColor: '#0A0A0A', borderWidth: 2 } },
    },
    {
      name: 'Global Average',
      type: 'line',
      data: cpiData.map(() => 43),
      lineStyle: { color: '#0A0A0A', width: 1, type: 'dashed' as const },
      itemStyle: { color: '#0A0A0A' },
      symbol: 'none',
    },
    {
      name: 'Sub-Saharan Africa Average',
      type: 'line',
      data: cpiData.map(() => 33),
      lineStyle: { color: '#1A1A1A66', width: 1, type: 'dotted' as const },
      itemStyle: { color: '#1A1A1A66' },
      symbol: 'none',
    },
  ],
}))
</script>

<template>
  <UiSectionWrapper
    id="corruption"
    title="The Stagnation of Integrity"
    subtitle="Nigeria's corruption score has barely moved in 15 years."
    :section-number="7"
  >
    <div class="space-y-12">
      <!-- Hero stats -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :visible-once="{ opacity: 1, transition: { duration: 500 } }"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div class="text-center md:text-left">
          <p class="text-sm text-green font-semibold tracking-widest uppercase mb-2">
            CPI Rank ({{ latestCPI.year }})
          </p>
          <span class="text-4xl md:text-6xl font-bold tabular-nums text-black">
            {{ latestCPI.rank }}<span class="text-xl md:text-2xl text-black-text/50">th</span>
          </span>
          <p class="text-lg text-black-text/60 mt-1">of {{ latestCPI.totalCountries }} countries</p>
          <p class="text-xs text-black-text/40 mt-1">
            <UiCitation
              source="Transparency International CPI 2025"
              url="https://www.transparency.org/en/cpi/2025"
              :number="1"
            />
          </p>
        </div>
        <div class="text-center md:text-left">
          <p class="text-sm text-green font-semibold tracking-widest uppercase mb-2">
            WGI Control of Corruption
          </p>
          <span class="text-4xl md:text-6xl font-bold tabular-nums text-black">
            {{ avgWGI }}
          </span>
          <p class="text-lg text-black-text/60 mt-1">Average score (scale: -2.5 to 2.5)</p>
          <p class="text-xs text-black-text/40 mt-1">
            Consistently negative since 2010
            <UiCitation
              source="World Bank WGI"
              url="https://info.worldbank.org/governance/wgi"
              :number="2"
            />
          </p>
        </div>
      </div>

      <!-- CPI line chart -->
      <div>
        <h3 class="text-lg font-semibold text-black mb-4">
          Corruption Perceptions Index (2010 - {{ latestCPI.year }})
        </h3>
        <ClientOnly>
          <VChart :option="chartOption" autoresize class="chart-container" />
          <template #fallback>
            <div class="chart-container animate-pulse bg-white-medium" />
          </template>
        </ClientOnly>
        <p class="text-xs text-black-text/40 mt-2">
          Score 0-100 (higher = less corrupt). Dashed line: global average (43). Dotted line: Sub-Saharan Africa average (33).
        </p>
      </div>

      <!-- Annotation callout -->
      <div
        class="border-l-4 border-green bg-white-soft px-6 py-5"
      >
        <p class="text-xl md:text-2xl font-bold text-black leading-snug">
          Nigeria scores below the Sub-Saharan African average
        </p>
        <p class="text-sm text-black-text/50 mt-2">
          {{ corruption.cpiData.context }}
        </p>
      </div>

      <!-- CPI score table -->
      <div
        class="overflow-x-auto"
      >
        <h3 class="text-lg font-semibold text-black mb-4">CPI Score History</h3>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-black/20">
              <th class="text-left text-black-text/50 py-2 pr-4 font-medium">Year</th>
              <th class="text-left text-black-text/50 py-2 pr-4 font-medium">Score</th>
              <th class="text-left text-black-text/50 py-2 pr-4 font-medium">Rank</th>
              <th class="text-left text-black-text/50 py-2 font-medium hidden md:table-cell">Countries</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in cpiData"
              :key="entry.year"
              class="border-b border-black/5"
            >
              <td class="py-2 pr-4 text-black font-medium">{{ entry.year }}</td>
              <td class="py-2 pr-4 text-green font-bold">{{ entry.score }}</td>
              <td class="py-2 pr-4 text-black-text/70">{{ entry.rank }}</td>
              <td class="py-2 text-black-text/50 hidden md:table-cell">{{ entry.totalCountries }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </UiSectionWrapper>
</template>
