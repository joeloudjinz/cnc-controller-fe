<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app',
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
