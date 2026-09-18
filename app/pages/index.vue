<script setup lang="ts">
useSeoMeta({
  title: "A decade of decline: Nigeria in numbers",
  description: "How Nigeria has been governed since 2010: the naira, prices, debt, poverty, power, health, emigration, violence and corruption. Every number is sourced.",
  ogTitle: "A decade of decline: Nigeria in numbers",
  ogDescription: "Since 2010 the naira has collapsed, prices have soared and killings have spread. 15,878 Nigerians were killed in 2025. 63% are poor. Every number is sourced.",
  ogImage: "https://endsars.online/og-image.jpg?v=2",
  ogImageSecureUrl: "https://endsars.online/og-image.jpg?v=2",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: "image/jpeg",
  ogImageAlt: "A decade of decline: how Nigeria has been governed since 2010, in sourced numbers. ₦196 to ₦1,331 per dollar, 15,878 killed in 2025, 63% below the poverty line.",
  ogType: "website",
  ogUrl: "https://endsars.online/",
  ogSiteName: "endsars.online",
  ogLocale: "en_NG",
  twitterCard: "summary_large_image",
  twitterTitle: "A decade of decline: Nigeria in numbers",
  twitterDescription: "Since 2010 the naira has collapsed, prices have soared and killings have spread. 15,878 Nigerians were killed in 2025. 63% are poor. Every number is sourced.",
  twitterImage: "https://endsars.online/og-image.jpg?v=2",
  twitterImageAlt: "A decade of decline: how Nigeria has been governed since 2010, in sourced numbers. ₦196 to ₦1,331 per dollar, 15,878 killed in 2025, 63% below the poverty line.",
  robots: "index, follow, max-image-preview:large",
});

useHead({
  htmlAttrs: { lang: "en" },
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "canonical", href: "https://endsars.online/" },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Six Years After Lekki: Nigeria in Numbers",
          description:
            "What happened to Nigeria after the #EndSARS protests: the naira, prices, debt, poverty, power, health, emigration, violence and corruption, with every number sourced.",
          url: "https://endsars.online",
          image: "https://endsars.online/og-image.jpg?v=2",
          datePublished: "2024-10-20",
          dateModified: "2026-09-18",
          publisher: {
            "@type": "Organization",
            name: "endsars.online",
            url: "https://endsars.online",
          },
          author: {
            "@type": "Organization",
            name: "endsars.online",
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://endsars.online",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Nigeria Governance Indicators (2010–Present)",
          description:
            "Nigerian socioeconomic and governance indicators, 2010 to 2026: exchange rates, inflation, fuel and food prices, public debt, poverty, food insecurity, electricity, health, education, emigration, political violence, corruption, civic space and elections.",
          url: "https://endsars.online",
          license: "https://creativecommons.org/licenses/by/4.0/",
          temporalCoverage: "2010/2026",
          spatialCoverage: {
            "@type": "Place",
            name: "Nigeria",
          },
          creator: {
            "@type": "Organization",
            name: "endsars.online",
          },
          distribution: [
            {
              "@type": "DataDownload",
              encodingFormat: "text/html",
              contentUrl: "https://endsars.online",
            },
          ],
          sourceOrganization: [
            { "@type": "Organization", name: "World Bank" },
            { "@type": "Organization", name: "Central Bank of Nigeria (CBN)" },
            { "@type": "Organization", name: "National Bureau of Statistics (NBS)" },
            { "@type": "Organization", name: "International Monetary Fund (IMF)" },
            { "@type": "Organization", name: "Transparency International" },
            { "@type": "Organization", name: "Armed Conflict Location & Event Data Project (ACLED)" },
            { "@type": "Organization", name: "Debt Management Office (DMO)" },
            { "@type": "Organization", name: "Afrobarometer" },
            { "@type": "Organization", name: "SBM Intelligence" },
          ],
        },
      ]),
    },
  ],
});
</script>

<template>
  <div>
    <SectionsHeroSection />
    <SectionsEndsarsSection />
    <SectionsPowerSection />
    <SectionsNairaSection />
    <SectionsCostOfLivingSection />
    <SectionsDebtSection />
    <SectionsPovertySection />
    <SectionsElectricitySection />
    <SectionsHealthSection />
    <SectionsJapaSection />
    <SectionsViolenceSection />
    <SectionsMapSection />
    <SectionsCorruptionSection />
    <SectionsVoteSection />
    <SectionsSourcesSection />
    <SectionsFooterSection />
  </div>
</template>
