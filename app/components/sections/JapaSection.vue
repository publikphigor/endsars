<script setup lang="ts">
import { timeSeries, compact } from '~/utils/chart'

const { japa, economy } = useDatasets()

const uk = japa.ukVisas
const ukOption = computed(() => {
  const option = timeSeries({
    x: uk.map(d => d.year),
    series: [
      { name: 'Study (students and dependants)', data: uk.map(d => d.study), type: 'bar' },
      { name: 'Health and care workers (and dependants)', data: uk.map(d => d.care), type: 'bar', color: '#0A0A0A' },
    ],
    format: v => v.toLocaleString(),
  })
  option.yAxis.axisLabel.formatter = compact as any
  return option
})

const canada = japa.canadaPR
const canadaOption = computed(() => {
  const option = timeSeries({
    x: canada.map(d => d.year),
    series: [{ name: 'New permanent residents from Nigeria', data: canada.map(d => d.value), type: 'bar' }],
    format: v => v.toLocaleString(),
  })
  option.yAxis.axisLabel.formatter = compact as any
  return option
})

const remit = economy.remittances
const latestRemit = remit[remit.length - 1]!
</script>

<template>
  <UiSectionWrapper
    id="japa"
    title="The ones who left"
    subtitle="In 2023 the UK issued 281,658 visas to Nigerians, the most in any year since at least 2010."
    image="/images/japa.webp"
    image-alt="Linocut illustration of three young travellers pulling green suitcases across an airport hall toward a waiting plane"
    :lede="`Japa is Yoruba for running away. It has become the word for a generation leaving. In a 2024 Afrobarometer survey, ${japa.consideredEmigrating2024}% of adults said they had thought about emigrating, and a third had thought about it a lot. Doctors and nurses are among those going. The money still comes home: Nigerians abroad sent $${latestRemit.value} billion in ${latestRemit.year}.`"
  >
    <div class="space-y-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UiStatCard
          value="16,000+"
          label="Doctors estimated to have left Nigeria in five to seven years (Health Minister, April 2025)"
          source="The Advocate"
          source-url="https://advocatengr.com/2025/04/08/16000-doctors-left-nigeria-in-seven-years-health-minister/"
        />
        <UiStatCard
          value="55,000"
          label="Doctors still practising in Nigeria, out of more than 130,000 ever registered (NMA, June 2026)"
          source="Vanguard"
          source-url="https://www.vanguardngr.com/2026/06/japa-only-55000-doctors-left-for-220m-nigerians/"
        />
        <UiStatCard
          value="1,614"
          label="Nigerian nurses who joined the UK register in 2025-26, the second-largest source of new nurses from abroad"
          source="NMC register report 2025-26"
          source-url="https://www.nmc.org.uk/globalassets/sitedocuments/data-reports/2026/0184ca-data-report-uk-web.pdf"
        />
      </div>

      <UiChart
        :option="ukOption"
        title="UK visas issued to Nigerians"
        note="Study and health-care routes, main applicants plus family. The drop in 2024 follows UK rules that stopped most students and care workers bringing dependants."
        source="UK Home Office, entry clearance visa statistics (year ending June 2026), summed by endsars.online"
      />

      <UiChart
        :option="canadaOption"
        title="Nigerians becoming permanent residents of Canada"
        note="New permanent resident admissions by citizenship, rounded to the nearest 5."
        source="Immigration, Refugees and Citizenship Canada (IRCC) open data"
        small
      />
    </div>
  </UiSectionWrapper>
</template>
