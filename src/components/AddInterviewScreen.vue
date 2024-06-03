<template>
  <div class="main-container">
    <v-container>
      <v-card class="card">
        <v-card-title class="page-title">
          <span>{{ isEdit ? "Edit Interview" : "Add Interview" }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="submitForm">
            <v-text-field
              v-model="interview.title"
              label="Position"
              required
            ></v-text-field>
            <v-textarea
              v-model="interview.description"
              label="Position Description"
              required
            ></v-textarea>
            <v-select
              v-model="interview.questionCount"
              :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              label="Number of Questions"
              required
            ></v-select>
            <v-checkbox
              v-if="!isEdit"
              v-model="createOwnQuestions"
              label="I want to create questions by my own"
            ></v-checkbox>

            <div v-if="createOwnQuestions || isEdit">
              <div
                v-for="(question, index) in interview.questions"
                :key="index"
                class="question-pair"
              >
                <v-textarea
                  v-model="question.questionText"
                  label="Question"
                  placeholder="Enter the question"
                  outlined
                  required
                ></v-textarea>
                <v-textarea
                  v-model="question.answerText"
                  label="Answer"
                  placeholder="Enter the answer"
                  outlined
                  required
                ></v-textarea>
                <v-select
                  class="question-time"
                  v-model="question.time"
                  :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                  label="Question time (mins)"
                  required
                ></v-select>
              </div>
            </div>

            <v-btn
              class="save-button"
              size="x-large"
              type="submit"
              color="primary"
              >{{ isEdit ? "Save Changes" : "Submit" }}</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "AddInterviewScreen",
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const router = useRouter();
    const interview = ref({
      title: "",
      description: "",
      questionCount: 1,
      questions: [],
    });

    const createOwnQuestions = ref(false);
    const isEdit = ref(!!props.id);
    const form = ref(null);

    const initializeQuestions = (count) => {
      interview.value.questions = Array.from({ length: count }, (_, index) => ({
        questionText: "",
        answerText: "",
        time: 1,
        id: `${index + 1}`,
      }));
    };

    const fetchInterview = async (id) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/interviews/${id}`
        );
        interview.value = response.data;
        if (!response.data.questions || response.data.questions.length === 0) {
          initializeQuestions(interview.value.questionCount);
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      }
    };

    const submitForm = async () => {
      try {
        if (isEdit.value) {
          await axios.put(
            `http://localhost:3000/interviews/${props.id}`,
            interview.value
          );
        } else {
          await axios.post("http://localhost:3000/interviews", interview.value);
        }
        router.push({ name: "InterviewList" });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    onMounted(() => {
      if (props.id) {
        fetchInterview(props.id);
      } else {
        initializeQuestions(interview.value.questionCount);
      }
    });

    watch(
      () => interview.value.questionCount,
      (newCount) => {
        if (!isEdit.value) {
          initializeQuestions(newCount);
        }
      }
    );

    return { interview, createOwnQuestions, isEdit, form, submitForm };
  },
};
</script>

<style scoped lang="scss">
.main-container {
  display: flex;
  justify-content: center;
  .card {
    padding: 20px;
    .page-title {
      margin-bottom: 10px;
    }
    .question-time {
      max-width: 180px;
      max-height: 56px;
    }
  }
}
.question-pair {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.save-button {
  padding: 0px 20px;
}
</style>
