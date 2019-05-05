<template>
  <v-card ref="form" color="teal lighten-5" class="elevation-0">
    <v-card-text class="mt-0 pt-3">
      <v-alert
        :value="true"
        color="teal darken-1"
        icon="check_circle"
        class="mx-3"
      >You can create a new agnets and assign admin priviliges to them by checking the box "Add as admin"</v-alert>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6 md6>
            <v-text-field
              v-model="firstName"
              :error-messages="firstNameErrors"
              :counter="50"
              label="First Name"
              required
              @input="$v.firstName.$touch()"
              @blur="$v.firstName.$touch()"
              color="teal darken-1"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6>
            <v-text-field
              v-model="lastName"
              :error-messages="lastNameErrors"
              :counter="50"
              label="Last Name"
              required
              @input="$v.lastName.$touch()"
              @blur="$v.lastName.$touch()"
              color="teal darken-1"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="email"
              :error-messages="emailErrors"
              label="E-mail"
              required
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
              color="teal darken-1"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6>
            <v-text-field
              v-model="password"
              :error-messages="passwordErrors"
              :counter="0"
              :type="'password'"
              label="Password"
              required
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              color="teal darken-1"
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
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              color="teal darken-1"
            ></v-text-field>
          </v-flex>
          <v-flex sm12 md12 lg7>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-checkbox v-model="isAdminCheckbox" v-on="on" color="teal darken-3">
                  <template v-slot:label>
                    <div>Add as admin</div>
                  </template>
                </v-checkbox>
              </template>
              Give admin priviliges to the newly created agent
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn class="text--teal" color="teal" flat @click="clear">Clear</v-btn>
      <v-spacer></v-spacer>
      <v-btn class="white--text" color="teal" @click="submit">Submit</v-btn>
    </v-card-actions>
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
import { mapMutations } from "vuex";

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
    passwordConfirmation: "",
    snackbarContent: "",
    isAdminCheckbox: false,
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
    },
    passwordConfirmationErrors() {
      const errors = [];
      if (this.password != this.passwordConfirmation)
        errors.push("Passwords do not matche");
      return errors;
    }
  },
  methods: {
    ...mapMutations(["SHOW_SNACKBAR", "TOGGLE_SB_VISIBILITY"]),
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        await AgentServices.createAgent({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          is_admin: this.isAdminCheckbox
        })
          .then(result => {
            this.showSuccessSnackbar(result);
            this.clear();
          })
          .catch(error => {
            this.showErrorSnackbar(error);
            this.loading = false;
          });
      }
    },
    showSuccessSnackbar(content) {
      this.TOGGLE_SB_VISIBILITY(true);
      this.SHOW_SNACKBAR({ color: "success", content });
      setTimeout(() => {
        this.TOGGLE_SB_VISIBILITY(false);
      }, 5000);
    },
    showErrorSnackbar(content) {
      this.TOGGLE_SB_VISIBILITY(true);
      this.SHOW_SNACKBAR({ color: "error", content });
      setTimeout(() => {
        this.TOGGLE_SB_VISIBILITY(false);
      }, 5000);
    },
    clear() {
      this.$v.$reset();
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.password = "";
      this.passwordConfirmation = "";
      this.isAdminCheckbox = false;
    }
  }
};
</script>