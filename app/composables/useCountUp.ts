import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface CountUpOptions {
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

export function useCountUp(
  target: number,
  options: CountUpOptions = {},
  elRef?: Ref<HTMLElement | null>,
) {
  const { duration = 2000, decimals = 0, prefix = '', suffix = '' } = options
  const displayValue = ref(`${prefix}${(0).toFixed(decimals)}${suffix}`)
  let observer: IntersectionObserver | null = null

  function animate() {
    const start = performance.now()
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target
      displayValue.value = `${prefix}${current.toFixed(decimals)}${suffix}`
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  onMounted(() => {
    const el = elRef?.value
    if (!el) { animate(); return }
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          animate()
          observer?.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
  })

  onUnmounted(() => observer?.disconnect())

  return { displayValue }
}
