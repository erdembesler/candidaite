<template>
  <div class="main-container">
    <v-container>
      <v-card class="card">
        <v-card-title class="card-title">
          <v-btn class="add-button" color="primary" @click="goToAddInterview"
            >Add Interview</v-btn
          >
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
          ></v-text-field>
          <v-data-table :headers="headers" :items="interviews" :search="search">
            <template #item="{ item }">
              <tr>
                <td>{{ item.title }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.questions.length }}</td>
                <td>
                  <v-btn
                    style="margin-right: 10px"
                    color="primary"
                    @click="editInterview(item.id)"
                    >Edit</v-btn
                  >
                  <v-btn color="error" @click="deleteInterview(item.id)"
                    >Delete</v-btn
                  >
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "InterviewListScreen",
  setup() {
    const router = useRouter();
    const search = ref("");
    const interviews = ref([]);
    const headers = ref([
      { key: "Title", title: "Position" },
      { key: "Description", title: "Description" },
      { key: "Number of Questions", title: "Number of Questions" },
      { key: "Actions", title: "Actions", sortable: false },
    ]);

    const mockInterviews = [
      {
        id: "1",
        title: "Software Engineer",
        description: "Interview for software engineer position",
        questions: [
          {
            questionText: "What is your favorite programming language?",
            answerText: "",
          },
          {
            questionText: "Describe your most challenging project.",
            answerText: "",
          },
        ],
      },
      {
        id: "2",
        title: "Data Scientist",
        description: "Interview for data scientist position",
        questions: [
          {
            questionText: "Explain a machine learning algorithm you have used.",
            answerText: "",
          },
          {
            questionText: "How do you handle missing data in a dataset?",
            answerText: "",
          },
        ],
      },
      {
        id: "3",
        title: "Product Manager",
        description: "Interview for product manager position",
        questions: [
          {
            questionText: "How do you prioritize product features?",
            answerText: "",
          },
          {
            questionText: "Describe a successful product launch you managed.",
            answerText: "",
          },
        ],
      },
      {
        id: "4",
        title: "UI/UX Designer",
        description: "Interview for UI/UX designer position",
        questions: [
          { questionText: "What is your design process?", answerText: "" },
          {
            questionText: "Describe a user interface you designed.",
            answerText: "",
          },
        ],
      },
      {
        id: "5",
        title: "DevOps Engineer",
        description: "Interview for DevOps engineer position",
        questions: [
          {
            questionText: "How do you manage continuous integration?",
            answerText: "",
          },
          {
            questionText: "Describe your experience with cloud services.",
            answerText: "",
          },
        ],
      },
    ];

    const fetchInterviews = async () => {
      try {
        const response = await axios.get("http://localhost:3000/interviews");
        interviews.value = response.data;
      } catch (error) {
        console.error("Error fetching interviews:", error);
        // Use mock data if the API request fails
        interviews.value = mockInterviews;
      }
    };

    const deleteInterview = async (id) => {
      try {
        await axios.delete(`http://localhost:3000/interviews/${id}`);
        fetchInterviews();
      } catch (error) {
        console.error("Error deleting interview:", error);
      }
    };

    const goToAddInterview = () => {
      router.push({ name: "AddInterview" });
    };

    const editInterview = (id) => {
      router.push({ name: "EditInterview", params: { id } });
    };

    onMounted(fetchInterviews);

    return {
      search,
      interviews,
      headers,
      deleteInterview,
      goToAddInterview,
      editInterview,
    };
  },
};
</script>

<style scoped lang="scss">
.main-container {
  display: flex;
  justify-content: center;
  .card {
    padding: 20px;

    .card-title {
      display: flex;
      justify-content: end;
      flex-direction: row;
      margin-bottom: 20px;
      .add-button {
        padding: 0px 10px;
        font-size: 14px;
      }
    }
  }
}
</style>
