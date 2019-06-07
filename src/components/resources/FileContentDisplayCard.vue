<template>
  <div>
    <div v-show="doShowDisplayCard">
      <v-toolbar card color="teal lighten-5" class="teal--text text--darken-4">
        <h2>{{currentFileName}}</h2>
        <v-spacer></v-spacer>
        <div v-if="doShowDeleteDirectoryBtn">
          <v-tooltip bottom>
            <template #activator="data">
              <v-btn v-on="data.on" icon @click="displayDeleteFileConfirmationDialog()">
                <v-icon color="teal darken-2">fas fa-folder-minus</v-icon>
              </v-btn>
            </template>
            <span>Delete the current directory</span>
          </v-tooltip>
        </div>
        <div v-if="doShowDeleteFileBtn">
          <v-tooltip bottom>
            <template #activator="data">
              <v-btn v-on="data.on" icon @click="displayDeleteFileConfirmationDialog()">
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
      <DeleteFileConfirmationDialog ref="deleteFileConfirmationDialogRef"/>
    </div>
  </div>
</template>
<script>
import FileServices from "@/services/files.js";

import { mapState, mapGetters } from "vuex";

const DeleteFileConfirmationDialog = () =>
  import("./DeleteFileConfirmationDialog.vue");

export default {
  components: {
    DeleteFileConfirmationDialog
  },
  data: () => ({
    gcodeData: [],
    fullGcodeData: [],
    logData: [],
    fullLogData: [],
    stoppedIn: 0
  }),
  computed: {
    ...mapState(["currentFileName"]),
    ...mapGetters(["isLogFile", "isGcodeFile"]),
    doShowDeleteFileBtn() {
      return this.isGcodeFile && !this.currentFileName.includes("clean");
    },
    doShowDeleteDirectoryBtn() {
      return this.isLogFile;
    },
    doShowDisplayCard() {
      return this.gcodeData.length != 0 || this.logData.length != 0;
    },
    doShowLoadingBtns() {
      return (
        this.stoppedIn < this.fullGcodeData.length ||
        this.stoppedIn < this.fullLogData.length
      );
    },
    showDeleteFileConfirmationDialog() {
      return this.$refs.deleteFileConfirmationDialogRef.getDialogVisibility();
    }
  },
  methods: {
    // ...mapMutations(["SET_CURRENT_FILE_NAME"]),
    displayGcodeLines(name, path) {
      this.$parent.toggoleInProgress();
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
          this.$parent.toggoleInProgress();
          this.$parent.showErrorSnackbar(error);
        });
    },
    displayLogFile(name, path) {
      this.gcodeData = [];
      this.fullGcodeData = [];
      this.$parent.toggoleInProgress();
      FileServices.getFileLines(path)
        .then(result => {
          this.$parent.toggoleInProgress();
          this.fullLogData = result.fileLines;
          this.logData = this.fullLogData.slice(0, 100);
          this.stoppedIn = 100;
        })
        .catch(error => {
          this.$parent.toggoleInProgress();
          this.$parent.showErrorSnackbar(error);
        });
    },
    loadMoreLines() {
      const stopline = this.stoppedIn + 100;
      if (this.isLogFile) {
        const newLines = this.fullLogData.slice(this.stoppedIn, stopline);
        this.logData.push(...newLines);
      } else if (this.isGcodeFile) {
        const newLines = this.fullGcodeData.slice(this.stoppedIn, stopline);
        this.gcodeData.push(...newLines);
      }
      this.stoppedIn = stopline;
    },
    loadAllLines() {
      if (this.isLogFile) {
        const newLines = this.fullLogData.slice(this.stoppedIn);
        this.logData.push(...newLines);
        this.stoppedIn = this.fullLogData.length;
      } else if (this.isGcodeFile) {
        const newLines = this.fullGcodeData.slice(this.stoppedIn);
        this.gcodeData.push(...newLines);
        this.stoppedIn = this.fullGcodeData.length;
      }
    },
    displayDeleteFileConfirmationDialog() {
      this.$refs.deleteFileConfirmationDialogRef.toggoleDialogVisibility();
    },
    selecteDeletionType() {
      if (this.isGcodeFile) {
        this.deleteGcodeFile(this.currentFileName);
      } else {
        this.deleteOutputDirectory();
      }
      this.$refs.deleteFileConfirmationDialogRef.toggoleDialogVisibility();
    },
    deleteGcodeFile(gcodeFileName) {
      if (gcodeFileName != undefined) {
        if (this.isGcodeFile) {
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
    },
    emptyCardContent() {
      this.logData = [];
      this.gcodeData = [];
      this.fullLogData = [];
      this.fullGcodeData = [];
    }
  }
};
</script>
<style>
</style>
