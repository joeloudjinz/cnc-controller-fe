<template>
  <v-container fluid wrap ma-0 pa-0>
    <v-layout row wrap>
      <!-- Simple Statistics -->
      <v-flex xs12 sm12 md3 lg3 class="pb-1 mb-0">
        <CountCardVue iconName="fas fa-crown" :count="adminsCount" countType="Admins"/>
      </v-flex>
      <v-flex xs12 sm12 md3 lg3 class="pb-1 mb-0">
        <CountCardVue iconName="fas fa-hard-hat" :count="workersCount" countType="Workers"/>
      </v-flex>
      <v-flex xs12 sm12 md3 lg3 class="pb-1 mb-0">
        <CountCardVue iconName="fas fa-recycle" :count="conversionsCount" countType="Conversions"/>
      </v-flex>
      <v-flex xs12 sm12 md3 lg3 class="pb-1 mb-0">
        <CountCardVue
          iconName="fas fa-parking"
          :count="activePortsCount"
          countType="Connected Ports"
        />
      </v-flex>
    </v-layout>
    <v-layout justify-center align-center pa-1>
      <v-flex xs12>
        <CuationCardVue/>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import ConversionServices from "@/services/conversion.js";
import AgentsServices from "@/services/agent.js";
import PortsServices from "@/services/ports.js";

import { mapState, mapMutations } from "vuex";

const CountCardVue = () => import("@/components/dashboard/CountCard.vue");
const CuationCardVue = () => import("@/components/dashboard/CuationCard.vue");

export default {
  name: "dashboard",
  components: { CountCardVue, CuationCardVue },
  sockets: {
    onPortsListChanged(newListObject) {
      this.onPortsListChangedCallback(newListObject);
    }
  },
  computed: {
    ...mapState([
      "adminsCount",
      "workersCount",
      "conversionsCount",
      "activePortsCount"
    ])
  },
  methods: {
    ...mapMutations([
      "SET_ADMINS_COUNT",
      "SET_WORKERS_COUNT",
      "SET_CONVERSIONS_COUNT",
      "SET_ACTIVE_PORTS_COUNT"
    ]),
    onPortsListChangedCallback(data) {
      this.activePortsCount = Object.keys(data).length;
    }
  },
  created: function() {
    ConversionServices.getConversionsCount()
      .then(conversionsCount => {
        if (this.conversionsCount != conversionsCount) {
          this.SET_CONVERSIONS_COUNT(conversionsCount);
        }
        AgentsServices.getAdminsCount()
          .then(adminsCount => {
            if (this.adminsCount != adminsCount) {
              this.SET_ADMINS_COUNT(adminsCount);
            }
          })
          .catch(error => {
            this.$parent.showErrorSnackbar(error);
          });
        PortsServices.getConnectedPortsList()
          .then(result => {
            if (this.activePortsCount != result.count) {
              this.SET_ACTIVE_PORTS_COUNT(result.count);
            }
          })
          .catch(error => {
            this.$parent.showErrorSnackbar(error);
          });
        AgentsServices.getAgentsCount()
          .then(count => {
            if (this.workersCount != count) {
              this.SET_WORKERS_COUNT(count);
            }
          })
          .catch(error => {
            this.$parent.showErrorSnackbar(error);
          });
      })
      .catch(error => {
        console.log('error :', error);
        // this.$parent.showErrorSnackbar(error);
      });
  }
};
</script>
<style>
.j-count-style {
  font-size: 50pt;
}
</style>
