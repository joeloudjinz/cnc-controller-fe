<template>
  <v-container fluid wrap ma-0 pa-0>
    <v-layout row wrap>
      <!-- Simple Statistics -->
      <v-flex xs12 sm12 md3 lg3 class="pb-1 mb-0">
        <CountCardVue iconName="fas fa-crown" :count="adminsCount" countType="Admins"/>
      </v-flex>
      <v-flex xs12 sm12 md3 lg3 class="pb-1 mb-0">
        <CountCardVue iconName="fas fa-hard-hat" :count="agentsCount" countType="Workers"/>
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

const CountCardVue = () => import("@/components/dashboard/CountCard.vue");
const CuationCardVue = () => import("@/components/dashboard/CuationCard.vue");

export default {
  name: "dashboard",
  components: { CountCardVue, CuationCardVue },
  data() {
    return {
      adminsCount: 0,
      agentsCount: 0,
      conversionsCount: 0,
      activePortsCount: 0
    };
  },
  sockets: {
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
