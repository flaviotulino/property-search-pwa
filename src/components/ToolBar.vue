<template>
  <v-ons-toolbar>
    <div class="left" v-if="backButton">
      <v-ons-toolbar-button
        @click="back"
        icon="ion-ios-menu, material: md-arrow-back"
      ></v-ons-toolbar-button>
    </div>
    <div class="center">Property Search</div>
  </v-ons-toolbar>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps(["backButton"]);

function back() {
  router.push(props.backButton);
}
</script>
