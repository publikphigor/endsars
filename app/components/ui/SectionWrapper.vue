<script setup lang="ts">
interface Props {
  id: string
  title: string
  titleHtml?: string
  subtitle?: string
  lede?: string
  image?: string
  imageAlt?: string
  dark?: boolean
}

withDefaults(defineProps<Props>(), {
  dark: false,
})
</script>

<template>
  <section
    :id="id"
    :class="dark ? 'bg-white-soft' : 'bg-white'"
    class="relative border-t border-black/5"
  >
    <div class="page-container py-20 md:py-32">
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :visible-once="{ opacity: 1, transition: { duration: 500 } }"
        class="mb-12 md:mb-16"
      >
        <h2
          v-if="titleHtml"
          class="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight max-w-4xl"
          v-html="titleHtml"
        />
        <h2 v-else class="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight max-w-4xl">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-lg md:text-xl text-black-text/60 mt-4 max-w-2xl">
          {{ subtitle }}
        </p>
      </div>

      <div v-if="image || lede" class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center mb-16">
        <UiIllustration
          v-if="image"
          :src="image"
          :alt="imageAlt ?? ''"
          :class="lede ? 'lg:col-span-3' : 'lg:col-span-5'"
        />
        <p
          v-if="lede"
          class="text-lg leading-relaxed text-black-text/80"
          :class="image ? 'lg:col-span-2' : 'lg:col-span-5 max-w-3xl'"
        >
          {{ lede }}
        </p>
      </div>

      <slot />
    </div>
  </section>
</template>
