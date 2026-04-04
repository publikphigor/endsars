<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  MarkAreaComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { ComposeOption } from 'echarts/core'
import type { LineSeriesOption, BarSeriesOption } from 'echarts/charts'
import type {
  GridComponentOption,
  TooltipComponentOption,
  MarkAreaComponentOption,
} from 'echarts/components'

use([LineChart, BarChart, GridComponent, TooltipComponent, MarkAreaComponent, CanvasRenderer])

type ChartOption = ComposeOption<
  LineSeriesOption | BarSeriesOption | GridComponentOption | TooltipComponentOption | MarkAreaComponentOption
>

const { governmentDebt, budget } = useDatasets()

// External debt chart data
const debtData = governmentDebt.externalDebt.data
const debtYears = debtData.map(d => d.year.toString())
const debtValues = debtData.map(d => +(d.valueUSD / 1e9).toFixed(1))

// Budget chart data
const budgetData = budget.data.filter(d => d.year >= 2010)
const budgetYears = budgetData.map(d => d.year.toString())
const budgetValues = budgetData.map(d => d.total_appropriation_trn)

// Admin era bands helper
function makeAdminBands(years: string[]) {
  const firstYear = parseInt(years[0]!)
  const lastYear = parseInt(years[years.length - 1]!)

  const bands: any[][] = []

  // PDP era
  if (firstYear <= 2014) {
    bands.push([
      {
        xAxis: Math.max(firstYear, 2010).toString(),
        itemStyle: { color: 'rgba(0, 0, 0, 0.03)' },
        label: { show: true, position: 'insideTop', color: '#00000040', fontSize: 10, fontFamily: 'Space Grotesk', formatter: 'PDP — Jonathan' },
      },
      { xAxis: Math.min(2014, lastYear).toString() },
    ])
  }

  // APC Buhari
  if (firstYear <= 2022 && lastYear >= 2015) {
    bands.push([
      {
        xAxis: Math.max(2015, firstYear).toString(),
        itemStyle: { color: 'rgba(0, 135, 81, 0.05)' },
        label: { show: true, position: 'insideTop', color: '#00875160', fontSize: 10, fontFamily: 'Space Grotesk', formatter: 'APC — Buhari' },
      },
      { xAxis: Math.min(2022, lastYear).toString() },
    ])
  }

  // APC Tinubu
  if (lastYear >= 2023) {
    bands.push([
      {
        xAxis: Math.max(2023, firstYear).toString(),
        itemStyle: { color: 'rgba(0, 135, 81, 0.10)' },
        label: { show: true, position: 'insideTop', color: '#00875190', fontSize: 10, fontFamily: 'Space Grotesk', formatter: 'APC — Tinubu' },
      },
      { xAxis: lastYear.toString() },
    ])
  }

  return bands
}

const debtChartOption = computed<ChartOption>(() => ({
  backgroundColor: 'transparent',
  grid: {
    left: 55,
    right: 20,
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
      return `<strong>${p.name}</strong><br/>$${p.value}B`
    },
  },
  xAxis: {
    type: 'category',
    data: debtYears,
    axisLabel: {
      color: '#1A1A1A',
      fontFamily: 'Space Grotesk',
      fontSize: 11,
      interval: 1,
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
      formatter: '${value}B',
    },
    splitLine: { lineStyle: { color: '#F0F0F0' } },
    axisLine: { show: false },
  },
  series: [
    {
      type: 'line',
      data: debtValues,
      smooth: 0.3,
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { color: '#0A0A0A', width: 2 },
      itemStyle: { color: '#0A0A0A' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 135, 81, 0.3)' },
            { offset: 1, color: 'rgba(0, 135, 81, 0)' },
          ],
        },
      },
      markArea: {
        silent: true,
        data: makeAdminBands(debtYears),
      } as any,
    },
  ],
}))

const budgetChartOption = computed<ChartOption>(() => ({
  backgroundColor: 'transparent',
  grid: {
    left: 55,
    right: 20,
    top: 30,
    bottom: 60,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#FFFFFF',
    borderColor: '#008751',
    borderWidth: 1,
    textStyle: { color: '#0A0A0A', fontFamily: 'Space Grotesk' },
    formatter(params: any) {
      const p = Array.isArray(params) ? params[0] : params
      return `<strong>${p.name}</strong><br/>₦${p.value}T`
    },
  },
  xAxis: {
    type: 'category',
    data: budgetYears,
    axisLabel: {
      color: '#1A1A1A',
      fontFamily: 'Space Grotesk',
      fontSize: 10,
      interval: 1,
      rotate: 45,
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
      formatter: '₦{value}T',
    },
    splitLine: { lineStyle: { color: '#F0F0F0' } },
    axisLine: { show: false },
  },
  series: [
    {
      type: 'bar',
      data: budgetValues.map((val, i) => ({
        value: val,
        itemStyle: {
          color: parseInt(budgetYears[i]!) >= 2023 ? '#008751' : parseInt(budgetYears[i]!) >= 2015 ? '#00875180' : '#1A1A1A40',
        },
      })),
      barWidth: '50%',
      markArea: {
        silent: true,
        data: makeAdminBands(budgetYears),
      } as any,
    },
  ],
}))

const latestDebtBn = debtValues[debtValues.length - 1]
const latestBudgetTrn = budgetValues[budgetValues.length - 1]
</script>

<template>
  <UiSectionWrapper
    id="debt"
    title="Borrowing Into Oblivion"
    subtitle="Nigeria's debt has nearly quadrupled under APC while the budget has ballooned fifteenfold."
    :section-number="4"
  >
    <!-- Big stats row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <UiStatCard
        :value="`$${latestDebtBn}B`"
        label="External debt stock (2024)"
        source="World Bank"
        source-url="https://data.worldbank.org/indicator/DT.DOD.DECT.CD?locations=NG"
      />
      <UiStatCard
        :value="`₦${latestBudgetTrn}T`"
        label="2026 budget appropriation"
        source="Budget Office"
        source-url="https://budgetoffice.gov.ng"
      />
    </div>

    <!-- Narrative callout -->
    <div class="bg-white-soft border-l-2 border-green px-6 py-4 mb-10">
      <p class="text-black-text/80 text-base">
        The budget grew <strong class="text-black">15x</strong> from ₦4.6T (2010) to ₦68.3T (2026)
        while poverty doubled. More spending has not meant more development — it has meant more debt.
      </p>
    </div>

    <!-- Charts side by side -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 class="text-lg font-semibold text-black mb-4">External Debt (USD)</h3>
        <ClientOnly>
          <VChart :option="debtChartOption" autoresize class="chart-container-sm" />
          <template #fallback>
            <div class="chart-container-sm bg-white-soft" />
          </template>
        </ClientOnly>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-black mb-4">Budget Appropriation (NGN)</h3>
        <ClientOnly>
          <VChart :option="budgetChartOption" autoresize class="chart-container-sm" />
          <template #fallback>
            <div class="chart-container-sm bg-white-soft" />
          </template>
        </ClientOnly>
      </div>
    </div>
  </UiSectionWrapper>
</template>
