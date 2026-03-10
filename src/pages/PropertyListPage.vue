<template>
  <v-ons-page>
    <ToolBar />
    <v-ons-tabbar
      swipeable
      position="top"
      :active-index="activeIndex"
      v-if="activeIndex !== undefined"
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

      <v-ons-tab v-for="locality in localities" :label="locality"></v-ons-tab>
    </v-ons-tabbar>
  </v-ons-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import usePropertyStore from "../store/properties";
import { computed, onMounted, onUpdated, ref } from "vue";
import { useRouter } from "vue-router";
import PropertyCard from "../components/PropertyCard.vue";
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
  } else {
    activeIndex.value = 0;
  }
});
</script>
