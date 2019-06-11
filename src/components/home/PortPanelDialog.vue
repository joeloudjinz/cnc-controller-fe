<template>
  <!-- Port dialog -->
  <v-layout row justify-center>
    <v-dialog v-model="doShowPortPanel" persistent fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="teal">
          <v-btn
            icon
            dark
            @click="openPortDis == true ? leavePortPanelDialog = true : doShowPortPanel = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Port Panel</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat :disabled="openPortDis" @click="openPort(selectedPortObject.comName)">
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
          color="teal darken-4"
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
            <v-toolbar
              color="teal lighten-4"
              class="elevation-0 mt-2 teal--text text--darken-1"
              card
            >
              <v-text-field
                v-model="writeToPortTextField"
                label="Commands"
                solo
                class="pt-2 teal--text text--darken-4"
              ></v-text-field>
              <v-fade-transition>
                <v-btn
                  v-if="writeToPortTextField != ''"
                  icon
                  @click="sendCommandToPort(selectedPortObject.comName)"
                >
                  <v-icon color="teal darken-4">fas fa-paper-plane</v-icon>
                </v-btn>
              </v-fade-transition>
              <v-btn icon @click="clearPortConsole()">
                <v-icon color="teal darken-4">fas fa-eraser</v-icon>
              </v-btn>
            </v-toolbar>
          </v-flex>
          <v-flex xs12 pb-3>
            <v-card
              height="300px"
              color="teal lighten-4 elevation-0"
              class="scroll scrollbar-style mx-3"
            >
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
    <!-- Leave Port panel Dialog -->
    <v-dialog v-model="leavePortPanelDialog" persistent max-width="600px">
      <v-card color="teal lighten-5">
        <v-card-title class="teal--text text--darken-2 headline">
          <v-icon color="teal darken-2" large left>fas fa-exclamation-circle</v-icon>Leave Port Panel
        </v-card-title>
        <v-card-text>
          <p>The port will be closed after leaving Port Panel, are you sure you want to leave?</p>
        </v-card-text>
        <v-card-actions>
          <v-btn flat class="teal--text" @click="leavePortPanelDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" class="white--text" @click="closePortPanelDialog()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import PortsServices from "@/services/ports.js";
import { mapMutations } from "vuex";

export default {
  data: () => ({
    //? to show or hide ports console bottom sheet
    doShowPortPanel: false,
    selectedPortObject: undefined,
    //? to enable and disable control btns of port console panel
    leavePortPanelDialog: false,
    flushPortDis: true,
    pausePortDis: true,
    resumePortDis: true,
    openPortDis: false,
    closePortDis: true,
    //? write to port console
    writeToPortTextField: "",
    writeToPortProgress: false,
    writeToPortProgressValue: "",
    portConsoleTxt: []
  }),
  sockets: {
    onSinglePortData(data) {
      if (data.target === localStorage.id) this.onSinglePortDataCallback(data);
    }
  },
  methods: {
    ...mapMutations(["SET_TRANSMISSION_PROCESS_STATE"]),
    onSinglePortDataCallback(data) {
      this.portConsoleTxt.unshift("-> data received: " + data.data);
    },
    pausePort(portName) {
      this.portConsoleTxt.unshift(
        "-> Pause emitting data on port: " + portName
      );
      PortsServices.pauseEmittingPort(portName)
        .then(result => {
          this.portConsoleTxt.unshift("-> Emitting data on port is paused");
          this.resumePortDis = false; //! means enable btn
          this.pausePortDis = true; //! means disable btn
          this.$parent.$parent.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    resumePort(portName) {
      this.portConsoleTxt.unshift(
        "-> Resume emitting data on port: " + portName
      );
      PortsServices.resumeEmittingPort(portName)
        .then(result => {
          this.portConsoleTxt.unshift("-> Emitting data on port is resumed");
          this.pausePortDis = false;
          this.resumePortDis = true;
          this.$parent.$parent.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    flushPort(portName) {
      this.portConsoleTxt.unshift("-> Flushing data on port: " + portName);
      PortsServices.flushPort(portName)
        .then(result => {
          this.portConsoleTxt.unshift("-> Data is flushed");
          this.$parent.$parent.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    openPort(portName) {
      this.portConsoleTxt.unshift("-> Opening port: " + portName);
      PortsServices.openPort(portName)
        .then(result => {
          this.portConsoleTxt.unshift("-> Port is opened");
          this.$parent.$parent.showSuccessSnackbar(result);
          this.openPortDis = true;
          this.resumePortDis = true;
          this.closePortDis = false;
          this.pausePortDis = false;
          this.flushPortDis = false;
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    closePort(portName) {
      this.portConsoleTxt.unshift("-> Closing port: " + portName);
      PortsServices.closePort(portName)
        .then(result => {
          this.portConsoleTxt.unshift("-> Port is closed");
          this.$parent.$parent.showSuccessSnackbar(result);
          this.openPortDis = false;
          this.resumePortDis = true;
          this.closePortDis = true;
          this.pausePortDis = true;
          this.flushPortDis = true;
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
            this.$parent.$parent.showErrorSnackbar(error);
          }
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
            this.$parent.$parent.showSuccessSnackbar(result);
          })
          .catch(error => {
            if (!error.includes("TypeError")) {
              this.portConsoleTxt.unshift("Error occurred: " + error);
              this.$parent.$parent.showErrorSnackbar(error);
            }
          });
      } else {
        this.$parent.$parent.showErrorSnackbar("Can NOT send empty data!!");
      }
    },
    closePortPanelDialog() {
      PortsServices.closePort(this.selectedPortObject.comName)
        .then(() => {
          this.leavePortPanelDialog = false;
          this.doShowPortPanel = false;
          this.openPortDis = true;
          this.resumePortDis = true;
          this.closePortDis = false;
          this.pausePortDis = false;
          this.flushPortDis = false;
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    showPortPanel(portObject) {
      this.selectedPortObject = portObject;
      PortsServices.isPortOpen(portObject.comName)
        .then(isOpen => {
          this.isSelectedPortOpened = isOpen;
          PortsServices.isPortActive(portObject.comName)
            .then(isPortActive => {
              if (isPortActive) {
                this.doShowPortPanel = false;
                this.$parent.$parent.showErrorSnackbar(
                  "The port is already active, you can't use the panel"
                );
              } else {
                this.doShowPortPanel = true;
              }
            })
            .catch(error => {
              this.$parent.$parent.showErrorSnackbar(
                "Error while checking port activeness status!" + error
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
          this.$parent.$parent.showErrorSnackbar(
            "Error while checking port open status!" + error
          );
        });
    },
    clearPortConsole() {
      this.portConsoleTxt = [];
    }
  }
};
</script>

<style>
</style>
