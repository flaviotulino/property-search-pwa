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
        class="bg-no-repeat bg-cover w-full h-60"
        :style="{ backgroundImage: `url(${property.photos[0]})` }"
      />

      <div class="p-4 flex flex-col space-y-4">
        <div class="space-y-1 flex flex-col bg-white rounded-md">
          <div
            class="border-b border-gray-200 flex flex-row items-center px-4 py-2 space-x-2"
          >
            <div
              class="bg-black flex flex-row items-center justify-center w-8 h-8 rounded-full"
            >
              <i class="fa-solid fa-info text-white"></i>
            </div>
            <span class="text-lg font-bold">Details</span>
          </div>
          <div class="px-4 py-2">
            <div class="font-bold text-lg">{{ property.address }}</div>
            <div class="text-gray-500">{{ property.price }}</div>

            <div class="flex flex-row items-center space-x-4 mt-2 -mx-1">
              <div class="flex flex-row items-center space-x-1">
                <i class="fa-solid fa-droplet text-blue-500"></i>
                <span>{{ property.bathrooms }}</span>
              </div>

              <div class="flex flex-row items-center space-x-1">
                <i class="fa-solid fa-bed"></i>
                <span>{{ property.bedrooms }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col space-y-4">
          <PropertyDistanceSection
            @on-distance-click="openDirection"
            label="Transport"
            :section="property.stations"
          >
            <template #icon>
              <div
                class="bg-green-500 flex flex-row items-center justify-center w-8 h-8 rounded-full"
              >
                <i class="fa-solid fa-bus text-white"></i>
              </div>
            </template>
          </PropertyDistanceSection>

          <PropertyDistanceSection
            @on-distance-click="openDirection"
            label="Groceries"
            :section="property.groceries"
          >
            <template #icon>
              <div
                class="bg-purple-500 flex flex-row items-center justify-center w-8 h-8 rounded-full"
              >
                <i class="fa-solid fa-cart-shopping text-white"></i>
              </div>
            </template>
          </PropertyDistanceSection>

          <PropertyDistanceSection
            @on-distance-click="openDirection"
            label="Schools"
            :section="property.schools"
          >
            <template #icon>
              <div
                class="bg-orange-500 flex flex-row items-center justify-center w-8 h-8 rounded-full"
              >
                <i class="fa-solid fa-school text-white"></i>
              </div>
            </template>
          </PropertyDistanceSection>
        </div>

        <div
          v-if="$route.meta.isParsing && !property.exists"
          class="flex flex-row items-center space-x-2"
        >
          <button
            @click="onBackButtonClick"
            class="bg-gray-600 text-white p-4 rounded-md shadow text-lg uppercase font-bold"
          >
            Cancel
          </button>

          <button
            @click="addProperty"
            class="bg-green-800 border p-4 rounded-md shadow text-lg grow font-bold text-white uppercase"
          >
            Add to list
          </button>
        </div>

        <button
          v-else
          @click="deleteProperty"
          class="bg-red-700 text-white w-full p-4 rounded-md shadow text-lg uppercase font-bold"
        >
          Remove from list
        </button>
      </div>
    </template>
  </v-ons-page>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import usePropertyStore from "../store/properties";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import PropertyDistanceSection from "../components/PropertyDistanceSection.vue";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const propertyStore = usePropertyStore();

const { data: properties } = storeToRefs(propertyStore);

const property = ref();

onMounted(async () => {
  let item;

  if (route.meta.isParsing) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const text = route.query.text;
    const match = text.match(urlRegex);
    if (match) {
      const url = match[0]; // Output: https://property-search.flaviotulino.com/parse?id=123
      const response = await axios.post(
        "https://property-search.flaviotulino.com/api/properties/parse",
        {
          url,
        },
      );

      item = response.data;
    }
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

function deleteProperty() {
  axios
    .delete(
      `https://property-search.flaviotulino.com/api/properties/${property.value.id}`,
    )
    .then(() => {
      propertyStore.deleteProperty(property.value.id);
      router.push({
        name: "property.list",
        query: {
          locality: property.value.locality,
        },
      });
    });
}

function addProperty() {
  axios
    .post(
      "https://property-search.flaviotulino.com/api/properties",
      property.value,
    )
    .then(() => {
      propertyStore.addProperty(property.value);
      router.push({
        name: "property.list",
        query: {
          locality: property.value.locality,
        },
      });
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
