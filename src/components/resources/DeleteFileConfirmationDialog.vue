<template>
  <v-dialog v-model="showDeleteFileConfirmationDialog" persistent width="500">
    <v-card color="teal lighten-5" dark>
      <v-card-title class="teal--text text--darken-2 headline">
        <v-icon color="teal darken-2" large left>fas fa-exclamation-circle</v-icon>Confirm Deletion
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="font-weight-bold black--text">
        <p v-if="isGcodeFile">Are you sure you want to delete this file?</p>
        <p v-else-if="isLogFile">Are you sure you want to delete this directory?</p>
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
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data: () => ({
    showDeleteFileConfirmationDialog: false
  }),
  computed: {
    ...mapState(["currentFileName"]),
    ...mapGetters(["isLogFile", "isGcodeFile"])
  },
  methods: {
    selecteDeletionType() {
      this.$parent.selecteDeletionType();
    },
    getDialogVisibility() {
      return this.showDeleteFileConfirmationDialog;
    },
    toggoleDialogVisibility() {
      this.showDeleteFileConfirmationDialog = !this
        .showDeleteFileConfirmationDialog;
    }
  }
};
</script>

<style>
</style>
