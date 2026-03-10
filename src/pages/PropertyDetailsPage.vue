<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-toolbar-button
          @click="onBackButtonClick"
          icon="ion-ios-menu, material: md-arrow-back"
        ></v-ons-toolbar-button>
      </div>

      <div class="center">Property Search</div>
    </v-ons-toolbar>

    <template v-if="property">
      <div
        class="bg-no-repeat bg-cover w-full h-48"
        :style="{ backgroundImage: `url(${property.photos[0]})` }"
      />

      <div class="">
        <div
          class="space-y-1 flex flex-col px-4 border-b border-gray-200 border-2 pb-2"
        >
          <div class="mt-2 font-bold text-xl">{{ property.address }}</div>
          <div class="text-gray-500">{{ property.price }}</div>
        </div>

        <section>
          <PropertyDistanceSection
            @on-distance-click="openDirection"
            label="Transport"
            :section="property.stations"
          />
        </section>

        <section>
          <PropertyDistanceSection
            @on-distance-click="openDirection"
            label="Groceries"
            :section="property.groceries"
          />
        </section>

        <section>
          <PropertyDistanceSection
            @on-distance-click="openDirection"
            label="Schools"
            :section="property.schools"
          />
        </section>
      </div>
    </template>
  </v-ons-page>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import usePropertyStore from "../store/properties";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import PropertyDistanceSection from "../components/PropertyDistanceSection.vue";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const propertyStore = usePropertyStore();

const { data: properties } = storeToRefs(propertyStore);

const property = ref();

onMounted(() => {
  let item;

  if (route.meta.isParsing) {
    // axios.post("https://property-search.flaviotulino.com/api/properties/parse",
    //     data: {
    //       url: route.query.url,
    // })
  } else {
    item = properties.value.find((p) => p.id === route.params.id);
  }

  function sortByDuration(a, b) {
    return parseInt(a.duration.walking) - parseInt(b.duration.walking);
  }

  property.value = {
    ...item,
    schools: item.schools.sort(sortByDuration),
    groceries: item.groceries.sort(sortByDuration),
    stations: item.stations.sort(sortByDuration),
  };
});

function openDirection(target, travelMode) {
  const baseUrl = new URL("https://www.google.com/maps/dir/?api=1");
  baseUrl.searchParams.set("origin", property.value.address);
  baseUrl.searchParams.set("origin_place_id", property.value.placeId);
  baseUrl.searchParams.set("destination", target.displayName);
  baseUrl.searchParams.set("destination_place_id", target.placeId);
  baseUrl.searchParams.set("travelmode", travelMode);

  const url = baseUrl.toString();

  window.open(url, "_blank", "noopener,noreferrer");
}

function onBackButtonClick() {
  router.push({
    name: "property.list",
    query: {
      locality: property.value.locality,
    },
  });
}
</script>

<style scoped>
@reference "tailwindcss";

section {
  @apply px-4 py-2;
}

section:not(:last-child) {
  @apply border-b border-gray-200 border-2;
}
</style>
