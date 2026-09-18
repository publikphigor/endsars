<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white-soft border-t border-black/10">
    <div class="page-container py-12">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <!-- Logo and tagline -->
        <div>
          <UiLogo size="md" block />
          <p class="text-sm text-black-text/50 mt-3 max-w-md">
            Built on public data from the CBN, NBS, DMO, World Bank, IMF, ACLED, Afrobarometer and others.
            Illustrations are AI-generated.
          </p>
        </div>

        <!-- Links -->
        <div class="flex flex-col items-start md:items-end gap-2">
          <a
            href="https://github.com/publikphigor/endsars"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-black-text/50 hover:text-green transition-colors duration-150"
          >
            This project is open source &nearr;
          </a>
          <a
            href="https://github.com/publikphigor/endsars/issues"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-black-text/50 hover:text-green transition-colors duration-150"
          >
            Flag false information &nearr;
          </a>
          <a
            href="https://koladeleolaitan.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-black-text/50 hover:text-green transition-colors duration-150"
          >
            Developed by K. Olaitan &nearr;
          </a>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p class="text-xs text-black-text/30">
          &copy; {{ currentYear }} endsars.online. All data is publicly sourced.
        </p>
        <p class="text-xs text-black-text/30">
          No affiliation with any political party or government body.
        </p>
      </div>
    </div>
  </footer>
</template>
