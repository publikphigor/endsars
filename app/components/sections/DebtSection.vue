<script setup lang="ts">
import { timeSeries, pct } from '~/utils/chart'

const { governmentDebt, budget } = useDatasets()

const yearEnd = governmentDebt.yearEnd.data
const trn = (v: number) => `₦${v}tn`
const bn = (v: number) => `$${v}bn`

const ngnOption = computed(() => timeSeries({
  x: yearEnd.map(d => d.label),
  series: [{ name: 'Total public debt, ₦ trillion', data: yearEnd.map(d => d.ngn_trn), type: 'bar', labels: true }],
  format: trn,
}))

const usdOption = computed(() => timeSeries({
  x: yearEnd.map(d => d.label),
  series: [{ name: 'Total public debt, US$ billion', data: yearEnd.map(d => d.usd_bn), type: 'bar', labels: true, color: '#0A0A0A' }],
  format: bn,
}))

const gdp = governmentDebt.debtToGdp.data
const gdpOption = computed(() => timeSeries({
  x: gdp.map(d => d.year),
  series: [{ name: 'Debt, % of GDP', data: gdp.map(d => d.value) }],
  format: pct,
}))

const budgets = budget.data.filter(d => d.year >= 2010)
const budgetOption = computed(() => timeSeries({
  x: budgets.map(d => d.year),
  series: [{ name: 'Budget, ₦ trillion', data: budgets.map(d => d.total_appropriation_trn), type: 'bar' }],
  format: trn,
}))

const ds = governmentDebt.debtService
const latestBudget = budgets[budgets.length - 1]!
const debtShare = Math.round((latestBudget.debt_service_trn! / latestBudget.total_appropriation_trn) * 100)
</script>

<template>
  <UiSectionWrapper
    id="debt"
    title="Borrowing to pay for borrowing"
    subtitle="Public debt was ₦12.6 trillion at the end of 2015. By March 2026 it was ₦159.35 trillion."
    lede="Part of that jump comes from the naira's fall, which makes foreign loans look bigger when they are counted in naira. Measured in dollars, the debt still grew from $65 billion to $115 billion. The harder problem is what it costs to carry. For the first four months of 2022, the federal government spent more servicing its debts than it collected in revenue."
    dark
  >
    <div class="space-y-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <UiChart
          :option="ngnOption"
          title="Total public debt in naira"
          note="Federal government, states and FCT, at year end."
          source="Debt Management Office (DMO), via NBS and Nairametrics"
          small
        />
        <UiChart
          :option="usdOption"
          title="Total public debt in dollars"
          note="The same debt, converted at the DMO's exchange rate for each date."
          source="Debt Management Office (DMO), via NBS and Nairametrics"
          small
        />
      </div>

      <UiCallout source="Nairametrics, citing the Finance Ministry" url="https://nairametrics.com/2022/07/21/nigeria-spends-n1-94-trillion-on-debt-service-between-january-april-2022-surpasses-revenue">
        From January to April 2022, the government spent ₦{{ ds.jan2022.debtService_trn }} trillion on debt service and
        earned ₦{{ ds.jan2022.revenue_trn }} trillion.
        <template #detail>
          The World Bank put debt service at {{ ds.fy2022WorldBank }}% of revenue for all of 2022. The ratio has since fallen,
          to {{ ds.nineMonths2025 }}% for the first nine months of 2025, but the bill keeps growing: the 2026 budget sets aside
          ₦{{ latestBudget.debt_service_trn }} trillion for debt service, about {{ debtShare }}% of the total.
        </template>
      </UiCallout>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <UiChart
          :option="gdpOption"
          title="Debt as a share of the economy"
          note="General government debt, % of GDP. Uses the rebased GDP series, which made the economy about a third bigger in naira."
          source="IMF World Economic Outlook"
          small
        />
        <UiChart
          :option="budgetOption"
          title="Federal budget as signed"
          note="Nominal naira, not adjusted for inflation or the exchange rate."
          source="Budget Office of the Federation; State House; Nairametrics"
          small
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-black-text/70 leading-relaxed">
        <p>
          In 2023 lawmakers agreed to turn ₦{{ governmentDebt.waysAndMeans.approved_trn }} trillion of central bank
          overdrafts, known as Ways and Means, into a 40-year bond. Another ₦{{ governmentDebt.waysAndMeans.secondTranche_trn }}
          trillion followed that December. The debt was restructured, not paid off.
          <UiCitation source="Nairametrics, May 2023" url="https://nairametrics.com/2023/05/04/house-of-reps-approves-president-buharis-n23-7-trillion-ways-and-means-loan-request/" />
        </p>
        <p>
          Budgets also go unspent. By the third quarter of 2025, only {{ budget.capitalRelease2025.value }}% of that year's
          capital budget had been released. In December 2025 the National Assembly repealed and re-passed both the 2024
          and 2025 budgets, cutting 2025 from ₦54.99 trillion to ₦48.32 trillion.
          <UiCitation source="State House; Economic Confidential" :url="budget.capitalRelease2025.source" />
        </p>
      </div>
    </div>
  </UiSectionWrapper>
</template>
