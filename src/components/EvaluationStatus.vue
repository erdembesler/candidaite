<template>
  <div class="evaluation-container">
    <div style="margin-bottom: 60px">
      <v-icon
        size="250"
        color="#5162ec"
        icon="mdi-check-decagram-outline"
      ></v-icon>
    </div>
    <p
      style="font-size: 24px; margin-bottom: 5px; color: #494949"
      v-if="!isEvaluated"
    >
      You have completed interview. Please wait for evaluation..
    </p>
    <p v-else>Your interview has been evaluated</p>
    <v-progress-linear
      v-if="!isEvaluated"
      color="#5162ec"
      indeterminate
    ></v-progress-linear>
  </div>
</template>
<script>
export default {
  props: {
    isEvaluated: Boolean,
    evaluationResponse: Object,
  },
  watch: {
    evaluationResponse(newVal) {
      if (newVal) {
        console.log(newVal);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.evaluation-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  margin-bottom: 90px;
}
</style>
