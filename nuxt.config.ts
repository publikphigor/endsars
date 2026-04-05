import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@vueuse/motion/nuxt", "@nuxtjs/seo", "@posthog/nuxt"],

  runtimeConfig: {
    public: {
      posthog: {
        publicKey: process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN || "",
        host: process.env.NUXT_PUBLIC_POSTHOG_HOST || "",
      },
    },
  },

  posthogConfig: {
    publicKey: process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN || "",
    host: process.env.NUXT_PUBLIC_POSTHOG_HOST || "",
    clientConfig: {
      capture_exceptions: true,
      __add_tracing_headers: ["localhost", "endsars.online"],
    },
  },

  site: {
    url: "https://endsars.online",
    name: "EndSARS.online",
  },

  ogImage: {
    enabled: false,
  },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["echarts", "vue-echarts", "d3-geo", "d3-selection"],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ name: "theme-color", content: "#FFFFFF" }],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },

  nitro: {
    prerender: {
      routes: ["/"],
    },
  },
});
