<template>
    <div class="row interview-stream">
      <div class="col-12 col-md-6 question-col">
        <div class="question">
          <h3>Question 1 / 10</h3>
          <p>Tell me a little bit about yourself and something that you're passionate about – Preferably things that I would not see on your resume.</p>
        </div>
      </div>
      <div class="col-12 col-md-6 video-col">
        <div class="video-container">
          <div class="recording-indicator" v-if="isRecording">Recording...</div>
          <video ref="video" autoplay muted></video>
        </div>
      </div>
      <div class="col-12 controls mt-3">
        <button @click="startRecording" :disabled="isRecording" class="btn btn-primary">Start Recording</button>
        <button @click="stopRecording" :disabled="!isRecording" class="btn btn-danger">End Recording</button>
        <div class="timer my-2">{{ formatTime(timer) }}</div>
        <button @click="nextQuestion" :disabled="!isRecordComplete" class="btn btn-success">Next Question</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        mediaRecorder: null,
        audioChunks: [],
        timer: 120,
        intervalId: null,
        isRecording: false,
        isRecordComplete: false,
        stream: null
      };
    },
    mounted() {
      this.initCamera();
    },
    methods: {
      async initCamera() {
        const video = this.$refs.video;
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = this.stream;
      },
      async startRecording() {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const combinedStream = new MediaStream([...this.stream.getVideoTracks(), ...audioStream.getAudioTracks()]);
        this.audioChunks = [];
        this.isRecording = true;
        this.mediaRecorder = new MediaRecorder(combinedStream);
  
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
  
        this.mediaRecorder.onstop = this.handleStopRecording;
        this.mediaRecorder.start();
        this.startTimer();
      },
      stopRecording() {
        this.mediaRecorder.stop();
        this.isRecording = false;
        this.stopTimer();
      },
      async handleStopRecording() {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');
  
        try {
          const response = await axios.post('http://localhost:3001/api/transcribe', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log(response.data.transcription);
        } catch (error) {
          console.error('Error transcribing audio:', error);
        }
  
        this.isRecordComplete = true;
      },
      startTimer() {
        this.intervalId = setInterval(() => {
          if (this.timer > 0) {
            this.timer--;
          } else {
            this.stopRecording();
          }
        }, 1000);
      },
      stopTimer() {
        clearInterval(this.intervalId);
        this.timer = 120;
      },
      formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      },
      nextQuestion() {
        // Implement the logic to move to the next question
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  .interview-stream {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .question-col {
    margin-bottom: 20px;
  }
  
  .video-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    background-color: #000;
  }
  
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .recording-indicator {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 5px 10px;
    background-color: red;
    color: white;
    font-weight: bold;
  }
  
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  
    .timer {
      margin: 10px 0;
      font-size: 24px;
      font-weight: bold;
    }
  
    .btn {
      margin: 5px 0;
    }
  }
  
  @media (max-width: 600px) {
    .video-col {
      order: 1;
    }
    .question-col {
      order: 2;
    }
  }
  </style>
  