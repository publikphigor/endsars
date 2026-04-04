<script setup lang="ts">
interface Props {
  id: string
  title: string
  titleHtml?: string
  subtitle?: string
  dark?: boolean
  sectionNumber?: number
}

const props = withDefaults(defineProps<Props>(), {
  dark: false,
})
</script>

<template>
  <section
    :id="id"
    :class="dark ? 'bg-white-soft' : 'bg-white'"
    class="relative"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :visible-once="{ opacity: 1, transition: { duration: 500 } }"
        class="mb-12 md:mb-16"
      >
        <span
          v-if="sectionNumber"
          class="inline-block text-green text-xs font-semibold tracking-widest uppercase mb-3"
        >
          {{ String(sectionNumber).padStart(2, '0') }}
        </span>
        <h2
          v-if="titleHtml"
          class="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight"
          v-html="titleHtml"
        />
        <h2 v-else class="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-lg md:text-xl text-black-text/60 mt-4 max-w-2xl">
          {{ subtitle }}
        </p>
      </div>

      <slot />
    </div>
  </section>
</template>
