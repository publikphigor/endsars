<script setup lang="ts">
import { timeSeries, pct } from '~/utils/chart'

const { accountability } = useDatasets()
const { elections, opinion, nextElection } = accountability

const turnoutOption = computed(() => timeSeries({
  x: elections.map(e => e.year),
  series: [{ name: 'Turnout', data: elections.map(e => e.turnout), type: 'bar', labels: true }],
  format: v => `${Math.round(v)}%`,
  min: 0,
  max: 100,
}))

const opinionOption = computed(() => timeSeries({
  x: opinion.map(o => o.survey),
  series: [
    { name: 'Country going in the wrong direction', data: opinion.map(o => o.wrongDirection), color: '#C0392B' },
    { name: 'Approve of the president', data: opinion.map(o => o.approve), color: '#008751' },
    { name: 'Trust the police', data: opinion.map(o => o.trustPolice), color: '#0A0A0A' },
  ],
  format: pct,
  min: 0,
  max: 100,
}))

const last = elections[elections.length - 1]!
const shareOfRegistered = Math.round((last.votes / last.registered) * 100)
const latestOpinion = opinion[opinion.length - 1]!
</script>

<template>
  <UiSectionWrapper
    id="vote"
    title="The next vote is on 16 January 2027"
    highlight="vote"
    subtitle="Turnout in presidential elections has fallen at every election since 2011, from 54% to 27%."
    image="/images/vote.webp"
    image-alt="Linocut illustration of a hand dropping a folded ballot into a clear ballot box on a wooden table"
    :lede="`In 2023 Bola Tinubu won with ${(last.votes / 1e6).toFixed(2)} million votes. That was ${last.share}% of the votes cast and about ${shareOfRegistered}% of the ${(last.registered / 1e6).toFixed(1)} million people registered to vote. Turnout was the lowest since military rule ended in 1999. A year later, ${Math.round(latestOpinion.wrongDirection)}% of Nigerians told Afrobarometer the country was going in the wrong direction and ${Math.round(latestOpinion.approve)}% approved of the president's performance.`"
  >
    <div class="space-y-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <UiChart
          :option="turnoutOption"
          title="Turnout in presidential elections"
          note="Votes cast as a share of registered voters."
          source="INEC and International IDEA"
          small
        />
        <UiChart
          :option="opinionOption"
          title="What Nigerians say"
          note="Share of adults in each Afrobarometer survey."
          source="Afrobarometer Rounds 5 to 10, weighted by endsars.online from the public data files"
          small
        />
      </div>

      <div class="max-w-3xl space-y-5 text-lg leading-relaxed text-black-text/80">
        <p>
          INEC's final list has {{ nextElection.candidates }} presidential candidates.
          <UiCitation source="Vanguard, 12 September 2026" url="https://www.vanguardngr.com/2026/09/2027-tinubu-atiku-obi-15-others-make-inec-final-presidential-candidates-list/" />
          {{ nextElection.note }}
          <UiCitation source="Premium Times, INEC timetable" url="https://www.premiumtimesng.com/news/top-news/859957-updated-inec-reschedules-2027-general-election-releases-new-election-timetable.html" />
        </p>
        <p>
          This page takes no side in that election. It exists so that anyone deciding how to vote can see the record
          first. We update it as new data comes out. If you find a number that is wrong, please
          <a href="https://github.com/publikphigor/endsars/issues" target="_blank" rel="noopener noreferrer" class="text-green underline underline-offset-4 hover:text-green-dark">tell us</a>.
        </p>
      </div>

      <a
        href="https://inecnigeria.org"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 bg-green text-white font-semibold px-6 py-3 hover:bg-green-dark transition-colors duration-150"
      >
        Election information from INEC <span aria-hidden="true">&nearr;</span>
      </a>
    </div>
  </UiSectionWrapper>
</template>
