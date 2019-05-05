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
          <v-list-tile to="/converter">
            <v-list-tile-action>
              <v-icon left>fas fa-recycle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Converter</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/resources">
            <v-list-tile-action>
              <v-icon left>fas fa-boxes</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Resources</v-list-tile-title>
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
        <v-list-tile @click="showSettingsDialog()">
          <v-list-tile-action>
            <v-icon>fas fa-tools</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-group v-if="portsCount != 0" prepend-icon="fas fa-parking" value="true">
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
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="teal" dark app fixed>
      <v-toolbar-title class="ml-0 pl-0">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="center">Loudjein CNC System</span>
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
        <!-- Protect it by isAdmin ! -->
        <v-tooltip bottom>
          <template v-if="isAdmin == true" #activator="data">
            <v-btn v-on="data.on" flat to="/agents" class="m-0">Agents</v-btn>
          </template>
          <span>Consult agents list and perform same agent account operations</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="data">
            <v-btn v-on="data.on" flat to="/converter" class="m-0">Converter</v-btn>
          </template>
          <span>Convert image into gcode and transmit the file to machine</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="data">
            <v-btn v-on="data.on" flat to="/resources">Resources</v-btn>
          </template>
          <span>Consult directory tree of all the resources in the server</span>
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
      <v-container justify-center align-center fluid>
        <v-fade-transition>
          <v-layout row wrap v-show="doShowSurfaceDimensionsAlert">
            <v-flex xs12 ms12 md12 lg12 px-1 pb-1>
              <v-list class="teal darken-4 pa-2 elevation-5">
                <v-list-tile avatar three-line>
                  <v-list-tile-avatar>
                    <v-icon left large color="white">fas fa-exclamation-triangle</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content class="font-weight-bold">
                    <v-list-tile-title
                      class="white--text text-lighten-3"
                    >Height & Width of the Drawing Surface are NOT DEFINED</v-list-tile-title>
                    <v-list-tile-sub-title class="teal--text text-lighten-3">
                      in settings page, please set them so you can convert the uploaded images
                      into gcode.
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn
                      flat
                      color="white"
                      class="font-weight-bold elevation-1"
                      @click="showSettingsDialog()"
                    >Set</v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-fade-transition>
        <v-layout row wrap>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <!-- Settings dialog -->
    <v-dialog
      v-model="settingsDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="teal">
          <v-btn
            icon
            dark
            :disabled="doDisableCloseSettingsDialogBtn"
            @click="settingsDialog = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-toolbar-items>
            <v-btn dark flat @click="settingsDialog = false">Save</v-btn>
          </v-toolbar-items>-->
        </v-toolbar>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-list class="py-0" three-line>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>The Drawing Surface Dimensions</v-list-tile-title>
                    <v-list-tile-sub-title>These two values will be used to generate appropriate gcode coordinates according to the drawing surface of the machine</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm12 md6 lg3 px-2 pl-4>
              <v-text-field
                type="number"
                label="Width"
                v-model="surfaceWidth"
                clearable
                :error-messages="surfaceWidthErrors"
                @input="$v.surfaceWidth.$touch()"
                @blur="$v.surfaceWidth.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md6 lg3 px-2>
              <v-text-field
                type="number"
                label="Height"
                v-model="surfaceHeight"
                clearable
                :error-messages="surfaceHeightErrors"
                @input="$v.surfaceHeight.$touch()"
                @blur="$v.surfaceHeight.$touch()"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-spacer></v-spacer>
            <v-btn
              color="teal"
              class="white--text"
              :disabled="doDisableSurfaceDimensionsUpdateBtn"
              @click="updateSurfaceDimensions()"
            >Update</v-btn>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
    <!-- Port dialog -->
    <v-layout row justify-center>
      <v-dialog
        v-model="doShowPortPanel"
        persistent
        fullscreen
        transition="dialog-bottom-transition"
      >
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
    </v-layout>
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
    <!-- Edit Profile Data Dialog -->
    <v-dialog v-model="editProfileDialog" persistent max-width="600px">
      <v-card color="teal lighten-5">
        <v-card-title class="teal--text text--darken-2 headline">
          <v-icon x-large color="teal darken-2" left>fas fa-user-edit</v-icon>Edit Profile Data
        </v-card-title>
        <v-card-text>
          <InfoFormVue ref="infoFormRef"/>
          <v-divider></v-divider>
          <PassFormVue ref="passFormRef"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal" class="white--text" @click="closeEditInfoDialog()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="sbVisibility"
      bottom
      :color="sbColor"
      :multi-line="'multi-line'"
      class="mb-2"
    >{{ sbContent }}</v-snackbar>
  </v-app>
</template>
<script>
import AuthServices from "@/services/auth.js";
import AgentServices from "@/services/agent.js";
import PortsServices from "@/services/ports.js";
import { validationMixin } from "vuelidate";
import { required, minValue, maxValue } from "vuelidate/lib/validators";
import { mapState, mapMutations } from "vuex";

import InfoFormVue from "../components/agents/InfoForm.vue";
import PassFormVue from "../components/agents/PassForm.vue";
import { setTimeout } from "timers";

