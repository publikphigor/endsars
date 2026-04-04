import { computed, type ComputedRef } from 'vue'
import type { DataSource } from '~/types/data'
import { useDatasets } from './useDatasets'

export interface SourceEntry {
  footnote: number
  name: string
  url: string
  note?: string
}

export interface GroupedSources {
  [category: string]: SourceEntry[]
}

export function useSources() {
  const datasets = useDatasets()

  const allSources: ComputedRef<GroupedSources> = computed(() => {
    const seen = new Map<string, number>() // url -> footnote number
    const grouped: GroupedSources = {}
    let footnoteCounter = 1

    const datasetEntries: { category: string; sources: DataSource[] }[] = [
      { category: 'Exchange Rate', sources: datasets.exchangeRate.sources },
      { category: 'Inflation', sources: datasets.inflation.sources },
      { category: 'Government Debt', sources: datasets.governmentDebt.sources },
      { category: 'Poverty', sources: datasets.poverty.sources },
      { category: 'Corruption', sources: datasets.corruption.sources },
      { category: 'Violence and Security', sources: datasets.violence.sources },
      { category: 'Fuel Price', sources: datasets.fuelPrice.sources },
      { category: 'Federal Budget', sources: datasets.budget.sources },
      { category: 'Government Officials', sources: datasets.governmentOfficials.sources },
    ]

    for (const { category, sources } of datasetEntries) {
      const entries: SourceEntry[] = []
      for (const source of sources) {
        if (seen.has(source.url)) continue
        const footnote = footnoteCounter++
        seen.set(source.url, footnote)
        entries.push({
          footnote,
          name: source.name,
          url: source.url,
          note: source.note,
        })
      }
      if (entries.length > 0) {
        grouped[category] = entries
      }
    }

    return grouped
  })

  function getFootnoteNumber(url: string): number {
    const grouped = allSources.value
    for (const entries of Object.values(grouped)) {
      for (const entry of entries) {
        if (entry.url === url) return entry.footnote
      }
    }
    return -1
  }

  return { allSources, getFootnoteNumber }
}
