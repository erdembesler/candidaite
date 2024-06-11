<template>
  <div class="candidate-info-div">
    <v-card class="candidate-info-card">
      <v-card-title class="headline">Enter Your Information</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="candidate.name"
            :rules="[(v) => !!v || 'Name is required']"
            label="Name"
            required
            @blur="validateField('name')"
            :error-messages="errors.name"
          ></v-text-field>
          <v-text-field
            v-model="candidate.surname"
            :rules="[(v) => !!v || 'Surname is required']"
            label="Surname"
            required
            @blur="validateField('surname')"
            :error-messages="errors.surname"
          ></v-text-field>
          <v-text-field
            v-model="candidate.email"
            :rules="[
              (v) => !!v || 'Email is required',
              (v) => /.+@.+\..+/.test(v) || 'Email must be in a correct format',
            ]"
            label="Email"
            required
            @blur="validateField('email')"
            :error-messages="errors.email"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <div class="button-div">
        <v-btn :disabled="!valid" color="primary" @click="saveCandidateInfo"
          >Next</v-btn
        >
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "CandidateInfoForm",
  data() {
    return {
      candidate: {
        name: "",
        email: "",
        surname: "",
      },
      valid: false,
      errors: {
        name: [],
        email: [],
        surname: [],
      },
    };
  },
  mounted() {
    this.loadCandidateInfo();
  },
  methods: {
    saveCandidateInfo() {
      localStorage.setItem("candidate", JSON.stringify(this.candidate));
      this.$emit("saveCandidateInfo", this.candidate);
    },
    loadCandidateInfo() {
      const savedCandidate = JSON.parse(localStorage.getItem("candidate"));
      if (savedCandidate) {
        this.candidate = savedCandidate;
      }
    },
    validateField(field) {
      if (field === "name") {
        this.errors.name = !this.candidate.name ? ["Name is required"] : [];
      } else if (field === "surname") {
        this.errors.surname = !this.candidate.surname
          ? ["Surname is required"]
          : [];
      } else if (field === "email") {
        if (!this.candidate.email) {
          this.errors.email = ["Email is required"];
        } else if (!/.+@.+\..+/.test(this.candidate.email)) {
          this.errors.email = ["Email must be valid"];
        } else {
          this.errors.email = [];
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.candidate-info-div {
  min-width: 500px;
  margin-bottom: 80px;
  .candidate-info-card {
    padding: 20px;
    .headline {
      display: flex;
      justify-content: center;
      display: flex;
      margin-bottom: 20px;
      color: #575757;
    }
    .v-text-field {
      margin-bottom: 10px;
    }
    .button-div {
      display: flex;
      justify-content: center;
      flex-direction: row;
      .v-btn {
        padding: 0px 10px;
        width: 100%;
      }
    }
  }
}
</style>
