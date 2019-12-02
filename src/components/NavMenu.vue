<template>
  <v-navigation-drawer
    v-if="loggedIn"
    v-model="drawer"
    app
    right
    class="d-print-none"
  >
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

import AbilitiesModule from "@/store/modules/Abilities";
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

  get routes() {
    const routes = (this.$router as any).options.routes;
    routes.forEach((route: any) => {
      if (route.path == "/users" && AbilitiesModule.ability.can("read", "User"))
        route.meta.visible = true;
      if (route.path == "/lines" && AbilitiesModule.ability.can("read", "Line"))
        route.meta.visible = true;
      if (
        route.path == "/stations" &&
        AbilitiesModule.ability.can("read", "Station")
      )
        route.meta.visible = true;
      if (
        route.path == "/trains" &&
        AbilitiesModule.ability.can("read", "Train")
      )
        route.meta.visible = true;
      if (
        route.path == "/runs" &&
        AbilitiesModule.ability.can("read", "TrainRun")
      )
        route.meta.visible = true;
    });

    return routes;
  }
}
</script>
