<script setup>
import { onMounted } from "vue";
// import PWABadge from "./components/PWABadge.vue";
import usePropertyStore from "./store/properties";
import axios from "axios";
import ToolBar from "./components/ToolBar.vue";
</script>

<template>
  <v-ons-page>
    <RouterView />
  </v-ons-page>
</template>

<style scoped></style>
