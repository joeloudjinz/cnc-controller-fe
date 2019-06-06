<template>
  <div>
    <div v-show="doShowDisplayCard">
      <v-toolbar card color="teal lighten-5" class="teal--text text--darken-4">
        <h2>{{currentFileName}}</h2>
        <v-spacer></v-spacer>
        <div v-if="doShowDeleteDirectoryBtn">
          <v-tooltip bottom>
            <template #activator="data">
              <v-btn v-on="data.on" icon @click="showDeleteFileConfirmationDialog = true">
                <v-icon color="teal darken-2">fas fa-folder-minus</v-icon>
              </v-btn>
            </template>
            <span>Delete the current directory</span>
          </v-tooltip>
        </div>
        <div v-if="doShowDeleteFileBtn">
          <v-tooltip bottom>
            <template #activator="data">
              <v-btn v-on="data.on" icon @click="showDeleteFileConfirmationDialog = true">
                <v-icon color="teal darken-2">fas fa-trash-alt</v-icon>
              </v-btn>
            </template>
            <span>Delete the current file</span>
          </v-tooltip>
        </div>
      </v-toolbar>
      <v-card height="842" color="teal lighten-5" class="elevation-0 scroll scrollbar-style">
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
      <v-card-actions class="teal lighten-5 elevation-0 mt-1">
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
    </div>
    <v-dialog v-model="showDeleteFileConfirmationDialog" persistent width="500">
      <v-card color="teal lighten-5" dark>
        <v-card-title class="teal--text text--darken-2 headline">
          <v-icon color="teal darken-2" large left>fas fa-exclamation-circle</v-icon>Confirm Deletion
        </v-card-title>
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
            class="teal--text lighten-1"
          >Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="selecteDeletionType()" color="red lighten-1" class="white--text">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FileServices from "@/services/files.js";

export default {
  data: () => ({
    currentFileName: undefined,
    gcodeData: [],
    fullGcodeData: [],
    logData: [],
    fullLogData: [],
    stoppedIn: 0,
    logURL: undefined,
    showDeleteFileConfirmationDialog: false
  }),
  computed: {
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
  methods: {
    displayGcodeLines(name, path) {
      this.$parent.toggoleInProgress();
      this.currentFileName = name;
      this.logData = [];
      this.fullLogData = [];
      FileServices.getFileLines(path)
        .then(result => {
          this.$parent.toggoleInProgress();
          this.fullGcodeData = result.fileLines;
          this.gcodeData = this.fullGcodeData.slice(0, 100);
          this.stoppedIn = 100;
        })
        .catch(error => {
          this.inProgress = false;
          this.$parent.showErrorSnackbar(error);
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
          this.$parent.showErrorSnackbar(error);
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
    deleteGcodeFile(gcodeFileName) {
      if (gcodeFileName != undefined) {
        if (this.currentFileName.includes(".gcode")) {
          FileServices.deleteGcodeFile(gcodeFileName)
            .then(() => {
              this.gcodeData = [];
              this.$parent.showSuccessSnackbar("File was deleted successfully");
            })
            .catch(error => {
              this.$parent.showErrorSnackbar(error);
            });
        }
      } else {
        this.$parent.showErrorSnackbar("File name is undefined");
      }
    },
    deleteOutputDirectory() {
      const dirName = this.currentFileName.split(".")[0];
      FileServices.deleteOutputDirectory(dirName)
        .then(() => {
          this.logData = [];
          this.$parent.showSuccessSnackbar("Directory deleted successfully");
        })
        .catch(error => {
          this.$parent.showErrorSnackbar(error);
        });
    }
  }
};
</script>

<style>
</style>
