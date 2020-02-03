<template>
  <v-app>
    <NavMenu v-model="drawer"></NavMenu>

    <v-app-bar app color="cyan" dark class="d-print-none">
      <v-app-bar-nav-icon v-if="loggedIn" @click.stop="drawer = !drawer" />
      <router-link to="/">
        <v-img
          class="mx-2"
          :src="require('@/assets/logo.png')"
          max-height="40"
          max-width="40"
          contain
        ></v-img>
      </router-link>
      <router-link to="/" tag="span" style="cursor: pointer;">
        <v-toolbar-title>شرطة النقل والمواصلات</v-toolbar-title>
      </router-link>
      <v-spacer />
      <div v-if="loggedIn">
        <span class="ma-3">{{ fullName }}</span>
        <v-btn @click="onLogOutClick" small color="secondary">تسجيل خروج</v-btn>
      </div>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer color="primary" app dark class="d-print-none">
      <span class="font-weight-bold">
        {{ new Date().getFullYear() | convertToArabic }} &copy; جميع الحقوق
        محفوظة
      </span>
      . الإدارة العامة لشرطة النقل والمواصلات - إدارة تكنولوجيا المعلومات
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

  get fullName() {
    return UsersModule.currentUser.fullName;
  }

  private async logout() {
    if (this.$router.currentRoute.name !== "login") {
      await UsersModule.logout();
      this.$router.replace({ name: "login" });
    }
  }

  async onLogOutClick() {
    await this.logout();
  }

  created() {
    this.$store.watch(
      () => this.$store.state.idleVue.isIdle,
      async isIdle => {
        if (isIdle) {
          await this.logout();
        }
      }
    );
  }
}
</script>

<style lang="scss">
#nprogress .bar {
  background: var(--v-primary-base) !important;
}
</style>
