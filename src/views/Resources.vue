<template>
  <v-layout wrap row>
    <v-flex xs12 sm12 md4 lg4 pa-2>
      <v-toolbar card color="teal lighten-5" class="teal--text text--darken-4">
        <h2>Resources Directory Tree</h2>
      </v-toolbar>
      <v-card height="900" color="teal lighten-5" class="elevation-0 scroll scrollbar-style">
        <v-card-text class="pt-0">
          <v-progress-linear :indeterminate="inProgress" color="teal darken-2"></v-progress-linear>
          <v-treeview :items="items">
            <template v-slot:prepend="{ item }">
              <v-icon color="teal darken-2" v-if="item.children">fas fa-folder</v-icon>
              <v-icon
                color="teal darken-2"
                v-else-if="item.type === 'image'"
                @click="displayImage(item.name, item.path)"
              >fas fa-image</v-icon>
              <v-icon
                color="teal darken-2"
                v-else-if="item.type === 'gcode'"
                @click="displayGcodeLines(item.name, item.path)"
              >fas fa-file-code</v-icon>
              <v-icon
                color="teal darken-2"
                v-else-if="item.type === 'log'"
                @click="displayLogFile(item.name, item.path)"
              >fas fa-file-alt</v-icon>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 sm12 md8 lg8 pa-2>
      <v-fade-transition>
        <FileContentDisplayCard ref="fileContentDisplayCardRef"/>
      </v-fade-transition>
    </v-flex>
    <ImageDisplayDialog ref="imageDisplayDialog"/>
  </v-layout>
</template>
<script>
import FileServices from "@/services/files.js";

import { setTimeout } from "timers";
import { mapState, mapMutations } from "vuex";

const FileContentDisplayCard = () =>
  import("@/components/resources/FileContentDisplayCard.vue");
const ImageDisplayDialog = () =>
  import("@/components/resources/ImageDisplayDialog.vue");

export default {
  components: { FileContentDisplayCard, ImageDisplayDialog },
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
    inProgress: false
  }),
  sockets: {
    onGcodeFileDeleted(data) {
      this.removeGcodeFileFormItems(data.fileName);
    },
    onOutputSubDirectoryDeleted(data) {
      this.removeOutputSubdirectoryFormItems(data.dirName);
    },
    onImageDeleted(data) {
      this.removeImageFromItems(data.imageName);
    },
    onGcodeFileAdded(data) {
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
    }
  },
  created() {
    this.getResourcesDirDetails();
  },
  computed: {
    ...mapState(["currentFileName"])
  },
  methods: {
    ...mapMutations([
      "SHOW_SNACKBAR",
      "TOGGLE_SB_VISIBILITY",
      "SET_CURRENT_FILE_NAME"
    ]),
    // ! DONE
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
    toggoleInProgress() {
      this.inProgress = !this.inProgress;
    },
    displayGcodeLines(name, path) {
      this.SET_CURRENT_FILE_NAME(name);
      this.$refs.fileContentDisplayCardRef.displayGcodeLines(name, path);
    },
    displayLogFile(name, path) {
      this.SET_CURRENT_FILE_NAME(name);
      this.$refs.fileContentDisplayCardRef.displayLogFile(name, path);
    },
    displayImage(name, path) {
      this.SET_CURRENT_FILE_NAME(name);
      // TODO: empty the file content arrays in fileContentDisplayCardRef to hide this component
      this.$refs.fileContentDisplayCardRef.emptyCardContent();
      this.$refs.imageDisplayDialog.displayImage(name, path);
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