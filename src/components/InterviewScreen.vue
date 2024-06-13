<template>
  <div :class="['main-container']">
    <candidate-info-form
      v-if="!isStartInterview && !showInterviewInfo"
      @saveCandidateInfo="showInterviewInfoScreen"
    />
    <interview-info v-if="showInterviewInfo" @startInterview="startInterview" />
    <div
      v-show="!isRecording && isStartInterview && !isEvaluated && !isEvaluating"
      class="interview-countdown"
    >
      <div class="countdown-text">
        {{ questions.length && questions[currentQuestionIndex].questionText }}
      </div>
      <div v-if="countdown" class="countdown">{{ countdown }}</div>
    </div>
    <div v-show="isRecording && isStartInterview" class="video-interview">
      <div class="question-section">
        <div class="question-number">
          Question <b>{{ currentQuestionIndex + 1 }} </b> of
          <b> {{ questions.length }}</b>
        </div>
        <div class="question-text">
          {{ questions.length && questions[currentQuestionIndex].questionText }}
        </div>
      </div>

      <div class="video-col">
        <div class="time-info">
          <v-icon
            style="margin-right: 3px"
            icon="mdi-clock-time-nine-outline"
          ></v-icon>
          <span style="font-size: 14px"
            >minutes:
            {{ questions.length && questions[currentQuestionIndex].time }}</span
          >
        </div>
        <div>
          <div class="progress-container">
            <div class="progress-info">
              <div class="response-time-label">
                <b>Response Time:</b>
              </div>
              <div class="response-time">{{ formatTime(elapsedTime) }}</div>
              <v-progress-linear
                v-model="progressPercentage"
                color="amber"
                style="height: 25px; transition: width 1s linear"
              ></v-progress-linear>
            </div>

            <div class="controls">
              <v-btn
                size="large"
                v-if="isRecording"
                @click="stopRecording"
                class="complete-button"
              >
                {{ isLastQuestion ? "Complete" : "Next" }}
              </v-btn>
            </div>
          </div>
          <div class="video-container">
            <video ref="video" autoplay muted></video>
            <div class="record-indicator"></div>
          </div>
          <div>
            <div class="audio-level">
              <v-icon icon="mdi-microphone"></v-icon>
              <v-progress-linear
                v-model="audioLevel"
                color="green"
                height="10"
              ></v-progress-linear>
            </div>
          </div>
        </div>
      </div>
    </div>
    <evaluation-status
      v-if="isEvaluating"
      :isEvaluated="isEvaluated"
      :evaluationResponse="evaluationResponse"
    />
  </div>
</template>
<script>
import axios from "axios";
import CandidateInfoForm from "./CandidateInfoForm.vue";
import InterviewInfo from "./InterviewInfo.vue";
import EvaluationStatus from "./EvaluationStatus.vue";

