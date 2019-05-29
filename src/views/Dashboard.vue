<template>
  <v-container fluid wrap ma-0 pa-0>
    <v-layout row wrap>
      <!-- Simple Statistics -->
      <v-flex xs12 sm12 md3 lg3 class="pb-1 mb-0">
        <v-card class="teal lighten-5 mx-1">
          <v-card-text class="pt-2 pb-0">
            <v-layout align-center justify-center row fill-height py-2>
              <v-badge color="transparent">
                <template v-slot:badge>
                  <v-icon large color="teal darken-5">fas fa-crown</v-icon>
                </template>
                <h1 class="j-count-style teal--text">{{adminsCount}}</h1>
              </v-badge>
            </v-layout>
          </v-card-text>
          <v-card-actions class="pt-0 pb-1">
            <v-spacer></v-spacer>
            <h1 class="font-weight-meduim green--text text--lighten-2">Administrators</h1>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md3 lg3 class="pb-1 mb-0">
        <v-card class="teal lighten-5 mx-1">
          <v-card-text class="pt-2 pb-0">
            <v-layout align-center justify-center row fill-height py-2>
              <v-badge color="transparent">
                <template v-slot:badge>
                  <v-icon large color="teal darken-5">fas fa-hard-hat</v-icon>
                </template>
                <h1 class="j-count-style teal--text">{{agentsCount}}</h1>
              </v-badge>
            </v-layout>
          </v-card-text>
          <v-card-actions class="pt-0 pb-1">
            <v-spacer></v-spacer>
            <h1 class="font-weight-meduim green--text text--lighten-2">Workers</h1>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md3 lg3 class="pb-1 mb-0">
        <v-card class="teal lighten-5 mx-1">
          <v-card-text class="pt-2 pb-0">
            <v-layout align-center justify-center row fill-height py-2>
              <v-badge color="transparent">
                <template v-slot:badge>
                  <v-icon large color="teal darken-5">fas fa-recycle</v-icon>
                </template>
                <h1 class="j-count-style teal--text">{{conversionsCount}}</h1>
              </v-badge>
            </v-layout>
          </v-card-text>
          <v-card-actions class="pt-0 pb-1">
            <v-spacer></v-spacer>
            <h1 class="font-weight-meduim green--text text--lighten-2">Conversions</h1>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md3 lg3 class="pb-1 mb-0">
        <v-card class="teal lighten-5 mx-1">
          <v-card-text class="pt-2 pb-0">
            <v-layout align-center justify-center row fill-height py-2>
              <v-badge color="transparent">
                <template v-slot:badge>
                  <v-icon
                    large
                    :color="activePortsCount != 0 ? 'teal darken-5' : 'red lighten-2'"
                  >fas fa-parking</v-icon>
                </template>
                <h1 class="j-count-style teal--text">{{activePortsCount}}</h1>
              </v-badge>
            </v-layout>
          </v-card-text>
          <v-card-actions class="pt-0 pb-1">
            <v-spacer></v-spacer>
            <h1 class="font-weight-meduim green--text text--lighten-2">Connected Ports</h1>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout justify-center align-center pa-1>
      <v-flex xs12>
        <v-card color="teal lighten-5">
          <v-layout wrap>
            <v-flex xs12 sm12 md5 lg5>
              <v-img :src="tools"></v-img>
            </v-flex>
            <v-flex xs12 sm12 md7 lg7>
              <v-card-title primary-title>
                <div>
                  <div class="headline">Cuation Is Needed</div>
                  <span class="grey--text">Safety is as simple as ABC - Always Be Careful.</span>
                </div>
              </v-card-title>
              <v-card-text>
                <p>At Lowell using CNC machines is part of the daily routine, but it is extremely important that everyone remembers the proper safety rules while operating the machines. This will be a rundown of the basic safety rules that should be followed while working with or around a CNC machine.</p>
                <ul>
                  <li>Always ensure that you wear proper ear protection and a good pair of safety glasses when operating a CNC machine.</li>
                  <li>Ensure that your safety glasses are firmly in place every time you are closely observing the cutting tools.</li>
                  <li>Ensure that you wear suitable footwear such as safety boots at all times.</li>
                  <li>If you have long hair, ensure that you keep it covered when you operate the CNC machine.</li>
                  <li>Keep your hands away from any moving parts during machining processes.</li>
                  <li>Stand clear of the machine whenever it is operational. You should also warn any other people near the risk of being too close to it.</li>
                  <li>Whenever you are handling or passing tools, avoid touching the cutting edges.</li>
                  <li>Ensure that you turn the machine off completely and clean it whenever you have finished using it.</li>
                </ul>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import ConversionServices from "@/services/conversion.js";
import AgentsServices from "@/services/agent.js";
import PortsServices from "@/services/ports.js";
export default {
  name: "dashboard",
  data() {
    return {
      adminsCount: 0,
      agentsCount: 0,
      conversionsCount: 0,
      activePortsCount: 0,
      tools: require("@/assets/tools.svg"),
    };
  },
  sockets: {
    connect() {
      // console.log("socket connected");
    },
    onPortsListChanged(newListObject) {
      this.onPortsListChangedCallback(newListObject);
    }
  },
  methods: {
    onPortsListChangedCallback(data) {
      this.activePortsCount = Object.keys(data).length;
    }
  },
  created: function() {
    ConversionServices.getConversionsCount()
      .then(conversionsCount => {
        this.conversionsCount = conversionsCount;
        AgentsServices.getAdminsCount()
          .then(adminsCount => {
            this.adminsCount = adminsCount;
            PortsServices.getConnectedPortsList()
              .then(result => {
                this.activePortsCount = result.count;
              })
              .catch(error => {
                this.showErrorSnackbar(error);
              });
          })
          .catch(error => {
            this.adminsCount = "NaN";
            this.showErrorSnackbar(error);
          });
        AgentsServices.getAgentsCount()
          .then(result => {
            // console.log('agentsCount :', result);
            this.agentsCount = result;
          })
          .catch(error => {
            this.agentsCount = "NaN";
            this.showErrorSnackbar(error);
          });
      })
      .catch(error => {
        this.conversionsCount = "NaN";
        this.showErrorSnackbar(error);
      });
  }
};
</script>
<style>
.j-count-style {
  font-size: 50pt;
}
</style>
