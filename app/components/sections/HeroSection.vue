<script setup lang="ts">
const stats = [
  {
    value: '₦196 → ₦1,331',
    label: 'Naira to one US dollar, May 2015 and September 2026',
    source: 'Central Bank of Nigeria',
    url: 'https://www.cbn.gov.ng/rates/ExchRateByCurrency.html',
  },
  {
    value: '15,878',
    label: 'People killed in political violence in 2025, the most ACLED has ever recorded in Nigeria',
    source: 'ACLED via HDX',
    url: 'https://data.humdata.org/dataset/nigeria-acled-conflict-data',
  },
  {
    value: '63%',
    label: 'Share of Nigerians below the national poverty line in 2025 (World Bank estimate)',
    source: 'World Bank',
    url: 'https://www.worldbank.org/en/country/nigeria/overview',
  },
]
</script>

<template>
  <section id="hero" class="relative bg-white px-4 sm:px-6 lg:px-12 2xl:px-20 pt-28 pb-20 md:pt-36 md:pb-28">
    <div class="page-container-inner grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div>
        <h1
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 600 } }"
          class="text-5xl md:text-7xl font-bold text-black leading-[1.05]"
        >
          A decade of <span class="text-green">decline</span>
        </h1>

        <p class="mt-6 text-lg md:text-xl text-black-text/70 max-w-xl leading-relaxed">
          Under three presidents since 2010, the naira has collapsed, prices have soared, debt has piled
          up and killings have spread across the country. In October 2020, young Nigerians marched against
          police brutality under the #EndSARS banner and made five demands. On 20 October, soldiers opened
          fire on protesters at the Lekki toll gate in Lagos. The protests became an awakening for a
          generation. This page sets out the record of Nigeria's governments since 2010, and every number
          here comes from a named source you can verify.
        </p>
      </div>

      <UiIllustration
        src="/images/hero.webp"
        alt="Linocut illustration of protesters seen from behind, fists raised and green-white-green flags held up under a highway toll gate at night"
        eager
      />
    </div>

    <div
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { duration: 600 } }"
      class="page-container-inner grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 mt-16"
    >
      <div v-for="stat in stats" :key="stat.value" class="bg-white px-0 md:px-6 py-6 first:md:pl-0">
        <p class="text-3xl md:text-4xl font-bold text-black tabular-nums">
          {{ stat.value }}
        </p>
        <p class="text-sm text-black-text/60 mt-2 leading-relaxed">
          {{ stat.label }}
          <UiCitation :source="stat.source" :url="stat.url" />
        </p>
      </div>
    </div>
  </section>
</template>
