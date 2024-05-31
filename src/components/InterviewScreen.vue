<template>
  <div class="main-container">
    <div class="interview-stream">
      <div class="content-container">
        <div class="top-bar">
          <div :class="['timer-container', { flashing: !isRecordComplete }]">
            <div class="timer">{{ formatTime(currentQuestionTimer) }}</div>
          </div>
          <div class="question-header">
            <b>
              <span class="question-number"
                >{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span
              >
            </b>
          </div>
          <v-btn
            v-if="currentQuestionIndex < questions.length - 1"
            :disabled="!isRecordComplete"
            :class="['next-question-btn', { 'flash-color': isRecordComplete }]"
            @click="nextQuestion"
          >
            Next Question
          </v-btn>
          <v-btn
            v-else
            :disabled="!isRecordComplete"
            :class="['submit-btn', { 'flash-color': isRecordComplete }]"
            @click="submit"
          >
            Submit
          </v-btn>
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
          <canvas
            v-if="isRecording"
            ref="audioCanvas"
            class="audio-canvas"
          ></canvas>

          <v-btn
            v-if="!isRecording && !isRecordComplete"
            @click="startRecording"
            color="success"
          >
            Start Recording
          </v-btn>
          <v-btn v-if="isRecording" @click="stopRecording" color="error">
            End Recording
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      mediaRecorder: null,
      audioChunks: [],
      currentQuestionTimer: 0,
      intervalId: null,
      isRecording: false,
      isRecordComplete: false,
      stream: null,
      audioContext: null,
      analyser: null,
      dataArray: null,
      currentQuestionIndex: 0,
      questions: [
        {
          id: 1,
          questionText: "Tell me a little bit about yourself.",
          answerText: "",
          time: 5,
        },
        {
          id: 2,
          questionText: "What are your strengths?",
          answerText: "",
          time: 90,
        },
        {
          id: 3,
          questionText: "What are your weaknesses?",
          answerText: "",
          time: 60,
        },
        {
          id: 4,
          questionText: "Why do you want this job?",
          answerText: "",
          time: 150,
        },
        {
          id: 5,
          questionText: "Where do you see yourself in five years?",
          answerText: "",
          time: 180,
        },
      ],
    };
  },
  mounted() {
    this.initCamera();
    this.startTimer();
  },
  methods: {
    async initCamera() {
      const video = this.$refs.video;
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      video.srcObject = this.stream;
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

      this.$nextTick(() => {
        this.draw();
      });
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      }
      this.isRecordComplete = true;
      this.isRecording = false;
      this.stopTimer();
      if (this.audioContext) {
        this.audioContext.close();
      }
    },
    async handleStopRecording() {
      const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");

      try {
        const response = await axios.post(
          "http://localhost:3001/api/transcribe",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data.transcription);
        this.questions[this.currentQuestionIndex].answerText =
          response.data.transcription;
      } catch (error) {
        console.error("Error transcribing audio:", error);
      }
    },
    startTimer() {
      this.currentQuestionTimer =
        this.questions[this.currentQuestionIndex].time;
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
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.isRecordComplete = false;
        this.startTimer();
      }
    },
    submit() {
      console.log("Submit answers:", this.questions);
      // Implement the submission logic
    },
    draw() {
      const canvas = this.$refs.audioCanvas;
      const canvasCtx = canvas.getContext("2d");

      const drawVisual = () => {
        if (!this.isRecording) return; // Stop drawing when not recording
        requestAnimationFrame(drawVisual);

        this.analyser.getByteTimeDomainData(this.dataArray);

        canvasCtx.fillStyle = "rgb(240, 244, 248)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 4;
        canvasCtx.strokeStyle = "rgb(81, 98, 236)";

        canvasCtx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / this.dataArray.length;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
          const v = this.dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      };

      drawVisual();
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

.interview-stream {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 180px;
}

.content-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px 60px;
  width: 800px;
  width: 100%;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.timer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgb(81, 98, 236);
  color: white;
}

.timer-container.flashing {
  animation: flashTimer 2s infinite;
}

.timer {
  font-size: 20px;
  font-weight: bold;
}

.content {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  margin-bottom: 30px;
}

.video-col {
  margin-right: 30px;
}

.video-container {
  height: 400px;
  width: 550px;
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
  justify-content: space-between;
  align-items: center;
  text-align: center;
  min-height: 50px;
}

.controls.single-element {
  justify-content: flex-end; /* Use flex-end to align single element to the right */
}

.question-col {
  width: 350px;
}

.question-header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.question-number {
  font-size: 45px;
  font-weight: 600;
  color: black;
}

.question-number-text {
  font-size: 20px;
  color: rgb(81, 98, 236);
}

.question {
  text-align: left;
  .question-text {
    font-weight: 500;
    font-size: 18px;
    color: #333;
  }
}

.audio-canvas {
  width: 50px;
  height: 22px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: 0 10px 12px rgb(240, 244, 248);
  border: 1px rgb(255, 126, 126) solid;
}
.next-question-btn {
  color: white;
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
</style>
