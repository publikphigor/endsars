<script setup lang="ts">
const hoveredState = ref<string | null>(null)
const tooltipPos = ref({ x: 0, y: 0 })
const svgContent = ref('')

// Geopolitical zones
const zoneMap: Record<string, string> = {
  'Borno': 'North East', 'Adamawa': 'North East', 'Bauchi': 'North East', 'Gombe': 'North East', 'Taraba': 'North East', 'Yobe': 'North East',
  'Kaduna': 'North West', 'Kano': 'North West', 'Katsina': 'North West', 'Kebbi': 'North West', 'Sokoto': 'North West', 'Zamfara': 'North West', 'Jigawa': 'North West',
  'Benue': 'North Central', 'Kogi': 'North Central', 'Kwara': 'North Central', 'Nasarawa': 'North Central', 'Niger': 'North Central', 'Plateau': 'North Central', 'Abuja Federal Capital Territory': 'North Central',
  'Abia': 'South East', 'Anambra': 'South East', 'Ebonyi': 'South East', 'Enugu': 'South East', 'Imo': 'South East',
  'Akwa Ibom': 'South South', 'Bayelsa': 'South South', 'Cross River': 'South South', 'Delta': 'South South', 'Edo': 'South South', 'Rivers': 'South South',
  'Ekiti': 'South West', 'Lagos': 'South West', 'Ogun': 'South West', 'Ondo': 'South West', 'Osun': 'South West', 'Oyo': 'South West',
}

const zoneStats = [
  { zone: 'North West', color: '#008751', stat: 'Epicentre of banditry & kidnapping', detail: 'Zamfara: 1,088 killed, 1,755 abducted (H1 2025)' },
  { zone: 'North East', color: '#006B40', stat: 'Boko Haram / ISWAP stronghold', detail: 'Borno: 2,143 killed in 2024 (ACLED)' },
  { zone: 'North Central', color: '#00A86B', stat: 'Farmer-herder clashes', detail: 'Jos Palm Sunday massacre: 28+ killed (Mar 2026)' },
  { zone: 'South East', color: '#004D2E', stat: 'IPOB / ESN separatist violence', detail: 'Attacks on police, INEC, infrastructure' },
  { zone: 'South South', color: '#1A1A1A', stat: 'Oil theft & pipeline vandalism', detail: 'Niger Delta militancy legacy' },
  { zone: 'South West', color: '#333333', stat: 'Relatively lower conflict', detail: 'But rising urban crime and kidnapping' },
]

onMounted(async () => {
  const res = await fetch('/nigeria-map.svg')
  const text = await res.text()
  svgContent.value = text

  await nextTick()

  // Attach event listeners to SVG paths
  const container = document.getElementById('nigeria-svg-container')
  if (!container) return

  const paths = container.querySelectorAll('path[data-name]')
  paths.forEach((el) => {
    const path = el as SVGPathElement
    const name = path.getAttribute('data-name') || ''
    const originalFill = path.getAttribute('fill') || ''

    path.style.cursor = 'pointer'
    path.style.transition = 'fill 200ms, transform 150ms'

    path.addEventListener('mouseenter', (e: Event) => {
      hoveredState.value = name
      path.setAttribute('fill', '#008751')
      const me = e as MouseEvent
      tooltipPos.value = { x: me.clientX, y: me.clientY }
    })

    path.addEventListener('mousemove', (e: Event) => {
      const me = e as MouseEvent
      tooltipPos.value = { x: me.clientX, y: me.clientY }
    })

    path.addEventListener('mouseleave', () => {
      hoveredState.value = null
      path.setAttribute('fill', originalFill)
    })
  })
})

const hoveredZone = computed(() => {
  if (!hoveredState.value) return null
  return zoneMap[hoveredState.value] || null
})
</script>

<template>
  <UiSectionWrapper
    id="map"
    title="A Country in Crisis"
    subtitle="Violence is not contained to one region — it spans the entire country, from banditry in the northwest to separatist violence in the southeast."
    :section-number="8"
  >
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Map -->
      <div class="lg:col-span-2">
        <ClientOnly>
          <div
            id="nigeria-svg-container"
            class="w-full"
            v-html="svgContent"
          />
          <template #fallback>
            <div class="w-full aspect-[8/7] bg-white-soft" />
          </template>
        </ClientOnly>

        <!-- Tooltip -->
        <Teleport to="body">
          <div
            v-if="hoveredState"
            class="fixed z-[100] pointer-events-none bg-black-soft text-white px-4 py-3 rounded shadow-lg border-t-2 border-green text-sm max-w-64"
            :style="{ left: tooltipPos.x + 12 + 'px', top: tooltipPos.y - 10 + 'px' }"
          >
            <p class="font-bold">{{ hoveredState }}</p>
            <p class="text-white/60 text-xs mt-0.5">{{ hoveredZone }}</p>
          </div>
        </Teleport>

        <!-- Legend -->
        <div class="flex flex-wrap gap-4 mt-4 text-xs text-black-text/60">
          <span v-for="stat in zoneStats" :key="stat.zone" class="flex items-center gap-1.5">
            <span class="w-3 h-3 inline-block" :style="{ background: stat.color }" />
            {{ stat.zone }}
          </span>
        </div>
      </div>

      <!-- Zone stats sidebar -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-black mb-4">By Region</h3>
        <div
          v-for="stat in zoneStats"
          :key="stat.zone"
          class="border-l-2 border-green pl-4 py-2"
        >
          <p class="text-sm font-semibold text-black">{{ stat.zone }}</p>
          <p class="text-sm text-green font-medium mt-0.5">{{ stat.stat }}</p>
          <p class="text-xs text-black-text/50 mt-0.5">{{ stat.detail }}</p>
        </div>
      </div>
    </div>
  </UiSectionWrapper>
</template>
