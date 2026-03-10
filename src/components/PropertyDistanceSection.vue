<template>
  <div class="bg-white rounded-md">
    <div class="flex flex-col">
      <div class="text-lg font-bold border-b border-gray-200 px-4 py-2">
        <div class="flex flex-row items-center space-x-2">
          <slot name="icon" />
          <span>{{ label }}</span>
        </div>
      </div>

      <div
        class="flex flex-col p-4 border-b border-gray-200 last:border-0"
        v-for="item in section"
      >
        <div class="text-lg">{{ item.displayName }}</div>

        <div class="flex flex-row items-center mt-1">
          <button
            @click="$emit('onDistanceClick', item, 'walking')"
            class="bg-blue-200 p-1.5 text-blue-700 rounded-full mr-2 text-sm font-bold shadow w-24"
          >
            <v-ons-ripple></v-ons-ripple>

            <i class="fa-solid fa-person-walking"></i>
            {{ item.duration.walking }}
          </button>

          <button
            @click="$emit('onDistanceClick', item, 'transit')"
            class="bg-blue-200 p-1.5 text-blue-700 rounded-full text-sm font-bold shadow w-24"
          >
            <v-ons-ripple></v-ons-ripple>

            <i class="fa-solid fa-train"></i>
            {{ item.duration.transit }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(["label", "section", "icon"]);
defineEmits(["onDistanceClick"]);
</script>
