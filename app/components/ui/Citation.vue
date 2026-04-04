<script setup lang="ts">
interface Props {
  source: string
  url: string
  number: number
}

defineProps<Props>()

const showTooltip = ref(false)
</script>

<template>
  <span
    class="relative inline-block"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    @focus="showTooltip = true"
    @blur="showTooltip = false"
  >
    <a
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      class="cursor-pointer text-green text-xs font-semibold ml-0.5 tabular-nums hover:underline"
    >
      <sup>[{{ number }}]</sup>
    </a>

    <Transition name="tooltip">
      <div
        v-if="showTooltip"
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 min-w-48 pointer-events-auto"
      >
        <div class="bg-black-soft border-t-2 border-green rounded px-3 py-2 text-xs shadow-lg">
          <a
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:text-green transition-colors duration-150"
          >
            {{ source }}
            <span class="text-green ml-1">&nearr;</span>
          </a>
        </div>
      </div>
    </Transition>
  </span>
</template>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, 4px);
}

.tooltip-enter-to,
.tooltip-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>
