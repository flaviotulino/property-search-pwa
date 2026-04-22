<script setup>
import { useRegisterSW } from "virtual:pwa-register/vue";

const { needRefresh, updateServiceWorker } = useRegisterSW();

const refreshApp = () => {
  updateServiceWorker(true); // This reloads the page and updates the PWA
};
</script>

<template>
  <div
    v-if="needRefresh"
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center space-y-4 z-50"
  >
    <span>New content available, click on reload button to update.</span>
    <button @click="refreshApp">Reload</button>
  </div>

  <v-ons-page v-else>
    <RouterView :key="$route.fullPath" />
  </v-ons-page>
</template>

<style scoped></style>
