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
          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn dark flat :disabled="openPortDis" @click="openPort(selectedPortObject.comName)">
              <v-icon left>fas fa-door-open</v-icon>Open Port
            </v-btn>
            <v-btn
              dark
              flat
              :disabled="closePortDis"
              @click="closePort(selectedPortObject.comName)"
            >
              <v-icon left>fas fa-door-closed</v-icon>Close Port
            </v-btn>
            <v-btn
              dark
              flat
              :disabled="flushPortDis"
              @click="flushPort(selectedPortObject.comName)"
            >
              <v-icon left>fas fa-arrow-alt-circle-down</v-icon>Flush Data
            </v-btn>
            <v-btn
              dark
              flat
              :disabled="resumePortDis"
              @click="resumePort(selectedPortObject.comName)"
            >
              <v-icon left>fas fa-play-circle</v-icon>Resume Data
            </v-btn>
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
        >Only "Port Name" is guaranteed 100%, other data are related to the connected device of the current port.</v-alert>
        <v-layout row wrap>
          <!-- Port information -->
          <v-flex xs12 sm12 ms12 lg8>
            <v-list two-line v-if="selectedPortObject != undefined">
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
          </v-flex>
          <!-- Machine Control Btns -->
          <v-flex xs12 sm12 md12 lg4>
            <v-container>
              <!-- Section Title -->
              <v-layout row>
                <v-spacer></v-spacer>
                <p class="font-weight-light title text-xs-center">Machine Axes Movement</p>
                <v-spacer></v-spacer>
              </v-layout>
              <!-- Y up & Z up -->
              <v-layout align-center justify-space-around row>
                <v-flex xs4>
                  <v-btn
                    color="red"
                    fab
                    class="elevation-2"
                    :disabled="!openPortDis"
                    @click="move_Y_Up(selectedPortObject.comName)"
                  >
                    <v-icon color="white">fas fa-chevron-circle-up</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs4>
                  <v-btn
                    color="blue"
                    fab
                    class="elevation-2"
                    :disabled="!openPortDis"
                    @click="move_Z_Up(selectedPortObject.comName)"
                  >
                    <v-icon color="white">fas fa-chevron-circle-up</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4>
                  <v-btn
                    color="green"
                    fab
                    class="elevation-2"
                    :disabled="!openPortDis"
                    @click="move_X_Left(selectedPortObject.comName)"
                  >
                    <v-icon color="white">fas fa-chevron-circle-left</v-icon>
                  </v-btn>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs4>
                  <v-btn
                    color="green"
                    fab
                    class="elevation-2"
                    :disabled="!openPortDis"
                    @click="move_X_Right(selectedPortObject.comName)"
                  >
                    <v-icon color="white">fas fa-chevron-circle-right</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <!-- X left & right -->
              <v-layout align-center justify-space-around row>
                <v-flex xs4>
                  <v-btn
                    color="red"
                    fab
                    class="elevation-2"
                    :disabled="!openPortDis"
                    @click="move_Y_Down(selectedPortObject.comName)"
                  >
                    <v-icon color="white">fas fa-chevron-circle-down</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs4>
                  <v-btn
                    color="blue"
                    fab
                    class="elevation-2"
                    :disabled="!openPortDis"
                    @click="move_Z_Down(selectedPortObject.comName)"
                  >
                    <v-icon color="white">fas fa-chevron-circle-down</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <!-- Y & Z down -->
              <v-layout align-center justify-center row>
                <v-flex xs12>
                  <v-chip>
                    <v-avatar class="red"></v-avatar>Y axis
                  </v-chip>
                </v-flex>
                <v-flex xs12>
                  <v-chip>
                    <v-avatar class="green"></v-avatar>X axis
                  </v-chip>
                </v-flex>
                <v-flex xs12>
                  <v-chip>
                    <v-avatar class="blue"></v-avatar>Z axis
                  </v-chip>
                </v-flex>
              </v-layout>
              <!-- Step -->
              <v-layout align-center justify-center row>
                <v-spacer></v-spacer>
                <v-flex xs2>
                  <span>Step Size:</span>
                </v-flex>
                <v-flex xs5>
                  <v-text-field
                    type="number"
                    max="50"
                    v-model="step"
                    color="teal"
                    suffix="mm"
                    hint="For safety, Don't pass 40mm"
                    persistent-hint
                    :error="stepError"
                    :error-messages="stepErrorMsg"
                    @input="validateStepSize()"
                    @blur="validateStepSize()"
                  ></v-text-field>
                  <!-- @change="validateStepSize()" -->
                </v-flex>
                <v-spacer></v-spacer>
              </v-layout>
              <!-- <v-layout align-center justify-center row>
                <v-flex xs6>
                  <v-btn
                    color="teal"
                    class="elevation-2"
                    :disabled="!openPortDis"
                    @click="resetToZero(selectedPortObject.comName)"
                  >
                    Reset To Zero
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn
                    color="teal"
                    class="elevation-2"
                    :disabled="!openPortDis"
                    @click="returnToZero(selectedPortObject.comName)"
                  >
                    Return To Zero
                  </v-btn>
                </v-flex>
              </v-layout>-->
            </v-container>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <!-- Port console -->
        <v-layout row wrap>
          <v-flex xs12 sm12 px-3 class="hidden-md-and-up">
            <v-toolbar
              color="teal lighten-4"
              class="elevation-0 mt-2 teal--text text--darken-1"
              card
            >
              <v-toolbar-items>
                <v-btn-toggle>
                  <v-btn
                    dark
                    color="teal darken-2"
                    flat
                    :disabled="openPortDis"
                    @click="openPort(selectedPortObject.comName)"
                  >
                    <v-icon>fas fa-door-open</v-icon>
                  </v-btn>
                  <v-btn
                    dark
                    color="teal darken-2"
                    flat
                    :disabled="closePortDis"
                    @click="closePort(selectedPortObject.comName)"
                  >
                    <v-icon>fas fa-door-closed</v-icon>
                  </v-btn>
                  <v-btn
                    dark
                    color="teal darken-2"
                    flat
                    :disabled="flushPortDis"
                    @click="flushPort(selectedPortObject.comName)"
                  >
                    <v-icon>fas fa-arrow-alt-circle-down</v-icon>
                  </v-btn>
                  <v-btn
                    dark
                    color="teal darken-2"
                    flat
                    :disabled="resumePortDis"
                    @click="resumePort(selectedPortObject.comName)"
                  >
                    <v-icon>fas fa-play-circle</v-icon>
                  </v-btn>
                  <v-btn
                    dark
                    color="teal darken-2"
                    flat
                    :disabled="pausePortDis"
                    @click="pausePort(selectedPortObject.comName)"
                  >
                    <v-icon>fas fa-pause-circle</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-toolbar-items>
            </v-toolbar>
          </v-flex>
          <v-flex xs12 sm12 px-3>
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
                  :disabled="!openPortDis"
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
          <v-flex xs12 sm12 pb-3>
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
import { mapMutations, mapState } from "vuex";

