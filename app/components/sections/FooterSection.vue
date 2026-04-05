<script setup lang="ts">
const currentYear = new Date().getFullYear()
const posthog = usePostHog()

function trackFooterLink(label: string) {
  posthog?.capture('footer_link_clicked', { label })
}
</script>

<template>
  <footer class="bg-white-soft border-t-2 border-green">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <!-- Logo and tagline -->
        <div>
          <UiLogo size="md" block />
          <p class="text-sm text-black-text/50 mt-3 max-w-md">
            Built with data from the World Bank, CBN, NBS, Transparency International, ACLED, and others.
          </p>
        </div>

        <!-- Links -->
        <div class="flex flex-col items-start md:items-end gap-2">
          <a
            href="https://github.com/publikphigor/endsars"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-black-text/50 hover:text-green transition-colors duration-150"
            @click="trackFooterLink('open_source')"
          >
            This project is open source &nearr;
          </a>
          <a
            href="https://github.com/publikphigor/endsars/issues"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-black-text/50 hover:text-green transition-colors duration-150"
            @click="trackFooterLink('flag_false_info')"
          >
            Flag false information &nearr;
          </a>
          <a
            href="mailto:publikphigor@gmail.com"
            class="text-sm text-black-text/50 hover:text-green transition-colors duration-150"
            @click="trackFooterLink('contact_developer')"
          >
            Contact Developer
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
