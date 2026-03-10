<template>
  <div class="relative">
    <div
      class="absolute top-2 right-2 flex flex-row items-center bg-blue-200 text-blue-700 px-2 py-1 space-x-3 rounded-full"
    >
      <div class="flex flex-row items-center space-x-1">
        <i class="fa-solid fa-droplet"></i>
        <span>{{ property.bathrooms }}</span>
      </div>

      <div class="flex flex-row items-center space-x-1">
        <i class="fa-solid fa-bed"></i>
        <span>{{ property.bedrooms }}</span>
      </div>
    </div>

    <div
      class="bg-no-repeat bg-cover w-full h-48 rounded-md"
      :style="{ backgroundImage: `url(${property.photos[0]})` }"
    />

    <div class="space-y-1 flex flex-col">
      <div class="mt-2 font-bold text-lg">{{ property.address }}</div>
      <div class="text-gray-500">{{ property.price }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps(["property"]);
</script>
