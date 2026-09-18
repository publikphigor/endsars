<script setup lang="ts">
import VChart from 'vue-echarts'
import '~/utils/chart'

interface Props {
  option: Record<string, any>
  title?: string
  note?: string
  source?: string
  small?: boolean
}

const props = defineProps<Props>()
const size = computed(() => (props.small ? 'chart-container-sm' : 'chart-container'))
</script>

<template>
  <figure>
    <h3 v-if="title" class="text-lg font-semibold text-black">{{ title }}</h3>
    <p v-if="note" class="text-sm text-black-text/50 mt-1">{{ note }}</p>
    <div class="mt-4 chart-scroll">
      <div :class="small ? 'min-w-[520px] sm:min-w-0' : 'min-w-[680px] sm:min-w-0'">
        <ClientOnly>
          <VChart :option="option" autoresize :class="size" />
          <template #fallback>
            <div :class="size" class="bg-white-medium" />
          </template>
        </ClientOnly>
      </div>
    </div>
    <figcaption v-if="source" class="text-xs text-black-text/40 mt-3">
      Source: {{ source }}
    </figcaption>
  </figure>
</template>
