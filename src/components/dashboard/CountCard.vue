<template>
  <v-card class="teal lighten-5 mx-1">
    <v-card-text class="pt-2 pb-0">
      <v-layout align-center justify-center row fill-height py-2>
        <v-badge color="transparent">
          <template v-slot:badge>
            <v-icon large :color="count != 0 ? 'teal darken-5' : 'red lighten-2'">{{iconName}}</v-icon>
          </template>
          <h1 class="j-count-style teal--text">{{count}}</h1>
        </v-badge>
      </v-layout>
    </v-card-text>
    <v-card-actions class="pt-0 pb-1">
      <v-spacer></v-spacer>
      <!-- Administrators -->
      <h1 class="font-weight-meduim green--text text--lighten-2">{{countType}}</h1>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["count", "countType", "iconName"]
};
</script>