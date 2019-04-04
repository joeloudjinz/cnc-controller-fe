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
    <v-alert
      :value="isTransmissionProcessActive"
      type="error"
    >There is already a process going on, so you can't use this page again until that process is finished</v-alert>
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
            <v-btn
              flat
              @click="clear"
              :disabled="isConversionActive || isTransmissionProcessActive"
              color="teal darken-4"
            >Clear</v-btn>
            <v-spacer></v-spacer>
            <v-fade-transition>
              <v-btn
                color="teal"
                class="white--text"
                :disabled="isTransmissionProcessActive || isConversionActive"
                v-show="selectedFile == null"
                @click="$refs.selectImageRef.click()"
              >Select</v-btn>
            </v-fade-transition>
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
            <v-fade-transition>
              <v-tooltip top>
                <template #activator="data">
                  <v-btn
                    v-show="!showConversionBtn"
                    :disabled="isTransmissionProcessActive || isConversionActive"
                    flat
                    v-on="data.on"
                    @click="performConversion"
                  >
                    <v-icon color="teal">fas fa-sync</v-icon>
                  </v-btn>
                </template>
                <span>Start conversion process</span>
              </v-tooltip>
            </v-fade-transition>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- Conversion Results panel -->
    <v-layout v-if="displayRsultes == true" v-show="displayRsultes" justify-center row wrap pa-1>
      <v-flex d-flex xs12>
        <v-toolbar color="teal" dark card dense>
          <v-toolbar-title>Conversion Results</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-btn icon @click="showResultsPanel = !showResultsPanel">
            <v-icon>{{ showResultsPanel ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-toolbar>
      </v-flex>
      <v-flex d-flex xs12>
        <v-fade-transition>
          <v-card v-show="showResultsPanel">
            <v-card-text>
              <v-layout justify-center row wrap>
                <!-- Old configuration -->
                <v-flex xs12 sm12 md3 lg3 px-1>
                  <v-card color="teal lighten-1" class="white--text elevation-5 mb-1">
                    <v-card-text class="d-flex">
                      <table>
                        <header class="font-weight-bold py-2">Conversion Prameters</header>
                        <tr>
                          <td class="font-weight-meduim">Tool Diameter</td>
                          <td class="align-center">{{ oldtoolDiameter }} mm</td>
                        </tr>
                        <tr>
                          <td class="font-weight-meduim">Sensitivity</td>
                          <td class="align-center">{{ oldsensitivity }} mm</td>
                        </tr>
                        <tr>
                          <td class="font-weight-meduim">Scale Axes</td>
                          <td class="align-center">{{ oldscaleAxes }} mm</td>
                        </tr>
                        <tr>
                          <td class="font-weight-meduim">Deep Step</td>
                          <td class="align-center">{{ olddeepStep }} mm</td>
                        </tr>
                        <tr>
                          <td class="font-weight-meduim">Black Z</td>
                          <td class="align-center">{{ oldblackZ }}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-meduim">White Z</td>
                          <td class="align-center">{{ oldwhiteZ }}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-meduim">Safe Z</td>
                          <td class="align-center">{{ oldsafeZ }}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-meduim">Safe Z</td>
                          <td class="align-center">{{ oldsafeZ }}</td>
                        </tr>
                      </table>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <!-- Image size & times & file information -->
                <v-flex xs12 sm12 md5 lg5 px-1>
                  <v-card color="teal lighten-1" class="white--text elevation-5 mb-1">
                    <v-card-text class="d-flex">
                      <table>
                        <tr>
                          <td class="font-weight-bold">Image Size:</td>
                          <td class="align-end">{{ imegSize }}</td>
                        </tr>
                      </table>
                    </v-card-text>
                  </v-card>
                  <v-card color="teal lighten-1" class="white--text elevation-5 mb-1">
                    <v-card-text class="d-flex">
                      <table>
                        <tr>
                          <td class="font-weight-bold">Started at</td>
                          <td class="align-center">{{ startTime }}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold">Ended at</td>
                          <td class="align-center">{{ endTime }}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold">Elapsed Time</td>
                          <td class="align-center">{{ elapsedTime }} seconds</td>
                        </tr>
                      </table>
                    </v-card-text>
                  </v-card>
                  <v-card color="teal lighten-1" class="white--text elevation-5 my-1">
                    <v-card-text class="d-flex pb-4">
                      <!-- <p class="font-weight-bold">GCode File Information</p> -->
                      <table>
                        <tr>
                          <td class="font-weight-bold">File Name</td>
                          <td class="align-end">{{ fileName }}</td>
                        </tr>
                        <tr>
                          <td class="font-weight-bold">Size</td>
                          <td class="align-end">{{ size }} Mb</td>
                        </tr>
                      </table>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <!-- Proccessed black pixels progress circle -->
                <v-flex xs12 sm12 md4 lg4 px-1>
                  <v-card color="teal lighten-1" class="white--text elevation-5">
                    <v-card-text class="d-flex">
                      <v-tooltip bottom>
                        <template #activator="data">
                          <v-progress-circular
                            :rotate="360"
                            :size="220"
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
                            color="red lighten-1"
                            v-on="data.on"
                          >{{ errorValue }}</v-progress-circular>
                        </template>
                        <span>The percentage of the unproccessed black pixels in the picture</span>
                      </v-tooltip>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template #activator="data">
                  <v-btn
                    class="teal--text"
                    flat
                    v-on="data.on"
                    @click="initializeDrawOperation()"
                    :disabled="isTransmissionProcessActive"
                  >
                    <v-icon left dark>fas fa-draw-polygon</v-icon>Draw
                  </v-btn>
                </template>
                <span>Send generated gcode to machine</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-fade-transition>
      </v-flex>
    </v-layout>
    <!-- Consoles Area -->
    <v-layout v-if="consolesArea == true" justify-center row wrap pa-1>
      <!-- Transmission Console Area -->
      <v-flex xs12 sm12 md12 lg12 mb-2>
        <v-layout justify-center row wrap>
          <v-flex d-flex xs12 sm12 md12 lg12>
            <v-toolbar color="teal" dark dense>
              <v-toolbar-title>Transmission Process Console</v-toolbar-title>
              <v-spacer></v-spacer>
              <div v-if="port != undefined">
                <v-tooltip bottom>
                  <template #activator="data">
                    <v-btn :disabled="stopSendDis" v-on="data.on" icon @click="stopSendOperation()">
                      <v-icon>fas fa-stop-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Stop sending gcode lines to port</span>
                </v-tooltip>
                <v-tooltip bottom>
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
                <v-tooltip bottom>
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
            <v-fade-transition>
              <v-card
                v-show="showTranmsissionConsole"
                color="teal lighten-4"
                height="300px"
                class="scroll"
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
            </v-fade-transition>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- Port Console Area -->
      <v-flex xs12 sm12 md12 lg12>
        <v-layout row wrap>
          <v-flex xs12>
            <v-toolbar color="teal" dark dense>
              <v-toolbar-title>Port Data Console</v-toolbar-title>
              <v-spacer></v-spacer>
              <div v-if="port != undefined">
                <v-tooltip bottom>
                  <template #activator="data">
                    <v-btn :disabled="flushPortDis" v-on="data.on" icon @click="flushPort()">
                      <v-icon>fas fa-times-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Flush both incoming and outgoing data on the port</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="data">
                    <v-btn :disabled="resumePortDis" v-on="data.on" icon @click="resumePort()">
                      <v-icon>fas fa-play-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Resume all incoming data on the port</span>
                </v-tooltip>
                <v-tooltip bottom>
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
            <v-fade-transition>
              <v-card v-show="showPortConsole" color="teal lighten-4" height="300px" class="scroll">
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
            </v-fade-transition>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Ports List dialoge -->
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
            <v-alert
              :value="isTransmissionProcessActive"
              type="warning"
            >There is already a transmission process going on</v-alert>
            <v-fade-transition>
              <v-list v-if="portsList.length !== 0">
                <v-list-tile
                  v-for="(port, index) in portsList"
                  :key="index"
                  :disabled="isTransmissionProcessActive"
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
                <v-alert :value="true" type="error">No port is connected!</v-alert>
              </v-list>
            </v-fade-transition>
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
        <v-card-text>The process of converting an image into GCode takes a considerable amount of time, so be patient</v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    //? to display the results section
    displayRsultes: true,
    //? ro expand the result panel
    showResultsPanel: true,
    //? for image file
    selectedFile: null,
    url: require("@/assets/default.png"),
    //? for conversion button
    showConversionBtn: true,
    isConversionActive: false,
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
    fileName: "sm-samlpe",
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
    imegSize: "NAN",
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
    //? for binding pusher channel
    pusher: undefined,
    isPortBinded: false,
    isLogBinded: false,
    port: undefined,
    //? for transmission process
    displayTransmissionConsole: true,
    transmissionConsoleTxt: [],
    showTranmsissionConsole: true,
    isTransmissionProcessActive: false,
    //? for consoles area
    consolesArea: false,
    showPortConsole: true,
    //? to enable and disable control btns of transmission console panel
    stopSendDis: true,
    pauseSendDis: true,
    resumeSendDis: true,
    //? to enable and disable control btns of port console panel
    flushPortDis: false,
    pausePortDis: false,
    resumePortDis: true
  }),
  created() {
    window.addEventListener("beforeunload", event => this.handleOnBeforeUnload(event));
    Pusher.logToConsole = true;
    this.pusher = new Pusher("ced4b5ad59f10ab2a746", {
      cluster: "eu",
      forceTLS: true
    });
    this.pusher.subscribe("ports");
    this.pusher.subscribe("logs");
    // see if there is a transmission process going on
    PortsServices.isServerActive()
      .then(status => {
        // console.log('status :', status);
        this.isTransmissionProcessActive = status;
      })
      .catch(error => {
        this.showErrorSnackbar(error);
      });
  },
  methods: {
    handleOnBeforeUnload(event) {
      if (this.isTransmissionProcessActive || this.isConversionActive) {
        // Cancel the event as stated by the standard.
        event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = "";
      }
    },
    fileIsSelected(event) {
      this.selectedFile = event.target.files[0];
      this.url = URL.createObjectURL(this.selectedFile);
      this.showConversionBtn = false;
    },
    clear() {
      this.selectedFile = null;
      this.url = require("@/assets/default.png");
      this.showConversionBtn = true;
      this.displayRsultes = false;
      this.consolesArea = false;
      this.clearPortConsole();
      this.clearTransmissionConsole();
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
        this.showErrorSnackbar(
          "Scale Axes Should Not Be Equale to Zero (0), Use Image Height"
        );
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
          this.isConversionActive = true;
          ConversionServices.ConvertImage(fd)
            .then(result => {
              this.isConversionActive = false;
              this.displayRsultes = true;
              this.dialog = false;
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
              this.isConversionActive = false;
              this.dialog = false;
              this.showErrorSnackbar(error);
              this.loading = false;
            });
        } else {
          this.showErrorSnackbar("No Image is Selected");
        }
      }
    },
    initializeDrawOperation() {
      this.portsListDialog = true;
      PortsServices.getConnectedPortsList()
        .then(result => {
          this.portsListProgress = false;
          this.isTransmissionProcessActive = result.isServerActive;
          if (result.count !== 0) {
            this.portsList = result.ports;
          }
        })
        .catch(error => {
          this.portsListProgress = false;
          this.portsListDialog = false;
          this.showErrorSnackbar(error);
        });
    },
    subscribeToPorts(eventName) {
      this.isPortsBinded = true;
      this.pusher.bind(eventName, data => {
        if (data.data.length == 0) {
          console.warn("data is empty!");
        } else {
          this.portConsoleTxt.unshift(data.data);
        }
      });
    },
    subscribeToLog(eventName) {
      this.isLogBinded = true;
      this.pusher.bind(eventName, data => {
        if (data.data.length == 0) {
          console.warn("data is empty!");
        } else {
          this.transmissionConsoleTxt.unshift(data.data);
          if (data.data.includes("All lines has been sent")) {
            this.showSuccessSnackbar(
              "Transmission of file " + this.fileName + " Has been completed"
            );
            this.isTransmissionProcessActive = false;
          }
        }
      });
    },
    startTransmitingGCode(port) {
      this.consolesArea = true;
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
          this.consolesArea = true;
          PortsServices.performFullDrawOperation(this.fileName, port)
            .then(result => {
              this.pauseSendDis = false;
              this.stopSendDis = false;
              this.portsListDialog = false;
              this.pausePortDis = false;
              this.flushPortDis = false;
              this.isTransmissionProcessActive = true;
              this.showSuccessSnackbar(result.success);
            })
            .catch(error => {
              this.portsListDialog = false;
              this.port = undefined;
              this.pausePortDis = true;
              this.flushPortDis = true;
              console.log(error);
              this.showErrorSnackbar(error.failure.split(":")[1]);
              this.portConsoleTxt.push("Operation: " + error.operation + "|");
              this.portConsoleTxt.push("Message: " + error.failure + "|");
              if (error.isPortClosed) {
                this.portConsoleTxt.push(
                  "Port Status: " + error.isPortClosed ? " Closed|" : " Opened|"
                );
              }
            });
        }, 500);
      } else {
        this.portsListDialog = false;
        this.showErrorSnackbar("Gcode file name is missing!");
      }
    },
    pausePort() {
      if (this.port) {
        console.warn("pausePort() is called, port is " + this.port);
        PortsServices.pauseEmittingPort(this.port)
          .then(result => {
            this.resumePortDis = false; //! means enable btn
            this.pausePortDis = true; //! means disable btn
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
          });
      } else {
        console.warn("port is undefined!!");
        this.showErrorSnackbar("No port is defined");
      }
    },
    resumePort() {
      if (this.port) {
        console.warn("resumePort() is called, port is " + this.port);
        PortsServices.resumeEmittingPort(this.port)
          .then(result => {
            this.pausePortDis = false;
            this.resumePortDis = true;
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
          });
      } else {
        console.warn("port is undefined!!");
        this.showErrorSnackbar("No port is defined");
      }
    },
    flushPort() {
      if (this.port) {
        console.warn("flushPort() is called, port is " + this.port);
        PortsServices.flushPort(this.port)
          .then(result => {
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
          });
      } else {
        console.warn("port is undefined!!");
        this.showErrorSnackbar("No port is defined");
      }
    },
    stopSendOperation() {
      if (this.port) {
        PortsServices.stopSendOperation(this.port)
          .then(result => {
            //? diable all btns
            this.pauseSendDis = true;
            this.resumeSendDis = true;
            this.stopSendDis = true;
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
          });
      } else {
        this.showErrorSnackbar("No operation is running, port is undefined");
      }
    },
    pauseSendOperation() {
      if (this.port) {
        PortsServices.pauseSendOperation(this.port)
          .then(result => {
            this.resumeSendDis = false;
            this.pauseSendDis = true;
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
          });
      } else {
        this.showErrorSnackbar("No operation is running, port is undefined");
      }
    },
    resumeSendOperation() {
      if (this.port) {
        PortsServices.resumeSendOperation(this.port)
          .then(result => {
            this.pauseSendDis = false;
            this.resumeSendDis = true;
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
          });
      } else {
        this.showErrorSnackbar("No operation is running, port is undefined");
      }
    },
    clearPortConsole() {
      this.portConsoleTxt = [];
    },
    clearTransmissionConsole() {
      this.transmissionConsoleTxt = [];
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
