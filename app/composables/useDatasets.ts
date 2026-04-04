import type {
  AllDatasets,
  ExchangeRateData,
  InflationData,
  GovernmentDebtData,
  PovertyData,
  CorruptionData,
  ViolenceData,
  FuelPriceData,
  BudgetData,
  GovernmentOfficialsData,
} from '~/types/data'

import exchangeRateJson from '../../data/exchange-rate.json'
import inflationJson from '../../data/inflation.json'
import governmentDebtJson from '../../data/government-debt.json'
import povertyJson from '../../data/poverty.json'
import corruptionJson from '../../data/corruption.json'
import violenceJson from '../../data/violence.json'
import fuelPriceJson from '../../data/fuel-price.json'
import budgetJson from '../../data/budget.json'
import governmentOfficialsJson from '../../data/government-officials.json'

const exchangeRate = exchangeRateJson as unknown as ExchangeRateData
const inflation = inflationJson as unknown as InflationData
const governmentDebt = governmentDebtJson as unknown as GovernmentDebtData
const poverty = povertyJson as unknown as PovertyData
const corruption = corruptionJson as unknown as CorruptionData
const violence = violenceJson as unknown as ViolenceData
const fuelPrice = fuelPriceJson as unknown as FuelPriceData
const budget = budgetJson as unknown as BudgetData
const governmentOfficials = governmentOfficialsJson as unknown as GovernmentOfficialsData

export function useDatasets(): AllDatasets {
  return {
    exchangeRate,
    inflation,
    governmentDebt,
    poverty,
    corruption,
    violence,
    fuelPrice,
    budget,
    governmentOfficials,
  }
}
