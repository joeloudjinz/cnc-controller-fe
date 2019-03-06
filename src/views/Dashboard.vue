
<template>
  <div>
    <!-- <v-toolbar tabs>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Dasboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar> -->
    <v-flex xs12>
      <SensorsData/>
      <v-divider></v-divider>
      <v-flex xs12 mt-5>
        <v-layout row wrap>
          <v-flex xs6>
            <SensorOne/>
          </v-flex>
          <v-flex xs6>
            <SensorTwo/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-flex>
  </div>
</template>

<script>
import SensorsData from "@/components/dashboard/SensorsData.vue";
import SensorOne from "@/components/dashboard/SensorOne.vue";
import SensorTwo from "@/components/dashboard/SensorTwo.vue";
export default {
  name: "dashboard",
  components: {
    SensorsData,
    SensorOne,
    SensorTwo
  },
  data() {
    return {
      tabs: null,
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    };
  }
};
</script>
