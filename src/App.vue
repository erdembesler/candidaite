<template>
  <v-app>
    <Header style="z-index: 99999"></Header>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header.vue";

export default {
  name: "App",
  components: {
    Header,
  },
};
</script>

<style scoped lang="scss">
/* Scoped styles for your app can go here */
</style>
