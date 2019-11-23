<template>
  <v-app>
    <NavMenu v-model="drawer"></NavMenu>

    <v-app-bar app color="cyan" dark>
      <v-app-bar-nav-icon v-if="loggedIn" @click.stop="drawer = !drawer" />
      <v-toolbar-title>شرطة النقل والمواصلات</v-toolbar-title>
      <v-spacer />
      <v-btn @click="onLogOutClick" v-if="loggedIn" color="secondary"
        >تسجيل خروج</v-btn
      >
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer color="primary" app dark>
      جميع الحقوق محفوظة {{ new Date().getFullYear() }} &copy;
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import NavMenu from "@/components/NavMenu.vue";

import UsersModule from "@/store/modules/Users";

@Component({
  components: { NavMenu }
})
export default class App extends Vue {
  drawer = true;
  get loggedIn() {
    return UsersModule.loggedIn;
  }

  async onLogOutClick() {
    await UsersModule.logout();
    this.$router.replace({ name: "login" });
  }
}
</script>

<style>
#nprogress .bar {
  background: var(--v-primary-base) !important;
}
</style>
