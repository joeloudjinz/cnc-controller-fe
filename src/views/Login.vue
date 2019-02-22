<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6>
            <v-card class="elevation-12">
              <v-toolbar dark color="teal">
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
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
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="teal" @click="submit">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      :bottom="'bottom'"
      :color="snackbarColor"
      :multi-line="'multi-line'"
    >{{ snackbarContent }}</v-snackbar>
  </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";
import AuthServices from "@/services/auth";
export default {
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(6) }
  },
  data: () => ({
    drawer: null,
    email: "",
    password: "",
    snackbarContent: "",
    snackbar: false,
    snackbarColor: ""
  }),
  props: {
    source: String
  },
  computed: {
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
  mounted() {
    if (localStorage.getItem("isConnected") === "true") {
      this.$router.replace("/");
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        AuthServices.Login({
          email: this.email,
          password: this.password
        })
          //? data contains agent, token and refresh_token and success message
          .then(data => {
            window.localStorage.setItem("isConnected", true);
            window.localStorage.setItem("token", data.token);
            window.localStorage.setItem("refresh_token", data.refresh_token);
            window.localStorage.setItem("id", data.agent.id);
            window.localStorage.setItem("email", data.agent.email);
            window.localStorage.setItem("last_name", data.agent.last_name);
            window.localStorage.setItem("first_name", data.agent.first_name);
            this.$router.replace("/");
          })
          .catch(error => {
            this.snackbarColor = "error";
            this.snackbarContent = error;
            this.snackbar = true;
          });
      }
    }
  }
};
</script>