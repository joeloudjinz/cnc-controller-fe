<template>
  <!-- Edit Profile Data Dialog -->
  <v-dialog v-model="editProfileDialog" persistent max-width="600px">
    <v-card color="teal lighten-5">
      <v-card-title class="teal--text text--darken-2 headline">
        <v-icon x-large color="teal darken-2" left>fas fa-user-edit</v-icon>Edit Profile Data
      </v-card-title>
      <v-card-text>
        <InfoFormVue ref="infoFormRef"/>
        <v-divider></v-divider>
        <PassFormVue ref="passFormRef"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="teal" class="white--text" @click="closeEditInfoDialog()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const InfoFormVue = () => import("../agents/InfoForm.vue");
const PassFormVue = () => import("../agents/PassForm.vue");
export default {
  components: {
    InfoFormVue,
    PassFormVue
  },
  data: () => ({
    editProfileDialog: false
  }),
  methods: {
    showModal() {
      this.editProfileDialog = true;
    },
    closeEditInfoDialog() {
      this.editProfileDialog = false;
      this.$refs.passFormRef.$v.$reset();
      this.$refs.infoFormRef.$v.$reset();
    }
  }
};
</script>

<style>
</style>
