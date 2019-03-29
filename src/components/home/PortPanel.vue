<template>
  <v-layout row justify-center>
    <v-dialog v-model="doShowPanel" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="teal lighten-1">
          <v-btn icon dark @click="doShowPanel = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Port Panel</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat :disabled="openPortDis" @click="openPort(selectedPort.comName)">
              <v-icon left>fas fa-door-open</v-icon>Open Port
            </v-btn>
          </v-toolbar-items>
          <v-toolbar-items>
            <v-btn dark flat :disabled="closePortDis" @click="closePort(selectedPort.comName)">
              <v-icon left>fas fa-times-circle</v-icon>Close Port
            </v-btn>
          </v-toolbar-items>
          <v-toolbar-items>
            <v-btn dark flat :disabled="flushPortDis" @click="flushPort(selectedPort.comName)">
              <v-icon left>fas fa-arrow-alt-circle-down</v-icon>Flush Data
            </v-btn>
          </v-toolbar-items>
          <v-toolbar-items>
            <v-btn dark flat :disabled="resumePortDis" @click="resumePort(selectedPort.comName)">
              <v-icon left>fas fa-play-circle</v-icon>Resume Data
            </v-btn>
          </v-toolbar-items>
          <v-toolbar-items>
            <v-btn dark flat :disabled="pausePortDis" @click="pausePort(selectedPort.comName)">
              <v-icon left>fas fa-pause-circle</v-icon>Pause Data
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader v-if="selectedPort != undefined">
          <v-subheader>Port Infromation</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Port Name</v-list-tile-title>
              <v-list-tile-sub-title>{{ selectedPort.comName }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Manufacturer</v-list-tile-title>
              <v-list-tile-sub-title>{{ selectedPort.manufacturer }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Serial Number</v-list-tile-title>
              <v-list-tile-sub-title>{{ selectedPort.serialNumber }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Plug and Play ID</v-list-tile-title>
              <v-list-tile-sub-title>{{ selectedPort.pnpId }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Procudt ID</v-list-tile-title>
              <v-list-tile-sub-title>{{ selectedPort.productId }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Vendor ID</v-list-tile-title>
              <v-list-tile-sub-title>{{ selectedPort.vendorId }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import PortsServices from "@/services/ports.js";
export default {
  data: () => ({
    //? snackbar details ...
    snackbarContent: "",
    snackbarColor: "",
    snackbar: false,
    selectedPort: this.portObject,
    doShowPanel: this.doShow, 
    //? to enable and disable control btns of port console panel
    flushPortDis: false,
    pausePortDis: false,
    resumePortDis: true,
    openPortDis: false,
    closePortDis: true
  }),
//   computed: {
//     //? to show or hide ports console bottom sheet
//     doShowPortDialog: this.doShow,
//   },
  props: {
    portObject: { type: Object, required: true },
    doShow: { type: Boolean, required: true }
  },
  methods: {
    pausePort(portName) {
      console.warn("pausePort() is called, port is " + portName);
      PortsServices.pauseEmittingPort(portName)
        .then(result => {
          this.resumePortDis = false; //! means enable btn
          this.pausePortDis = true; //! means disable btn
          this.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    resumePort(portName) {
      console.warn("resumePort() is called, port is " + portName);
      PortsServices.resumeEmittingPort(portName)
        .then(result => {
          this.pausePortDis = false;
          this.resumePortDis = true;
          this.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    flushPort(portName) {
      console.warn("flushPort() is called, port is " + portName);
      PortsServices.flushPort(portName)
        .then(result => {
          this.showSuccessSnackbar(result.success);
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
    },
    openPort(portName) {
      console.warn("openPort() is called, port is " + portName);
    },
    closePort(portName) {
      console.warn("closePort() is called, port is " + portName);
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
