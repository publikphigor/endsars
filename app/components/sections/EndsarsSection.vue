<script setup lang="ts">
import { timeSeries, valueAxis } from '~/utils/chart'

const { accountability } = useDatasets()
const { endsars, protests, pressFreedomRank, freedomHouse, civicus } = accountability

const outcomeSources = [
  { source: 'Wikipedia, End SARS', url: 'https://en.wikipedia.org/wiki/End_SARS' },
  { source: 'TheCable, Lagos panel lists 48 victims', url: 'https://www.thecable.ng/full-list-nine-dead-four-missing-lagos-endsars-panel-lists-48-victims-of-lekki-shooting' },
  { source: 'Al Jazeera, October 2025', url: 'https://www.aljazeera.com/features/2025/10/20/nigerias-victims-of-endsars-protest-violence-await-justice-five-years-on' },
  { source: 'Al Jazeera, October 2025', url: 'https://www.aljazeera.com/features/2025/10/20/nigerias-victims-of-endsars-protest-violence-await-justice-five-years-on' },
  { source: 'BusinessDay, ECOWAS court ruling', url: 'https://businessday.ng/news/article/nigerian-government-guilty-of-human-rights-abuses-during-endsars-protest-ecowas-court-rules/' },
]

const pressOption = computed(() => ({
  ...timeSeries({
    x: pressFreedomRank.map(d => d.year),
    series: [{ name: 'Rank', data: pressFreedomRank.map(d => d.rank) }],
    format: v => `${v}th`,
  }),
  yAxis: { ...valueAxis(v => `${v}th`), inverse: true, min: 100, max: 130, interval: 5, axisLabel: { ...valueAxis(v => `${v}th`).axisLabel, showMinLabel: false } },
}))

const fhOption = computed(() => timeSeries({
  x: freedomHouse.map(d => d.year),
  series: [{ name: 'Score out of 100', data: freedomHouse.map(d => d.score), type: 'bar', labels: true }],
  min: 0,
  max: 100,
}))
</script>

<template>
  <UiSectionWrapper
    id="lekki"
    title="What happened to the five demands"
    lede="SARS, a police unit set up to fight armed robbery, had been accused for years of extortion, torture and killings. In October 2020 young Nigerians took to the streets with five demands, and the presidency said it accepted all of them. The record since then is thin."
    dark
  >
    <div class="space-y-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 class="text-lg font-semibold text-black mb-5">The demands, 11 October 2020</h3>
          <ol class="space-y-4">
            <li v-for="(demand, i) in endsars.demands" :key="demand" class="flex gap-4 text-black-text/80">
              <span class="text-green font-bold tabular-nums">{{ i + 1 }}</span>
              <span>{{ demand }}</span>
            </li>
          </ol>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-black mb-5">What the record shows</h3>
          <dl class="divide-y divide-black/10">
            <div v-for="(o, i) in endsars.outcomes" :key="o.fact" class="py-4 first:pt-0">
              <dt class="font-bold text-black">{{ o.fact }}</dt>
              <dd class="text-sm text-black-text/70 mt-1">
                {{ o.detail }}
                <UiCitation :source="outcomeSources[i]!.source" :url="outcomeSources[i]!.url" />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <UiCallout
        source="Amnesty International Nigeria"
        url="https://www.amnesty.org.ng/2024/11/28/nigeria-police-used-excessive-force-to-violently-quash-endbadgovernance-protests/"
      >
        In August 2024, police killed at least {{ protests.endBadGovernance.killed }} people during the
        #EndBadGovernance protests over the cost of living and detained more than
        {{ protests.endBadGovernance.detained.toLocaleString() }}.
        <template #detail>
          In November 2024 more than {{ protests.endBadGovernance.minorsCharged }} children were charged with treason
          over the protests. Some collapsed in court. The charges were dropped days later after a public outcry.
        </template>
      </UiCallout>

      <div>
        <h3 class="text-2xl md:text-3xl font-bold text-black max-w-3xl">
          Speaking up has become riskier
        </h3>
        <p class="text-black-text/70 mt-3 max-w-3xl leading-relaxed">
          Twitter was blocked nationwide for {{ protests.twitterBanDays }} days in 2021 after it deleted a post by
          President Buhari. A regional court later ruled the ban unlawful. CIVICUS has rated Nigeria's civic space
          "{{ civicus.rating.toLowerCase() }}" since {{ civicus.since }}, and at least 25 journalists were prosecuted
          under the 2015 Cybercrimes Act before it was amended in 2024.
          <UiCitation source="CPJ, November 2025" url="https://cpj.org/2025/11/3-nigerian-journalists-detained-on-cybercrime-allegations-despite-reform/" />
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          <UiChart
            :option="pressOption"
            title="Press freedom rank"
            note="Rank out of 180 countries. The axis is flipped so that higher on the chart means freer. The low point was 129th in 2022."
            source="Reporters Without Borders, World Press Freedom Index"
            small
          />
          <UiChart
            :option="fhOption"
            title="Freedom House score"
            note="Political rights and civil liberties, out of 100. Rated Partly Free every year."
            source="Freedom House, Freedom in the World (edition year)"
            small
          />
        </div>
      </div>
    </div>
  </UiSectionWrapper>
</template>
