import * as echarts from 'echarts'
import type { AdministrationBand } from '~/composables/useAdministration'
import {
  GREEN,
  GREEN_LIGHT,
  BLACK,
  BLACK_SOFT,
  BLACK_TEXT,
  WHITE,
  WHITE_SOFT,
  PARTY_PDP,
  PARTY_APC,
} from './colors'

/**
 * Register the custom 'endsars' ECharts theme — LIGHT MODE.
 * Call once at app startup (e.g. in a plugin or app.vue).
 */
export function registerTheme(): void {
  echarts.registerTheme('endsars', {
    backgroundColor: WHITE,
    color: [GREEN, GREEN_LIGHT, BLACK, '#D4A017', '#C0392B', '#2980B9'],
    textStyle: {
      color: BLACK_TEXT,
    },
    title: {
      textStyle: { color: BLACK, fontSize: 16, fontWeight: 'bold' },
      subtextStyle: { color: BLACK_TEXT, fontSize: 12 },
    },
    legend: {
      textStyle: { color: BLACK_TEXT },
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: '#E0E0E0' } },
      axisTick: { lineStyle: { color: '#E0E0E0' } },
      axisLabel: { color: BLACK_TEXT },
      splitLine: { lineStyle: { color: '#F0F0F0' } },
    },
    valueAxis: {
      axisLine: { lineStyle: { color: '#E0E0E0' } },
      axisTick: { lineStyle: { color: '#E0E0E0' } },
      axisLabel: { color: BLACK_TEXT },
      splitLine: { lineStyle: { color: '#F0F0F0' } },
    },
    line: {
      smooth: false,
      symbol: 'circle',
      symbolSize: 4,
    },
    bar: {
      barMaxWidth: 40,
    },
    animationDuration: 1000,
    animationEasing: 'cubicOut',
  })
}

/**
 * Default tooltip style — light mode with dark tooltip for contrast.
 */
export const tooltipDefaults: echarts.TooltipComponentOption = {
  backgroundColor: WHITE,
  borderColor: GREEN,
  borderWidth: 1,
  textStyle: {
    color: '#0A0A0A',
    fontSize: 13,
  },
}

/**
 * Generate ECharts markArea config to shade PDP vs APC administration eras.
 */
export function createAdminMarkArea(
  administrations: AdministrationBand[],
): echarts.MarkAreaComponentOption {
  return {
    silent: true,
    data: administrations.map((admin) => [
      {
        name: admin.label,
        xAxis: admin.startYear,
        itemStyle: {
          color: admin.party === 'PDP'
            ? `${PARTY_PDP}12`
            : `${PARTY_APC}12`,
        },
        label: {
          show: true,
          position: 'insideTop',
          color: admin.party === 'PDP' ? PARTY_PDP : PARTY_APC,
          fontSize: 11,
          fontWeight: 'bold',
          formatter: admin.label,
        },
      },
      {
        xAxis: admin.endYear,
      },
    ]),
  }
}
