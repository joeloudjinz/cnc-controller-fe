<template>
  <v-flex xs12 sm12 md12 lg12>
    <v-toolbar color="teal lighten-5" class="elevation-0 teal--text text--darken-4">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn icon v-on="data.on" @click="mounteAgentsTableComponent">
            <v-icon color="teal darken-2">fas fa-list-alt</v-icon>
          </v-btn>
        </template>
        <span>list of all the agents</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="data">
          <v-btn icon v-on="data.on" @click="mounteAddAgentComponent">
            <v-icon color="teal darken-2">fas fa-plus-circle</v-icon>
          </v-btn>
        </template>
        <span>add new agnet</span>
      </v-tooltip>
    </v-toolbar>
    <v-card :is="currentComponent"></v-card>
  </v-flex>
</template>
<script>
import AgentsTableVue from "@/components/agents/AgentsTable.vue";
import CreateAgent from "@/components/agents/CreateAgent.vue";
export default {
  data: () => {
    return {
      title: "Agents List",
      disableAddBtn: true,
      currentComponent: AgentsTableVue
    };
  },
  methods: {
    mounteAddAgentComponent() {
      this.title = "Add New Agent";
      this.currentComponent = CreateAgent;
    },
    mounteAgentsTableComponent() {
      this.title = "Agents List";
      this.currentComponent = AgentsTableVue;
    }
  }
};
</script>

<style>
</style>
