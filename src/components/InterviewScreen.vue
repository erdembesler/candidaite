<template>
  <div :class="['main-container']">
    <candidate-info-form
      v-if="!isStartInterview && !showInterviewInfo"
      @saveCandidateInfo="showInterviewInfoScreen"
    />
    <interview-info v-if="showInterviewInfo" @startInterview="startInterview" />
    <div v-if="isStartInterview" :class="['interview-stream']">
      <div v-if="showOverlay" class="overlay">
        <div class="countdown-text">
          {{ questions[currentQuestionIndex].questionText }}
        </div>
        <div class="countdown">{{ countdown }}</div>
      </div>
      <div :class="['content-container', { blurred: showOverlay }]">
        <div class="top-bar">
          <div :class="['timer-container', { flashing: !isRecordComplete }]">
            <div class="timer">{{ formatTime(currentQuestionTimer) }}</div>
          </div>
          <div class="question-header">
            <b>
              <span class="question-number">
                {{ currentQuestionIndex + 1 }} / {{ questions.length }}
              </span>
            </b>
          </div>
        </div>
        <div class="content">
          <div class="video-col">
            <div class="video-container">
              <video ref="video" autoplay muted></video>
            </div>
          </div>
          <div class="question-col">
            <div class="question">
              <span class="question-text">
                {{ questions[currentQuestionIndex].questionText }}
              </span>
            </div>
          </div>
        </div>
        <div :class="['controls', { 'single-element': !isRecording }]">
          <v-btn
            v-if="isRecording"
            @click="stopRecording"
            color="error"
            class="v-btn"
          >
            End Recording
          </v-btn>
        </div>
      </div>
    </div>
    <div v-if="isEvaluating" class="evaluation-screen">
      <h2>Your interview is being evaluated...</h2>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CandidateInfoForm from "./CandidateInfoForm.vue";
import InterviewInfo from "./InterviewInfo.vue";

export default {
  components: {
    CandidateInfoForm,
    InterviewInfo,
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
      showOverlay: false,
      isEvaluating: false,
      showInterviewInfo: false,
      stream: null,
      audioContext: null,
      analyser: null,
      dataArray: null,
      currentQuestionIndex: 0,
      questions: [],
      candidate: {
        name: "",
        surname: "",
        email: "",
      },
      isStartInterview: false,
    };
  },
  props: {
    id: String,
  },
  beforeMount() {
    this.fetchInterview();
  },
  mounted() {
    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
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
      this.showOverlay = true;
      this.countdown = 5;
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.showOverlay = false;
          this.startRecording();
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
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      }
      this.isRecordComplete = true;
      this.isRecording = false;
      this.stopTimer();

      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.startCountdown();
      } else {
        this.isEvaluating = true;
        this.submit();
      }

      if (this.audioContext && this.audioContext.state !== "closed") {
        this.audioContext.close();
      }
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
        this.questions[this.currentQuestionIndex].answerText =
          response.data.transcription;
      } catch (error) {
        console.error("Error transcribing audio:", error);
      }
    },
    startTimer() {
      this.currentQuestionTimer =
        this.questions[this.currentQuestionIndex].time * 60;
      this.intervalId = setInterval(() => {
        if (this.currentQuestionTimer > 0) {
          this.currentQuestionTimer--;
        } else {
          this.stopRecording();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.intervalId);
      this.currentQuestionTimer = 0;
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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
        await axios.post(
          "http://localhost:3000/candidate-interviews",
          candidateData
        );
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

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
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
}

.interview-stream {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 180px;
}

.content-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px 60px;
  width: 100%;
  max-width: 900px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.timer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgb(81, 98, 236);
  color: white;
}

.timer-container.flashing {
  animation: flashTimer 2s infinite;
}

.timer {
  font-size: 24px;
  font-weight: bold;
}

.question-header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.question-number {
  font-size: 30px;
  font-weight: 600;
  color: black;
}

.question-number-text {
  font-size: 20px;
  color: rgb(81, 98, 236);
}

.content {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  margin-bottom: 30px;
  width: 100%;
}

.video-col {
  margin-right: 30px;
}

.video-container {
  height: 300px;
  width: 400px;
  background-color: #000;
  border-radius: 11px;
}

video {
  border-radius: 10px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 50px;
}

.controls.single-element {
  justify-content: flex-end;
}

.question-col {
  width: 400px;
}

.question {
  text-align: left;
  .question-text {
    font-weight: 500;
    font-size: 18px;
    color: #333;
  }
}

.v-btn {
  padding: 0px 10px;
}

.headline {
  margin-bottom: 10px;
}

.audio-canvas {
  width: 50px;
  height: 22px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: 0 10px 12px rgb(240, 244, 248);
  border: 1px rgb(255, 126, 126) solid;
}

.flash-color {
  animation: flashColor 1.5s infinite;
}

@keyframes flashColor {
  0% {
    background-color: rgb(81, 98, 236);
  }
  50% {
    background-color: rgb(121 134 236);
  }
  100% {
    background-color: rgb(81, 98, 236);
  }
}

@keyframes flashTimer {
  0% {
    background-color: rgb(81, 98, 236);
  }
  50% {
    background-color: rgb(121 134 236);
  }
  100% {
    background-color: rgb(81, 98, 236);
  }
}

.evaluation-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  h2 {
    color: #333;
  }
}
</style>
