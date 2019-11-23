<template>
  <v-navigation-drawer v-if="loggedIn" v-model="drawer" app right>
    <v-list dense>
      <MenuItem
        v-for="(route, index) in routes"
        :key="index"
        :route="route"
      ></MenuItem>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";

import MenuItem from "@/components/MenuItem.vue";

import UsersModule from "@/store/modules/Users";

@Component({
  components: { MenuItem }
})
export default class NavMenu extends Vue {
  name = "NavMenu";

  @Prop()
  value: boolean = true;

  drawer: boolean = this.value;

  @Watch("value")
  onValueChanged(value: boolean, oldValue: boolean) {
    this.drawer = value;
  }

  @Watch("drawer")
  onDrawerChanged(drawer: boolean, oldDrawer: boolean) {
    this.$emit("input", drawer);
  }

  get loggedIn() {
    return UsersModule.loggedIn;
  }

  get isAdmin() {
    return UsersModule.currentUser.isAdmin;
  }

  get routes() {
    const routes = (this.$router as any).options.routes;
    if (this.isAdmin) {
      let usersRoute = routes.find((route: any) => route.name == "users");
      if (usersRoute) {
        usersRoute.meta.visible = true;
      }
    }
    return routes;
  }
}
</script>