export default {
  components: {
    CandidateInfoForm,
    InterviewInfo,
    EvaluationStatus,
  },
  data() {
    return {
      mediaRecorder: null,
      audioChunks: [],
      currentQuestionTimer: 0,
      intervalId: null,
      countdown: 5,
      isRecording: false,
      isRecordComplete: false,
      isEvaluating: false,
      showInterviewInfo: false,
      stream: null,
      audioContext: null,
      analyser: null,
      dataArray: null,
      currentQuestionIndex: 0,
      questionIndexToBeTranscribed: 0,
      questions: [],
      candidate: {
        name: "",
        surname: "",
        email: "",
      },
      isStartInterview: false,
      progressPercentage: 0,
      elapsedTime: 0,
      audioLevel: 0,
      isEvaluated: false,
      evaluationResponse: null,
      isLastQuestionTranscribed: false,
    };
  },
  props: {
    id: String,
  },
  computed: {
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1;
    },
  },
  beforeMount() {
    this.fetchInterview();
  },
  mounted() {
    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
    this.stopTimer(); // Ensure interval is cleared on unmount
  },
  methods: {
    beforeUnloadHandler(event) {
      if (this.isStartInterview) {
        const message =
          "Are you sure you want to leave? Your progress will be lost.";
        event.returnValue = message;
        return message;
      }
    },
    async initCamera() {
      const video = this.$refs.video;
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      video.srcObject = this.stream;
    },
    async fetchInterview() {
      try {
        const id = this.$route.params.id || this.id;
        const response = await axios.get(
          `http://localhost:3000/interviews/${id}/candidates`
        );
        const { questions, title } = response.data;
        this.questions = questions;
        this.interviewTitle = title;
      } catch (error) {
        console.error("Error fetching interview:", error);
      }
    },
    startCountdown() {
      this.countdown = 5;
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.startRecording();
          this.elapsedTime = 0;
        }
      }, 1000);
    },
    async startRecording() {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const combinedStream = new MediaStream([
        ...this.stream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);
      this.audioChunks = [];
      this.isRecording = true;
      this.isRecordComplete = false;
      this.mediaRecorder = new MediaRecorder(combinedStream);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = this.handleStopRecording;
      this.mediaRecorder.start();

      // Initialize AudioContext and AnalyserNode
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(audioStream);
      this.analyser = this.audioContext.createAnalyser();
      source.connect(this.analyser);

      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this.startTimer();
      this.updateAudioLevel();
    },
    async stopRecording() {
      this.questionIndexToBeTranscribed = this.currentQuestionIndex;
      if (this.mediaRecorder) {
        await this.mediaRecorder.stop();
      }
      this.isRecordComplete = true;
      this.isRecording = false;
      this.stopTimer();

      if (this.isLastQuestion) {
        this.isEvaluating = true;
      } else {
        this.currentQuestionIndex++;
        this.startCountdown();
      }

      if (this.audioContext && this.audioContext.state !== "closed") {
        this.audioContext.close();
      }
    },
    nextQuestion() {
      this.stopRecording();
    },
    async handleStopRecording() {
      const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");

      try {
        const response = await axios.post(
          "http://localhost:3000/transcribe",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.questions[this.questionIndexToBeTranscribed].answerText =
          response.data.transcription;
        if (this.questionIndexToBeTranscribed == this.questions.length - 1) {
          this.isLastQuestionTranscribed = true;
        }
      } catch (error) {
        console.error("Error transcribing audio:", error);
      }
    },
    startTimer() {
      this.stopTimer();
      this.currentQuestionTimer =
        this.questions[this.currentQuestionIndex].time * 60;
      this.elapsedTime = 0;
      this.intervalId = setInterval(() => {
        if (this.currentQuestionTimer > 0) {
          this.currentQuestionTimer--;
          this.elapsedTime++;
          this.updateProgress();
        } else {
          this.stopRecording();
        }
      }, 1000);
    },
    stopTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.currentQuestionTimer = 0;
    },
    updateProgress() {
      const totalTime = this.questions[this.currentQuestionIndex].time * 60;
      this.progressPercentage = (this.elapsedTime / totalTime) * 100;
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    },
    updateAudioLevel() {
      if (!this.analyser) return;
      this.analyser.getByteFrequencyData(this.dataArray);
      const maxVolume = Math.max(...this.dataArray);
      this.audioLevel = (maxVolume / 255) * 100;
      requestAnimationFrame(this.updateAudioLevel);
    },
    async submit() {
      try {
        const candidateData = {
          name: this.candidate.name,
          surname: this.candidate.surname,
          email: this.candidate.email,
          questions: this.questions,
          title: this.interviewTitle,
          interviewId: this.$route.params.id || this.id,
          status: "WAITING_FOR_EVALUATION",
        };
        const response = await axios.post(
          "http://localhost:3000/candidate-interviews",
          candidateData
        );
        this.isEvaluated = true;
        this.evaluationResponse = response.data;
      } catch (error) {
        console.error("Error submitting candidate interview:", error);
      }
    },
    showInterviewInfoScreen(candidate) {
      this.candidate.email = candidate.email;
      this.candidate.name = candidate.name;
      this.candidate.surname = candidate.surname;
      localStorage.setItem("candidate", JSON.stringify(this.candidate));
      this.showInterviewInfo = true;
    },
    startInterview() {
      this.showInterviewInfo = false;
      this.isStartInterview = true;

      this.$nextTick(() => {
        this.initCamera();
      });

      this.startCountdown();
    },
  },
  watch: {
    currentQuestionIndex(newIndex, oldIndex) {
      if (newIndex !== oldIndex) {
        this.stopTimer();
        this.startTimer();
      }
    },
    isLastQuestionTranscribed(val) {
      if (val) {
        this.submit();
      }
    },
  },
  created() {
    const savedCandidate = JSON.parse(localStorage.getItem("candidate"));
    if (savedCandidate) {
      this.candidate = savedCandidate;
    }
  },
};
</script>
<style scoped lang="scss">
.main-container {
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  display: flex;
  justify-content: center;
  align-items: center;
}

.interview-countdown {
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
}

.blurred {
  filter: blur(20px);
  transition: filter 0.5s ease-in-out;
}

.countdown {
  color: #575757;
  font-size: 80px;
}

.countdown-text {
  color: #575757;
  font-size: 35px;
  margin-bottom: 20px;
}

.content {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  margin-bottom: 30px;
  width: 100%;
}

.video-container {
  position: relative;
  height: 400px;
  width: 500px;
  background-color: #000;
  border-radius: 11px;
  margin-bottom: 10px;
}

video {
  border-radius: 6px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.record-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 15px;
  height: 15px;
  background-color: rgb(197, 0, 0);
  border-radius: 50%;
  animation: blink 1.5s infinite;
}

.audio-level {
  display: flex;
  align-items: center;
  width: 100px;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.video-interview {
  display: flex;
  justify-content: center;
  flex-direction: row;
  background-color: white;
  height: 70%;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 80px;
  .question-number {
    color: #424141;
    font-size: 22px;
    font-weight: 600;
    height: 40px;
    margin-bottom: 10px;
  }
  .question-text {
    font-size: 22px;
    color: #575757;
  }
}

.complete-button {
  padding: 0px 20px;
  font-size: 16px;
  color: white;
  background-color: #5162ec;
  border-radius: 0px 3px 3px 0px;
  width: 100%;
  font-weight: 600;
}

/* Moved inline styles to classes */
.question-section {
  max-width: 430px;
  margin-right: 20px;
  border-right: 1px #cfcfcf solid;
  padding-right: 10px;
}

.time-info {
  height: 40px;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  color: #575757;
}

.progress-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}

.progress-info {
  width: 73%;
  background-color: #f6f6f6;
  flex: 1;
  border-radius: 3px 0px 0px 3px;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  text-align: center;
  align-items: center;
  padding: 0px 20px 0px 10px;
  font-size: 14px;
}

.response-time-label {
  margin-right: 10px;
  flex: 1;
  min-width: fit-content;
}

.response-time {
  margin-right: 10px;
  width: 40px;
}
</style>
