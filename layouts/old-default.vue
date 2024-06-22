<!-- layouts/default.vue -->
<template>
  <v-app>
    <Header style="z-index: 99999"></Header>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script>
import Header from "../components/old-header.vue";

export default {
  components: {
    Header,
  },
};
</script>

<style scoped lang="scss">
/* Scoped styles for your layout can go here */
</style>
