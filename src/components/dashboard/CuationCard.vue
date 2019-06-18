<template>
  <v-card color="teal lighten-5">
    <v-layout wrap>
      <v-flex xs12 sm12 md5 lg5>
        <v-img :src="tools"></v-img>
      </v-flex>
      <v-flex xs12 sm12 md7 lg7>
        <v-card-title primary-title>
          <div>
            <div class="headline">Caution Is Needed</div>
            <span class="grey--text">Safety is as simple as ABC - Always Be Careful.</span>
          </div>
        </v-card-title>
        <v-card-text>
          <p>It is extremely important that everyone remembers the proper safety rules while operating the machines. This will be a rundown of the basic safety rules that should be followed while working with or around a CNC machine.</p>
          <ul>
            <li>Always ensure that you wear proper ear protection and a good pair of safety glasses when operating a CNC machine.</li>
            <li>Ensure that your safety glasses are firmly in place every time you are closely observing the cutting tools.</li>
            <li>Ensure that you wear suitable footwear such as safety boots at all times.</li>
            <li>If you have long hair, ensure that you keep it covered when you operate the CNC machine.</li>
            <li>Keep your hands away from any moving parts during machining processes.</li>
            <li>Stand clear of the machine whenever it is operational. You should also warn any other people near the risk of being too close to it.</li>
            <li>Whenever you are handling or passing tools, avoid touching the cutting edges.</li>
            <li>Ensure that you turn the machine off completely and clean it whenever you have finished using it.</li>
          </ul>
        </v-card-text>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    tools: require("@/assets/tools.svg")
  })
};
</script>

<style>
</style>
