<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-toolbar-button
          @click="onBackButtonClick"
          icon="ion-ios-arrow-back, material: md-arrow-back"
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
            <span class="font-bold text-lg">Details</span>
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
            v-for="section in sections"
            @on-distance-click="openDirection"
            :section="section"
          />
        </div>

        <div
          v-if="$route.meta.isParsing && !property.exists"
          class="flex flex-col items-center space-y-2"
        >
          <button @click="addProperty" class="primary">
            <i class="fa-solid fa-heart-circle-plus"></i>
            <span class="grow">Add to your list</span>
          </button>

          <button @click="onBackButtonClick" class="secondary">
            <i class="fa-solid fa-arrow-rotate-left"></i>
            <span class="grow">Cancel</span>
          </button>
        </div>

        <div v-else class="flex flex-col space-y-2">
          <button @click="openSource" class="primary">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
            <span class="grow"> See on {{ property.channel }}</span>
          </button>
          <button
            @click="
              $ons.notification
                .confirm('This will remove this property from your list')
                .then(deleteProperty)
            "
            class="secondary"
          >
            <i class="fa-solid fa-heart-circle-minus"></i>
            <span class="grow">Remove from the list</span>
          </button>
        </div>
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

const sections = computed(() => [
  {
    label: "Transports",
    icon: "bus",
    details: property.value.stations,
  },
  {
    label: "Groceries",
    icon: "cart-shopping",
    details: property.value.groceries,
  },
  {
    label: "Schools",
    icon: "school",
    details: property.value.schools,
  },
]);

onMounted(async () => {
  let item;

  if (route.meta.isParsing) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const text = route.query.text;
    const match = text.match(urlRegex);
    if (match) {
      const url = match[0];
      const response = await axios.post(
        "https://property-search-api.flaviotulino.com/properties/parse",
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

function deleteProperty(choice) {
  if (choice === 0) return false;

  axios
    .delete(
      `https://property-search-api.flaviotulino.com/properties/${property.value.id}`,
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
      "https://property-search-api.flaviotulino.com/properties",
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

function openSource() {
  window.open(property.value.url, "_blank", "noopener,noreferrer");
}
</script>

<style scoped>
@reference "tailwindcss";

button.primary {
  @apply flex flex-row items-center space-x-2 justify-evenly bg-black border p-3 rounded-md shadow grow font-bold text-white uppercase w-full;
}

button.secondary {
  @apply flex flex-row items-center space-x-2 justify-evenly border text-black p-3 rounded-md shadow uppercase font-bold w-full;
}
</style>
