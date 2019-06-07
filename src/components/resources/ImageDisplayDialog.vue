<template>
  <div>
    <v-dialog v-model="imagePanel" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="teal lighten-1">
          <v-btn :disabled="closeImagePanelBtnDis" icon dark @click="prepareToCloseImagePanel()">
            <v-icon>fas fa-times-circle</v-icon>
          </v-btn>
          <v-toolbar-title>{{currentFileName}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              :disabled="disableImagePanelToolbarBtns"
              dark
              flat
              @click="displayDeleteFileConfirmationDialog()"
            >
              <v-icon left>fas fa-trash-alt</v-icon>Delete
            </v-btn>
            <v-btn
              :disabled="disableImagePanelToolbarBtns"
              dark
              flat
              @click="prepareQuickDrawOperation()"
            >
              <v-icon left>fas fa-pencil-ruler</v-icon>Draw
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <!-- Consoles Area & Image Preview -->
        <v-card-text>
          <div id="preview">
            <v-img :src="imageURL" contain max-height="600"/>
          </div>
          <!-- Consoles Area -->
          <v-layout v-if="consolesArea == true" row wrap pa-1>
            <!-- Transmission Console Area -->
            <v-flex xs12 sm12 md12 lg6 pa-1>
              <v-layout row wrap>
                <v-flex d-flex xs12 sm12 md12 lg12>
                  <v-toolbar
                    color="teal lighten-4"
                    class="elevation-0 teal--text text--darken-1"
                    card
                    dark
                    dense
                  >
                    <v-toolbar-title>Transmission Process Console</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <div v-if="currentActivePort != undefined">
                      <v-tooltip :disabled="stopSendDis" bottom>
                        <template #activator="data">
                          <v-btn
                            :disabled="stopSendDis"
                            v-on="data.on"
                            icon
                            @click="stopSendOperation()"
                          >
                            <v-icon>fas fa-stop-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>Stop sending gcode lines to port</span>
                      </v-tooltip>
                      <v-tooltip :disabled="resumeSendDis" bottom>
                        <template #activator="data">
                          <v-btn
                            :disabled="resumeSendDis"
                            v-on="data.on"
                            icon
                            @click="resumeSendOperation()"
                          >
                            <v-icon>fas fa-play-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>Resume sending gcode lines to port</span>
                      </v-tooltip>
                      <v-tooltip :disabled="pauseSendDis" bottom>
                        <template #activator="data">
                          <v-btn
                            :disabled="pauseSendDis"
                            v-on="data.on"
                            icon
                            @click="pauseSendOperation()"
                          >
                            <v-icon>fas fa-pause-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>Pause sending gcode lines port</span>
                      </v-tooltip>
                    </div>
                    <v-tooltip bottom>
                      <template #activator="data">
                        <v-btn v-on="data.on" icon @click="clearTransmissionConsole()">
                          <v-icon>fas fa-eraser</v-icon>
                        </v-btn>
                      </template>
                      <span>Clear the console</span>
                    </v-tooltip>
                    <v-btn icon @click="showTranmsissionConsole = !showTranmsissionConsole">
                      <v-icon>{{ showTranmsissionConsole ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                    </v-btn>
                  </v-toolbar>
                </v-flex>
                <v-flex d-flex xs12 sm12 md12 lg12>
                  <v-slide-y-transition>
                    <v-card
                      v-show="showTranmsissionConsole"
                      color="teal lighten-4 elevation-0"
                      height="300px"
                      class="scroll scrollbar-style"
                    >
                      <v-card-text class="teal--text darken-4">
                        <table>
                          <tr
                            v-for="(line, index) in transmissionConsoleTxt"
                            :key="index"
                            class="font-weight-medium"
                          >
                            <td class="red--text darken-1">{{line.split("|")[0]}}</td>
                            <td>{{"->"+line.split("|")[1]}}</td>
                          </tr>
                        </table>
                      </v-card-text>
                    </v-card>
                  </v-slide-y-transition>
                </v-flex>
              </v-layout>
            </v-flex>
            <!-- Port Console Area -->
            <v-flex xs12 sm12 md12 lg6 pa-1>
              <v-layout row wrap>
                <v-flex xs12 sm12 md12 lg12>
                  <v-toolbar
                    color="teal lighten-4"
                    class="elevation-0 teal--text text--darken-1"
                    card
                    dark
                    dense
                  >
                    <v-toolbar-title>Port Data Console</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <div v-if="currentActivePort != undefined">
                      <v-tooltip :disabled="flushPortDis" bottom>
                        <template #activator="data">
                          <v-btn :disabled="flushPortDis" v-on="data.on" icon @click="flushPort()">
                            <v-icon>fas fa-times-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>Flush both incoming and outgoing data on the port</span>
                      </v-tooltip>
                      <v-tooltip :disabled="resumePortDis" bottom>
                        <template #activator="data">
                          <v-btn
                            :disabled="resumePortDis"
                            v-on="data.on"
                            icon
                            @click="resumePort()"
                          >
                            <v-icon>fas fa-play-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>Resume all incoming data on the port</span>
                      </v-tooltip>
                      <v-tooltip :disabled="pausePortDis" bottom>
                        <template #activator="data">
                          <v-btn :disabled="pausePortDis" v-on="data.on" icon @click="pausePort()">
                            <v-icon>fas fa-pause-circle</v-icon>
                          </v-btn>
                        </template>
                        <span>Pause all incoming data on the port</span>
                      </v-tooltip>
                    </div>
                    <v-tooltip bottom>
                      <template #activator="data">
                        <v-btn v-on="data.on" icon @click="clearPortConsole()">
                          <v-icon>fas fa-eraser</v-icon>
                        </v-btn>
                      </template>
                      <span>Clear the console</span>
                    </v-tooltip>
                    <v-btn icon @click="showPortConsole = !showPortConsole">
                      <v-icon>{{ showPortConsole ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                    </v-btn>
                  </v-toolbar>
                </v-flex>
                <v-flex d-flex xs12 sm12 md12 lg12>
                  <v-slide-y-transition>
                    <v-card
                      v-show="showPortConsole"
                      color="teal lighten-4 elevation-0"
                      height="300px"
                      class="scroll scrollbar-style"
                    >
                      <v-card-text class="teal--text darken-4">
                        <table>
                          <tr
                            v-for="(line, index) in portConsoleTxt"
                            :key="index"
                            class="font-weight-medium"
                          >
                            <td class="red--text darken-1">{{line.split("|")[0]}}</td>
                            <td>{{" "+line.split("|")[1]}}</td>
                          </tr>
                        </table>
                      </v-card-text>
                    </v-card>
                  </v-slide-y-transition>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Params dialog -->
    <v-dialog v-model="showConversionParamsDialog" persistent max-width="500">
      <v-card>
        <v-card-text>
          <v-alert
            :value="showBeforConversionAlert"
            color="teal darken-4"
            transition="fade-transition"
          >The image doesn't have a gcode file, enter paramaters to convert it first.</v-alert>
          <v-alert
            :value="showConversionResultAlert"
            color="teal darken-4"
            transition="fade-transition"
          >This is the percentages of the proccessed and unproccessed pixels in the picture.</v-alert>
          <v-progress-linear
            v-show="showConversionProgress"
            :indeterminate="true"
            color="teal darken-2"
          ></v-progress-linear>
          <v-container fluid grid-list-lg v-if="doShowParamsForm">
            <v-flex xs12>
              <v-subheader class="pl-0">Tool Diameter</v-subheader>
              <v-slider
                v-model="toolDiameter"
                color="teal"
                thumb-label="always"
                min="0"
                max="3"
                step="0.01"
              ></v-slider>
            </v-flex>
            <v-flex xs12>
              <v-subheader class="pl-0">Sensitivity</v-subheader>
              <v-slider
                v-model="sensitivity"
                color="teal"
                thumb-label="always"
                min="0"
                max="1"
                step="0.01"
              ></v-slider>
            </v-flex>
            <v-layout justify-center row wrap>
              <v-flex xs12 sm12 md6 lg6>
                <v-text-field
                  label="Scale Axes"
                  persistent-hint
                  hint="This field is required"
                  v-model="scaleAxes"
                  class="mt-0"
                  type="number"
                  :error="scaleAxesErrorState"
                  :error-messages="scaleAxesErrorContent"
                ></v-text-field>
                <!-- @focus="scaleAccessSnackbar = true"
                @focusout="scaleAccessSnackbar = false"-->
              </v-flex>
              <v-flex xs12 sm12 md6 lg6>
                <v-text-field label="Deep Step" v-model="deepStep" class="mt-0" type="number"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout justify-center row wrap>
              <v-flex xs12 sm12 md4 lg4>
                <v-text-field label="White Z" v-model="whiteZ" class="mt-0" type="number"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md4 lg4>
                <v-text-field label="Black Z" v-model="blackZ" class="mt-0" type="number"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md4 lg4>
                <v-text-field label="Safe Z" v-model="safeZ" class="mt-0" type="number"></v-text-field>
              </v-flex>
            </v-layout>Feed Rate
            <v-layout justify-center row wrap>
              <v-flex xs12 sm12 md6 lg6>
                <v-text-field label="Work" v-model="work" class="mt-0" type="number"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6 lg6>
                <v-text-field label="Idle" v-model="idle" class="mt-0" type="number"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-container v-else>
            <v-layout align-center justify-center row fill-height wrap>
              <v-flex xs12 sm12 md6 lg6>
                <v-layout align-center justify-center row fill-height>
                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-progress-circular
                        :rotate="360"
                        :size="170"
                        :width="20"
                        :value="proccessBlackPixelsValue"
                        color="teal lighten-1"
                        v-on="data.on"
                      >{{ proccessBlackPixelsValue }}%</v-progress-circular>
                    </template>
                    <span>The percentage of the proccessed black pixels in the picture</span>
                  </v-tooltip>
                </v-layout>
              </v-flex>
              <v-flex xs12 sm12 md6 lg6>
                <v-layout align-center justify-center row fill-height>
                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-progress-circular
                        :rotate="360"
                        :size="170"
                        :width="20"
                        :value="unproccessBlackPixelsValue"
                        color="red lighten-1"
                        v-on="data.on"
                      >{{ unproccessBlackPixelsValue }}%</v-progress-circular>
                    </template>
                    <span>The percentage of the unproccessed black pixels in the picture</span>
                  </v-tooltip>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            flat
            @click="showConversionParamsDialog = false"
            class="teal--text lighten-1"
          >Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="startConversionProcess()"
            v-show="doShowConversionBtn"
            color="teal lighten-1"
            class="white--text"
          >Convert</v-btn>
          <v-btn
            @click="reStartConversionProcess()"
            v-show="!doShowConversionBtn"
            :disabled="disableConversionCardActionBtns"
            color="white"
            class="teal--text"
          >Re-Convert</v-btn>
          <v-btn
            @click="prepareQuickDrawOperation()"
            v-show="!doShowConversionBtn"
            :disabled="disableConversionCardActionBtns"
            color="teal lighten-1"
            class="white--text"
          >Draw</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Ports List dialoge -->
    <PortsListDialog ref="portsListDialogRef"/>
    <!-- Delete file dialoge -->
    <DeleteFileConfirmationDialog ref="deleteFileConfirmationDialogRef"/>
  </div>
</template>
<script>
import ConversionServices from "@/services/conversion.js";
import PortsServices from "@/services/ports.js";
import FileServices from "@/services/files.js";

import { mapState, mapMutations } from "vuex";

const DeleteFileConfirmationDialog = () =>
  import("./DeleteFileConfirmationDialog.vue");
const PortsListDialog = () => import("@/components/ports/PortsListDialog.vue");

export default {
  components: {
    DeleteFileConfirmationDialog,
    PortsListDialog
  },
  data: () => ({
    imageURL: undefined,
    imagePanel: false,
    //? for params dialog --------------------
    showConversionParamsDialog: false,
    //? conversion params section ...
    doShowParamsForm: true,
    toolDiameter: 1,
    sensitivity: 0.95,
    scaleAxes: 0,
    scaleAxesErrorContent: "",
    scaleAxesErrorState: false,
    deepStep: -1,
    blackZ: -2,
    whiteZ: 0,
    safeZ: 1,
    work: 1200,
    idle: 3000,
    showBeforConversionAlert: true,
    //? conversion results section
    proccessBlackPixelsValue: 0,
    unproccessBlackPixelsValue: 0,
    showConversionResultAlert: false,
    //? data in consoles area ------------------------
    consolesArea: false,
    //? this variable is used to operate on the port when the transmission process is going on
    port: undefined,
    portConsoleTxt: [],
    transmissionConsoleTxt: [],
    showTranmsissionConsole: true,
    showPortConsole: true,
    //? to enable and disable control btns of transmission console panel
    stopSendDis: true,
    pauseSendDis: true,
    resumeSendDis: true,
    //? to enable and disable control btns of port console panel
    flushPortDis: false,
    pausePortDis: false,
    resumePortDis: true,
    //? conversion params dialog progress
    conversionProgressValue: 0,
    conversionProgressQuery: false,
    showConversionProgress: false,
    conversionProgressInterval: 0,
    closeImagePanelBtnDis: false
  }),
  sockets: {
    onPortData(data) {
      if (data.target == window.localStorage.getItem("id")) {
        this.onPortDataCallback(data.data);
      }
    },
    onTransmissionLog(data) {
      if (data.target == window.localStorage.getItem("id")) {
        this.onTransmissionLogCallback(data.data);
      }
    },
    onServerStatusChanged(data) {
      let status = data.status;
      this.stopSendDis = !status;
      this.pauseSendDis = !status;
      if (!status && data.target == window.localStorage.getItem("id")) {
        this.$parent.showSuccessSnackbar(
          "Transmission of file " + this.fileName + " Has been completed"
        );
        //TODO: close the port here
        this.closePort(this.currentActivePort);
        this.closeImagePanelBtnDis = false;
      }
    },
    onQuickConversionEnded(data) {
      if (data.target == window.localStorage.getItem("id")) {
        this.showConversionProgress = false;
        this.showConversionResultAlert = true;
        this.proccessBlackPixelsValue = 100 - data.conversionDetails;
        this.unproccessBlackPixelsValue = data.conversionDetails;
        this.$parent.showSuccessSnackbar("Converted successfully");
      }
    },
    onQuickConversionErrorOccur(data) {
      if (data.target == window.localStorage.getItem("id")) {
        this.doShowParamsForm = true;
        this.showConversionProgress = false;
        this.showConversionResultAlert = false;
        this.showBeforConversionAlert = true;
        this.$parent.showErrorSnackbar(data.errorData);
      }
    }
  },
  computed: {
    ...mapState([
      "isTransmissionProcessActive",
      "currentActivePort",
      "currentFileName"
    ]),
    disableConversionCardActionBtns() {
      //? when conversion progress is true, disable action btns
      return this.showConversionProgress;
    },
    doShowConversionBtn() {
      return this.doShowParamsForm;
    },
    disableImagePanelToolbarBtns() {
      return this.isTransmissionProcessActive;
    }
  },
  methods: {
    ...mapMutations([
      "SET_TRANSMISSION_PROCESS_STATE",
      "SET_CURRENT_ACTIVE_PORT",
      "SET_CURRENT_FILE_NAME"
    ]),
    onPortDataCallback(content) {
      if (content.length == 0) {
        // console.warn("data is empty!");
      } else {
        this.portConsoleTxt.unshift(content);
      }
    },
    onTransmissionLogCallback(data) {
      if (data.length == 0) {
        // console.warn("data is empty!");
      } else {
        this.transmissionConsoleTxt.unshift(data);
      }
    },
    selecteDeletionType() {
      this.deleteSelectedImage();
      this.$refs.deleteFileConfirmationDialogRef.toggoleDialogVisibility();
    },
    displayImage(name, path) {
      this.$parent.toggoleInProgress();
      FileServices.getImageData(path)
        .then(result => {
          this.$parent.toggoleInProgress();
          this.SET_CURRENT_FILE_NAME(name);
          this.imagePanel = true;
          this.imageURL = "data:image/" + result.ext + ";base64," + result.data;
        })
        .catch(error => {
          this.$parent.toggoleInProgress();
          this.$parent.showErrorSnackbar(error);
        });
    },
    displayDeleteFileConfirmationDialog() {
      this.$refs.deleteFileConfirmationDialogRef.toggoleDialogVisibility();
    },
    deleteSelectedImage() {
      FileServices.deleteImage(this.currentFileName)
        .then(() => {
          this.imagePanel = false;
          this.$parent.showSuccessSnackbar("Image deleted successfully");
        })
        .catch(error => {
          this.$parent.showErrorSnackbar(error);
        });
    },
    prepareQuickDrawOperation() {
      const splitted = this.currentFileName.split(".");
      const gcodeFileName = splitted[0] + "." + splitted[1] + ".gcode";
      let doesExist = this.$parent.doesGcodeFileExistInItems(gcodeFileName);
      // TODO: call parent function to see if gcode file exist
      // //? check the existance of the corresponding gcode file for the image
      // for (let i = 0; i < this.items[1].children.length; i++) {
      //   if (this.items[1].children[i].name == gcodeFileName) {
      //     doesExist = true;
      //     break;
      //   }
      // }
      if (doesExist) {
        this.showConversionParamsDialog = false;
        this.displayPortsListDialog();
      } else {
        this.showConversionParamsDialog = true;
      }
    },
    displayPortsListDialog() {
      this.$refs.portsListDialogRef.togglePortsListDialogeVisibility();
      this.$refs.portsListDialogRef.fetchPortsList();
    },
    startTransmitingGCode(portName) {
      this.$refs.portsListDialogRef.toggleProgressStatus();
      //? ensuring that the current file name is valide gcode file name
      if (this.currentFileName !== undefined && this.currentFileName !== "") {
        //? removing the extension from the fileName because the endpoint function uses gcode file name without ext
        const splitted = this.currentFileName.split(".");
        const fileName = splitted[0] + "." + splitted[1];
        //? disabling image panel close btn
        this.closeImagePanelBtnDis = true;
        this.SET_CURRENT_ACTIVE_PORT(portName);
        PortsServices.performFullDrawOperation(fileName, portName)
          .then(result => {
            this.$refs.portsListDialogRef.toggleProgressStatus();
            //? show consoles area
            this.consolesArea = true;
            //? hiding ports list dialog
            this.$refs.portsListDialogRef.togglePortsListDialogeVisibility();
            //? enabling pause & stop tranmission operations btns
            this.pauseSendDis = false;
            this.stopSendDis = false;
            //? enabling pause & flush port data btns
            this.pausePortDis = false;
            this.flushPortDis = false;
            //? activating transmission state variable
            this.SET_TRANSMISSION_PROCESS_STATE(true);
            this.$parent.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.closeImagePanelBtnDis = false;
            //? hiding ports list dialog
            this.$refs.portsListDialogRef.togglePortsListDialogeVisibility();
            this.SET_CURRENT_ACTIVE_PORT(undefined);
            //? showing the error about why the transmission process didn't start
            this.$parent.showErrorSnackbar(error.failure.split(":")[1]);
            //? disabling these lines becuase the consoles are hidden
            // this.portConsoleTxt.push("Operation: " + error.operation + "|");
            // this.portConsoleTxt.push("Message: " + error.failure + "|");
            // if (error.isPortClosed) {
            //   this.portConsoleTxt.push(
            //     "Port Status: " + error.isPortClosed ? " Closed|" : " Opened|"
            //   );
            // }
          });
      } else {
        this.$refs.portsListDialogRef.togglePortsListDialogeVisibility();
        this.$parent.showErrorSnackbar("Gcode file name is missing!");
      }
    },
    startConversionProcess() {
      //? checking the value of Scale Axes
      if (this.scaleAxes <= 50) {
        this.scaleAxesErrorState = true;
        this.scaleAxesErrorContent = "Scale Axes must be superior of 50";
      } else {
        const surfaceHeight = window.localStorage.getItem("surfaceHeight");
        if (this.scaleAxes < surfaceHeight) {
          this.showConversionProgress = true;
          this.showBeforConversionAlert = false;
          this.doShowParamsForm = false;
          this.scaleAxesErrorState = false;
          this.scaleAxesErrorContent = "";
          ConversionServices.QuickConvertImage(this.currentFileName, {
            toolDiameter: this.toolDiameter,
            sensitivity: this.sensitivity,
            scaleAxes: this.scaleAxes,
            deepStep: this.deepStep,
            blackZ: this.blackZ,
            whiteZ: this.whiteZ,
            safeZ: this.safeZ,
            work: this.work,
            idle: this.idle
          })
            .then(result => {
              this.$parent.showSuccessSnackbar(result.success);
            })
            .catch(error => {
              this.showConversionProgress = false;
              this.doShowParamsForm = true;
              this.$parent.showErrorSnackbar(error);
            });
        } else {
          this.scaleAxesErrorState = true;
          this.scaleAxesErrorContent =
            "Scale Axes must be less then the height of the surface (" +
            surfaceHeight +
            ")";
        }
      }
    },
    async reStartConversionProcess() {
      //? reseting scale axes value
      this.scaleAxes = 0;
      //? calculating the corresponding gcode file name
      const gcodeFileName =
        this.currentFileName.split(".")[0] +
        "." +
        this.currentFileName.split(".")[1] +
        ".gcode";
      //? deleting generated gcode file
      await FileServices.deleteGcodeFile(gcodeFileName)
        .then(() => {
          this.removeGcodeFileFormItems(gcodeFileName);
          //? showing params form, 'convert' btn & hiding 're-convert' btn
          this.doShowParamsForm = true;
        })
        .catch(() => {
          this.$parent.showErrorSnackbar(
            "There was an error while deleting the generated gcode file, try deleting it manually"
          );
        });
    },
    prepareToCloseImagePanel() {
      //? hide consoles area
      this.consolesArea = false;
      //? empty all the consoels data
      this.portConsoleTxt = [];
      this.transmissionConsoleTxt = [];
      this.scaleAxes = 0;
      this.doShowParamsForm = true;
      this.proccessBlackPixelsValue = 0;
      this.unproccessBlackPixelsValue = 0;
      //? close the panel
      this.imagePanel = false;
    },
    pausePort() {
      if (this.currentActivePort) {
        PortsServices.pauseEmittingPort(this.currentActivePort)
          .then(result => {
            this.resumePortDis = false; //! means enable btn
            this.pausePortDis = true; //! means disable btn
            this.$parent.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.$parent.showErrorSnackbar(error);
          });
      } else {
        this.$parent.showErrorSnackbar("No port is defined");
      }
    },
    resumePort() {
      if (this.currentActivePort) {
        PortsServices.resumeEmittingPort(this.currentActivePort)
          .then(result => {
            this.pausePortDis = false;
            this.resumePortDis = true;
            this.$parent.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.$parent.showErrorSnackbar(error);
          });
      } else {
        this.$parent.showErrorSnackbar("No port is defined");
      }
    },
    flushPort() {
      if (this.currentActivePort) {
        PortsServices.flushPort(this.currentActivePort)
          .then(result => {
            this.$parent.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.$parent.showErrorSnackbar(error);
          });
      } else {
        this.$parent.showErrorSnackbar("No port is defined");
      }
    },
    closePort(port) {
      PortsServices.closePort(port)
        .then(() => {
          this.portConsoleTxt.unshift("|Port was closed successfully");
          this.flushPortDis = true;
          this.pausePortDis = true;
        })
        .catch(error => {
          this.portConsoleTxt.unshift(
            "Error occurred while closing port: " + error
          );
          this.$parent.showErrorSnackbar(error);
        });
    },
    stopSendOperation() {
      if (this.currentActivePort) {
        PortsServices.stopSendOperation(this.currentActivePort)
          .then(result => {
            //? disable all btns
            this.pauseSendDis = true;
            this.resumeSendDis = true;
            this.stopSendDis = true;
            this.SET_TRANSMISSION_PROCESS_STATE(false);
            this.$parent.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.$parent.showErrorSnackbar(error);
          });
      } else {
        this.$parent.showErrorSnackbar(
          "No operation is running, port is undefined"
        );
      }
    },
    pauseSendOperation() {
      if (this.currentActivePort) {
        PortsServices.pauseSendOperation(this.currentActivePort)
          .then(result => {
            this.resumeSendDis = false;
            this.pauseSendDis = true;
            this.$parent.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.$parent.showErrorSnackbar(error);
          });
      } else {
        this.$parent.showErrorSnackbar(
          "No operation is running, port is undefined"
        );
      }
    },
    resumeSendOperation() {
      if (this.currentActivePort) {
        PortsServices.resumeSendOperation(this.currentActivePort)
          .then(result => {
            this.pauseSendDis = false;
            this.resumeSendDis = true;
            this.$parent.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.$parent.showErrorSnackbar(error);
          });
      } else {
        this.$parent.showErrorSnackbar(
          "No operation is running, port is undefined"
        );
      }
    },
    clearPortConsole() {
      this.portConsoleTxt = [];
    },
    clearTransmissionConsole() {
      this.transmissionConsoleTxt = [];
    },
    getFileType() {
      return "img";
    }
  }
};
</script>
<style>
</style>
