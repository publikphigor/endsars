<script setup lang="ts">
import { timeSeries, rankedBars, compact, RED } from '~/utils/chart'

const { violence } = useDatasets()

const acled = violence.acled
const label = (d: { year: number, partial?: boolean }) => (d.partial ? `${d.year}*` : String(d.year))

const acledOption = computed(() => {
  const option = timeSeries({
    x: acled.map(label),
    series: [
      { name: 'All deaths in political violence', data: acled.map(d => d.fatalities), type: 'bar', color: RED },
      { name: 'Civilians killed in targeted attacks', data: acled.map(d => d.civilianFatalities), color: '#0A0A0A' },
    ],
    format: v => v.toLocaleString(),
  })
  option.yAxis.axisLabel.formatter = compact as any
  return option
})

const perMonth = violence.byAdministration.map(a => ({ ...a, rate: Math.round(a.fatalities / a.months) }))
const adminOption = computed(() => rankedBars(
  perMonth.map(a => a.label),
  perMonth.map(a => a.rate),
  v => `${v.toLocaleString()} a month`,
))

const states = violence.topStates2025
const statesOption = computed(() => rankedBars(
  states.map(s => s.state),
  states.map(s => s.fatalities),
  v => v.toLocaleString(),
  'Borno',
))

const idps = violence.idps
const idpOption = computed(() => {
  const option = timeSeries({
    x: idps.map(d => d.year),
    series: [{ name: 'Internally displaced people', data: idps.map(d => d.value) }],
    format: v => v.toLocaleString(),
    min: 0,
  })
  option.yAxis.axisLabel.formatter = ((v: number) => `${(v / 1e6).toFixed(1)}m`) as any
  return option
})

const y2025 = acled.find(d => d.year === 2025)!
const y2026 = acled.find(d => d.year === 2026)!
const sbm = violence.kidnapping.sbm
const latestSbm = sbm[sbm.length - 1]!
const nbs = violence.kidnapping.nbs
const latestIdp = idps[idps.length - 1]!
const timeline = [...violence.data].reverse()
</script>

