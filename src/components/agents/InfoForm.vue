<template>
  <div>
    <v-alert :value="alert" :color="alertColor" transition="fade-transition">{{alertContent}}</v-alert>
    <v-card color="transparent elevation-0" class="ma-0 pa-0">
      <v-card-text class="ma-0 pa-0">
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md6>
              <v-text-field
                v-model="firstName"
                :error-messages="firstNameErrors"
                :counter="50"
                label="First Name"
                required
                color="teal"
                @input="$v.firstName.$touch()"
                @blur="$v.firstName.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field
                v-model="lastName"
                :error-messages="lastNameErrors"
                :counter="50"
                label="Last Name"
                required
                color="teal"
                @input="$v.lastName.$touch()"
                @blur="$v.lastName.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="E-mail"
                required
                color="teal"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!isSameData"
          color="teal"
          flat
          class="text--teal"
          @click="submitInfosUpdateForm()"
        >Update</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import AgentServices from "@/services/agent.js";

import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  validations: {
    firstName: { required, maxLength: maxLength(50) },
    lastName: { required, maxLength: maxLength(50) },
    email: { required, email }
  },
  data: () => ({
    firstName: window.localStorage.getItem("first_name"),
    lastName: window.localStorage.getItem("last_name"),
    email: window.localStorage.getItem("email"),
    alertContent: "",
    alertColor: "",
    alert: false
  }),
  computed: {
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      !this.$v.firstName.maxLength &&
        errors.push("First Name must be at most 10 characters long");
      !this.$v.firstName.required && errors.push("First Name is required.");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.maxLength &&
        errors.push("Last Name must be at most 10 characters long");
      !this.$v.lastName.required && errors.push("Last Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    }
  },
  methods: {
    submitInfosUpdateForm() {
      if (!this.isSameData()) {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          AgentServices.UpdateInformation({
            last_name: this.lastName,
            first_name: this.firstName,
            email: this.email,
            id: window.localStorage.getItem("id")
          })
            .then(result => {
              window.localStorage.setItem("first_name", this.firstName);
              window.localStorage.setItem("last_name", this.lastName);
              window.localStorage.setItem("email", this.email);
              this.clear();
              this.disableAlert();
              this.showSuccessAlert(result);
            })
            .catch(error => {
              this.showErrorAlert(error);
              this.disableAlert();
            });
        }
      }
    },
    showSuccessAlert(content) {
      this.alert = true;
      this.alertColor = "success";
      this.alertContent = content;
    },
    showErrorAlert(content) {
      this.alert = true;
      this.alertColor = "error";
      this.alertContent = content;
    },
    clear() {
      this.$v.$reset();
      this.firstName = window.localStorage.getItem("first_name");
      this.lastName = window.localStorage.getItem("last_name");
      this.email = window.localStorage.getItem("email");
    },
    disableAlert() {
      setTimeout(() => {
        this.alert = false;
        this.alertContent = "";
        this.alertColor = "";
      }, 5000);
    },
    isSameData() {
      return (
        this.firstName === window.localStorage.getItem("first_name") &&
        this.lastName === window.localStorage.getItem("last_name") &&
        this.email === window.localStorage.getItem("email")
      );
    }
  }
};
</script>

<style>
</style>
