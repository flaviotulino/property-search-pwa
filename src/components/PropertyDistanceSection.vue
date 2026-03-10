<template>
  <div class="flex flex-col mt-4">
    <div class="text-lg font-bold">{{ label }}</div>

    <div class="flex flex-row items-center py-2" v-for="item in section">
      <div class="w-2/4 pr-2">{{ item.displayName }}</div>

      <button
        @click="$emit('onDistanceClick', item, 'walking')"
        class="bg-blue-200 px-2 py-2 text-blue-700 rounded-full mr-2 text-sm font-bold shadow w-1/4"
      >
        <v-ons-ripple></v-ons-ripple>

        <i class="fa-solid fa-person-walking"></i>
        {{ item.duration.walking }}
      </button>

      <button
        @click="$emit('onDistanceClick', item, 'transit')"
        class="bg-blue-200 px-2 py-2 text-blue-700 rounded-full text-sm font-bold shadow w-1/4"
      >
        <v-ons-ripple></v-ons-ripple>

        <i class="fa-solid fa-train"></i>
        {{ item.duration.transit }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(["label", "section"]);
defineEmits(["onDistanceClick"]);
</script>
