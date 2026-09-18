<script setup lang="ts">
const links = [
  { label: '2020', href: '#lekki' },
  { label: 'Naira', href: '#naira' },
  { label: 'Prices', href: '#cost-of-living' },
  { label: 'Debt', href: '#debt' },
  { label: 'Poverty', href: '#poverty' },
  { label: 'Electricity', href: '#grid' },
  { label: 'Health', href: '#health' },
  { label: 'Japa', href: '#japa' },
  { label: 'Violence', href: '#violence' },
  { label: 'Corruption', href: '#corruption' },
  { label: '2027', href: '#vote' },
]

// Sections without their own nav link light up the nearest one
const sectionToLink: Record<string, string> = {
  lekki: '#lekki',
  power: '#lekki',
  naira: '#naira',
  'cost-of-living': '#cost-of-living',
  debt: '#debt',
  poverty: '#poverty',
  grid: '#grid',
  health: '#health',
  japa: '#japa',
  violence: '#violence',
  map: '#violence',
  corruption: '#corruption',
  vote: '#vote',
  sources: '#vote',
}

const scrolled = ref(false)
const mobileOpen = ref(false)
const active = ref<string | null>(null)
const hovered = ref<string | null>(null)

// Sliding highlight behind the desktop links
const linkEls = new Map<string, HTMLElement>()
const pill = ref({ left: 0, width: 0, visible: false })
const target = computed(() => hovered.value ?? active.value)

function setLinkEl(href: string, el: unknown) {
  if (el instanceof HTMLElement) linkEls.set(href, el)
}

function placePill() {
  const el = target.value ? linkEls.get(target.value) : undefined
  pill.value = el
    ? { left: el.offsetLeft, width: el.offsetWidth, visible: true }
    : { ...pill.value, visible: false }
}

watch(target, placePill)

function updateActive() {
  const line = window.innerHeight * 0.35
  let current: string | null = null
  for (const section of document.querySelectorAll<HTMLElement>('section[id]')) {
    if (section.getBoundingClientRect().top <= line) current = sectionToLink[section.id] ?? null
    else break
  }
  active.value = current
}

let frame = 0
function onScroll() {
  scrolled.value = window.scrollY > 20
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(updateActive)
}

function scrollTo(href: string) {
  mobileOpen.value = false
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', placePill, { passive: true })
  onScroll()
  // Link widths change once the web font loads
  document.fonts?.ready.then(placePill)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', placePill)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 border-b border-black/10 transition-all duration-300',
      scrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-white',
    ]"
  >
    <div class="page-container">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="shrink-0">
          <UiLogo size="sm" />
        </NuxtLink>

        <!-- Desktop links -->
        <div class="hidden xl:flex relative items-center gap-1" @mouseleave="hovered = null">
          <span
            aria-hidden="true"
            class="nav-pill absolute top-1/2 h-8 rounded-full bg-green/10 pointer-events-none"
            :style="{
              width: `${pill.width}px`,
              transform: `translate(${pill.left}px, -50%)`,
              opacity: pill.visible ? 1 : 0,
            }"
          />
          <a
            v-for="link in links"
            :key="link.href"
            :ref="el => setLinkEl(link.href, el)"
            :href="link.href"
            :aria-current="active === link.href ? 'location' : undefined"
            class="relative px-3 py-1.5 text-sm transition-colors duration-200"
            :class="target === link.href ? 'text-green' : 'text-black-text/70'"
            @mouseenter="hovered = link.href"
            @focus="hovered = link.href"
            @blur="hovered = null"
            @click.prevent="scrollTo(link.href)"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="xl:hidden p-2 text-black-soft"
          aria-label="Toggle menu"
          @click="toggleMobileMenu()"
        >
          <svg
            v-if="!mobileOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileOpen"
        class="xl:hidden bg-white border-t border-black/10"
      >
        <div class="px-4 py-4 space-y-1">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="block px-3 py-2 text-sm text-black-text/70 hover:text-black hover:bg-black/5 rounded transition-colors duration-150"
            @click.prevent="scrollTo(link.href)"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.nav-pill {
  left: 0;
  transition:
    transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
    width 300ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 200ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .nav-pill {
    transition: opacity 150ms ease;
  }
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 200ms ease, max-height 200ms ease;
  overflow: hidden;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
