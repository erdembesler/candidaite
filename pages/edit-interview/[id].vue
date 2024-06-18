<!-- pages/edit-interview/_id.vue -->
<template>
  <AddInterviewScreen :id="id" />
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import AddInterviewScreen from "../../components/screens/AddInterviewScreen.vue";

const route = useRoute();
const id = ref(route.params.id);
</script>
