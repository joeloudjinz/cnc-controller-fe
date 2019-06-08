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
    <SnackBar :color="color" :content="content" :visibility="visibility"/>
  </v-flex>
</template>
<script>
const WorkersTable = () => import("../components/agents/WorkersTable.vue");
const CreateWorker = () => import("../components/agents/CreateWorker.vue");

import SnackBar from "@/components/app/SnackBar.vue";

import { setTimeout } from "timers";

export default {
  components: {
    SnackBar
  },
  data: () => {
    return {
      title: "Workers List",
      disableAddBtn: true,
      currentComponent: WorkersTable,
      color: "teal",
      content: "",
      visibility: false
    };
  },
  methods: {
    mounteAddAgentComponent() {
      this.title = "Add New Worker";
      this.currentComponent = CreateWorker;
    },
    mounteAgentsTableComponent() {
      this.title = "Workers List";
      this.currentComponent = WorkersTable;
    },
    showSuccessSnackbar(content) {
      this.color = "success";
      this.content = content;
      this.visibility = true;
      setTimeout(() => {
        this.visibility = false;
      }, 5000);
    },
    showErrorSnackbar(content) {
      this.color = "error";
      this.content = content;
      this.visibility = true;
      setTimeout(() => {
        this.visibility = false;
      }, 5000);
    }
  }
};
</script>

<style>
</style>
