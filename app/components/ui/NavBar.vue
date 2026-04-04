<script setup lang="ts">
const links = [
  { label: 'Power', href: '#power' },
  { label: 'Naira', href: '#naira' },
  { label: 'Cost of Living', href: '#cost-of-living' },
  { label: 'Debt', href: '#debt' },
  { label: 'Poverty', href: '#poverty' },
  { label: 'Violence', href: '#violence' },
  { label: 'Corruption', href: '#corruption' },
  { label: 'Map', href: '#map' },
]

const scrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 20
}

function scrollTo(href: string) {
  mobileOpen.value = false
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 border-b border-green transition-all duration-300',
      scrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-white',
    ]"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="shrink-0">
          <UiLogo size="sm" />
        </NuxtLink>

        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-6">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="text-sm text-black-text/70 hover:text-black transition-colors duration-150"
            @click.prevent="scrollTo(link.href)"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden p-2 text-black-soft"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
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
        class="md:hidden bg-white border-t border-green/20"
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
