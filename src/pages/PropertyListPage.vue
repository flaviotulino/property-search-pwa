<template>
  <v-ons-page>
    <ToolBar />
    <v-ons-tabbar
      swipeable
      position="top"
      v-model:active-index="activeIndex"
      v-if="activeIndex !== undefined && localities.length > 0"
    >
      <template v-slot:pages>
        <v-ons-page v-for="locality in localities" :key="locality">
          <div
            @click="seePropertyDetails(property)"
            class="p-4"
            v-for="property in properties.filter(
              (p) => p.locality === locality,
            )"
            :key="property.id"
          >
            <PropertyCard :property="property" />
          </div>
        </v-ons-page>
      </template>

      <template v-if="localities.length > 0">
        <v-ons-tab
          v-for="(locality, index) in localities"
          :label="locality"
          :ref="(el) => (tabRefs[index] = el)"
        ></v-ons-tab>
      </template>
    </v-ons-tabbar>

    <template v-if="propertyStore.data?.length === 0">
      <ToolBar />
      <div class="flex flex-col items-center justify-center h-full space-y-4">
        <div class="text-gray-500">No properties found.</div>
      </div>
    </template>
  </v-ons-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import usePropertyStore from "../store/properties";
import { computed, nextTick, onMounted, onUpdated, ref } from "vue";
import { useRouter } from "vue-router";
import PropertyCard from "../components/PropertyCard.vue";
import { watch } from "vue";
import ToolBar from "../components/ToolBar.vue";

const router = useRouter();

const propertyStore = usePropertyStore();
const { data: properties } = storeToRefs(propertyStore);

const localities = computed(() => {
  return Array.from(
    new Set(properties.value.map((property) => property.locality)),
  ).sort((a, b) => a.localeCompare(b));
});

const activeIndex = ref();

function seePropertyDetails(property) {
  router.push({
    name: "property.details",
    params: { id: property.id },
  });
}

onMounted(() => {
  if (router.currentRoute.value.query.locality) {
    const index = localities.value.findIndex(
      (l) => l === router.currentRoute.value.query.locality,
    );
    activeIndex.value = index > -1 ? index : 0;
    router.replace({
      name: "property.list",
      query: null,
    });

    setTimeout(() => {
      tabRefs.value[activeIndex.value]?.$el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }, 100);
  } else {
    activeIndex.value = 0;
  }
});

const tabRefs = ref([]);

watch(activeIndex, async (i) => {
  await nextTick();

  tabRefs.value[i]?.$el.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
});
</script>

<style scoped>
/* Container of the tabs */
@reference "tailwindcss";
:deep(.tabbar) {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

/* Chrome / Safari / Edge */
:deep(.tabbar::-webkit-scrollbar) {
  display: none;
}

/* each tab keeps its natural width */
:deep(.tabbar .tabbar__item) {
  flex: 0 0 auto;
  min-width: 120px; /* adjust */
}
</style>
