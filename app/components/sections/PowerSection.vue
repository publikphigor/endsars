<script setup lang="ts">
const { governmentOfficials } = useDatasets();

interface TimelineEra {
  president: string;
  vp: string;
  party: string;
  years: string;
  keyEvents: string[];
  isCurrent: boolean;
}

const administrations = governmentOfficials.administrations;

// Merge Buhari's two terms
const eras = computed<TimelineEra[]>(() => {
  const jonathan = administrations[0]!;
  const buhariFirst = administrations[1]!;
  const buhariSecond = administrations[2]!;
  const tinubu = administrations[3]!;

  const buhariEvents = [...buhariFirst.keyEvents, ...buhariSecond.keyEvents];

  return [
    {
      president: jonathan.president,
      vp: jonathan.vicePresident,
      party: jonathan.party,
      years: "2010 - 2015",
      keyEvents: jonathan.keyEvents,
      isCurrent: false,
    },
    {
      president: "Muhammadu Buhari",
      vp: "Yemi Osinbajo",
      party: "APC",
      years: "2015 - 2023",
      keyEvents: buhariEvents,
      isCurrent: false,
    },
    {
      president: tinubu.president,
      vp: tinubu.vicePresident,
      party: tinubu.party,
      years: "2023 - Present",
      keyEvents: tinubu.keyEvents,
      isCurrent: true,
    },
  ];
});
</script>

<template>
  <UiSectionWrapper
    id="power"
    title="Who Holds Power"
    subtitle="A timeline of Nigerian administrations and some key events that defined them."
    :section-number="1"
  >
    <!-- Horizontal timeline line -->
    <div class="relative">
      <!-- Desktop horizontal layout -->
      <div class="hidden md:block">
        <!-- Timeline bar -->
        <div class="relative h-1 bg-black/10 mb-12">
          <!-- PDP segment -->
          <div class="absolute left-0 top-0 h-full w-1/3 bg-black/20" />
          <!-- APC segment -->
          <div class="absolute left-1/3 top-0 h-full w-2/3 bg-green" />
          <!-- Party change marker -->
          <div class="absolute left-1/3 -top-3 flex flex-col items-center">
            <div class="w-4 h-4 bg-green border-2 border-black rotate-45" />
            <span
              class="text-xs text-green font-semibold mt-3 whitespace-nowrap"
              >2015 — APC takes power</span
            >
          </div>
        </div>

        <!-- Era cards -->
        <div class="grid grid-cols-3 gap-8">
          <div
            v-for="(era, index) in eras"
            :key="era.president"
            v-motion
            :initial="{ opacity: 0 }"
            :visible-once="{ opacity: 1, transition: { duration: 500 } }"
            class="relative"
            :class="
              era.isCurrent
                ? 'border-l-2 border-green pl-5'
                : 'border-l-2 border-black/20 pl-5'
            "
          >
            <!-- Party badge -->
            <span
              class="inline-block text-xs font-semibold px-2 py-0.5 mb-3"
              :class="
                era.party === 'PDP'
                  ? 'bg-black/5 text-black'
                  : 'bg-green/20 text-green'
              "
            >
              {{ era.party }}
            </span>

            <h3 class="text-xl font-bold text-black">{{ era.president }}</h3>
            <p class="text-sm text-black-text/50 mt-1">VP: {{ era.vp }}</p>
            <p class="text-sm text-black-text/50">{{ era.years }}</p>

            <!-- Key events -->
            <ul class="mt-4 space-y-2">
              <li
                v-for="event in era.keyEvents"
                :key="event"
                class="text-sm text-black-text/70 flex items-start"
              >
                <span
                  class="inline-block w-1 h-1 mt-2 mr-2 shrink-0"
                  :class="era.isCurrent ? 'bg-green' : 'bg-black/20'"
                />
                {{ event }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Mobile vertical layout -->
      <div class="md:hidden space-y-8">
        <div
          v-for="(era, index) in eras"
          :key="era.president"
          v-motion
          :initial="{ opacity: 0 }"
          :visible-once="{ opacity: 1, transition: { duration: 500 } }"
          class="relative pl-6"
          :class="
            era.isCurrent
              ? 'border-l-2 border-green'
              : 'border-l-2 border-black/20'
          "
        >
          <!-- Party change marker (before Buhari) -->
          <div
            v-if="index === 1"
            class="absolute -left-[5px] -top-4 flex items-center"
          >
            <div class="w-2.5 h-2.5 bg-green rotate-45" />
            <span class="text-xs text-green font-semibold ml-3"
              >APC takes power</span
            >
          </div>

          <!-- Party badge -->
          <span
            class="inline-block text-xs font-semibold px-2 py-0.5 mb-2"
            :class="
              era.party === 'PDP'
                ? 'bg-black/5 text-black'
                : 'bg-green/20 text-green'
            "
          >
            {{ era.party }}
          </span>

          <h3 class="text-lg font-bold text-black">{{ era.president }}</h3>
          <p class="text-sm text-black-text/50 mt-0.5">VP: {{ era.vp }}</p>
          <p class="text-sm text-black-text/50">{{ era.years }}</p>

          <ul class="mt-3 space-y-1.5">
            <li
              v-for="event in era.keyEvents"
              :key="event"
              class="text-sm text-black-text/70 flex items-start"
            >
              <span
                class="inline-block w-1 h-1 mt-2 mr-2 shrink-0"
                :class="era.isCurrent ? 'bg-green' : 'bg-black/20'"
              />
              {{ event }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </UiSectionWrapper>
</template>
