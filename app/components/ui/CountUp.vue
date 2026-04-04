<script setup lang="ts">
interface Props {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  prefix: '',
  suffix: '',
  decimals: 0,
  duration: 2000,
})

const displayValue = ref(0)
const el = ref<HTMLElement | null>(null)
const hasAnimated = ref(false)

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function animate() {
  if (hasAnimated.value) return
  hasAnimated.value = true

  const startTime = performance.now()
  const startValue = 0
  const endValue = props.value

  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const easedProgress = easeOutCubic(progress)

    displayValue.value = startValue + (endValue - startValue) * easedProgress

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      displayValue.value = endValue
    }
  }

  requestAnimationFrame(step)
}

const formattedValue = computed(() => {
  return displayValue.value.toFixed(props.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

onMounted(() => {
  if (!el.value) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate()
          observer.disconnect()
        }
      })
    },
    { threshold: 0.2 },
  )

  observer.observe(el.value)
})
</script>

<template>
  <span ref="el" class="text-4xl md:text-6xl font-bold tabular-nums text-black">
    {{ prefix }}{{ formattedValue }}{{ suffix }}
  </span>
</template>
