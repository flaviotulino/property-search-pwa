<template>
  <div class="relative bg-white rounded-md shadow-md">
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
      class="bg-no-repeat bg-cover w-full h-48 rounded-t-md"
      :style="{ backgroundImage: `url(${property.photos[0]})` }"
    />

    <div class="space-y-1 flex flex-col px-2 pb-2">
      <div class="mt-2 font-bold text-lg">{{ property.address }}</div>
      <div class="text-gray-500">{{ property.price }}</div>

      <div
        v-if="property.viewingDate"
        class="bg-gray-900 py-2 px-4 text-white rounded-md font-bold shadow text-center"
      >
        <i class="fa-solid fa-eye mr-2"></i>
        <span>Viewing on {{ formatDate(property.viewingDate) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(["property"]);

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(date)
    .toLocaleDateString(undefined, options)
    .replace(",", " @");
}
</script>
