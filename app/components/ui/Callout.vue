<script setup lang="ts">
interface Props {
  source?: string
  url?: string
}

defineProps<Props>()
</script>

<template>
  <div class="border-t border-black pt-6">
    <p class="text-xl md:text-2xl font-bold text-black leading-snug max-w-4xl">
      <slot />
    </p>
    <p v-if="$slots.detail || source" class="text-sm text-black-text/60 mt-3 max-w-3xl">
      <slot name="detail" />
      <UiCitation v-if="source && url" :source="source" :url="url" />
    </p>
  </div>
</template>
