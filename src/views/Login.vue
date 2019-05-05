<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height class="teal lighten-5">
        <v-layout align-center justify-center>
          <v-flex xs11 sm8 md5>
            <v-card class="teal lighten-4 elevation-8">
              <v-img :aspect-ratio="16/9" :src="url"></v-img>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="email"
                    :error-messages="emailErrors"
                    label="E-mail"
                    required
                    color="teal darken-5"
                    outline
                    clearable
                    prepend-inner-icon="fas fa-at"
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :error-messages="passwordErrors"
                    :counter="0"
                    :type="'password'"
                    label="Password"
                    clearable
                    required
                    color="teal darken-5"
                    prepend-inner-icon="fas fa-lock"
                    outline
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="white" class="teal--text" @click="submit">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";
import { mapMutations } from "vuex";

import AuthServices from "@/services/auth";

export default {
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(6) }
  },
  data: () => ({
    url: require("@/assets/machine.jpg"),
    drawer: null,
    email: "",
    password: ""
  }),
  props: {
    source: String
  },
  computed: {
    // ...mapState(["sbColor", "sbContent", "sbVisibility"]),
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
    ...mapMutations(["SHOW_SNACKBAR", "TOGGLE_SB_VISIBILITY"]),
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
            this.showErrorSnackbar(error);
          });
      }
    },
    showErrorSnackbar(content) {
      this.TOGGLE_SB_VISIBILITY(true);
      this.SHOW_SNACKBAR({ color: "error", content });
      setTimeout(() => {
        this.TOGGLE_SB_VISIBILITY(false);
      }, 5000);
    }
  }
};
</script>