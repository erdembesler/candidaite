<template>
  <div class="interview-info-container">
    <v-card class="interview-info-card">
      <v-card-title class="headline">Interview Rules</v-card-title>
      <v-card-text>
        <ul class="rules-list">
          <li>- Make sure you are in a quiet place.</li>
          <li>- Ensure your camera and microphone are working properly.</li>
          <li>- Each question will be recorded automatically.</li>
          <li>- You will have a limited time to answer each question.</li>
          <li>
            - Click "End Recording" once you finish answering each question.
          </li>
          <li>- Make sure to speak clearly and concisely.</li>
          <li>- Try to stay within the time limit for each answer.</li>
          <li>
            - Ensure you have a stable internet connection throughout the
            interview.
          </li>
        </ul>
        <v-checkbox
          v-model="accepted"
          label="I have read and accept the rules"
        ></v-checkbox>
      </v-card-text>
      <v-btn
        :disabled="!accepted || !permissionsGranted"
        color="primary"
        @click="startInterview"
      >
        Start Interview
      </v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accepted: false,
      permissionsGranted: false,
    };
  },
  mounted() {
    this.requestPermissions();
  },
  methods: {
    startInterview() {
      this.$emit("startInterview");
    },
    async requestPermissions() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        this.permissionsGranted = true;
      } catch (error) {
        console.error("Permissions not granted: ", error);
        this.permissionsGranted = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.interview-info-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  padding: 20px;
  margin-bottom: 80px;
}

.interview-info-card {
  min-width: 700px;
  padding: 40px;
  text-align: center;
}

.headline {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.rules-list {
  text-align: left;
  margin-bottom: 20px;
  padding-left: 0;
  list-style-type: none;
  li {
    margin-bottom: 10px;
    font-size: 16px;
    color: #555;
    &:before {
      color: #666;
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }
}

.v-btn {
  width: 100%;
}
</style>
