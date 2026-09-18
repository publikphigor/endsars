<script setup lang="ts">
interface Props {
  src: string
  alt: string
  eager?: boolean
}

import { imageSizes } from '~/utils/images'

const props = defineProps<Props>()
const size = computed(() => imageSizes[props.src] ?? [1600, 900])
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :width="size[0]"
    :height="size[1]"
    :loading="eager ? 'eager' : 'lazy'"
    decoding="async"
    class="w-full h-auto"
  >
</template>
