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

function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value
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
        <div class="hidden xl:flex items-center gap-5">
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
