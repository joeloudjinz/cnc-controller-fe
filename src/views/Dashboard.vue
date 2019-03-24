
<template>
  <div>
    <v-layout row wrap>
      <v-flex d-flex xs12>
        <v-toolbar>
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <v-toolbar-title>Dasboard</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-layout justify-center row wrap>
      <v-flex d-flex xs12>
        <v-card>
          <v-card-title>Sensors Data Chart</v-card-title>
          <v-card-text></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn>Stop Machine</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import SensorsData from "@/components/dashboard/SensorsData.vue";
// import SensorOne from "@/components/dashboard/SensorOne.vue";
// import SensorTwo from "@/components/dashboard/SensorTwo.vue";
export default {
  name: "dashboard",
  components: {
    // SensorsData
    // SensorOne,
    // SensorTwo
  },
  data() {
    return {
    };
  }
};
</script>
