<template>
  <v-container fluid wrap pa-1 ma-0>
    <v-alert :value="isTransmissionProcessActive" type="warning" color="warning">
      Transmission process is going on, some functionalities
      are disabled until it's over
    </v-alert>
    <!-- Image upload form & Parameters Section -->
    <v-layout row wrap>
      <!-- Image Upload and display Section -->
      <v-flex d-felx xs12 sm12 md12 lg8 pa-1>
        <v-card color="teal lighten-5">
          <v-container px-0 pb-0 pt-4>
            <v-card color="transparent" class="elevation-0">
              <v-layout align-center justify-center row fill-height>
                <v-card-text>
                  <input
                    type="file"
                    @change="fileIsSelected"
                    accept=".png, .jpg, .jpeg"
                    style="display: none"
                    ref="selectImageRef"
                  >
                  <div id="preview">
                    <!--  -->
                    <v-img contain height="650" v-if="url" :src="url"></v-img>
                  </div>
                </v-card-text>
              </v-layout>
              <v-card-actions>
                <v-btn
                  flat
                  @click="clearImageDisplayCard()"
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
          </v-container>
        </v-card>
      </v-flex>
      <!-- Parameters Section -->
      <v-flex d-flex xs12 sm12 md12 lg4 pa-1 class="transparent">
        <v-card color="teal lighten-5">
          <v-card-title>
            <v-alert :value="true" transition="scale-transition" type="info" color="teal darken-4">
              Adjust these parameters to control the quality of gcode,
              you can leave them by default as well
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
                    persistent-hint
                    hint="This field is required"
                    v-model="scaleAxes"
                    class="mt-0"
                    color="teal darken-2"
                    type="number"
                    :error="scaleAxesErrorState"
                    :error-messages="scaleAxesErrorContent"
                    @focus="scaleAccessSnackbar = true"
                    @focusout="scaleAccessSnackbar = false"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6 lg6>
                  <v-text-field
                    label="Deep Step"
                    v-model="deepStep"
                    class="mt-0"
                    type="number"
                    color="teal darken-2"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout justify-center row wrap>
                <v-flex xs12 sm12 md4 lg4>
                  <v-text-field
                    label="White Z"
                    v-model="whiteZ"
                    class="mt-0"
                    type="number"
                    color="teal darken-2"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md4 lg4>
                  <v-text-field
                    label="Black Z"
                    v-model="blackZ"
                    class="mt-0"
                    type="number"
                    color="teal darken-2"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md4 lg4>
                  <v-text-field
                    label="Safe Z"
                    v-model="safeZ"
                    class="mt-0"
                    type="number"
                    color="teal darken-2"
                  ></v-text-field>
                </v-flex>
              </v-layout>Feed Rate
              <v-layout justify-center row wrap>
                <v-flex xs12 sm12 md6 lg6>
                  <v-text-field
                    label="Work"
                    v-model="work"
                    class="mt-0"
                    type="number"
                    color="teal darken-2"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6 lg6>
                  <v-text-field
                    label="Idle"
                    v-model="idle"
                    class="mt-0"
                    type="number"
                    color="teal darken-2"
                  ></v-text-field>
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
              <v-tooltip :disabled="isTransmissionProcessActive || isConversionActive" top>
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
    <!-- Conversion Results Section -->
    <v-layout row wrap>
      <!-- Conversion Results panel -->
      <v-flex d-flex xs12 sm12 md12 lg12 pa-1>
        <v-card color="teal lighten-5">
          <v-container fluid px-0 pb-0 pt-4>
            <v-card color="transparent elevation-0">
              <v-fade-transition>
                <v-card-text v-if="!displayResultsPanel">
                  <v-layout align-center justify-center row fill-height>
                    <dir>
                      <v-img :src="resultsImageSrc" contain max-height="200"/>
                      <p
                        class="font-weight-light pt-2"
                      >Converiosn Results will be displayed here after you convert an image</p>
                    </dir>
                  </v-layout>
                </v-card-text>
                <v-card-text v-else>
                  <v-layout align-start justify-space-between row fill-height wrap>
                    <v-flex xs12 sm12 md12 lg3>
                      <v-list class="elevation-1 ma-1" subheader>
                        <v-subheader>Used Parameters</v-subheader>
                        <v-list-tile>
                          <v-list-tile-content>
                            <v-list-tile-title
                              class="font-weight-meduim teal--text text--lighten-2"
                            >Tool Diameter</v-list-tile-title>
                            <v-list-tile-sub-title
                              class="font-weight-bold teal--text text--darken-2"
                            >{{ oldtoolDiameter }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>
                            <v-list-tile-title
                              class="font-weight-meduim teal--text text--lighten-2"
                            >Sensitivity</v-list-tile-title>
                            <v-list-tile-sub-title
                              class="font-weight-bold teal--text text--darken-2"
                            >{{ oldsensitivity }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>
                            <v-list-tile-title
                              class="font-weight-meduim teal--text text--lighten-2"
                            >Scale Axes</v-list-tile-title>
                            <v-list-tile-sub-title
                              class="font-weight-bold teal--text text--darken-2"
                            >{{ oldscaleAxes }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>
                            <v-list-tile-title
                              class="font-weight-meduim teal--text text--lighten-2"
                            >Deep Step</v-list-tile-title>
                            <v-list-tile-sub-title
                              class="font-weight-bold teal--text text--darken-2"
                            >{{ olddeepStep }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>
                            <v-list-tile-title
                              class="font-weight-meduim teal--text text--lighten-2"
                            >White Z</v-list-tile-title>
                            <v-list-tile-sub-title
                              class="font-weight-bold teal--text text--darken-2"
                            >{{ oldwhiteZ }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>
                            <v-list-tile-title
                              class="font-weight-meduim teal--text text--lighten-2"
                            >Bloack Z</v-list-tile-title>
                            <v-list-tile-sub-title
                              class="font-weight-bold teal--text text--darken-2"
                            >{{ oldblackZ }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>
                            <v-list-tile-title
                              class="font-weight-meduim teal--text text--lighten-2"
                            >Safe Z</v-list-tile-title>
                            <v-list-tile-sub-title
                              class="font-weight-bold teal--text text--darken-2"
                            >{{ oldsafeZ }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>
                            <v-list-tile-title
                              class="font-weight-meduim teal--text text--lighten-2"
                            >Image Height</v-list-tile-title>
                            <v-list-tile-sub-title
                              class="font-weight-bold teal--text text--darken-2"
                            >{{ imegSize }}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg9>
                      <v-layout align-start justify-space-between row fill-height wrap>
                        <v-flex xs12 sm12 md12 lg6>
                          <v-list class="elevation-1 ma-1" subheader>
                            <v-subheader>Durations</v-subheader>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title
                                  class="font-weight-meduim teal--text text--lighten-2"
                                >Started at</v-list-tile-title>
                                <v-list-tile-sub-title
                                  class="font-weight-bold teal--text text--darken-2"
                                >{{ startTime }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title
                                  class="font-weight-meduim teal--text text--lighten-2"
                                >Ended In</v-list-tile-title>
                                <v-list-tile-sub-title
                                  class="font-weight-bold teal--text text--darken-2"
                                >{{ endTime }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title
                                  class="font-weight-meduim teal--text text--lighten-2"
                                >Elapsed Time</v-list-tile-title>
                                <v-list-tile-sub-title
                                  class="font-weight-bold teal--text text--darken-2"
                                >{{ fromatElapsedTimeValue }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg6>
                          <v-list class="elevation-1 ma-1" subheader>
                            <v-subheader>File Information</v-subheader>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title
                                  class="font-weight-meduim teal--text text--lighten-2"
                                >Size</v-list-tile-title>
                                <v-list-tile-sub-title
                                  class="font-weight-bold teal--text text--darken-2"
                                >{{ formatSizeValue }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                              <v-list-tile-content>
                                <v-list-tile-title
                                  class="font-weight-meduim teal--text text--lighten-2"
                                >Name</v-list-tile-title>
                                <v-list-tile-sub-title
                                  class="font-weight-bold teal--text text--darken-2"
                                >{{ fileName }}</v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-flex>
                      </v-layout>
                      <v-layout align-center justify-center row fill-height pt-2 wrap>
                        <v-flex xs12 sm12 md12 lg6>
                          <v-layout align-center justify-center row fill-height>
                            <v-tooltip bottom>
                              <template #activator="data">
                                <v-progress-circular
                                  :rotate="360"
                                  :size="200"
                                  :width="10"
                                  :value="value"
                                  color="teal lighten-1"
                                  v-on="data.on"
                                >{{ value }}</v-progress-circular>
                              </template>
                              <span>The percentage of the proccessed black pixels in the picture</span>
                            </v-tooltip>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg6>
                          <v-layout align-center justify-center row fill-height>
                            <v-tooltip bottom>
                              <template #activator="data">
                                <v-progress-circular
                                  :rotate="360"
                                  :size="200"
                                  :width="10"
                                  :value="errorValue"
                                  color="red lighten-1"
                                  v-on="data.on"
                                >{{ errorValue }}</v-progress-circular>
                              </template>
                              <span>The percentage of the unproccessed black pixels in the picture</span>
                            </v-tooltip>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-fade-transition>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template #activator="data">
                    <v-btn
                      class="teal--text"
                      flat
                      v-on="data.on"
                      @click="initializeDrawOperation()"
                      v-show="showDrawBtn"
                      :disabled="isTransmissionProcessActive"
                    >
                      <v-icon left dark>fas fa-pencil-ruler</v-icon>Draw
                    </v-btn>
                  </template>
                  <span>Start tranmission process to a specific port</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- Consoles Area -->
    <v-layout v-if="consolesArea == true" row wrap>
      <!-- Transmission Console Area -->
      <v-flex xs12 sm12 md12 lg7 pa-1>
        <v-layout row wrap>
          <v-flex d-flex xs12 sm12 md12 lg12>
            <v-toolbar
              color="teal lighten-4"
              class="elevation-0 teal--text text--darken-1"
              card
              dense
              dark
            >
              <v-toolbar-title>Transmission Process Console</v-toolbar-title>
              <v-spacer></v-spacer>
              <div v-if="currentActivePort != undefined">
                <v-tooltip :disabled="stopSendDis" bottom>
                  <template #activator="data">
                    <v-btn :disabled="stopSendDis" v-on="data.on" icon @click="stopSendOperation()">
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
                <v-icon>{{ showTranmsissionConsole ? 'keyboard_arrow_up': 'keyboard_arrow_down' }}</v-icon>
              </v-btn>
            </v-toolbar>
          </v-flex>
          <v-flex d-flex xs12 sm12 md12 lg12>
            <v-slide-y-transition>
              <v-card
                v-show="showTranmsissionConsole"
                height="300px"
                color="teal lighten-4 elevation-0"
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
      <v-flex xs12 sm12 md12 lg5 pa-1>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12>
            <v-toolbar
              color="teal lighten-4"
              class="elevation-0 teal--text text--darken-1"
              card
              dense
              dark
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
                    <v-btn :disabled="resumePortDis" v-on="data.on" icon @click="resumePort()">
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
                <v-icon>{{ showPortConsole ? 'keyboard_arrow_up': 'keyboard_arrow_down'}}</v-icon>
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
    <!-- Ports List dialoge -->
    <v-dialog v-model="portsListDialog" persistent width="700px">
      <v-card color="teal lighten-5">
        <v-card-title class="headline teal--text">Ports List</v-card-title>
        <v-card-text class="py-0 px-0">
          <v-progress-linear
            v-if="portsListProgress"
            :indeterminate="true"
            color="teal darken-2"
            class="pa-0"
          ></v-progress-linear>
          <v-container grid-list-sm>
            <v-alert :value="true" color="teal darken-4" type="info" class="mb-2">
              Tranmission process consume to mush time, so be patient until it's successfully completed,
              You can monitor the whole process from the two consoles below after you select the port.
              If the process hang up for some reasons, you can pause and resume it.
              Note that the port will be closed after the process is completed or stopped.
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
          <v-btn flat color="teal" @click="portsListDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Conversion Process Dialog -->
    <v-dialog v-model="conversionProgressDialog" persistent width="500">
      <v-card color="teal" dark>
        <v-card-title class="font-weight-bold">Conversion Process</v-card-title>
        <v-card-text>This process will take some time depending on the image dimensions.</v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Scale axes information snackbar -->
    <v-snackbar
      v-model="scaleAccessSnackbar"
      bottom
      right
      color="teal darken-4"
      :timeout="0"
      multi-line
      auto-height
      class="mb-2 white--text"
    >
      For Scale Axes use the height value of the image, you can multiply it by a number to apply scale up,
      or divide it by a number to apply scale down
    </v-snackbar>
    <SnackBar :color="color" :content="content" :visibility="visibility"/>
  </v-container>
</template>
<script>
import ConversionServices from "@/services/conversion.js";
import PortsServices from "@/services/ports.js";

import SnackBar from "@/components/app/SnackBar.vue";

import { setTimeout } from "timers";
import { mapState, mapMutations } from "vuex";

export default {
  components: {SnackBar},
  data: () => ({
    //? to display the results section
    displayResultsPanel: false,
    //? to expand the result panel
    showResultsPanel: true,
    //? for image file
    selectedFile: null,
    url: require("@/assets/default.png"),
    resultsImageSrc: require("@/assets/results.png"),
    //? for conversion button
    showConversionBtn: true,
    isConversionActive: false,
    //? for dialog
    conversionProgressDialog: false,
    //? for progress in dialog window
    progress: 1,
    //? conversion params ...
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
    //? for gcode file
    fileName: "",
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
    //? for scale axes info
    scaleAccessSnackbarColor: "info",
    scaleAccessSnackbar: false,
    //? for transmission 1st phase
    portsListDialog: false,
    displayPortConsole: true,
    //? for ports list
    portsList: [],
    portsListProgress: false,
    //? for console
    portConsoleTxt: [],
    //? for transmission process
    displayTransmissionConsole: false,
    transmissionConsoleTxt: [],
    showTranmsissionConsole: true,
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
    resumePortDis: true,
    showDrawBtn: false,
    color: "teal",
    content: "",
    visibility: false
  }),
  computed: {
    ...mapState(["isTransmissionProcessActive", "currentActivePort"]),
    fromatElapsedTimeValue() {
      if (this.elapsedTime != undefined) {
        if (this.elapsedTime < 60) {
          return `${this.elapsedTime.toFixed(2)} seconds`;
        } else {
          const minutes = this.elapsedTime / 60;
          const rest = this.elapsedTime % 60;
          return `${minutes} minute & ${rest} seconds`;
        }
      } else {
        return 0;
      }
    },
    formatSizeValue() {
      if (this.size != undefined) {
        if (this.size < 1) {
          return `${(this.size / 0.001).toFixed(2)} Kb`;
        } else {
          return `${this.size.toFixed(2)} Mb`;
        }
      } else {
        return 0;
      }
    }
  },
  sockets: {
    onPortData(data) {
      // console.log('data.target :', data.target);
      if (data.target == localStorage.id) {
        this.onPortDataCallback(data.data);
      }
    },
    onTransmissionLog(data) {
      if (data.target == localStorage.id) {
        this.onTransmissionLogCallback(data.data);
      }
    },
    onServerStatusChanged(data) {
      let status = data.status;
      this.stopSendDis = !status;
      this.pauseSendDis = !status;
      if (!status && data.target == localStorage.id) {
        this.showSuccessSnackbar(
          "Transmission of file " + this.fileName + " Has been completed"
        );
        //TODO: close the port here
        this.closePort(this.currentActivePort);
      }
    },
    onConversionEnded(data) {
      if (data.target == localStorage.id) {
        const result = data.conversionDetails;
        this.showDrawBtn = true;
        this.isConversionActive = false;
        this.displayResultsPanel = true;
        this.conversionProgressDialog = false;
        //? update the conversion result variables
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
        this.elapsedTime = result.elapsedTime;
        this.size = result.size;
      }
    },
    onConversionErrorOccur(data) {
      if (data.target == localStorage.id) {
        this.showDrawBtn = false;
        this.isConversionActive = false;
        this.displayResultsPanel = false;
        this.conversionProgressDialog = false;
        this.showErrorSnackbar(data.errorData);
      }
    }
  },
  created() {
    window.addEventListener("beforeunload", event =>
      this.handleOnBeforeUnload(event)
    );
    // see if there is a transmission process going on when loading the page
    PortsServices.isServerActive()
      .then(status => {
        this.SET_TRANSMISSION_PROCESS_STATE(status);
      })
      .catch(error => {
        this.showErrorSnackbar(error);
      });
  },
  methods: {
    ...mapMutations([
      "TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE",
      "SET_TRANSMISSION_PROCESS_STATE",
      "SET_CURRENT_ACTIVE_PORT"
    ]),
    onPortDataCallback(content) {
      if (content.length != 0) {
        this.portConsoleTxt.unshift(content);
      }
    },
    onTransmissionLogCallback(data) {
      if (data.length != 0) {
        this.transmissionConsoleTxt.unshift(data);
      }
    },
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
    clearImageDisplayCard() {
      this.selectedFile = null;
      this.url = require("@/assets/default.png");
      this.showConversionBtn = true;
      this.showDrawBtn = false;
      this.displayResultsPanel = false;
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
      this.scaleAxesErrorState = false;
      this.scaleAxesErrorContent = "";
      if (this.scaleAxes <= 50) {
        this.scaleAxesErrorState = true;
        this.scaleAxesErrorContent = "Scale Axes must be superior then 50";
      } else {
        const surfaceHeight = parseInt(
          window.localStorage.getItem("surfaceHeight")
        );
        if (this.scaleAxes < surfaceHeight) {
          if (this.selectedFile != null) {
            this.conversionProgressDialog = true;
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
            fd.append("target", localStorage.id);
            this.isConversionActive = true;
            ConversionServices.ConvertImage(fd)
              .then(result => {
                this.showSuccessSnackbar(result.success);
              })
              .catch(error => {
                this.isConversionActive = false;
                this.conversionProgressDialog = false;
                this.showErrorSnackbar(error);
                this.loading = false;
              });
          } else {
            this.showErrorSnackbar("No Image is Selected");
          }
        } else {
          this.scaleAxesErrorState = true;
          this.scaleAxesErrorContent =
            "Scale Axes must be less then the height of the surface (" +
            surfaceHeight +
            ")";
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
          this.showErrorSnackbar(error);
        });
    },
    //! port here is the comName
    startTransmitingGCode(port) {
      this.portsListProgress = true;
      if (this.fileName !== undefined && this.fileName !== "") {
        const splitted = this.fileName.split(".");
        const fileName = splitted[0] + "." + splitted[1];
        this.SET_CURRENT_ACTIVE_PORT(port);
        this.consolesArea = true;
        PortsServices.performFullDrawOperation(fileName, port)
          .then(result => {
            this.portsListProgress = false;
            this.pauseSendDis = false;
            this.stopSendDis = false;
            this.portsListDialog = false;
            this.pausePortDis = false;
            this.flushPortDis = false;
            this.SET_TRANSMISSION_PROCESS_STATE(true);
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.portsListDialog = false;
            this.SET_CURRENT_ACTIVE_PORT(undefined);
            this.pausePortDis = true;
            this.flushPortDis = true;
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
      } else {
        this.portsListDialog = false;
        this.showErrorSnackbar("Gcode file name is missing!");
      }
    },
    pausePort() {
      if (this.currentActivePort) {
        PortsServices.pauseEmittingPort(this.currentActivePort)
          .then(result => {
            this.resumePortDis = false; //! means enable btn
            this.pausePortDis = true; //! means disable btn
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
          });
      } else {
        this.showErrorSnackbar("No port is defined");
      }
    },
    resumePort() {
      if (this.currentActivePort) {
        PortsServices.resumeEmittingPort(this.currentActivePort)
          .then(result => {
            this.pausePortDis = false;
            this.resumePortDis = true;
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
          });
      } else {
        this.showErrorSnackbar("No port is defined");
      }
    },
    flushPort() {
      if (this.currentActivePort) {
        PortsServices.flushPort(this.currentActivePort)
          .then(result => {
            this.showSuccessSnackbar(result.success);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
          });
      } else {
        this.showErrorSnackbar("No port is defined");
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
          this.showErrorSnackbar(error);
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
      if (this.currentActivePort) {
        PortsServices.pauseSendOperation(this.currentActivePort)
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
      if (this.currentActivePort) {
        PortsServices.resumeSendOperation(this.currentActivePort)
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
  }
};
</script>
<style scopped>
.fix-tooltip-hover {
  pointer-events: auto;
}
#preview {
  display: flex;
  justify-content: center;
  align-items: center;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>