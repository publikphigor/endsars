<script setup lang="ts">
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const { poverty, budget } = useDatasets()

const mpi = poverty.multidimensionalPoverty
const nationalData = poverty.nationalPovertyLine.data

// Budget growth figures
const budgetData = budget.data
const budgetFirst = budgetData[0]!
const budgetLast = budgetData[budgetData.length - 1]!
const budgetGrowthLabel = `Budget grew from ₦${budgetFirst.total_appropriation_trn}T to ₦${budgetLast.total_appropriation_trn}T while poverty doubled`

const heroStatRef = ref<HTMLElement | null>(null)

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis' as const,
    backgroundColor: '#FFFFFF',
    borderColor: '#008751',
    borderWidth: 1,
    textStyle: { color: '#0A0A0A', fontFamily: 'Space Grotesk' },
    formatter(params: any) {
      const p = Array.isArray(params) ? params[0] : params
      const entry = nationalData.find((d) => d.year === p.name)
      const note = entry?.note ? `<br/><span style="color:#0A0A0A99;font-size:11px">${entry.note}</span>` : ''
      return `<strong>${p.name}</strong><br/>Poverty rate: <span style="color:#008751;font-weight:bold">${p.value}%</span>${note}`
    },
  },
  grid: {
    left: 48,
    right: 24,
    top: 24,
    bottom: 40,
  },
  xAxis: {
    type: 'category' as const,
    data: nationalData.map((d) => d.year),
    axisLine: { lineStyle: { color: '#E0E0E0' } },
    axisLabel: { color: '#1A1A1A', fontFamily: 'Space Grotesk' },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value' as const,
    min: 0,
    max: 80,
    axisLine: { show: false },
    axisLabel: { color: '#1A1A1A', fontFamily: 'Space Grotesk', formatter: '{value}%' },
    splitLine: { lineStyle: { color: '#F0F0F0' } },
  },
  series: [
    {
      type: 'bar',
      data: nationalData.map((d) => ({
        value: d.value,
        itemStyle: {
          color: d.year <= 2023 ? '#008751' : '#006B40',
          borderRadius: [2, 2, 0, 0],
        },
      })),
      barWidth: '50%',
      label: {
        show: true,
        position: 'top' as const,
        color: '#1A1A1A',
        fontFamily: 'Space Grotesk',
        fontWeight: 'bold' as const,
        formatter: '{c}%',
      },
    },
  ],
}))
</script>

<template>
  <UiSectionWrapper
    id="poverty"
    title="A Nation Impoverished"
    subtitle="Poverty has deepened across every measure while government spending has exploded."
    :section-number="5"
  >
    <div class="space-y-12">
      <!-- Hero stat -->
      <div
        ref="heroStatRef"
        v-motion
        :initial="{ opacity: 0 }"
        :visible-once="{ opacity: 1, transition: { duration: 500 } }"
        class="text-center"
      >
        <p class="text-sm text-green font-semibold tracking-widest uppercase mb-2">
          Multidimensional Poverty (2022)
        </p>
        <UiCountUp :value="133" suffix=" million" :duration="2500" />
        <p class="text-lg text-black-text/60 mt-2">Nigerians are multidimensionally poor</p>
        <p class="text-xs text-black-text/40 mt-1">
          {{ mpi.description }}
          <UiCitation
            source="NBS Multidimensional Poverty Index (2022)"
            :url="mpi.source"
            :number="1"
          />
        </p>
      </div>

      <!-- Stat cards row -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <UiStatCard
          value="40%"
          label="National poverty rate (2019)"
          source="World Bank"
          source-url="https://data.worldbank.org/indicator/SI.POV.DDAY?locations=NG"
        />
        <UiStatCard
          value="56%"
          label="National poverty rate (2023)"
          source="World Bank Poverty Brief"
          source-url="https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099253204222517873"
        />
        <UiStatCard
          value="62%"
          label="Projected poverty rate (2026)"
          source="World Bank projection"
          source-url="https://financeinafrica.com/insights/nigeria-poverty-rate-falling-to-61-in-2027/"
        />
      </div>

      <!-- Bar chart: National poverty line trajectory -->
      <div>
        <h3 class="text-lg font-semibold text-black mb-4">
          National Poverty Line — % of Population
        </h3>
        <ClientOnly>
          <VChart :option="chartOption" autoresize class="chart-container" />
          <template #fallback>
            <div class="chart-container animate-pulse bg-white-medium" />
          </template>
        </ClientOnly>
        <p class="text-xs text-black-text/40 mt-2">
          Source: World Bank estimates and projections. 2025-2027 are forward projections.
        </p>
      </div>

      <!-- Key insight callout -->
      <div
        class="border-l-4 border-green bg-white-soft px-6 py-5"
      >
        <p class="text-xl md:text-2xl font-bold text-black leading-snug">
          "{{ poverty.keyInsight }}"
        </p>
        <p class="text-sm text-black-text/50 mt-2">
          <UiCitation
            source="World Bank"
            url="https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099253204222517873"
            :number="2"
          />
        </p>
      </div>

      <!-- Budget contrast -->
      <div
        class="bg-white-soft border border-black/10 px-6 py-5"
      >
        <p class="text-sm text-green font-semibold tracking-widest uppercase mb-2">
          The Paradox
        </p>
        <p class="text-xl md:text-2xl font-bold text-black">
          {{ budgetGrowthLabel }}
        </p>
        <p class="text-sm text-black-text/50 mt-2">
          Federal budget appropriation (nominal, not inflation-adjusted).
          <UiCitation
            source="Budget Office of the Federation"
            url="https://budgetoffice.gov.ng"
            :number="3"
          />
        </p>
      </div>
    </div>
  </UiSectionWrapper>
</template>
