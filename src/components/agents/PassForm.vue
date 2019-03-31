<template>
  <div>
    <v-alert :value="alert" :color="alertColor" transition="fade-transition">{{alertContent}}</v-alert>
    <v-card color="transparent elevation-0" class="ma-0 pa-0">
      <v-card-text class="ma-0 pa-0">
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md6>
              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                :counter="0"
                :type="'password'"
                label="Password"
                required
                color="teal"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field
                v-model="passwordConfirmation"
                :error-messages="passwordConfirmationErrors"
                :counter="0"
                :type="'password'"
                label="Confirm Password"
                required
                color="teal"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="this.$v.$invalid"
          color="teal"
          flat
          class="text--teal"
          @click="submitPasswordUpdateForm()"
        >Update</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import AgentServices from "@/services/agent.js";

import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],

  validations: {
    password: { required, minLength: minLength(6) }
  },
  data: () => ({
    password: "",
    passwordConfirmation: "",
    //? alert details ...
    alertContent: "",
    alertColor: "",
    alert: false
  }),
  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Password must be at least 6 caracters");
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
    passwordConfirmationErrors() {
      const errors = [];
      if (this.password != this.passwordConfirmation)
        errors.push("Passwords do not matche");
      return errors;
    }
  },
  methods: {
    submitPasswordUpdateForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        // call update endpoint
        AgentServices.UpdatePassword(this.password)
          .then(result => {
            this.clear();
            this.showSuccessAlert(result);
            this.disableAlert();
          })
          .catch(error => {
            this.showErrorAlert(error);
            this.disableAlert();
          });
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
      this.password = "";
      this.passwordConfirmation = "";
    },
    disableAlert() {
      setTimeout(() => {
        this.alert = false;
        this.alertContent = "";
        this.alertColor = "";
      }, 5000);
    }
  }
};
</script>

<style>
</style>
