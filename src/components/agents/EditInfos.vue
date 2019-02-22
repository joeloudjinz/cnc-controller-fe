<template>
  <v-card ref="form">
    <v-card-text>
      <v-text-field
        v-model="password"
        :error-messages="passwordErrors"
        :counter="0"
        :type="'password'"
        label="Password"
        required
        solo-inverted
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="passwordConfirmation"
        :error-messages="passwordConfirmationErrors"
        :counter="0"
        :type="'password'"
        label="Confirm Password"
        required
        solo-inverted
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
      ></v-text-field>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn flat @click="clear">Clear</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="teal" @click="submit">Submit</v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      :bottom="'bottom'"
      :color="snackbarColor"
      :multi-line="'multi-line'"
    >{{ snackbarContent }}</v-snackbar>
  </v-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import AgentServices from "@/services/agent";

export default {
  mixins: [validationMixin],

  validations: {
    password: { required, minLength: minLength(6) }
  },

  data: () => ({
    password: "",
    passwordConfirmation: "",
    snackbarContent: "",
    snackbarColor: "",
    snackbar: false
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
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        AgentServices.UpdatePassword(this.password)
          .then(result => {
            this.snackbar = true;
            this.snackbarContent = result;
            this.snackbarColor = "success";
            this.clear();
          })
          .catch(error => {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarContent = error;
            this.loading = false;
          });
      }
    },
    clear() {
      this.$v.$reset();
      this.password = "";
      this.passwordConfirmation = "";
    }
  }
};
</script>