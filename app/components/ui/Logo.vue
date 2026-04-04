<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  block: false,
})

const sizeClasses: Record<string, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
}
</script>

<template>
  <component
    :is="block ? 'div' : 'span'"
    :class="[sizeClasses[props.size], 'font-bold tracking-tight']"
  >
    <span class="text-black">endsars</span>
    <span class="text-green">.online</span>
  </component>
</template>
