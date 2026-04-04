<script setup lang="ts">
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

use([
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

const { violence } = useDatasets();

// Years with quantitative data for bar chart
const quantitativeYears = computed(() =>
  violence.data.filter((d) => d.killings !== null && d.kidnappings !== null),
);

// ALL years for the timeline (including those with numbers — show key events for everything)
const timelineYears = computed(() =>
  violence.data.filter((d) => d.keyEvents && d.keyEvents.length > 0),
);

const chartOption = computed(() => ({
  backgroundColor: "transparent",
  tooltip: {
    trigger: "axis" as const,
    backgroundColor: "#FFFFFF",
    borderColor: "#008751",
    borderWidth: 1,
    textStyle: { color: "#0A0A0A", fontFamily: "Space Grotesk" },
    formatter(params: any) {
      const items = Array.isArray(params) ? params : [params];
      const year = items[0].name.replace("*", "");
      const entry = quantitativeYears.value.find(
        (d) => String(d.year) === year,
      );
      let html = `<strong>${year}</strong>${entry?.partial ? ' <span style="color:#008751">(H1 only)</span>' : ""}<br/>`;
      items.forEach((item: any) => {
        html += `<span style="color:${item.color}">●</span> ${item.seriesName}: <strong>${item.value?.toLocaleString() ?? "N/A"}</strong><br/>`;
      });
      return html;
    },
  },
  legend: {
    data: ["Killings", "Kidnappings"],
    textStyle: { color: "#1A1A1A", fontFamily: "Space Grotesk" },
    top: 0,
    itemGap: 24,
  },
  grid: {
    left: 60,
    right: 24,
    top: 40,
    bottom: 40,
  },
  xAxis: {
    type: "category" as const,
    data: quantitativeYears.value.map((d) =>
      d.partial ? `${d.year}*` : String(d.year),
    ),
    axisLine: { lineStyle: { color: "#E0E0E0" } },
    axisLabel: { color: "#1A1A1A", fontFamily: "Space Grotesk" },
    axisTick: { show: false },
  },
  yAxis: {
    type: "value" as const,
    axisLine: { show: false },
    axisLabel: {
      color: "#1A1A1A",
      fontFamily: "Space Grotesk",
      formatter(val: number) {
        return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : String(val);
      },
    },
    splitLine: { lineStyle: { color: "#F0F0F0" } },
  },
  series: [
    {
      name: "Killings",
      type: "bar",
      data: quantitativeYears.value.map((d) => d.killings),
      itemStyle: { color: "#C0392B", borderRadius: [2, 2, 0, 0] },
      barGap: "10%",
    },
    {
      name: "Kidnappings",
      type: "bar",
      data: quantitativeYears.value.map((d) => d.kidnappings),
      itemStyle: { color: "#008751", borderRadius: [2, 2, 0, 0] },
    },
  ],
}));
</script>

<template>
  <UiSectionWrapper
    id="violence"
    title="Blood on the Ground"
    title-html="<span style='color:#C0392B'>Blood</span> on the Ground"
    subtitle="Conflict fatalities and kidnappings tracked from credible sources."
    :section-number="6"
    dark
  >
    <div class="space-y-12">
      <!-- Hero stats -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :visible-once="{ opacity: 1, transition: { duration: 500 } }"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div class="text-center md:text-left">
          <p
            class="text-sm text-green font-semibold tracking-widest uppercase mb-2"
          >
            2024
          </p>
          <UiCountUp :value="9662" suffix=" killed" :duration="2500" />
          <p class="text-sm text-black-text/50 mt-1">
            Conflict deaths (ACLED)
            <UiCitation
              source="ACLED 2024 Conflict Index"
              url="https://acleddata.com/infographic/nigeria-2024-conflict-index-infographic"
              :number="1"
            />
          </p>
        </div>
        <div class="text-center md:text-left">
          <p
            class="text-sm text-green font-semibold tracking-widest uppercase mb-2"
          >
            2024
          </p>
          <UiCountUp :value="7568" suffix=" kidnapped" :duration="2500" />
          <p class="text-sm text-black-text/50 mt-1">
            Abducted in 12 months
            <UiCitation
              source="OCCRP"
              url="https://www.occrp.org/en/news/surge-in-nigeria-7500-abducted-1056-killed-in-a-year"
              :number="2"
            />
          </p>
        </div>
        <div class="text-center md:text-left">
          <p
            class="text-sm text-green font-semibold tracking-widest uppercase mb-2"
          >
            2025 (H1)
          </p>
          <UiCountUp :value="6800" suffix=" killed" :duration="2500" />
          <p class="text-sm text-black-text/50 mt-1">
            In just 6 months
            <UiCitation
              source="Sahara Reporters / Intersociety"
              url="https://saharareporters.com/2025/07/13/zamfara-tops-list-nigeria-records-5400-kidnappings-6800-deaths-6-months-report"
              :number="3"
            />
          </p>
        </div>
      </div>

      <!-- Daily callout -->
      <div class="border-l-4 border-green bg-white-soft px-6 py-5">
        <p class="text-xl md:text-2xl font-bold text-black">
          ₦2.23 trillion paid in ransoms in a single year
        </p>
        <p class="text-sm text-black-text/50 mt-1">
          NBS Crime Survey (May 2023 – Apr 2024). Kidnapping has become a
          multi-billion naira industry.
          <UiCitation
            source="NBS Crime Experience Survey"
            url="https://nannews.ng/2024/12/18/kidnapping-incidence-estimated-at-2-2m-cases-nbs/"
            :number="4"
          />
        </p>
      </div>

      <!-- Grouped bar chart -->
      <div>
        <h3 class="text-lg font-semibold text-black mb-1">
          <span style="color: #C0392B">Killings</span> and Kidnappings (2023 - 2025)
        </h3>
        <p class="text-xs text-black-text/40 mb-4">
          * 2025 data covers first half only (January - June)
        </p>
        <ClientOnly>
          <VChart :option="chartOption" autoresize class="chart-container" />
          <template #fallback>
            <div class="chart-container bg-white-medium" />
          </template>
        </ClientOnly>
        <div class="flex flex-wrap gap-4 mt-3 text-xs text-black-text/40">
          <span>Sources: ACLED, NHRC, TheCable, Sahara Reporters, OCCRP</span>
        </div>
      </div>

      <!-- Timeline: ALL years key events -->
      <div>
        <h3 class="text-lg font-semibold text-black mb-6">
          Timeline of Conflict (2010 - 2026)
        </h3>
        <p class="text-sm text-black-text/50 mb-8">
          Key security events documented from credible sources across every
          year.
        </p>

        <div class="relative">
          <!-- Vertical timeline line -->
          <div
            class="absolute left-3 md:left-4 top-0 bottom-0 w-px bg-black/20"
          />

          <div class="space-y-6">
            <div
              v-for="entry in timelineYears"
              :key="entry.year"
              class="relative pl-10 md:pl-12"
            >
              <!-- Year dot -->
              <div
                :class="[
                  'absolute left-1.5 md:left-2.5 top-1 w-3 h-3 border-2',
                  entry.year >= 2023
                    ? 'border-green bg-green'
                    : 'border-green bg-white-soft',
                ]"
              />

              <div>
                <span class="text-green font-bold text-sm">
                  {{ entry.year }}
                  <span
                    v-if="entry.killings"
                    class="text-black-text/50 font-normal ml-2"
                  >
                    {{ entry.killings.toLocaleString() }} killed
                    <template v-if="entry.kidnappings">
                      · {{ entry.kidnappings.toLocaleString() }} kidnapped
                    </template>
                    <template v-if="entry.partial"> (partial year)</template>
                  </span>
                </span>
                <ul class="mt-1 space-y-1">
                  <li
                    v-for="event in entry.keyEvents"
                    :key="event"
                    class="text-sm text-black-text/70 flex items-start"
                  >
                    <span
                      class="inline-block w-1 h-1 mt-2 mr-2 shrink-0 bg-black-text/40"
                    />
                    {{ event }}
                  </li>
                </ul>
                <p v-if="entry.note" class="text-xs text-black-text/40 mt-1">
                  {{ entry.note }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data note -->
      <div
        class="bg-white-soft border border-black/10 px-6 py-4 text-sm text-black-text/50"
      >
        <p>
          Conflict data sourced from ACLED, the National Human Rights
          Commission, NBS, TheCable, Sahara Reporters, Human Rights Watch,
          Amnesty International, and credible media reports. Numbers may vary
          between sources due to different methodologies and underreporting.
        </p>
      </div>
    </div>
  </UiSectionWrapper>
</template>
