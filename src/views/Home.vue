<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" fixed app>
      <v-list dense>
        <template v-for="item in items">
          <v-layout v-if="item.heading" :key="item.heading" row align-center>
            <v-flex xs6>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <!-- @click="" -->
            <v-list-tile v-for="(child, i) in item.children" :key="i">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ child.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <!-- @click -->
          <v-list-tile v-else :key="item.text">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <!-- TOOLBAR -->
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="teal darken-3" dark app fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-0">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">CNC Controller</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>
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
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn v-on="data.on" icon to="/agents">
            <v-icon>fas fa-hard-hat</v-icon>
          </v-btn>
        </template>
        <span>Agents page</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn v-on="data.on" icon color="white" @click="performLogout">
            <v-icon color="teal darken-4">fas fa-sign-out-alt</v-icon>
          </v-btn>
        </template>
        <span>logout</span>
      </v-tooltip>

      <!-- USER DROPDPWN MENU goes here -->
      <!-- 
        <v-menu offset-y>
        <v-btn slot="activator" icon large>
          <v-avatar size="32px" tile>
            <img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify">
          </v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile v-for="(item, index) in dropDownItems" :key="index">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      -->
    </v-toolbar>
    <!-- CONTENT OF THE PAGE -->
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center row wrap>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
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

export default {
  data: () => ({
    dialog: false,
    drawer: null,
    dropDownItems: [{ title: "Logout", icon: "fas fa-sign-out-alt" }],
    items: [
      { icon: "contacts", text: "Contacts" },
      { icon: "history", text: "Frequently contacted" },
      { icon: "content_copy", text: "Duplicates" },
      {
        icon: "keyboard_arrow_up",
        "icon-alt": "keyboard_arrow_down",
        text: "Labels",
        model: true,
        children: [{ icon: "add", text: "Create label" }]
      },
      {
        icon: "keyboard_arrow_up",
        "icon-alt": "keyboard_arrow_down",
        text: "More",
        model: false,
        children: [
          { text: "Import" },
          { text: "Export" },
          { text: "Print" },
          { text: "Undo changes" },
          { text: "Other contacts" }
        ]
      },
      { icon: "settings", text: "Settings" },
      { icon: "chat_bubble", text: "Send feedback" },
      { icon: "help", text: "Help" },
      { icon: "phonelink", text: "App downloads" },
      { icon: "keyboard", text: "Go to the old version" }
    ]
  }),
  props: {
    source: String
  },
  methods: {
    performLogout() {
      let id = localStorage.getItem("id");
      AuthServices.Logout(id)
        .then(() => {
          //? update connexion status
          window.localStorage.setItem("isConnected", false);
          //? remove data from local storage
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