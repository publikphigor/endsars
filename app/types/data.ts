// Shared source interface used across all datasets
export interface DataSource {
  name: string
  url: string
  indicator?: string
  retrieved?: string
  note?: string
  apiEndpoint?: string
  github?: string
}

// ─── Exchange Rate ───────────────────────────────────────────────────────────

export interface AnnualAverage {
  year: number
  value: number
  note?: string
  partial?: boolean
}

export interface QuarterlyRate {
  year: number
  quarter: string
  value: number
  source: string
  note?: string
  partial?: boolean
}

export interface KeyEvent {
  date: string
  event: string
}

export interface RecentRate {
  date: string
  rate: number
  source: string
}

export interface ExchangeRateData {
  category: string
  description: string
  unit: string
  sources: DataSource[]
  annualAverages: {
    description: string
    data: AnnualAverage[]
  }
  quarterlyData: {
    description: string
    data: QuarterlyRate[]
  }
  keyEvents: KeyEvent[]
  recentRates: {
    note: string
    cbnOfficial: RecentRate
    openMarket: RecentRate
  }
}

// ─── Inflation ───────────────────────────────────────────────────────────────

export interface InflationEntry {
  year: number
  value: number
  note?: string
  partial?: boolean
  source?: string
}

export interface MonthlyInflationEntry {
  month: string
  value: number
}

export interface InflationData {
  category: string
  description: string
  unit: string
  sources: DataSource[]
  data: InflationEntry[]
  monthly2025: {
    note: string
    data: MonthlyInflationEntry[]
    source: string
  }
  methodologyNote: string
}

// ─── Government Debt ─────────────────────────────────────────────────────────

export interface ExternalDebtEntry {
  year: number
  valueUSD: number
}

export interface TotalPublicDebtEntry {
  year: number
  quarter: string
  date: string
  totalNGN_trn: number
  totalUSD_bn?: number
  externalUSD_bn?: number
  externalNGN_trn?: number
  domesticNGN_trn?: number
  domesticUSD_bn?: number
  source: string
  sourceURL?: string
}

export interface GovernmentDebtData {
  category: string
  description: string
  sources: DataSource[]
  externalDebt: {
    description: string
    unit: string
    data: ExternalDebtEntry[]
  }
  totalPublicDebt: {
    description: string
    note: string
    data: TotalPublicDebtEntry[]
    projection2026: {
      note: string
      source: string
    }
  }
}

// ─── Poverty ─────────────────────────────────────────────────────────────────

export interface PovertyLineEntry {
  year: number
  value: number
  note?: string
}

export interface MultidimensionalPoverty {
  description: string
  value: number
  absoluteNumber: string
  surveyPeriod: string
  sampleSize: string
  source: string
}

export interface PovertyData {
  category: string
  description: string
  sources: DataSource[]
  note: string
  internationalPovertyLine: {
    description: string
    unit: string
    data: PovertyLineEntry[]
  }
  nationalPovertyLine: {
    description: string
    unit: string
    data: PovertyLineEntry[]
    source: string
  }
  multidimensionalPoverty: MultidimensionalPoverty
  keyInsight: string
}

// ─── Corruption ──────────────────────────────────────────────────────────────

export interface WGIEntry {
  year: number
  value: number
}

export interface CPIEntry {
  year: number
  score: number
  rank: number
  totalCountries: number
  note?: string
  source?: string
}

export interface CorruptionData {
  category: string
  description: string
  sources: DataSource[]
  wgiData: {
    description: string
    unit: string
    data: WGIEntry[]
  }
  cpiData: {
    description: string
    unit: string
    data: CPIEntry[]
    context: string
  }
}

// ─── Violence ────────────────────────────────────────────────────────────────

export interface ViolenceEntry {
  year: number
  killings: number | null
  kidnappings: number | null
  note?: string
  partial?: boolean
  source?: string
  keyEvents: string[]
}

export interface ViolenceData {
  category: string
  description: string
  unit: string
  sources: DataSource[]
  data: ViolenceEntry[]
  accessNotes: {
    acled: string
    cfr: string
    nbs: string
  }
}

// ─── Fuel Price ──────────────────────────────────────────────────────────────

export interface FuelPriceEntry {
  year: number
  month?: string
  price: number
  event: string
  note?: string
  source?: string
}

export interface FuelPriceData {
  category: string
  description: string
  unit: string
  sources: DataSource[]
  data_notes: {
    methodology: string
    verification: string
    manual_update_steps: string[]
  }
  data: FuelPriceEntry[]
}

// ─── Budget ──────────────────────────────────────────────────────────────────

export interface BudgetEntry {
  year: number
  total_appropriation_trn: number
  proposal_trn?: number
  label: string
  president: string
  note?: string
  sources?: string[]
}

export interface BudgetData {
  category: string
  description: string
  unit: string
  sources: DataSource[]
  data_notes: {
    methodology: string
    verification: string
    manual_update_steps: string[]
  }
  data: BudgetEntry[]
  currencyNote: string
}

// ─── Government Officials ────────────────────────────────────────────────────

export interface Official {
  name: string
  party: string | null
  startDate: string
  endDate: string | null
  note?: string
  stateOfOrigin?: string
  administration?: string
}

export interface Administration {
  name: string
  startDate: string
  endDate: string | null
  party: string
  president: string
  vicePresident: string
  senatePresident?: string
  senatePresidents?: string[]
  speaker?: string
  speakers?: string[]
  financeMinister?: string
  financeMinisters?: string[]
  nationalAssembly?: string
  nationalAssemblies?: string[]
  keyEvents: string[]
}

export interface NationalAssembly {
  assembly: string
  startDate: string
  endDate: string | null
  senatePresident: string
  speaker: string
  note: string
}

export interface GovernmentOfficialsData {
  category: string
  description: string
  lastUpdated: string
  sources: DataSource[]
  officials: {
    presidents: Official[]
    vicePresidents: Official[]
    senatePresidents: Official[]
    speakers: Official[]
    financeMinsters: Official[]
  }
  administrations: Administration[]
  nationalAssemblies: NationalAssembly[]
}

// ─── Aggregated datasets type ────────────────────────────────────────────────

export interface AllDatasets {
  exchangeRate: ExchangeRateData
  inflation: InflationData
  governmentDebt: GovernmentDebtData
  poverty: PovertyData
  corruption: CorruptionData
  violence: ViolenceData
  fuelPrice: FuelPriceData
  budget: BudgetData
  governmentOfficials: GovernmentOfficialsData
}
