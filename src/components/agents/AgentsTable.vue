<template>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="agents"
      :search="search"
      :loading="loading"
      item-key="index"
    >
      <v-progress-linear slot="progress" color="teal" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <!-- <td>
          <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
        </td>-->
        <td>{{ props.item.index }}</td>
        <td>{{ props.item.first_name }}</td>
        <td>{{ props.item.last_name }}</td>
        <td>{{ props.item.email }}</td>
        <td class="text-lg-center" v-if="props.item.is_active">
          <v-chip small color="teal" text-color="white">
            <v-avatar>
              <v-icon>fas fa-eye</v-icon>
            </v-avatar>Active
          </v-chip>
        </td>
        <td class="text-lg-center" v-else>
          <v-chip small color="warning" text-color="white">
            <v-avatar>
              <v-icon>fas fa-eye-slash</v-icon>
            </v-avatar>Idle
          </v-chip>
        </td>
        <td>
          <v-btn icon @click="deleteAgent(props.item.id)">
            <v-icon color="error">fas fa-user-minus</v-icon>
          </v-btn>
        </td>
      </template>
      <v-alert
        slot="no-results"
        :value="true"
        color="error"
        icon="warning"
      >Your search for "{{ search }}" found no results.</v-alert>
    </v-data-table>
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      :bottom="'bottom'"
      :color="snackbarColor"
      :multi-line="'multi-line'"
    >{{ snackbarContent }}</v-snackbar>
  </v-card>
</template>
<script>
// import axios from "axios";
import AgentServices from "@/services/agent.js";
export default {
  data() {
    return {
      search: "",
      loading: true,
      // the selected items ....
      // selected: [],
      headers: [
        { text: "#", value: "index" },
        {
          text: "First Name",
          value: "first_name"
        },
        { text: "Last Name", value: "last_name" },
        { text: "Email", value: "email" },
        { text: "Activeness", value: "is_active" },
        { text: "Operations", value: "delete" }
      ],
      agents: [],
      snackbarContent: "",
      snackbarColor: "",
      snackbar: false
    };
  },
  async created() {
    this.refrechAgentsList();
  },
  methods: {
    async refrechAgentsList() {
      await AgentServices.getAgents()
        .then(agents => {
          this.agents = agents;
          this.loading = false;
        })
        .catch(error => {
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarContent = error;
          this.loading = false;
        });
    },
    async deleteAgent(id) {
      await AgentServices.deleteAgentById(id)
        .then(result => {
          this.agents = [];
          this.snackbar = true;
          this.snackbarColor = "success";
          this.snackbarContent = result;
          this.refrechAgentsList();
        })
        .catch(error => {
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarContent = error;
          this.loading = false;
        });
    }
  }
};
</script>

<style>
</style>
