<template>
  <v-layout wrap row>
    <v-flex xs12 sm12 md4 lg4 pa-2>
      <v-toolbar card class="teal white--text">
        <h2>Resources Directory Tree</h2>
      </v-toolbar>
      <v-card height="900" class="scroll">
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
    <v-dialog v-model="imageDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="teal lighten-1">
          <v-btn icon dark @click="imageDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{currentFileName}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="imageDialog = false">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <div id="preview">
            <img :src="imageURL">
          </div>
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
                <v-btn v-on="data.on" icon @click="deleteOutputDirectory()">
                  <v-icon color="white">fas fa-folder-minus</v-icon>
                </v-btn>
              </template>
              <span>Delete the current directory</span>
            </v-tooltip>
          </div>
          <div v-if="doShowDeleteFileBtn">
            <v-tooltip bottom>
              <template #activator="data">
                <v-btn v-on="data.on" icon @click="deleteSelectedFile()">
                  <v-icon color="white">fas fa-trash-alt</v-icon>
                </v-btn>
              </template>
              <span>Delete the current file</span>
            </v-tooltip>
          </div>
        </v-toolbar>
        <v-card height="842" color="teal lighten-5" class="scroll">
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
          <!-- <v-divider></v-divider> -->
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
    imageDialog: false,
    gcodeData: [],
    fullGcodeData: [],
    logData: [],
    fullLogData: [],
    stoppedIn: 0,
    logURL: undefined,
    //? snackbar details ...
    snackbarContent: "",
    snackbarColor: "",
    snackbar: false
  }),
  computed: {
    doShowDeleteFileBtn() {
      return (
        this.currentFileName != undefined &&
        this.currentFileName.includes(".gcode")
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
      this.imageDialog = true;
      this.currentFileName = name;
      FileServices.getImageData(path)
        .then(result => {
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
    deleteSelectedFile() {
      if (this.currentFileName) {
        if (this.currentFileName.includes(".gcode")) {
          if (this.currentFileName.includes("clean")) {
            // delete from output directory
          } else {
            FileServices.deleteGcodeFile(this.currentFileName)
              .then(() => {
                console.log("File deleted");
                for (let i = 0; i < this.items[1].children.length; i++) {
                  if (this.items[1].children[i].name == this.currentFileName) {
                    this.items[1].children.splice(i, 1);
                    break;
                  }
                }
                this.gcodeData = [];
                this.showSuccessSnackbar("File was deleted successfully");
              })
              .catch(error => {
                this.showErrorSnackbar(error);
              });
          }
        } else {
          console.log("it's log file", this.currentFileName);
        }
      } else {
        this.showErrorSnackbar("File name is undefined");
      }
    },
    deleteOutputDirectory() {
      const dirName = this.currentFileName.split(".")[0];
      FileServices.deleteOutputDirectory(dirName)
        .then(() => {
          for (let i = 0; i < this.items[2].children.length; i++) {
            if (this.items[2].children[i].name == dirName) {
              this.items[2].children.splice(i, 1);
              break;
            }
          }
          this.logData = [];
          this.showSuccessSnackbar("Directory deleted successfully");
        })
        .catch(error => {
          this.showErrorSnackbar(error);
        });
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
<style>
.scroll {
  overflow-y: auto;
}
#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
