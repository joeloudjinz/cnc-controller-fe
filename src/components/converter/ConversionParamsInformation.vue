<template>
  <v-dialog v-model="conversionParamsInformation" max-width="600px">
    <v-card color="teal lighten-5">
      <v-card-title class="teal--text text--darken-2 headline">
        <v-icon x-large color="teal darken-2" left>fas fa-info-circle</v-icon>Parameters Information
      </v-card-title>
      <v-card-text>
        <v-list three-line class="teal lighten-5">
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">Tool Diameter</v-list-tile-title>
            <v-list-tile-sub-title
              class="text--primary"
            >It is the diameter in millimeters of the tool, how much it eats of the material the tool only when low.</v-list-tile-sub-title>
            <v-list-tile-sub-title>default: 1mm</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">Senstivity</v-list-tile-title>
            <v-list-tile-sub-title class="text--primary">From 0 to 1, the sensetivity of the tool.</v-list-tile-sub-title>
            <v-list-tile-sub-title>default: 0.95</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">Scale Axes</v-list-tile-title>
            <v-list-tile-sub-title
              class="text--primary"
            >Related to image size, like zooming (in or out) the image on the drawing surface of the machine.</v-list-tile-sub-title>
            <!-- <v-list-tile-sub-title>default: 0.95</v-list-tile-sub-title> -->
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">Deep Step</v-list-tile-title>
            <v-list-tile-sub-title
              class="text--primary"
            >The depth of the step, amount of mm that the tool should eat from the material for each step (how much tool eats per step).</v-list-tile-sub-title>
            <v-list-tile-sub-title>default: -1</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">White Z</v-list-tile-title>
            <v-list-tile-sub-title
              class="text--primary"
            >White pixels, value in mm corresponds to the color white.</v-list-tile-sub-title>
            <v-list-tile-sub-title>default: 0</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">Black Z</v-list-tile-title>
            <v-list-tile-sub-title
              class="text--primary"
            >Maximum depth, value in mm corresponds to the color black.</v-list-tile-sub-title>
            <v-list-tile-sub-title>default: -2</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">Safe Z</v-list-tile-title>
            <v-list-tile-sub-title
              class="text--primary"
            >Safe distance. the height in mm that is safe to move the tool.</v-list-tile-sub-title>
            <v-list-tile-sub-title>default: 1</v-list-tile-sub-title>
          </v-list-tile-content>
          <!-- feedrate { work: (number), idle: (number) } Only the corresponding line is added. default: '', Choose which working speed to use and how fast it will move when idle -->
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">Feed Rate</v-list-tile-title>
            <v-list-tile-sub-title
              class="text--primary"
            >Choose which working speed to use and how fast it will move when idle.</v-list-tile-sub-title>
            <!-- <v-list-tile-sub-title>default: 0.95</v-list-tile-sub-title> -->
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">Command Power On</v-list-tile-title>
            <v-list-tile-sub-title
              class="text--primary"
            >GCode M command to turn the laser On, M3 is the perfect command</v-list-tile-sub-title>
            <v-list-tile-sub-title>default: M3</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">Spindle</v-list-tile-title>
            <v-list-tile-sub-title
              class="text--primary"
            >From 100 to 1000, GCode S command to set the intencity of the laser</v-list-tile-sub-title>
            <v-list-tile-sub-title>default: s600</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-medium title">Command Power Off</v-list-tile-title>
            <v-list-tile-sub-title
              class="text--primary"
            >GCode M command to turn the laser Off, M05 is the perfect command</v-list-tile-sub-title>
            <v-list-tile-sub-title>default: M05</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list>
      </v-card-text>
      <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="teal" class="white--text" @click="hideDialog()">Close</v-btn>
      </v-card-actions>-->
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    conversionParamsInformation: false
  }),
  methods: {
    showDialog() {
      this.conversionParamsInformation = true;
    },
    hideDialog() {
      this.conversionParamsInformation = false;
    }
  }
};
</script>

<style>
</style>
