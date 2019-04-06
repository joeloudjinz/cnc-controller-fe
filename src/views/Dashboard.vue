<template>
  <v-layout justify-center row wrap>
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
    <!-- Images Directory Component
    <v-flex xs12>
      <ImagesDirVue/>
    </v-flex>-->
  </v-layout>
</template>

<script>
import ConversionServices from "@/services/conversion.js";
import AgentsServices from "@/services/agent.js";
import Pusher from "pusher-js";

// import ImagesDirVue from "../components/dashboard/ImagesDir.vue";
export default {
  name: "dashboard",
  // components: { ImagesDirVue },
  data() {
    return {
      pusher: undefined,
      portsChannel: undefined,
      isOnActiveBinded: false,
      adminsCount: 0,
      agentsCount: 0,
      conversionsCount: 0,
      activePortsCount: window.localStorage.getItem("portsCount") | 0
    };
  },
  beforeDestroy() {
    // Clean up.
    this.unbindOnActive();
    this.pusher.unsubscribe("ports");
  },
  methods: {
    bindOnActive() {
      this.isOnActiveBinded = true;
      this.portsChannel.bind("on-active", data => this.onActiveCallback(data));
    },
    unbindOnActive() {
      this.portsChannel.unbind("on-active", data =>
        this.onActiveCallback(data)
      );
      this.isOnActiveBinded = false;
    },
    onActiveCallback(data) {
      this.activePortsCount = Object.keys(data.portsList).length;
    }
  },
  created: function() {
    Pusher.logToConsole = true;
    this.pusher = new Pusher("ced4b5ad59f10ab2a746", {
      cluster: "eu",
      forceTLS: true
    });
    this.portsChannel = this.pusher.subscribe("ports");
    if (!this.isOnActiveBinded) {
      this.bindOnActive();
    } else {
      console.log("Already binded to on-active");
    }
    ConversionServices.getConversionsCount()
      .then(conversionsCount => {
        this.conversionsCount = conversionsCount;
        AgentsServices.getAdminsCount()
          .then(adminsCount => {
            this.adminsCount = adminsCount;
          })
          .catch(error => {
            console.warn("in getAdminsCount(),error :", error);
          });
        AgentsServices.getAgentsCount()
          .then(result => {
            // console.log('agentsCount :', result);
            this.agentsCount = result;
          })
          .catch(error => {
            this.agentsCount = "?";
            console.warn("in getAgentsCount(),error :", error);
          });
      })
      .catch(error => {
        console.warn("in getConversionsCount(),error :", error);
      });
  }
};
</script>
<style>
.j-count-style {
  font-size: 50pt;
}
</style>
