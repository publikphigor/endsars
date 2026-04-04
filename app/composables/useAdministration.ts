import type { Administration } from '~/types/data'
import { useDatasets } from './useDatasets'

export interface AdministrationBand {
  startYear: number
  endYear: number
  party: string
  label: string
  president: string
}

export function useAdministration() {
  const { governmentOfficials } = useDatasets()
  const administrations = governmentOfficials.administrations

  /**
   * Returns the administration that was in power on a given date (ISO string, e.g. "2020-10-20").
   */
  function getAdministrationForDate(date: string): Administration | undefined {
    const target = new Date(date).getTime()
    return administrations.find((admin) => {
      const start = new Date(admin.startDate).getTime()
      const end = admin.endDate ? new Date(admin.endDate).getTime() : Date.now()
      return target >= start && target <= end
    })
  }

  /**
   * Returns the ruling party for a given year based on who was president
   * for the majority of that year.
   */
  function getPartyForYear(year: number): 'PDP' | 'APC' {
    // Transition years: 2015 (PDP -> APC May 29), 2023 (APC -> APC)
    // For 2015, Buhari took over May 29 — majority of remaining year is APC
    // Use mid-year (July 1) as the deciding point
    const midYear = `${year}-07-01`
    const admin = getAdministrationForDate(midYear)
    return (admin?.party as 'PDP' | 'APC') ?? 'APC'
  }

  /**
   * Returns an array of administration bands suitable for chart overlays.
   * Each band has a start/end year, party color key, label, and president name.
   */
  function getAdministrationBands(): AdministrationBand[] {
    return administrations.map((admin) => {
      const startYear = new Date(admin.startDate).getFullYear()
      const endYear = admin.endDate
        ? new Date(admin.endDate).getFullYear()
        : new Date().getFullYear()

      // Extract short president surname for labels
      const nameParts = admin.president.split(' ')
      const label = nameParts[nameParts.length - 1] ?? admin.president

      return {
        startYear,
        endYear,
        party: admin.party,
        label,
        president: admin.president,
      }
    })
  }

  return {
    getAdministrationForDate,
    getPartyForYear,
    getAdministrationBands,
    administrations,
  }
}