export default {
  data: () => ({
    //? to show or hide ports console bottom sheet
    doShowPortPanel: false,
    // selectedPortObject: undefined,
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
    portConsoleTxt: [],
    step: 10,
    stepError: false,
    stepErrorMsg: ""
  }),
  sockets: {
    onSinglePortData(data) {
      if (data.target === localStorage.id) this.onSinglePortDataCallback(data);
    }
  },
  computed: {
    ...mapState(["selectedPortObject"])
  },
  methods: {
    ...mapMutations([
      "SET_TRANSMISSION_PROCESS_STATE",
      "SET_SELECTED_PORT_OBJECT"
    ]),
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
          .then(() => {
            // this.writeToPortTextField = "";
            // this.$parent.$parent.showSuccessSnackbar(result);
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
    hidePanel() {
      this.leavePortPanelDialog = false;
      this.doShowPortPanel = false;
      this.openPortDis = false;
      this.resumePortDis = true;
      this.closePortDis = true;
      this.pausePortDis = true;
      this.flushPortDis = true;
      this.clearPortConsole();
    },
    closePortPanelDialog() {
      PortsServices.closePort(this.selectedPortObject.comName)
        .then(() => {
          this.hidePanel();
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    showPortPanel(portObject) {
      // this.selectedPortObject = portObject;
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
    },
    validateStepSize() {
      if (this.step >= 50) {
        this.stepError = true;
        this.stepErrorMsg = "For safety, step size should be less than 50mm";
      } else {
        this.stepError = false;
        this.stepErrorMsg = "";
      }
    },
    //? when sending G90 (Absolute positioning) receiving "ok"
    //? when sending G01 X0.0000 Y-0.0000 Z1 (X0 Y0 Z1 Line Init) receiving "error:22"
    //? when sending G01 M05 (X0 Y0 M05 Line Init) receiving "error:22"
    returnToZero(portName) {
      this.portConsoleTxt.unshift("Returning Axes to position zero");
      PortsServices.writeToPort(portName, "G90 G28 X0 Y0" + "\r")
        .then(() => {
          // this.$parent.$parent.showSuccessSnackbar(result);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
          } else {
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    // ! gcode command is not working here
    resetToZero(portName) {
      this.portConsoleTxt.unshift("Reseting Axes to position zero");
      PortsServices.writeToPort(portName, "G10 P0 X0 Y0 Z0" + "\r")
        .then(() => {
          // this.$parent.$parent.showSuccessSnackbar(result);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
          } else {
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    move_X_Right(portName) {
      this.portConsoleTxt.unshift(
        "Moving X Axis to right by " + this.step + " mm"
      );
      PortsServices.writeToPort(portName, "G91 G0 X" + this.step + "\r")
        .then(() => {
          // this.$parent.$parent.showSuccessSnackbar(result);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
          } else {
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    move_X_Left(portName) {
      this.portConsoleTxt.unshift(
        "Moving X Axis to left by " + this.step + " mm"
      );
      PortsServices.writeToPort(portName, "G91 G0 X-" + this.step + "\r")
        .then(() => {
          // this.$parent.$parent.showSuccessSnackbar(result);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
          } else {
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    move_Y_Up(portName) {
      this.portConsoleTxt.unshift("Moving Y Axis up by " + this.step + " mm");
      PortsServices.writeToPort(portName, "G91 G0 Y" + this.step + "\r")
        .then(() => {
          // this.$parent.$parent.showSuccessSnackbar(result);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
          } else {
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    move_Y_Down(portName) {
      this.portConsoleTxt.unshift("Moving Y Axis down by " + this.step + " mm");
      PortsServices.writeToPort(portName, "G91 G0 Y-" + this.step + "\r")
        .then(() => {
          // this.$parent.$parent.showSuccessSnackbar(result);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
          } else {
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    move_Z_Up(portName) {
      this.portConsoleTxt.unshift("Moving Z Axis up");
      PortsServices.writeToPort(portName, "G91 G0 Z1" + "\r")
        .then(() => {
          // this.$parent.$parent.showSuccessSnackbar(result);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
          } else {
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    },
    move_Z_Down(portName) {
      this.portConsoleTxt.unshift("Moving Z Axis down");
      PortsServices.writeToPort(portName, "G91 G0 Z-1" + "\r")
        .then(() => {
          // this.$parent.$parent.showSuccessSnackbar(result);
        })
        .catch(error => {
          if (!error.includes("TypeError")) {
            this.portConsoleTxt.unshift("Error occurred: " + error);
          } else {
            this.$parent.$parent.showErrorSnackbar(error);
          }
        });
    }
  }
};
</script>
<style>
</style>
