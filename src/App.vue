<template>
  <v-app>
    <Header style="z-index: 123123"></Header>
    <v-main>
      <InterviewScreen />
    </v-main>
  </v-app>
</template>

<script>
import InterviewScreen from "./components/InterviewScreen.vue";
import Header from "./components/Header.vue";

export default {
  name: "App",
  components: {
    InterviewScreen,
    Header,
  },
};
</script>

<style></style>
