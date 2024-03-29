<template>
  <v-dialog v-model="showConversionParamsDialog" persistent max-width="700">
    <v-card>
      <v-card-text>
        <v-alert
          :value="showBeforConversionAlert"
          color="teal darken-4"
          transition="fade-transition"
        >The image doesn't have a gcode file, adjust these paramaters to convert it first.</v-alert>
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
        <!-- Params form -->
        <v-container fluid grid-list-lg v-if="doShowParamsForm">
          <v-flex xs12>
            <v-list three-line class="teal lighten-5 pt-0">
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title class="title">Laser Mode</v-list-tile-title>
                  <v-list-tile-sub-title
                    class="teal--text font-weight-medium"
                  >If you are using CNC machine with laser tool, activate the laser mode, IF NOT turn it off</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-switch v-model="laserModeStatus" color="teal darken-2"></v-switch>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-flex>
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
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <v-text-field
                label="Deep Step"
                v-model="deepStep"
                color="teal darken-2"
                class="mt-0"
                type="number"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout justify-center row wrap>
            <v-flex xs12 sm12 md4 lg4>
              <v-text-field
                label="White Z"
                v-model="whiteZ"
                color="teal darken-2"
                class="mt-0"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <v-text-field
                label="Black Z"
                v-model="blackZ"
                color="teal darken-2"
                class="mt-0"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <v-text-field
                label="Safe Z"
                v-model="safeZ"
                color="teal darken-2"
                class="mt-0"
                type="number"
              ></v-text-field>
            </v-flex>
          </v-layout>Feed Rate
          <v-layout justify-center row wrap>
            <v-flex xs12 sm12 md6 lg6>
              <v-text-field
                label="Work"
                v-model="work"
                color="teal darken-2"
                class="mt-0"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <v-text-field
                label="Idle"
                v-model="idle"
                color="teal darken-2"
                class="mt-0"
                type="number"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout justify-center row wrap>
            <v-flex xs12 sm12 md4 lg4>
              <v-text-field
                label="Command Power On"
                v-model="powerOn"
                class="mt-0"
                type="text"
                color="teal darken-2"
                :disabled="!laserModeStatus"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <v-text-field
                label="Spindle"
                v-model="spindle"
                class="mt-0"
                type="text"
                color="teal darken-2"
                :disabled="!laserModeStatus"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <v-text-field
                label="Command Power Off"
                v-model="powerOff"
                class="mt-0"
                type="text"
                color="teal darken-2"
                :disabled="!laserModeStatus"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <!-- Results section -->
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
        <v-btn flat @click="showConversionParamsDialog = false" class="teal--text lighten-1">Cancel</v-btn>
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
</template>

<script>
import ConversionServices from "@/services/conversion.js";
import { mapState } from "vuex";

export default {
  data: () => ({
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
    laserModeStatus: false,
    powerOn: "M3",
    spindle: "s600",
    powerOff: "M05",
    showBeforConversionAlert: true,
    //? conversion results section
    proccessBlackPixelsValue: 0,
    unproccessBlackPixelsValue: 0,
    showConversionResultAlert: false,
    //? conversion params dialog progress
    conversionProgressValue: 0,
    conversionProgressQuery: false,
    showConversionProgress: false,
    conversionProgressInterval: 0
  }),
  sockets: {
    onQuickConversionEnded(data) {
      //! if you use store state here, import 'id' state;
      if (data.target == localStorage.id) {
        this.showConversionProgress = false;
        this.doShowParamsForm = false;
        this.showConversionResultAlert = true;
        this.proccessBlackPixelsValue = 100 - data.conversionDetails;
        this.unproccessBlackPixelsValue = data.conversionDetails;
        this.$parent.$parent.showSuccessSnackbar("Converted successfully");
      }
    },
    onQuickConversionErrorOccur(data) {
      if (data.target == localStorage.id) {
        this.doShowParamsForm = true;
        this.showConversionProgress = false;
        this.showConversionResultAlert = false;
        this.showBeforConversionAlert = true;
        this.$parent.$parent.showErrorSnackbar(data.errorData);
      }
    }
  },
  computed: {
    ...mapState(["currentFileName"]),
    disableConversionCardActionBtns() {
      //? when conversion progress is true, disable action btns
      return this.showConversionProgress;
    },
    doShowConversionBtn() {
      return this.doShowParamsForm;
    }
  },
  methods: {
    toggleDialogVisibility() {
      this.showConversionParamsDialog = !this.showConversionParamsDialog;
      if (this.currentFileName.includes("M")) {
        this.laserModeStatus = true;
      } else {
        this.laserModeStatus = false;
      }
    },
    hideDialog() {
      this.showConversionParamsDialog = false;
    },
    startConversionProcess() {
      //? checking the value of Scale Axes
      if (this.scaleAxes <= 50) {
        this.scaleAxesErrorState = true;
        this.scaleAxesErrorContent = "Scale Axes must be superior of 50mm";
      } else {
        const surfaceHeight = parseInt(
          window.localStorage.getItem("surfaceHeight")
        );
        if (this.scaleAxes < surfaceHeight) {
          this.showConversionProgress = true;
          this.showBeforConversionAlert = false;
          this.doShowParamsForm = false;
          this.scaleAxesErrorState = false;
          this.scaleAxesErrorContent = "";
          ConversionServices.QuickConvertImage(
            this.currentFileName,
            {
              toolDiameter: this.toolDiameter,
              sensitivity: this.sensitivity,
              scaleAxes: this.scaleAxes,
              deepStep: this.deepStep,
              blackZ: this.blackZ,
              whiteZ: this.whiteZ,
              safeZ: this.safeZ,
              work: this.work,
              idle: this.idle
            },
            {
              laserModeStatus: this.laserModeStatus,
              powerOn: this.powerOn + " " + this.spindle,
              powerOff: this.powerOff
            }
          )
            .then(result => {
              this.$parent.$parent.showSuccessSnackbar(result.success);
            })
            .catch(error => {
              this.showConversionProgress = false;
              this.doShowParamsForm = true;
              this.$parent.$parent.showErrorSnackbar(error);
            });
        } else {
          this.scaleAxesErrorState = true;
          this.scaleAxesErrorContent =
            "Scale Axes must be less then the height of the surface (" +
            surfaceHeight +
            "mm)";
        }
      }
    },
    initializeDialog() {
      this.scaleAxes = 0;
      this.laserModeStatus = false;
      this.doShowParamsForm = true;
      this.proccessBlackPixelsValue = 0;
      this.unproccessBlackPixelsValue = 0;
    },
    showParamsForm() {
      this.doShowParamsForm = true;
    },
    prepareQuickDrawOperation() {
      this.$parent.prepareQuickDrawOperation();
    },
    reStartConversionProcess() {
      this.scaleAxes = 0;
      // called to delete the corresponding gcode file
      this.$parent.reStartConversionProcess();
    }
  }
};
</script>

<style>
</style>
