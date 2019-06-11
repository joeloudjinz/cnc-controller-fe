<template>
  <v-snackbar
    v-model="visibility"
    bottom
    :color="sbColor"
    :multi-line="'multi-line'"
    class="mb-2"
  >{{ sbContent }}</v-snackbar>
</template>

<script>
export default {
  props: { color: String, content: String, visibility: Boolean },
  computed: {
    sbColor() {
      return this.color;
    },
    sbContent() {
      return this.content;
    }
  }
};
</script>

<style>
</style>
