<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" fixed app absolute>
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
        <v-list-group v-if="portsList.length != 0" prepend-icon="fas fa-parking" value="true">
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Ports</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-tile v-for="(port, i) in portsList" :key="i" @click="showPortBottomSheet(port)">
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
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="teal darken-3" dark app fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-0">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">CNC Controller</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn v-on="data.on" flat to="/dashboard" class="m-0">
            <v-icon left>fas fa-tachometer-alt</v-icon>Dashboard
          </v-btn>
        </template>
        <span>Dashboard page</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn flat v-on="data.on" class="m-0">Machines</v-btn>
        </template>
        <span>Machines page</span>
      </v-tooltip>
      <!-- Protect it by isAdmin ! -->
      <v-tooltip bottom>
        <template v-if="isAdmin == true" #activator="data">
          <v-btn v-on="data.on" flat to="/agents" class="m-0">Agents</v-btn>
        </template>
        <span>Agents page</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn v-on="data.on" flat to="/images" class="m-0">Converter</v-btn>
        </template>
        <span>Images page</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn v-on="data.on" flat @click="performLogout">
            <v-icon left color="white">fas fa-sign-out-alt</v-icon>Logout
          </v-btn>
        </template>
        <span>logout</span>
      </v-tooltip>
    </v-toolbar>
    <!-- CONTENT OF THE PAGE -->
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center row wrap>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <!-- Port dialog -->
    <v-layout row justify-center>
      <v-dialog
        v-model="doShowPortDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="teal lighten-1">
            <v-btn icon dark @click="doShowPortDialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Port Panel</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                flat
                :disabled="openPortDis"
                @click="openPort(selectedPortObject.comName)"
              >
                <v-icon left>fas fa-door-open</v-icon>Open Port
              </v-btn>
            </v-toolbar-items>
            <v-toolbar-items>
              <v-btn
                dark
                flat
                :disabled="closePortDis"
                @click="closePort(selectedPortObject.comName)"
              >
                <v-icon left>fas fa-times-circle</v-icon>Close Port
              </v-btn>
            </v-toolbar-items>
            <v-toolbar-items>
              <v-btn
                dark
                flat
                :disabled="flushPortDis"
                @click="flushPort(selectedPortObject.comName)"
              >
                <v-icon left>fas fa-arrow-alt-circle-down</v-icon>Flush Data
              </v-btn>
            </v-toolbar-items>
            <v-toolbar-items>
              <v-btn
                dark
                flat
                :disabled="resumePortDis"
                @click="resumePort(selectedPortObject.comName)"
              >
                <v-icon left>fas fa-play-circle</v-icon>Resume Data
              </v-btn>
            </v-toolbar-items>
            <v-toolbar-items>
              <v-btn
                dark
                flat
                :disabled="pausePortDis"
                @click="pausePort(selectedPortObject.comName)"
              >
                <v-icon left>fas fa-pause-circle</v-icon>Pause Data
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list v-if="selectedPortObject != undefined">
            <!-- <v-subheader>Port Infromation</v-subheader> -->
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Port Name</v-list-tile-title>
                <v-list-tile-sub-title>{{ selectedPortObject.comName }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Manufacturer</v-list-tile-title>
                <v-list-tile-sub-title>{{ selectedPortObject.manufacturer }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Serial Number</v-list-tile-title>
                <v-list-tile-sub-title>{{ selectedPortObject.serialNumber }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Plug and Play ID</v-list-tile-title>
                <v-list-tile-sub-title>{{ selectedPortObject.pnpId }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Procudt ID</v-list-tile-title>
                <v-list-tile-sub-title>{{ selectedPortObject.productId }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Vendor ID</v-list-tile-title>
                <v-list-tile-sub-title>{{ selectedPortObject.vendorId }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>
          <!-- <v-flex xs12 class="mt-1">
          </v-flex>-->
          <v-card height="400px" color="teal darken-4" class="ma-3">
            <v-toolbar color="teal" card>
              <v-text-field
                v-model="writeToPortTextField"
                color="white"
                label="To send to port"
                class="mt-3"
              ></v-text-field>
              <v-btn icon>
                <v-icon color="white">fas fa-paper-plane</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="white--text">helo</v-card-text>
          </v-card>
        </v-card>
      </v-dialog>
    </v-layout>
    <!-- Snackbar -->
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
import PortsServices from "@/services/ports.js";
import Pusher from "pusher-js";

export default {
  data: () => ({
    portsList: [],
    portsCount: 0,
    fullName:
      window.localStorage.getItem("last_name").toUpperCase() +
      " " +
      window.localStorage.getItem("first_name"),
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
    snackbar: false,
    //? to show or hide ports console bottom sheet
    doShowPortDialog: false,
    selectedPortObject: undefined,
    //? to enable and disable control btns of port console panel
    flushPortDis: true,
    pausePortDis: true,
    resumePortDis: true,
    openPortDis: false,
    closePortDis: true,
    //? write to port console
    writeToPortTextField: "",
    writeToPortProgress: false,
    writeToPortProgressValue: "",
    //? for pusher channels
    isPortsBinded: false,
    pusher: undefined
  }),
  //! DON'T use arrow functions here
  created: function() {
    // get the id
    const id = window.localStorage.getItem("id");
    // check for role of the current agent
    AgentServices.getRole(id)
      .then(result => {
        this.isAdmin = result.data.result;
      })
      .catch(error => {
        this.showErrorSnackbar(error);
      });
    Pusher.logToConsole = true;
    this.pusher = new Pusher("ced4b5ad59f10ab2a746", {
      cluster: "eu",
      forceTLS: true
    });
    this.pusher.subscribe("ports");
    PortsServices.getConnectedPortsList()
      .then(result => {
        this.portsCount = result.count;
        if (result.count !== 0) {
          this.portsList = result.ports;
          if (!this.isPortsBinded) {
            this.subscribeToPorts("on-active");
          } else {
            console.log("already binded to on-active");
          }
        }
      })
      .catch(error => {
        this.showErrorSnackbar(error);
      });
  },
  methods: {
    subscribeToPorts(eventName) {
      this.isPortsBinded = true;
      this.pusher.bind(eventName, data => {
        const portsList = data.portsList;
        const count = Object.keys(portsList).length;
        let newList = [];
        for (let i = 0; i < count; i++) {
          newList.push(portsList[i + 1]);
        }
        this.portsList = newList;
      });
    },
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
          this.showErrorSnackbar(error);
        });
    },
    pausePort(portName) {
      console.warn("pausePort() is called, port is " + portName);
      PortsServices.pauseEmittingPort(portName)
        .then(result => {
          this.resumePortDis = false; //! means enable btn
          this.pausePortDis = true; //! means disable btn
          this.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    resumePort(portName) {
      console.warn("resumePort() is called, port is " + portName);
      PortsServices.resumeEmittingPort(portName)
        .then(result => {
          this.pausePortDis = false;
          this.resumePortDis = true;
          this.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    flushPort(portName) {
      console.warn("flushPort() is called, port is " + portName);
      PortsServices.flushPort(portName)
        .then(result => {
          this.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    openPort(portName) {
      PortsServices.openPort(portName)
        .then(result => {
          this.showSuccessSnackbar(result);
          this.openPortDis = true;
          this.resumePortDis = true;
          this.closePortDis = false;
          this.pausePortDis = false;
          this.flushPortDis = false;
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    closePort(portName) {
      PortsServices.closePort(portName)
        .then(result => {
          this.showSuccessSnackbar(result);
          this.openPortDis = false;
          this.resumePortDis = true;
          this.closePortDis = true;
          this.pausePortDis = true;
          this.flushPortDis = true;
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    showPortBottomSheet(portObject) {
      console.log(portObject);
      this.selectedPortObject = portObject;
      this.doShowPortDialog = true;
    },
    showSuccessSnackbar(content) {
      this.snackbar = true;
      this.snackbarColor = "success";
      this.snackbarContent = content;
    },
    showErrorSnackbar(content) {
      this.snackbar = true;
      this.snackbarColor = "error";
      this.snackbarContent = content;
    }
  }
};
</script>