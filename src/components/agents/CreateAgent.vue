<template>
  <v-card ref="form">
    <v-card-text>
      <v-text-field
        v-model="firstName"
        :error-messages="firstNameErrors"
        :counter="50"
        label="First Name"
        required
        solo-inverted
        @input="$v.firstName.$touch()"
        @blur="$v.firstName.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="lastName"
        :error-messages="lastNameErrors"
        :counter="50"
        label="Last Name"
        required
        solo-inverted
        @input="$v.lastName.$touch()"
        @blur="$v.lastName.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="email"
        :error-messages="emailErrors"
        label="E-mail"
        required
        solo-inverted
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
      ></v-text-field>
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
import {
  required,
  maxLength,
  email,
  minLength
} from "vuelidate/lib/validators";
import AgentServices from "@/services/agent";

export default {
  mixins: [validationMixin],

  validations: {
    firstName: { required, maxLength: maxLength(50) },
    lastName: { required, maxLength: maxLength(50) },
    email: { required, email },
    password: { required, minLength: minLength(6) }
  },

  data: () => ({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    snackbarContent: "",
    snackbarColor: "",
    snackbar: false
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
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Password must be at least 6 caracters");
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    }
  },
  methods: {
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await AgentServices.createAgent({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password
        })
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
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.password = "";
    }
  }
};
</script>