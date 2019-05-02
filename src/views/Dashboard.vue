<template>
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
          <h1 class="font-weight-meduim green--text text--lighten-2">Agents</h1>
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
      //? snackbar details ...
      snackbarContent: "",
      snackbarColor: "",
      snackbar: false
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
