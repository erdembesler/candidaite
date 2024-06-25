<!-- pages/edit-interview/_id.vue -->
<template>
  <AddInterviewScreen :id="id" />
</template>

<script setup>
import { useRoute } from "vue-router";
import AddInterviewScreen from "../../components/screens/AddInterviewScreen.vue";

const route = useRoute();
const id = route.params.id;
</script>

<script>
import { defineNuxtComponent } from "#app";

export default defineNuxtComponent({
  components: {
    AddInterviewScreen,
  },
  head() {
    return {
      title: brand.saas.name + " - Edit",
    };
  },
});
</script>
