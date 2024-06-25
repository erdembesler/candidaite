<!-- pages/interview/_id.vue -->
<template>
  <InterviewScreen :id="id" />
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import InterviewScreen from "../../components/screens/InterviewScreen.vue";

const route = useRoute();
const id = ref(route.params.id);
</script>

<script>
import { defineNuxtComponent } from "#app";

export default defineNuxtComponent({
  components: {
    InterviewScreen,
  },
  head() {
    return {
      title: brand.saas.name + " - Interview",
    };
  },
});
</script>
