<template>
  <div>
    <!-- Toolbar -->
    <!-- <v-flex xs12>
      <v-toolbar color="teal" dark>
        <v-toolbar-title>Image Conversion</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar>
    </v-flex>-->
    <!-- Content -->
    <v-layout justify-center row wrap>
      <!-- Image Upload and display Section -->
      <v-flex d-flex xs12 sm12 md12 lg8 pa-1>
        <v-card>
          <v-card-text>
            <input
              type="file"
              @change="fileIsSelected"
              accept=".png, .jpg, .jpeg"
              style="display: none"
              ref="selectImageRef"
            >
            <div id="preview">
              <img v-if="url" :src="url">
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn flat @click="clear">Clear</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="teal"
              v-show="selectedFile == null"
              @click="$refs.selectImageRef.click()"
            >Select</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <!-- Parameters Section -->
      <v-flex d-flex xs12 sm12 md12 lg4 pa-1>
        <v-card>
          <v-card-title>
            <v-alert :value="true" dismissibale transition="scale-transition" type="warning">
              Tweak these parameters as long as you know what you are doing,
              or leave them by default
            </v-alert>
          </v-card-title>
          <v-card-text>
            <v-container fluid grid-list-lg>
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
                    v-model="scaleAxes"
                    class="mt-0"
                    type="number"
                    @focus="scaleAccessSnackbar = true"
                    @focusout="scaleAccessSnackbar = false"
                  ></v-text-field>
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
          </v-card-text>
          <v-card-actions>
            <v-tooltip top>
              <template #activator="data">
                <v-btn flat v-on="data.on" @click="restoreDefaultValues">
                  <v-icon color="teal">fas fa-undo-alt</v-icon>
                </v-btn>
              </template>
              <span>Restor default values for all the parameters</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template #activator="data">
                <v-btn v-show="!hidden" flat v-on="data.on" @click="performConversion">
                  <v-icon color="teal">fas fa-sync</v-icon>
                </v-btn>
              </template>
              <span>Start conversion process</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="displayRsultes == true" justify-center row wrap pa-1>
      <v-flex d-flex xs12>
        <v-toolbar color="teal" dark>
          <v-toolbar-title>Conversion Results</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
      </v-flex>
      <v-flex d-flex xs12>
        <v-card>
          <v-card-text>
            <v-layout justify-center row wrap>
              <!-- The configuration -->
              <v-flex d-flex xs12 sm12 md5 lg5 px-1 py-1>
                <v-card color="teal lighten-1" class="white--text elevation-5">
                  <v-card-title>
                    <p class="font-weight-bold">Conversion Parameters</p>
                  </v-card-title>
                  <v-card-text class="d-flex">
                    <v-list dense>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Tool Diameter:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ oldtoolDiameter }} mm</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Sensitivity:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ oldsensitivity }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Scale Axes:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ oldscaleAxes }} mm</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Deep Step:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ olddeepStep }} mm</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Black Z:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ oldblackZ }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">White Z:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ oldwhiteZ }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Safe Z:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ oldsafeZ }}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Image Size:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ imegSize }}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Started At:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ startTime }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Ended At:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ endTime }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Elapsed Time:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ elapsedTime }} s</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-flex>
              <!-- Error black pixel card -->
              <v-flex d-flex xs12 sm12 md7 lg7 px-1 py-1>
                <v-card color="teal lighten-1" class="white--text elevation-5">
                  <v-card-title>
                    <p class="font-weight-bold">Proccessed Plack Pixels</p>
                  </v-card-title>
                  <v-card-text class="d-flex align-center justify-center">
                    <v-tooltip bottom>
                      <template #activator="data">
                        <v-progress-circular
                          :rotate="360"
                          :size="150"
                          :width="10"
                          :value="value"
                          color="white"
                          v-on="data.on"
                        >{{ value }}</v-progress-circular>
                      </template>
                      <span>The percentage of the proccessed black pixels in the picture</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template #activator="data">
                        <v-progress-circular
                          :rotate="360"
                          :size="150"
                          :width="10"
                          :value="errorValue"
                          color="red darken-4"
                          v-on="data.on"
                        >{{ errorValue }}</v-progress-circular>
                      </template>
                      <span>The percentage of the unproccessed black pixels in the picture</span>
                    </v-tooltip>
                    <!-- <p class="font-weight-medium" style="font-size: 125px">0</p>s -->
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-text>
                    <p class="font-weight-bold">GCode File Information</p>
                    <v-list dense>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Name:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ fileName }}</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content class="font-weight-bold">Size:</v-list-tile-content>
                        <v-list-tile-content class="align-end">{{ size }} Mb</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <!-- <v-list-tile-content class="font-weight-bold">file:</v-list-tile-content> -->
                        <v-list-tile-content class="align-center">
                          <v-tooltip bottom>
                            <template #activator="data">
                              <v-btn
                                :loading="loading3"
                                :disabled="loading3"
                                color="teal darken-3"
                                class="white--text"
                                v-on="data.on"
                                @click="initializeDrawOperation"
                              >
                                <v-icon left dark>fas fa-draw-polygon</v-icon>Draw
                              </v-btn>
                            </template>
                            <span>Send generated gcode to machine</span>
                          </v-tooltip>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="consolesArea == true" justify-center row wrap pa-1>
      <v-flex xs12 sm12 md12 lg4>
        <!-- Transmission Console Area -->
        <v-layout justify-center row wrap pa-1>
          <v-flex d-flex xs12 sm12 md12 lg12>
            <v-toolbar color="teal" dark>
              <v-toolbar-title>Transmission Process Console</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template #activator="data">
                  <v-btn v-on="data.on" icon @click="clearTransmissionConsole()">
                    <v-icon>fas fa-eraser</v-icon>
                  </v-btn>
                </template>
                <span>Clear the console</span>
              </v-tooltip>
            </v-toolbar>
          </v-flex>
          <v-flex d-flex xs12 sm12 md12 lg12>
            <v-card color="teal lighten-4" height="300px" class="scroll">
              <v-card-text class="p-0 teal--text darken-4">
                <table>
                  <tr
                    v-for="(line, index) in transmissionConsoleTxt"
                    :key="index"
                    class="p-0 m-0 font-weight-medium"
                  >
                    <td class="red--text darken-1">{{line.split("|")[0]}}</td>
                    <td>{{"->"+line.split("|")[1]}}</td>
                  </tr>
                </table>
                <br>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12 md12 lg8>
        <!-- Port Console Area -->
        <v-layout justify-center row wrap pa-1>
          <v-flex d-flex xs12>
            <v-toolbar color="teal" dark>
              <v-toolbar-title>Port Data Console</v-toolbar-title>
              <v-spacer></v-spacer>
              <div v-if="port != undefined">
                <v-tooltip bottom>
                  <template #activator="data">
                    <v-btn v-on="data.on" icon @click="flushPort()">
                      <v-icon>fas fa-stop-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Flush both incoming and outgoing data on the port</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="data">
                    <v-btn v-on="data.on" icon @click="pausePort()">
                      <v-icon>fas fa-pause-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Pause all incoming data on the port</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="data">
                    <v-btn v-on="data.on" icon @click="resumePort()">
                      <v-icon>fas fa-play-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Resume all incoming data on the port</span>
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
            </v-toolbar>
          </v-flex>
          <v-flex d-flex xs12>
            <v-card color="teal lighten-4" height="300px" class="scroll">
              <v-card-text class="p-0 teal--text darken-4">
                <table>
                  <tr
                    v-for="(line, index) in portConsoleTxt"
                    :key="index"
                    class="p-0 m-0 font-weight-medium"
                  >
                    <td class="red--text darken-1">{{line.split("|")[0]}}</td>
                    <td>{{" "+line.split("|")[1]}}</td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Transmission 1st phase dialoge -->
    <v-dialog v-model="portsListDialog" persistent width="700px">
      <v-card>
        <v-card-title class="teal darken-4 py-4 title white--text">GCode File Transmission</v-card-title>
        <v-card-text class="py-0 px-0">
          <v-progress-linear v-if="portsListProgress" :indeterminate="true" color="teal"></v-progress-linear>
          <v-container grid-list-sm>
            <v-alert
              :value="true"
              type="info"
              class="mb-2"
            >This operation will send the generated gcode file to the machine over the selected port and it will start drawing the coordinates the process will take to much time (1s for each line of code), you can monitor the whole process and the incoming data from the console below.</v-alert>
            <p class="title">Chose port:</p>
            <v-list v-if="portsList.length !== 0">
              <v-list-tile
                v-for="(port, index) in portsList"
                :key="index"
                @click="startTransmitingGCode(port.comName)"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="font-weight-bold">{{ port.comName }}</v-list-tile-title>
                  <v-list-tile-sub-title
                    class="font-weight-medium font-italic"
                  >{{ port.manufacturer }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list v-else>
              <v-alert :value="true" type="error">No port is active!</v-alert>
            </v-list>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="teal" @click="portsListDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Conversion Process Dialog -->
    <v-dialog v-model="dialog" persistent width="500">
      <v-card color="teal" dark>
        <v-card-title class="font-weight-bold">Starting Conversion Process</v-card-title>
        <v-card-text>The process of converting an image into GCode take a considerable amount of time, so be patient</v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Draw Errors Dialog -->
    <v-dialog v-model="drawErrorsDialog" width="500">
      <v-card color="error" dark>
        <v-card-title class="font-weight-bold">Opps Error</v-card-title>
        <v-card-text>{{error}}</v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="teal" @click="drawErrorsDialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Snackbars -->
    <v-snackbar
      v-model="scaleAccessSnackbar"
      :timeout="0"
      :bottom="'bottom'"
      :color="'teal darkren-4'"
      :multi-line="'multi-line'"
    >For Scale Axes use the height value of the image, you can multiply it by a number to apply scale up, or divide it by a number to apply scale down</v-snackbar>
    <!-- Main Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      :bottom="'bottom'"
      :color="snackbarColor"
      :multi-line="'multi-line'"
    >{{ snackbarContent }}</v-snackbar>
  </div>
</template>
<script>
import ConversionServices from "@/services/conversion.js";
import PortsServices from "@/services/ports.js";
import Pusher from "pusher-js";
import { setTimeout } from "timers";
export default {
  data: () => ({
    //? for download button
    loader: null,
    loading3: false,
    //? to display the results section
    displayRsultes: true,
    //? for image file
    selectedFile: null,
    url: require("@/assets/default.png"),
    //? for fab button
    hidden: true,
    //? for dialog
    dialog: false,
    //? for progress in dialog window
    progress: 1,
    //? conversion params ...
    toolDiameter: 1,
    sensitivity: 0.95,
    scaleAxes: 0,
    deepStep: -1,
    blackZ: -2,
    whiteZ: 0,
    safeZ: 1,
    work: 1200,
    idle: 3000,
    //? for gcode file
    fileName: "sm-sample",
    size: 0,
    link: null,
    //? for conversion details in results section
    oldtoolDiameter: 1,
    oldsensitivity: 0.95,
    oldscaleAxes: 0,
    olddeepStep: -1,
    oldblackZ: -2,
    oldwhiteZ: 0,
    oldsafeZ: 1,
    oldwork: 1200,
    oldidle: 3000,
    imegSize: "",
    startTime: null,
    endTime: null,
    elapsedTime: 0,
    //? for errBlackPixel progress
    value: 0,
    errorValue: 0,
    //? snackbar details ...
    snackbarContent: "",
    snackbarColor: "",
    snackbar: false,
    //? for scale axes info
    scaleAccessSnackbarColor: "info",
    scaleAccessSnackbar: false,
    //? for transmission 1st phase
    portsListDialog: false,
    displayPortConsole: true,
    //? for ports list
    portsList: [],
    portsListProgress: true,
    //? for console
    portConsoleTxt: [],
    //? darw operation errors dialog
    drawErrorsDialog: false,
    error: "",
    //? for binding pusher channel
    isPortBinded: false,
    isLogBinded: false,
    port: undefined,
    //? for transmission process
    displayTransmissionConsole: true,
    transmissionConsoleTxt: [],
    consolesArea: true
  }),
  methods: {
    fileIsSelected(event) {
      this.selectedFile = event.target.files[0];
      this.url = URL.createObjectURL(this.selectedFile);
      this.hidden = false;
    },
    clear() {
      this.selectedFile = null;
      this.url = require("@/assets/default.png");
      this.hidden = true;
      this.displayRsultes = false;
    },
    restoreDefaultValues() {
      this.toolDiameter = 1;
      this.sensitivity = 0.95;
      this.scaleAxes = 0;
      this.deepStep = -1;
      this.blackZ = -2;
      this.whiteZ = 0;
      this.safeZ = 1;
      this.work = 1200;
      this.idle = 3000;
    },
    performConversion() {
      if (this.scaleAxes == 0) {
        this.snackbarColor = "error";
        this.snackbarContent =
          "Scale Axes Should Not Be Equale to Zero (0), Use Image Height";
        this.snackbar = true;
      } else {
        if (this.selectedFile != null) {
          this.dialog = true;
          // call th api endpoint
          const fd = new FormData();
          fd.append("image", this.selectedFile, this.selectedFile.name);
          fd.append(
            "parameters",
            JSON.stringify({
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
          );
          ConversionServices.ConvertImage(fd)
            .then(result => {
              this.displayRsultes = true;
              this.dialog = false;
              // console.log(result.data);
              // const config = result.data.data;
              this.oldtoolDiameter = result.toolDiameter;
              this.oldsensitivity = result.sensitivity;
              this.oldscaleAxes = result.scaleAxes;
              this.olddeepStep = result.deepStep;
              this.oldwhiteZ = result.whiteZ;
              this.oldblackZ = result.blackZ;
              this.oldsafeZ = result.safeZ;
              this.oldwork = result.feedrate.work;
              this.oldidle = result.feedrate.idle;
              this.value = Math.round(100 - result.errBlackPixel);
              this.errorValue = Math.round(result.errBlackPixel);
              this.imegSize = result.imgSize;
              this.fileName = result.fileName;
              this.startTime = result.startTime;
              this.endTime = result.endTime;
              this.elapsedTime = result.elapsedTime.toFixed(2);
              this.size = result.size.toFixed(2);
            })
            .catch(error => {
              this.dialog = false;
              this.snackbar = true;
              this.snackbarColor = "error";
              this.snackbarContent = error;
              this.loading = false;
            });
        } else {
          this.snackbarColor = "error";
          this.snackbarContent = "No Image is Selected";
          this.snackbar = true;
        }
      }
    },
    initializeDrawOperation() {
      this.portsListDialog = true;
      PortsServices.getConnectedPortsList()
        .then(result => {
          this.portsListProgress = false;
          if (result.count !== 0) {
            this.portsList = result.ports;
          }
        })
        .catch(error => {
          this.portsListProgress = false;
          this.portsListDialog = false;
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarContent = error;
        });
    },
    subscribeToPorts(eventName) {
      Pusher.logToConsole = true;
      let pusher = new Pusher("ced4b5ad59f10ab2a746", {
        cluster: "eu",
        forceTLS: true
      });
      pusher.subscribe("ports");
      this.isPortsBinded = true;
      pusher.bind(eventName, data => {
        // console.log("data.data.length :", data.data.length);
        if (data.data.length == 0) {
          console.warn("data is empty!");
        } else {
          this.portConsoleTxt.unshift(data.data);
        }
      });
    },
    subscribeToLog(eventName) {
      Pusher.logToConsole = true;
      let pusher = new Pusher("ced4b5ad59f10ab2a746", {
        cluster: "eu",
        forceTLS: true
      });
      pusher.subscribe("logs");
      this.isLogBinded = true;
      pusher.bind(eventName, data => {
        // console.log("data.data.length :", data.data.length);
        if (data.data.length == 0) {
          console.warn("data is empty!");
        } else {
          this.transmissionConsoleTxt.unshift(data.data);
        }
      });
    },
    startTransmitingGCode(port) {
      this.port = port;
      if (this.fileName !== undefined && this.fileName !== "") {
        // const splitted = this.fileName.split(".");
        // const fileName = splitted[0] + "." + splitted[1];
        //! if you bind multiple times, it will show data multiple time also
        if (!this.isPortsBinded) {
          this.subscribeToPorts("on-data");
        } else {
          console.log("Already subscribed");
        }
        if (!this.isLogBinded) {
          this.subscribeToLog("on-log");
        } else {
          console.log("Already subscribed");
        }
        setTimeout(() => {
          PortsServices.performFullDrawOperation(this.fileName, port)
            .then(result => {
              console.log(result);
              this.snackbar = true;
              this.snackbarColor = "success";
              this.snackbarContent = result.success;
              this.portsListDialog = false;
            })
            .catch(error => {
              this.portsListDialog = false;
              console.log(error);
              this.portConsoleTxt.push("Operation: " + error.operation);
              this.portConsoleTxt.push("Message: " + error.failure);
              this.snackbar = true;
              this.snackbarColor = "error";
              this.snackbarContent = error.failure;
              if (error.isPortClosed) {
                this.portConsoleTxt.push(
                  "Port Status: " + error.isPortClosed === true
                    ? " Closed"
                    : " Opened"
                );
              }
            });
        }, 500);
      } else {
        this.portsListDialog = false;
        this.snackbar = true;
        this.snackbarColor = "error";
        this.snackbarContent = "Gcode file name is missing!";
      }
    },
    selectingPort(portName, start) {
      if (start) {
        this.startTransmitingGCode(portName);
      } else {
        this.port = portName;
      }
    },
    pausePort() {
      if (this.port) {
        console.warn("pausePort() is called, port is " + this.port);
        PortsServices.pauseEmittingPort(this.port)
          .then(result => {
            this.snackbar = true;
            this.snackbarColor = "success";
            this.snackbarContent = result.success;
          })
          .catch(error => {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarContent = error;
          });
      } else {
        console.warn("port is undefined!!");
      }
    },
    resumePort() {
      if (this.port) {
        console.warn("resumePort() is called, port is " + this.port);
        PortsServices.resumeEmittingPort(this.port)
          .then(result => {
            this.snackbar = true;
            this.snackbarColor = "success";
            this.snackbarContent = result.success;
          })
          .catch(error => {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarContent = error;
          });
      } else {
        console.warn("port is undefined!!");
      }
    },
    flushPort() {
      if (this.port) {
        console.warn("flushPort() is called, port is " + this.port);
        PortsServices.flushPort(this.port)
          .then(result => {
            this.snackbar = true;
            this.snackbarColor = "success";
            this.snackbarContent = result.success;
          })
          .catch(error => {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarContent = error;
          });
      } else {
        console.warn("port is undefined!!");
      }
    },
    clearPortConsole() {
      this.portConsoleTxt = [];
    },
    clearTransmissionConsole() {
      this.transmissionConsoleTxt = [];
    }
  }
};
</script>
<style scopped>
#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

#preview img {
  width: 600px;
  max-height: 900px;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.scroll {
  overflow-y: auto;
}
</style>