export default {
  components: {
    InfoFormVue,
    PassFormVue
  },
  mixins: [validationMixin],
  validations: {
    surfaceWidth: {
      required,
      minValue: minValue(50),
      maxValue: maxValue(2000)
    },
    surfaceHeight: {
      required,
      minValue: minValue(50),
      maxValue: maxValue(2000)
    }
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
    drawer: false,
    right: null,

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
    portConsoleTxt: [],
    //? Settings dialog data
    settingsDialog: false,
    surfaceHeight: 0,
    surfaceWidth: 0,
    keepShowingSurfaceDimensionsAlert: true
  }),
  computed: {
    ...mapState([
      "doShowSurfaceDimensionsAlert",
      "isTransmissionProcessActive",
      "sbColor",
      "sbContent",
      "sbVisibility"
    ]),
    surfaceWidthErrors() {
      const errors = [];
      if (!this.$v.surfaceWidth.$dirty) return errors;
      !this.$v.surfaceWidth.required &&
        errors.push("Surface Width is required.");
      !this.$v.surfaceWidth.minValue &&
        errors.push("Surface Width sould be more then 50mm.");
      !this.$v.surfaceWidth.maxValue &&
        errors.push("Surface Width sould be less then 2000mm.");
      return errors;
    },
    surfaceHeightErrors() {
      const errors = [];
      if (!this.$v.surfaceHeight.$dirty) return errors;
      !this.$v.surfaceHeight.required &&
        errors.push("Surface Height is required.");
      !this.$v.surfaceHeight.minValue &&
        errors.push("Surface Height sould be more then 50mm.");
      !this.$v.surfaceHeight.maxValue &&
        errors.push("Surface Height sould be less then 2000mm.");
      return errors;
    },
    doDisableSurfaceDimensionsUpdateBtn() {
      return this.$v.$invalid;
    },
    doDisableCloseSettingsDialogBtn() {
      return this.doDisableSurfaceDimensionsUpdateBtn;
    }
  },
  sockets: {
    connect() {
      // console.log("socket connected");
    },
    onPortsListChanged(newListObject) {
      this.onActiveCallback(newListObject);
    },
    onSinglePortData(data) {
      if (data.target === window.localStorage.getItem("id"))
        this.onSinglePortDataCallback(data);
    },
    onServerStatusChanged(data) {
      this.SET_TRANSMISSION_PROCESS_STATE(data.status);
    }
  },
  methods: {
    ...mapMutations([
      "TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE",
      "SET_TRANSMISSION_PROCESS_STATE",
      "SHOW_SNACKBAR",
      "TOGGLE_SB_VISIBILITY"
    ]),
    onSinglePortDataCallback(data) {
      this.portConsoleTxt.unshift("-> data received: " + data.data);
    },
    onActiveCallback(data) {
      this.portsCount = Object.keys(data).length;
      let newList = [];
      for (let i = 0; i < this.portsCount; i++) {
        newList.push(data[i + 1]);
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
          this.portConsoleTxt.unshift("Error occurred: " + error);
          this.showErrorSnackbar(error);
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
          this.openPortDis = true;
          this.resumePortDis = true;
          this.closePortDis = false;
          this.pausePortDis = false;
          this.flushPortDis = false;
        })
        .catch(error => {
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
              if (isPortActive) {
                this.doShowPortPanel = false;
                this.showErrorSnackbar(
                  "The port is already active, you can't use the panel"
                );
                // this.flushPortDis = true;
                // this.pausePortDis = true;
                // this.resumePortDis = true;
                // this.openPortDis = true;
                // this.closePortDis = true;
              } else {
                this.doShowPortPanel = true;
              }
            })
            .catch(error => {
              this.showErrorSnackbar(
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
          this.showErrorSnackbar(
            "Error while checking port open status!" + error
          );
        });
    },
    clearPortConsole() {
      this.portConsoleTxt = [];
    },
    showSuccessSnackbar(content) {
      this.TOGGLE_SB_VISIBILITY(true);
      this.SHOW_SNACKBAR({ color: "success", content });
      setTimeout(() => {
        this.TOGGLE_SB_VISIBILITY(false);
      }, 5000);
    },
    showErrorSnackbar(content) {
      this.TOGGLE_SB_VISIBILITY(true);
      this.SHOW_SNACKBAR({ color: "error", content });
      setTimeout(() => {
        this.TOGGLE_SB_VISIBILITY(false);
      }, 5000);
    },
    closeEditInfoDialog() {
      this.editProfileDialog = false;
      this.$refs.passFormRef.$v.$reset();
      this.$refs.infoFormRef.$v.$reset();
    },
    showSettingsDialog() {
      //? before opening the dialoge, initialize the settings values from the local storage
      this.surfaceWidth = window.localStorage.getItem("surfaceWidth");
      this.surfaceHeight = window.localStorage.getItem("surfaceHeight");
      this.settingsDialog = true;
    },
    //? form methods
    launcheEditProfile() {
      this.editProfileDialog = true;
    },
    updateSurfaceDimensions() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        window.localStorage.setItem("surfaceWidth", this.surfaceWidth);
        window.localStorage.setItem("surfaceHeight", this.surfaceHeight);
        if (this.doShowSurfaceDimensionsAlert) {
          this.TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE();
        }
        this.showSuccessSnackbar("Information Updated Successfully");
      }
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
    PortsServices.getConnectedPortsList()
      .then(result => {
        this.portsCount = result.count;
        if (result.count != 0) this.portsList = result.ports;
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
