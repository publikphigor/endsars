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
  CostOfLivingData,
  EconomyData,
  ElectricityData,
  HealthEducationData,
  JapaData,
  AccountabilityData,
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
import costOfLivingJson from '../../data/cost-of-living.json'
import economyJson from '../../data/economy.json'
import electricityJson from '../../data/electricity.json'
import healthEducationJson from '../../data/health-education.json'
import japaJson from '../../data/japa.json'
import accountabilityJson from '../../data/accountability.json'

const exchangeRate = exchangeRateJson as unknown as ExchangeRateData
const inflation = inflationJson as unknown as InflationData
const governmentDebt = governmentDebtJson as unknown as GovernmentDebtData
const poverty = povertyJson as unknown as PovertyData
const corruption = corruptionJson as unknown as CorruptionData
const violence = violenceJson as unknown as ViolenceData
const fuelPrice = fuelPriceJson as unknown as FuelPriceData
const budget = budgetJson as unknown as BudgetData
const governmentOfficials = governmentOfficialsJson as unknown as GovernmentOfficialsData
const costOfLiving = costOfLivingJson as unknown as CostOfLivingData
const economy = economyJson as unknown as EconomyData
const electricity = electricityJson as unknown as ElectricityData
const healthEducation = healthEducationJson as unknown as HealthEducationData
const japa = japaJson as unknown as JapaData
const accountability = accountabilityJson as unknown as AccountabilityData

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
    costOfLiving,
    economy,
    electricity,
    healthEducation,
    japa,
    accountability,
  }
}
