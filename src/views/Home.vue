<template>
  <v-app id="inspire">
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" fixed app absolute>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
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
        <v-list dense class="pt-0">
          <v-list-tile to="/dashboard">
            <v-list-tile-action>
              <v-icon left>fas fa-tachometer-alt</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Dashboard</v-list-tile-title>
            </v-list-tile-content>
            <!-- Protect it by isAdmin ! -->
          </v-list-tile>
          <v-list-tile v-if="isAdmin == true" to="/agents">
            <v-list-tile-action>
              <v-icon left>fas fa-hard-hat</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Agents</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/images">
            <v-list-tile-action>
              <v-icon left>fas fa-recycle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Converter</v-list-tile-title>
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
      <v-list class="pt-0" dense>
        <v-list-group v-if="portsList.length != 0" prepend-icon="fas fa-parking" value="true">
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
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="teal darken-3" dark app fixed>
      <v-toolbar-title class="ml-0 pl-0">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="center">CNC System</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-tooltip bottom>
          <template #activator="data">
            <v-btn v-on="data.on" flat to="/dashboard" class="m-0">
              <v-icon left>fas fa-tachometer-alt</v-icon>Dashboard
            </v-btn>
          </template>
          <span>Moniter the system and control it's data</span>
        </v-tooltip>
        <!-- <v-tooltip bottom>
          <template #activator="data">
            <v-btn flat v-on="data.on" class="m-0">Machines</v-btn>
          </template>
          <span>Machines page</span>
        </v-tooltip>-->
        <!-- Protect it by isAdmin ! -->
        <v-tooltip bottom>
          <template v-if="isAdmin == true" #activator="data">
            <v-btn v-on="data.on" flat to="/agents" class="m-0">Agents</v-btn>
          </template>
          <span>Consult agents list and perform same agent account operations</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="data">
            <v-btn v-on="data.on" flat to="/images" class="m-0">Converter</v-btn>
          </template>
          <span>Convert image into gcode and transmit the file to machine</span>
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
      <v-container fluid fill-height>
        <v-layout justify-center row wrap>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <!-- Port dialog -->
    <v-layout row justify-center>
      <v-dialog
        v-model="doShowPortPanel"
        persistent
        fullscreen
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="teal lighten-1">
            <v-btn icon dark @click="doShowPortPanel = false">
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
          <v-alert
            :value="true"
            type="info"
            transition="fade-transition"
            class="mx-3"
          >Only "Port Name" is guaranteed 100%, other information is related to the connected device of the current port.</v-alert>
          <v-list v-if="selectedPortObject != undefined">
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
          <v-layout row wrap>
            <v-flex xs12 px-3>
              <v-toolbar color="teal" card dark class="mt-2">
                <v-text-field
                  dark
                  v-model="writeToPortTextField"
                  label="Commands"
                  solo-inverted
                  class="pt-2"
                ></v-text-field>
                <v-fade-transition>
                  <v-btn
                    v-if="writeToPortTextField != ''"
                    icon
                    @click="sendCommandToPort(selectedPortObject.comName)"
                  >
                    <v-icon color="white">fas fa-paper-plane</v-icon>
                  </v-btn>
                </v-fade-transition>
                <v-btn icon @click="clearPortConsole()">
                  <v-icon color="white">fas fa-eraser</v-icon>
                </v-btn>
              </v-toolbar>
            </v-flex>
            <v-flex xs12>
              <v-card height="300px" color="teal lighten-4" class="mx-3 scroll">
                <v-card-text class="black--text text-darken-4">
                  <table>
                    <tr v-for="(line, index) in portConsoleTxt" :key="index">
                      <td v-if="line.charAt(1) == '>'" class="font-weight-meduim">{{line}}</td>
                      <td v-else class="red--text text-darken-1 font-weight-meduim">{{line}}</td>
                    </tr>
                  </table>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>
    </v-layout>
    <!-- Edit Profile Data Dialog -->
    <v-dialog v-model="editProfileDialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="teal darken-2 white--text">
          <span class="headline">Edit Profile Data</span>
        </v-card-title>
        <v-card-text>
          <InfoFormVue ref="infoFormRef"/>
          <v-divider></v-divider>
          <PassFormVue ref="passFormRef"/>
          <v-divider></v-divider>
          <small class="text--red">All fields are required if they are empty</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal" class="white--text" @click="closeEditInfoDialog()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Snackbar -->
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
import AuthServices from "@/services/auth.js";
import AgentServices from "@/services/agent.js";
import PortsServices from "@/services/ports.js";
import Pusher from "pusher-js";

