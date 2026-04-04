<script setup lang="ts">
useSeoMeta({
  title: "EndSARS.online — A Decade of Decline: Nigeria's Governance in Numbers",
  description:
    "Explore 14 years of Nigerian governance data: Naira collapse, rising debt, inflation, poverty, violence & corruption — all sourced from World Bank, CBN & IMF.",
  ogTitle: "A Decade of Decline: Nigeria's Governance in Numbers",
  ogDescription:
    "Since 2015, the APC has governed Nigeria. The naira collapsed, inflation surged, and poverty deepened. This is not opinion — it is data.",
  ogImage: "https://endsars.online/og-image.png",
  ogImageWidth: "1200",
  ogImageHeight: "630",
  ogImageType: "image/png",
  ogType: "website",
  ogUrl: "https://endsars.online",
  ogSiteName: "EndSARS.online",
  twitterCard: "summary_large_image",
  twitterTitle: "A Decade of Decline: Nigeria's Governance in Numbers",
  twitterDescription:
    "Since 2015, the APC has governed Nigeria. The naira collapsed, inflation surged, and poverty deepened. This is not opinion — it is data.",
  twitterImage: "https://endsars.online/og-image.png",
});

useHead({
  htmlAttrs: { lang: "en" },
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "canonical", href: "https://endsars.online" },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "A Decade of Decline: Nigeria's Governance in Numbers",
          description:
            "Data-driven investigation into Nigerian governance from 2010 to present, covering exchange rates, inflation, debt, poverty, violence, and corruption.",
          url: "https://endsars.online",
          image: "https://endsars.online/og-image.png",
          datePublished: "2024-10-20",
          dateModified: "2026-04-04",
          publisher: {
            "@type": "Organization",
            name: "EndSARS.online",
            url: "https://endsars.online",
          },
          author: {
            "@type": "Organization",
            name: "EndSARS.online",
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
            "Aggregated dataset of Nigerian socioeconomic and governance indicators including exchange rates, inflation, fuel prices, national debt, poverty metrics, conflict events, and corruption indices.",
          url: "https://endsars.online",
          license: "https://creativecommons.org/licenses/by/4.0/",
          temporalCoverage: "2010/2026",
          spatialCoverage: {
            "@type": "Place",
            name: "Nigeria",
          },
          creator: {
            "@type": "Organization",
            name: "EndSARS.online",
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
    <SectionsPowerSection />
    <SectionsNairaSection />
    <SectionsCostOfLivingSection />
    <SectionsDebtSection />
    <SectionsPovertySection />
    <SectionsViolenceSection />
    <SectionsCorruptionSection />
    <SectionsMapSection />
    <SectionsSourcesSection />
    <SectionsFooterSection />
  </div>
</template>
