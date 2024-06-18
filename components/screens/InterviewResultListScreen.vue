<template>
  <div class="main-container">
    <v-container>
      <v-card class="card">
        <v-card-title class="card-title">
          <span class="page-title">Interview Results</span>
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
          <v-data-table
            :headers="headers"
            :items="interviewResults"
            :search="search"
          >
            <template #item="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.surname }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.averagePoint }}</td>
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
import axios from "axios";

export default {
  name: "InterviewResultList",
  setup() {
    const search = ref("");
    const interviewResults = ref([]);
    const headers = ref([
      { key: "name", title: "Name" },
      { key: "surname", title: "Surname" },
      { key: "title", title: "Title" },
      { key: "averagePoint", title: "Average Point" },
    ]);

    const fetchInterviewResults = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/candidate-interviews"
        );
        interviewResults.value = response.data;
      } catch (error) {
        console.error("Error fetching interview results:", error);
      }
    };

    onMounted(fetchInterviewResults);

    return {
      search,
      interviewResults,
      headers,
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
      justify-content: center;
      flex-direction: row;
      margin-bottom: 20px;
      .page-title {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
</style>