import InfoFormVue from "../components/agents/InfoForm.vue";
import PassFormVue from "../components/agents/PassForm.vue";

export default {
  components: {
    InfoFormVue,
    PassFormVue
  },
  data: () => ({
    portsList: [],
    portsCount: 0,
    fullName:
      window.localStorage.getItem("last_name").toUpperCase() +
      " " +
      window.localStorage.getItem("first_name"),
    isAdmin: false,
    editProfileDialog: false,
    drawer: true,
    right: null,
    //? snackbar details ...
    snackbarContent: "",
    snackbarColor: "",
    snackbar: false,
    //? to show or hide ports console bottom sheet
    doShowPortPanel: false,
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
    isOnActiveBinded: false,
    isOnPortDataBinded: false,
    pusher: undefined,
    portsChannel: undefined,
    portConsoleTxt: []
  }),
  methods: {
    bindOnPortData() {
      if (!this.isOnPortDataBinded) {
        this.portsChannel.bind("on-port-data", data =>
          this.onPortDataCallback(data)
        );
        this.isOnPortDataBinded = true;
      } else {
        console.log("Already binded to on-port-data");
      }
    },
    unbindOnPortData() {
      if (this.isOnPortDataBinded) {
        this.portsChannel.unbind("on-port-data", data =>
          this.onPortDataCallback(data)
        );
        this.isOnPortDataBinded = false;
      }
    },
    onPortDataCallback(data) {
      this.portConsoleTxt.unshift("-> data received: " + data.data);
    },
    bindOnActive() {
      this.isOnActiveBinded = true;
      this.portsChannel.bind("on-active", data => this.onActiveCallback(data));
    },
    unbindOnActive() {
      this.portsChannel.unbind("on-active", data =>
        this.onActiveCallback(data)
      );
      this.isOnActiveBinded = false;
    },
    onActiveCallback(data) {
      const portsList = data.portsList;
      const count = Object.keys(portsList).length;
      window.localStorage.setItem("portsCount", count);
      let newList = [];
      for (let i = 0; i < count; i++) {
        newList.push(portsList[i + 1]);
      }
      if (
        this.selectedPortObject != undefined &&
        !newList.includes(this.selectedPortObject)
      ) {
        this.showErrorSnackbar(
          `${this.selectedPortObject.comName} is not active anymore`
        );
        this.doShowPortPanel = false;
        this.selectedPortObject = undefined;
      }
      this.portsList = newList;
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
          this.unbindOnPortData();
          this.unbindOnActive();
          //? display login component
          this.$router.replace("/login");
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    pausePort(portName) {
      // console.warn("pausePort() is called, port is " + portName);
      this.portConsoleTxt.unshift(
        "-> Pause emitting data on port: " + portName
      );
      PortsServices.pauseEmittingPort(portName)
        .then(result => {
          this.portConsoleTxt.unshift("-> Emitting data on port is paused");
          this.resumePortDis = false; //! means enable btn
          this.pausePortDis = true; //! means disable btn
          this.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          this.portConsoleTxt.unshift("Error occurred: " + error);
          this.showErrorSnackbar(error);
        });
    },
    resumePort(portName) {
      // console.warn("resumePort() is called, port is " + portName);
      this.portConsoleTxt.unshift(
        "-> Resume emitting data on port: " + portName
      );
      PortsServices.resumeEmittingPort(portName)
        .then(result => {
          this.portConsoleTxt.unshift("-> Emitting data on port is resumed");
          this.pausePortDis = false;
          this.resumePortDis = true;
          this.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          this.portConsoleTxt.unshift("Error occurred: " + error);
          this.showErrorSnackbar(error);
        });
    },
    flushPort(portName) {
      // console.warn("flushPort() is called, port is " + portName);
      this.portConsoleTxt.unshift("-> Flushing data on port: " + portName);
      PortsServices.flushPort(portName)
        .then(result => {
          this.portConsoleTxt.unshift("-> Data is flushed");
          this.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          this.portConsoleTxt.unshift("Error occurred: " + error);
          this.showErrorSnackbar(error);
        });
    },
    openPort(portName) {
      this.portConsoleTxt.unshift("-> Opening port: " + portName);
      PortsServices.openPort(portName)
        .then(result => {
          this.portConsoleTxt.unshift("-> Port is opened");
          this.showSuccessSnackbar(result);
          this.bindOnPortData();
          this.openPortDis = true;
          this.resumePortDis = true;
          this.closePortDis = false;
          this.pausePortDis = false;
          this.flushPortDis = false;
        })
        .catch(error => {
          console.warn(error);
          this.portConsoleTxt.unshift("Error occurred: " + error);
          this.showErrorSnackbar(error);
        });
    },
    closePort(portName) {
      this.portConsoleTxt.unshift("-> Closing port: " + portName);
      PortsServices.closePort(portName)
        .then(result => {
          this.portConsoleTxt.unshift("-> Port is closed");
          this.showSuccessSnackbar(result);
          this.unbindOnPortData();
          this.openPortDis = false;
          this.resumePortDis = true;
          this.closePortDis = true;
          this.pausePortDis = true;
          this.flushPortDis = true;
        })
        .catch(error => {
          this.portConsoleTxt.unshift("Error occurred: " + error);
          this.showErrorSnackbar(error);
        });
    },
    sendCommandToPort(portName) {
      if (
        this.writeToPortTextField != "" &&
        this.writeToPortTextField != undefined
      ) {
        this.portConsoleTxt.unshift("Writing: " + this.writeToPortTextField);
        PortsServices.writeToPort(portName, this.writeToPortTextField + "\r")
          .then(result => {
            this.writeToPortTextField = "";
            this.showSuccessSnackbar(result);
          })
          .catch(error => {
            this.portConsoleTxt.unshift("Error occurred: " + error);
            this.showErrorSnackbar(error);
          });
      } else {
        this.showErrorSnackbar("Can NOT send empty data!!");
      }
    },
    showPortPanel(portObject) {
      this.selectedPortObject = portObject;
      PortsServices.isPortOpen(portObject.comName)
        .then(isOpen => {
          this.isSelectedPortOpened = isOpen;
          PortsServices.isPortActive(portObject.comName)
            .then(isPortActive => {
              console.log("isPortActive :", isPortActive);
              if (isPortActive) {
                this.flushPortDis = true;
                this.pausePortDis = true;
                this.resumePortDis = true;
                this.openPortDis = true;
                this.closePortDis = true;
              }
            })
            .catch(error => {
              console.warn(error);
              this.showErrorSnackbar(
                "Error while checking port activeness status!"
              );
            });
          if (isOpen) {
            this.openPortDis = true;
            this.closePortDis = false;
          } else {
            this.openPortDis = false;
            this.closePortDis = true;
          }
        })
        .catch(error => {
          console.warn(error);
          this.showErrorSnackbar("Error while checking port open status!");
        });
      this.doShowPortPanel = true;
    },
    clearPortConsole() {
      this.portConsoleTxt = [];
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
    },
    closeEditInfoDialog() {
      this.editProfileDialog = false;
      // this.$v.reset();
      this.$refs.passFormRef.$v.$reset();
      this.$refs.infoFormRef.$v.$reset();
    },
    //? form methods
    launcheEditProfile() {
      this.editProfileDialog = true;
    }
  },
  //! DON'T use arrow functions here
  created() {
    const id = window.localStorage.getItem("id");
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
    this.portsChannel = this.pusher.subscribe("ports");
    PortsServices.getConnectedPortsList()
      .then(result => {
        this.portsCount = result.count;
        window.localStorage.setItem("portsCount", result.count);
        // console.log("result.count :", result.count);
        if (result.count != 0) {
          this.portsList = result.ports;
        }
        if (!this.isOnActiveBinded) {
          this.bindOnActive();
        } else {
          console.log("Already binded to on-active");
        }
      })
      .catch(error => {
        this.showErrorSnackbar(error);
      });
  }
};
</script>
<style>
.scroll {
  overflow-y: auto;
}
</style>
