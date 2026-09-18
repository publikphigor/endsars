import { use } from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  BarChart,
  LineChart,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TooltipComponent,
  CanvasRenderer,
])

const FONT = '"Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif'
export const RED = '#C0392B'

/** Chart text scales with very wide screens, matching the root font-size steps in main.css. */
const scale = typeof window === 'undefined' ? 1 : window.innerWidth >= 2560 ? 1.25 : window.innerWidth >= 1920 ? 1.125 : 1
const fs = (n: number) => Math.round(n * scale)

export const baseTooltip = {
  backgroundColor: '#FFFFFF',
  borderColor: '#008751',
  borderWidth: 1,
  textStyle: { color: '#0A0A0A', fontFamily: FONT, fontSize: fs(13) },
}

export const baseLegend = {
  top: 0,
  itemGap: 24,
  textStyle: { color: '#1A1A1A', fontFamily: FONT, fontSize: fs(12) },
}

export function categoryAxis(data: (string | number)[]) {
  return {
    type: 'category' as const,
    data: data.map(String),
    axisLine: { lineStyle: { color: '#E0E0E0' } },
    axisTick: { show: false },
    axisLabel: { color: '#1A1A1A', fontFamily: FONT, fontSize: fs(11) },
  }
}

export function valueAxis(formatter?: (v: number) => string, name?: string) {
  return {
    type: 'value' as const,
    name,
    nameTextStyle: { color: '#1A1A1A80', fontFamily: FONT, fontSize: fs(11) },
    axisLine: { show: false },
    axisLabel: { color: '#1A1A1A', fontFamily: FONT, fontSize: fs(11), formatter },
    splitLine: { lineStyle: { color: '#F0F0F0' } },
  }
}

interface Era {
  label: string
  from: number
  to: number
  tint: string
  text: string
}

const ERAS: Era[] = [
  { label: 'PDP — Jonathan', from: 2010, to: 2014, tint: 'rgba(0, 0, 0, 0.03)', text: '#00000050' },
  { label: 'APC — Buhari', from: 2015, to: 2022, tint: 'rgba(0, 135, 81, 0.05)', text: '#00875170' },
  { label: 'APC — Tinubu', from: 2023, to: 2026, tint: 'rgba(0, 135, 81, 0.10)', text: '#008751A0' },
]

/**
 * Admin-era shading for a category x-axis of years. Only bands that overlap
 * the axis are drawn, and each is clamped to the first/last year present.
 */
export function eraBands(years: (string | number)[]) {
  const nums = years.map(y => Number(String(y).match(/\d{4}/)?.[0]))
  const first = (n: number) => String(years[nums.indexOf(n)])
  const last = (n: number) => String(years[nums.lastIndexOf(n)])
  const data = ERAS.flatMap((era) => {
    const inside = nums.filter(n => n >= era.from && n <= era.to)
    if (!inside.length) return []
    return [[
      {
        xAxis: first(Math.min(...inside)),
        itemStyle: { color: era.tint },
        label: {
          show: true,
          position: 'insideTop',
          color: era.text,
          fontSize: fs(10),
          fontFamily: FONT,
          formatter: era.label,
        },
      },
      { xAxis: last(Math.max(...inside)) },
    ]]
  })
  return { silent: true, data } as any
}

export const naira = (v: number) => `₦${v.toLocaleString('en-NG')}`
export const usd = (v: number) => `$${v.toLocaleString('en-US')}`
export const pct = (v: number) => `${v}%`
export const compact = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : String(v)

export interface SeriesSpec {
  name: string
  data: (number | null)[]
  color?: string
  type?: 'line' | 'bar'
  dashed?: boolean
  step?: boolean
  labels?: boolean
}

interface TimeSeriesOpts {
  x: (string | number)[]
  series: SeriesSpec[]
  format?: (v: number) => string
  eras?: boolean
  legend?: boolean
  min?: number
  max?: number
  markLine?: { value: number, label: string }
}

/** Line/bar chart over a category axis, with optional era bands and a reference line. */
export function timeSeries(o: TimeSeriesOpts) {
  const fmt = o.format ?? ((v: number) => v.toLocaleString('en-NG'))
  const showLegend = o.legend ?? o.series.length > 1
  return {
    backgroundColor: 'transparent',
    grid: { left: 64, right: 24, top: showLegend ? (o.series.length > 2 ? 72 : 48) : 32, bottom: 36 },
    legend: showLegend ? { ...baseLegend, data: o.series.map(s => s.name) } : undefined,
    tooltip: {
      ...baseTooltip,
      trigger: 'axis',
      valueFormatter: (v: number | null) => (v == null ? 'n/a' : fmt(v)),
    },
    xAxis: categoryAxis(o.x),
    // Headroom above the data so era labels and bar values never collide
    yAxis: o.max == null
      ? { ...valueAxis(fmt), min: o.min, boundaryGap: [0, '22%'] }
      : { ...valueAxis(fmt), min: o.min, max: o.max * 1.15, axisLabel: { ...valueAxis(fmt).axisLabel, showMaxLabel: false } },
    series: o.series.map((s, i) => {
      const color = s.color ?? (i === 0 ? '#008751' : '#0A0A0A')
      const base: Record<string, any> = {
        name: s.name,
        type: s.type ?? 'line',
        data: s.data,
        itemStyle: { color },
      }
      if (base.type === 'line') {
        Object.assign(base, {
          symbol: 'circle',
          symbolSize: 5,
          connectNulls: true,
          step: s.step ? 'end' : false,
          lineStyle: { color, width: 2, type: s.dashed ? 'dashed' : 'solid' },
        })
      }
      else {
        base.barMaxWidth = 28
        base.itemStyle.borderRadius = [2, 2, 0, 0]
      }
      if (s.labels) {
        base.label = { show: true, position: 'top', color: '#1A1A1A', fontFamily: FONT, fontSize: fs(11), formatter: (p: any) => fmt(p.value) }
      }
      if (i === 0 && o.eras !== false) base.markArea = eraBands(o.x)
      if (i === 0 && o.markLine) {
        base.markLine = {
          silent: true,
          symbol: 'none',
          lineStyle: { color: RED, type: 'dashed', width: 1 },
          label: { formatter: o.markLine.label, color: RED, fontFamily: FONT, fontSize: fs(11), position: 'insideEndBottom' },
          data: [{ yAxis: o.markLine.value }],
        }
      }
      return base
    }),
  }
}

/** Horizontal bar chart for ranked categories (states, countries). */
export function rankedBars(labels: string[], values: number[], format: (v: number) => string, highlight?: string) {
  return {
    backgroundColor: 'transparent',
    grid: { left: 130, right: 64, top: 8, bottom: 8 },
    tooltip: { ...baseTooltip, trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: format },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      inverse: true,
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#1A1A1A', fontFamily: FONT, fontSize: fs(12) },
    },
    series: [{
      type: 'bar',
      barMaxWidth: 20,
      data: values.map((v, i) => ({
        value: v,
        itemStyle: { color: labels[i] === highlight ? RED : '#008751', borderRadius: [0, 2, 2, 0] },
      })),
      label: { show: true, position: 'right', color: '#1A1A1A', fontFamily: FONT, fontSize: fs(11), formatter: (p: any) => format(p.value) },
    }],
  }
}
