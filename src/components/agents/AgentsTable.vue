<template>
  <v-card class="pt-3 elevation-0" color="teal lighten-5">
    <!-- icon="check_circle" -->
    <v-alert
      :value="true"
      color="teal darken-1"
      type="info"
      class="mx-3"
    >Here you can find the list of all the users of the system, both agnets and admins, with there status of activeness</v-alert>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        color="teal darken-2"
        single-line
        hide-details
        clearable
      ></v-text-field>
    </v-card-title>
    <v-data-table
      class="elevation-3"
      :headers="headers"
      :items="agents"
      :search="search"
      :loading="loading"
      item-key="index"
    >
      <v-progress-linear slot="progress" color="teal darken-2" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>
          <v-badge right color="transparent">
            <template v-slot:badge>
              <span v-if="props.item.is_admin == true">
                <v-icon x-small color="teal darken-3">fas fa-crown</v-icon>
              </span>
              <span v-else>
                <v-icon x-small color="teal">fas fa-hard-hat</v-icon>
              </span>
            </template>
            {{ props.item.index }}
          </v-badge>
        </td>
        <!-- <td>{{props.item.is_admin}}</td> -->
        <td class="text-lg-center" v-if="props.item.is_active">
          <v-tooltip bottom>
            <template #activator="data">
              <v-chip small text-color="teal darken-2" v-on="data.on">
                <v-icon small>fas fa-eye</v-icon>
              </v-chip>
            </template>
            <span>Agent is active</span>
          </v-tooltip>
        </td>
        <td class="text-lg-center" v-else>
          <v-tooltip bottom>
            <template #activator="data">
              <v-chip small text-color="grey darken-2" v-on="data.on">
                <v-icon small>fas fa-eye-slash</v-icon>
              </v-chip>
            </template>
            <span>Agent is not active</span>
          </v-tooltip>
        </td>
        <td>{{ props.item.first_name }}</td>
        <td>{{ props.item.last_name.toUpperCase() }}</td>
        <td>{{ props.item.email }}</td>
        <td>
          <v-tooltip bottom>
            <template #activator="data">
              <v-btn icon @click="resetPassword(props.item.id)" v-on="data.on">
                <v-icon small color="teal darken-2">fas fa-power-off</v-icon>
              </v-btn>
            </template>
            <span>Reset The Password Of This User Account</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="data">
              <v-btn icon @click="showConfirmDeleteDialog(props.item.id)" v-on="data.on">
                <v-icon small color="red darken-2">fas fa-user-minus</v-icon>
              </v-btn>
            </template>
            <span>Delete This User Account</span>
          </v-tooltip>
        </td>
      </template>
      <v-alert
        slot="no-results"
        :value="true"
        color="error"
        icon="warning"
      >Your search for "{{ search }}" found no results.</v-alert>
    </v-data-table>
    <!-- Agent delete confirmation dialog -->
    <v-dialog v-model="confirmeDeleteDialog" persistent width="500">
      <v-card color="teal lighten-5" dark>
        <v-card-title class="teal--text text--darken-2 headline">
          <v-icon color="teal darken-2" large left>fas fa-exclamation-circle</v-icon>Confirm Deletion
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text
          class="font-weight-bold teal lighten-5 teal--text text--darken-2"
        >Confirm the deletion of this agent?</v-card-text>
        <v-card-actions>
          <v-btn flat @click="cancelConfirmDeleteDialog()" class="teal--text lighten-1">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="deleteAgent()" color="red lighten-1" class="white--text">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- New password after reset -->
    <v-dialog v-model="dialog" persistent width="400">
      <v-card color="teal lighten-5" dark>
        <v-card-title class="teal--text text--darken-2 headline">Agent Password Reset</v-card-title>
        <!-- <v-divider></v-divider> -->
        <v-progress-linear
          indeterminate
          color="teal darken-2"
          class="pa-0 mb-0"
          :active="loadingPass"
        ></v-progress-linear>
        <v-card-text class="font-weight-bold black--text">{{dialogContent}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialog = false" class="teal--text">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import AgentServices from "@/services/agent.js";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      search: "",
      dialog: false,
      dialogContent: "Please stand by",
      loadingPass: true,
      loading: true,
      confirmeDeleteDialog: false,
      headers: [
        { text: "#", value: "index" },
        // { text: "Priviliges", value: "is_admin" },
        { text: "Activeness", value: "is_active" },
        {
          text: "First Name",
          value: "first_name"
        },
        { text: "Last Name", value: "last_name" },
        { text: "Email", value: "email" },
        { text: "Operations", value: "delete" }
      ],
      agents: [],
      selectedAgentId: -1,
      snackbarContent: "",
      snackbarColor: "",
      snackbar: false
    };
  },
  async created() {
    this.refrechAgentsList();
  },
  computed: {
    // ...mapState(["sbColor", "sbContent", "sbVisibility"])
  },
  methods: {
    ...mapMutations([
      "SHOW_SNACKBAR",
      "TOGGLE_SB_VISIBILITY"
    ]),
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
    showConfirmDeleteDialog(id) {
      this.confirmeDeleteDialog = true;
      this.selectedAgentId = id;
    },
    cancelConfirmDeleteDialog() {
      this.confirmeDeleteDialog = false;
      this.selectedAgentId = -1;
    },
    deleteAgent() {
      if (this.selectedAgentId == -1) {
        this.showErrorSnackbar("Invalide agent id!");
      } else {
        AgentServices.deleteAgentById(this.selectedAgentId)
          .then(result => {
            // console.log(this.selectedAgentId);
            for (let i = 0; i < this.agents.length; i++) {
              if (this.agents[i].id == this.selectedAgentId) {
                this.agents.splice(i, 1);
              }
            }
            this.cancelConfirmDeleteDialog(); //! just to hide it
            this.showSuccessSnackbar(result);
          })
          .catch(error => {
            this.showErrorSnackbar(error);
            this.loading = false;
          });
      }
    },
    resetPassword(id) {
      this.dialog = true;
      AgentServices.resetAgentPassword(id)
        .then(result => {
          this.loadingPass = false;
          this.snackbar = true;
          this.snackbarColor = "success";
          this.snackbarContent = result.data.success;
          this.dialogContent = "The New Password is: " + result.data.password;
        })
        .catch(error => {
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarContent = error;
        });
    },
    showSuccessSnackbar(content) {
      this.TOGGLE_SB_VISIBILITY(true);
      this.SHOW_SNACKBAR({color: "success", content});
      setTimeout(() => {
        this.TOGGLE_SB_VISIBILITY(false);
      }, 5000);
    },
    showErrorSnackbar(content) {
      this.TOGGLE_SB_VISIBILITY(true);
      this.SHOW_SNACKBAR({color: "error", content});
      setTimeout(() => {
        this.TOGGLE_SB_VISIBILITY(false);
      }, 5000);
    },
  }
};
</script>
<style>
</style>
