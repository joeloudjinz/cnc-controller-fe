<template>
  <v-app id="inspire">
    <!-- <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" fixed app absolute>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ fullName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :key="item.title">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>-->
    <!-- TOOLBAR -->
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="teal darken-3" dark app fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-0">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">CNC Controller</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn icon v-on="data.on" to="/dashboard">
            <v-icon>fas fa-tachometer-alt</v-icon>
          </v-btn>
        </template>
        <span>Dashboard page</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn v-on="data.on" icon>
            <v-icon>fas fa-cash-register</v-icon>
          </v-btn>
        </template>
        <span>Machines page</span>
      </v-tooltip>
      <!-- Protect it by isAdmin ! -->
      <v-tooltip bottom>
        <template v-if="isAdmin == true" #activator="data">
          <v-btn v-on="data.on" icon to="/agents">
            <v-icon>fas fa-hard-hat</v-icon>
          </v-btn>
        </template>
        <span>Agents page</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn v-on="data.on" icon to="/images">
            <v-icon>fas fa-images</v-icon>
          </v-btn>
        </template>
        <span>Images page</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn v-on="data.on" icon color="white" @click="performLogout">
            <v-icon color="teal darken-4">fas fa-sign-out-alt</v-icon>
          </v-btn>
        </template>
        <span>logout</span>
      </v-tooltip>
    </v-toolbar>
    <!-- CONTENT OF THE PAGE -->
    <v-content>
      <v-container fluid fill-height>
        <!--  align-center -->
        <v-layout justify-center row wrap>
          <router-view></router-view>
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
    <!-- FAB button -->
    <v-btn fab bottom right color="teal darken-4" dark fixed @click="dialog = !dialog">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">Create contact</v-card-title>
        <v-container grid-list-sm class="pa-4"></v-container>
        <v-card-actions>
          <v-btn flat color="primary">More</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import AuthServices from "@/services/auth.js";
import AgentServices from "@/services/agent.js";

export default {
  data: () => ({
    fullName:
      window.localStorage.getItem("first_name") +
      " " +
      window.localStorage.getItem("last_name"),
    isAdmin: false,
    dialog: false,
    drawer: true,
    items: [
      { title: "Home", icon: "dashboard" },
      { title: "About", icon: "question_answer" }
    ],
    right: null,
    //? snackbar details ...
    snackbarContent: "",
    snackbarColor: "",
    snackbar: false
  }),
  props: {
    source: String
  },
  created: function() {
    // get the id
    const id = window.localStorage.getItem("id");
    // check for role of the current agent
    AgentServices.getRole(id)
      .then(result => {
        console.log(typeof result.data.result);
        // update the value isAdmin
        this.isAdmin = result.data.result;
        console.log(this.isAdmin);
      })
      .catch(error => {
        this.snackbar = true;
        this.snackbarColor = "error";
        this.snackbarContent = error;
      });
  },
  methods: {
    performLogout() {
      let id = localStorage.getItem("id");
      AuthServices.Logout(id)
        .then(() => {
          //? update connexion status
          window.localStorage.setItem("isConnected", false);
          //! remove data from local storage
          window.localStorage.removeItem("id");
          window.localStorage.removeItem("first_name");
          window.localStorage.removeItem("last_name");
          window.localStorage.removeItem("email");
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("refresh_token");
          //? update local variable isConnected
          this.isConnected = false;
          //? display login component
          this.$router.replace("/login");
        })
        .catch(error => {
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarContent = error;
        });
    }
  }
};
</script>