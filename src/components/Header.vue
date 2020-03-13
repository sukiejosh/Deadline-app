<template lang="html">
  <v-toolbar app fixed dark class="navbar teal darken-2">
    <v-toolbar-title>
      <div v-if="!loggedIn">
        <router-link class="navbar__title" :to="{ name: 'HelloWorld' }">MEVN</router-link>
      </div>
      <div v-else>
        <router-link class="navbar__title" :to="{ name: 'Dashboard'}">MEVN</router-link>
      </div>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn class="navbar__list-item" v-if="!loggedIn" flat :to="{ name: 'Register' }">Sign Up</v-btn>
      <v-btn class="navbar__list-item" v-if="!loggedIn" flat :to="{ name: 'Login' }">Log In</v-btn>
      <v-btn class="navbar__list-item" title="Settings" v-if="user" flat :to="{ name: 'Settings' }">{{ user.username }}</v-btn>
      <v-btn class="navbar__list-item" v-if="loggedIn" flat @click="logout">Log Out</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Header',
  computed: {
    ...mapState([
      'loggedIn',
      'user'
    ])
  },
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({ name: 'HelloWorld' })
    }
  }
}
</script>

<style lang="css">
.navbar .navbar__title {
  text-decoration: none;
  color: white;
}
</style>
