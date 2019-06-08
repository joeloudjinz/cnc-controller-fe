<template>
  <!-- Settings dialog -->
  <v-dialog v-model="settingsDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
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
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minValue, maxValue } from "vuelidate/lib/validators";

export default {
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
    //? Settings dialog data
    settingsDialog: false,
    surfaceHeight: 0,
    surfaceWidth: 0,
    keepShowingSurfaceDimensionsAlert: true
  }),
  computed: {
    ...mapState(["doShowSurfaceDimensionsAlert"]),
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
  methods: {
    ...mapMutations(["TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE"]),
    showSettingsDialog() {
      //? before opening the dialoge, initialize the settings values from the local storage
      this.surfaceWidth = window.localStorage.getItem("surfaceWidth");
      this.surfaceHeight = window.localStorage.getItem("surfaceHeight");
      this.settingsDialog = true;
    },
    updateSurfaceDimensions() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        window.localStorage.setItem("surfaceWidth", this.surfaceWidth);
        window.localStorage.setItem("surfaceHeight", this.surfaceHeight);
        if (this.doShowSurfaceDimensionsAlert) {
          this.TOGGLE_SURFACE_DIMENSIONS_ALERT_STATE();
        }
        this.$parent.showSuccessSnackbar("Information Updated Successfully");
      }
    }
  }
};
</script>

<style>
</style>
