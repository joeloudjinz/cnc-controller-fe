<template>
  <v-layout wrap row>
    <v-flex xs12 sm12 md4 lg4 pa-2>
      <v-toolbar card color="teal" class="white--text">
        <h2>Resources Directory Tree</h2>
      </v-toolbar>
      <v-card height="900" color="white" class="elevation-0 scroll scrollbar-style">
        <v-card-text>
          <v-progress-linear :indeterminate="inProgress"></v-progress-linear>
          <v-treeview :items="items">
            <template v-slot:prepend="{ item }">
              <v-icon color="teal" v-if="item.children">fas fa-folder</v-icon>
              <v-icon
                color="teal lighten-2"
                v-else-if="item.type === 'image'"
                @click="displayImage(item.name, item.path)"
              >fas fa-image</v-icon>
              <v-icon
                color="teal lighten-2"
                v-else-if="item.type === 'gcode'"
                @click="displayGcodeLines(item.name, item.path)"
              >fas fa-file-code</v-icon>
              <v-icon
                color="teal lighten-2"
                v-else-if="item.type === 'log'"
                @click="displayLogFile(item.name, item.path)"
              >fas fa-file-alt</v-icon>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-model="imagePanel" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="teal lighten-1">
          <v-btn
            :disabled="isTransmissionProcessActive"
            icon
            dark
            @click="prepareToCloseImagePanel()"
          >
            <v-icon>fas fa-times-circle</v-icon>
          </v-btn>
          <v-toolbar-title>{{currentFileName}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              :disabled="disableImagePanelToolbarBtns"
              dark
              flat
              @click="showDeleteFileConfirmationDialog = true"
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
                    <div v-if="port != undefined">
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
                    <div v-if="port != undefined">
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
    <v-fade-transition>
      <v-flex xs12 sm12 md8 lg8 v-show="doShowDisplayCard" pa-2>
        <v-toolbar card class="teal white--text">
          <h2>{{currentFileName}}</h2>
          <v-spacer></v-spacer>
          <div v-if="doShowDeleteDirectoryBtn">
            <v-tooltip bottom>
              <template #activator="data">
                <v-btn v-on="data.on" icon @click="showDeleteFileConfirmationDialog = true">
                  <v-icon color="white">fas fa-folder-minus</v-icon>
                </v-btn>
              </template>
              <span>Delete the current directory</span>
            </v-tooltip>
          </div>
          <div v-if="doShowDeleteFileBtn">
            <v-tooltip bottom>
              <template #activator="data">
                <v-btn v-on="data.on" icon @click="showDeleteFileConfirmationDialog = true">
                  <v-icon color="white">fas fa-trash-alt</v-icon>
                </v-btn>
              </template>
              <span>Delete the current file</span>
            </v-tooltip>
          </div>
        </v-toolbar>
        <v-card height="842" color="teal lighten-5" class="scroll scrollbar-style">
          <!-- To display gcode file content -->
          <v-card-text v-if="gcodeData.length != 0">
            <table>
              <tr v-for="(line, index) in gcodeData" :key="index" class="font-weight-medium">
                <td class="font-weight-light black--text px-2">{{index + 1}}</td>
                <div v-if="line.charAt(0) == ';'">
                  <td class="grey--text">{{line}}</td>
                </div>
                <div v-else>
                  <td class="teal--text">{{line.split(";")[0]}}</td>
                  <td
                    v-if="line.split(';')[1] != undefined"
                    class="grey--text"
                  >;{{line.split(";")[1]}}</td>
                </div>
              </tr>
            </table>
          </v-card-text>
          <!-- To log file content -->
          <v-card-text v-else-if="logData.length != 0">
            <table>
              <tr v-for="(line, index) in logData" :key="index" class="font-weight-medium">
                <td class="font-weight-light red--text px-2">{{line.split('|')[0]}}</td>
                <td class="teal--text">{{line.split('|')[1]}}</td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
        <!-- Card Action for gcode & log files content card -->
        <v-card-actions class="teal lighten-5 elevation-3 mt-1">
          <v-btn
            flat
            class="teal--text text--darken-2"
            :disabled="!doShowLoadingBtns"
            @click="loadAllLines()"
          >Load All</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="teal"
            class="white--text"
            :disabled="!doShowLoadingBtns"
            @click="loadMoreLines()"
          >Load more lines</v-btn>
        </v-card-actions>
      </v-flex>
    </v-fade-transition>
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
          <v-progress-linear v-show="showConversionProgress" :indeterminate="true"></v-progress-linear>
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
    <v-dialog v-model="showPortsListDialog" persistent width="700px">
      <v-card>
        <v-card-title class="teal darken-4 py-4 title white--text">GCode File Transmission</v-card-title>
        <v-card-text class="py-0 px-0">
          <v-progress-linear v-if="portsListProgress" :indeterminate="true" color="teal"></v-progress-linear>
          <v-container grid-list-sm>
            <v-alert :value="true" color="teal darken-4" class="mb-2">
              This operation will send the generated gcode file to the machine over the selected port and it will start drawing the coordinates,
              the process will take too much time (1s for each line of code),
              you can monitor the whole process and the incoming data from the consoles.
            </v-alert>
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
          <v-btn flat color="teal" @click="showPortsListDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- File Deletion Confirmation -->
    <v-dialog v-model="showDeleteFileConfirmationDialog" persistent width="500">
      <v-card color="white" dark>
        <v-card-title class="error white--text headline">Confirm Deletion</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="font-weight-bold black--text">
          <p v-if="isCurrentFileGcode">Are you sure you want to delete this file?</p>
          <p v-else-if="isCurrentFileLog">Are you sure you want to delete this directory?</p>
          <p v-else>Are you sure you want to delete this image?</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            flat
            @click="showDeleteFileConfirmationDialog = false"
            class="grey--text lighten-1"
          >Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="selecteDeletionType()" color="red lighten-1" class="white--text">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Main Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      :bottom="'bottom'"
      :color="snackbarColor"
      :multi-line="'multi-line'"
    >{{ snackbarContent }}</v-snackbar>
  </v-layout>
</template>
<script>
import FileServices from "@/services/files.js";
import ConversionServices from "@/services/conversion.js";
import PortsServices from "@/services/ports.js";
import { setTimeout } from "timers";

export default {
  data: () => ({
    items: [
      {
        id: 1,
        name: "Images",
        children: []
      },
      {
        id: 2,
        name: "Gcode Files",
        children: []
      },
      {
        id: 3,
        name: "Output",
        children: []
      }
    ],
    inProgress: false,
    currentFileName: undefined,
    imageURL: undefined,
    imagePanel: false,
    gcodeData: [],
    fullGcodeData: [],
    logData: [],
    fullLogData: [],
    stoppedIn: 0,
    logURL: undefined,
    showDeleteFileConfirmationDialog: false,
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
    //? end of params dialog data ---------------------
    //? conversion results section
    proccessBlackPixelsValue: 0,
    unproccessBlackPixelsValue: 0,
    showConversionResultAlert: false,
    //? end
    //? ports list data ---------------------
    showPortsListDialog: false,
    portsList: [],
    portsListProgress: true,
    //? end of ports list data ---------------------
    //? transmission data
    isTransmissionProcessActive: false,
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
    //? end of data in consoles area ------------------------
    //? conversion params dialog progress
    conversionProgressValue: 0,
    conversionProgressQuery: false,
    showConversionProgress: false,
    conversionProgressInterval: 0,
    //? end
    //? snackbar details ...
    snackbarContent: "",
    snackbarColor: "",
    snackbar: false
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
    onGcodeFileDeleted(data) {
      this.removeGcodeFileFormItems(data.fileName);
    },
    onOutputSubDirectoryDeleted(data) {
      this.removeOutputSubdirectoryFormItems(data.dirName);
    },
    onImageDeleted(data) {
      this.removeImageFromItems(data.imageName);
    },
    onServerStatusChanged(data) {
      let status = data.status;
      this.isTransmissionProcessActive = status;
      this.stopSendDis = !status;
      this.pauseSendDis = !status;
      if (!status && data.target == window.localStorage.getItem("id")) {
        this.showSuccessSnackbar(
          "Transmission of Gcode file Has been completed"
        );
      }
    },
    onGcodeFileAdded(data) {
      // console.log("data", data);
      this.items[1].children.push({
        id: this.items[1].children.length + 1,
        name: data.name,
        type: "gcode",
        path: data.path
      });
    },
    onImageAdded(data) {
      this.items[0].children.push({
        id: this.items[0].children.length + 1,
        name: data.name,
        type: "image",
        path: data.path
      });
    },
    onQuickConversionEnded(data) {
      if (data.target == window.localStorage.getItem("id")) {
        this.showConversionProgress = false;
        this.showConversionResultAlert = true;
        this.proccessBlackPixelsValue = 100 - data.conversionDetails;
        this.unproccessBlackPixelsValue = data.conversionDetails;
        this.showSuccessSnackbar("Converted successfully");
      }
    },
    onQuickConversionErrorOccur(data) {
      if (data.target == window.localStorage.getItem("id")) {
        this.doShowParamsForm = true;
        this.showConversionProgress = false;
        this.showConversionResultAlert = false;
        this.showBeforConversionAlert = true;
        this.showErrorSnackbar(data.errorData);
      }
    }
  },
  computed: {
    disableConversionCardActionBtns() {
      //? when conversion progress is true, disable action btns
      return this.showConversionProgress;
    },
    doShowConversionBtn() {
      return this.doShowParamsForm;
    },
    disableImagePanelToolbarBtns() {
      return this.isTransmissionProcessActive;
    },
    isCurrentFileGcode() {
      return (
        this.currentFileName != undefined &&
        this.currentFileName.includes("gcode")
      );
    },
    isCurrentFileLog() {
      return (
        this.currentFileName != undefined &&
        this.currentFileName.includes("log")
      );
    },
    doShowDeleteFileBtn() {
      return (
        this.currentFileName != undefined &&
        this.currentFileName.includes(".gcode") &&
        !this.currentFileName.includes("clean")
      );
    },
    doShowDeleteDirectoryBtn() {
      return (
        this.currentFileName != undefined &&
        this.currentFileName.includes(".log")
      );
    },
    doShowDisplayCard() {
      return this.gcodeData.length != 0 || this.logData.length != 0;
    },
    doShowLoadingBtns() {
      return (
        this.stoppedIn < this.fullGcodeData.length ||
        this.stoppedIn < this.fullLogData.length
      );
    }
  },
  created() {
    this.getResourcesDirDetails();
  },
  methods: {
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
    removeImageFromItems(imageName) {
      for (let i = 0; i < this.items[0].children.length; i++) {
        if (this.items[0].children[i].name == imageName) {
          this.items[0].children.splice(i, 1);
          break;
        }
      }
      const splitted = imageName.split(".");
      const gcodeFileName = splitted[0] + "." + splitted[1] + ".gcode";
      for (let i = 0; i < this.items[1].children.length; i++) {
        if (this.items[1].children[i].name == gcodeFileName) {
          this.items[1].children.splice(i, 1);
          break;
        }
      }
    },
    removeOutputSubdirectoryFormItems(dirName) {
      for (let i = 0; i < this.items[2].children.length; i++) {
        if (this.items[2].children[i].name == dirName) {
          this.items[2].children.splice(i, 1);
          break;
        }
      }
    },
    removeGcodeFileFormItems(fileName) {
      for (let i = 0; i < this.items[1].children.length; i++) {
        if (this.items[1].children[i].name == fileName) {
          this.items[1].children.splice(i, 1);
          break;
        }
      }
    },
    selecteDeletionType() {
      if (this.isCurrentFileGcode) {
        this.deleteGcodeFile(this.currentFileName);
      } else if (this.isCurrentFileLog) {
        this.deleteOutputDirectory();
      } else {
        this.deleteSelectedImage();
      }
      this.showDeleteFileConfirmationDialog = false;
    },
    getResourcesDirDetails() {
      FileServices.getDirectoryTree()
        .then(result => {
          const imagesDirObj = result.Images;
          const gcodesDirObj = result.Gcodes;
          const outputsDirObj = result.Outputs;
          let temp = [];
          Object.keys(imagesDirObj).forEach(function(k) {
            temp.push({
              id: parseInt(k),
              name: imagesDirObj[k].name,
              type: "image",
              path: imagesDirObj[k].path
            });
          });
          this.items[0].children = temp;
          temp = [];
          Object.keys(gcodesDirObj).forEach(function(k) {
            temp.push({
              id: parseInt(k),
              name: gcodesDirObj[k].name,
              type: "gcode",
              path: gcodesDirObj[k].path
            });
          });
          this.items[1].children = temp;
          temp = [];
          Object.keys(outputsDirObj).forEach(function(k) {
            let children = [];
            Object.keys(outputsDirObj[k].content).forEach(function(l) {
              children.push({
                id: parseInt(l),
                name: outputsDirObj[k].content[l].name,
                type: l == 0 ? "log" : "gcode",
                path: outputsDirObj[k].content[l].path
              });
            });
            temp.push({
              id: parseInt(k),
              name: outputsDirObj[k].name,
              children: children
            });
          });
          this.items[2].children = temp;
        })
        .catch(error => {
          // console.warn(error);
          this.showErrorSnackbar(error);
        });
    },
    displayImage(name, path) {
      this.inProgress = true;
      this.currentFileName = name;
      FileServices.getImageData(path)
        .then(result => {
          this.imagePanel = true;
          this.inProgress = false;
          this.imageURL = "data:image/" + result.ext + ";base64," + result.data;
        })
        .catch(error => {
          this.inProgress = false;
          this.showErrorSnackbar(error);
        });
    },
    displayGcodeLines(name, path) {
      this.inProgress = true;
      this.currentFileName = name;
      this.logData = [];
      this.fullLogData = [];
      FileServices.getFileLines(path)
        .then(result => {
          this.inProgress = false;
          this.fullGcodeData = result.fileLines;
          this.gcodeData = this.fullGcodeData.slice(0, 100);
          this.stoppedIn = 100;
        })
        .catch(error => {
          this.inProgress = false;
          this.showErrorSnackbar(error);
        });
    },
    displayLogFile(name, path) {
      this.currentFileName = name;
      this.gcodeData = [];
      this.fullGcodeData = [];
      this.inProgress = true;
      FileServices.getFileLines(path)
        .then(result => {
          this.inProgress = false;
          this.fullLogData = result.fileLines;
          this.logData = this.fullLogData.slice(0, 100);
          this.stoppedIn = 100;
        })
        .catch(error => {
          this.inProgress = false;
          this.showErrorSnackbar(error);
        });
    },
    loadMoreLines() {
      const stopline = this.stoppedIn + 100;
      if (this.currentFileName.includes(".log")) {
        const newLines = this.fullLogData.slice(this.stoppedIn, stopline);
        this.logData.push(...newLines);
      } else if (this.currentFileName.includes(".gcode")) {
        const newLines = this.fullGcodeData.slice(this.stoppedIn, stopline);
        this.gcodeData.push(...newLines);
      }
      this.stoppedIn = stopline;
    },
    loadAllLines() {
      if (this.currentFileName.includes(".log")) {
        const newLines = this.fullLogData.slice(this.stoppedIn);
        this.logData.push(...newLines);
        this.stoppedIn = this.fullLogData.length;
      } else if (this.currentFileName.includes(".gcode")) {
        const newLines = this.fullGcodeData.slice(this.stoppedIn);
        this.gcodeData.push(...newLines);
        this.stoppedIn = this.fullGcodeData.length;
      }
    },
    deleteGcodeFile(gcodeFileName) {
      // console.log("deleteGcodeFile() is called");
      // console.log("gcodeFileName :", gcodeFileName);
      if (gcodeFileName != undefined) {
        if (this.currentFileName.includes(".gcode")) {
          FileServices.deleteGcodeFile(gcodeFileName)
            .then(() => {
              this.gcodeData = [];
              this.showSuccessSnackbar("File was deleted successfully");
            })
            .catch(error => {
              this.showErrorSnackbar(error);
            });
        }
      } else {
        this.showErrorSnackbar("File name is undefined");
      }
    },
    deleteOutputDirectory() {
      const dirName = this.currentFileName.split(".")[0];
      FileServices.deleteOutputDirectory(dirName)
        .then(() => {
          this.logData = [];
          this.showSuccessSnackbar("Directory deleted successfully");
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    deleteSelectedImage() {
      FileServices.deleteImage(this.currentFileName)
        .then(() => {
          this.imagePanel = false;
          this.showSuccessSnackbar("Image deleted successfully");
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    prepareQuickDrawOperation() {
      const splitted = this.currentFileName.split(".");
      const gcodeFileName = splitted[0] + "." + splitted[1] + ".gcode";
      let doesExist = false;
      //? check the existance of the corresponding gcode file for the image
      for (let i = 0; i < this.items[1].children.length; i++) {
        if (this.items[1].children[i].name == gcodeFileName) {
          doesExist = true;
          break;
        }
      }
      if (doesExist) {
        this.showConversionParamsDialog = false;
        this.displayPortsListDialog();
      } else {
        this.showConversionParamsDialog = true;
      }
    },
    displayPortsListDialog() {
      this.showPortsListDialog = true;
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
          this.showPortsListDialog = false;
          this.showErrorSnackbar(error);
        });
    },
    startTransmitingGCode(portName) {
      this.portsListProgress = true;
      this.port = portName;
      //? ensuring that the current file name is valide gcode file name
      if (this.currentFileName !== undefined && this.currentFileName !== "") {
        //? removing the extension from the fileName because the endpoint function uses gcode file name without ext
        const splitted = this.currentFileName.split(".");
        const fileName = splitted[0] + "." + splitted[1];
        setTimeout(() => {
          PortsServices.performFullDrawOperation(fileName, portName)
            .then(result => {
              this.portsListProgress = false;
              //? show consoles area
              this.consolesArea = true;
              //? hiding ports list dialog
              this.showPortsListDialog = false;
              //? enabling pause & stop tranmission operations btns
              this.pauseSendDis = false;
              this.stopSendDis = false;
              //? enabling pause & flush port data btns
              this.pausePortDis = false;
              this.flushPortDis = false;
              //? activating transmission state variable
              this.isTransmissionProcessActive = true;
              this.showSuccessSnackbar(result.success);
            })
            .catch(error => {
              //? hiding ports list dialog
              this.showPortsListDialog = false;
              this.port = undefined;
              //? showing the error about why the transmission process didn't start
              this.showErrorSnackbar(error.failure.split(":")[1]);
              //? disabling these lines becuase the consoles are hidden
              // this.portConsoleTxt.push("Operation: " + error.operation + "|");
              // this.portConsoleTxt.push("Message: " + error.failure + "|");
              // if (error.isPortClosed) {
              //   this.portConsoleTxt.push(
              //     "Port Status: " + error.isPortClosed ? " Closed|" : " Opened|"
              //   );
              // }
            });
        }, 500);
      } else {
        this.showPortsListDialog = false;
        this.showErrorSnackbar("Gcode file name is missing!");
      }
    },
    startConversionProcess() {
      //? checking the value of Scale Axes
      if (this.scaleAxes <= 50) {
        this.scaleAxesErrorState = true;
        this.scaleAxesErrorContent = "Scale Axes must be superior of 50";
      } else {
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
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showConversionProgress = false;
            this.doShowParamsForm = true;
            this.showErrorSnackbar(error);
          });
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
          this.showErrorSnackbar(
            "There was an error while deleting the generated gcode file, try deleting it manually"
          );
        });
    },
    prepareToCloseImagePanel() {
      if (this.isTransmissionProcessActive) {
        this.showCloseImagePanelConfirmationDialog = true;
      } else {
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
      }
    },
    pausePort() {
      if (this.port) {
        // console.warn("pausePort() is called, port is " + this.port);
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
        // console.warn("port is undefined!!");
        this.showErrorSnackbar("No port is defined");
      }
    },
    resumePort() {
      if (this.port) {
        // console.warn("resumePort() is called, port is " + this.port);
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
        // console.warn("port is undefined!!");
        this.showErrorSnackbar("No port is defined");
      }
    },
    flushPort() {
      if (this.port) {
        // console.warn("flushPort() is called, port is " + this.port);
        PortsServices.flushPort(this.port)
          .then(result => {
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
          });
      } else {
        // console.warn("port is undefined!!");
        this.showErrorSnackbar("No port is defined");
      }
    },
    stopSendOperation() {
      if (this.port) {
        PortsServices.stopSendOperation(this.port)
          .then(result => {
            //? disable all btns
            this.pauseSendDis = true;
            this.resumeSendDis = true;
            this.stopSendDis = true;
            this.isTransmissionProcessActive = false;
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
.scroll {
  overflow-y: auto;
}
#preview {
  display: flex;
  justify-content: center;
  align-items: center;
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