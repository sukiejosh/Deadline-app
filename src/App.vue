<template>
  <div id="app">
    <v-app>
      <!-- <site-header></site-header> -->
      <v-content>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
//import Header from "./components/Header";
export default {
  name: "App",
  components: {
  //  "site-header": Header
  },
  data: () => ({
    //
  })
};
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
