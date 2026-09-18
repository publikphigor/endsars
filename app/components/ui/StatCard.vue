<script setup lang="ts">
interface Props {
  value: string
  label: string
  source?: string
  sourceUrl?: string
}

defineProps<Props>()
</script>

<template>
  <div class="border-t border-black/15 pt-5">
    <p class="text-2xl md:text-3xl font-bold text-black leading-tight">
      {{ value }}
    </p>
    <p class="text-sm text-black-text/70 mt-1">
      {{ label }}
      <UiCitation
        v-if="source && sourceUrl"
        :source="source"
        :url="sourceUrl"
       
      />
    </p>
  </div>
</template>
