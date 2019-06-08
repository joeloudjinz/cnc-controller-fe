<template>
  <div id="app">
    <router-view/>
    <!-- <SnackBar/> -->
  </div>
</template>
<script>
// import { setTimeout } from "timers";
// import { mapState } from "vuex";
// const SnackBar = () => import("./components/app/SnackBar.vue");
// import SnackBar from '@/components/app/SnackBar.vue'
export default {
  name: 'app',
  // components: {
  //   SnackBar
  // },
  // created() {
    
  // },
  methods: {
    // showErrorSnackbar(content) {
    //   this.TOGGLE_SB_VISIBILITY(true);
    //   this.SHOW_SNACKBAR({ color: "error", content });
    //   setTimeout(() => {
    //     this.TOGGLE_SB_VISIBILITY(false);
    //   }, 5000);
    // }
  }
};
</script>

<style>
body::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
body::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
body::-webkit-scrollbar-thumb {
  background-color: rgb(0, 128, 128, 0.9);
  outline: 1px solid slategrey;
}
</style>