<template>
  <UiSectionWrapper
    id="violence"
    title="Blood on the ground"
    title-html="<span style='color:#C0392B'>Blood</span> on the ground"
    subtitle="2025 was the deadliest year of political violence in Nigeria since the monitor ACLED began counting in 1997."
    image="/images/violence.webp"
    image-alt="Linocut illustration of a mother kneeling in the dust, crying as she holds her dead son, his shirt stained with blood, with burning village houses and spent bullet casings around them"
    lede="ACLED counted 15,878 people killed in political violence in 2025. The previous high was 11,296 in 2014, the year Boko Haram took the Chibok girls. By 11 September 2026 it had counted 11,743 more. Most of the killing is in the north: Borno, Zamfara and Katsina together accounted for more than half of the deaths in 2025. Kidnapping for ransom has become a business, and three and a half million people have been driven from their homes."
  >
    <div class="space-y-16">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <UiStatCard :value="y2025.fatalities.toLocaleString()" label="Killed in political violence in 2025" source="ACLED" source-url="https://data.humdata.org/dataset/nigeria-acled-conflict-data" />
        <UiStatCard :value="y2025.civilianFatalities.toLocaleString()" label="Civilians killed in attacks aimed at them in 2025" source="ACLED" source-url="https://data.humdata.org/dataset/nigeria-acled-conflict-data" />
        <UiStatCard :value="latestSbm.abducted.toLocaleString()" :label="`People kidnapped, ${latestSbm.period}`" source="SBM Intelligence" source-url="https://sbmintelligence.substack.com/p/the-economics-of-nigerias-kidnap-0a6" />
        <UiStatCard :value="`${(latestIdp.value / 1e6).toFixed(1)} million`" :label="`Displaced inside Nigeria at the end of ${latestIdp.year}`" source="IDMC" source-url="https://data.humdata.org/dataset/idmc-idp-data-nga" />
      </div>

      <UiChart
        :option="acledOption"
        title="Deaths in political violence, by year"
        :note="`Battles, attacks on civilians, bombings and mob violence. *2026 runs to 11 September (${y2026.fatalities.toLocaleString()} so far).`"
        :source="`ACLED, data as of ${violence.asOf}. Yearly totals summed by endsars.online.`"
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <UiChart
            :option="adminOption"
            title="Deaths per month, by president"
            note="ACLED deaths divided by months in office, so terms of different lengths can be compared."
            source="ACLED; endsars.online calculation"
            small
          />
          <p class="text-xs text-black-text/40 mt-3">
            Jonathan's figure starts in January 2010 and includes the last months of the Yar'Adua presidency. Handovers
            fall on 29 May, so each May is counted in the outgoing term.
          </p>
        </div>
        <UiChart
          :option="statesOption"
          title="Deadliest states in 2025"
          note="Deaths in political violence. These ten states account for 86% of the national total."
          source="ACLED via HDX"
          small
        />
      </div>

      <UiCallout>
        Between July 2025 and June 2026, SBM Intelligence counted {{ latestSbm.abducted.toLocaleString() }} people kidnapped
        in {{ latestSbm.incidents.toLocaleString() }} incidents, up from {{ sbm[0]!.abducted.toLocaleString() }} a year earlier.
        <UiCitation source="SBM Intelligence, 2026 kidnap report" url="https://sbmintelligence.substack.com/p/the-economics-of-nigerias-kidnap-0a6" />
        <template #detail>
          Families paid at least ₦{{ latestSbm.ransomPaid_bn }} billion in ransom. Those are only the cases the media reported.
          When the NBS asked households directly, it estimated {{ (nbs.incidents / 1e6).toFixed(1) }} million kidnappings and
          ₦{{ nbs.ransom_trn }} trillion in ransom between May 2023 and April 2024.
          <UiCitation source="NBS Crime Experience and Security Perception Survey, via Nairametrics" url="https://nairametrics.com/2024/12/17/breaking-nigerians-paid-n2-23-trillion-to-kidnappers-in-12-months-nbs-report/" />
        </template>
      </UiCallout>

      <UiChart
        :option="idpOption"
        title="People displaced by conflict inside Nigeria"
        note="Number of internally displaced people at the end of each year."
        source="Internal Displacement Monitoring Centre (IDMC) via HDX"
        small
      />

      <div>
        <h3 class="text-lg font-semibold text-black mb-8">Timeline, 2026 back to 2010</h3>
        <ol class="relative space-y-8 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-px before:bg-black/15">
          <li v-for="entry in timeline" :key="entry.year" class="relative pl-8">
            <span
              class="absolute left-0 top-1.5 w-[7px] h-[7px]"
              :class="entry.year >= 2023 ? 'bg-green' : 'bg-black/40'"
            />
            <p class="text-sm font-bold text-green tabular-nums">
              {{ entry.year }}
              <span v-if="acled.find(a => a.year === entry.year)" class="font-normal text-black-text/50 ml-2">
                {{ acled.find(a => a.year === entry.year)!.fatalities.toLocaleString() }} killed{{ entry.partial ? ' so far' : '' }}
              </span>
            </p>
            <ul class="mt-2 space-y-1">
              <li v-for="event in entry.keyEvents" :key="event" class="text-sm text-black-text/70">
                {{ event }}
              </li>
            </ul>
          </li>
        </ol>
      </div>

      <p class="text-sm text-black-text/50 max-w-3xl">
        ACLED records events reported in the media and by local partners, so its totals are a floor, not a full count.
        It revises past data as new reports come in. Survey estimates such as the NBS figures above measure something
        different and run far higher, so we never put the two on the same chart.
      </p>
    </div>
  </UiSectionWrapper>
</template>
