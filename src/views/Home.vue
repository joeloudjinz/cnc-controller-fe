<template>
  <v-app id="inspire">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      app
      absolute
      class="grey lighten-5"
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0 grey lighten-5">
          <v-list-tile avatar>
            <v-list-tile-avatar v-if="isAdmin">
              <v-icon color="teal darker-2" x-large>fas fa-crown</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-avatar v-else>
              <v-icon color="teal darker-2" x-large>fas fa-hard-hat</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ fullName }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon ripple small v-on="on" @click="launcheEditProfile()">
                    <v-icon small color="grey">fas fa-user-edit</v-icon>
                  </v-btn>
                </template>
                <span>Edit profile data</span>
              </v-tooltip>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <div class="hidden-md-and-up">
        <v-list dense class="pt-0 grey lighten-5">
          <v-list-tile to="/">
            <v-list-tile-action>
              <v-icon left>fas fa-tachometer-alt</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Dashboard</v-list-tile-title>
            </v-list-tile-content>
            <!-- Protect it by isAdmin ! -->
          </v-list-tile>
          <v-list-tile v-if="isAdmin == true" to="/users">
            <v-list-tile-action>
              <v-icon left>fas fa-hard-hat</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Workers</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/converter">
            <v-list-tile-action>
              <v-icon left>fas fa-recycle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Converter</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/files">
            <v-list-tile-action>
              <v-icon left>fas fa-boxes</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Files</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="performLogout()">
            <v-list-tile-action>
              <v-icon left>fas fa-sign-out-alt</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </div>
      <v-divider></v-divider>
      <v-list class="pt-0 grey lighten-5" dense>
        <v-list-tile @click="showSettingsDialog()">
          <v-list-tile-action>
            <v-icon>fas fa-tools</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-group v-if="portsCount != 0" prepend-icon="fas fa-parking" value="true">
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Ports</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-tile v-for="(port, i) in portsList" :key="i" @click="showPortPanel(port)">
            <v-list-tile-avatar>
              <h6 class="text--teal">{{i}}</h6>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="port.comName"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-else>
          <v-list-tile-action>
            <v-icon color="red">fas fa-exclamation-circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>No port is active</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- TOOLBAR -->
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="teal" dark app fixed>
      <v-toolbar-title class="ml-0 pl-0">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-avatar size="50" color="teal lighten-4 mr-2">
          <img :src="siteAvatar" alt="avatar">
        </v-avatar>
        <span class="headline font-weight-medium">CNC System</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-tooltip bottom>
          <template #activator="data">
            <v-btn v-on="data.on" flat to="/" class="m-0">
              <v-icon left>fas fa-tachometer-alt</v-icon>Dashboard
            </v-btn>
          </template>
          <span>Moniter the system and control it's data</span>
        </v-tooltip>
        <!-- Protect it by isAdmin ! -->
        <v-tooltip bottom>
          <template v-if="isAdmin == true" #activator="data">
            <v-btn v-on="data.on" flat to="/users" class="m-0">Workers</v-btn>
          </template>
          <span>Consult workers list and manage there accounts</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="data">
            <v-btn v-on="data.on" flat to="/converter" class="m-0">Converter</v-btn>
          </template>
          <span>Convert image into gcode and transmit the file to machine</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="data">
            <v-btn v-on="data.on" flat to="/files">Files</v-btn>
          </template>
          <span>Consult directory tree of all the files in the server</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="data">
            <v-btn v-on="data.on" flat @click="performLogout">
              <v-icon left color="white">fas fa-sign-out-alt</v-icon>Logout
            </v-btn>
          </template>
          <span>logout</span>
        </v-tooltip>
      </v-toolbar-items>
    </v-toolbar>
    <!-- CONTENT OF THE PAGE -->
    <v-content>
      <v-container justify-center align-center fluid>
        <v-fade-transition>
          <v-layout row wrap v-show="doShowSurfaceDimensionsAlert">
            <v-flex xs12 ms12 md12 lg12 px-1 pb-1>
              <v-list class="teal darken-4 pa-2 elevation-5">
                <v-list-tile avatar three-line>
                  <v-list-tile-avatar>
                    <v-icon left large color="white">fas fa-exclamation-triangle</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content class="font-weight-bold">
                    <v-list-tile-title
                      class="white--text text-lighten-3"
                    >Height & Width of the Drawing Surface are NOT DEFINED</v-list-tile-title>
                    <v-list-tile-sub-title class="teal--text text-lighten-3">
                      in settings page, please set them so you can convert the uploaded images
                      into gcode.
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn
                      flat
                      color="white"
                      class="font-weight-bold elevation-1"
                      @click="showSettingsDialog()"
                    >Set</v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-fade-transition>
        <div v-if="isHomePage">
          <DashboardVue/>
        </div>
        <v-layout row wrap>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <!-- Settings dialog -->
    <SettingsDialog ref="settingsDialogRef"/>
    <!-- Port dialog -->
    <PortPanelDialog ref="portPanelDialogRef"/>
    <!-- Edit Profile Data Dialog -->
    <EditProfileInfoVue ref="editProfileInfoRef"/>
    <!-- DON'T REMOVE THIS SNACKBAR -->
    <SnackBar :color="color" :content="content" :visibility="visibility"/>
  </v-app>
