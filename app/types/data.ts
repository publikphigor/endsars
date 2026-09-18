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
  headline: number
  food?: number
  core?: number
}

export interface InflationData {
  category: string
  description: string
  unit: string
  sources: DataSource[]
  data: InflationEntry[]
  monthly: {
    note: string
    data: MonthlyInflationEntry[]
  }
  peak2024: { month: string, value: number, note: string }
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

export interface YearValue {
  year: number
  value: number
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
  }
  yearEnd: {
    description: string
    data: { label: string, ngn_trn: number, usd_bn: number }[]
  }
  debtToGdp: { description: string, data: YearValue[] }
  debtService: {
    jan2022: { debtService_trn: number, revenue_trn: number, note: string }
    fy2022WorldBank: number
    nineMonths2025: number
    note: string
  }
  waysAndMeans: { approved_trn: number, secondTranche_trn: number, note: string }
}

// ─── Poverty ─────────────────────────────────────────────────────────────────

export interface PovertyLineEntry {
  year: number
  value: number
  note?: string
  projection?: boolean
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
  foodInsecurity: {
    description: string
    data: { year: number, value: number, states: number }[]
  }
  undernourishment: YearValue[]
  keyInsight: string
  keyInsightSource: string
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

export interface CorruptionCase {
  case: string
  era: string
  amount: string
  status: string
}

export interface CorruptionData {
  category: string
  description: string
  sources: DataSource[]
  wgiData: {
    description: string
    unit: string
    data: WGIEntry[]
    ruleOfLaw: WGIEntry[]
  }
  cpiData: {
    description: string
    unit: string
    data: CPIEntry[]
    context: string
  }
  cases: CorruptionCase[]
  efccConvictions: { note: string, data: YearValue[] }
}

// ─── Violence ────────────────────────────────────────────────────────────────

export interface ViolenceEntry {
  year: number
  keyEvents: string[]
  partial?: boolean
}

export interface AcledYear {
  year: number
  fatalities: number
  events: number
  civilianFatalities: number
  partial?: boolean
}

export interface ViolenceData {
  category: string
  description: string
  unit: string
  asOf: string
  sources: DataSource[]
  acled: AcledYear[]
  byAdministration: { label: string, period: string, fatalities: number, months: number }[]
  topStates2025: { state: string, fatalities: number }[]
  kidnapping: {
    sbm: { period: string, abducted: number, incidents: number, ransomPaid_bn: number }[]
    nbs: { period: string, incidents: number, ransom_trn: number, note: string }
    schoolsSinceChibok: { value: number, note: string }
  }
  idps: YearValue[]
  data: ViolenceEntry[]
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
  nbsMonthly: { note: string, data: { month: string, price: number }[] }
  pumpLagos: { note: string, data: { month: string, year: number, price: number, date: string, source: string }[] }
  latestPump: { date: string, nnpcLagos: number, dangoteGantry: number, note: string, source: string }
  otherFuels: { product: string, unit: string, before: number, beforeDate: string, latest: number, latestDate: string, source: string }[]
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
  debt_service_trn?: number
  capital_trn?: number
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
  capitalRelease2025: { value: number, note: string, source: string }
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

// ─── New datasets (Sept 2026) ───────────────────────────────────────────────

export interface CostOfLivingData {
  category: string
  description: string
  sources: DataSource[]
  minimumWage: { year: number, naira: number, rate: number, usd: number, president: string, note: string }[]
  wageInPetrol: Record<string, number | string>
  foodPrices: { item: string, may2023: number, latest: number, latestDate: string }[]
  jollofIndex: {
    note: string
    oldBasis: { date: string, value: number }[]
    newBasis: { date: string, value: number }[]
    firstReading: { date: string, value: number }
  }
}

export interface EconomyData {
  category: string
  description: string
  sources: DataSource[]
  gdpUsd: YearValue[]
  gdpPerCapita: YearValue[]
  remittances: YearValue[]
}

export interface ElectricityData {
  category: string
  description: string
  sources: DataSource[]
  access: YearValue[]
  withoutPower2024: { nigeria_m: number, drc_m: number, note: string }
  perCapita2023: { country: string, kwh: number }[]
}

export interface HealthEducationData {
  category: string
  description: string
  sources: DataSource[]
  maternalMortality: { year: number, ratio: number, deaths: number }[]
  maternalShareGlobal: number
  under5: YearValue[]
  under5Deaths2024: number
  lifeExpectancy: YearValue[]
  healthSpendShare: YearValue[]
  abujaTarget: number
  waec: YearValue[]
  waec2025FirstRelease: number
  asuuStrikes: { year: number, from: string, to: string, days: number }[]
  outOfSchool: { value: number, unit: string, note: string }
  malnutrition: { katsinaDeaths2025H1: number, treated2024: number, note: string }
}

export interface JapaData {
  category: string
  description: string
  sources: DataSource[]
  ukVisas: { year: number, study: number, care: number }[]
  ukNonVisitor2023: number
  canadaPR: YearValue[]
  consideredEmigrating2024: number
  consideredALot2024: number
  doctorsLeft: { value: number, note: string }
  activeDoctors: { value: number, note: string }
}

export interface AccountabilityData {
  category: string
  description: string
  sources: DataSource[]
  endsars: {
    demands: string[]
    outcomes: { fact: string, detail: string }[]
    deathsNationwide: number
  }
  protests: {
    endBadGovernance: { killed: number, detained: number, minorsCharged: number, note: string }
    twitterBanDays: number
  }
  pressFreedomRank: { year: number, rank: number }[]
  freedomHouse: { year: number, score: number }[]
  civicus: { rating: string, since: string }
  elections: { year: number, winner: string, party: string, votes: number, share: number, registered: number, turnout: number }[]
  nextElection: { date: string, candidates: number, note: string }
  opinion: { survey: string, president: string, wrongDirection: number, approve: number, trustPolice: number }[]
  wentHungry2024: number
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
  costOfLiving: CostOfLivingData
  economy: EconomyData
  electricity: ElectricityData
  healthEducation: HealthEducationData
  japa: JapaData
  accountability: AccountabilityData
}
