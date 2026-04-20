<script setup>
import { onMounted } from "vue";
// import PWABadge from "./components/PWABadge.vue";
import usePropertyStore from "./store/properties";
import axios from "axios";
import ToolBar from "./components/ToolBar.vue";

const propertyStore = usePropertyStore();

onMounted(() => {
  if (propertyStore.data) {
    return true;
  }

  axios
    .get("https://property-search-api.flaviotulino.com/properties")
    .then((response) => {
      setTimeout(() => {
        propertyStore.setProperties(response.data.properties);
      }, 500);
    });
});
</script>

<template>
  <v-ons-page>
    <RouterView v-if="propertyStore.data" />
    <template v-else>
      <ToolBar />
      <div>Loading</div>
    </template>
  </v-ons-page>
</template>

<style scoped></style>