</template>
<script>
import AuthServices from "@/services/auth.js";
import AgentServices from "@/services/agent.js";
import PortsServices from "@/services/ports.js";

import { mapState, mapMutations } from "vuex";
import { setTimeout } from "timers";

const EditProfileInfoVue = () =>
  import("@/components/home/EditProfileInfo.vue");
const PortPanelDialog = () => import("@/components/home/PortPanelDialog.vue");
const SettingsDialog = () => import("@/components/home/SettingsDialog.vue");
const DashboardVue = () => import("@/components/dashboard/Dashboard.vue");
import SnackBar from "@/components/app/SnackBar.vue";

export default {
  name: "home",
  components: {
    EditProfileInfoVue,
    PortPanelDialog,
    SettingsDialog,
    DashboardVue,
    SnackBar
  },
  data: () => ({
    portsList: [],
    portsCount: 0,
    siteAvatar: require("@/assets/logo.png"),
    drawer: false,
    right: null,
    color: "teal",
    content: "",
    visibility: false
  }),
  computed: {
    ...mapState([
      "doShowSurfaceDimensionsAlert",
      "isHomePage",
      "isAdmin",
      "selectedPortObject"
    ]),
    fullName() {
      return `${localStorage.last_name.toUpperCase()} ${
        localStorage.first_name
      }`;
    }
  },
  sockets: {
    connect() {
      // TODO: change the state of the user to active from this event
    },
    onPortsListChanged(newListObject) {
      this.onActiveCallback(newListObject);
    },
    onServerStatusChanged(data) {
      this.SET_TRANSMISSION_PROCESS_STATE(data.status);
    }
  },
  methods: {
    ...mapMutations([
      "SET_TRANSMISSION_PROCESS_STATE",
      "TOGGLE_IS_CONNECTED_STATE",
      "SET_IS_ADMIN_VALUE",
      "SET_SELECTED_PORT_OBJECT"
    ]),
    onActiveCallback(data) {
      this.portsCount = Object.keys(data).length;
      let newList = [];
      for (let i = 0; i < this.portsCount; i++) {
        newList.push(data[i + 1]);
      }
      if (
        this.selectedPortObject != undefined &&
        !newList.includes(this.selectedPortObject)
      ) {
        this.showErrorSnackbar(
          `${this.selectedPortObject.comName} is not active anymore`
        );
        //TODO: close the port panel from inside
        // this.doShowPortPanel = false;
        this.$refs.portPanelDialogRef.hidePanel();
        // this.selectedPortObject = undefined;
        this.SET_SELECTED_PORT_OBJECT(undefined);
      }
      this.portsList = newList;
    },
    performLogout() {
      AuthServices.Logout(localStorage.id)
        .then(() => {
          //? update connexion status
          // this.TOGGLE_IS_CONNECTED_STATE();
          localStorage.removeItem("id");
          localStorage.removeItem("first_name");
          localStorage.removeItem("last_name");
          localStorage.removeItem("email");
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("refresh_token");
          //? display login component
          this.$router.replace("/login");
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    showPortPanel(portObject) {
      this.SET_SELECTED_PORT_OBJECT(portObject);
      this.$refs.portPanelDialogRef.showPortPanel(portObject);
    },
    launcheEditProfile() {
      //? calling the function to show the modal
      this.$refs.editProfileInfoRef.showModal();
    },
    showSettingsDialog() {
      this.$refs.settingsDialogRef.showSettingsDialog();
    },
    showSuccessSnackbar(content) {
      this.color = "success";
      this.content = content;
      this.visibility = true;
      setTimeout(() => {
        this.visibility = false;
      }, 5000);
    },
    showErrorSnackbar(content) {
      this.color = "error";
      this.content = content;
      this.visibility = true;
      setTimeout(() => {
        this.visibility = false;
      }, 5000);
    }
  },
  //! DON'T use arrow functions here
  created() {
    PortsServices.getConnectedPortsList()
      .then(result => {
        this.portsCount = result.count;
        if (result.count != 0) this.portsList = result.ports;
      })
      .catch(error => {
        this.showErrorSnackbar(error);
      });
    if (this.isAdmin == undefined) {
      AgentServices.getRole(localStorage.id)
        .then(result => {
          // TODO: use the store to cache isAdmin variable
          this.SET_IS_ADMIN_VALUE(result.data.result);
          // this.isAdmin = ;
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    }
  }
};
</script>
<style>
.scroll {
  overflow-y: auto;
}
.scrollbar-style::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 2px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: inset 2px 2px 2px rgba(0, 0, 0, 0.3);
  background-color: #e0f2f1;
}

.scrollbar-style::-webkit-scrollbar {
  width: 2px;
  height: 2px;
  background-color: #004d40;
}

.scrollbar-style::-webkit-scrollbar-thumb {
  background-color: #00695c;
}
</style>
