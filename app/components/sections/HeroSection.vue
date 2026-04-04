<script setup lang="ts">
const stats = [
  { label: 'Exchange Rate', value: '₦150 → ₦1,500', sublabel: '2010 vs 2026' },
  { label: 'Peak Inflation', value: '33%', sublabel: '2024 annual rate' },
  { label: 'Poverty Rate', value: '62%', sublabel: 'Multidimensional (2022)' },
]
</script>

<template>
  <section id="hero" class="relative flex flex-col items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8 pt-24 md:pt-16 overflow-hidden">
    <div class="flex flex-col items-center text-center max-w-5xl mx-auto">
      <!-- Logo -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 600 } }"
        class="mb-8"
      >
        <UiLogo size="lg" block />
      </div>

      <!-- Headline -->
      <h1
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 600 } }"
        class="text-5xl md:text-7xl font-bold text-black leading-tight"
      >
        A Decade of Decline
      </h1>

      <!-- Subtitle -->
      <p
        class="mt-6 text-lg md:text-xl text-black-text/60 max-w-2xl"
      >
        Since 2015, Nigeria has been governed by the APC. The naira has collapsed, inflation has
        surged, and poverty has deepened. This is not opinion — it is data. Every chart on this
        page tells the same story.
      </p>

      <!-- Shock Stat Cards -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 600 } }"
        class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 w-full max-w-3xl"
      >
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="bg-white-soft border-l-2 border-green px-6 py-5"
        >
          <p class="text-2xl md:text-3xl font-bold text-black leading-tight">
            {{ stat.value }}
          </p>
          <p class="text-sm text-black-text/70 mt-1">{{ stat.label }}</p>
          <p class="text-xs text-black-text/40 mt-0.5">{{ stat.sublabel }}</p>
        </div>
      </div>
    </div>

    <!-- Scroll Down Chevron (hidden on mobile to avoid blocking content) -->
    <div
      class="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2"
    >
      <a href="#power" aria-label="Scroll down" class="block animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-green"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </div>
  </section>
</template>
