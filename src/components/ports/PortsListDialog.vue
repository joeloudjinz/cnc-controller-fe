<template>
  <!-- Ports List dialoge -->
  <v-dialog v-model="showPortsListDialog" persistent width="700">
    <v-card color="teal lighten-5">
      <v-card-title class="headline teal--text">Ports List</v-card-title>
      <v-card-text class="py-0 px-0">
        <v-progress-linear
          v-if="progressStatus"
          :indeterminate="true"
          color="teal darken-2"
          class="pa-0"
        ></v-progress-linear>
        <v-container grid-list-sm>
          <v-alert :value="true" color="teal darken-4" type="info" class="mb-2">
            Tranmission process consume to mush time, so be patient until it's successfully completed,
            You can monitor the whole process from the two consoles below after you select the port.
            If the process hang up for some reasons, you can pause and resume it.
          </v-alert>
          <v-alert
            :value="isTransmissionProcessActive"
            type="warning"
          >There is already a transmission process going on</v-alert>
          <v-list three-line class="teal lighten-5">
            <v-list-tile>
              <v-list-tile-avatar>
                <v-icon color="teal darken-2" x-large>fas fa-exclamation-circle</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>Laser Mode</v-list-tile-title>
                <v-list-tile-sub-title
                  class="red--text"
                >If you are using CNC machine with laser tool, don't forget to activate the mode first, IF NOT leave it off</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-switch v-model="laserModeStatus" color="teal darken-2"></v-switch>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <p class="title">Chose port:</p>

          <v-fade-transition>
            <v-list v-if="portsList.length !== 0" class="teal lighten-5">
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
            <v-list v-else class="teal lighten-5">
              <v-alert :value="true" type="error">No port is connected!</v-alert>
            </v-list>
          </v-fade-transition>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn flat color="teal" @click="showPortsListDialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import PortsServices from "@/services/ports.js";

import { mapState } from "vuex";

export default {
  data: () => ({
    //? ports list data ---------------------
    showPortsListDialog: false,
    portsList: [],
    progressStatus: false,
    laserModeStatus: false
  }),
  computed: {
    ...mapState(["isTransmissionProcessActive"])
  },
  methods: {
    togglePortsListDialogeVisibility() {
      this.showPortsListDialog = !this.showPortsListDialog;
    },
    showProgress() {
      this.progressStatus = true;
    },
    hideProgress() {
      this.progressStatus = false;
    },
    fetchPortsList() {
      this.progressStatus = true;
      PortsServices.getConnectedPortsList()
        .then(result => {
          this.progressStatus = false;
          if (result.count !== 0) {
            this.portsList = result.ports;
          }
        })
        .catch(error => {
          this.progressStatus = false;
          this.$parent.showErrorSnackbar(error);
        });
    },
    // ll() {
    //   console.log(this.laserModeStatus);
    // },
    startTransmitingGCode(portName) {
      this.$parent.startTransmitingGCode(portName);
    }
  }
};
</script>

<style>
</style>
